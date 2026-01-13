<?php
/**
 * Event Item Block - Server-side Render
 * WordPress Standard: Clean render callback (no filters)
 *
 * @param array    $attributes Block attributes
 * @param string   $content    Block default content from InnerBlocks
 * @param WP_Block $block      Block instance
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get block attributes
$block_id = isset( $attributes['evtBlockId'] ) ? esc_attr( $attributes['evtBlockId'] ) : '';
$details_bg = isset( $attributes['detailsBackgroundColor'] ) ? esc_attr( $attributes['detailsBackgroundColor'] ) : '#ffffff';

// Process content (same logic as before, but cleaner)
$processed_content = $content;

// Step 1: Extract image from InnerBlocks
preg_match( '/<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>.*?<\/figure>/s', $processed_content, $image_match );
$image_html = ! empty( $image_match[0] ) ? $image_match[0] : '';

// Step 2: Remove image from original position
if ( $image_html ) {
	$processed_content = preg_replace( '/<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>.*?<\/figure>/s', '', $processed_content );
}

// Step 3: Remove evt-event-image-wrap group wrapper (no longer needed)
if ( strpos( $processed_content, 'evt-event-image-wrap' ) !== false ) {
	$wrap_start = strpos( $processed_content, 'evt-event-image-wrap' );
	if ( $wrap_start !== false ) {
		$div_start = strrpos( substr( $processed_content, 0, $wrap_start ), '<div' );
		if ( $div_start !== false ) {
			// Count nested divs to find correct closing tag
			$div_count = 1;
			$search_pos = strpos( $processed_content, '>', $div_start ) + 1;
			$div_end = $search_pos;
			
			while ( $div_count > 0 && $div_end < strlen( $processed_content ) ) {
				$next_open = strpos( $processed_content, '<div', $div_end );
				$next_close = strpos( $processed_content, '</div>', $div_end );
				
				if ( $next_close === false ) break;
				
				if ( $next_open !== false && $next_open < $next_close ) {
					$div_count++;
					$div_end = $next_open + 4;
				} else {
					$div_count--;
					$div_end = $next_close + 6;
				}
			}
			
			$processed_content = substr_replace( $processed_content, '', $div_start, $div_end - $div_start );
		}
	}
}

// Step 4: Remove Read More buttons with empty/# hrefs
if ( strpos( $processed_content, 'href=""' ) !== false || strpos( $processed_content, 'href="#"' ) !== false ) {
	$offset = 0;
	while ( ( $start_pos = strpos( $processed_content, 'class="wp-block-buttons', $offset ) ) !== false ) {
		$div_start = strrpos( substr( $processed_content, 0, $start_pos ), '<div' );
		if ( $div_start === false ) {
			$offset = $start_pos + 1;
			continue;
		}
		
		// Find closing div with nesting support
		$div_count = 1;
		$search_pos = strpos( $processed_content, '>', $div_start ) + 1;
		$div_end = $search_pos;
		
		while ( $div_count > 0 && $div_end < strlen( $processed_content ) ) {
			$next_open = strpos( $processed_content, '<div', $div_end );
			$next_close = strpos( $processed_content, '</div>', $div_end );
			
			if ( $next_close === false ) break;
			
			if ( $next_open !== false && $next_open < $next_close ) {
				$div_count++;
				$div_end = $next_open + 4;
			} else {
				$div_count--;
				$div_end = $next_close + 6;
			}
		}
		
		$buttons_block = substr( $processed_content, $div_start, $div_end - $div_start );
		
		// Check if empty href
		if ( strpos( $buttons_block, 'href=""' ) !== false || strpos( $buttons_block, 'href="#"' ) !== false ) {
			$processed_content = substr_replace( $processed_content, '', $div_start, $div_end - $div_start );
			$offset = $div_start;
		} else {
			$offset = $div_end;
		}
	}
}

// Step 5: Remove empty content elements
$processed_content = preg_replace( '/<h[1-6][^>]*class="[^"]*evt-event-title[^"]*"[^>]*>\s*<\/h[1-6]>/s', '', $processed_content );
$processed_content = preg_replace( '/<p[^>]*class="[^"]*evt-event-time[^"]*"[^>]*>\s*<\/p>/s', '', $processed_content );
$processed_content = preg_replace( '/<p[^>]*class="[^"]*evt-event-location[^"]*"[^>]*>\s*<\/p>/s', '', $processed_content );
$processed_content = preg_replace( '/<p[^>]*class="[^"]*evt-event-description[^"]*"[^>]*>\s*<\/p>/s', '', $processed_content );
$processed_content = preg_replace( '/<p[^>]*class="[^"]*evt-event-price[^"]*"[^>]*>\s*<\/p>/s', '', $processed_content );
$processed_content = preg_replace( '/<div[^>]*class="[^"]*evt-price-read-more[^"]*"[^>]*>\s*<\/div>/s', '', $processed_content );

// Generate wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'evt-event-item' . ( $block_id ? ' evt-block-' . $block_id : '' ),
) );

// Inject block-specific CSS
$block_css = '';
if ( $block_id ) {
	$block_css = sprintf(
		'<style>.evt-block-%s .evt-event-details { background-color: %s; }</style>',
		$block_id,
		$details_bg
	);
}

// Build final HTML
?>
<?php echo $block_css; ?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="evt-event-card">
		<?php if ( $image_html ) : ?>
			<div class="evt-event-image"><?php echo $image_html; ?></div>
		<?php endif; ?>
		<?php echo $processed_content; ?>
	</div>
</div>
