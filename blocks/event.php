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
			]
		],
	] );

	wp_set_script_translations( 'evt-event', 'event' );
} );
