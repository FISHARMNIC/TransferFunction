export const to_complex = (x) => x;
export const magnitude = (x) => math.abs(x);
const slider_names = ['R', 'L', 'C'];
export let sliders = {};
slider_names.forEach(e => { sliders[e] = document.getElementById(e); });
export const input_prec = document.getElementById('PREC');
export const input_lower = document.getElementById('LB');
export const input_upper = document.getElementById('UB');
