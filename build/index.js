/******/ (() => { // webpackBootstrap
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
!function () {
  var e = {
      184: function (e, t) {
        var n;
        !function () {
          "use strict";

          var a = {}.hasOwnProperty;
          function o() {
            for (var e = [], t = 0; t < arguments.length; t++) {
              var n = arguments[t];
              if (n) {
                var r = typeof n;
                if ("string" === r || "number" === r) e.push(n);else if (Array.isArray(n)) {
                  if (n.length) {
                    var l = o.apply(null, n);
                    l && e.push(l);
                  }
                } else if ("object" === r) if (n.toString === Object.prototype.toString) for (var c in n) a.call(n, c) && n[c] && e.push(c);else e.push(n.toString());
              }
            }
            return e.join(" ");
          }
          e.exports ? (o.default = o, e.exports = o) : void 0 === (n = function () {
            return o;
          }.apply(t, [])) || (e.exports = n);
        }();
      }
    },
    t = {};
  function n(a) {
    var o = t[a];
    if (void 0 !== o) return o.exports;
    var r = t[a] = {
      exports: {}
    };
    return e[a](r, r.exports, n), r.exports;
  }
  n.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };
    return n.d(t, {
      a: t
    }), t;
  }, n.d = function (e, t) {
    for (var a in t) n.o(t, a) && !n.o(e, a) && Object.defineProperty(e, a, {
      enumerable: !0,
      get: t[a]
    });
  }, n.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }, function () {
    "use strict";

    var e = window.wp.element,
      t = window.wp.blocks,
      a = window.wp.i18n,
      o = window.wp.components,
      r = n(184),
      l = n.n(r),
      c = window.wp.blockEditor,
      i = window.wp.date,
      s = function (t) {
        var n = t.placeholder,
          a = t.value,
          r = t.dateFormat,
          l = t.onChange,
          c = t.className;
        return (0, e.createElement)(o.Dropdown, {
          className: c,
          popoverProps: {
            placement: "bottom-start"
          },
          renderToggle: function (t) {
            var l = t.onToggle,
              c = t.isOpen;
            return (0, e.createElement)(o.Button, {
              className: "button",
              onClick: l,
              "aria-expanded": c,
              "aria-live": "polite"
            }, a ? (0, i.dateI18n)(r, a) : n);
          },
          renderContent: function () {
            return (0, e.createElement)(o.DateTimePicker, {
              currentDate: a,
              onChange: l
            });
          }
        });
      };
    s.Content = function (t) {
      var n = t.value,
        a = t.dateFormat,
        o = t.className;
      return n && (0, e.createElement)("time", {
        className: o,
        dateTime: (0, i.dateI18n)("c", n)
      }, (0, i.dateI18n)(a, n));
    };
    var v = s,
      m = ["image"],
      u = "image/*",
      y = function (e) {
        if (!e) return !1;
        var t = e.toLowerCase(),
          n = t.split("?")[0],
          a = n.split(".").pop();
        return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].indexOf(a) > -1 || t.includes("image") || t.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i);
      },
      d = (0, c.withColors)("backgroundColor", "textColor")(function (t) {
        var n = t.attributes,
          r = t.setAttributes,
          s = t.textColor,
          d = t.setTextColor,
          g = t.backgroundColor,
          p = t.setBackgroundColor,
          _ = t.isSelected,
          f = (0, i.getSettings)(),
          E = [s.class, g.class],
          C = {
            color: s.color,
            backgroundColor: g.color
          },
          b = {
            backgroundImage: n.eventImageURL && "url(".concat(n.eventImageURL, ")"),
            backgroundPosition: n.focalPoint && "".concat(100 * n.focalPoint.x, "% ").concat(100 * n.focalPoint.y, "%"),
            backgroundSize: "cover"
          },
          h = function (e) {
            r({
              eventImageId: e.id,
              eventImageURL: e.url,
              eventImageAlt: e.alt
            });
          },
          I = function (e) {
            r({
              eventImageURL: e
            });
          },
          w = y(n.eventImageURL);
        return (0, e.createElement)(e.Fragment, null, (0, e.createElement)(c.BlockControls, null, (0, e.createElement)(c.MediaReplaceFlow, {
          mediaId: n.eventImageId,
          mediaURL: n.eventImageURL,
          allowedTypes: m,
          accept: u,
          onSelect: h,
          onSelectURL: I
        })), (0, e.createElement)(c.InspectorControls, null, n.eventImageURL && (0, e.createElement)(o.PanelBody, {
          title: (0, a.__)("Media settings", "event")
        }, w && (0, e.createElement)(o.FocalPointPicker, {
          label: (0, a.__)("Focal point picker", "event"),
          url: n.eventImageURL,
          value: n.focalPoint,
          onChange: function (e) {
            return r({
              focalPoint: e
            });
          },
          __nextHasNoMarginBottom: !0
        }), (0, e.createElement)(o.PanelRow, null, (0, e.createElement)(o.Button, {
          variant: "secondary",
          size: "small",
          onClick: function () {
            return r({
              eventImageURL: void 0,
              eventImageId: void 0,
              eventImageAlt: void 0,
              focalPoint: void 0
            });
          }
        }, (0, a.__)("Clear Media", "event")))), (0, e.createElement)(o.PanelBody, {
          title: (0, a.__)("Label Settings", "event"),
          initialOpen: !1
        }, (0, e.createElement)(o.PanelRow, null, (0, e.createElement)(o.TextControl, {
          label: (0, a.__)("When Label", "event"),
          value: void 0 !== n.whenLabel ? n.whenLabel : "When:",
          onChange: function (e) {
            return r({
              whenLabel: e || ""
            });
          },
          help: (0, a.__)("Change the label text for 'When' field", "event"),
          __nextHasNoMarginBottom: !0,
          __next40pxDefaultSize: !0
        })), (0, e.createElement)(o.PanelRow, null, (0, e.createElement)(o.TextControl, {
          label: (0, a.__)("Where Label", "event"),
          value: void 0 !== n.whereLabel ? n.whereLabel : "Where:",
          onChange: function (e) {
            return r({
              whereLabel: e || ""
            });
          },
          help: (0, a.__)("Change the label text for 'Where' field", "event"),
          __nextHasNoMarginBottom: !0,
          __next40pxDefaultSize: !0
        }))), (0, e.createElement)(c.PanelColorSettings, {
          title: (0, a.__)("Color Settings", "event"),
          initialOpen: !0,
          colorSettings: [{
            value: g.color,
            onChange: p,
            label: (0, a.__)("Background Color", "event")
          }, {
            value: s.color,
            onChange: d,
            label: (0, a.__)("Text Color", "event")
          }]
        }, (0, e.createElement)(c.ContrastChecker, {
          textColor: s.color,
          backgroundColor: g.color
        }))), (0, e.createElement)("div", {
          className: l()("wp-block-evt-event", E),
          style: C
        }, (0, e.createElement)("div", {
          className: l()("event__details", {
            "has-custom-color": s.color
          })
        }, (0, e.createElement)("div", {
          className: "event__datebox"
        }, (0, e.createElement)("span", null, (0, i.dateI18n)("M", n.eventStart)), (0, e.createElement)("span", null, (0, i.dateI18n)("j", n.eventStart))), (0, e.createElement)(c.RichText, {
          tagName: "h3",
          className: "event__title",
          value: n.eventTitle,
          onChange: function (e) {
            return r({
              eventTitle: e
            });
          },
          placeholder: (0, a.__)("Event Title", "event")
        }), (0, e.createElement)("div", {
          className: "event__time"
        }, (0, e.createElement)("span", {
          className: "event__label",
          style: {
            color: "inherit"
          }
        }, n.whenLabel || (0, a.__)("When:", "event")), n.eventStart && !_ ? (0, e.createElement)(v.Content, {
          className: "event__date-select",
          dateFormat: f.formats.datetimeAbbreviated,
          value: n.eventStart
        }) : (0, e.createElement)(v, {
          className: "event__date-select",
          dateFormat: f.formats.datetimeAbbreviated,
          value: n.eventStart,
          onChange: function (e) {
            return r({
              eventStart: e
            });
          },
          placeholder: (0, a.__)("Choose a Date", "event")
        })), (0, e.createElement)("div", {
          className: "event__location"
        }, (0, e.createElement)("span", {
          className: "event__label"
        }, n.whereLabel || (0, a.__)("Where:", "event")), (0, e.createElement)(c.RichText, {
          value: n.eventLocation,
          onChange: function (e) {
            return r({
              eventLocation: e
            });
          },
          placeholder: (0, a.__)("Event Location", "event")
        })), (0, e.createElement)("div", {
          className: "event__description"
        }, (0, e.createElement)(c.InnerBlocks, {
          template: [["core/paragraph", {
            placeholder: (0, a.__)("Event Description", "event")
          }]]
        }))), n.eventImageURL ? w ? (0, e.createElement)("div", {
          role: "img",
          "aria-label": n.eventImageAlt,
          className: "event__image event__image--save",
          style: b
        }) : (0, e.createElement)("div", {
          className: "event__image event__link"
        }, (0, e.createElement)("a", {
          href: n.eventImageURL,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "event__link-url"
        }, n.eventImageURL)) : (0, e.createElement)("div", {
          className: "event__image"
        }, (0, e.createElement)(c.MediaPlaceholder, {
          labels: {
            title: (0, a.__)("Event Image", "event")
          },
          allowedTypes: m,
          accept: u,
          onSelect: h,
          onSelectURL: I
        }))));
      });
    (0, t.registerBlockType)("evt/event", {
      // Block title
      title: (0, a.__)("Event", "event"),
      // Block description
      description: (0, a.__)("Display the event time and location.", "event"),
      // Block icon
      icon: (0, e.createElement)(function () {
        return (0, e.createElement)(o.SVG, {
          xmlns: "http://www.w3.org/2000/svg",
          width: "24",
          height: "24",
          viewBox: "0 0 24 24"
        }, (0, e.createElement)(o.Path, {
          d: "M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19.5,19c0,0.3-0.2,0.5-0.5,0.5H5 c-0.3,0-0.5-0.2-0.5-0.5V7h15V19z M17,13h-4v4h4V13z"
        }));
      }, null),
      // Block category
      category: "widgets",
      // Block supports
      supports: {
        align: ["center", "wide"]
      },
      // Example preview
      example: {
        attributes: {
          eventTitle: "Digging for Treasure",
          eventLocation: "Treasure Island",
          eventStart: "1783-11-14T12:00:00",
          eventImageId: 1,
          eventImageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/TI-treasure.jpg/366px-TI-treasure.jpg",
          eventImageAlt: "Treasure",
          focalPoint: {
            x: "0.30",
            y: "0.40"
          },
          customBackgroundColor: "#d4c5af",
          align: "wide"
        }
      },
      // Block attributes schema
      attributes: {
        eventTitle: {
          type: "string"
        },
        eventLocation: {
          type: "string"
        },
        eventStart: {
          type: "string"
        },
        eventImageId: {
          type: "number"
        },
        eventImageURL: {
          type: "string"
        },
        eventImageAlt: {
          type: "string",
          default: ""
        },
        focalPoint: {
          type: "object"
        },
        backgroundColor: {
          type: "string"
        },
        customBackgroundColor: {
          type: "string"
        },
        textColor: {
          type: "string"
        },
        customTextColor: {
          type: "string"
        },
        whenLabel: {
          type: "string",
          default: "When:"
        },
        whereLabel: {
          type: "string",
          default: "Where:"
        }
      },
      // Edit function
      edit: d,
      // Save function
      save: function (t) {
        var n = t.attributes,
          o = (0, i.getSettings)(),
          r = [(0, c.getColorClassName)("color", n.textColor), (0, c.getColorClassName)("background-color", n.backgroundColor)],
          s = {
            color: n.customTextColor,
            backgroundColor: n.customBackgroundColor
          },
          m = {
            backgroundImage: n.eventImageURL && "url(".concat(n.eventImageURL, ")"),
            backgroundPosition: n.focalPoint && "".concat(100 * n.focalPoint.x, "% ").concat(100 * n.focalPoint.y, "%"),
            backgroundSize: "cover"
          },
          x = function (e) {
            if (!e) return !1;
            var t = e.toLowerCase(),
              n = t.split("?")[0],
              a = n.split(".").pop();
            return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].indexOf(a) > -1 || t.includes("image") || t.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i);
          },
          k = x(n.eventImageURL);
        return (0, e.createElement)("div", {
          className: l()("wp-block-evt-event", r),
          style: s
        }, (0, e.createElement)("div", {
          className: "event__details"
        }, n.eventStart && (0, e.createElement)("div", {
          className: "event__datebox"
        }, (0, e.createElement)("span", null, (0, i.dateI18n)("M", n.eventStart)), (0, e.createElement)("span", null, (0, i.dateI18n)("j", n.eventStart))), (0, e.createElement)(c.RichText.Content, {
          tagName: "h3",
          className: l()("event__title", (0, c.getColorClassName)("color", n.textColor)),
          value: n.eventTitle
        }), n.eventStart && (0, e.createElement)("div", {
          className: "event__time"
        }, (0, e.createElement)("span", {
          className: "event__label"
        }, n.whenLabel || (0, a.__)("When:", "event")), (0, e.createElement)(v.Content, {
          className: "event__date-select",
          dateFormat: o.formats.datetimeAbbreviated,
          value: n.eventStart
        })), n.eventLocation && (0, e.createElement)("div", {
          className: "event__location"
        }, (0, e.createElement)("span", {
          className: "event__label"
        }, n.whereLabel || (0, a.__)("Where:", "event")), (0, e.createElement)(c.RichText.Content, {
          value: n.eventLocation
        })), (0, e.createElement)("div", {
          className: "event__description"
        }, (0, e.createElement)(c.InnerBlocks.Content, {
          className: "event__description"
        }))), n.eventImageURL && (k ? (0, e.createElement)("div", {
          role: "img",
          "aria-label": n.eventImageAlt,
          className: "event__image event__image--save",
          style: m
        }) : (0, e.createElement)("div", {
          className: "event__image event__link"
        }, (0, e.createElement)("a", {
          href: n.eventImageURL,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "event__link-url"
        }, n.eventImageURL))));
      }
    });
  }();
}();
/******/ })()
;
//# sourceMappingURL=index.js.map