class GraphApp {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.xMin = -5;
        this.xMax = 5;
        this.yMin = -5;
        this.yMax = 5;
    }

    toCanvasX(x) {
        return (x - this.xMin) / (this.xMax - this.xMin) * this.width;
    }

    toCanvasY(y) {
        return this.height - (y - this.yMin) / (this.yMax - this.yMin) * this.height;
    }

    toMathX(cx) {
        return this.xMin + (cx / this.width) * (this.xMax - this.xMin);
    }
    
    toMathY(cy) {
        return this.yMax - (cy / this.height) * (this.yMax - this.yMin);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawGrid() {
        const ctx = this.ctx;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        
        // Vertical grid lines
        for (let x = Math.ceil(this.xMin); x <= Math.floor(this.xMax); x++) {
            const cx = this.toCanvasX(x);
            ctx.moveTo(cx, 0);
            ctx.lineTo(cx, this.height);
        }
        
        // Horizontal grid lines
        for (let y = Math.ceil(this.yMin); y <= Math.floor(this.yMax); y++) {
            const cy = this.toCanvasY(y);
            ctx.moveTo(0, cy);
            ctx.lineTo(this.width, cy);
        }
        
        ctx.stroke();
    }

    drawAxes() {
        const ctx = this.ctx;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // X-axis
        const y0 = this.toCanvasY(0);
        ctx.moveTo(0, y0);
        ctx.lineTo(this.width, y0);
        
        // Y-axis
        const x0 = this.toCanvasX(0);
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, this.height);
        
        ctx.stroke();
        
        // Axis labels
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // X ticks
        for (let x = Math.ceil(this.xMin); x <= Math.floor(this.xMax); x++) {
            if (x === 0) continue;
            const cx = this.toCanvasX(x);
            ctx.fillText(x, cx, y0 + 15);
            ctx.beginPath();
            ctx.moveTo(cx, y0 - 3);
            ctx.lineTo(cx, y0 + 3);
            ctx.stroke();
        }
        
        // Y ticks
        ctx.textAlign = 'right';
        for (let y = Math.ceil(this.yMin); y <= Math.floor(this.yMax); y++) {
            if (y === 0) continue;
            const cy = this.toCanvasY(y);
            ctx.fillText(y, x0 - 5, cy + 4);
            ctx.beginPath();
            ctx.moveTo(x0 - 3, cy);
            ctx.lineTo(x0 + 3, cy);
            ctx.stroke();
        }
    }

    // Plot y = f(x)
    plotFunction(compiledFunc, color = 'blue', width = 2, dash = [], scope = {}) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.setLineDash(dash);
        ctx.beginPath();
        
        let firstPoint = true;
        const step = (this.xMax - this.xMin) / this.width;
        
        // Clone scope to avoid modifying the original if passed by reference
        const localScope = Object.assign({}, scope);

        for (let px = 0; px <= this.width; px++) {
            const x = this.xMin + px * step;
            try {
                localScope.x = x;
                const y = compiledFunc.evaluate(localScope);
                
                if (isFinite(y) && y >= this.yMin * 2 && y <= this.yMax * 2) {
                    const cx = px;
                    const cy = this.toCanvasY(y);
                    
                    if (firstPoint) {
                        ctx.moveTo(cx, cy);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(cx, cy);
                    }
                } else {
                    firstPoint = true;
                }
            } catch (e) {
                firstPoint = true;
            }
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Plot x = f(t), y = g(t)
    plotParametric(xFunc, yFunc, tMin, tMax, color = 'blue', width = 2, intervals = 500, scope = {}) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        
        let firstPoint = true;
        const step = (tMax - tMin) / intervals;
        const localScope = Object.assign({}, scope);

        for (let t = tMin; t <= tMax; t += step) {
             try {
                localScope.t = t;
                const x = xFunc.evaluate(localScope);
                const y = yFunc.evaluate(localScope);
                
                if (isFinite(x) && isFinite(y)) {
                    const cx = this.toCanvasX(x);
                    const cy = this.toCanvasY(y);
                    
                    if (firstPoint) {
                        ctx.moveTo(cx, cy);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(cx, cy);
                    }
                } else {
                    firstPoint = true;
                }
             } catch (e) {
                firstPoint = true;
             }
        }
        ctx.stroke();
    }
    
    drawPoint(x, y, color) {
        const cx = this.toCanvasX(x);
        const cy = this.toCanvasY(y);
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
}
