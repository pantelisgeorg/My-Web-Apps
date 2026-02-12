const app = new GraphApp('graph-canvas');
const input = document.getElementById('function-input');
const slider = document.getElementById('k-slider');
const kValue = document.getElementById('k-value');
const kMin = document.getElementById('k-min');
const kMax = document.getElementById('k-max');
const btn = document.getElementById('plot-btn');
const errorDiv = document.getElementById('error-message');

function showError(msg) {
    if (msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    } else {
        errorDiv.style.display = 'none';
    }
}

function update() {
    showError(null);
    
    // Update slider range if changed
    try {
        const min = math.evaluate(kMin.value);
        const max = math.evaluate(kMax.value);
        
        if (slider.min != min || slider.max != max) {
            slider.min = min;
            slider.max = max;
            slider.step = (max - min) / 100;
        }
    } catch (e) {
        showError("Invalid range: " + e.message);
    }

    const k = parseFloat(slider.value);
    kValue.textContent = k.toFixed(2);
    
    app.clear();
    app.drawGrid();
    app.drawAxes();
    
    try {
        const node = math.parse(input.value);
        const compiled = node.compile();
        app.plotFunction(compiled, 'blue', 2, [], { k: k });
    } catch (e) {
        showError("Invalid function: " + e.message);
    }
}

window.onload = function() {
    btn.onclick = update;
    input.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    slider.oninput = update;
    kMin.onchange = update;
    kMax.onchange = update;
    update();
};
