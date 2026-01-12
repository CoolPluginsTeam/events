import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { createElement, Fragment, useEffect } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, dispatch } from '@wordpress/data';
import { formatTime12Hour } from '../utils';

// EXTEND CORE/PARAGRAPH BLOCK FOR TIME SETTINGS
// Add custom attributes to core/paragraph block
addFilter(
    'blocks.registerBlockType',
    'evt/paragraph-time-attributes',
    (settings, name) => {
        if (name !== 'core/paragraph') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                evtStartTime: {
                    type: 'string',
                    default: '09:00'
                },
                evtEndTime: {
                    type: 'string',
                    default: '17:00'
                },
                evtIsTimeSet: {
                    type: 'boolean',
                    default: false
                }
            }
        };
    }
);

// Add Time Settings panel to paragraph block with evt-event-time class
const withTimeSettings = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes, name } = props;

        // Only apply to core/paragraph with evt-event-time class
        if (name !== 'core/paragraph' || !attributes.className || !attributes.className.includes('evt-event-time')) {
            return createElement(BlockEdit, props);
        }

        const { evtStartTime, evtEndTime, evtIsTimeSet } = attributes;

        // Get parent Event Item context
        const parentContext = useSelect((select) => {
            const { getBlockParents, getBlock } = select('core/block-editor');
            const parentIds = getBlockParents(props.clientId);

            // Find evt/event-item parent
            for (let parentId of parentIds) {
                const parentBlock = getBlock(parentId);
                if (parentBlock && parentBlock.name === 'evt/event-item') {
                    return {
                        clientId: parentId,
                        startTime: parentBlock.attributes.eventStartTime || '09:00',
                        endTime: parentBlock.attributes.eventEndTime || '17:00'
                    };
                }
            }
            return null;
        }, [props.clientId]);

        // Use parent times or own times
        const currentStartTime = parentContext?.startTime || evtStartTime;
        const currentEndTime = parentContext?.endTime || evtEndTime;

        // Handle time changes
        const handleStartTimeChange = (newTime) => {
            setAttributes({
                evtStartTime: newTime,
                evtIsTimeSet: true
            });

            // Update parent Event Item block
            if (parentContext) {
                dispatch('core/block-editor').updateBlockAttributes(
                    parentContext.clientId,
                    { eventStartTime: newTime }
                );
            }

            // Update paragraph content
            updateParagraphContent(newTime, currentEndTime);
        };

        const handleEndTimeChange = (newTime) => {
            setAttributes({
                evtEndTime: newTime,
                evtIsTimeSet: true
            });

            // Update parent Event Item block
            if (parentContext) {
                dispatch('core/block-editor').updateBlockAttributes(
                    parentContext.clientId,
                    { eventEndTime: newTime }
                );
            }

            // Update paragraph content
            updateParagraphContent(currentStartTime, newTime);
        };

        // Update paragraph content with formatted time
        const updateParagraphContent = (startTime, endTime) => {
            const formattedTime = `${formatTime12Hour(startTime)} – ${formatTime12Hour(endTime)}`;
            setAttributes({ content: formattedTime });
        };

        // Sync parent times to paragraph content on mount
        useEffect(() => {
            if (parentContext && evtIsTimeSet) {
                updateParagraphContent(currentStartTime, currentEndTime);
            }
        }, [parentContext?.startTime, parentContext?.endTime]);

        return createElement(
            Fragment,
            {},
            createElement(BlockEdit, props),
            createElement(
                InspectorControls,
                {},
                createElement(
                    PanelBody,
                    {
                        title: __('Time Settings', 'events'),
                        className: 'evt-time-settings'
                    },
                    createElement(
                        'div',
                        { className: 'evt-start-time-input' },
                        createElement('strong', {}, __('Start Time', 'events')),
                        createElement('input', {
                            type: 'time',
                            value: currentStartTime,
                            onChange: (e) => handleStartTimeChange(e.target.value),
                            onClick: (e) => {
                                if (e.target.showPicker) {
                                    e.target.showPicker();
                                }
                            }
                        })
                    ),
                    createElement(
                        'div',
                        { className: 'evt-end-time-input' },
                        createElement('strong', {}, __('End Time', 'events')),
                        createElement('input', {
                            type: 'time',
                            value: currentEndTime,
                            onChange: (e) => handleEndTimeChange(e.target.value),
                            onClick: (e) => {
                                if (e.target.showPicker) {
                                    e.target.showPicker();
                                }
                            }
                        })
                    )
                )
            )
        );
    };
}, 'withTimeSettings');

addFilter(
    'editor.BlockEdit',
    'evt/paragraph-time-settings',
    withTimeSettings
);
