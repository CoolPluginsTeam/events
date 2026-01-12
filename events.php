<?php
/**
 * Plugin Name: Events
 * Description: Events Gutenberg Block to Create Events Grid In Block Editor.
 * Author:      Cool Plugins
 * Author URI:  https://coolplugins.net/?utm_source=evt_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugins_list
 * Version:     1.0
 * License:     GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: evt
 */

 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register Plugin Assets
 */
function evt_register_plugin_assets() {
	// Register Shared Styles
	wp_register_style(
		'evt-event',
		plugins_url( 'style.css', __FILE__ ),
		[],
		filemtime( __DIR__ . '/style.css' )
	);

	wp_register_style(
		'evt-event-editor',
		plugins_url( 'editor.css', __FILE__ ),
		[],
		filemtime( __DIR__ . '/editor.css' )
	);
	
	wp_register_style(
		'evt-icons',
		plugins_url( 'assets/css/evt-icons.css', __FILE__ ),
		[],
		filemtime( __DIR__ . '/assets/css/evt-icons.css' )
	);

	// Register Extensions/Globals Script
	$asset_file = __DIR__ . '/build/index.asset.php';
	$asset      = file_exists( $asset_file ) ? require( $asset_file ) : null;
	
	if ( $asset ) {
		wp_register_script(
			'evt-globals',
			plugins_url( 'build/index.js', __FILE__ ),
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Localize Data
		wp_localize_script( 'evt-globals', 'evtPluginData', [
			'pluginUrl' => plugins_url( '', __FILE__ ),
			'images' => [
				'crazyDJ' => plugins_url( 'assets/images/crazy-DJ-experience-santa-cruz.webp', __FILE__ ),
				'rockBand' => plugins_url( 'assets/images/cute-girls-rock-band-performance.webp', __FILE__ ),
				'foodDistribution' => plugins_url( 'assets/images/free-food-distribution-at-mumbai.webp', __FILE__ ),
			]
		] );
	}
}
add_action( 'init', 'evt_register_plugin_assets' );

/**
 * Enqueue Editor Assets
 */
function evt_enqueue_editor_assets() {
	wp_enqueue_script( 'evt-globals' );
	wp_enqueue_style( 'evt-icons' );
	wp_enqueue_style( 'evt-event-editor' );
}
add_action( 'enqueue_block_editor_assets', 'evt_enqueue_editor_assets' );

/**
 * Enqueue Frontend Assets
 */
function evt_enqueue_frontend_assets() {
	wp_enqueue_style( 'evt-icons' );
	wp_enqueue_style( 'evt-event' );
}
add_action( 'wp_enqueue_scripts', 'evt_enqueue_frontend_assets' );

/**
 * Load Blocks
 */
require_once __DIR__ . '/blocks/event.php';
