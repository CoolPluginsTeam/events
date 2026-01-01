<?php
/**
 * Register Events Grid Blocks
 * - evt/events-grid (Parent Container)
 * - evt/event-item (Child Event Card with InnerBlocks)
 */

add_action( 'init', function() {
	// Register parent block: Events Grid Container
	register_block_type( 'evt/events-grid', [
		'editor_script' => 'evt-event',
		'style' => 'evt-event',
		'editor_style' => 'evt-event-editor',
		'attributes' => [
			'columns' => [
				'type' => 'number',
				'default' => 3
			]
		],
	] );

	// Register child block: Event Item
	register_block_type( 'evt/event-item', [
		'editor_script' => 'evt-event',
		'style' => 'evt-event',
		'editor_style' => 'evt-event-editor',
		'parent' => [ 'evt/events-grid' ],
		'attributes' => [
			'eventImage' => [
				'type' => 'string',
				'default' => ''
			],
			'eventImageAlt' => [
				'type' => 'string',
				'default' => ''
			],
			'eventDate' => [
				'type' => 'string',
				'default' => date('Y-m-d')
			],
			'detailsBackgroundColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			],
			'dateBadgeBackgroundColor' => [
				'type' => 'string',
				'default' => '#2667FF'
			],
			'dateBadgeTextColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			],
			'borderBadgeColor' => [
				'type' => 'string',
				'default' => '#00000040'
			],
			'isDefault' => [
				'type' => 'boolean',
				'default' => false
			],
			'hasImage' => [
				'type' => 'boolean',
				'default' => false
			],
			'mediaBlock' => [
				'type' => 'boolean',
				'default' => false
			]
		],
	] );
} );

// Filter to restructure event item block output
add_filter( 'render_block', function( $block_content, $block ) {
	if ( $block['blockName'] !== 'evt/event-item' ) {
		return $block_content;
	}
	
	// Check if image already exists in the content (from save function)
	$has_existing_image = preg_match( '/<div[^>]*class="[^"]*evt-event-image[^"]*"[^>]*>/', $block_content );
	
	// Remove image block from InnerBlocks content (if exists)
	$content_without_image = preg_replace( '/<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>.*?<\/figure>/s', '', $block_content );
	
	// Extract price and read more, wrap them in evt-price-read-more
	$content_without_image = preg_replace_callback(
		'/(<div[^>]*class="[^"]*evt-event-price[^"]*"[^>]*>.*?<\/div>)\s*(<div[^>]*class="[^"]*wp-block-buttons[^"]*"[^>]*>.*?<\/div>)/s',
		function( $matches ) {
			return '<div class="evt-price-read-more">' . $matches[1] . $matches[2] . '</div>';
		},
		$content_without_image
	);
	
	// Only add image if it doesn't already exist and we have image URL from InnerBlocks
	if ( ! $has_existing_image ) {
		// Try to extract image from InnerBlocks
		preg_match( '/<img[^>]*src="([^"]*)"[^>]*>/', $block_content, $url_match );
		$image_url = ! empty( $url_match[1] ) ? $url_match[1] : '';
		
		if ( $image_url ) {
			preg_match( '/<img[^>]*alt="([^"]*)"[^>]*>/', $block_content, $alt_match );
			$image_alt = ! empty( $alt_match[1] ) ? $alt_match[1] : '';
			$image_div = '<div class="evt-event-image"><img src="' . esc_url( $image_url ) . '" alt="' . esc_attr( $image_alt ) . '" /></div>';
			$content_without_image = str_replace( '<div class="evt-event-details"', $image_div . '<div class="evt-event-details"', $content_without_image );
		}
	}
	
	return $content_without_image;
}, 10, 2 );
