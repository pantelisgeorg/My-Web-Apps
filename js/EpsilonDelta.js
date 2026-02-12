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
        
        // Epsilon-Delta visualization (Fixed a=1, eps=0.5)
        // Ideally these should be inputs
        const a = 1;
        const eps = 0.5;
        
        // Calculate L = f(a)
        const L = compiled.evaluate({x: a});
        
        if (isFinite(L)) {
            // Find delta (approximation or fixed for now)
            const delta = 0.25; 
            
            // Draw horizontal band (L-eps, L+eps)
            app.ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            const yTop = app.toCanvasY(L + eps);
            const yBot = app.toCanvasY(L - eps);
            const xLeft = app.toCanvasX(app.xMin);
            const xRight = app.toCanvasX(app.xMax);
            
            // fillRect(x, y, w, h). yTop corresponds to higher Y value mathematically but lower Y pixel
            // yBot is lower Y mathematically (higher pixel)
            // So height is yBot - yTop
            app.ctx.fillRect(xLeft, yTop, xRight - xLeft, yBot - yTop);
            
            // Draw vertical band (a-delta, a+delta)
            const xMinDelta = app.toCanvasX(a - delta);
            const xMaxDelta = app.toCanvasX(a + delta);
            const yTopC = app.toCanvasY(app.yMax);
            const yBotC = app.toCanvasY(app.yMin);
            
            app.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            app.ctx.fillRect(xMinDelta, 0, xMaxDelta - xMinDelta, app.height);
            
            // Point (a, L)
            app.drawPoint(a, L, 'black');
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
