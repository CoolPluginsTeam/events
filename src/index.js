import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, DateTimePicker, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n, format, getSettings } from '@wordpress/date';
import { useEffect } from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';

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
	title: __('Events Grid', 'events'),
	icon: 'calendar-alt',
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
			style: { '--columns': columns }
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
						allowedBlocks={['evt/event-item', 'core/group']}
						template={[
							[
								'core/group',
								{
									className: 'evt-events-grid-cards' // 👈 tumhari custom class
								},
								[
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
								]
							]
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
	title: __('Event Date Badge', 'events'),
	icon: 'calendar',
	category: 'widgets',
	parent: ['evt/event-item'],
	usesContext: ['evt/eventDate'],
	attributes: {
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
		}
	},
	edit: ({ attributes, setAttributes, context }) => {
		const {
			eventDate,
			dateBadgeBackgroundColor,
			dateBadgeTextColor,
			borderBadgeColor
		} = attributes;

		// Use parent's date if available
		const parentDate = context['evt/eventDate'] || eventDate;
		
		// Sync parent date to child attribute
		useEffect(() => {
			if (context['evt/eventDate'] && context['evt/eventDate'] !== eventDate) {
				setAttributes({ eventDate: context['evt/eventDate'] });
			}
		}, [context['evt/eventDate']]);

		const blockProps = useBlockProps({
			className: 'evt-event-date-badge-container'
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

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Date Badge Settings', 'events')}>
						<div style={{ marginBottom: '15px' }}>
							<strong>{__('Event Date', 'events')}</strong>
							<DateTimePicker
								currentDate={parentDate}
								onChange={(date) => setAttributes({ eventDate: date })}
								is12Hour={true}
							/>
						</div>
					</PanelBody>

					<PanelBody title={__('Badge Colors', 'events')} initialOpen={false}>
						<p><strong>{__('Badge Background', 'events')}</strong></p>
						<input
							type="color"
							value={dateBadgeBackgroundColor}
							onChange={(e) => setAttributes({ dateBadgeBackgroundColor: e.target.value })}
							style={{ width: '100%', height: '40px', marginBottom: '10px' }}
						/>

						<p><strong>{__('Badge Text', 'events')}</strong></p>
						<input
							type="color"
							value={dateBadgeTextColor}
							onChange={(e) => setAttributes({ dateBadgeTextColor: e.target.value })}
							style={{ width: '100%', height: '40px', marginBottom: '10px' }}
						/>

						<p><strong>{__('Border Color', 'events')}</strong></p>
						<input
							type="color"
							value={borderBadgeColor}
							onChange={(e) => setAttributes({ borderBadgeColor: e.target.value })}
							style={{ width: '100%', height: '40px', marginBottom: '10px' }}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="evt-border-badge" style={{ borderColor: borderBadgeColor }}>
						<div
							className="evt-event-date-badge"
							style={{
								backgroundColor: dateBadgeBackgroundColor,
								color: dateBadgeTextColor
							}}
						>
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
			eventDate,
			dateBadgeBackgroundColor,
			dateBadgeTextColor,
			borderBadgeColor
		} = attributes;

		const blockProps = useBlockProps.save({
			className: 'evt-event-date-badge-container'
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
				<div className="evt-border-badge" style={{ borderColor: borderBadgeColor }}>
					<div
						className="evt-event-date-badge"
						style={{
							backgroundColor: dateBadgeBackgroundColor,
							color: dateBadgeTextColor
						}}
					>
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
			eventImage,
			eventImageAlt,
			eventDate,
			detailsBackgroundColor,
			isDefault,
			hasImage,
			mediaBlock
		} = attributes;

		// Get inner blocks to check for image block
		const innerBlocks = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];
		const imageBlock = innerBlocks.find(block => block.name === 'core/image');
		const hasImageBlock = !!imageBlock;
		
		// Get image URL from block or attributes
		const currentImageUrl = imageBlock?.attributes?.url || eventImage || '';
		const currentImageAlt = imageBlock?.attributes?.alt || eventImageAlt || '';
		
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
			const prevBlocksName = prevInnerBlock.map(block => block.name);
			const prevMediaBlock = prevInnerBlock.filter(block => block.name === 'core/image');
			const mediaIndex = prevBlocksName.indexOf('core/image');

			// Remove image block if shouldAddImage is false
			if (prevMediaBlock.length > 0 && !shouldAddImage) {
				dispatch('core/block-editor').removeBlock(prevInnerBlock[mediaIndex].clientId, true);
				setAttributes({ mediaBlock: false, eventImage: '', eventImageAlt: '' });
			}
			// Add image block if shouldAddImage is true and no image block exists
			else if (shouldAddImage && prevBlocksName.length > 0 && !prevBlocksName.includes('core/image')) {
				const insertedBlock = createBlock('core/image', {
					url: eventImage || '',
					alt: eventImageAlt || '',
					className: 'evt-event-image-block'
				});
				dispatch('core/block-editor').insertBlocks(insertedBlock, 0, clientId);
				setAttributes({ mediaBlock: true });
				
				// Auto-select the image block after adding (Timeline style)
				setTimeout(() => {
					const addedImageBlock = select('core/block-editor').getBlock(clientId)?.innerBlocks[0];
					if (addedImageBlock && addedImageBlock.name === 'core/image') {
						dispatch('core/block-editor').selectBlock(addedImageBlock.clientId);
					}
				}, 50);
			}
		};

		const blockProps = useBlockProps({
			className: 'evt-event-item'
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
				price: '$15.00'
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
						<p><strong>{__('Details Background', 'events')}</strong></p>
						<input
							type="color"
							value={detailsBackgroundColor}
							onChange={(e) => setAttributes({ detailsBackgroundColor: e.target.value })}
							style={{ width: '100%', height: '40px', marginBottom: '10px' }}
						/>
					</PanelBody>
				</InspectorControls>

				<div {...blockProps}>
					<div className="evt-event-card">
						{/* Add/Remove Image Block Button - Timeline style */}
						<div className="evt-add-image-block">
							{hasImageBlock ? (
								<Button 
									isSmall 
									isSecondary 
									onClick={() => innerBlockTemplate(false)}
								>
									{__('Remove Image Block', 'events')}
								</Button>
							) : (
								<Button 
									isSmall 
									isSecondary 
									onClick={() => innerBlockTemplate(true)}
								>
									{__('Add Image Block', 'events')}
								</Button>
							)}
						</div>
						
						{/* Image Rendered Directly - Outside details */}
						{/* {currentImageUrl && (
							<div className="evt-event-image">
								<img src={currentImageUrl} alt={currentImageAlt} />
							</div>
						)}
						 */}
						<div className="evt-event-details" style={{ backgroundColor: detailsBackgroundColor }}>
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
			detailsBackgroundColor
		} = attributes;

		const blockProps = useBlockProps.save({
			className: 'evt-event-item'
		});

		return (
			<div {...blockProps}>
				<div className="evt-event-card">
					{/* Image - Outside details */}
					{/* {eventImage && (
						<div className="evt-event-image">
							<img src={eventImage} alt={eventImageAlt} />
						</div>
					)} */}
					
					<div className="evt-event-details" style={{ backgroundColor: detailsBackgroundColor }}>
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
