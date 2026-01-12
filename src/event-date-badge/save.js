import { useBlockProps } from '@wordpress/block-editor';
import { dateI18n } from '@wordpress/date';

export default function save({ attributes }) {
    const {
        evtBadgeId,
        eventDate,
        hideYear
    } = attributes;

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
