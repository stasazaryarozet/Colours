import { generate_shades } from '../src/colors.js';
import { converter } from 'culori';

describe('generate_shades', () => {
    it('should generate 10 shades with constant hue and include the base color', () => {
        const base_lab = { mode: 'lab', l: 50, a: 20, b: 30 };
        
        const shades = generate_shades(base_lab);

        const lch = converter('lch');
        const base_lch = lch(base_lab);

        expect(shades).toHaveLength(10);

        shades.forEach(shade => {
            const shade_lch = lch(shade);
            if (base_lch.h !== undefined && shade_lch.h !== undefined) {
                expect(shade_lch.h).toBeCloseTo(base_lch.h);
            }
        });
        
        const containsBaseColor = shades.some(shade => 
            shade.l === base_lab.l && shade.a === base_lab.a && shade.b === base_lab.b
        );
        expect(containsBaseColor).toBe(true);
    });
}); 