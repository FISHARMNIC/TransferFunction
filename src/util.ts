import type { MathJsInstance } from "mathjs";
declare const math: MathJsInstance;
const { multiply, add, square, divide } = math;

import type { Transfer_Function, Transfer_Function_Entry } from "./plot";

export let sliders: Record<string, HTMLInputElement> = {};
export let number_inputs: Record<string, HTMLInputElement> = {};
export const to_complex = (x: math.MathType) => x as unknown as math.Complex;
export const magnitude = (x: math.MathType) => math.abs(x) as unknown as number;
export const input_prec = document.getElementById('PREC') as HTMLInputElement;
export const input_lower = document.getElementById('LB') as HTMLInputElement;
export const input_upper = document.getElementById('UB') as HTMLInputElement;

const slider_names = ['R', 'L', 'C'];
slider_names.forEach(e => {
    sliders[e] = document.getElementById(e) as HTMLInputElement;
    number_inputs[e] = document.getElementById(`${e}-number`) as HTMLInputElement;
});

export const clean_function = (func: any) => {
    let s = func.toString();
    s = s.slice(s.indexOf('return ') + 7, s.lastIndexOf(';'))

    return s;
}

export const init_consts = (c: any, callback: any) => {

    Object.keys(c).forEach(k => {
        // @ts-ignore
        sliders[k]!.value = c[k].toString();
        // @ts-ignore
        number_inputs[k]!.value = c[k].toString();

        const update = (val: string) => {
            const v2 = parseFloat(val);
            if (isNaN(v2)) return;

            // @ts-ignore
            c[k] = v2;
            sliders[k]!.value = Math.min(Math.max(v2, 0.001), 1).toString();
            number_inputs[k]!.value = val;
            callback();
        };

        sliders[k]!.addEventListener('input', () => update(sliders[k]!.value));
        number_inputs[k]!.addEventListener('change', () => update(number_inputs[k]!.value));
    });

}

export const init_buttons = (transfer_functions: Transfer_Function_Entry[]) => {
    const buttons = document.getElementById('buttons') as HTMLDivElement;
    transfer_functions.forEach((fn, i) => {

        let s = clean_function(fn.func);

        s = `<span class='title'>${fn.description}</span>\n\n${s}`;

        buttons.insertAdjacentHTML('beforeend', `<div class="button-card" onclick="_set_transfer_function(${i})"><pre>${s}</pre></button><br>`)

    })

    document.getElementById('set_custom')!.addEventListener('click', () => {
        const val = (document.getElementById('get_custom') as HTMLInputElement).value;
        const fn = `(s) => {return (${val});}`;

        try {
            // @ts-ignore
            window._set_transfer_function(eval(fn) as unknown as Transfer_Function);
        }
        catch (err) {
            window.alert(`[ERROR] Bad transfer function.\n\n${err}`)
        }
    })
}