<?php
/**
 * Register Events Grid Blocks
 * - evt/events-grid (Parent Container)
 * - evt/event-item (Child Event Card)
 */

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
				'default' => '0 0 8px 0'
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
