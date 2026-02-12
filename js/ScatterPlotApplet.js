const app = new GraphApp('graph-canvas');
const dataInput = document.getElementById('data-input');
const showReg = document.getElementById('show-reg');
const btn = document.getElementById('plot-btn');
const stats = document.getElementById('stats-overlay');
const errorDiv = document.getElementById('error-message');

function update() {
    errorDiv.style.display = 'none';
    app.clear();
    app.drawGrid();
    app.drawAxes();
    
    try {
        const lines = dataInput.value.split('\n');
        const points = [];
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        
        for (const line of lines) {
            const parts = line.split(',');
            if (parts.length >= 2) {
                const x = parseFloat(parts[0]);
                const y = parseFloat(parts[1]);
                if (!isNaN(x) && !isNaN(y)) {
                    points.push({x, y});
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        
        if (points.length === 0) return;
        
        // Draw points
        for (const p of points) {
            app.drawPoint(p.x, p.y, 'black');
        }
        
        // Regression Line
        if (showReg.checked && points.length >= 2) {
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            const n = points.length;
            for (const p of points) {
                sumX += p.x;
                sumY += p.y;
                sumXY += p.x * p.y;
                sumXX += p.x * p.x;
            }
            
            const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            const b = (sumY - m * sumX) / n;
            
            // y = mx + b
            const f = { evaluate: (scope) => m * scope.x + b };
            app.plotFunction(f, 'red', 2);
            
            stats.textContent = `Regression: y = ${m.toFixed(2)}x + ${b.toFixed(2)}`;
        } else {
            stats.textContent = "Regression: Need >1 points";
        }
        
    } catch (e) {
        errorDiv.textContent = "Error: " + e.message;
        errorDiv.style.display = 'block';
    }
}

window.onload = function() {
    btn.onclick = update;
    showReg.onchange = update;
    update();
};
