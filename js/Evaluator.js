const varX = document.getElementById('var-x');
const varY = document.getElementById('var-y');
const expr1 = document.getElementById('expr-1');
const expr2 = document.getElementById('expr-2');
const res1 = document.getElementById('res-1');
const res2 = document.getElementById('res-2');
const btn = document.getElementById('calc-btn');
const errorDiv = document.getElementById('error-message');

function update() {
    errorDiv.style.display = 'none';
    try {
        const scope = {
            x: math.evaluate(varX.value),
            y: math.evaluate(varY.value)
        };
        
        try {
            res1.textContent = math.evaluate(expr1.value, scope);
        } catch(e) {
            res1.textContent = "Error";
        }
        
        try {
            res2.textContent = math.evaluate(expr2.value, scope);
        } catch(e) {
            res2.textContent = "Error";
        }
        
    } catch (e) {
        errorDiv.textContent = "Invalid variable input: " + e.message;
        errorDiv.style.display = 'block';
    }
}

window.onload = function() {
    btn.onclick = update;
    varX.onchange = update;
    varY.onchange = update;
    expr1.onchange = update;
    expr2.onchange = update;
    update();
};
