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
	}, [evtbBadgeId, clientId]);

	// Get parent block ID and its attributes directly
	const parentData = useSelect((select) => {
		const { getBlockParents, getBlock } = select('core/block-editor');
		const parentIds = getBlockParents(clientId);
		
		// Find the evtb/event-item parent
		for (let parentId of parentIds) {
			const parentBlock = getBlock(parentId);
			if (parentBlock && parentBlock.name === 'evtb/event-item') {
				return {
					clientId: parentId,
					eventDate: parentBlock.attributes.eventDate
				};
			}
		}
		return null;
	}, [clientId]);

	// Determine which date to display
	// Priority: 1. Own eventDate (if explicitly set), 2. Parent block's eventDate attribute, 3. Context, 4. Current date
	const displayDate = eventDate || parentData?.eventDate || context['evtb/eventDate'] || getCurrentDate();

	// console.log('displayDate', displayDate);
	// console.log('eventDate', eventDate);
	// console.log('parentData?.eventDate', parentData?.eventDate);
	// console.log('context[\'evtb/eventDate\']', context['evtb/eventDate']);
	// console.log('context[\'evtb/hideYear\']', context['evtb/hideYear']);
	// console.log('hideYear', hideYear);
	// console.log('context', context);
	// console.log('clientId', clientId);
	// console.log('attributes', attributes);
	// SINGLE useEffect to handle all date syncing - PREVENTS INFINITE LOOPS
	useEffect(() => {
		let shouldUpdate = false;
		let updates = {};

		// Only sync if we don't have a date yet
		if (!eventDate) {
			// Priority: parent's attribute first, then context
			if (parentData?.eventDate && parentData.eventDate !== eventDate) {
				updates.eventDate = parentData.eventDate;
				shouldUpdate = true;
			} else if (!parentData?.eventDate && context['evtb/eventDate'] && context['evtb/eventDate'] !== eventDate) {
				updates.eventDate = context['evtb/eventDate'];
				shouldUpdate = true;
			}
		}

		// Sync hideYear from global context (use default from block.json if context is undefined)
		const contextHideYear = context['evtb/hideYear'];
		if (contextHideYear !== undefined && contextHideYear !== hideYear) {
			updates.hideYear = contextHideYear;
			shouldUpdate = true;
		} else if (hideYear === undefined) {
			// Set default from block.json if still undefined
			updates.hideYear = true;
			shouldUpdate = true;
		}

		// Only update if there are actual changes
		if (shouldUpdate) {
			setAttributes(updates);
		}
	}, [eventDate, parentData?.eventDate, context['evtb/eventDate'], context['evtb/hideYear'], hideYear]);

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

	const dateParts = parseDate(displayDate);

	// Handle date change - update both child and parent
	const handleDateChange = (newDate) => {
		// Update child attribute and mark as date set by user
		setAttributes({
			eventDate: newDate,
			isDateSet: true
		});

		// Update parent Event Item block's eventDate
		if (parentData?.clientId) {
			dispatch('core/block-editor').updateBlockAttributes(
				parentData.clientId,
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
							currentDate={displayDate}
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
// EVENT-DATE-BADGE