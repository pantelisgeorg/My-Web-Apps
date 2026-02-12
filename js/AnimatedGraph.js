const app = new GraphApp('graph-canvas');
const input = document.getElementById('function-input');
const slider = document.getElementById('k-slider');
const kValue = document.getElementById('k-value');
const btn = document.getElementById('plot-btn');
const playBtn = document.getElementById('play-btn');

let playing = false;
let animationId = null;

function update() {
    const k = parseFloat(slider.value);
    kValue.textContent = k.toFixed(1);
    
    app.clear();
    app.drawGrid();
    app.drawAxes();
    
    try {
        const node = math.parse(input.value);
        const compiled = node.compile();
        app.plotFunction(compiled, 'blue', 2, [], { k: k });
    } catch (e) {
        // console.error(e);
    }
}

function animate() {
    if (!playing) return;
    
    let k = parseFloat(slider.value);
    k += 0.05;
    if (k > parseFloat(slider.max)) k = parseFloat(slider.min);
    slider.value = k;
    
    update();
    animationId = requestAnimationFrame(animate);
}

window.onload = function() {
    btn.onclick = update;
    input.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    slider.oninput = update;

    playBtn.onclick = () => {
        playing = !playing;
        playBtn.textContent = playing ? 'Pause' : 'Play';
        if (playing) animate();
    };

    update();
};
