/**
 * WordPress Block Standard: Multiple Entry Points
 * Extends default @wordpress/scripts webpack config
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	entry: {
		// Each block gets its own entry point (WordPress Standard)
		'events-grid/index': path.resolve( process.cwd(), 'src/events-grid', 'index.js' ),
		'event-item/index': path.resolve( process.cwd(), 'src/event-item', 'index.js' ),
		'event-date-badge/index': path.resolve( process.cwd(), 'src/event-date-badge', 'index.js' ),
	},
	output: {
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'build' ),
	},
};
