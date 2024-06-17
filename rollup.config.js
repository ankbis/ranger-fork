import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import pkg from './package.json';
import redis from 'redis';

const babelConfig = {
  'presets': [
    ['env']
  ]
};

export default [
	{
		external: ['redis'],
		input: 'src/main.umd.js',
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
		external: ['redis'],
		output: {
			file: pkg.main,
			format: 'cjs'
		}
  },
	{
		input: 'src/main.es.js',
		external: ['redis'],
		output: [
			{
				file: pkg.module,
				format: 'es',
				exports: 'named'
			}
		]
	}
];
