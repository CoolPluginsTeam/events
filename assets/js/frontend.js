/**
 * Frontend JavaScript for Events Block
 * Removes empty elements from the DOM
 */
(function () {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeEmptyElements);
    } else {
        removeEmptyElements();
    }

    function removeEmptyElements() {
        // Select all event blocks
        const eventBlocks = document.querySelectorAll('.evtb-front-view .evtb-event-details-inner');

        eventBlocks.forEach(function (block) {
            // Find all paragraphs and headings with specific classes
            const selectors = [
                'p.evtb-event-description',
                'p.evtb-event-location',
                'p.evtb-event-price',
                'p.evtb-event-time',
                'h1.evtb-event-title',
                'h2.evtb-event-title',
                'h3.evtb-event-title',
                'h4.evtb-event-title',
                'h5.evtb-event-title',
                'h6.evtb-event-title'
            ];

            selectors.forEach(function (selector) {
                const elements = block.querySelectorAll(selector);
                elements.forEach(function (element) {
                    // Check if element is truly empty (no text content after trimming)
                    if (!element.textContent.trim()) {
                        // Remove the element completely from the DOM
                        element.remove();
                    }
                });
            });

            // Remove Read More buttons with empty or invalid hrefs
            const readMoreButtons = block.querySelectorAll('.evtb-event-read-more a');
            readMoreButtons.forEach(function (button) {
                const href = button.getAttribute('href');
                if (!href || href === '' || href === '#') {
                    // Remove the entire button wrapper
                    const buttonWrapper = button.closest('.wp-block-button');
                    if (buttonWrapper) {
                        buttonWrapper.remove();
                    }
                }
            });

            // Remove empty wrapper divs after cleaning up their children
            const wrapperSelectors = [
                '.evtb-price-read-more',
                '.evtb-event-detail',
                '.wp-block-buttons'
            ];

            wrapperSelectors.forEach(function (selector) {
                const wrappers = block.querySelectorAll(selector);
                wrappers.forEach(function (wrapper) {
                    // Check if wrapper has no visible content after cleanup
                    if (!wrapper.textContent.trim() && wrapper.children.length === 0) {
                        wrapper.remove();
                    }
                });
            });
        });
    }
})();
