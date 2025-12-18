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
			'weekdayTextColor' => [
				'type' => 'string',
				'default' => '#000000'
			],
			'detailsTextColor' => [
				'type' => 'string',
				'default' => '#1a1a1a'
			],
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
			'readMoreButtonTextColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			],
			'readMoreButtonHoverColor' => [
				'type' => 'string',
				'default' => '#2667FF'
			],
			'readMoreButtonHoverTextColor' => [
				'type' => 'string',
				'default' => '#ffffff'
			]
		],
	] );

	wp_set_script_translations( 'evt-event', 'event' );
} );
