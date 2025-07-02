import {
    useMode,
    modeLab,
    modeLch,
    differenceEuclidean,
    formatHex,
    clampRgb,
    modeRgb,
    modeHsl,
} from 'https://cdn.jsdelivr.net/npm/culori/fn/index.js';

// Register all necessary color modes at the top level
useMode(modeRgb);
useMode(modeHsl);
useMode(modeLab);
useMode(modeLch);

// --- Copied from colors.js ---
function generate_shades(base_lab) {
  if (!base_lab) return [];
  const lch = useMode(modeLch); // Get converter inside function scope
  const lab = useMode(modeLab);   // Get converter inside function scope

  const base_lch = lch(base_lab);
  const hue = base_lch.h || 0;

  const shades = [];
  const num_shades = 10;
  const l_start = 10, l_end = 90;
  const c_start = 80, c_end = 5;

  const l_step = (l_end - l_start) / (num_shades - 1);
  const c_step = (c_end - c_start) / (num_shades - 1);

  for (let i = 0; i < num_shades; i++) {
    const new_l = l_start + i * l_step;
    const new_c = c_start + i * c_step;
    const new_lch = { mode: 'lch', l: new_l, c: new_c, h: hue };
    shades.push(lab(new_lch));
  }
  
  let closest_index = 0;
  let min_dist = Infinity;
  const distance = differenceEuclidean('lab');

  shades.forEach((shade, index) => {
    const dist = distance(base_lab, shade);
    if (dist < min_dist) {
      min_dist = dist;
      closest_index = index;
    }
  });
  
  shades[closest_index] = base_lab;

  return shades;
}
// --- End of copied code ---


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
        return;
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