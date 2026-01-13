<?php
/**
 * Plugin Name: Events
 * Description: Events Gutenberg Block to Create Events Grid In Block Editor.
 * Author:      Cool Plugins
 * Author URI:  https://coolplugins.net/?utm_source=evt_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugins_list
 * Version:     1.0
 * License:     GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: events
 */

 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
define( 'EVENTS_VERSION', '1.0.0' );
define( 'EVENTS_FILE', __FILE__ );
define( 'EVENTS_PATH', plugin_dir_path( EVENTS_FILE ) );
define( 'EVENTS_URL', plugin_dir_url( EVENTS_FILE ) );


final class evt_Events_Block {

	/**
	 * Plugin instance.
	 *
	 * @access private
	 */
	private static $instance = null;

	/**
	 * Get plugin instance.
	 *
	 * @static
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * @access private
	 */
	private function __construct() {
		$this->evt_include_files();
		register_activation_hook( EVENTS_FILE, array( $this, 'evt_plugin_activate' ) );
		register_deactivation_hook( EVENTS_FILE, array( $this, 'evt_plugin_deactivate' ) );
		// Register Block Scripts
		add_action( 'init', function() {
			$asset_file   = EVENTS_PATH . '/build/index.asset.php';
			$asset        = file_exists( $asset_file ) ? require_once $asset_file : null;
			$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];

			// Block JS
			wp_register_script(
				'evt-event',
				EVENTS_URL . 'build/index.js',
				$dependencies,
				EVENTS_VERSION,
				true
			);

			// Pass plugin assets URLs to JavaScript
			wp_localize_script( 'evt-event', 'evtPluginData', [
				'pluginUrl' => EVENTS_URL,
				'images' => [
					'crazyDJ' => EVENTS_URL . 'assets/images/crazy-DJ-experience-santa-cruz.webp',
					'rockBand' => EVENTS_URL . 'assets/images/cute-girls-rock-band-performance.webp',
					'foodDistribution' => EVENTS_URL . 'assets/images/free-food-distribution-at-mumbai.webp',
				]
			] );

			// Block front end style
			wp_register_style(
				'evt-event',
				EVENTS_URL . 'style.css',
				[],
				filemtime( EVENTS_PATH . '/style.css' )
			);

			// Block editor style
			wp_register_style(
				'evt-event-editor',
				EVENTS_URL . 'editor.css',
				[],
				filemtime( EVENTS_PATH . '/editor.css' )
			);
			
			// Fontello Icon Font
			wp_register_style(
				'evt-icons',
				EVENTS_URL . 'assets/css/evt-icons.css',
				[],
				filemtime( EVENTS_PATH . 'assets/css/evt-icons.css' )
			);
			} );

			// Enqueue Google Fonts (100 fonts including)
			add_action( 'wp_enqueue_scripts', function() {
				// Enqueue Icons Icon Font
				wp_enqueue_style( 'evt-icons' );
			} );

			add_action( 'enqueue_block_editor_assets', function() {
				// Enqueue Icons Icon Font for Editor
				wp_enqueue_style( 'evt-icons' );
			} );
	}
	
	/**
	 * Plugin Activation Hook
	 * Saves plugin version and install dates
	 */
	public function evt_plugin_activate() {
		update_option( 'events-v', EBEC_VERSION );
		update_option( 'events_activation_time', date( 'Y-m-d h:i:s' ) );

		if (!get_option( 'events_initial_save_version' ) ) {
			add_option( 'events_initial_save_version', EVENTS_VERSION );
		}
		if(!get_option( 'events-install-date' ) ) {
			add_option( 'events-install-date', gmdate('Y-m-d h:i:s') );
		}
	}

	/**
	 * Plugin Deactivation Hook
	 */
	public function evt_plugin_deactivate() {
		// Deactivation functionality here (if needed)
	}
	/**
	 * AUTO-GENERATED blocks will be added here
	 */

	public function evt_include_files() {
		include_once EVENTS_PATH . '/blocks/event.php';
	}

}
function evt_Events_Block() {
	return evt_Events_Block::get_instance();
}
evt_Events_Block();