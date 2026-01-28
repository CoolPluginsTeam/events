<?php
/**
 * Plugin Name: Events Block
 * Description: Events Gutenberg Block to Create Events Grid In Block Editor.
 * Author: Cool Plugins
 * Author URI: https://coolplugins.net/
 * Version: 1.0.5
 * License: GPLv2 or later
 * Text Domain: events-block
 */
defined( 'ABSPATH' ) || exit;
define( 'EVENTS_BLOCK_VERSION', '1.0.5' );
define( 'EVENTS_BLOCK_FILE', __FILE__ );
define( 'EVENTS_BLOCK_PATH', plugin_dir_path( __FILE__ ) );
define( 'EVENTS_BLOCK_URL', plugin_dir_url( __FILE__ ) );

final class EVTB_Events_Block {
	private static $instance = null;
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) self::$instance = new self();
		return self::$instance;
	}
	private function __construct() {

		register_activation_hook( EVENTS_BLOCK_FILE, array( $this, 'evtb_plugin_activate' ) );
		add_action( 'init', array( $this, 'init' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ), 5 );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_assets' ) );
	}
	/**
	 * Plugin Activation Hook
	 * Saves plugin version and install dates
	 */
	public function evtb_plugin_activate() {
		
		update_option( 'evtb_version', EVENTS_BLOCK_VERSION );
		update_option( 'evtb_activation_time', gmdate( 'Y-m-d h:i:s' ) );

		if (!get_option( 'evtb_initial_save_version' ) ) {
			add_option( 'evtb_initial_save_version', EVENTS_BLOCK_VERSION );
		}
		if(!get_option( 'evtb_install_date' ) ) {
			add_option( 'evtb_install_date', gmdate('Y-m-d h:i:s') );
		}
	}
	public function init() {
		// Register assets first (required for block.json)
		$asset = file_exists( EVENTS_BLOCK_PATH . 'build/index.asset.php' ) ? require EVENTS_BLOCK_PATH . 'build/index.asset.php' : array( 'dependencies' => array(), 'version' => EVENTS_BLOCK_VERSION );
		
		// Block Directory installations may have timing issues, so we register first
		wp_register_script( 
			'evtb-events-blocks', 
			EVENTS_BLOCK_URL . 'build/index.js', 
			$asset['dependencies'], 
			EVENTS_BLOCK_VERSION, 
			true // Load in footer (after dependencies), but we'll enqueue early
		);
		wp_localize_script( 'evtb-events-blocks', 'evtbPluginData', array( 
			'pluginUrl' => EVENTS_BLOCK_URL, 
			'images' => array( 
				'crazyDJ' => EVENTS_BLOCK_URL . 'assets/images/crazy-DJ-experience-santa-cruz.webp', 
				'rockBand' => EVENTS_BLOCK_URL . 'assets/images/cute-girls-rock-band-performance.webp', 
				'foodDistribution' => EVENTS_BLOCK_URL . 'assets/images/free-food-distribution-at-mumbai.webp' 
			) 
		) );
		
		// Register styles
		if ( file_exists( EVENTS_BLOCK_PATH . 'editor.css' ) ) {
			wp_register_style( 'evtb-events-editor', EVENTS_BLOCK_URL . 'editor.css', array(), EVENTS_BLOCK_VERSION );
		}
		if ( file_exists( EVENTS_BLOCK_PATH . 'style.css' ) ) {
			wp_register_style( 'evtb-events-style', EVENTS_BLOCK_URL . 'style.css', array(), EVENTS_BLOCK_VERSION );
		}
		
		// Register icon font (for block.json to use)
		if ( file_exists( EVENTS_BLOCK_PATH . 'assets/css/evtb-icons.css' ) ) {
			wp_register_style( 'evtb-icons', EVENTS_BLOCK_URL . 'assets/css/evtb-icons.css', array(), EVENTS_BLOCK_VERSION );
		}
		
		$blocks_path = EVENTS_BLOCK_PATH . 'blocks/';
		
		// IMPORTANT: Register parent block FIRST, then child blocks
		// This ensures Block Directory recognizes the block hierarchy correctly
		if ( is_dir( $blocks_path . 'events-grid' ) && file_exists( $blocks_path . 'events-grid/block.json' ) ) {
			register_block_type( $blocks_path . 'events-grid' );
		}
		
		// Register child blocks after parent
		if ( is_dir( $blocks_path . 'event-item' ) && file_exists( $blocks_path . 'event-item/block.json' ) ) {
			register_block_type( $blocks_path . 'event-item' );
		}
		
		if ( is_dir( $blocks_path . 'event-date-badge' ) && file_exists( $blocks_path . 'event-date-badge/block.json' ) ) {
			register_block_type( $blocks_path . 'event-date-badge' );
		}
	}
	public function editor_assets() {
		// CRITICAL: Enqueue script with HIGH priority to ensure it loads BEFORE editor initializes
		// This fixes the Block Directory installation timing issue
		wp_enqueue_script( 'evtb-events-blocks' );
		
		// Add inline script to verify blocks are registered (for debugging)
		// This helps identify if blocks registered successfully
		wp_add_inline_script( 'evtb-events-blocks', '
			// Verify blocks are registered after script loads
			if ( typeof wp !== "undefined" && wp.blocks ) {
				wp.domReady( function() {
					const registeredBlocks = [ "evtb/events-grid", "evtb/event-item", "evtb/event-date-badge" ];
					registeredBlocks.forEach( function( blockName ) {
						if ( ! wp.blocks.getBlockType( blockName ) ) {
							console.warn( "EVTB: Block " + blockName + " not registered yet" );
						}
					} );
				} );
			}
		', 'after' );
		
		// Icon font will be loaded via block.json, but enqueue here as fallback for editor
		if ( file_exists( EVENTS_BLOCK_PATH . 'assets/css/evtb-icons.css' ) ) {
			wp_enqueue_style( 'evtb-icons', EVENTS_BLOCK_URL . 'assets/css/evtb-icons.css', array(), EVENTS_BLOCK_VERSION );
		}
	}
	public function frontend_assets() {
		// Icon font will be loaded via block.json, but enqueue here as fallback for frontend
		if ( file_exists( EVENTS_BLOCK_PATH . 'assets/css/evtb-icons.css' ) ) {
			wp_enqueue_style( 'evtb-icons', EVENTS_BLOCK_URL . 'assets/css/evtb-icons.css', array(), EVENTS_BLOCK_VERSION );
		}
		if ( file_exists( EVENTS_BLOCK_PATH . 'assets/js/frontend.js' ) ) {
			wp_enqueue_script( 'evtb-frontend', EVENTS_BLOCK_URL . 'assets/js/frontend.js', array(), EVENTS_BLOCK_VERSION, true );
		}
	}
}
EVTB_Events_Block::get_instance();

