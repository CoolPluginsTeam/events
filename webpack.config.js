/**
 * WordPress Block Standard: Single Entry Point (Combined Build)
 * All blocks register from one main file
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Use default config with single entry point
module.exports = {
	...defaultConfig,
	// Single entry point imports all blocks
	// This creates one build/index.js file for all blocks
};
