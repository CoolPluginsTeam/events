import { InspectorControls, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, PanelRow, DateTimePicker } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';
import { dateI18n } from '@wordpress/date';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes, context, clientId }) {
    const {
        evtBadgeId,
        eventDate,
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
}
