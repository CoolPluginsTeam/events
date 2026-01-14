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
		$this->evt_enqueue_assets();
		register_activation_hook( EVENTS_FILE, array( $this, 'evt_plugin_activate' ) );
		register_deactivation_hook( EVENTS_FILE, array( $this, 'evt_plugin_deactivate' ) );
	}
	
	/**
	 * Enqueue shared assets (WordPress Standard)
	 * Single build file registers all blocks
	 */
	public function evt_enqueue_assets() {
		// Register combined block script (all blocks in one file)
		add_action( 'init', function() {
			$asset_file = EVENTS_PATH . 'build/index.asset.php';
			$asset = file_exists( $asset_file ) ? require $asset_file : array(
				'dependencies' => array(),
				'version' => EVENTS_VERSION
			);
			
			// Single script file for all blocks
			wp_register_script(
				'evt-events-blocks',
				EVENTS_URL . 'build/index.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);
			
			// Pass plugin data to all blocks
			wp_localize_script( 'evt-events-blocks', 'evtPluginData', array(
				'pluginUrl' => EVENTS_URL,
				'images' => array(
					'crazyDJ' => EVENTS_URL . 'assets/images/crazy-DJ-experience-santa-cruz.webp',
					'rockBand' => EVENTS_URL . 'assets/images/cute-girls-rock-band-performance.webp',
					'foodDistribution' => EVENTS_URL . 'assets/images/free-food-distribution-at-mumbai.webp',
				)
			) );
			
			// Shared styles
			wp_register_style(
				'evt-events-editor',
				EVENTS_URL . 'editor.css',
				array(),
				EVENTS_VERSION
			);
			
			wp_register_style(
				'evt-events-style',
				EVENTS_URL . 'style.css',
				array(),
				EVENTS_VERSION
			);
		} );
		
		// Enqueue icon font for editor
		add_action( 'enqueue_block_editor_assets', function() {
			wp_enqueue_style( 
				'evt-icons',
				EVENTS_URL . 'assets/css/evt-icons.css',
				array(),
				EVENTS_VERSION
			);
		} );
		
		// Enqueue icon font for frontend
		add_action( 'wp_enqueue_scripts', function() {
			wp_enqueue_style( 
				'evt-icons',
				EVENTS_URL . 'assets/css/evt-icons.css',
				array(),
				EVENTS_VERSION
			);
		} );
	}
	
	/**
	 * Plugin Activation Hook
	 * Saves plugin version and install dates
	 */
	public function evt_plugin_activate() {
		update_option( 'events-v', EVENTS_VERSION );
		update_option( 'events_activation_time', gmdate( 'Y-m-d h:i:s' ) );

		if (!get_option( 'events_initial_save_version' ) ) {
			add_option( 'events_initial_save_version', EVENTS_VERSION );
		}
		if(!get_option( 'events-install-date' ) ) {
			add_option( 'events-install-date', gmdate('Y-m-d h:i:s') );
		}
	}

	/**
	 * Plugin Deactivation Hookcd 
	 */
	public function evt_plugin_deactivate() {
		// Deactivation functionality here (if needed)
	}
	/**
	 * Register all blocks using block.json (WordPress Standard)
	 */
	public function evt_include_files() {
		// Register blocks using block.json metadata
		add_action( 'init', array( $this, 'evt_register_blocks' ) );
	}
	
	/**
	 * Register blocks from their block.json files
	 * This follows WordPress Block Standards
	 */
	public function evt_register_blocks() {
		// Register Events Grid block
		$evt_blocks_dir = EVENTS_PATH . 'blocks/';
		if ( is_dir( $evt_blocks_dir ) ) {
			foreach ( glob( $evt_blocks_dir . '*/block.json' ) as $block_json ) {
				register_block_type( dirname( $block_json ) );
			}
		}
	}

}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function is prefixed with 'evt_'
function evt_Events_Block() {
	return evt_Events_Block::get_instance();
}
evt_Events_Block();