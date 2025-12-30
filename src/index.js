import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, DateTimePicker, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n, format, getSettings } from '@wordpress/date';
import { useEffect } from '@wordpress/element';

// Get current date formatted
const getCurrentDate = () => {
	const now = new Date();
	return dateI18n('Y-m-d', now);
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
							['evt/event-item', {}],
							['evt/event-item', {}],
							['evt/event-item', {}]
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
			borderBadgeColor
		} = attributes;

		// Get default image if no image set
		useEffect(() => {
			if (!eventImage && window.evtPluginData && window.evtPluginData.images) {
				const images = Object.values(window.evtPluginData.images);
				if (images.length > 0) {
					const randomImage = images[Math.floor(Math.random() * images.length)];
					setAttributes({ eventImage: randomImage });
				}
			}
		}, []);

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

		// Default blocks template
		const TEMPLATE = [
			['core/heading', {
				level: 4,
				placeholder: __('Event Title', 'events'),
				className: 'evt-event-title',
				content: __('Event Title', 'events')
			}],
			['core/paragraph', {
				placeholder: __('Event Description', 'events'),
				className: 'evt-event-description',
				content: __('Add your event description here...', 'events')
			}],
			['core/paragraph', {
				placeholder: __('Event Time', 'events'),
				className: 'evt-event-time',
				content: __('9:00 AM - 5:00 PM', 'events')
			}],
			['core/paragraph', {
				placeholder: __('Event Location', 'events'),
				className: 'evt-event-location',
				content: __('Event Location', 'events')
			}],
			['core/paragraph', {
				placeholder: __('Event Price', 'events'),
				className: 'evt-event-price',
				content: __('$25.00', 'events')
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

					<PanelBody title={__('Event Image', 'events')} initialOpen={false}>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({
										eventImage: media.url,
										eventImageAlt: media.alt || media.title
									});
								}}
								allowedTypes={['image']}
								value={eventImage}
								render={({ open }) => (
									<div>
										{eventImage ? (
											<>
												<img
													src={eventImage}
													alt={eventImageAlt}
													style={{ width: '100%', marginBottom: '10px' }}
												/>
												<Button isSecondary onClick={open} style={{ marginRight: '10px' }}>
													{__('Change Image', 'events')}
												</Button>
												<Button
													isDestructive
													onClick={() => setAttributes({ eventImage: '', eventImageAlt: '' })}
												>
													{__('Remove', 'events')}
												</Button>
											</>
										) : (
											<Button isPrimary onClick={open}>
												{__('Upload Image', 'events')}
											</Button>
										)}
									</div>
								)}
							/>
						</MediaUploadCheck>
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
						{eventImage && (
							<div className="evt-event-image">
								<img src={eventImage} alt={eventImageAlt} />
							</div>
						)}
						<div className="evt-event-details" style={{ backgroundColor: detailsBackgroundColor }}>
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
							<div className="evt-event-details-inner">
								<InnerBlocks
									template={TEMPLATE}
									templateLock={false}
									allowedBlocks={[
										'core/heading',
										'core/paragraph',
										'core/list',
										'core/buttons',
										'core/button',
										'core/image'
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
			borderBadgeColor
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
					{eventImage && (
						<div className="evt-event-image">
							<img src={eventImage} alt={eventImageAlt} />
						</div>
					)}
					<div className="evt-event-details" style={{ backgroundColor: detailsBackgroundColor }}>
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
						<div className="evt-event-details-inner">
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		);
	}
});
