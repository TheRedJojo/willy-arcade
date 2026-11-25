/**
 * Space Defender - Gioco originale HTML5 Canvas con controlli tastiera + pad virtuale mobile/desktop
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

    let audioCtx = null;
    function playTone(freq, type = 'square', duration = 0.08, volume = 0.05) {
        try {
            if (!audioCtx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) audioCtx = new AudioCtx();
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
            // Ignora eventuali blocchi audio del browser
        }
    }

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
    let enemySpeed = 58;
    let scoreSavedForRun = false;

    const player = {
        width: 48,
        height: 26,
        x: canvas.width / 2 - 24,
        y: canvas.height - 50,
        speed: 420,
        invulnerableTimer: 0
    };

    let playerBullets = [];
    let enemyBullets = [];
    let enemies = [];
    let particles = [];
    const stars = Array.from({ length: 70 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 45 + 16
    }));

    function updateHUD() {
        hudScore.textContent = score.toLocaleString('it-IT');
        hudBest.textContent = bestScore.toLocaleString('it-IT');
        hudWave.textContent = wave;
        hudLives.textContent = lives > 0 ? '♥'.repeat(lives) : '0';
    }

    function spawnWave(waveNumber) {
        enemies = [];
        const rows = Math.min(5, 3 + Math.floor((waveNumber - 1) / 2));
        const cols = Math.min(10, 7 + Math.floor(waveNumber / 2));
        const spacingX = 64;
        const spacingY = 42;
        const startX = (canvas.width - (cols - 1) * spacingX) / 2;
        const startY = 62;

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
        enemySpeed = 58 + waveNumber * 14;
    }

    function createExplosion(x, y, color, count = 16) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 170 + 40;
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: Math.random() * 0.4 + 0.2,
                maxLife: 0.6,
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
        saveStatusEl.innerHTML = 'In gioco — Difendi il settore e fai record!';
        updateHUD();
        playTone(540, 'square', 0.12);
    }

    function togglePause() {
        if (state === 'PLAYING') {
            state = 'PAUSED';
            saveStatusEl.innerHTML = 'Gioco in <strong>PAUSA</strong> — Premi P o ⏸ per riprendere.';
        } else if (state === 'PAUSED') {
            state = 'PLAYING';
            lastTime = performance.now();
            saveStatusEl.innerHTML = 'In gioco — Difendi il settore e fai record!';
        }
    }

    async function triggerGameOver() {
        if (state === 'GAMEOVER') return;
        state = 'GAMEOVER';
        playTone(140, 'sawtooth', 0.42, 0.08);

        if (!scoreSavedForRun && typeof RetroStorage !== 'undefined' && score > 0) {
            scoreSavedForRun = true;
            const saved = await RetroStorage.recordScore(GAME_ID, GAME_NAME, score);
            bestScore = saved.bestScore;
            updateHUD();
            saveStatusEl.innerHTML = `<span class="status-ok">✔ Salvato in classifica: ${score.toLocaleString('it-IT')} pt</span> (SHA-256: <code>${saved.entry.hash.slice(0, 12)}...</code>)`;
        } else {
            saveStatusEl.innerHTML = 'Game Over — Premi <strong>Spazio</strong>, <strong>R</strong> o <strong>Nuova Partita</strong>.';
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
        for (const s of stars) {
            s.y += s.speed * dt;
            if (s.y > canvas.height) {
                s.y = 0;
                s.x = Math.random() * canvas.width;
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) particles.splice(i, 1);
        }

        if (state !== 'PLAYING') return;

        if (keys.left) player.x -= player.speed * dt;
        if (keys.right) player.x += player.speed * dt;
        player.x = Math.max(16, Math.min(canvas.width - player.width - 16, player.x));

        if (player.invulnerableTimer > 0) {
            player.invulnerableTimer -= dt;
        }

        shootCooldown -= dt;
        if (keys.fire && shootCooldown <= 0) {
            playerBullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y - 10,
                width: 4,
                height: 14,
                speed: 580
            });
            shootCooldown = 0.22;
            playTone(780, 'square', 0.06, 0.035);
        }

        for (let i = playerBullets.length - 1; i >= 0; i--) {
            const b = playerBullets[i];
            b.y -= b.speed * dt;
            if (b.y + b.height < 0) {
                playerBullets.splice(i, 1);
                continue;
            }

            for (let j = enemies.length - 1; j >= 0; j--) {
                const e = enemies[j];
                if (rectsOverlap(b, e)) {
                    playerBullets.splice(i, 1);
                    enemies.splice(j, 1);
                    score += e.points;
                    if (score > bestScore) bestScore = score;
                    updateHUD();
                    createExplosion(e.x + e.width / 2, e.y + e.height / 2, '#38bdf8', 14);
                    playTone(290, 'triangle', 0.08, 0.06);
                    break;
                }
            }
        }

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

        enemyShootTimer -= dt;
        if (enemyShootTimer <= 0 && enemies.length > 0) {
            const shooter = enemies[Math.floor(Math.random() * enemies.length)];
            enemyBullets.push({
                x: shooter.x + shooter.width / 2 - 3,
                y: shooter.y + shooter.height,
                width: 6,
                height: 14,
                speed: 255 + wave * 20
            });
            enemyShootTimer = Math.max(0.45, 1.3 - wave * 0.1);
        }

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
                createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#f472b6', 22);
                playTone(125, 'sawtooth', 0.24, 0.07);

                if (lives <= 0) {
                    triggerGameOver();
                    return;
                }
            }
        }

        if (enemies.length === 0) {
            wave += 1;
            score += 500;
            if (score > bestScore) bestScore = score;
            updateHUD();
            spawnWave(wave);
            playTone(660, 'sine', 0.2, 0.06);
        }
    }

    function drawPlayer() {
        if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer * 14) % 2 === 0) {
            return;
        }
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y);
        ctx.lineTo(player.x + player.width, player.y + player.height);
        ctx.lineTo(player.x + player.width * 0.72, player.y + player.height - 6);
        ctx.lineTo(player.x + player.width * 0.28, player.y + player.height - 6);
        ctx.lineTo(player.x, player.y + player.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(player.x + player.width / 2 - 4, player.y + 10, 8, 8);
        ctx.restore();
    }

    function drawEnemies() {
        const rowColors = ['#f472b6', '#fbbf24', '#34d399', '#38bdf8', '#c084fc'];
        for (const e of enemies) {
            const color = rowColors[e.row % rowColors.length];
            ctx.save();
            ctx.fillStyle = color;
            ctx.fillRect(e.x + 6, e.y + 4, e.width - 12, e.height - 8);
            ctx.fillRect(e.x, e.y + 8, e.width, e.height - 14);
            ctx.fillRect(e.x + 4, e.y, 4, 4);
            ctx.fillRect(e.x + e.width - 8, e.y, 4, 4);
            ctx.fillRect(e.x + 4, e.y + e.height - 4, 5, 4);
            ctx.fillRect(e.x + e.width - 9, e.y + e.height - 4, 5, 4);

            ctx.fillStyle = '#060811';
            ctx.fillRect(e.x + 10, e.y + 9, 4, 4);
            ctx.fillRect(e.x + e.width - 14, e.y + 9, 4, 4);
            ctx.restore();
        }
    }

    function drawOverlay(title, subtitle, accent = '#38bdf8') {
        ctx.save();
        ctx.fillStyle = 'rgba(6, 8, 17, 0.78)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = accent;
        ctx.font = '24px "Press Start 2P", monospace';
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 22);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '15px Inter, sans-serif';
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 22);
        ctx.restore();
    }

    function render() {
        ctx.fillStyle = '#060811';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(248, 250, 252, 0.72)';
        for (const s of stars) {
            ctx.fillRect(s.x, s.y, s.size, s.size);
        }

        drawPlayer();
        drawEnemies();

        ctx.fillStyle = '#34d399';
        for (const b of playerBullets) ctx.fillRect(b.x, b.y, b.width, b.height);

        ctx.fillStyle = '#f472b6';
        for (const eb of enemyBullets) ctx.fillRect(eb.x, eb.y, eb.width, eb.height);

        for (const p of particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 4, 4);
            ctx.restore();
        }

        if (state === 'START') {
            drawOverlay('SPACE DEFENDER', 'Premi SPAZIO, FUOCO o "Nuova Partita" per iniziare', '#38bdf8');
        } else if (state === 'PAUSED') {
            drawOverlay('PAUSA', 'Premi P o ⏸ per riprendere', '#fbbf24');
        } else if (state === 'GAMEOVER') {
            drawOverlay('GAME OVER', `Punteggio: ${score} — Premi SPAZIO o R per rigiocare`, '#f472b6');
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

    window.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
        if (e.key === ' ' || e.code === 'Space' || e.key === 'z' || e.key === 'Z' || e.key === 'j' || e.key === 'J') {
            keys.fire = true;
            if (state === 'START' || state === 'GAMEOVER') startNewGame();
        }
        if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
            togglePause();
        }
        if (e.key === 'r' || e.key === 'R') {
            startNewGame();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
        if (e.key === ' ' || e.code === 'Space' || e.key === 'z' || e.key === 'Z' || e.key === 'j' || e.key === 'J') {
            keys.fire = false;
        }
    });

    const bindHoldPad = (id, keyName) => {
        const el = document.getElementById(id);
        if (!el) return;
        const press = (isDown) => (e) => {
            e.preventDefault();
            keys[keyName] = isDown;
            el.classList.toggle('is-pressed', isDown);
            if (isDown && keyName === 'fire' && (state === 'START' || state === 'GAMEOVER')) {
                startNewGame();
            }
        };
        el.addEventListener('pointerdown', press(true));
        el.addEventListener('pointerup', press(false));
        el.addEventListener('pointerleave', press(false));
        el.addEventListener('pointercancel', press(false));
    };

    bindHoldPad('pad-left', 'left');
    bindHoldPad('pad-right', 'right');
    bindHoldPad('pad-fire', 'fire');

    const pauseBtn = document.getElementById('pad-pause');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            togglePause();
        });
    }

    // Trascinamento orizzontale diretto sul canvas per mobile/tablet
    canvas.addEventListener('pointermove', (e) => {
        if (state !== 'PLAYING' || e.pointerType === 'mouse') return;
        const rect = canvas.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width) * canvas.width;
        player.x = Math.max(16, Math.min(canvas.width - player.width - 16, relX - player.width / 2));
    });

    restartBtn.addEventListener('click', startNewGame);

    updateHUD();
    requestAnimationFrame(gameLoop);
});