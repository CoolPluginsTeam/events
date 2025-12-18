<?php
/**
 * Plugin Name: Events
 * Description: Events Gutenberg Block to Create List Events In Block Editor.
 * Author:      Cool Plugins
 * Author URI:  https://coolplugins.net/?utm_source=evt_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugins_list
 * Version:     1.0
 * License:     GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Register Block Scripts
add_action( 'init', function() {
	$asset_file   = __DIR__ . '/build/index.asset.php';
	$asset        = file_exists( $asset_file ) ? require_once $asset_file : null;
	$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
	$version      = isset( $asset['version'] ) ? $asset['version'] : filemtime( __DIR__ . '/index.js' );

	// Block JS
	wp_register_script(
		'evt-event',
		plugins_url( 'build/index.js', __FILE__ ),
		$dependencies,
		$version,
		true
	);

	// Pass plugin assets URLs to JavaScript
	wp_localize_script( 'evt-event', 'evtPluginData', [
		'pluginUrl' => plugins_url( '', __FILE__ ),
		'images' => [
			'crazyDJ' => plugins_url( 'assets/images/crazy-DJ-experience-santa-cruz.webp', __FILE__ ),
			'rockBand' => plugins_url( 'assets/images/cute-girls-rock-band-performance.webp', __FILE__ ),
			'foodDistribution' => plugins_url( 'assets/images/free-food-distribution-at-mumbai.webp', __FILE__ ),
		]
	] );

	// Block front end style
	wp_register_style(
		'evt-event',
		plugins_url( 'style.css', __FILE__ ),
		[],
		filemtime( __DIR__ . '/style.css' )
	);

	// Block editor style
	wp_register_style(
		'evt-event-editor',
		plugins_url( 'editor.css', __FILE__ ),
		[],
		filemtime( __DIR__ . '/editor.css' )
	);
} );

/**
 * AUTO-GENERATED blocks will be added here
 */

include_once __DIR__ . '/blocks/event.php';
