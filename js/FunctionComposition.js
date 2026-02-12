const app = new GraphApp('graph-canvas');
const inputF = document.getElementById('f-input');
const inputG = document.getElementById('g-input');
const showF = document.getElementById('show-f');
const showG = document.getElementById('show-g');
const showFG = document.getElementById('show-fg');
const btn = document.getElementById('plot-btn');

function update() {
    app.clear();
    app.drawGrid();
    app.drawAxes();
    
    try {
        const fNode = math.parse(inputF.value);
        const gNode = math.parse(inputG.value);
        const fComp = fNode.compile();
        const gComp = gNode.compile();
        
        // Composition f(g(x))
        // math.js doesn't compose symbolically easily, so we evaluate g(x) then f(result)
        const fgComp = {
            evaluate: (scope) => {
                const gx = gComp.evaluate(scope);
                return fComp.evaluate({x: gx}); // Assumes f uses 'x'
            }
        };

        if (showF.checked) app.plotFunction(fComp, 'blue');
        if (showG.checked) app.plotFunction(gComp, 'red');
        if (showFG.checked) app.plotFunction(fgComp, 'purple', 3);
        
    } catch (e) {
        console.error(e);
    }
}

window.onload = function() {
    btn.onclick = update;
    inputF.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    inputG.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    showF.onchange = update;
    showG.onchange = update;
    showFG.onchange = update;
    update();
};
