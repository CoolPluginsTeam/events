import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const {
        evtBlockId
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `evt-event-item${evtBlockId ? ` evt-block-${evtBlockId}` : ''}`
    });

    return (
        <div {...blockProps}>
            <div className="evt-event-card">
                <div className="evt-event-details">
                    {/* Content - Inside details-inner */}
                    <div className="evt-event-details-inner">
                        {/* All content blocks including date badge */}
                        <InnerBlocks.Content />
                    </div>
                </div>
            </div>
        </div>
    );
}
