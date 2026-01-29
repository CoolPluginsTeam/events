/**
 * Event Date Badge Block (Child Block)
 * WordPress Block Standard: Import metadata from block.json
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, PanelRow, DateTimePicker, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n } from '@wordpress/date';
import { useEffect } from '@wordpress/element';
import { dispatch, useSelect } from '@wordpress/data';
import { getCurrentDate } from '../shared/helpers';
import metadata from '../../blocks/event-date-badge/block.json';

// Register Event Date Badge Block using block.json metadata
registerBlockType(metadata.name, {
	title: __('Event Date Badge', 'events-block'),
	edit: ({ attributes, setAttributes, context, clientId }) => {
		const {
			evtbBadgeId,
			eventDate,
			isDateSet,
			dateBadgeBackgroundColor,
			dateBadgeTextColor,
			borderBadgeColor,
			weekdayColor,
			hideYear
		} = attributes;

		// Generate unique badge ID if not present
		useEffect(() => {
			if (!evtbBadgeId) {
				const uniqueId = clientId.substring(0, 8);
				setAttributes({ evtbBadgeId: uniqueId });
			}
		}, []);

		// Set current date if eventDate is empty (for new date badges)
		useEffect(() => {
			if (!eventDate && !context['evtb/eventDate']) {
				setAttributes({ eventDate: getCurrentDate() });
			}
		}, []);

		// Use parent's date if available
		const parentDate = context['evtb/eventDate'] || eventDate || getCurrentDate();

		// Get parent block ID
		const parentClientId = useSelect((select) => {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(clientId);
			// Find the evtb/event-item parent
			for (let parentId of parentIds) {
				const parentBlock = getBlock(parentId);
				if (parentBlock && parentBlock.name === 'evtb/event-item') {
					return parentId;
				}
			}
			return null;
		}, [clientId]);

		// Sync parent values to child attributes
		useEffect(() => {
			if (context['evtb/eventDate'] && context['evtb/eventDate'] !== eventDate) {
				setAttributes({ eventDate: context['evtb/eventDate'] });
			}
		}, [context['evtb/eventDate']]);

		// Sync hideYear from global context
		useEffect(() => {
			if (context['evtb/hideYear'] !== undefined && context['evtb/hideYear'] !== hideYear) {
				setAttributes({ hideYear: context['evtb/hideYear'] });
			}
		}, [context['evtb/hideYear']]);

		// Use CSS Variables (Custom Properties) - Most reliable approach!
		// Set colors as CSS variables on the wrapper element
		const blockProps = useBlockProps({
			className: `evtb-event-date-badge-container${evtbBadgeId ? ` evtb-badge-${evtbBadgeId}` : ''}`,
			style: {
				'--evtb-badge-bg': dateBadgeBackgroundColor,
				'--evtb-badge-text': dateBadgeTextColor,
				'--evtb-badge-border': borderBadgeColor,
				'--evtb-badge-weekday': weekdayColor
			}
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
					<PanelBody className="evtb-date-settings" title={__('Date Settings', 'events')}>
						<div style={{ marginBottom: '15px' }}>
							<strong>{__('Event Date', 'events')}</strong>
							<div style={{ margin: '10px 0' }}>
								<ToggleControl
									label={__('Hide Year', 'events')}
									checked={hideYear}
									onChange={(value) => setAttributes({ hideYear: value })}
									help={__('Toggle to hide or show the year in the date badge', 'events')}
									__nextHasNoMarginBottom={true}
								/>
							</div>
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
					<div className="evtb-border-badge">
						<div className="evtb-event-date-badge">
							<span className="evtb-date-day">{dateParts.day}</span>
							<span className="evtb-date-month">{dateParts.month}</span>
							{!hideYear && dateParts.year !== '0001' && (
								<span className="evtb-date-year">{dateParts.year}</span>
							)}
						</div>
					</div>
					<span className="evtb-date-weekday">{dateParts.weekday}</span>
				</div>
			</>
		);
	},
	save: () => {
		return null;
	}
});
