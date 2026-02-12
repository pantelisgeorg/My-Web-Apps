const app = new GraphApp('graph-canvas');
const inputX = document.getElementById('x-input');
const inputY = document.getElementById('y-input');
const tMin = document.getElementById('t-min');
const tMax = document.getElementById('t-max');
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
    app.clear();
    app.drawGrid();
    app.drawAxes();
    
    try {
        const xNode = math.parse(inputX.value);
        const yNode = math.parse(inputY.value);
        const xComp = xNode.compile();
        const yComp = yNode.compile();
        
        let min, max;
        try {
            min = math.evaluate(tMin.value);
            max = math.evaluate(tMax.value);
        } catch(e) {
             showError("Invalid range: " + e.message);
             return;
        }
        
        app.plotParametric(xComp, yComp, min, max, 'blue');
    } catch (e) {
        showError("Invalid function: " + e.message);
    }
}

window.onload = function() {
    btn.onclick = update;
    inputX.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    inputY.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    update();
};
