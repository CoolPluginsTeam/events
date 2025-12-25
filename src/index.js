import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck, RichText, useBlockProps, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, DateTimePicker, PanelRow, SelectControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dateI18n, format, getSettings } from '@wordpress/date';
import { useEffect } from '@wordpress/element';

// CSS Generation Helper Function
const evtGenerateBlockCSS = (attributes, blockId) => {
    const {
        detailsBackgroundColor,
        
        // Title Settings
        titleFontSize,
        titleFontWeight,
        titleLineHeight,
        titleMargin,
        titleColor,
        titleFontFamily,
        // Description Settings
        descriptionFontSize,
        descriptionFontWeight,
        descriptionLineHeight,
        descriptionMargin,
        descriptionColor,
        descriptionFontFamily,
        // Date Settings
        borderBadgeColor,
        dateBadgeBackgroundColor,
        dateBadgeTextColor,
        dateFontSize,
        dateFontWeight,
        dateLineHeight,
        dateMargin,
        dateFontFamily,
        // Weekday Settings
        weekdayFontSize,
        weekdayFontWeight,
        weekdayLineHeight,
        weekdayMargin,
        weekdayColor,
        weekdayFontFamily,
        // Month Settings
        monthFontSize,
        monthFontWeight,
        monthLineHeight,
        monthMargin,
        monthColor,
        monthFontFamily,
        // Time Settings
        timeFontSize,
        timeFontWeight,
        timeLineHeight,
        timeMargin,
        timeColor,
        timeFontFamily,
        // Location Settings
        locationFontSize,
        locationFontWeight,
        locationLineHeight,
        locationMargin,
        locationColor,
        locationFontFamily,
        // Price Settings
        priceFontSize,
        priceFontWeight,
        priceLineHeight,
        priceMargin,
        priceColor,
        priceFontFamily,
        // Read More Settings
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

    const selector = `#block-${blockId}`;
    
    return `
        ${selector} .evt-event-card {
            background-color: ${detailsBackgroundColor || '#ffffff'};
        }
        ${selector} .evt-border-badge {
            border: 1px solid ${borderBadgeColor || '#00000040'};
        }
        ${selector} .evt-event-date-badge {
            background-color: ${dateBadgeBackgroundColor || '#2667FF'};
        }
        ${selector} .evt-event-title {
            font-size: ${titleFontSize || '18px'};
            font-weight: ${titleFontWeight || '600'};
            line-height: ${titleLineHeight || '1.3'};
            margin: ${titleMargin || '4px 0px 6px 0px'};
            color: ${titleColor || '#1a1a1a'};
            font-family: ${titleFontFamily || 'Inter'};
        }
        ${selector} .evt-event-description {
            font-size: ${descriptionFontSize || '14px'};
            font-weight: ${descriptionFontWeight || '400'};
            line-height: ${descriptionLineHeight || '1.5'};
            margin: ${descriptionMargin || '0 0 12px 0'};
            color: ${descriptionColor || '#1a1a1a'};
            font-family: ${descriptionFontFamily || 'Inter'};
        }
        ${selector} .evt-date-day {
            font-size: ${dateFontSize || '21px'};
            font-weight: ${dateFontWeight || '700'};
            line-height: ${dateLineHeight || '1'};
            margin: ${dateMargin || '0'};
            color: ${dateBadgeTextColor || '#ffffff'};
            font-family: ${dateFontFamily || 'Inter'};
        }
        ${selector} .evt-date-weekday {
            font-size: ${weekdayFontSize || '12px'};
            font-weight: ${weekdayFontWeight || '500'};
            line-height: ${weekdayLineHeight || '1.2'};
            margin: ${weekdayMargin || '0'};
            color: ${weekdayColor || '#000000'};
            font-family: ${weekdayFontFamily || 'Inter'};
        }
        ${selector} .evt-date-month {
            font-size: ${monthFontSize || '11px'};
            font-weight: ${monthFontWeight || '600'};
            line-height: ${monthLineHeight || '1.2'};
            margin: ${monthMargin || '0'};
            color: ${monthColor || '#ffffff'};
            font-family: ${monthFontFamily || 'Inter'};
        }
        ${selector} .evt-event-time,
        ${selector} .evt-event-time i.evt-time-icon{
            font-size: ${timeFontSize || '14px'};
            font-weight: ${timeFontWeight || '500'};
            line-height: ${timeLineHeight || '1.4'};
            margin: ${timeMargin || '0'};
            color: ${timeColor || '#1a1a1a'};
            font-family: ${timeFontFamily || 'Inter'};
        }
        ${selector} .evt-event-location {
            font-size: ${locationFontSize || '14px'};
            font-weight: ${locationFontWeight || '400'};
            line-height: ${locationLineHeight || '1.5'};
            margin: ${locationMargin || '0 0 12px 0'};
            color: ${locationColor || '#1a1a1a'};
            font-family: ${locationFontFamily || 'Inter'};
        }
        ${selector} .evt-event-price {
            font-size: ${priceFontSize || '16px'};
            font-weight: ${priceFontWeight || '700'};
            line-height: ${priceLineHeight || '1.4'};
            margin: ${priceMargin || '0'};
            color: ${priceColor || '#1a1a1a'};
            font-family: ${priceFontFamily || 'Inter'};
        }
        ${selector} .evt-event-read-more {
            background-color: ${readMoreButtonColor || '#2667FF'};
            font-size: ${readMoreFontSize || '13px'};
            font-weight: ${readMoreFontWeight || '500'};
            line-height: ${readMoreLineHeight || '1.4'};
            margin: ${readMoreMargin || '0'};
            font-family: ${readMoreFontFamily || 'Inter'};
        }
        ${selector} .evt-event-read-more,
        ${selector} .evt-event-read-more a {
            color: ${readMoreColor || '#ffffff'};
        }
        ${selector} .evt-event-read-more:hover {
            background-color: ${readMoreButtonHoverColor || '#2667FF'};
        }
        ${selector} .evt-event-read-more a:hover {
            color: ${readMoreButtonHoverTextColor || '#ffffff'};
        }
    `.trim();
};

// Font Families List (100 fonts)
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

// PARENT BLOCK: Events Grid Container
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
            default: 2
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({
            className: 'evt-events-grid-container'
        });

        const ALLOWED_BLOCKS = ['evt/event-item'];
        
        // Template with 3 default events
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

// CHILD BLOCK: Individual Event Item
registerBlockType('evt/event-item', {
    title: __('Event Item', 'event'),
    description: __('Single event card with image, date, and details', 'event'),
    icon: eventIcon,
    category: 'widgets',
    parent: ['evt/events-grid'],
    
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
        // Typography Settings - Month
        monthFontSize: {
            type: 'string',
            default: '11px'
        },
        monthFontWeight: {
            type: 'string',
            default: '600'
        },
        monthLineHeight: {
            type: 'string',
            default: '1.2'
        },
        monthMargin: {
            type: 'string',
            default: '0'
        },
        monthColor: {
            type: 'string',
            default: '#ffffff'
        },
        monthFontFamily: {
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
            default: '0'
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

    edit: ({ attributes, setAttributes, clientId }) => {
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
            readMoreURL,
            readMoreText
        } = attributes;

        const blockProps = useBlockProps({
            className: 'evt-event-item',
            id: `block-${clientId}`
        });

        // Save clientId to attributes for PHP rendering
        useEffect(() => {
            if (!attributes.evtBlockId) {
                setAttributes({ evtBlockId: clientId });
            }
        }, []);

        // Inject scoped CSS for this block
        useEffect(() => {
            const styleId = `evt-block-style-${clientId}`;
            let styleElement = document.getElementById(styleId);
            
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }
            
            styleElement.innerHTML = evtGenerateBlockCSS(attributes, clientId);
            
            return () => {
                // Cleanup on unmount
                const el = document.getElementById(styleId);
                if (el) {
                    el.remove();
                }
            };
        }, [attributes, clientId]);

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
                                __next40pxDefaultSize={true}
                                __nextHasNoMarginBottom={true}
                            />
                            <TextControl
                                label={__('Button Text', 'event')}
                                value={readMoreText}
                                onChange={(value) => setAttributes({ readMoreText: value || 'Read More' })}
                                placeholder="Read More"
                                help={__('Customize the button text', 'event')}
                                __next40pxDefaultSize={true}
                                __nextHasNoMarginBottom={true}
                            />
                        </PanelBody>
                    )}

                    {/* Typography Settings - Title */}
                    <PanelBody title={__('Title Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.titleFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ titleFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.titleFontSize || '18px'}
                            onChange={(value) => setAttributes({ titleFontSize: value })}
                            placeholder="18px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.titleFontWeight || '600'}
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
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.titleLineHeight || '1.3'}
                            onChange={(value) => setAttributes({ titleLineHeight: value })}
                            placeholder="1.3"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.titleMargin || '4px 0px 6px 0px'}
                            onChange={(value) => setAttributes({ titleMargin: value })}
                            placeholder="4px 0px 6px 0px"
                            help={__('Format: top right bottom left', 'event')}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.titleColor}
                                    onChange={(color) => setAttributes({ titleColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Description */}
                    <PanelBody title={__('Description Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.descriptionFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ descriptionFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.descriptionFontSize || '14px'}
                            onChange={(value) => setAttributes({ descriptionFontSize: value })}
                            placeholder="14px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.descriptionFontWeight || '400'}
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
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.descriptionLineHeight || '1.5'}
                            onChange={(value) => setAttributes({ descriptionLineHeight: value })}
                            placeholder="1.5"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.descriptionMargin || '0 0 12px 0'}
                            onChange={(value) => setAttributes({ descriptionMargin: value })}
                            placeholder="0 0 12px 0"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.descriptionColor}
                                    onChange={(color) => setAttributes({ descriptionColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Date */}
                    <PanelBody title={__('Day Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.dateFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ dateFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.dateFontSize || '21px'}
                            onChange={(value) => setAttributes({ dateFontSize: value })}
                            placeholder="21px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.dateFontWeight || '700'}
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
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.dateLineHeight || '1'}
                            onChange={(value) => setAttributes({ dateLineHeight: value })}
                            placeholder="1"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.dateMargin || '0'}
                            onChange={(value) => setAttributes({ dateMargin: value })}
                            placeholder="0"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Border Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.borderBadgeColor}
                                    onChange={(color) => setAttributes({ borderBadgeColor: color || '#00000040' })}
                                />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Background Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.dateBadgeBackgroundColor}
                                    onChange={(color) => setAttributes({ dateBadgeBackgroundColor: color || '#2667FF' })}
                                />
                            </div>
                        </PanelRow>
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.dateBadgeTextColor}
                                    onChange={(color) => setAttributes({ dateBadgeTextColor: color || '#ffffff' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                     {/* Typography Settings - Month */}
                     <PanelBody title={__('Month Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.monthFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ monthFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.monthFontSize || '11px'}
                            onChange={(value) => setAttributes({ monthFontSize: value })}
                            placeholder="11px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.monthFontWeight || '600'}
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
                            onChange={(value) => setAttributes({ monthFontWeight: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.monthLineHeight || '1.2'}
                            onChange={(value) => setAttributes({ monthLineHeight: value })}
                            placeholder="1.2"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.monthMargin || '0'}
                            onChange={(value) => setAttributes({ monthMargin: value })}
                            placeholder="0"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.monthColor}
                                    onChange={(color) => setAttributes({ monthColor: color || '#ffffff' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Weekday */}
                    <PanelBody title={__('Weekday Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.weekdayFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ weekdayFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.weekdayFontSize || '12px'}
                            onChange={(value) => setAttributes({ weekdayFontSize: value })}
                            placeholder="12px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.weekdayFontWeight || '500'}
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
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.weekdayLineHeight || '1.2'}
                            onChange={(value) => setAttributes({ weekdayLineHeight: value })}
                            placeholder="1.2"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.weekdayMargin || '0'}
                            onChange={(value) => setAttributes({ weekdayMargin: value })}
                            placeholder="0"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.weekdayColor}
                                    onChange={(color) => setAttributes({ weekdayColor: color || '#000000' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Time */}
                    <PanelBody title={__('Time Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.timeFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ timeFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.timeFontSize || '14px'}
                            onChange={(value) => setAttributes({ timeFontSize: value })}
                            placeholder="14px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.timeFontWeight || '500'}
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
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.timeLineHeight || '1.4'}
                            onChange={(value) => setAttributes({ timeLineHeight: value })}
                            placeholder="1.4"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.timeMargin || '0 0 8px 0'}
                            onChange={(value) => setAttributes({ timeMargin: value })}
                            placeholder="0"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.timeColor}
                                    onChange={(color) => setAttributes({ timeColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Location */}
                    <PanelBody title={__('Location Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.locationFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ locationFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.locationFontSize || '14px'}
                            onChange={(value) => setAttributes({ locationFontSize: value })}
                            placeholder="14px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.locationFontWeight || '400'}
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
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.locationLineHeight || '1.5'}
                            onChange={(value) => setAttributes({ locationLineHeight: value })}
                            placeholder="1.5"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.locationMargin || '0 0 12px 0'}
                            onChange={(value) => setAttributes({ locationMargin: value })}
                            placeholder="0 0 12px 0"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.locationColor}
                                    onChange={(color) => setAttributes({ locationColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Price */}
                    <PanelBody title={__('Price Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.priceFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ priceFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.priceFontSize || '16px'}
                            onChange={(value) => setAttributes({ priceFontSize: value })}
                            placeholder="16px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.priceFontWeight || '700'}
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
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.priceLineHeight || '1.4'}
                            onChange={(value) => setAttributes({ priceLineHeight: value })}
                            placeholder="1.4"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.priceMargin || '0'}
                            onChange={(value) => setAttributes({ priceMargin: value })}
                            placeholder="0"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Text Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.priceColor}
                                    onChange={(color) => setAttributes({ priceColor: color || '#1a1a1a' })}
                                />
                            </div>
                        </PanelRow>
                    </PanelBody>

                    {/* Typography Settings - Read More */}
                    <PanelBody title={__('Read More Typography', 'event')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Family', 'event')}
                            value={attributes.readMoreFontFamily || 'Inter'}
                            options={FONT_FAMILIES}
                            onChange={(value) => setAttributes({ readMoreFontFamily: value })}
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Font Size', 'event')}
                            value={attributes.readMoreFontSize || '13px'}
                            onChange={(value) => setAttributes({ readMoreFontSize: value })}
                            placeholder="13px"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <SelectControl
                            label={__('Font Weight', 'event')}
                            value={attributes.readMoreFontWeight || '500'}
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
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Line Height', 'event')}
                            value={attributes.readMoreLineHeight || '1.4'}
                            onChange={(value) => setAttributes({ readMoreLineHeight: value })}
                            placeholder="1.4"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <TextControl
                            label={__('Margin', 'event')}
                            value={attributes.readMoreMargin || '0'}
                            onChange={(value) => setAttributes({ readMoreMargin: value })}
                            placeholder="0"
                            __next40pxDefaultSize={true}
                            __nextHasNoMarginBottom={true}
                        />
                        <PanelRow>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                                    {__('Background Color', 'event')}
                                </label>
                                <ColorPalette
                                    value={attributes.readMoreButtonColor}
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
                                    value={attributes.readMoreColor}
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
                                    value={attributes.readMoreButtonHoverColor}
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
                                    value={attributes.readMoreButtonHoverTextColor}
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
                                                    <i className="clockicon-evt evt-time-icon"></i>
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
            readMoreURL,
            readMoreText,
            evtBlockId
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `evt-event-item${evtBlockId ? ' evt-block-' + evtBlockId : ''}`
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
                                                    <i className="clockicon-evt evt-time-icon"></i>
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
