<?php
/**
 * Event Date Badge Block - Server-side Render
 * WordPress Standard: Clean PHP rendering
 *
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
// All variables below are local to this render callback, not global variables
// Get attributes
$evtb_badge_id = isset( esc_attr( $attributes['evtbBadgeId'] ) ) ? esc_attr( $attributes['evtbBadgeId'] ) : '';
$evtb_event_date = isset( esc_attr( $attributes['eventDate'] ) ) ? esc_attr( $attributes['eventDate'] ) : '';

// If date not set by user, use current date as default (same as editor)
if ( empty( $evtb_event_date ) ) {
	$evtb_event_date = wp_date( 'Y-m-d' );
}

// Get colors
$evtb_badge_bg = isset( esc_attr( $attributes['dateBadgeBackgroundColor'] ) ) ? esc_attr( $attributes['dateBadgeBackgroundColor'] ) : '#2667FF';
$evtb_badge_text = isset( esc_attr( $attributes['dateBadgeTextColor'] ) ) ? esc_attr( $attributes['dateBadgeTextColor'] ) : '#ffffff';
$evtb_border_color = isset( esc_attr( $attributes['borderBadgeColor'] ) ) ? esc_attr( $attributes['borderBadgeColor'] ) : '#00000040';
$evtb_weekday_color = isset( esc_attr( $attributes['weekdayColor'] ) ) ? esc_attr( $attributes['weekdayColor'] ) : '#000000';

// Parse date - Always use the date (current or user-set)
$timestamp = strtotime( $evtb_event_date );
if ( $timestamp ) {
	$evtb_date_parts = array(
		'day' => wp_date( 'd', $timestamp ),
		'month' => wp_date( 'M', $timestamp ),
		'year' => wp_date( 'Y', $timestamp ),
		'weekday' => strtoupper( wp_date( 'D', $timestamp ) )
	);
} else {
	// Fallback if date parsing fails
	$current_time = current_time( 'timestamp' );
	$evtb_date_parts = array(
		'day' => wp_date( 'd', $current_time ),
		'month' => wp_date( 'M', $current_time ),
		'year' => wp_date( 'Y', $current_time ),
		'weekday' => strtoupper( wp_date( 'D', $current_time ) )
	);
}

// Generate wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'evtb-event-date-badge-container' . ( $evtb_badge_id ? ' evtb-badge-' . $evtb_badge_id : '' ),
) );

// Inject badge-specific CSS (WordPress Standard: Inline styles)
$evtb_badge_css = '';
if ( $evtb_badge_id ) {
	$evtb_badge_css = sprintf(
		'<style>
			.evtb-badge-%1$s .evtb-border-badge { border: 1px solid %2$s; }
			.evtb-badge-%1$s .evtb-event-date-badge { background-color: %3$s; color: %4$s; }
			.evtb-badge-%1$s .evtb-date-day, .evtb-badge-%1$s .evtb-date-month { color: %4$s; }
			.evtb-badge-%1$s .evtb-date-weekday { color: %5$s; }
		</style>',
		$evtb_badge_id,
		$evtb_border_color,
		$evtb_badge_bg,
		$evtb_badge_text,
		$evtb_weekday_color
	);
}

?>
<?php 
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already escaped via sprintf with esc_attr()
echo $evtb_badge_css; 
?>
<div <?php 
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe output from get_block_wrapper_attributes()
echo $wrapper_attributes; 
?>>
	<div class="evtb-border-badge">
		<div class="evtb-event-date-badge">
			<span class="evtb-date-day"><?php echo esc_html( $evtb_date_parts['day'] ); ?></span>
			<span class="evtb-date-month"><?php echo esc_html( $evtb_date_parts['month'] ); ?></span>
			<?php if ( ! $evtb_hide_year && $evtb_date_parts['year'] !== '0001' ) : ?>
				<span class="evtb-date-year"><?php echo esc_html( $evtb_date_parts['year'] ); ?></span>
			<?php endif; ?>
		</div>
	</div>
	<span class="evtb-date-weekday"><?php echo esc_html( $evtb_date_parts['weekday'] ); ?></span>
</div>
<?php
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
