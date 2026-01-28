<?php
defined( 'ABSPATH' ) || exit;

function evtb_register_blocks() {
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
    if ( function_exists( 'register_block_type' ) ) {
        if ( is_dir( $blocks_path . 'events-grid' ) && file_exists( $blocks_path . 'events-grid/block.json' ) ) {
            register_block_type( $blocks_path . 'events-grid' );
        }
        if ( is_dir( $blocks_path . 'event-item' ) && file_exists( $blocks_path . 'event-item/block.json' ) ) {
            register_block_type( $blocks_path . 'event-item' );
        }
        if ( is_dir( $blocks_path . 'event-date-badge' ) && file_exists( $blocks_path . 'event-date-badge/block.json' ) ) {
            register_block_type( $blocks_path . 'event-date-badge' );
        }
    }
}
add_action( 'init', 'evtb_register_blocks' );