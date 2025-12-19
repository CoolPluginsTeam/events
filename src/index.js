import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, DateTimePicker, PanelRow, SelectControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n, format, getSettings } from '@wordpress/date';

// Font Families List (100 fonts) - Alphabetically Sorted
const FONT_FAMILIES = [
    { label: 'Almarai', value: 'Almarai, sans-serif' },
    { label: 'Amiri', value: 'Amiri, serif' },
    { label: 'Anton', value: 'Anton, sans-serif' },
    { label: 'Archivo', value: 'Archivo, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Athiti', value: 'Athiti, sans-serif' },
    { label: 'Bai Jamjuree', value: '"Bai Jamjuree", sans-serif' },
    { label: 'Bangers', value: 'Bangers, cursive' },
    { label: 'Barlow', value: 'Barlow, sans-serif' },
    { label: 'Barlow Condensed', value: '"Barlow Condensed", sans-serif' },
    { label: 'Barlow Semi Condensed', value: '"Barlow Semi Condensed", sans-serif' },
    { label: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
    { label: 'Cairo', value: 'Cairo, sans-serif' },
    { label: 'Cabin', value: 'Cabin, sans-serif' },
    { label: 'Charm', value: 'Charm, cursive' },
    { label: 'Charmonman', value: 'Charmonman, cursive' },
    { label: 'Chakra Petch', value: '"Chakra Petch", sans-serif' },
    { label: 'Chonburi', value: 'Chonburi, sans-serif' },
    { label: 'Comfortaa', value: 'Comfortaa, cursive' },
    { label: 'Cormorant', value: 'Cormorant, serif' },
    { label: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
    { label: 'Cormorant Infant', value: '"Cormorant Infant", serif' },
    { label: 'Cormorant SC', value: '"Cormorant SC", serif' },
    { label: 'Cormorant Unicase', value: '"Cormorant Unicase", serif' },
    { label: 'Cormorant Upright', value: '"Cormorant Upright", serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Cousine', value: 'Cousine, monospace' },
    { label: 'Crete Round', value: '"Crete Round", serif' },
    { label: 'Crimson Pro', value: '"Crimson Pro", serif' },
    { label: 'Crimson Text', value: '"Crimson Text", serif' },
    { label: 'Cuprum', value: 'Cuprum, sans-serif' },
    { label: 'Dancing Script', value: '"Dancing Script", cursive' },
    { label: 'DM Sans', value: '"DM Sans", sans-serif' },
    { label: 'DM Serif Display', value: '"DM Serif Display", serif' },
    { label: 'Dosis', value: 'Dosis, sans-serif' },
    { label: 'Droid Sans', value: '"Droid Sans", sans-serif' },
    { label: 'Droid Serif', value: '"Droid Serif", serif' },
    { label: 'EB Garamond', value: '"EB Garamond", serif' },
    { label: 'Economica', value: 'Economica, sans-serif' },
    { label: 'Epilogue', value: 'Epilogue, sans-serif' },
    { label: 'Exo', value: 'Exo, sans-serif' },
    { label: 'Exo 2', value: '"Exo 2", sans-serif' },
    { label: 'Figtree', value: 'Figtree, sans-serif' },
    { label: 'Fira Code', value: '"Fira Code", monospace' },
    { label: 'Fira Mono', value: '"Fira Mono", monospace' },
    { label: 'Fira Sans', value: '"Fira Sans", sans-serif' },
    { label: 'Fjalla One', value: '"Fjalla One", sans-serif' },
    { label: 'Francois One', value: '"Francois One", sans-serif' },
    { label: 'Fredoka One', value: '"Fredoka One", cursive' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Gloria Hallelujah', value: '"Gloria Hallelujah", cursive' },
    { label: 'Great Vibes', value: '"Great Vibes", cursive' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Hind', value: 'Hind, sans-serif' },
    { label: 'IBM Plex Sans', value: '"IBM Plex Sans", sans-serif' },
    { label: 'IBM Plex Serif', value: '"IBM Plex Serif", serif' },
    { label: 'Indie Flower', value: '"Indie Flower", cursive' },
    { label: 'Inconsolata', value: 'Inconsolata, monospace' },
    { label: 'Inter', value: 'Inter' },
    { label: 'Itim', value: 'Itim, cursive' },
    { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
    { label: 'Josefin Sans', value: '"Josefin Sans", sans-serif' },
    { label: 'Kalam', value: 'Kalam, cursive' },
    { label: 'Kanit', value: 'Kanit, sans-serif' },
    { label: 'Karla', value: 'Karla, sans-serif' },
    { label: 'Kaushan Script', value: '"Kaushan Script", cursive' },
    { label: 'Khand', value: 'Khand, sans-serif' },
    { label: 'KoHo', value: 'KoHo, sans-serif' },
    { label: 'Kodchasan', value: 'Kodchasan, sans-serif' },
    { label: 'Lato', value: 'Lato, sans-serif' },
    { label: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
    { label: 'Lobster', value: 'Lobster, cursive' },
    { label: 'Lobster Two', value: '"Lobster Two", cursive' },
    { label: 'Lora', value: 'Lora, serif' },
    { label: 'Luckiest Guy', value: '"Luckiest Guy", cursive' },
    { label: 'Mali', value: 'Mali, cursive' },
    { label: 'Manrope', value: 'Manrope, sans-serif' },
    { label: 'Marck Script', value: '"Marck Script", cursive' },
    { label: 'Maven Pro', value: '"Maven Pro", sans-serif' },
    { label: 'Merienda', value: 'Merienda, cursive' },
    { label: 'Merriweather', value: 'Merriweather, serif' },
    { label: 'Merriweather Sans', value: '"Merriweather Sans", sans-serif' },
    { label: 'Mitr', value: 'Mitr, sans-serif' },
    { label: 'Monoton', value: 'Monoton, cursive' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Muli', value: 'Muli, sans-serif' },
    { label: 'Mukta', value: 'Mukta, sans-serif' },
    { label: 'Mukta Mahee', value: '"Mukta Mahee", sans-serif' },
    { label: 'Mukta Malar', value: '"Mukta Malar", sans-serif' },
    { label: 'Mukta Vaani', value: '"Mukta Vaani", sans-serif' },
    { label: 'Nanum Gothic', value: '"Nanum Gothic", sans-serif' },
    { label: 'Nanum Myeongjo', value: '"Nanum Myeongjo", serif' },
    { label: 'Nanum Pen Script', value: '"Nanum Pen Script", cursive' },
    { label: 'Niramit', value: 'Niramit, sans-serif' },
    { label: 'Noto Sans', value: '"Noto Sans", sans-serif' },
    { label: 'Noto Serif', value: '"Noto Serif", serif' },
    { label: 'Nunito', value: 'Nunito, sans-serif' },
    { label: 'Open Sans', value: '"Open Sans", sans-serif' },
    { label: 'Orbitron', value: 'Orbitron, sans-serif' },
    { label: 'Oswald', value: 'Oswald, sans-serif' },
    { label: 'Oxygen', value: 'Oxygen, sans-serif' },
    { label: 'Pacifico', value: 'Pacifico, cursive' },
    { label: 'Pattaya', value: 'Pattaya, sans-serif' },
    { label: 'Permanent Marker', value: '"Permanent Marker", cursive' },
    { label: 'Philosopher', value: 'Philosopher, sans-serif' },
    { label: 'Playfair Display', value: '"Playfair Display", serif' },
    { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
    { label: 'Poppins', value: 'Poppins, sans-serif' },
    { label: 'Press Start 2P', value: '"Press Start 2P", cursive' },
    { label: 'Prata', value: 'Prata, serif' },
    { label: 'Pridi', value: 'Pridi, serif' },
    { label: 'Prompt', value: 'Prompt, sans-serif' },
    { label: 'PT Sans', value: '"PT Sans", sans-serif' },
    { label: 'PT Serif', value: '"PT Serif", serif' },
    { label: 'Quattrocento', value: 'Quattrocento, serif' },
    { label: 'Quattrocento Sans', value: '"Quattrocento Sans", sans-serif' },
    { label: 'Questrial', value: 'Questrial, sans-serif' },
    { label: 'Quicksand', value: 'Quicksand, sans-serif' },
    { label: 'Rajdhani', value: 'Rajdhani, sans-serif' },
    { label: 'Raleway', value: 'Raleway, sans-serif' },
    { label: 'Red Hat Display', value: '"Red Hat Display", sans-serif' },
    { label: 'Righteous', value: 'Righteous, cursive' },
    { label: 'Roboto', value: 'Roboto, sans-serif' },
    { label: 'Rokkitt', value: 'Rokkitt, serif' },
    { label: 'Rubik', value: 'Rubik, sans-serif' },
    { label: 'Sarabun', value: 'Sarabun, sans-serif' },
    { label: 'Satisfy', value: 'Satisfy, cursive' },
    { label: 'Shadows Into Light', value: '"Shadows Into Light", cursive' },
    { label: 'Shadows Into Light Two', value: '"Shadows Into Light Two", cursive' },
    { label: 'Signika', value: 'Signika, sans-serif' },
    { label: 'Signika Negative', value: '"Signika Negative", sans-serif' },
    { label: 'Slabo 13px', value: '"Slabo 13px", serif' },
    { label: 'Slabo 27px', value: '"Slabo 27px", serif' },
    { label: 'Source Code Pro', value: '"Source Code Pro", monospace' },
    { label: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
    { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
    { label: 'Space Mono', value: '"Space Mono", monospace' },
    { label: 'Spectral', value: 'Spectral, serif' },
    { label: 'Sora', value: 'Sora, sans-serif' },
    { label: 'Srisakdi', value: 'Srisakdi, cursive' },
    { label: 'Sriracha', value: 'Sriracha, cursive' },
    { label: 'Tajawal', value: 'Tajawal, sans-serif' },
    { label: 'Tangerine', value: 'Tangerine, cursive' },
    { label: 'Teko', value: 'Teko, sans-serif' },
    { label: 'Thasadith', value: 'Thasadith, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Tinos', value: 'Tinos, serif' },
    { label: 'Titillium Web', value: '"Titillium Web", sans-serif' },
    { label: 'Trirong', value: 'Trirong, serif' },
    { label: 'Ubuntu', value: 'Ubuntu, sans-serif' },
    { label: 'Varela', value: 'Varela, sans-serif' },
    { label: 'Varela Round', value: '"Varela Round", sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Vollkorn', value: 'Vollkorn, serif' },
    { label: 'Work Sans', value: '"Work Sans", sans-serif' },
    { label: 'Yanone Kaffeesatz', value: '"Yanone Kaffeesatz", sans-serif' },
    { label: 'Yellowtail', value: 'Yellowtail, cursive' },
    { label: 'Yeseva One', value: '"Yeseva One", cursive' },
    { label: 'Zilla Slab', value: '"Zilla Slab", serif' }
];

// Icon for the blocks
const eventIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19.5,19c0,0.3-0.2,0.5-0.5,0.5H5 c-0.3,0-0.5-0.2-0.5-0.5V7h15V19z M17,13h-4v4h4V13z" />
    </svg>
);

// ============================================
// PARENT BLOCK: Events Grid Container
// ============================================
registerBlockType('evt/events-grid', {
    title: __('Events Grid', 'event'),
    description: __('Display multiple events in a modern grid layout', 'event'),
    icon: eventIcon,
    category: 'widgets',
    supports: {
        align: ['wide', 'full'],
        html: false,
    },
    
    attributes: {
        columns: {
            type: 'number',
            default: 3
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            className: 'evt-events-grid-container'
        });

        const ALLOWED_BLOCKS = ['evt/event-item'];
        
        // Template with 3 default events
        // Get image URLs from PHP (passed via wp_localize_script)
        const pluginImages = (typeof evtPluginData !== 'undefined' && evtPluginData.images) ? evtPluginData.images : {
            crazyDJ: '',
            rockBand: '',
            foodDistribution: ''
        };

        const TEMPLATE = [
            ['evt/event-item', {
                eventTitle: 'Crazy DJ Experience Santa Cruz',
                eventLocation: 'JW Marriott, Sector 35',
                eventDate: '2026-01-06T16:00:00',
                eventPrice: '$25.00',
                eventDay: 'TUE',
                eventImageURL: pluginImages.crazyDJ
            }],
            ['evt/event-item', {
                eventTitle: 'Cute Girls Rock Band Performance',
                eventLocation: 'Club XYZ, Sector 17',
                eventDate: '2026-04-04T18:30:00',
                eventPrice: '$20.00',
                eventDay: 'SAT',
                eventImageURL: pluginImages.rockBand
            }],
            ['evt/event-item', {
                eventTitle: 'Free Food Distribution At Mumbai',
                eventLocation: 'Food Corp. Mumbai, Ft. Line',
                eventDate: '2026-06-08T19:00:00',
                eventPrice: '$15.00',
                eventDay: 'MON',
                eventImageURL: pluginImages.foodDistribution
            }]
        ];

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Grid Settings', 'event')}>
                        <TextControl
                            label={__('Columns', 'event')}
                            type="number"
                            value={attributes.columns}
                            onChange={(value) => setAttributes({ columns: parseInt(value) })}
                            min={1}
                            max={4}
                            help={__('Number of columns in the grid (1-4)', 'event')}
                            __nextHasNoMarginBottom={true}
                            __next40pxDefaultSize={true}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps} style={{ '--columns': attributes.columns }}>
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                    />
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({
            className: 'evt-events-grid-container',
            style: { '--columns': attributes.columns }
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    }
});

// ============================================
// CHILD BLOCK: Individual Event Item
// ============================================
registerBlockType('evt/event-item', {
    title: __('Event Item', 'event'),
    description: __('Single event card with image, date, and details', 'event'),
    icon: eventIcon,
    category: 'widgets',
    parent: ['evt/events-grid'], // Can only be added inside events-grid
    
    supports: {
        reusable: false,
        html: false,
    },

    attributes: {
        eventTitle: {
            type: 'string',
            default: ''
        },
        eventDescription: {
            type: 'string',
            default: ''
        },
        eventLocation: {
            type: 'string',
            default: ''
        },
        eventDate: {
            type: 'string',
            default: ''
        },
        eventEndDate: {
            type: 'string',
            default: ''
        },
        eventPrice: {
            type: 'string',
            default: ''
        },
        eventDay: {
            type: 'string',
            default: ''
        },
        eventImageURL: {
            type: 'string',
            default: ''
        },
        eventImageID: {
            type: 'number'
        },
        eventImageAlt: {
            type: 'string',
            default: ''
        },
        // Container Settings
        detailsBackgroundColor: {
            type: 'string',
            default: '#ffffff'
        },
        
        // Typography Settings - Title
        titleFontSize: {
            type: 'string',
            default: '18px'
        },
        titleFontWeight: {
            type: 'string',
            default: '600'
        },
        titleLineHeight: {
            type: 'string',
            default: '1.3'
        },
        titleMargin: {
            type: 'string',
            default: '4px 0px 6px 0px'
        },
        titleColor: {
            type: 'string',
            default: '#1a1a1a'
        },
        titleFontFamily: {
            type: 'string',
            default: 'Inter'
        },
        // Typography Settings - Description
        descriptionFontSize: {
            type: 'string',
            default: '14px'
        },
        descriptionFontWeight: {
            type: 'string',
            default: '400'
        },
        descriptionLineHeight: {
            type: 'string',
            default: '1.5'
        },
        descriptionMargin: {
            type: 'string',
            default: '0 0 12px 0'
        },
        descriptionColor: {
            type: 'string',
            default: '#1a1a1a'
        },
        descriptionFontFamily: {
            type: 'string',
            default: 'Inter'
        },
        // Typography Settings - Date
        borderBadgeColor: {
            type: 'string',
            default: '#00000040'
        },
        dateBadgeBackgroundColor: {
            type: 'string',
            default: '#2667FF'
        },
        dateBadgeTextColor: {
            type: 'string',
            default: '#ffffff'
        },
        dateFontSize: {
            type: 'string',
            default: '21px'
        },
        dateFontWeight: {
            type: 'string',
            default: '700'
        },
        dateLineHeight: {
            type: 'string',
            default: '1'
        },
        dateMargin: {
            type: 'string',
            default: '0'
        },
        dateFontFamily: {
            type: 'string',
            default: 'Inter'
        },
        // Typography Settings - Weekday
        weekdayFontSize: {
            type: 'string',
            default: '12px'
        },
        weekdayFontWeight: {
            type: 'string',
            default: '500'
        },
        weekdayLineHeight: {
            type: 'string',
            default: '1.2'
        },
        weekdayMargin: {
            type: 'string',
            default: '0'
        },
        weekdayColor: {
            type: 'string',
            default: '#000000'
        },
        weekdayFontFamily: {
            type: 'string',
            default: 'Inter'
        },
        // Typography Settings - Time
        timeFontSize: {
            type: 'string',
            default: '14px'
        },
        timeFontWeight: {
            type: 'string',
            default: '500'
        },
        timeLineHeight: {
            type: 'string',
            default: '1.4'
        },
        timeMargin: {
            type: 'string',
            default: '0 0 8px 0'
        },
        timeColor: {
            type: 'string',
            default: '#1a1a1a'
        },
        timeFontFamily: {
            type: 'string',
            default: 'Inter'
        },
        // Typography Settings - Location
        locationFontSize: {
            type: 'string',
            default: '14px'
        },
        locationFontWeight: {
            type: 'string',
            default: '400'
        },
        locationLineHeight: {
            type: 'string',
            default: '1.5'
        },
        locationMargin: {
            type: 'string',
            default: '0 0 12px 0'
        },
        locationColor: {
            type: 'string',
            default: '#1a1a1a'
        },
        locationFontFamily: {
            type: 'string',
            default: 'Inter'
        },
        // Typography Settings - Price
        priceFontSize: {
            type: 'string',
            default: '16px'
        },
        priceFontWeight: {
            type: 'string',
            default: '700'
        },
        priceLineHeight: {
            type: 'string',
            default: '1.4'
        },
        priceMargin: {
            type: 'string',
            default: '0'
        },
        priceColor: {
            type: 'string',
            default: '#1a1a1a'
        },
        priceFontFamily: {
            type: 'string',
            default: 'Inter'
        },
        // Typography Settings - Read More
        readMoreURL: {
            type: 'string',
            default: ''
        },
        readMoreText: {
            type: 'string',
            default: 'Read More'
        },
        readMoreButtonColor: {
            type: 'string',
            default: '#2667FF'
        },
        readMoreButtonHoverColor: {
            type: 'string',
            default: '#2667FF'
        },
        readMoreButtonHoverTextColor: {
            type: 'string',
            default: '#ffffff'
        },
        readMoreFontSize: {
            type: 'string',
            default: '13px'
        },
        readMoreFontWeight: {
            type: 'string',
            default: '500'
        },
        readMoreLineHeight: {
            type: 'string',
            default: '1.4'
        },
        readMoreMargin: {
            type: 'string',
            default: '0'
        },
        readMoreColor: {
            type: 'string',
            default: '#ffffff'
        },
        readMoreFontFamily: {
            type: 'string',
            default: 'Inter'
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const {
            eventTitle,
            eventDescription,
            eventLocation,
            eventDate,
            eventEndDate,
            eventPrice,
            eventDay,
            eventImageURL,
            eventImageID,
            eventImageAlt,
            detailsBackgroundColor,
            // Typography - Title
            titleFontSize,
            titleFontWeight,
            titleLineHeight,
            titleMargin,
            titleColor,
            titleFontFamily,
            // Typography - Description
            descriptionFontSize,
            descriptionFontWeight,
            descriptionLineHeight,
            descriptionMargin,
            descriptionColor,
            descriptionFontFamily,
            // Typography - Date
            borderBadgeColor,
            dateBadgeBackgroundColor,
            dateBadgeTextColor,
            dateFontSize,
            dateFontWeight,
            dateLineHeight,
            dateMargin,
            dateFontFamily,
            // Typography - Weekday
            weekdayFontSize,
            weekdayFontWeight,
            weekdayLineHeight,
            weekdayMargin,
            weekdayColor,
            weekdayFontFamily,
            // Typography - Time
            timeFontSize,
            timeFontWeight,
            timeLineHeight,
            timeMargin,
            timeColor,
            timeFontFamily,
            // Typography - Location
            locationFontSize,
            locationFontWeight,
            locationLineHeight,
            locationMargin,
            locationColor,
            locationFontFamily,
            // Typography - Price
            priceFontSize,
            priceFontWeight,
            priceLineHeight,
            priceMargin,
            priceColor,
            priceFontFamily,
            // Typography - Read More
            readMoreURL,
            readMoreText,
            readMoreButtonColor,
            readMoreButtonHoverColor,
            readMoreButtonHoverTextColor,
            readMoreFontSize,
            readMoreFontWeight,
            readMoreLineHeight,
            readMoreMargin,
            readMoreColor,
            readMoreFontFamily
        } = attributes;

        const blockProps = useBlockProps({
            className: 'evt-event-item',
            style: {
                '--evt-details-bg': detailsBackgroundColor || '#ffffff',
                // Typography CSS Variables
                '--evt-title-font-size': titleFontSize || '18px',
                '--evt-title-font-weight': titleFontWeight || '600',
                '--evt-title-line-height': titleLineHeight || '1.3',
                '--evt-title-margin': titleMargin || '4px 0px 6px 0px',
                '--evt-title-color': titleColor || '#1a1a1a',
                '--evt-title-font-family': titleFontFamily || 'Inter',
                '--evt-description-font-size': descriptionFontSize || '14px',
                '--evt-description-font-weight': descriptionFontWeight || '400',
                '--evt-description-line-height': descriptionLineHeight || '1.5',
                '--evt-description-margin': descriptionMargin || '0 0 12px 0',
                '--evt-description-color': descriptionColor || '#1a1a1a',
                '--evt-description-font-family': descriptionFontFamily || 'Inter',
                '--evt-border-color': borderBadgeColor || '#00000040',
                '--evt-date-badge-bg': dateBadgeBackgroundColor || '#2667FF',
                '--evt-date-badge-text': dateBadgeTextColor || '#ffffff',
                '--evt-date-font-size': dateFontSize || '21px',
                '--evt-date-font-weight': dateFontWeight || '700',
                '--evt-date-line-height': dateLineHeight || '1',
                '--evt-date-margin': dateMargin || '0',
                '--evt-date-font-family': dateFontFamily || 'Inter',
                '--evt-weekday-font-size': weekdayFontSize || '12px',
                '--evt-weekday-font-weight': weekdayFontWeight || '500',
                '--evt-weekday-line-height': weekdayLineHeight || '1.2',
                '--evt-weekday-margin': weekdayMargin || '0',
                '--evt-weekday-color': weekdayColor || '#000000',
                '--evt-weekday-font-family': weekdayFontFamily || 'Inter',
                '--evt-time-font-size': timeFontSize || '14px',
                '--evt-time-font-weight': timeFontWeight || '500',
                '--evt-time-line-height': timeLineHeight || '1.4',
                '--evt-time-margin': timeMargin || '0 0 8px 0',
                '--evt-time-color': timeColor || '#1a1a1a',
                '--evt-time-font-family': timeFontFamily || 'Inter',
                '--evt-location-font-size': locationFontSize || '14px',
                '--evt-location-font-weight': locationFontWeight || '400',
                '--evt-location-line-height': locationLineHeight || '1.5',
                '--evt-location-margin': locationMargin || '0 0 12px 0',
                '--evt-location-color': locationColor || '#1a1a1a',
                '--evt-location-font-family': locationFontFamily || 'Inter',
                '--evt-price-font-size': priceFontSize || '16px',
                '--evt-price-font-weight': priceFontWeight || '700',
                '--evt-price-line-height': priceLineHeight || '1.4',
                '--evt-price-margin': priceMargin || '0',
                '--evt-price-color': priceColor || '#1a1a1a',
                '--evt-price-font-family': priceFontFamily || 'Inter',
                '--evt-read-more-button-color': readMoreButtonColor || '#4169E1',
                '--evt-read-more-button-hover-color': readMoreButtonHoverColor || '#2667FF',
                '--evt-read-more-button-hover-text-color': readMoreButtonHoverTextColor || '#ffffff',
                '--evt-readmore-font-size': readMoreFontSize || '13px',
                '--evt-readmore-font-weight': readMoreFontWeight || '500',
                '--evt-readmore-line-height': readMoreLineHeight || '1.4',
                '--evt-readmore-margin': readMoreMargin || '0',
                '--evt-readmore-color': readMoreColor || '#ffffff',
                '--evt-readmore-font-family': readMoreFontFamily || 'Inter'
            }
        });

        // Get formatted date parts
        const getDateParts = (dateString) => {
            if (!dateString) return { month: '', day: '', time: '', dayName: '' };
            
            try {
                const date = new Date(dateString);
                return {
                    month: dateI18n('M', dateString),
                    day: dateI18n('d', dateString), // 'd' for leading zero (01-31)
                    time: dateI18n('g:i a', dateString),
                    dayName: dateI18n('D', dateString).toUpperCase()
                };
            } catch (e) {
                return { month: '', day: '', time: '', dayName: '' };
            }
        };

        const dateParts = getDateParts(eventDate);

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Event Details', 'event')}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                {__('Start Date & Time', 'event')}
                            </label>
                            <DateTimePicker
                                currentDate={eventDate || new Date().toISOString()}
                                onChange={(newDate) => {
                                    setAttributes({ eventDate: newDate });
                                    // Auto-update day name
                                    const dayName = dateI18n('D', newDate).toUpperCase();
                                    setAttributes({ eventDay: dayName });
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                {__('End Date & Time', 'event')}
                            </label>
                            <DateTimePicker
                                currentDate={eventEndDate || eventDate || new Date().toISOString()}
                                onChange={(newDate) => setAttributes({ eventEndDate: newDate })}
                            />
                        </div>

                        <TextControl
                            label={__('Price', 'event')}
                            value={eventPrice}
                            onChange={(value) => setAttributes({ eventPrice: value })}
                            placeholder="$25.00"
                            __nextHasNoMarginBottom={true}
                            __next40pxDefaultSize={true}
                        />

                        <TextControl
                            label={__('Day Label', 'event')}
                            value={eventDay || dateParts.dayName}
                            onChange={(value) => setAttributes({ eventDay: value })}
                            help={__('e.g., MON, TUE, FRI', 'event')}
                            __nextHasNoMarginBottom={true}
                            __next40pxDefaultSize={true}
                        />
                    </PanelBody>
                    <PanelBody title={__('Image Settings', 'event')} initialOpen={false}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => {
                                    setAttributes({
                                        eventImageURL: media.url,
                                        eventImageID: media.id,
                                        eventImageAlt: media.alt
                                    });
                                }}
                                allowedTypes={['image']}
                                value={eventImageID}
                                render={({ open }) => (
                                    <Button
                                        onClick={open}
                                        variant="secondary"
                                        style={{ marginBottom: '10px', width: '100%' }}
                                    >
                                        {eventImageURL ? __('Change Image', 'event') : __('Upload Image', 'event')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>

                        {eventImageURL && (
                            <Button
                                onClick={() => setAttributes({
                                    eventImageURL: '',
                                    eventImageID: null,
                                    eventImageAlt: ''
                                })}
                                variant="secondary"
                                isDestructive
                                style={{ width: '100%' }}
                            >
                                {__('Remove Image', 'event')}
                            </Button>
                        )}
                    </PanelBody>
                    <PanelBody title={__('Container Settings', 'event')} initialOpen={false}>
                        <PanelRow>
                            <div style={{ width: '100%' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Container Background Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={detailsBackgroundColor}
                                    onChange={(color) => setAttributes({ detailsBackgroundColor: color || '#ffffff' })}
                                />
                            </div>
                        </PanelRow>

                    </PanelBody>

                    {/* Read More Settings - Only show if content exists */}
                    {(eventTitle || eventLocation || eventDescription || readMoreURL) && (
                        <PanelBody title={__('Read More Button', 'event')} initialOpen={false}>
                            <TextControl
                                label={__('Button URL', 'event')}
                                value={readMoreURL}
                                onChange={(value) => setAttributes({ readMoreURL: value })}
                                placeholder="https://example.com/event"
                                help={__('Enter the URL for the Read More button', 'event')}
                            />
                            <TextControl
                                label={__('Button Text', 'event')}
                                value={readMoreText}
                                onChange={(value) => setAttributes({ readMoreText: value || 'Read More' })}
                                placeholder="Read More"
                                help={__('Customize the button text', 'event')}
                            />
                        </PanelBody>
                    )}

                    {/* Typography Settings - Title */}
                    <PanelBody title={__('Title Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={titleFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ titleFontFamily: value })}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={titleFontSize || '18px'}
                            onChange={(value) => setAttributes({ titleFontSize: value })}
                            placeholder="18px"
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={titleFontWeight || '600'}
                            options={[
                                { label: '100 - Thin', value: '100' },
                                { label: '200 - Extra Light', value: '200' },
                                { label: '300 - Light', value: '300' },
                                { label: '400 - Regular', value: '400' },
                                { label: '500 - Medium', value: '500' },
                                { label: '600 - Semi Bold', value: '600' },
                                { label: '700 - Bold', value: '700' },
                                { label: '800 - Extra Bold', value: '800' },
                                { label: '900 - Black', value: '900' }
                            ]}
                            onChange={(value) => setAttributes({ titleFontWeight: value })}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={titleLineHeight || '1.3'}
                            onChange={(value) => setAttributes({ titleLineHeight: value })}
                            placeholder="1.3"
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={titleMargin || '4px 0px 6px 0px'}
                            onChange={(value) => setAttributes({ titleMargin: value })}
                            placeholder="4px 0px 6px 0px"
                            help={__('Format: top right bottom left', 'event')}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={titleColor}
                                    onChange={(color) => setAttributes({ titleColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Description */}
                    <PanelBody title={__('Description Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={descriptionFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ descriptionFontFamily: value })}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={descriptionFontSize || '14px'}
                            onChange={(value) => setAttributes({ descriptionFontSize: value })}
                            placeholder="14px"
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={descriptionFontWeight || '400'}
                            options={[
                                { label: '100 - Thin', value: '100' },
                                { label: '200 - Extra Light', value: '200' },
                                { label: '300 - Light', value: '300' },
                                { label: '400 - Regular', value: '400' },
                                { label: '500 - Medium', value: '500' },
                                { label: '600 - Semi Bold', value: '600' },
                                { label: '700 - Bold', value: '700' },
                                { label: '800 - Extra Bold', value: '800' },
                                { label: '900 - Black', value: '900' }
                            ]}
                            onChange={(value) => setAttributes({ descriptionFontWeight: value })}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={descriptionLineHeight || '1.5'}
                            onChange={(value) => setAttributes({ descriptionLineHeight: value })}
                            placeholder="1.5"
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={descriptionMargin || '0 0 12px 0'}
                            onChange={(value) => setAttributes({ descriptionMargin: value })}
                            placeholder="0 0 12px 0"
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={descriptionColor}
                                    onChange={(color) => setAttributes({ descriptionColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Date */}
                    <PanelBody title={__('Date Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={dateFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ dateFontFamily: value })}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={dateFontSize || '21px'}
                            onChange={(value) => setAttributes({ dateFontSize: value })}
                            placeholder="21px"
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={dateFontWeight || '700'}
                            options={[
                                { label: '100 - Thin', value: '100' },
                                { label: '200 - Extra Light', value: '200' },
                                { label: '300 - Light', value: '300' },
                                { label: '400 - Regular', value: '400' },
                                { label: '500 - Medium', value: '500' },
                                { label: '600 - Semi Bold', value: '600' },
                                { label: '700 - Bold', value: '700' },
                                { label: '800 - Extra Bold', value: '800' },
                                { label: '900 - Black', value: '900' }
                            ]}
                            onChange={(value) => setAttributes({ dateFontWeight: value })}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={dateLineHeight || '1'}
                            onChange={(value) => setAttributes({ dateLineHeight: value })}
                            placeholder="1"
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={dateMargin || '0'}
                            onChange={(value) => setAttributes({ dateMargin: value })}
                            placeholder="0"
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Date Border Color', 'event')}
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
                                    {__('Date Background Color', 'event')}
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
                                    {__('Date Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={dateBadgeTextColor}
                                    onChange={(color) => setAttributes({ dateBadgeTextColor: color || '#ffffff' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Weekday */}
                    <PanelBody title={__('Weekday Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={weekdayFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ weekdayFontFamily: value })}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={weekdayFontSize || '12px'}
                            onChange={(value) => setAttributes({ weekdayFontSize: value })}
                            placeholder="12px"
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={weekdayFontWeight || '500'}
                            options={[
                                { label: '100 - Thin', value: '100' },
                                { label: '200 - Extra Light', value: '200' },
                                { label: '300 - Light', value: '300' },
                                { label: '400 - Regular', value: '400' },
                                { label: '500 - Medium', value: '500' },
                                { label: '600 - Semi Bold', value: '600' },
                                { label: '700 - Bold', value: '700' },
                                { label: '800 - Extra Bold', value: '800' },
                                { label: '900 - Black', value: '900' }
                            ]}
                            onChange={(value) => setAttributes({ weekdayFontWeight: value })}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={weekdayLineHeight || '1.2'}
                            onChange={(value) => setAttributes({ weekdayLineHeight: value })}
                            placeholder="1.2"
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={weekdayMargin || '0'}
                            onChange={(value) => setAttributes({ weekdayMargin: value })}
                            placeholder="0"
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={weekdayColor}
                                    onChange={(color) => setAttributes({ weekdayColor: color || '#000000' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Time */}
                    <PanelBody title={__('Time Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={timeFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ timeFontFamily: value })}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={timeFontSize || '14px'}
                            onChange={(value) => setAttributes({ timeFontSize: value })}
                            placeholder="14px"
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={timeFontWeight || '500'}
                            options={[
                                { label: '100 - Thin', value: '100' },
                                { label: '200 - Extra Light', value: '200' },
                                { label: '300 - Light', value: '300' },
                                { label: '400 - Regular', value: '400' },
                                { label: '500 - Medium', value: '500' },
                                { label: '600 - Semi Bold', value: '600' },
                                { label: '700 - Bold', value: '700' },
                                { label: '800 - Extra Bold', value: '800' },
                                { label: '900 - Black', value: '900' }
                            ]}
                            onChange={(value) => setAttributes({ timeFontWeight: value })}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={timeLineHeight || '1.4'}
                            onChange={(value) => setAttributes({ timeLineHeight: value })}
                            placeholder="1.4"
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={timeMargin || '0 0 8px 0'}
                            onChange={(value) => setAttributes({ timeMargin: value })}
                            placeholder="0 0 8px 0"
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={timeColor}
                                    onChange={(color) => setAttributes({ timeColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Location */}
                    <PanelBody title={__('Location Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={locationFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ locationFontFamily: value })}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={locationFontSize || '14px'}
                            onChange={(value) => setAttributes({ locationFontSize: value })}
                            placeholder="14px"
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={locationFontWeight || '400'}
                            options={[
                                { label: '100 - Thin', value: '100' },
                                { label: '200 - Extra Light', value: '200' },
                                { label: '300 - Light', value: '300' },
                                { label: '400 - Regular', value: '400' },
                                { label: '500 - Medium', value: '500' },
                                { label: '600 - Semi Bold', value: '600' },
                                { label: '700 - Bold', value: '700' },
                                { label: '800 - Extra Bold', value: '800' },
                                { label: '900 - Black', value: '900' }
                            ]}
                            onChange={(value) => setAttributes({ locationFontWeight: value })}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={locationLineHeight || '1.5'}
                            onChange={(value) => setAttributes({ locationLineHeight: value })}
                            placeholder="1.5"
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={locationMargin || '0 0 12px 0'}
                            onChange={(value) => setAttributes({ locationMargin: value })}
                            placeholder="0 0 12px 0"
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={locationColor}
                                    onChange={(color) => setAttributes({ locationColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Price */}
                    <PanelBody title={__('Price Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={priceFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ priceFontFamily: value })}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={priceFontSize || '16px'}
                            onChange={(value) => setAttributes({ priceFontSize: value })}
                            placeholder="16px"
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={priceFontWeight || '700'}
                            options={[
                                { label: '100 - Thin', value: '100' },
                                { label: '200 - Extra Light', value: '200' },
                                { label: '300 - Light', value: '300' },
                                { label: '400 - Regular', value: '400' },
                                { label: '500 - Medium', value: '500' },
                                { label: '600 - Semi Bold', value: '600' },
                                { label: '700 - Bold', value: '700' },
                                { label: '800 - Extra Bold', value: '800' },
                                { label: '900 - Black', value: '900' }
                            ]}
                            onChange={(value) => setAttributes({ priceFontWeight: value })}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={priceLineHeight || '1.4'}
                            onChange={(value) => setAttributes({ priceLineHeight: value })}
                            placeholder="1.4"
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={priceMargin || '0'}
                            onChange={(value) => setAttributes({ priceMargin: value })}
                            placeholder="0"
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={priceColor}
                                    onChange={(color) => setAttributes({ priceColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Read More */}
                    <PanelBody title={__('Read More Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={readMoreFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ readMoreFontFamily: value })}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={readMoreFontSize || '13px'}
                            onChange={(value) => setAttributes({ readMoreFontSize: value })}
                            placeholder="13px"
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={readMoreFontWeight || '500'}
                            options={[
                                { label: '100 - Thin', value: '100' },
                                { label: '200 - Extra Light', value: '200' },
                                { label: '300 - Light', value: '300' },
                                { label: '400 - Regular', value: '400' },
                                { label: '500 - Medium', value: '500' },
                                { label: '600 - Semi Bold', value: '600' },
                                { label: '700 - Bold', value: '700' },
                                { label: '800 - Extra Bold', value: '800' },
                                { label: '900 - Black', value: '900' }
                            ]}
                            onChange={(value) => setAttributes({ readMoreFontWeight: value })}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={readMoreLineHeight || '1.4'}
                            onChange={(value) => setAttributes({ readMoreLineHeight: value })}
                            placeholder="1.4"
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={readMoreMargin || '0'}
                            onChange={(value) => setAttributes({ readMoreMargin: value })}
                            placeholder="0"
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Background Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={readMoreButtonColor}
                                    onChange={(color) => setAttributes({ readMoreButtonColor: color || '#4169E1' })}
                                />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={readMoreColor}
                                    onChange={(color) => setAttributes({ readMoreColor: color || '#ffffff' })}
                                />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Hover Background Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={readMoreButtonHoverColor}
                                    onChange={(color) => setAttributes({ readMoreButtonHoverColor: color || '#2667FF' })}
                                />
                            </div>
                        </PanelRow>

                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Hover Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={readMoreButtonHoverTextColor}
                                    onChange={(color) => setAttributes({ readMoreButtonHoverTextColor: color || '#ffffff' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>
                </InspectorControls>

            
                    <div {...blockProps}>
                        {/* Event Card */}
                        <div className="evt-event-card">
                            {/* Event Image */}
                            <div className="evt-event-image">
                                {eventImageURL ? (
                                    <img src={eventImageURL} alt={eventImageAlt || eventTitle} />
                                ) : (
                                    <div className="evt-event-image-placeholder">
                                        <MediaUploadCheck>
                                            <MediaUpload
                                                onSelect={(media) => {
                                                    setAttributes({
                                                        eventImageURL: media.url,
                                                        eventImageID: media.id,
                                                        eventImageAlt: media.alt
                                                    });
                                                }}
                                                allowedTypes={['image']}
                                                value={eventImageID}
                                                render={({ open }) => (
                                                    <Button onClick={open} variant="primary">
                                                        {__('Add Image', 'event')}
                                                    </Button>
                                                )}
                                            />
                                        </MediaUploadCheck>
                                    </div>
                                )}
                            </div>

                            {/* Event Details */}
                            <div className="evt-event-details">
                                    <div className="evt-event-date-badge-container">
                                            {/* Date Badge Overlay */}
                                            {eventDate && (
                                                <>
                                                <div className="evt-border-badge">
                                                    <div className="evt-event-date-badge">
                                                        <span className="evt-date-day">{dateParts.day}</span>
                                                        <span className="evt-date-month">{dateParts.month}</span>
                                                    </div>
                                                </div>
                                                <span className="evt-date-weekday">{eventDay || dateParts.dayName}</span>
                                                </>
                                            )}
                                    </div>
                                <div className="evt-event-details-inner">
                                            {eventDate && (
                                                <div className="evt-event-time">
                                                    <span className="evt-time-icon">🕐</span>
                                                    <span>
                                                        {dateParts.time}
                                                        {eventEndDate && ` - ${dateI18n('g:i a', eventEndDate)}`}
                                                    </span>
                                                </div>
                                            )}
                                            <RichText
                                                tagName="h4"
                                                className="evt-event-title"
                                                value={eventTitle}
                                                onChange={(value) => setAttributes({ eventTitle: value })}
                                                placeholder={__('Event Title', 'event')}
                                            />

                                            <RichText
                                                tagName="div"
                                                className="evt-event-description"
                                                value={eventDescription}
                                                onChange={(value) => setAttributes({ eventDescription: value })}
                                                placeholder={__('Event Description', 'event')}
                                            />

                                            <RichText
                                                tagName="div"
                                                className="evt-event-location"
                                                value={eventLocation}
                                                onChange={(value) => setAttributes({ eventLocation: value })}
                                                placeholder={__('Event Location', 'event')}
                                            />

                                        <div className="evt-price-read-more">
                                            {eventPrice && (
                                                <div className="evt-event-price">
                                                    {eventPrice}
                                                </div>
                                            )}

                                            {/* Read More Button - Only show if URL is set */}
                                            {readMoreURL && (
                                                <div className="evt-event-read-more">
                                                    <a href={readMoreURL} target="_blank">
                                                        {readMoreText || __('Read More', 'event')}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const {
            eventTitle,
            eventDescription,
            eventLocation,
            eventDate,
            eventEndDate,
            eventPrice,
            eventDay,
            eventImageURL,
            eventImageAlt,
            detailsBackgroundColor,
            // Typography - Title
            titleFontSize,
            titleFontWeight,
            titleLineHeight,
            titleMargin,
            titleColor,
            titleFontFamily,
            // Typography - Description
            descriptionFontSize,
            descriptionFontWeight,
            descriptionLineHeight,
            descriptionMargin,
            descriptionColor,
            descriptionFontFamily,
            // Typography - Date
            borderBadgeColor,
            dateBadgeBackgroundColor,
            dateBadgeTextColor,
            dateFontSize,
            dateFontWeight,
            dateLineHeight,
            dateMargin,
            dateFontFamily,
            // Typography - Weekday
            weekdayFontSize,
            weekdayFontWeight,
            weekdayLineHeight,
            weekdayMargin,
            weekdayColor,
            weekdayFontFamily,
            // Typography - Time
            timeFontSize,
            timeFontWeight,
            timeLineHeight,
            timeMargin,
            timeColor,
            timeFontFamily,
            // Typography - Location
            locationFontSize,
            locationFontWeight,
            locationLineHeight,
            locationMargin,
            locationColor,
            locationFontFamily,
            // Typography - Price
            priceFontSize,
            priceFontWeight,
            priceLineHeight,
            priceMargin,
            priceColor,
            priceFontFamily,
            // Typography - Read More
            readMoreURL,
            readMoreText,
            readMoreButtonColor,
            readMoreButtonHoverColor,
            readMoreButtonHoverTextColor,
            readMoreFontSize,
            readMoreFontWeight,
            readMoreLineHeight,
            readMoreMargin,
            readMoreColor,
            readMoreFontFamily
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'evt-event-item',
            style: {
                '--evt-details-bg': detailsBackgroundColor || '#ffffff',
                // Typography CSS Variables
                '--evt-title-font-size': titleFontSize || '18px',
                '--evt-title-font-weight': titleFontWeight || '600',
                '--evt-title-line-height': titleLineHeight || '1.3',
                '--evt-title-margin': titleMargin || '4px 0px 6px 0px',
                '--evt-title-color': titleColor || '#1a1a1a',
                '--evt-title-font-family': titleFontFamily || 'Inter',
                '--evt-description-font-size': descriptionFontSize || '14px',
                '--evt-description-font-weight': descriptionFontWeight || '400',
                '--evt-description-line-height': descriptionLineHeight || '1.5',
                '--evt-description-margin': descriptionMargin || '0 0 12px 0',
                '--evt-description-color': descriptionColor || '#1a1a1a',
                '--evt-description-font-family': descriptionFontFamily || 'Inter',
                '--evt-border-color': borderBadgeColor || '#00000040',
                '--evt-date-badge-bg': dateBadgeBackgroundColor || '#2667FF',
                '--evt-date-badge-text': dateBadgeTextColor || '#ffffff',
                '--evt-date-font-size': dateFontSize || '21px',
                '--evt-date-font-weight': dateFontWeight || '700',
                '--evt-date-line-height': dateLineHeight || '1',
                '--evt-date-margin': dateMargin || '0',
                '--evt-date-font-family': dateFontFamily || 'Inter',
                '--evt-weekday-font-size': weekdayFontSize || '12px',
                '--evt-weekday-font-weight': weekdayFontWeight || '500',
                '--evt-weekday-line-height': weekdayLineHeight || '1.2',
                '--evt-weekday-margin': weekdayMargin || '0',
                '--evt-weekday-color': weekdayColor || '#000000',
                '--evt-weekday-font-family': weekdayFontFamily || 'Inter',
                '--evt-time-font-size': timeFontSize || '14px',
                '--evt-time-font-weight': timeFontWeight || '500',
                '--evt-time-line-height': timeLineHeight || '1.4',
                '--evt-time-margin': timeMargin || '0 0 8px 0',
                '--evt-time-color': timeColor || '#1a1a1a',
                '--evt-time-font-family': timeFontFamily || 'Inter',
                '--evt-location-font-size': locationFontSize || '14px',
                '--evt-location-font-weight': locationFontWeight || '400',
                '--evt-location-line-height': locationLineHeight || '1.5',
                '--evt-location-margin': locationMargin || '0 0 12px 0',
                '--evt-location-color': locationColor || '#1a1a1a',
                '--evt-location-font-family': locationFontFamily || 'Inter',
                '--evt-price-font-size': priceFontSize || '16px',
                '--evt-price-font-weight': priceFontWeight || '700',
                '--evt-price-line-height': priceLineHeight || '1.4',
                '--evt-price-margin': priceMargin || '0',
                '--evt-price-color': priceColor || '#1a1a1a',
                '--evt-price-font-family': priceFontFamily || 'Inter',
                '--evt-read-more-button-color': readMoreButtonColor || '#4169E1',
                '--evt-read-more-button-hover-color': readMoreButtonHoverColor || '#2667FF',
                '--evt-read-more-button-hover-text-color': readMoreButtonHoverTextColor || '#ffffff',
                '--evt-readmore-font-size': readMoreFontSize || '13px',
                '--evt-readmore-font-weight': readMoreFontWeight || '500',
                '--evt-readmore-line-height': readMoreLineHeight || '1.4',
                '--evt-readmore-margin': readMoreMargin || '0',
                '--evt-readmore-color': readMoreColor || '#ffffff',
                '--evt-readmore-font-family': readMoreFontFamily || 'Inter'
            }
        });

        // Get formatted date parts
        const getDateParts = (dateString) => {
            if (!dateString) return { month: '', day: '', time: '', dayName: '' };
            
            try {
                return {
                    month: dateI18n('M', dateString),
                    day: dateI18n('d', dateString), // 'd' for leading zero (01-31)
                    time: dateI18n('g:i a', dateString),
                    dayName: dateI18n('D', dateString).toUpperCase()
                };
            } catch (e) {
                return { month: '', day: '', time: '', dayName: '' };
            }
        };

        const dateParts = getDateParts(eventDate);
        const endTime = eventEndDate ? dateI18n('g:i a', eventEndDate) : '';

        return (
            <div {...blockProps}>
                <div className="evt-event-card">
                    {/* Event Image */}
                    {eventImageURL && (
                        <div className="evt-event-image">
                            <img src={eventImageURL} alt={eventImageAlt || eventTitle} />
                        </div>
                    )}

                    {/* Event Details */}
                    <div className="evt-event-details">
                        <div className="evt-event-date-badge-container">
                            {/* Date Badge Overlay */}
                            {eventDate && (
                                     <>
                                     <div className="evt-border-badge">
                                        <div className="evt-event-date-badge">
                                            <span className="evt-date-day">{dateParts.day}</span>
                                            <span className="evt-date-month">{dateParts.month}</span>
                                        </div>
                                    </div>
                                     <span className="evt-date-weekday">{eventDay || dateParts.dayName}</span>
                                     </>
                            )}
                        </div>
                        <div className="evt-event-details-inner">
                                    {eventDate && (
                                        <div className="evt-event-time">
                                            <span className="evt-time-icon">🕐</span>
                                            <span>
                                                {dateParts.time}
                                                {endTime && ` - ${endTime}`}
                                            </span>
                                        </div>
                                    )}

                            {eventTitle && (
                                <RichText.Content
                                    tagName="h4"
                                    className="evt-event-title"
                                    value={eventTitle}
                                />
                            )}

                            {eventDescription && (
                                <RichText.Content
                                    tagName="div"
                                    className="evt-event-description"
                                    value={eventDescription}
                                />
                            )}

                            {eventLocation && (
                                <RichText.Content
                                    tagName="div"
                                    className="evt-event-location"
                                    value={eventLocation}
                                />
                            )}
                            <div className="evt-price-read-more">
                                {eventPrice && (
                                    <div className="evt-event-price">
                                        {eventPrice}
                                    </div>
                                )}

                                {/* Read More Button - Only show if URL is set */}
                                {readMoreURL && (
                                    <div className="evt-event-read-more">
                                        <a href={readMoreURL} target="_blank">
                                            {readMoreText || __('Read More', 'event')}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
