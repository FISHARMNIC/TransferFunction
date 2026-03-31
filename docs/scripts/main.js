import { clean_function, init_buttons, init_consts, input_lower, input_upper } from './util.js';
import { plot } from './plot.js';
const { multiply, add, square, divide } = math;
// @ts-ignore
window.c = {
    L: 1,
    C: 0.1,
    R: 0.2,
};
const transfer_functions = [
    {
        description: 'Series RLC over capacitor',
        func: function (s) {
            return divide(-1, add(multiply(square(s), c.L, c.C), multiply(s, c.R, c.C), 1));
        },
    },
    {
        description: 'RC Op-amp LPF',
        func: function (s) {
            return divide(1, add(multiply(c.R, c.C, s), 1));
        },
    },
    {
        description: 'RC Op-amp HPF',
        func: function (s) {
            return divide(multiply(c.R, c.C, s), add(multiply(c.R, c.C, s), 1));
        },
    },
    {
        description: 'RC Op-amp BPF',
        func: function (s) {
            return divide(c.R, multiply(add(1, multiply(s, c.R, c.C)), add(c.R, divide(1, multiply(s, c.C)))));
        },
    },
    {
        description: 'RLC Tank',
        func: function (s) {
            return divide(multiply(s, c.L), add(multiply(square(s), multiply(c.L, c.C)), add(multiply(divide(c.L, c.R), s), 1)));
        }
    }
];
let active_transfer_function;
const plot_active = () => {
    const LB = parseInt(input_lower.value);
    const UB = parseInt(input_upper.value);
    plot(active_transfer_function, 10 ** LB, 10 ** UB);
};
// @ts-ignore
window._plot_active = plot_active;
const set_transfer_function = (i) => {
    if (typeof i == 'number') {
        active_transfer_function = transfer_functions[i];
    }
    else {
        active_transfer_function = {
            func: i,
            description: clean_function(i)
        };
    }
    plot_active();
};
// @ts-ignore
window._set_transfer_function = set_transfer_function;
set_transfer_function(0);
init_consts(c, plot_active);
init_buttons(transfer_functions);
