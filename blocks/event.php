<?php

add_action( 'init', function() {
	register_block_type( 'evt/event', [
		'editor_script' => 'evt-event',
		'style' => 'evt-event',
		'editor_style' => 'evt-event-editor',
	] );

	wp_set_script_translations( 'evt-event', 'event' );
} );
