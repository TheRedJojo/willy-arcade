/**
 * RetroPlayer - Configurazione ed avvio di EmulatorJS (NES / SNES / GB)
 * Funziona interamente lato client (compatibile con GitHub Pages e server statici).
 */
document.addEventListener('DOMContentLoaded', () => {
    const coreSelect = document.getElementById('core-select');
    const romInput = document.getElementById('rom-file-input');
    const launchBtn = document.getElementById('btn-launch-rom');
    const clearBtn = document.getElementById('btn-clear-emu');
    const viewport = document.getElementById('emulator-viewport');
    const placeholder = document.getElementById('emulator-placeholder');
    const romInfoStatus = document.getElementById('rom-info-status');
    const romHashStatus = document.getElementById('rom-hash-status');

    if (!coreSelect || !romInput || !launchBtn || !clearBtn || !viewport) return;

    const CDN_BASE = 'https://cdn.emulatorjs.org/stable/data/';

    // Mappa dei sistemi supportati con relativi core EmulatorJS
    const CORE_CONFIG = {
        nes: {
            label: 'Nintendo Entertainment System (NES)',
            ejsCore: 'fceumm',
            extensions: ['.nes']
        },
        snes: {
            label: 'Super Nintendo (SNES)',
            ejsCore: 'snes9x',
            extensions: ['.sfc', '.smc']
        },
        gb: {
            label: 'Game Boy / Game Boy Color (GB/GBC)',
            ejsCore: 'gambatte',
            extensions: ['.gb', '.gbc']
        }
    };

    let selectedFile = null;
    let currentBlobUrl = null;

    // Pre-seleziona il sistema se passato via query string (es. ?core=snes)
    const params = new URLSearchParams(window.location.search);
    const requestedCore = params.get('core');
    if (requestedCore && CORE_CONFIG[requestedCore]) {
        coreSelect.value = requestedCore;
    }

    /**
     * Calcola l'hash SHA-256 reale dei byte della ROM caricata localmente.
     */
    async function computeArrayBufferSHA256(arrayBuffer) {
        if (window.crypto && window.crypto.subtle && window.isSecureContext) {
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }
        return 'non-disponibile-in-contesto-non-sicuro';
    }

    /**
     * Suggerisce automaticamente il core in base all'estensione del file scelto.
     */
    function detectCoreFromFileName(fileName) {
        const lower = fileName.toLowerCase();
        if (lower.endsWith('.nes')) return 'nes';
        if (lower.endsWith('.sfc') || lower.endsWith('.smc')) return 'snes';
        if (lower.endsWith('.gb') || lower.endsWith('.gbc')) return 'gb';
        return null;
    }

    romInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            selectedFile = null;
            return;
        }

        selectedFile = file;
        const sizeKB = (file.size / 1024).toFixed(1);
        const suggestedCore = detectCoreFromFileName(file.name);
        if (suggestedCore) {
            coreSelect.value = suggestedCore;
        }

        romInfoStatus.innerHTML = `<span class="status-ok">✔ File pronto:</span> <strong>${escapeHtml(file.name)}</strong> (${sizeKB} KB) • Core: <strong>${coreSelect.value.toUpperCase()}</strong>`;
        romHashStatus.innerHTML = 'SHA-256 ROM: <code>calcolo in corso...</code>';

        try {
            const buffer = await file.arrayBuffer();
            const sha256 = await computeArrayBufferSHA256(buffer);
            romHashStatus.innerHTML = `SHA-256 ROM: <code title="${sha256}">${sha256.slice(0, 18)}...</code>`;
        } catch (err) {
            console.error('[RetroPlayer] Errore calcolo hash ROM:', err);
            romHashStatus.innerHTML = 'SHA-256 ROM: <code>errore lettura</code>';
        }
    });

    coreSelect.addEventListener('change', () => {
        if (selectedFile) {
            const sizeKB = (selectedFile.size / 1024).toFixed(1);
            romInfoStatus.innerHTML = `<span class="status-ok">✔ File pronto:</span> <strong>${escapeHtml(selectedFile.name)}</strong> (${sizeKB} KB) • Core: <strong>${coreSelect.value.toUpperCase()}</strong>`;
        }
    });

    function escapeHtml(str) {
        return str
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');
    }

    function revokeCurrentBlobUrl() {
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = null;
        }
    }

    function resetEmulatorViewport() {
        revokeCurrentBlobUrl();

        // Rimuove script loader precedentemente iniettato
        const prevLoader = document.getElementById('emulatorjs-loader-script');
        if (prevLoader) prevLoader.remove();

        // Ricrea un contenitore #game pulito per evitare residui del canvas precedente
        const oldGameDiv = document.getElementById('game');
        if (oldGameDiv) {
            const freshGameDiv = document.createElement('div');
            freshGameDiv.id = 'game';
            freshGameDiv.style.width = '100%';
            freshGameDiv.style.height = '100%';
            freshGameDiv.style.display = 'none';
            oldGameDiv.replaceWith(freshGameDiv);
        }

        if (placeholder) {
            placeholder.style.display = 'block';
        }
    }

    function launchEmulator() {
        if (!selectedFile) {
            romInfoStatus.innerHTML = '<span class="status-warn">⚠ Seleziona prima un file ROM locale (.nes, .sfc, .smc, .gb, .gbc).</span>';
            romInput.focus();
            return;
        }

        const chosenCoreKey = coreSelect.value;
        const coreSpec = CORE_CONFIG[chosenCoreKey] || CORE_CONFIG.nes;

        resetEmulatorViewport();

        const gameContainer = document.getElementById('game');
        if (placeholder) placeholder.style.display = 'none';
        if (gameContainer) gameContainer.style.display = 'block';

        currentBlobUrl = URL.createObjectURL(selectedFile);

        // Variabili di configurazione globale richieste da EmulatorJS
        window.EJS_player = '#game';
        window.EJS_core = coreSpec.ejsCore;
        window.EJS_gameName = selectedFile.name.replace(/\.[^/.]+$/, '');
        window.EJS_gameUrl = currentBlobUrl;
        window.EJS_pathtodata = CDN_BASE;
        window.EJS_startOnLoaded = true;
        window.EJS_language = 'it';

        const script = document.createElement('script');
        script.id = 'emulatorjs-loader-script';
        script.src = `${CDN_BASE}loader.js`;
        script.async = true;

        script.onload = () => {
            romInfoStatus.innerHTML = `<span class="status-ok">▶ Emulatore avviato:</span> <strong>${escapeHtml(selectedFile.name)}</strong> (${coreSpec.label})`;
        };

        script.onerror = () => {
            resetEmulatorViewport();
            romInfoStatus.innerHTML = '<span class="status-warn">✖ Impossibile caricare EmulatorJS dal CDN. Controlla la connessione internet o le impostazioni del browser.</span>';
        };

        document.body.appendChild(script);
    }

    launchBtn.addEventListener('click', launchEmulator);

    clearBtn.addEventListener('click', () => {
        selectedFile = null;
        romInput.value = '';
        resetEmulatorViewport();
        romInfoStatus.textContent = 'Nessuna ROM caricata. Seleziona un file ROM o homebrew dal tuo dispositivo (elaborazione 100% locale).';
        romHashStatus.innerHTML = 'SHA-256 ROM: <code>---</code>';
    });

    window.addEventListener('beforeunload', () => {
        revokeCurrentBlobUrl();
    });
});