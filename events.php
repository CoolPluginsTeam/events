<?php
/**
 * Plugin Name: Events
 * Description: Events Gutenberg Block to Create Events Grid In Block Editor.
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
	
	// Fontello Icon Font
	wp_register_style(
		'evt-icons',
		plugins_url( 'assets/CSS/evt-icons.css', __FILE__ ),
		[],
		filemtime( __DIR__ . '/assets/CSS/evt-icons.css' )
	);
} );

// Enqueue Google Fonts (100 fonts including)
add_action( 'wp_enqueue_scripts', function() {
	wp_enqueue_style(
		'evt-google-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;600;700;800&family=Lato:wght@100;300;400;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Ubuntu:wght@300;400;500;700&family=Nunito:wght@200;300;400;600;700;800;900&family=Oswald:wght@200;300;400;500;600;700&family=Source+Sans+Pro:wght@200;300;400;600;700;900&family=PT+Sans:wght@400;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Lobster&family=Bebas+Neue&family=Fjalla+One&family=Anton&family=Righteous&family=Bangers&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@100;200;300;400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=PT+Serif:wght@400;700&family=Noto+Sans:wght@100;200;300;400;500;600;700;800;900&family=Noto+Serif:wght@400;700&family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&family=DM+Serif+Display&family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@200;300;400;500;600;700;800&family=Sora:wght@100;200;300;400;500;600;700;800&family=Epilogue:wght@100;200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Figtree:wght@300;400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&family=Red+Hat+Display:wght@400;500;600;700;800;900&family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&family=IBM+Plex+Serif:wght@100;200;300;400;500;600;700&family=Fira+Sans:wght@100;200;300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&family=Inconsolata:wght@200;300;400;500;600;700;800;900&family=Cousine:wght@400;700&family=Space+Mono:wght@400;700&family=Rubik:wght@300;400;500;600;700;800;900&family=Karla:wght@200;300;400;500;600;700;800&family=Archivo:wght@100;200;300;400;500;600;700;800;900&family=Titillium+Web:wght@200;300;400;600;700;900&family=Muli:wght@200;300;400;500;600;700;800;900&family=Cabin:wght@400;500;600;700&family=Hind:wght@300;400;500;600;700&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@100;200;300;400;500;600;700;800;900&family=Kanit:wght@100;200;300;400;500;600;700;800;900&family=Prompt:wght@100;200;300;400;500;600;700;800;900&family=Sarabun:wght@100;200;300;400;500;600;700;800&family=Chakra+Petch:wght@300;400;500;600;700&family=Mitr:wght@200;300;400;500;600&family=Bai+Jamjuree:wght@200;300;400;500;600;700&family=Athiti:wght@200;300;400;500;600;700&family=Srisakdi:wght@400;700&family=Itim&family=Charm:wght@400;700&family=Pattaya&family=Sriracha&family=Mali:wght@200;300;400;500;600;700&family=Charmonman:wght@400;700&family=Kodchasan:wght@200;300;400;500;600;700&family=Niramit:wght@200;300;400;500;600;700&display=swap',
		[],
		null
	);
	
	// Enqueue Icons Icon Font
	wp_enqueue_style( 'evt-icons' );
} );

add_action( 'enqueue_block_editor_assets', function() {
	wp_enqueue_style(
		'evt-google-fonts-editor',
		'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;600;700;800&family=Lato:wght@100;300;400;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Merriweather:wght@300;400;700;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Ubuntu:wght@300;400;500;700&family=Nunito:wght@200;300;400;600;700;800;900&family=Oswald:wght@200;300;400;500;600;700&family=Source+Sans+Pro:wght@200;300;400;600;700;900&family=PT+Sans:wght@400;700&family=Dancing+Script:wght@400;500;600;700&family=Pacifico&family=Lobster&family=Bebas+Neue&family=Fjalla+One&family=Anton&family=Righteous&family=Bangers&family=Comfortaa:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@100;200;300;400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;500;600;700&family=PT+Serif:wght@400;700&family=Noto+Sans:wght@100;200;300;400;500;600;700;800;900&family=Noto+Serif:wght@400;700&family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&family=DM+Serif+Display&family=Space+Grotesk:wght@300;400;500;600;700&family=Manrope:wght@200;300;400;500;600;700;800&family=Sora:wght@100;200;300;400;500;600;700;800&family=Epilogue:wght@100;200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Figtree:wght@300;400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&family=Red+Hat+Display:wght@400;500;600;700;800;900&family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&family=IBM+Plex+Serif:wght@100;200;300;400;500;600;700&family=Fira+Sans:wght@100;200;300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Source+Code+Pro:wght@200;300;400;500;600;700;800;900&family=Inconsolata:wght@200;300;400;500;600;700;800;900&family=Cousine:wght@400;700&family=Space+Mono:wght@400;700&family=Rubik:wght@300;400;500;600;700;800;900&family=Karla:wght@200;300;400;500;600;700;800&family=Archivo:wght@100;200;300;400;500;600;700;800;900&family=Titillium+Web:wght@200;300;400;600;700;900&family=Muli:wght@200;300;400;500;600;700;800;900&family=Cabin:wght@400;500;600;700&family=Hind:wght@300;400;500;600;700&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@100;200;300;400;500;600;700;800;900&family=Kanit:wght@100;200;300;400;500;600;700;800;900&family=Prompt:wght@100;200;300;400;500;600;700;800;900&family=Sarabun:wght@100;200;300;400;500;600;700;800&family=Chakra+Petch:wght@300;400;500;600;700&family=Mitr:wght@200;300;400;500;600&family=Bai+Jamjuree:wght@200;300;400;500;600;700&family=Athiti:wght@200;300;400;500;600;700&family=Srisakdi:wght@400;700&family=Itim&family=Charm:wght@400;700&family=Pattaya&family=Sriracha&family=Mali:wght@200;300;400;500;600;700&family=Charmonman:wght@400;700&family=Kodchasan:wght@200;300;400;500;600;700&family=Niramit:wght@200;300;400;500;600;700&display=swap',
		[],
		null
	);
	
	// Enqueue Icons Icon Font for Editor
	wp_enqueue_style( 'evt-icons' );
} );

/**
 * AUTO-GENERATED blocks will be added here
 */

include_once __DIR__ . '/blocks/event.php';
