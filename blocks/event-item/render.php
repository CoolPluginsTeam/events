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
if ( ! function_exists( 'evtb_remove_wrapper_divs' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function is prefixed with 'evtb_'
	function evtb_remove_wrapper_divs( $html, $class_name ) {
		if ( strpos( $html, $class_name ) === false ) {
			return $html;
		}
		
		$pos = strpos( $html, $class_name );
		$div_start = strrpos( substr( $html, 0, $pos ), '<div' );
		
		if ( $div_start !== false ) {
			$div_end = evtb_find_closing_tag( $html, $div_start, 'div' );
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
if ( ! function_exists( 'evtb_remove_empty_buttons' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function is prefixed with 'evtb_'
	function evtb_remove_empty_buttons( $html ) {
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
			
			$div_end = evtb_find_closing_tag( $html, $div_start, 'div' );
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
if ( ! function_exists( 'evtb_remove_empty_elements' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function is prefixed with 'evtb_'
	function evtb_remove_empty_elements( $html, $class_name ) {
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
				$content_check = wp_strip_all_tags( $element );
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
if ( ! function_exists( 'evtb_find_closing_tag' ) ) {
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound -- Function is prefixed with 'evtb_'
	function evtb_find_closing_tag( $html, $start_pos, $tag_name ) {
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
$evtb_block_id = isset( $attributes['evtbBlockId'] ) ? esc_attr( $attributes['evtbBlockId'] ) : '';
$evtb_details_bg = isset( $attributes['detailsBackgroundColor'] ) ? esc_attr( $attributes['detailsBackgroundColor'] ) : '#ffffff';

// Process content
$evtb_processed_content = $content;
$evtb_image_html = '';

// Only process if content exists
if ( ! empty( $evtb_processed_content ) ) {
	
	// Step 1: Extract image (simple string search)
	$figure_start = strpos( $evtb_processed_content, '<figure' );
	if ( $figure_start !== false && strpos( $evtb_processed_content, 'wp-block-image', $figure_start ) !== false ) {
		$figure_end = strpos( $evtb_processed_content, '</figure>', $figure_start );
		if ( $figure_end !== false ) {
			$evtb_image_html = substr( $evtb_processed_content, $figure_start, $figure_end - $figure_start + 9 );
			// Remove from content
			$evtb_processed_content = substr_replace( $evtb_processed_content, '', $figure_start, $figure_end - $figure_start + 9 );
		}
	}
	
	// Step 2: Remove image wrapper groups
	$evtb_processed_content = evtb_remove_wrapper_divs( $evtb_processed_content, 'evtb-event-image-wrap' );
	
	// Step 3: Remove buttons with empty href
	$evtb_processed_content = evtb_remove_empty_buttons( $evtb_processed_content );
	
	// Step 4: Remove empty content elements
	$empty_classes = array(
		'evtb-event-title',
		'evtb-event-time',
		'evtb-event-location',
		'evtb-event-description',
		'evtb-event-price',
		'evtb-price-read-more'
	);
	
	foreach ( $empty_classes as $class ) {
		$evtb_processed_content = evtb_remove_empty_elements( $evtb_processed_content, $class );
	}
}

// Generate wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'evtb-event-item' . ( $evtb_block_id ? ' evtb-block-' . $evtb_block_id : '' ),
) );

// Inject block-specific CSS
$evtb_block_css = '';
if ( $evtb_block_id ) {
	$evtb_block_css = sprintf(
		'<style>.evtb-block-%s .evtb-event-details { background-color: %s; }</style>',
		$evtb_block_id,
		$evtb_details_bg
	);
}

// Build final HTML
?>
<?php 
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already escaped via sprintf with esc_attr()
echo $evtb_block_css; 
?>
<div <?php 
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe output from get_block_wrapper_attributes()
echo $wrapper_attributes; 
?>>
	<div class="evtb-event-card">
		<?php if ( $evtb_image_html ) : ?>
			<div class="evtb-event-image"><?php 
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe HTML from WordPress InnerBlocks
			echo $evtb_image_html; 
			?></div>
		<?php endif; ?>
		<div class="evtb-event-details">
			<?php 
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe HTML from WordPress InnerBlocks
			echo $evtb_processed_content; 
			?>
		</div>
	</div>
</div>
<?php
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
