import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, PanelRow, Button, DateTimePicker, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n } from '@wordpress/date';
import { useEffect } from '@wordpress/element';
import { dispatch, select, useSelect } from '@wordpress/data';

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
										eventDate: '2025-01-06',
										isDefault: true,
										hasImage: true
									}],
									['evt/event-item', {
										eventImage: defaultImages[1],
										eventImageAlt: 'Cute Girls Rock Band Performance',
										eventDate: '2025-04-04',
										isDefault: true,
										hasImage: true
									}],
									['evt/event-item', {
										eventImage: defaultImages[2],
										eventImageAlt: 'Free Food Distribution At Mumbai',
										eventDate: '2025-06-08',
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
		
		// Sync parent date to child attribute
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
			if (!dateString) return { day: '01', month: 'Jan', weekday: 'MON' };
			
			try {
				const date = new Date(dateString);
				return {
					day: dateI18n('d', date),
					month: dateI18n('M', date),
					weekday: dateI18n('D', date).toUpperCase()
				};
			} catch (e) {
				return { day: '01', month: 'Jan', weekday: 'MON' };
			}
		};

		const dateParts = parseDate(parentDate);

		// Handle date change - update both child and parent
		const handleDateChange = (newDate) => {
			// Update child attribute
			setAttributes({ eventDate: newDate });
			
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
					<PanelBody title={__('Date Badge Settings', 'events')}>
						<div style={{ marginBottom: '15px' }}>
							<strong>{__('Event Date', 'events')}</strong>
							<DateTimePicker
								currentDate={parentDate}
								onChange={handleDateChange}
								is12Hour={true}
							/>
						</div>
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
			eventDate
		} = attributes;

		const blockProps = useBlockProps.save({
			className: `evt-event-date-badge-container${evtBadgeId ? ` evt-badge-${evtBadgeId}` : ''}`
		});

		// Parse date for display
		const parseDate = (dateString) => {
			if (!dateString) return { day: '01', month: 'Jan', weekday: 'MON' };
			
			try {
				const date = new Date(dateString);
				return {
					day: dateI18n('d', date),
					month: dateI18n('M', date),
					weekday: dateI18n('D', date).toUpperCase()
				};
			} catch (e) {
				return { day: '01', month: 'Jan', weekday: 'MON' };
			}
		};

		const dateParts = parseDate(eventDate);

		return (
			<div {...blockProps}>
				<div className="evt-border-badge">
					<div className="evt-event-date-badge">
						<span className="evt-date-day">{dateParts.day}</span>
						<span className="evt-date-month">{dateParts.month}</span>
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
		'evt/eventDate': 'eventDate'
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
			detailsBackgroundColor,
			isDefault
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
		const { innerBlocks, hasImageBlock } = useSelect((select) => {
			const blocks = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];
			
			// Check for direct image block or image inside group wrapper
			let imageBlock = blocks.find(block => block.name === 'core/image');
			if (!imageBlock) {
				// Check inside group wrappers
				const imageGroup = blocks.find(block => 
					block.name === 'core/group' && 
					block.attributes?.className?.includes('evt-event-image-wrap')
				);
				if (imageGroup && imageGroup.innerBlocks) {
					imageBlock = imageGroup.innerBlocks.find(block => block.name === 'core/image');
				}
			}
			
			return {
				innerBlocks: blocks,
				hasImageBlock: !!imageBlock
			};
		}, [clientId]);
		
		// Find image block for URL extraction
		let imageBlock = innerBlocks.find(block => block.name === 'core/image');
		if (!imageBlock) {
			const imageGroup = innerBlocks.find(block => 
				block.name === 'core/group' && 
				block.attributes?.className?.includes('evt-event-image-wrap')
			);
			if (imageGroup && imageGroup.innerBlocks) {
				imageBlock = imageGroup.innerBlocks.find(block => block.name === 'core/image');
			}
		}
		
		// Sync image block URL to attributes when it changes
		useEffect(() => {
			if (imageBlock?.attributes?.url && imageBlock.attributes.url !== eventImage) {
				setAttributes({
					eventImage: imageBlock.attributes.url,
					eventImageAlt: imageBlock.attributes.alt || eventImageAlt
				});
			}
		}, [imageBlock?.attributes?.url, imageBlock?.attributes?.alt]);

		// Inner Block Template Handler (Timeline style) - Add/Remove image block
		const innerBlockTemplate = (shouldAddImage) => {
			const prevInnerBlock = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];
			
			// Find image group wrapper (evt-event-image-wrap)
			const imageGroupIndex = prevInnerBlock.findIndex(block => 
				block.name === 'core/group' && 
				block.attributes?.className?.includes('evt-event-image-wrap')
			);
			
			// Also check for direct image blocks (for new events)
			const directImageIndex = prevInnerBlock.findIndex(block => block.name === 'core/image');

			// Remove image block/group if shouldAddImage is false
			if (!shouldAddImage) {
				if (imageGroupIndex !== -1) {
					// Remove the entire image wrapper group
					dispatch('core/block-editor').removeBlock(prevInnerBlock[imageGroupIndex].clientId, true);
					setAttributes({ mediaBlock: false, eventImage: '', eventImageAlt: '', hasImage: false });
				} else if (directImageIndex !== -1) {
					// Remove direct image block
					dispatch('core/block-editor').removeBlock(prevInnerBlock[directImageIndex].clientId, true);
					setAttributes({ mediaBlock: false, eventImage: '', eventImageAlt: '', hasImage: false });
				}
			}
			// Add image block if shouldAddImage is true and no image exists
			else if (shouldAddImage && imageGroupIndex === -1 && directImageIndex === -1) {
				const insertedBlock = createBlock('core/group', {
					className: 'evt-event-image-wrap'
				}, [
					createBlock('core/image', {
						url: eventImage || '',
						alt: eventImageAlt || '',
						className: 'evt-event-image-block'
					})
				]);
				dispatch('core/block-editor').insertBlocks(insertedBlock, 0, clientId);
				setAttributes({ mediaBlock: true, hasImage: true });
				
				// Auto-select the image block after adding
				setTimeout(() => {
					const addedGroup = select('core/block-editor').getBlock(clientId)?.innerBlocks[0];
					if (addedGroup && addedGroup.innerBlocks && addedGroup.innerBlocks[0]) {
						dispatch('core/block-editor').selectBlock(addedGroup.innerBlocks[0].clientId);
					}
				}, 50);
			}
		};

		const blockProps = useBlockProps({
			className: `evt-event-item${evtBlockId ? ` evt-block-${evtBlockId}` : ''}`
		});

		// Parse date for display
		const parseDate = (dateString) => {
			if (!dateString) return { day: '01', month: 'Jan', weekday: 'MON' };
			
			try {
				const date = new Date(dateString);
				return {
					day: dateI18n('d', date),
					month: dateI18n('M', date),
					weekday: dateI18n('D', date).toUpperCase()
				};
			} catch (e) {
				return { day: '01', month: 'Jan', weekday: 'MON' };
			}
		};

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
					eventDate: eventDate
				}],
				
				// DETAILS GROUP
				['core/group', { className: 'evt-event-detail' }, [
				
					['core/paragraph', {
					className: 'evt-event-time',
					content: defaultContent?.time || ''
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
						url: '#'
						}]
					]]
					]]
				]]
			]]
		] : [
			['core/group', { className: 'evt-card-details' }, [
				// Empty template with only placeholders for new events
				['evt/event-date-badge', {
					eventDate: eventDate
				}],
				// DETAILS GROUP
				['core/group', { className: 'evt-event-detail' }, [
					['core/paragraph', {
						placeholder: __('9:00 AM - 5:00 PM', 'events'),
						className: 'evt-event-time'
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
								backgroundColor: 'vivid-cyan-blue',
								url: '#'
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
