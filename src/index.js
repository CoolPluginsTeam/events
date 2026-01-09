import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, PanelRow, Button, DateTimePicker, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n } from '@wordpress/date';
import { useEffect, createElement, Fragment } from '@wordpress/element';
import { dispatch, select, useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

// Get current date formatted
const getCurrentDate = () => {
	const now = new Date();
	return dateI18n('Y-m-d', now);
};

// Get default images from plugin data
const getDefaultImages = () => {
	if (window.evtPluginData && window.evtPluginData.images) {
		return [
			window.evtPluginData.images.crazyDJ || '',
			window.evtPluginData.images.rockBand || '',
			window.evtPluginData.images.foodDistribution || ''
		];
	}
	return ['', '', ''];
};

// Convert 24-hour time to 12-hour AM/PM format
const formatTime12Hour = (time24) => {
	if (!time24) return '';
	
	const [hours, minutes] = time24.split(':');
	let hour = parseInt(hours);
	const ampm = hour >= 12 ? 'PM' : 'AM';
	
	hour = hour % 12;
	hour = hour ? hour : 12; // 0 should be 12
	
	return `${hour}:${minutes} ${ampm}`;
};

// PARENT BLOCK: Events Grid Container
registerBlockType('evt/events-grid', {
	title: __('Events', 'events'),
	icon: 'grid-view',
	category: 'widgets',
	attributes: {
		columns: {
			type: 'number',
			default: 2
		}
	},
	edit: ({ attributes, setAttributes }) => {
		const { columns } = attributes;
		const blockProps = useBlockProps({
			className: 'evt-events-grid-container',
			style: { '--grid-columns': columns }
		});

		const defaultImages = getDefaultImages();

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Grid Settings', 'events')}>
						<NumberControl
					        label={__('Columns', 'events')}
							value={columns}
							onChange={(value) => setAttributes({ columns: parseInt(value) || 2 })}
							min={1}
							max={3}
							help={__('Number of columns in the grid (1-3)', 'evt')}
							__next40pxDefaultSize={true}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
				    <InnerBlocks
						allowedBlocks={['evt/event-item']}
						template={[
									['evt/event-item', {
										eventImage: defaultImages[0],
										eventImageAlt: 'Crazy DJ Experience Santa Cruz',
										eventDate: '2026-01-06',
										isDefault: true,
										hasImage: true
									}],
									['evt/event-item', {
										eventImage: defaultImages[1],
										eventImageAlt: 'Cute Girls Rock Band Performance',
										eventDate: '2026-04-04',
										isDefault: true,
										hasImage: true
									}],
									['evt/event-item', {
										eventImage: defaultImages[2],
										eventImageAlt: 'Free Food Distribution At Mumbai',
										eventDate: '2026-06-08',
										isDefault: true,
										hasImage: true
									}]
						]}
						renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
					/>
				</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const { columns } = attributes;
		const blockProps = useBlockProps.save({
			className: 'evt-events-grid-container evt-front-view',
			style: { '--columns': columns }
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	}
});

// CHILD BLOCK: Event Date Badge
registerBlockType('evt/event-date-badge', {
	title: __('Event Date', 'events'),
	icon: 'clock',
	category: 'widgets',
	parent: ['evt/event-item'],
	usesContext: ['evt/eventDate'],
	attributes: {
		evtBadgeId: {
			type: 'string',
			default: ''
		},
		eventDate: {
			type: 'string',
			default: getCurrentDate()
		},
		isDateSet: {
			type: 'boolean',
			default: false
		},
		hideYear: {
			type: 'boolean',
			default: false
		},
		dateBadgeBackgroundColor: {
			type: 'string',
			default: '#2667FF'
		},
		dateBadgeTextColor: {
			type: 'string',
			default: '#ffffff'
		},
		borderBadgeColor: {
			type: 'string',
			default: '#00000040'
		},
		weekdayColor: {
			type: 'string',
			default: '#000000'
		}
	},
	edit: ({ attributes, setAttributes, context, clientId }) => {
		const {
			evtBadgeId,
			eventDate,
			isDateSet,
			hideYear,
			dateBadgeBackgroundColor,
			dateBadgeTextColor,
			borderBadgeColor,
			weekdayColor
		} = attributes;

		// Generate unique badge ID if not present
		useEffect(() => {
			if (!evtBadgeId) {
				const uniqueId = clientId.substring(0, 8);
				setAttributes({ evtBadgeId: uniqueId });
			}
		}, []);

		// Use parent's date if available
		const parentDate = context['evt/eventDate'] || eventDate;
		
		// Get parent block ID
		const parentClientId = useSelect((select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(clientId);
			// Find the evt/event-item parent
			for (let parentId of parentIds) {
				const parentBlock = getBlock(parentId);
				if (parentBlock && parentBlock.name === 'evt/event-item') {
					return parentId;
				}
			}
			return null;
		}, [clientId]);
		
		// Sync parent values to child attributes
		useEffect(() => {
			if (context['evt/eventDate'] && context['evt/eventDate'] !== eventDate) {
				setAttributes({ eventDate: context['evt/eventDate'] });
			}
		}, [context['evt/eventDate']]);

		// Inject CSS in editor for date badge
		useEffect(() => {
			if (!evtBadgeId) return;

			// Remove existing style tag
			const existingStyle = document.getElementById(`evt-badge-style-${evtBadgeId}`);
			if (existingStyle) {
				existingStyle.remove();
			}

			// Create new style tag
			const style = document.createElement('style');
			style.id = `evt-badge-style-${evtBadgeId}`;
			style.innerHTML = `
				.evt-badge-${evtBadgeId} .evt-border-badge {
					border: 1px solid ${borderBadgeColor};
				}
				.evt-badge-${evtBadgeId} .evt-event-date-badge {
					background-color: ${dateBadgeBackgroundColor};
					color: ${dateBadgeTextColor};
				}
				.evt-badge-${evtBadgeId} .evt-date-day,
				.evt-badge-${evtBadgeId} .evt-date-month {
					color: ${dateBadgeTextColor};
				}
				.evt-badge-${evtBadgeId} .evt-date-weekday {
					color: ${weekdayColor};
				}
			`;
			document.head.appendChild(style);

			// Cleanup
			return () => {
				const styleToRemove = document.getElementById(`evt-badge-style-${evtBadgeId}`);
				if (styleToRemove) {
					styleToRemove.remove();
				}
			};
		}, [evtBadgeId, dateBadgeBackgroundColor, dateBadgeTextColor, borderBadgeColor, weekdayColor]);

		const blockProps = useBlockProps({
			className: `evt-event-date-badge-container${evtBadgeId ? ` evt-badge-${evtBadgeId}` : ''}`
		});

		// Parse date for display
		const parseDate = (dateString) => {
			if (!dateString) return { day: '01', month: 'Jan', year: '0001', weekday: 'MON' };
			
			try {
				const date = new Date(dateString);
				return {
					day: dateI18n('d', date),
					month: dateI18n('M', date),
					year: dateI18n('Y', date),
					weekday: dateI18n('D', date).toUpperCase()
				};
			} catch (e) {
				return { day: '01', month: 'Jan', year: '0001', weekday: 'MON' };
			}
		};

		const dateParts = parseDate(parentDate);

		// Handle date change - update both child and parent
		const handleDateChange = (newDate) => {
			// Update child attribute and mark as date set by user
			setAttributes({ 
				eventDate: newDate,
				isDateSet: true
			});
			
			// Update parent Event Item block's eventDate
			if (parentClientId) {
				dispatch('core/block-editor').updateBlockAttributes(
					parentClientId,
					{ eventDate: newDate }
				);
			}
		};

		return (
			<>
				<InspectorControls>
					<PanelBody className="evt-date-settings" title={__('Date Settings', 'events')}>
						<div style={{ marginBottom: '15px' }}>
							<strong>{__('Event Date', 'events')}</strong>
							<DateTimePicker
								currentDate={parentDate}
								onChange={handleDateChange}
								is12Hour={true}
							/>
						</div>
						<p style={{ fontSize: '13px', color: '#FF0000', marginBottom: '10px' }}><strong>{__('Note:', 'events')}</strong> {__('To hide the year, simply set the year value to 0001 in the year section.', 'events')}</p>
					</PanelBody>

					<PanelBody title={__('Date Colors', 'events')} initialOpen={false}>
						<PanelRow>
							<div style={{ width: '100%', marginTop: '16px' }}>
								<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
									{__('Background Color', 'events')}
								</label>
								<ColorPalette
									value={dateBadgeBackgroundColor}
									onChange={(color) => setAttributes({ dateBadgeBackgroundColor: color || '#2667FF' })}
								/>
							</div>
						</PanelRow>
						<PanelRow>
							<div style={{ width: '100%', marginTop: '16px' }}>
								<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
									{__('Text Color', 'events')}
								</label>
								<ColorPalette
									value={dateBadgeTextColor}
									onChange={(color) => setAttributes({ dateBadgeTextColor: color || '#ffffff' })}
								/>
							</div>
						</PanelRow>
						<PanelRow>
							<div style={{ width: '100%', marginTop: '16px' }}>
								<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
									{__('Border Color', 'events')}
								</label>
								<ColorPalette
									value={borderBadgeColor}
									onChange={(color) => setAttributes({ borderBadgeColor: color || '#00000040' })}
								/>
							</div>
						</PanelRow>
						<PanelRow>
							<div style={{ width: '100%', marginTop: '16px' }}>
								<label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
									{__('Weekday Color', 'events')}
								</label>
								<ColorPalette
									value={weekdayColor}
									onChange={(color) => setAttributes({ weekdayColor: color || '#000000' })}
								/>
							</div>
						</PanelRow>
					</PanelBody>
				</InspectorControls>

			<div {...blockProps}>
				<div className="evt-border-badge">
					<div className="evt-event-date-badge">
						<span className="evt-date-day">{dateParts.day}</span>
						<span className="evt-date-month">{dateParts.month}</span>
						{!hideYear && dateParts.year !== '0001' && (
							<span className="evt-date-year">{dateParts.year}</span>
						)}
					</div>
				</div>
				<span className="evt-date-weekday">{dateParts.weekday}</span>
			</div>
			</>
		);
	},
	save: ({ attributes }) => {
		const {
			evtBadgeId,
			eventDate,
			isDateSet,
			hideYear
		} = attributes;

		// Don't render if date not set by user
		// if (!isDateSet) {
		// 	return null;
		// }

		const blockProps = useBlockProps.save({
			className: `evt-event-date-badge-container${evtBadgeId ? ` evt-badge-${evtBadgeId}` : ''}`
		});

		// Parse date for display
		const parseDate = (dateString) => {
			if (!dateString) return { day: '01', month: 'Jan', year: '0001', weekday: 'MON' };
			
			try {
				const date = new Date(dateString);
				return {
					day: dateI18n('d', date),
					month: dateI18n('M', date),
					year: dateI18n('Y', date),
					weekday: dateI18n('D', date).toUpperCase()
				};
			} catch (e) {
				return { day: '01', month: 'Jan', year: '0001', weekday: 'MON' };
			}
		};

		const dateParts = parseDate(eventDate);

		return (
			<div {...blockProps}>
				<div className="evt-border-badge">
					<div className="evt-event-date-badge">
						<span className="evt-date-day">{dateParts.day}</span>
						<span className="evt-date-month">{dateParts.month}</span>
						{!hideYear && dateParts.year !== '0001' && (
							<span className="evt-date-year">{dateParts.year}</span>
						)}
					</div>
				</div>
				<span className="evt-date-weekday">{dateParts.weekday}</span>
			</div>
		);
	}
});

// CHILD BLOCK: Event Item (uses default blocks inside)
registerBlockType('evt/event-item', {
	title: __('Event Item', 'events'),
	icon: 'calendar',
	category: 'widgets',
	parent: ['evt/events-grid'],
	providesContext: {
		'evt/eventDate': 'eventDate',
		'evt/eventStartTime': 'eventStartTime',
		'evt/eventEndTime': 'eventEndTime'
	},
	attributes: {
		evtBlockId: {
			type: 'string',
			default: ''
		},
		eventImage: {
			type: 'string',
			default: ''
		},
		eventImageAlt: {
			type: 'string',
			default: ''
		},
		eventDate: {
			type: 'string',
			default: getCurrentDate()
		},
		eventStartTime: {
			type: 'string',
			default: '09:00'
		},
		eventEndTime: {
			type: 'string',
			default: '17:00'
		},
		detailsBackgroundColor: {
			type: 'string',
			default: '#ffffff'
		},
		isDefault: {
			type: 'boolean',
			default: false
		},
		hasImage: {
			type: 'boolean',
			default: false
		},
		mediaBlock: {
			type: 'boolean',
			default: false
		}
	},
	edit: ({ attributes, setAttributes, clientId }) => {
		const {
			evtBlockId,
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
			if (!evtBlockId) {
				const uniqueId = clientId.substring(0, 8);
				setAttributes({ evtBlockId: uniqueId });
			}
		}, []);

		// Inject CSS in editor (only for event item's own styles)
		useEffect(() => {
			if (!evtBlockId) return;

			// Remove existing style tag
			const existingStyle = document.getElementById(`evt-block-style-${evtBlockId}`);
			if (existingStyle) {
				existingStyle.remove();
			}

			// Create new style tag - only for event details background
			const style = document.createElement('style');
			style.id = `evt-block-style-${evtBlockId}`;
			style.innerHTML = `
				.evt-block-${evtBlockId} .evt-event-details {
					background-color: ${detailsBackgroundColor};
				}
			`;
			document.head.appendChild(style);

			// Cleanup
			return () => {
				const styleToRemove = document.getElementById(`evt-block-style-${evtBlockId}`);
				if (styleToRemove) {
					styleToRemove.remove();
				}
			};
		}, [evtBlockId, detailsBackgroundColor]);

		// Get inner blocks reactively to check for image block
		const hasImageBlock = useSelect((select) => {
			const blocks = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];
			
			// Check for direct image block
			const directImage = blocks.find(block => block.name === 'core/image');
			if (directImage) return true;
			
			// Check inside group wrappers
			const imageGroup = blocks.find(block => 
				block.name === 'core/group' && 
				block.attributes?.className?.includes('evt-event-image-wrap')
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
					block.attributes?.className?.includes('evt-event-image-wrap')
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
					className: 'evt-event-image-wrap'
				}, [
					createBlock('core/image', {
						className: 'evt-event-image-block'
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
			className: `evt-event-item${evtBlockId ? ` evt-block-${evtBlockId}` : ''}`
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
			['core/group', { className: 'evt-event-image-wrap' }, [
				['core/image', {
				  url: eventImage,
				  alt: eventImageAlt,
				  className: 'evt-event-image-block'
				}]
			]],
		['core/group', { className: 'evt-card-details' }, [
			// DATE BADGE
			['evt/event-date-badge', {
				eventDate: eventDate,
				isDateSet: true
			}],
				
			// DETAILS GROUP
			['core/group', { className: 'evt-event-detail' }, [
			
				['core/paragraph', {
				className: 'evt-event-time',
				content: formattedTime,
				evtStartTime: eventStartTime,
				evtEndTime: eventEndTime,
				evtIsTimeSet: true
				}],
				
				['core/heading', {
				level: 4,
				className: 'evt-event-title',
				content: defaultContent?.title || ''
				}],
			
				['core/paragraph', {
				placeholder: __('Event Description', 'events'),
				className: 'evt-event-description'
				}],
			
				['core/paragraph', {
				className: 'evt-event-location',
				content: defaultContent?.location || ''
				}],
				
					// PRICE + READ MORE GROUP
					['core/group', { className: 'evt-price-read-more' }, [
				
					['core/paragraph', {
						className: 'evt-event-price',
						content: defaultContent?.price || ''
					}],
				
					['core/buttons', {}, [
						['core/button', {
						text: 'Read More',
						className: 'evt-event-read-more',
						url: ''
						}]
					]]
					]]
				]]
			]]
		] : [
			// IMAGE GROUP for new events
			['core/group', { className: 'evt-event-image-wrap' }, [
				['core/image', {
					className: 'evt-event-image-block'
				}]
			]],
		['core/group', { className: 'evt-card-details' }, [
			// Empty template with only placeholders for new events
			['evt/event-date-badge', {
				eventDate: eventDate,
				isDateSet: false
			}],
			// DETAILS GROUP
			['core/group', { className: 'evt-event-detail' }, [
				['core/paragraph', {
					placeholder: __('9:00 AM – 5:00 PM', 'events'),
					className: 'evt-event-time',
					evtStartTime: eventStartTime,
					evtEndTime: eventEndTime,
					evtIsTimeSet: false
				}],
					['core/heading', {
						level: 4,
						placeholder: __('Event Title', 'events'),
						className: 'evt-event-title'
					}],
					['core/paragraph', {
						placeholder: __('Event Description', 'events'),
						className: 'evt-event-description'
					}],
					['core/paragraph', {
						placeholder: __('Event Location', 'events'),
						className: 'evt-event-location'
					}],
					// PRICE + READ MORE GROUP
					['core/group', { className: 'evt-price-read-more' }, [
						['core/paragraph', {
							placeholder: __('Event Price', 'events'),
							className: 'evt-event-price'
						}],
						['core/buttons', {}, [
							['core/button', {
								text: __('Read More', 'events'),
								className: 'evt-event-read-more',
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
					<div className="evt-event-card">
						{/* Add/Remove Image Block Button - Simple logic */}
						{!hasImageBlock && (
							<div className="evt-add-image-block">
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
							<div className="evt-add-image-block">
								<Button 
									isSmall 
									isSecondary 
									onClick={() => innerBlockTemplate(false)}
								>
									{__('Remove Image Block', 'events')}
								</Button>
							</div>
						)}
						<div className="evt-event-details">
							{/* Content Blocks - Inside details-inner (image block will be filtered via CSS) */}
							<div className="evt-event-details-inner">
								<InnerBlocks
									template={TEMPLATE}
									templateLock={false}
									allowedBlocks={[
										'core/group',
										'core/image',
										'evt/event-date-badge',
										'core/heading',
										'core/paragraph',
										'core/list',
										'core/buttons',
										'core/button'
									]}
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
			evtBlockId
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `evt-event-item${evtBlockId ? ` evt-block-${evtBlockId}` : ''}`
		});

		return (
			<div {...blockProps}>
				<div className="evt-event-card">
					<div className="evt-event-details">
						{/* Content - Inside details-inner */}
						<div className="evt-event-details-inner">
							{/* All content blocks including date badge */}
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		);
	}
});

// EXTEND CORE/PARAGRAPH BLOCK FOR TIME SETTINGS
// Add custom attributes to core/paragraph block
addFilter(
	'blocks.registerBlockType',
	'evt/paragraph-time-attributes',
	(settings, name) => {
		if (name !== 'core/paragraph') {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				evtStartTime: {
					type: 'string',
					default: '09:00'
				},
				evtEndTime: {
					type: 'string',
					default: '17:00'
				},
				evtIsTimeSet: {
					type: 'boolean',
					default: false
				}
			}
		};
	}
);

// Add Time Settings panel to paragraph block with evt-event-time class
const withTimeSettings = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes, name } = props;
		
		// Only apply to core/paragraph with evt-event-time class
		if (name !== 'core/paragraph' || !attributes.className || !attributes.className.includes('evt-event-time')) {
			return createElement(BlockEdit, props);
		}

		const { evtStartTime, evtEndTime, evtIsTimeSet } = attributes;

		// Get parent Event Item context
		const parentContext = useSelect((select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(props.clientId);
			
			// Find evt/event-item parent
			for (let parentId of parentIds) {
				const parentBlock = getBlock(parentId);
				if (parentBlock && parentBlock.name === 'evt/event-item') {
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
		const currentStartTime = parentContext?.startTime || evtStartTime;
		const currentEndTime = parentContext?.endTime || evtEndTime;

		// Handle time changes
		const handleStartTimeChange = (newTime) => {
			setAttributes({ 
				evtStartTime: newTime,
				evtIsTimeSet: true
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
				evtEndTime: newTime,
				evtIsTimeSet: true
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
			if (parentContext && evtIsTimeSet) {
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
						className: 'evt-time-settings'
					},
					createElement(
						'div',
						{ className: 'evt-start-time-input' },
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
						{ className: 'evt-end-time-input' },
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
	'evt/paragraph-time-settings',
	withTimeSettings
);
