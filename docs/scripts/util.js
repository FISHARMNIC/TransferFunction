const { multiply, add, square, divide } = math;
export let sliders = {};
export let number_inputs = {};
export const to_complex = (x) => x;
export const magnitude = (x) => math.abs(x);
export const input_prec = document.getElementById('PREC');
export const input_lower = document.getElementById('LB');
export const input_upper = document.getElementById('UB');
const slider_names = ['R', 'L', 'C'];
slider_names.forEach(e => {
    sliders[e] = document.getElementById(e);
    number_inputs[e] = document.getElementById(`${e}-number`);
});
export const clean_function = (func) => {
    let s = func.toString();
    s = s.slice(s.indexOf('return ') + 7, s.lastIndexOf(';'));
    return s;
};
export const init_consts = (c, callback) => {
    Object.keys(c).forEach(k => {
        // @ts-ignore
        sliders[k].value = c[k].toString();
        // @ts-ignore
        number_inputs[k].value = c[k].toString();
        const update = (val) => {
            const v2 = parseFloat(val);
            if (isNaN(v2))
                return;
            // @ts-ignore
            c[k] = v2;
            sliders[k].value = Math.min(Math.max(v2, 0.001), 1).toString();
            number_inputs[k].value = val;
            callback();
        };
        sliders[k].addEventListener('input', () => update(sliders[k].value));
        number_inputs[k].addEventListener('change', () => update(number_inputs[k].value));
    });
};
export const init_buttons = (transfer_functions) => {
    const buttons = document.getElementById('buttons');
    transfer_functions.forEach((fn, i) => {
        let s = clean_function(fn.func);
        s = `<span class='title'>${fn.description}</span>\n\n${s}`;
        buttons.insertAdjacentHTML('beforeend', `<div class="button-card" onclick="_set_transfer_function(${i})"><pre>${s}</pre></button><br>`);
    });
    document.getElementById('set_custom').addEventListener('click', () => {
        const val = document.getElementById('get_custom').value;
        const fn = `(s) => {return (${val});}`;
        try {
            // @ts-ignore
            window._set_transfer_function(eval(fn));
        }
        catch (err) {
            window.alert(`[ERROR] Bad transfer function.\n\n${err}`);
        }
    });
};
