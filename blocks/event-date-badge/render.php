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
if ( empty( $attributes['isDateSet'] ) ) {
	return '';
}

// Get attributes
$badge_id = isset( $attributes['evtBadgeId'] ) ? esc_attr( $attributes['evtBadgeId'] ) : '';
$event_date = isset( $attributes['eventDate'] ) ? $attributes['eventDate'] : '';
$hide_year = isset( $attributes['hideYear'] ) ? $attributes['hideYear'] : false;

// Get colors
$badge_bg = isset( $attributes['dateBadgeBackgroundColor'] ) ? esc_attr( $attributes['dateBadgeBackgroundColor'] ) : '#2667FF';
$badge_text = isset( $attributes['dateBadgeTextColor'] ) ? esc_attr( $attributes['dateBadgeTextColor'] ) : '#ffffff';
$border_color = isset( $attributes['borderBadgeColor'] ) ? esc_attr( $attributes['borderBadgeColor'] ) : '#00000040';
$weekday_color = isset( $attributes['weekdayColor'] ) ? esc_attr( $attributes['weekdayColor'] ) : '#000000';

// Parse date
$date_parts = array(
	'day' => '01',
	'month' => 'Jan',
	'year' => '0001',
	'weekday' => 'MON'
);

if ( ! empty( $event_date ) ) {
	$timestamp = strtotime( $event_date );
	if ( $timestamp ) {
		$date_parts = array(
			'day' => wp_date( 'd', $timestamp ),
			'month' => wp_date( 'M', $timestamp ),
			'year' => wp_date( 'Y', $timestamp ),
			'weekday' => strtoupper( wp_date( 'D', $timestamp ) )
		);
	}
}

// Generate wrapper attributes
$wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'evt-event-date-badge-container' . ( $badge_id ? ' evt-badge-' . $badge_id : '' ),
) );

// Inject badge-specific CSS (WordPress Standard: Inline styles)
$badge_css = '';
if ( $badge_id ) {
	$badge_css = sprintf(
		'<style>
			.evt-badge-%1$s .evt-border-badge { border: 1px solid %2$s; }
			.evt-badge-%1$s .evt-event-date-badge { background-color: %3$s; color: %4$s; }
			.evt-badge-%1$s .evt-date-day, .evt-badge-%1$s .evt-date-month { color: %4$s; }
			.evt-badge-%1$s .evt-date-weekday { color: %5$s; }
		</style>',
		$badge_id,
		$border_color,
		$badge_bg,
		$badge_text,
		$weekday_color
	);
}

?>
<?php echo $badge_css; ?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="evt-border-badge">
		<div class="evt-event-date-badge">
			<span class="evt-date-day"><?php echo esc_html( $date_parts['day'] ); ?></span>
			<span class="evt-date-month"><?php echo esc_html( $date_parts['month'] ); ?></span>
			<?php if ( ! $hide_year && $date_parts['year'] !== '0001' ) : ?>
				<span class="evt-date-year"><?php echo esc_html( $date_parts['year'] ); ?></span>
			<?php endif; ?>
		</div>
	</div>
	<span class="evt-date-weekday"><?php echo esc_html( $date_parts['weekday'] ); ?></span>
</div>
