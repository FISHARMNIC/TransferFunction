import { input_prec, magnitude, to_complex } from './util.js';
const { multiply } = math;
const gen_points = (transfer_function, lower, upper) => {
    const out = { x: [], y: [] };
    let step = 1.01; // parseFloat(input_prec.value);
    let last = null;
    for (let x = lower; x < upper; x *= step) {
        const mag_lin = magnitude(transfer_function(to_complex(multiply(math.i, x))));
        out.x.push(x);
        out.y.push(20 * Math.log10(mag_lin));
        if (last) {
            const ROC = Math.abs((mag_lin - last) / (x * step - x));
            if (ROC > 10) {
                step = 0.5 / ROC + 1; // increased precision for peaks. kinda cheap but ok
                last = mag_lin;
                continue;
            }
        }
        step = 1.01;
        last = mag_lin;
    }
    return out;
};
let first = true;
export const plot = (transfer_function, lower, upper) => {
    const points = gen_points(transfer_function, lower, upper);
    const trace2 = {
        x: points.x,
        y: points.y,
        type: 'scatter',
        // line: { color: 'orange' }
    };
    const layout = {
        xaxis: {
            type: 'log',
            autorange: true,
            title: { text: 'ω (rad/s)' }
        },
        yaxis: {
            // type: 'log' as const,
            autorange: true,
            title: { text: '|H(jω)| (db)' }
        },
        title: { text: 'Magnitude Plot' }
        // paper_bgcolor: '#33383b',
        // plot_bgcolor: '#33383b',
    };
    var data = [trace2];
    if (first) {
        Plotly.newPlot('chart', data, layout);
        first = false;
    }
    else {
        Plotly.react('chart', data, layout);
        // Plotly.react('chart', { data, layout }, {
        //     transition: { duration: 10},
        //     frame: { duration: 10 }
        // });
    }
};
