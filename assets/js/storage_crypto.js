/**
 * RetroStorage - Gestione persistenza locale (localStorage) + Web Crypto API (SHA-256)
 *
 * NOTA DI ARCHITETTURA (100% Static Web / GitHub Pages):
 * Su un sito puramente statico senza backend non esistono segreti server-side:
 * chiunque apra DevTools può ispezionare il codice client-side.
 * L'uso di SHA-256 tramite Web Crypto API ha quindi scopo dimostrativo e di verifica
 * d'integrità accidentale (checksum) sui salvataggi ed export JSON, non di sicurezza
 * anti-manomissione assoluta.
 */
const RetroStorage = (() => {
    const STORAGE_KEY = 'retrolab_arcade_state_v1';
    const DIGEST_KEY = 'retrolab_arcade_digest_v1';
    const CLIENT_PEPPER = 'RetroLabArcade::StaticChecksum::2026';

    const DEFAULT_STATE = {
        scores: [],
        favorites: [],
        settings: {
            soundEnabled: true
        }
    };

    /**
     * Calcola un digest SHA-256 esadecimale usando la Web Crypto API nativa.
     * Include un fallback deterministico nel caso l'utente apra il file via file://
     * senza contesto sicuro (HTTPS / localhost).
     */
    async function computeSHA256(message) {
        const payload = `${CLIENT_PEPPER}|${message}`;

        if (window.crypto && window.crypto.subtle && window.isSecureContext) {
            const encoder = new TextEncoder();
            const data = encoder.encode(payload);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Fallback sincrono per apertura diretta file:// non-localhost
        let h1 = 0xdeadbeef;
        let h2 = 0x41c6ce57;
        for (let i = 0; i < payload.length; i++) {
            const ch = payload.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        const combined = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
        return combined.padStart(64, '0');
    }

    /**
     * Parsing JSON protetto da eccezioni e validazione della struttura dati.
     */
    function safeParseState(raw) {
        if (!raw) return structuredClone(DEFAULT_STATE);
        try {
            const parsed = JSON.parse(raw);
            return {
                scores: Array.isArray(parsed.scores) ? parsed.scores : [],
                favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
                settings: typeof parsed.settings === 'object' && parsed.settings !== null
                    ? { ...DEFAULT_STATE.settings, ...parsed.settings }
                    : { ...DEFAULT_STATE.settings }
            };
        } catch (err) {
            console.warn('[RetroStorage] JSON corrotto in localStorage, ripristino stato predefinito.', err);
            return structuredClone(DEFAULT_STATE);
        }
    }

    /**
     * Salva lo stato serializzato e aggiorna il relativo digest SHA-256.
     */
    async function saveState(state) {
        const serialized = JSON.stringify(state);
        const digest = await computeSHA256(serialized);
        localStorage.setItem(STORAGE_KEY, serialized);
        localStorage.setItem(DIGEST_KEY, digest);
        return { data: state, digest, isValid: true };
    }

    /**
     * Carica lo stato e verifica se il digest SHA-256 corrisponde al contenuto salvato.
     */
    async function loadAndVerifyState() {
        const raw = localStorage.getItem(STORAGE_KEY);
        const savedDigest = localStorage.getItem(DIGEST_KEY);

        if (!raw) {
            const initialized = await saveState(structuredClone(DEFAULT_STATE));
            return initialized;
        }

        const data = safeParseState(raw);
        const currentDigest = await computeSHA256(raw);
        const isValid = Boolean(savedDigest && savedDigest === currentDigest);

        return {
            data,
            digest: currentDigest,
            isValid
        };
    }

    /**
     * Registra un nuovo punteggio con firma SHA-256 individuale della partita.
     */
    async function recordScore(gameId, gameName, scoreValue) {
        const cleanScore = Math.max(0, Math.floor(Number(scoreValue) || 0));
        const stateObj = await loadAndVerifyState();
        const data = stateObj.data;
        const timestamp = Date.now();

        const entryHash = await computeSHA256(`${gameId}:${cleanScore}:${timestamp}`);
        const newEntry = {
            gameId,
            gameName,
            score: cleanScore,
            timestamp,
            hash: entryHash
        };

        data.scores.push(newEntry);
        // Mantiene al massimo i migliori 50 record locali
        data.scores.sort((a, b) => b.score - a.score);
        if (data.scores.length > 50) {
            data.scores = data.scores.slice(0, 50);
        }

        await saveState(data);
        return {
            entry: newEntry,
            bestScore: getBestScoreFromList(data.scores, gameId)
        };
    }

    function getBestScoreFromList(scores, gameId) {
        const filtered = scores.filter(s => s.gameId === gameId);
        if (filtered.length === 0) return 0;
        return Math.max(...filtered.map(s => s.score));
    }

    async function getBestScore(gameId) {
        const stateObj = await loadAndVerifyState();
        return getBestScoreFromList(stateObj.data.scores, gameId);
    }

    async function toggleFavorite(gameId) {
        const stateObj = await loadAndVerifyState();
        const data = stateObj.data;
        const index = data.favorites.indexOf(gameId);

        if (index === -1) {
            data.favorites.push(gameId);
        } else {
            data.favorites.splice(index, 1);
        }

        await saveState(data);
        return data.favorites.includes(gameId);
    }

    async function exportSignedBackup() {
        const stateObj = await loadAndVerifyState();
        const exportedAt = new Date().toISOString();
        const payloadString = JSON.stringify(stateObj.data);
        const verificationDigest = await computeSHA256(`${exportedAt}|${payloadString}`);

        return {
            app: 'RetroLab Arcade',
            exportedAt,
            algorithm: 'SHA-256 (Web Crypto API)',
            checksum: verificationDigest,
            payload: stateObj.data
        };
    }

    async function resetAll() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(DIGEST_KEY);
        return await saveState(structuredClone(DEFAULT_STATE));
    }

    return {
        computeSHA256,
        loadAndVerifyState,
        recordScore,
        getBestScore,
        toggleFavorite,
        exportSignedBackup,
        resetAll
    };
})();