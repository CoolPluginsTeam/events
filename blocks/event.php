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
				'default' => 2
			]
		],
	] );

	// Register child block: Event Item
	register_block_type( 'evt/event-item', [
		'editor_script' => 'evt-event',
		'style' => 'evt-event',
		'editor_style' => 'evt-event-editor',
		'parent' => [ 'evt/events-grid' ],
		'provides_context' => [
			'evt/eventDate' => 'eventDate'
		],
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

	// Register date badge block: Event Date Badge
	register_block_type( 'evt/event-date-badge', [
		'editor_script' => 'evt-event',
		'style' => 'evt-event',
		'editor_style' => 'evt-event-editor',
		'parent' => [ 'evt/event-item' ],
		'uses_context' => [ 'evt/eventDate' ],
		'attributes' => [
			'eventDate' => [
				'type' => 'string',
				'default' => date('Y-m-d')
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
			]
		],
	] );
} );

// Filter to restructure event item block output
add_filter( 'render_block', function( $block_content, $block ) {
	if ( $block['blockName'] !== 'evt/event-item' ) {
		return $block_content;
	}
	
	// Extract image from InnerBlocks and move outside evt-event-details
	preg_match( '/<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>.*?<\/figure>/s', $block_content, $image_match );
	$image_html = ! empty( $image_match[0] ) ? $image_match[0] : '';
	
	// Remove image block from its original position
	$content_without_image = preg_replace( '/<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>.*?<\/figure>/s', '', $block_content );
	
	// Extract price and read more, wrap them in evt-price-read-more
	$content_without_image = preg_replace_callback(
		'/(<p[^>]*class="[^"]*evt-event-price[^"]*"[^>]*>.*?<\/p>)\s*(<div[^>]*class="[^"]*wp-block-buttons[^"]*"[^>]*>.*?<\/div>)/s',
		function( $matches ) {
			return '<div class="evt-price-read-more">' . $matches[1] . $matches[2] . '</div>';
		},
		$content_without_image
	);
	
	// If we have an image, convert it to evt-event-image and insert before evt-event-details
	if ( $image_html ) {
		preg_match( '/<img[^>]*src="([^"]*)"[^>]*>/', $image_html, $url_match );
		$image_url = ! empty( $url_match[1] ) ? $url_match[1] : '';
		
		if ( $image_url ) {
			preg_match( '/<img[^>]*alt="([^"]*)"[^>]*>/', $image_html, $alt_match );
			$image_alt = ! empty( $alt_match[1] ) ? $alt_match[1] : '';
			$image_div = '<div class="evt-event-image"><img src="' . esc_url( $image_url ) . '" alt="' . esc_attr( $image_alt ) . '" /></div>';
			$content_without_image = str_replace( '<div class="evt-event-details"', $image_div . '<div class="evt-event-details"', $content_without_image );
		}
	}
	
	return $content_without_image;
}, 10, 2 );
