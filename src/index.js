import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, DateTimePicker, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n, format, getSettings } from '@wordpress/date';

// Icon for the blocks
const eventIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19.5,19c0,0.3-0.2,0.5-0.5,0.5H5 c-0.3,0-0.5-0.2-0.5-0.5V7h15V19z M17,13h-4v4h4V13z" />
    </svg>
);

// ============================================
// PARENT BLOCK: Events Grid Container
// ============================================
registerBlockType('evt/events-grid', {
    title: __('Events Grid', 'event'),
    description: __('Display multiple events in a modern grid layout', 'event'),
    icon: eventIcon,
    category: 'widgets',
    supports: {
        align: ['wide', 'full'],
        html: false,
    },
    
    attributes: {
        columns: {
            type: 'number',
            default: 3
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            className: 'evt-events-grid-container'
        });

        const ALLOWED_BLOCKS = ['evt/event-item'];
        
        // Template with 3 default events
        const TEMPLATE = [
            ['evt/event-item', {
                eventTitle: 'Crazy DJ Experience Santa Cruz',
                eventLocation: 'JW Marriott, Sector 35',
                eventDate: '2024-06-06T16:00:00',
                eventPrice: '$25.00',
                eventDay: 'FRI',
                eventImageURL: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
            }],
            ['evt/event-item', {
                eventTitle: 'Cute Girls Rock Band Performance',
                eventLocation: 'Club XYZ, Sector 17',
                eventDate: '2024-10-02T18:30:00',
                eventPrice: '$20.00',
                eventDay: 'THU',
                eventImageURL: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800'
            }],
            ['evt/event-item', {
                eventTitle: 'Free Food Distribution At Mumbai',
                eventLocation: 'Food Corp. Mumbai, Ft. Line',
                eventDate: '2024-11-03T19:00:00',
                eventPrice: '$15.00',
                eventDay: 'MON',
                eventImageURL: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
            }]
        ];

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Grid Settings', 'event')}>
                        <TextControl
                            label={__('Columns', 'event')}
                            type="number"
                            value={attributes.columns}
                            onChange={(value) => setAttributes({ columns: parseInt(value) })}
                            min={1}
                            max={4}
                            help={__('Number of columns in the grid (1-4)', 'event')}
                            __nextHasNoMarginBottom={true}
                            __next40pxDefaultSize={true}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps} style={{ '--columns': attributes.columns }}>
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                    />
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({
            className: 'evt-events-grid-container',
            style: { '--columns': attributes.columns }
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    }
});

// ============================================
// CHILD BLOCK: Individual Event Item
// ============================================
registerBlockType('evt/event-item', {
    title: __('Event Item', 'event'),
    description: __('Single event card with image, date, and details', 'event'),
    icon: eventIcon,
    category: 'widgets',
    parent: ['evt/events-grid'], // Can only be added inside events-grid
    
    supports: {
        reusable: false,
        html: false,
    },

    attributes: {
        eventTitle: {
            type: 'string',
            default: ''
        },
        eventLocation: {
            type: 'string',
            default: ''
        },
        eventDate: {
            type: 'string',
            default: ''
        },
        eventEndDate: {
            type: 'string',
            default: ''
        },
        eventPrice: {
            type: 'string',
            default: ''
        },
        eventDay: {
            type: 'string',
            default: ''
        },
        eventImageURL: {
            type: 'string',
            default: ''
        },
        eventImageID: {
            type: 'number'
        },
        eventImageAlt: {
            type: 'string',
            default: ''
        },
        // Color Settings
        detailsBackgroundColor: {
            type: 'string',
            default: '#ffffff'
        },
        borderBadgeColor: {
            type: 'string',
            default: '#00000040'
        },
        dateBadgeBackgroundColor: {
            type: 'string',
            default: '#2667FF'
        },
        dateBadgeTextColor: {
            type: 'string',
            default: '#ffffff'
        },
        weekdayTextColor: {
            type: 'string',
            default: '#000000'
        },
        detailsTextColor: {
            type: 'string',
            default: '#1a1a1a'
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            className: 'evt-event-item'
        });

        const {
            eventTitle,
            eventLocation,
            eventDate,
            eventEndDate,
            eventPrice,
            eventDay,
            eventImageURL,
            eventImageID,
            eventImageAlt,
            detailsBackgroundColor,
            borderBadgeColor,
            dateBadgeBackgroundColor,
            dateBadgeTextColor,
            weekdayTextColor,
            detailsTextColor
        } = attributes;

        // Get formatted date parts
        const getDateParts = (dateString) => {
            if (!dateString) return { month: '', day: '', time: '', dayName: '' };
            
            try {
                const date = new Date(dateString);
                return {
                    month: dateI18n('M', dateString),
                    day: dateI18n('d', dateString), // 'd' for leading zero (01-31)
                    time: dateI18n('g:i a', dateString),
                    dayName: dateI18n('D', dateString).toUpperCase()
                };
            } catch (e) {
                return { month: '', day: '', time: '', dayName: '' };
            }
        };

        const dateParts = getDateParts(eventDate);

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Event Details', 'event')}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                {__('Start Date & Time', 'event')}
                            </label>
                            <DateTimePicker
                                currentDate={eventDate || new Date().toISOString()}
                                onChange={(newDate) => {
                                    setAttributes({ eventDate: newDate });
                                    // Auto-update day name
                                    const dayName = dateI18n('D', newDate).toUpperCase();
                                    setAttributes({ eventDay: dayName });
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                {__('End Date & Time', 'event')}
                            </label>
                            <DateTimePicker
                                currentDate={eventEndDate || eventDate || new Date().toISOString()}
                                onChange={(newDate) => setAttributes({ eventEndDate: newDate })}
                            />
                        </div>

                        <TextControl
                            label={__('Price', 'event')}
                            value={eventPrice}
                            onChange={(value) => setAttributes({ eventPrice: value })}
                            placeholder="$25.00"
                            __nextHasNoMarginBottom={true}
                            __next40pxDefaultSize={true}
                        />

                        <TextControl
                            label={__('Day Label', 'event')}
                            value={eventDay || dateParts.dayName}
                            onChange={(value) => setAttributes({ eventDay: value })}
                            help={__('e.g., MON, TUE, FRI', 'event')}
                            __nextHasNoMarginBottom={true}
                            __next40pxDefaultSize={true}
                        />
                    </PanelBody>

                    <PanelBody title={__('Color Settings', 'event')} initialOpen={false}>
                        <PanelRow>
                            <div style={{ width: '100%' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Container Background Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={detailsBackgroundColor}
                                    onChange={(color) => setAttributes({ detailsBackgroundColor: color || '#ffffff' })}
                                />
                            </div>
                        </PanelRow>

                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Date Border Color', 'event')}
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
                                    {__('Date Background Color', 'event')}
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
                                    {__('Date Text Color', 'event')}
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
                                    {__('Weekday Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={weekdayTextColor}
                                    onChange={(color) => setAttributes({ weekdayTextColor: color || '#000000' })}
                                />
                            </div>
                        </PanelRow>

                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Details Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={detailsTextColor}
                                    onChange={(color) => setAttributes({ detailsTextColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    <PanelBody title={__('Image Settings', 'event')} initialOpen={false}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => {
                                    setAttributes({
                                        eventImageURL: media.url,
                                        eventImageID: media.id,
                                        eventImageAlt: media.alt
                                    });
                                }}
                                allowedTypes={['image']}
                                value={eventImageID}
                                render={({ open }) => (
                                    <Button
                                        onClick={open}
                                        variant="secondary"
                                        style={{ marginBottom: '10px', width: '100%' }}
                                    >
                                        {eventImageURL ? __('Change Image', 'event') : __('Upload Image', 'event')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>

                        {eventImageURL && (
                            <Button
                                onClick={() => setAttributes({
                                    eventImageURL: '',
                                    eventImageID: null,
                                    eventImageAlt: ''
                                })}
                                variant="secondary"
                                isDestructive
                                style={{ width: '100%' }}
                            >
                                {__('Remove Image', 'event')}
                            </Button>
                        )}
                    </PanelBody>
                </InspectorControls>

            
                    <div {...blockProps}>
                        {/* Event Card */}
                        <div className="evt-event-card">
                            {/* Event Image */}
                            <div className="evt-event-image">
                                {eventImageURL ? (
                                    <img src={eventImageURL} alt={eventImageAlt || eventTitle} />
                                ) : (
                                    <div className="evt-event-image-placeholder">
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={(media) => {
                                                    setAttributes({
                                                        eventImageURL: media.url,
                                                        eventImageID: media.id,
                                                        eventImageAlt: media.alt
                                                    });
                                                }}
                                                allowedTypes={['image']}
                                                value={eventImageID}
                                                render={({ open }) => (
                                                    <Button onClick={open} variant="primary">
                                                        {__('Add Image', 'event')}
                                                    </Button>
                                                )}
                                            />
                                        </MediaUploadCheck>
                                    </div>
                                )}
                            </div>

                            {/* Event Details */}
                            <div className="evt-event-details" style={{ backgroundColor: detailsBackgroundColor }}>
                                    <div className="evt-event-date-badge-container">
                                            {/* Date Badge Overlay */}
                                            {eventDate && (
                                                <>
                                                <div className="evt-border-badge" style={{ borderColor: borderBadgeColor }}>
                                                    <div className="evt-event-date-badge" style={{ backgroundColor: dateBadgeBackgroundColor, color: dateBadgeTextColor }}>
                                                        <span className="evt-date-day">{dateParts.day}</span>
                                                        <span className="evt-date-month">{dateParts.month}</span>
                                                    </div>
                                                </div>
                                                <span className="evt-date-weekday" style={{ color: weekdayTextColor }}>{eventDay || dateParts.dayName}</span>
                                                </>
                                            )}
                                    </div>
                                <div className="evt-event-details-inner">
                                            {eventDate && (
                                                <div className="evt-event-time" style={{ color: detailsTextColor }}>
                                                    <span className="evt-time-icon">🕐</span>
                                                    <span>
                                                        {dateParts.time}
                                                        {eventEndDate && ` - ${dateI18n('g:i a', eventEndDate)}`}
                                                    </span>
                                                </div>
                                            )}
                                            <RichText
                                                tagName="h4"
                                                className="evt-event-title"
                                                value={eventTitle}
                                                onChange={(value) => setAttributes({ eventTitle: value })}
                                                placeholder={__('Event Title', 'event')}
                                                style={{ color: detailsTextColor }}
                                            />

                                            <RichText
                                                tagName="div"
                                                className="evt-event-location"
                                                value={eventLocation}
                                                onChange={(value) => setAttributes({ eventLocation: value })}
                                                placeholder={__('Event Location', 'event')}
                                                style={{ color: detailsTextColor }}
                                            />

                                            {eventPrice && (
                                                <div className="evt-event-price" style={{ color: detailsTextColor }}>
                                                    {eventPrice}
                                                </div>
                                            )}
                                    </div>
                            </div>
                        </div>
                    </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({
            className: 'evt-event-item'
        });

        const {
            eventTitle,
            eventLocation,
            eventDate,
            eventEndDate,
            eventPrice,
            eventDay,
            eventImageURL,
            eventImageAlt,
            detailsBackgroundColor,
            borderBadgeColor,
            dateBadgeBackgroundColor,
            dateBadgeTextColor,
            weekdayTextColor,
            detailsTextColor
        } = attributes;

        // Get formatted date parts
        const getDateParts = (dateString) => {
            if (!dateString) return { month: '', day: '', time: '', dayName: '' };
            
            try {
                return {
                    month: dateI18n('M', dateString),
                    day: dateI18n('d', dateString), // 'd' for leading zero (01-31)
                    time: dateI18n('g:i a', dateString),
                    dayName: dateI18n('D', dateString).toUpperCase()
                };
            } catch (e) {
                return { month: '', day: '', time: '', dayName: '' };
            }
        };

        const dateParts = getDateParts(eventDate);
        const endTime = eventEndDate ? dateI18n('g:i a', eventEndDate) : '';

        return (
            <div {...blockProps}>
                <div className="evt-event-card">
                    {/* Event Image */}
                    {eventImageURL && (
                        <div className="evt-event-image">
                            <img src={eventImageURL} alt={eventImageAlt || eventTitle} />
                        </div>
                    )}

                    {/* Event Details */}
                    <div className="evt-event-details" style={{ backgroundColor: detailsBackgroundColor }}>
                        <div className="evt-event-date-badge-container">
                            {/* Date Badge Overlay */}
                            {eventDate && (
                                     <>
                                     <div className="evt-border-badge" style={{ borderColor: borderBadgeColor }}>
                                        <div className="evt-event-date-badge" style={{ backgroundColor: dateBadgeBackgroundColor, color: dateBadgeTextColor }}>
                                            <span className="evt-date-day">{dateParts.day}</span>
                                            <span className="evt-date-month">{dateParts.month}</span>
                                        </div>
                                    </div>
                                     <span className="evt-date-weekday" style={{ color: weekdayTextColor }}>{eventDay || dateParts.dayName}</span>
                                     </>
                            )}
                        </div>
                        <div className="evt-event-details-inner">
                                    {eventDate && (
                                        <div className="evt-event-time" style={{ color: detailsTextColor }}>
                                            <span className="evt-time-icon">🕐</span>
                                            <span>
                                                {dateParts.time}
                                                {endTime && ` - ${endTime}`}
                                            </span>
                                        </div>
                                    )}

                            {eventTitle && (
                                <RichText.Content
                                    tagName="h4"
                                    className="evt-event-title"
                                    value={eventTitle}
                                    style={{ color: detailsTextColor }}
                                />
                            )}

                            {eventLocation && (
                                <RichText.Content
                                    tagName="div"
                                    className="evt-event-location"
                                    value={eventLocation}
                                    style={{ color: detailsTextColor }}
                                />
                            )}

                            {eventPrice && (
                                <div className="evt-event-price" style={{ color: detailsTextColor }}>
                                    {eventPrice}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
