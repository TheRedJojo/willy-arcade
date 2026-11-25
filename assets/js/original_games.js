/**
 * RetroLab Arcade - 10 Giochi Originali con grafica Canvas dettagliata,
 * spiegazioni chiare, 3 livelli di difficoltà, 2P stesso schermo e 2P remoto (WebRTC).
 */
const RetroGamesCatalog = [
    {
        id: 'space_defender',
        name: 'Space Defender',
        tag: 'SHOOTER',
        icon: '🚀 🛸',
        bg: 'linear-gradient(135deg, #0b1936, #1e40af)',
        genre: 'Arcade Shooter',
        supports2P: false,
        howToPlay: 'Muovi la navicella in basso e spara alle file di alieni in alto prima che scendano o ti colpiscano. Ogni ondata completata porta un bonus punti e accelera il ritmo.',
        desc: 'Abbatti le ondate aliene evitando i colpi nemici. Ritmo crescente a ogni ondata.',
        controlsHint: 'Frecce/A-D o Pad/Trascina: muovi • Spazio/Z/A: spara • P: pausa'
    },
    {
        id: 'neon_breakout',
        name: 'Neon Breakout',
        tag: 'ARCADE',
        icon: '🧱 ⚡',
        bg: 'linear-gradient(135deg, #24164d, #9d174d)',
        genre: 'Brick Breaker',
        supports2P: false,
        howToPlay: 'Fai rimbalzare la sfera energetica sulla tua barra in basso per colpire e distruggere tutti i blocchi colorati in alto senza lasciar cadere la sfera sotto.',
        desc: 'Rompi tutti i blocchi luminosi gestendo rimbalzi e angolazioni con la barra.',
        controlsHint: 'Frecce/A-D o Pad/Trascina: muovi barra • P: pausa'
    },
    {
        id: 'cyber_snake',
        name: 'Cyber Snake',
        tag: 'CLASSIC',
        icon: '🐍 💎',
        bg: 'linear-gradient(135deg, #064e3b, #0f766e)',
        genre: 'Arcade Snake',
        supports2P: false,
        howToPlay: 'Guida il serpente sulla griglia e raccogli i cristalli rosa per fare punti e allungarti. Non colpire mai i bordi né il tuo stesso corpo.',
        desc: 'Raccogli i cristalli allungandoti senza colpire bordi o coda.',
        controlsHint: 'Frecce/WASD o D-Pad/Controller: sterza • P: pausa'
    },
    {
        id: 'sky_hopper',
        name: 'Sky Hopper',
        tag: 'PLATFORM',
        icon: '🦘 ☁️',
        bg: 'linear-gradient(135deg, #0c4a6e, #0369a1)',
        genre: 'Vertical Jump',
        supports2P: false,
        howToPlay: 'Il personaggio rimbalza automaticamente verso l’alto: spostalo a sinistra o destra per atterrare sulle piattaforme verdi e salire più in alto possibile senza cadere.',
        desc: 'Salta da piattaforma a piattaforma salendo in alto con spinta extra su Azione.',
        controlsHint: 'Frecce/A-D o Pad/Trascina: muovi • Spazio/Z/A: spinta extra'
    },
    {
        id: 'asteroid_dodger',
        name: 'Asteroid Dodger',
        tag: 'SURVIVAL',
        icon: '☄️ 🛡️',
        bg: 'linear-gradient(135deg, #311042, #701a75)',
        genre: 'Survival Shooter',
        supports2P: false,
        howToPlay: 'Naviga nello spazio profondo in tutte le direzioni: schiva gli asteroidi che piovono verso di te e usa il raggio laser per frantumarli.',
        desc: 'Muoviti liberamente tra gli asteroidi e spara col laser per sopravvivere.',
        controlsHint: 'Frecce/WASD o Pad/Controller: muovi • Spazio/Z/A: spara'
    },
    {
        id: 'turbo_drift',
        name: 'Turbo Drift',
        tag: 'RACING',
        icon: '🏎️ 🛣️',
        bg: 'linear-gradient(135deg, #451a03, #b45309)',
        genre: 'Lane Racer',
        supports2P: false,
        howToPlay: 'Guida su una strada a 3 corsie: spostati tra le corsie per schivare le auto/ostacoli rossi e tieni premuto Su o Azione per il turbo (più velocità e più punti).',
        desc: 'Cambia corsia evitando il traffico e attiva il turbo per moltiplicare i punti.',
        controlsHint: 'Frecce Sinistra-Destra o Pad: corsia • Su/Spazio/A: turbo'
    },
    {
        id: 'pulse_pong',
        name: 'Pulse Pong',
        tag: 'SPORTS • 2P',
        icon: '🏓 ✨',
        bg: 'linear-gradient(135deg, #172554, #0e7490)',
        genre: 'Arcade Pong',
        supports2P: true,
        howToPlay: 'Impedisci alla pallina di superare la tua racchetta e rimandala nel campo opposto. Puoi giocare contro la CPU oppure in 2 giocatori sullo stesso schermo o da remoto.',
        desc: 'Sfida arcade ad alta velocità: 1P contro CPU o 2P stesso schermo / remoto.',
        controlsHint: '1P: Frecce Su-Giù/W-S/Pad • 2P: P1 W-S, P2 Frecce Su-Giù'
    },
    {
        id: 'star_collector',
        name: 'Star Collector',
        tag: 'ACTION • 2P',
        icon: '⭐ 🤖',
        bg: 'linear-gradient(135deg, #1e293b, #4f46e5)',
        genre: 'Arena Collector',
        supports2P: true,
        howToPlay: 'Raccogli tutte le stelle dorate nell’arena mentre eviti il drone rosso che insegue. In 2P giocate insieme/in sfida nell’arena con P1 (WASD+F) e P2 (Frecce+L).',
        desc: 'Raccogli stelle evitando il drone inseguitore, in 1P o 2P stesso schermo/remoto.',
        controlsHint: '1P: Frecce/WASD/Pad + Spazio/A • 2P: P1 WASD+F, P2 Frecce+L'
    },
    {
        id: 'mine_arcade',
        name: 'Mine Sweeper Arcade',
        tag: 'PUZZLE',
        icon: '💣 🔍',
        bg: 'linear-gradient(135deg, #1f2937, #374151)',
        genre: 'Tactical Puzzle',
        supports2P: false,
        howToPlay: 'Sposta il riquadro ciano sulle caselle della griglia: premi Azione per scoprirne una (fai punti sulle caselle sicure, perdi se scopri una mina) e X/B per mettere o togliere una bandiera.',
        desc: 'Esplora la griglia, segna le mine con la bandiera e scopri le caselle sicure.',
        controlsHint: 'Frecce/WASD/Pad: cursore • Spazio/Z/A: scopri • X/B: bandiera'
    },
    {
        id: 'color_reflex',
        name: 'Color Reflex',
        tag: 'REFLEX',
        icon: '🎯 🔥',
        bg: 'linear-gradient(135deg, #4c0519, #be123c)',
        genre: 'Reflex Arcade',
        supports2P: false,
        howToPlay: 'Hai 25 secondi: porta il mirino sul cerchio rosso e premi Azione per colpirlo. Ogni colpo vale punti e fa comparire un nuovo bersaglio.',
        desc: 'Colpisci più bersagli possibili prima che scada il tempo.',
        controlsHint: 'Frecce/WASD/Pad/Controller: mirino • Spazio/Z/A: colpisci'
    }
];

document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const switcherEl = document.getElementById('game-switcher');
    const hudGame = document.getElementById('hud-game');
    const hudScore = document.getElementById('hud-score');
    const hudBest = document.getElementById('hud-best');
    const hudMode = document.getElementById('hud-mode');
    const howToPlayEl = document.getElementById('game-how-to-play');
    const controlsBanner = document.getElementById('game-controls-banner');
    const saveStatusEl = document.getElementById('game-save-status');
    const restartBtn = document.getElementById('btn-restart-game');

    const remotePanel = document.getElementById('remote-panel');
    const remoteSdpBox = document.getElementById('remote-sdp-box');
    const remoteStatusEl = document.getElementById('remote-conn-status');
    const btnRemoteCreate = document.getElementById('btn-remote-create');
    const btnRemoteAnswer = document.getElementById('btn-remote-answer');
    const btnRemoteAccept = document.getElementById('btn-remote-accept');

    const DIFFICULTIES = {
        easy: { label: 'FACILE', speedMul: 0.78, enemyMul: 0.75, scoreMul: 0.85 },
        normal: { label: 'NORMALE', speedMul: 1.0, enemyMul: 1.0, scoreMul: 1.0 },
        hard: { label: 'DIFFICILE', speedMul: 1.28, enemyMul: 1.32, scoreMul: 1.35 }
    };

    const params = new URLSearchParams(window.location.search);
    let currentGameId = params.get('game');
    if (!RetroGamesCatalog.some(g => g.id === currentGameId)) currentGameId = 'space_defender';

    let difficulty = 'normal';
    let playerMode = '1p'; // '1p' | '2p_local' | '2p_remote'

    const p1 = { up: false, down: false, left: false, right: false, action: false, secondary: false };
    const p2 = { up: false, down: false, left: false, right: false, action: false, secondary: false };
    const justPressed = {
        p1Action: false, p1Secondary: false,
        p2Action: false, p2Secondary: false,
        pause: false, restart: false
    };

    // WebRTC peer-to-peer per 2P remoto (nessun backend necessario)
    let rtcPeer = null;
    let rtcChannel = null;

    function sendRemoteInput() {
        if (rtcChannel && rtcChannel.readyState === 'open') {
            rtcChannel.send(JSON.stringify({
                type: 'input',
                up: p1.up, down: p1.down, left: p1.left, right: p1.right,
                action: p1.action, secondary: p1.secondary
            }));
        }
    }

    function setupDataChannel(ch) {
        rtcChannel = ch;
        ch.onopen = () => {
            if (remoteStatusEl) remoteStatusEl.innerHTML = 'Stato: <span class="ok">✔ Connesso (2P Remoto)</span>';
        };
        ch.onclose = () => {
            if (remoteStatusEl) remoteStatusEl.innerHTML = 'Stato: <code>disconnesso</code>';
        };
        ch.onmessage = (ev) => {
            try {
                const msg = JSON.parse(ev.data);
                if (msg.type === 'input') {
                    if (msg.action && !p2.action) justPressed.p2Action = true;
                    if (msg.secondary && !p2.secondary) justPressed.p2Secondary = true;
                    p2.up = Boolean(msg.up);
                    p2.down = Boolean(msg.down);
                    p2.left = Boolean(msg.left);
                    p2.right = Boolean(msg.right);
                    p2.action = Boolean(msg.action);
                    p2.secondary = Boolean(msg.secondary);
                }
            } catch (_) {}
        };
    }

    async function createRemoteOffer() {
        rtcPeer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        setupDataChannel(rtcPeer.createDataChannel('retrolab'));
        rtcPeer.onicecandidate = () => {
            if (rtcPeer.localDescription && remoteSdpBox) {
                remoteSdpBox.value = btoa(JSON.stringify(rtcPeer.localDescription));
            }
        };
        const offer = await rtcPeer.createOffer();
        await rtcPeer.setLocalDescription(offer);
        if (remoteStatusEl) remoteStatusEl.innerHTML = 'Stato: <code>offerta pronta — copia codice per ospite</code>';
    }

    async function answerRemoteOffer() {
        if (!remoteSdpBox?.value.trim()) return;
        const remoteDesc = JSON.parse(atob(remoteSdpBox.value.trim()));
        rtcPeer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        rtcPeer.ondatachannel = (e) => setupDataChannel(e.channel);
        rtcPeer.onicecandidate = () => {
            if (rtcPeer.localDescription && remoteSdpBox) {
                remoteSdpBox.value = btoa(JSON.stringify(rtcPeer.localDescription));
            }
        };
        await rtcPeer.setRemoteDescription(remoteDesc);
        const ans = await rtcPeer.createAnswer();
        await rtcPeer.setLocalDescription(ans);
        if (remoteStatusEl) remoteStatusEl.innerHTML = 'Stato: <code>risposta pronta — invia all’host</code>';
    }

    async function acceptRemoteAnswer() {
        if (!rtcPeer || !remoteSdpBox?.value.trim()) return;
        const ansDesc = JSON.parse(atob(remoteSdpBox.value.trim()));
        await rtcPeer.setRemoteDescription(ansDesc);
        if (remoteStatusEl) remoteStatusEl.innerHTML = 'Stato: <code>collegamento in corso...</code>';
    }

    btnRemoteCreate?.addEventListener('click', createRemoteOffer);
    btnRemoteAnswer?.addEventListener('click', answerRemoteOffer);
    btnRemoteAccept?.addEventListener('click', acceptRemoteAnswer);

    let audioCtx = null;
    function beep(freq = 440, type = 'square', dur = 0.05, vol = 0.03) {
        try {
            if (!audioCtx) {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (AC) audioCtx = new AC();
            }
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(vol, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + dur);
        } catch (_) {}
    }

    let score = 0;
    let bestScore = 0;
    let mode = 'PLAYING'; // 'PLAYING' | 'PAUSED' | 'GAMEOVER'
    let scoreSaved = false;
    let engine = null;
    let lastTs = 0;

    function getMeta() {
        return RetroGamesCatalog.find(g => g.id === currentGameId) || RetroGamesCatalog[0];
    }

    function diffSpec() {
        return DIFFICULTIES[difficulty] || DIFFICULTIES.normal;
    }

    function syncHud() {
        const meta = getMeta();
        const d = diffSpec();
        const pTag = playerMode === '2p_local' ? '2P LOCALE' : playerMode === '2p_remote' ? '2P REMOTO' : '1P';
        if (hudGame) hudGame.textContent = meta.name;
        if (hudScore) hudScore.textContent = score.toLocaleString('it-IT');
        if (hudBest) hudBest.textContent = bestScore.toLocaleString('it-IT');
        if (hudMode) {
            const st = mode === 'PAUSED' ? ' • PAUSA' : mode === 'GAMEOVER' ? ' • GAME OVER' : '';
            hudMode.textContent = `${pTag} • ${d.label}${st}`;
        }
    }

    function addPoints(pts) {
        const gained = Math.max(5, Math.round(pts * diffSpec().scoreMul));
        score += gained;
        if (score > bestScore) bestScore = score;
        syncHud();
    }

    async function finishGame() {
        if (mode === 'GAMEOVER') return;
        mode = 'GAMEOVER';
        beep(145, 'sawtooth', 0.28, 0.05);
        syncHud();

        const meta = getMeta();
        if (!scoreSaved && typeof RetroStorage !== 'undefined' && score > 0) {
            scoreSaved = true;
            const res = await RetroStorage.recordScore(meta.id, meta.name, score);
            bestScore = res.bestScore;
            syncHud();
            if (saveStatusEl) {
                saveStatusEl.innerHTML = `<span class="ok">✔ Record salvato: ${score.toLocaleString('it-IT')} pt</span> • Premi <strong>Azione</strong> o <strong>Nuova Partita</strong> per rigiocare.`;
            }
        } else if (saveStatusEl) {
            saveStatusEl.innerHTML = `Partita terminata (${score.toLocaleString('it-IT')} pt) • Premi <strong>Azione</strong> o <strong>Nuova Partita</strong> per rigiocare.`;
        }
    }

    // Grafica sfondi arcade
    function drawArcadeBg() {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#070d1c');
        grad.addColorStop(1, '#0c162d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += 44) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += 44) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    }

    // --- 10 MOTORI DI GIOCO CON GRAFICHE DETTAGLIATE ---
    function createSpaceDefender() {
        const d = diffSpec();
        const p = { x: canvas.width / 2 - 24, y: canvas.height - 52, w: 48, h: 26, speed: 420 * d.speedMul };
        let bullets = [], eBullets = [], enemies = [], dir = 1, fireCd = 0, eFireCd = 0.9 / d.enemyMul, wave = 1, lives = 3;
        const spawnWave = () => {
            enemies = [];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 9; c++) {
                    enemies.push({ x: 95 + c * 76, y: 58 + r * 42, w: 38, h: 24, pts: (4 - r) * 100, color: ['#fb7185', '#fbbf24', '#c084fc', '#34d399'][r] });
                }
            }
        };
        spawnWave();
        return {
            update(dt) {
                if (p1.left) p.x -= p.speed * dt;
                if (p1.right) p.x += p.speed * dt;
                p.x = Math.max(12, Math.min(canvas.width - p.w - 12, p.x));
                fireCd -= dt;
                if (p1.action && fireCd <= 0) {
                    bullets.push({ x: p.x + p.w / 2 - 2.5, y: p.y - 12, w: 5, h: 14 });
                    fireCd = 0.21;
                    beep(760, 'square', 0.045, 0.03);
                }
                for (let i = bullets.length - 1; i >= 0; i--) {
                    bullets[i].y -= 560 * dt;
                    if (bullets[i].y < 0) { bullets.splice(i, 1); continue; }
                    for (let j = enemies.length - 1; j >= 0; j--) {
                        const b = bullets[i], e = enemies[j];
                        if (b && b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
                            bullets.splice(i, 1);
                            addPoints(e.pts);
                            enemies.splice(j, 1);
                            beep(290, 'triangle', 0.06, 0.035);
                            break;
                        }
                    }
                }
                let edge = false;
                const spd = (68 + wave * 15) * d.enemyMul * dir;
                enemies.forEach(e => { e.x += spd * dt; if (e.x < 14 || e.x + e.w > canvas.width - 14) edge = true; });
                if (edge) {
                    dir *= -1;
                    enemies.forEach(e => { e.y += 18; if (e.y + e.h >= p.y) finishGame(); });
                }
                eFireCd -= dt;
                if (eFireCd <= 0 && enemies.length) {
                    const s = enemies[Math.floor(Math.random() * enemies.length)];
                    eBullets.push({ x: s.x + s.w / 2 - 3, y: s.y + s.h, w: 6, h: 13 });
                    eFireCd = Math.max(0.38, (1.15 - wave * 0.07) / d.enemyMul);
                }
                for (let i = eBullets.length - 1; i >= 0; i--) {
                    const eb = eBullets[i];
                    eb.y += 265 * d.enemyMul * dt;
                    if (eb.y > canvas.height) { eBullets.splice(i, 1); continue; }
                    if (eb.x < p.x + p.w && eb.x + eb.w > p.x && eb.y < p.y + p.h && eb.y + eb.h > p.y) {
                        eBullets.splice(i, 1);
                        lives--;
                        beep(130, 'sawtooth', 0.2, 0.05);
                        if (lives <= 0) finishGame();
                    }
                }
                if (!enemies.length) { wave++; addPoints(400); spawnWave(); }
            },
            draw() {
                drawArcadeBg();
                // Navicella giocatore
                ctx.fillStyle = '#22d3ee';
                ctx.beginPath();
                ctx.moveTo(p.x + p.w / 2, p.y - 6);
                ctx.lineTo(p.x + p.w, p.y + p.h);
                ctx.lineTo(p.x, p.y + p.h);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(p.x + p.w / 2 - 4, p.y + 7, 8, 8);

                // Alieni con visiera
                enemies.forEach(e => {
                    ctx.fillStyle = e.color;
                    ctx.fillRect(e.x, e.y, e.w, e.h);
                    ctx.fillStyle = '#070b14';
                    ctx.fillRect(e.x + 7, e.y + 7, 6, 5);
                    ctx.fillRect(e.x + e.w - 13, e.y + 7, 6, 5);
                });

                ctx.fillStyle = '#34d399';
                bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
                ctx.fillStyle = '#fb7185';
                eBullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

                ctx.fillStyle = '#f8fafc';
                ctx.font = '14px Inter, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`Vite: ${lives} • Ondata: ${wave}`, 16, 26);
            }
        };
    }

    function createNeonBreakout() {
        const d = diffSpec();
        const paddle = { x: canvas.width / 2 - 60, y: canvas.height - 36, w: 120, h: 15, speed: 470 * d.speedMul };
        const ball = { x: canvas.width / 2, y: canvas.height - 62, r: 9, vx: 265 * d.enemyMul, vy: -305 * d.enemyMul };
        let bricks = [];
        const colors = ['#22d3ee', '#fb7185', '#34d399', '#fbbf24', '#c084fc'];
        const makeBricks = () => {
            bricks = [];
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 10; c++) {
                    bricks.push({ x: 38 + c * 80, y: 52 + r * 30, w: 72, h: 20, alive: true, color: colors[r] });
                }
            }
        };
        makeBricks();
        return {
            update(dt) {
                if (p1.left) paddle.x -= paddle.speed * dt;
                if (p1.right) paddle.x += paddle.speed * dt;
                paddle.x = Math.max(10, Math.min(canvas.width - paddle.w - 10, paddle.x));

                ball.x += ball.vx * dt;
                ball.y += ball.vy * dt;
                if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) { ball.vx *= -1; beep(420, 'sine', 0.04); }
                if (ball.y - ball.r < 0) { ball.vy *= -1; beep(420, 'sine', 0.04); }
                if (ball.y + ball.r > canvas.height) { finishGame(); return; }

                if (ball.vy > 0 && ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
                    const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
                    ball.vx = hit * 350 * d.enemyMul;
                    ball.vy = -Math.abs(ball.vy);
                    beep(560, 'square', 0.045, 0.03);
                }
                for (const b of bricks) {
                    if (!b.alive) continue;
                    if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + b.w && ball.y + ball.r > b.y && ball.y - ball.r < b.y + b.h) {
                        b.alive = false;
                        ball.vy *= -1;
                        addPoints(120);
                        beep(660, 'triangle', 0.05, 0.035);
                        break;
                    }
                }
                if (bricks.every(b => !b.alive)) { addPoints(500); makeBricks(); }
            },
            draw() {
                drawArcadeBg();
                bricks.forEach(b => {
                    if (!b.alive) return;
                    ctx.fillStyle = b.color;
                    ctx.fillRect(b.x, b.y, b.w, b.h);
                    ctx.fillStyle = 'rgba(255,255,255,0.22)';
                    ctx.fillRect(b.x, b.y, b.w, 4);
                });
                ctx.fillStyle = '#22d3ee';
                ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
                ctx.fillStyle = '#f8fafc';
                ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
            }
        };
    }

    function createCyberSnake() {
        const d = diffSpec();
        const cell = 20, cols = Math.floor(canvas.width / cell), rows = Math.floor(canvas.height / cell);
        let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        let dir = { x: 1, y: 0 }, timer = 0, step = 0.12 / d.enemyMul;
        const spawnFood = () => ({ x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) });
        let food = spawnFood();
        return {
            update(dt) {
                if (p1.up && dir.y !== 1) dir = { x: 0, y: -1 };
                else if (p1.down && dir.y !== -1) dir = { x: 0, y: 1 };
                else if (p1.left && dir.x !== 1) dir = { x: -1, y: 0 };
                else if (p1.right && dir.x !== -1) dir = { x: 1, y: 0 };

                timer += dt;
                if (timer < step) return;
                timer = 0;

                const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
                if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
                    finishGame();
                    return;
                }
                snake.unshift(head);
                if (head.x === food.x && head.y === food.y) {
                    addPoints(150);
                    step = Math.max(0.055, step * 0.965);
                    food = spawnFood();
                    beep(700, 'square', 0.055, 0.035);
                } else {
                    snake.pop();
                }
            },
            draw() {
                drawArcadeBg();
                ctx.fillStyle = '#fb7185';
                ctx.beginPath();
                ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.42, 0, Math.PI * 2);
                ctx.fill();

                snake.forEach((s, i) => {
                    ctx.fillStyle = i === 0 ? '#22d3ee' : '#34d399';
                    ctx.fillRect(s.x * cell + 2, s.y * cell + 2, cell - 4, cell - 4);
                    if (i === 0) {
                        ctx.fillStyle = '#050811';
                        ctx.fillRect(s.x * cell + 6, s.y * cell + 6, 3, 3);
                        ctx.fillRect(s.x * cell + 11, s.y * cell + 6, 3, 3);
                    }
                });
            }
        };
    }

    function createSkyHopper() {
        const d = diffSpec();
        const player = { x: canvas.width / 2 - 16, y: canvas.height - 90, w: 32, h: 32, vy: -460 };
        const plats = Array.from({ length: 8 }, (_, i) => ({ x: 80 + ((i * 100) % (canvas.width - 180)), y: 90 + i * 55, w: 100, h: 13 }));
        return {
            update(dt) {
                const vx = (p1.right ? 1 : 0) - (p1.left ? 1 : 0);
                player.x += vx * 400 * d.speedMul * dt;
                if (player.x < -player.w) player.x = canvas.width;
                if (player.x > canvas.width) player.x = -player.w;

                player.vy += 980 * dt;
                player.y += player.vy * dt;

                if (player.vy > 0) {
                    for (const pl of plats) {
                        if (player.x + player.w > pl.x && player.x < pl.x + pl.w && player.y + player.h >= pl.y && player.y + player.h <= pl.y + pl.h + 12) {
                            player.vy = (justPressed.p1Action || p1.action) ? -555 : -460;
                            beep(520, 'sine', 0.055, 0.035);
                        }
                    }
                }
                if (player.y < canvas.height * 0.42) {
                    const diff = canvas.height * 0.42 - player.y;
                    player.y = canvas.height * 0.42;
                    addPoints(Math.floor(diff));
                    plats.forEach(pl => {
                        pl.y += diff;
                        if (pl.y > canvas.height) {
                            pl.y = 10;
                            pl.x = 30 + Math.random() * (canvas.width - 130);
                        }
                    });
                }
                if (player.y > canvas.height + 20) finishGame();
            },
            draw() {
                drawArcadeBg();
                plats.forEach(pl => {
                    ctx.fillStyle = '#34d399';
                    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
                    ctx.fillStyle = '#a7f3d0';
                    ctx.fillRect(pl.x, pl.y, pl.w, 3);
                });
                ctx.fillStyle = '#22d3ee';
                ctx.fillRect(player.x, player.y, player.w, player.h);
                ctx.fillStyle = '#050811';
                ctx.fillRect(player.x + 8, player.y + 9, 4, 4);
                ctx.fillRect(player.x + 20, player.y + 9, 4, 4);
            }
        };
    }

    function createAsteroidDodger() {
        const d = diffSpec();
        const ship = { x: canvas.width / 2, y: canvas.height / 2, r: 15, spd: 325 * d.speedMul };
        let rocks = [], lasers = [], spawnTimer = 0.55 / d.enemyMul, fireCd = 0;
        return {
            update(dt) {
                if (p1.left) ship.x -= ship.spd * dt;
                if (p1.right) ship.x += ship.spd * dt;
                if (p1.up) ship.y -= ship.spd * dt;
                if (p1.down) ship.y += ship.spd * dt;
                ship.x = Math.max(18, Math.min(canvas.width - 18, ship.x));
                ship.y = Math.max(18, Math.min(canvas.height - 18, ship.y));

                fireCd -= dt;
                if (p1.action && fireCd <= 0) {
                    lasers.push({ x: ship.x, y: ship.y - 18, vy: -520 });
                    fireCd = 0.24;
                    beep(780, 'square', 0.04, 0.03);
                }
                lasers.forEach(l => l.y += l.vy * dt);
                lasers = lasers.filter(l => l.y > -10);

                spawnTimer -= dt;
                if (spawnTimer <= 0) {
                    rocks.push({ x: Math.random() * canvas.width, y: -24, r: 16 + Math.random() * 14, vx: (Math.random() - 0.5) * 95, vy: (125 + Math.random() * 120) * d.enemyMul });
                    spawnTimer = 0.55 / d.enemyMul;
                }
                for (let i = rocks.length - 1; i >= 0; i--) {
                    const rk = rocks[i];
                    rk.x += rk.vx * dt; rk.y += rk.vy * dt;
                    if (Math.hypot(rk.x - ship.x, rk.y - ship.y) < rk.r + ship.r - 3) { finishGame(); return; }
                    for (let j = lasers.length - 1; j >= 0; j--) {
                        if (Math.hypot(rk.x - lasers[j].x, rk.y - lasers[j].y) < rk.r + 6) {
                            lasers.splice(j, 1);
                            rocks.splice(i, 1);
                            addPoints(100);
                            beep(240, 'triangle', 0.055, 0.035);
                            break;
                        }
                    }
                    if (rocks[i] && rocks[i].y > canvas.height + 40) { rocks.splice(i, 1); addPoints(20); }
                }
            },
            draw() {
                drawArcadeBg();
                ctx.fillStyle = '#22d3ee';
                ctx.beginPath(); ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#34d399';
                lasers.forEach(l => ctx.fillRect(l.x - 2, l.y, 4, 13));
                rocks.forEach(rk => {
                    ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
                    ctx.strokeStyle = '#fbbf24';
                    ctx.lineWidth = 2.5;
                    ctx.beginPath(); ctx.arc(rk.x, rk.y, rk.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                });
            }
        };
    }

    function createTurboDrift() {
        const d = diffSpec();
        const lanes = [canvas.width * 0.28, canvas.width * 0.5, canvas.width * 0.72];
        let lane = 1, moveLock = 0, obstacles = [], timer = 0.75 / d.enemyMul, ptsTimer = 0, roadOffset = 0;
        const car = { w: 44, h: 66, y: canvas.height - 96 };
        return {
            update(dt) {
                moveLock -= dt;
                if (moveLock <= 0) {
                    if (p1.left && lane > 0) { lane--; moveLock = 0.16; }
                    else if (p1.right && lane < 2) { lane++; moveLock = 0.16; }
                }
                const boost = (p1.up || p1.action) ? 1.65 : 1;
                roadOffset = (roadOffset + 340 * boost * dt) % 44;
                ptsTimer += dt;
                if (ptsTimer >= 0.25) { ptsTimer = 0; addPoints(Math.round(15 * boost)); }

                timer -= dt * boost;
                if (timer <= 0) {
                    obstacles.push({ lane: Math.floor(Math.random() * 3), y: -70, w: 44, h: 66 });
                    timer = 0.75 / d.enemyMul;
                }
                const cx = lanes[lane];
                for (let i = obstacles.length - 1; i >= 0; i--) {
                    const ob = obstacles[i];
                    ob.y += 315 * boost * d.enemyMul * dt;
                    const ox = lanes[ob.lane];
                    if (Math.abs(cx - ox) < 36 && Math.abs(car.y - ob.y) < 56) { finishGame(); return; }
                    if (ob.y > canvas.height + 80) obstacles.splice(i, 1);
                }
            },
            draw() {
                drawArcadeBg();
                ctx.fillStyle = '#141d30';
                ctx.fillRect(canvas.width * 0.18, 0, canvas.width * 0.64, canvas.height);
                ctx.strokeStyle = 'rgba(248,250,252,0.28)';
                ctx.lineWidth = 2;
                ctx.setLineDash([20, 24]);
                ctx.lineDashOffset = -roadOffset;
                [0.39, 0.61].forEach(f => { ctx.beginPath(); ctx.moveTo(canvas.width * f, 0); ctx.lineTo(canvas.width * f, canvas.height); ctx.stroke(); });
                ctx.setLineDash([]);

                obstacles.forEach(ob => {
                    ctx.fillStyle = '#fb7185';
                    ctx.fillRect(lanes[ob.lane] - ob.w / 2, ob.y, ob.w, ob.h);
                    ctx.fillStyle = '#090d18';
                    ctx.fillRect(lanes[ob.lane] - ob.w / 2 + 6, ob.y + 10, ob.w - 12, 14);
                });
                ctx.fillStyle = '#22d3ee';
                ctx.fillRect(lanes[lane] - car.w / 2, car.y, car.w, car.h);
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(lanes[lane] - car.w / 2 + 7, car.y + 10, car.w - 14, 14);
            }
        };
    }

    // Pulse Pong: supporta 1P vs CPU, 2P stesso schermo e 2P remoto
    function createPulsePong() {
        const d = diffSpec();
        const isTwoPlayers = playerMode === '2p_local' || playerMode === '2p_remote';
        const pLeft = { x: 26, y: canvas.height / 2 - 44, w: 14, h: 88, spd: 430 * d.speedMul };
        const pRight = { x: canvas.width - 40, y: canvas.height / 2 - 44, w: 14, h: 88, spd: (isTwoPlayers ? 430 : 285 * d.enemyMul) };
        const ball = { x: canvas.width / 2, y: canvas.height / 2, r: 9, vx: 320 * d.enemyMul, vy: 220 * d.enemyMul };
        let ptsP2 = 0;

        return {
            update(dt) {
                if (p1.up) pLeft.y -= pLeft.spd * dt;
                if (p1.down) pLeft.y += pLeft.spd * dt;
                pLeft.y = Math.max(8, Math.min(canvas.height - pLeft.h - 8, pLeft.y));

                if (isTwoPlayers) {
                    if (p2.up) pRight.y -= pRight.spd * dt;
                    if (p2.down) pRight.y += pRight.spd * dt;
                } else {
                    if (pRight.y + pRight.h / 2 < ball.y - 10) pRight.y += pRight.spd * dt;
                    else if (pRight.y + pRight.h / 2 > ball.y + 10) pRight.y -= pRight.spd * dt;
                }
                pRight.y = Math.max(8, Math.min(canvas.height - pRight.h - 8, pRight.y));

                ball.x += ball.vx * dt; ball.y += ball.vy * dt;
                if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.vy *= -1;

                if (ball.vx < 0 && ball.x - ball.r <= pLeft.x + pLeft.w && ball.y >= pLeft.y && ball.y <= pLeft.y + pLeft.h) {
                    ball.vx = Math.abs(ball.vx) * 1.04;
                    addPoints(100);
                    beep(620, 'square', 0.045, 0.03);
                }
                if (ball.vx > 0 && ball.x + ball.r >= pRight.x && ball.y >= pRight.y && ball.y <= pRight.y + pRight.h) {
                    ball.vx = -Math.abs(ball.vx) * 1.03;
                    if (isTwoPlayers) ptsP2 += 100;
                    beep(440, 'square', 0.045, 0.03);
                }

                if (ball.x < -20) {
                    if (isTwoPlayers) {
                        ptsP2 += 200;
                        if (ptsP2 >= 1000) { finishGame(); return; }
                        ball.x = canvas.width / 2; ball.y = canvas.height / 2; ball.vx = 320 * d.enemyMul;
                    } else {
                        finishGame(); return;
                    }
                }
                if (ball.x > canvas.width + 20) {
                    addPoints(250);
                    ball.x = canvas.width / 2; ball.y = canvas.height / 2; ball.vx = -320 * d.enemyMul;
                }
            },
            draw() {
                drawArcadeBg();
                ctx.strokeStyle = 'rgba(148,163,184,0.22)';
                ctx.setLineDash([10, 10]);
                ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = '#22d3ee';
                ctx.fillRect(pLeft.x, pLeft.y, pLeft.w, pLeft.h);
                ctx.fillStyle = '#fb7185';
                ctx.fillRect(pRight.x, pRight.y, pRight.w, pRight.h);
                ctx.fillStyle = '#f8fafc';
                ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = '#cbd5e1';
                ctx.font = '14px Inter, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(isTwoPlayers ? `P1: ${score}  |  P2: ${ptsP2} (vince a 1000)` : `Modalità 1P vs CPU`, 16, 26);
            }
        };
    }

    // Star Collector: supporta 1P e 2P (stesso schermo / remoto)
    function createStarCollector() {
        const d = diffSpec();
        const isTwoPlayers = playerMode === '2p_local' || playerMode === '2p_remote';
        const hero1 = { x: canvas.width * 0.35, y: canvas.height / 2, r: 15, spd: 315 * d.speedMul };
        const hero2 = { x: canvas.width * 0.65, y: canvas.height / 2, r: 15, spd: 315 * d.speedMul };
        const drone = { x: 70, y: 70, r: 16, spd: 145 * d.enemyMul };
        const makeStars = () => Array.from({ length: 6 }, () => ({ x: 50 + Math.random() * (canvas.width - 100), y: 50 + Math.random() * (canvas.height - 100), r: 10 }));
        let stars = makeStars();
        return {
            update(dt) {
                const dash1 = justPressed.p1Action ? 65 : 0;
                if (p1.left) hero1.x -= hero1.spd * dt + dash1;
                if (p1.right) hero1.x += hero1.spd * dt + dash1;
                if (p1.up) hero1.y -= hero1.spd * dt + dash1;
                if (p1.down) hero1.y += hero1.spd * dt + dash1;
                hero1.x = Math.max(18, Math.min(canvas.width - 18, hero1.x));
                hero1.y = Math.max(18, Math.min(canvas.height - 18, hero1.y));

                if (isTwoPlayers) {
                    const dash2 = justPressed.p2Action ? 65 : 0;
                    if (p2.left) hero2.x -= hero2.spd * dt + dash2;
                    if (p2.right) hero2.x += hero2.spd * dt + dash2;
                    if (p2.up) hero2.y -= hero2.spd * dt + dash2;
                    if (p2.down) hero2.y += hero2.spd * dt + dash2;
                    hero2.x = Math.max(18, Math.min(canvas.width - 18, hero2.x));
                    hero2.y = Math.max(18, Math.min(canvas.height - 18, hero2.y));
                }

                const target = (!isTwoPlayers || Math.hypot(hero1.x - drone.x, hero1.y - drone.y) <= Math.hypot(hero2.x - drone.x, hero2.y - drone.y)) ? hero1 : hero2;
                const ang = Math.atan2(target.y - drone.y, target.x - drone.x);
                drone.x += Math.cos(ang) * drone.spd * dt;
                drone.y += Math.sin(ang) * drone.spd * dt;

                if (Math.hypot(hero1.x - drone.x, hero1.y - drone.y) < hero1.r + drone.r - 3) { finishGame(); return; }
                if (isTwoPlayers && Math.hypot(hero2.x - drone.x, hero2.y - drone.y) < hero2.r + drone.r - 3) { finishGame(); return; }

                for (let i = stars.length - 1; i >= 0; i--) {
                    const hit1 = Math.hypot(hero1.x - stars[i].x, hero1.y - stars[i].y) < hero1.r + stars[i].r;
                    const hit2 = isTwoPlayers && Math.hypot(hero2.x - stars[i].x, hero2.y - stars[i].y) < hero2.r + stars[i].r;
                    if (hit1 || hit2) {
                        stars.splice(i, 1);
                        addPoints(150);
                        drone.spd = Math.min(270, drone.spd + 6);
                        beep(820, 'sine', 0.055, 0.035);
                    }
                }
                if (!stars.length) { addPoints(300); stars = makeStars(); }
            },
            draw() {
                drawArcadeBg();
                stars.forEach(s => {
                    ctx.fillStyle = '#fbbf24';
                    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
                });
                ctx.fillStyle = '#fb7185';
                ctx.beginPath(); ctx.arc(drone.x, drone.y, drone.r, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = '#22d3ee';
                ctx.beginPath(); ctx.arc(hero1.x, hero1.y, hero1.r, 0, Math.PI * 2); ctx.fill();

                if (isTwoPlayers) {
                    ctx.fillStyle = '#34d399';
                    ctx.beginPath(); ctx.arc(hero2.x, hero2.y, hero2.r, 0, Math.PI * 2); ctx.fill();
                }
            }
        };
    }

    function createMineArcade() {
        const d = diffSpec();
        const mineChance = difficulty === 'easy' ? 0.12 : difficulty === 'hard' ? 0.22 : 0.16;
        const cols = 10, rows = 6, cw = 64, ch = 64;
        const ox = (canvas.width - cols * cw) / 2, oy = (canvas.height - rows * ch) / 2;
        let cur = { c: 0, r: 0 }, moveCd = 0;
        const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ mine: Math.random() < mineChance, open: false, flag: false })));
        return {
            update(dt) {
                moveCd -= dt;
                if (moveCd <= 0) {
                    if (p1.left) { cur.c = (cur.c + cols - 1) % cols; moveCd = 0.14 / d.speedMul; }
                    else if (p1.right) { cur.c = (cur.c + 1) % cols; moveCd = 0.14 / d.speedMul; }
                    else if (p1.up) { cur.r = (cur.r + rows - 1) % rows; moveCd = 0.14 / d.speedMul; }
                    else if (p1.down) { cur.r = (cur.r + 1) % rows; moveCd = 0.14 / d.speedMul; }
                }
                const cell = grid[cur.r][cur.c];
                if (justPressed.p1Secondary) { cell.flag = !cell.flag; beep(500, 'sine', 0.04, 0.03); }
                if (justPressed.p1Action && !cell.flag && !cell.open) {
                    cell.open = true;
                    if (cell.mine) { finishGame(); return; }
                    addPoints(100);
                    beep(640, 'triangle', 0.05, 0.035);
                }
            },
            draw() {
                drawArcadeBg();
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const cell = grid[r][c], x = ox + c * cw, y = oy + r * ch;
                        ctx.fillStyle = cell.open ? (cell.mine ? '#f87171' : '#1e293b') : '#334155';
                        ctx.fillRect(x + 2, y + 2, cw - 4, ch - 4);
                        if (cell.flag && !cell.open) {
                            ctx.fillStyle = '#fbbf24';
                            ctx.fillRect(x + 24, y + 16, 18, 28);
                        }
                        if (r === cur.r && c === cur.c) {
                            ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 3;
                            ctx.strokeRect(x + 2, y + 2, cw - 4, ch - 4);
                        }
                    }
                }
            }
        };
    }

    function createColorReflex() {
        const d = diffSpec();
        const box = { x: canvas.width / 2 - 40, y: canvas.height / 2 - 40, w: 80, h: 80, spd: 250 * d.speedMul };
        let target = { x: 180, y: 150, r: 24 }, timeLeft = 25;
        return {
            update(dt) {
                timeLeft -= dt;
                if (timeLeft <= 0) { finishGame(); return; }
                if (p1.left) box.x -= box.spd * dt;
                if (p1.right) box.x += box.spd * dt;
                if (p1.up) box.y -= box.spd * dt;
                if (p1.down) box.y += box.spd * dt;
                box.x = Math.max(10, Math.min(canvas.width - box.w - 10, box.x));
                box.y = Math.max(10, Math.min(canvas.height - box.h - 10, box.y));

                if (justPressed.p1Action) {
                    const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
                    if (Math.hypot(cx - target.x, cy - target.y) <= target.r + 36) {
                        addPoints(200);
                        target = { x: 60 + Math.random() * (canvas.width - 120), y: 60 + Math.random() * (canvas.height - 120), r: 22 };
                        beep(760, 'square', 0.055, 0.035);
                    }
                }
            },
            draw() {
                drawArcadeBg();
                ctx.fillStyle = '#fb7185';
                ctx.beginPath(); ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 3;
                ctx.strokeRect(box.x, box.y, box.w, box.h);
                ctx.fillStyle = '#f8fafc'; ctx.font = '15px Inter, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`Tempo rimasto: ${Math.max(0, timeLeft).toFixed(1)}s`, 16, 26);
            }
        };
    }

    const FACTORIES = {
        space_defender: createSpaceDefender,
        neon_breakout: createNeonBreakout,
        cyber_snake: createCyberSnake,
        sky_hopper: createSkyHopper,
        asteroid_dodger: createAsteroidDodger,
        turbo_drift: createTurboDrift,
        pulse_pong: createPulsePong,
        star_collector: createStarCollector,
        mine_arcade: createMineArcade,
        color_reflex: createColorReflex
    };

    function refreshModeAvailability() {
        const meta = getMeta();
        const btn2p = document.getElementById('btn-mode-2p');
        const btnRem = document.getElementById('btn-mode-remote');
        if (!meta.supports2P && playerMode !== '1p') {
            playerMode = '1p';
        }
        if (btn2p) btn2p.disabled = !meta.supports2P;
        if (btnRem) btnRem.disabled = !meta.supports2P;
        document.querySelectorAll('[data-pmode]').forEach(b => b.classList.toggle('active', b.dataset.pmode === playerMode));
        remotePanel?.classList.toggle('open', meta.supports2P && playerMode === '2p_remote');
    }

    async function loadGame(gameId) {
        currentGameId = FACTORIES[gameId] ? gameId : 'space_defender';
        const meta = getMeta();
        refreshModeAvailability();

        score = 0;
        scoreSaved = false;
        mode = 'PLAYING';
        bestScore = typeof RetroStorage !== 'undefined' ? await RetroStorage.getBestScore(currentGameId) : 0;
        engine = FACTORIES[currentGameId]();

        if (howToPlayEl) howToPlayEl.innerHTML = `<strong>Come si gioca:</strong> ${meta.howToPlay}`;
        if (controlsBanner) controlsBanner.innerHTML = `<strong>Comandi:</strong> ${meta.controlsHint}`;
        if (saveStatusEl) {
            saveStatusEl.innerHTML = 'Tastiera: <strong>Frecce / WASD</strong> • <strong>Spazio / Z / Invio</strong> • <strong>2P Stesso Schermo</strong>: P1 <strong>W/A/S/D + F</strong>, P2 <strong>Frecce + L</strong> • <strong>Controller Bluetooth/USB</strong>';
        }
        document.querySelectorAll('.picker-btn').forEach(b => b.classList.toggle('active', b.dataset.game === currentGameId));
        syncHud();
        beep(520, 'sine', 0.07, 0.035);
    }

    if (switcherEl) {
        switcherEl.innerHTML = RetroGamesCatalog.map(g =>
            `<button type="button" class="picker-btn ${g.id === currentGameId ? 'active' : ''}" data-game="${g.id}">${g.name}</button>`
        ).join('');
        switcherEl.querySelectorAll('.picker-btn').forEach(btn => {
            btn.addEventListener('click', () => loadGame(btn.dataset.game));
        });
    }

    document.querySelectorAll('[data-diff]').forEach(btn => {
        btn.addEventListener('click', () => {
            difficulty = btn.dataset.diff;
            document.querySelectorAll('[data-diff]').forEach(b => b.classList.toggle('active', b.dataset.diff === difficulty));
            loadGame(currentGameId);
        });
    });

    document.querySelectorAll('[data-pmode]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            playerMode = btn.dataset.pmode;
            refreshModeAvailability();
            loadGame(currentGameId);
        });
    });

    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
        const k = e.key.toLowerCase();
        const twoLocal = playerMode === '2p_local';

        if (twoLocal) {
            if (k === 'w') p1.up = true;
            if (k === 's') p1.down = true;
            if (k === 'a') p1.left = true;
            if (k === 'd') p1.right = true;
            if (k === 'f') { if (!p1.action) justPressed.p1Action = true; p1.action = true; }

            if (k === 'arrowup') p2.up = true;
            if (k === 'arrowdown') p2.down = true;
            if (k === 'arrowleft') p2.left = true;
            if (k === 'arrowright') p2.right = true;
            if (k === 'l') { if (!p2.action) justPressed.p2Action = true; p2.action = true; }
        } else {
            if (k === 'arrowup' || k === 'w') p1.up = true;
            if (k === 'arrowdown' || k === 's') p1.down = true;
            if (k === 'arrowleft' || k === 'a') p1.left = true;
            if (k === 'arrowright' || k === 'd') p1.right = true;
            if (k === ' ' || k === 'z' || k === 'enter') {
                if (!p1.action) justPressed.p1Action = true;
                p1.action = true;
                if (mode === 'GAMEOVER') loadGame(currentGameId);
            }
        }

        if (k === 'x' || k === 'b') { if (!p1.secondary) justPressed.p1Secondary = true; p1.secondary = true; }
        if (k === 'p') justPressed.pause = true;
        if (k === 'r') justPressed.restart = true;
        sendRemoteInput();
    });

    window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        const twoLocal = playerMode === '2p_local';

        if (twoLocal) {
            if (k === 'w') p1.up = false;
            if (k === 's') p1.down = false;
            if (k === 'a') p1.left = false;
            if (k === 'd') p1.right = false;
            if (k === 'f') p1.action = false;

            if (k === 'arrowup') p2.up = false;
            if (k === 'arrowdown') p2.down = false;
            if (k === 'arrowleft') p2.left = false;
            if (k === 'arrowright') p2.right = false;
            if (k === 'l') p2.action = false;
        } else {
            if (k === 'arrowup' || k === 'w') p1.up = false;
            if (k === 'arrowdown' || k === 's') p1.down = false;
            if (k === 'arrowleft' || k === 'a') p1.left = false;
            if (k === 'arrowright' || k === 'd') p1.right = false;
            if (k === ' ' || k === 'z' || k === 'enter') p1.action = false;
        }
        if (k === 'x' || k === 'b') p1.secondary = false;
        sendRemoteInput();
    });

    const bindPad = (id, keyName, isSecondary = false) => {
        const el = document.getElementById(id);
        if (!el) return;
        const setDown = (down) => (e) => {
            e.preventDefault();
            if (down && !p1[keyName]) {
                if (keyName === 'action') justPressed.p1Action = true;
                if (isSecondary) justPressed.p1Secondary = true;
            }
            p1[keyName] = down;
            el.classList.toggle('down', down);
            if (down && keyName === 'action' && mode === 'GAMEOVER') loadGame(currentGameId);
            sendRemoteInput();
        };
        el.addEventListener('pointerdown', setDown(true));
        el.addEventListener('pointerup', setDown(false));
        el.addEventListener('pointerleave', setDown(false));
        el.addEventListener('pointercancel', setDown(false));
    };

    bindPad('pad-up', 'up');
    bindPad('pad-down', 'down');
    bindPad('pad-left', 'left');
    bindPad('pad-right', 'right');
    bindPad('pad-a', 'action');
    bindPad('pad-b', 'secondary', true);

    document.getElementById('pad-b')?.addEventListener('click', () => {
        if (mode === 'PLAYING' || mode === 'PAUSED') {
            mode = mode === 'PLAYING' ? 'PAUSED' : 'PLAYING';
            syncHud();
        }
    });

    canvas.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'mouse' || mode !== 'PLAYING') return;
        const rect = canvas.getBoundingClientRect();
        const mid = rect.left + rect.width / 2;
        p1.left = e.clientX < mid - 18;
        p1.right = e.clientX > mid + 18;
        sendRemoteInput();
    });
    canvas.addEventListener('pointerup', (e) => {
        if (e.pointerType !== 'mouse') { p1.left = false; p1.right = false; sendRemoteInput(); }
    });

    function pollGamepad() {
        if (!navigator.getGamepads) return;
        const pads = navigator.getGamepads();
        const gp = pads && Array.from(pads).find(Boolean);
        if (!gp) return;

        const dz = 0.35;
        const axX = gp.axes[0] || 0;
        const axY = gp.axes[1] || 0;
        const b = gp.buttons || [];

        p1.left = axX < -dz || Boolean(b[14]?.pressed);
        p1.right = axX > dz || Boolean(b[15]?.pressed);
        p1.up = axY < -dz || Boolean(b[12]?.pressed);
        p1.down = axY > dz || Boolean(b[13]?.pressed);

        const aPressed = Boolean(b[0]?.pressed || b[2]?.pressed);
        if (aPressed && !p1.action) justPressed.p1Action = true;
        p1.action = aPressed;
        if (aPressed && mode === 'GAMEOVER') loadGame(currentGameId);

        if (b[9]?.pressed) justPressed.pause = true;
    }

    restartBtn?.addEventListener('click', () => loadGame(currentGameId));

    function loop(ts) {
        if (!lastTs) lastTs = ts;
        const dt = Math.min(0.05, (ts - lastTs) / 1000);
        lastTs = ts;

        pollGamepad();

        if (justPressed.restart) { justPressed.restart = false; loadGame(currentGameId); }
        if (justPressed.pause) {
            justPressed.pause = false;
            if (mode === 'PLAYING') { mode = 'PAUSED'; syncHud(); }
            else if (mode === 'PAUSED') { mode = 'PLAYING'; lastTs = performance.now(); syncHud(); }
        }

        if (mode === 'PLAYING' && engine) engine.update(dt);

        if (engine) engine.draw();

        ctx.textAlign = 'center';
        if (mode === 'PAUSED') {
            ctx.fillStyle = 'rgba(5, 8, 17, 0.78)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '22px "Press Start 2P", monospace';
            ctx.fillText('PAUSA', canvas.width / 2, canvas.height / 2);
        } else if (mode === 'GAMEOVER') {
            ctx.fillStyle = 'rgba(5, 8, 17, 0.82)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fb7185';
            ctx.font = '22px "Press Start 2P", monospace';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 14);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '15px Inter, sans-serif';
            ctx.fillText(`Punteggio: ${score} — Premi Azione o Nuova Partita`, canvas.width / 2, canvas.height / 2 + 22);
        }

        justPressed.p1Action = false;
        justPressed.p1Secondary = false;
        justPressed.p2Action = false;
        justPressed.p2Secondary = false;
        requestAnimationFrame(loop);
    }

    await loadGame(currentGameId);
    requestAnimationFrame(loop);
});