<?php
defined( 'ABSPATH' ) || exit;
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$id = isset( $attributes['evtbBadgeId'] ) ? sanitize_key( $attributes['evtbBadgeId'] ) : '';
$date = sanitize_text_field( $attributes['eventDate'] ?? '' ) ?: wp_date( 'Y-m-d' );
$bg = sanitize_hex_color( $attributes['dateBadgeBackgroundColor'] ?? '' ) ?: '#2667FF';
$txt = sanitize_hex_color( $attributes['dateBadgeTextColor'] ?? '' ) ?: '#ffffff';
$bdr = sanitize_hex_color( $attributes['borderBadgeColor'] ?? '' ) ?: '#00000040';
$wkd = sanitize_hex_color( $attributes['weekdayColor'] ?? '' ) ?: '#000000';
$hide_year = ! empty( $attributes['hideYear'] );
$ts = strtotime( $date ) ?: current_time( 'timestamp' );
$d = array( 'day' => wp_date( 'd', $ts ), 'month' => wp_date( 'M', $ts ), 'year' => wp_date( 'Y', $ts ), 'weekday' => strtoupper( wp_date( 'D', $ts ) ) );
$cls = 'evtb-event-date-badge-container' . ( $id ? ' evtb-badge-' . $id : '' );
$css = $id ? '<style>.evtb-badge-' . esc_html( $id ) . ' .evtb-border-badge{border:1px solid ' . esc_attr( $bdr ) . '}.evtb-badge-' . esc_html( $id ) . ' .evtb-event-date-badge{background-color:' . esc_attr( $bg ) . ';color:' . esc_attr( $txt ) . '}.evtb-badge-' . esc_html( $id ) . ' .evtb-date-day,.evtb-badge-' . esc_html( $id ) . ' .evtb-date-month{color:' . esc_attr( $txt ) . '}.evtb-badge-' . esc_html( $id ) . ' .evtb-date-weekday{color:' . esc_attr( $wkd ) . '}</style>' : '';
echo $css; // phpcs:ignore
?><div <?php echo get_block_wrapper_attributes( array( 'class' => $cls ) ); // phpcs:ignore ?>>
<div class="evtb-border-badge"><div class="evtb-event-date-badge">
<span class="evtb-date-day"><?php echo esc_html( $d['day'] ); ?></span>
<span class="evtb-date-month"><?php echo esc_html( $d['month'] ); ?></span>
<?php if ( ! $hide_year ) : ?><span class="evtb-date-year"><?php echo esc_html( $d['year'] ); ?></span><?php endif; ?>
</div></div>
<span class="evtb-date-weekday"><?php echo esc_html( $d['weekday'] ); ?></span>
</div><?php // phpcs:enable


