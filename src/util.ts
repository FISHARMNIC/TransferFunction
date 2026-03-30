import type { MathJsInstance } from "mathjs";
declare const math: MathJsInstance;

export const to_complex = (x: math.MathType) => x as unknown as math.Complex;
export const magnitude = (x: math.MathType) => math.abs(x) as unknown as number;

const slider_names = ['R', 'L', 'C'];

export let sliders: Record<string, HTMLInputElement> = {};

slider_names.forEach(e => { sliders[e] = document.getElementById(e) as HTMLInputElement });

export const input_prec = document.getElementById('PREC') as HTMLInputElement;
export const input_lower = document.getElementById('LB') as HTMLInputElement;
export const input_upper = document.getElementById('UB') as HTMLInputElement;
