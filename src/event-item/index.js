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
import { dispatch, select, useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { getCurrentDate, formatTime12Hour } from '../shared/helpers';
import metadata from '../../blocks/event-item/block.json';

// CHILD BLOCK: Event Item using block.json metadata
registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes, clientId }) => {
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
			mediaBlock
		} = attributes;

	// Generate unique block ID if not present
	useEffect(() => {
		if (!evtbBlockId) {
			const uniqueId = clientId.substring(0, 8);
			setAttributes({ evtbBlockId: uniqueId });
		}
	}, []);

	// Set current date if eventDate is empty (for new events)
	useEffect(() => {
		if (!eventDate && !isDefault) {
			setAttributes({ eventDate: getCurrentDate() });
		}
	}, []);

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

		const blockProps = useBlockProps({
			className: `evtb-event-item${evtbBlockId ? ` evtb-block-${evtbBlockId}` : ''}`
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

		// Template for all blocks including image
		// Order: Image, Date Badge, Time, Title, Location, Price, Read More
		const TEMPLATE = isDefault && defaultContent ? [
			// IMAGE GROUP
			['core/group', { className: 'evtb-event-image-wrap' }, [
				['core/image', {
				  url: eventImage,
				  alt: eventImageAlt,
				  className: 'evtb-event-image-block'
				}]
			]],
		['core/group', { className: 'evtb-card-details' }, [
			// DATE BADGE
			['evtb/event-date-badge', {
				eventDate: eventDate,
				isDateSet: true
			}],
				
			// DETAILS GROUP
			['core/group', { className: 'evtb-event-detail' }, [
			
				['core/paragraph', {
				className: 'evtb-event-time',
				content: formattedTime,
				evtbStartTime: eventStartTime,
				evtbEndTime: eventEndTime,
				evtbIsTimeSet: true
				}],
				
				['core/heading', {
				level: 4,
				className: 'evtb-event-title',
				content: defaultContent?.title || ''
				}],
			
				['core/paragraph', {
				placeholder: __('Event Description', 'events'),
				className: 'evtb-event-description'
				}],
			
				['core/paragraph', {
				className: 'evtb-event-location',
				content: defaultContent?.location || ''
				}],
				
					// PRICE + READ MORE GROUP
					['core/group', { className: 'evtb-price-read-more' }, [
				
					['core/paragraph', {
						className: 'evtb-event-price',
						content: defaultContent?.price || ''
					}],
				
					['core/buttons', {}, [
						['core/button', {
						text: 'Read More',
						className: 'evtb-event-read-more',
						url: ''
						}]
					]]
					]]
				]]
			]]
		] : [
			// IMAGE GROUP for new events
			['core/group', { className: 'evtb-event-image-wrap' }, [
				['core/image', {
					className: 'evtb-event-image-block'
				}]
			]],
		['core/group', { className: 'evtb-card-details' }, [
			// Empty template with only placeholders for new events
			['evtb/event-date-badge', {
				eventDate: eventDate,
				isDateSet: true
			}],
			// DETAILS GROUP
			['core/group', { className: 'evtb-event-detail' }, [
				['core/paragraph', {
					placeholder: __('9:00 AM – 5:00 PM', 'events'),
					className: 'evtb-event-time',
					evtbStartTime: eventStartTime,
					evtbEndTime: eventEndTime,
					evtbIsTimeSet: false
				}],
					['core/heading', {
						level: 4,
						placeholder: __('Event Title', 'events'),
						className: 'evtb-event-title'
					}],
					['core/paragraph', {
						placeholder: __('Event Description', 'events'),
						className: 'evtb-event-description'
					}],
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
						{/* Content - Inside details-inner */}
						<div className="evtb-event-details-inner">
							{/* All content blocks including date badge */}
							<InnerBlocks.Content />
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
