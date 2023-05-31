import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'public/index.js', // Путь к вашему основному файлу JS
    output: {
        file: 'public/build/bundle.js', // Путь, по которому будет сохранен собранный файл JS
        format: 'iife' // Формат вывода, который будет поддерживаться браузерами
    },
    plugins: [
        nodeResolve(),
        postcss({
            plugins: [
                postcssImport(),
                // Другие плагины PostCSS, которые вы используете
            ],
            extract: true, // Извлечь стили в отдельный CSS файл
            minimize: true, // Минифицировать стили
            entry: 'public/index.css',
        }),
        terser(),
    ],
};