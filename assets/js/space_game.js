/**
 * Space Defender - Mini-gioco arcade completo in HTML5 Canvas + JS Vanilla
 */
document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const hudScore = document.getElementById('hud-score');
    const hudBest = document.getElementById('hud-best');
    const hudWave = document.getElementById('hud-wave');
    const hudLives = document.getElementById('hud-lives');
    const saveStatusEl = document.getElementById('game-save-status');
    const restartBtn = document.getElementById('btn-restart-game');

    const GAME_ID = 'space_defender';
    const GAME_NAME = 'Space Defender';

    // Sintetizzatore retro leggero con Web Audio API (nessun asset audio esterno necessario)
    let audioCtx = null;
    function playTone(freq, type = 'square', duration = 0.08, volume = 0.06) {
        try {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) audioCtx = new AudioContextClass();
            }
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(volume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (_) {
            // Ignora blocchi autoplay se l'utente non ha ancora interagito
        }
    }

    // Stato di gioco
    const keys = { left: false, right: false, fire: false };
    let state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'
    let score = 0;
    let bestScore = typeof RetroStorage !== 'undefined' ? await RetroStorage.getBestScore(GAME_ID) : 0;
    let wave = 1;
    let lives = 3;
    let lastTime = 0;
    let shootCooldown = 0;
    let enemyShootTimer = 0;
    let enemyDirection = 1;
    let enemySpeed = 55;
    let scoreSavedForRun = false;

    const player = {
        width: 46,
        height: 26,
        x: canvas.width / 2 - 23,
        y: canvas.height - 52,
        speed: 380,
        invulnerableTimer: 0
    };

    let playerBullets = [];
    let enemyBullets = [];
    let enemies = [];
    let particles = [];
    const stars = Array.from({ length: 75 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 45 + 15
    }));

    function updateHUD() {
        hudScore.textContent = score.toLocaleString('it-IT');
        hudBest.textContent = bestScore.toLocaleString('it-IT');
        hudWave.textContent = wave;
        hudLives.textContent = '♥'.repeat(Math.max(0, lives)) || '0';
    }

    function spawnWave(waveNumber) {
        enemies = [];
        const rows = Math.min(5, 3 + Math.floor((waveNumber - 1) / 2));
        const cols = Math.min(10, 7 + Math.floor(waveNumber / 2));
        const spacingX = 62;
        const spacingY = 44;
        const startX = (canvas.width - (cols - 1) * spacingX) / 2;
        const startY = 65;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                enemies.push({
                    x: startX + c * spacingX - 18,
                    y: startY + r * spacingY,
                    width: 36,
                    height: 24,
                    row: r,
                    points: (rows - r) * 100
                });
            }
        }
        enemyDirection = 1;
        enemySpeed = 55 + waveNumber * 14;
    }

    function createExplosion(x, y, color, count = 16) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 160 + 40;
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: Math.random() * 0.45 + 0.2,
                maxLife: 0.65,
                color
            });
        }
    }

    function startNewGame() {
        score = 0;
        wave = 1;
        lives = 3;
        scoreSavedForRun = false;
        player.x = canvas.width / 2 - player.width / 2;
        player.invulnerableTimer = 1.0;
        playerBullets = [];
        enemyBullets = [];
        particles = [];
        spawnWave(wave);
        state = 'PLAYING';
        saveStatusEl.innerHTML = 'Partita in corso — Distruggi la flotta aliena!';
        updateHUD();
        playTone(520, 'square', 0.12);
    }

    async function triggerGameOver() {
        if (state === 'GAMEOVER') return;
        state = 'GAMEOVER';
        playTone(140, 'sawtooth', 0.45, 0.09);

        if (!scoreSavedForRun && typeof RetroStorage !== 'undefined' && score > 0) {
            scoreSavedForRun = true;
            const saved = await RetroStorage.recordScore(GAME_ID, GAME_NAME, score);
            bestScore = saved.bestScore;
            updateHUD();
            saveStatusEl.innerHTML = `<span class="status-ok">✔ Punteggio ${score} salvato! SHA-256: ${saved.entry.hash.slice(0, 14)}...</span>`;
        } else {
            saveStatusEl.innerHTML = 'Game Over! Premi <strong>Spazio</strong> o <strong>Nuova Partita</strong> per riprovare.';
        }
    }

    function rectsOverlap(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function update(dt) {
        // Stelle di sfondo sempre animate
        for (const s of stars) {
            s.y += s.speed * dt;
            if (s.y > canvas.height) {
                s.y = 0;
                s.x = Math.random() * canvas.width;
            }
        }

        // Particelle
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) particles.splice(i, 1);
        }

        if (state !== 'PLAYING') return;

        // Movimento giocatore
        if (keys.left) player.x -= player.speed * dt;
        if (keys.right) player.x += player.speed * dt;
        player.x = Math.max(16, Math.min(canvas.width - player.width - 16, player.x));

        if (player.invulnerableTimer > 0) {
            player.invulnerableTimer -= dt;
        }

        // Sparo giocatore
        shootCooldown -= dt;
        if (keys.fire && shootCooldown <= 0) {
            playerBullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y - 10,
                width: 4,
                height: 14,
                speed: 560
            });
            shootCooldown = 0.24;
            playTone(760, 'square', 0.06, 0.04);
        }

        // Aggiornamento proiettili giocatore
        for (let i = playerBullets.length - 1; i >= 0; i--) {
            const b = playerBullets[i];
            b.y -= b.speed * dt;
            if (b.y + b.height < 0) {
                playerBullets.splice(i, 1);
                continue;
            }

            // Collisione con nemici
            for (let j = enemies.length - 1; j >= 0; j--) {
                const e = enemies[j];
                if (rectsOverlap(b, e)) {
                    playerBullets.splice(i, 1);
                    enemies.splice(j, 1);
                    score += e.points;
                    if (score > bestScore) bestScore = score;
                    updateHUD();
                    createExplosion(e.x + e.width / 2, e.y + e.height / 2, '#00f3ff', 14);
                    playTone(280, 'triangle', 0.09, 0.07);
                    break;
                }
            }
        }

        // Movimento sciame nemico
        let hitEdge = false;
        const speedBoost = 1 + (1 - Math.min(enemies.length, 35) / 35) * 0.9;
        for (const e of enemies) {
            e.x += enemyDirection * enemySpeed * speedBoost * dt;
            if (e.x <= 18 || e.x + e.width >= canvas.width - 18) {
                hitEdge = true;
            }
        }

        if (hitEdge) {
            enemyDirection *= -1;
            for (const e of enemies) {
                e.y += 18;
                if (e.y + e.height >= player.y) {
                    lives = 0;
                    updateHUD();
                    triggerGameOver();
                    return;
                }
            }
        }

        // Sparo nemico
        enemyShootTimer -= dt;
        if (enemyShootTimer <= 0 && enemies.length > 0) {
            const shooter = enemies[Math.floor(Math.random() * enemies.length)];
            enemyBullets.push({
                x: shooter.x + shooter.width / 2 - 3,
                y: shooter.y + shooter.height,
                width: 6,
                height: 14,
                speed: 250 + wave * 22
            });
            enemyShootTimer = Math.max(0.45, 1.35 - wave * 0.1);
        }

        // Aggiornamento proiettili nemici
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            const eb = enemyBullets[i];
            eb.y += eb.speed * dt;
            if (eb.y > canvas.height) {
                enemyBullets.splice(i, 1);
                continue;
            }

            if (player.invulnerableTimer <= 0 && rectsOverlap(eb, player)) {
                enemyBullets.splice(i, 1);
                lives -= 1;
                player.invulnerableTimer = 1.6;
                updateHUD();
                createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ff2a85', 22);
                playTone(120, 'sawtooth', 0.25, 0.08);

                if (lives <= 0) {
                    triggerGameOver();
                    return;
                }
            }
        }

        // Ondata completata
        if (enemies.length === 0) {
            wave += 1;
            score += 500;
            if (score > bestScore) bestScore = score;
            updateHUD();
            spawnWave(wave);
            playTone(660, 'sine', 0.2, 0.07);
        }
    }

    function drawPlayer() {
        if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer * 14) % 2 === 0) {
            return;
        }
        ctx.save();
        ctx.fillStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 12;

        // Scafo principale navicella pixel-style
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.lineTo(player.x + player.width * 0.72, player.y + player.height - 6);
        ctx.lineTo(player.x + player.width * 0.28, player.y + player.height - 6);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();

        // Cabina centrale
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x + player.width / 2 - 4, player.y + 10, 8, 8);
        ctx.restore();
    }

    function drawEnemies() {
        const rowColors = ['#ff2a85', '#facc15', '#00ff88', '#38bdf8', '#c084fc'];
        for (const e of enemies) {
            const color = rowColors[e.row % rowColors.length];
            ctx.save();
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;

            // Corpo alieno
            ctx.fillRect(e.x + 6, e.y + 4, e.width - 12, e.height - 8);
            ctx.fillRect(e.x, e.y + 8, e.width, e.height - 14);
            // Antenne / zampe
            ctx.fillRect(e.x + 4, e.y, 4, 4);
            ctx.fillRect(e.x + e.width - 8, e.y, 4, 4);
            ctx.fillRect(e.x + 4, e.y + e.height - 4, 5, 4);
            ctx.fillRect(e.x + e.width - 9, e.y + e.height - 4, 5, 4);

            // Occhi
            ctx.fillStyle = '#05060b';
            ctx.fillRect(e.x + 10, e.y + 9, 4, 4);
            ctx.fillRect(e.x + e.width - 14, e.y + 9, 4, 4);
            ctx.restore();
        }
    }

    function drawOverlayMessage(title, subtitle, accent = '#00f3ff') {
        ctx.save();
        ctx.fillStyle = 'rgba(5, 7, 15, 0.78)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = accent;
        ctx.font = '26px "Press Start 2P", monospace';
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 24);

        ctx.fillStyle = '#f1f5f9';
        ctx.font = '15px Inter, sans-serif';
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 24);
        ctx.restore();
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sfondo spazio
        ctx.fillStyle = '#04050a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        for (const s of stars) {
            ctx.fillRect(s.x, s.y, s.size, s.size);
        }

        drawPlayer();
        drawEnemies();

        // Proiettili giocatore
        ctx.fillStyle = '#00ff88';
        for (const b of playerBullets) {
            ctx.fillRect(b.x, b.y, b.width, b.height);
        }

        // Proiettili nemici
        ctx.fillStyle = '#ff2a85';
        for (const eb of enemyBullets) {
            ctx.fillRect(eb.x, eb.y, eb.width, eb.height);
        }

        // Particelle
        for (const p of particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 4, 4);
            ctx.restore();
        }

        if (state === 'START') {
            drawOverlayMessage('SPACE DEFENDER', 'Premi SPAZIO o clicca "Nuova Partita" per iniziare', '#00f3ff');
        } else if (state === 'PAUSED') {
            drawOverlayMessage('PAUSA', 'Premi P per riprendere la partita', '#facc15');
        } else if (state === 'GAMEOVER') {
            drawOverlayMessage('GAME OVER', `Punteggio finale: ${score} — Premi SPAZIO per rigiocare`, '#ff2a85');
        }
    }

    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
        lastTime = timestamp;

        update(dt);
        render();
        requestAnimationFrame(gameLoop);
    }

    // Eventi tastiera
    window.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
        if (e.key === ' ' || e.code === 'Space') {
            keys.fire = true;
            if (state === 'START' || state === 'GAMEOVER') {
                startNewGame();
            }
        }
        if ((e.key === 'p' || e.key === 'P') && (state === 'PLAYING' || state === 'PAUSED')) {
            state = state === 'PLAYING' ? 'PAUSED' : 'PLAYING';
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
        if (e.key === ' ' || e.code === 'Space') keys.fire = false;
    });

    // Eventi Touch Mobile
    const bindHoldButton = (id, keyName) => {
        const el = document.getElementById(id);
        if (!el) return;
        const setPressed = (val) => (e) => {
            e.preventDefault();
            keys[keyName] = val;
            if (val && keyName === 'fire' && (state === 'START' || state === 'GAMEOVER')) {
                startNewGame();
            }
        };
        el.addEventListener('touchstart', setPressed(true), { passive: false });
        el.addEventListener('touchend', setPressed(false));
        el.addEventListener('mousedown', setPressed(true));
        el.addEventListener('mouseup', setPressed(false));
        el.addEventListener('mouseleave', setPressed(false));
    };

    bindHoldButton('touch-left', 'left');
    bindHoldButton('touch-right', 'right');
    bindHoldButton('touch-fire', 'fire');

    restartBtn.addEventListener('click', startNewGame);

    updateHUD();
    requestAnimationFrame(gameLoop);
});