declare const math: typeof import('mathjs');
import { input_lower, input_upper, sliders } from './util.js';
import { plot, type Transfer_Function, type v2 } from './plot.js';

const { multiply, add, square, divide } = math;

const c = {
    L: 1,
    C: 0.1,
    R: 0.2,
};


const transfer_functions: { description: string, func: Transfer_Function }[] = [
    {
        description: 'Series RLC over capacitor',
        func: function (s: math.Complex): math.MathType {
            return divide(
                -1,
                add(
                    multiply(square(s), c.L, c.C),
                    multiply(s, c.R, c.C),
                    1
                )
            );
        },
    },

    {
        description: 'RC Op-amp LPF',
        func: function (s: math.Complex): math.MathType {
            return divide(
                1,
                add(multiply(c.R, c.C, s), 1)
            );
        },
    },

    {
        description: 'RC Op-amp HPF',
        func: function (s: math.Complex): math.MathType {
            return divide(
                multiply(c.R, c.C, s),
                add(multiply(c.R, c.C, s), 1),
            );
        },
    },

    {
        description: 'RC Op-amp BPF',
        func: function (s: math.Complex): math.MathType {
            return divide(
                c.R,
                multiply(add(1, multiply(s, c.R, c.C)), add(c.R, divide(1, multiply(s, c.C)))),
            );
        },
    },

    {
        description: 'RLC Tank',
        func: function (s: math.Complex): math.MathType {
            return divide(
                multiply(s, c.L), 
                add(
                    multiply(square(s), multiply(c.L, c.C)), 
                    add(multiply(divide(c.L, c.R), s), 1))
                )
        }
    }

];

let active_transfer_function: Transfer_Function;

const plot_active = (): void => {
    const LB = parseInt(input_lower.value);
    const UB = parseInt(input_upper.value);

    plot(active_transfer_function, 10 ** LB, 10 ** UB);
}

Object.keys(c).forEach(k => {
    // @ts-ignore
    sliders[k]!.value = c[k].toString();
    // @ts-ignore

    document.getElementById(`${k}-value`)!.textContent = `${k}: ${(c[k] as number).toPrecision(3).toString().padStart(5, "")}`;

    sliders[k]!.addEventListener('input', () => {
        // @ts-ignore
        c[k] = parseFloat(sliders[k]!.value);

        // @ts-ignore
        document.getElementById(`${k}-value`)!.textContent = `${k}: ${c[k]}`;

        plot_active();
    });
})

const set_transfer_function = (i: number | Transfer_Function): void => {
    active_transfer_function = typeof i == 'number' ? transfer_functions[i]?.func! : i;
    plot_active();
}
// @ts-ignore
window._set_transfer_function = set_transfer_function;

// @ts-ignore
window._plot_active = plot_active;

set_transfer_function(0);





const buttons = document.getElementById('buttons') as HTMLDivElement;
transfer_functions.forEach((fn, i) => {

    let s = fn.func.toString();
    s = s.slice(s.indexOf('return ') + 7, s.lastIndexOf(';'))

    s = `<span class='title'>${fn.description}</span>\n\n${s}`;

    buttons.insertAdjacentHTML('beforeend', `<div class="button-card" onclick="_set_transfer_function(${i})"><pre>${s}</pre></button><br>`)

})

// buttons.insertAdjacentHTML('beforeend', `<button onclick="_set_transfer_function()"><pre><span class='title'>Custom Transfer Function<span><textarea></textarea></pre></button><br>`)

document.getElementById('set_custom')!.addEventListener('click', () => {
    const val = (document.getElementById('get_custom') as HTMLInputElement).value;
    const fn = `(s) => {return (${val});}`;

    try {
        set_transfer_function(eval(fn) as unknown as Transfer_Function);
    }
    catch (err) {
        window.alert(`[ERROR] Bad transfer function.\n\n${err}`)
    }
})