/**
 * RetroPlayer - Lista ROM + File Locale (senza PS1) con comandi semplificati
 */
document.addEventListener('DOMContentLoaded', async () => {
    const consoleSelect = document.getElementById('console-select');
    const romFilterInput = document.getElementById('rom-filter-input');
    const romListSelect = document.getElementById('rom-list-select');
    const romInput = document.getElementById('rom-file-input');
    const launchBtn = document.getElementById('btn-launch-rom');
    const fsBtn = document.getElementById('btn-fullscreen-emu');
    const clearBtn = document.getElementById('btn-clear-emu');
    const viewport = document.getElementById('emulator-viewport');
    const placeholder = document.getElementById('emulator-placeholder');
    const infoEl = document.getElementById('rom-info-status');
    const hashEl = document.getElementById('rom-hash-status');

    if (!consoleSelect || !romListSelect || !romInput || !launchBtn || !clearBtn) return;

    const CDN_BASE = 'https://cdn.emulatorjs.org/stable/data/';
    const CATALOG_URL = './assets/roms/roms_catalog.json';

    const CORES = {
        gb: { label: 'GB/GBC', core: 'gambatte' },
        gba: { label: 'GBA', core: 'mgba' },
        nes: { label: 'NES', core: 'fceumm' },
        snes: { label: 'SNES', core: 'snes9x' },
        n64: { label: 'N64', core: 'mupen64plus_next' },
        segaMD: { label: 'Mega Drive', core: 'genesis_plus_gx' }
    };

    let items = [];
    let localFile = null;
    let localBytes = null;
    let catalogPick = null;
    let source = null;
    let blobUrl = null;
    let started = false;

    function esc(s) {
        return String(s)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');
    }

    function detectConsole(name) {
        const l = name.toLowerCase();
        if (l.endsWith('.gb') || l.endsWith('.gbc')) return 'gb';
        if (l.endsWith('.gba')) return 'gba';
        if (l.endsWith('.nes')) return 'nes';
        if (l.endsWith('.sfc') || l.endsWith('.smc')) return 'snes';
        if (l.endsWith('.z64') || l.endsWith('.n64') || l.endsWith('.v64')) return 'n64';
        if (l.endsWith('.md') || l.endsWith('.gen')) return 'segaMD';
        return null;
    }

    async function sha256(buf) {
        if (window.crypto?.subtle && window.isSecureContext) {
            const h = await window.crypto.subtle.digest('SHA-256', buf);
            return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        return 'non-disponibile';
    }

    function fillList() {
        const c = consoleSelect.value;
        const q = (romFilterInput?.value || '').trim().toLowerCase();
        const filtered = items.filter(x => x.console === c && (!q || x.title.toLowerCase().includes(q)));

        romListSelect.innerHTML = '';
        const opt0 = document.createElement('option');
        opt0.value = '';
        opt0.textContent = filtered.length ? `— Seleziona ROM (${filtered.length}) —` : '— Nessuna ROM in lista —';
        romListSelect.appendChild(opt0);

        filtered.forEach(x => {
            const o = document.createElement('option');
            o.value = x.id;
            o.textContent = `[${CORES[x.console]?.label || x.console.toUpperCase()}] ${x.title}`;
            romListSelect.appendChild(o);
        });
    }

    try {
        const r = await fetch(`${CATALOG_URL}?t=${Date.now()}`);
        if (r.ok) {
            const j = await r.json();
            items = Array.isArray(j.items) ? j.items.filter(x => x.console !== 'psx') : [];
        }
    } catch (_) {}
    fillList();

    consoleSelect.addEventListener('change', fillList);
    romFilterInput?.addEventListener('input', fillList);

    romListSelect.addEventListener('change', async () => {
        const pick = items.find(x => x.id === romListSelect.value);
        if (!pick) {
            catalogPick = null;
            if (source === 'catalog') source = null;
            return;
        }
        catalogPick = pick;
        localFile = null;
        localBytes = null;
        romInput.value = '';
        source = 'catalog';
        infoEl.innerHTML = `<span class="ok">✔ Lista:</span> <strong>${esc(pick.title)}</strong>`;
        hashEl.innerHTML = 'SHA-256: <code>verifica...</code>';
        try {
            const resp = await fetch(pick.file);
            if (!resp.ok) throw new Error();
            const h = await sha256(await resp.arrayBuffer());
            hashEl.innerHTML = `SHA-256: <code title="${h}">${h.slice(0, 14)}...</code>`;
        } catch (_) {
            hashEl.innerHTML = 'SHA-256: <code>file mancante</code>';
        }
    });

    romInput.addEventListener('change', async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        localFile = f;
        catalogPick = null;
        romListSelect.value = '';
        source = 'local';
        const det = detectConsole(f.name);
        if (det && CORES[det]) {
            consoleSelect.value = det;
            fillList();
        }
        infoEl.innerHTML = `<span class="ok">✔ File locale:</span> <strong>${esc(f.name)}</strong>`;
        hashEl.innerHTML = 'SHA-256: <code>calcolo...</code>';
        try {
            localBytes = (await f.arrayBuffer()).slice(0);
            const h = await sha256(localBytes);
            hashEl.innerHTML = `SHA-256: <code title="${h}">${h.slice(0, 14)}...</code>`;
        } catch (_) {
            hashEl.innerHTML = 'SHA-256: <code>errore</code>';
        }
    });

    function launch() {
        if (started) {
            window.location.reload();
            return;
        }
        const spec = CORES[consoleSelect.value] || CORES.gb;
        let url = '';
        let label = '';

        if (source === 'local' && localFile) {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            blobUrl = URL.createObjectURL(new Blob([localBytes || localFile], { type: 'application/octet-stream' }));
            url = blobUrl;
            label = localFile.name.replace(/\.[^/.]+$/, '');
        } else if (source === 'catalog' && catalogPick) {
            url = catalogPick.file;
            label = catalogPick.title;
        } else {
            infoEl.innerHTML = '<span class="warn">⚠ Seleziona una ROM dalla lista o carica un file.</span>';
            return;
        }

        started = true;
        const gameDiv = document.getElementById('game');
        if (placeholder) placeholder.style.display = 'none';
        if (gameDiv) {
            gameDiv.innerHTML = '';
            gameDiv.style.display = 'block';
        }

        window.EJS_player = '#game';
        window.EJS_core = spec.core;
        window.EJS_gameName = label;
        window.EJS_gameUrl = url;
        window.EJS_pathtodata = CDN_BASE;
        window.EJS_startOnLoaded = true;
        window.EJS_threads = false;
        window.EJS_language = 'en-US';
        window.EJS_virtualGamepadSettings = true;

        const sc = document.createElement('script');
        sc.src = `${CDN_BASE}loader.js`;
        sc.async = true;
        sc.onload = () => {
            infoEl.innerHTML = `<span class="ok">▶ In esecuzione:</span> <strong>${esc(label)}</strong> (${spec.label})`;
        };
        sc.onerror = () => {
            started = false;
            infoEl.innerHTML = '<span class="warn">✖ Errore caricamento emulatore dal CDN.</span>';
        };
        document.body.appendChild(sc);
    }

    launchBtn.addEventListener('click', launch);
    clearBtn.addEventListener('click', () => {
        if (started) {
            window.location.reload();
            return;
        }
        localFile = null;
        localBytes = null;
        catalogPick = null;
        source = null;
        romInput.value = '';
        romListSelect.value = '';
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            blobUrl = null;
        }
        infoEl.textContent = 'Pronto. Seleziona una ROM o carica un file locale.';
        hashEl.innerHTML = 'SHA-256: <code>---</code>';
    });
    fsBtn?.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        else viewport?.requestFullscreen?.().catch(() => {});
    });
});