import css from 'rollup-plugin-css-only'
import handlebars from 'rollup-plugin-handlebars-plus'

export default {
    input: 'public/index.js',
    output: {
        file: 'public/build/bundle.js',
        format: 'iife',
    },
    plugins: [
        css({output: 'bundle.css'}),
    ]
};