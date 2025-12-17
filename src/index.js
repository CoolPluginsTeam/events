import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, DateTimePicker } from '@wordpress/components';
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
            eventPrice,
            eventDay,
            eventImageURL,
            eventImageID,
            eventImageAlt
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
                                {__('Event Date & Time', 'event')}
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

                        <TextControl
                            label={__('Price', 'event')}
                            value={eventPrice}
                            onChange={(value) => setAttributes({ eventPrice: value })}
                            placeholder="$25.00"
                        />

                        <TextControl
                            label={__('Day Label', 'event')}
                            value={eventDay || dateParts.dayName}
                            onChange={(value) => setAttributes({ eventDay: value })}
                            help={__('e.g., MON, TUE, FRI', 'event')}
                        />
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
                            <div className="evt-event-details">
                                    <div className="evt-event-date-badge-container">
                                            {/* Date Badge Overlay */}
                                            {eventDate && (
                                                <>
                                                <div className="evt-border-badge">
                                                    <div className="evt-event-date-badge">
                                                        <span className="evt-date-day">{dateParts.day}</span>
                                                        <span className="evt-date-month">{dateParts.month}</span>
                                                    </div>
                                                </div>
                                                <span className="evt-date-weekday">{eventDay || dateParts.dayName}</span>
                                                </>
                                            )}
                                    </div>
                                <div className="evt-event-details-inner">
                                            <RichText
                                                tagName="h3"
                                                className="evt-event-title"
                                                value={eventTitle}
                                                onChange={(value) => setAttributes({ eventTitle: value })}
                                                placeholder={__('Event Title', 'event')}
                                            />

                                            {eventDate && (
                                                <div className="evt-event-time">
                                                    <span className="evt-time-icon">🕐</span>
                                                    <span>{dateParts.time}</span>
                                                </div>
                                            )}

                                            <RichText
                                                tagName="div"
                                                className="evt-event-location"
                                                value={eventLocation}
                                                onChange={(value) => setAttributes({ eventLocation: value })}
                                                placeholder={__('Event Location', 'event')}
                                            />

                                            {eventPrice && (
                                                <div className="evt-event-price">
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
            eventPrice,
            eventDay,
            eventImageURL,
            eventImageAlt
        } = attributes;

        // Get formatted date parts
        const getDateParts = (dateString) => {
            if (!dateString) return { month: '', day: '', time: '', dayName: '' };
            
            try {
                return {
                    month: dateI18n('M', dateString),
                    day: dateI18n('d', dateString), // 'd' for leading zero (01-31)
                    time: dateI18n('g:i a', dateString) + ' - ' + dateI18n('g:i a', new Date(new Date(dateString).getTime() + 2 * 60 * 60 * 1000).toISOString()),
                    dayName: dateI18n('D', dateString).toUpperCase()
                };
            } catch (e) {
                return { month: '', day: '', time: '', dayName: '' };
            }
        };

        const dateParts = getDateParts(eventDate);

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
                    <div className="evt-event-details">
                        <div className="evt-event-date-badge-container">
                            {/* Date Badge Overlay */}
                            {eventDate && (
                                     <>
                                     <div className="evt-border-badge">
                                        <div className="evt-event-date-badge">
                                            <span className="evt-date-day">{dateParts.day}</span>
                                            <span className="evt-date-month">{dateParts.month}</span>
                                        </div>
                                    </div>
                                     <span className="evt-date-weekday">{eventDay || dateParts.dayName}</span>
                                     </>
                                )}
                        </div>
                        <div className="evt-event-details-inner">
                            {eventTitle && (
                                <RichText.Content
                                    tagName="h3"
                                    className="evt-event-title"
                                    value={eventTitle}
                                />
                            )}

                            {eventDate && (
                                <div className="evt-event-time">
                                    <span className="evt-time-icon">🕐</span>
                                    <span>{dateParts.time}</span>
                                </div>
                            )}

                            {eventLocation && (
                                <RichText.Content
                                    tagName="div"
                                    className="evt-event-location"
                                    value={eventLocation}
                                />
                            )}

                            {eventPrice && (
                                <div className="evt-event-price">
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
