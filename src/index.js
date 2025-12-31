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
			default: 3
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
							onChange={(value) => setAttributes({ columns: parseInt(value) || 3 })}
							min={1}
							max={6}
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
			className: 'evt-events-grid-container',
			style: { '--columns': columns }
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
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
		isDefault: {
			type: 'boolean',
			default: false
		},
		hasImage: {
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
			dateBadgeBackgroundColor,
			dateBadgeTextColor,
			borderBadgeColor,
			isDefault,
			hasImage
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

		// Image Add Handler (Timeline style) - Works for all events
		const addImageBlock = () => {
			// Create new WordPress image block
			const newImageBlock = createBlock('core/image', {
				className: 'evt-event-image-block'
			});
			
			// Insert at the beginning of InnerBlocks
			dispatch('core/block-editor').insertBlocks(newImageBlock, 0, clientId);
		};

		// Image Remove Handler - Works for all events
		const removeImageBlock = () => {
			if (imageBlock) {
				dispatch('core/block-editor').removeBlock(imageBlock.clientId);
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
		// Order: Image, Time, Title, Location, Price, Read More
		const TEMPLATE = isDefault && defaultContent ? [
			['core/image', {
				url: eventImage,
				alt: eventImageAlt,
				className: 'evt-event-image-block'
			}],
			['core/paragraph', {
				placeholder: __('Event Time', 'events'),
				className: 'evt-event-time',
				content: defaultContent.time
			}],
			['core/heading', {
				level: 4,
				placeholder: __('Event Title', 'events'),
				className: 'evt-event-title',
				content: defaultContent.title
			}],
			['core/paragraph', {
				placeholder: __('Event Description', 'events'),
				className: 'evt-event-description',
				content: defaultContent.description
			}],
			['core/paragraph', {
				placeholder: __('Event Location', 'events'),
				className: 'evt-event-location',
				content: defaultContent.location
			}],
			['core/paragraph', {
				placeholder: __('Event Price', 'events'),
				className: 'evt-event-price',
				content: defaultContent.price
			}],
			['core/buttons', {}, [
				['core/button', {
					text: __('Read More', 'events'),
					className: 'evt-event-read-more',
					backgroundColor: 'vivid-cyan-blue',
					url: '#'
				}]
			]]
		] : [
			// Empty template with only placeholders for new events
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
		];

		// Image Add/Remove Handler (Timeline style)
		const toggleImageBlock = (shouldAdd) => {
			setAttributes({ hasImage: shouldAdd });
			if (!shouldAdd) {
				setAttributes({ eventImage: '', eventImageAlt: '' });
			}
		};

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Event Settings', 'events')}>
						<div style={{ marginBottom: '15px' }}>
							<strong>{__('Event Date', 'events')}</strong>
							<DateTimePicker
								currentDate={eventDate}
								onChange={(date) => setAttributes({ eventDate: date })}
								is12Hour={true}
							/>
						</div>
					</PanelBody>

					<PanelBody title={__('Colors', 'events')} initialOpen={false}>
						<p><strong>{__('Details Background', 'events')}</strong></p>
						<input
							type="color"
							value={detailsBackgroundColor}
							onChange={(e) => setAttributes({ detailsBackgroundColor: e.target.value })}
							style={{ width: '100%', height: '40px', marginBottom: '10px' }}
						/>

						<p><strong>{__('Date Badge Background', 'events')}</strong></p>
						<input
							type="color"
							value={dateBadgeBackgroundColor}
							onChange={(e) => setAttributes({ dateBadgeBackgroundColor: e.target.value })}
							style={{ width: '100%', height: '40px', marginBottom: '10px' }}
						/>

						<p><strong>{__('Date Badge Text', 'events')}</strong></p>
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
					<div className="evt-event-card">
						{/* Add/Remove Image Block Button - Works for all events */}
						<div style={{ 
							padding: '10px', 
							background: '#fff',
							borderBottom: '1px solid #ddd'
						}}>
							{hasImageBlock ? (
								<Button 
									isSmall 
									isSecondary 
									onClick={removeImageBlock}
								>
									{__('Remove Image Block', 'events')}
								</Button>
							) : (
								<Button 
									isSmall 
									isSecondary 
									onClick={addImageBlock}
								>
									{__('Add Image Block', 'events')}
								</Button>
							)}
						</div>
						
						{/* Image Rendered Directly - Outside details */}
						{currentImageUrl && (
							<div className="evt-event-image">
								<img src={currentImageUrl} alt={currentImageAlt} />
							</div>
						)}
						
						<div className="evt-event-details" style={{ backgroundColor: detailsBackgroundColor }}>
							{/* Date Badge - Inside details, outside inner */}
							<div className="evt-event-date-badge-container">
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
							
							{/* Content Blocks - Inside details-inner (image block will be filtered via CSS) */}
							<div className="evt-event-details-inner">
								<InnerBlocks
									template={TEMPLATE}
									templateLock={false}
									allowedBlocks={[
										'core/image',
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
			eventImage,
			eventImageAlt,
			eventDate,
			detailsBackgroundColor,
			dateBadgeBackgroundColor,
			dateBadgeTextColor,
			borderBadgeColor,
			isDefault
		} = attributes;

		const blockProps = useBlockProps.save({
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

		return (
			<div {...blockProps}>
				<div className="evt-event-card">
					{/* Image - Outside details */}
					{eventImage && (
						<div className="evt-event-image">
							<img src={eventImage} alt={eventImageAlt} />
						</div>
					)}
					
					<div className="evt-event-details" style={{ backgroundColor: detailsBackgroundColor }}>
						{/* Date Badge - Inside details, outside inner */}
						<div className="evt-event-date-badge-container">
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
						
						{/* Content - Inside details-inner */}
						<div className="evt-event-details-inner">
							{/* All content blocks (image will be filtered via PHP) */}
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		);
	}
});
