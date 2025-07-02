import {
    useMode,
    modeLab,
    modeLch,
    differenceEuclidean
} from 'https://cdn.jsdelivr.net/npm/culori/fn/index.js';

// Register the necessary color modes
const lab = useMode(modeLab);
const lch = useMode(modeLch);

function generate_shades(base_lab) {
  if (!base_lab) return [];

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

export { generate_shades }; 