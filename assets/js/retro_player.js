/**
 * RetroPlayer - Gestione lista ROM statica (./assets/roms/roms_catalog.json)
 * + caricamento file ROM locale dell'utente per più console tramite EmulatorJS.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const consoleSelect = document.getElementById('console-select');
    const romListSelect = document.getElementById('rom-list-select');
    const romInput = document.getElementById('rom-file-input');
    const launchBtn = document.getElementById('btn-launch-rom');
    const clearBtn = document.getElementById('btn-clear-emu');
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
        segaMD: { label: 'Mega Drive / Genesis', ejsCore: 'genesis_plus_gx' },
        n64: { label: 'Nintendo 64', ejsCore: 'mupen64plus_next' },
        psx: { label: 'PlayStation', ejsCore: 'pcsx_rearmed' }
    };

    let catalogItems = [];
    let selectedLocalFile = null;
    let selectedLocalBytes = null;
    let selectedCatalogItem = null;
    let activeSourceType = null; // 'catalog' | 'local'
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
        if (lower.endsWith('.z64') || lower.endsWith('.n64') || lower.endsWith('.v64')) return 'n64';
        if (lower.endsWith('.chd') || lower.endsWith('.cue') || lower.endsWith('.iso') || lower.endsWith('.pbp')) return 'psx';
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

    function populateCatalogDropdown() {
        romListSelect.innerHTML = '<option value="">— Seleziona una ROM dalla lista —</option>';
        for (const item of catalogItems) {
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
            populateCatalogDropdown();
        } catch (err) {
            console.warn('[RetroPlayer] Lista ROM non caricata:', err);
            romListSelect.innerHTML = '<option value="">— Nessuna lista attiva (usa file locale) —</option>';
        }
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
        }

        romInfoStatus.innerHTML = `<span class="status-ok">✔ Lista:</span> <strong>${escapeHtml(item.title)}</strong> (${escapeHtml(item.file)})`;
        romHashStatus.innerHTML = 'SHA-256: <code>verifica file...</code>';

        try {
            const resp = await fetch(item.file);
            if (!resp.ok) throw new Error('File non trovato');
            const buf = await resp.arrayBuffer();
            const hash = await computeBufferSHA256(buf);
            romHashStatus.innerHTML = `SHA-256: <code title="${hash}">${hash.slice(0, 16)}...</code>`;
        } catch (_) {
            romHashStatus.innerHTML = 'SHA-256: <code>file in ./assets/roms/ da aggiungere</code>';
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
        }

        const sizeKB = (file.size / 1024).toFixed(1);
        romInfoStatus.innerHTML = `<span class="status-ok">✔ File locale:</span> <strong>${escapeHtml(file.name)}</strong> (${sizeKB} KB)`;
        romHashStatus.innerHTML = 'SHA-256: <code>lettura in memoria...</code>';

        try {
            // Copia i byte completi in un ArrayBuffer dedicato in memoria
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
        // EmulatorJS dichiara variabili globali nello scope della finestra:
        // se era già stato avviato in questa pagina, ricarichiamo la pagina pulita.
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
            romInfoStatus.innerHTML = '<span class="status-warn">⚠ Scegli una ROM dalla lista oppure seleziona un file ROM dal tuo dispositivo.</span>';
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
            romInfoStatus.innerHTML = '<span class="status-warn">✖ Errore nel caricamento di EmulatorJS dal CDN (verifica connessione o eventuali estensioni bloccanti).</span>';
        };

        document.body.appendChild(loader);
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
        revokeBlob();
        romInfoStatus.textContent = 'Seleziona un gioco dalla lista oppure carica un file ROM dal tuo dispositivo.';
        romHashStatus.innerHTML = 'SHA-256: <code>---</code>';
    });

    window.addEventListener('beforeunload', revokeBlob);

    await loadRomCatalog();
});