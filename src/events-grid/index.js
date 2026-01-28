/**
 * Events Grid Block (Parent Container)
 * WordPress Block Standard: Import metadata from block.json
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { getDefaultImages } from '../shared/helpers';
import metadata from '../../blocks/events-grid/block.json';

// Register Events Grid Block using block.json metadata
registerBlockType(metadata.name, {
	title: __('Events Grid', 'events-block'),
	edit: ({ attributes, setAttributes, clientId }) => {
		const { columns, hideYear, hidePastEvents } = attributes;
		const blockProps = useBlockProps({
			className: 'evtb-events-grid-container',
			style: { '--grid-columns': columns }
		});

		const { insertBlocks, updateBlockAttributes } = useDispatch('core/block-editor');
		
		// Get inner blocks to check if empty
		const innerBlocks = useSelect(
			(select) => select('core/block-editor').getBlock(clientId)?.innerBlocks || [],
			[clientId]
		);

		// Get default images - will be used in template
		const pluginData = window.evtbPluginData || {};
		const defaultImages = pluginData.images ? [
			pluginData.images.crazyDJ || '',
			pluginData.images.rockBand || '',
			pluginData.images.foodDistribution || ''
		] : ['', '', ''];

		// Auto-populate default events if block is empty (first time insertion)
		useEffect(() => {
			if (innerBlocks.length === 0 && defaultImages[0]) {
				
				const eventData = [
					{
						eventImage: defaultImages[0],
						eventImageAlt: 'Crazy DJ Experience Santa Cruz',
						eventDate: '2026-01-06',
						eventStartTime: '09:00',
						eventEndTime: '17:00',
						isDefault: true,
						hasImage: true
					},
					{
						eventImage: defaultImages[1],
						eventImageAlt: 'Cute Girls Rock Band Performance',
						eventDate: '2026-04-04',
						eventStartTime: '09:00',
						eventEndTime: '17:00',
						isDefault: true,
						hasImage: true
					},
					{
						eventImage: defaultImages[2],
						eventImageAlt: 'Free Food Distribution At Mumbai',
						eventDate: '2026-06-08',
						eventStartTime: '09:00',
						eventEndTime: '17:00',
						isDefault: true,
						hasImage: true
					}
				];
				
				const defaultEventBlocks = eventData.map(data => createBlock('evtb/event-item', data));
				
				try {
					insertBlocks(defaultEventBlocks, 0, clientId, false);
					// Force update attributes after insertion (fix for undefined attributes)
					setTimeout(() => {
						const updatedInnerBlocks = select('core/block-editor').getBlock(clientId)?.innerBlocks || [];
						
						updatedInnerBlocks.forEach((block, index) => {
							if (eventData[index]) {
								updateBlockAttributes(block.clientId, eventData[index]);
							}
						});
					}, 100);
				} catch (error) {
					console.error('❌ Error inserting blocks:', error);
				}
			}
		}, [innerBlocks.length, defaultImages[0], insertBlocks, updateBlockAttributes]);

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
							help={__('Number of columns in the grid (1-3)', 'evtb')}
							__next40pxDefaultSize={true}
						/>
						<ToggleControl
							label={__('Hide Year (All Events)', 'events')}
							checked={hideYear}
							onChange={(value) => setAttributes({ hideYear: value })}
							help={__('Toggle to hide or show the year in all event date badges', 'events')}
							__nextHasNoMarginBottom={true}
						/>
						<ToggleControl
							label={__('Hide Past Events', 'events')}
							checked={hidePastEvents}
							onChange={(value) => setAttributes({ hidePastEvents: value })}
							help={__('Automatically hide events that have passed', 'events')}
							__nextHasNoMarginBottom={true}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					<InnerBlocks
						allowedBlocks={['evtb/event-item']}
						template={[
							['evtb/event-item', {
								eventImage: defaultImages[0],
								eventImageAlt: 'Crazy DJ Experience Santa Cruz',
								eventDate: '2026-01-06',
								isDefault: true,
								hasImage: true
							}],
							['evtb/event-item', {
								eventImage: defaultImages[1],
								eventImageAlt: 'Cute Girls Rock Band Performance',
								eventDate: '2026-04-04',
								isDefault: true,
								hasImage: true
							}],
							['evtb/event-item', {
								eventImage: defaultImages[2],
								eventImageAlt: 'Free Food Distribution At Mumbai',
								eventDate: '2026-06-08',
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
			className: 'evtb-events-grid-container evtb-front-view',
			style: { '--columns': columns }
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	}
});
