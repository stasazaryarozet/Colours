import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('UI Tests', () => {
    let dom;
    let document;
    let window;

    beforeEach(async () => {
        const bundle = fs.readFileSync(path.resolve(__dirname, '../dist/main.bundle.js'), 'utf8');
        dom = new JSDOM(html, { runScripts: 'dangerously' });
        document = dom.window.document;
        window = dom.window;

        const scriptEl = document.createElement('script');
        scriptEl.textContent = bundle;
        document.body.appendChild(scriptEl);

        await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('should render 10 swatches and labels on initial load', () => {
        const swatches = document.querySelectorAll('.swatch');
        const labels = document.querySelectorAll('.swatch + div');
        expect(swatches.length).toBe(10);
        expect(labels.length).toBe(10);
    });

    test('should have one swatch with the "base" class', () => {
        const baseSwatch = document.querySelectorAll('.swatch.base');
        expect(baseSwatch.length).toBe(1);
    });

    test('labels should contain L and C values', () => {
        const labels = document.querySelectorAll('.swatch + div');
        labels.forEach(label => {
            expect(label.textContent).toMatch(/L: \d+\.\d+, C: \d+\.\d+/);
        });
    });

    test('should re-render palette when input values change', async () => {
        const l_input = document.getElementById('l');
        l_input.value = '80';
        l_input.dispatchEvent(new window.Event('input'));

        await new Promise(resolve => setTimeout(resolve, 100));

        const swatches = document.querySelectorAll('.swatch');
        expect(swatches.length).toBe(10);

        const baseSwatch = document.querySelector('.swatch.base');
        expect(baseSwatch).not.toBeNull();
        
        const labels = document.querySelectorAll('.swatch + div');
        expect(labels[labels.length - 1].textContent).toMatch(/L: 90.0, C: 120.0/);
    });
}); 