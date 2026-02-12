// Constants and State
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const X_MIN = -5;
const X_MAX = 5;
const Y_MIN = -5;
const Y_MAX = 5;

// Global state
let state = {
    functionStr: 'x^3 - 2*x + 1',
    xValue: 0,
    showDerivative: true,
    showSecondDerivative: false,
    showTangent: true,
    compiledFunc: null,
    compiledDeriv: null,
    compiledSecondDeriv: null
};

// Canvas context
const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const inputField = document.getElementById('function-input');
const plotBtn = document.getElementById('plot-btn');
const examplesSelect = document.getElementById('examples');
const xSlider = document.getElementById('x-slider');
const xValueDisplay = document.getElementById('x-value');
const valFDisplay = document.getElementById('val-f');
const valDfDisplay = document.getElementById('val-df');
const fxDisplay = document.getElementById('fx-display');
const dfxDisplay = document.getElementById('dfx-display');
const tangentDisplay = document.getElementById('tangent-display');
const showDerivCheck = document.getElementById('show-derivative');
const showSecondDerivCheck = document.getElementById('show-second-derivative');
const showTangentCheck = document.getElementById('show-tangent');

// Initialization
function init() {
    // Set up event listeners
    plotBtn.addEventListener('click', updateFunction);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') updateFunction();
    });
    
    examplesSelect.addEventListener('change', () => {
        inputField.value = examplesSelect.value;
        updateFunction();
    });
    
    xSlider.addEventListener('input', updateXValue);
    
    showDerivCheck.addEventListener('change', () => {
        state.showDerivative = showDerivCheck.checked;
        draw();
    });
    
    showSecondDerivCheck.addEventListener('change', () => {
        state.showSecondDerivative = showSecondDerivCheck.checked;
        draw();
    });
    
    showTangentCheck.addEventListener('change', () => {
        state.showTangent = showTangentCheck.checked;
        draw();
    });
    
    // Initial plot
    updateFunction();
}

// Update function from input
function updateFunction() {
    const expr = inputField.value;
    try {
        // Parse using math.js
        const node = math.parse(expr);
        state.compiledFunc = node.compile();
        
        // Calculate derivatives symbolically
        const derivNode = math.derivative(node, 'x');
        state.compiledDeriv = derivNode.compile();
        
        const secondDerivNode = math.derivative(derivNode, 'x');
        state.compiledSecondDeriv = secondDerivNode.compile();
        
        state.functionStr = expr;
        
        // Update display text
        fxDisplay.textContent = `f(x) = ${expr}`;
        dfxDisplay.textContent = `f'(x) = ${derivNode.toString()}`;
        
        draw();
        updateInfoPanel();
    } catch (err) {
        alert('Invalid function: ' + err.message);
    }
}

// Update x value from slider
function updateXValue() {
    state.xValue = parseFloat(xSlider.value);
    xValueDisplay.textContent = state.xValue.toFixed(2);
    draw();
    updateInfoPanel();
}

// Update info panel values
function updateInfoPanel() {
    if (!state.compiledFunc) return;
    
    const scope = { x: state.xValue };
    const y = state.compiledFunc.evaluate(scope);
    const m = state.compiledDeriv.evaluate(scope); // slope
    
    valFDisplay.textContent = y.toFixed(4);
    valDfDisplay.textContent = m.toFixed(4);
    
    // Tangent line equation: y - y1 = m(x - x1) => y = m*x + (y1 - m*x1)
    const intercept = y - m * state.xValue;
    const sign = intercept >= 0 ? '+' : '-';
    tangentDisplay.textContent = `Tangent: y = ${m.toFixed(2)}x ${sign} ${Math.abs(intercept).toFixed(2)}`;
}

// Coordinate transformations
function toCanvasX(x) {
    return (x - X_MIN) / (X_MAX - X_MIN) * CANVAS_WIDTH;
}

function toCanvasY(y) {
    return CANVAS_HEIGHT - (y - Y_MIN) / (Y_MAX - Y_MIN) * CANVAS_HEIGHT;
}

// Drawing functions
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    drawGrid();
    drawAxes();
    
    if (state.compiledFunc) {
        drawFunction(state.compiledFunc, 'blue', 2);
        
        if (state.showDerivative && state.compiledDeriv) {
            drawFunction(state.compiledDeriv, 'red', 1.5, [5, 5]); // dashed
        }
        
        if (state.showSecondDerivative && state.compiledSecondDeriv) {
            drawFunction(state.compiledSecondDeriv, 'purple', 1, [2, 2]); // dotted
        }
        
        if (state.showTangent) {
            drawTangentLine();
        }
        
        drawPoints();
    }
}

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    
    // Vertical grid lines
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        const cx = toCanvasX(x);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, CANVAS_HEIGHT);
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        const cy = toCanvasY(y);
        ctx.moveTo(0, cy);
        ctx.lineTo(CANVAS_WIDTH, cy);
    }
    
    ctx.stroke();
}

function drawAxes() {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // X-axis
    const y0 = toCanvasY(0);
    ctx.moveTo(0, y0);
    ctx.lineTo(CANVAS_WIDTH, y0);
    
    // Y-axis
    const x0 = toCanvasX(0);
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, CANVAS_HEIGHT);
    
    ctx.stroke();
    
    // Axis labels
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // X ticks
    for (let x = Math.ceil(X_MIN); x <= Math.floor(X_MAX); x++) {
        if (x === 0) continue;
        const cx = toCanvasX(x);
        ctx.fillText(x, cx, y0 + 15);
        ctx.beginPath();
        ctx.moveTo(cx, y0 - 3);
        ctx.lineTo(cx, y0 + 3);
        ctx.stroke();
    }
    
    // Y ticks
    ctx.textAlign = 'right';
    for (let y = Math.ceil(Y_MIN); y <= Math.floor(Y_MAX); y++) {
        if (y === 0) continue;
        const cy = toCanvasY(y);
        ctx.fillText(y, x0 - 5, cy + 4);
        ctx.beginPath();
        ctx.moveTo(x0 - 3, cy);
        ctx.lineTo(x0 + 3, cy);
        ctx.stroke();
    }
}

function drawFunction(compiled, color, width, dash = []) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    
    let firstPoint = true;
    const step = (X_MAX - X_MIN) / CANVAS_WIDTH; // 1 pixel per step
    
    for (let px = 0; px <= CANVAS_WIDTH; px++) {
        const x = X_MIN + px * step;
        try {
            const y = compiled.evaluate({x: x});
            
            // Only draw if within reasonable bounds (avoid infinity/NaN)
            if (isFinite(y) && y >= Y_MIN * 2 && y <= Y_MAX * 2) {
                const cx = px;
                const cy = toCanvasY(y);
                
                if (firstPoint) {
                    ctx.moveTo(cx, cy);
                    firstPoint = false;
                } else {
                    ctx.lineTo(cx, cy);
                }
            } else {
                firstPoint = true; // Break line for discontinuities
            }
        } catch (e) {
            firstPoint = true;
        }
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawTangentLine() {
    const x = state.xValue;
    const scope = { x: x };
    const y = state.compiledFunc.evaluate(scope);
    const m = state.compiledDeriv.evaluate(scope);
    
    // Calculate endpoints of tangent line segment visible on screen
    // y - y0 = m(x - x0)
    // line extends from x - 2 to x + 2 for visual effect
    const x1 = x - 2;
    const x2 = x + 2;
    const y1 = y + m * (x1 - x);
    const y2 = y + m * (x2 - x);
    
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
    ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
    ctx.stroke();
}

function drawPoints() {
    const x = state.xValue;
    const scope = { x: x };
    
    // Point on function
    const y = state.compiledFunc.evaluate(scope);
    drawPoint(x, y, 'blue');
    
    // Point on derivative
    if (state.showDerivative) {
        const dy = state.compiledDeriv.evaluate(scope);
        drawPoint(x, dy, 'red');
        
        // Dotted vertical line connecting them
        ctx.strokeStyle = '#aaa';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(toCanvasX(x), toCanvasY(y));
        ctx.lineTo(toCanvasX(x), toCanvasY(dy));
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function drawPoint(x, y, color) {
    const cx = toCanvasX(x);
    const cy = toCanvasY(y);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Highlight
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Start app
window.onload = init;