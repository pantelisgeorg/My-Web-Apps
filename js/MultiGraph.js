const app = new GraphApp('graph-canvas');
const inputF = document.getElementById('f-input');
const inputG = document.getElementById('g-input');
const btn = document.getElementById('plot-btn');

function update() {
    app.clear();
    app.drawGrid();
    app.drawAxes();
    
    try {
        if (inputF.value) {
            const node = math.parse(inputF.value);
            app.plotFunction(node.compile(), 'blue');
        }
    } catch (e) {
        console.error(e);
    }
    
    try {
        if (inputG.value) {
            const node = math.parse(inputG.value);
            app.plotFunction(node.compile(), 'red');
        }
    } catch (e) {
        console.error(e);
    }
}

window.onload = function() {
    btn.onclick = update;
    inputF.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    inputG.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    update();
};
