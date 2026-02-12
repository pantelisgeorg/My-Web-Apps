const app = new GraphApp('graph-canvas');
const input = document.getElementById('function-input');
const btn = document.getElementById('plot-btn');

function update() {
    try {
        const node = math.parse(input.value);
        const compiled = node.compile();
        
        app.clear();
        app.drawGrid();
        app.drawAxes();
        app.plotFunction(compiled, 'blue');
    } catch (e) {
        // console.error(e);
        // SimpleGraph.html doesn't have error div yet, maybe add alert?
        // But let's keep it simple or add error div to all.
    }
}

window.onload = function() {
    btn.onclick = update;
    input.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    update();
};
