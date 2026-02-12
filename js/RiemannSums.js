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
        
        // Draw Riemann Sums (Left Endpoint, n=20, from -4 to 4)
        // Ideally these should be inputs
        const n = 20;
        const start = -4;
        const end = 4;
        const dx = (end - start) / n;
        
        app.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        app.ctx.strokeStyle = 'red';
        app.ctx.lineWidth = 1;
        
        for (let i = 0; i < n; i++) {
            const x = start + i * dx;
            try {
                const y = compiled.evaluate({x: x}); // Left endpoint
                if (isFinite(y)) {
                    const x1 = app.toCanvasX(x);
                    const x2 = app.toCanvasX(x + dx);
                    const yAxis = app.toCanvasY(0);
                    const yVal = app.toCanvasY(y);
                    
                    const width = x2 - x1;
                    const height = yVal - yAxis;
                    
                    // fillRect(x, y, w, h)
                    // Starts at x1, yAxis. Height is signed.
                    app.ctx.fillRect(x1, yAxis, width, height);
                    app.ctx.strokeRect(x1, yAxis, width, height);
                }
            } catch(e) {}
        }
        
    } catch(e) {
        // console.error(e);
    }
}

window.onload = function() {
    btn.onclick = update;
    input.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    update();
};
