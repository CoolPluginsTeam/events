<?php
defined( 'ABSPATH' ) || exit;
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$id = isset( $attributes['evtbBlockId'] ) ? sanitize_key( $attributes['evtbBlockId'] ) : '';
$bg = isset( $attributes['detailsBackgroundColor'] ) ? sanitize_hex_color( $attributes['detailsBackgroundColor'] ) : '#ffffff';

// Output inline styles with higher specificity
$css = $id ? '<style>.evtb-front-view .evtb-block-' . esc_html( $id ) . ' .evtb-event-details{background-color:' . esc_attr( $bg ) . ' !important;}</style>' : '';
echo $css; // phpcs:ignore

// Check for Hide Past Events context
$hide_past = ! empty( $block->context['evtb/hidePastEvents'] );
$should_render = true;

// Debugging (Remove in production)
$d_date = $attributes['eventDate'] ?? '';
$d_end = $attributes['eventEndTime'] ?? '';
$d_now = current_datetime()->format('Y-m-d H:i:s P');

if ( $hide_past ) {
	$event_date = $attributes['eventDate'] ?? '';
	if ( $event_date ) {
		// If event_date is ISO format (has T), extract just the Y-m-d part
		if ( strpos( $event_date, 'T' ) !== false ) {
			$event_date = substr( $event_date, 0, 10 );
		}

		$start_time = ! empty( $attributes['eventStartTime'] ) ? $attributes['eventStartTime'] : '00:00';
		$end_time = ! empty( $attributes['eventEndTime'] ) ? $attributes['eventEndTime'] : '23:59:59';
		$event_dt_str = $event_date . ' ' . $end_time;
		
		// Create DateTime object with site's timezone
		$event_dt = date_create( $event_dt_str, wp_timezone() );

		// Handle overnight events (End Time < Start Time) usually means next day
		if ( $event_dt && $end_time < $start_time ) {
			$event_dt->modify( '+1 day' );
		}

		$now = current_datetime(); // Returns DateTimeImmutable with site's timezone
		
		if ( $event_dt && $now && $event_dt < $now ) {
			$should_render = false;
		}
	}
}

if ( $should_render ) :
	// Output content with proper wrappers
	$wrapper_attributes = get_block_wrapper_attributes(array(
		'class' => 'evtb-event-item' . ($id ? ' evtb-block-' . esc_attr($id) : ''),
		'style' => '--evtb-details-bg: ' . esc_attr($bg)
	));
	?>
	<div 
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escaped by WordPress
		echo $wrapper_attributes;
		?>
	>
					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- InnerBlocks content is trusted
					echo $content;
					?>
	</div>
	<?php
endif;
// phpcs:enable
