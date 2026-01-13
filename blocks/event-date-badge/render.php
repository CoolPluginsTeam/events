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

// Don't render if date not set by user
// if ( empty( $attributes['isDateSet'] ) ) {
// 	return '';
// }

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
// All variables below are local to this render callback, not global variables
// Get attributes
$evt_badge_id = isset( $attributes['evtBadgeId'] ) ? esc_attr( $attributes['evtBadgeId'] ) : '';
$evt_event_date = isset( $attributes['eventDate'] ) ? $attributes['eventDate'] : '';
$evt_hide_year = isset( $attributes['hideYear'] ) ? $attributes['hideYear'] : false;

// If date not set by user, use current date as default (same as editor)
if ( empty( $evt_event_date ) ) {
	$evt_event_date = wp_date( 'Y-m-d' );
}

// Get colors
$evt_badge_bg = isset( $attributes['dateBadgeBackgroundColor'] ) ? esc_attr( $attributes['dateBadgeBackgroundColor'] ) : '#2667FF';
$evt_badge_text = isset( $attributes['dateBadgeTextColor'] ) ? esc_attr( $attributes['dateBadgeTextColor'] ) : '#ffffff';
$evt_border_color = isset( $attributes['borderBadgeColor'] ) ? esc_attr( $attributes['borderBadgeColor'] ) : '#00000040';
$evt_weekday_color = isset( $attributes['weekdayColor'] ) ? esc_attr( $attributes['weekdayColor'] ) : '#000000';

// Parse date - Always use the date (current or user-set)
$timestamp = strtotime( $evt_event_date );
if ( $timestamp ) {
	$evt_date_parts = array(
		'day' => wp_date( 'd', $timestamp ),
		'month' => wp_date( 'M', $timestamp ),
		'year' => wp_date( 'Y', $timestamp ),
		'weekday' => strtoupper( wp_date( 'D', $timestamp ) )
	);
} else {
	// Fallback if date parsing fails
	$current_time = current_time( 'timestamp' );
	$evt_date_parts = array(
		'day' => wp_date( 'd', $current_time ),
		'month' => wp_date( 'M', $current_time ),
		'year' => wp_date( 'Y', $current_time ),
		'weekday' => strtoupper( wp_date( 'D', $current_time ) )
	);
}

// Generate wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'evt-event-date-badge-container' . ( $evt_badge_id ? ' evt-badge-' . $evt_badge_id : '' ),
) );

// Inject badge-specific CSS (WordPress Standard: Inline styles)
$evt_badge_css = '';
if ( $evt_badge_id ) {
	$evt_badge_css = sprintf(
		'<style>
			.evt-badge-%1$s .evt-border-badge { border: 1px solid %2$s; }
			.evt-badge-%1$s .evt-event-date-badge { background-color: %3$s; color: %4$s; }
			.evt-badge-%1$s .evt-date-day, .evt-badge-%1$s .evt-date-month { color: %4$s; }
			.evt-badge-%1$s .evt-date-weekday { color: %5$s; }
		</style>',
		$evt_badge_id,
		$evt_border_color,
		$evt_badge_bg,
		$evt_badge_text,
		$evt_weekday_color
	);
}

?>
<?php 
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already escaped via sprintf with esc_attr()
echo $evt_badge_css; 
?>
<div <?php 
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Safe output from get_block_wrapper_attributes()
echo $wrapper_attributes; 
?>>
	<div class="evt-border-badge">
		<div class="evt-event-date-badge">
			<span class="evt-date-day"><?php echo esc_html( $evt_date_parts['day'] ); ?></span>
			<span class="evt-date-month"><?php echo esc_html( $evt_date_parts['month'] ); ?></span>
			<?php if ( ! $evt_hide_year && $evt_date_parts['year'] !== '0001' ) : ?>
				<span class="evt-date-year"><?php echo esc_html( $evt_date_parts['year'] ); ?></span>
			<?php endif; ?>
		</div>
	</div>
	<span class="evt-date-weekday"><?php echo esc_html( $evt_date_parts['weekday'] ); ?></span>
</div>
<?php
// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
