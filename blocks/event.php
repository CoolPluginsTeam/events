<?php
/**
 * Register Events Grid Blocks
 * - evt/events-grid (Parent Container)
 * - evt/event-item (Child Event Card)
 */

// Generate CSS for Event Item Block
function evt_generate_block_css( $attributes, $block_id ) {
	$evt_css = '';
	
	// Extract attributes with defaults
	$details_bg = isset( $attributes['detailsBackgroundColor'] ) ? $attributes['detailsBackgroundColor'] : '#ffffff';
	
	
	// Title
	$title_size = isset( $attributes['titleFontSize'] ) ? $attributes['titleFontSize'] : '18px';
	$title_weight = isset( $attributes['titleFontWeight'] ) ? $attributes['titleFontWeight'] : '600';
	$title_height = isset( $attributes['titleLineHeight'] ) ? $attributes['titleLineHeight'] : '1.3';
	$title_margin = isset( $attributes['titleMargin'] ) ? $attributes['titleMargin'] : '4px 0px 6px 0px';
	$title_color = isset( $attributes['titleColor'] ) ? $attributes['titleColor'] : '#1a1a1a';
	$title_family = isset( $attributes['titleFontFamily'] ) ? $attributes['titleFontFamily'] : 'Inter';
	
	// Description
	$desc_size = isset( $attributes['descriptionFontSize'] ) ? $attributes['descriptionFontSize'] : '14px';
	$desc_weight = isset( $attributes['descriptionFontWeight'] ) ? $attributes['descriptionFontWeight'] : '400';
	$desc_height = isset( $attributes['descriptionLineHeight'] ) ? $attributes['descriptionLineHeight'] : '1.5';
	$desc_margin = isset( $attributes['descriptionMargin'] ) ? $attributes['descriptionMargin'] : '0 0 12px 0';
	$desc_color = isset( $attributes['descriptionColor'] ) ? $attributes['descriptionColor'] : '#1a1a1a';
	$desc_family = isset( $attributes['descriptionFontFamily'] ) ? $attributes['descriptionFontFamily'] : 'Inter';
	
	// Date
	$border_color = isset( $attributes['borderBadgeColor'] ) ? $attributes['borderBadgeColor'] : '#00000040';
	$date_badge_bg = isset( $attributes['dateBadgeBackgroundColor'] ) ? $attributes['dateBadgeBackgroundColor'] : '#2667FF';
	$date_badge_text = isset( $attributes['dateBadgeTextColor'] ) ? $attributes['dateBadgeTextColor'] : '#ffffff';
	$date_size = isset( $attributes['dateFontSize'] ) ? $attributes['dateFontSize'] : '21px';
	$date_weight = isset( $attributes['dateFontWeight'] ) ? $attributes['dateFontWeight'] : '700';
	$date_height = isset( $attributes['dateLineHeight'] ) ? $attributes['dateLineHeight'] : '1';
	$date_margin = isset( $attributes['dateMargin'] ) ? $attributes['dateMargin'] : '0';
	$date_family = isset( $attributes['dateFontFamily'] ) ? $attributes['dateFontFamily'] : 'Inter';
	
	// Month
	$month_size = isset( $attributes['monthFontSize'] ) ? $attributes['monthFontSize'] : '11px';
	$month_weight = isset( $attributes['monthFontWeight'] ) ? $attributes['monthFontWeight'] : '600';
	$month_height = isset( $attributes['monthLineHeight'] ) ? $attributes['monthLineHeight'] : '1.2';
	$month_margin = isset( $attributes['monthMargin'] ) ? $attributes['monthMargin'] : '0';
	$month_color  = isset( $attributes['monthColor'] ) ? $attributes['monthColor'] : '#ffffff';
	$month_family = isset( $attributes['monthFontFamily'] ) ? $attributes['monthFontFamily'] : 'Inter';
	
	// Weekday
	$weekday_size = isset( $attributes['weekdayFontSize'] ) ? $attributes['weekdayFontSize'] : '12px';
	$weekday_weight = isset( $attributes['weekdayFontWeight'] ) ? $attributes['weekdayFontWeight'] : '500';
	$weekday_height = isset( $attributes['weekdayLineHeight'] ) ? $attributes['weekdayLineHeight'] : '1.2';
	$weekday_margin = isset( $attributes['weekdayMargin'] ) ? $attributes['weekdayMargin'] : '0';
	$weekday_color = isset( $attributes['weekdayColor'] ) ? $attributes['weekdayColor'] : '#000000';
	$weekday_family = isset( $attributes['weekdayFontFamily'] ) ? $attributes['weekdayFontFamily'] : 'Inter';
	
	// Time
	$time_size = isset( $attributes['timeFontSize'] ) ? $attributes['timeFontSize'] : '14px';
	$time_weight = isset( $attributes['timeFontWeight'] ) ? $attributes['timeFontWeight'] : '500';
	$time_height = isset( $attributes['timeLineHeight'] ) ? $attributes['timeLineHeight'] : '1.4';
	$time_margin = isset( $attributes['timeMargin'] ) ? $attributes['timeMargin'] : '0';
	$time_color = isset( $attributes['timeColor'] ) ? $attributes['timeColor'] : '#1a1a1a';
	$time_family = isset( $attributes['timeFontFamily'] ) ? $attributes['timeFontFamily'] : 'Inter';
	
	// Location
	$loc_size = isset( $attributes['locationFontSize'] ) ? $attributes['locationFontSize'] : '14px';
	$loc_weight = isset( $attributes['locationFontWeight'] ) ? $attributes['locationFontWeight'] : '400';
	$loc_height = isset( $attributes['locationLineHeight'] ) ? $attributes['locationLineHeight'] : '1.5';
	$loc_margin = isset( $attributes['locationMargin'] ) ? $attributes['locationMargin'] : '0 0 12px 0';
	$loc_color = isset( $attributes['locationColor'] ) ? $attributes['locationColor'] : '#1a1a1a';
	$loc_family = isset( $attributes['locationFontFamily'] ) ? $attributes['locationFontFamily'] : 'Inter';
	
	// Price
	$price_size = isset( $attributes['priceFontSize'] ) ? $attributes['priceFontSize'] : '16px';
	$price_weight = isset( $attributes['priceFontWeight'] ) ? $attributes['priceFontWeight'] : '700';
	$price_height = isset( $attributes['priceLineHeight'] ) ? $attributes['priceLineHeight'] : '1.4';
	$price_margin = isset( $attributes['priceMargin'] ) ? $attributes['priceMargin'] : '0';
	$price_color = isset( $attributes['priceColor'] ) ? $attributes['priceColor'] : '#1a1a1a';
	$price_family = isset( $attributes['priceFontFamily'] ) ? $attributes['priceFontFamily'] : 'Inter';
	
	// Read More
	$rm_bg = isset( $attributes['readMoreButtonColor'] ) ? $attributes['readMoreButtonColor'] : '#2667FF';
	$rm_hover_bg = isset( $attributes['readMoreButtonHoverColor'] ) ? $attributes['readMoreButtonHoverColor'] : '#2667FF';
	$rm_hover_text = isset( $attributes['readMoreButtonHoverTextColor'] ) ? $attributes['readMoreButtonHoverTextColor'] : '#ffffff';
	$rm_size = isset( $attributes['readMoreFontSize'] ) ? $attributes['readMoreFontSize'] : '13px';
	$rm_weight = isset( $attributes['readMoreFontWeight'] ) ? $attributes['readMoreFontWeight'] : '500';
	$rm_height = isset( $attributes['readMoreLineHeight'] ) ? $attributes['readMoreLineHeight'] : '1.4';
	$rm_margin = isset( $attributes['readMoreMargin'] ) ? $attributes['readMoreMargin'] : '0';
	$rm_color = isset( $attributes['readMoreColor'] ) ? $attributes['readMoreColor'] : '#ffffff';
	$rm_family = isset( $attributes['readMoreFontFamily'] ) ? $attributes['readMoreFontFamily'] : 'Inter';
	
	// Generate CSS
	$evt_css = "
		.evt-block-{$block_id} .evt-event-card {
			background-color: {$details_bg};
		}
		.evt-block-{$block_id} .evt-border-badge {
			border: 1px solid {$border_color};
		}
		.evt-block-{$block_id} .evt-event-date-badge {
			background-color: {$date_badge_bg};
		}
		.evt-block-{$block_id} .evt-event-title {
			font-size: {$title_size};
			font-weight: {$title_weight};
			line-height: {$title_height};
			margin: {$title_margin};
			color: {$title_color};
			font-family: {$title_family};
		}
		.evt-block-{$block_id} .evt-event-description {
			font-size: {$desc_size};
			font-weight: {$desc_weight};
			line-height: {$desc_height};
			margin: {$desc_margin};
			color: {$desc_color};
			font-family: {$desc_family};
		}
		.evt-block-{$block_id} .evt-date-day {
			font-size: {$date_size};
			font-weight: {$date_weight};
			line-height: {$date_height};
			margin: {$date_margin};
			color: {$date_badge_text};
			font-family: {$date_family};
		}
		.evt-block-{$block_id} .evt-date-month {
			font-size: {$month_size};
			font-weight: {$month_weight};
			line-height: {$month_height};
			margin: {$month_margin};
			color: {$month_color};
			font-family: {$month_family};
		}
		.evt-block-{$block_id} .evt-date-weekday {
			font-size: {$weekday_size};
			font-weight: {$weekday_weight};
			line-height: {$weekday_height};
			margin: {$weekday_margin};
			color: {$weekday_color};
			font-family: {$weekday_family};
		}
		.evt-block-{$block_id} .evt-event-time,
		.evt-block-{$block_id} .evt-event-time i.evt-time-icon{
			font-size: {$time_size};
			font-weight: {$time_weight};
			line-height: {$time_height};
			margin: {$time_margin};
			color: {$time_color};
			font-family: {$time_family};
		}
		.evt-block-{$block_id} .evt-event-location {
			font-size: {$loc_size};
			font-weight: {$loc_weight};
			line-height: {$loc_height};
			margin: {$loc_margin};
			color: {$loc_color};
			font-family: {$loc_family};
		}
		.evt-block-{$block_id} .evt-event-price {
			font-size: {$price_size};
			font-weight: {$price_weight};
			line-height: {$price_height};
			margin: {$price_margin};
			color: {$price_color};
			font-family: {$price_family};
		}
		.evt-block-{$block_id} .evt-event-read-more {
			background-color: {$rm_bg};
			font-size: {$rm_size};
			font-weight: {$rm_weight};
			line-height: {$rm_height};
			margin: {$rm_margin};
			font-family: {$rm_family};
		}
		.evt-block-{$block_id} .evt-event-read-more,
		.evt-block-{$block_id} .evt-event-read-more a {
			color: {$rm_color};
		}
		.evt-block-{$block_id} .evt-event-read-more:hover {
			background-color: {$rm_hover_bg};
		}
		.evt-block-{$block_id} .evt-event-read-more a:hover {
			color: {$rm_hover_text};
		}
	";
	
	return trim( $evt_css );
}

// Filter to inject CSS for each event block
add_filter( 'render_block', 'evt_inject_block_css', 10, 2 );

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
		// Generate CSS for this block
		$evt_css = evt_generate_block_css( $block['attrs'], $block_id );
		
		// Inject CSS before block content with comment for debugging
		$block_content = '<!-- Event Block CSS: evt-block-' . esc_attr( $block_id ) . ' -->' . "\n" . '<style>' . $evt_css . '</style>' . "\n" . $block_content;
	}
	
	return $block_content;
}

add_action( 'init', function() {
	// Register parent block: Events Grid Container
	register_block_type( 'evt/events-grid', [
		'editor_script' => 'evt-event',
		'style' => 'evt-event',
		'editor_style' => 'evt-event-editor',
		'attributes' => [
			'columns' => [
				'type' => 'number',
				'default' => 3
			]
		],
	] );

	// Register child block: Event Item
	register_block_type( 'evt/event-item', [
		'editor_script' => 'evt-event',
		'style' => 'evt-event',
		'editor_style' => 'evt-event-editor',
		'parent' => [ 'evt/events-grid' ],
		'attributes' => [
			'evtBlockId' => [
				'type' => 'string',
				'default' => ''
			],
			'eventTitle' => [
				'type' => 'string',
				'default' => ''
			],
			'eventDescription' => [
				'type' => 'string',
				'default' => ''
			],
			'eventLocation' => [
				'type' => 'string',
				'default' => ''
			],
			'eventDate' => [
				'type' => 'string',
				'default' => ''
			],
			'eventEndDate' => [
				'type' => 'string',
				'default' => ''
			],
			'eventPrice' => [
				'type' => 'string',
				'default' => ''
			],
			'eventDay' => [
				'type' => 'string',
				'default' => ''
			],
			'eventImageURL' => [
				'type' => 'string',
				'default' => ''
			],
			'eventImageID' => [
				'type' => 'number'
			],
			'eventImageAlt' => [
				'type' => 'string',
				'default' => ''
			],
			'detailsBackgroundColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			],
			// Typography - Title
			'titleFontSize' => [
				'type' => 'string',
				'default' => '18px'
			],
			'titleFontWeight' => [
				'type' => 'string',
				'default' => '600'
			],
			'titleLineHeight' => [
				'type' => 'string',
				'default' => '1.3'
			],
			'titleMargin' => [
				'type' => 'string',
				'default' => '4px 0px 6px 0px'
			],
			'titleColor' => [
				'type' => 'string',
				'default' => '#1a1a1a'
			],
			'titleFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			],
			// Typography - Description
			'descriptionFontSize' => [
				'type' => 'string',
				'default' => '14px'
			],
			'descriptionFontWeight' => [
				'type' => 'string',
				'default' => '400'
			],
			'descriptionLineHeight' => [
				'type' => 'string',
				'default' => '1.5'
			],
			'descriptionMargin' => [
				'type' => 'string',
				'default' => '0 0 12px 0'
			],
			'descriptionColor' => [
				'type' => 'string',
				'default' => '#1a1a1a'
			],
			'descriptionFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			],
			// Typography - Date
			'borderBadgeColor' => [
				'type' => 'string',
				'default' => '#00000040'
			],
			'dateBadgeBackgroundColor' => [
				'type' => 'string',
				'default' => '#2667FF'
			],
			'dateBadgeTextColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			],
			'dateFontSize' => [
				'type' => 'string',
				'default' => '21px'
			],
			'dateFontWeight' => [
				'type' => 'string',
				'default' => '700'
			],
			'dateLineHeight' => [
				'type' => 'string',
				'default' => '1'
			],
			'dateMargin' => [
				'type' => 'string',
				'default' => '0'
			],
			'dateFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			],
			// Typography - Weekday
			'weekdayFontSize' => [
				'type' => 'string',
				'default' => '12px'
			],
			'weekdayFontWeight' => [
				'type' => 'string',
				'default' => '500'
			],
			'weekdayLineHeight' => [
				'type' => 'string',
				'default' => '1.2'
			],
			'weekdayMargin' => [
				'type' => 'string',
				'default' => '0'
			],
			'weekdayColor' => [
				'type' => 'string',
				'default' => '#000000'
			],
			'weekdayFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			],
			// Typography - Month
			'monthFontSize' => [
				'type' => 'string',
				'default' => '11px'
			],
			'monthFontWeight' => [
				'type' => 'string',
				'default' => '600'
			],
			'monthLineHeight' => [
				'type' => 'string',
				'default' => '1.2'
			],
			'monthMargin' => [
				'type' => 'string',
				'default' => '0'
			],
			'monthColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			],
			'monthFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			],
			// Typography - Time
			'timeFontSize' => [
				'type' => 'string',
				'default' => '14px'
			],
			'timeFontWeight' => [
				'type' => 'string',
				'default' => '500'
			],
			'timeLineHeight' => [
				'type' => 'string',
				'default' => '1.4'
			],
			'timeMargin' => [
				'type' => 'string',
				'default' => '0'
			],
			'timeColor' => [
				'type' => 'string',
				'default' => '#1a1a1a'
			],
			'timeFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			],
			// Typography - Location
			'locationFontSize' => [
				'type' => 'string',
				'default' => '14px'
			],
			'locationFontWeight' => [
				'type' => 'string',
				'default' => '400'
			],
			'locationLineHeight' => [
				'type' => 'string',
				'default' => '1.5'
			],
			'locationMargin' => [
				'type' => 'string',
				'default' => '0 0 12px 0'
			],
			'locationColor' => [
				'type' => 'string',
				'default' => '#1a1a1a'
			],
			'locationFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			],
			// Typography - Price
			'priceFontSize' => [
				'type' => 'string',
				'default' => '16px'
			],
			'priceFontWeight' => [
				'type' => 'string',
				'default' => '700'
			],
			'priceLineHeight' => [
				'type' => 'string',
				'default' => '1.4'
			],
			'priceMargin' => [
				'type' => 'string',
				'default' => '0'
			],
			'priceColor' => [
				'type' => 'string',
				'default' => '#1a1a1a'
			],
			'priceFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			],
			// Typography - Read More
			'readMoreURL' => [
				'type' => 'string',
				'default' => ''
			],
			'readMoreText' => [
				'type' => 'string',
				'default' => 'Read More'
			],
			'readMoreButtonColor' => [
				'type' => 'string',
				'default' => '#2667FF'
			],
			'readMoreButtonHoverColor' => [
				'type' => 'string',
				'default' => '#2667FF'
			],
			'readMoreButtonHoverTextColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			],
			'readMoreFontSize' => [
				'type' => 'string',
				'default' => '13px'
			],
			'readMoreFontWeight' => [
				'type' => 'string',
				'default' => '500'
			],
			'readMoreLineHeight' => [
				'type' => 'string',
				'default' => '1.4'
			],
			'readMoreMargin' => [
				'type' => 'string',
				'default' => '0'
			],
			'readMoreColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			],
			'readMoreFontFamily' => [
				'type' => 'string',
				'default' => 'Inter'
			]
		],
	] );

	wp_set_script_translations( 'evt-event', 'event' );
} );
