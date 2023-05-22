import css from 'rollup-plugin-css-only'

export default {
    input: 'public/index.js',
    output: {
        file: 'public/build/bundle.js',
        format: 'cjs',
        inlineDynamicImports: true,
    },
    plugins: [
        css({output: 'bundle.css'})
    ]
};