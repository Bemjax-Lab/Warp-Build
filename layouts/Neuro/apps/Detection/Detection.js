var app = this;
var framesEl, statusEl, recordBtn, previewCanvas, previewCtx, dlBtn, fpsEl;
var tempCanvas = document.createElement('canvas'), tempCtx = tempCanvas.getContext('2d');
var frames = [], maxFrames = 100;
var stripCanvas = null, stripCtx = null, stripClean = null, thumbWidth = 0;

function status(text) {
    statusEl.textContent = text;
}

// === CAMERA ===
var camera = {
    stream: null,
    video: null,
    active: false,
    loopId: 0,
    start: async function () {
        if (!camera.stream) {
            try {
                camera.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            } catch (e) {
                warp.gui.toast('Camera access denied');
                status('Camera access denied');
                return;
            }
            camera.video = document.createElement('video');
            camera.video.srcObject = camera.stream;
            camera.video.muted = true;
            camera.video.playsInline = true;
            await camera.video.play();
        }
        dom.query('.toggleVideo').style.background = 'green';
        dom.query('.toggleVideo').textContent = 'ON';
        camera.active = true;
        previewCanvas.width = 600;
        previewCanvas.height = 600;
        previewCanvas.style.width = '100%';
        previewCanvas.style.height = 'auto';
        var vScale = Math.min(600 / camera.video.videoWidth, 600 / camera.video.videoHeight);
        var vw = Math.round(camera.video.videoWidth * vScale), vh = Math.round(camera.video.videoHeight * vScale);
        var vdx = Math.round((600 - vw) / 2), vdy = Math.round((600 - vh) / 2);
        var lastFrameTime = performance.now(), smoothFps = 0;
        var myLoopId = ++camera.loopId;
        function drawLoop() {
            if (!camera.active || camera.loopId !== myLoopId) return;
            var now = performance.now(), dt = now - lastFrameTime;
            lastFrameTime = now;
            if (dt > 0) smoothFps = smoothFps * 0.9 + 1000 / dt * 0.1;
            if (fpsEl) fpsEl.textContent = Math.round(smoothFps);
            previewCtx.clearRect(0, 0, 600, 600);
            previewCtx.drawImage(camera.video, vdx, vdy, vw, vh);
            if (detection.enabled && !recording.active) {
                detection.drawBoxes(detection.lastPredictions, 150, 150, 1);
                if (!detection.running) {
                    detection.running = true;
                    var cropData = preview.cropRect();
                    tempCanvas.width = 300; tempCanvas.height = 300;
                    tempCtx.putImageData(cropData, 0, 0);
                    detection.detect(tempCanvas).then(function (predictions) {
                        detection.lastPredictions = predictions;
                        detection.running = false;
                    });
                }
            }
            requestAnimationFrame(drawLoop);
        }
        dom.query('.viewfinder').classList.remove('hidden');
        drawLoop();
    },
    stop: function () {
        camera.active = false;
        dom.query('.toggleVideo').style.background = 'grey';
        dom.query('.toggleVideo').textContent = 'OFF';
    }
};

// === DETECTION ===
var detection = {
    model: null,
    enabled: false,
    running: false,
    lastPredictions: [],
    detect: async function (img) {
        if (!detection.model) {
            status('Model loading...');
            detection.model = await cocoSsd.load();
            status('Prediction ready,\nload or record!');
        }
        return await detection.model.detect(img);
    },
    drawBoxes: function (predictions, dx, dy, scale) {
        predictions.forEach(function (p) {
            if (p.class !== 'cat' && p.class !== 'dog') return;
            var bx = p.bbox[0], by = p.bbox[1], bw = p.bbox[2], bh = p.bbox[3];
            previewCtx.strokeStyle = 'lime';
            previewCtx.lineWidth = 2;
            previewCtx.strokeRect(dx + bx * scale, dy + by * scale, bw * scale, bh * scale);
        });
    },
    start: async function () {
        if (!detection.model) {
            status('Model loading...');
            detection.model = await cocoSsd.load();
            status('Prediction ready,\nload or record!');
        }
        detection.enabled = true;
        dom.query('.togglePrediction').style.background = 'green';
        dom.query('.togglePrediction').textContent = 'ON';
    },
    stop: function () {
        detection.enabled = false;
        detection.lastPredictions = [];
        dom.query('.togglePrediction').style.background = 'grey';
        dom.query('.togglePrediction').textContent = 'OFF';
    }
};

// === RECORDING ===
var recording = {
    active: false,
    timer: null,
    start: function () {
        if (!camera.video) return;
        if (!camera.active) camera.start();
        detection.stop();
        recording.active = true;
        recordBtn.style.fill = 'red';
        frames = [];
        framesEl.innerHTML = '';
        stripCanvas = null;
        dlBtn.classList.add('op1');
        dom.query('.timeline').classList.add('disabled');
        var frameCount = 0;
        recording.timer = setInterval(function () {
            if (!recording.active) return;
            frameCount++;
            if (frameCount % 3 !== 0) return;
            addToFrames();
            status('Recording\nFrame: ' + frames.length);
        }, 1000 / 30);
    },
    stop: function () {
        if (!recording.active) return;
        recording.active = false;
        clearInterval(recording.timer);
        recordBtn.style.fill = 'rgba(200,200,200,0.3)';
        status('Recording stopped\nFrames: ' + frames.length);
        detectFrames(frames).then(function (hasAnimal) {
            if (hasAnimal) dom.query('.timeline').classList.remove('disabled');
        });
    }
};

// === PREVIEW (frame viewer) ===
var preview = {
    frameIndex: -1,
    show: function (idx) {
        var imageData = frames[idx];
        if (!imageData) return;
        previewCanvas.width = 600;
        previewCanvas.height = 600;
        previewCanvas.style.width = '100%';
        previewCanvas.style.height = 'auto';
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        tempCtx.putImageData(imageData, 0, 0);
        var dx = Math.round((600 - imageData.width) / 2);
        var dy = Math.round((600 - imageData.height) / 2);
        previewCtx.drawImage(tempCanvas, dx, dy);
        preview.frameIndex = idx;
        dlBtn.classList.remove('op1');
        status('Frame: ' + (idx + 1) + '\n' + imageData.width + 'x' + imageData.height);
        var frameJpeg = tempCanvas.toDataURL('image/jpeg', 1);
        detection.detect(frames[idx]).then(function (predictions) {
            detection.drawBoxes(predictions, dx, dy, 1);
            var animals = predictions.filter(function (p) { return p.class === 'cat' || p.class === 'dog'; });
            if (!animals.length) { status('Frame: ' + (idx + 1) + '\nNo animal detected'); return; }
            warp.app('Agent').then(async function (agent) {
                agent.show();
                var r = await agent.send('do analysis, first general parameters then clinical signs you been trained on. approximate as best as you can, express as json and text', frameJpeg);
                if (r && r.includes('```json')) warp.gui.toast('json found');
            });
        });
    },
    cropRect: function () {
        return previewCtx.getImageData(150, 150, 300, 300);
    },
    download: function () {
        var imageData = frames[preview.frameIndex];
        if (!imageData) return;
        var canvas = document.createElement('canvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        canvas.getContext('2d').putImageData(imageData, 0, 0);
        var link = document.createElement('a');
        link.download = 'frame_' + (preview.frameIndex + 1) + '.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    }
};

// === GUI / FILMSTRIP helpers ===
function highlightThumb(idx) {
    if (!stripCanvas || !stripClean) return;
    stripCtx.putImageData(stripClean, 0, 0);
    var cellWidth = thumbWidth + 5;
    stripCtx.strokeStyle = 'lime';
    stripCtx.lineWidth = 2;
    stripCtx.strokeRect(idx * cellWidth + 1, 1, thumbWidth - 2, 48);
}

function addToFrames() {
    if (frames.length >= maxFrames) {
        recording.stop();
        return;
    }
    var imageData = preview.cropRect();
    frames.push(imageData);
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCtx.putImageData(imageData, 0, 0);
    var cellWidth = thumbWidth + 5;
    if (!stripCanvas) {
        thumbWidth = Math.round(imageData.width / imageData.height * 50);
        cellWidth = thumbWidth + 5;
        stripCanvas = document.createElement('canvas');
        stripCanvas.width = cellWidth;
        stripCanvas.height = 50;
        stripCanvas.style.cursor = 'pointer';
        stripCanvas.style.flexShrink = '0';
        stripCtx = stripCanvas.getContext('2d');
        stripCanvas.onclick = function (e) {
            var rect = stripCanvas.getBoundingClientRect();
            var pixelX = (e.clientX - rect.left) * (stripCanvas.width / rect.width);
            var idx = Math.floor(pixelX / (thumbWidth + 5));
            if (idx < frames.length) {
                camera.stop();
                preview.show(idx);
                highlightThumb(idx);
            }
        };
        framesEl.appendChild(stripCanvas);
    } else {
        var existing = stripCtx.getImageData(0, 0, stripCanvas.width, 50);
        stripCanvas.width = frames.length * cellWidth;
        stripCtx.putImageData(existing, 0, 0);
    }
    stripCtx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, (frames.length - 1) * cellWidth, 0, thumbWidth, 50);
    framesEl.scrollLeft = framesEl.scrollWidth;
    stripClean = stripCtx.getImageData(0, 0, stripCanvas.width, 50);
}

async function detectFrames(framesList) {
    if (!framesList || !framesList.length) return false;
    var detectedCount = 0;
    for (var i = 0; i < framesList.length; i++) {
        status('Scanning\n' + (i + 1) + ' / ' + framesList.length);
        var predictions = await detection.detect(framesList[i]);
        if (predictions.some(function (p) { return p.class === 'cat' || p.class === 'dog'; })) detectedCount++;
    }
    status('Scan done\n' + detectedCount + ' / ' + framesList.length + ' animal frames');
    return detectedCount / framesList.length >= 0.2;
}

function assembleTimeline(imagesArray, cols, maxSize) {
    if (!imagesArray || !imagesArray.length) return null;
    var rows = Math.ceil(imagesArray.length / cols);
    var cellSize = Math.min(Math.floor(maxSize / cols), Math.floor(maxSize / rows));
    var canvas = document.createElement('canvas');
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(12,12,12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    imagesArray.forEach(function (imageData, i) {
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        tempCtx.putImageData(imageData, 0, 0);
        var col = i % cols;
        var row = Math.floor(i / cols);
        ctx.drawImage(tempCanvas, col * cellSize, row * cellSize, cellSize, cellSize);
    });
    return canvas;
}

this.assembleTimeline = assembleTimeline;

async function extractFramesFromVideo(videoFile) {
    var video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.style.cssText = 'position:fixed; opacity:0; pointer-events:none;';
    document.body.appendChild(video);
    video.src = URL.createObjectURL(videoFile);
    try {
        await video.play();
    } catch (e) {
        video.remove();
        warp.gui.toast('Video format not supported. Please convert to MP4.');
        return;
    }
    video.pause();
    status('Processing video\n' + video.videoWidth + 'x' + video.videoHeight + '\nFrame: 0');
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var duration = video.duration, step = 1 / 10, time = 0;
    function seekNext() {
        if (frames.length >= maxFrames) {
            video.remove();
            warp.gui.toast('Max frames reached. Extracted ' + frames.length + ' frames');
            return;
        }
        if (time >= duration) {
            video.remove();
            warp.gui.toast('Extracted ' + frames.length + ' frames');
            return;
        }
        video.currentTime = time;
    }
    video.onseeked = function () {
        setTimeout(function () {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            var vScale = Math.min(600 / canvas.width, 600 / canvas.height);
            var vw = Math.round(canvas.width * vScale), vh = Math.round(canvas.height * vScale);
            var vdx = Math.round((600 - vw) / 2), vdy = Math.round((600 - vh) / 2);
            previewCanvas.width = 600;
            previewCanvas.height = 600;
            previewCtx.clearRect(0, 0, 600, 600);
            previewCtx.drawImage(canvas, vdx, vdy, vw, vh);
            addToFrames();
            status('Processing video\n' + video.videoWidth + 'x' + video.videoHeight + '\nFrame: ' + frames.length);
            time += step;
            seekNext();
        }, 50);
    };
    seekNext();
}

this.init = async function () {
    app.win.content.style.background = 'rgb(12,12,12)';
    warp.app('Agent');
    app.win.on('hide', function () {
        detection.stop();
        camera.stop();
    });
    app.win.on('show', function () {
        camera.start();
    });
    fpsEl = dom.query('.fps');
    statusEl = dom.query('.status');
    app.win.caption('<span style="color:rgb(200,200,200)">N<span style="font-family:Oswald; font-weight:normal; color:teal">L</span></span>');
    app.win.body.style.overflowY = 'hidden';
    app.win.body.style.overflowY = 'hidden';
    app.win.head.style.border = 'none';
    framesEl = dom.query('.frames');
    previewCanvas = dom.query('.preview');
    previewCtx = previewCanvas.getContext('2d');
    dlBtn = dom.query('.dl');
    dlBtn.onclick = function () { preview.download(); };
    recordBtn = dom.query('.record');
    recordBtn.onclick = function () { recording.active ? recording.stop() : recording.start(); };
    dom.query('.upload').onclick = function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/mp4,video/webm,video/ogg,video/mpg';
        input.onchange = function (e) {
            var file = e.target.files[0];
            if (!file) return;
            frames = [];
            framesEl.innerHTML = '';
            stripCanvas = null;
            dlBtn.classList.add('op1');
            status('Processing video...');
            extractFramesFromVideo(file);
        };
        input.click();
    };
    dom.query('.togglePrediction').onclick = function () { detection.enabled ? detection.stop() : detection.start(); };
    dom.query('.toggleVideo').onclick = function () { camera.active ? camera.stop() : camera.start(); };
    dom.query('.timeline').onclick = function () {
        var canvas = assembleTimeline(frames, 5, 1000);
        if (!canvas) return;
        warp.app('Agent').then(async function (agent) {
            agent.show();
            await agent.send('analyse this gait timeline grid. describe movement patterns, symmetry, limb coordination and any neurological signs across frames. express findings as json and text', canvas.toDataURL('image/jpeg', 0.85));
        });
    };
    tf.setBackend('webgl');
    status('Video preview started');
    camera.start();
};

this.clean = function () {
    recording.stop();
    detection.stop();
    camera.stop();
};
