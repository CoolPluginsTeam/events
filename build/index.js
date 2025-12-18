/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/date":
/*!******************************!*\
  !*** external ["wp","date"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["date"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_5__);







// Icon for the blocks
const eventIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19.5,19c0,0.3-0.2,0.5-0.5,0.5H5 c-0.3,0-0.5-0.2-0.5-0.5V7h15V19z M17,13h-4v4h4V13z"
}));

// ============================================
// PARENT BLOCK: Events Grid Container
// ============================================
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('evt/events-grid', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Events Grid', 'event'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Display multiple events in a modern grid layout', 'event'),
  icon: eventIcon,
  category: 'widgets',
  supports: {
    align: ['wide', 'full'],
    html: false
  },
  attributes: {
    columns: {
      type: 'number',
      default: 3
    }
  },
  edit: ({
    attributes,
    setAttributes
  }) => {
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'evt-events-grid-container'
    });
    const ALLOWED_BLOCKS = ['evt/event-item'];

    // Template with 3 default events
    const TEMPLATE = [['evt/event-item', {
      eventTitle: 'Crazy DJ Experience Santa Cruz',
      eventDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      eventLocation: 'JW Marriott, Sector 35',
      eventDate: '2026-01-06T16:00:00',
      eventPrice: '$25.00',
      eventDay: 'TUE',
      eventImageURL: 'assets/images/crazy-DJ-experience-santa-cruz.webp'
    }], ['evt/event-item', {
      eventTitle: 'Cute Girls Rock Band Performance',
      eventDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      eventLocation: 'Club XYZ, Sector 17',
      eventDate: '2026-04-04T18:30:00',
      eventPrice: '$20.00',
      eventDay: 'SAT',
      eventImageURL: 'assets/images/cute-girls-rock-band-performance.webp'
    }], ['evt/event-item', {
      eventTitle: 'Free Food Distribution At Mumbai',
      eventDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      eventLocation: 'Food Corp. Mumbai, Ft. Line',
      eventDate: '2026-06-08T19:00:00',
      eventPrice: '$15.00',
      eventDay: 'MON',
      eventImageURL: 'assets/images/free-food-distribution-at-mumbai.webp'
    }]];
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Grid Settings', 'event')
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Columns', 'event'),
      type: "number",
      value: attributes.columns,
      onChange: value => setAttributes({
        columns: parseInt(value)
      }),
      min: 1,
      max: 4,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Number of columns in the grid (1-4)', 'event'),
      __nextHasNoMarginBottom: true,
      __next40pxDefaultSize: true
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps,
      style: {
        '--columns': attributes.columns
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks, {
      allowedBlocks: ALLOWED_BLOCKS,
      template: TEMPLATE,
      renderAppender: () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.ButtonBlockAppender, null)
    })));
  },
  save: ({
    attributes
  }) => {
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
      className: 'evt-events-grid-container',
      style: {
        '--columns': attributes.columns
      }
    });
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InnerBlocks.Content, null));
  }
});

// ============================================
// CHILD BLOCK: Individual Event Item
// ============================================
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)('evt/event-item', {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Event Item', 'event'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Single event card with image, date, and details', 'event'),
  icon: eventIcon,
  category: 'widgets',
  parent: ['evt/events-grid'],
  // Can only be added inside events-grid

  supports: {
    reusable: false,
    html: false
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
    // Color Settings
    detailsBackgroundColor: {
      type: 'string',
      default: '#ffffff'
    },
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
    weekdayTextColor: {
      type: 'string',
      default: '#000000'
    },
    detailsTextColor: {
      type: 'string',
      default: '#1a1a1a'
    },
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
    readMoreButtonTextColor: {
      type: 'string',
      default: '#ffffff'
    },
    readMoreButtonHoverColor: {
      type: 'string',
      default: '#2667FF'
    },
    readMoreButtonHoverTextColor: {
      type: 'string',
      default: '#ffffff'
    }
  },
  edit: ({
    attributes,
    setAttributes
  }) => {
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
      borderBadgeColor,
      dateBadgeBackgroundColor,
      dateBadgeTextColor,
      detailsTextColor,
      weekdayTextColor,
      readMoreURL,
      readMoreText,
      readMoreButtonColor,
      readMoreButtonTextColor,
      readMoreButtonHoverColor,
      readMoreButtonHoverTextColor
    } = attributes;
    const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'evt-event-item',
      style: {
        '--evt-details-bg': detailsBackgroundColor || '#ffffff',
        '--evt-border-color': borderBadgeColor || '#00000040',
        '--evt-date-badge-bg': dateBadgeBackgroundColor || '#2667FF',
        '--evt-date-badge-text': dateBadgeTextColor || '#ffffff',
        '--evt-details-text': detailsTextColor || '#1a1a1a',
        '--evt-weekday-text': weekdayTextColor || '#000000',
        '--evt-read-more-button-color': readMoreButtonColor || '#4169E1',
        '--evt-read-more-button-text-color': readMoreButtonTextColor || '#ffffff',
        '--evt-read-more-button-hover-color': readMoreButtonHoverColor || '#2667FF',
        '--evt-read-more-button-hover-text-color': readMoreButtonHoverTextColor || '#ffffff'
      }
    });

    // Get formatted date parts
    const getDateParts = dateString => {
      if (!dateString) return {
        month: '',
        day: '',
        time: '',
        dayName: ''
      };
      try {
        const date = new Date(dateString);
        return {
          month: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('M', dateString),
          day: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('d', dateString),
          // 'd' for leading zero (01-31)
          time: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('g:i a', dateString),
          dayName: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('D', dateString).toUpperCase()
        };
      } catch (e) {
        return {
          month: '',
          day: '',
          time: '',
          dayName: ''
        };
      }
    };
    const dateParts = getDateParts(eventDate);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Event Details', 'event')
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        marginBottom: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Start Date & Time', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.DateTimePicker, {
      currentDate: eventDate || new Date().toISOString(),
      onChange: newDate => {
        setAttributes({
          eventDate: newDate
        });
        // Auto-update day name
        const dayName = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('D', newDate).toUpperCase();
        setAttributes({
          eventDay: dayName
        });
      }
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        marginBottom: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('End Date & Time', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.DateTimePicker, {
      currentDate: eventEndDate || eventDate || new Date().toISOString(),
      onChange: newDate => setAttributes({
        eventEndDate: newDate
      })
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Price', 'event'),
      value: eventPrice,
      onChange: value => setAttributes({
        eventPrice: value
      }),
      placeholder: "$25.00",
      __nextHasNoMarginBottom: true,
      __next40pxDefaultSize: true
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Day Label', 'event'),
      value: eventDay || dateParts.dayName,
      onChange: value => setAttributes({
        eventDay: value
      }),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('e.g., MON, TUE, FRI', 'event'),
      __nextHasNoMarginBottom: true,
      __next40pxDefaultSize: true
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Color Settings', 'event'),
      initialOpen: false
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Container Background Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: detailsBackgroundColor,
      onChange: color => setAttributes({
        detailsBackgroundColor: color || '#ffffff'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Date Border Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: borderBadgeColor,
      onChange: color => setAttributes({
        borderBadgeColor: color || '#00000040'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Date Background Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: dateBadgeBackgroundColor,
      onChange: color => setAttributes({
        dateBadgeBackgroundColor: color || '#2667FF'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Date Text Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: dateBadgeTextColor,
      onChange: color => setAttributes({
        dateBadgeTextColor: color || '#ffffff'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Weekday Text Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: weekdayTextColor,
      onChange: color => setAttributes({
        weekdayTextColor: color || '#000000'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Details Text Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: detailsTextColor,
      onChange: color => setAttributes({
        detailsTextColor: color || '#1a1a1a'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Read More Button Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: readMoreButtonColor,
      onChange: color => setAttributes({
        readMoreButtonColor: color || '#4169E1'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Read More Button Text Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: readMoreButtonTextColor,
      onChange: color => setAttributes({
        readMoreButtonTextColor: color || '#ffffff'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Read More Button Hover Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: readMoreButtonHoverColor,
      onChange: color => setAttributes({
        readMoreButtonHoverColor: color || '#2667FF'
      })
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '100%',
        marginTop: '16px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      style: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Read More Button Hover Text Color', 'event')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: readMoreButtonHoverTextColor,
      onChange: color => setAttributes({
        readMoreButtonHoverTextColor: color || '#ffffff'
      })
    })))), (eventTitle || eventLocation || eventDescription || readMoreURL) && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Read More Button', 'event'),
      initialOpen: false
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Button URL', 'event'),
      value: readMoreURL,
      onChange: value => setAttributes({
        readMoreURL: value
      }),
      placeholder: "https://example.com/event",
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Enter the URL for the Read More button', 'event')
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Button Text', 'event'),
      value: readMoreText,
      onChange: value => setAttributes({
        readMoreText: value || 'Read More'
      }),
      placeholder: "Read More",
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Customize the button text', 'event')
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Image Settings', 'event'),
      initialOpen: false
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUploadCheck, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUpload, {
      onSelect: media => {
        setAttributes({
          eventImageURL: media.url,
          eventImageID: media.id,
          eventImageAlt: media.alt
        });
      },
      allowedTypes: ['image'],
      value: eventImageID,
      render: ({
        open
      }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        onClick: open,
        variant: "secondary",
        style: {
          marginBottom: '10px',
          width: '100%'
        }
      }, eventImageURL ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Change Image', 'event') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Upload Image', 'event'))
    })), eventImageURL && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
      onClick: () => setAttributes({
        eventImageURL: '',
        eventImageID: null,
        eventImageAlt: ''
      }),
      variant: "secondary",
      isDestructive: true,
      style: {
        width: '100%'
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Remove Image', 'event')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-card"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-image"
    }, eventImageURL ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: eventImageURL,
      alt: eventImageAlt || eventTitle
    }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-image-placeholder"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUploadCheck, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.MediaUpload, {
      onSelect: media => {
        setAttributes({
          eventImageURL: media.url,
          eventImageID: media.id,
          eventImageAlt: media.alt
        });
      },
      allowedTypes: ['image'],
      value: eventImageID,
      render: ({
        open
      }) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        onClick: open,
        variant: "primary"
      }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add Image', 'event'))
    })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-details"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-date-badge-container"
    }, eventDate && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-border-badge"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-date-badge"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "evt-date-day"
    }, dateParts.day), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "evt-date-month"
    }, dateParts.month))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "evt-date-weekday"
    }, eventDay || dateParts.dayName))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-details-inner"
    }, eventDate && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-time"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "evt-time-icon"
    }, "\uD83D\uDD50"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, dateParts.time, eventEndDate && ` - ${(0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('g:i a', eventEndDate)}`)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "h4",
      className: "evt-event-title",
      value: eventTitle,
      onChange: value => setAttributes({
        eventTitle: value
      }),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Event Title', 'event')
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "div",
      className: "evt-event-description",
      value: eventDescription,
      onChange: value => setAttributes({
        eventDescription: value
      }),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Event Description', 'event')
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
      tagName: "div",
      className: "evt-event-location",
      value: eventLocation,
      onChange: value => setAttributes({
        eventLocation: value
      }),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Event Location', 'event')
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-price-read-more"
    }, eventPrice && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-price"
    }, eventPrice), readMoreURL && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-read-more"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: readMoreURL,
      target: "_blank"
    }, readMoreText || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Read More', 'event')))))))));
  },
  save: ({
    attributes
  }) => {
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
      borderBadgeColor,
      dateBadgeBackgroundColor,
      dateBadgeTextColor,
      weekdayTextColor,
      detailsTextColor,
      readMoreURL,
      readMoreText,
      readMoreButtonColor,
      readMoreButtonTextColor,
      readMoreButtonHoverColor,
      readMoreButtonHoverTextColor
    } = attributes;
    const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
      className: 'evt-event-item',
      style: {
        '--evt-details-bg': detailsBackgroundColor || '#ffffff',
        '--evt-border-color': borderBadgeColor || '#00000040',
        '--evt-date-badge-bg': dateBadgeBackgroundColor || '#2667FF',
        '--evt-date-badge-text': dateBadgeTextColor || '#ffffff',
        '--evt-details-text': detailsTextColor || '#1a1a1a',
        '--evt-weekday-text': weekdayTextColor || '#000000',
        '--evt-read-more-button-color': readMoreButtonColor || '#4169E1',
        '--evt-read-more-button-text-color': readMoreButtonTextColor || '#ffffff',
        '--evt-read-more-button-hover-color': readMoreButtonHoverColor || '#2667FF',
        '--evt-read-more-button-hover-text-color': readMoreButtonHoverTextColor || '#ffffff'
      }
    });

    // Get formatted date parts
    const getDateParts = dateString => {
      if (!dateString) return {
        month: '',
        day: '',
        time: '',
        dayName: ''
      };
      try {
        return {
          month: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('M', dateString),
          day: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('d', dateString),
          // 'd' for leading zero (01-31)
          time: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('g:i a', dateString),
          dayName: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('D', dateString).toUpperCase()
        };
      } catch (e) {
        return {
          month: '',
          day: '',
          time: '',
          dayName: ''
        };
      }
    };
    const dateParts = getDateParts(eventDate);
    const endTime = eventEndDate ? (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('g:i a', eventEndDate) : '';
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-card"
    }, eventImageURL && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-image"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: eventImageURL,
      alt: eventImageAlt || eventTitle
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-details"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-date-badge-container"
    }, eventDate && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-border-badge"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-date-badge"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "evt-date-day"
    }, dateParts.day), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "evt-date-month"
    }, dateParts.month))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "evt-date-weekday"
    }, eventDay || dateParts.dayName))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-details-inner"
    }, eventDate && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-time"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "evt-time-icon"
    }, "\uD83D\uDD50"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, dateParts.time, endTime && ` - ${endTime}`)), eventTitle && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
      tagName: "h4",
      className: "evt-event-title",
      value: eventTitle
    }), eventDescription && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
      tagName: "div",
      className: "evt-event-description",
      value: eventDescription
    }), eventLocation && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText.Content, {
      tagName: "div",
      className: "evt-event-location",
      value: eventLocation
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-price-read-more"
    }, eventPrice && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-price"
    }, eventPrice), readMoreURL && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "evt-event-read-more"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: readMoreURL,
      target: "_blank"
    }, readMoreText || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Read More', 'event'))))))));
  }
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map