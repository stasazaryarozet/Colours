import { generate_shades } from './colors.js';
import { formatHex, clampRgb, converter } from 'culori';

const l_input = document.getElementById('l');
const a_input = document.getElementById('a');
const b_input = document.getElementById('b');
const palette_container = document.getElementById('palette');

const lch_converter = converter('lch');

function render_palette() {
    palette_container.innerHTML = '';

    const base_color_lab = {
        mode: 'lab',
        l: parseFloat(l_input.value),
        a: parseFloat(a_input.value),
        b: parseFloat(b_input.value)
    };
    
    if (isNaN(base_color_lab.l) || isNaN(base_color_lab.a) || isNaN(base_color_lab.b)) {
        return;
    }

    const shades = generate_shades(base_color_lab);

    shades.forEach(color => {
        const swatch_wrapper = document.createElement('div');
        swatch_wrapper.style.textAlign = 'center';

        const swatch = document.createElement('div');
        swatch.classList.add('swatch');
        
        const displayable_color = clampRgb(color);
        swatch.style.backgroundColor = formatHex(displayable_color);

        if (color.l === base_color_lab.l && color.a === base_color_lab.a && color.b === base_color_lab.b) {
            swatch.classList.add('base');
        }
        
        const color_lch = lch_converter(color);
        
        const label = document.createElement('div');
        label.style.fontSize = '0.75rem';
        label.style.marginTop = '0.5rem';
        label.textContent = `L: ${color_lch.l.toFixed(1)}, C: ${color_lch.c.toFixed(1)}`;

        swatch_wrapper.appendChild(swatch);
        swatch_wrapper.appendChild(label);
        palette_container.appendChild(swatch_wrapper);
    });
}

render_palette();

[l_input, a_input, b_input].forEach(input => {
    input.addEventListener('input', render_palette);
});
