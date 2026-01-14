<?php
/**
 * Event Item Block - Server-side Render
 * WordPress Standard: Simple string functions (Easy & No complex parsing)
 *
 * @param array    $attributes Block attributes
 * @param string   $content    Block default content from InnerBlocks
 * @param WP_Block $block      Block instance
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
// All variables below are local to this render callback, not global variables

// ============================
// HELPER FUNCTIONS (Defined First)
// ============================

/**
 * Remove wrapper divs by class name
 */
if ( ! function_exists( 'evt_remove_wrapper_divs' ) ) {
	function evt_remove_wrapper_divs( $html, $class_name ) {
		if ( strpos( $html, $class_name ) === false ) {
			return $html;
		}
		
		$pos = strpos( $html, $class_name );
		$div_start = strrpos( substr( $html, 0, $pos ), '<div' );
		
		if ( $div_start !== false ) {
			$div_end = evt_find_closing_tag( $html, $div_start, 'div' );
			if ( $div_end !== false ) {
				$html = substr_replace( $html, '', $div_start, $div_end - $div_start );
			}
		}
		
		return $html;
	}
}

/**
 * Remove empty buttons blocks
 */
if ( ! function_exists( 'evt_remove_empty_buttons' ) ) {
	function evt_remove_empty_buttons( $html ) {
		if ( strpos( $html, 'href=""' ) === false && strpos( $html, 'href="#"' ) === false ) {
			return $html;
		}
		
		$offset = 0;
		while ( ( $btn_pos = strpos( $html, 'wp-block-buttons', $offset ) ) !== false ) {
			$div_start = strrpos( substr( $html, 0, $btn_pos ), '<div' );
			
			if ( $div_start === false ) {
				$offset = $btn_pos + 1;
				continue;
			}
			
			$div_end = evt_find_closing_tag( $html, $div_start, 'div' );
			if ( $div_end === false ) {
				$offset = $btn_pos + 1;
				continue;
			}
			
			$button_block = substr( $html, $div_start, $div_end - $div_start );
			
			// Check if has empty href
			if ( strpos( $button_block, 'href=""' ) !== false || strpos( $button_block, 'href="#"' ) !== false ) {
				$html = substr_replace( $html, '', $div_start, $div_end - $div_start );
				$offset = $div_start;
			} else {
				$offset = $div_end;
			}
		}
		
		return $html;
	}
}

/**
 * Remove empty elements by class name
 */
if ( ! function_exists( 'evt_remove_empty_elements' ) ) {
	function evt_remove_empty_elements( $html, $class_name ) {
		$offset = 0;
		
		while ( ( $pos = strpos( $html, $class_name, $offset ) ) !== false ) {
			// Find tag start
			$tag_start = strrpos( substr( $html, 0, $pos ), '<' );
			if ( $tag_start === false ) {
				$offset = $pos + 1;
				continue;
			}
			
			// Get tag name
			$tag_end = strpos( $html, ' ', $tag_start );
			if ( $tag_end === false ) {
				$tag_end = strpos( $html, '>', $tag_start );
			}
			$tag_name = substr( $html, $tag_start + 1, $tag_end - $tag_start - 1 );
			
			// Find closing tag
			$close_tag = '</' . $tag_name . '>';
			$close_pos = strpos( $html, $close_tag, $pos );
			
			if ( $close_pos !== false ) {
				$element = substr( $html, $tag_start, $close_pos + strlen( $close_tag ) - $tag_start );
				
				// Check if empty (only whitespace/tags)
				$content_check = strip_tags( $element );
				if ( trim( $content_check ) === '' ) {
					$html = substr_replace( $html, '', $tag_start, $close_pos + strlen( $close_tag ) - $tag_start );
					$offset = $tag_start;
					continue;
				}
			}
			
			$offset = $pos + 1;
		}
		
		return $html;
	}
}

/**
 * Find closing tag position
 */
if ( ! function_exists( 'evt_find_closing_tag' ) ) {
	function evt_find_closing_tag( $html, $start_pos, $tag_name ) {
		$depth = 1;
		$pos = strpos( $html, '>', $start_pos ) + 1;
		$open_tag = '<' . $tag_name;
		$close_tag = '</' . $tag_name . '>';
		
		while ( $depth > 0 && $pos < strlen( $html ) ) {
			$next_open = strpos( $html, $open_tag, $pos );
			$next_close = strpos( $html, $close_tag, $pos );
			
			if ( $next_close === false ) {
				return false;
			}
			
			if ( $next_open !== false && $next_open < $next_close ) {
				$depth++;
				$pos = $next_open + strlen( $open_tag );
			} else {
				$depth--;
				$pos = $next_close + strlen( $close_tag );
			}
		}
		
		return $pos;
	}
}

// ============================
// MAIN PROCESSING LOGIC
// ============================

// Get block attributes
$evt_block_id = isset( $attributes['evtBlockId'] ) ? esc_attr( $attributes['evtBlockId'] ) : '';
$evt_details_bg = isset( $attributes['detailsBackgroundColor'] ) ? esc_attr( $attributes['detailsBackgroundColor'] ) : '#ffffff';

// Process content
$evt_processed_content = $content;
$evt_image_html = '';

// Only process if content exists
if ( ! empty( $evt_processed_content ) ) {
	
	// Step 1: Extract image (simple string search)
	$figure_start = strpos( $evt_processed_content, '<figure' );
	if ( $figure_start !== false && strpos( $evt_processed_content, 'wp-block-image', $figure_start ) !== false ) {
		$figure_end = strpos( $evt_processed_content, '</figure>', $figure_start );
		if ( $figure_end !== false ) {
			$evt_image_html = substr( $evt_processed_content, $figure_start, $figure_end - $figure_start + 9 );
			// Remove from content
			$evt_processed_content = substr_replace( $evt_processed_content, '', $figure_start, $figure_end - $figure_start + 9 );
		}
	}
	
	// Step 2: Remove image wrapper groups
	$evt_processed_content = evt_remove_wrapper_divs( $evt_processed_content, 'evt-event-image-wrap' );
	
	// Step 3: Remove buttons with empty href
	$evt_processed_content = evt_remove_empty_buttons( $evt_processed_content );
	
	// Step 4: Remove empty content elements
	$empty_classes = array(
		'evt-event-title',
		'evt-event-time',
		'evt-event-location',
		'evt-event-description',
		'evt-event-price',
		'evt-price-read-more'
	);
	
	foreach ( $empty_classes as $class ) {
		$evt_processed_content = evt_remove_empty_elements( $evt_processed_content, $class );
	}
}

// Generate wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'evt-event-item' . ( $evt_block_id ? ' evt-block-' . $evt_block_id : '' ),
) );

// Inject block-specific CSS
$evt_block_css = '';
if ( $evt_block_id ) {
	$evt_block_css = sprintf(
		'<style>.evt-block-%s .evt-event-details { background-color: %s; }</style>',
		$evt_block_id,
		$evt_details_bg
	);
}

// Build final HTML
?>
<?php 
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already escaped via sprintf with esc_attr()
echo $evt_block_css; 
?>
<div <?php 
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe output from get_block_wrapper_attributes()
echo $wrapper_attributes; 
?>>
	<div class="evt-event-card">
		<?php if ( $evt_image_html ) : ?>
			<div class="evt-event-image"><?php 
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe HTML from WordPress InnerBlocks
			echo $evt_image_html; 
			?></div>
		<?php endif; ?>
		<div class="evt-event-details">
			<?php 
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe HTML from WordPress InnerBlocks
			echo $evt_processed_content; 
			?>
		</div>
	</div>
</div>
<?php
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
