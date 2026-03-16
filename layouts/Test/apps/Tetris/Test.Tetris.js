var $ = function(cls) { return app.el.querySelector("." + cls); };

// --- Constants ---
var COLS = 10;
var ROWS = 20;

var PIECES = [
    // I — sage teal
    { color: "#6dbfaa", states: [
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
        [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
        [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
    ]},
    // O — sandy straw
    { color: "#d9bc6e", states: [
        [[1,1],[1,1]],[[1,1],[1,1]],[[1,1],[1,1]],[[1,1],[1,1]]
    ]},
    // T — dusty lavender
    { color: "#b08aba", states: [
        [[0,1,0],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,1],[0,1,0]],
        [[0,1,0],[1,1,0],[0,1,0]]
    ]},
    // S — sage green
    { color: "#88b06e", states: [
        [[0,1,1],[1,1,0],[0,0,0]],
        [[0,1,0],[0,1,1],[0,0,1]],
        [[0,0,0],[0,1,1],[1,1,0]],
        [[1,0,0],[1,1,0],[0,1,0]]
    ]},
    // Z — terracotta rose
    { color: "#c47860", states: [
        [[1,1,0],[0,1,1],[0,0,0]],
        [[0,0,1],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,0],[0,1,1]],
        [[0,1,0],[1,1,0],[1,0,0]]
    ]},
    // J — dusty slate blue
    { color: "#6e90b8", states: [
        [[1,0,0],[1,1,1],[0,0,0]],
        [[0,1,1],[0,1,0],[0,1,0]],
        [[0,0,0],[1,1,1],[0,0,1]],
        [[0,1,0],[0,1,0],[1,1,0]]
    ]},
    // L — warm peach
    { color: "#d4936a", states: [
        [[0,0,1],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,0],[0,1,1]],
        [[0,0,0],[1,1,1],[1,0,0]],
        [[1,1,0],[0,1,0],[0,1,0]]
    ]}
];

// --- State ---
var board, score, level, lines, gameOver, paused;
var current, currentRotation, currentX, currentY;
var nextIdx;
var bag = [];
var canvas, ctx, tileW, tileH;
var lastTime, dropInterval, rafId;

// --- DOM ---
var hudScore = $("hud-score-val");
var hudLevel = $("hud-level-val");
var hudLines = $("hud-lines-val");
var goOverlay = $("game-over");
var goScore = $("go-score-val");
var goBtn = $("go-restart");
canvas = $("game-canvas");
ctx = canvas.getContext("2d");
var previewCanvas = $("hud-next-canvas");
var previewCtx = previewCanvas.getContext("2d");

app.el.style.height = "100%";

// --- Canvas sizing ---
function sizeCanvas() {
    var body = app.win.body;
    var w = (body.clientWidth || 320) - 100;
    var h = body.clientHeight || 480;
    var tileSize = Math.floor(Math.min(w / COLS, h / ROWS));
    tileW = tileSize;
    tileH = tileSize;
    canvas.width  = tileSize * COLS;
    canvas.height = tileSize * ROWS;
    canvas.style.width  = canvas.width  + "px";
    canvas.style.height = canvas.height + "px";
}

app.win.on("resize", function () {
    sizeCanvas();
    draw();
});

// --- Board ---
function createBoard() {
    var b = [];
    for (var r = 0; r < ROWS; r++) {
        b[r] = [];
        for (var c = 0; c < COLS; c++) b[r][c] = 0;
    }
    return b;
}

// --- 7-bag randomizer ---
function refillBag() {
    bag = [0, 1, 2, 3, 4, 5, 6];
    for (var i = bag.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = bag[i]; bag[i] = bag[j]; bag[j] = tmp;
    }
}

function nextPiece() {
    if (bag.length === 0) refillBag();
    return bag.pop();
}

// --- Collision ---
function collides(pieceIdx, rotation, px, py) {
    var matrix = PIECES[pieceIdx].states[rotation];
    var size = matrix.length;
    for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
            if (!matrix[r][c]) continue;
            var bx = px + c;
            var by = py + r;
            if (bx < 0 || bx >= COLS || by >= ROWS) return true;
            if (by >= 0 && board[by][bx]) return true;
        }
    }
    return false;
}

// --- Preview ---
function drawPreview() {
    var piece = PIECES[nextIdx];
    var matrix = piece.states[0];
    var size = matrix.length;
    var cell = 14;
    previewCanvas.width  = size * cell;
    previewCanvas.height = size * cell;
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
            if (!matrix[r][c]) continue;
            previewCtx.fillStyle = piece.color;
            previewCtx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2);
        }
    }
}

// --- Spawn ---
function spawn() {
    current = (nextIdx !== undefined) ? nextIdx : nextPiece();
    nextIdx = nextPiece();
    var size = PIECES[current].states[0].length;
    currentRotation = 0;
    currentX = Math.floor((COLS - size) / 2);
    currentY = 0;
    drawPreview();
    if (collides(current, currentRotation, currentX, currentY)) {
        endGame();
    }
}

// --- Lock piece ---
function lockPiece() {
    var matrix = PIECES[current].states[currentRotation];
    var color = PIECES[current].color;
    var size = matrix.length;
    for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
            if (!matrix[r][c]) continue;
            var by = currentY + r;
            var bx = currentX + c;
            if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
                board[by][bx] = color;
            }
        }
    }
    clearLines();
    spawn();
}

// --- Line clear ---
function clearLines() {
    var cleared = 0;
    for (var r = ROWS - 1; r >= 0; r--) {
        var full = true;
        for (var c = 0; c < COLS; c++) {
            if (!board[r][c]) { full = false; break; }
        }
        if (full) {
            board.splice(r, 1);
            var empty = [];
            for (var c2 = 0; c2 < COLS; c2++) empty.push(0);
            board.unshift(empty);
            cleared++;
            r++;
        }
    }
    if (cleared > 0) {
        var pts = [0, 100, 300, 500, 800];
        score += (pts[cleared] || 800) * level;
        lines += cleared;
        var newLevel = Math.floor(lines / 10) + 1;
        if (newLevel !== level) {
            level = newLevel;
            dropInterval = Math.max(50, 1000 - (level - 1) * 80);
        }
        updateHUD();
    }
}

// --- Ghost Y ---
function ghostY() {
    var gy = currentY;
    while (!collides(current, currentRotation, currentX, gy + 1)) gy++;
    return gy;
}

// --- Drawing ---
function drawTile(x, y, color, alpha) {
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha || 1;
    ctx.fillRect(x * tileW + 1, y * tileH + 1, tileW - 2, tileH - 2);
    ctx.globalAlpha = 1;
}

function draw() {
    if (!ctx) return;
    ctx.fillStyle = "#1c1814";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // grid
    ctx.strokeStyle = "rgba(255,240,220,0.05)";
    ctx.lineWidth = 0.5;
    for (var gc = 1; gc < COLS; gc++) {
        ctx.beginPath(); ctx.moveTo(gc * tileW, 0); ctx.lineTo(gc * tileW, canvas.height); ctx.stroke();
    }
    for (var gr = 1; gr < ROWS; gr++) {
        ctx.beginPath(); ctx.moveTo(0, gr * tileH); ctx.lineTo(canvas.width, gr * tileH); ctx.stroke();
    }

    // board
    for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
            if (board[r][c]) drawTile(c, r, board[r][c]);
        }
    }

    if (current === undefined || gameOver) return;

    // ghost
    var gy = ghostY();
    var matrix = PIECES[current].states[currentRotation];
    var size = matrix.length;
    for (var r2 = 0; r2 < size; r2++) {
        for (var c2 = 0; c2 < size; c2++) {
            if (!matrix[r2][c2]) continue;
            var dy = gy + r2;
            if (dy >= 0 && dy < ROWS) drawTile(currentX + c2, dy, PIECES[current].color, 0.2);
        }
    }

    // current piece
    for (var r3 = 0; r3 < size; r3++) {
        for (var c3 = 0; c3 < size; c3++) {
            if (!matrix[r3][c3]) continue;
            var py = currentY + r3;
            if (py >= 0 && py < ROWS) drawTile(currentX + c3, py, PIECES[current].color);
        }
    }
}

// --- Movement ---
function moveLeft() { if (!collides(current, currentRotation, currentX - 1, currentY)) { currentX--; draw(); } }
function moveRight() { if (!collides(current, currentRotation, currentX + 1, currentY)) { currentX++; draw(); } }

function moveDown() {
    if (!collides(current, currentRotation, currentX, currentY + 1)) {
        currentY++;
        draw();
        return true;
    }
    lockPiece();
    draw();
    return false;
}

function rotatePiece() {
    var newRot = (currentRotation + 1) % 4;
    var kicks = [0, -1, 1, -2, 2];
    for (var i = 0; i < kicks.length; i++) {
        if (!collides(current, newRot, currentX + kicks[i], currentY)) {
            currentX += kicks[i];
            currentRotation = newRot;
            draw();
            return;
        }
    }
}

function hardDrop() {
    while (!collides(current, currentRotation, currentX, currentY + 1)) {
        currentY++;
        score += 2;
    }
    lockPiece();
    updateHUD();
    draw();
}

// --- HUD ---
function updateHUD() {
    hudScore.textContent = score;
    hudLevel.textContent = level;
    hudLines.textContent = lines;
}

// --- Game over ---
function endGame() {
    gameOver = true;
    goScore.textContent = score;
    goOverlay.classList.add("visible");
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    draw();
}

// --- Game loop ---
function loop(time) {
    if (gameOver) return;
    if (paused) { rafId = requestAnimationFrame(loop); return; }
    if (!lastTime) lastTime = time;
    var delta = time - lastTime;
    if (delta >= dropInterval) {
        lastTime = time;
        moveDown();
    }
    draw();
    rafId = requestAnimationFrame(loop);
}

// --- Input: DAS/ARR key repeat ---
var DAS = 150;  // ms before auto-repeat kicks in
var ARR = 40;   // ms between repeats
var ARR_DOWN = 30; // faster repeat for soft drop
var dasTimers = {};
var arrTimers = {};

function clearKey(key) {
    clearTimeout(dasTimers[key]);
    clearInterval(arrTimers[key]);
}

function startRepeat(key, action, arr) {
    clearKey(key);
    dasTimers[key] = setTimeout(function() {
        arrTimers[key] = setInterval(action, arr);
    }, DAS);
}

app.el.setAttribute("tabindex", "0");
app.el.style.outline = "none";
app.el.addEventListener("keydown", function(e) {
    if (e.repeat) return; // handled by our own repeat
    switch (e.key) {
        case "ArrowLeft":
            moveLeft();
            startRepeat("left", moveLeft, ARR);
            e.preventDefault(); break;
        case "ArrowRight":
            moveRight();
            startRepeat("right", moveRight, ARR);
            e.preventDefault(); break;
        case "ArrowDown":
            moveDown();
            startRepeat("down", moveDown, ARR_DOWN);
            e.preventDefault(); break;
        case "ArrowUp":    rotatePiece(); e.preventDefault(); break;
        case " ":          hardDrop(); e.preventDefault(); break;
        case "p": case "P": paused = !paused; e.preventDefault(); break;
    }
});
app.el.addEventListener("keyup", function(e) {
    if (e.key === "ArrowLeft")  clearKey("left");
    if (e.key === "ArrowRight") clearKey("right");
    if (e.key === "ArrowDown")  clearKey("down");
});
app.el.addEventListener("click", function() { app.el.focus(); });

// --- Start / Restart ---
this.start = function() {
    board = createBoard();
    score = 0; level = 1; lines = 0;
    gameOver = false; paused = false;
    dropInterval = 1000; lastTime = 0;
    bag = [];
    nextIdx = undefined;
    refillBag();
    goOverlay.classList.remove("visible");
    sizeCanvas();
    spawn();
    updateHUD();
    draw();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
    app.el.focus();
};

goBtn.addEventListener("click", this.start.bind(this));

this.start();