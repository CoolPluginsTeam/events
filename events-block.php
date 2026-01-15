<?php
/**
 * Plugin Name: Events Block
 * Description: Events Gutenberg Block to Create Events Grid In Block Editor.
 * Author:      Cool Plugins
 * Author URI:  https://coolplugins.net/?utm_source=evtb_plugin&utm_medium=inside&utm_campaign=author_page&utm_content=plugins_list
 * Version:    1.0
 * License:     GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: events-block
 */

 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
define( 'EVENTS_BLOCK_VERSION', '1.0' );
define( 'EVENTS_BLOCK_FILE', __FILE__ );
define( 'EVENTS_BLOCK_PATH', plugin_dir_path( EVENTS_BLOCK_FILE ) );
define( 'EVENTS_BLOCK_URL', plugin_dir_url( EVENTS_BLOCK_FILE ) );


final class EVTB_Events_Block {

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
		$this->evtb_include_files();
		$this->evtb_enqueue_assets();
		register_activation_hook( EVENTS_BLOCK_FILE, array( $this, 'evtb_plugin_activate' ) );
		register_deactivation_hook( EVENTS_BLOCK_FILE, array( $this, 'evtb_plugin_deactivate' ) );
	}
	
	/**
	 * Enqueue shared assets (WordPress Standard)
	 * Single build file registers all blocks
	 */
	public function evtb_enqueue_assets() {
		// Register combined block script (all blocks in one file)
		add_action( 'init', function() {
			$asset_file = EVENTS_BLOCK_PATH . 'build/index.asset.php';
			$asset = file_exists( $asset_file ) ? require $asset_file : array(
				'dependencies' => array(),
				'version' => EVENTS_BLOCK_VERSION
			);
			
			// Single script file for all blocks
			wp_register_script(
				'evtb-events-blocks',
				EVENTS_BLOCK_URL . 'build/index.js',
				$asset['dependencies'],
				$asset['version'],
				true
			);
			
			// Pass plugin data to all blocks
			wp_localize_script( 'evtb-events-blocks', 'evtbPluginData', array(
				'pluginUrl' => EVENTS_BLOCK_URL,
				'images' => array(
					'crazyDJ' => EVENTS_BLOCK_URL . 'assets/images/crazy-DJ-experience-santa-cruz.webp',
					'rockBand' => EVENTS_BLOCK_URL . 'assets/images/cute-girls-rock-band-performance.webp',
					'foodDistribution' => EVENTS_BLOCK_URL . 'assets/images/free-food-distribution-at-mumbai.webp',
				)
			) );
			
			// Shared styles
			wp_register_style(
				'evtb-events-editor',
				EVENTS_BLOCK_URL . 'editor.css',
				array(),
				EVENTS_BLOCK_VERSION
			);
			
			wp_register_style(
				'evtb-events-style',
				EVENTS_BLOCK_URL . 'style.css',
				array(),
				EVENTS_BLOCK_VERSION
			);
		} );
		
		// Enqueue icon font for editor
		add_action( 'enqueue_block_editor_assets', function() {
			wp_enqueue_style( 
				'evtb-icons',
				EVENTS_BLOCK_URL . 'assets/css/evtb-icons.css',
				array(),
				EVENTS_BLOCK_VERSION
			);
		} );
		
		// Enqueue icon font for frontend
		add_action( 'wp_enqueue_scripts', function() {
			wp_enqueue_style( 
				'evtb-icons',
				EVENTS_BLOCK_URL . 'assets/css/evtb-icons.css',
				array(),
				EVENTS_BLOCK_VERSION
			);
		} );
	}
	
	/**
	 * Plugin Activation Hook
	 * Saves plugin version and install dates
	 */
	public function evtb_plugin_activate() {
		update_option( 'events-v', EVENTS_BLOCK_VERSION );
		update_option( 'events_activation_time', gmdate( 'Y-m-d h:i:s' ) );

		if (!get_option( 'events_initial_save_version' ) ) {
			add_option( 'events_initial_save_version', EVENTS_BLOCK_VERSION );
		}
		if(!get_option( 'events-install-date' ) ) {
			add_option( 'events-install-date', gmdate('Y-m-d h:i:s') );
		}
	}

	/**
	 * Plugin Deactivation Hookcd 
	 */
	public function evtb_plugin_deactivate() {
		// Deactivation functionality here (if needed)
	}
	/**
	 * Register all blocks using block.json (WordPress Standard)
	 */
	public function evtb_include_files() {
		// Register blocks using block.json metadata
		add_action( 'init', array( $this, 'evtb_register_blocks' ) );
	}
	
	/**
	 * Register blocks from their block.json files
	 * This follows WordPress Block Standards
	 */
	public function evtb_register_blocks() {
		// Register Events Grid block
		$evtb_blocks_dir = EVENTS_BLOCK_PATH . 'blocks/';
		if ( is_dir( $evtb_blocks_dir ) ) {
			foreach ( glob( $evtb_blocks_dir . '*/block.json' ) as $block_json ) {
				register_block_type( dirname( $block_json ) );
			}
		}
	}

}

// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function is prefixed with 'EVTB_'
function EVTB_Events_Block() {
	return EVTB_Events_Block::get_instance();
}
EVTB_Events_Block();