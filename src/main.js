import { generate_shades } from './colors.js';
import {
    formatHex,
    clampRgb,
    // The functions below are needed because we use culori/fn
    // which requires manual registration of color spaces.
    useMode,
    modeRgb,
    modeHsl, // used by formatHex
    modeLab,
    modeLch
} from 'https://cdn.jsdelivr.net/npm/culori/fn/index.js';

// Since we are using the tree-shakeable 'culori/fn',
// we have to register all the color spaces we need.
useMode(modeRgb);
useMode(modeHsl);
useMode(modeLab);
useMode(modeLch);


const l_input = document.getElementById('l');
const a_input = document.getElementById('a');
const b_input = document.getElementById('b');
const palette_container = document.getElementById('palette');

function render_palette() {
    palette_container.innerHTML = '';

    const base_color_lab = {
        mode: 'lab',
        l: parseFloat(l_input.value),
        a: parseFloat(a_input.value),
        b: parseFloat(b_input.value)
    };
    
    if (isNaN(base_color_lab.l) || isNaN(base_color_lab.a) || isNaN(base_color_lab.b)) {
        return; // Do nothing if inputs are invalid
    }

    const shades = generate_shades(base_color_lab);

    shades.forEach(color => {
        const swatch = document.createElement('div');
        swatch.classList.add('swatch');
        
        const displayable_color = clampRgb(color);
        swatch.style.backgroundColor = formatHex(displayable_color);

        if (color.l === base_color_lab.l && color.a === base_color_lab.a && color.b === base_color_lab.b) {
            swatch.classList.add('base');
            swatch.title = `Base Color: L*=${color.l.toFixed(3)}, a*=${color.a.toFixed(3)}, b*=${color.b.toFixed(3)}`;
        }

        palette_container.appendChild(swatch);
    });
}

// Initial render
render_palette();

// Add event listeners
[l_input, a_input, b_input].forEach(input => {
    input.addEventListener('input', render_palette);
}); 