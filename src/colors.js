import { converter } from 'culori';

export function generate_shades(base_lab) {
    const lch_converter = converter('lch');
    const lab_converter = converter('lab');

    const base_lch = lch_converter(base_lab);
    const hue = base_lch.h || 0;

    const l_min = 10;
    const l_max = 90;
    const c_min = 5;
    const c_max = 120;

    let shades_lch = [];
    for (let i = 0; i < 10; i++) {
        const l = l_min + (i * (l_max - l_min)) / 9;
        const c = c_min + (i * (c_max - c_min)) / 9;
        shades_lch.push({ mode: 'lch', l, c, h: hue });
    }

    let closest_index = -1;
    let min_dist = Infinity;

    for (let i = 0; i < shades_lch.length; i++) {
        const dist = Math.sqrt(
            Math.pow(shades_lch[i].l - base_lch.l, 2) +
            Math.pow(shades_lch[i].c - base_lch.c, 2)
        );
        if (dist < min_dist) {
            min_dist = dist;
            closest_index = i;
        }
    }

    const shades_lab = shades_lch.map(color => lab_converter(color));
    
    if (closest_index !== -1) {
        shades_lab[closest_index] = base_lab;
    }

    return shades_lab;
} 