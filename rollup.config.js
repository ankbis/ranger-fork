import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import pkg from './package.json';

const babelConfig = {
  'presets': [
    ['env']
  ]
};

export default [
	{
		input: 'src/main.umd.js',
		input: ['src/main.umd.js', 'src/json-parser.js'],
		output: {
			name: 'ranger',
			file: pkg.browser,
			format: 'umd'
		},
    plugins: [
      babel(babelrc({
        addExternalHelpersPlugin: false,
        config: babelConfig,
        exclude: 'node_modules/**'
      }))
    ],
	},
	{
    input: 'src/main.cjs.js',
    input: ['src/main.cjs.js', 'src/json-parser.js'],
		output: {
			file: pkg.main,
			format: 'cjs'
		}
  },
	{
		input: 'src/main.es.js',
		input: ['src/main.es.js', 'src/json-parser.js'],
		output: [
			{
				file: pkg.module,
				format: 'es',
				exports: 'named'
			}
		]
	}
];
