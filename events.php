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
	 * block.json handles individual block scripts automatically
	 */
	public function evt_enqueue_assets() {
		// Pass plugin data to JavaScript (shared across all blocks)
		add_action( 'enqueue_block_editor_assets', function() {
			wp_add_inline_script(
				'wp-blocks',
				'window.evtPluginData = ' . wp_json_encode( array(
					'pluginUrl' => EVENTS_URL,
					'images' => array(
						'crazyDJ' => EVENTS_URL . 'assets/images/crazy-DJ-experience-santa-cruz.webp',
						'rockBand' => EVENTS_URL . 'assets/images/cute-girls-rock-band-performance.webp',
						'foodDistribution' => EVENTS_URL . 'assets/images/free-food-distribution-at-mumbai.webp',
					)
				) ),
				'before'
			);
			
			// Enqueue icon font for editor
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
		register_block_type( EVENTS_PATH . 'blocks/events-grid' );
		
		// Register Event Item block with render callback
		register_block_type( EVENTS_PATH . 'blocks/event-item' );
		
		// Register Event Date Badge block with render callback  
		register_block_type( EVENTS_PATH . 'blocks/event-date-badge' );
	}

}
function evt_Events_Block() {
	return evt_Events_Block::get_instance();
}
evt_Events_Block();