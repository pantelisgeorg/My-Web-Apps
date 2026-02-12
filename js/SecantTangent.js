const app = new GraphApp('graph-canvas');
const input = document.getElementById('function-input');
const xSlider = document.getElementById('x-slider');
const xValue = document.getElementById('x-value');
const hSlider = document.getElementById('h-slider');
const hValue = document.getElementById('h-value');
const btn = document.getElementById('plot-btn');
const secantDisp = document.getElementById('secant-slope');
const tangentDisp = document.getElementById('tangent-slope');

function update() {
    const x0 = parseFloat(xSlider.value);
    const h = parseFloat(hSlider.value);
    xValue.textContent = x0.toFixed(2);
    hValue.textContent = h.toFixed(2);
    
    app.clear();
    app.drawGrid();
    app.drawAxes();
    
    try {
        const node = math.parse(input.value);
        const compiled = node.compile();
        app.plotFunction(compiled, 'blue');
        
        // Tangent
        const deriv = math.derivative(node, 'x').compile();
        const mTan = deriv.evaluate({x: x0});
        const y0 = compiled.evaluate({x: x0});
        
        // Draw Tangent (Green)
        const x1 = x0 - 2;
        const x2 = x0 + 2;
        const y1 = y0 + mTan * (x1 - x0);
        const y2 = y0 + mTan * (x2 - x0);
        
        app.ctx.strokeStyle = 'green';
        app.ctx.lineWidth = 1;
        app.ctx.beginPath();
        app.ctx.moveTo(app.toCanvasX(x1), app.toCanvasY(y1));
        app.ctx.lineTo(app.toCanvasX(x2), app.toCanvasY(y2));
        app.ctx.stroke();
        
        // Secant
        if (Math.abs(h) > 0.001) {
            const xSec = x0 + h;
            const ySec = compiled.evaluate({x: xSec});
            const mSec = (ySec - y0) / h;
            
            // Draw Secant (Red)
            // y - y0 = mSec * (x - x0)
            const ys1 = y0 + mSec * (x1 - x0);
            const ys2 = y0 + mSec * (x2 - x0);
            
            app.ctx.strokeStyle = 'red';
            app.ctx.lineWidth = 2;
            app.ctx.beginPath();
            app.ctx.moveTo(app.toCanvasX(x1), app.toCanvasY(ys1));
            app.ctx.lineTo(app.toCanvasX(x2), app.toCanvasY(ys2));
            app.ctx.stroke();
            
            app.drawPoint(xSec, ySec, 'red');
            secantDisp.textContent = `Secant Slope: ${mSec.toFixed(4)}`;
        } else {
            secantDisp.textContent = `Secant Slope: undefined (h=0)`;
        }
        
        app.drawPoint(x0, y0, 'blue');
        tangentDisp.textContent = `Tangent Slope: ${mTan.toFixed(4)}`;
        
    } catch (e) {
        // console.error(e);
    }
}

window.onload = function() {
    btn.onclick = update;
    input.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    xSlider.oninput = update;
    hSlider.oninput = update;
    update();
};
