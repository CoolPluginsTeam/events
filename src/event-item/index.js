/**
 * Event Item Block (Child Block with InnerBlocks)
 * WordPress Block Standard: Import metadata from block.json
 * Includes: Paragraph extension for time settings
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, PanelRow, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, createElement, Fragment } from '@wordpress/element';
import { dispatch, select, useSelect, useDispatch } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { getCurrentDate, formatTime12Hour } from '../shared/helpers';
import metadata from '../../blocks/event-item/block.json';

// CHILD BLOCK: Event Item using block.json metadata
registerBlockType(metadata.name, {
	title: __('Event Item', 'events-block'),
	edit: ({ attributes, setAttributes, clientId, context }) => {
		const {
			evtbBlockId,
			eventImage,
			eventImageAlt,
			eventDate,
			eventStartTime,
			eventEndTime,
			detailsBackgroundColor,
			isDefault,
			hasImage,
			mediaBlock,
			contentPopulated,
			hideYear
		} = attributes;

	// Generate unique block ID and set default date if needed - SINGLE useEffect to prevent issues
	useEffect(() => {
		let updates = {};
		let shouldUpdate = false;

		// Set unique ID if not present
		if (!evtbBlockId) {
			updates.evtbBlockId = clientId.substring(0, 8);
			shouldUpdate = true;
		}

		// Set current date if eventDate is empty (for all events including default ones)
		if (!eventDate) {
			updates.eventDate = getCurrentDate();
			shouldUpdate = true;
		}

		// Sync hideYear from parent context (events-grid)
		const contextHideYear = context['evtb/hideYear'];
		if (contextHideYear !== undefined && contextHideYear !== hideYear) {
			updates.hideYear = contextHideYear;
			shouldUpdate = true;
		}

		// Only update if there are changes
		if (shouldUpdate) {
			setAttributes(updates);
		}
	}, [evtbBlockId, eventDate, isDefault, clientId, hideYear, context]);

		// Get inner blocks reactively to check for image block
		const hasImageBlock = useSelect((select) => {
			const blocks = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];

			// Check for direct image block
			const directImage = blocks.find(block => block.name === 'core/image');
			if (directImage) return true;

			// Check inside group wrappers
			const imageGroup = blocks.find(block =>
				block.name === 'core/group' &&
				block.attributes?.className?.includes('evtb-event-image-wrap')
			);

			if (imageGroup && imageGroup.innerBlocks) {
				const nestedImage = imageGroup.innerBlocks.find(block => block.name === 'core/image');
				if (nestedImage) return true;
			}

			return false;
		}, [clientId]);

		// Inner Block Template Handler - Add/Remove image block
		const innerBlockTemplate = (shouldAddImage) => {
			if (!shouldAddImage) {
				// REMOVE: Find and remove image block/group
				const currentBlocks = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];

				// Try to find image group first
				const imageGroupBlock = currentBlocks.find(block =>
					block.name === 'core/group' &&
					block.attributes?.className?.includes('evtb-event-image-wrap')
				);

				if (imageGroupBlock) {
					dispatch('core/block-editor').removeBlock(imageGroupBlock.clientId);
				} else {
					// Try direct image block
					const directImageBlock = currentBlocks.find(block => block.name === 'core/image');
					if (directImageBlock) {
						dispatch('core/block-editor').removeBlock(directImageBlock.clientId);
					}
				}

				// Clear attributes immediately
				setAttributes({
					mediaBlock: false,
					eventImage: '',
					eventImageAlt: '',
					hasImage: false
				});
			} else {
				// ADD: Create new image block
				const insertedBlock = createBlock('core/group', {
					className: 'evtb-event-image-wrap'
				}, [
					createBlock('core/image', {
						className: 'evtb-event-image-block'
					})
				]);

				dispatch('core/block-editor').insertBlocks(insertedBlock, 0, clientId);
				setAttributes({ mediaBlock: true, hasImage: true });

				// Auto-select the image block
				setTimeout(() => {
					const blocks = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];
					const addedGroup = blocks[0];
					if (addedGroup && addedGroup.innerBlocks && addedGroup.innerBlocks[0]) {
						dispatch('core/block-editor').selectBlock(addedGroup.innerBlocks[0].clientId);
					}
				}, 50);
			}
		};


		// Check if event is past
		const hidePastEvents = context['evtb/hidePastEvents'];
		let isPast = false;

		if (hidePastEvents && eventDate) {
			try {
				const currentDateTime = new Date();
				let eventDateTime = new Date(eventDate);

				// Add time if available
				if (eventEndTime) {
					const [hours, minutes] = eventEndTime.split(':');
					eventDateTime.setHours(hours, minutes);

					// Handle overnight events (End Time < Start Time)
					if (eventStartTime && eventEndTime < eventStartTime) {
						eventDateTime.setDate(eventDateTime.getDate() + 1);
					}
				} else {
					// End of day if no time
					eventDateTime.setHours(23, 59, 59);
				}

				if (eventDateTime < currentDateTime) {
					isPast = true;
				}
			} catch (e) {
				// Ignore date parse errors
			}
		}

		const blockProps = useBlockProps({
			className: `evtb-event-item${evtbBlockId ? ` evtb-block-${evtbBlockId}` : ''}`,
			style: isPast ? { opacity: 0.6, filter: 'grayscale(1)' } : {}
		});

		// Default event data (for first 3 events)
		const defaultEventData = [
			{
				title: 'Crazy DJ Experience Santa Cruz',
				time: '9:00 AM - 5:00 PM',
				location: 'JW Marriott, Sector 35',
				price: '$25.00'
			},
			{
				title: 'Cute Girls Rock Band Performance',
				time: '9:00 AM - 5:00 PM',
				location: 'Club XYZ, Sector 17',
				price: '$20.00'
			},
			{
				title: 'Free Food Distribution At Mumbai',
				time: '9:00 AM - 5:00 PM',
				location: 'Food Corp. Mumbai, Ft. Line',
				price: 'No Cost'
			}
		];

		// Get default data if this is a default event
		const getDefaultContent = () => {
			if (!isDefault) return null;

			// Try to match based on image alt text
			if (eventImageAlt.includes('DJ')) return defaultEventData[0];
			if (eventImageAlt.includes('Rock')) return defaultEventData[1];
			if (eventImageAlt.includes('Food')) return defaultEventData[2];

			return null;
		};

		const defaultContent = getDefaultContent();

		// Format time display
		const formattedTime = `${formatTime12Hour(eventStartTime)} – ${formatTime12Hour(eventEndTime)}`;

		// Get dispatch functions for inserting/removing blocks
		const { insertBlocks, removeBlocks } = useDispatch('core/block-editor');
		
		// Get current inner blocks
		const currentInnerBlocks = useSelect(
			(select) => select('core/block-editor').getBlock(clientId)?.innerBlocks || [],
			[clientId]
		);

	// Auto-populate default content ONLY for default events
	// This runs ONLY when isDefault=true and contentPopulated=false
	useEffect(() => {
		// Guard: Wait for attributes to be properly initialized
		if (isDefault === undefined || eventImage === undefined) {
			return;
		}
		
		// Only run for default events that haven't been populated yet
		if (!isDefault || contentPopulated) {
			return;
		}
		
		// Must have eventImage to populate content
		if (!eventImage) {
			return;
		}
		
		// Get default content based on event
		const content = getDefaultContent();
		if (!content) {
			return;
		}
		
		// Wait for innerBlocks to be ready (they might be created by template)
		const timer = setTimeout(() => {
			const currentBlocks = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];
			
			// IMPORTANT: Only populate if blocks exist (created by template)
			// This prevents double content - we're just updating existing blocks, not creating new ones
			if (currentBlocks.length > 0 && insertBlocks) {
				// Clear template placeholder blocks
				const blockIds = currentBlocks.map(block => block.clientId);
				removeBlocks(blockIds, false);
				
				// Format time for display
				const timeDisplay = `${formatTime12Hour(eventStartTime)} – ${formatTime12Hour(eventEndTime)}`;
				
				// Create content blocks with actual default data
				const contentBlocks = [
					// IMAGE GROUP
					createBlock('core/group', { className: 'evtb-event-image-wrap' }, [
						createBlock('core/image', {
							url: eventImage,
							alt: eventImageAlt,
							className: 'evtb-event-image-block'
						})
					]),
					// CARD DETAILS GROUP
					createBlock('core/group', { className: 'evtb-card-details' }, [
						// DATE BADGE
						createBlock('evtb/event-date-badge', {
							eventDate: eventDate,
							isDateSet: true
						}),
						// DETAILS GROUP
						createBlock('core/group', { className: 'evtb-event-detail' }, [
							// TIME
							createBlock('core/paragraph', {
								className: 'evtb-event-time',
								content: timeDisplay,
								evtbStartTime: eventStartTime,
								evtbEndTime: eventEndTime,
								evtbIsTimeSet: true
							}),
							// TITLE
							createBlock('core/heading', {
								level: 4,
								className: 'evtb-event-title',
								content: content.title
							}),
							// DESCRIPTION (empty, just placeholder)
							createBlock('core/paragraph', {
								placeholder: __('Event Description', 'events'),
								className: 'evtb-event-description'
							}),
							// LOCATION
							createBlock('core/paragraph', {
								className: 'evtb-event-location',
								content: content.location
							}),
							// PRICE + READ MORE GROUP
							createBlock('core/group', { className: 'evtb-price-read-more' }, [
								createBlock('core/paragraph', {
									className: 'evtb-event-price',
									content: content.price
								}),
								createBlock('core/buttons', {}, [
									createBlock('core/button', {
										text: 'Read More',
										className: 'evtb-event-read-more',
										url: ''
									})
								])
							])
						])
					])
				];
				
				// Insert populated blocks
				try {
					insertBlocks(contentBlocks, 0, clientId, false);
					
					// Mark as populated to prevent re-running
					setAttributes({ contentPopulated: true });
				} catch (error) {
					console.error('Error populating default content:', error);
				}
			}
		}, 200); // Small delay to ensure template is ready
		
		return () => clearTimeout(timer);
	}, [isDefault, contentPopulated, eventImage, eventImageAlt, eventDate, eventStartTime, eventEndTime, clientId]);

	// Template: Creates basic structure with placeholders
	// For default events, useEffect will populate actual content
	// For new events, user will fill manually
	const TEMPLATE = [
		// IMAGE GROUP
		['core/group', { className: 'evtb-event-image-wrap' }, [
			['core/image', {
				url: isDefault ? eventImage : '',
				alt: isDefault ? eventImageAlt : '',
				className: 'evtb-event-image-block'
			}]
		]],
		// CARD DETAILS GROUP
		['core/group', { className: 'evtb-card-details' }, [
			// DATE BADGE
			['evtb/event-date-badge', {
				eventDate: eventDate || getCurrentDate(),
				isDateSet: !!eventDate
			}],
			// DETAILS GROUP
			['core/group', { className: 'evtb-event-detail' }, [
				// TIME
				['core/paragraph', {
					placeholder: __('9:00 AM – 5:00 PM', 'events'),
					className: 'evtb-event-time',
					evtbStartTime: eventStartTime,
					evtbEndTime: eventEndTime,
					evtbIsTimeSet: false
				}],
				// TITLE
				['core/heading', {
					level: 4,
					placeholder: __('Event Title', 'events'),
					className: 'evtb-event-title'
				}],
				// DESCRIPTION
				['core/paragraph', {
					placeholder: __('Event Description', 'events'),
					className: 'evtb-event-description'
				}],
				// LOCATION
				['core/paragraph', {
					placeholder: __('Event Location', 'events'),
					className: 'evtb-event-location'
				}],
				// PRICE + READ MORE GROUP
				['core/group', { className: 'evtb-price-read-more' }, [
					['core/paragraph', {
						placeholder: __('Event Price', 'events'),
						className: 'evtb-event-price'
					}],
					['core/buttons', {}, [
						['core/button', {
							text: __('Read More', 'events'),
							className: 'evtb-event-read-more',
							url: ''
						}]
					]]
				]]
			]]
		]]
	];

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Event Settings', 'events')}>
						<PanelRow>
							<div style={{ width: '100%', marginTop: '16px' }}>
								<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
									{__('Details Background Color', 'events')}
								</label>
								<ColorPalette
									value={detailsBackgroundColor}
									onChange={(color) => setAttributes({ detailsBackgroundColor: color || '#ffffff' })}
								/>
							</div>
						</PanelRow>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="evtb-event-card">
						{/* Add/Remove Image Block Button - Simple logic */}
						{!hasImageBlock && (
							<div className="evtb-add-image-block">
								<Button
									isSmall
									isSecondary
									onClick={() => innerBlockTemplate(true)}
								>
									{__('Add Image Block', 'events')}
								</Button>
							</div>
						)}
						{hasImageBlock && (
							<div className="evtb-add-image-block">
								<Button
									isSmall
									isSecondary
									onClick={() => innerBlockTemplate(false)}
								>
									{__('Remove Image Block', 'events')}
								</Button>
							</div>
						)}
						<div className="evtb-event-details" style={{
							'--evtb-details-bg': detailsBackgroundColor || '#ffffff'
						}}>
							{/* Content Blocks - Inside details-inner (image block will be filtered via CSS) */}
							<div className="evtb-event-details-inner">
								<InnerBlocks
									template={TEMPLATE}
									templateLock={false}
									allowedBlocks={[
										'core/group',
										'core/image',
										'evtb/event-date-badge',
										'core/heading',
										'core/paragraph',
										'core/list',
										'core/buttons',
										'core/button'
									]}
									renderAppender={false}
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const {
			evtbBlockId,
			detailsBackgroundColor
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `evtb-event-item${evtbBlockId ? ` evtb-block-${evtbBlockId}` : ''}`,
			style: {
				'--evtb-details-bg': detailsBackgroundColor || '#ffffff'
			}
		});

		return (
			<div {...blockProps}>
				<div className="evtb-event-card">
					<div className="evtb-event-details">
						{/* Content - Inside details-inner */}
						<div className="evtb-event-details-inner">
							{/* All content blocks including date badge */}
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		);
	}
});

// ========================================
// EXTEND CORE/PARAGRAPH BLOCK FOR TIME SETTINGS
// ========================================

// Add custom attributes to core/paragraph block
addFilter(
	'blocks.registerBlockType',
	'evtb/paragraph-time-attributes',
	(settings, name) => {
		if (name !== 'core/paragraph') {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				evtbStartTime: {
					type: 'string',
					default: '09:00'
				},
				evtbEndTime: {
					type: 'string',
					default: '17:00'
				},
				evtbIsTimeSet: {
					type: 'boolean',
					default: false
				}
			}
		};
	}
);

// Add Time Settings panel to paragraph block with evtb-event-time class
const withTimeSettings = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;

		// Only apply to core/paragraph with evtb-event-time class
		if (name !== 'core/paragraph' || !attributes.className || !attributes.className.includes('evtb-event-time')) {
			return createElement(BlockEdit, props);
		}

		const { evtbStartTime, evtbEndTime, evtbIsTimeSet } = attributes;

		// Get parent Event Item context
		const parentContext = useSelect((select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(props.clientId);

			// Find evtb/event-item parent
			for (let parentId of parentIds) {
				const parentBlock = getBlock(parentId);
				if (parentBlock && parentBlock.name === 'evtb/event-item') {
					return {
						clientId: parentId,
						startTime: parentBlock.attributes.eventStartTime || '09:00',
						endTime: parentBlock.attributes.eventEndTime || '17:00'
					};
				}
			}
			return null;
		}, [props.clientId]);

		// Use parent times or own times
		const currentStartTime = parentContext?.startTime || evtbStartTime;
		const currentEndTime = parentContext?.endTime || evtbEndTime;

		// Handle time changes
		const handleStartTimeChange = (newTime) => {
			setAttributes({
				evtbStartTime: newTime,
				evtbIsTimeSet: true
			});

			// Update parent Event Item block
			if (parentContext) {
				dispatch('core/block-editor').updateBlockAttributes(
					parentContext.clientId,
					{ eventStartTime: newTime }
				);
			}

			// Update paragraph content
			updateParagraphContent(newTime, currentEndTime);
		};

		const handleEndTimeChange = (newTime) => {
			setAttributes({
				evtbEndTime: newTime,
				evtbIsTimeSet: true
			});

			// Update parent Event Item block
			if (parentContext) {
				dispatch('core/block-editor').updateBlockAttributes(
					parentContext.clientId,
					{ eventEndTime: newTime }
				);
			}

			// Update paragraph content
			updateParagraphContent(currentStartTime, newTime);
		};

		// Update paragraph content with formatted time
		const updateParagraphContent = (startTime, endTime) => {
			const formattedTime = `${formatTime12Hour(startTime)} – ${formatTime12Hour(endTime)}`;
			setAttributes({ content: formattedTime });
		};

		// Sync parent times to paragraph content on mount
		useEffect(() => {
			if (parentContext && evtbIsTimeSet) {
				updateParagraphContent(currentStartTime, currentEndTime);
			}
		}, [parentContext?.startTime, parentContext?.endTime]);

		return createElement(
			Fragment,
			{},
			createElement(BlockEdit, props),
			createElement(
				InspectorControls,
				{},
				createElement(
					PanelBody,
					{
						title: __('Time Settings', 'events'),
						className: 'evtb-time-settings'
					},
					createElement(
						'div',
						{ className: 'evtb-start-time-input' },
						createElement('strong', {}, __('Start Time', 'events')),
						createElement('input', {
							type: 'time',
							value: currentStartTime,
							onChange: (e) => handleStartTimeChange(e.target.value),
							onClick: (e) => {
								if (e.target.showPicker) {
									e.target.showPicker();
								}
							}
						})
					),
					createElement(
						'div',
						{ className: 'evtb-end-time-input' },
						createElement('strong', {}, __('End Time', 'events')),
						createElement('input', {
							type: 'time',
							value: currentEndTime,
							onChange: (e) => handleEndTimeChange(e.target.value),
							onClick: (e) => {
								if (e.target.showPicker) {
									e.target.showPicker();
								}
							}
						})
					)
				)
			)
		);
	};
}, 'withTimeSettings');

addFilter(
	'editor.BlockEdit',
	'evtb/paragraph-time-settings',
	withTimeSettings
);
