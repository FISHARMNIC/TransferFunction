export const to_complex = (x) => x;
export const magnitude = (x) => math.abs(x);
const slider_names = ['R', 'L', 'C'];
export let sliders = {};
export let number_inputs = {};
slider_names.forEach(e => {
    sliders[e] = document.getElementById(e);
    number_inputs[e] = document.getElementById(`${e}-number`);
});
export const input_prec = document.getElementById('PREC');
export const input_lower = document.getElementById('LB');
export const input_upper = document.getElementById('UB');
