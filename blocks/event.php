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
			'evt/eventDate' => 'eventDate',
			'evt/eventStartTime' => 'eventStartTime',
			'evt/eventEndTime' => 'eventEndTime'
		],
		'attributes' => [
			'evtBlockId' => [
				'type' => 'string',
				'default' => ''
			],
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
			'eventStartTime' => [
				'type' => 'string',
				'default' => '09:00'
			],
			'eventEndTime' => [
				'type' => 'string',
				'default' => '17:00'
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
			'evtBadgeId' => [
				'type' => 'string',
				'default' => ''
			],
			'eventDate' => [
				'type' => 'string',
				'default' => date('Y-m-d')
			],
			'eventStartTime' => [
				'type' => 'string',
				'default' => '09:00'
			],
			'eventEndTime' => [
				'type' => 'string',
				'default' => '17:00'
			],
			'isDateSet' => [
				'type' => 'boolean',
				'default' => false
			],
			'isTimeSet' => [
				'type' => 'boolean',
				'default' => false
			],
			'hideYear' => [
				'type' => 'boolean',
				'default' => false
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
			'weekdayColor' => [
				'type' => 'string',
				'default' => '#000000'
			]
		],
	] );
} );

// Recursive function to extract date badge attributes from innerBlocks
function evt_extract_date_badge_attrs( $inner_blocks ) {
	$attrs = [];
	
	if ( ! is_array( $inner_blocks ) ) {
		return $attrs;
	}
	
	foreach ( $inner_blocks as $inner_block ) {
		if ( isset( $inner_block['blockName'] ) && $inner_block['blockName'] === 'evt/event-date-badge' ) {
			if ( ! empty( $inner_block['attrs'] ) ) {
				$attrs = $inner_block['attrs'];
				break;
			}
		}
		
		// Recursive check
		if ( ! empty( $inner_block['innerBlocks'] ) ) {
			$nested_attrs = evt_extract_date_badge_attrs( $inner_block['innerBlocks'] );
			if ( ! empty( $nested_attrs ) ) {
				$attrs = $nested_attrs;
				break;
			}
		}
	}
	
	return $attrs;
}

// Filter to inject CSS for each event block
add_filter( 'render_block', 'evt_inject_block_css', 9, 2 );

function evt_inject_block_css( $block_content, $block ) {
	// Check if this is our event item block
	if ( $block['blockName'] !== 'evt/event-item' ) {
		return $block_content;
	}
	
	// Check if we have attributes
	if ( empty( $block['attrs'] ) ) {
		return $block_content;
	}
	
	// Get block ID from attributes
	$block_id = isset( $block['attrs']['evtBlockId'] ) ? $block['attrs']['evtBlockId'] : '';
	
	// If no block ID, try to extract from content
	if ( empty( $block_id ) && preg_match( '/evt-block-([a-f0-9\-]+)/', $block_content, $matches ) ) {
		$block_id = $matches[1];
	}
	
	if ( ! empty( $block_id ) ) {
		// Only inject background color for event details
		$details_bg = isset( $block['attrs']['detailsBackgroundColor'] ) ? $block['attrs']['detailsBackgroundColor'] : '#ffffff';
		
		$evt_css = "
			.evt-block-{$block_id} .evt-event-details {
				background-color: {$details_bg};
			}
		";
		
		// Inject CSS before block content
		$block_content = '<style>' . trim( $evt_css ) . '</style>' . "\n" . $block_content;
	}
	
	return $block_content;
}

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
	
	// Remove evt-event-image-wrap group completely - manually find and remove with div counting
	if ( strpos( $content_without_image, 'evt-event-image-wrap' ) !== false ) {
		$wrap_start = strpos( $content_without_image, 'evt-event-image-wrap' );
		if ( $wrap_start !== false ) {
			// Find the opening div tag
			$div_start = strrpos( substr( $content_without_image, 0, $wrap_start ), '<div' );
			if ( $div_start !== false ) {
				// Find the closing div tag (account for nested divs)
				$div_count = 1;
				$search_pos = strpos( $content_without_image, '>', $div_start ) + 1;
				$div_end = $search_pos;
				
				while ( $div_count > 0 && $div_end < strlen( $content_without_image ) ) {
					$next_open = strpos( $content_without_image, '<div', $div_end );
					$next_close = strpos( $content_without_image, '</div>', $div_end );
					
					if ( $next_close === false ) break;
					
					if ( $next_open !== false && $next_open < $next_close ) {
						$div_count++;
						$div_end = $next_open + 4;
					} else {
						$div_count--;
						$div_end = $next_close + 6;
					}
				}
				
				// Remove the entire evt-event-image-wrap block
				$content_without_image = substr_replace( $content_without_image, '', $div_start, $div_end - $div_start );
			}
		}
	}
	
	// Remove Read More buttons with href="" - Simple string replacement approach
	// This works by finding wp-block-buttons wrapper and checking if it contains href=""
	if ( strpos( $content_without_image, 'href=""' ) !== false || strpos( $content_without_image, "href=''" ) !== false ) {
		// Find all wp-block-buttons divs
		$offset = 0;
		while ( ( $start_pos = strpos( $content_without_image, 'class="wp-block-buttons', $offset ) ) !== false ) {
			// Find the opening div tag
			$div_start = strrpos( substr( $content_without_image, 0, $start_pos ), '<div' );
			if ( $div_start === false ) {
				$offset = $start_pos + 1;
				continue;
			}
			
			// Find the closing div tag (account for nested divs)
			$div_count = 1;
			$search_pos = strpos( $content_without_image, '>', $div_start ) + 1;
			$div_end = $search_pos;
			
			while ( $div_count > 0 && $div_end < strlen( $content_without_image ) ) {
				$next_open = strpos( $content_without_image, '<div', $div_end );
				$next_close = strpos( $content_without_image, '</div>', $div_end );
				
				if ( $next_close === false ) break;
				
				if ( $next_open !== false && $next_open < $next_close ) {
					$div_count++;
					$div_end = $next_open + 4;
				} else {
					$div_count--;
					$div_end = $next_close + 6;
				}
			}
			
			// Extract the buttons block
			$buttons_block = substr( $content_without_image, $div_start, $div_end - $div_start );
			
			// Check if this block contains href=""
			if ( strpos( $buttons_block, 'href=""' ) !== false || strpos( $buttons_block, "href=''" ) !== false ) {
				// Remove this buttons block
				$content_without_image = substr_replace( $content_without_image, '', $div_start, $div_end - $div_start );
				$offset = $div_start;
			} else {
				$offset = $div_end;
			}
		}
	}
	
	// Remove empty content elements (only show if user has added content)
	// Remove empty evt-event-title
	$content_without_image = preg_replace( '/<h[1-6][^>]*class="[^"]*evt-event-title[^"]*"[^>]*>\s*<\/h[1-6]>/s', '', $content_without_image );

	// Remove empty evt-event-time
	$content_without_image = preg_replace( '/<p[^>]*class="[^"]*evt-event-time[^"]*"[^>]*>\s*<\/p>/s', '', $content_without_image );
	
	// Remove empty evt-event-location
	$content_without_image = preg_replace( '/<p[^>]*class="[^"]*evt-event-location[^"]*"[^>]*>\s*<\/p>/s', '', $content_without_image );
	
	// Remove empty evt-event-description
	$content_without_image = preg_replace( '/<p[^>]*class="[^"]*evt-event-description[^"]*"[^>]*>\s*<\/p>/s', '', $content_without_image );
	
	// Remove empty evt-event-price
	$content_without_image = preg_replace( '/<p[^>]*class="[^"]*evt-event-price[^"]*"[^>]*>\s*<\/p>/s', '', $content_without_image );
	
	// Remove empty evt-price-read-more wrapper (if both price and button are gone)
	$content_without_image = preg_replace( '/<div[^>]*class="[^"]*evt-price-read-more[^"]*"[^>]*>\s*<\/div>/s', '', $content_without_image );
	
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

// Filter to inject CSS for date badge block
add_filter( 'render_block', 'evt_inject_date_badge_css', 9, 2 );

function evt_inject_date_badge_css( $block_content, $block ) {
	// Check if this is our date badge block
	if ( $block['blockName'] !== 'evt/event-date-badge' ) {
		return $block_content;
	}
	
	// Check if we have attributes
	if ( empty( $block['attrs'] ) ) {
		return $block_content;
	}
	
	// Get badge ID from attributes
	$badge_id = isset( $block['attrs']['evtBadgeId'] ) ? $block['attrs']['evtBadgeId'] : '';
	
	// If no badge ID, try to extract from content
	if ( empty( $badge_id ) && preg_match( '/evt-badge-([a-f0-9\-]+)/', $block_content, $matches ) ) {
		$badge_id = $matches[1];
	}
	
	if ( ! empty( $badge_id ) ) {
		// Get colors
		$date_badge_bg = isset( $block['attrs']['dateBadgeBackgroundColor'] ) ? $block['attrs']['dateBadgeBackgroundColor'] : '#2667FF';
		$date_badge_text = isset( $block['attrs']['dateBadgeTextColor'] ) ? $block['attrs']['dateBadgeTextColor'] : '#ffffff';
		$border_color = isset( $block['attrs']['borderBadgeColor'] ) ? $block['attrs']['borderBadgeColor'] : '#00000040';
		$weekday_color = isset( $block['attrs']['weekdayColor'] ) ? $block['attrs']['weekdayColor'] : '#000000';
		
		$badge_css = "
			.evt-badge-{$badge_id} .evt-border-badge {
				border: 1px solid {$border_color};
			}
			.evt-badge-{$badge_id} .evt-event-date-badge {
				background-color: {$date_badge_bg};
				color: {$date_badge_text};
			}
			.evt-badge-{$badge_id} .evt-date-day,
			.evt-badge-{$badge_id} .evt-date-month {
				color: {$date_badge_text};
			}
			.evt-badge-{$badge_id} .evt-date-weekday {
				color: {$weekday_color};
			}
		";
		
		// Inject CSS before block content
		$block_content = '<style>' . trim( $badge_css ) . '</style>' . "\n" . $block_content;
	}
	
	return $block_content;
}
