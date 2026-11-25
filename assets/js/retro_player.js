/**
 * RetroPlayer - Emulatore multi-console con lista ROM filtrabile, caricamento locale
 * e supporto ottimizzato per mobile/touch tramite EmulatorJS.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const consoleSelect = document.getElementById('console-select');
    const romFilterInput = document.getElementById('rom-filter-input');
    const romListSelect = document.getElementById('rom-list-select');
    const romInput = document.getElementById('rom-file-input');
    const launchBtn = document.getElementById('btn-launch-rom');
    const fullscreenBtn = document.getElementById('btn-fullscreen-emu');
    const clearBtn = document.getElementById('btn-clear-emu');
    const viewport = document.getElementById('emulator-viewport');
    const placeholder = document.getElementById('emulator-placeholder');
    const romInfoStatus = document.getElementById('rom-info-status');
    const romHashStatus = document.getElementById('rom-hash-status');

    if (!consoleSelect || !romListSelect || !romInput || !launchBtn || !clearBtn) return;

    const CDN_BASE = 'https://cdn.emulatorjs.org/stable/data/';
    const CATALOG_URL = './assets/roms/roms_catalog.json';

    const CONSOLE_CORES = {
        nes: { label: 'NES', ejsCore: 'fceumm' },
        snes: { label: 'SNES', ejsCore: 'snes9x' },
        gb: { label: 'GB / GBC', ejsCore: 'gambatte' },
        gba: { label: 'GBA', ejsCore: 'mgba' },
        segaMD: { label: 'Mega Drive', ejsCore: 'genesis_plus_gx' },
        segaMS: { label: 'Master System', ejsCore: 'smsplus' },
        segaGG: { label: 'Game Gear', ejsCore: 'genesis_plus_gx' },
        n64: { label: 'Nintendo 64', ejsCore: 'mupen64plus_next' },
        psx: { label: 'PlayStation', ejsCore: 'pcsx_rearmed' },
        arcade: { label: 'Arcade / MAME', ejsCore: 'fbneo' },
        atari2600: { label: 'Atari 2600', ejsCore: 'stella2014' }
    };

    let catalogItems = [];
    let selectedLocalFile = null;
    let selectedLocalBytes = null;
    let selectedCatalogItem = null;
    let activeSourceType = null;
    let currentBlobUrl = null;
    let emulatorAlreadyStarted = false;

    const params = new URLSearchParams(window.location.search);
    const initialConsole = params.get('console') || params.get('core');
    if (initialConsole && CONSOLE_CORES[initialConsole]) {
        consoleSelect.value = initialConsole;
    }

    function escapeHtml(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');
    }

    function detectConsoleByExtension(filename) {
        const lower = filename.toLowerCase();
        if (lower.endsWith('.nes')) return 'nes';
        if (lower.endsWith('.sfc') || lower.endsWith('.smc')) return 'snes';
        if (lower.endsWith('.gb') || lower.endsWith('.gbc')) return 'gb';
        if (lower.endsWith('.gba')) return 'gba';
        if (lower.endsWith('.md') || lower.endsWith('.gen')) return 'segaMD';
        if (lower.endsWith('.sms')) return 'segaMS';
        if (lower.endsWith('.gg')) return 'segaGG';
        if (lower.endsWith('.z64') || lower.endsWith('.n64') || lower.endsWith('.v64')) return 'n64';
        if (lower.endsWith('.chd') || lower.endsWith('.cue') || lower.endsWith('.pbp') || lower.endsWith('.iso')) return 'psx';
        if (lower.endsWith('.a26')) return 'atari2600';
        return null;
    }

    async function computeBufferSHA256(arrayBuffer) {
        if (window.crypto && window.crypto.subtle && window.isSecureContext) {
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }
        return 'non-disponibile-senza-https-o-localhost';
    }

    function renderCatalogOptions() {
        const currentConsole = consoleSelect.value;
        const query = (romFilterInput ? romFilterInput.value : '').trim().toLowerCase();

        const matchingConsole = catalogItems.filter(item =>
            item.console === currentConsole &&
            (!query || item.title.toLowerCase().includes(query))
        );

        const otherConsoles = query
            ? catalogItems.filter(item =>
                item.console !== currentConsole &&
                item.title.toLowerCase().includes(query)
            )
            : [];

        const listToShow = [...matchingConsole, ...otherConsoles];

        romListSelect.innerHTML = '';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = listToShow.length > 0
            ? `— Seleziona ROM (${listToShow.length} disponibili) —`
            : '— Nessuna ROM in lista per questa console —';
        romListSelect.appendChild(defaultOpt);

        for (const item of listToShow) {
            const opt = document.createElement('option');
            opt.value = item.id;
            const cLabel = CONSOLE_CORES[item.console]?.label || item.console.toUpperCase();
            opt.textContent = `[${cLabel}] ${item.title}`;
            romListSelect.appendChild(opt);
        }
    }

    async function loadRomCatalog() {
        try {
            const res = await fetch(`${CATALOG_URL}?t=${Date.now()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            catalogItems = Array.isArray(json.items) ? json.items : [];
            renderCatalogOptions();
        } catch (err) {
            console.warn('[RetroPlayer] Lista ROM non caricata:', err);
            romListSelect.innerHTML = '<option value="">— Lista non trovata (usa file locale) —</option>';
        }
    }

    consoleSelect.addEventListener('change', () => {
        renderCatalogOptions();
    });

    if (romFilterInput) {
        romFilterInput.addEventListener('input', () => {
            renderCatalogOptions();
        });
    }

    romListSelect.addEventListener('change', async () => {
        const id = romListSelect.value;
        if (!id) {
            selectedCatalogItem = null;
            if (activeSourceType === 'catalog') activeSourceType = null;
            return;
        }

        const item = catalogItems.find(x => x.id === id);
        if (!item) return;

        selectedCatalogItem = item;
        selectedLocalFile = null;
        selectedLocalBytes = null;
        romInput.value = '';
        activeSourceType = 'catalog';

        if (CONSOLE_CORES[item.console]) {
            consoleSelect.value = item.console;
            renderCatalogOptions();
            romListSelect.value = item.id;
        }

        romInfoStatus.innerHTML = `<span class="status-ok">✔ Lista:</span> <strong>${escapeHtml(item.title)}</strong>`;
        romHashStatus.innerHTML = 'SHA-256: <code>verifica...</code>';

        try {
            const resp = await fetch(item.file);
            if (!resp.ok) throw new Error('File non trovato');
            const buf = await resp.arrayBuffer();
            const hash = await computeBufferSHA256(buf);
            romHashStatus.innerHTML = `SHA-256: <code title="${hash}">${hash.slice(0, 16)}...</code>`;
        } catch (_) {
            romHashStatus.innerHTML = 'SHA-256: <code>file non presente sul server</code>';
        }
    });

    romInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        selectedLocalFile = file;
        selectedCatalogItem = null;
        romListSelect.value = '';
        activeSourceType = 'local';

        const detected = detectConsoleByExtension(file.name);
        if (detected && CONSOLE_CORES[detected]) {
            consoleSelect.value = detected;
            renderCatalogOptions();
        }

        const sizeMB = file.size / (1024 * 1024);
        const sizeText = sizeMB >= 1 ? `${sizeMB.toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`;
        romInfoStatus.innerHTML = `<span class="status-ok">✔ File locale:</span> <strong>${escapeHtml(file.name)}</strong> (${sizeText})`;
        romHashStatus.innerHTML = 'SHA-256: <code>calcolo...</code>';

        try {
            const rawBuf = await file.arrayBuffer();
            selectedLocalBytes = rawBuf.slice(0);
            const hash = await computeBufferSHA256(selectedLocalBytes);
            romHashStatus.innerHTML = `SHA-256: <code title="${hash}">${hash.slice(0, 16)}...</code>`;
        } catch (_) {
            selectedLocalBytes = null;
            romHashStatus.innerHTML = 'SHA-256: <code>errore lettura</code>';
        }
    });

    function revokeBlob() {
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = null;
        }
    }

    function launchEmulator() {
        if (emulatorAlreadyStarted) {
            window.location.reload();
            return;
        }

        const chosenConsole = consoleSelect.value;
        const coreSpec = CONSOLE_CORES[chosenConsole] || CONSOLE_CORES.nes;

        let romUrl = '';
        let gameLabel = '';

        if (activeSourceType === 'local' && selectedLocalFile) {
            const dataSource = selectedLocalBytes || selectedLocalFile;
            const blob = new Blob([dataSource], { type: 'application/octet-stream' });
            currentBlobUrl = URL.createObjectURL(blob);
            romUrl = currentBlobUrl;
            gameLabel = selectedLocalFile.name.replace(/\.[^/.]+$/, '');
        } else if (activeSourceType === 'catalog' && selectedCatalogItem) {
            romUrl = selectedCatalogItem.file;
            gameLabel = selectedCatalogItem.title;
        } else {
            romInfoStatus.innerHTML = '<span class="status-warn">⚠ Scegli una ROM dalla lista oppure carica un file ROM dal tuo dispositivo.</span>';
            return;
        }

        emulatorAlreadyStarted = true;

        const gameDiv = document.getElementById('game');
        if (placeholder) placeholder.style.display = 'none';
        if (gameDiv) gameDiv.style.display = 'block';

        window.EJS_player = '#game';
        window.EJS_core = coreSpec.ejsCore;
        window.EJS_gameName = gameLabel;
        window.EJS_gameUrl = romUrl;
        window.EJS_pathtodata = CDN_BASE;
        window.EJS_startOnLoaded = true;
        window.EJS_threads = false;
        window.EJS_virtualGamepadSettings = { enabled: true };

        const loader = document.createElement('script');
        loader.id = 'emulatorjs-loader';
        loader.src = `${CDN_BASE}loader.js`;
        loader.async = true;

        loader.onload = () => {
            romInfoStatus.innerHTML = `<span class="status-ok">▶ In esecuzione:</span> <strong>${escapeHtml(gameLabel)}</strong> (${coreSpec.label})`;
        };

        loader.onerror = () => {
            emulatorAlreadyStarted = false;
            revokeBlob();
            if (gameDiv) gameDiv.style.display = 'none';
            if (placeholder) placeholder.style.display = 'block';
            romInfoStatus.innerHTML = '<span class="status-warn">✖ Errore nel caricamento di EmulatorJS dal CDN.</span>';
        };

        document.body.appendChild(loader);
    }

    if (fullscreenBtn && viewport) {
        fullscreenBtn.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            } else if (viewport.requestFullscreen) {
                viewport.requestFullscreen().catch(() => {});
            }
        });
    }

    launchBtn.addEventListener('click', launchEmulator);

    clearBtn.addEventListener('click', () => {
        if (emulatorAlreadyStarted) {
            window.location.reload();
            return;
        }
        selectedLocalFile = null;
        selectedLocalBytes = null;
        selectedCatalogItem = null;
        activeSourceType = null;
        romInput.value = '';
        romListSelect.value = '';
        if (romFilterInput) romFilterInput.value = '';
        renderCatalogOptions();
        revokeBlob();
        romInfoStatus.textContent = 'Seleziona una ROM dalla lista oppure carica un file ROM dal tuo dispositivo.';
        romHashStatus.innerHTML = 'SHA-256: <code>---</code>';
    });

    window.addEventListener('beforeunload', revokeBlob);

    await loadRomCatalog();
});