var $ = function(cls) { return app.el.querySelector("." + cls); };

// ─── Constants ────────────────────────────────────────────────────────────────
var COLS = 13;
var ROWS = 13;

var EMPTY        = 0;
var WALL         = 1;
var BLOCK        = 2;
var POWERUP_BOMB  = 3;
var POWERUP_RANGE = 4;
var POWERUP_SPEED = 5;

var MOVE_COOLDOWN_NORMAL = 150;
var MOVE_COOLDOWN_FAST   = 80;
var BOMB_FUSE_MS         = 2000;
var FLAME_DURATION_MS    = 600;
var ENEMY_MOVE_MS        = 400;

// ─── Colors ───────────────────────────────────────────────────────────────────
var COLOR = {
    empty:          "#2a2418",
    wall:           "#5a4e3c",
    block:          "#8b6e4e",
    blockHighlight: "#a07d5a",
    bombBody:       "#3a3028",
    bombFuse:       "#e8d5a0",
    flameCenter:    "#c47860",
    flameArm:       "#d4936a",
    playerBody:     "#6dbfaa",
    playerHead:     "#e8d5a0",
    enemyBody:      "#c47860",
    enemyHead:      "#e8d5a0",
    puBomb:         "#6e90b8",
    puRange:        "#88b06e",
    puSpeed:        "#b08aba"
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
var canvas     = $("db-canvas");
var ctx        = canvas.getContext("2d");
var hudLives   = $("db-lives-val");
var hudBombs   = $("db-bombs-val");
var hudRange   = $("db-range-val");
var hudScore   = $("db-score-val");
var overlay    = $("db-overlay");
var overlayTitle = $("db-overlay-title");
var overlaySub   = $("db-overlay-sub");
var restartBtn   = $("db-restart-btn");

app.el.style.height = "100%";

// ─── Game state ───────────────────────────────────────────────────────────────
var tileSize;
var grid;               // [row][col] → EMPTY | WALL | BLOCK | POWERUP_*
var bombs;              // [{col, row, timer, range, owner}]
var flames;             // [{col, row, expireAt, isCenter}]
var powerups;           // [{col, row, type}]
var player;             // {col, row, lives, maxBombs, activeBombs, range, speed, moveCooldown, lastMoveTime, dead, deadTimer, invincible, invincibleTimer}
var enemies;            // [{col, row, alive, dir, moveTimer}]
var score;
var gameOver;
var gameWon;
var rafId;

// ─── Canvas sizing ────────────────────────────────────────────────────────────
function sizeCanvas() {
    var body = app.win.body;
    var w = (body.clientWidth  || 500) - 100;
    var h =  body.clientHeight || 500;
    tileSize = Math.floor(Math.min(w / COLS, h / ROWS));
    if (tileSize < 1) tileSize = 1;
    canvas.width  = tileSize * COLS;
    canvas.height = tileSize * ROWS;
    canvas.style.width  = canvas.width  + "px";
    canvas.style.height = canvas.height + "px";
}

app.win.on("resize", function() {
    sizeCanvas();
    draw();
});

// ─── Map generation ───────────────────────────────────────────────────────────
function buildGrid() {
    var g = [];
    var r, c;
    for (r = 0; r < ROWS; r++) {
        g[r] = [];
        for (c = 0; c < COLS; c++) {
            // border and every-other interior cell = indestructible wall
            if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
                g[r][c] = WALL;
            } else if (r % 2 === 0 && c % 2 === 0) {
                g[r][c] = WALL;
            } else {
                g[r][c] = EMPTY;
            }
        }
    }

    // Safe zones around player start (top-left inner corner = 1,1)
    var safe = [[1,1],[1,2],[2,1],[ROWS-2,COLS-2],[ROWS-2,COLS-3],[ROWS-3,COLS-2]];
    function isSafe(row, col) {
        for (var i = 0; i < safe.length; i++) {
            if (safe[i][0] === row && safe[i][1] === col) return true;
        }
        return false;
    }

    // Fill remaining empty cells with blocks (~70% density)
    for (r = 0; r < ROWS; r++) {
        for (c = 0; c < COLS; c++) {
            if (g[r][c] === EMPTY && !isSafe(r, c)) {
                if (Math.random() < 0.70) g[r][c] = BLOCK;
            }
        }
    }
    return g;
}

// ─── Player init ──────────────────────────────────────────────────────────────
function makePlayer() {
    return {
        col: 1, row: 1,
        lives: 3,
        maxBombs: 1,
        activeBombs: 0,
        range: 2,
        speed: false,
        moveCooldown: MOVE_COOLDOWN_NORMAL,
        lastMoveTime: 0,
        dead: false,
        deadTimer: 0,
        invincible: false,
        invincibleTimer: 0
    };
}

// ─── Enemy init ───────────────────────────────────────────────────────────────
var DIRS = [
    { dc:  0, dr: -1 },  // up
    { dc:  0, dr:  1 },  // down
    { dc: -1, dr:  0 },  // left
    { dc:  1, dr:  0 }   // right
];

function makeEnemy(col, row) {
    return {
        col: col, row: row,
        alive: true,
        dir: Math.floor(Math.random() * 4),
        moveTimer: ENEMY_MOVE_MS * (0.6 + Math.random() * 0.8)
    };
}

// ─── HUD update ───────────────────────────────────────────────────────────────
function updateHUD() {
    hudLives.textContent = player.lives;
    hudBombs.textContent = (player.maxBombs - player.activeBombs) + "/" + player.maxBombs;
    hudRange.textContent = player.range;
    hudScore.textContent = score;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────
function showOverlay(title, sub) {
    overlayTitle.textContent = title;
    overlaySub.textContent   = sub;
    overlay.classList.add("visible");
}

function hideOverlay() {
    overlay.classList.remove("visible");
}

// ─── Cell helpers ─────────────────────────────────────────────────────────────
function isWalkable(col, row) {
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
    var cell = grid[row][col];
    return cell === EMPTY || cell === POWERUP_BOMB || cell === POWERUP_RANGE || cell === POWERUP_SPEED;
}

function isPowerup(type) {
    return type === POWERUP_BOMB || type === POWERUP_RANGE || type === POWERUP_SPEED;
}

// ─── Bomb placement ───────────────────────────────────────────────────────────
function placeBomb(col, row) {
    if (player.activeBombs >= player.maxBombs) return;
    // Don't place if there's already a bomb here
    for (var i = 0; i < bombs.length; i++) {
        if (bombs[i].col === col && bombs[i].row === row) return;
    }
    player.activeBombs++;
    bombs.push({
        col: col, row: row,
        timer: BOMB_FUSE_MS,
        range: player.range
    });
}

// ─── Explosion ────────────────────────────────────────────────────────────────
function explodeBomb(bomb) {
    player.activeBombs = Math.max(0, player.activeBombs - 1);
    var now = performance.now();
    var expireAt = now + FLAME_DURATION_MS;

    function addFlame(c, r, isCenter) {
        // remove any existing flame at same cell (refresh)
        for (var k = 0; k < flames.length; k++) {
            if (flames[k].col === c && flames[k].row === r) {
                flames.splice(k, 1);
                break;
            }
        }
        flames.push({ col: c, row: r, expireAt: expireAt, isCenter: isCenter });
    }

    addFlame(bomb.col, bomb.row, true);

    // Spread in 4 directions
    for (var d = 0; d < 4; d++) {
        var dc = DIRS[d].dc;
        var dr = DIRS[d].dr;
        for (var step = 1; step <= bomb.range; step++) {
            var fc = bomb.col + dc * step;
            var fr = bomb.row + dr * step;
            if (fc < 0 || fc >= COLS || fr < 0 || fr >= ROWS) break;
            var cell = grid[fr][fc];
            if (cell === WALL) break;
            addFlame(fc, fr, false);
            if (cell === BLOCK) {
                // destroy block
                score += 10;
                // spawn powerup ~30%
                if (Math.random() < 0.30) {
                    var puType = [POWERUP_BOMB, POWERUP_RANGE, POWERUP_SPEED][Math.floor(Math.random() * 3)];
                    grid[fr][fc] = puType;
                } else {
                    grid[fr][fc] = EMPTY;
                }
                updateHUD();
                break; // flame stops at block
            }
            // chain-explode other bombs
            for (var bi = 0; bi < bombs.length; bi++) {
                if (bombs[bi].col === fc && bombs[bi].row === fr && bombs[bi] !== bomb) {
                    bombs[bi].timer = 0; // will explode next tick
                }
            }
        }
    }
}

// ─── Flame check ─────────────────────────────────────────────────────────────
function isOnFlame(col, row) {
    for (var i = 0; i < flames.length; i++) {
        if (flames[i].col === col && flames[i].row === row) return true;
    }
    return false;
}

// ─── Player death ─────────────────────────────────────────────────────────────
function killPlayer() {
    player.lives--;
    updateHUD();
    if (player.lives <= 0) {
        gameOver = true;
        showOverlay("GAME OVER", "Score: " + score);
        return;
    }
    // Respawn with brief invincibility
    player.col = 1;
    player.row = 1;
    player.invincible = true;
    player.invincibleTimer = 2000; // 2s invincible after respawn
}

// ─── Enemy AI ─────────────────────────────────────────────────────────────────
function updateEnemy(enemy, delta) {
    if (!enemy.alive) return;
    enemy.moveTimer -= delta;
    if (enemy.moveTimer > 0) return;
    enemy.moveTimer = ENEMY_MOVE_MS * (0.5 + Math.random() * 0.5);

    // Try current direction; if blocked, pick a new random one
    var tries = 0;
    while (tries < 8) {
        var dc = DIRS[enemy.dir].dc;
        var dr = DIRS[enemy.dir].dr;
        var nc = enemy.col + dc;
        var nr = enemy.row + dr;
        if (isWalkable(nc, nr)) {
            // Don't walk onto a bomb cell
            var onBomb = false;
            for (var bi = 0; bi < bombs.length; bi++) {
                if (bombs[bi].col === nc && bombs[bi].row === nr) { onBomb = true; break; }
            }
            if (!onBomb) {
                enemy.col = nc;
                enemy.row = nr;
                break;
            }
        }
        enemy.dir = Math.floor(Math.random() * 4);
        tries++;
    }
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────
function fillCell(col, row, color) {
    ctx.fillStyle = color;
    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
}

function fillCellInset(col, row, color, inset) {
    ctx.fillStyle = color;
    ctx.fillRect(
        col * tileSize + inset,
        row * tileSize + inset,
        tileSize - inset * 2,
        tileSize - inset * 2
    );
}

function drawBomb(col, row) {
    var cx = col * tileSize + tileSize / 2;
    var cy = row * tileSize + tileSize / 2;
    var r  = tileSize * 0.36;
    ctx.fillStyle = COLOR.bombBody;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    // fuse dot
    ctx.fillStyle = COLOR.bombFuse;
    ctx.beginPath();
    ctx.arc(cx + r * 0.5, cy - r * 0.7, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
    // fuse line
    ctx.strokeStyle = COLOR.bombFuse;
    ctx.lineWidth = Math.max(1, tileSize * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.3, cy - r * 0.5);
    ctx.quadraticCurveTo(cx + r * 0.7, cy - r * 1.1, cx + r * 0.5, cy - r * 0.9);
    ctx.stroke();
}

function drawFlame(col, row, isCenter) {
    var pad = tileSize * 0.1;
    var s   = tileSize - pad * 2;
    var x   = col * tileSize + pad;
    var y   = row * tileSize + pad;
    ctx.fillStyle = isCenter ? COLOR.flameCenter : COLOR.flameArm;
    // Draw a cross shape
    var third = s / 3;
    ctx.fillRect(x + third, y,         third, s);
    ctx.fillRect(x,         y + third, s,     third);
}

function drawPowerup(col, row, type) {
    var inset = tileSize * 0.22;
    var color = type === POWERUP_BOMB ? COLOR.puBomb : (type === POWERUP_RANGE ? COLOR.puRange : COLOR.puSpeed);
    fillCell(col, row, COLOR.empty);
    ctx.fillStyle = color;
    ctx.fillRect(
        col * tileSize + inset,
        row * tileSize + inset,
        tileSize - inset * 2,
        tileSize - inset * 2
    );
    // small icon letter
    ctx.fillStyle = "#fff";
    ctx.font = "bold " + Math.floor(tileSize * 0.38) + "px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var letter = type === POWERUP_BOMB ? "B" : (type === POWERUP_RANGE ? "R" : "S");
    ctx.fillText(letter, col * tileSize + tileSize / 2, row * tileSize + tileSize / 2);
}

function drawEntity(col, row, bodyColor, headColor, alpha) {
    ctx.globalAlpha = alpha !== undefined ? alpha : 1;
    var inset  = tileSize * 0.12;
    var bodyH  = tileSize * 0.55;
    var headR  = tileSize * 0.22;
    var bodyX  = col * tileSize + inset;
    var bodyY  = row * tileSize + tileSize * 0.38;
    var bodyW  = tileSize - inset * 2;
    // body
    ctx.fillStyle = bodyColor;
    ctx.fillRect(bodyX, bodyY, bodyW, bodyH);
    // head circle
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.arc(
        col * tileSize + tileSize / 2,
        row * tileSize + tileSize * 0.30,
        headR, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.globalAlpha = 1;
}

// ─── Main draw ────────────────────────────────────────────────────────────────
function draw() {
    if (!ctx) return;
    var now = performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = COLOR.empty;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid cells
    var r, c;
    for (r = 0; r < ROWS; r++) {
        for (c = 0; c < COLS; c++) {
            var cell = grid[r][c];
            if (cell === WALL) {
                fillCell(c, r, COLOR.wall);
                // slight bevel
                ctx.fillStyle = "rgba(255,255,255,0.06)";
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, 2);
                ctx.fillRect(c * tileSize, r * tileSize, 2, tileSize);
            } else if (cell === BLOCK) {
                fillCell(c, r, COLOR.block);
                ctx.fillStyle = COLOR.blockHighlight;
                ctx.fillRect(c * tileSize + 1, r * tileSize + 1, tileSize - 2, 3);
                ctx.fillRect(c * tileSize + 1, r * tileSize + 1, 3, tileSize - 2);
            } else if (isPowerup(cell)) {
                drawPowerup(c, r, cell);
            }
        }
    }

    // Flames
    for (var fi = 0; fi < flames.length; fi++) {
        var fl = flames[fi];
        if (now < fl.expireAt) {
            drawFlame(fl.col, fl.row, fl.isCenter);
        }
    }

    // Bombs
    for (var bi = 0; bi < bombs.length; bi++) {
        drawBomb(bombs[bi].col, bombs[bi].row);
    }

    // Enemies
    for (var ei = 0; ei < enemies.length; ei++) {
        var en = enemies[ei];
        if (en.alive) drawEntity(en.col, en.row, COLOR.enemyBody, COLOR.enemyHead);
    }

    // Player
    if (!gameOver && !gameWon) {
        var alpha = 1;
        if (player.invincible) {
            // Blink during invincibility
            alpha = (Math.floor(now / 120) % 2 === 0) ? 1 : 0.3;
        }
        drawEntity(player.col, player.row, COLOR.playerBody, COLOR.playerHead, alpha);
    }
}

// ─── Pickup collection ────────────────────────────────────────────────────────
function checkPickup() {
    var cell = grid[player.row][player.col];
    if (!isPowerup(cell)) return;
    if (cell === POWERUP_BOMB) {
        player.maxBombs++;
    } else if (cell === POWERUP_RANGE) {
        player.range++;
    } else if (cell === POWERUP_SPEED) {
        player.speed = true;
        player.moveCooldown = MOVE_COOLDOWN_FAST;
    }
    grid[player.row][player.col] = EMPTY;
    updateHUD();
}

// ─── Input handling ───────────────────────────────────────────────────────────
var keys = {};

app.el.setAttribute("tabindex", "0");
app.el.style.outline = "none";

app.el.addEventListener("keydown", function(e) {
    keys[e.key] = true;
    if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!gameOver && !gameWon) placeBomb(player.col, player.row);
    }
    if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].indexOf(e.key) !== -1) {
        e.preventDefault();
    }
});

app.el.addEventListener("keyup", function(e) {
    keys[e.key] = false;
});

app.el.addEventListener("click", function() { app.el.focus(); });

// ─── Game loop ────────────────────────────────────────────────────────────────
var lastTime = 0;

function loop(time) {
    rafId = requestAnimationFrame(loop);
    if (gameOver || gameWon) { draw(); return; }

    var delta = time - (lastTime || time);
    lastTime = time;
    if (delta > 100) delta = 100; // cap spike

    var now = performance.now();

    // ── Player movement ───────────────────────────────────────────────────────
    if (!player.dead && now - player.lastMoveTime >= player.moveCooldown) {
        var dc = 0, dr = 0;
        if      (keys["ArrowLeft"])  { dc = -1; }
        else if (keys["ArrowRight"]) { dc =  1; }
        else if (keys["ArrowUp"])    { dr = -1; }
        else if (keys["ArrowDown"])  { dr =  1; }

        if (dc !== 0 || dr !== 0) {
            var nc = player.col + dc;
            var nr = player.row + dr;
            // Can't walk through bombs
            var bombBlock = false;
            for (var bi2 = 0; bi2 < bombs.length; bi2++) {
                if (bombs[bi2].col === nc && bombs[bi2].row === nr) { bombBlock = true; break; }
            }
            if (isWalkable(nc, nr) && !bombBlock) {
                player.col = nc;
                player.row = nr;
                player.lastMoveTime = now;
                checkPickup();
            }
        }
    }

    // ── Invincibility timer ────────────────────────────────────────────────────
    if (player.invincible) {
        player.invincibleTimer -= delta;
        if (player.invincibleTimer <= 0) {
            player.invincible = false;
            player.invincibleTimer = 0;
        }
    }

    // ── Bomb timers ───────────────────────────────────────────────────────────
    for (var bi3 = bombs.length - 1; bi3 >= 0; bi3--) {
        bombs[bi3].timer -= delta;
        if (bombs[bi3].timer <= 0) {
            var b = bombs[bi3];
            bombs.splice(bi3, 1);
            explodeBomb(b);
        }
    }

    // ── Expire flames ─────────────────────────────────────────────────────────
    for (var fi2 = flames.length - 1; fi2 >= 0; fi2--) {
        if (now >= flames[fi2].expireAt) flames.splice(fi2, 1);
    }

    // ── Check player hit by flame ─────────────────────────────────────────────
    if (!player.invincible && isOnFlame(player.col, player.row)) {
        killPlayer();
        if (gameOver) { draw(); return; }
    }

    // ── Enemy updates ──────────────────────────────────────────────────────────
    for (var ei2 = 0; ei2 < enemies.length; ei2++) {
        updateEnemy(enemies[ei2], delta);
    }

    // ── Enemy hit by flame ────────────────────────────────────────────────────
    for (var ei3 = 0; ei3 < enemies.length; ei3++) {
        if (enemies[ei3].alive && isOnFlame(enemies[ei3].col, enemies[ei3].row)) {
            enemies[ei3].alive = false;
            score += 100;
            updateHUD();
        }
    }

    // ── Player–enemy collision (enemy touches player) ─────────────────────────
    if (!player.invincible) {
        for (var ei4 = 0; ei4 < enemies.length; ei4++) {
            if (enemies[ei4].alive && enemies[ei4].col === player.col && enemies[ei4].row === player.row) {
                killPlayer();
                if (gameOver) { draw(); return; }
                break;
            }
        }
    }

    // ── Win check ─────────────────────────────────────────────────────────────
    var anyAlive = false;
    for (var ei5 = 0; ei5 < enemies.length; ei5++) {
        if (enemies[ei5].alive) { anyAlive = true; break; }
    }
    if (!anyAlive) {
        gameWon = true;
        showOverlay("YOU WIN!", "Score: " + score);
        draw();
        return;
    }

    draw();
}

// ─── Init / Restart ───────────────────────────────────────────────────────────
this.start = function() {
    if (rafId) cancelAnimationFrame(rafId);

    grid     = buildGrid();
    bombs    = [];
    flames   = [];
    score    = 0;
    gameOver = false;
    gameWon  = false;
    lastTime = 0;

    player = makePlayer();

    // 3 enemies at other corners / areas
    enemies = [
        makeEnemy(COLS - 2, ROWS - 2),
        makeEnemy(COLS - 2, 1),
        makeEnemy(1, ROWS - 2)
    ];
    // Clear safe zones for enemies
    grid[ROWS-2][COLS-2] = EMPTY;
    grid[ROWS-2][COLS-3] = EMPTY;
    grid[ROWS-3][COLS-2] = EMPTY;
    grid[ROWS-2][1]      = EMPTY;
    grid[ROWS-3][1]      = EMPTY;
    grid[1][COLS-2]      = EMPTY;
    grid[1][COLS-3]      = EMPTY;

    hideOverlay();
    sizeCanvas();
    updateHUD();
    draw();
    rafId = requestAnimationFrame(loop);
    app.el.focus();
};

restartBtn.addEventListener("click", this.start.bind(this));

this.start();
