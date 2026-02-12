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
        
        // Draw Slope Field
        const step = 0.5;
        const len = 0.4; // Length of slope line
        
        for (let x = Math.ceil(app.xMin); x <= Math.floor(app.xMax); x += step) {
            for (let y = Math.ceil(app.yMin); y <= Math.floor(app.yMax); y += step) {
                try {
                    // Evaluate slope m = dy/dx = f(x, y)
                    const m = compiled.evaluate({x: x, y: y});
                    
                    if (isFinite(m)) {
                        // Calculate line segment centered at (x,y)
                        // Angle theta = atan(m)
                        const theta = Math.atan(m);
                        const dx = Math.cos(theta) * (len / 2);
                        const dy = Math.sin(theta) * (len / 2);
                        
                        const x1 = x - dx;
                        const y1 = y - dy;
                        const x2 = x + dx;
                        const y2 = y + dy;
                        
                        app.ctx.strokeStyle = 'blue';
                        app.ctx.lineWidth = 1;
                        app.ctx.beginPath();
                        app.ctx.moveTo(app.toCanvasX(x1), app.toCanvasY(y1));
                        app.ctx.lineTo(app.toCanvasX(x2), app.toCanvasY(y2));
                        app.ctx.stroke();
                    }
                } catch (e) {}
            }
        }
        
        // Optional: Draw a sample solution curve starting at (0, 1) if feasible
        // Use Euler's method
        app.ctx.strokeStyle = 'red';
        app.ctx.lineWidth = 2;
        app.ctx.beginPath();
        
        let cx = 0;
        let cy = 1; // Initial condition y(0)=1
        let h = 0.01;
        
        // Forward
        app.ctx.moveTo(app.toCanvasX(cx), app.toCanvasY(cy));
        for (let i = 0; i < 500; i++) {
            if (cx > app.xMax || cy > app.yMax || cy < app.yMin) break;
            try {
                const m = compiled.evaluate({x: cx, y: cy});
                cy += h * m;
                cx += h;
                app.ctx.lineTo(app.toCanvasX(cx), app.toCanvasY(cy));
            } catch(e) { break; }
        }
        app.ctx.stroke();
        
        // Backward
        app.ctx.beginPath();
        cx = 0;
        cy = 1;
        app.ctx.moveTo(app.toCanvasX(cx), app.toCanvasY(cy));
        for (let i = 0; i < 500; i++) {
            if (cx < app.xMin || cy > app.yMax || cy < app.yMin) break;
            try {
                const m = compiled.evaluate({x: cx, y: cy});
                cy -= h * m;
                cx -= h;
                app.ctx.lineTo(app.toCanvasX(cx), app.toCanvasY(cy));
            } catch(e) { break; }
        }
        app.ctx.stroke();
        
    } catch(e) {
        console.error(e);
    }
}

window.onload = function() {
    btn.onclick = update;
    input.onkeypress = (e) => { if (e.key === 'Enter') update(); };
    update();
};
