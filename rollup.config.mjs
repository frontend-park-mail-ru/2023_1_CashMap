import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'public/index.js',
    output: {
        file: 'public/static/build/bundle.js',
        format: 'iife',
    },
    plugins: [
        nodeResolve(),
        postcss({
            plugins: [
                postcssImport(),
            ],
            extract: true,
            minimize: true,
            entry: 'public/index.css',
        }),
        terser(),
    ],
};
