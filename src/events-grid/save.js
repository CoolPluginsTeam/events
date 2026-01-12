import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
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
