/**
 * Events Grid Block (Parent Container)
 * WordPress Block Standard: Import metadata from block.json
 */
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { getDefaultImages } from '../shared/helpers';
import metadata from '../../blocks/events-grid/block.json';

// Register Events Grid Block using block.json metadata
registerBlockType(metadata.name, {
	edit: ({ attributes, setAttributes }) => {
		const { columns } = attributes;
		const blockProps = useBlockProps({
			className: 'evt-events-grid-container',
			style: { '--grid-columns': columns }
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
							__next40pxDefaultSize={true}
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
								eventDate: '0001-01-06',
								isDefault: true,
								hasImage: true
							}],
							['evt/event-item', {
								eventImage: defaultImages[1],
								eventImageAlt: 'Cute Girls Rock Band Performance',
								eventDate: '0001-04-04',
								isDefault: true,
								hasImage: true
							}],
							['evt/event-item', {
								eventImage: defaultImages[2],
								eventImageAlt: 'Free Food Distribution At Mumbai',
								eventDate: '0001-06-08',
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
