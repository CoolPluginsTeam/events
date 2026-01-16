<?php
defined( 'ABSPATH' ) || exit;
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
$id = isset( $attributes['evtbBlockId'] ) ? sanitize_key( $attributes['evtbBlockId'] ) : '';
$bg = isset( $attributes['detailsBackgroundColor'] ) ? sanitize_hex_color( $attributes['detailsBackgroundColor'] ) : '#ffffff';

// Output inline styles with higher specificity
$css = $id ? '<style>.evtb-front-view .evtb-block-' . esc_html( $id ) . ' .evtb-event-details{background-color:' . esc_attr( $bg ) . ' !important;}</style>' : '';
echo $css; // phpcs:ignore

// Output content with proper wrappers
$wrapper_attributes = get_block_wrapper_attributes(array(
    'class' => 'evtb-event-item' . ($id ? ' evtb-block-' . esc_attr($id) : ''),
    'style' => '--evtb-details-bg: ' . esc_attr($bg)
));
?>
<div <?php echo $wrapper_attributes; ?>>
    <div class="evtb-event-card">
        <div class="evtb-event-details">
            <div class="evtb-event-details-inner">
                <?php echo $content; ?>
            </div>
        </div>
    </div>
</div>
<?php
// phpcs:enable
