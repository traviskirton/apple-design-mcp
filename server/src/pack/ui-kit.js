// Written by scripts/build-ui-kit-pack.mjs from Apple's UI kits for Figma. Do not edit.
export default {
 "pack_version": "2026-11-19",
 "generated_at": "2026-11-19T15:51:24.329Z",
 "source": {
  "name": "Apple Design Resources, UI kits for Figma",
  "url": "https://developer.apple.com/design/resources/",
  "kits": [
   "iOS and iPadOS 27",
   "macOS 27",
   "watchOS 26"
  ],
  "components": 596,
  "variants": 2664,
  "drawings": 2310
 },
 "kits": [
  {
   "id": "ios",
   "name": "iOS and iPadOS 27",
   "pages": [
    "Examples",
    "Colors",
    "Materials",
    "Text Styles and Dynamic Type",
    "Layout Guides",
    "System",
    "Action Sheets",
    "Activity Views",
    "Alerts",
    "Buttons",
    "Color Pickers",
    "Contextual Menus",
    "Date and Time Pickers",
    "Empty States",
    "Face ID",
    "Keyboards",
    "Lists",
    "Menus",
    "Notifications",
    "Page Controls",
    "Popovers",
    "Pop-up Buttons",
    "Progress Indicators",
    "Segmented Controls",
    "Sheets",
    "Sidebars",
    "Sliders",
    "Status Bars and Menu Bars",
    "Steppers",
    "Tab Bars",
    "Text Fields",
    "Toggles",
    "Toolbars",
    "Widgets",
    "Windows",
    "_Kit Helpers"
   ],
   "drawings": 1080,
   "components": [
    {
     "id": "examples-ipad-tab-bars",
     "name": "Examples/Tab Bars",
     "page": "Examples",
     "section": "iPad",
     "hig": "tab-bars",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "With Search",
        "Without Search"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Without Search","width":1210,"height":834,"outline":0,"node":"12740:23860"},
      {"name":"Type=With Search","width":1210,"height":834,"outline":1,"node":"12740:23868"}
     ],
     "uses": [
      "toolbars-toolbar-top-ipad",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-sidebar",
     "name": "Examples/Sidebar",
     "page": "Examples",
     "section": "iPad",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37613"}
     ],
     "uses": [
      "system-wallpapers-ipad",
      "sidebars-bg",
      "sidebars-sidebar",
      "toolbars-toolbar-top-ipad",
      "windows-window-resize",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-popover",
     "name": "Examples/Popover",
     "page": "Examples",
     "section": "iPad",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37608"}
     ],
     "uses": [
      "buttons-button-content-area",
      "popovers-ipad-only",
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-top-ipad",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-sheets-modals",
     "name": "Examples/Sheets (Modals)",
     "page": "Examples",
     "section": "iPad",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37607"}
     ],
     "uses": [
      "sheets-overlay",
      "sheets-sheet-ipad",
      "status-bars-and-menu-bar-ipad",
      "keyboards-ipad-keyboard"
     ]
    },
    {
     "id": "examples-ipad-menus",
     "name": "Examples/Menus",
     "page": "Examples",
     "section": "iPad",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Edit Menu",
        "Menu and Submenu"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Edit Menu","width":1210,"height":834,"outline":0,"node":"12740:23880"},
      {"name":"Type=Menu and Submenu","width":1210,"height":834,"outline":1,"node":"12740:23890"}
     ],
     "uses": [
      "menus-text-selection",
      "menus-edit-menu",
      "toolbars-toolbar-top-ipad",
      "status-bars-and-menu-bar-ipad",
      "materials-liquid-glass-regular-medium",
      "menus-quick-action",
      "menus-separator"
     ]
    },
    {
     "id": "examples-ipad-list",
     "name": "Examples/List",
     "page": "Examples",
     "section": "iPad",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37605"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "lists-header",
      "lists-row",
      "lists-row-button",
      "toolbars-toolbar-top-ipad",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-keyboard",
     "name": "Examples/Keyboard",
     "page": "Examples",
     "section": "iPad",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Text (Lower Case)",
        "Text (Upper Case)"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Text (Upper Case)","width":1210,"height":834,"outline":0,"node":"12740:23935"},
      {"name":"Type=Text (Lower Case)","width":1210,"height":834,"outline":1,"node":"12740:23953"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-top-ipad",
      "keyboards-ipad-keyboard",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-context-menu",
     "name": "Examples/Context Menu",
     "page": "Examples",
     "section": "iPad",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37612"}
     ],
     "uses": [
      "toolbars-toolbar-top-ipad",
      "contextual-menus-context-menu-dimming-overlay",
      "contextual-menus-context-menu",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-color-picker",
     "name": "Examples/Color Picker",
     "page": "Examples",
     "section": "iPad",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37604"}
     ],
     "uses": [
      "color-pickers-picker-button",
      "toolbars-toolbar-top-ipad",
      "color-pickers-picker-ipad"
     ]
    },
    {
     "id": "examples-ipad-action-sheet",
     "name": "Examples/Action Sheet",
     "page": "Examples",
     "section": "iPad",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37603"}
     ],
     "uses": [
      "toolbars-toolbar-top-ipad",
      "action-sheets-sheet",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-alert",
     "name": "Examples/Alert",
     "page": "Examples",
     "section": "iPad",
     "variant_props": [
      {
       "name": "Keyboard",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Keyboard=True","width":1210,"height":834,"outline":0,"node":"12740:23975"},
      {"name":"Keyboard=False","width":1210,"height":834,"outline":1,"node":"12740:23985"}
     ],
     "uses": [
      "toolbars-toolbar-top-ipad",
      "alerts-alert",
      "keyboards-ipad-keyboard",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-activity-view",
     "name": "Examples/Activity View",
     "page": "Examples",
     "section": "iPad",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37606"}
     ],
     "uses": [
      "toolbars-toolbar-top-ipad",
      "activity-views-view-ipad",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-toolbars-top",
     "name": "Examples/Toolbars - Top",
     "page": "Examples",
     "section": "iPad",
     "hig": "tab-bars",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "2 Line - Left Aligned",
        "2 Line - Center Aligned",
        "2 Line - Large Title Inline",
        "2 Line - Large Title"
       ]
      }
     ],
     "variants": [
      {"name":"Type=2 Line - Left Aligned","width":1210,"height":834,"outline":0,"node":"12740:23812"},
      {"name":"Type=2 Line - Center Aligned","width":1210,"height":834,"outline":1,"node":"12740:23825"},
      {"name":"Type=2 Line - Large Title Inline","width":1210,"height":834,"outline":2,"node":"12740:23837"},
      {"name":"Type=2 Line - Large Title","width":1210,"height":834,"outline":3,"node":"12740:23847"}
     ],
     "uses": [
      "toolbars-toolbar-bottom-ipad",
      "toolbars-toolbar-top-ipad",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-iphone-tab-bar",
     "name": "Examples/Tab Bar",
     "page": "Examples",
     "section": "iPhone",
     "hig": "tab-bars",
     "variant_props": [
      {
       "name": "Split Search",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Split Search=False","width":402,"height":874,"outline":0,"node":"12740:24077"},
      {"name":"Split Search=True","width":402,"height":874,"outline":1,"node":"12740:24086"}
     ],
     "uses": [
      "tab-bars-bar-iphone",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-slider",
     "name": "Examples/Slider",
     "page": "Examples",
     "section": "iPhone",
     "hig": "tab-bars",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35186"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "sliders",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-steppers",
     "name": "Examples/Steppers",
     "page": "Examples",
     "section": "iPhone",
     "hig": "tab-bars",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35192"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "lists-row",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-sheets-modals",
     "name": "Examples/Sheets (Modals)",
     "page": "Examples",
     "section": "iPhone",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Fullscreen",
        "Fullscreen Stack",
        "Inspector"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Fullscreen","width":402,"height":874,"outline":0,"node":"12740:24098"},
      {"name":"Type=Fullscreen Stack","width":402,"height":874,"outline":1,"node":"12740:24110"},
      {"name":"Type=Inspector","width":402,"height":874,"outline":2,"node":"12740:24122"}
     ],
     "uses": [
      "sheets-sheet-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-picker",
     "name": "Examples/Picker",
     "page": "Examples",
     "section": "iPhone",
     "hig": "tab-bars",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Compact",
        "Inline"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Inline","width":402,"height":874,"outline":0,"node":"12740:24135"},
      {"name":"Type=Compact","width":402,"height":874,"outline":1,"node":"12740:24143"}
     ],
     "uses": [
      "date-and-time-pickers",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone",
      "lists-row"
     ]
    },
    {
     "id": "examples-iphone-menus",
     "name": "Examples/Menus",
     "page": "Examples",
     "section": "iPhone",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Edit Medium",
        "Menu"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Edit Medium","width":402,"height":874,"outline":0,"node":"12740:24157"},
      {"name":"Type=Menu","width":402,"height":874,"outline":1,"node":"12740:24173"}
     ],
     "uses": [
      "menus-text-selection",
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-top-iphone",
      "menus-edit-menu",
      "status-bars-and-menu-bar-iphone",
      "materials-liquid-glass-regular-medium",
      "menus-quick-action",
      "menus-separator",
      "menus-menu-items",
      "menus-menu-items-submenus"
     ]
    },
    {
     "id": "examples-iphone-list",
     "name": "Examples/List",
     "page": "Examples",
     "section": "iPhone",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Full Width",
        "Full Width + Section Headers",
        "Inset"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Inset","width":402,"height":874,"outline":0,"node":"12740:24203"},
      {"name":"Type=Full Width","width":402,"height":874,"outline":1,"node":"12740:24224"},
      {"name":"Type=Full Width + Section Headers","width":402,"height":874,"outline":2,"node":"12740:24239"}
     ],
     "uses": [
      "lists-row",
      "lists-row-button",
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone",
      "lists-row-with-swipe-actions",
      "lists-section-title"
     ]
    },
    {
     "id": "examples-iphone-keyboard",
     "name": "Examples/Keyboard",
     "page": "Examples",
     "section": "iPhone",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Lowercase",
        "Uppercase",
        "Punctuation",
        "Numberic",
        "Find",
        "Find and Replace",
        "Email",
        "Web Search",
        "URL",
        "Number Pad",
        "Emoji"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Accessories",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Type=Lowercase","width":402,"height":874,"outline":0,"node":"12740:24269"},
      {"name":"Type=Uppercase","width":402,"height":874,"outline":1,"node":"12740:24284"},
      {"name":"Type=Punctuation","width":402,"height":874,"outline":2,"node":"12740:24299"},
      {"name":"Type=Numberic","width":402,"height":874,"outline":3,"node":"12740:24314"},
      {"name":"Type=Find","width":402,"height":874,"outline":4,"node":"12740:24329"},
      {"name":"Type=Find and Replace","width":402,"height":874,"outline":5,"node":"12740:24340"},
      {"name":"Type=Email","width":402,"height":874,"outline":6,"node":"12740:24351"},
      {"name":"Type=Web Search","width":402,"height":874,"outline":7,"node":"12740:24360"},
      {"name":"Type=URL","width":402,"height":874,"outline":8,"node":"12740:24371"},
      {"name":"Type=Number Pad","width":402,"height":874,"outline":9,"node":"12740:24382"},
      {"name":"Type=Emoji","width":402,"height":874,"outline":10,"node":"12740:24391"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "keyboards-iphone-accessory-bar-toolbar",
      "keyboards-iphone-keyboard",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone",
      "keyboards-iphone-accessory-bar-find",
      "keyboards-iphone-accessory-bar-find-and-replace",
      "keyboards-iphone-accessory-bar-web-form",
      "keyboards-iphone-accessory-bar-url"
     ]
    },
    {
     "id": "examples-iphone-face-id",
     "name": "Examples/Face ID",
     "page": "Examples",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"13159:44726"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "status-bars-and-menu-bar-iphone",
      "face-id"
     ]
    },
    {
     "id": "examples-iphone-empty-states",
     "name": "Examples/Empty States",
     "page": "Examples",
     "section": "iPhone",
     "variant_props": [
      {
       "name": "Config",
       "values": [
        "Title and Subtitle",
        "Symbol in Circle",
        "Large Symbol"
       ]
      }
     ],
     "variants": [
      {"name":"Config=Title and Subtitle","width":402,"height":874,"outline":0,"node":"12740:24439"},
      {"name":"Config=Symbol in Circle","width":402,"height":874,"outline":1,"node":"12740:24450"},
      {"name":"Config=Large Symbol","width":402,"height":874,"outline":2,"node":"12740:24462"}
     ],
     "uses": [
      "empty-states",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-context-menu",
     "name": "Examples/Context Menu",
     "page": "Examples",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35183"}
     ],
     "uses": [
      "contextual-menus-context-menu",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-color-picker",
     "name": "Examples/Color Picker",
     "page": "Examples",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35184"}
     ],
     "uses": [
      "color-pickers-picker-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-action-sheet",
     "name": "Examples/Action Sheet",
     "page": "Examples",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35185"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-top-iphone",
      "action-sheets-sheet",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-alert",
     "name": "Examples/Alert",
     "page": "Examples",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"13159:44659"}
     ],
     "uses": [
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone",
      "alerts-alert"
     ]
    },
    {
     "id": "examples-iphone-activity-view",
     "name": "Examples/Activity View",
     "page": "Examples",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35190"}
     ],
     "uses": [
      "toolbars-toolbar-top-iphone",
      "activity-views-overlay",
      "activity-views-view",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-toolbars-bottom",
     "name": "Examples/Toolbars - Bottom",
     "page": "Examples",
     "section": "iPhone",
     "hig": "toolbars",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Text",
        "Symbols",
        "Search"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Search","width":402,"height":874,"outline":0,"node":"12740:24039"},
      {"name":"Type=Symbols","width":402,"height":874,"outline":1,"node":"12740:24048"},
      {"name":"Type=Text","width":402,"height":874,"outline":1,"node":"12740:24062"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-bottom-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-toolbars-top",
     "name": "Examples/Toolbars - Top",
     "page": "Examples",
     "section": "iPhone",
     "hig": "toolbars",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Default",
        "Compact Large Title",
        "Large Title",
        "Title 2 Line",
        "Title 2 Line Left"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Title 2 Line Left","width":402,"height":874,"outline":0,"node":"12740:23997"},
      {"name":"Type=Title 2 Line","width":402,"height":874,"outline":1,"node":"12740:24005"},
      {"name":"Type=Large Title","width":402,"height":874,"outline":2,"node":"12740:24013"},
      {"name":"Type=Compact Large Title","width":402,"height":874,"outline":3,"node":"12740:24021"},
      {"name":"Type=Default","width":402,"height":874,"outline":4,"node":"12740:24029"}
     ],
     "uses": [
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-text-fields",
     "name": "Examples/Text Fields",
     "page": "Examples",
     "section": "iPhone",
     "hig": "tab-bars",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35194"}
     ],
     "uses": [
      "text-fields-field",
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-toggles-switches",
     "name": "Examples/Toggles (Switches)",
     "page": "Examples",
     "section": "iPhone",
     "hig": "tab-bars",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35193"}
     ],
     "uses": [
      "lists-row",
      "materials-scroll-edge-effect-soft",
      "toolbars-toolbar-top-iphone",
      "status-bars-and-menu-bar-iphone"
     ]
    },
    {
     "id": "examples-iphone-duo-toolbars",
     "name": "Examples/Toolbars",
     "page": "Examples",
     "section": "iPhone Duo",
     "variant_props": [
      {
       "name": "Orientation",
       "values": [
        "Landscape",
        "Portrait"
       ]
      },
      {
       "name": "Screen",
       "values": [
        "Inner",
        "Outer"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Full Screen"
       ]
      }
     ],
     "variants": [
      {"name":"Screen=Inner, Orientation=Landscape, Type=Full Screen","width":951,"height":669,"outline":0,"node":"12887:23254"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Full Screen","width":669,"height":951,"outline":1,"node":"12887:23263"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Full Screen","width":678,"height":466,"outline":2,"node":"12887:23266"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Full Screen","width":466,"height":678,"outline":3,"node":"12887:23277"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "toolbars-toolbar-top-iphone-duo",
      "tab-bars-bar-iphone",
      "system-iphone-duo-outer-display-lens"
     ]
    },
    {
     "id": "examples-iphone-duo-tab-bars",
     "name": "Examples/Tab Bars",
     "page": "Examples",
     "section": "iPhone Duo",
     "variant_props": [
      {
       "name": "Orientation",
       "values": [
        "Landscape",
        "Portrait"
       ]
      },
      {
       "name": "Screen",
       "values": [
        "Inner",
        "Outer"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Full Screen"
       ]
      }
     ],
     "variants": [
      {"name":"Screen=Inner, Orientation=Landscape, Type=Full Screen","width":951,"height":669,"outline":0,"node":"12887:21899"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Full Screen","width":669,"height":951,"outline":1,"node":"12887:21934"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Full Screen","width":678,"height":466,"outline":2,"node":"12887:21992"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Full Screen","width":466,"height":678,"outline":3,"node":"12887:22059"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "tab-bars-bar-iphone-duo",
      "toolbars-toolbar-top-iphone-duo",
      "tab-bars-bar-iphone",
      "system-iphone-duo-outer-display-lens"
     ]
    },
    {
     "id": "examples-iphone-duo-sheets-modals",
     "name": "Examples/Sheets (Modals)",
     "page": "Examples",
     "section": "iPhone Duo",
     "variant_props": [
      {
       "name": "Orientation",
       "values": [
        "Landscape",
        "Portrait"
       ]
      },
      {
       "name": "Screen",
       "values": [
        "Inner",
        "Outer",
        "Inner (Folded)"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Small Detent",
        "Medium Detent",
        "Large Detent",
        "Full Screen"
       ]
      }
     ],
     "variants": [
      {"name":"Screen=Inner (Folded), Orientation=Landscape, Type=Small Detent","width":951,"height":669,"outline":0,"node":"12886:24810"},
      {"name":"Screen=Inner (Folded), Orientation=Landscape, Type=Medium Detent","width":951,"height":669,"outline":1,"node":"12886:24456"},
      {"name":"Screen=Inner (Folded), Orientation=Landscape, Type=Large Detent","width":951,"height":669,"outline":2,"node":"12886:24452"},
      {"name":"Screen=Inner (Folded), Orientation=Landscape, Type=Full Screen","width":951,"height":669,"outline":3,"node":"12886:24448"},
      {"name":"Screen=Inner, Orientation=Landscape, Type=Small Detent","width":951,"height":669,"outline":0,"node":"12886:24806"},
      {"name":"Screen=Inner, Orientation=Landscape, Type=Medium Detent","width":951,"height":669,"outline":4,"node":"12886:24192"},
      {"name":"Screen=Inner, Orientation=Landscape, Type=Large Detent","width":951,"height":669,"outline":5,"node":"12886:24188"},
      {"name":"Screen=Inner, Orientation=Landscape, Type=Full Screen","width":951,"height":669,"outline":3,"node":"12886:24184"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Small Detent","width":669,"height":951,"outline":6,"node":"12886:24794"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Medium Detent","width":669,"height":951,"outline":7,"node":"12886:23928"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Large Detent","width":669,"height":951,"outline":8,"node":"12886:23924"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Full Screen","width":669,"height":951,"outline":9,"node":"12886:23920"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Small Detent","width":678,"height":466,"outline":10,"node":"12886:24802"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Medium Detent","width":678,"height":466,"outline":11,"node":"12886:23664"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Large Detent","width":678,"height":466,"outline":11,"node":"12886:23660"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Full Screen","width":678,"height":466,"outline":12,"node":"12886:23656"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Small Detent","width":466,"height":678,"outline":13,"node":"12886:24798"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Medium Detent","width":466,"height":678,"outline":14,"node":"12886:17629"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Large Detent","width":466,"height":678,"outline":15,"node":"12886:17623"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Full Screen","width":466,"height":678,"outline":16,"node":"12886:17617"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "toolbars-toolbar-top-iphone-duo",
      "sheets-overlay",
      "materials-liquid-glass-regular-medium",
      "system-iphone-duo-outer-display-lens"
     ]
    },
    {
     "id": "examples-iphone-duo-alerts",
     "name": "Examples/Alerts",
     "page": "Examples",
     "section": "iPhone Duo",
     "variant_props": [
      {
       "name": "Orientation",
       "values": [
        "Landscape",
        "Portrait"
       ]
      },
      {
       "name": "Screen",
       "values": [
        "Inner",
        "Outer",
        "Inner (Folded)"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Full Screen"
       ]
      }
     ],
     "variants": [
      {"name":"Screen=Inner (Folded), Orientation=Landscape, Type=Full Screen","width":951,"height":669,"outline":0,"node":"12956:22813"},
      {"name":"Screen=Inner, Orientation=Landscape, Type=Full Screen","width":951,"height":669,"outline":1,"node":"12956:22870"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Full Screen","width":669,"height":951,"outline":2,"node":"12956:22909"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Full Screen","width":466,"height":678,"outline":3,"node":"12956:23042"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Full Screen","width":678,"height":466,"outline":4,"node":"12956:22971"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "toolbars-toolbar-top-iphone-duo",
      "alerts-overlay",
      "alerts-alert",
      "system-iphone-duo-outer-display-lens"
     ]
    },
    {
     "id": "examples-iphone-duo-keyboard",
     "name": "Examples/Keyboard",
     "page": "Examples",
     "section": "iPhone Duo",
     "variant_props": [
      {
       "name": "Orientation",
       "values": [
        "Landscape",
        "Portrait"
       ]
      },
      {
       "name": "Screen",
       "values": [
        "Inner",
        "Outer"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Uppercase",
        "Lowercase",
        "Numeric",
        "Punctuation"
       ]
      }
     ],
     "variants": [
      {"name":"Screen=Inner, Orientation=Landscape, Type=Punctuation","width":951,"height":669,"outline":0,"node":"12892:53652"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Punctuation","width":669,"height":951,"outline":1,"node":"12892:53669"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Punctuation","width":678,"height":466,"outline":2,"node":"12892:53686"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Punctuation","width":466,"height":678,"outline":3,"node":"12892:53710"},
      {"name":"Screen=Inner, Orientation=Landscape, Type=Numeric","width":951,"height":669,"outline":4,"node":"12892:53641"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Numeric","width":669,"height":951,"outline":5,"node":"12892:53663"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Numeric","width":678,"height":466,"outline":6,"node":"12892:53675"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Numeric","width":466,"height":678,"outline":7,"node":"12892:53697"},
      {"name":"Screen=Inner, Orientation=Landscape, Type=Lowercase","width":951,"height":669,"outline":8,"node":"12892:52136"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Lowercase","width":669,"height":951,"outline":9,"node":"12892:52147"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Lowercase","width":678,"height":466,"outline":10,"node":"12892:52153"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Lowercase","width":466,"height":678,"outline":11,"node":"12892:52164"},
      {"name":"Screen=Inner, Orientation=Landscape, Type=Uppercase","width":951,"height":669,"outline":12,"node":"12891:50099"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Uppercase","width":669,"height":951,"outline":13,"node":"12891:50109"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Uppercase","width":678,"height":466,"outline":14,"node":"12891:50113"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Uppercase","width":466,"height":678,"outline":15,"node":"12891:50125"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-toolbar-top-iphone-duo",
      "keyboards-iphone-accessory-bar-search",
      "keyboards-iphone-duo-keyboard",
      "system-iphone-duo-outer-display-lens"
     ]
    },
    {
     "id": "examples-iphone-duo-activity-view",
     "name": "Examples/Activity View",
     "page": "Examples",
     "section": "iPhone Duo",
     "variant_props": [
      {
       "name": "Orientation",
       "values": [
        "Landscape",
        "Portrait"
       ]
      },
      {
       "name": "Screen",
       "values": [
        "Inner",
        "Outer"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Uppercase"
       ]
      }
     ],
     "variants": [
      {"name":"Screen=Inner, Orientation=Landscape, Type=Uppercase","width":951,"height":669,"outline":0,"node":"12946:17318"},
      {"name":"Screen=Inner, Orientation=Portrait, Type=Uppercase","width":669,"height":951,"outline":1,"node":"12946:17329"},
      {"name":"Screen=Outer, Orientation=Landscape, Type=Uppercase","width":678,"height":466,"outline":2,"node":"12946:17335"},
      {"name":"Screen=Outer, Orientation=Portrait, Type=Uppercase","width":466,"height":678,"outline":3,"node":"12946:17346"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "activity-views-overlay",
      "activity-views-view",
      "toolbars-toolbar-top-iphone-duo",
      "system-iphone-duo-outer-display-lens"
     ]
    },
    {
     "id": "examples-iphone-system-notifications",
     "name": "Examples/Notifications",
     "page": "Examples",
     "section": "iPhone - System",
     "variant_props": [
      {
       "name": "Expanded",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Expanded=True","width":402,"height":874,"outline":0,"node":"12740:24418"},
      {"name":"Expanded=False","width":402,"height":874,"outline":1,"node":"12740:24428"}
     ],
     "uses": [
      "system-wallpapers-iphone",
      "notifications-overlay",
      "status-bars-and-menu-bar-iphone",
      "notifications-notification-expanded",
      "notifications-notification-collapsed-list"
     ]
    },
    {
     "id": "examples-iphone-system-lock-screen",
     "name": "Examples/Lock Screen",
     "page": "Examples",
     "section": "iPhone - System",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35191"}
     ],
     "uses": [
      "system-lock-screen-iphone"
     ]
    },
    {
     "id": "examples-iphone-system-home-screen-widgets",
     "name": "Examples/Home Screen Widgets",
     "page": "Examples",
     "section": "iPhone - System",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium",
        "Large",
        "XL"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Small","width":402,"height":874,"outline":0,"node":"12740:24471"},
      {"name":"Size=Medium","width":402,"height":874,"outline":1,"node":"12740:24474"},
      {"name":"Size=Large","width":402,"height":874,"outline":2,"node":"12740:24477"},
      {"name":"Size=XL","width":402,"height":874,"outline":3,"node":"12740:24480"}
     ],
     "uses": [
      "system-home-screen-iphone"
     ]
    },
    {
     "id": "examples-iphone-system-home-screen-quick-actions",
     "name": "Examples/Home Screen Quick Actions",
     "page": "Examples",
     "section": "iPhone - System",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35187"}
     ],
     "uses": [
      "system-home-screen-quick-actions-iphone"
     ]
    },
    {
     "id": "examples-iphone-system-home-screen",
     "name": "Examples/Home Screen",
     "page": "Examples",
     "section": "iPhone - System",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35189"}
     ],
     "uses": [
      "system-home-screen-iphone"
     ]
    },
    {
     "id": "examples-iphone-system-control-center",
     "name": "Examples/Control Center",
     "page": "Examples",
     "section": "iPhone - System",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"12740:35188"}
     ],
     "uses": [
      "system-control-center-iphone"
     ]
    },
    {
     "id": "examples-iphone-duo-system-home-screen",
     "name": "Examples/Home Screen",
     "page": "Examples",
     "section": "iPhone Duo - System",
     "variant_props": [
      {
       "name": "Orientation",
       "values": [
        "Landscape",
        "Portrait"
       ]
      },
      {
       "name": "Screen",
       "values": [
        "Outer",
        "Inner"
       ]
      }
     ],
     "variants": [
      {"name":"Screen=Inner, Orientation=Landscape","width":951,"height":669,"outline":0,"node":"13159:44041"},
      {"name":"Screen=Inner, Orientation=Portrait","width":669,"height":951,"outline":1,"node":"13159:44039"},
      {"name":"Screen=Outer, Orientation=Portrait","width":466,"height":678,"outline":2,"node":"13159:44040"}
     ],
     "uses": [
      "system-home-screen-iphone-duo",
      "system-iphone-duo-outer-display-lens"
     ]
    },
    {
     "id": "examples-ipad-system-window",
     "name": "Examples/Window",
     "page": "Examples",
     "section": "iPad - System",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37615"}
     ],
     "uses": [
      "system-wallpapers-ipad",
      "sidebars-bg",
      "sidebars-sidebar",
      "windows-window-resize",
      "materials-scroll-edge-effect-hard",
      "toolbars-toolbar-top-ipad",
      "status-bars-and-menu-bar-ipad"
     ]
    },
    {
     "id": "examples-ipad-system-notifications",
     "name": "Examples/Notifications",
     "page": "Examples",
     "section": "iPad - System",
     "variant_props": [
      {
       "name": "Expanded",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Expanded=True","width":1210,"height":834,"outline":0,"node":"12740:23783"},
      {"name":"Expanded=False","width":1210,"height":834,"outline":1,"node":"12740:23788"}
     ],
     "uses": [
      "system-lock-screen-ipad",
      "notifications-overlay",
      "notifications-notification-expanded",
      "system-home-indicator",
      "notifications-notification-collapsed-list"
     ]
    },
    {
     "id": "examples-ipad-system-lock-screen",
     "name": "Examples/Lock Screen",
     "page": "Examples",
     "section": "iPad - System",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37614"}
     ],
     "uses": [
      "system-lock-screen-ipad"
     ]
    },
    {
     "id": "examples-ipad-system-home-screen-widgets",
     "name": "Examples/Home Screen Widgets",
     "page": "Examples",
     "section": "iPad - System",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium",
        "Large",
        "Extra Large"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Small","width":1210,"height":834,"outline":0,"node":"12740:23796"},
      {"name":"Size=Medium","width":1210,"height":834,"outline":1,"node":"12740:23799"},
      {"name":"Size=Large","width":1210,"height":834,"outline":2,"node":"12740:23802"},
      {"name":"Size=Extra Large","width":1210,"height":834,"outline":3,"node":"12740:23805"}
     ],
     "uses": [
      "system-home-screen-ipad"
     ]
    },
    {
     "id": "examples-ipad-system-home-screen-quick-actions",
     "name": "Examples/Home Screen Quick Actions",
     "page": "Examples",
     "section": "iPad - System",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37610"}
     ],
     "uses": [
      "system-home-screen-quick-actions-ipad"
     ]
    },
    {
     "id": "examples-ipad-system-home-screen",
     "name": "Examples/Home Screen",
     "page": "Examples",
     "section": "iPad - System",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37611"}
     ],
     "uses": [
      "system-home-screen-ipad"
     ]
    },
    {
     "id": "examples-ipad-system-control-center",
     "name": "Examples/Control Center",
     "page": "Examples",
     "section": "iPad - System",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"12740:37609"}
     ],
     "uses": [
      "system-control-center-ipad"
     ]
    },
    {
     "id": "colors-swatch-grid",
     "name": "_Swatch Grid",
     "page": "Colors",
     "helper": true,
     "props": [
      {
       "name": "Group",
       "type": "text",
       "default": "\"Backgrounds\""
      }
     ],
     "variants": [
      {"name":"","width":659,"height":370,"outline":0,"node":"5532:7800"}
     ],
     "uses": [
      "colors-swatch"
     ]
    },
    {
     "id": "colors-swatch-light-and-dark",
     "name": "_Swatch - Light and Dark",
     "page": "Colors",
     "helper": true,
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"0:4299"}
     ]
    },
    {
     "id": "colors-swatch",
     "name": "_Swatch",
     "page": "Colors",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Label",
        "Color"
       ]
      }
     ],
     "props": [
      {
       "name": "Color",
       "type": "text",
       "default": "\"Color\""
      }
     ],
     "variants": [
      {"name":"Type=Label","width":100,"height":100,"outline":0,"node":"509:77740"},
      {"name":"Type=Color","width":100,"height":100,"outline":1,"node":"0:4207"}
     ]
    },
    {
     "id": "materials-mode-options",
     "name": "_Materials/Mode Options",
     "page": "Materials",
     "helper": true,
     "variant_props": [
      {
       "name": "Style",
       "values": [
        "Ultrathin",
        "Thin",
        "Regular",
        "Thick",
        "Chrome"
       ]
      }
     ],
     "variants": [
      {"name":"Style=Chrome","width":100,"height":100,"outline":0,"node":"510:78337"},
      {"name":"Style=Thick","width":100,"height":100,"outline":1,"node":"510:78335"},
      {"name":"Style=Regular","width":100,"height":100,"outline":2,"node":"510:78333"},
      {"name":"Style=Thin","width":100,"height":100,"outline":3,"node":"510:78331"},
      {"name":"Style=Ultrathin","width":100,"height":100,"outline":4,"node":"510:78329"}
     ]
    },
    {
     "id": "materials",
     "name": "_Materials",
     "page": "Materials",
     "helper": true,
     "variant_props": [
      {
       "name": "Style",
       "values": [
        "Ultrathin",
        "Thin",
        "Regular",
        "Thick",
        "Chrome"
       ]
      }
     ],
     "variants": [
      {"name":"Style=Chrome","width":100,"height":100,"outline":0,"node":"510:79106"},
      {"name":"Style=Thick","width":100,"height":100,"outline":1,"node":"510:79108"},
      {"name":"Style=Regular","width":100,"height":100,"outline":2,"node":"510:79110"},
      {"name":"Style=Thin","width":100,"height":100,"outline":3,"node":"510:79112"},
      {"name":"Style=Ultrathin","width":100,"height":100,"outline":4,"node":"510:79104"}
     ],
     "uses": [
      "materials-mode-options"
     ]
    },
    {
     "id": "materials-scroll-edge-effect-soft",
     "name": "Scroll Edge Effect - Soft",
     "page": "Materials",
     "variant_props": [
      {
       "name": "Edge",
       "values": [
        "Bottom",
        "Top"
       ]
      }
     ],
     "variants": [
      {"name":"Edge=Bottom","width":200,"height":200,"outline":0,"node":"5661:26968"},
      {"name":"Edge=Top","width":200,"height":200,"outline":1,"node":"5661:26964"}
     ]
    },
    {
     "id": "materials-scroll-edge-effect-hard",
     "name": "Scroll Edge Effect - Hard",
     "page": "Materials",
     "variant_props": [
      {
       "name": "Edge",
       "values": [
        "Bottom",
        "Top"
       ]
      }
     ],
     "variants": [
      {"name":"Edge=Bottom","width":200,"height":200,"outline":0,"node":"5661:26984"},
      {"name":"Edge=Top","width":200,"height":200,"outline":0,"node":"5661:26986"}
     ]
    },
    {
     "id": "materials-liquid-glass-regular-large",
     "name": "Liquid Glass - Regular - Large",
     "page": "Materials",
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"5584:31859"}
     ]
    },
    {
     "id": "materials-liquid-glass-regular-medium",
     "name": "Liquid Glass - Regular - Medium",
     "page": "Materials",
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"5584:31857"}
     ]
    },
    {
     "id": "materials-liquid-glass-regular-small",
     "name": "Liquid Glass - Regular - Small",
     "page": "Materials",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Prominent",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, Prominent=False","width":48,"height":48,"outline":0,"node":"10472:45029"},
      {"name":"Active=False, Prominent=True","width":48,"height":48,"outline":0,"node":"10472:45041"},
      {"name":"Active=True, Prominent=True","width":48,"height":48,"outline":1,"node":"5564:42807"},
      {"name":"Active=True, Prominent=False","width":48,"height":48,"outline":2,"node":"5564:42811"}
     ]
    },
    {
     "id": "materials-liquid-glass-clear",
     "name": "Liquid Glass - Clear",
     "page": "Materials",
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"5914:23547"}
     ]
    },
    {
     "id": "layout-guides-overlays",
     "name": "_Layout Overlays",
     "page": "Layout Guides",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Layout Margin",
        "Safe Area Inset",
        "Reserved Region"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Reserved Region","width":100,"height":100,"outline":0,"node":"12892:61514"},
      {"name":"Type=Safe Area Inset","width":100,"height":100,"outline":1,"node":"12892:61513"},
      {"name":"Type=Layout Margin","width":100,"height":100,"outline":2,"node":"12892:61512"}
     ]
    },
    {
     "id": "layout-guides-iphone-duo-standard-inner-landscape-folded",
     "name": "iPhone Duo/Standard/Inner - Landscape - Folded",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":951,"height":669,"outline":0,"node":"13035:902"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "toolbars-toolbar-top-iphone-duo",
      "layout-guides-overlays"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-sheets-inner-landscape-folded",
     "name": "iPhone Duo/Sheets/Inner - Landscape - Folded",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":951,"height":669,"outline":0,"node":"13035:1548"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "toolbars-toolbar-top-iphone-duo",
      "layout-guides-overlays",
      "sheets-overlay",
      "materials-liquid-glass-regular-medium"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-standard-inner-landscape",
     "name": "iPhone Duo/Standard/Inner - Landscape",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":951,"height":669,"outline":0,"node":"12892:62247"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "tab-bars-bar-iphone-duo",
      "toolbars-toolbar-top-iphone-duo",
      "layout-guides-overlays"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-sheets-inner-landscape",
     "name": "iPhone Duo/Sheets/Inner - Landscape",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":951,"height":669,"outline":0,"node":"12892:62243"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "toolbars-toolbar-top-iphone-duo",
      "layout-guides-overlays",
      "sheets-overlay",
      "materials-liquid-glass-regular-medium"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-standard-inner-portrait-folded",
     "name": "iPhone Duo/Standard/Inner - Portrait - Folded",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":669,"height":951,"outline":0,"node":"13035:1050"}
     ],
     "uses": [
      "toolbars-toolbar-top-iphone-duo",
      "tab-bars-bar-iphone",
      "layout-guides-overlays"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-sheets-inner-portrait-folded",
     "name": "iPhone Duo/Sheets/Inner - Portrait - Folded",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":669,"height":951,"outline":0,"node":"13035:1403"}
     ],
     "uses": [
      "toolbars-toolbar-top-iphone-duo",
      "layout-guides-overlays",
      "sheets-overlay",
      "materials-liquid-glass-regular-medium",
      "toolbars-buttons-48pt"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-standard-inner-portrait",
     "name": "iPhone Duo/Standard/Inner - Portrait",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":669,"height":951,"outline":0,"node":"12892:62246"}
     ],
     "uses": [
      "toolbars-toolbar-top-iphone-duo",
      "tab-bars-bar-iphone",
      "layout-guides-overlays"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-sheets-inner-portrait",
     "name": "iPhone Duo/Sheets/Inner - Portrait",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":669,"height":951,"outline":0,"node":"12892:62242"}
     ],
     "uses": [
      "toolbars-toolbar-top-iphone-duo",
      "layout-guides-overlays",
      "sheets-overlay",
      "materials-liquid-glass-regular-medium",
      "toolbars-buttons-48pt"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-standard-outer-landscape",
     "name": "iPhone Duo/Standard/Outer - Landscape",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":678,"height":466,"outline":0,"node":"12892:62245"}
     ],
     "uses": [
      "toolbars-buttons-48pt",
      "tab-bars-bar-iphone-duo",
      "toolbars-toolbar-top-iphone-duo",
      "system-iphone-duo-outer-display-lens",
      "layout-guides-overlays"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-sheets-outer-landscape",
     "name": "iPhone Duo/Sheets/Outer - Landscape",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":678,"height":466,"outline":0,"node":"12892:62241"}
     ],
     "uses": [
      "toolbars-buttons-48pt",
      "layout-guides-overlays",
      "sheets-overlay",
      "toolbars-toolbar-top-iphone-duo",
      "system-iphone-duo-outer-display-lens"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-standard-outer-portrait",
     "name": "iPhone Duo/Standard/Outer - Portrait",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":466,"height":678,"outline":0,"node":"12892:62244"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "tab-bars-bar-iphone-duo",
      "toolbars-toolbar-top-iphone-duo",
      "system-iphone-duo-outer-display-lens",
      "layout-guides-overlays"
     ]
    },
    {
     "id": "layout-guides-iphone-duo-sheets-outer-portrait",
     "name": "iPhone Duo/Sheets/Outer - Portrait",
     "page": "Layout Guides",
     "variants": [
      {"name":"","width":466,"height":678,"outline":0,"node":"12892:62240"}
     ],
     "uses": [
      "status-bars-and-menu-bar-iphone-duo",
      "toolbars-buttons-48pt",
      "layout-guides-overlays",
      "sheets-overlay",
      "system-iphone-duo-outer-display-lens",
      "materials-liquid-glass-regular-medium",
      "toolbars-toolbar-top-iphone-duo"
     ]
    },
    {
     "id": "system-home-screen-quick-actions-ipad",
     "name": "Home Screen Quick Actions - iPad",
     "page": "System",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"2607:25388"}
     ],
     "uses": [
      "system-home-screen-ipad",
      "contextual-menus-context-menu-dimming-overlay",
      "system-home-screen-quick-actions"
     ]
    },
    {
     "id": "system-hsqa-app-icon-light",
     "name": "_HSQA - App Icon - Light",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "Item",
       "values": [
        "App",
        "Widget Small",
        "Widget Medium",
        "Widget Large",
        "Widget XL"
       ]
      },
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.grid.2x2"
      }
     ],
     "variants": [
      {"name":"Item=App, Selected=False, Selected=","width":38,"height":38,"outline":0,"node":"5624:50422"},
      {"name":"Item=Widget Small, Selected=False","width":38,"height":38,"outline":1,"node":"10491:21568"},
      {"name":"Item=Widget Medium, Selected=False","width":38,"height":38,"outline":2,"node":"10491:21584"},
      {"name":"Item=Widget Large, Selected=False","width":38,"height":38,"outline":3,"node":"10491:21594"},
      {"name":"Item=Widget XL, Selected=False","width":38,"height":38,"outline":4,"node":"10491:21608"},
      {"name":"Item=App, Selected=True","width":38,"height":38,"outline":5,"node":"10491:21552"},
      {"name":"Item=Widget Small, Selected=True","width":38,"height":38,"outline":6,"node":"10491:21570"},
      {"name":"Item=Widget Large, Selected=True","width":38,"height":38,"outline":7,"node":"10491:21596"},
      {"name":"Item=Widget Medium, Selected=True","width":38,"height":38,"outline":8,"node":"10491:21586"},
      {"name":"Item=Widget XL, Selected=True","width":38,"height":38,"outline":9,"node":"10491:21610"}
     ]
    },
    {
     "id": "system-hsqa-actions",
     "name": "_HSQA - Actions",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Destructive",
        "Default"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Action\""
      }
     ],
     "variants": [
      {"name":"State=Destructive","width":200,"height":42,"outline":0,"node":"5622:50173"},
      {"name":"State=Default","width":200,"height":42,"outline":1,"node":"5619:49812"}
     ]
    },
    {
     "id": "system-hsqa-widget-row",
     "name": "_HSQA - Widget Row",
     "page": "System",
     "helper": true,
     "variants": [
      {"name":"","width":250,"height":38,"outline":0,"node":"5619:49841"}
     ],
     "uses": [
      "system-hsqa-app-icon-light"
     ]
    },
    {
     "id": "system-home-screen-quick-actions",
     "name": "_Home Screen Quick Actions",
     "page": "System",
     "helper": true,
     "props": [
      {
       "name": "Actions",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":250,"height":350,"outline":0,"node":"2607:26472"}
     ],
     "uses": [
      "materials-liquid-glass-regular-medium",
      "system-hsqa-actions",
      "system-hsqa-widget-row"
     ]
    },
    {
     "id": "system-home-screen-quick-actions-iphone",
     "name": "Home Screen Quick Actions - iPhone",
     "page": "System",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"2607:25374"}
     ],
     "uses": [
      "system-home-screen-iphone",
      "contextual-menus-context-menu-dimming-overlay",
      "system-home-screen-quick-actions"
     ]
    },
    {
     "id": "system-controls-bg-ipad",
     "name": "_Controls - BG - iPad",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "On",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"On=False","width":66,"height":66,"outline":0,"node":"5626:53724"},
      {"name":"On=True","width":66,"height":66,"outline":1,"node":"5626:53722"}
     ]
    },
    {
     "id": "system-controls-ipad-2x2",
     "name": "_Controls - iPad - 2x2",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "On",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol lock.rotation.open"
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Detail",
       "type": "text",
       "default": "\"Detail\""
      }
     ],
     "variants": [
      {"name":"On=False","width":142,"height":142,"outline":0,"node":"2606:21980"},
      {"name":"On=True","width":142,"height":142,"outline":1,"node":"2606:21986"}
     ],
     "uses": [
      "system-controls-bg-ipad"
     ]
    },
    {
     "id": "system-controls-ipad-2x1",
     "name": "_Controls - iPad - 2x1",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "On",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Toggle",
        "Menu"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol lock.rotation.open"
      },
      {
       "name": "Detail",
       "type": "text",
       "default": "\"Detail\""
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Show Detail",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"On=False, Type=Menu","width":142,"height":66,"outline":0,"node":"2606:21955"},
      {"name":"On=True, Type=Menu","width":142,"height":66,"outline":1,"node":"2606:21961"},
      {"name":"On=False, Type=Toggle","width":142,"height":66,"outline":2,"node":"2606:21967"},
      {"name":"On=True, Type=Toggle","width":142,"height":66,"outline":3,"node":"2606:21973"}
     ],
     "uses": [
      "system-controls-bg-ipad"
     ]
    },
    {
     "id": "system-controls-ipad-1x1",
     "name": "_Controls - iPad - 1x1",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "On",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol lock.rotation.open"
      }
     ],
     "variants": [
      {"name":"On=True","width":66,"height":66,"outline":0,"node":"2606:21950"},
      {"name":"On=False","width":66,"height":66,"outline":1,"node":"2606:21952"}
     ],
     "uses": [
      "system-controls-bg-ipad"
     ]
    },
    {
     "id": "system-control-center-ipad",
     "name": "Control Center - iPad",
     "page": "System",
     "hig": "widgets",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"2606:21776"}
     ],
     "uses": [
      "system-lock-screen-ipad",
      "system-home-indicator",
      "system-controls-bg-ipad",
      "system-controls-ipad-1x1",
      "system-controls-ipad-2x2",
      "system-controls-ipad-2x1"
     ]
    },
    {
     "id": "system-controls-bg-iphone",
     "name": "_Controls - BG - iPhone",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "On",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"On=False","width":66,"height":66,"outline":0,"node":"5626:54581"},
      {"name":"On=True","width":66,"height":66,"outline":1,"node":"5626:54578"}
     ]
    },
    {
     "id": "system-controls-iphone-2x2",
     "name": "_Controls - iPhone - 2x2",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "On",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol lock.rotation.open"
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Detail",
       "type": "text",
       "default": "\"Detail\""
      }
     ],
     "variants": [
      {"name":"On=False","width":155,"height":155,"outline":0,"node":"2547:2642"},
      {"name":"On=True","width":155,"height":155,"outline":1,"node":"2547:2648"}
     ],
     "uses": [
      "system-controls-bg-iphone"
     ]
    },
    {
     "id": "system-controls-iphone-2x1",
     "name": "_Controls - iPhone - 2x1",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "On",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Toggle",
        "Menu"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol lock.rotation.open"
      },
      {
       "name": "Detail",
       "type": "text",
       "default": "\"Detail\""
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Show Detail",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"On=False, Type=Menu","width":155,"height":70,"outline":0,"node":"2547:2602"},
      {"name":"On=True, Type=Menu","width":155,"height":70,"outline":1,"node":"2547:2596"},
      {"name":"On=False, Type=Toggle","width":155,"height":70,"outline":2,"node":"2543:2526"},
      {"name":"On=True, Type=Toggle","width":155,"height":70,"outline":3,"node":"2543:2524"}
     ],
     "uses": [
      "system-controls-bg-iphone"
     ]
    },
    {
     "id": "system-controls-iphone-1x1",
     "name": "_Controls - iPhone - 1x1",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "On",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol lock.rotation.open"
      }
     ],
     "variants": [
      {"name":"On=True","width":70,"height":70,"outline":0,"node":"2524:24524"},
      {"name":"On=False","width":70,"height":70,"outline":1,"node":"2524:24526"}
     ],
     "uses": [
      "system-controls-bg-iphone"
     ]
    },
    {
     "id": "system-control-center-iphone",
     "name": "Control Center - iPhone",
     "page": "System",
     "hig": "widgets",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"2524:24489"}
     ],
     "uses": [
      "system-lock-screen-iphone",
      "system-home-indicator",
      "system-controls-iphone-2x2",
      "system-controls-iphone-2x1",
      "system-controls-iphone-1x1",
      "system-controls-bg-iphone"
     ]
    },
    {
     "id": "system-lock-screen-ipad",
     "name": "Lock Screen - iPad",
     "page": "System",
     "hig": "widgets",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"557:20781"}
     ],
     "uses": [
      "system-wallpapers-ipad",
      "system-home-indicator",
      "widgets-lock-screen-widget-inline",
      "widgets-lock-screen-widget-tall-body",
      "widgets-lock-screen-widget-2x2-clock-big-ipad-only",
      "widgets-lock-screen-widget-rectangular-with-chart",
      "widgets-lock-screen-widget-circular-open-gauge-3",
      "widgets-lock-screen-widget-circular-open-gauge-2",
      "widgets-lock-screen-widget-modular-with-bar",
      "widgets-lock-screen-widget-2x2-date-ipad-only"
     ]
    },
    {
     "id": "system-controls-lock-screen",
     "name": "_Controls - Lock Screen",
     "page": "System",
     "helper": true,
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol flashlight.off.fill"
      }
     ],
     "variants": [
      {"name":"","width":58,"height":58,"outline":0,"node":"5592:28123"}
     ],
     "uses": [
      "materials-liquid-glass-clear"
     ]
    },
    {
     "id": "system-lock-screen-iphone",
     "name": "Lock Screen - iPhone",
     "page": "System",
     "hig": "widgets",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"557:20840"}
     ],
     "uses": [
      "system-wallpapers-iphone",
      "system-home-indicator",
      "system-controls-lock-screen",
      "widgets-lock-screen-widget-modular-table",
      "widgets-lock-screen-widget-circular-open-gauge-2",
      "widgets-lock-screen-widget-circular-stack-3-rows",
      "widgets-lock-screen-widget-inline"
     ]
    },
    {
     "id": "system-dock-ipad",
     "name": "_Dock - iPad",
     "page": "System",
     "helper": true,
     "variants": [
      {"name":"","width":740,"height":153,"outline":0,"node":"558:50382"}
     ],
     "uses": [
      "system-dock-material",
      "system-app-icon-ipad",
      "system-launch-pad"
     ]
    },
    {
     "id": "system-home-screen-ipad",
     "name": "Home Screen - iPad",
     "page": "System",
     "hig": "widgets",
     "variant_props": [
      {
       "name": "Widgets",
       "values": [
        "None",
        "Small",
        "Medium",
        "Large",
        "Extra Large"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Status Bar",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Widgets=None","width":1210,"height":834,"outline":0,"node":"144:62674"},
      {"name":"Widgets=Small","width":1210,"height":834,"outline":1,"node":"595:43666"},
      {"name":"Widgets=Medium","width":1210,"height":834,"outline":2,"node":"595:43530"},
      {"name":"Widgets=Large","width":1210,"height":834,"outline":3,"node":"595:43394"},
      {"name":"Widgets=Extra Large","width":1210,"height":834,"outline":4,"node":"595:43250"}
     ],
     "uses": [
      "system-wallpapers-ipad",
      "status-bars-and-menu-bar-ipad",
      "system-app-icon-ipad",
      "system-dock-ipad",
      "widgets-home-screen-widget-ipad"
     ]
    },
    {
     "id": "system-launch-pad",
     "name": "_Launch Pad",
     "page": "System",
     "helper": true,
     "variants": [
      {"name":"","width":68,"height":68,"outline":0,"node":"5593:35444"}
     ],
     "uses": [
      "system-app-icon-ipad"
     ]
    },
    {
     "id": "system-home-screen-iphone-duo",
     "name": "Home Screen - iPhone Duo",
     "page": "System",
     "hig": "widgets",
     "variant_props": [
      {
       "name": "Display",
       "values": [
        "Outer Portrait",
        "Inner Landscape",
        "Inner Portrait"
       ]
      },
      {
       "name": "Widgets",
       "values": [
        "None"
       ]
      }
     ],
     "variants": [
      {"name":"Display=Inner Landscape, Widgets=None","width":951,"height":669,"outline":0,"node":"13138:25256"},
      {"name":"Display=Inner Portrait, Widgets=None","width":669,"height":951,"outline":1,"node":"13138:25139"},
      {"name":"Display=Outer Portrait, Widgets=None","width":466,"height":678,"outline":2,"node":"13138:22626"}
     ],
     "uses": [
      "system-wallpapers-iphone-duo",
      "system-dock-material",
      "system-app-icon-iphone-duo"
     ]
    },
    {
     "id": "system-home-screen-iphone",
     "name": "Home Screen - iPhone",
     "page": "System",
     "hig": "widgets",
     "variant_props": [
      {
       "name": "Widgets",
       "values": [
        "None",
        "Small",
        "Medium",
        "Large",
        "XL"
       ]
      }
     ],
     "variants": [
      {"name":"Widgets=None","width":402,"height":874,"outline":0,"node":"0:9007"},
      {"name":"Widgets=Small","width":402,"height":874,"outline":1,"node":"561:6199"},
      {"name":"Widgets=Medium","width":402,"height":874,"outline":2,"node":"561:6000"},
      {"name":"Widgets=Large","width":402,"height":874,"outline":3,"node":"561:5801"},
      {"name":"Widgets=XL","width":402,"height":874,"outline":4,"node":"10492:19414"}
     ],
     "uses": [
      "system-wallpapers-iphone",
      "status-bars-and-menu-bar-iphone",
      "system-app-icon-iphone",
      "system-dock-material",
      "widgets-home-screen-widget-iphone"
     ]
    },
    {
     "id": "system-home-indicator",
     "name": "Home Indicator",
     "page": "System",
     "hig": "going-full-screen",
     "variant_props": [
      {
       "name": "Device",
       "values": [
        "iPad",
        "iPhone"
       ]
      },
      {
       "name": "Orientation",
       "values": [
        "Portrait",
        "Landscape"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Home Indicator",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Device=iPhone, Orientation=Portrait","width":402,"height":34,"outline":0,"node":"106:60032"},
      {"name":"Device=iPhone, Orientation=Landscape","width":402,"height":21,"outline":1,"node":"224:56837"},
      {"name":"Device=iPad, Orientation=Portrait","width":402,"height":21,"outline":2,"node":"106:60034"},
      {"name":"Device=iPad, Orientation=Landscape","width":402,"height":21,"outline":3,"node":"224:56833"}
     ]
    },
    {
     "id": "system-wallpapers-iphone",
     "name": "Wallpapers - iPhone",
     "page": "System",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"0:5245"}
     ]
    },
    {
     "id": "system-wallpapers-iphone-duo",
     "name": "Wallpapers - iPhone Duo",
     "page": "System",
     "variant_props": [
      {
       "name": "Display",
       "values": [
        "Outer Portrait",
        "Inner Portrait",
        "Inner Landscape"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Night Sky",
        "Star White"
       ]
      }
     ],
     "variants": [
      {"name":"Style=Star White, Display=Outer Portrait","width":466,"height":678,"outline":0,"node":"13138:25374"},
      {"name":"Style=Star White, Display=Inner Portrait","width":669,"height":951,"outline":1,"node":"13156:41516"},
      {"name":"Style=Star White, Display=Inner Landscape","width":951,"height":669,"outline":2,"node":"13156:41520"},
      {"name":"Style=Night Sky, Display=Outer Portrait","width":466,"height":678,"outline":0,"node":"13138:25375"},
      {"name":"Style=Night Sky, Display=Inner Portrait","width":669,"height":951,"outline":1,"node":"13156:41517"},
      {"name":"Style=Night Sky, Display=Inner Landscape","width":951,"height":669,"outline":2,"node":"13156:41521"}
     ]
    },
    {
     "id": "system-wallpapers-ipad",
     "name": "Wallpapers - iPad",
     "page": "System",
     "variants": [
      {"name":"","width":1210,"height":834,"outline":0,"node":"0:8808"}
     ]
    },
    {
     "id": "system-dock-material",
     "name": "_Dock Material",
     "page": "System",
     "helper": true,
     "variants": [
      {"name":"","width":300,"height":103,"outline":0,"node":"558:44490"}
     ]
    },
    {
     "id": "system-iphone-duo-outer-display-lens",
     "name": "iPhone Duo/Outer Display Lens",
     "page": "System",
     "variants": [
      {"name":"","width":95.67,"height":95.67,"outline":0,"node":"12887:18298"}
     ]
    },
    {
     "id": "system-app-icon-iphone",
     "name": "App Icon/iPhone",
     "page": "System",
     "variant_props": [
      {
       "name": "Custom Icon",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Show App Name",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "App Name",
       "type": "text",
       "default": "\"App Name\""
      },
      {
       "name": "Show Badge",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Custom Icon=True","width":64,"height":83,"outline":0,"node":"2402:17544"},
      {"name":"Custom Icon=False","width":64,"height":83,"outline":1,"node":"2402:973"}
     ]
    },
    {
     "id": "system-app-icon-iphone-home-indicator-badge",
     "name": "App Icon/iPhone/Home Indicator/_Badge",
     "page": "System",
     "helper": true,
     "props": [
      {
       "name": "Count",
       "type": "text",
       "default": "\"67\""
      }
     ],
     "variants": [
      {"name":"","width":34,"height":24,"outline":0,"node":"5592:39416"}
     ]
    },
    {
     "id": "system-app-icon-iphone-duo",
     "name": "_App Icon/iPhone Duo",
     "page": "System",
     "helper": true,
     "variant_props": [
      {
       "name": "Custom Icon",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Display",
       "values": [
        "Inner Portrait",
        "Inner Landscape",
        "Outer"
       ]
      }
     ],
     "props": [
      {
       "name": "Show App Name",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "App Name",
       "type": "text",
       "default": "\"App Name\""
      },
      {
       "name": "Show Badge",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Display=Inner Landscape, Custom Icon=True","width":64,"height":64,"outline":0,"node":"13148:37781"},
      {"name":"Display=Inner Landscape, Custom Icon=False","width":64,"height":64,"outline":1,"node":"13148:37785"},
      {"name":"Display=Inner Portrait, Custom Icon=True","width":64,"height":64,"outline":2,"node":"13148:37763"},
      {"name":"Display=Inner Portrait, Custom Icon=False","width":64,"height":64,"outline":3,"node":"13148:37767"},
      {"name":"Display=Outer, Custom Icon=True","width":64,"height":64,"outline":0,"node":"13140:25990"},
      {"name":"Display=Outer, Custom Icon=False","width":64,"height":64,"outline":1,"node":"13140:25994"}
     ]
    },
    {
     "id": "system-app-icon-ipad",
     "name": "App Icon/iPad",
     "page": "System",
     "variant_props": [
      {
       "name": "Custom Icon",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "Show App Name",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "App Name",
       "type": "text",
       "default": "\"App Name\""
      },
      {
       "name": "Show Badge",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Custom Icon=True","width":68,"height":68,"outline":0,"node":"5592:63203"},
      {"name":"Custom Icon=False","width":68,"height":68,"outline":1,"node":"5592:63207"}
     ]
    },
    {
     "id": "action-sheets-sheet",
     "name": "Action Sheet",
     "page": "Action Sheets",
     "props": [
      {
       "name": "Message",
       "type": "text",
       "default": "\"A message should be a short, complete s…\""
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"A Short Title Is Best\""
      },
      {
       "name": "Show message",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Actions",
       "type": "slot",
       "note": "Add, remove or reorder Action Sheet buttons."
      }
     ],
     "variants": [
      {"name":"","width":300,"height":296,"outline":0,"node":"5446:10266"}
     ],
     "uses": [
      "materials-liquid-glass-regular-medium",
      "alerts-buttons"
     ]
    },
    {
     "id": "activity-views-overlay",
     "name": "Overlay",
     "page": "Activity Views",
     "variants": [
      {"name":"","width":100,"height":100,"outline":0,"node":"5846:3358"}
     ]
    },
    {
     "id": "activity-views-actions",
     "name": "_Actions",
     "page": "Activity Views",
     "helper": true,
     "props": [
      {
       "name": "Action",
       "type": "text",
       "default": "\"Action\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol star"
      }
     ],
     "variants": [
      {"name":"","width":200,"height":52,"outline":0,"node":"126:58332"}
     ],
     "uses": [
      "lists-separator"
     ]
    },
    {
     "id": "activity-views-separator",
     "name": "_Separator",
     "page": "Activity Views",
     "helper": true,
     "variants": [
      {"name":"","width":200,"height":1,"outline":0,"node":"10465:35557"}
     ]
    },
    {
     "id": "activity-views-close-button",
     "name": "_Close Button",
     "page": "Activity Views",
     "helper": true,
     "hig": "navigation-bars",
     "variants": [
      {"name":"","width":48,"height":48,"outline":0,"node":"5591:28889"}
     ],
     "uses": [
      "toolbars-buttons-48pt"
     ]
    },
    {
     "id": "activity-views-button-liquid-glass",
     "name": "_Button - Liquid Glass",
     "page": "Activity Views",
     "helper": true,
     "hig": "buttons",
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol person.2.fill"
      },
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"","width":108,"height":34,"outline":0,"node":"5591:67822"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small"
     ]
    },
    {
     "id": "activity-views-action",
     "name": "_Action",
     "page": "Activity Views",
     "helper": true,
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Action\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"","width":66,"height":104,"outline":0,"node":"13112:4477"}
     ]
    },
    {
     "id": "activity-views-actions-2",
     "name": "_Actions",
     "page": "Activity Views",
     "helper": true,
     "variants": [
      {"name":"","width":500,"height":120,"outline":0,"node":"13066:19677"}
     ],
     "uses": [
      "activity-views-action",
      "activity-views-separator"
     ]
    },
    {
     "id": "activity-views-app",
     "name": "_App",
     "page": "Activity Views",
     "helper": true,
     "props": [
      {
       "name": "App Name",
       "type": "text",
       "default": "\"App Name\""
      }
     ],
     "variants": [
      {"name":"","width":66,"height":85,"outline":0,"node":"13066:19808"}
     ]
    },
    {
     "id": "activity-views-apps",
     "name": "_Apps",
     "page": "Activity Views",
     "helper": true,
     "variants": [
      {"name":"","width":500,"height":101,"outline":0,"node":"13066:19391"}
     ],
     "uses": [
      "activity-views-app",
      "activity-views-separator"
     ]
    },
    {
     "id": "activity-views-contact",
     "name": "_Contact",
     "page": "Activity Views",
     "helper": true,
     "variant_props": [
      {
       "name": "People",
       "values": [
        "1",
        "2"
       ]
      }
     ],
     "props": [
      {
       "name": "First Name",
       "type": "text",
       "default": "\"First\""
      },
      {
       "name": "# of People",
       "type": "text",
       "default": "\"2 People\""
      },
      {
       "name": "Last Name",
       "type": "text",
       "default": "\"Last\""
      },
      {
       "name": "Names",
       "type": "text",
       "default": "\"First and First\""
      }
     ],
     "variants": [
      {"name":"People=2","width":66,"height":102,"outline":0,"node":"127:58424"},
      {"name":"People=1","width":66,"height":102,"outline":1,"node":"127:58381"}
     ]
    },
    {
     "id": "activity-views-contacts",
     "name": "_Contacts",
     "page": "Activity Views",
     "helper": true,
     "variants": [
      {"name":"","width":500,"height":118,"outline":0,"node":"13066:20042"}
     ],
     "uses": [
      "activity-views-contact",
      "activity-views-separator"
     ]
    },
    {
     "id": "activity-views-header",
     "name": "_Header",
     "page": "Activity Views",
     "helper": true,
     "variants": [
      {"name":"","width":402,"height":133,"outline":0,"node":"5591:68049"}
     ],
     "uses": [
      "activity-views-button-liquid-glass",
      "toolbars-buttons-48pt"
     ]
    },
    {
     "id": "activity-views-view-ipad",
     "name": "Activity View - iPad",
     "page": "Activity Views",
     "variants": [
      {"name":"","width":402,"height":983,"outline":0,"node":"128:60578"}
     ],
     "uses": [
      "popovers-ipad-only",
      "activity-views-header",
      "activity-views-contacts",
      "activity-views-apps",
      "activity-views-actions-2",
      "activity-views-actions",
      "buttons-button-liquid-glass-text"
     ]
    },
    {
     "id": "activity-views-view",
     "name": "Activity View",
     "page": "Activity Views",
     "variants": [
      {"name":"","width":402,"height":1046,"outline":0,"node":"128:58645"}
     ],
     "uses": [
      "activity-views-header",
      "activity-views-contacts",
      "activity-views-apps",
      "activity-views-actions-2",
      "activity-views-actions",
      "buttons-button-liquid-glass-text"
     ]
    },
    {
     "id": "alerts-overlay",
     "name": "_Overlay - Alerts",
     "page": "Alerts",
     "helper": true,
     "variants": [
      {"name":"","width":100,"height":100,"outline":0,"node":"12956:27840"}
     ]
    },
    {
     "id": "alerts-text-field-background",
     "name": "_Text Field Background",
     "page": "Alerts",
     "helper": true,
     "variants": [
      {"name":"","width":160,"height":52,"outline":0,"node":"5469:8387"}
     ]
    },
    {
     "id": "alerts-buttons",
     "name": "_Buttons",
     "page": "Alerts",
     "helper": true,
     "variant_props": [
      {
       "name": "Role",
       "values": [
        "None",
        "Default",
        "Destructive",
        "Cancel"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Action\""
      }
     ],
     "variants": [
      {"name":"Role=Default","width":86,"height":48,"outline":0,"node":"5446:6658"},
      {"name":"Role=None","width":86,"height":48,"outline":1,"node":"5446:6654"},
      {"name":"Role=Cancel","width":86,"height":48,"outline":2,"node":"10513:3958"},
      {"name":"Role=Destructive","width":86,"height":48,"outline":3,"node":"5446:6664"}
     ]
    },
    {
     "id": "alerts-text-field",
     "name": "Text Field",
     "page": "Alerts",
     "props": [
      {
       "name": "Second Field",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"","width":272,"height":123,"outline":0,"node":"12616:942"}
     ],
     "uses": [
      "alerts-text-field-background",
      "text-fields-field"
     ]
    },
    {
     "id": "alerts-alert",
     "name": "Alert",
     "page": "Alerts",
     "hig": "alerts",
     "variant_props": [
      {
       "name": "Button Layout",
       "values": [
        "Side-by-Side",
        "Stacked"
       ]
      }
     ],
     "props": [
      {
       "name": "Actions",
       "type": "slot",
       "note": "Add, remove or reorder Alert buttons."
      },
      {
       "name": "Message",
       "type": "text",
       "default": "\"A message should be a short, complete s…\""
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"A Short Title Is Best\""
      },
      {
       "name": "Show Message",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Text Field",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Button Layout=Side-by-Side","width":300,"height":307,"outline":0,"node":"65:57149"},
      {"name":"Button Layout=Stacked","width":300,"height":419,"outline":1,"node":"61:67601"}
     ],
     "uses": [
      "materials-liquid-glass-regular-medium",
      "alerts-text-field",
      "alerts-buttons"
     ]
    },
    {
     "id": "buttons-button-content-area",
     "name": "Button - Content Area",
     "page": "Buttons",
     "hig": "buttons",
     "variant_props": [
      {
       "name": "Destructive",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Label Style",
       "values": [
        "Title and Icon",
        "Icon only",
        "Title only"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium",
        "Large"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Bordered - Prominent",
        "Bordered",
        "Borderless"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Play\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol play.fill"
      }
     ],
     "variants": [
      {"name":"Size=Large, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=True","width":50,"height":50,"outline":0,"node":"5473:20407"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=True","width":34,"height":34,"outline":1,"node":"5473:20409"},
      {"name":"Size=Small, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=True","width":28,"height":28,"outline":2,"node":"5473:20411"},
      {"name":"Size=Large, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=True","width":50,"height":50,"outline":3,"node":"5473:20449"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=True","width":34,"height":34,"outline":4,"node":"5473:20451"},
      {"name":"Size=Small, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=True","width":28,"height":28,"outline":5,"node":"5473:20453"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=True","width":50,"height":50,"outline":3,"node":"5473:20491"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=True","width":34,"height":34,"outline":4,"node":"5473:20494"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=True","width":28,"height":28,"outline":5,"node":"5473:20497"},
      {"name":"Size=Large, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=True","width":50,"height":50,"outline":6,"node":"5473:20413"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=True","width":34,"height":34,"outline":7,"node":"5473:20415"},
      {"name":"Size=Small, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=True","width":28,"height":28,"outline":8,"node":"5473:20417"},
      {"name":"Size=Large, Style=Bordered, Label Style=Icon only, Is Enabled=True, Destructive=True","width":50,"height":50,"outline":9,"node":"5473:20455"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Icon only, Is Enabled=True, Destructive=True","width":34,"height":34,"outline":10,"node":"5473:20457"},
      {"name":"Size=Small, Style=Bordered, Label Style=Icon only, Is Enabled=True, Destructive=True","width":28,"height":28,"outline":11,"node":"5473:20459"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=True, Destructive=True","width":50,"height":50,"outline":12,"node":"5473:20500"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=True, Destructive=True","width":34,"height":34,"outline":13,"node":"5473:20502"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=True, Destructive=True","width":28,"height":28,"outline":14,"node":"5473:20504"},
      {"name":"Size=Large, Style=Borderless, Label Style=Title only, Is Enabled=False, Destructive=True","width":73,"height":50,"outline":15,"node":"5473:20419"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Title only, Is Enabled=False, Destructive=True","width":57,"height":34,"outline":16,"node":"5473:20421"},
      {"name":"Size=Small, Style=Borderless, Label Style=Title only, Is Enabled=False, Destructive=True","width":49,"height":28,"outline":17,"node":"5473:20423"},
      {"name":"Size=Large, Style=Bordered, Label Style=Title only, Is Enabled=False, Destructive=True","width":73,"height":50,"outline":18,"node":"5473:20461"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Title only, Is Enabled=False, Destructive=True","width":57,"height":34,"outline":19,"node":"5473:20463"},
      {"name":"Size=Small, Style=Bordered, Label Style=Title only, Is Enabled=False, Destructive=True","width":49,"height":28,"outline":20,"node":"5473:20465"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=False, Destructive=True","width":73,"height":50,"outline":18,"node":"5473:20506"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=False, Destructive=True","width":57,"height":34,"outline":19,"node":"5473:20509"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=False, Destructive=True","width":49,"height":28,"outline":20,"node":"5473:20512"},
      {"name":"Size=Large, Style=Borderless, Label Style=Title only, Is Enabled=True, Destructive=True","width":73,"height":50,"outline":21,"node":"5473:20425"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Title only, Is Enabled=True, Destructive=True","width":57,"height":34,"outline":22,"node":"5473:20427"},
      {"name":"Size=Small, Style=Borderless, Label Style=Title only, Is Enabled=True, Destructive=True","width":49,"height":28,"outline":23,"node":"5473:20429"},
      {"name":"Size=Large, Style=Bordered, Label Style=Title only, Is Enabled=True, Destructive=True","width":73,"height":50,"outline":24,"node":"5473:20467"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Title only, Is Enabled=True, Destructive=True","width":57,"height":34,"outline":25,"node":"5473:20469"},
      {"name":"Size=Small, Style=Bordered, Label Style=Title only, Is Enabled=True, Destructive=True","width":49,"height":28,"outline":26,"node":"5473:20471"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=True, Destructive=True","width":73,"height":50,"outline":27,"node":"5473:20515"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=True, Destructive=True","width":57,"height":34,"outline":28,"node":"5473:20517"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=True, Destructive=True","width":49,"height":28,"outline":29,"node":"5473:20519"},
      {"name":"Size=Large, Style=Borderless, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":92,"height":50,"outline":30,"node":"5473:20434"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":75,"height":34,"outline":31,"node":"5473:20440"},
      {"name":"Size=Small, Style=Borderless, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":66,"height":28,"outline":32,"node":"5473:20446"},
      {"name":"Size=Large, Style=Bordered, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":92,"height":50,"outline":33,"node":"5473:20476"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":75,"height":34,"outline":34,"node":"5473:20482"},
      {"name":"Size=Small, Style=Bordered, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":66,"height":28,"outline":35,"node":"5473:20488"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":92,"height":50,"outline":33,"node":"5473:20524"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":75,"height":34,"outline":34,"node":"5473:20531"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=False, Destructive=True","width":66,"height":28,"outline":35,"node":"5473:20538"},
      {"name":"Size=Large, Style=Borderless, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":92,"height":50,"outline":36,"node":"5473:20431"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":75,"height":34,"outline":37,"node":"5473:20437"},
      {"name":"Size=Small, Style=Borderless, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":66,"height":28,"outline":38,"node":"5473:20443"},
      {"name":"Size=Large, Style=Bordered, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":92,"height":50,"outline":39,"node":"5473:20473"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":75,"height":34,"outline":40,"node":"5473:20479"},
      {"name":"Size=Small, Style=Bordered, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":66,"height":28,"outline":41,"node":"5473:20485"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":92,"height":50,"outline":42,"node":"5473:20521"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":75,"height":34,"outline":43,"node":"5473:20528"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=True, Destructive=True","width":66,"height":28,"outline":44,"node":"5473:20535"},
      {"name":"Size=Large, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=False","width":50,"height":50,"outline":0,"node":"40:58794"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=False","width":34,"height":34,"outline":1,"node":"40:58790"},
      {"name":"Size=Small, Style=Borderless, Label Style=Icon only, Is Enabled=False, Destructive=False","width":28,"height":28,"outline":2,"node":"40:58786"},
      {"name":"Size=Large, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=False","width":50,"height":50,"outline":3,"node":"40:59290"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=False","width":34,"height":34,"outline":4,"node":"40:59282"},
      {"name":"Size=Small, Style=Bordered, Label Style=Icon only, Is Enabled=False, Destructive=False","width":28,"height":28,"outline":5,"node":"40:59274"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=False","width":50,"height":50,"outline":3,"node":"40:59338"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=False","width":34,"height":34,"outline":4,"node":"40:59330"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=False, Destructive=False","width":28,"height":28,"outline":5,"node":"40:59322"},
      {"name":"Size=Large, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=False","width":50,"height":50,"outline":45,"node":"40:58694"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=False","width":34,"height":34,"outline":46,"node":"40:58691"},
      {"name":"Size=Small, Style=Borderless, Label Style=Icon only, Is Enabled=True, Destructive=False","width":28,"height":28,"outline":47,"node":"40:58690"},
      {"name":"Size=Large, Style=Bordered, Label Style=Icon only, Is Enabled=True, Destructive=False","width":50,"height":50,"outline":48,"node":"40:59288"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Icon only, Is Enabled=True, Destructive=False","width":34,"height":34,"outline":49,"node":"40:59280"},
      {"name":"Size=Small, Style=Bordered, Label Style=Icon only, Is Enabled=True, Destructive=False","width":28,"height":28,"outline":50,"node":"40:59272"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=True, Destructive=False","width":50,"height":50,"outline":51,"node":"40:59336"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=True, Destructive=False","width":34,"height":34,"outline":52,"node":"40:59328"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Icon only, Is Enabled=True, Destructive=False","width":28,"height":28,"outline":53,"node":"40:59320"},
      {"name":"Size=Large, Style=Borderless, Label Style=Title only, Is Enabled=False, Destructive=False","width":73,"height":50,"outline":15,"node":"5:108801"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Title only, Is Enabled=False, Destructive=False","width":57,"height":34,"outline":16,"node":"5:108825"},
      {"name":"Size=Small, Style=Borderless, Label Style=Title only, Is Enabled=False, Destructive=False","width":49,"height":28,"outline":17,"node":"5:108849"},
      {"name":"Size=Large, Style=Bordered, Label Style=Title only, Is Enabled=False, Destructive=False","width":73,"height":50,"outline":18,"node":"5:108657"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Title only, Is Enabled=False, Destructive=False","width":57,"height":34,"outline":19,"node":"5:108681"},
      {"name":"Size=Small, Style=Bordered, Label Style=Title only, Is Enabled=False, Destructive=False","width":49,"height":28,"outline":20,"node":"5:108705"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=False, Destructive=False","width":73,"height":50,"outline":18,"node":"8577:2023"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=False, Destructive=False","width":57,"height":34,"outline":19,"node":"5:108609"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=False, Destructive=False","width":49,"height":28,"outline":20,"node":"5:108633"},
      {"name":"Size=Large, Style=Borderless, Label Style=Title only, Is Enabled=True, Destructive=False","width":73,"height":50,"outline":54,"node":"5:108795"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Title only, Is Enabled=True, Destructive=False","width":57,"height":34,"outline":55,"node":"5:108819"},
      {"name":"Size=Small, Style=Borderless, Label Style=Title only, Is Enabled=True, Destructive=False","width":49,"height":28,"outline":56,"node":"5:108843"},
      {"name":"Size=Large, Style=Bordered, Label Style=Title only, Is Enabled=True, Destructive=False","width":73,"height":50,"outline":57,"node":"5:108651"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Title only, Is Enabled=True, Destructive=False","width":57,"height":34,"outline":58,"node":"5:108675"},
      {"name":"Size=Small, Style=Bordered, Label Style=Title only, Is Enabled=True, Destructive=False","width":49,"height":28,"outline":59,"node":"5:108699"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=True, Destructive=False","width":73,"height":50,"outline":60,"node":"5:108579"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=True, Destructive=False","width":57,"height":34,"outline":61,"node":"5:108603"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Title only, Is Enabled=True, Destructive=False","width":49,"height":28,"outline":62,"node":"5:108627"},
      {"name":"Size=Large, Style=Borderless, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":92,"height":50,"outline":30,"node":"40:58796"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":75,"height":34,"outline":31,"node":"40:58792"},
      {"name":"Size=Small, Style=Borderless, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":66,"height":28,"outline":32,"node":"40:58788"},
      {"name":"Size=Large, Style=Bordered, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":92,"height":50,"outline":33,"node":"40:59294"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":75,"height":34,"outline":34,"node":"40:59286"},
      {"name":"Size=Small, Style=Bordered, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":66,"height":28,"outline":35,"node":"40:59278"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":92,"height":50,"outline":33,"node":"40:59342"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":75,"height":34,"outline":34,"node":"40:59334"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=False, Destructive=False","width":66,"height":28,"outline":35,"node":"40:59326"},
      {"name":"Size=Large, Style=Borderless, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":92,"height":50,"outline":63,"node":"40:58695"},
      {"name":"Size=Medium, Style=Borderless, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":75,"height":34,"outline":64,"node":"40:58693"},
      {"name":"Size=Small, Style=Borderless, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":66,"height":28,"outline":65,"node":"40:58692"},
      {"name":"Size=Large, Style=Bordered, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":92,"height":50,"outline":66,"node":"40:59292"},
      {"name":"Size=Medium, Style=Bordered, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":75,"height":34,"outline":67,"node":"40:59284"},
      {"name":"Size=Small, Style=Bordered, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":66,"height":28,"outline":68,"node":"40:59276"},
      {"name":"Size=Large, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":92,"height":50,"outline":69,"node":"40:59340"},
      {"name":"Size=Medium, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":75,"height":34,"outline":70,"node":"40:59332"},
      {"name":"Size=Small, Style=Bordered - Prominent, Label Style=Title and Icon, Is Enabled=True, Destructive=False","width":66,"height":28,"outline":71,"node":"40:59324"}
     ]
    },
    {
     "id": "buttons-label-symbol-preferred",
     "name": "_Label - Symbol - Preferred",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "SF Symbol checkmark"
      }
     ],
     "variants": [
      {"name":"Is Enabled=False","width":28,"height":36,"outline":0,"node":"5522:11891"},
      {"name":"Is Enabled=True","width":28,"height":36,"outline":1,"node":"5522:11893"}
     ]
    },
    {
     "id": "buttons-label-symbol-default",
     "name": "_Label - Symbol - Default",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "SF Symbol checkmark"
      }
     ],
     "variants": [
      {"name":"Is Enabled=False","width":28,"height":36,"outline":0,"node":"5522:11878"},
      {"name":"Is Enabled=True","width":28,"height":36,"outline":1,"node":"5522:11880"}
     ]
    },
    {
     "id": "buttons-label-symbol-destructive-default",
     "name": "_Label - Symbol - Destructive Default",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "SF Symbol checkmark"
      }
     ],
     "variants": [
      {"name":"Is Enabled=False","width":28,"height":36,"outline":0,"node":"10456:14174"},
      {"name":"Is Enabled=True","width":28,"height":36,"outline":1,"node":"10456:14178"}
     ]
    },
    {
     "id": "buttons-button-liquid-glass-text",
     "name": "Button - Liquid Glass - Text",
     "page": "Buttons",
     "hig": "buttons",
     "variant_props": [
      {
       "name": "Destructive",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium",
        "Large"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Glass Prominent",
        "Glass"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Small, Style=Glass, Is Enabled=False, Destructive=True","width":60,"height":28,"outline":0,"node":"10456:14495"},
      {"name":"Size=Medium, Style=Glass, Is Enabled=False, Destructive=True","width":69,"height":34,"outline":1,"node":"10456:14447"},
      {"name":"Size=Large, Style=Glass, Is Enabled=False, Destructive=True","width":85,"height":50,"outline":2,"node":"10456:9809"},
      {"name":"Size=Small, Style=Glass, Is Enabled=True, Destructive=True","width":60,"height":28,"outline":3,"node":"10456:14498"},
      {"name":"Size=Medium, Style=Glass, Is Enabled=True, Destructive=True","width":69,"height":34,"outline":4,"node":"10456:14450"},
      {"name":"Size=Large, Style=Glass, Is Enabled=True, Destructive=True","width":85,"height":50,"outline":5,"node":"10456:9812"},
      {"name":"Size=Small, Style=Glass, Is Enabled=False, Destructive=False","width":60,"height":28,"outline":6,"node":"10456:14501"},
      {"name":"Size=Medium, Style=Glass, Is Enabled=False, Destructive=False","width":69,"height":34,"outline":7,"node":"10456:14453"},
      {"name":"Size=Large, Style=Glass, Is Enabled=False, Destructive=False","width":85,"height":50,"outline":8,"node":"10456:8888"},
      {"name":"Size=Small, Style=Glass, Is Enabled=True, Destructive=False","width":60,"height":28,"outline":9,"node":"10456:14504"},
      {"name":"Size=Medium, Style=Glass, Is Enabled=True, Destructive=False","width":69,"height":34,"outline":10,"node":"10456:14456"},
      {"name":"Size=Large, Style=Glass, Is Enabled=True, Destructive=False","width":85,"height":50,"outline":11,"node":"5473:21932"},
      {"name":"Size=Small, Style=Glass Prominent, Is Enabled=False, Destructive=True","width":60,"height":28,"outline":12,"node":"10456:14395"},
      {"name":"Size=Medium, Style=Glass Prominent, Is Enabled=False, Destructive=True","width":69,"height":34,"outline":13,"node":"10456:14339"},
      {"name":"Size=Large, Style=Glass Prominent, Is Enabled=False, Destructive=True","width":85,"height":50,"outline":14,"node":"10456:9815"},
      {"name":"Size=Small, Style=Glass Prominent, Is Enabled=True, Destructive=True","width":60,"height":28,"outline":15,"node":"10456:14398"},
      {"name":"Size=Medium, Style=Glass Prominent, Is Enabled=True, Destructive=True","width":69,"height":34,"outline":16,"node":"10456:14342"},
      {"name":"Size=Large, Style=Glass Prominent, Is Enabled=True, Destructive=True","width":85,"height":50,"outline":17,"node":"10456:9818"},
      {"name":"Size=Small, Style=Glass Prominent, Is Enabled=False, Destructive=False","width":60,"height":28,"outline":12,"node":"10456:14401"},
      {"name":"Size=Medium, Style=Glass Prominent, Is Enabled=False, Destructive=False","width":69,"height":34,"outline":13,"node":"10456:14345"},
      {"name":"Size=Large, Style=Glass Prominent, Is Enabled=False, Destructive=False","width":85,"height":50,"outline":14,"node":"10456:8885"},
      {"name":"Size=Small, Style=Glass Prominent, Is Enabled=True, Destructive=False","width":60,"height":28,"outline":15,"node":"10456:14404"},
      {"name":"Size=Medium, Style=Glass Prominent, Is Enabled=True, Destructive=False","width":69,"height":34,"outline":16,"node":"10456:14348"},
      {"name":"Size=Large, Style=Glass Prominent, Is Enabled=True, Destructive=False","width":85,"height":50,"outline":17,"node":"5473:21905"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "buttons-label-text"
     ]
    },
    {
     "id": "buttons-button-liquid-glass-symbol",
     "name": "Button - Liquid Glass - Symbol",
     "page": "Buttons",
     "hig": "buttons",
     "variant_props": [
      {
       "name": "Destructive",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Glass Prominent",
        "Glass"
       ]
      }
     ],
     "variants": [
      {"name":"Style=Glass, Is Enabled=False, Destructive=True","width":50,"height":50,"outline":0,"node":"10456:9821"},
      {"name":"Style=Glass, Is Enabled=True, Destructive=True","width":50,"height":50,"outline":0,"node":"10456:9824"},
      {"name":"Style=Glass Prominent, Is Enabled=False, Destructive=True","width":50,"height":50,"outline":1,"node":"10456:9827"},
      {"name":"Style=Glass Prominent, Is Enabled=True, Destructive=True","width":50,"height":50,"outline":2,"node":"10456:9830"},
      {"name":"Style=Glass Prominent, Is Enabled=False, Destructive=False","width":50,"height":50,"outline":1,"node":"10456:8891"},
      {"name":"Style=Glass Prominent, Is Enabled=True, Destructive=False","width":50,"height":50,"outline":2,"node":"5522:11867"},
      {"name":"Style=Glass, Is Enabled=False, Destructive=False","width":50,"height":50,"outline":1,"node":"10456:8894"},
      {"name":"Style=Glass, Is Enabled=True, Destructive=False","width":50,"height":50,"outline":1,"node":"5522:11870"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "buttons-label-symbol-destructive-default",
      "buttons-label-symbol-default",
      "buttons-label-symbol-preferred"
     ]
    },
    {
     "id": "buttons-label-text",
     "name": "_Label - Text",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Enabled",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Large",
        "Small"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Destructive",
        "Default",
        "Preferred"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Size=Large, Type=Preferred, Is Enabled=False","width":45,"height":18,"outline":0,"node":"5522:11900"},
      {"name":"Size=Small, Type=Preferred, Is Enabled=False","width":40,"height":18,"outline":1,"node":"10462:31828"},
      {"name":"Size=Large, Type=Preferred, Is Enabled=True","width":45,"height":18,"outline":2,"node":"5522:11902"},
      {"name":"Size=Small, Type=Preferred, Is Enabled=True","width":40,"height":18,"outline":3,"node":"10462:31830"},
      {"name":"Size=Large, Type=Default, Is Enabled=False","width":45,"height":18,"outline":4,"node":"5522:11824"},
      {"name":"Size=Small, Type=Default, Is Enabled=False","width":40,"height":18,"outline":5,"node":"10462:31836"},
      {"name":"Size=Large, Type=Default, Is Enabled=True","width":45,"height":18,"outline":6,"node":"5522:11828"},
      {"name":"Size=Small, Type=Default, Is Enabled=True","width":40,"height":18,"outline":7,"node":"10462:31838"},
      {"name":"Size=Large, Type=Destructive, Is Enabled=False","width":45,"height":18,"outline":4,"node":"10456:14212"},
      {"name":"Size=Small, Type=Destructive, Is Enabled=False","width":40,"height":18,"outline":5,"node":"10462:31844"},
      {"name":"Size=Large, Type=Destructive, Is Enabled=True","width":45,"height":18,"outline":8,"node":"10456:14214"},
      {"name":"Size=Small, Type=Destructive, Is Enabled=True","width":40,"height":18,"outline":9,"node":"10462:31846"}
     ]
    },
    {
     "id": "color-pickers-toolbar",
     "name": "_Toolbar",
     "page": "Color Pickers",
     "helper": true,
     "variants": [
      {"name":"","width":402,"height":49,"outline":0,"node":"5584:57400"}
     ],
     "uses": [
      "color-pickers-button",
      "color-pickers-title"
     ]
    },
    {
     "id": "color-pickers-button",
     "name": "_Button",
     "page": "Color Pickers",
     "helper": true,
     "variants": [
      {"name":"","width":24,"height":44,"outline":0,"node":"5704:26030"}
     ]
    },
    {
     "id": "color-pickers-picker-ipad",
     "name": "Color Picker - iPad",
     "page": "Color Pickers",
     "variants": [
      {"name":"","width":402,"height":691,"outline":0,"node":"515:56319"}
     ],
     "uses": [
      "popovers-ipad-only",
      "color-pickers-toolbar",
      "segmented-controls-control"
     ]
    },
    {
     "id": "color-pickers-picker-iphone",
     "name": "Color Picker - iPhone",
     "page": "Color Pickers",
     "variants": [
      {"name":"","width":402,"height":874,"outline":0,"node":"0:5275"}
     ],
     "uses": [
      "sheets-overlay",
      "materials-liquid-glass-regular-medium",
      "color-pickers-toolbar",
      "segmented-controls-control"
     ]
    },
    {
     "id": "color-pickers-title",
     "name": "_Title",
     "page": "Color Pickers",
     "helper": true,
     "variants": [
      {"name":"","width":52,"height":22,"outline":0,"node":"5831:1406"}
     ]
    },
    {
     "id": "color-pickers-picker-button",
     "name": "Picker Button",
     "page": "Color Pickers",
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Small",
        "Large"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Large, Selected=True","width":36,"height":36,"outline":0,"node":"128:75180"},
      {"name":"Size=Large, Selected=False","width":36,"height":36,"outline":1,"node":"128:75178"},
      {"name":"Size=Small, Selected=True","width":28,"height":28,"outline":2,"node":"128:75287"},
      {"name":"Size=Small, Selected=False","width":28,"height":28,"outline":3,"node":"128:75285"}
     ]
    },
    {
     "id": "contextual-menus-context-menu-dimming-overlay",
     "name": "Context Menu - Dimming Overlay",
     "page": "Contextual Menus",
     "variants": [
      {"name":"","width":200,"height":200,"outline":0,"node":"128:76929"}
     ]
    },
    {
     "id": "contextual-menus-context-menu",
     "name": "Context Menu",
     "page": "Contextual Menus",
     "hig": "context-menus",
     "variant_props": [
      {
       "name": "Alignment",
       "values": [
        "Vertical",
        "Horizontal (iPad only)"
       ]
      },
      {
       "name": "Side",
       "values": [
        "Trailing",
        "Leading"
       ]
      }
     ],
     "variants": [
      {"name":"Alignment=Horizontal (iPad only), Side=Trailing","width":351,"height":161,"outline":0,"node":"128:77880"},
      {"name":"Alignment=Horizontal (iPad only), Side=Leading","width":351,"height":161,"outline":1,"node":"128:77888"},
      {"name":"Alignment=Vertical, Side=Trailing","width":351,"height":160,"outline":2,"node":"125:58751"},
      {"name":"Alignment=Vertical, Side=Leading","width":351,"height":160,"outline":3,"node":"125:58302"}
     ],
     "uses": [
      "menus-menu"
     ]
    },
    {
     "id": "date-and-time-pickers-collapsed",
     "name": "Date and time - Collapsed",
     "page": "Date and Time Pickers",
     "section": "Pickers",
     "hig": "pickers",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Selected"
       ]
      }
     ],
     "props": [
      {
       "name": "Month",
       "type": "text",
       "default": "\"Apr 1,\""
      },
      {
       "name": "Year",
       "type": "text",
       "default": "\"2026\""
      },
      {
       "name": "Time",
       "type": "text",
       "default": "\"9:41 AM\""
      },
      {
       "name": "Show date",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show time",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Default","width":204,"height":34,"outline":0,"node":"30:53923"},
      {"name":"State=Selected","width":204,"height":34,"outline":1,"node":"5442:5039"}
     ]
    },
    {
     "id": "date-and-time-pickers",
     "name": "Date and time - Pickers",
     "page": "Date and Time Pickers",
     "section": "Pickers",
     "hig": "pickers",
     "variant_props": [
      {
       "name": "Style",
       "values": [
        "Compact",
        "Inline"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Date",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Time",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Text",
       "type": "text",
       "default": "\"Time\""
      }
     ],
     "variants": [
      {"name":"Style=Inline","width":370,"height":377,"outline":0,"node":"51:56014"},
      {"name":"Style=Compact","width":370,"height":377,"outline":1,"node":"51:60427"}
     ],
     "uses": [
      "date-and-time-pickers-week",
      "date-and-time-pickers-collapsed",
      "materials-liquid-glass-regular-large"
     ]
    },
    {
     "id": "date-and-time-pickers-week",
     "name": "_Week",
     "page": "Date and Time Pickers",
     "helper": true,
     "variants": [
      {"name":"","width":338,"height":38,"outline":0,"node":"50:63951"}
     ],
     "uses": [
      "date-and-time-pickers-day"
     ]
    },
    {
     "id": "date-and-time-pickers-day",
     "name": "_Day",
     "page": "Date and Time Pickers",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Current",
        "Selected",
        "Current and Selected",
        "Null"
       ]
      }
     ],
     "props": [
      {
       "name": "Date",
       "type": "text",
       "default": "\"1\""
      }
     ],
     "variants": [
      {"name":"State=Current and Selected","width":38,"height":38,"outline":0,"node":"50:63912"},
      {"name":"State=Selected","width":38,"height":38,"outline":1,"node":"50:63910"},
      {"name":"State=Current","width":38,"height":38,"outline":2,"node":"50:63908"},
      {"name":"State=Default","width":38,"height":38,"outline":3,"node":"50:63906"},
      {"name":"State=Null","width":38,"height":38,"outline":4,"node":"50:64151"}
     ]
    },
    {
     "id": "empty-states",
     "name": "Empty States",
     "page": "Empty States",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Title and Subtitle",
        "Symbol in Circle",
        "Large Symbol"
       ]
      }
     ],
     "props": [
      {
       "name": "Description",
       "type": "text",
       "default": "\"Description\""
      },
      {
       "name": "Message",
       "type": "text",
       "default": "\"Message\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol star.fill"
      }
     ],
     "variants": [
      {"name":"Type=Large Symbol","width":402,"height":874,"outline":0,"node":"5583:24409"},
      {"name":"Type=Symbol in Circle","width":402,"height":874,"outline":1,"node":"5583:24421"},
      {"name":"Type=Title and Subtitle","width":402,"height":874,"outline":2,"node":"5583:24435"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "buttons-button-liquid-glass-text"
     ]
    },
    {
     "id": "face-id",
     "name": "Face ID",
     "page": "Face ID",
     "hig": "privacy",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Authenticating",
        "Success"
       ]
      }
     ],
     "variants": [
      {"name":"State=Success","width":402,"height":190,"outline":0,"node":"123:58197"},
      {"name":"State=Authenticating","width":402,"height":190,"outline":1,"node":"123:58202"}
     ]
    },
    {
     "id": "keyboards-iphone-autocorrection",
     "name": "_Autocorrection",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "props": [
      {
       "name": "Option 1",
       "type": "text",
       "default": "\"“The”\""
      },
      {
       "name": "Option 2",
       "type": "text",
       "default": "\"the\""
      },
      {
       "name": "Option 3",
       "type": "text",
       "default": "\"to\""
      }
     ],
     "variants": [
      {"name":"","width":300,"height":25,"outline":0,"node":"107:60745"}
     ]
    },
    {
     "id": "keyboards-iphone-suggestion",
     "name": "_Suggestion",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "props": [
      {
       "name": "Email",
       "type": "text",
       "default": "\"Smith.Trev@icloud.com\""
      }
     ],
     "variants": [
      {"name":"","width":402,"height":25,"outline":0,"node":"6334:14410"}
     ]
    },
    {
     "id": "keyboards-iphone-number-pad",
     "name": "_Number Pad",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Number",
        "Number + ABC",
        "Delete"
       ]
      }
     ],
     "props": [
      {
       "name": "Line 1",
       "type": "text",
       "default": "\"3\""
      },
      {
       "name": "Line 2",
       "type": "text",
       "default": "\"DEF\""
      }
     ],
     "variants": [
      {"name":"Type=Delete","width":125,"height":47,"outline":0,"node":"106:59856"},
      {"name":"Type=Number","width":125,"height":47,"outline":1,"node":"106:59725"},
      {"name":"Type=Number + ABC","width":125,"height":47,"outline":2,"node":"106:59549"}
     ]
    },
    {
     "id": "keyboards-iphone-keys",
     "name": "_Keys - iPhone",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Upper Case",
        "Lower Case",
        "Punctuation",
        "Special Charaters (not capitalized)",
        "Symbol",
        "Return - Default",
        "Return - Prominent",
        "Space",
        "Shift - On",
        "Shift - Off",
        "Delete",
        "Keyboard Switch - 123",
        "Keyboard Switch - ABC",
        "Number and Punctuation Switch - 123",
        "Number and Punctuation Switch - #+",
        ".com"
       ]
      }
     ],
     "props": [
      {
       "name": "Punctuation",
       "type": "text",
       "default": "\".\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol arrow.forward"
      },
      {
       "name": "Letter",
       "type": "text",
       "default": "\"q\""
      },
      {
       "name": "Character",
       "type": "text",
       "default": "\"_\""
      }
     ],
     "variants": [
      {"name":"Type=.com","width":50,"height":43,"outline":0,"node":"10461:20320"},
      {"name":"Type=Delete","width":50,"height":43,"outline":1,"node":"8615:2045"},
      {"name":"Type=Shift - Off","width":50,"height":43,"outline":2,"node":"10461:20322"},
      {"name":"Type=Shift - On","width":50,"height":43,"outline":3,"node":"8615:2037"},
      {"name":"Type=Space","width":50,"height":43,"outline":4,"node":"6506:5534"},
      {"name":"Type=Number and Punctuation Switch - 123","width":50,"height":43,"outline":5,"node":"5511:69741"},
      {"name":"Type=Number and Punctuation Switch - #+","width":50,"height":43,"outline":6,"node":"5511:67116"},
      {"name":"Type=Keyboard Switch - ABC","width":50,"height":43,"outline":7,"node":"5511:67114"},
      {"name":"Type=Keyboard Switch - 123","width":50,"height":43,"outline":8,"node":"5511:67112"},
      {"name":"Type=Return - Prominent","width":50,"height":43,"outline":9,"node":"5511:67104"},
      {"name":"Type=Return - Default","width":50,"height":43,"outline":10,"node":"5511:67102"},
      {"name":"Type=Symbol","width":50,"height":43,"outline":11,"node":"5511:67100"},
      {"name":"Type=Special Charaters (not capitalized)","width":50,"height":43,"outline":12,"node":"5511:67110"},
      {"name":"Type=Punctuation","width":50,"height":43,"outline":13,"node":"5511:67106"},
      {"name":"Type=Lower Case","width":50,"height":43,"outline":14,"node":"118:60224"},
      {"name":"Type=Upper Case","width":50,"height":43,"outline":15,"node":"5511:67108"}
     ]
    },
    {
     "id": "keyboards-iphone-previous",
     "name": "_Previous",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Enabled=False","width":24,"height":22,"outline":0,"node":"117:72002"},
      {"name":"Enabled=True","width":24,"height":22,"outline":1,"node":"117:71999"}
     ]
    },
    {
     "id": "keyboards-iphone-next",
     "name": "_Next",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Enabled=False","width":24,"height":22,"outline":0,"node":"117:72005"},
      {"name":"Enabled=True","width":24,"height":22,"outline":1,"node":"117:71994"}
     ]
    },
    {
     "id": "keyboards-iphone-symbol",
     "name": "_Symbol",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variants": [
      {"name":"","width":28,"height":22,"outline":0,"node":"5522:15638"}
     ]
    },
    {
     "id": "keyboards-iphone-field-bg",
     "name": "_Field - BG",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variants": [
      {"name":"","width":140,"height":36,"outline":0,"node":"5522:15880"}
     ]
    },
    {
     "id": "keyboards-iphone-field-find",
     "name": "_Field - Find",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Typing",
        "Focused",
        "Text Entered"
       ]
      }
     ],
     "props": [
      {
       "name": "Search Text",
       "type": "text",
       "default": "\"Find\""
      },
      {
       "name": "Total",
       "type": "text",
       "default": "\"6\""
      },
      {
       "name": "Current",
       "type": "text",
       "default": "\"3\""
      }
     ],
     "variants": [
      {"name":"State=Text Entered","width":200,"height":22,"outline":0,"node":"5522:14988"},
      {"name":"State=Typing","width":200,"height":23,"outline":1,"node":"5522:15008"},
      {"name":"State=Focused","width":200,"height":23,"outline":2,"node":"5522:15024"},
      {"name":"State=Default","width":200,"height":22,"outline":3,"node":"5522:15038"}
     ]
    },
    {
     "id": "keyboards-iphone-field-replace",
     "name": "_Field - Replace",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Typing",
        "Focused",
        "Text Entered"
       ]
      }
     ],
     "props": [
      {
       "name": "Replace Text",
       "type": "text",
       "default": "\"Replace\""
      }
     ],
     "variants": [
      {"name":"State=Text Entered","width":200,"height":22,"outline":0,"node":"5522:15559"},
      {"name":"State=Typing","width":200,"height":23,"outline":1,"node":"5522:15581"},
      {"name":"State=Focused","width":200,"height":23,"outline":2,"node":"5522:15597"},
      {"name":"State=Default","width":200,"height":22,"outline":3,"node":"5522:15609"}
     ]
    },
    {
     "id": "keyboards-iphone-replace-button",
     "name": "_Replace Button",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Value",
       "type": "text",
       "default": "\"Replace\""
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":62,"height":22,"outline":0,"node":"5522:17155"},
      {"name":"State=Default","width":62,"height":22,"outline":1,"node":"5522:17139"}
     ]
    },
    {
     "id": "keyboards-iphone-button-symbol-keyboard",
     "name": "_Button - Symbol Keyboard",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "Disabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"Disabled=True","width":36,"height":36,"outline":0,"node":"5522:14763"},
      {"name":"Disabled=True","width":36,"height":36,"outline":1,"node":"5522:14769"}
     ]
    },
    {
     "id": "keyboards-iphone-accessory-bar-search",
     "name": "Accessory Bar - iPhone/Search",
     "page": "Keyboards",
     "section": "iPhone",
     "props": [
      {
       "name": "Placeholder",
       "type": "text",
       "default": "\"https://www.\""
      }
     ],
     "variants": [
      {"name":"","width":402,"height":48,"outline":0,"node":"12892:51491"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "keyboards-iphone-symbol"
     ]
    },
    {
     "id": "keyboards-iphone-accessory-bar-toolbar",
     "name": "Accessory Bar - iPhone/Toolbar",
     "page": "Keyboards",
     "section": "iPhone",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Button Group",
        "Button"
       ]
      }
     ],
     "props": [
      {
       "name": "Buttons",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Type=Button Group","width":168,"height":48,"outline":0,"node":"5522:14799"},
      {"name":"Type=Button","width":72,"height":48,"outline":1,"node":"5522:14808"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "keyboards-iphone-button-symbol-keyboard"
     ]
    },
    {
     "id": "keyboards-iphone-accessory-bar-find",
     "name": "Accessory Bar - iPhone/Find",
     "page": "Keyboards",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":50,"outline":0,"node":"5522:12009"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "keyboards-iphone-previous",
      "keyboards-iphone-next",
      "keyboards-iphone-field-find",
      "buttons-button-liquid-glass-symbol"
     ]
    },
    {
     "id": "keyboards-iphone-accessory-bar-url",
     "name": "Accessory Bar - iPhone/URL",
     "page": "Keyboards",
     "section": "iPhone",
     "props": [
      {
       "name": "Value",
       "type": "text",
       "default": "\"https://www.\""
      }
     ],
     "variants": [
      {"name":"","width":402,"height":48,"outline":0,"node":"6334:12956"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "keyboards-iphone-symbol"
     ]
    },
    {
     "id": "keyboards-iphone-accessory-bar-web-form",
     "name": "Accessory Bar - iPhone/Web Form",
     "page": "Keyboards",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":86,"outline":0,"node":"6334:13082"}
     ],
     "uses": [
      "buttons-button-liquid-glass-text",
      "materials-liquid-glass-regular-small"
     ]
    },
    {
     "id": "keyboards-iphone-accessory-bar-find-and-replace",
     "name": "Accessory Bar - iPhone/Find and Replace",
     "page": "Keyboards",
     "section": "iPhone",
     "variants": [
      {"name":"","width":402,"height":101,"outline":0,"node":"5522:14346"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "keyboards-iphone-previous",
      "keyboards-iphone-next",
      "keyboards-iphone-field-bg",
      "keyboards-iphone-field-find",
      "keyboards-iphone-replace-button",
      "keyboards-iphone-field-replace"
     ]
    },
    {
     "id": "keyboards-iphone-keyboard",
     "name": "Keyboard",
     "page": "Keyboards",
     "section": "iPhone",
     "hig": "onscreen-keyboards",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Lower Case",
        "Upper Case",
        "Punctuation",
        "Numeric",
        "Web",
        "URL",
        "Email",
        "Number Pad",
        "Emoji"
       ]
      }
     ],
     "props": [
      {
       "name": "Show suggestions",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Type=Upper Case","width":402,"height":332,"outline":0,"node":"10462:23337"},
      {"name":"Type=Lower Case","width":402,"height":332,"outline":1,"node":"106:59544"},
      {"name":"Type=Numeric","width":402,"height":332,"outline":2,"node":"10462:23835"},
      {"name":"Type=Punctuation","width":402,"height":332,"outline":3,"node":"10462:23509"},
      {"name":"Type=Email","width":402,"height":332,"outline":4,"node":"6334:12750"},
      {"name":"Type=URL","width":402,"height":307,"outline":5,"node":"10462:23672"},
      {"name":"Type=Web","width":402,"height":307,"outline":6,"node":"6334:12109"},
      {"name":"Type=Number Pad","width":402,"height":308,"outline":7,"node":"106:60978"},
      {"name":"Type=Emoji","width":402,"height":392,"outline":8,"node":"113:74493"}
     ],
     "uses": [
      "keyboards-background-keyboard",
      "keyboards-iphone-autocorrection",
      "keyboards-iphone-keys",
      "keyboards-iphone-bottom-buttons",
      "keyboards-iphone-suggestion",
      "keyboards-iphone-number-pad",
      "keyboards-iphone-search-emoji",
      "keyboards-iphone-emoji-tabs"
     ]
    },
    {
     "id": "keyboards-iphone-bottom-buttons",
     "name": "_Bottom Buttons",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Emoji and Mic",
        "ABC and Mic"
       ]
      }
     ],
     "variants": [
      {"name":"Type=ABC and Mic","width":240,"height":78,"outline":0,"node":"5915:55553"},
      {"name":"Type=Emoji and Mic","width":240,"height":78,"outline":1,"node":"8621:2840"}
     ]
    },
    {
     "id": "keyboards-iphone-emoji-tabs",
     "name": "_Emoji Tabs",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variants": [
      {"name":"","width":402,"height":42,"outline":0,"node":"5915:55554"}
     ]
    },
    {
     "id": "keyboards-iphone-search-emoji",
     "name": "_Search Emoji",
     "page": "Keyboards",
     "section": "iPhone",
     "helper": true,
     "variants": [
      {"name":"","width":402,"height":57,"outline":0,"node":"5915:57671"}
     ]
    },
    {
     "id": "keyboards-iphone-duo-keys",
     "name": "_Keys - iPhone Duo",
     "page": "Keyboards",
     "section": "iPhone Duo",
     "helper": true,
     "variant_props": [
      {
       "name": "Display",
       "values": [
        "Outer",
        "Inner"
       ]
      },
      {
       "name": "Orientation",
       "values": [
        "Portrait",
        "Landscape"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Upper Case",
        "Lower Case",
        "Punctuation",
        "Special Charaters (not capitalized)",
        "Symbol",
        "Return - Default",
        "Return - Prominent",
        "Space",
        "Shift - On",
        "Shift - Off",
        "Delete",
        "Keyboard Switch - 123",
        "Keyboard Switch - ABC",
        "Number and Punctuation Switch - 123",
        "Number and Punctuation Switch - #+",
        ".com"
       ]
      }
     ],
     "props": [
      {
       "name": "Punctuation",
       "type": "text",
       "default": "\".\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol arrow.forward"
      },
      {
       "name": "Letter",
       "type": "text",
       "default": "\"q\""
      },
      {
       "name": "Character",
       "type": "text",
       "default": "\"_\""
      }
     ],
     "variants": [
      {"name":"Type=.com, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":0,"node":"12890:26684"},
      {"name":"Type=.com, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":1,"node":"12890:32356"},
      {"name":"Type=.com, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":0,"node":"12890:32290"},
      {"name":"Type=.com, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":1,"node":"12890:32482"},
      {"name":"Type=Delete, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":2,"node":"12890:26686"},
      {"name":"Type=Delete, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":3,"node":"12890:32358"},
      {"name":"Type=Delete, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":4,"node":"12890:32292"},
      {"name":"Type=Delete, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":5,"node":"12890:32484"},
      {"name":"Type=Shift - Off, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":6,"node":"12890:26688"},
      {"name":"Type=Shift - Off, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":7,"node":"12890:32360"},
      {"name":"Type=Shift - Off, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":6,"node":"12890:32294"},
      {"name":"Type=Shift - Off, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":7,"node":"12890:32486"},
      {"name":"Type=Shift - On, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":8,"node":"12890:26690"},
      {"name":"Type=Shift - On, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":9,"node":"12890:32362"},
      {"name":"Type=Shift - On, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":8,"node":"12890:32296"},
      {"name":"Type=Shift - On, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":10,"node":"12890:32488"},
      {"name":"Type=Space, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":11,"node":"12890:26692"},
      {"name":"Type=Space, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":12,"node":"12890:32364"},
      {"name":"Type=Space, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":11,"node":"12890:32298"},
      {"name":"Type=Space, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":12,"node":"12890:32490"},
      {"name":"Type=Number and Punctuation Switch - 123, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":13,"node":"12890:26693"},
      {"name":"Type=Number and Punctuation Switch - 123, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":14,"node":"12890:32365"},
      {"name":"Type=Number and Punctuation Switch - 123, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":13,"node":"12890:32299"},
      {"name":"Type=Number and Punctuation Switch - 123, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":15,"node":"12890:32491"},
      {"name":"Type=Number and Punctuation Switch - #+, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":16,"node":"12890:26695"},
      {"name":"Type=Number and Punctuation Switch - #+, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":17,"node":"12890:32367"},
      {"name":"Type=Number and Punctuation Switch - #+, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":18,"node":"12890:32301"},
      {"name":"Type=Number and Punctuation Switch - #+, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":19,"node":"12890:32493"},
      {"name":"Type=Keyboard Switch - ABC, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":20,"node":"12890:26697"},
      {"name":"Type=Keyboard Switch - ABC, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":21,"node":"12890:32369"},
      {"name":"Type=Keyboard Switch - ABC, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":22,"node":"12890:32303"},
      {"name":"Type=Keyboard Switch - ABC, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":23,"node":"12890:32495"},
      {"name":"Type=Keyboard Switch - 123, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":24,"node":"12890:26699"},
      {"name":"Type=Keyboard Switch - 123, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":25,"node":"12890:32371"},
      {"name":"Type=Keyboard Switch - 123, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":24,"node":"12890:32305"},
      {"name":"Type=Keyboard Switch - 123, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":26,"node":"12890:32497"},
      {"name":"Type=Return - Prominent, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":27,"node":"12890:26701"},
      {"name":"Type=Return - Prominent, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":28,"node":"12890:32373"},
      {"name":"Type=Return - Prominent, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":27,"node":"12890:32307"},
      {"name":"Type=Return - Prominent, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":29,"node":"12890:32499"},
      {"name":"Type=Return - Default, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":30,"node":"12890:26704"},
      {"name":"Type=Return - Default, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":31,"node":"12890:32376"},
      {"name":"Type=Return - Default, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":30,"node":"12890:32310"},
      {"name":"Type=Return - Default, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":32,"node":"12890:32502"},
      {"name":"Type=Symbol, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":33,"node":"12890:26706"},
      {"name":"Type=Symbol, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":33,"node":"12890:32312"},
      {"name":"Type=Symbol, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":34,"node":"12890:32378"},
      {"name":"Type=Symbol, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":34,"node":"12890:32504"},
      {"name":"Type=Special Charaters (not capitalized), Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":35,"node":"12890:26708"},
      {"name":"Type=Special Charaters (not capitalized), Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":35,"node":"12890:32314"},
      {"name":"Type=Special Charaters (not capitalized), Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":36,"node":"12890:32380"},
      {"name":"Type=Special Charaters (not capitalized), Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":36,"node":"12890:32506"},
      {"name":"Type=Punctuation, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":37,"node":"12890:26710"},
      {"name":"Type=Punctuation, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":38,"node":"12890:32382"},
      {"name":"Type=Punctuation, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":37,"node":"12890:32316"},
      {"name":"Type=Punctuation, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":39,"node":"12890:32508"},
      {"name":"Type=Lower Case, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":40,"node":"12890:26712"},
      {"name":"Type=Lower Case, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":41,"node":"12890:32384"},
      {"name":"Type=Lower Case, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":40,"node":"12890:32318"},
      {"name":"Type=Lower Case, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":42,"node":"12890:32510"},
      {"name":"Type=Upper Case, Display=Outer, Orientation=Portrait","width":50,"height":42,"outline":43,"node":"12890:26714"},
      {"name":"Type=Upper Case, Display=Outer, Orientation=Landscape","width":50,"height":42,"outline":44,"node":"12890:32320"},
      {"name":"Type=Upper Case, Display=Inner, Orientation=Portrait","width":50,"height":42,"outline":45,"node":"12890:32322"},
      {"name":"Type=Upper Case, Display=Inner, Orientation=Landscape","width":50,"height":42,"outline":45,"node":"12890:32512"}
     ]
    },
    {
     "id": "keyboards-iphone-duo-keyboard",
     "name": "Keyboard",
     "page": "Keyboards",
     "section": "iPhone Duo",
     "hig": "onscreen-keyboards",
     "variant_props": [
      {
       "name": "Display",
       "values": [
        "Outer",
        "Inner"
       ]
      },
      {
       "name": "Orientation",
       "values": [
        "Portrait",
        "Landscape"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Lower Case",
        "Upper Case",
        "Punctuation",
        "Numeric"
       ]
      }
     ],
     "props": [
      {
       "name": "Show suggestions",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Camera Reserved Region",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Display=Inner, Orientation=Landscape, Type=Punctuation","width":951,"height":275.33,"outline":0,"node":"12890:31827"},
      {"name":"Display=Inner, Orientation=Portrait, Type=Punctuation","width":669,"height":360.68,"outline":1,"node":"12890:31784"},
      {"name":"Display=Outer, Orientation=Landscape, Type=Punctuation","width":678,"height":229.33,"outline":2,"node":"12890:30645"},
      {"name":"Display=Outer, Orientation=Portrait, Type=Punctuation","width":466,"height":286.01,"outline":3,"node":"12890:26959"},
      {"name":"Display=Inner, Orientation=Landscape, Type=Numeric","width":951,"height":275.33,"outline":4,"node":"12890:31741"},
      {"name":"Display=Inner, Orientation=Portrait, Type=Numeric","width":669,"height":360.68,"outline":5,"node":"12890:31698"},
      {"name":"Display=Outer, Orientation=Landscape, Type=Numeric","width":678,"height":229.33,"outline":6,"node":"12890:30602"},
      {"name":"Display=Outer, Orientation=Portrait, Type=Numeric","width":466,"height":286.01,"outline":7,"node":"12890:26919"},
      {"name":"Display=Inner, Orientation=Landscape, Type=Lower Case","width":951,"height":275.33,"outline":8,"node":"12890:31654"},
      {"name":"Display=Inner, Orientation=Portrait, Type=Lower Case","width":669,"height":360.68,"outline":9,"node":"12890:31610"},
      {"name":"Display=Outer, Orientation=Landscape, Type=Lower Case","width":678,"height":229.33,"outline":10,"node":"12890:30558"},
      {"name":"Display=Outer, Orientation=Portrait, Type=Lower Case","width":466,"height":286.01,"outline":11,"node":"12890:27040"},
      {"name":"Display=Inner, Orientation=Landscape, Type=Upper Case","width":951,"height":275.33,"outline":12,"node":"12890:31566"},
      {"name":"Display=Inner, Orientation=Portrait, Type=Upper Case","width":669,"height":360.68,"outline":13,"node":"12890:31522"},
      {"name":"Display=Outer, Orientation=Landscape, Type=Upper Case","width":678,"height":229.33,"outline":14,"node":"12890:30514"},
      {"name":"Display=Outer, Orientation=Portrait, Type=Upper Case","width":466,"height":286.01,"outline":15,"node":"12890:26999"}
     ],
     "uses": [
      "keyboards-background-keyboard",
      "keyboards-iphone-autocorrection",
      "keyboards-iphone-duo-bottom-buttons",
      "keyboards-iphone-duo-keys"
     ]
    },
    {
     "id": "keyboards-iphone-duo-bottom-buttons",
     "name": "_Bottom Buttons",
     "page": "Keyboards",
     "section": "iPhone Duo",
     "helper": true,
     "variant_props": [
      {
       "name": "Display",
       "values": [
        "Outer",
        "Inner"
       ]
      },
      {
       "name": "Orientation",
       "values": [
        "Portrait",
        "Landscape"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Mike",
        "Emoji"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Mike, Display=Inner, Orientation=Portrait","width":42,"height":42,"outline":0,"node":"12891:37247"},
      {"name":"Type=Mike, Display=Inner, Orientation=Landscape","width":42,"height":42,"outline":1,"node":"12891:37249"},
      {"name":"Type=Emoji, Display=Inner, Orientation=Portrait","width":42,"height":28,"outline":2,"node":"12891:37251"},
      {"name":"Type=Emoji, Display=Inner, Orientation=Landscape","width":42,"height":32,"outline":3,"node":"12891:37253"},
      {"name":"Type=Mike, Display=Outer, Orientation=Portrait","width":42,"height":42,"outline":4,"node":"12891:37192"},
      {"name":"Type=Mike, Display=Outer, Orientation=Landscape","width":42,"height":35,"outline":5,"node":"12891:37219"},
      {"name":"Type=Emoji, Display=Outer, Orientation=Portrait","width":42,"height":42,"outline":6,"node":"12891:37204"},
      {"name":"Type=Emoji, Display=Outer, Orientation=Landscape","width":42,"height":32,"outline":3,"node":"12891:37221"}
     ]
    },
    {
     "id": "keyboards-background-keyboard",
     "name": "_Background - Keyboard",
     "page": "Keyboards",
     "helper": true,
     "variants": [
      {"name":"","width":200,"height":200,"outline":0,"node":"537:133475"}
     ]
    },
    {
     "id": "keyboards-ipad-accessory-bar-buttons-light",
     "name": "_Accessory Bar - iPad - Buttons/Light",
     "page": "Keyboards",
     "section": "iPad",
     "helper": true,
     "variant_props": [
      {
       "name": "Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol arrow.uturn.left"
      }
     ],
     "variants": [
      {"name":"Enabled=False","width":28,"height":28,"outline":0,"node":"0:11633"},
      {"name":"Enabled=True","width":28,"height":28,"outline":1,"node":"0:11631"}
     ]
    },
    {
     "id": "keyboards-ipad-accessory-bar-buttons-dark",
     "name": "_Accessory Bar - iPad - Buttons/Dark",
     "page": "Keyboards",
     "section": "iPad",
     "helper": true,
     "variant_props": [
      {
       "name": "Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol arrow.uturn.left"
      }
     ],
     "variants": [
      {"name":"Enabled=False","width":28,"height":28,"outline":0,"node":"5915:35197"},
      {"name":"Enabled=True","width":28,"height":28,"outline":1,"node":"5915:35199"}
     ]
    },
    {
     "id": "keyboards-ipad-keys-command",
     "name": "_Keys - iPad - Command",
     "page": "Keyboards",
     "section": "iPad",
     "helper": true,
     "variant_props": [
      {
       "name": "Align",
       "values": [
        "Left",
        "Right"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "SF Symbol arrow.right.to.line"
      }
     ],
     "variants": [
      {"name":"Align=Right","width":105,"height":74,"outline":0,"node":"204:65645"},
      {"name":"Align=Left","width":105,"height":74,"outline":1,"node":"204:65641"}
     ]
    },
    {
     "id": "keyboards-ipad-keys-return",
     "name": "_Keys - iPad - Return",
     "page": "Keyboards",
     "section": "iPad",
     "helper": true,
     "variant_props": [
      {
       "name": "Prominent",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "SF Symbol return.left"
      }
     ],
     "variants": [
      {"name":"Prominent=True","width":105,"height":74,"outline":0,"node":"204:69502"},
      {"name":"Prominent=False","width":105,"height":74,"outline":1,"node":"204:69504"}
     ]
    },
    {
     "id": "keyboards-ipad-keys-lowercase",
     "name": "_Keys - iPad - Lowercase",
     "page": "Keyboards",
     "section": "iPad",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "2 Storey Lower",
        "2 Storey Punctuation",
        "1 Story Punctuation",
        "2 Storey Upper"
       ]
      }
     ],
     "props": [
      {
       "name": "Alt",
       "type": "text",
       "default": "\"1\""
      },
      {
       "name": "Key",
       "type": "text",
       "default": "\"q\""
      },
      {
       "name": "Punctuation - Top",
       "type": "text",
       "default": "\"?\""
      },
      {
       "name": "Punctuation - Bottom",
       "type": "text",
       "default": "\".\""
      },
      {
       "name": "Punctuation",
       "type": "text",
       "default": "\"!\""
      }
     ],
     "variants": [
      {"name":"Type=2 Storey Lower","width":82,"height":74,"outline":0,"node":"0:10866"},
      {"name":"Type=2 Storey Upper","width":82,"height":74,"outline":1,"node":"204:65229"},
      {"name":"Type=2 Storey Punctuation","width":82,"height":74,"outline":2,"node":"0:10859"},
      {"name":"Type=1 Story Punctuation","width":82,"height":74,"outline":3,"node":"204:65226"}
     ]
    },
    {
     "id": "keyboards-ipad-keyboard-layouts-lowercase",
     "name": "_Keyboard Layouts/iPad/Lowercase",
     "page": "Keyboards",
     "section": "iPad",
     "helper": true,
     "variants": [
      {"name":"","width":1210,"height":332,"outline":0,"node":"128:81467"}
     ],
     "uses": [
      "keyboards-ipad-keys-command",
      "keyboards-ipad-keys-lowercase",
      "keyboards-ipad-keys-return"
     ]
    },
    {
     "id": "keyboards-ipad-accessory-bar",
     "name": "_Accessory Bar - iPad",
     "page": "Keyboards",
     "section": "iPad",
     "helper": true,
     "props": [
      {
       "name": "Show Button 2",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Button 3",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"","width":116,"height":28,"outline":0,"node":"128:87690"}
     ],
     "uses": [
      "keyboards-ipad-accessory-bar-buttons-light"
     ]
    },
    {
     "id": "keyboards-ipad-keyboard",
     "name": "Keyboard",
     "page": "Keyboards",
     "section": "iPad",
     "hig": "onscreen-keyboards",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Default",
        "Shift"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Bar",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Type=Shift","width":1210,"height":428,"outline":0,"node":"145:80564"},
      {"name":"Type=Default","width":1210,"height":428,"outline":1,"node":"128:79144"}
     ],
     "uses": [
      "keyboards-background-keyboard",
      "keyboards-iphone-autocorrection",
      "keyboards-ipad-accessory-bar",
      "keyboards-ipad-keyboard-layouts-uppercase",
      "keyboards-ipad-keyboard-layouts-lowercase"
     ]
    },
    {
     "id": "keyboards-ipad-keyboard-layouts-uppercase",
     "name": "_Keyboard Layouts/iPad/Uppercase",
     "page": "Keyboards",
     "section": "iPad",
     "helper": true,
     "variant_props": [
      {
       "name": "Property 1",
       "values": [
        "Dark",
        "Light"
       ]
      }
     ],
     "variants": [
      {"name":"Property 1=Light","width":1210,"height":332,"outline":0,"node":"204:64104"},
      {"name":"Property 1=Dark","width":1210,"height":332,"outline":1,"node":"5514:20625"}
     ],
     "uses": [
      "keyboards-ipad-keys-command",
      "keyboards-ipad-keys-lowercase",
      "keyboards-ipad-keys-return"
     ]
    },
    {
     "id": "lists-separator",
     "name": "_Separator",
     "page": "Lists",
     "helper": true,
     "variants": [
      {"name":"","width":370,"height":1,"outline":0,"node":"5469:7925"}
     ]
    },
    {
     "id": "lists-swipe-actions-symbol-only",
     "name": "_Swipe Actions/Symbol only",
     "page": "Lists",
     "helper": true,
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol circle.dashed"
      }
     ],
     "variants": [
      {"name":"","width":60,"height":44,"outline":0,"node":"27:68008"}
     ]
    },
    {
     "id": "lists-swipe-actions-symbol-and-label",
     "name": "_Swipe Actions/Symbol and Label",
     "page": "Lists",
     "helper": true,
     "variants": [
      {"name":"","width":84,"height":44,"outline":0,"node":"10472:44894"}
     ]
    },
    {
     "id": "lists-swipe-actions-symbol-and-label-stacked",
     "name": "_Swipe Actions/Symbol and Label Stacked",
     "page": "Lists",
     "helper": true,
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Delete\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol circle.dashed"
      }
     ],
     "variants": [
      {"name":"","width":60,"height":68,"outline":0,"node":"27:68007"}
     ]
    },
    {
     "id": "lists-edit-buttons-light",
     "name": "_Edit Buttons/Light",
     "page": "Lists",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Selected",
        "Unselected",
        "Add",
        "Remove"
       ]
      }
     ],
     "variants": [
      {"name":"State=Remove","width":25,"height":22,"outline":0,"node":"19:52844"},
      {"name":"State=Add","width":25,"height":22,"outline":1,"node":"19:52845"},
      {"name":"State=Selected","width":25,"height":22,"outline":2,"node":"19:52846"},
      {"name":"State=Unselected","width":25,"height":22,"outline":3,"node":"19:52835"}
     ]
    },
    {
     "id": "lists-images-regular",
     "name": "_Images/Regular",
     "page": "Lists",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Fill",
        "Circular",
        "Rounded",
        "Symbol"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Symbol","width":28,"height":20,"outline":0,"node":"30:57148"},
      {"name":"Type=Rounded","width":30,"height":30,"outline":1,"node":"24:56947"},
      {"name":"Type=Circular","width":42,"height":42,"outline":2,"node":"24:56644"},
      {"name":"Type=Fill","width":52,"height":52,"outline":3,"node":"19:52895"}
     ]
    },
    {
     "id": "lists-images-tall",
     "name": "_Images/Tall",
     "page": "Lists",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Fill",
        "Circular",
        "Rounded",
        "Symbol"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Symbol","width":28,"height":20,"outline":0,"node":"508:72800"},
      {"name":"Type=Rounded","width":44,"height":44,"outline":1,"node":"508:72804"},
      {"name":"Type=Circular","width":60,"height":60,"outline":2,"node":"508:72808"},
      {"name":"Type=Fill","width":68,"height":68,"outline":3,"node":"508:72810"}
     ]
    },
    {
     "id": "lists-trailing",
     "name": "_Trailing",
     "page": "Lists",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Button",
        "Default",
        "Disclosure",
        "Picker - Date",
        "Picker - Date and Time",
        "Picker - Time",
        "Pop-up",
        "Stepper",
        "Toggle"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Drill-in",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Checkmark",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Info",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Button Label",
       "type": "text",
       "default": "\"Button\""
      },
      {
       "name": "Detail Text",
       "type": "text",
       "default": "\"Detail\""
      }
     ],
     "variants": [
      {"name":"Type=Pop-up","width":97,"height":22,"outline":0,"node":"30:53968"},
      {"name":"Type=Button","width":52,"height":16,"outline":1,"node":"29:56956"},
      {"name":"Type=Stepper","width":92,"height":32,"outline":2,"node":"29:56851"},
      {"name":"Type=Picker - Date","width":106,"height":34,"outline":3,"node":"30:53802"},
      {"name":"Type=Picker - Time","width":86,"height":34,"outline":4,"node":"30:53856"},
      {"name":"Type=Picker - Date and Time","width":198,"height":34,"outline":5,"node":"30:53867"},
      {"name":"Type=Toggle","width":64,"height":28,"outline":6,"node":"29:56869"},
      {"name":"Type=Disclosure","width":64,"height":32,"outline":7,"node":"30:54503"},
      {"name":"Type=Default","width":182,"height":22,"outline":8,"node":"29:53509"}
     ],
     "uses": [
      "date-and-time-pickers-collapsed",
      "toggles-toggle-switch"
     ]
    },
    {
     "id": "lists-grabber",
     "name": "_Grabber",
     "page": "Lists",
     "helper": true,
     "variants": [
      {"name":"","width":34,"height":25,"outline":0,"node":"5533:12351"}
     ]
    },
    {
     "id": "lists-grouped-table-footer",
     "name": "Grouped Table Footer",
     "page": "Lists",
     "hig": "lists-and-tables",
     "props": [
      {
       "name": "Text",
       "type": "text",
       "default": "\"Footer text\""
      }
     ],
     "variants": [
      {"name":"","width":300,"height":32,"outline":0,"node":"35:55757"}
     ]
    },
    {
     "id": "lists-section-title",
     "name": "Section Title",
     "page": "Lists",
     "hig": "lists-and-tables",
     "props": [
      {
       "name": "Text",
       "type": "text",
       "default": "\"A\""
      }
     ],
     "variants": [
      {"name":"","width":300,"height":39,"outline":0,"node":"50:56535"}
     ]
    },
    {
     "id": "lists-row-button",
     "name": "Row - Button",
     "page": "Lists",
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "Value",
       "values": [
        "Default",
        "Disabled",
        "Destructive"
       ]
      }
     ],
     "variants": [
      {"name":"Value=Disabled","width":300,"height":52,"outline":0,"node":"550:49735"},
      {"name":"Value=Destructive","width":300,"height":52,"outline":1,"node":"550:49747"},
      {"name":"Value=Default","width":300,"height":52,"outline":2,"node":"550:49759"}
     ],
     "uses": [
      "lists-separator"
     ]
    },
    {
     "id": "lists-header-trailing-accessories",
     "name": "_Header Trailing Accessories",
     "page": "Lists",
     "helper": true,
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Disclosure Open",
        "Action",
        "Image",
        "Button"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Disclosure Open","width":63,"height":22,"outline":0,"node":"39:67337"},
      {"name":"Type=Action","width":45,"height":20,"outline":1,"node":"5534:9689"},
      {"name":"Type=Image","width":42,"height":42,"outline":2,"node":"5534:9694"},
      {"name":"Type=Button","width":44,"height":44,"outline":3,"node":"5534:9698"}
     ]
    },
    {
     "id": "lists-row",
     "name": "Row",
     "page": "Lists",
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "Height",
       "values": [
        "Regular",
        "Tall"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Image",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Edit Button",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Grabber",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Trailing",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Height=Tall","width":300,"height":68,"outline":0,"node":"550:50515"},
      {"name":"Height=Regular","width":300,"height":52,"outline":1,"node":"550:50627"}
     ],
     "uses": [
      "lists-separator",
      "lists-trailing"
     ]
    },
    {
     "id": "lists-index-bar",
     "name": "Index Bar",
     "page": "Lists",
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "Device",
       "values": [
        "iPhone",
        "iPad"
       ]
      }
     ],
     "variants": [
      {"name":"Device=iPad","width":30,"height":700,"outline":0,"node":"48:56455"},
      {"name":"Device=iPhone","width":16,"height":700,"outline":1,"node":"48:56456"}
     ]
    },
    {
     "id": "lists-row-with-swipe-actions",
     "name": "Row with Swipe Actions",
     "page": "Lists",
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "Swipe",
       "values": [
        "Right",
        "Left"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Symbol and Label",
        "Symbol Only",
        "Symbol and Label Tall"
       ]
      }
     ],
     "props": [
      {
       "name": "Swipe Actions Symbol Only",
       "type": "slot"
      },
      {
       "name": "Swipe Actions Symbol and Label",
       "type": "slot"
      },
      {
       "name": "Swipe Actions Symbol and Label Tall",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Type=Symbol and Label Tall, Swipe=Right","width":402,"height":68,"outline":0,"node":"550:50088"},
      {"name":"Type=Symbol and Label, Swipe=Right","width":402,"height":52,"outline":1,"node":"10472:44956"},
      {"name":"Type=Symbol Only, Swipe=Right","width":402,"height":52,"outline":2,"node":"550:50185"},
      {"name":"Type=Symbol and Label Tall, Swipe=Left","width":402,"height":68,"outline":3,"node":"550:50318"},
      {"name":"Type=Symbol and Label, Swipe=Left","width":402,"height":52,"outline":4,"node":"10472:44963"},
      {"name":"Type=Symbol Only, Swipe=Left","width":402,"height":52,"outline":5,"node":"550:50415"}
     ],
     "uses": [
      "lists-swipe-actions-symbol-and-label-stacked",
      "lists-row",
      "lists-swipe-actions-symbol-and-label",
      "lists-swipe-actions-symbol-only"
     ]
    },
    {
     "id": "lists-header",
     "name": "Header",
     "page": "Lists",
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Nested",
        "Prominent",
        "Extra Prominent"
       ]
      }
     ],
     "props": [
      {
       "name": "Text",
       "type": "text",
       "default": "\"Header\""
      },
      {
       "name": "Show Trailing",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Supertitle",
       "type": "text",
       "default": "\"Supertitle\""
      },
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Supertitle",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Type=Extra Prominent","width":402,"height":48,"outline":0,"node":"517:38048"},
      {"name":"Type=Prominent","width":402,"height":45,"outline":1,"node":"517:38055"},
      {"name":"Type=Nested","width":402,"height":42,"outline":2,"node":"517:38061"}
     ],
     "uses": [
      "lists-header-trailing-accessories"
     ]
    },
    {
     "id": "menus-selection",
     "name": "_Selection",
     "page": "Menus",
     "helper": true,
     "variants": [
      {"name":"","width":40,"height":28,"outline":0,"node":"5853:4741"}
     ]
    },
    {
     "id": "menus-text-selection",
     "name": "Text Selection",
     "page": "Menus",
     "hig": "edit-menus",
     "variants": [
      {"name":"","width":94,"height":22,"outline":0,"node":"5711:35414"}
     ],
     "uses": [
      "menus-selection"
     ]
    },
    {
     "id": "menus-edit-menu-item",
     "name": "_Edit Menu Item",
     "page": "Menus",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Destructive"
       ]
      }
     ],
     "props": [
      {
       "name": "Item",
       "type": "text",
       "default": "\"Item\""
      },
      {
       "name": "Show Separator",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Destructive","width":63,"height":18,"outline":0,"node":"5713:49112"},
      {"name":"State=Default","width":63,"height":18,"outline":1,"node":"5713:47504"}
     ]
    },
    {
     "id": "menus-menu-indicator",
     "name": "_Menu Indicator",
     "page": "Menus",
     "helper": true,
     "variants": [
      {"name":"","width":36,"height":36,"outline":0,"node":"5831:53945"}
     ]
    },
    {
     "id": "menus-edit-menu",
     "name": "Edit Menu",
     "page": "Menus",
     "props": [
      {
       "name": "Items",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":232,"height":44,"outline":0,"node":"5713:47505"}
     ],
     "uses": [
      "materials-liquid-glass-regular-medium",
      "menus-edit-menu-item",
      "menus-menu-indicator"
     ]
    },
    {
     "id": "menus-section-title",
     "name": "Section Title",
     "page": "Menus",
     "props": [
      {
       "name": "Text",
       "type": "text",
       "default": "\"Section Title\""
      }
     ],
     "variants": [
      {"name":"","width":160,"height":29,"outline":0,"node":"0:10525"}
     ]
    },
    {
     "id": "menus-separator",
     "name": "Separator",
     "page": "Menus",
     "variants": [
      {"name":"","width":160,"height":21,"outline":0,"node":"5498:16580"}
     ]
    },
    {
     "id": "menus-menu-items",
     "name": "Menu Items",
     "page": "Menus",
     "variant_props": [
      {
       "name": "Menu has Selection",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Default",
        "Destructive",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Shortcut",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Checkmark",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      },
      {
       "name": "Show Control",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Option",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Shift",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Command",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Letter",
       "type": "text",
       "default": "\"A\""
      }
     ],
     "variants": [
      {"name":"State=Destructive, Menu has Selection=True","width":190,"height":40,"outline":0,"node":"5714:7321"},
      {"name":"State=Disabled, Menu has Selection=True","width":190,"height":40,"outline":1,"node":"5714:7330"},
      {"name":"State=Default, Menu has Selection=True","width":190,"height":40,"outline":2,"node":"5714:7339"},
      {"name":"State=Destructive, Menu has Selection=False","width":190,"height":40,"outline":3,"node":"5714:7375"},
      {"name":"State=Disabled, Menu has Selection=False","width":190,"height":40,"outline":4,"node":"5714:7382"},
      {"name":"State=Default, Menu has Selection=False","width":190,"height":40,"outline":5,"node":"5714:7389"}
     ]
    },
    {
     "id": "menus-menu-items-submenus",
     "name": "Menu Items - Submenus",
     "page": "Menus",
     "variant_props": [
      {
       "name": "Menu has Selection",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Open",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Default",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Disabled, Open=True, Menu has Selection=True","width":190,"height":40,"outline":0,"node":"5856:13977"},
      {"name":"State=Default, Open=True, Menu has Selection=True","width":190,"height":40,"outline":1,"node":"5856:13980"},
      {"name":"State=Disabled, Open=False, Menu has Selection=True","width":190,"height":40,"outline":2,"node":"5856:13983"},
      {"name":"State=Default, Open=False, Menu has Selection=True","width":190,"height":40,"outline":3,"node":"5856:13986"},
      {"name":"State=Disabled, Open=True, Menu has Selection=False","width":190,"height":40,"outline":4,"node":"5848:33953"},
      {"name":"State=Default, Open=True, Menu has Selection=False","width":190,"height":40,"outline":5,"node":"5848:33956"},
      {"name":"State=Disabled, Open=False, Menu has Selection=False","width":190,"height":40,"outline":6,"node":"5504:4095"},
      {"name":"State=Default, Open=False, Menu has Selection=False","width":190,"height":40,"outline":7,"node":"5504:4101"}
     ]
    },
    {
     "id": "menus-quick-action",
     "name": "Quick Action",
     "page": "Menus",
     "variant_props": [
      {
       "name": "Destructive",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol star"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Show Selection",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Destructive=True","width":70,"height":57,"outline":0,"node":"5498:16566"},
      {"name":"Destructive=False","width":70,"height":57,"outline":1,"node":"5498:16162"}
     ]
    },
    {
     "id": "menus-menu",
     "name": "Menu",
     "page": "Menus",
     "props": [
      {
       "name": "Menu Items",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":238,"height":578,"outline":0,"node":"492:52296"}
     ],
     "uses": [
      "materials-liquid-glass-regular-medium",
      "menus-quick-action",
      "menus-separator",
      "menus-menu-items",
      "menus-section-title",
      "menus-menu-items-submenus"
     ]
    },
    {
     "id": "notifications-notification-collapsed-list",
     "name": "Notification - Collapsed - List",
     "page": "Notifications",
     "hig": "notifications",
     "props": [
      {
       "name": "List",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":402,"height":337.33,"outline":0,"node":"135:73247"}
     ],
     "uses": [
      "notifications-notification-collapsed"
     ]
    },
    {
     "id": "notifications-notification-collapsed",
     "name": "Notification - Collapsed",
     "page": "Notifications",
     "hig": "notifications",
     "variant_props": [
      {
       "name": "Stack",
       "values": [
        "1",
        "2",
        "3"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Message",
       "type": "text",
       "default": "\"Message\""
      },
      {
       "name": "Show Image",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Stack=3","width":386,"height":77.33,"outline":0,"node":"5549:4949"},
      {"name":"Stack=2","width":386,"height":71.33,"outline":1,"node":"533:5978"},
      {"name":"Stack=1","width":386,"height":66.33,"outline":2,"node":"0:11292"}
     ],
     "uses": [
      "materials-liquid-glass-clear",
      "notifications-time"
     ]
    },
    {
     "id": "notifications-notification-expanded",
     "name": "Notification - Expanded",
     "page": "Notifications",
     "props": [
      {
       "name": "Show Menu",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"","width":402,"height":552,"outline":0,"node":"143:62847"}
     ],
     "uses": [
      "notifications-time",
      "materials-liquid-glass-clear"
     ]
    },
    {
     "id": "notifications-overlay",
     "name": "Overlay",
     "page": "Notifications",
     "variants": [
      {"name":"","width":100,"height":100,"outline":0,"node":"5551:17757"}
     ]
    },
    {
     "id": "notifications-time",
     "name": "_Time",
     "page": "Notifications",
     "helper": true,
     "props": [
      {
       "name": "Time",
       "type": "text",
       "default": "\"9:41 AM\""
      }
     ],
     "variants": [
      {"name":"","width":51,"height":20,"outline":0,"node":"533:7108"}
     ]
    },
    {
     "id": "page-controls-indicator",
     "name": "_Page Indicator",
     "page": "Page Controls",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Default",
        "Overflow",
        "Adjacent"
       ]
      }
     ],
     "variants": [
      {"name":"Is Active=False, Type=Default","width":8,"height":8,"outline":0,"node":"10520:3259"},
      {"name":"Is Active=False, Type=Adjacent","width":8,"height":8,"outline":1,"node":"10520:3481"},
      {"name":"Is Active=False, Type=Overflow","width":6,"height":6,"outline":2,"node":"10520:3594"},
      {"name":"Is Active=True, Type=Default","width":8,"height":8,"outline":3,"node":"10520:3258"},
      {"name":"Is Active=True, Type=Adjacent","width":8,"height":8,"outline":3,"node":"10520:3485"},
      {"name":"Is Active=True, Type=Overflow","width":8,"height":8,"outline":3,"node":"10520:3487"}
     ]
    },
    {
     "id": "page-controls-control",
     "name": "Page Control",
     "page": "Page Controls",
     "variant_props": [
      {
       "name": "Pages",
       "values": [
        "1-6",
        "7",
        "8+"
       ]
      }
     ],
     "props": [
      {
       "name": "2-6 Pages",
       "type": "slot"
      },
      {
       "name": "7 Pages",
       "type": "slot"
      },
      {
       "name": "8+ Pages",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Pages=1-6","width":402,"height":44,"outline":0,"node":"10520:3447"},
      {"name":"Pages=7","width":402,"height":44,"outline":1,"node":"10520:3449"},
      {"name":"Pages=8+","width":402,"height":44,"outline":2,"node":"10520:3456"}
     ],
     "uses": [
      "materials",
      "page-controls-indicator"
     ]
    },
    {
     "id": "popovers-ipad-only",
     "name": "Popovers (iPad Only)",
     "page": "Popovers",
     "hig": "popovers",
     "variant_props": [
      {
       "name": "Edge",
       "values": [
        "Top (Trailing)",
        "Top (Center)",
        "Top (Leading)",
        "Leading (Top)",
        "Leading (Middle)",
        "Leading (Bottom)",
        "Trailing (Top)",
        "Trailing (Middle)",
        "Trailing (Bottom)",
        "Bottom (Leading)",
        "Bottom (Center)",
        "Bottom (Trailing)"
       ]
      }
     ],
     "variants": [
      {"name":"Edge=Bottom (Leading)","width":200,"height":200,"outline":0,"node":"61:65449"},
      {"name":"Edge=Bottom (Center)","width":200,"height":200,"outline":1,"node":"61:65422"},
      {"name":"Edge=Bottom (Trailing)","width":200,"height":200,"outline":2,"node":"61:65428"},
      {"name":"Edge=Trailing (Bottom)","width":200,"height":200,"outline":3,"node":"61:65473"},
      {"name":"Edge=Trailing (Top)","width":200,"height":200,"outline":4,"node":"61:65431"},
      {"name":"Edge=Trailing (Middle)","width":200,"height":200,"outline":5,"node":"61:65461"},
      {"name":"Edge=Leading (Bottom)","width":200,"height":200,"outline":6,"node":"61:65476"},
      {"name":"Edge=Leading (Middle)","width":200,"height":200,"outline":7,"node":"61:65464"},
      {"name":"Edge=Leading (Top)","width":200,"height":200,"outline":8,"node":"61:65425"},
      {"name":"Edge=Top (Leading)","width":200,"height":200,"outline":9,"node":"61:65452"},
      {"name":"Edge=Top (Center)","width":200,"height":200,"outline":10,"node":"0:12354"},
      {"name":"Edge=Top (Trailing)","width":200,"height":200,"outline":11,"node":"61:65434"}
     ],
     "uses": [
      "materials"
     ]
    },
    {
     "id": "pop-up-buttons-popup-button",
     "name": "Popup Button",
     "page": "Pop-up Buttons",
     "hig": "pop-up-buttons",
     "variant_props": [
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Is Enabled=True","width":65,"height":44,"outline":0,"node":"410:50568"},
      {"name":"Is Enabled=False","width":65,"height":44,"outline":1,"node":"410:50570"}
     ]
    },
    {
     "id": "progress-indicators-bar-determinate-linear",
     "name": "Progress Bar - Determinate Linear",
     "page": "Progress Indicators",
     "hig": "progress-indicators",
     "variant_props": [
      {
       "name": "Value",
       "values": [
        "0%",
        "10%",
        "20%",
        "30%",
        "40%",
        "50%",
        "60%",
        "70%",
        "80%",
        "90%",
        "100%"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Label",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Loading...\""
      }
     ],
     "variants": [
      {"name":"Value=100%","width":402,"height":44,"outline":0,"node":"9:56118"},
      {"name":"Value=90%","width":402,"height":44,"outline":1,"node":"9:56124"},
      {"name":"Value=80%","width":402,"height":44,"outline":2,"node":"9:56130"},
      {"name":"Value=70%","width":402,"height":44,"outline":3,"node":"9:56136"},
      {"name":"Value=60%","width":402,"height":44,"outline":4,"node":"9:56142"},
      {"name":"Value=50%","width":402,"height":44,"outline":5,"node":"9:56148"},
      {"name":"Value=40%","width":402,"height":44,"outline":6,"node":"9:56154"},
      {"name":"Value=30%","width":402,"height":44,"outline":7,"node":"9:56160"},
      {"name":"Value=20%","width":402,"height":44,"outline":8,"node":"9:56166"},
      {"name":"Value=10%","width":402,"height":44,"outline":9,"node":"9:56172"},
      {"name":"Value=0%","width":402,"height":44,"outline":10,"node":"9:56178"}
     ]
    },
    {
     "id": "progress-indicators-bar-indeterminate-circular-spinner",
     "name": "Progress Bar - Indeterminate Circular (\"Spinner\")",
     "page": "Progress Indicators",
     "hig": "progress-indicators",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Small",
        "Regular",
        "Large"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Label",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Status...\""
      }
     ],
     "variants": [
      {"name":"Size=Small","width":14,"height":14,"outline":0,"node":"5425:3443"},
      {"name":"Size=Regular","width":20,"height":20,"outline":1,"node":"5425:3432"},
      {"name":"Size=Large","width":35,"height":35,"outline":2,"node":"10434:8231"}
     ]
    },
    {
     "id": "segmented-controls-option",
     "name": "_Option",
     "page": "Segmented Controls",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Is Selected=True","width":80,"height":28,"outline":0,"node":"10456:16912"},
      {"name":"Is Selected=False","width":80,"height":28,"outline":1,"node":"10456:16911"}
     ]
    },
    {
     "id": "segmented-controls-control",
     "name": "Segmented Control",
     "page": "Segmented Controls",
     "variant_props": [
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Large",
        "Small"
       ]
      }
     ],
     "props": [
      {
       "name": "Segments",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Size=Small, Is Enabled=True","width":370,"height":32,"outline":0,"node":"10460:170"},
      {"name":"Size=Large, Is Enabled=True","width":370,"height":50,"outline":1,"node":"10460:177"},
      {"name":"Size=Small, Is Enabled=False","width":370,"height":32,"outline":2,"node":"488:60882"},
      {"name":"Size=Large, Is Enabled=False","width":370,"height":50,"outline":3,"node":"10460:134"}
     ],
     "uses": [
      "segmented-controls-option"
     ]
    },
    {
     "id": "sheets-overlay",
     "name": "Overlay",
     "page": "Sheets",
     "variants": [
      {"name":"","width":100,"height":100,"outline":0,"node":"5551:18479"}
     ]
    },
    {
     "id": "sheets-grabber",
     "name": "Grabber",
     "page": "Sheets",
     "variants": [
      {"name":"","width":60,"height":4,"outline":0,"node":"5827:57545"}
     ]
    },
    {
     "id": "sheets-sheet-iphone",
     "name": "Sheet - iPhone",
     "page": "Sheets",
     "hig": "sheets",
     "variant_props": [
      {
       "name": "Detent",
       "values": [
        "Medium",
        "Large",
        "Large (Stacked)"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Grabber",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Dimming Layer",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Content",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Detent=Medium","width":402,"height":874,"outline":0,"node":"10525:1633"},
      {"name":"Detent=Large","width":402,"height":874,"outline":1,"node":"10525:1638"},
      {"name":"Detent=Large (Stacked)","width":402,"height":874,"outline":2,"node":"10525:1642"}
     ],
     "uses": [
      "sheets-overlay",
      "materials-liquid-glass-regular-medium",
      "toolbars-toolbar-top-iphone",
      "sheets-grabber"
     ]
    },
    {
     "id": "sheets-sheet-ipad",
     "name": "Sheet - iPad",
     "page": "Sheets",
     "hig": "sheets",
     "variants": [
      {"name":"","width":936,"height":852,"outline":0,"node":"5719:30145"}
     ],
     "uses": [
      "sheets-grabber",
      "toolbars-toolbar-top-ipad"
     ]
    },
    {
     "id": "sidebars-sidebar-trailing",
     "name": "_Sidebar - Trailing",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Selected"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Checkmark",
        "Info",
        "Disclosure",
        "Symbol",
        "Toggle",
        "Detail"
       ]
      }
     ],
     "props": [
      {
       "name": "Detail",
       "type": "text",
       "default": "\"Detail\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      },
      {
       "name": "Show Detail",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Selected, Type=Detail","width":54,"height":44,"outline":0,"node":"5658:14347"},
      {"name":"State=Selected, Type=Checkmark","width":84,"height":44,"outline":1,"node":"5658:14349"},
      {"name":"State=Selected, Type=Info","width":84,"height":44,"outline":2,"node":"5658:14352"},
      {"name":"State=Selected, Type=Disclosure","width":76,"height":44,"outline":3,"node":"5658:14355"},
      {"name":"State=Selected, Type=Symbol","width":88,"height":44,"outline":4,"node":"5658:14358"},
      {"name":"State=Selected, Type=Toggle","width":64,"height":44,"outline":5,"node":"5658:14361"},
      {"name":"State=Default, Type=Detail","width":52,"height":44,"outline":6,"node":"5643:28164"},
      {"name":"State=Default, Type=Checkmark","width":82,"height":44,"outline":7,"node":"5643:28178"},
      {"name":"State=Default, Type=Info","width":82,"height":44,"outline":8,"node":"5643:28172"},
      {"name":"State=Default, Type=Disclosure","width":70,"height":44,"outline":9,"node":"5643:28169"},
      {"name":"State=Default, Type=Symbol","width":86,"height":44,"outline":10,"node":"5643:28181"},
      {"name":"State=Default, Type=Toggle","width":64,"height":44,"outline":5,"node":"5643:28175"}
     ],
     "uses": [
      "sidebars-trailing-disclosure",
      "toggles-toggle-switch"
     ]
    },
    {
     "id": "sidebars-sidebar-edit-button",
     "name": "_Sidebar - Edit Button",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Delete",
        "Selectable",
        "Selected"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Selectable","width":21,"height":21,"outline":0,"node":"5659:15004"},
      {"name":"Type=Selected","width":21,"height":21,"outline":1,"node":"5659:15002"},
      {"name":"Type=Delete","width":21,"height":21,"outline":2,"node":"5643:26138"}
     ]
    },
    {
     "id": "sidebars-sidebar-leading",
     "name": "_Sidebar - Leading",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "Image",
       "values": [
        "Symbol",
        "Bitmap",
        "Collection",
        "Hidden"
       ]
      },
      {
       "name": "State",
       "values": [
        "Default",
        "Selected"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Edit Button",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"State=Selected, Image=Hidden","width":34,"height":44,"outline":0,"node":"5660:41129"},
      {"name":"State=Selected, Image=Collection","width":85,"height":44,"outline":1,"node":"5659:14989"},
      {"name":"State=Selected, Image=Bitmap","width":85,"height":44,"outline":2,"node":"5659:14995"},
      {"name":"State=Selected, Image=Symbol","width":85,"height":44,"outline":3,"node":"5659:14998"},
      {"name":"State=Default, Image=Hidden","width":34,"height":44,"outline":4,"node":"5660:41075"},
      {"name":"State=Default, Image=Collection","width":85,"height":44,"outline":5,"node":"147:62508"},
      {"name":"State=Default, Image=Bitmap","width":85,"height":44,"outline":6,"node":"147:62484"},
      {"name":"State=Default, Image=Symbol","width":85,"height":44,"outline":7,"node":"147:62238"}
     ]
    },
    {
     "id": "sidebars-trailing-disclosure",
     "name": "_Trailing - Disclosure",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "Open",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Open=True","width":18,"height":18,"outline":0,"node":"5643:20202"},
      {"name":"Open=False","width":18,"height":18,"outline":1,"node":"5643:20204"}
     ]
    },
    {
     "id": "sidebars-bg",
     "name": "BG",
     "page": "Sidebars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Active=True","width":100,"height":100,"outline":0,"node":"10472:45235"},
      {"name":"Active=False","width":100,"height":100,"outline":1,"node":"10472:45237"}
     ]
    },
    {
     "id": "sidebars-sidebar-row",
     "name": "Sidebar Row",
     "page": "Sidebars",
     "hig": "sidebars",
     "variant_props": [
      {
       "name": "Indent Level",
       "values": [
        "0",
        "1",
        "2"
       ]
      },
      {
       "name": "State",
       "values": [
        "Default",
        "Selected",
        "Disabled",
        "Disclosable"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Image",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Trailing",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Disabled, Indent Level=2","width":320,"height":44,"outline":0,"node":"147:62816"},
      {"name":"State=Disabled, Indent Level=1","width":320,"height":44,"outline":1,"node":"147:62819"},
      {"name":"State=Disabled, Indent Level=0","width":320,"height":44,"outline":2,"node":"147:62822"},
      {"name":"State=Disclosable, Indent Level=2","width":320,"height":44,"outline":3,"node":"5660:50839"},
      {"name":"State=Disclosable, Indent Level=1","width":320,"height":44,"outline":4,"node":"5660:50843"},
      {"name":"State=Disclosable, Indent Level=0","width":320,"height":44,"outline":5,"node":"5660:50847"},
      {"name":"State=Selected, Indent Level=2","width":320,"height":44,"outline":6,"node":"145:85276"},
      {"name":"State=Selected, Indent Level=1","width":320,"height":44,"outline":7,"node":"145:85245"},
      {"name":"State=Selected, Indent Level=0","width":320,"height":44,"outline":8,"node":"131:70030"},
      {"name":"State=Default, Indent Level=2","width":320,"height":44,"outline":9,"node":"145:85278"},
      {"name":"State=Default, Indent Level=1","width":320,"height":44,"outline":10,"node":"145:85224"},
      {"name":"State=Default, Indent Level=0","width":320,"height":44,"outline":11,"node":"131:70028"}
     ],
     "uses": [
      "sidebars-sidebar-leading",
      "sidebars-sidebar-trailing",
      "sidebars-selection-bg"
     ]
    },
    {
     "id": "sidebars-section-header",
     "name": "Section Header",
     "page": "Sidebars",
     "variants": [
      {"name":"","width":260,"height":54,"outline":0,"node":"131:66427"}
     ],
     "uses": [
      "sidebars-section-header-2"
     ]
    },
    {
     "id": "sidebars-sidebar-search-field",
     "name": "Sidebar Search Field",
     "page": "Sidebars",
     "variants": [
      {"name":"","width":200,"height":64,"outline":0,"node":"5840:30516"}
     ],
     "uses": [
      "sidebars-search-field"
     ]
    },
    {
     "id": "sidebars-sidebar",
     "name": "Sidebar",
     "page": "Sidebars",
     "variant_props": [
      {
       "name": "Floating Window",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Sidebar Items",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Floating Window=False","width":320,"height":802,"outline":0,"node":"131:70868"},
      {"name":"Floating Window=True","width":320,"height":802,"outline":1,"node":"10464:33765"}
     ],
     "uses": [
      "toolbars-buttons-44pt",
      "sidebars-sidebar-search-field",
      "sidebars-sidebar-row",
      "sidebars-section-header",
      "windows-window-controls"
     ]
    },
    {
     "id": "sidebars-search-field",
     "name": "_Search Field",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Placeholder",
        "Typing",
        "Value"
       ]
      }
     ],
     "props": [
      {
       "name": "Search Term",
       "type": "text",
       "default": "\"Search\""
      }
     ],
     "variants": [
      {"name":"State=Typing","width":200,"height":44,"outline":0,"node":"5840:30489"},
      {"name":"State=Value","width":200,"height":44,"outline":1,"node":"5840:30496"},
      {"name":"State=Placeholder","width":200,"height":44,"outline":2,"node":"5840:30501"}
     ]
    },
    {
     "id": "sidebars-selection-bg",
     "name": "_Selection BG",
     "page": "Sidebars",
     "helper": true,
     "variants": [
      {"name":"","width":100,"height":44,"outline":0,"node":"5840:25287"}
     ]
    },
    {
     "id": "sidebars-section-header-2",
     "name": "_Section Header",
     "page": "Sidebars",
     "helper": true,
     "props": [
      {
       "name": "Show Disclosure",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Detail",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"","width":260,"height":54,"outline":0,"node":"5840:30051"}
     ],
     "uses": [
      "sidebars-trailing-disclosure"
     ]
    },
    {
     "id": "sliders-ticks",
     "name": "_Ticks",
     "page": "Sliders",
     "helper": true,
     "variants": [
      {"name":"","width":282,"height":4,"outline":0,"node":"5430:5333"}
     ]
    },
    {
     "id": "sliders-track",
     "name": "_Track",
     "page": "Sliders",
     "helper": true,
     "variants": [
      {"name":"","width":282,"height":6,"outline":0,"node":"5428:5456"}
     ]
    },
    {
     "id": "sliders-fill",
     "name": "_Fill",
     "page": "Sliders",
     "helper": true,
     "variants": [
      {"name":"","width":282,"height":6,"outline":0,"node":"5441:3942"}
     ]
    },
    {
     "id": "sliders-knob-idle",
     "name": "_Knob - Idle",
     "page": "Sliders",
     "helper": true,
     "variants": [
      {"name":"","width":2,"height":24,"outline":0,"node":"520:49468"}
     ]
    },
    {
     "id": "sliders-knob-pressed",
     "name": "_Knob - Pressed",
     "page": "Sliders",
     "helper": true,
     "variants": [
      {"name":"","width":2,"height":24,"outline":0,"node":"10456:2324"}
     ]
    },
    {
     "id": "sliders",
     "name": "Sliders",
     "page": "Sliders",
     "hig": "sliders",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Pressed",
        "Disabled"
       ]
      },
      {
       "name": "Value",
       "values": [
        "0%",
        "25%",
        "50%",
        "75%",
        "100%"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol - Max",
       "type": "text",
       "default": "SF Symbol hare.fill"
      },
      {
       "name": "Symbol - Min",
       "type": "text",
       "default": "SF Symbol tortoise.fill"
      },
      {
       "name": "Show Symbols",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Ticks",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Disabled, Value=100%","width":400,"height":52,"outline":0,"node":"10456:2225"},
      {"name":"State=Disabled, Value=75%","width":400,"height":52,"outline":1,"node":"10456:2236"},
      {"name":"State=Disabled, Value=50%","width":400,"height":52,"outline":2,"node":"10456:2247"},
      {"name":"State=Disabled, Value=25%","width":400,"height":52,"outline":3,"node":"10456:2258"},
      {"name":"State=Disabled, Value=0%","width":400,"height":52,"outline":4,"node":"10456:2269"},
      {"name":"State=Idle, Value=100%","width":400,"height":52,"outline":5,"node":"520:49506"},
      {"name":"State=Pressed, Value=100%","width":400,"height":52,"outline":6,"node":"10456:2039"},
      {"name":"State=Idle, Value=75%","width":400,"height":52,"outline":7,"node":"520:49512"},
      {"name":"State=Pressed, Value=75%","width":400,"height":52,"outline":8,"node":"10456:2050"},
      {"name":"State=Idle, Value=50%","width":400,"height":52,"outline":9,"node":"520:49524"},
      {"name":"State=Pressed, Value=50%","width":400,"height":52,"outline":10,"node":"10456:2061"},
      {"name":"State=Idle, Value=25%","width":400,"height":52,"outline":11,"node":"520:49536"},
      {"name":"State=Pressed, Value=25%","width":400,"height":52,"outline":12,"node":"10456:2072"},
      {"name":"State=Idle, Value=0%","width":400,"height":52,"outline":13,"node":"5441:5235"},
      {"name":"State=Pressed, Value=0%","width":400,"height":52,"outline":14,"node":"10456:2083"}
     ],
     "uses": [
      "lists-separator",
      "sliders-track",
      "sliders-fill",
      "sliders-ticks",
      "sliders-knob-idle",
      "sliders-knob-pressed"
     ]
    },
    {
     "id": "status-bars-and-menu-bar-ipad",
     "name": "Status bar and Menu bar- iPad",
     "page": "Status Bars and Menu Bars",
     "section": "Status and menu bars",
     "hig": "status-bars",
     "variant_props": [
      {
       "name": "Background",
       "values": [
        "Light"
       ]
      },
      {
       "name": "Full Screen",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Menu Expanded",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Menubar",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Full Screen=False, Menu Expanded=True, Background=Light","width":1210,"height":32,"outline":0,"node":"10465:36541"},
      {"name":"Full Screen=False, Menu Expanded=False, Background=Light","width":1210,"height":32,"outline":1,"node":"10465:36552"},
      {"name":"Full Screen=True, Menu Expanded=True, Background=Light","width":1210,"height":32,"outline":2,"node":"5466:16893"},
      {"name":"Full Screen=True, Menu Expanded=False, Background=Light","width":1210,"height":32,"outline":1,"node":"5413:10007"}
     ],
     "uses": [
      "status-bars-and-menu-ipad-leading-accessories",
      "status-bars-and-menu-bar-item",
      "status-bars-and-menu-ipad-trailing-accessories"
     ]
    },
    {
     "id": "status-bars-and-menu-bar-iphone-duo",
     "name": "Status bar - iPhone Duo",
     "page": "Status Bars and Menu Bars",
     "section": "Status and menu bars",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Horizontal",
        "Vertical"
       ]
      }
     ],
     "props": [
      {
       "name": "Time",
       "type": "text",
       "default": "\"\""
      }
     ],
     "variants": [
      {"name":"Type=Vertical","width":48,"height":83,"outline":0,"node":"12884:7871"},
      {"name":"Type=Horizontal","width":98,"height":48,"outline":1,"node":"12884:7912"}
     ]
    },
    {
     "id": "status-bars-and-menu-bar-iphone",
     "name": "Status Bar - iPhone",
     "page": "Status Bars and Menu Bars",
     "section": "Status and menu bars",
     "variant_props": [
      {
       "name": "iPhone",
       "values": [
        "iPhone 18 Pro",
        "iPhone 18 Pro Max",
        "iPhone 17 Pro"
       ]
      }
     ],
     "props": [
      {
       "name": "Time",
       "type": "text",
       "default": "\"\""
      },
      {
       "name": "Show Dynamic Island",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"iPhone=iPhone 17 Pro","width":402,"height":62,"outline":0,"node":"12961:29590"},
      {"name":"iPhone=iPhone 18 Pro Max","width":402,"height":62,"outline":1,"node":"13016:4166"},
      {"name":"iPhone=iPhone 18 Pro","width":402,"height":62,"outline":2,"node":"5465:16807"}
     ]
    },
    {
     "id": "status-bars-and-menu-ipad-leading-accessories",
     "name": "iPad - Leading Accessories",
     "page": "Status Bars and Menu Bars",
     "variants": [
      {"name":"","width":132,"height":16,"outline":0,"node":"10465:36399"}
     ]
    },
    {
     "id": "status-bars-and-menu-bar-item",
     "name": "_Menu bar item",
     "page": "Status Bars and Menu Bars",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Type",
       "values": [
        "App",
        "File"
       ]
      }
     ],
     "props": [
      {
       "name": "Menu Name",
       "type": "text",
       "default": "\"Menu\""
      }
     ],
     "variants": [
      {"name":"Type=File, Selected=True","width":59,"height":32,"outline":0,"node":"10465:36246"},
      {"name":"Type=App, Selected=True","width":59,"height":32,"outline":1,"node":"5413:10044"},
      {"name":"Type=File, Selected=False","width":59,"height":32,"outline":2,"node":"10465:36248"},
      {"name":"Type=App, Selected=False","width":59,"height":32,"outline":3,"node":"5413:10038"}
     ]
    },
    {
     "id": "status-bars-and-menu-ipad-trailing-accessories",
     "name": "iPad - Trailing Accessories",
     "page": "Status Bars and Menu Bars",
     "variants": [
      {"name":"","width":89.84,"height":16,"outline":0,"node":"10465:36393"}
     ]
    },
    {
     "id": "steppers-stepper",
     "name": "Stepper",
     "page": "Steppers",
     "variants": [
      {"name":"","width":92,"height":32,"outline":0,"node":"5415:17699"}
     ],
     "uses": [
      "steppers-decrement",
      "steppers-increment"
     ]
    },
    {
     "id": "steppers-decrement",
     "name": "_Decrement",
     "page": "Steppers",
     "helper": true,
     "variant_props": [
      {
       "name": "Style",
       "values": [
        "Default",
        "Pressed",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Style=Disabled","width":46,"height":32,"outline":0,"node":"5415:17685"},
      {"name":"Style=Pressed","width":46,"height":32,"outline":1,"node":"5415:17687"},
      {"name":"Style=Default","width":46,"height":32,"outline":2,"node":"5415:17689"}
     ]
    },
    {
     "id": "steppers-increment",
     "name": "_Increment",
     "page": "Steppers",
     "helper": true,
     "variant_props": [
      {
       "name": "Style",
       "values": [
        "Default",
        "Pressed",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Style=Disabled","width":46,"height":32,"outline":0,"node":"5415:17692"},
      {"name":"Style=Pressed","width":46,"height":32,"outline":1,"node":"5415:17694"},
      {"name":"Style=Default","width":46,"height":32,"outline":2,"node":"5415:17696"}
     ]
    },
    {
     "id": "tab-bars-bar-button-ipad-text",
     "name": "_Tab Bar Button - iPad - Text",
     "page": "Tab Bars",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Selected=False","width":75,"height":36,"outline":0,"node":"5569:7317"},
      {"name":"Selected=True","width":77,"height":36,"outline":1,"node":"5569:7316"}
     ]
    },
    {
     "id": "tab-bars-bar-button-ipad-symbol",
     "name": "_Tab Bar Button - iPad - Symbol",
     "page": "Tab Bars",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol sidebar.left"
      }
     ],
     "variants": [
      {"name":"Selected=False","width":54,"height":36,"outline":0,"node":"5569:8168"},
      {"name":"Selected=True","width":54,"height":36,"outline":1,"node":"5569:8170"}
     ]
    },
    {
     "id": "tab-bars-bar-ipad",
     "name": "Tab Bar - iPad",
     "page": "Tab Bars",
     "props": [
      {
       "name": "Show Sidebar",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Search",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Buttons",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":491,"height":44,"outline":0,"node":"2524:7957"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "tab-bars-bar-button-ipad-symbol",
      "tab-bars-bar-button-ipad-text"
     ]
    },
    {
     "id": "tab-bars-bar-button-round-iphone",
     "name": "_Tab Bar Button Round - iPhone",
     "page": "Tab Bars",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol magnifyingglass"
      }
     ],
     "variants": [
      {"name":"Is Selected=True","width":54,"height":54,"outline":0,"node":"5535:23152"},
      {"name":"Is Selected=False","width":54,"height":54,"outline":1,"node":"5538:24565"}
     ]
    },
    {
     "id": "tab-bars-bar-button-iphone-duo",
     "name": "_Tab Bar Button - iPhone Duo",
     "page": "Tab Bars",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol magnifyingglass"
      }
     ],
     "variants": [
      {"name":"Is Selected=True","width":48,"height":48,"outline":0,"node":"12887:21457"},
      {"name":"Is Selected=False","width":48,"height":48,"outline":1,"node":"12887:21463"}
     ]
    },
    {
     "id": "tab-bars-bar-button-round-iphone-duo",
     "name": "_Tab Bar Button Round - iPhone Duo",
     "page": "Tab Bars",
     "helper": true,
     "variant_props": [
      {
       "name": "Is Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol magnifyingglass"
      }
     ],
     "variants": [
      {"name":"Is Selected=True","width":48,"height":48,"outline":0,"node":"12887:21568"},
      {"name":"Is Selected=False","width":48,"height":48,"outline":1,"node":"12887:21574"}
     ]
    },
    {
     "id": "tab-bars-bar-button-iphone",
     "name": "_Tab Bar Button - iPhone",
     "page": "Tab Bars",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol star.fill"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Selected=True","width":72,"height":54,"outline":0,"node":"5535:23117"},
      {"name":"Selected=False","width":72,"height":53.5,"outline":1,"node":"5535:23119"}
     ]
    },
    {
     "id": "tab-bars-bar-iphone",
     "name": "Tab Bar - iPhone",
     "page": "Tab Bars",
     "hig": "tab-bars",
     "variant_props": [
      {
       "name": "Minimized",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Tabs",
       "values": [
        "2",
        "3",
        "4",
        "5"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Default",
        "Search Role",
        "Prominent Tab"
       ]
      }
     ],
     "variants": [
      {"name":"Minimized=True, Tabs=5, Type=Prominent Tab","width":402,"height":88,"outline":0,"node":"10508:1516"},
      {"name":"Minimized=True, Tabs=4, Type=Prominent Tab","width":402,"height":88,"outline":0,"node":"10508:1272"},
      {"name":"Minimized=True, Tabs=3, Type=Prominent Tab","width":402,"height":88,"outline":0,"node":"10508:1081"},
      {"name":"Minimized=True, Tabs=2, Type=Prominent Tab","width":402,"height":88,"outline":0,"node":"10459:4762"},
      {"name":"Minimized=False, Tabs=5, Type=Prominent Tab","width":402,"height":95,"outline":1,"node":"10508:1544"},
      {"name":"Minimized=False, Tabs=4, Type=Prominent Tab","width":402,"height":95,"outline":2,"node":"10508:1244"},
      {"name":"Minimized=False, Tabs=3, Type=Prominent Tab","width":402,"height":95,"outline":3,"node":"10508:1109"},
      {"name":"Minimized=False, Tabs=2, Type=Prominent Tab","width":402,"height":95,"outline":4,"node":"10459:4738"},
      {"name":"Minimized=True, Tabs=5, Type=Search Role","width":402,"height":88,"outline":5,"node":"10508:1506"},
      {"name":"Minimized=True, Tabs=4, Type=Search Role","width":402,"height":88,"outline":5,"node":"10508:1262"},
      {"name":"Minimized=True, Tabs=3, Type=Search Role","width":402,"height":88,"outline":5,"node":"10508:1071"},
      {"name":"Minimized=True, Tabs=2, Type=Search Role","width":402,"height":88,"outline":5,"node":"5801:54657"},
      {"name":"Minimized=False, Tabs=5, Type=Search Role","width":402,"height":95,"outline":6,"node":"10508:1534"},
      {"name":"Minimized=False, Tabs=4, Type=Search Role","width":402,"height":95,"outline":7,"node":"10508:1290"},
      {"name":"Minimized=False, Tabs=3, Type=Search Role","width":402,"height":95,"outline":8,"node":"10508:1099"},
      {"name":"Minimized=False, Tabs=2, Type=Search Role","width":402,"height":95,"outline":9,"node":"5538:24452"},
      {"name":"Minimized=True, Tabs=5, Type=Default","width":402,"height":88,"outline":10,"node":"10508:1498"},
      {"name":"Minimized=True, Tabs=4, Type=Default","width":402,"height":88,"outline":11,"node":"10508:1254"},
      {"name":"Minimized=True, Tabs=3, Type=Default","width":402,"height":88,"outline":11,"node":"10508:1063"},
      {"name":"Minimized=True, Tabs=2, Type=Default","width":402,"height":88,"outline":11,"node":"5801:54206"},
      {"name":"Minimized=False, Tabs=5, Type=Default","width":402,"height":95,"outline":12,"node":"10508:1526"},
      {"name":"Minimized=False, Tabs=4, Type=Default","width":402,"height":95,"outline":13,"node":"10508:1282"},
      {"name":"Minimized=False, Tabs=3, Type=Default","width":402,"height":95,"outline":14,"node":"10508:1091"},
      {"name":"Minimized=False, Tabs=2, Type=Default","width":402,"height":95,"outline":15,"node":"3:72207"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "tab-bars-bar-button-iphone",
      "tab-bars-bar-button-round-iphone"
     ]
    },
    {
     "id": "tab-bars-bar-iphone-duo",
     "name": "Tab Bar - iPhone Duo",
     "page": "Tab Bars",
     "hig": "tab-bars",
     "variant_props": [
      {
       "name": "Minimized",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Tabs",
       "values": [
        "2",
        "3",
        "4",
        "5"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Default",
        "Search Role",
        "Prominent Tab"
       ]
      }
     ],
     "variants": [
      {"name":"Minimized=True, Tabs=5, Type=Prominent Tab","width":48,"height":108,"outline":0,"node":"12887:21095"},
      {"name":"Minimized=True, Tabs=5, Type=Search Role","width":48,"height":108,"outline":1,"node":"12887:21033"},
      {"name":"Minimized=True, Tabs=5, Type=Default","width":48,"height":48,"outline":2,"node":"12887:20974"},
      {"name":"Minimized=True, Tabs=4, Type=Prominent Tab","width":48,"height":108,"outline":0,"node":"12887:21078"},
      {"name":"Minimized=True, Tabs=4, Type=Search Role","width":48,"height":108,"outline":1,"node":"12887:21016"},
      {"name":"Minimized=True, Tabs=4, Type=Default","width":48,"height":48,"outline":3,"node":"12887:20962"},
      {"name":"Minimized=True, Tabs=3, Type=Prominent Tab","width":48,"height":108,"outline":0,"node":"12887:21062"},
      {"name":"Minimized=True, Tabs=3, Type=Search Role","width":48,"height":108,"outline":1,"node":"12887:21000"},
      {"name":"Minimized=True, Tabs=3, Type=Default","width":48,"height":48,"outline":3,"node":"12887:20951"},
      {"name":"Minimized=True, Tabs=2, Type=Prominent Tab","width":48,"height":108,"outline":0,"node":"12887:21047"},
      {"name":"Minimized=True, Tabs=2, Type=Search Role","width":48,"height":108,"outline":1,"node":"12887:20985"},
      {"name":"Minimized=True, Tabs=2, Type=Default","width":48,"height":48,"outline":3,"node":"12887:20941"},
      {"name":"Minimized=False, Tabs=5, Type=Prominent Tab","width":48,"height":270,"outline":4,"node":"12887:21085"},
      {"name":"Minimized=False, Tabs=5, Type=Search Role","width":48,"height":270,"outline":5,"node":"12887:21023"},
      {"name":"Minimized=False, Tabs=5, Type=Default","width":48,"height":260,"outline":6,"node":"12887:20966"},
      {"name":"Minimized=False, Tabs=4, Type=Prominent Tab","width":48,"height":220,"outline":7,"node":"12887:21069"},
      {"name":"Minimized=False, Tabs=4, Type=Search Role","width":48,"height":220,"outline":8,"node":"12887:21007"},
      {"name":"Minimized=False, Tabs=4, Type=Default","width":48,"height":210,"outline":9,"node":"12887:20955"},
      {"name":"Minimized=False, Tabs=3, Type=Prominent Tab","width":48,"height":170,"outline":10,"node":"12887:21054"},
      {"name":"Minimized=False, Tabs=3, Type=Search Role","width":48,"height":170,"outline":11,"node":"12887:20992"},
      {"name":"Minimized=False, Tabs=3, Type=Default","width":48,"height":177,"outline":12,"node":"12887:20945"},
      {"name":"Minimized=False, Tabs=2, Type=Prominent Tab","width":48,"height":120,"outline":13,"node":"12887:21040"},
      {"name":"Minimized=False, Tabs=2, Type=Search Role","width":48,"height":120,"outline":14,"node":"12887:20978"},
      {"name":"Minimized=False, Tabs=2, Type=Default","width":48,"height":110,"outline":15,"node":"12887:20936"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "tab-bars-bar-button-round-iphone-duo",
      "tab-bars-bar-button-iphone-duo"
     ]
    },
    {
     "id": "text-fields-field",
     "name": "Text Field",
     "page": "Text Fields",
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Placeholder",
        "Focused",
        "Typing",
        "Value Entered"
       ]
      }
     ],
     "props": [
      {
       "name": "Value",
       "type": "text",
       "default": "\"Value\""
      }
     ],
     "variants": [
      {"name":"State=Placeholder","width":402,"height":52,"outline":0,"node":"553:23061"},
      {"name":"State=Focused","width":402,"height":52,"outline":1,"node":"5433:15646"},
      {"name":"State=Value Entered","width":402,"height":52,"outline":2,"node":"5433:15631"},
      {"name":"State=Typing","width":402,"height":52,"outline":3,"node":"5433:15635"}
     ],
     "uses": [
      "lists-separator"
     ]
    },
    {
     "id": "toggles-toggle-switch",
     "name": "Toggle - Switch",
     "page": "Toggles",
     "hig": "toggles",
     "variant_props": [
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Is On",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Pressed"
       ]
      }
     ],
     "props": [
      {
       "name": "Show AX Label",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"State=Idle, Is On=False, Is Enabled=False","width":64,"height":28,"outline":0,"node":"10456:1252"},
      {"name":"State=Pressed, Is On=False, Is Enabled=False","width":64,"height":28,"outline":0,"node":"10456:8396"},
      {"name":"State=Idle, Is On=True, Is Enabled=False","width":64,"height":28,"outline":1,"node":"10456:1256"},
      {"name":"State=Pressed, Is On=True, Is Enabled=False","width":64,"height":28,"outline":1,"node":"10456:8400"},
      {"name":"State=Pressed, Is On=False, Is Enabled=True","width":64,"height":28,"outline":2,"node":"10456:1236"},
      {"name":"State=Pressed, Is On=True, Is Enabled=True","width":64,"height":28,"outline":3,"node":"10456:1240"},
      {"name":"State=Idle, Is On=False, Is Enabled=True","width":64,"height":28,"outline":4,"node":"27:68922"},
      {"name":"State=Idle, Is On=True, Is Enabled=True","width":64,"height":28,"outline":5,"node":"27:68905"}
     ]
    },
    {
     "id": "toolbars-toolbar-page-control",
     "name": "_Toolbar page control",
     "page": "Toolbars",
     "helper": true,
     "hig": "page-controls",
     "variant_props": [
      {
       "name": "Dots",
       "values": [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8+"
       ]
      },
      {
       "name": "Selection",
       "values": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8"
       ]
      }
     ],
     "variants": [
      {"name":"Dots=8+, Selection=8","width":168,"height":48,"outline":0,"node":"5704:38676"},
      {"name":"Dots=8+, Selection=7","width":168,"height":48,"outline":1,"node":"5704:38689"},
      {"name":"Dots=8+, Selection=6","width":168,"height":48,"outline":2,"node":"5704:38702"},
      {"name":"Dots=8+, Selection=5","width":168,"height":48,"outline":3,"node":"5704:38715"},
      {"name":"Dots=8+, Selection=4","width":168,"height":48,"outline":4,"node":"5704:38731"},
      {"name":"Dots=8+, Selection=3","width":168,"height":48,"outline":5,"node":"5704:38744"},
      {"name":"Dots=8+, Selection=2","width":168,"height":48,"outline":6,"node":"5704:38757"},
      {"name":"Dots=8+, Selection=1","width":168,"height":48,"outline":7,"node":"5704:38770"},
      {"name":"Dots=7, Selection=7","width":152,"height":48,"outline":8,"node":"5704:38783"},
      {"name":"Dots=7, Selection=6","width":152,"height":48,"outline":9,"node":"5704:38795"},
      {"name":"Dots=7, Selection=5","width":152,"height":48,"outline":10,"node":"5704:38806"},
      {"name":"Dots=7, Selection=4","width":152,"height":48,"outline":11,"node":"5704:38817"},
      {"name":"Dots=7, Selection=3","width":152,"height":48,"outline":12,"node":"5704:38828"},
      {"name":"Dots=7, Selection=2","width":152,"height":48,"outline":13,"node":"5704:38839"},
      {"name":"Dots=7, Selection=1","width":152,"height":48,"outline":14,"node":"5704:38850"},
      {"name":"Dots=6, Selection=6","width":136,"height":48,"outline":15,"node":"5704:38861"},
      {"name":"Dots=6, Selection=5","width":136,"height":48,"outline":16,"node":"5704:38870"},
      {"name":"Dots=6, Selection=4","width":136,"height":48,"outline":17,"node":"5704:38879"},
      {"name":"Dots=6, Selection=3","width":136,"height":48,"outline":18,"node":"5704:38888"},
      {"name":"Dots=6, Selection=2","width":136,"height":48,"outline":19,"node":"5704:38897"},
      {"name":"Dots=6, Selection=1","width":136,"height":48,"outline":20,"node":"5704:38906"},
      {"name":"Dots=5, Selection=5","width":120,"height":48,"outline":21,"node":"5704:38915"},
      {"name":"Dots=5, Selection=4","width":120,"height":48,"outline":22,"node":"5704:38923"},
      {"name":"Dots=5, Selection=3","width":120,"height":48,"outline":23,"node":"5704:38931"},
      {"name":"Dots=5, Selection=2","width":120,"height":48,"outline":24,"node":"5704:38939"},
      {"name":"Dots=5, Selection=1","width":120,"height":48,"outline":25,"node":"5704:38947"},
      {"name":"Dots=4, Selection=4","width":104,"height":48,"outline":26,"node":"5704:38955"},
      {"name":"Dots=4, Selection=3","width":104,"height":48,"outline":27,"node":"5704:38962"},
      {"name":"Dots=4, Selection=2","width":104,"height":48,"outline":28,"node":"5704:38969"},
      {"name":"Dots=4, Selection=1","width":104,"height":48,"outline":29,"node":"5704:38976"},
      {"name":"Dots=3, Selection=3","width":88,"height":48,"outline":30,"node":"5704:38983"},
      {"name":"Dots=3, Selection=2","width":88,"height":48,"outline":31,"node":"5704:38989"},
      {"name":"Dots=3, Selection=1","width":88,"height":48,"outline":32,"node":"5704:38995"},
      {"name":"Dots=2, Selection=2","width":72,"height":48,"outline":33,"node":"5704:39001"},
      {"name":"Dots=2, Selection=1","width":72,"height":48,"outline":34,"node":"5704:39006"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "toolbars-page-dots"
     ]
    },
    {
     "id": "toolbars-back-bar-button-item",
     "name": "_Back Bar Button Item",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Show Title",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":36,"height":36,"outline":0,"node":"5431:830"},
      {"name":"State=Default","width":36,"height":36,"outline":1,"node":"5431:836"}
     ]
    },
    {
     "id": "toolbars-button-text",
     "name": "_Button - Text",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Tinted",
        "Selected",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"State=Tinted","width":57,"height":36,"outline":0,"node":"5429:7005"},
      {"name":"State=Disabled","width":57,"height":36,"outline":1,"node":"5429:7001"},
      {"name":"State=Selected","width":57,"height":36,"outline":2,"node":"5431:2182"},
      {"name":"State=Default","width":57,"height":36,"outline":3,"node":"5429:7007"}
     ]
    },
    {
     "id": "toolbars-button-text-prominent",
     "name": "_Button - Text - Prominent",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":57,"height":36,"outline":0,"node":"10479:19521"},
      {"name":"State=Default","width":57,"height":36,"outline":1,"node":"10479:19525"}
     ]
    },
    {
     "id": "toolbars-button-symbol",
     "name": "_Button - Symbol",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Tinted",
        "Selected",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":36,"height":36,"outline":0,"node":"5426:2004"},
      {"name":"State=Selected","width":36,"height":36,"outline":1,"node":"5426:2006"},
      {"name":"State=Tinted","width":36,"height":36,"outline":2,"node":"5426:2008"},
      {"name":"State=Default","width":36,"height":36,"outline":3,"node":"5426:2010"}
     ]
    },
    {
     "id": "toolbars-button-symbol-prominent",
     "name": "_Button - Symbol - Prominent",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":36,"height":36,"outline":0,"node":"10479:19536"},
      {"name":"State=Default","width":36,"height":36,"outline":1,"node":"10479:19542"}
     ]
    },
    {
     "id": "toolbars-segmented-control-button",
     "name": "_Segmented Control Button",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Selected=False","width":126,"height":36,"outline":0,"node":"5573:24515"},
      {"name":"Selected=True","width":126,"height":36,"outline":1,"node":"5573:24514"}
     ]
    },
    {
     "id": "toolbars-search-accessory",
     "name": "_Search Accessory",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "Show Filters",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Show Filters=True","width":820,"height":44,"outline":0,"node":"5573:24625"},
      {"name":"Show Filters=False","width":820,"height":44,"outline":1,"node":"5573:24623"}
     ],
     "uses": [
      "toolbars-search-44pt",
      "materials-liquid-glass-regular-small",
      "toolbars-segmented-control-button"
     ]
    },
    {
     "id": "toolbars-search-44pt",
     "name": "_Search - 44pt",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Placeholder",
        "Value",
        "Typing"
       ]
      }
     ],
     "props": [
      {
       "name": "Value",
       "type": "text",
       "default": "\"Search Term\""
      },
      {
       "name": "Placeholder",
       "type": "text",
       "default": "\"Placeholder\""
      }
     ],
     "variants": [
      {"name":"State=Value","width":190,"height":44,"outline":0,"node":"5565:35416"},
      {"name":"State=Typing","width":190,"height":44,"outline":1,"node":"5565:35402"},
      {"name":"State=Placeholder","width":190,"height":44,"outline":2,"node":"5565:35428"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small"
     ]
    },
    {
     "id": "toolbars-buttons-44pt",
     "name": "_Buttons - 44pt",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Symbol - Prominent",
        "Symbol",
        "Button Group",
        "Text",
        "Text - Prominent",
        "Back"
       ]
      }
     ],
     "props": [
      {
       "name": "Buttons",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Type=Back","width":44,"height":44,"outline":0,"node":"5432:23136"},
      {"name":"Type=Text","width":73,"height":44,"outline":1,"node":"5432:23118"},
      {"name":"Type=Text - Prominent","width":73,"height":44,"outline":2,"node":"5432:23351"},
      {"name":"Type=Button Group","width":160,"height":44,"outline":3,"node":"5432:23124"},
      {"name":"Type=Symbol","width":44,"height":44,"outline":4,"node":"5432:23133"},
      {"name":"Type=Symbol - Prominent","width":44,"height":44,"outline":5,"node":"5432:23261"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "toolbars-back-bar-button-item",
      "toolbars-button-text",
      "toolbars-button-text-prominent",
      "toolbars-button-symbol",
      "toolbars-button-symbol-prominent"
     ]
    },
    {
     "id": "toolbars-search-48pt",
     "name": "_Search - 48pt",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Placeholder",
        "Typing",
        "Value"
       ]
      }
     ],
     "props": [
      {
       "name": "Value",
       "type": "text",
       "default": "\"Search Term\""
      },
      {
       "name": "Placeholder",
       "type": "text",
       "default": "\"Placeholder\""
      }
     ],
     "variants": [
      {"name":"State=Typing","width":190,"height":48,"outline":0,"node":"5432:24627"},
      {"name":"State=Placeholder","width":190,"height":48,"outline":1,"node":"5432:24399"},
      {"name":"State=Value","width":190,"height":48,"outline":2,"node":"5561:41377"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small"
     ]
    },
    {
     "id": "toolbars-buttons-48pt",
     "name": "_Buttons - 48pt",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "Preferred Axis",
       "values": [
        "Horizontal",
        "Vertical"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Symbol - Prominent",
        "Symbol",
        "Text",
        "Text - Prominent",
        "Button Group"
       ]
      }
     ],
     "props": [
      {
       "name": "Buttons",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Type=Text, Preferred Axis=Horizontal","width":69,"height":48,"outline":0,"node":"5565:35638"},
      {"name":"Type=Text, Preferred Axis=Vertical","width":48,"height":48,"outline":1,"node":"12894:62397"},
      {"name":"Type=Text - Prominent, Preferred Axis=Horizontal","width":69,"height":48,"outline":2,"node":"5565:35635"},
      {"name":"Type=Text - Prominent, Preferred Axis=Vertical","width":48,"height":48,"outline":3,"node":"12894:62400"},
      {"name":"Type=Button Group, Preferred Axis=Horizontal","width":164,"height":48,"outline":4,"node":"5565:35662"},
      {"name":"Type=Button Group, Preferred Axis=Vertical","width":48,"height":164,"outline":5,"node":"12887:23036"},
      {"name":"Type=Symbol, Preferred Axis=Horizontal","width":48,"height":48,"outline":6,"node":"5565:35671"},
      {"name":"Type=Symbol, Preferred Axis=Vertical","width":48,"height":48,"outline":6,"node":"12894:62369"},
      {"name":"Type=Symbol - Prominent, Preferred Axis=Horizontal","width":48,"height":48,"outline":7,"node":"5565:35674"},
      {"name":"Type=Symbol - Prominent, Preferred Axis=Vertical","width":48,"height":48,"outline":8,"node":"12894:62372"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small",
      "toolbars-button-text",
      "toolbars-button-text-prominent",
      "toolbars-button-symbol",
      "toolbars-button-symbol-prominent"
     ]
    },
    {
     "id": "toolbars-title-iphone-duo-large",
     "name": "_Title - iPhone Duo - Large Title",
     "page": "Toolbars",
     "helper": true,
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      }
     ],
     "variants": [
      {"name":"","width":69,"height":34,"outline":0,"node":"12884:8281"}
     ]
    },
    {
     "id": "toolbars-title-iphone-large",
     "name": "_Title - iPhone - Large Title",
     "page": "Toolbars",
     "helper": true,
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      }
     ],
     "variants": [
      {"name":"","width":69,"height":41,"outline":0,"node":"5827:57546"}
     ]
    },
    {
     "id": "toolbars-title-iphone-subheadline",
     "name": "_Title - iPhone - Subheadline",
     "page": "Toolbars",
     "helper": true,
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      }
     ],
     "variants": [
      {"name":"","width":32,"height":20,"outline":0,"node":"5827:57548"}
     ]
    },
    {
     "id": "toolbars-title-iphone-body",
     "name": "_Title - iPhone - Body",
     "page": "Toolbars",
     "helper": true,
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      }
     ],
     "variants": [
      {"name":"","width":36,"height":22,"outline":0,"node":"5827:57547"}
     ]
    },
    {
     "id": "toolbars-subtitle-iphone-caption",
     "name": "_Subtitle - iPhone - Caption",
     "page": "Toolbars",
     "helper": true,
     "props": [
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      }
     ],
     "variants": [
      {"name":"","width":46,"height":16,"outline":0,"node":"5827:57550"}
     ]
    },
    {
     "id": "toolbars-subtitle-iphone-subheadline",
     "name": "_Subtitle - iPhone - Subheadline",
     "page": "Toolbars",
     "helper": true,
     "props": [
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      }
     ],
     "variants": [
      {"name":"","width":55,"height":20,"outline":0,"node":"5827:57549"}
     ]
    },
    {
     "id": "toolbars-toolbar-top-ipad",
     "name": "Toolbar - Top - iPad",
     "page": "Toolbars",
     "hig": "navigation-bars",
     "variant_props": [
      {
       "name": "Style",
       "values": [
        "Title 2 Line",
        "Title 2 Line Left",
        "Compact Large",
        "Large Title"
       ]
      },
      {
       "name": "Tab Bar",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Search",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Leading",
       "type": "slot"
      },
      {
       "name": "Trailing",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Style=Compact Large, Tab Bar=True","width":820,"height":54,"outline":0,"node":"5573:24144"},
      {"name":"Style=Large Title, Tab Bar=True","width":820,"height":131,"outline":1,"node":"5572:23773"},
      {"name":"Style=Title 2 Line Left, Tab Bar=True","width":820,"height":98,"outline":2,"node":"5571:23159"},
      {"name":"Style=Title 2 Line, Tab Bar=True","width":820,"height":103,"outline":3,"node":"5572:23363"},
      {"name":"Style=Compact Large, Tab Bar=False","width":820,"height":54,"outline":4,"node":"5564:42177"},
      {"name":"Style=Large Title, Tab Bar=False","width":820,"height":131,"outline":5,"node":"5564:42163"},
      {"name":"Style=Title 2 Line Left, Tab Bar=False","width":820,"height":54,"outline":6,"node":"5564:41927"},
      {"name":"Style=Title 2 Line, Tab Bar=False","width":820,"height":54,"outline":7,"node":"5564:41843"}
     ],
     "uses": [
      "toolbars-buttons-44pt",
      "tab-bars-bar-ipad",
      "toolbars-title-iphone-large",
      "toolbars-subtitle-iphone-subheadline",
      "toolbars-title-iphone-body",
      "toolbars-subtitle-iphone-caption",
      "toolbars-search-44pt",
      "toolbars-title-iphone-subheadline"
     ]
    },
    {
     "id": "toolbars-toolbar-top-iphone-duo",
     "name": "Toolbar - Top - iPhone Duo",
     "page": "Toolbars",
     "hig": "navigation-bars",
     "variant_props": [
      {
       "name": "Sheet",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Title",
        "Compact Large",
        "Large Title",
        "Title 2 Line"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Leading",
       "type": "slot"
      },
      {
       "name": "Trailing",
       "type": "slot"
      },
      {
       "name": "Show Title",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Leading",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Trailing",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Reserved Region",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Status Bar",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Style=Title 2 Line, Sheet=True","width":600,"height":74,"outline":0,"node":"12886:11597"},
      {"name":"Style=Compact Large, Sheet=True","width":600,"height":76,"outline":1,"node":"12886:11607"},
      {"name":"Style=Large Title, Sheet=True","width":600,"height":138,"outline":2,"node":"12886:11617"},
      {"name":"Style=Title, Sheet=True","width":600,"height":76,"outline":3,"node":"12886:11629"},
      {"name":"Style=Title 2 Line, Sheet=False","width":600,"height":82,"outline":4,"node":"12883:6024"},
      {"name":"Style=Compact Large, Sheet=False","width":600,"height":84,"outline":5,"node":"12883:6009"},
      {"name":"Style=Large Title, Sheet=False","width":600,"height":146,"outline":6,"node":"12883:6013"},
      {"name":"Sheet=False, Style=Title","width":600,"height":84,"outline":7,"node":"12883:6041"}
     ],
     "uses": [
      "toolbars-buttons-48pt",
      "toolbars-title-iphone-subheadline",
      "toolbars-subtitle-iphone-caption",
      "sheets-grabber",
      "toolbars-title-iphone-duo-large",
      "toolbars-subtitle-iphone-subheadline",
      "toolbars-title-iphone-body",
      "status-bars-and-menu-bar-iphone-duo"
     ]
    },
    {
     "id": "toolbars-toolbar-top-iphone",
     "name": "Toolbar - Top - iPhone",
     "page": "Toolbars",
     "hig": "navigation-bars",
     "variant_props": [
      {
       "name": "Style",
       "values": [
        "Default",
        "Compact Large",
        "Large Title",
        "Title 2 Line",
        "Title 2 Line Left"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Leading",
       "type": "slot"
      },
      {
       "name": "Trailing",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Style=Compact Large","width":402,"height":54,"outline":0,"node":"5553:32641"},
      {"name":"Style=Large Title","width":402,"height":125,"outline":1,"node":"5553:39602"},
      {"name":"Style=Title 2 Line Left","width":402,"height":54,"outline":2,"node":"5553:39536"},
      {"name":"Style=Title 2 Line","width":402,"height":54,"outline":3,"node":"5553:39446"},
      {"name":"Style=Default","width":402,"height":54,"outline":4,"node":"1:54520"}
     ],
     "uses": [
      "toolbars-title-iphone-large",
      "toolbars-buttons-44pt",
      "toolbars-subtitle-iphone-subheadline",
      "toolbars-title-iphone-subheadline",
      "toolbars-subtitle-iphone-caption",
      "toolbars-title-iphone-body"
     ]
    },
    {
     "id": "toolbars-toolbar-bottom-iphone",
     "name": "Toolbar - Bottom - iPhone",
     "page": "Toolbars",
     "hig": "toolbars",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Buttons",
        "Buttons + Page Dots",
        "Search",
        "Search with Focus",
        "Search + Trailing Item",
        "Search + Leading Item"
       ]
      }
     ],
     "props": [
      {
       "name": "Buttons Leading",
       "type": "slot"
      },
      {
       "name": "Buttons Trailing",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Type=Buttons + Page Dots","width":402,"height":84,"outline":0,"node":"5704:39190"},
      {"name":"Type=Search with Focus","width":402,"height":84,"outline":1,"node":"5432:24143"},
      {"name":"Type=Search + Leading Item","width":402,"height":84,"outline":2,"node":"5432:24116"},
      {"name":"Type=Search + Trailing Item","width":402,"height":84,"outline":1,"node":"5432:24089"},
      {"name":"Type=Search","width":402,"height":84,"outline":3,"node":"5432:23993"},
      {"name":"Type=Buttons","width":402,"height":84,"outline":4,"node":"4:55845"}
     ],
     "uses": [
      "toolbars-buttons-48pt",
      "toolbars-toolbar-page-control",
      "toolbars-search-48pt"
     ]
    },
    {
     "id": "toolbars-toolbar-bottom-ipad",
     "name": "Toolbar - Bottom - iPad",
     "page": "Toolbars",
     "props": [
      {
       "name": "Buttons Leading",
       "type": "slot"
      },
      {
       "name": "Buttons Center",
       "type": "slot"
      },
      {
       "name": "Buttons Trailing",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":500,"height":58,"outline":0,"node":"8515:13163"}
     ],
     "uses": [
      "toolbars-buttons-44pt"
     ]
    },
    {
     "id": "toolbars-page-dots",
     "name": "_Page Dots",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Selected=False","width":8,"height":8,"outline":0,"node":"5811:30644"},
      {"name":"Selected=True","width":8,"height":8,"outline":1,"node":"5811:30645"}
     ]
    },
    {
     "id": "widgets-home-screen-widget-iphone",
     "name": "Home Screen Widget - iPhone",
     "page": "Widgets",
     "hig": "widgets",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Large",
        "Medium",
        "Small",
        "Extra Large"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Padding",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Widget Name",
       "type": "text",
       "default": "\"Widget Name\""
      }
     ],
     "variants": [
      {"name":"Size=Small","width":164.67,"height":164.67,"outline":0,"node":"0:8901"},
      {"name":"Size=Medium","width":349.67,"height":164.33,"outline":1,"node":"0:8933"},
      {"name":"Size=Large","width":349.67,"height":365,"outline":2,"node":"0:8957"},
      {"name":"Size=Extra Large","width":349.67,"height":565.67,"outline":3,"node":"10456:4209"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-circular-open-gauge-2",
     "name": "Lock Screen Widget / Circular / Open Gauge 2",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Value",
       "type": "text",
       "default": "\"67\""
      },
      {
       "name": "Min Value",
       "type": "text",
       "default": "\"50\""
      },
      {
       "name": "Max Value",
       "type": "text",
       "default": "\"78\""
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"145:62670"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-circular-closed-gauge",
     "name": "Lock Screen Widget / Circular / Closed Gauge",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol app.dashed"
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"525:43689"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-circular-open-gauge",
     "name": "Lock Screen Widget / Circular / Open Gauge",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol umbrella.fill"
      },
      {
       "name": "Value",
       "type": "text",
       "default": "\"50%\""
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"145:62699"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-circular-open-gauge-3",
     "name": "Lock Screen Widget / Circular / Open Gauge 3",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Number",
       "type": "text",
       "default": "\"27\""
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"AQI\""
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"525:43658"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-circular-stack-3-rows",
     "name": "Lock Screen Widget / Circular / Stack 3 Rows",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Secondary Value",
       "type": "text",
       "default": "\"PM\""
      },
      {
       "name": "Value",
       "type": "text",
       "default": "\"8:29\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol sunset.fill"
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"145:62733"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-circular-icon",
     "name": "Lock Screen Widget / Circular / Icon",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol app.dashed"
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"525:43588"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-circular-stack-2-rows-icon-and-label",
     "name": "Lock Screen Widget / Circular / Stack 2 Rows - Icon and Label",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol app.dashed"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"525:43609"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-circular-stack-2-rows-labels",
     "name": "Lock Screen Widget / Circular / Stack 2 Rows - Labels",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Secondary Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"525:43610"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-inline",
     "name": "Lock Screen Widget - Inline",
     "page": "Widgets",
     "hig": "widgets",
     "props": [
      {
       "name": "Text",
       "type": "text",
       "default": "\"Apr 1 􀇕 Cupertino\""
      }
     ],
     "variants": [
      {"name":"","width":327,"height":26,"outline":0,"node":"145:62745"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-rectangular-with-chart",
     "name": "Lock Screen Widget - Rectangular with Chart",
     "page": "Widgets",
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol app.dashed"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Secondary Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":72,"outline":0,"node":"525:43083"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-modular-with-bar",
     "name": "Lock Screen Widget - Modular with Bar",
     "page": "Widgets",
     "props": [
      {
       "name": "Line 1",
       "type": "text",
       "default": "\"11:30AM-12:30PM\""
      },
      {
       "name": "Line 2",
       "type": "text",
       "default": "\"Design Review\""
      },
      {
       "name": "Line 3",
       "type": "text",
       "default": "\"Conference Room\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":72,"outline":0,"node":"525:43071"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-rectangular-text-gauge",
     "name": "Lock Screen Widget - Rectangular Text Gauge",
     "page": "Widgets",
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol app.dashed"
      },
      {
       "name": "Line 1",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 2",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":160,"height":72,"outline":0,"node":"525:43106"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-tall-body-with-icon",
     "name": "Lock Screen Widget - Tall Body with Icon",
     "page": "Widgets",
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol app.dashed"
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Header",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":72,"outline":0,"node":"525:43115"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-tall-body",
     "name": "Lock Screen Widget - Tall Body",
     "page": "Widgets",
     "props": [
      {
       "name": "Line 1",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 2",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":72,"outline":0,"node":"525:43122"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-modular-columns",
     "name": "Lock Screen Widget - Modular Columns",
     "page": "Widgets",
     "props": [
      {
       "name": "Symbol 1",
       "type": "text",
       "default": "SF Symbol app.dashed"
      },
      {
       "name": "Symbol 2",
       "type": "text",
       "default": "SF Symbol app.dashed"
      },
      {
       "name": "Symbol 3",
       "type": "text",
       "default": "SF Symbol app.dashed"
      },
      {
       "name": "Line 1 Leading",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 2 Leading",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 3 Leading",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 1 Trailing",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 2 Trailing",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 3 Trailing",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":72,"outline":0,"node":"525:43126"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-modular-table",
     "name": "Lock Screen Widget - Modular Table",
     "page": "Widgets",
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol app.dashed"
      },
      {
       "name": "Line 1",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 2",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Line 3",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":72,"outline":0,"node":"525:43141"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-modular-standard",
     "name": "Lock Screen Widget - Modular Standard",
     "page": "Widgets",
     "props": [
      {
       "name": "Header",
       "type": "text",
       "default": "\"Header\""
      },
      {
       "name": "Body",
       "type": "text",
       "default": "\"Preview of body. Lorem ipsum dolor sit …\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol app.dashed"
      }
     ],
     "variants": [
      {"name":"","width":162,"height":72,"outline":0,"node":"525:43148"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-modular-list",
     "name": "Lock Screen Widget - Modular List",
     "page": "Widgets",
     "props": [
      {
       "name": "Bullet 1",
       "type": "text",
       "default": "SF Symbol circle"
      },
      {
       "name": "Bullet 2",
       "type": "text",
       "default": "SF Symbol circle"
      },
      {
       "name": "Bullet 3",
       "type": "text",
       "default": "SF Symbol circle"
      },
      {
       "name": "Line 1",
       "type": "text",
       "default": "\"Item 1\""
      },
      {
       "name": "Line 3",
       "type": "text",
       "default": "\"Item 3\""
      },
      {
       "name": "Line 2",
       "type": "text",
       "default": "\"Item 2\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":72,"outline":0,"node":"525:43156"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-clock",
     "name": "Lock Screen Widget - Clock",
     "page": "Widgets",
     "props": [
      {
       "name": "City",
       "type": "text",
       "default": "\"NYC\""
      }
     ],
     "variants": [
      {"name":"","width":72,"height":72,"outline":0,"node":"525:43245"}
     ]
    },
    {
     "id": "widgets-home-screen-widget-ipad",
     "name": "Home Screen Widget - iPad",
     "page": "Widgets",
     "hig": "widgets",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Extra Large",
        "Large",
        "Medium",
        "Small"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Padding",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Size=Small","width":136,"height":136,"outline":0,"node":"144:109472"},
      {"name":"Size=Medium","width":300,"height":136,"outline":1,"node":"144:109485"},
      {"name":"Size=Large","width":300,"height":300,"outline":2,"node":"144:109498"},
      {"name":"Size=Extra Large","width":628,"height":300,"outline":3,"node":"144:109524"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-2x2-clock-big-ipad-only",
     "name": "Lock Screen Widget/2x2/Clock Big (iPad Only)",
     "page": "Widgets",
     "variants": [
      {"name":"","width":162,"height":162,"outline":0,"node":"526:38737"}
     ]
    },
    {
     "id": "widgets-lock-screen-widget-2x2-date-ipad-only",
     "name": "Lock Screen Widget/2x2/Date (iPad Only)",
     "page": "Widgets",
     "variants": [
      {"name":"","width":162,"height":162,"outline":0,"node":"526:38824"}
     ]
    },
    {
     "id": "windows-window",
     "name": "Window",
     "page": "Windows",
     "variants": [
      {"name":"","width":720,"height":400,"outline":0,"node":"5588:3741"}
     ],
     "uses": [
      "windows-window-resize"
     ]
    },
    {
     "id": "windows-window-with-sidebar",
     "name": "Window with Sidebar",
     "page": "Windows",
     "variants": [
      {"name":"","width":720,"height":400,"outline":0,"node":"10473:47217"},
      {"name":"","width":720,"height":400,"outline":1,"node":"10473:47210"}
     ],
     "uses": [
      "sidebars-bg",
      "windows-window-resize"
     ]
    },
    {
     "id": "windows-window-controls",
     "name": "_Window Controls",
     "page": "Windows",
     "helper": true,
     "variant_props": [
      {
       "name": "Window State",
       "values": [
        "Active",
        "Inactive"
       ]
      }
     ],
     "variants": [
      {"name":"Window State=Inactive","width":41,"height":22,"outline":0,"node":"5565:22709"},
      {"name":"Window State=Active","width":41,"height":22,"outline":1,"node":"5565:22714"}
     ],
     "uses": [
      "materials-liquid-glass-regular-small"
     ]
    },
    {
     "id": "windows-window-resize",
     "name": "_Window Resize",
     "page": "Windows",
     "helper": true,
     "variant_props": [
      {
       "name": "Window",
       "values": [
        "Floating",
        "Full Screen"
       ]
      }
     ],
     "variants": [
      {"name":"Window=Full Screen","width":32,"height":32,"outline":0,"node":"10472:45052"},
      {"name":"Window=Floating","width":32,"height":32,"outline":1,"node":"5589:4090"}
     ]
    },
    {
     "id": "kit-helpers-mode-label",
     "name": "_Mode Label",
     "page": "_Kit Helpers",
     "helper": true,
     "variants": [
      {"name":"","width":54,"height":19,"outline":0,"node":"540:189866"}
     ]
    },
    {
     "id": "kit-helpers-component-header",
     "name": "_Component Header",
     "page": "_Kit Helpers",
     "helper": true,
     "props": [
      {
       "name": "Description",
       "type": "text",
       "default": "\"Description\""
      },
      {
       "name": "Component name",
       "type": "text",
       "default": "\"Component name\""
      },
      {
       "name": "Link 1",
       "type": "text",
       "default": "\"Human Interface Guidelines\""
      },
      {
       "name": "Show Description",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Link 1",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Link 2",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Link 2",
       "type": "text",
       "default": "\"Human Interface Guidelines\""
      }
     ],
     "variants": [
      {"name":"","width":1800,"height":208,"outline":0,"node":"507:29149"}
     ]
    }
   ]
  },
  {
   "id": "macos",
   "name": "macOS 27",
   "pages": [
    "Examples",
    "Colors",
    "Materials",
    "Text Styles",
    "Alerts",
    "Buttons",
    "Color Wells",
    "Combo Boxes",
    "Dialogs",
    "Disclosure Controls",
    "Forms",
    "Group Boxes",
    "Image Wells",
    "Lists and Tables",
    "Menu Bar and Dock",
    "Menus",
    "Notifications",
    "Pointers",
    "Pop-up and Pull-down Buttons",
    "Popovers",
    "Progress Indicators",
    "Scrollbar",
    "Search Fields",
    "Sidebars",
    "Segmented Controls",
    "Sheets",
    "Sliders and Dials",
    "Steppers",
    "Text Fields",
    "Toolbars",
    "Toggles",
    "Tooltips",
    "Windows",
    "_Kit"
   ],
   "drawings": 1230,
   "components": [
    {
     "id": "examples-utility-window",
     "name": "Examples/Utility Window",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8166"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-utility-panel"
     ]
    },
    {
     "id": "examples-utility-window-2",
     "name": "Examples/Utility Window",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8167"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-utility-panel"
     ]
    },
    {
     "id": "examples-windows-default-with-titlebar-and-sidebar",
     "name": "Examples/Windows/Default with Titlebar and Sidebar",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8164"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-windows-unified-compact-toolbar-title",
     "name": "Examples/Windows/Unified Compact Toolbar + Title",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8162"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-windows-expaned-toolbar-title",
     "name": "Examples/Windows/Expaned Toolbar + Title",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8160"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-windows-unified-toolbar-title",
     "name": "Examples/Windows/Unified Toolbar + Title",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8158"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-windows-default-with-titlebar-and-sidebar-2",
     "name": "Examples/Windows/Default with Titlebar and Sidebar",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8165"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-windows-unified-compact-toolbar-title-2",
     "name": "Examples/Windows/Unified Compact Toolbar + Title",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8163"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-windows-expaned-toolbar-title-2",
     "name": "Examples/Windows/Expaned Toolbar + Title",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8161"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-windows-unified-toolbar-title-2",
     "name": "Examples/Windows/Unified Toolbar + Title",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8159"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-notifications",
     "name": "Examples/Notifications",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8156"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "notifications-notification"
     ]
    },
    {
     "id": "examples-notifications-2",
     "name": "Examples/Notifications",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8157"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "notifications-notification"
     ]
    },
    {
     "id": "examples-menubar",
     "name": "Examples/Menubar",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8154"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "pointers",
      "menus-menu"
     ]
    },
    {
     "id": "examples-menubar-2",
     "name": "Examples/Menubar",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8155"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "menus-menu",
      "pointers"
     ]
    },
    {
     "id": "examples-list",
     "name": "Examples/List",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8151"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "sidebars-bg",
      "sidebars-composed",
      "materials-scroll-edge-effect-hard",
      "toolbars-segmented-control",
      "windows-window-titles",
      "toolbars-button-group",
      "toolbars-button",
      "toolbars-search",
      "lists-and-tables-list-column-header",
      "lists-and-tables-list-outline-view",
      "scrollbar-vertical"
     ]
    },
    {
     "id": "examples-form",
     "name": "Examples/Form",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8150"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-list-2",
     "name": "Examples/List",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8153"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "sidebars-bg",
      "sidebars-composed",
      "materials-scroll-edge-effect-hard",
      "toolbars-segmented-control",
      "windows-window-titles",
      "toolbars-button-group",
      "toolbars-button",
      "toolbars-search",
      "lists-and-tables-list-column-header",
      "lists-and-tables-list-outline-view",
      "scrollbar-vertical"
     ]
    },
    {
     "id": "examples-form-2",
     "name": "Examples/Form",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8152"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed"
     ]
    },
    {
     "id": "examples-dialog-save-large",
     "name": "Examples/Dialog/Save - Large",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8147"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed",
      "dialogs-save-dialog-overlay",
      "dialogs-save-dialog-large"
     ]
    },
    {
     "id": "examples-dialog-save-small",
     "name": "Examples/Dialog/Save - Small",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8146"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed",
      "dialogs-save-dialog-overlay",
      "dialogs-save-dialog-small"
     ]
    },
    {
     "id": "examples-dialog-save-large-2",
     "name": "Examples/Dialog/Save - Large",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8149"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed",
      "dialogs-save-dialog-overlay",
      "dialogs-save-dialog-large"
     ]
    },
    {
     "id": "examples-dialog-save-small-2",
     "name": "Examples/Dialog/Save - Small",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8148"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-composed",
      "dialogs-save-dialog-overlay",
      "dialogs-save-dialog-small"
     ]
    },
    {
     "id": "examples-alert-side-by-window-modal",
     "name": "Examples/Alert/Side-by-side - Window Modal",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8143"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-bg",
      "alerts-overlay",
      "alerts-alert"
     ]
    },
    {
     "id": "examples-alert-side-by",
     "name": "Examples/Alert/Side-by-side",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8142"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "alerts-alert"
     ]
    },
    {
     "id": "examples-alert-side-by-window-modal-2",
     "name": "Examples/Alert/Side-by-side - Window Modal",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8145"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "windows-window-bg",
      "alerts-overlay",
      "alerts-alert"
     ]
    },
    {
     "id": "examples-alert-side-by-2",
     "name": "Examples/Alert/Side-by-side",
     "page": "Examples",
     "variants": [
      {"name":"","width":1512,"height":993,"outline":0,"node":"4440:8144"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-template",
      "alerts-alert"
     ]
    },
    {
     "id": "colors-swatch-light-and-dark",
     "name": "_Swatch - Light and Dark",
     "page": "Colors",
     "helper": true,
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"484:9569"}
     ]
    },
    {
     "id": "colors-swatch-light-and-dark-vibrant",
     "name": "_Swatch - Light and Dark (Vibrant)",
     "page": "Colors",
     "helper": true,
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"485:9762"}
     ]
    },
    {
     "id": "colors-swatch-text-light-and-dark-vibrant",
     "name": "_Swatch - Text - Light and Dark (Vibrant)",
     "page": "Colors",
     "helper": true,
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"486:10091"}
     ]
    },
    {
     "id": "colors-swatch-text-light-and-dark-vibrant-2",
     "name": "_Swatch - Text - Light and Dark (Vibrant)",
     "page": "Colors",
     "helper": true,
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"486:10153"}
     ]
    },
    {
     "id": "materials-scroll-edge-effect-hard",
     "name": "Scroll Edge Effect - Hard",
     "page": "Materials",
     "variant_props": [
      {
       "name": "Edge",
       "values": [
        "Bottom",
        "Top"
       ]
      }
     ],
     "variants": [
      {"name":"Edge=Bottom","width":200,"height":200,"outline":0,"node":"4363:18595"},
      {"name":"Edge=Top","width":200,"height":200,"outline":0,"node":"4363:18596"}
     ]
    },
    {
     "id": "materials-scroll-edge-effect-soft",
     "name": "Scroll Edge Effect - Soft",
     "page": "Materials",
     "variant_props": [
      {
       "name": "Edge",
       "values": [
        "Bottom",
        "Top"
       ]
      }
     ],
     "variants": [
      {"name":"Edge=Bottom","width":200,"height":200,"outline":0,"node":"4363:18555"},
      {"name":"Edge=Top","width":200,"height":200,"outline":1,"node":"4363:18558"}
     ]
    },
    {
     "id": "materials",
     "name": "Materials",
     "page": "Materials",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Ultra Thick",
        "Thick",
        "Medium",
        "Thin",
        "Ultra Thin"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Ultra Thick","width":100,"height":100,"outline":0,"node":"4331:12156"},
      {"name":"Type=Thick","width":100,"height":100,"outline":1,"node":"4331:12155"},
      {"name":"Type=Medium","width":100,"height":100,"outline":2,"node":"4331:12154"},
      {"name":"Type=Thin","width":100,"height":100,"outline":3,"node":"4331:12153"},
      {"name":"Type=Ultra Thin","width":100,"height":100,"outline":4,"node":"4331:12152"}
     ]
    },
    {
     "id": "materials-liquid-glass-large",
     "name": "Liquid Glass - Large",
     "page": "Materials",
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"483:9244"}
     ]
    },
    {
     "id": "materials-liquid-glass-medium",
     "name": "Liquid Glass - Medium",
     "page": "Materials",
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"483:9257"}
     ]
    },
    {
     "id": "materials-liquid-glass-small",
     "name": "Liquid Glass - Small",
     "page": "Materials",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Default",
        "Primary"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, State=Primary","width":48,"height":48,"outline":0,"node":"4363:8242"},
      {"name":"Active=False, State=Default","width":48,"height":48,"outline":0,"node":"4363:8250"},
      {"name":"Active=True, State=Primary","width":48,"height":48,"outline":1,"node":"483:9264"},
      {"name":"Active=True, State=Default","width":48,"height":48,"outline":2,"node":"483:9270"}
     ]
    },
    {
     "id": "alerts-buttons",
     "name": "_Buttons",
     "page": "Alerts",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Primary",
        "Secondary",
        "Destructive"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Type=Destructive","width":160,"height":28,"outline":0,"node":"493:2826"},
      {"name":"Type=Secondary","width":160,"height":28,"outline":1,"node":"121:11173"},
      {"name":"Type=Primary","width":160,"height":28,"outline":2,"node":"121:11171"}
     ]
    },
    {
     "id": "alerts-alert",
     "name": "Alert",
     "page": "Alerts",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Stacked",
        "Side-by-side"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Save this message as a draft?\""
      },
      {
       "name": "Description",
       "type": "text",
       "default": "\"This message has not been sent and cont…\""
      },
      {
       "name": "Show Icon",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Message",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Buttons",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Type=Stacked","width":260,"height":216,"outline":0,"node":"121:11254"},
      {"name":"Type=Side-by-side","width":260,"height":152,"outline":1,"node":"121:11240"}
     ],
     "uses": [
      "materials-liquid-glass-large",
      "alerts-buttons"
     ]
    },
    {
     "id": "alerts-overlay",
     "name": "Overlay",
     "page": "Alerts",
     "variants": [
      {"name":"","width":100,"height":100,"outline":0,"node":"4335:347"}
     ]
    },
    {
     "id": "buttons-arrow",
     "name": "Arrow Buttons",
     "page": "Buttons",
     "section": "Buttons - Arrow Buttons",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":24,"height":24,"outline":0,"node":"483:5563"},
      {"name":"State=Clicked","width":24,"height":24,"outline":1,"node":"483:5566"},
      {"name":"State=Idle","width":24,"height":24,"outline":2,"node":"483:5569"}
     ],
     "uses": [
      "kit-control-bg-controls"
     ]
    },
    {
     "id": "buttons-labels-toggle",
     "name": "_Labels - Toggle",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "On",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Active=False, Context=Content Area, State=Disabled, On=False","width":35,"height":16,"outline":0,"node":"4342:1563"},
      {"name":"Active=False, Context=Content Area, State=Clicked, On=False","width":35,"height":16,"outline":1,"node":"4342:1565"},
      {"name":"Active=False, Context=Content Area, State=Idle, On=False","width":35,"height":16,"outline":2,"node":"4342:1567"},
      {"name":"Active=False, Context=Content Area, State=Disabled, On=True","width":35,"height":16,"outline":0,"node":"4342:1575"},
      {"name":"Active=False, Context=Content Area, State=Clicked, On=True","width":35,"height":16,"outline":1,"node":"4342:1577"},
      {"name":"Active=False, Context=Content Area, State=Idle, On=True","width":35,"height":16,"outline":2,"node":"4342:1579"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, On=False","width":35,"height":16,"outline":3,"node":"4342:1587"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, On=False","width":35,"height":16,"outline":4,"node":"4342:1589"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, On=False","width":35,"height":16,"outline":5,"node":"4342:1591"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, On=True","width":35,"height":16,"outline":6,"node":"4342:1599"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, On=True","width":35,"height":16,"outline":4,"node":"4342:1601"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, On=True","width":35,"height":16,"outline":4,"node":"4342:1603"},
      {"name":"Active=True, Context=Content Area, State=Disabled, On=False","width":35,"height":16,"outline":0,"node":"4342:1050"},
      {"name":"Active=True, Context=Content Area, State=Clicked, On=False","width":35,"height":16,"outline":1,"node":"4342:1052"},
      {"name":"Active=True, Context=Content Area, State=Idle, On=False","width":35,"height":16,"outline":2,"node":"4342:1054"},
      {"name":"Active=True, Context=Content Area, State=Disabled, On=True","width":35,"height":16,"outline":7,"node":"4342:1062"},
      {"name":"Active=True, Context=Content Area, State=Clicked, On=True","width":35,"height":16,"outline":1,"node":"4342:1064"},
      {"name":"Active=True, Context=Content Area, State=Idle, On=True","width":35,"height":16,"outline":1,"node":"4342:1066"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, On=False","width":35,"height":16,"outline":6,"node":"4341:3258"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, On=False","width":35,"height":16,"outline":4,"node":"4341:3270"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, On=False","width":35,"height":16,"outline":4,"node":"4341:3282"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, On=True","width":35,"height":16,"outline":6,"node":"4339:4564"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, On=True","width":35,"height":16,"outline":4,"node":"4339:4566"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, On=True","width":35,"height":16,"outline":4,"node":"4339:4568"}
     ]
    },
    {
     "id": "buttons-labels-borderless",
     "name": "_Labels - Borderless",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "State",
       "values": [
        "Clicked",
        "Disabled",
        "Idle"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled","width":35,"height":16,"outline":0,"node":"4341:3260"},
      {"name":"Context=Content Area, State=Clicked","width":35,"height":16,"outline":1,"node":"4341:3272"},
      {"name":"Context=Content Area, State=Idle","width":35,"height":16,"outline":2,"node":"4341:3284"},
      {"name":"Context=Over-Glass, State=Disabled","width":35,"height":16,"outline":3,"node":"4339:4612"},
      {"name":"Context=Over-Glass, State=Clicked","width":35,"height":16,"outline":4,"node":"4339:4614"},
      {"name":"Context=Over-Glass, State=Idle","width":35,"height":16,"outline":5,"node":"4339:4616"}
     ]
    },
    {
     "id": "buttons-labels-preferred",
     "name": "_Labels - Preferred",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "State",
       "values": [
        "Clicked",
        "Disabled",
        "Idle"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled","width":35,"height":16,"outline":0,"node":"4341:3254"},
      {"name":"Context=Content Area, State=Clicked","width":35,"height":16,"outline":1,"node":"4341:3266"},
      {"name":"Context=Content Area, State=Idle","width":35,"height":16,"outline":1,"node":"4341:3278"},
      {"name":"Context=Over-Glass, State=Disabled","width":35,"height":16,"outline":0,"node":"4339:4468"},
      {"name":"Context=Over-Glass, State=Clicked","width":35,"height":16,"outline":1,"node":"4339:4470"},
      {"name":"Context=Over-Glass, State=Idle","width":35,"height":16,"outline":1,"node":"4339:4472"}
     ]
    },
    {
     "id": "buttons-labels-destructive",
     "name": "_Labels - Destructive",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "State",
       "values": [
        "Clicked",
        "Disabled",
        "Idle"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled","width":35,"height":16,"outline":0,"node":"4341:3252"},
      {"name":"Context=Content Area, State=Clicked","width":35,"height":16,"outline":1,"node":"4341:3264"},
      {"name":"Context=Content Area, State=Idle","width":35,"height":16,"outline":1,"node":"4341:3276"},
      {"name":"Context=Over-Glass, State=Disabled","width":35,"height":16,"outline":2,"node":"4339:4420"},
      {"name":"Context=Over-Glass, State=Clicked","width":35,"height":16,"outline":1,"node":"4339:4422"},
      {"name":"Context=Over-Glass, State=Idle","width":35,"height":16,"outline":1,"node":"4339:4424"}
     ]
    },
    {
     "id": "buttons-labels-tinted",
     "name": "_Labels - Tinted",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "State",
       "values": [
        "Clicked",
        "Disabled",
        "Idle"
       ]
      },
      {
       "name": "Window State",
       "values": [
        "Active"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled, Window State=Active","width":35,"height":16,"outline":0,"node":"4341:3250"},
      {"name":"Context=Content Area, State=Clicked, Window State=Active","width":35,"height":16,"outline":1,"node":"4341:3262"},
      {"name":"Context=Content Area, State=Idle, Window State=Active","width":35,"height":16,"outline":1,"node":"4341:3274"},
      {"name":"Context=Over-Glass, State=Disabled, Window State=Active","width":35,"height":16,"outline":2,"node":"4339:4372"},
      {"name":"Context=Over-Glass, State=Clicked, Window State=Active","width":35,"height":16,"outline":1,"node":"4339:4374"},
      {"name":"Context=Over-Glass, State=Idle, Window State=Active","width":35,"height":16,"outline":1,"node":"4339:4376"}
     ]
    },
    {
     "id": "buttons-label",
     "name": "_Label",
     "page": "Buttons",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "Active"
       ]
      },
      {
       "name": "Context",
       "values": [
        "Over-Glass",
        "Content Area"
       ]
      },
      {
       "name": "On",
       "values": [
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Bordered"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Active=Active, Context=Content Area, State=Disabled, Style=Bordered, On=False","width":35,"height":16,"outline":0,"node":"4341:3304"},
      {"name":"Active=Active, Context=Content Area, State=Clicked, Style=Bordered, On=False","width":35,"height":16,"outline":1,"node":"4341:3306"},
      {"name":"Active=Active, Context=Content Area, State=Idle, Style=Bordered, On=False","width":35,"height":16,"outline":1,"node":"4341:3308"},
      {"name":"Active=Active, Context=Over-Glass, State=Disabled, Style=Bordered, On=False","width":35,"height":16,"outline":2,"node":"4339:4287"},
      {"name":"Active=Active, Context=Over-Glass, State=Clicked, Style=Bordered, On=False","width":35,"height":16,"outline":3,"node":"4339:4283"},
      {"name":"Active=Active, Context=Over-Glass, State=Idle, Style=Bordered, On=False","width":35,"height":16,"outline":3,"node":"4339:4285"}
     ]
    },
    {
     "id": "buttons",
     "name": "Buttons",
     "page": "Buttons",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "On",
       "values": [
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Bordered",
        "Bordered - Tinted",
        "Bordered - Destructive",
        "Bordered - Prominent (Default) Destructive",
        "Borderless",
        "Bordered - Prominent (Default) D"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, Context=Content Area, State=Disabled, Style=Borderless, On=False","width":67,"height":24,"outline":0,"node":"4341:2332"},
      {"name":"Active=False, Context=Content Area, State=Disabled, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":1,"node":"4341:2337"},
      {"name":"Active=False, Context=Content Area, State=Disabled, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":1,"node":"4341:2340"},
      {"name":"Active=False, Context=Content Area, State=Disabled, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":1,"node":"4341:2343"},
      {"name":"Active=False, Context=Content Area, State=Disabled, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":1,"node":"4341:2346"},
      {"name":"Active=False, Context=Content Area, State=Disabled, Style=Bordered, On=False","width":67,"height":24,"outline":1,"node":"4341:2349"},
      {"name":"Active=False, Context=Content Area, State=Clicked, Style=Borderless, On=False","width":67,"height":24,"outline":2,"node":"4341:2352"},
      {"name":"Active=False, Context=Content Area, State=Clicked, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":3,"node":"4341:2357"},
      {"name":"Active=False, Context=Content Area, State=Clicked, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":3,"node":"4341:2360"},
      {"name":"Active=False, Context=Content Area, State=Clicked, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":3,"node":"4341:2363"},
      {"name":"Active=False, Context=Content Area, State=Clicked, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":3,"node":"4341:2366"},
      {"name":"Active=False, Context=Content Area, State=Clicked, Style=Bordered, On=False","width":67,"height":24,"outline":3,"node":"4341:2369"},
      {"name":"Active=False, Context=Content Area, State=Idle, Style=Borderless, On=False","width":67,"height":24,"outline":4,"node":"4341:2372"},
      {"name":"Active=False, Context=Content Area, State=Idle, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":5,"node":"4341:2377"},
      {"name":"Active=False, Context=Content Area, State=Idle, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":5,"node":"4341:2380"},
      {"name":"Active=False, Context=Content Area, State=Idle, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":5,"node":"4341:2383"},
      {"name":"Active=False, Context=Content Area, State=Idle, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":5,"node":"4341:2386"},
      {"name":"Active=False, Context=Content Area, State=Idle, Style=Bordered, On=False","width":67,"height":24,"outline":5,"node":"4341:2389"},
      {"name":"Active=True, Context=Content Area, State=Disabled, Style=Borderless, On=False","width":67,"height":24,"outline":0,"node":"4341:2452"},
      {"name":"Active=True, Context=Content Area, State=Disabled, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":6,"node":"4341:2457"},
      {"name":"Active=True, Context=Content Area, State=Disabled, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":7,"node":"4341:2460"},
      {"name":"Active=True, Context=Content Area, State=Disabled, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":8,"node":"4341:2463"},
      {"name":"Active=True, Context=Content Area, State=Disabled, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":9,"node":"4341:2466"},
      {"name":"Active=True, Context=Content Area, State=Disabled, Style=Bordered, On=False","width":67,"height":24,"outline":1,"node":"4341:2469"},
      {"name":"Active=True, Context=Content Area, State=Clicked, Style=Borderless, On=False","width":67,"height":24,"outline":2,"node":"4341:2472"},
      {"name":"Active=True, Context=Content Area, State=Clicked, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":10,"node":"4341:2477"},
      {"name":"Active=True, Context=Content Area, State=Clicked, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":11,"node":"4341:2480"},
      {"name":"Active=True, Context=Content Area, State=Clicked, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":12,"node":"4341:2483"},
      {"name":"Active=True, Context=Content Area, State=Clicked, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":13,"node":"4341:2486"},
      {"name":"Active=True, Context=Content Area, State=Clicked, Style=Bordered, On=False","width":67,"height":24,"outline":3,"node":"4341:2489"},
      {"name":"Active=True, Context=Content Area, State=Idle, Style=Borderless, On=False","width":67,"height":24,"outline":4,"node":"4341:2492"},
      {"name":"Active=True, Context=Content Area, State=Idle, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":14,"node":"4341:2497"},
      {"name":"Active=True, Context=Content Area, State=Idle, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":15,"node":"4341:2500"},
      {"name":"Active=True, Context=Content Area, State=Idle, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":16,"node":"4341:2503"},
      {"name":"Active=True, Context=Content Area, State=Idle, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":17,"node":"4341:2506"},
      {"name":"Active=True, Context=Content Area, State=Idle, Style=Bordered, On=False","width":67,"height":24,"outline":5,"node":"4341:2509"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, Style=Borderless, On=False","width":67,"height":24,"outline":0,"node":"502:7684"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":1,"node":"502:7689"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":1,"node":"502:7692"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":1,"node":"502:7698"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":1,"node":"502:7701"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, Style=Bordered, On=False","width":67,"height":24,"outline":1,"node":"502:7704"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, Style=Borderless, On=False","width":67,"height":24,"outline":2,"node":"502:7707"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":3,"node":"502:7715"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":3,"node":"502:7712"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":3,"node":"502:7721"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":3,"node":"502:7724"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, Style=Bordered, On=False","width":67,"height":24,"outline":3,"node":"502:7727"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, Style=Borderless, On=False","width":67,"height":24,"outline":4,"node":"502:7730"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":5,"node":"502:7738"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":5,"node":"502:7732"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":5,"node":"502:7744"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":5,"node":"502:7747"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, Style=Bordered, On=False","width":67,"height":24,"outline":5,"node":"502:7750"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, Style=Borderless, On=False","width":67,"height":24,"outline":0,"node":"502:6008"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":6,"node":"502:6011"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":7,"node":"502:6014"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":8,"node":"502:6017"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":9,"node":"502:6002"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, Style=Bordered, On=False","width":67,"height":24,"outline":1,"node":"502:5921"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, Style=Borderless, On=False","width":67,"height":24,"outline":2,"node":"502:5975"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":10,"node":"502:5978"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":11,"node":"502:5981"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":12,"node":"502:5984"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":13,"node":"502:5987"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, Style=Bordered, On=False","width":67,"height":24,"outline":3,"node":"502:5915"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, Style=Borderless, On=False","width":67,"height":24,"outline":4,"node":"502:5872"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, Style=Bordered - Prominent (Default) Destructive, On=False","width":67,"height":24,"outline":14,"node":"502:5866"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, Style=Bordered - Prominent (Default) D, On=False","width":67,"height":24,"outline":15,"node":"502:5860"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, Style=Bordered - Destructive, On=False","width":67,"height":24,"outline":16,"node":"502:5854"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, Style=Bordered - Tinted, On=False","width":67,"height":24,"outline":17,"node":"501:5842"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, Style=Bordered, On=False","width":67,"height":24,"outline":5,"node":"121:11924"}
     ],
     "uses": [
      "buttons-labels-borderless",
      "kit-control-bg-bordered",
      "buttons-label",
      "kit-control-bg-bordered-prominent-destructive",
      "buttons-labels-preferred",
      "kit-control-bg-bordered-prominent",
      "kit-control-bg-bordered-destructive",
      "buttons-labels-destructive",
      "kit-control-bg-bordered-tinted",
      "buttons-labels-tinted"
     ]
    },
    {
     "id": "buttons-toggle",
     "name": "Buttons - Toggle",
     "page": "Buttons",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "On",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, Context=Content Area, State=Disabled, On=True","width":67,"height":24,"outline":0,"node":"4341:8477"},
      {"name":"Active=False, Context=Content Area, State=Clicked, On=True","width":67,"height":24,"outline":1,"node":"4341:8494"},
      {"name":"Active=False, Context=Content Area, State=Idle, On=True","width":67,"height":24,"outline":2,"node":"4341:8511"},
      {"name":"Active=False, Context=Content Area, State=Disabled, On=False","width":67,"height":24,"outline":3,"node":"4341:8528"},
      {"name":"Active=False, Context=Content Area, State=Clicked, On=False","width":67,"height":24,"outline":4,"node":"4341:8545"},
      {"name":"Active=False, Context=Content Area, State=Idle, On=False","width":67,"height":24,"outline":5,"node":"4341:8562"},
      {"name":"Active=True, Context=Content Area, State=Disabled, On=True","width":67,"height":24,"outline":0,"node":"4341:8579"},
      {"name":"Active=True, Context=Content Area, State=Clicked, On=True","width":67,"height":24,"outline":1,"node":"4341:8596"},
      {"name":"Active=True, Context=Content Area, State=Idle, On=True","width":67,"height":24,"outline":2,"node":"4341:8613"},
      {"name":"Active=True, Context=Content Area, State=Disabled, On=False","width":67,"height":24,"outline":3,"node":"4341:8630"},
      {"name":"Active=True, Context=Content Area, State=Clicked, On=False","width":67,"height":24,"outline":4,"node":"4341:8647"},
      {"name":"Active=True, Context=Content Area, State=Idle, On=False","width":67,"height":24,"outline":5,"node":"4341:8664"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, On=True","width":67,"height":24,"outline":0,"node":"4341:8681"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, On=True","width":67,"height":24,"outline":1,"node":"4341:8698"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, On=True","width":67,"height":24,"outline":2,"node":"4341:8715"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled, On=False","width":67,"height":24,"outline":3,"node":"4341:8732"},
      {"name":"Active=False, Context=Over-Glass, State=Clicked, On=False","width":67,"height":24,"outline":4,"node":"4341:8749"},
      {"name":"Active=False, Context=Over-Glass, State=Idle, On=False","width":67,"height":24,"outline":5,"node":"4341:8766"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, On=True","width":67,"height":24,"outline":0,"node":"4341:8783"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, On=True","width":67,"height":24,"outline":1,"node":"4341:8800"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, On=True","width":67,"height":24,"outline":2,"node":"4341:8817"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled, On=False","width":67,"height":24,"outline":3,"node":"4341:8834"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked, On=False","width":67,"height":24,"outline":4,"node":"4341:8851"},
      {"name":"Active=True, Context=Over-Glass, State=Idle, On=False","width":67,"height":24,"outline":5,"node":"4341:8868"}
     ],
     "uses": [
      "kit-control-bg-bordered",
      "buttons-labels-toggle"
     ]
    },
    {
     "id": "color-wells-picker-wheel",
     "name": "Color Picker - Wheel",
     "page": "Color Wells",
     "variant_props": [
      {
       "name": "Color Selected",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Color Selected=False","width":28,"height":28,"outline":0,"node":"121:12521"},
      {"name":"Color Selected=True","width":28,"height":28,"outline":1,"node":"121:12524"}
     ]
    },
    {
     "id": "color-wells-picker",
     "name": "Color Picker",
     "page": "Color Wells",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Selected",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":48,"height":24,"outline":0,"node":"4335:11838"},
      {"name":"State=Selected","width":48,"height":24,"outline":1,"node":"4335:11840"},
      {"name":"State=Idle","width":48,"height":24,"outline":2,"node":"4335:11842"}
     ],
     "uses": [
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "combo-boxes-box",
     "name": "Combo Box",
     "page": "Combo Boxes",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Button Clicked",
        "Disabled",
        "Field Clicked"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":100,"height":24,"outline":0,"node":"510:8680"},
      {"name":"State=Button Clicked","width":100,"height":24,"outline":1,"node":"510:8689"},
      {"name":"State=Field Clicked","width":100,"height":24,"outline":2,"node":"510:8662"},
      {"name":"State=Idle","width":100,"height":24,"outline":3,"node":"218:5110"}
     ],
     "uses": [
      "text-fields-field",
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "dialogs-save-dialog-overlay",
     "name": "Overlay",
     "page": "Dialogs",
     "section": "Save Dialog",
     "variants": [
      {"name":"","width":100,"height":100,"outline":0,"node":"682:4331"}
     ]
    },
    {
     "id": "dialogs-save-dialog-large",
     "name": "Large",
     "page": "Dialogs",
     "section": "Save Dialog",
     "variants": [
      {"name":"","width":1000,"height":448,"outline":0,"node":"174:9424"}
     ],
     "uses": [
      "sidebars-bg",
      "sidebars-composed",
      "pop-up-and-pull-down-buttons-pulldown-button",
      "text-fields-field",
      "pop-up-and-pull-down-buttons-button",
      "kit-control-bg-bordered",
      "search-fields-field",
      "lists-and-tables-list-column-header",
      "lists-and-tables-list-table-rows",
      "lists-and-tables-list-table-rows-blank",
      "buttons"
     ]
    },
    {
     "id": "dialogs-save-dialog-small",
     "name": "Small",
     "page": "Dialogs",
     "section": "Save Dialog",
     "variants": [
      {"name":"","width":390,"height":318,"outline":0,"node":"171:9049"}
     ],
     "uses": [
      "text-fields-field",
      "pop-up-and-pull-down-buttons-button",
      "kit-control-bg-bordered",
      "buttons"
     ]
    },
    {
     "id": "disclosure-controls-button",
     "name": "Disclosure Button",
     "page": "Disclosure Controls",
     "variant_props": [
      {
       "name": "Disclosed",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled, Disclosed=True","width":24,"height":24,"outline":0,"node":"4346:6468"},
      {"name":"State=Clicked, Disclosed=True","width":24,"height":24,"outline":1,"node":"4346:6471"},
      {"name":"State=Idle, Disclosed=True","width":24,"height":24,"outline":2,"node":"4346:6474"},
      {"name":"State=Disabled, Disclosed=False","width":24,"height":24,"outline":3,"node":"4346:6477"},
      {"name":"State=Clicked, Disclosed=False","width":24,"height":24,"outline":4,"node":"4346:6480"},
      {"name":"State=Idle, Disclosed=False","width":24,"height":24,"outline":5,"node":"4346:6483"}
     ],
     "uses": [
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "forms-left-accessory-icons-32pt",
     "name": "_Left Accessory Icons / 32pt",
     "page": "Forms",
     "helper": true,
     "variant_props": [
      {
       "name": "Color",
       "values": [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Mint",
        "Teal",
        "Cyan",
        "Blue",
        "Indigo",
        "Purple",
        "Pink",
        "Brown",
        "Black",
        "Dark Gray",
        "Light Gray",
        "White"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"Color=Red","width":26,"height":26,"outline":0,"node":"121:12886"},
      {"name":"Color=Orange","width":26,"height":26,"outline":1,"node":"121:12883"},
      {"name":"Color=Yellow","width":26,"height":26,"outline":2,"node":"121:12898"},
      {"name":"Color=Green","width":26,"height":26,"outline":3,"node":"121:12880"},
      {"name":"Color=Mint","width":26,"height":26,"outline":4,"node":"2302:1634"},
      {"name":"Color=Teal","width":26,"height":26,"outline":5,"node":"121:12871"},
      {"name":"Color=Cyan","width":26,"height":26,"outline":6,"node":"2302:1636"},
      {"name":"Color=Blue","width":26,"height":26,"outline":7,"node":"121:12868"},
      {"name":"Color=Indigo","width":26,"height":26,"outline":8,"node":"121:12889"},
      {"name":"Color=Purple","width":26,"height":26,"outline":9,"node":"2302:1638"},
      {"name":"Color=Pink","width":26,"height":26,"outline":10,"node":"121:12892"},
      {"name":"Color=Brown","width":26,"height":26,"outline":11,"node":"2302:1640"},
      {"name":"Color=Black","width":26,"height":26,"outline":12,"node":"121:12865"},
      {"name":"Color=Dark Gray","width":26,"height":26,"outline":13,"node":"121:12874"},
      {"name":"Color=Light Gray","width":26,"height":26,"outline":14,"node":"121:12877"},
      {"name":"Color=White","width":26,"height":26,"outline":15,"node":"121:12895"}
     ]
    },
    {
     "id": "forms-left-accessory-icons-24pt",
     "name": "_Left Accessory Icons / 24pt",
     "page": "Forms",
     "helper": true,
     "variant_props": [
      {
       "name": "Color",
       "values": [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Mint",
        "Teal",
        "Cyan",
        "Blue",
        "Indigo",
        "Purple",
        "Pink",
        "Brown",
        "Black",
        "Dark Gray",
        "Light Gray",
        "White"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"Color=Red","width":20,"height":20,"outline":0,"node":"121:12855"},
      {"name":"Color=Orange","width":20,"height":20,"outline":1,"node":"121:12846"},
      {"name":"Color=Yellow","width":20,"height":20,"outline":2,"node":"121:12861"},
      {"name":"Color=Green","width":20,"height":20,"outline":3,"node":"121:12843"},
      {"name":"Color=Mint","width":20,"height":20,"outline":4,"node":"2302:518"},
      {"name":"Color=Teal","width":20,"height":20,"outline":5,"node":"121:12834"},
      {"name":"Color=Cyan","width":20,"height":20,"outline":6,"node":"2302:520"},
      {"name":"Color=Blue","width":20,"height":20,"outline":7,"node":"121:12831"},
      {"name":"Color=Indigo","width":20,"height":20,"outline":8,"node":"2302:522"},
      {"name":"Color=Purple","width":20,"height":20,"outline":9,"node":"121:12852"},
      {"name":"Color=Pink","width":20,"height":20,"outline":10,"node":"121:12849"},
      {"name":"Color=Brown","width":20,"height":20,"outline":11,"node":"2302:524"},
      {"name":"Color=Black","width":20,"height":20,"outline":12,"node":"121:12828"},
      {"name":"Color=Dark Gray","width":20,"height":20,"outline":13,"node":"121:12837"},
      {"name":"Color=Light Gray","width":20,"height":20,"outline":14,"node":"121:12840"},
      {"name":"Color=White","width":20,"height":20,"outline":15,"node":"121:12858"}
     ]
    },
    {
     "id": "forms-trailing-accessories",
     "name": "Trailing Accessories",
     "page": "Forms",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Button",
        "Combo Box",
        "Detail Disclosure",
        "Label",
        "Label + Info Button",
        "More Button",
        "Pop-Up Button",
        "Radio Buttons",
        "Stepper",
        "Switch",
        "Text Field",
        "Checkboxes"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Show Label",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Info",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Type=Text Field","width":120,"height":24,"outline":0,"node":"121:13021"},
      {"name":"Type=Switch","width":36,"height":16,"outline":1,"node":"121:12989"},
      {"name":"Type=Stepper","width":97,"height":24,"outline":2,"node":"121:13015"},
      {"name":"Type=Radio Buttons","width":124,"height":16,"outline":3,"node":"121:13024"},
      {"name":"Type=Pop-Up Button","width":63,"height":16,"outline":4,"node":"121:12993"},
      {"name":"Type=More Button","width":59,"height":16,"outline":5,"node":"121:13034"},
      {"name":"Type=Label + Info Button","width":60,"height":16,"outline":6,"node":"121:13007"},
      {"name":"Type=Label","width":35,"height":16,"outline":7,"node":"121:12991"},
      {"name":"Type=Detail Disclosure","width":51,"height":16,"outline":8,"node":"314:163"},
      {"name":"Type=Combo Box","width":100,"height":24,"outline":9,"node":"121:13028"},
      {"name":"Type=Checkboxes","width":124,"height":16,"outline":10,"node":"706:4314"},
      {"name":"Type=Button","width":110,"height":24,"outline":11,"node":"121:13038"}
     ],
     "uses": [
      "text-fields-field",
      "toggles-switches",
      "steppers-stepper-inside-field",
      "toggles-radio-buttons",
      "pop-up-and-pull-down-buttons-button",
      "combo-boxes-box",
      "toggles-checkboxes",
      "buttons"
     ]
    },
    {
     "id": "forms-leading-accessories",
     "name": "Leading Accessories",
     "page": "Forms",
     "variant_props": [
      {
       "name": "Content",
       "values": [
        "Button",
        "Title and Subtitle",
        "Checkbox + Small Icon",
        "Checkbox + Large Icon",
        "Disclosure + Small Icon",
        "Disclosure + Large Icon",
        "Radio Buttons",
        "Symbol"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Disclosure",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Content=Radio Buttons","width":54,"height":102,"outline":0,"node":"121:12902"},
      {"name":"Content=Symbol","width":49,"height":16,"outline":1,"node":"121:12938"},
      {"name":"Content=Disclosure + Large Icon","width":92,"height":32,"outline":2,"node":"121:12932"},
      {"name":"Content=Disclosure + Small Icon","width":86,"height":32,"outline":3,"node":"121:12947"},
      {"name":"Content=Checkbox + Large Icon","width":100,"height":32,"outline":4,"node":"706:4405"},
      {"name":"Content=Checkbox + Small Icon","width":94,"height":32,"outline":5,"node":"706:4412"},
      {"name":"Content=Title and Subtitle","width":42,"height":32,"outline":6,"node":"706:4635"},
      {"name":"Content=Button","width":67,"height":24,"outline":7,"node":"121:12984"}
     ],
     "uses": [
      "toggles-radio-buttons",
      "forms-chevron",
      "forms-left-accessory-icons-32pt",
      "forms-left-accessory-icons-24pt",
      "toggles-checkboxes",
      "buttons"
     ]
    },
    {
     "id": "forms-chevron",
     "name": "_Chevron",
     "page": "Forms",
     "helper": true,
     "variant_props": [
      {
       "name": "Disclosed",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Disclosed=False","width":8,"height":16,"outline":0,"node":"243:3697"},
      {"name":"Disclosed=True","width":8,"height":16,"outline":1,"node":"243:3699"}
     ]
    },
    {
     "id": "forms-form",
     "name": "Form",
     "page": "Forms",
     "props": [
      {
       "name": "Rows",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":400,"height":504,"outline":0,"node":"4356:9283"}
     ],
     "uses": [
      "forms-form-row"
     ]
    },
    {
     "id": "forms-form-row",
     "name": "Form Row",
     "page": "Forms",
     "variants": [
      {"name":"","width":380,"height":42,"outline":0,"node":"4356:9291"}
     ],
     "uses": [
      "forms-leading-accessories",
      "forms-trailing-accessories"
     ]
    },
    {
     "id": "group-boxes-box",
     "name": "Group Box",
     "page": "Group Boxes",
     "variants": [
      {"name":"","width":200,"height":200,"outline":0,"node":"121:11265"}
     ]
    },
    {
     "id": "image-wells-well",
     "name": "Image Well",
     "page": "Image Wells",
     "variant_props": [
      {
       "name": "Enabled",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Enabled=False","width":30,"height":30,"outline":0,"node":"121:12534"},
      {"name":"Enabled=True","width":30,"height":30,"outline":1,"node":"121:12529"}
     ]
    },
    {
     "id": "lists-and-tables-list-group-title",
     "name": "Group Title",
     "page": "Lists and Tables",
     "section": "List",
     "props": [
      {
       "name": "Group Title",
       "type": "text",
       "default": "\"Group Title\""
      }
     ],
     "variants": [
      {"name":"","width":150,"height":45,"outline":0,"node":"0:2566"}
     ]
    },
    {
     "id": "lists-and-tables-list-column-headers",
     "name": "_Column Headers",
     "page": "Lists and Tables",
     "section": "List",
     "helper": true,
     "variant_props": [
      {
       "name": "First Column",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"First Column=False, Selected=False","width":150,"height":19,"outline":0,"node":"233:3891"},
      {"name":"First Column=False, Selected=True","width":150,"height":19,"outline":1,"node":"236:3668"},
      {"name":"First Column=True, Selected=False","width":150,"height":19,"outline":2,"node":"233:3774"},
      {"name":"First Column=True, Selected=True","width":150,"height":19,"outline":3,"node":"121:12611"}
     ],
     "uses": [
      "lists-and-tables-list-sort-order-indicator"
     ]
    },
    {
     "id": "lists-and-tables-list-disclosure-selected",
     "name": "_Disclosure - Selected",
     "page": "Lists and Tables",
     "section": "List",
     "helper": true,
     "variant_props": [
      {
       "name": "Expanded",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Expanded=False","width":5,"height":20,"outline":0,"node":"4356:9902"},
      {"name":"Expanded=True","width":5,"height":20,"outline":1,"node":"4356:9903"}
     ]
    },
    {
     "id": "lists-and-tables-list-disclosure-unselected",
     "name": "_Disclosure - Unselected",
     "page": "Lists and Tables",
     "section": "List",
     "helper": true,
     "variant_props": [
      {
       "name": "Expanded",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Expanded=False","width":5,"height":20,"outline":0,"node":"4356:9923"},
      {"name":"Expanded=True","width":5,"height":20,"outline":1,"node":"4356:9925"}
     ]
    },
    {
     "id": "lists-and-tables-list-bg",
     "name": "_BG",
     "page": "Lists and Tables",
     "section": "List",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Selected + Active",
        "Selected + Inactive",
        "Alternating Row Color"
       ]
      }
     ],
     "variants": [
      {"name":"State=Selected + Inactive","width":60,"height":20,"outline":0,"node":"4356:10152"},
      {"name":"State=Alternating Row Color","width":60,"height":20,"outline":1,"node":"4356:10153"},
      {"name":"State=Selected + Active","width":60,"height":20,"outline":2,"node":"4356:10150"}
     ]
    },
    {
     "id": "lists-and-tables-list-icon",
     "name": "_Icon",
     "page": "Lists and Tables",
     "section": "List",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Folder",
        "Thumbnail",
        "Custom"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Custom","width":18,"height":18,"outline":0,"node":"4356:10897"},
      {"name":"Type=Thumbnail","width":18,"height":18,"outline":1,"node":"4356:10688"},
      {"name":"Type=Folder","width":18,"height":18,"outline":2,"node":"4356:10685"}
     ]
    },
    {
     "id": "lists-and-tables-list-column-header",
     "name": "Column Header",
     "page": "Lists and Tables",
     "section": "List",
     "variants": [
      {"name":"","width":600,"height":28,"outline":0,"node":"4356:13469"}
     ],
     "uses": [
      "lists-and-tables-list-column-headers"
     ]
    },
    {
     "id": "lists-and-tables-list-sort-order-indicator",
     "name": "Sort Order Indicator",
     "page": "Lists and Tables",
     "section": "List",
     "variant_props": [
      {
       "name": "Order",
       "values": [
        "Descending",
        "Ascending"
       ]
      }
     ],
     "variants": [
      {"name":"Order=Descending","width":13,"height":19,"outline":0,"node":"4356:13717"},
      {"name":"Order=Ascending","width":13,"height":19,"outline":1,"node":"4356:13718"}
     ]
    },
    {
     "id": "lists-and-tables-list-table-rows",
     "name": "Table Rows",
     "page": "Lists and Tables",
     "section": "List",
     "variant_props": [
      {
       "name": "Level",
       "values": [
        "0",
        "1",
        "2",
        "3",
        "4"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Default",
        "Alternating Row Color",
        "Selected + Active",
        "Selected + Inactive"
       ]
      }
     ],
     "props": [
      {
       "name": "Primary",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Secondary 1",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Secondary 2",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Secondary 3",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Hierarchical",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Disclosure",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Level=0, Type=Selected + Active","width":600,"height":20,"outline":0,"node":"4356:11774"},
      {"name":"Level=1, Type=Selected + Active","width":600,"height":20,"outline":1,"node":"4356:12190"},
      {"name":"Level=2, Type=Selected + Active","width":600,"height":20,"outline":2,"node":"4356:12203"},
      {"name":"Level=3, Type=Selected + Active","width":600,"height":20,"outline":3,"node":"4356:12216"},
      {"name":"Level=4, Type=Selected + Active","width":600,"height":20,"outline":4,"node":"4356:12229"},
      {"name":"Level=0, Type=Selected + Inactive","width":600,"height":20,"outline":5,"node":"4356:11855"},
      {"name":"Level=1, Type=Selected + Inactive","width":600,"height":20,"outline":6,"node":"4356:12242"},
      {"name":"Level=2, Type=Selected + Inactive","width":600,"height":20,"outline":7,"node":"4356:12255"},
      {"name":"Level=3, Type=Selected + Inactive","width":600,"height":20,"outline":8,"node":"4356:12268"},
      {"name":"Level=4, Type=Selected + Inactive","width":600,"height":20,"outline":9,"node":"4356:12281"},
      {"name":"Level=0, Type=Alternating Row Color","width":600,"height":20,"outline":10,"node":"4356:11868"},
      {"name":"Level=1, Type=Alternating Row Color","width":600,"height":20,"outline":11,"node":"4356:12294"},
      {"name":"Level=2, Type=Alternating Row Color","width":600,"height":20,"outline":12,"node":"4356:12307"},
      {"name":"Level=3, Type=Alternating Row Color","width":600,"height":20,"outline":13,"node":"4356:12320"},
      {"name":"Level=4, Type=Alternating Row Color","width":600,"height":20,"outline":14,"node":"4356:12333"},
      {"name":"Level=0, Type=Default","width":600,"height":20,"outline":15,"node":"4356:11881"},
      {"name":"Level=1, Type=Default","width":600,"height":20,"outline":16,"node":"4356:12346"},
      {"name":"Level=2, Type=Default","width":600,"height":20,"outline":17,"node":"4356:12358"},
      {"name":"Level=3, Type=Default","width":600,"height":20,"outline":18,"node":"4356:12370"},
      {"name":"Level=4, Type=Default","width":600,"height":20,"outline":19,"node":"4356:12382"}
     ],
     "uses": [
      "lists-and-tables-list-bg",
      "lists-and-tables-list-disclosure-selected",
      "lists-and-tables-list-icon",
      "lists-and-tables-list-disclosure-unselected"
     ]
    },
    {
     "id": "lists-and-tables-list-outline-view",
     "name": "Outline View",
     "page": "Lists and Tables",
     "section": "List",
     "props": [
      {
       "name": "Rows",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":900,"height":450,"outline":0,"node":"4356:13263"}
     ],
     "uses": [
      "lists-and-tables-list-column-header",
      "lists-and-tables-list-table-rows",
      "lists-and-tables-list-group-title",
      "lists-and-tables-list-table-rows-blank"
     ]
    },
    {
     "id": "lists-and-tables-list-table-rows-blank",
     "name": "Table Rows - Blank",
     "page": "Lists and Tables",
     "section": "List",
     "variant_props": [
      {
       "name": "Alternating Row",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Alternating Row=True","width":600,"height":20,"outline":0,"node":"4356:12179"},
      {"name":"Alternating Row=False","width":600,"height":20,"outline":1,"node":"4356:12181"}
     ],
     "uses": [
      "lists-and-tables-list-bg"
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-wallpaper",
     "name": "Desktop Wallpaper",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "variant_props": [
      {
       "name": "Color Mode",
       "values": [
        "Light",
        "Dark"
       ]
      }
     ],
     "variants": [
      {"name":"Color Mode=Light","width":1512,"height":982,"outline":0,"node":"121:13314"},
      {"name":"Color Mode=Dark","width":1512,"height":982,"outline":0,"node":"4349:11784"}
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-item-dark",
     "name": "_Menu Bar/Menu Item / Dark",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "Menu Item",
       "type": "text",
       "default": "\"Item\""
      }
     ],
     "variants": [
      {"name":"Selected=True","width":47,"height":24,"outline":0,"node":"164:9703"},
      {"name":"Selected=False","width":47,"height":24,"outline":1,"node":"164:9705"}
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-item-light",
     "name": "_Menu Bar/Menu Item / Light",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "Menu Item",
       "type": "text",
       "default": "\"Item\""
      }
     ],
     "variants": [
      {"name":"Selected=True","width":47,"height":24,"outline":0,"node":"121:13188"},
      {"name":"Selected=False","width":47,"height":24,"outline":1,"node":"121:13190"}
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-app-name-dark",
     "name": "_Menu Bar/App Name / Dark",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "App Name",
       "type": "text",
       "default": "\"App Name\""
      }
     ],
     "variants": [
      {"name":"Selected=True","width":90,"height":24,"outline":0,"node":"164:9688"},
      {"name":"Selected=False","width":90,"height":24,"outline":1,"node":"164:9690"}
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-app-name-light",
     "name": "_Menu Bar/App Name / Light",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "App Name",
       "type": "text",
       "default": "\"App Name\""
      }
     ],
     "variants": [
      {"name":"Selected=True","width":90,"height":24,"outline":0,"node":"121:13179"},
      {"name":"Selected=False","width":90,"height":24,"outline":1,"node":"121:13181"}
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-apple-light",
     "name": "_Menu Bar/Apple Menu/Light",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Selected=True","width":33,"height":24,"outline":0,"node":"121:13170"},
      {"name":"Selected=False","width":33,"height":24,"outline":1,"node":"121:13172"}
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-apple-dark",
     "name": "_Menu Bar/Apple Menu/Dark",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Selected=True","width":33,"height":24,"outline":0,"node":"164:9669"},
      {"name":"Selected=False","width":33,"height":24,"outline":1,"node":"164:9671"}
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates",
     "name": "Menu Bar",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "variant_props": [
      {
       "name": "Color Mode",
       "values": [
        "Over Dark",
        "Over Light"
       ]
      }
     ],
     "props": [
      {
       "name": "Menu Items",
       "type": "slot"
      },
      {
       "name": "Time",
       "type": "text",
       "default": "\"9:41 AM\""
      },
      {
       "name": "Date",
       "type": "text",
       "default": "\"Wed Apr 1\""
      }
     ],
     "variants": [
      {"name":"Color Mode=Over Dark","width":1008,"height":45,"outline":0,"node":"121:13197"},
      {"name":"Color Mode=Over Light","width":1008,"height":45,"outline":1,"node":"121:13220"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-apple-dark",
      "menu-bar-and-dock-desktop-templates-app-name-dark",
      "menu-bar-and-dock-desktop-templates-item-dark",
      "menu-bar-and-dock-desktop-templates-apple-light",
      "menu-bar-and-dock-desktop-templates-app-name-light",
      "menu-bar-and-dock-desktop-templates-item-light"
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-system-app-icon",
     "name": "_System App Icon",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "helper": true,
     "variant_props": [
      {
       "name": "App Icon",
       "values": [
        "Apps",
        "Custom",
        "Folder",
        "Trash Empty",
        "Trash Full",
        "Apple TV",
        "App Store",
        "Contacts",
        "Books",
        "Calendar",
        "Calculator",
        "Home",
        "Finder",
        "Find My",
        "Final Cut Pro",
        "FaceTime",
        "Freeform",
        "Games",
        "iPhone Mirroring",
        "Keynote",
        "Mail",
        "Maps",
        "Messages",
        "Music",
        "News",
        "Notes",
        "Numbers",
        "Pages",
        "Passwords",
        "Phone",
        "Photo Booth",
        "Photos",
        "Podcasts",
        "Preview",
        "Quicktime Player",
        "Reminders",
        "Safari",
        "Shortcuts",
        "Siri",
        "Stocks",
        "Settings",
        "TextEdit",
        "Terminal",
        "Voice Memos",
        "Xcode",
        "Weather"
       ]
      }
     ],
     "variants": [
      {"name":"App Icon=Shortcuts","width":72,"height":72,"outline":0,"node":"495:3751"},
      {"name":"App Icon=Xcode","width":72,"height":72,"outline":1,"node":"495:3749"},
      {"name":"App Icon=Weather","width":72,"height":72,"outline":0,"node":"495:4349"},
      {"name":"App Icon=Voice Memos","width":72,"height":72,"outline":1,"node":"495:3747"},
      {"name":"App Icon=Voice Memos","width":72,"height":72,"outline":0,"node":"4462:10184"},
      {"name":"App Icon=Terminal","width":72,"height":72,"outline":1,"node":"495:3745"},
      {"name":"App Icon=TextEdit","width":72,"height":72,"outline":1,"node":"495:3743"},
      {"name":"App Icon=Settings","width":72,"height":72,"outline":0,"node":"495:3741"},
      {"name":"App Icon=Stocks","width":72,"height":72,"outline":0,"node":"495:3739"},
      {"name":"App Icon=Siri","width":72,"height":72,"outline":0,"node":"495:3737"},
      {"name":"App Icon=Safari","width":72,"height":72,"outline":0,"node":"495:3735"},
      {"name":"App Icon=Reminders","width":72,"height":72,"outline":0,"node":"495:3733"},
      {"name":"App Icon=Quicktime Player","width":72,"height":72,"outline":1,"node":"495:3731"},
      {"name":"App Icon=Preview","width":72,"height":72,"outline":0,"node":"495:3729"},
      {"name":"App Icon=Podcasts","width":72,"height":72,"outline":0,"node":"495:3727"},
      {"name":"App Icon=Photos","width":72,"height":72,"outline":0,"node":"495:3725"},
      {"name":"App Icon=Photo Booth","width":72,"height":72,"outline":1,"node":"495:3723"},
      {"name":"App Icon=Phone","width":72,"height":72,"outline":0,"node":"4321:1656"},
      {"name":"App Icon=Passwords","width":72,"height":72,"outline":0,"node":"4321:1652"},
      {"name":"App Icon=Pages","width":72,"height":72,"outline":1,"node":"495:3721"},
      {"name":"App Icon=Pages","width":72,"height":72,"outline":0,"node":"4462:10132"},
      {"name":"App Icon=Numbers","width":72,"height":72,"outline":0,"node":"495:3719"},
      {"name":"App Icon=Notes","width":72,"height":72,"outline":0,"node":"495:3717"},
      {"name":"App Icon=News","width":72,"height":72,"outline":0,"node":"495:3715"},
      {"name":"App Icon=Music","width":72,"height":72,"outline":0,"node":"495:3713"},
      {"name":"App Icon=iPhone Mirroring","width":72,"height":72,"outline":1,"node":"495:4359"},
      {"name":"App Icon=Games","width":72,"height":72,"outline":0,"node":"4322:1009"},
      {"name":"App Icon=Messages","width":72,"height":72,"outline":0,"node":"495:3711"},
      {"name":"App Icon=Maps","width":72,"height":72,"outline":0,"node":"495:3709"},
      {"name":"App Icon=Mail","width":72,"height":72,"outline":0,"node":"495:3707"},
      {"name":"App Icon=Keynote","width":72,"height":72,"outline":0,"node":"495:3705"},
      {"name":"App Icon=Freeform","width":72,"height":72,"outline":1,"node":"495:3701"},
      {"name":"App Icon=Freeform","width":72,"height":72,"outline":0,"node":"4462:10096"},
      {"name":"App Icon=Final Cut Pro","width":72,"height":72,"outline":1,"node":"495:3699"},
      {"name":"App Icon=Find My","width":72,"height":72,"outline":0,"node":"495:3697"},
      {"name":"App Icon=Finder","width":72,"height":72,"outline":1,"node":"495:3695"},
      {"name":"App Icon=FaceTime","width":72,"height":72,"outline":0,"node":"495:3693"},
      {"name":"App Icon=Home","width":72,"height":72,"outline":0,"node":"495:3687"},
      {"name":"App Icon=Calculator","width":72,"height":72,"outline":0,"node":"495:3685"},
      {"name":"App Icon=Calendar","width":72,"height":72,"outline":0,"node":"495:3683"},
      {"name":"App Icon=Books","width":72,"height":72,"outline":0,"node":"495:3681"},
      {"name":"App Icon=Contacts","width":72,"height":72,"outline":0,"node":"495:3679"},
      {"name":"App Icon=App Store","width":72,"height":72,"outline":0,"node":"495:3677"},
      {"name":"App Icon=Apple TV","width":72,"height":72,"outline":0,"node":"495:3675"},
      {"name":"App Icon=Custom","width":72,"height":72,"outline":1,"node":"495:3755"},
      {"name":"App Icon=Folder","width":72,"height":72,"outline":1,"node":"495:3671"},
      {"name":"App Icon=Trash Full","width":72,"height":72,"outline":1,"node":"495:3667"},
      {"name":"App Icon=Trash Empty","width":72,"height":72,"outline":1,"node":"495:3665"},
      {"name":"App Icon=Apps","width":72,"height":72,"outline":1,"node":"495:3663"}
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-template",
     "name": "Desktop Template",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "variant_props": [
      {
       "name": "Color Mode",
       "values": [
        "Dark",
        "Light"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Dock",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Color Mode=Dark","width":1512,"height":993,"outline":0,"node":"121:13244"},
      {"name":"Color Mode=Light","width":1512,"height":993,"outline":1,"node":"121:13277"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-wallpaper",
      "menu-bar-and-dock-desktop-templates-2",
      "menu-bar-and-dock-desktop-templates"
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-2",
     "name": "Dock",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "variants": [
      {"name":"","width":1152,"height":55,"outline":0,"node":"4355:8232"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-icon"
     ]
    },
    {
     "id": "menu-bar-and-dock-desktop-templates-icon",
     "name": "Dock Icon",
     "page": "Menu Bar and Dock",
     "section": "Desktop Templates",
     "props": [
      {
       "name": "Show Dot",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"","width":36,"height":47,"outline":0,"node":"121:13165"}
     ],
     "uses": [
      "menu-bar-and-dock-desktop-templates-system-app-icon"
     ]
    },
    {
     "id": "menus-menu-background",
     "name": "Menu Background",
     "page": "Menus",
     "variants": [
      {"name":"","width":120,"height":120,"outline":0,"node":"488:1821"}
     ]
    },
    {
     "id": "menus-headers",
     "name": "Headers",
     "page": "Menus",
     "variant_props": [
      {
       "name": "Inset",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Header",
       "type": "text",
       "default": "\"Header\""
      }
     ],
     "variants": [
      {"name":"Inset=False","width":100,"height":25,"outline":0,"node":"4355:2178"},
      {"name":"Inset=True","width":100,"height":25,"outline":1,"node":"483:8680"}
     ]
    },
    {
     "id": "menus-separators",
     "name": "Separators",
     "page": "Menus",
     "variants": [
      {"name":"","width":100,"height":11,"outline":0,"node":"121:12604"}
     ]
    },
    {
     "id": "menus-shortcuts",
     "name": "_Shortcuts",
     "page": "Menus",
     "helper": true,
     "variant_props": [
      {
       "name": "Hover + Key",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Control",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Option",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Shift",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Show Command",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Letter",
       "type": "text",
       "default": "\"A\""
      },
      {
       "name": "Show Fn",
       "type": "bool",
       "default": "off"
      }
     ],
     "variants": [
      {"name":"Hover + Key=True","width":25,"height":16,"outline":0,"node":"483:7608"},
      {"name":"Hover + Key=False","width":25,"height":16,"outline":1,"node":"121:12541"}
     ]
    },
    {
     "id": "menus-menu-items",
     "name": "Menu Items",
     "page": "Menus",
     "variant_props": [
      {
       "name": "Menu has Selection",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Hover + Key",
        "Hover",
        "Disabled"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Action",
        "Submenu"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Checkmark",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Shortcuts",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol doc.on.doc"
      },
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Preserve Symbol Space",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Disabled, Menu has Selection=True, Type=Submenu","width":160,"height":24,"outline":0,"node":"240:7945"},
      {"name":"State=Hover, Menu has Selection=True, Type=Submenu","width":160,"height":24,"outline":1,"node":"685:23691"},
      {"name":"State=Hover + Key, Menu has Selection=True, Type=Submenu","width":160,"height":24,"outline":2,"node":"240:7949"},
      {"name":"State=Idle, Menu has Selection=True, Type=Submenu","width":160,"height":24,"outline":3,"node":"240:7932"},
      {"name":"State=Disabled, Menu has Selection=False, Type=Submenu","width":160,"height":24,"outline":4,"node":"240:7878"},
      {"name":"State=Hover, Menu has Selection=False, Type=Submenu","width":160,"height":24,"outline":5,"node":"685:23678"},
      {"name":"State=Hover + Key, Menu has Selection=False, Type=Submenu","width":160,"height":24,"outline":6,"node":"240:7881"},
      {"name":"State=Idle, Menu has Selection=False, Type=Submenu","width":160,"height":24,"outline":7,"node":"240:7861"},
      {"name":"State=Disabled, Menu has Selection=True, Type=Action","width":160,"height":24,"outline":8,"node":"240:7908"},
      {"name":"State=Hover + Key, Menu has Selection=True, Type=Action","width":160,"height":24,"outline":9,"node":"240:7920"},
      {"name":"State=Hover, Menu has Selection=True, Type=Action","width":160,"height":24,"outline":10,"node":"4355:5837"},
      {"name":"State=Idle, Menu has Selection=True, Type=Action","width":160,"height":24,"outline":11,"node":"240:7893"},
      {"name":"State=Disabled, Menu has Selection=False, Type=Action","width":160,"height":24,"outline":12,"node":"240:7839"},
      {"name":"State=Hover + Key, Menu has Selection=False, Type=Action","width":160,"height":24,"outline":13,"node":"240:7850"},
      {"name":"State=Hover, Menu has Selection=False, Type=Action","width":160,"height":24,"outline":14,"node":"4355:5889"},
      {"name":"State=Idle, Menu has Selection=False, Type=Action","width":160,"height":24,"outline":15,"node":"121:12601"}
     ],
     "uses": [
      "menus-shortcuts"
     ]
    },
    {
     "id": "menus-menu",
     "name": "Menu",
     "page": "Menus",
     "props": [
      {
       "name": "Items",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":244,"height":284,"outline":0,"node":"483:8811"}
     ],
     "uses": [
      "menus-menu-background",
      "menus-menu-items",
      "menus-separators",
      "menus-headers"
     ]
    },
    {
     "id": "notifications-notification",
     "name": "Notification",
     "page": "Notifications",
     "variant_props": [
      {
       "name": "Stack",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Message",
       "type": "text",
       "default": "\"Message\""
      }
     ],
     "variants": [
      {"name":"Stack=True","width":344,"height":77,"outline":0,"node":"4358:11618"},
      {"name":"Stack=False","width":344,"height":77,"outline":1,"node":"4358:11430"}
     ],
     "uses": [
      "notifications-liquid-glass-notification-light",
      "menu-bar-and-dock-desktop-templates-system-app-icon"
     ]
    },
    {
     "id": "notifications-liquid-glass-notification-dark",
     "name": "Liquid Glass - Notification - Dark",
     "page": "Notifications",
     "variants": [
      {"name":"","width":100,"height":100,"outline":0,"node":"4358:11539"}
     ]
    },
    {
     "id": "notifications-liquid-glass-notification-light",
     "name": "Liquid Glass - Notification - Light",
     "page": "Notifications",
     "variants": [
      {"name":"","width":100,"height":100,"outline":0,"node":"4358:11549"}
     ]
    },
    {
     "id": "pointers",
     "name": "Pointers",
     "page": "Pointers",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Beachball",
        "Cross",
        "Default",
        "Default with Menu Badge",
        "Hand (Grabbing)",
        "Hand (Open)",
        "Hand (Pointing)",
        "Move",
        "Resize (Down)",
        "Resize (Left)",
        "Resize (Left-Right)",
        "Resize (Right)",
        "Resize (Up)",
        "Resize (Up-Down)",
        "Resize North-East South-West",
        "Resize North-South",
        "Resize North-West South-East",
        "Resize West-East",
        "Text Cursor",
        "Zoom In",
        "Zoom Out"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Resize North-South","width":28,"height":28,"outline":0,"node":"2302:7090"},
      {"name":"Type=Resize West-East","width":28,"height":28,"outline":1,"node":"2302:7092"},
      {"name":"Type=Resize North-East South-West","width":28,"height":28,"outline":2,"node":"2302:7088"},
      {"name":"Type=Resize North-West South-East","width":28,"height":28,"outline":3,"node":"2302:7091"},
      {"name":"Type=Resize (Up-Down)","width":28,"height":28,"outline":4,"node":"2302:7086"},
      {"name":"Type=Resize (Left-Right)","width":28,"height":28,"outline":5,"node":"2302:7079"},
      {"name":"Type=Resize (Up)","width":28,"height":28,"outline":6,"node":"2302:7087"},
      {"name":"Type=Resize (Right)","width":28,"height":28,"outline":7,"node":"2302:7085"},
      {"name":"Type=Resize (Down)","width":28,"height":28,"outline":8,"node":"2302:7083"},
      {"name":"Type=Resize (Left)","width":28,"height":28,"outline":9,"node":"2302:7084"},
      {"name":"Type=Move","width":28,"height":28,"outline":10,"node":"2302:7082"},
      {"name":"Type=Hand (Grabbing)","width":28,"height":28,"outline":11,"node":"2302:7078"},
      {"name":"Type=Hand (Open)","width":28,"height":28,"outline":12,"node":"2302:7080"},
      {"name":"Type=Hand (Pointing)","width":28,"height":28,"outline":13,"node":"2302:7081"},
      {"name":"Type=Zoom Out","width":28,"height":28,"outline":14,"node":"2302:7095"},
      {"name":"Type=Zoom In","width":28,"height":28,"outline":15,"node":"2302:7094"},
      {"name":"Type=Text Cursor","width":28,"height":28,"outline":16,"node":"2302:7093"},
      {"name":"Type=Cross","width":28,"height":28,"outline":17,"node":"2302:7075"},
      {"name":"Type=Beachball","width":28,"height":28,"outline":18,"node":"2302:7074"},
      {"name":"Type=Default with Menu Badge","width":28,"height":28,"outline":19,"node":"2302:7076"},
      {"name":"Type=Default","width":28,"height":28,"outline":20,"node":"2302:7077"}
     ]
    },
    {
     "id": "pop-up-and-pull-down-buttons-button",
     "name": "Pop-Up Button",
     "page": "Pop-up and Pull-down Buttons",
     "section": "Pop-Up Buttons and Pull-Down Buttons",
     "variant_props": [
      {
       "name": "Show Label",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"State=Disabled, Show Label=False","width":24,"height":24,"outline":0,"node":"4356:7761"},
      {"name":"State=Clicked, Show Label=False","width":24,"height":24,"outline":1,"node":"4356:7765"},
      {"name":"State=Idle, Show Label=False","width":24,"height":24,"outline":2,"node":"4356:7769"},
      {"name":"State=Disabled, Show Label=True","width":100,"height":24,"outline":3,"node":"218:4517"},
      {"name":"State=Clicked, Show Label=True","width":100,"height":24,"outline":4,"node":"483:5935"},
      {"name":"State=Idle, Show Label=True","width":100,"height":24,"outline":5,"node":"218:4483"}
     ],
     "uses": [
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "pop-up-and-pull-down-buttons-pulldown-button",
     "name": "Pulldown Button",
     "page": "Pop-up and Pull-down Buttons",
     "section": "Pop-Up Buttons and Pull-Down Buttons",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":100,"height":24,"outline":0,"node":"202:2948"},
      {"name":"State=Clicked","width":100,"height":24,"outline":1,"node":"483:5941"},
      {"name":"State=Idle","width":100,"height":24,"outline":2,"node":"202:2940"}
     ],
     "uses": [
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "popovers-popover",
     "name": "Popover",
     "page": "Popovers",
     "props": [
      {
       "name": "Content Area",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"","width":200,"height":200,"outline":0,"node":"4336:13199"}
     ],
     "uses": [
      "popovers-popover-2"
     ]
    },
    {
     "id": "popovers-popover-2",
     "name": "Popover",
     "page": "Popovers",
     "variant_props": [
      {
       "name": "Edge",
       "values": [
        "Top (Leading)",
        "Top (Center)",
        "Top (Trailing)",
        "Leading (Top)",
        "Leading (Middle)",
        "Leading (Bottom)",
        "Trailing (Top)",
        "Trailing (Middle)",
        "Trailing (Bottom)",
        "Bottom (Leading)",
        "Bottom (Center)",
        "Bottom (Trailing)"
       ]
      }
     ],
     "variants": [
      {"name":"Edge=Trailing (Bottom)","width":200,"height":200,"outline":0,"node":"121:11292"},
      {"name":"Edge=Trailing (Middle)","width":200,"height":200,"outline":0,"node":"121:11300"},
      {"name":"Edge=Trailing (Top)","width":200,"height":200,"outline":0,"node":"121:11308"},
      {"name":"Edge=Bottom (Trailing)","width":200,"height":200,"outline":1,"node":"121:11316"},
      {"name":"Edge=Bottom (Center)","width":200,"height":200,"outline":2,"node":"121:11324"},
      {"name":"Edge=Bottom (Leading)","width":200,"height":200,"outline":2,"node":"121:11332"},
      {"name":"Edge=Top (Trailing)","width":200,"height":200,"outline":3,"node":"121:11340"},
      {"name":"Edge=Top (Center)","width":200,"height":200,"outline":3,"node":"121:11348"},
      {"name":"Edge=Top (Leading)","width":200,"height":200,"outline":4,"node":"121:11356"},
      {"name":"Edge=Leading (Bottom)","width":200,"height":200,"outline":5,"node":"121:11364"},
      {"name":"Edge=Leading (Middle)","width":200,"height":200,"outline":5,"node":"121:11372"},
      {"name":"Edge=Leading (Top)","width":200,"height":200,"outline":6,"node":"121:11380"}
     ]
    },
    {
     "id": "progress-indicators-circular-indeterminate-spinner",
     "name": "Circular - Indeterminate (\"Spinner\")",
     "page": "Progress Indicators",
     "hig": "progress-indicators",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Small",
        "Large"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Small","width":16,"height":16,"outline":0,"node":"4349:11607"},
      {"name":"Size=Large","width":32,"height":32,"outline":1,"node":"4349:11627"}
     ]
    },
    {
     "id": "progress-indicators-circular-determinate",
     "name": "Circular - Determinate",
     "page": "Progress Indicators",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Progress",
       "values": [
        "0%",
        "25%",
        "50%",
        "75%",
        "100%"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Large",
        "Small"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Large, Active=False, Progress=100%","width":32,"height":32,"outline":0,"node":"4349:10998"},
      {"name":"Size=Small, Active=False, Progress=100%","width":16,"height":16,"outline":1,"node":"4349:11010"},
      {"name":"Size=Large, Active=False, Progress=75%","width":32,"height":32,"outline":0,"node":"4349:11022"},
      {"name":"Size=Small, Active=False, Progress=75%","width":16,"height":16,"outline":1,"node":"4349:11034"},
      {"name":"Size=Large, Active=False, Progress=50%","width":32,"height":32,"outline":0,"node":"4349:11046"},
      {"name":"Size=Small, Active=False, Progress=50%","width":16,"height":16,"outline":1,"node":"4349:11058"},
      {"name":"Size=Large, Active=False, Progress=25%","width":32,"height":32,"outline":0,"node":"4349:11070"},
      {"name":"Size=Small, Active=False, Progress=25%","width":16,"height":16,"outline":1,"node":"4349:11082"},
      {"name":"Size=Large, Active=False, Progress=0%","width":32,"height":32,"outline":0,"node":"4349:11094"},
      {"name":"Size=Small, Active=False, Progress=0%","width":16,"height":16,"outline":1,"node":"4349:11106"},
      {"name":"Size=Large, Active=True, Progress=100%","width":32,"height":32,"outline":2,"node":"4349:10505"},
      {"name":"Size=Small, Active=True, Progress=100%","width":16,"height":16,"outline":3,"node":"4349:10866"},
      {"name":"Size=Large, Active=True, Progress=75%","width":32,"height":32,"outline":2,"node":"4349:10493"},
      {"name":"Size=Small, Active=True, Progress=75%","width":16,"height":16,"outline":3,"node":"4349:10854"},
      {"name":"Size=Large, Active=True, Progress=50%","width":32,"height":32,"outline":2,"node":"4349:10481"},
      {"name":"Size=Small, Active=True, Progress=50%","width":16,"height":16,"outline":3,"node":"4349:10842"},
      {"name":"Size=Large, Active=True, Progress=25%","width":32,"height":32,"outline":2,"node":"4349:10451"},
      {"name":"Size=Small, Active=True, Progress=25%","width":16,"height":16,"outline":3,"node":"4349:10830"},
      {"name":"Size=Large, Active=True, Progress=0%","width":32,"height":32,"outline":2,"node":"4349:10430"},
      {"name":"Size=Small, Active=True, Progress=0%","width":16,"height":16,"outline":3,"node":"4349:10818"}
     ],
     "uses": [
      "kit-tracks-unfilled",
      "kit-tracks-filled"
     ]
    },
    {
     "id": "progress-indicators-linear-indeterminate",
     "name": "Linear - Indeterminate",
     "page": "Progress Indicators",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Small, Active=True","width":100,"height":6,"outline":0,"node":"488:443"},
      {"name":"Size=Small, Active=False","width":100,"height":6,"outline":1,"node":"4347:9841"},
      {"name":"Size=Medium, Active=True","width":100,"height":10,"outline":2,"node":"488:331"},
      {"name":"Size=Medium, Active=False","width":100,"height":10,"outline":3,"node":"4347:9845"}
     ],
     "uses": [
      "kit-tracks-unfilled",
      "kit-tracks-filled"
     ]
    },
    {
     "id": "progress-indicators-linear-determinate",
     "name": "Linear - Determinate",
     "page": "Progress Indicators",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Percentage",
       "values": [
        "0%",
        "25%",
        "50%",
        "75%",
        "100%"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Medium, Active=False, Percentage=0%","width":100,"height":10,"outline":0,"node":"4347:9803"},
      {"name":"Size=Medium, Active=False, Percentage=25%","width":100,"height":10,"outline":1,"node":"4347:9806"},
      {"name":"Size=Medium, Active=False, Percentage=50%","width":100,"height":10,"outline":2,"node":"4347:9809"},
      {"name":"Size=Medium, Active=False, Percentage=75%","width":100,"height":10,"outline":3,"node":"4347:9812"},
      {"name":"Size=Medium, Active=False, Percentage=100%","width":100,"height":10,"outline":4,"node":"4347:9815"},
      {"name":"Size=Small, Active=False, Percentage=0%","width":100,"height":6,"outline":5,"node":"4347:9818"},
      {"name":"Size=Small, Active=False, Percentage=25%","width":100,"height":6,"outline":6,"node":"4347:9821"},
      {"name":"Size=Small, Active=False, Percentage=50%","width":100,"height":6,"outline":7,"node":"4347:9824"},
      {"name":"Size=Small, Active=False, Percentage=75%","width":100,"height":6,"outline":8,"node":"4347:9827"},
      {"name":"Size=Small, Active=False, Percentage=100%","width":100,"height":6,"outline":9,"node":"4347:9830"},
      {"name":"Size=Medium, Active=True, Percentage=0%","width":100,"height":10,"outline":10,"node":"121:12209"},
      {"name":"Size=Medium, Active=True, Percentage=25%","width":100,"height":10,"outline":11,"node":"159:10661"},
      {"name":"Size=Medium, Active=True, Percentage=50%","width":100,"height":10,"outline":12,"node":"159:10673"},
      {"name":"Size=Medium, Active=True, Percentage=75%","width":100,"height":10,"outline":13,"node":"159:10720"},
      {"name":"Size=Medium, Active=True, Percentage=100%","width":100,"height":10,"outline":14,"node":"159:10724"},
      {"name":"Size=Small, Active=True, Percentage=0%","width":100,"height":6,"outline":15,"node":"159:10867"},
      {"name":"Size=Small, Active=True, Percentage=25%","width":100,"height":6,"outline":16,"node":"159:10873"},
      {"name":"Size=Small, Active=True, Percentage=50%","width":100,"height":6,"outline":17,"node":"159:10877"},
      {"name":"Size=Small, Active=True, Percentage=75%","width":100,"height":6,"outline":18,"node":"159:10881"},
      {"name":"Size=Small, Active=True, Percentage=100%","width":100,"height":6,"outline":19,"node":"159:10887"}
     ],
     "uses": [
      "kit-tracks-unfilled",
      "kit-tracks-filled"
     ]
    },
    {
     "id": "scrollbar-vertical",
     "name": "Scrollbar - Vertical",
     "page": "Scrollbar",
     "variant_props": [
      {
       "name": "Page Height",
       "values": [
        "x 2",
        "x 4",
        "x 8"
       ]
      },
      {
       "name": "Position",
       "values": [
        "Top",
        "Middle",
        "Bottom"
       ]
      }
     ],
     "variants": [
      {"name":"Page Height=x 8, Position=Bottom","width":12,"height":64,"outline":0,"node":"497:6518"},
      {"name":"Page Height=x 8, Position=Middle","width":12,"height":64,"outline":1,"node":"497:6506"},
      {"name":"Page Height=x 8, Position=Top","width":12,"height":64,"outline":2,"node":"497:6486"},
      {"name":"Page Height=x 4, Position=Bottom","width":12,"height":64,"outline":3,"node":"497:6520"},
      {"name":"Page Height=x 4, Position=Middle","width":12,"height":64,"outline":4,"node":"497:6508"},
      {"name":"Page Height=x 4, Position=Top","width":12,"height":64,"outline":5,"node":"497:6482"},
      {"name":"Page Height=x 2, Position=Bottom","width":12,"height":64,"outline":6,"node":"497:6522"},
      {"name":"Page Height=x 2, Position=Middle","width":12,"height":64,"outline":7,"node":"497:6510"},
      {"name":"Page Height=x 2, Position=Top","width":12,"height":64,"outline":8,"node":"497:6478"}
     ]
    },
    {
     "id": "scrollbar-horizontal",
     "name": "Scrollbar - Horizontal",
     "page": "Scrollbar",
     "variant_props": [
      {
       "name": "Page",
       "values": [
        "400%",
        "800%",
        "200%"
       ]
      },
      {
       "name": "Position",
       "values": [
        "Leading",
        "Center",
        "Trailing"
       ]
      }
     ],
     "variants": [
      {"name":"Page=800%, Position=Trailing","width":64,"height":12,"outline":0,"node":"497:6574"},
      {"name":"Page=400%, Position=Trailing","width":64,"height":12,"outline":1,"node":"497:6586"},
      {"name":"Page=200%, Position=Trailing","width":64,"height":12,"outline":2,"node":"497:6592"},
      {"name":"Page=800%, Position=Center","width":64,"height":12,"outline":3,"node":"497:6571"},
      {"name":"Page=400%, Position=Center","width":64,"height":12,"outline":4,"node":"497:6577"},
      {"name":"Page=200%, Position=Center","width":64,"height":12,"outline":5,"node":"497:6583"},
      {"name":"Page=800%, Position=Leading","width":64,"height":12,"outline":6,"node":"497:6568"},
      {"name":"Page=400%, Position=Leading","width":64,"height":12,"outline":7,"node":"497:6580"},
      {"name":"Page=200%, Position=Leading","width":64,"height":12,"outline":8,"node":"497:6589"}
     ]
    },
    {
     "id": "search-fields-field",
     "name": "Search Field",
     "page": "Search Fields",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Focused",
        "Disabled"
       ]
      },
      {
       "name": "Text",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "props": [
      {
       "name": "Value",
       "type": "text",
       "default": "\"Search\""
      }
     ],
     "variants": [
      {"name":"State=Disabled, Text=True","width":120,"height":24,"outline":0,"node":"480:761"},
      {"name":"State=Focused, Text=True","width":120,"height":24,"outline":1,"node":"480:764"},
      {"name":"State=Idle, Text=True","width":120,"height":24,"outline":2,"node":"480:769"},
      {"name":"Text=False, State=Disabled","width":120,"height":24,"outline":3,"node":"480:773"},
      {"name":"Text=False, State=Focused","width":120,"height":24,"outline":4,"node":"480:775"},
      {"name":"Text=False, State=Idle","width":120,"height":24,"outline":5,"node":"480:779"}
     ],
     "uses": [
      "text-fields-input",
      "search-fields-magnifying-glass",
      "search-fields-clear"
     ]
    },
    {
     "id": "search-fields-magnifying-glass",
     "name": "_Magnifying Glass",
     "page": "Search Fields",
     "helper": true,
     "variants": [
      {"name":"","width":16,"height":15,"outline":0,"node":"480:1029"}
     ]
    },
    {
     "id": "search-fields-clear",
     "name": "_Clear",
     "page": "Search Fields",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked"
       ]
      }
     ],
     "variants": [
      {"name":"State=Clicked","width":16,"height":15,"outline":0,"node":"480:1043"},
      {"name":"State=Idle","width":16,"height":15,"outline":0,"node":"480:1041"}
     ]
    },
    {
     "id": "sidebars-item",
     "name": "Item",
     "page": "Sidebars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Level",
       "values": [
        "0",
        "1",
        "2",
        "3",
        "4"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Large",
        "Medium",
        "Small"
       ]
      },
      {
       "name": "State",
       "values": [
        "Disabled",
        "Idle",
        "Selected"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Disclosure",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Detail",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Hierarchical",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Size=Large, Active=False, State=Disabled, Level=4","width":270,"height":36,"outline":0,"node":"4376:58611"},
      {"name":"Size=Large, Active=False, State=Selected, Level=4","width":270,"height":36,"outline":1,"node":"4376:58616"},
      {"name":"Size=Large, Active=False, State=Idle, Level=4","width":270,"height":36,"outline":2,"node":"4376:58622"},
      {"name":"Size=Medium, Active=False, State=Disabled, Level=4","width":270,"height":32,"outline":3,"node":"4376:58627"},
      {"name":"Size=Medium, Active=False, State=Selected, Level=4","width":270,"height":32,"outline":4,"node":"4376:58632"},
      {"name":"Size=Medium, Active=False, State=Idle, Level=4","width":270,"height":32,"outline":5,"node":"4376:58638"},
      {"name":"Size=Small, Active=False, State=Disabled, Level=4","width":270,"height":24,"outline":6,"node":"4376:58643"},
      {"name":"Size=Small, Active=False, State=Selected, Level=4","width":270,"height":24,"outline":7,"node":"4376:58648"},
      {"name":"Size=Small, Active=False, State=Idle, Level=4","width":270,"height":24,"outline":8,"node":"4376:58654"},
      {"name":"Size=Large, Active=False, State=Disabled, Level=3","width":270,"height":36,"outline":9,"node":"4376:58659"},
      {"name":"Size=Large, Active=False, State=Selected, Level=3","width":270,"height":36,"outline":10,"node":"4376:58664"},
      {"name":"Size=Large, Active=False, State=Idle, Level=3","width":270,"height":36,"outline":11,"node":"4376:58670"},
      {"name":"Size=Medium, Active=False, State=Disabled, Level=3","width":270,"height":32,"outline":12,"node":"4376:58675"},
      {"name":"Size=Medium, Active=False, State=Selected, Level=3","width":270,"height":32,"outline":13,"node":"4376:58680"},
      {"name":"Size=Medium, Active=False, State=Idle, Level=3","width":270,"height":32,"outline":14,"node":"4376:58686"},
      {"name":"Size=Small, Active=False, State=Disabled, Level=3","width":270,"height":24,"outline":15,"node":"4376:58691"},
      {"name":"Size=Small, Active=False, State=Selected, Level=3","width":270,"height":24,"outline":16,"node":"4376:58696"},
      {"name":"Size=Small, Active=False, State=Idle, Level=3","width":270,"height":24,"outline":17,"node":"4376:58702"},
      {"name":"Size=Large, Active=False, State=Disabled, Level=2","width":270,"height":36,"outline":18,"node":"4376:58707"},
      {"name":"Size=Large, Active=False, State=Selected, Level=2","width":270,"height":36,"outline":19,"node":"4376:58712"},
      {"name":"Size=Large, Active=False, State=Idle, Level=2","width":270,"height":36,"outline":20,"node":"4376:58718"},
      {"name":"Size=Medium, Active=False, State=Disabled, Level=2","width":270,"height":32,"outline":21,"node":"4376:58723"},
      {"name":"Size=Medium, Active=False, State=Selected, Level=2","width":270,"height":32,"outline":22,"node":"4376:58728"},
      {"name":"Size=Medium, Active=False, State=Idle, Level=2","width":270,"height":32,"outline":23,"node":"4376:58734"},
      {"name":"Size=Small, Active=False, State=Disabled, Level=2","width":270,"height":24,"outline":24,"node":"4376:58739"},
      {"name":"Size=Small, Active=False, State=Selected, Level=2","width":270,"height":24,"outline":25,"node":"4376:58744"},
      {"name":"Size=Small, Active=False, State=Idle, Level=2","width":270,"height":24,"outline":26,"node":"4376:58750"},
      {"name":"Size=Large, Active=False, State=Disabled, Level=1","width":270,"height":36,"outline":27,"node":"4376:58755"},
      {"name":"Size=Large, Active=False, State=Selected, Level=1","width":270,"height":36,"outline":28,"node":"4376:58760"},
      {"name":"Size=Large, Active=False, State=Idle, Level=1","width":270,"height":36,"outline":29,"node":"4376:58766"},
      {"name":"Size=Medium, Active=False, State=Disabled, Level=1","width":270,"height":32,"outline":30,"node":"4376:58771"},
      {"name":"Size=Medium, Active=False, State=Selected, Level=1","width":270,"height":32,"outline":31,"node":"4376:58776"},
      {"name":"Size=Medium, Active=False, State=Idle, Level=1","width":270,"height":32,"outline":32,"node":"4376:58782"},
      {"name":"Size=Small, Active=False, State=Disabled, Level=1","width":270,"height":24,"outline":33,"node":"4376:58787"},
      {"name":"Size=Small, Active=False, State=Selected, Level=1","width":270,"height":24,"outline":34,"node":"4376:58792"},
      {"name":"Size=Small, Active=False, State=Idle, Level=1","width":270,"height":24,"outline":35,"node":"4376:58798"},
      {"name":"Size=Large, Active=False, State=Disabled, Level=0","width":270,"height":36,"outline":36,"node":"4376:58803"},
      {"name":"Size=Large, Active=False, State=Selected, Level=0","width":270,"height":36,"outline":37,"node":"4376:58808"},
      {"name":"Size=Large, Active=False, State=Idle, Level=0","width":270,"height":36,"outline":38,"node":"4376:58814"},
      {"name":"Size=Medium, Active=False, State=Disabled, Level=0","width":270,"height":32,"outline":39,"node":"4376:58819"},
      {"name":"Size=Medium, Active=False, State=Selected, Level=0","width":270,"height":32,"outline":40,"node":"4376:58824"},
      {"name":"Size=Medium, Active=False, State=Idle, Level=0","width":270,"height":32,"outline":41,"node":"4376:58830"},
      {"name":"Size=Small, Active=False, State=Disabled, Level=0","width":270,"height":24,"outline":42,"node":"4376:58835"},
      {"name":"Size=Small, Active=False, State=Selected, Level=0","width":270,"height":24,"outline":43,"node":"4376:58840"},
      {"name":"Size=Small, Active=False, State=Idle, Level=0","width":270,"height":24,"outline":44,"node":"4376:58846"},
      {"name":"Size=Large, State=Disabled, Active=True, Level=4","width":270,"height":36,"outline":45,"node":"4358:4856"},
      {"name":"Size=Large, State=Selected, Active=True, Level=4","width":270,"height":36,"outline":46,"node":"4358:4860"},
      {"name":"Size=Large, State=Idle, Active=True, Level=4","width":270,"height":36,"outline":47,"node":"4358:4865"},
      {"name":"Size=Medium, State=Disabled, Active=True, Level=4","width":270,"height":32,"outline":48,"node":"4358:4869"},
      {"name":"Size=Medium, State=Selected, Active=True, Level=4","width":270,"height":32,"outline":49,"node":"4358:4873"},
      {"name":"Size=Medium, State=Idle, Active=True, Level=4","width":270,"height":32,"outline":50,"node":"4358:4878"},
      {"name":"Size=Small, State=Disabled, Active=True, Level=4","width":270,"height":24,"outline":51,"node":"4358:4882"},
      {"name":"Size=Small, State=Selected, Active=True, Level=4","width":270,"height":24,"outline":52,"node":"4358:4887"},
      {"name":"Size=Small, State=Idle, Active=True, Level=4","width":270,"height":24,"outline":53,"node":"4358:4893"},
      {"name":"Size=Large, State=Disabled, Active=True, Level=3","width":270,"height":36,"outline":54,"node":"4358:4700"},
      {"name":"Size=Large, State=Selected, Active=True, Level=3","width":270,"height":36,"outline":55,"node":"4358:4704"},
      {"name":"Size=Large, State=Idle, Active=True, Level=3","width":270,"height":36,"outline":56,"node":"4358:4709"},
      {"name":"Size=Medium, State=Disabled, Active=True, Level=3","width":270,"height":32,"outline":57,"node":"4358:4713"},
      {"name":"Size=Medium, State=Selected, Active=True, Level=3","width":270,"height":32,"outline":58,"node":"4358:4717"},
      {"name":"Size=Medium, State=Idle, Active=True, Level=3","width":270,"height":32,"outline":59,"node":"4358:4722"},
      {"name":"Size=Small, State=Disabled, Active=True, Level=3","width":270,"height":24,"outline":60,"node":"4358:4726"},
      {"name":"Size=Small, State=Selected, Active=True, Level=3","width":270,"height":24,"outline":61,"node":"4358:4731"},
      {"name":"Size=Small, State=Idle, Active=True, Level=3","width":270,"height":24,"outline":62,"node":"4358:4737"},
      {"name":"Size=Large, State=Disabled, Active=True, Level=2","width":270,"height":36,"outline":63,"node":"4358:4544"},
      {"name":"Size=Large, State=Selected, Active=True, Level=2","width":270,"height":36,"outline":64,"node":"4358:4548"},
      {"name":"Size=Large, State=Idle, Active=True, Level=2","width":270,"height":36,"outline":65,"node":"4358:4553"},
      {"name":"Size=Medium, State=Disabled, Active=True, Level=2","width":270,"height":32,"outline":66,"node":"4358:4557"},
      {"name":"Size=Medium, State=Selected, Active=True, Level=2","width":270,"height":32,"outline":67,"node":"4358:4561"},
      {"name":"Size=Medium, State=Idle, Active=True, Level=2","width":270,"height":32,"outline":68,"node":"4358:4566"},
      {"name":"Size=Small, State=Disabled, Active=True, Level=2","width":270,"height":24,"outline":69,"node":"4358:4570"},
      {"name":"Size=Small, State=Selected, Active=True, Level=2","width":270,"height":24,"outline":70,"node":"4358:4575"},
      {"name":"Size=Small, State=Idle, Active=True, Level=2","width":270,"height":24,"outline":71,"node":"4358:4581"},
      {"name":"Size=Large, State=Disabled, Active=True, Level=1","width":270,"height":36,"outline":72,"node":"4358:4432"},
      {"name":"Size=Large, State=Selected, Active=True, Level=1","width":270,"height":36,"outline":73,"node":"4358:4436"},
      {"name":"Size=Large, State=Idle, Active=True, Level=1","width":270,"height":36,"outline":74,"node":"4358:4441"},
      {"name":"Size=Medium, State=Disabled, Active=True, Level=1","width":270,"height":32,"outline":75,"node":"4358:4351"},
      {"name":"Size=Medium, State=Selected, Active=True, Level=1","width":270,"height":32,"outline":76,"node":"4358:4355"},
      {"name":"Size=Medium, State=Idle, Active=True, Level=1","width":270,"height":32,"outline":77,"node":"4358:4360"},
      {"name":"Size=Small, State=Disabled, Active=True, Level=1","width":270,"height":24,"outline":78,"node":"4358:4364"},
      {"name":"Size=Small, State=Selected, Active=True, Level=1","width":270,"height":24,"outline":79,"node":"4358:4369"},
      {"name":"Size=Small, State=Idle, Active=True, Level=1","width":270,"height":24,"outline":80,"node":"4358:4375"},
      {"name":"Size=Large, State=Disabled, Active=True, Level=0","width":270,"height":36,"outline":81,"node":"656:3189"},
      {"name":"Size=Large, State=Selected, Active=True, Level=0","width":270,"height":36,"outline":82,"node":"656:3224"},
      {"name":"Size=Large, State=Idle, Active=True, Level=0","width":270,"height":36,"outline":83,"node":"656:3259"},
      {"name":"Size=Medium, State=Disabled, Active=True, Level=0","width":270,"height":32,"outline":84,"node":"656:2709"},
      {"name":"Size=Medium, State=Selected, Active=True, Level=0","width":270,"height":32,"outline":85,"node":"656:2744"},
      {"name":"Size=Medium, State=Idle, Active=True, Level=0","width":270,"height":32,"outline":86,"node":"656:2779"},
      {"name":"Size=Small, State=Disabled, Active=True, Level=0","width":270,"height":24,"outline":87,"node":"655:2339"},
      {"name":"Size=Small, State=Selected, Active=True, Level=0","width":270,"height":24,"outline":88,"node":"655:2379"},
      {"name":"Size=Small, State=Idle, Active=True, Level=0","width":270,"height":24,"outline":89,"node":"655:2419"}
     ],
     "uses": [
      "sidebars-disclosure-folder",
      "sidebars-leading",
      "sidebars-detail",
      "sidebars-selection"
     ]
    },
    {
     "id": "sidebars-disclosure-header",
     "name": "_Disclosure - Header",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "Expanded",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Expanded=False","width":24,"height":14,"outline":0,"node":"656:2234"},
      {"name":"Expanded=True","width":24,"height":14,"outline":1,"node":"656:2232"}
     ]
    },
    {
     "id": "sidebars-section-header",
     "name": "Section Header",
     "page": "Sidebars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "First Section",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium",
        "Large"
       ]
      }
     ],
     "props": [
      {
       "name": "Section Title",
       "type": "text",
       "default": "\"Section Title\""
      },
      {
       "name": "Show Disclosure",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Detail",
       "type": "text",
       "default": "\"Detail\""
      },
      {
       "name": "Show Detail",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Hierarchical",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Size=Large, First Section=True, Active=True","width":210,"height":25,"outline":0,"node":"654:1806"},
      {"name":"Size=Large, Active=False, First Section=True","width":210,"height":25,"outline":1,"node":"4377:59285"},
      {"name":"Size=Large, Active=True, First Section=False","width":210,"height":43,"outline":2,"node":"4365:36704"},
      {"name":"Size=Large, Active=False, First Section=False","width":210,"height":43,"outline":3,"node":"4377:59290"},
      {"name":"Size=Medium, First Section=True, Active=True","width":210,"height":22,"outline":4,"node":"654:1794"},
      {"name":"Size=Medium, Active=False, First Section=True","width":210,"height":22,"outline":5,"node":"4377:59295"},
      {"name":"Size=Medium, Active=True, First Section=False","width":210,"height":39,"outline":6,"node":"4365:36709"},
      {"name":"Size=Medium, Active=False, First Section=False","width":210,"height":39,"outline":7,"node":"4377:59300"},
      {"name":"Size=Small, First Section=True, Active=True","width":210,"height":19,"outline":8,"node":"97:8754"},
      {"name":"Size=Small, Active=False, First Section=True","width":210,"height":19,"outline":9,"node":"4377:59305"},
      {"name":"Size=Small, Active=True, First Section=False","width":210,"height":34,"outline":10,"node":"4365:36714"},
      {"name":"Size=Small, Active=False, First Section=False","width":210,"height":34,"outline":11,"node":"4377:59310"}
     ],
     "uses": [
      "sidebars-disclosure-header"
     ]
    },
    {
     "id": "sidebars-composed",
     "name": "Sidebars - Composed",
     "page": "Sidebars",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium",
        "Large"
       ]
      }
     ],
     "props": [
      {
       "name": "Items",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Size=Large","width":240,"height":560,"outline":0,"node":"657:3895"},
      {"name":"Size=Medium","width":240,"height":560,"outline":1,"node":"656:3560"},
      {"name":"Size=Small","width":240,"height":560,"outline":2,"node":"571:9795"}
     ],
     "uses": [
      "sidebars-window-controls",
      "sidebars-item",
      "sidebars-section-header"
     ]
    },
    {
     "id": "sidebars-disclosure-folder",
     "name": "_Disclosure - Folder",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "Expanded",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Expanded=False","width":12,"height":24,"outline":0,"node":"121:11478"},
      {"name":"Expanded=True","width":12,"height":24,"outline":1,"node":"121:11476"}
     ]
    },
    {
     "id": "sidebars-detail",
     "name": "_Detail",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Enabled",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Medium",
        "Small",
        "Large"
       ]
      }
     ],
     "props": [
      {
       "name": "Detail",
       "type": "text",
       "default": "\"Detail\""
      }
     ],
     "variants": [
      {"name":"Size=Large, Active=True, Enabled=True","width":42,"height":20,"outline":0,"node":"4358:2552"},
      {"name":"Size=Large, Active=False, Enabled=True","width":42,"height":20,"outline":1,"node":"4377:59811"},
      {"name":"Size=Large, Active=True, Enabled=False","width":42,"height":20,"outline":0,"node":"4358:2556"},
      {"name":"Size=Large, Active=False, Enabled=False","width":42,"height":20,"outline":1,"node":"4377:59815"},
      {"name":"Size=Medium, Active=True, Enabled=True","width":37,"height":16,"outline":2,"node":"4358:2542"},
      {"name":"Size=Medium, Active=False, Enabled=True","width":37,"height":16,"outline":3,"node":"4377:59819"},
      {"name":"Size=Medium, Active=True, Enabled=False","width":37,"height":16,"outline":2,"node":"4358:2546"},
      {"name":"Size=Medium, Active=False, Enabled=False","width":37,"height":16,"outline":3,"node":"4377:59823"},
      {"name":"Size=Small, Active=True, Enabled=True","width":31,"height":14,"outline":4,"node":"4356:15071"},
      {"name":"Size=Small, Active=False, Enabled=True","width":31,"height":14,"outline":5,"node":"4377:59827"},
      {"name":"Size=Small, Active=True, Enabled=False","width":31,"height":14,"outline":4,"node":"4356:15073"},
      {"name":"Size=Small, Active=False, Enabled=False","width":31,"height":14,"outline":5,"node":"4377:59831"}
     ]
    },
    {
     "id": "sidebars-selection",
     "name": "_Selection",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Active=True","width":100,"height":24,"outline":0,"node":"4356:15306"},
      {"name":"Active=False","width":100,"height":24,"outline":1,"node":"4377:59883"}
     ]
    },
    {
     "id": "sidebars-leading",
     "name": "_Leading",
     "page": "Sidebars",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Enabled",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Icon",
       "values": [
        "Symbol",
        "Image"
       ]
      },
      {
       "name": "Level",
       "values": [
        "0",
        "1-4"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Small",
        "Medium",
        "Large"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol folder"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Size=Large, Icon=Image, Enabled=False, Level=0, Active=False","width":80,"height":20,"outline":0,"node":"4377:59571"},
      {"name":"Size=Large, Icon=Image, Enabled=False, Level=1-4, Active=False","width":80,"height":20,"outline":1,"node":"4377:59575"},
      {"name":"Size=Medium, Icon=Image, Enabled=False, Level=0, Active=False","width":80,"height":16,"outline":2,"node":"4377:59579"},
      {"name":"Size=Medium, Icon=Image, Enabled=False, Level=1-4, Active=False","width":80,"height":16,"outline":3,"node":"4377:59583"},
      {"name":"Size=Small, Icon=Image, Enabled=False, Level=0, Active=False","width":80,"height":16,"outline":4,"node":"4377:59587"},
      {"name":"Size=Small, Icon=Image, Enabled=False, Level=1-4, Active=False","width":80,"height":16,"outline":5,"node":"4377:59591"},
      {"name":"Size=Large, Icon=Symbol, Enabled=False, Level=0, Active=False","width":80,"height":20,"outline":6,"node":"4377:59595"},
      {"name":"Size=Large, Icon=Symbol, Enabled=False, Level=1-4, Active=False","width":80,"height":20,"outline":6,"node":"4377:59598"},
      {"name":"Size=Medium, Icon=Symbol, Enabled=False, Level=0, Active=False","width":80,"height":16,"outline":7,"node":"4377:59601"},
      {"name":"Size=Medium, Icon=Symbol, Enabled=False, Level=1-4, Active=False","width":80,"height":16,"outline":7,"node":"4377:59604"},
      {"name":"Size=Small, Icon=Symbol, Enabled=False, Level=0, Active=False","width":80,"height":16,"outline":8,"node":"4377:59607"},
      {"name":"Size=Small, Icon=Symbol, Enabled=False, Level=1-4, Active=False","width":80,"height":16,"outline":8,"node":"4377:59610"},
      {"name":"Size=Large, Icon=Image, Enabled=True, Level=0, Active=False","width":80,"height":20,"outline":0,"node":"4377:59655"},
      {"name":"Size=Large, Icon=Image, Enabled=True, Level=1-4, Active=False","width":80,"height":20,"outline":1,"node":"4377:59659"},
      {"name":"Size=Medium, Icon=Image, Enabled=True, Level=0, Active=False","width":80,"height":16,"outline":2,"node":"4377:59663"},
      {"name":"Size=Medium, Icon=Image, Enabled=True, Level=1-4, Active=False","width":80,"height":16,"outline":3,"node":"4377:59667"},
      {"name":"Size=Small, Icon=Image, Enabled=True, Level=0, Active=False","width":80,"height":16,"outline":4,"node":"4377:59671"},
      {"name":"Size=Small, Icon=Image, Enabled=True, Level=1-4, Active=False","width":80,"height":16,"outline":5,"node":"4377:59675"},
      {"name":"Size=Large, Icon=Symbol, Enabled=True, Level=0, Active=False","width":80,"height":20,"outline":9,"node":"4377:59679"},
      {"name":"Size=Large, Icon=Symbol, Enabled=True, Level=1-4, Active=False","width":80,"height":20,"outline":9,"node":"4377:59682"},
      {"name":"Size=Medium, Icon=Symbol, Enabled=True, Level=0, Active=False","width":80,"height":16,"outline":10,"node":"4377:59685"},
      {"name":"Size=Medium, Icon=Symbol, Enabled=True, Level=1-4, Active=False","width":80,"height":16,"outline":10,"node":"4377:59688"},
      {"name":"Size=Small, Icon=Symbol, Enabled=True, Level=0, Active=False","width":80,"height":16,"outline":11,"node":"4377:59691"},
      {"name":"Size=Small, Icon=Symbol, Enabled=True, Level=1-4, Active=False","width":80,"height":16,"outline":11,"node":"4377:59694"},
      {"name":"Size=Large, Active=True, Icon=Image, Enabled=False, Level=0","width":80,"height":20,"outline":12,"node":"4358:2495"},
      {"name":"Size=Large, Active=True, Icon=Image, Enabled=False, Level=1-4","width":80,"height":20,"outline":13,"node":"4364:20138"},
      {"name":"Size=Medium, Active=True, Icon=Image, Enabled=False, Level=0","width":80,"height":16,"outline":14,"node":"4358:2498"},
      {"name":"Size=Medium, Active=True, Icon=Image, Enabled=False, Level=1-4","width":80,"height":16,"outline":15,"node":"4364:20142"},
      {"name":"Size=Small, Active=True, Icon=Image, Enabled=False, Level=0","width":80,"height":16,"outline":16,"node":"4358:2501"},
      {"name":"Size=Small, Active=True, Icon=Image, Enabled=False, Level=1-4","width":80,"height":16,"outline":17,"node":"4364:20146"},
      {"name":"Size=Large, Active=True, Icon=Symbol, Enabled=False, Level=0","width":80,"height":20,"outline":18,"node":"4358:2504"},
      {"name":"Size=Large, Active=True, Icon=Symbol, Enabled=False, Level=1-4","width":80,"height":20,"outline":18,"node":"4364:20150"},
      {"name":"Size=Medium, Active=True, Icon=Symbol, Enabled=False, Level=0","width":80,"height":16,"outline":19,"node":"4358:2508"},
      {"name":"Size=Medium, Active=True, Icon=Symbol, Enabled=False, Level=1-4","width":80,"height":16,"outline":19,"node":"4364:20153"},
      {"name":"Size=Small, Active=True, Icon=Symbol, Enabled=False, Level=0","width":80,"height":16,"outline":20,"node":"4358:2512"},
      {"name":"Size=Small, Active=True, Icon=Symbol, Enabled=False, Level=1-4","width":80,"height":16,"outline":20,"node":"4364:20156"},
      {"name":"Size=Large, Active=True, Icon=Image, Enabled=True, Level=0","width":80,"height":20,"outline":21,"node":"4358:1919"},
      {"name":"Size=Large, Active=True, Icon=Image, Enabled=True, Level=1-4","width":80,"height":20,"outline":22,"node":"4364:20180"},
      {"name":"Size=Medium, Active=True, Icon=Image, Enabled=True, Level=0","width":80,"height":16,"outline":23,"node":"4358:1918"},
      {"name":"Size=Medium, Active=True, Icon=Image, Enabled=True, Level=1-4","width":80,"height":16,"outline":24,"node":"4364:20184"},
      {"name":"Size=Small, Active=True, Icon=Image, Enabled=True, Level=0","width":80,"height":16,"outline":25,"node":"4358:1917"},
      {"name":"Size=Small, Active=True, Icon=Image, Enabled=True, Level=1-4","width":80,"height":16,"outline":26,"node":"4364:20188"},
      {"name":"Size=Large, Active=True, Icon=Symbol, Enabled=True, Level=0","width":80,"height":20,"outline":27,"node":"4358:1998"},
      {"name":"Size=Large, Active=True, Icon=Symbol, Enabled=True, Level=1-4","width":80,"height":20,"outline":27,"node":"4364:20192"},
      {"name":"Size=Medium, Active=True, Icon=Symbol, Enabled=True, Level=0","width":80,"height":16,"outline":28,"node":"4358:2002"},
      {"name":"Size=Medium, Active=True, Icon=Symbol, Enabled=True, Level=1-4","width":80,"height":16,"outline":28,"node":"4364:20195"},
      {"name":"Size=Small, Active=True, Icon=Symbol, Enabled=True, Level=0","width":80,"height":16,"outline":29,"node":"4358:2006"},
      {"name":"Size=Small, Active=True, Icon=Symbol, Enabled=True, Level=1-4","width":80,"height":16,"outline":29,"node":"4364:20198"}
     ]
    },
    {
     "id": "sidebars-window-controls",
     "name": "Window Controls",
     "page": "Sidebars",
     "variant_props": [
      {
       "name": "Toolbar Style",
       "values": [
        "Default",
        "Compact"
       ]
      }
     ],
     "variants": [
      {"name":"Toolbar Style=Compact","width":200,"height":52,"outline":0,"node":"4358:9902"},
      {"name":"Toolbar Style=Default","width":200,"height":52,"outline":1,"node":"4358:9373"}
     ],
     "uses": [
      "windows-window-controls-standard",
      "toolbars-button"
     ]
    },
    {
     "id": "sidebars-bg",
     "name": "BG",
     "page": "Sidebars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Active=True","width":100,"height":100,"outline":0,"node":"4361:22112"},
      {"name":"Active=False","width":100,"height":100,"outline":1,"node":"4361:22111"}
     ]
    },
    {
     "id": "segmented-controls-separator",
     "name": "_Separator",
     "page": "Segmented Controls",
     "helper": true,
     "variant_props": [
      {
       "name": "Show",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Show=False","width":1,"height":14,"outline":0,"node":"4346:9186"},
      {"name":"Show=True","width":1,"height":14,"outline":1,"node":"4346:9184"}
     ]
    },
    {
     "id": "segmented-controls-segment-not-selectable",
     "name": "_Segment - Not selectable",
     "page": "Segmented Controls",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Disabled",
        "Clicked"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Active=False, State=Disabled","width":56,"height":20,"outline":0,"node":"4346:9805"},
      {"name":"Active=False, State=Clicked","width":56,"height":20,"outline":1,"node":"4346:9807"},
      {"name":"Active=False, State=Idle","width":56,"height":20,"outline":2,"node":"4346:9810"},
      {"name":"Active=True, State=Disabled","width":56,"height":20,"outline":0,"node":"4346:9812"},
      {"name":"Active=True, State=Clicked","width":56,"height":20,"outline":1,"node":"4346:9814"},
      {"name":"Active=True, State=Idle","width":56,"height":20,"outline":2,"node":"4346:9817"}
     ],
     "uses": [
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "segmented-controls-segment-selectable",
     "name": "_Segment - Selectable",
     "page": "Segmented Controls",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Selected",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Disabled",
        "Clicked"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Active=False, State=Disabled, Selected=False","width":56,"height":20,"outline":0,"node":"498:11551"},
      {"name":"Active=False, State=Clicked, Selected=False","width":56,"height":20,"outline":1,"node":"498:11553"},
      {"name":"Active=False, State=Idle, Selected=False","width":56,"height":20,"outline":2,"node":"498:11549"},
      {"name":"Active=True, State=Disabled, Selected=False","width":56,"height":20,"outline":0,"node":"498:4504"},
      {"name":"Active=True, State=Clicked, Selected=False","width":56,"height":20,"outline":1,"node":"498:4506"},
      {"name":"Active=True, State=Idle, Selected=False","width":56,"height":20,"outline":2,"node":"498:4496"},
      {"name":"Active=False, State=Disabled, Selected=True","width":56,"height":20,"outline":3,"node":"498:11556"},
      {"name":"Active=False, State=Clicked, Selected=True","width":56,"height":20,"outline":4,"node":"498:11559"},
      {"name":"Active=False, State=Idle, Selected=True","width":56,"height":20,"outline":5,"node":"498:11562"},
      {"name":"Active=True, State=Disabled, Selected=True","width":56,"height":20,"outline":6,"node":"498:4498"},
      {"name":"Active=True, State=Clicked, Selected=True","width":56,"height":20,"outline":7,"node":"498:4494"},
      {"name":"Active=True, State=Idle, Selected=True","width":56,"height":20,"outline":8,"node":"498:4492"}
     ],
     "uses": [
      "kit-control-bg-bordered",
      "kit-control-bg-controls",
      "kit-segmented-control"
     ]
    },
    {
     "id": "segmented-controls-control",
     "name": "Segmented Control",
     "page": "Segmented Controls",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Selectable",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Frame",
       "type": "slot",
       "note": "Hide the separator lines on either side of a selected segment."
      }
     ],
     "variants": [
      {"name":"Active=False, Selectable=False","width":267,"height":24,"outline":0,"node":"498:5499"},
      {"name":"Active=True, Selectable=False","width":267,"height":24,"outline":0,"node":"4346:9407"},
      {"name":"Active=False, Selectable=True","width":267,"height":24,"outline":1,"node":"4346:9426"},
      {"name":"Active=True, Selectable=True","width":267,"height":24,"outline":2,"node":"4346:9464"}
     ],
     "uses": [
      "kit-control-bg-bordered",
      "segmented-controls-segment-not-selectable",
      "segmented-controls-separator",
      "segmented-controls-segment-selectable"
     ]
    },
    {
     "id": "sheets-sheet",
     "name": "Sheet",
     "page": "Sheets",
     "variants": [
      {"name":"","width":300,"height":300,"outline":0,"node":"121:11423"}
     ]
    },
    {
     "id": "sliders-and-dials-slider",
     "name": "Slider",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Center-biased",
       "values": [
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      },
      {
       "name": "Ticks",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Value",
       "values": [
        "0%",
        "25%",
        "50%",
        "100%",
        "75%"
       ]
      }
     ],
     "variants": [
      {"name":"Active=True, State=Disabled, Ticks=False, Value=100%, Center-biased=False","width":100,"height":24,"outline":0,"node":"531:11720"},
      {"name":"Active=True, State=Disabled, Ticks=False, Value=75%, Center-biased=False","width":100,"height":24,"outline":1,"node":"531:11735"},
      {"name":"Active=True, State=Disabled, Ticks=False, Value=50%, Center-biased=False","width":100,"height":24,"outline":2,"node":"531:11745"},
      {"name":"Active=True, State=Disabled, Ticks=False, Value=25%, Center-biased=False","width":100,"height":24,"outline":3,"node":"531:11760"},
      {"name":"Active=True, State=Disabled, Ticks=False, Value=0%, Center-biased=False","width":100,"height":24,"outline":4,"node":"531:11770"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=100%, Center-biased=False","width":100,"height":24,"outline":5,"node":"531:11120"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=75%, Center-biased=False","width":100,"height":24,"outline":6,"node":"531:11135"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=50%, Center-biased=False","width":100,"height":24,"outline":7,"node":"531:11145"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=25%, Center-biased=False","width":100,"height":24,"outline":8,"node":"531:11160"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=0%, Center-biased=False","width":100,"height":24,"outline":9,"node":"531:11170"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=100%, Center-biased=False","width":100,"height":24,"outline":10,"node":"512:3649"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=75%, Center-biased=False","width":100,"height":24,"outline":11,"node":"512:3399"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=50%, Center-biased=False","width":100,"height":24,"outline":12,"node":"512:3367"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=25%, Center-biased=False","width":100,"height":24,"outline":13,"node":"512:3257"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=0%, Center-biased=False","width":100,"height":24,"outline":14,"node":"512:256"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=100%, Center-biased=False","width":100,"height":24,"outline":15,"node":"532:14412"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=75%, Center-biased=False","width":100,"height":24,"outline":16,"node":"532:14427"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=50%, Center-biased=False","width":100,"height":24,"outline":17,"node":"532:14437"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=25%, Center-biased=False","width":100,"height":24,"outline":18,"node":"532:14452"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=0%, Center-biased=False","width":100,"height":24,"outline":19,"node":"532:14462"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=100%, Center-biased=False","width":100,"height":24,"outline":20,"node":"532:14465"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=75%, Center-biased=False","width":100,"height":24,"outline":21,"node":"532:14480"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=50%, Center-biased=False","width":100,"height":24,"outline":22,"node":"532:14490"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=25%, Center-biased=False","width":100,"height":24,"outline":23,"node":"532:14505"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=0%, Center-biased=False","width":100,"height":24,"outline":24,"node":"532:14515"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=100%, Center-biased=False","width":100,"height":24,"outline":25,"node":"532:14518"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=75%, Center-biased=False","width":100,"height":24,"outline":26,"node":"532:14533"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=50%, Center-biased=False","width":100,"height":24,"outline":27,"node":"532:14543"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=25%, Center-biased=False","width":100,"height":24,"outline":28,"node":"532:14558"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=0%, Center-biased=False","width":100,"height":24,"outline":29,"node":"532:14568"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=100%, Center-biased=False","width":100,"height":24,"outline":30,"node":"533:13462"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=75%, Center-biased=False","width":100,"height":24,"outline":31,"node":"533:13477"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=50%, Center-biased=False","width":100,"height":24,"outline":32,"node":"533:13487"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=25%, Center-biased=False","width":100,"height":24,"outline":33,"node":"533:13497"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=0%, Center-biased=False","width":100,"height":24,"outline":4,"node":"533:13512"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=100%, Center-biased=False","width":100,"height":24,"outline":34,"node":"533:13515"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=75%, Center-biased=False","width":100,"height":24,"outline":35,"node":"533:13530"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=50%, Center-biased=False","width":100,"height":24,"outline":36,"node":"533:13540"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=25%, Center-biased=False","width":100,"height":24,"outline":37,"node":"533:13550"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=0%, Center-biased=False","width":100,"height":24,"outline":9,"node":"533:13565"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=100%, Center-biased=False","width":100,"height":24,"outline":38,"node":"533:13568"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=75%, Center-biased=False","width":100,"height":24,"outline":39,"node":"533:13583"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=50%, Center-biased=False","width":100,"height":24,"outline":40,"node":"533:13593"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=25%, Center-biased=False","width":100,"height":24,"outline":41,"node":"533:13603"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=0%, Center-biased=False","width":100,"height":24,"outline":14,"node":"533:13618"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=100%, Center-biased=False","width":100,"height":24,"outline":42,"node":"533:13621"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=75%, Center-biased=False","width":100,"height":24,"outline":43,"node":"533:13636"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=50%, Center-biased=False","width":100,"height":24,"outline":44,"node":"533:13646"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=25%, Center-biased=False","width":100,"height":24,"outline":45,"node":"533:13656"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=0%, Center-biased=False","width":100,"height":24,"outline":19,"node":"533:13671"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=100%, Center-biased=False","width":100,"height":24,"outline":46,"node":"533:13674"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=75%, Center-biased=False","width":100,"height":24,"outline":47,"node":"533:13689"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=50%, Center-biased=False","width":100,"height":24,"outline":48,"node":"533:13699"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=25%, Center-biased=False","width":100,"height":24,"outline":49,"node":"533:13709"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=0%, Center-biased=False","width":100,"height":24,"outline":24,"node":"533:13724"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=75%, Center-biased=False","width":100,"height":24,"outline":50,"node":"533:13742"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=100%, Center-biased=False","width":100,"height":24,"outline":51,"node":"533:13727"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=50%, Center-biased=False","width":100,"height":24,"outline":52,"node":"533:13752"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=25%, Center-biased=False","width":100,"height":24,"outline":53,"node":"533:13762"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=0%, Center-biased=False","width":100,"height":24,"outline":29,"node":"533:13777"}
     ],
     "uses": [
      "sliders-and-dials-track-unfilled",
      "sliders-and-dials-track-filled",
      "sliders-and-dials-knob"
     ]
    },
    {
     "id": "sliders-and-dials-track-filled",
     "name": "_Track Filled",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Disabled",
        "Clicked",
        "Idle"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, State=Disabled","width":50,"height":6,"outline":0,"node":"533:15650"},
      {"name":"Active=False, State=Clicked","width":50,"height":6,"outline":1,"node":"533:15656"},
      {"name":"Active=False, State=Idle","width":50,"height":6,"outline":2,"node":"533:15653"},
      {"name":"Active=True, State=Disabled","width":50,"height":6,"outline":3,"node":"512:2969"},
      {"name":"Active=True, State=Clicked","width":50,"height":6,"outline":1,"node":"512:2963"},
      {"name":"Active=True, State=Idle","width":50,"height":6,"outline":4,"node":"512:2961"}
     ],
     "uses": [
      "kit-tracks-filled"
     ]
    },
    {
     "id": "sliders-and-dials-track-filled-2",
     "name": "_Track Filled",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, State=Disabled","width":50,"height":6,"outline":0,"node":"533:15691"},
      {"name":"Active=False, State=Clicked","width":50,"height":6,"outline":1,"node":"533:15695"},
      {"name":"Active=False, State=Idle","width":50,"height":6,"outline":2,"node":"533:15699"},
      {"name":"Active=True, State=Disabled","width":50,"height":6,"outline":3,"node":"532:19505"},
      {"name":"Active=True, State=Clicked","width":50,"height":6,"outline":3,"node":"532:19508"},
      {"name":"Active=True, State=Idle","width":50,"height":6,"outline":4,"node":"532:19511"}
     ],
     "uses": [
      "kit-tracks-filled",
      "sliders-and-dials-slider-midline"
     ]
    },
    {
     "id": "sliders-and-dials-track-unfilled",
     "name": "_Track Unfilled",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Ticks",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":50,"height":6,"outline":0,"node":"512:3071"},
      {"name":"State=Clicked","width":50,"height":6,"outline":1,"node":"512:3074"},
      {"name":"State=Idle","width":50,"height":6,"outline":2,"node":"512:3077"}
     ],
     "uses": [
      "kit-ticks",
      "kit-tracks-unfilled"
     ]
    },
    {
     "id": "sliders-and-dials-track-unfilled-center-biased",
     "name": "_Track Unfilled - Center-biased",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Ticks",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":50,"height":6,"outline":0,"node":"533:7639"},
      {"name":"State=Clicked","width":50,"height":6,"outline":1,"node":"533:7654"},
      {"name":"State=Idle","width":50,"height":6,"outline":2,"node":"533:7669"}
     ],
     "uses": [
      "kit-ticks",
      "kit-tracks-unfilled"
     ]
    },
    {
     "id": "sliders-and-dials-knob",
     "name": "_Knob",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Non-Ticked",
        "Ticked"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled, Style=Ticked","width":1,"height":20,"outline":0,"node":"525:15401"},
      {"name":"State=Clicked, Style=Ticked","width":1,"height":20,"outline":1,"node":"525:15407"},
      {"name":"State=Idle, Style=Ticked","width":1,"height":20,"outline":0,"node":"525:15411"},
      {"name":"State=Disabled, Style=Non-Ticked","width":1,"height":20,"outline":2,"node":"510:9968"},
      {"name":"State=Clicked, Style=Non-Ticked","width":1,"height":20,"outline":3,"node":"510:9969"},
      {"name":"State=Idle, Style=Non-Ticked","width":1,"height":20,"outline":2,"node":"510:9970"}
     ],
     "uses": [
      "sliders-and-dials-knob-clicked-ticked",
      "sliders-and-dials-knob-clicked-non-ticked"
     ]
    },
    {
     "id": "sliders-and-dials-slider-center-biased",
     "name": "Slider - Center-biased",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      },
      {
       "name": "Ticks",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Value",
       "values": [
        "0%",
        "25%",
        "50%",
        "100%",
        "75%"
       ]
      }
     ],
     "variants": [
      {"name":"Active=True, State=Disabled, Ticks=False, Value=100%","width":100,"height":24,"outline":0,"node":"533:3290"},
      {"name":"Active=True, State=Disabled, Ticks=False, Value=75%","width":100,"height":24,"outline":1,"node":"533:3305"},
      {"name":"Active=True, State=Disabled, Ticks=False, Value=50%","width":100,"height":24,"outline":2,"node":"533:3315"},
      {"name":"Active=True, State=Disabled, Ticks=False, Value=25%","width":100,"height":24,"outline":3,"node":"533:3330"},
      {"name":"Active=True, State=Disabled, Ticks=False, Value=0%","width":100,"height":24,"outline":4,"node":"533:3340"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=100%","width":100,"height":24,"outline":5,"node":"533:3343"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=75%","width":100,"height":24,"outline":6,"node":"533:3358"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=50%","width":100,"height":24,"outline":7,"node":"533:3368"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=25%","width":100,"height":24,"outline":8,"node":"533:3383"},
      {"name":"Active=True, State=Clicked, Ticks=False, Value=0%","width":100,"height":24,"outline":9,"node":"533:3393"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=100%","width":100,"height":24,"outline":10,"node":"533:3396"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=75%","width":100,"height":24,"outline":11,"node":"533:3411"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=50%","width":100,"height":24,"outline":12,"node":"533:3421"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=25%","width":100,"height":24,"outline":13,"node":"533:3435"},
      {"name":"Active=True, State=Idle, Ticks=False, Value=0%","width":100,"height":24,"outline":14,"node":"533:3445"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=100%","width":100,"height":24,"outline":15,"node":"533:3449"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=75%","width":100,"height":24,"outline":16,"node":"533:3464"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=50%","width":100,"height":24,"outline":17,"node":"533:3474"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=25%","width":100,"height":24,"outline":18,"node":"533:3489"},
      {"name":"Active=True, State=Disabled, Ticks=True, Value=0%","width":100,"height":24,"outline":19,"node":"533:3499"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=100%","width":100,"height":24,"outline":20,"node":"533:3502"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=75%","width":100,"height":24,"outline":21,"node":"533:3517"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=50%","width":100,"height":24,"outline":22,"node":"533:3527"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=25%","width":100,"height":24,"outline":23,"node":"533:3542"},
      {"name":"Active=True, State=Clicked, Ticks=True, Value=0%","width":100,"height":24,"outline":24,"node":"533:3552"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=100%","width":100,"height":24,"outline":25,"node":"533:3555"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=75%","width":100,"height":24,"outline":26,"node":"533:3570"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=50%","width":100,"height":24,"outline":27,"node":"533:3580"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=25%","width":100,"height":24,"outline":28,"node":"533:3595"},
      {"name":"Active=True, State=Idle, Ticks=True, Value=0%","width":100,"height":24,"outline":29,"node":"533:3605"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=100%","width":100,"height":24,"outline":30,"node":"533:10333"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=75%","width":100,"height":24,"outline":31,"node":"533:10348"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=50%","width":100,"height":24,"outline":32,"node":"533:10358"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=25%","width":100,"height":24,"outline":33,"node":"533:10367"},
      {"name":"Active=False, State=Disabled, Ticks=False, Value=0%","width":100,"height":24,"outline":34,"node":"533:10382"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=100%","width":100,"height":24,"outline":35,"node":"533:10386"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=75%","width":100,"height":24,"outline":36,"node":"533:10401"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=50%","width":100,"height":24,"outline":37,"node":"533:10411"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=25%","width":100,"height":24,"outline":38,"node":"533:10420"},
      {"name":"Active=False, State=Clicked, Ticks=False, Value=0%","width":100,"height":24,"outline":39,"node":"533:10435"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=100%","width":100,"height":24,"outline":40,"node":"533:10439"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=75%","width":100,"height":24,"outline":41,"node":"533:10454"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=50%","width":100,"height":24,"outline":42,"node":"533:10464"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=25%","width":100,"height":24,"outline":43,"node":"533:10473"},
      {"name":"Active=False, State=Idle, Ticks=False, Value=0%","width":100,"height":24,"outline":44,"node":"533:10488"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=100%","width":100,"height":24,"outline":45,"node":"533:10492"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=75%","width":100,"height":24,"outline":46,"node":"533:10507"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=50%","width":100,"height":24,"outline":47,"node":"533:10517"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=25%","width":100,"height":24,"outline":48,"node":"533:10526"},
      {"name":"Active=False, State=Disabled, Ticks=True, Value=0%","width":100,"height":24,"outline":49,"node":"533:10541"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=100%","width":100,"height":24,"outline":50,"node":"533:10545"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=75%","width":100,"height":24,"outline":51,"node":"533:10560"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=50%","width":100,"height":24,"outline":52,"node":"533:10570"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=25%","width":100,"height":24,"outline":53,"node":"533:10579"},
      {"name":"Active=False, State=Clicked, Ticks=True, Value=0%","width":100,"height":24,"outline":54,"node":"533:10594"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=75%","width":100,"height":24,"outline":55,"node":"533:10613"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=100%","width":100,"height":24,"outline":56,"node":"533:10598"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=50%","width":100,"height":24,"outline":57,"node":"533:10623"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=25%","width":100,"height":24,"outline":58,"node":"533:10632"},
      {"name":"Active=False, State=Idle, Ticks=True, Value=0%","width":100,"height":24,"outline":59,"node":"533:10647"}
     ],
     "uses": [
      "sliders-and-dials-track-unfilled",
      "sliders-and-dials-track-filled-2",
      "sliders-and-dials-knob",
      "kit-tracks-filled",
      "sliders-and-dials-track-unfilled-center-biased"
     ]
    },
    {
     "id": "sliders-and-dials-knob-clicked-ticked",
     "name": "_Knob - Clicked - Ticked",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "helper": true,
     "variants": [
      {"name":"","width":25,"height":20,"outline":0,"node":"4350:10342"}
     ]
    },
    {
     "id": "sliders-and-dials-knob-clicked-non-ticked",
     "name": "_Knob - Clicked - Non-Ticked",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "helper": true,
     "variants": [
      {"name":"","width":25,"height":20,"outline":0,"node":"4352:10356"}
     ]
    },
    {
     "id": "sliders-and-dials-slider-midline",
     "name": "_Slider Midline",
     "page": "Sliders and Dials",
     "section": "Sliders",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False","width":20,"height":20,"outline":0,"node":"4352:16476"},
      {"name":"Active=True","width":20,"height":20,"outline":1,"node":"4352:16484"}
     ]
    },
    {
     "id": "sliders-and-dials-circular-slider-dial",
     "name": "Dial (Circular Slider)",
     "page": "Sliders and Dials",
     "section": "Circular Slider (Dial)",
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Over-Glass",
        "Content Area"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled","width":24,"height":24,"outline":0,"node":"4350:9305"},
      {"name":"Context=Content Area, State=Clicked","width":24,"height":24,"outline":1,"node":"4350:9308"},
      {"name":"Context=Content Area, State=Idle","width":24,"height":24,"outline":2,"node":"4350:9311"},
      {"name":"Context=Over-Glass, State=Disabled","width":24,"height":24,"outline":0,"node":"121:12064"},
      {"name":"Context=Over-Glass, State=Clicked","width":24,"height":24,"outline":3,"node":"481:4709"},
      {"name":"Context=Over-Glass, State=Idle","width":24,"height":24,"outline":4,"node":"121:12067"}
     ],
     "uses": [
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "steppers-stepper-no-field",
     "name": "Stepper/No Field",
     "page": "Steppers",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Disabled",
        "Clicked - Up",
        "Clicked - Down"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":20,"height":24,"outline":0,"node":"121:12080"},
      {"name":"State=Clicked - Down","width":20,"height":24,"outline":1,"node":"538:13265"},
      {"name":"State=Clicked - Up","width":20,"height":24,"outline":2,"node":"538:13251"},
      {"name":"State=Default","width":20,"height":24,"outline":3,"node":"121:12088"}
     ],
     "uses": [
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "steppers-stepper-inside-field",
     "name": "Stepper/Inside Field",
     "page": "Steppers",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Disabled",
        "Clicked - Up",
        "Clicked - Down"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":62,"height":24,"outline":0,"node":"540:1658"},
      {"name":"State=Clicked - Down","width":62,"height":24,"outline":1,"node":"540:1665"},
      {"name":"State=Clicked - Up","width":62,"height":24,"outline":2,"node":"540:1672"},
      {"name":"State=Default","width":62,"height":24,"outline":3,"node":"540:1679"}
     ],
     "uses": [
      "text-fields-field",
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "steppers-stepper-outside-field",
     "name": "Stepper/Outside Field",
     "page": "Steppers",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Disabled",
        "Clicked - Up",
        "Clicked - Down"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":66,"height":24,"outline":0,"node":"540:4696"},
      {"name":"State=Clicked - Down","width":66,"height":24,"outline":1,"node":"540:4705"},
      {"name":"State=Clicked - Up","width":66,"height":24,"outline":2,"node":"540:4714"},
      {"name":"State=Default","width":66,"height":24,"outline":3,"node":"540:4723"}
     ],
     "uses": [
      "text-fields-field",
      "kit-control-bg-bordered"
     ]
    },
    {
     "id": "text-fields-field",
     "name": "Text Field",
     "page": "Text Fields",
     "variant_props": [
      {
       "name": "Show Text",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Focused",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Value",
       "type": "text",
       "default": "\"Value\""
      }
     ],
     "variants": [
      {"name":"State=Disabled, Show Text=True","width":120,"height":24,"outline":0,"node":"479:5650"},
      {"name":"State=Focused, Show Text=True","width":120,"height":24,"outline":1,"node":"479:5652"},
      {"name":"State=Idle, Show Text=True","width":120,"height":24,"outline":2,"node":"196:8361"},
      {"name":"State=Disabled, Show Text=False","width":120,"height":24,"outline":3,"node":"196:8358"},
      {"name":"State=Focused, Show Text=False","width":120,"height":24,"outline":4,"node":"121:12243"},
      {"name":"State=Idle, Show Text=False","width":120,"height":24,"outline":5,"node":"121:12221"}
     ],
     "uses": [
      "text-fields-input"
     ]
    },
    {
     "id": "text-fields-input",
     "name": "_Input Fields",
     "page": "Text Fields",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Focused",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":20,"height":20,"outline":0,"node":"479:5477"},
      {"name":"State=Focused","width":20,"height":20,"outline":1,"node":"479:5478"},
      {"name":"State=Idle","width":20,"height":20,"outline":2,"node":"479:5481"}
     ]
    },
    {
     "id": "toolbars-buttons-xl",
     "name": "_Buttons/XL",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Selected",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":32,"height":28,"outline":0,"node":"598:13341"},
      {"name":"State=Selected","width":32,"height":28,"outline":1,"node":"598:13337"},
      {"name":"State=Idle","width":32,"height":28,"outline":2,"node":"598:13335"}
     ]
    },
    {
     "id": "toolbars-buttons-medium",
     "name": "_Buttons/Medium",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Selected",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":24,"height":20,"outline":0,"node":"641:1752"},
      {"name":"State=Selected","width":24,"height":20,"outline":1,"node":"641:1754"},
      {"name":"State=Idle","width":24,"height":20,"outline":2,"node":"641:1756"}
     ]
    },
    {
     "id": "toolbars-segmented-control",
     "name": "Segmented Control",
     "page": "Toolbars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Medium",
        "XL"
       ]
      }
     ],
     "props": [
      {
       "name": "Items",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Size=Medium, Active=False","width":121,"height":24,"outline":0,"node":"4363:11700"},
      {"name":"Size=XL, Active=False","width":145,"height":36,"outline":1,"node":"4363:11710"},
      {"name":"Size=Medium, Active=True","width":121,"height":24,"outline":2,"node":"641:1136"},
      {"name":"Size=XL, Active=True","width":145,"height":36,"outline":3,"node":"605:3160"}
     ],
     "uses": [
      "materials-liquid-glass-small",
      "toolbars-buttons-medium",
      "toolbars-separator",
      "toolbars-buttons-xl"
     ]
    },
    {
     "id": "toolbars-button-group",
     "name": "Button Group",
     "page": "Toolbars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Medium",
        "XL"
       ]
      }
     ],
     "props": [
      {
       "name": "Buttons",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Size=Medium, Active=False","width":72,"height":24,"outline":0,"node":"4363:11459"},
      {"name":"Size=XL, Active=False","width":100,"height":36,"outline":1,"node":"4363:11465"},
      {"name":"Size=Medium, Active=True","width":72,"height":24,"outline":2,"node":"647:2162"},
      {"name":"Size=XL, Active=True","width":100,"height":36,"outline":3,"node":"647:2461"}
     ],
     "uses": [
      "materials-liquid-glass-small",
      "toolbars-buttons-medium",
      "toolbars-buttons-xl"
     ]
    },
    {
     "id": "toolbars-button",
     "name": "Button",
     "page": "Toolbars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Medium",
        "XL"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"Size=Medium, Active=False, State=Disabled","width":24,"height":24,"outline":0,"node":"4363:11827"},
      {"name":"Size=XL, Active=False, State=Disabled","width":36,"height":36,"outline":1,"node":"4363:11830"},
      {"name":"Size=Medium, Active=False, State=Idle","width":24,"height":24,"outline":2,"node":"4363:11841"},
      {"name":"Size=XL, Active=False, State=Idle","width":36,"height":36,"outline":3,"node":"4363:11844"},
      {"name":"Active=True, Size=Medium, State=Disabled","width":24,"height":24,"outline":4,"node":"648:5040"},
      {"name":"Active=True, Size=XL, State=Disabled","width":36,"height":36,"outline":5,"node":"648:5044"},
      {"name":"Active=True, Size=Medium, State=Idle","width":24,"height":24,"outline":6,"node":"648:4823"},
      {"name":"Active=True, Size=XL, State=Idle","width":36,"height":36,"outline":7,"node":"648:4854"}
     ],
     "uses": [
      "materials-liquid-glass-small"
     ]
    },
    {
     "id": "toolbars-search",
     "name": "Search",
     "page": "Toolbars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Medium",
        "XL"
       ]
      },
      {
       "name": "State",
       "values": [
        "Placeholder",
        "Placeholder + Disabled",
        "Value",
        "Value + Disabled",
        "Typing",
        "Focused"
       ]
      }
     ],
     "props": [
      {
       "name": "Placeholder",
       "type": "text",
       "default": "\"Search\""
      },
      {
       "name": "Value",
       "type": "text",
       "default": "\"Value\""
      }
     ],
     "variants": [
      {"name":"Size=Medium, Active=False, State=Value + Disabled","width":130,"height":24,"outline":0,"node":"4363:12346"},
      {"name":"Size=Medium, Active=False, State=Placeholder + Disabled","width":130,"height":24,"outline":0,"node":"4363:12350"},
      {"name":"Size=Medium, Active=False, State=Focused","width":130,"height":24,"outline":1,"node":"4363:12354"},
      {"name":"Size=Medium, Active=False, State=Typing","width":130,"height":24,"outline":2,"node":"4363:12361"},
      {"name":"Size=Medium, Active=False, State=Value","width":130,"height":24,"outline":3,"node":"4363:12369"},
      {"name":"Size=Medium, Active=False, State=Placeholder","width":130,"height":24,"outline":4,"node":"4363:12373"},
      {"name":"Size=XL, Active=False, State=Value + Disabled","width":130,"height":36,"outline":5,"node":"4363:12377"},
      {"name":"Size=XL, Active=False, State=Placeholder + Disabled","width":130,"height":36,"outline":5,"node":"4363:12381"},
      {"name":"Size=XL, Active=False, State=Focused","width":130,"height":36,"outline":6,"node":"4363:12385"},
      {"name":"Size=XL, Active=False, State=Typing","width":130,"height":36,"outline":7,"node":"4363:12392"},
      {"name":"Size=XL, Active=False, State=Value","width":130,"height":36,"outline":8,"node":"4363:12400"},
      {"name":"Size=XL, Active=False, State=Placeholder","width":130,"height":36,"outline":9,"node":"4363:12404"},
      {"name":"Size=Medium, State=Value + Disabled, Active=True","width":130,"height":24,"outline":10,"node":"648:5248"},
      {"name":"Size=Medium, State=Placeholder + Disabled, Active=True","width":130,"height":24,"outline":10,"node":"648:5188"},
      {"name":"Size=Medium, State=Focused, Active=True","width":130,"height":24,"outline":11,"node":"649:5388"},
      {"name":"Size=Medium, State=Typing, Active=True","width":130,"height":24,"outline":12,"node":"649:5336"},
      {"name":"Size=Medium, State=Value, Active=True","width":130,"height":24,"outline":13,"node":"648:5256"},
      {"name":"Size=Medium, State=Placeholder, Active=True","width":130,"height":24,"outline":14,"node":"641:1741"},
      {"name":"Size=XL, State=Value + Disabled, Active=True","width":130,"height":36,"outline":15,"node":"648:5252"},
      {"name":"Size=XL, State=Placeholder + Disabled, Active=True","width":130,"height":36,"outline":15,"node":"648:5192"},
      {"name":"Size=XL, State=Focused, Active=True","width":130,"height":36,"outline":16,"node":"649:5392"},
      {"name":"Size=XL, State=Typing, Active=True","width":130,"height":36,"outline":17,"node":"649:5340"},
      {"name":"Size=XL, State=Value, Active=True","width":130,"height":36,"outline":18,"node":"648:5260"},
      {"name":"Size=XL, State=Placeholder, Active=True","width":130,"height":36,"outline":19,"node":"586:10582"}
     ],
     "uses": [
      "materials-liquid-glass-small"
     ]
    },
    {
     "id": "toolbars-pull-down-button",
     "name": "Pull Down Button",
     "page": "Toolbars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Medium",
        "XL"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"Size=Medium, Active=False, State=Idle","width":39,"height":24,"outline":0,"node":"4363:12024"},
      {"name":"Size=Medium, Active=False, State=Disabled","width":39,"height":24,"outline":1,"node":"4363:12028"},
      {"name":"Size=XL, Active=False, State=Idle","width":50,"height":36,"outline":2,"node":"4363:12032"},
      {"name":"Size=XL, Active=False, State=Disabled","width":50,"height":36,"outline":3,"node":"4363:12036"},
      {"name":"State=Idle, Size=Medium, Active=True","width":39,"height":24,"outline":4,"node":"641:1585"},
      {"name":"State=Disabled, Size=Medium, Active=True","width":39,"height":24,"outline":5,"node":"649:5784"},
      {"name":"State=Idle, Size=XL, Active=True","width":50,"height":36,"outline":6,"node":"121:11857"},
      {"name":"Size=XL, Active=True, State=Disabled","width":50,"height":36,"outline":7,"node":"649:5788"}
     ],
     "uses": [
      "materials-liquid-glass-small"
     ]
    },
    {
     "id": "toolbars-pop-up-button",
     "name": "Pop-Up Button",
     "page": "Toolbars",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Medium",
        "XL"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Size=Medium, Active=False, State=Idle","width":57,"height":24,"outline":0,"node":"4363:11928"},
      {"name":"Size=XL, Active=False, State=Idle","width":63,"height":36,"outline":1,"node":"4363:11932"},
      {"name":"Size=Medium, Active=False, State=Disabled","width":57,"height":24,"outline":2,"node":"4363:11936"},
      {"name":"Size=XL, Active=False, State=Disabled","width":63,"height":36,"outline":3,"node":"4363:11940"},
      {"name":"State=Idle, Size=Medium, Active=True","width":57,"height":24,"outline":4,"node":"641:1686"},
      {"name":"State=Idle, Size=XL, Active=True","width":63,"height":36,"outline":5,"node":"162:10124"},
      {"name":"State=Disabled, Size=Medium, Active=True","width":57,"height":24,"outline":6,"node":"649:5704"},
      {"name":"State=Disabled, Size=XL, Active=True","width":63,"height":36,"outline":7,"node":"649:5708"}
     ],
     "uses": [
      "materials-liquid-glass-small"
     ]
    },
    {
     "id": "toolbars-separator",
     "name": "_Separator",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "Next to Selected",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "XL",
        "Medium"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Medium, Next to Selected=True","width":3,"height":16,"outline":0,"node":"4358:14738"},
      {"name":"Size=Medium, Next to Selected=False","width":3,"height":16,"outline":1,"node":"4358:14694"},
      {"name":"Size=XL, Next to Selected=True","width":3,"height":20,"outline":2,"node":"4358:14736"},
      {"name":"Size=XL, Next to Selected=False","width":3,"height":20,"outline":3,"node":"4358:14692"}
     ]
    },
    {
     "id": "toolbars-utility-panel-tab-bar",
     "name": "Utility Panel Tab Bar",
     "page": "Toolbars",
     "variants": [
      {"name":"","width":220,"height":30,"outline":0,"node":"204:9979"}
     ],
     "uses": [
      "toolbars-button-utility-panel-tab-bar"
     ]
    },
    {
     "id": "toolbars-button-utility-panel-tab-bar",
     "name": "_Button - Utility Panel Tab Bar",
     "page": "Toolbars",
     "helper": true,
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Selected=True","width":44,"height":30,"outline":0,"node":"4358:16953"},
      {"name":"Selected=False","width":44,"height":30,"outline":1,"node":"4358:16925"}
     ],
     "uses": [
      "materials-liquid-glass-small"
     ]
    },
    {
     "id": "toggles-knob",
     "name": "_Knob",
     "page": "Toggles",
     "helper": true,
     "variant_props": [
      {
       "name": "Selection",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Size",
       "values": [
        "Medium",
        "Small",
        "Mini",
        "XL",
        "Large"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Size=XL, State=Disabled, Selection=True","width":80,"height":36,"outline":0,"node":"4348:11321"},
      {"name":"Size=XL, State=Clicked, Selection=True","width":80,"height":36,"outline":1,"node":"4348:11325"},
      {"name":"Size=XL, State=Idle, Selection=True","width":80,"height":36,"outline":0,"node":"4348:11329"},
      {"name":"Size=XL, State=Disabled, Selection=False","width":80,"height":36,"outline":2,"node":"4348:11187"},
      {"name":"Size=XL, State=Clicked, Selection=False","width":80,"height":36,"outline":3,"node":"4348:11189"},
      {"name":"Size=XL, State=Idle, Selection=False","width":80,"height":36,"outline":2,"node":"4348:11185"},
      {"name":"Size=Large, State=Disabled, Selection=True","width":64,"height":28,"outline":4,"node":"4348:11319"},
      {"name":"Size=Large, State=Clicked, Selection=True","width":64,"height":28,"outline":5,"node":"4348:11323"},
      {"name":"Size=Large, State=Idle, Selection=True","width":64,"height":28,"outline":4,"node":"4348:11327"},
      {"name":"Size=Large, State=Disabled, Selection=False","width":64,"height":28,"outline":6,"node":"4348:11179"},
      {"name":"Size=Large, State=Clicked, Selection=False","width":64,"height":28,"outline":7,"node":"4348:11181"},
      {"name":"Size=Large, State=Idle, Selection=False","width":64,"height":28,"outline":6,"node":"4348:11183"},
      {"name":"Size=Medium, State=Disabled, Selection=True","width":54,"height":24,"outline":8,"node":"4348:11313"},
      {"name":"Size=Medium, State=Clicked, Selection=True","width":54,"height":24,"outline":9,"node":"4348:11315"},
      {"name":"Size=Medium, State=Idle, Selection=True","width":54,"height":24,"outline":8,"node":"4348:11317"},
      {"name":"Size=Medium, State=Disabled, Selection=False","width":54,"height":24,"outline":10,"node":"475:332"},
      {"name":"Size=Medium, State=Clicked, Selection=False","width":54,"height":24,"outline":11,"node":"475:333"},
      {"name":"Size=Medium, State=Idle, Selection=False","width":54,"height":24,"outline":10,"node":"475:336"},
      {"name":"Size=Small, State=Disabled, Selection=True","width":44,"height":20,"outline":12,"node":"4348:11331"},
      {"name":"Size=Small, State=Clicked, Selection=True","width":44,"height":20,"outline":13,"node":"4348:11333"},
      {"name":"Size=Small, State=Idle, Selection=True","width":44,"height":20,"outline":12,"node":"4348:11335"},
      {"name":"Size=Small, State=Disabled, Selection=False","width":44,"height":20,"outline":14,"node":"4348:11155"},
      {"name":"Size=Small, State=Clicked, Selection=False","width":44,"height":20,"outline":15,"node":"4348:11157"},
      {"name":"Size=Small, State=Idle, Selection=False","width":44,"height":20,"outline":14,"node":"4348:11159"},
      {"name":"Size=Mini, State=Disabled, Selection=True","width":36,"height":16,"outline":16,"node":"4348:11337"},
      {"name":"Size=Mini, State=Clicked, Selection=True","width":36,"height":16,"outline":17,"node":"4348:11339"},
      {"name":"Size=Mini, State=Idle, Selection=True","width":36,"height":16,"outline":16,"node":"4348:11341"},
      {"name":"Size=Mini, State=Disabled, Selection=False","width":36,"height":16,"outline":18,"node":"4348:11167"},
      {"name":"Size=Mini, State=Clicked, Selection=False","width":36,"height":16,"outline":19,"node":"4348:11169"},
      {"name":"Size=Mini, State=Idle, Selection=False","width":36,"height":16,"outline":18,"node":"4348:11171"}
     ],
     "uses": [
      "toggles-knob-clicked"
     ]
    },
    {
     "id": "toggles-switches",
     "name": "Toggles - Switches",
     "page": "Toggles",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Selection",
       "values": [
        "Off",
        "On"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabeld"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, State=Disabeld, Selection=On","width":54,"height":24,"outline":0,"node":"474:1326"},
      {"name":"Active=True, State=Disabeld, Selection=On","width":54,"height":24,"outline":0,"node":"468:812"},
      {"name":"Active=False, State=Clicked, Selection=On","width":54,"height":24,"outline":1,"node":"474:1341"},
      {"name":"Active=True, State=Clicked, Selection=On","width":54,"height":24,"outline":1,"node":"474:1111"},
      {"name":"Active=False, State=Idle, Selection=On","width":54,"height":24,"outline":2,"node":"474:1356"},
      {"name":"Active=True, State=Idle, Selection=On","width":54,"height":24,"outline":2,"node":"468:808"},
      {"name":"Active=False, State=Disabeld, Selection=Off","width":54,"height":24,"outline":3,"node":"474:1371"},
      {"name":"Active=True, State=Disabeld, Selection=Off","width":54,"height":24,"outline":3,"node":"468:806"},
      {"name":"Active=False, State=Clicked, Selection=Off","width":54,"height":24,"outline":4,"node":"474:1386"},
      {"name":"Active=True, State=Clicked, Selection=Off","width":54,"height":24,"outline":4,"node":"474:1096"},
      {"name":"Active=False, State=Idle, Selection=Off","width":54,"height":24,"outline":5,"node":"474:1401"},
      {"name":"Active=True, State=Idle, Selection=Off","width":54,"height":24,"outline":5,"node":"468:810"}
     ],
     "uses": [
      "kit-tracks-filled",
      "toggles-knob",
      "kit-tracks-unfilled"
     ]
    },
    {
     "id": "toggles-radio-buttons",
     "name": "Toggles - Radio Buttons",
     "page": "Toggles",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Selection",
       "values": [
        "On",
        "Mixed",
        "Off"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Active=False, State=Disabled, Selection=Off","width":54,"height":16,"outline":0,"node":"497:3186"},
      {"name":"Active=False, State=Disabled, Selection=Mixed","width":54,"height":16,"outline":1,"node":"497:3190"},
      {"name":"Active=False, State=Disabled, Selection=On","width":54,"height":16,"outline":2,"node":"497:3181"},
      {"name":"Active=False, State=Clicked, Selection=Off","width":54,"height":16,"outline":3,"node":"497:3161"},
      {"name":"Active=False, State=Clicked, Selection=Mixed","width":54,"height":16,"outline":4,"node":"497:3165"},
      {"name":"Active=False, State=Clicked, Selection=On","width":54,"height":16,"outline":5,"node":"497:3170"},
      {"name":"Active=False, State=Idle, Selection=Off","width":54,"height":16,"outline":6,"node":"121:12157"},
      {"name":"Active=False, State=Idle, Selection=Mixed","width":54,"height":16,"outline":7,"node":"121:12151"},
      {"name":"Active=False, State=Idle, Selection=On","width":54,"height":16,"outline":8,"node":"121:12148"},
      {"name":"Active=True, State=Disabled, Selection=Off","width":54,"height":16,"outline":0,"node":"497:3121"},
      {"name":"Active=True, State=Disabled, Selection=Mixed","width":54,"height":16,"outline":9,"node":"497:3125"},
      {"name":"Active=True, State=Disabled, Selection=On","width":54,"height":16,"outline":10,"node":"497:3130"},
      {"name":"Active=True, State=Clicked, Selection=Off","width":54,"height":16,"outline":3,"node":"497:3081"},
      {"name":"Active=True, State=Clicked, Selection=Mixed","width":54,"height":16,"outline":11,"node":"497:3085"},
      {"name":"Active=True, State=Clicked, Selection=On","width":54,"height":16,"outline":12,"node":"497:3090"},
      {"name":"Active=True, State=Idle, Selection=Off","width":54,"height":16,"outline":6,"node":"121:12154"},
      {"name":"Active=True, State=Idle, Selection=Mixed","width":54,"height":16,"outline":13,"node":"121:12145"},
      {"name":"Active=True, State=Idle, Selection=On","width":54,"height":16,"outline":14,"node":"121:12142"}
     ],
     "uses": [
      "kit-control-bg-controls",
      "toggles-glyphs-radio-buttons"
     ]
    },
    {
     "id": "toggles-checkboxes",
     "name": "Toggles - Checkboxes",
     "page": "Toggles",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Selection",
       "values": [
        "On",
        "Mixed",
        "Off"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"Active=False, State=Disabled, Selection=Off","width":54,"height":16,"outline":0,"node":"497:3766"},
      {"name":"Active=False, State=Disabled, Selection=Mixed","width":54,"height":16,"outline":1,"node":"497:3780"},
      {"name":"Active=False, State=Disabled, Selection=On","width":54,"height":16,"outline":2,"node":"497:3795"},
      {"name":"Active=False, State=Clicked, Selection=Off","width":54,"height":16,"outline":3,"node":"497:3762"},
      {"name":"Active=False, State=Clicked, Selection=Mixed","width":54,"height":16,"outline":4,"node":"497:3775"},
      {"name":"Active=False, State=Clicked, Selection=On","width":54,"height":16,"outline":5,"node":"497:3790"},
      {"name":"Active=False, State=Idle, Selection=Off","width":54,"height":16,"outline":6,"node":"497:3758"},
      {"name":"Active=False, State=Idle, Selection=Mixed","width":54,"height":16,"outline":7,"node":"497:3770"},
      {"name":"Active=False, State=Idle, Selection=On","width":54,"height":16,"outline":8,"node":"497:3785"},
      {"name":"Active=True, State=Disabled, Selection=Off","width":54,"height":16,"outline":9,"node":"497:3808"},
      {"name":"Active=True, State=Disabled, Selection=Mixed","width":54,"height":16,"outline":10,"node":"497:3822"},
      {"name":"Active=True, State=Disabled, Selection=On","width":54,"height":16,"outline":11,"node":"497:3837"},
      {"name":"Active=True, State=Clicked, Selection=Off","width":54,"height":16,"outline":12,"node":"497:3804"},
      {"name":"Active=True, State=Clicked, Selection=Mixed","width":54,"height":16,"outline":13,"node":"497:3817"},
      {"name":"Active=True, State=Clicked, Selection=On","width":54,"height":16,"outline":14,"node":"497:3832"},
      {"name":"Active=True, State=Idle, Selection=Off","width":54,"height":16,"outline":15,"node":"497:3800"},
      {"name":"Active=True, State=Idle, Selection=Mixed","width":54,"height":16,"outline":16,"node":"497:3812"},
      {"name":"Active=True, State=Idle, Selection=On","width":54,"height":16,"outline":17,"node":"497:3827"}
     ],
     "uses": [
      "kit-control-bg-controls",
      "toggles-glyphs-checkboxes"
     ]
    },
    {
     "id": "toggles-glyphs-radio-buttons",
     "name": "_Glyphs - Radio Buttons",
     "page": "Toggles",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Mixed",
        "Selected"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, State=Mixed, Is Enabled=True","width":16,"height":16,"outline":0,"node":"4348:8283"},
      {"name":"Active=False, State=Mixed, Is Enabled=False","width":16,"height":16,"outline":1,"node":"4348:8287"},
      {"name":"Active=False, State=Selected, Is Enabled=True","width":16,"height":16,"outline":2,"node":"4348:8291"},
      {"name":"Active=False, State=Selected, Is Enabled=False","width":16,"height":16,"outline":3,"node":"4348:8295"},
      {"name":"Active=True, State=Mixed, Is Enabled=True","width":16,"height":16,"outline":4,"node":"4348:8162"},
      {"name":"Active=True, State=Mixed, Is Enabled=False","width":16,"height":16,"outline":5,"node":"4348:8213"},
      {"name":"Active=True, State=Selected, Is Enabled=True","width":16,"height":16,"outline":6,"node":"4348:8161"},
      {"name":"Active=True, State=Selected, Is Enabled=False","width":16,"height":16,"outline":7,"node":"4348:8215"}
     ]
    },
    {
     "id": "toggles-glyphs-checkboxes",
     "name": "_Glyphs - Checkboxes",
     "page": "Toggles",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "Is Enabled",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "State",
       "values": [
        "Mixed",
        "Selected"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, State=Mixed, Is Enabled=True","width":16,"height":16,"outline":0,"node":"4348:8307"},
      {"name":"Active=False, State=Mixed, Is Enabled=False","width":16,"height":16,"outline":1,"node":"4348:8309"},
      {"name":"Active=False, State=Selected, Is Enabled=True","width":16,"height":16,"outline":2,"node":"4348:8311"},
      {"name":"Active=False, State=Selected, Is Enabled=False","width":16,"height":16,"outline":3,"node":"4348:8313"},
      {"name":"Active=True, State=Mixed, Is Enabled=True","width":16,"height":16,"outline":4,"node":"4348:8160"},
      {"name":"Active=True, State=Mixed, Is Enabled=False","width":16,"height":16,"outline":5,"node":"4348:8205"},
      {"name":"Active=True, State=Selected, Is Enabled=True","width":16,"height":16,"outline":6,"node":"4348:8159"},
      {"name":"Active=True, State=Selected, Is Enabled=False","width":16,"height":16,"outline":7,"node":"4348:8207"}
     ]
    },
    {
     "id": "toggles-knob-clicked",
     "name": "_Knob Clicked",
     "page": "Toggles",
     "helper": true,
     "variants": [
      {"name":"","width":58,"height":38,"outline":0,"node":"4348:11417"}
     ]
    },
    {
     "id": "tooltips-tooltip",
     "name": "Tooltip",
     "page": "Tooltips",
     "variants": [
      {"name":"","width":49,"height":18,"outline":0,"node":"0:2793"}
     ],
     "uses": [
      "materials",
      "tooltips-text"
     ]
    },
    {
     "id": "tooltips-text",
     "name": "_Text",
     "page": "Tooltips",
     "helper": true,
     "props": [
      {
       "name": "Text",
       "type": "text",
       "default": "\"Tooltip\""
      }
     ],
     "variants": [
      {"name":"","width":37,"height":13,"outline":0,"node":"4331:12214"}
     ]
    },
    {
     "id": "windows-window-bg",
     "name": "Window BG",
     "page": "Windows",
     "section": "Window",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "variants": [
      {"name":"Active=True","width":300,"height":200,"outline":0,"node":"585:3372"},
      {"name":"Active=False","width":300,"height":200,"outline":1,"node":"4376:59034"}
     ]
    },
    {
     "id": "windows-window-controls-standard",
     "name": "Window Controls/Standard",
     "page": "Windows",
     "section": "Window",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False","width":68,"height":14,"outline":0,"node":"488:17657"},
      {"name":"Active=True","width":68,"height":14,"outline":1,"node":"121:11896"}
     ]
    },
    {
     "id": "windows-window-controls-utility",
     "name": "Window Controls/Utility",
     "page": "Windows",
     "section": "Window",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False","width":44,"height":10,"outline":0,"node":"488:17662"},
      {"name":"Active=True","width":44,"height":10,"outline":1,"node":"488:17666"}
     ]
    },
    {
     "id": "windows-window-titles-utility-panel",
     "name": "Window Titles/Utility Panel",
     "page": "Windows",
     "section": "Window",
     "props": [
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol folder"
      }
     ],
     "variants": [
      {"name":"","width":48,"height":16,"outline":0,"node":"650:5930"}
     ]
    },
    {
     "id": "windows-window-titles",
     "name": "Window Titles/Window",
     "page": "Windows",
     "section": "Window",
     "variant_props": [
      {
       "name": "With Sidebar",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol folder"
      },
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"With Sidebar=False","width":111,"height":30,"outline":0,"node":"177:11506"},
      {"name":"With Sidebar=True","width":111,"height":30,"outline":1,"node":"4358:16749"}
     ]
    },
    {
     "id": "windows-window-composed",
     "name": "Windows - Composed",
     "page": "Windows",
     "section": "Window",
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Window Type",
       "values": [
        "Default + Title + Sidebar",
        "Default + Title",
        "Default without Title",
        "Unified Toolbar + Title",
        "Unified Toolbar without Title",
        "Unified Toolbar + Title + Sidebar",
        "Unified Compact Toolbar + Title",
        "Unified Compact Toolbar without Title",
        "Unified Compact Toolbar + Title + Sidebar",
        "Expanded Toolbar + Title",
        "Expanded Toolbar without Title",
        "Expanded Toolbar + Title + Sidebar"
       ]
      }
     ],
     "props": [
      {
       "name": "Content Area",
       "type": "slot"
      }
     ],
     "variants": [
      {"name":"Active=False, Window Type=Expanded Toolbar + Title + Sidebar","width":840,"height":400,"outline":0,"node":"4364:26642"},
      {"name":"Active=False, Window Type=Unified Compact Toolbar + Title + Sidebar","width":840,"height":400,"outline":1,"node":"4364:26689"},
      {"name":"Active=False, Window Type=Unified Toolbar + Title + Sidebar","width":840,"height":400,"outline":2,"node":"4364:26730"},
      {"name":"Active=False, Window Type=Default + Title + Sidebar","width":840,"height":400,"outline":3,"node":"4364:26772"},
      {"name":"Active=False, Window Type=Expanded Toolbar without Title","width":840,"height":400,"outline":4,"node":"4364:26661"},
      {"name":"Active=False, Window Type=Unified Compact Toolbar without Title","width":840,"height":400,"outline":5,"node":"4364:26706"},
      {"name":"Active=False, Window Type=Unified Toolbar without Title","width":840,"height":400,"outline":6,"node":"4364:26747"},
      {"name":"Active=False, Window Type=Default without Title","width":840,"height":400,"outline":7,"node":"4364:26784"},
      {"name":"Active=False, Window Type=Expanded Toolbar + Title","width":840,"height":400,"outline":8,"node":"4364:26674"},
      {"name":"Active=False, Window Type=Unified Compact Toolbar + Title","width":840,"height":400,"outline":9,"node":"4364:26717"},
      {"name":"Active=False, Window Type=Unified Toolbar + Title","width":840,"height":400,"outline":10,"node":"4364:26759"},
      {"name":"Active=False, Window Type=Default + Title","width":840,"height":400,"outline":11,"node":"4364:26790"},
      {"name":"Active=True, Window Type=Expanded Toolbar + Title + Sidebar","width":840,"height":400,"outline":12,"node":"4363:18479"},
      {"name":"Window Type=Unified Compact Toolbar + Title + Sidebar, Active=True","width":840,"height":400,"outline":13,"node":"4363:18473"},
      {"name":"Active=True, Window Type=Unified Toolbar + Title + Sidebar","width":840,"height":400,"outline":14,"node":"4363:18458"},
      {"name":"Window Type=Default + Title + Sidebar, Active=True","width":840,"height":400,"outline":15,"node":"4363:18448"},
      {"name":"Active=True, Window Type=Expanded Toolbar without Title","width":840,"height":400,"outline":16,"node":"4363:18480"},
      {"name":"Window Type=Unified Compact Toolbar without Title, Active=True","width":840,"height":400,"outline":17,"node":"4363:18474"},
      {"name":"Active=True, Window Type=Unified Toolbar without Title","width":840,"height":400,"outline":18,"node":"4363:18457"},
      {"name":"Window Type=Default without Title, Active=True","width":840,"height":400,"outline":19,"node":"4363:18445"},
      {"name":"Active=True, Window Type=Expanded Toolbar + Title","width":840,"height":400,"outline":20,"node":"4363:18481"},
      {"name":"Window Type=Unified Compact Toolbar + Title, Active=True","width":840,"height":400,"outline":21,"node":"4363:18475"},
      {"name":"Active=True, Window Type=Unified Toolbar + Title","width":840,"height":400,"outline":22,"node":"4363:18456"},
      {"name":"Window Type=Default + Title, Active=True","width":840,"height":400,"outline":23,"node":"4363:18442"}
     ],
     "uses": [
      "sidebars-bg",
      "sidebars-composed",
      "materials-scroll-edge-effect-hard",
      "windows-window-titles",
      "toolbars-button",
      "toolbars-segmented-control",
      "toolbars-button-group",
      "toolbars-search",
      "windows-window-controls-standard",
      "scrollbar-vertical"
     ]
    },
    {
     "id": "windows-window-utility-panel",
     "name": "Utility Panel",
     "page": "Windows",
     "section": "Window",
     "variants": [
      {"name":"","width":300,"height":300,"outline":0,"node":"585:3375"}
     ],
     "uses": [
      "windows-window-controls-utility",
      "windows-window-titles-utility-panel",
      "toolbars-utility-panel-tab-bar"
     ]
    },
    {
     "id": "kit-header",
     "name": "Header",
     "page": "_Kit",
     "props": [
      {
       "name": "Show Link 2",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Component",
       "type": "text",
       "default": "\"Component\""
      },
      {
       "name": "Description",
       "type": "text",
       "default": "\"Description\""
      }
     ],
     "variants": [
      {"name":"","width":1400,"height":208,"outline":0,"node":"453:3362"}
     ]
    },
    {
     "id": "kit-segmented-control",
     "name": "Segmented Control",
     "page": "_Kit",
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Over-Glass",
        "Content Area"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Disabled",
        "Clicked"
       ]
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled","width":20,"height":20,"outline":0,"node":"4338:10088"},
      {"name":"Context=Content Area, State=Clicked","width":20,"height":20,"outline":1,"node":"4338:10087"},
      {"name":"Context=Content Area, State=Idle","width":20,"height":20,"outline":2,"node":"4338:10086"},
      {"name":"Context=Over-Glass, State=Disabled","width":20,"height":20,"outline":3,"node":"4338:10097"},
      {"name":"Context=Over-Glass, State=Clicked","width":20,"height":20,"outline":4,"node":"4338:10096"},
      {"name":"Context=Over-Glass, State=Idle","width":20,"height":20,"outline":5,"node":"4338:10095"}
     ]
    },
    {
     "id": "kit-glyphs",
     "name": "Glyphs",
     "page": "_Kit",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Idle",
        "Disabled"
       ]
      },
      {
       "name": "Style",
       "values": [
        "Colored",
        "Neutral",
        "Primary"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled, Style=Colored","width":20,"height":20,"outline":0,"node":"4338:10241"},
      {"name":"State=Idle, Style=Colored","width":20,"height":20,"outline":1,"node":"4338:10240"},
      {"name":"State=Disabled, Style=Neutral","width":20,"height":20,"outline":2,"node":"4338:10239"},
      {"name":"State=Idle, Style=Neutral","width":20,"height":20,"outline":3,"node":"4338:10238"},
      {"name":"State=Disabled, Style=Primary","width":20,"height":20,"outline":4,"node":"4338:10237"},
      {"name":"State=Idle, Style=Primary","width":20,"height":20,"outline":5,"node":"4338:10236"}
     ]
    },
    {
     "id": "kit-knobs",
     "name": "Knobs",
     "page": "_Kit",
     "variant_props": [
      {
       "name": "Property 1",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "Property 2",
       "values": [
        "Dark",
        "Light"
       ]
      },
      {
       "name": "Property 3",
       "values": [
        "Knobs - Toggle"
       ]
      },
      {
       "name": "Property 4",
       "values": [
        "01 - Idle",
        "03 - Clicked",
        "03 - Clicked - Glow",
        "03 - Clicked - Shadow",
        "04 - Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Property 1=Over-Glass, Property 2=Dark, Property 3=Knobs - Toggle, Property 4=04 - Disabled","width":20,"height":20,"outline":0,"node":"4338:10168"},
      {"name":"Property 1=Over-Glass, Property 2=Dark, Property 3=Knobs - Toggle, Property 4=03 - Clicked","width":20,"height":20,"outline":1,"node":"4338:10167"},
      {"name":"Property 1=Over-Glass, Property 2=Dark, Property 3=Knobs - Toggle, Property 4=01 - Idle","width":20,"height":20,"outline":0,"node":"4338:10166"},
      {"name":"Property 1=Over-Glass, Property 2=Light, Property 3=Knobs - Toggle, Property 4=04 - Disabled","width":20,"height":20,"outline":0,"node":"4338:10165"},
      {"name":"Property 1=Over-Glass, Property 2=Light, Property 3=Knobs - Toggle, Property 4=03 - Clicked","width":20,"height":20,"outline":1,"node":"4338:10164"},
      {"name":"Property 1=Over-Glass, Property 2=Light, Property 3=Knobs - Toggle, Property 4=01 - Idle","width":20,"height":20,"outline":0,"node":"4338:10163"},
      {"name":"Property 1=Content Area, Property 2=Dark, Property 3=Knobs - Toggle, Property 4=04 - Disabled","width":20,"height":20,"outline":0,"node":"4338:10178"},
      {"name":"Property 1=Content Area, Property 2=Dark, Property 3=Knobs - Toggle, Property 4=03 - Clicked - Glow","width":20,"height":20,"outline":1,"node":"4338:10176"},
      {"name":"Property 1=Content Area, Property 2=Dark, Property 3=Knobs - Toggle, Property 4=03 - Clicked - Shadow","width":20,"height":20,"outline":1,"node":"4338:10177"},
      {"name":"Property 1=Content Area, Property 2=Dark, Property 3=Knobs - Toggle, Property 4=03 - Clicked","width":20,"height":20,"outline":1,"node":"4338:10175"},
      {"name":"Property 1=Content Area, Property 2=Dark, Property 3=Knobs - Toggle, Property 4=01 - Idle","width":20,"height":20,"outline":0,"node":"4338:10174"},
      {"name":"Property 1=Content Area, Property 2=Light, Property 3=Knobs - Toggle, Property 4=04 - Disabled","width":20,"height":20,"outline":0,"node":"4338:10173"},
      {"name":"Property 1=Content Area, Property 2=Light, Property 3=Knobs - Toggle, Property 4=03 - Clicked - Shadow","width":20,"height":20,"outline":1,"node":"4338:10171"},
      {"name":"Property 1=Content Area, Property 2=Light, Property 3=Knobs - Toggle, Property 4=03 - Clicked - Glow","width":20,"height":20,"outline":1,"node":"4338:10172"},
      {"name":"Property 1=Content Area, Property 2=Light, Property 3=Knobs - Toggle, Property 4=03 - Clicked","width":20,"height":20,"outline":1,"node":"4338:10170"},
      {"name":"Property 1=Content Area, Property 2=Light, Property 3=Knobs - Toggle, Property 4=01 - Idle","width":20,"height":20,"outline":2,"node":"4338:10169"}
     ]
    },
    {
     "id": "kit-content-area-light-knobs-sliders-01-idle",
     "name": "Content Area/Light/Knobs - Sliders/01 - Idle",
     "page": "_Kit",
     "variants": [
      {"name":"","width":20,"height":20,"outline":0,"node":"4338:10369"}
     ]
    },
    {
     "id": "kit-control-bg-bordered-prominent-destructive",
     "name": "_Control BG/Bordered - Prominent - Destructive",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-glass"
       ]
      },
      {
       "name": "State",
       "values": [
        "Clicked",
        "Disabled",
        "Idle"
       ]
      }
     ],
     "variants": [
      {"name":"Context=Over-glass, State=Disabled","width":20,"height":20,"outline":0,"node":"4336:15032"},
      {"name":"Context=Over-glass, State=Clicked","width":20,"height":20,"outline":1,"node":"4336:15036"},
      {"name":"Context=Over-glass, State=Idle","width":20,"height":20,"outline":2,"node":"4336:15042"},
      {"name":"Context=Content Area, State=Disabled","width":20,"height":20,"outline":3,"node":"4336:15057"},
      {"name":"Context=Content Area, State=Clicked","width":20,"height":20,"outline":4,"node":"4336:15061"},
      {"name":"Context=Content Area, State=Idle","width":20,"height":20,"outline":5,"node":"4336:15067"}
     ]
    },
    {
     "id": "kit-control-bg-bordered-prominent",
     "name": "_Control BG/Bordered - Prominent",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-glass"
       ]
      },
      {
       "name": "State",
       "values": [
        "Clicked",
        "Disabled",
        "Idle"
       ]
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled","width":20,"height":20,"outline":0,"node":"473:425"},
      {"name":"Context=Content Area, State=Clicked","width":20,"height":20,"outline":1,"node":"473:420"},
      {"name":"Context=Content Area, State=Idle","width":20,"height":20,"outline":2,"node":"473:345"},
      {"name":"Context=Over-glass, State=Disabled","width":20,"height":20,"outline":3,"node":"473:1182"},
      {"name":"Context=Over-glass, State=Clicked","width":20,"height":20,"outline":4,"node":"473:1183"},
      {"name":"Context=Over-glass, State=Idle","width":20,"height":20,"outline":5,"node":"473:1188"}
     ]
    },
    {
     "id": "kit-control-bg-bordered-destructive",
     "name": "_Control BG/Bordered - Destructive",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Clicked",
        "Disabled",
        "Idle"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":20,"height":20,"outline":0,"node":"473:445"},
      {"name":"State=Clicked","width":20,"height":20,"outline":1,"node":"473:415"},
      {"name":"State=Idle","width":20,"height":20,"outline":2,"node":"473:340"}
     ]
    },
    {
     "id": "kit-control-bg-bordered-tinted",
     "name": "_Control BG/Bordered - Tinted",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Clicked",
        "Disabled",
        "Idle"
       ]
      }
     ],
     "variants": [
      {"name":"State=Disabled","width":20,"height":20,"outline":0,"node":"473:430"},
      {"name":"State=Clicked","width":20,"height":20,"outline":1,"node":"473:400"},
      {"name":"State=Idle","width":20,"height":20,"outline":2,"node":"473:294"}
     ]
    },
    {
     "id": "kit-control-bg-bordered",
     "name": "_Control BG/Bordered",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-glass"
       ]
      },
      {
       "name": "On",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled, On=True","width":20,"height":20,"outline":0,"node":"4342:3084"},
      {"name":"Context=Content Area, State=Clicked, On=True","width":20,"height":20,"outline":1,"node":"4342:3085"},
      {"name":"Context=Content Area, State=Idle, On=True","width":20,"height":20,"outline":2,"node":"4342:3086"},
      {"name":"Context=Over-glass, State=Disabled, On=True","width":20,"height":20,"outline":3,"node":"4342:3087"},
      {"name":"Context=Over-glass, State=Clicked, On=True","width":20,"height":20,"outline":4,"node":"4342:3088"},
      {"name":"Context=Over-glass, State=Idle, On=True","width":20,"height":20,"outline":2,"node":"4342:3089"},
      {"name":"Context=Content Area, State=Disabled, On=False","width":20,"height":20,"outline":5,"node":"4336:15088"},
      {"name":"Context=Content Area, State=Clicked, On=False","width":20,"height":20,"outline":6,"node":"473:405"},
      {"name":"Context=Content Area, State=Idle, On=False","width":20,"height":20,"outline":7,"node":"473:318"},
      {"name":"Context=Over-glass, State=Disabled, On=False","width":20,"height":20,"outline":8,"node":"473:1282"},
      {"name":"Context=Over-glass, State=Clicked, On=False","width":20,"height":20,"outline":9,"node":"473:1284"},
      {"name":"Context=Over-glass, State=Idle, On=False","width":20,"height":20,"outline":10,"node":"473:1286"}
     ]
    },
    {
     "id": "kit-control-bg-bordered-toggle",
     "name": "_Control BG/Bordered - Toggle",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-glass"
       ]
      },
      {
       "name": "On",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      },
      {
       "name": "Window Active",
       "values": [
        "False",
        "True"
       ]
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Disabled, On=True, Window Active=False","width":20,"height":20,"outline":0,"node":"4342:4291"},
      {"name":"Context=Content Area, State=Clicked, On=True, Window Active=False","width":20,"height":20,"outline":1,"node":"4342:4293"},
      {"name":"Context=Content Area, State=Idle, On=True, Window Active=False","width":20,"height":20,"outline":2,"node":"4342:4295"},
      {"name":"Context=Over-glass, State=Disabled, On=True, Window Active=False","width":20,"height":20,"outline":3,"node":"4342:4297"},
      {"name":"Context=Over-glass, State=Clicked, On=True, Window Active=False","width":20,"height":20,"outline":4,"node":"4342:4300"},
      {"name":"Context=Over-glass, State=Idle, On=True, Window Active=False","width":20,"height":20,"outline":5,"node":"4342:4302"},
      {"name":"Context=Content Area, State=Disabled, On=False, Window Active=False","width":20,"height":20,"outline":0,"node":"4342:4304"},
      {"name":"Context=Content Area, State=Clicked, On=False, Window Active=False","width":20,"height":20,"outline":1,"node":"4342:4306"},
      {"name":"Context=Content Area, State=Idle, On=False, Window Active=False","width":20,"height":20,"outline":2,"node":"4342:4308"},
      {"name":"Context=Over-glass, State=Disabled, On=False, Window Active=False","width":20,"height":20,"outline":6,"node":"4342:4310"},
      {"name":"Context=Over-glass, State=Clicked, On=False, Window Active=False","width":20,"height":20,"outline":4,"node":"4342:4312"},
      {"name":"Context=Over-glass, State=Idle, On=False, Window Active=False","width":20,"height":20,"outline":7,"node":"4342:4314"},
      {"name":"Context=Content Area, State=Disabled, On=True, Window Active=True","width":20,"height":20,"outline":8,"node":"4342:4121"},
      {"name":"Context=Content Area, State=Clicked, On=True, Window Active=True","width":20,"height":20,"outline":1,"node":"4342:4123"},
      {"name":"Context=Content Area, State=Idle, On=True, Window Active=True","width":20,"height":20,"outline":9,"node":"4342:4125"},
      {"name":"Context=Over-glass, State=Disabled, On=True, Window Active=True","width":20,"height":20,"outline":10,"node":"4342:4127"},
      {"name":"Context=Over-glass, State=Clicked, On=True, Window Active=True","width":20,"height":20,"outline":4,"node":"4342:4130"},
      {"name":"Context=Over-glass, State=Idle, On=True, Window Active=True","width":20,"height":20,"outline":9,"node":"4342:4132"},
      {"name":"Context=Content Area, State=Disabled, On=False, Window Active=True","width":20,"height":20,"outline":8,"node":"4342:4134"},
      {"name":"Context=Content Area, State=Clicked, On=False, Window Active=True","width":20,"height":20,"outline":1,"node":"4342:4135"},
      {"name":"Context=Content Area, State=Idle, On=False, Window Active=True","width":20,"height":20,"outline":9,"node":"4342:4136"},
      {"name":"Context=Over-glass, State=Disabled, On=False, Window Active=True","width":20,"height":20,"outline":11,"node":"4342:4137"},
      {"name":"Context=Over-glass, State=Clicked, On=False, Window Active=True","width":20,"height":20,"outline":4,"node":"4342:4138"},
      {"name":"Context=Over-glass, State=Idle, On=False, Window Active=True","width":20,"height":20,"outline":9,"node":"4342:4139"}
     ]
    },
    {
     "id": "kit-control-bg-controls",
     "name": "_Control BG/Controls",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-glass"
       ]
      },
      {
       "name": "On",
       "values": [
        "False",
        "True"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, Context=Over-glass, State=Disabled, On=True","width":20,"height":20,"outline":0,"node":"4336:14953"},
      {"name":"Active=False, Context=Over-glass, State=Clicked, On=True","width":20,"height":20,"outline":1,"node":"4336:14961"},
      {"name":"Active=False, Context=Over-glass, State=Idle, On=True","width":20,"height":20,"outline":2,"node":"4336:14969"},
      {"name":"Active=False, Context=Over-glass, State=Disabled, On=False","width":20,"height":20,"outline":3,"node":"4336:14977"},
      {"name":"Active=False, Context=Over-glass, State=Clicked, On=False","width":20,"height":20,"outline":4,"node":"4336:14985"},
      {"name":"Active=False, Context=Over-glass, State=Idle, On=False","width":20,"height":20,"outline":5,"node":"4336:14993"},
      {"name":"Active=False, Context=Content Area, State=Disabled, On=True","width":20,"height":20,"outline":6,"node":"4336:15000"},
      {"name":"Active=False, Context=Content Area, State=Clicked, On=True","width":20,"height":20,"outline":7,"node":"4336:15006"},
      {"name":"Active=False, Context=Content Area, State=Idle, On=True","width":20,"height":20,"outline":8,"node":"4336:15012"},
      {"name":"Active=False, Context=Content Area, State=Disabled, On=False","width":20,"height":20,"outline":6,"node":"4336:15017"},
      {"name":"Active=False, Context=Content Area, State=Clicked, On=False","width":20,"height":20,"outline":9,"node":"4336:15022"},
      {"name":"Active=False, Context=Content Area, State=Idle, On=False","width":20,"height":20,"outline":10,"node":"4336:15026"},
      {"name":"Active=True, Context=Over-glass, State=Disabled, On=True","width":20,"height":20,"outline":11,"node":"4336:14949"},
      {"name":"Active=True, Context=Over-glass, State=Clicked, On=True","width":20,"height":20,"outline":12,"node":"4336:14957"},
      {"name":"Active=True, Context=Over-glass, State=Idle, On=True","width":20,"height":20,"outline":13,"node":"4336:14965"},
      {"name":"Active=True, Context=Over-glass, State=Disabled, On=False","width":20,"height":20,"outline":3,"node":"4336:14973"},
      {"name":"Active=True, Context=Over-glass, State=Clicked, On=False","width":20,"height":20,"outline":4,"node":"4336:14981"},
      {"name":"Active=True, Context=Over-glass, State=Idle, On=False","width":20,"height":20,"outline":5,"node":"4336:14989"},
      {"name":"Active=True, Context=Content Area, State=Disabled, On=True","width":20,"height":20,"outline":11,"node":"4336:14997"},
      {"name":"Active=True, Context=Content Area, State=Clicked, On=True","width":20,"height":20,"outline":12,"node":"4336:15003"},
      {"name":"Active=True, Context=Content Area, State=Idle, On=True","width":20,"height":20,"outline":14,"node":"4336:15009"},
      {"name":"Active=True, Context=Content Area, State=Disabled, On=False","width":20,"height":20,"outline":6,"node":"4336:15015"},
      {"name":"Active=True, Context=Content Area, State=Clicked, On=False","width":20,"height":20,"outline":9,"node":"4336:15020"},
      {"name":"Active=True, Context=Content Area, State=Idle, On=False","width":20,"height":20,"outline":10,"node":"4336:15024"}
     ]
    },
    {
     "id": "kit-tracks-unfilled",
     "name": "_Tracks - Unfilled",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Context",
       "values": [
        "Over-Glass",
        "Content Area"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, Context=Content Area, State=Disabled","width":20,"height":20,"outline":0,"node":"4338:10306"},
      {"name":"Active=False, Context=Content Area, State=Idle","width":20,"height":20,"outline":1,"node":"4338:10305"},
      {"name":"Active=True, Context=Content Area, State=Disabled","width":20,"height":20,"outline":1,"node":"4338:10297"},
      {"name":"Active=True, Context=Content Area, State=Clicked","width":20,"height":20,"outline":2,"node":"4338:10296"},
      {"name":"Active=True, Context=Content Area, State=Idle","width":20,"height":20,"outline":0,"node":"4338:10300"},
      {"name":"Active=False, Context=Over-Glass, State=Idle","width":20,"height":20,"outline":3,"node":"4338:10283"},
      {"name":"Active=True, Context=Over-Glass, State=Idle","width":20,"height":20,"outline":4,"node":"4338:10279"}
     ]
    },
    {
     "id": "kit-tracks-filled",
     "name": "_Tracks - Filled",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "Active",
       "values": [
        "True",
        "False"
       ]
      },
      {
       "name": "Context",
       "values": [
        "Over-Glass",
        "Content Area"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Clicked",
        "Disabled"
       ]
      }
     ],
     "variants": [
      {"name":"Active=False, Context=Content Area, State=Disabled","width":20,"height":20,"outline":0,"node":"4346:10493"},
      {"name":"Active=False, Context=Content Area, State=Idle","width":20,"height":20,"outline":1,"node":"4346:10494"},
      {"name":"Active=True, Context=Content Area, State=Disabled","width":20,"height":20,"outline":0,"node":"4346:10498"},
      {"name":"Active=True, Context=Content Area, State=Clicked","width":20,"height":20,"outline":2,"node":"4346:10499"},
      {"name":"Active=True, Context=Content Area, State=Idle","width":20,"height":20,"outline":3,"node":"4346:10500"},
      {"name":"Active=False, Context=Over-Glass, State=Disabled","width":20,"height":20,"outline":4,"node":"4346:10509"},
      {"name":"Active=False, Context=Over-Glass, State=Idle","width":20,"height":20,"outline":5,"node":"4346:10510"},
      {"name":"Active=True, Context=Over-Glass, State=Disabled","width":20,"height":20,"outline":4,"node":"4346:10512"},
      {"name":"Active=True, Context=Over-Glass, State=Clicked","width":20,"height":20,"outline":6,"node":"4346:10513"},
      {"name":"Active=True, Context=Over-Glass, State=Idle","width":20,"height":20,"outline":7,"node":"4346:10514"}
     ]
    },
    {
     "id": "kit-ticks",
     "name": "_Ticks",
     "page": "_Kit",
     "helper": true,
     "variant_props": [
      {
       "name": "Context",
       "values": [
        "Content Area",
        "Over-Glass"
       ]
      },
      {
       "name": "State",
       "values": [
        "Idle",
        "Disabled"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Tick",
        "Centerpoint"
       ]
      }
     ],
     "variants": [
      {"name":"Context=Content Area, State=Idle, Type=Centerpoint","width":20,"height":20,"outline":0,"node":"4338:10304"},
      {"name":"Context=Content Area, State=Disabled, Type=Centerpoint","width":20,"height":20,"outline":1,"node":"4352:15474"},
      {"name":"Context=Content Area, State=Disabled, Type=Tick","width":20,"height":20,"outline":1,"node":"4338:10302"},
      {"name":"Context=Content Area, State=Idle, Type=Tick","width":20,"height":20,"outline":2,"node":"4338:10301"},
      {"name":"Context=Over-Glass, State=Idle, Type=Centerpoint","width":20,"height":20,"outline":3,"node":"4338:10278"},
      {"name":"Context=Over-Glass, State=Disabled, Type=Centerpoint","width":20,"height":20,"outline":4,"node":"4352:15475"},
      {"name":"Context=Over-Glass, State=Disabled, Type=Tick","width":20,"height":20,"outline":4,"node":"4338:10282"},
      {"name":"Context=Over-Glass, State=Idle, Type=Tick","width":20,"height":20,"outline":5,"node":"4338:10280"}
     ]
    }
   ]
  },
  {
   "id": "watchos",
   "name": "watchOS 26",
   "pages": [
    "Colors and Materials",
    "Text Styles and Dynamic Type",
    "Layout Grid",
    "Examples",
    "Activity Rings",
    "Alerts, Action sheets, Errors",
    "Buttons",
    "Lists",
    "Navigation Bars",
    "Notifications",
    "Pickers",
    "Progress Indicators",
    "Scrollbar and Tabs",
    "Sliders",
    "Smart Stack (Widgets)",
    "Toggles",
    "_Kit Helpers"
   ],
   "drawings": 0,
   "components": [
    {
     "id": "colors-and-materials-swatch-grid",
     "name": "_Swatch Grid",
     "page": "Colors and Materials",
     "helper": true,
     "props": [
      {
       "name": "Group",
       "type": "text",
       "default": "\"Backgrounds\""
      }
     ],
     "variants": [
      {"name":"","width":659,"height":250,"outline":0,"node":"8512:8279"}
     ],
     "uses": [
      "colors-and-materials-swatch"
     ]
    },
    {
     "id": "colors-and-materials-swatch",
     "name": "_Swatch",
     "page": "Colors and Materials",
     "helper": true,
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Label",
        "Color"
       ]
      }
     ],
     "props": [
      {
       "name": "Color",
       "type": "text",
       "default": "\"Color\""
      }
     ],
     "variants": [
      {"name":"Type=Label","width":100,"height":100,"outline":0,"node":"8512:8318"},
      {"name":"Type=Color","width":100,"height":100,"outline":1,"node":"8512:8323"}
     ]
    },
    {
     "id": "colors-and-materials-swatch-light-dark-vibrant",
     "name": "_Swatch - Light and Dark - Vibrant",
     "page": "Colors and Materials",
     "helper": true,
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"8512:9625"}
     ]
    },
    {
     "id": "colors-and-materials-swatch-light-dark",
     "name": "_Swatch - Light and Dark",
     "page": "Colors and Materials",
     "helper": true,
     "variants": [
      {"name":"","width":160,"height":160,"outline":0,"node":"8512:8303"}
     ]
    },
    {
     "id": "layout-grid-display-mask-49mm",
     "name": "Display-Mask-49mm",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6432:2964"}
     ]
    },
    {
     "id": "layout-grid-display-mask-46mm",
     "name": "Display-Mask-46mm",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":208,"height":248,"outline":0,"node":"6432:2965"}
     ]
    },
    {
     "id": "layout-grid-display-mask-44mm",
     "name": "Display-Mask-44mm",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":184,"height":224,"outline":0,"node":"6432:2966"}
     ]
    },
    {
     "id": "layout-grid-display-mask-42mm",
     "name": "Display-Mask-42mm",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":187,"height":223,"outline":0,"node":"6432:2967"}
     ]
    },
    {
     "id": "layout-grid-display-mask-40mm",
     "name": "Display-Mask-40mm",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"6432:2968"}
     ]
    },
    {
     "id": "layout-grid-40mm-pinned-pill-button",
     "name": "Grid/40mm/Pinned Pill Button",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"6433:2821"}
     ]
    },
    {
     "id": "layout-grid-42mm-pinned-pill-button",
     "name": "Grid/42mm/Pinned Pill Button",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":187,"height":223,"outline":0,"node":"6433:2822"}
     ]
    },
    {
     "id": "layout-grid-44mm-pinned-pill-button",
     "name": "Grid/44mm/Pinned Pill Button",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":184,"height":224,"outline":0,"node":"6433:2823"}
     ]
    },
    {
     "id": "layout-grid-46mm-pinned-pill-button",
     "name": "Grid/46mm/Pinned Pill Button",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":208,"height":248,"outline":0,"node":"6433:2824"}
     ]
    },
    {
     "id": "layout-grid-49mm-pinned-pill-button",
     "name": "Grid/49mm/Pinned Pill Button",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6433:2825"}
     ]
    },
    {
     "id": "layout-grid-40mm-three-bottom-buttons",
     "name": "Grid/40mm/Three Bottom Buttons",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"6433:2555"}
     ]
    },
    {
     "id": "layout-grid-42mm-three-bottom-buttons",
     "name": "Grid/42mm/Three Bottom Buttons",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":187,"height":223,"outline":0,"node":"6433:2554"}
     ]
    },
    {
     "id": "layout-grid-44mm-three-bottom-buttons",
     "name": "Grid/44mm/Three Bottom Buttons",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":184,"height":224,"outline":0,"node":"6433:2553"}
     ]
    },
    {
     "id": "layout-grid-46mm-three-bottom-buttons",
     "name": "Grid/46mm/Three Bottom Buttons",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":208,"height":248,"outline":0,"node":"6433:2552"}
     ]
    },
    {
     "id": "layout-grid-49mm-three-bottom-buttons",
     "name": "Grid/49mm/Three Bottom Buttons",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6433:2551"}
     ]
    },
    {
     "id": "layout-grid-40mm-list",
     "name": "Grid/40mm/List",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"6433:2359"}
     ]
    },
    {
     "id": "layout-grid-42mm-list",
     "name": "Grid/42mm/List",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":187,"height":223,"outline":0,"node":"6433:2360"}
     ]
    },
    {
     "id": "layout-grid-44mm-list",
     "name": "Grid/44mm/List",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":184,"height":224,"outline":0,"node":"6433:2361"}
     ]
    },
    {
     "id": "layout-grid-46mm-list",
     "name": "Grid/46mm/List",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":208,"height":248,"outline":0,"node":"6433:2358"}
     ]
    },
    {
     "id": "layout-grid-49mm-list",
     "name": "Grid/49mm/List",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6433:2357"}
     ]
    },
    {
     "id": "layout-grid-40mm-infographic",
     "name": "Grid/40mm/Infographic",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"6433:1860"}
     ]
    },
    {
     "id": "layout-grid-42mm-infographic",
     "name": "Grid/42mm/Infographic",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":187,"height":223,"outline":0,"node":"6433:1859"}
     ]
    },
    {
     "id": "layout-grid-44mm-infographic",
     "name": "Grid/44mm/Infographic",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":184,"height":224,"outline":0,"node":"6433:1858"}
     ]
    },
    {
     "id": "layout-grid-46mm-infographic",
     "name": "Grid/46mm/Infographic",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":208,"height":248,"outline":0,"node":"6433:1857"}
     ]
    },
    {
     "id": "layout-grid-49mm-infographic",
     "name": "Grid/49mm/Infographic",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6433:1856"}
     ]
    },
    {
     "id": "layout-grid-40mm-dial-based",
     "name": "Grid/40mm/Dial-based",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"6432:4136"}
     ]
    },
    {
     "id": "layout-grid-42mm-dial-based",
     "name": "Grid/42mm/Dial-based",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":187,"height":223,"outline":0,"node":"6432:4135"}
     ]
    },
    {
     "id": "layout-grid-44mm-dial-based",
     "name": "Grid/44mm/Dial-based",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":184,"height":224,"outline":0,"node":"6432:4134"}
     ]
    },
    {
     "id": "layout-grid-46mm-dial-based",
     "name": "Grid/46mm/Dial-based",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":208,"height":248,"outline":0,"node":"6432:4133"}
     ]
    },
    {
     "id": "layout-grid-49mm-dial-based",
     "name": "Grid/49mm/Dial-based",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6432:4132"}
     ]
    },
    {
     "id": "layout-grid-40mm-foundation",
     "name": "Grid/40mm/Foundation",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"6432:4037"}
     ]
    },
    {
     "id": "layout-grid-42mm-foundation",
     "name": "Grid/42mm/Foundation",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":187,"height":223,"outline":0,"node":"6432:4078"}
     ]
    },
    {
     "id": "layout-grid-44mm-foundation",
     "name": "Grid/44mm/Foundation",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":184,"height":224,"outline":0,"node":"6432:4079"}
     ]
    },
    {
     "id": "layout-grid-46mm-foundation",
     "name": "Grid/46mm/Foundation",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":208,"height":248,"outline":0,"node":"6432:4081"}
     ]
    },
    {
     "id": "layout-grid-49mm-foundation",
     "name": "Grid/49mm/Foundation",
     "page": "Layout Grid",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6432:4080"}
     ]
    },
    {
     "id": "examples-example-smart-stack-widgets",
     "name": "Example/Smart Stack (Widgets)",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6556:11990"}
     ],
     "uses": [
      "smart-stack-widgets"
     ]
    },
    {
     "id": "examples-example-toggles",
     "name": "Example/Toggles",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6556:10825"}
     ],
     "uses": [
      "navigation-bars-bar",
      "toggles-toggle"
     ]
    },
    {
     "id": "examples-example-sliders",
     "name": "Example/Sliders",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6556:10827"}
     ],
     "uses": [
      "sliders-slider",
      "navigation-bars-bar"
     ]
    },
    {
     "id": "examples-example-scrollbars",
     "name": "Example/Scrollbars",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6556:10828"}
     ],
     "uses": [
      "navigation-bars-bar",
      "scrollbar-and-tabs-2"
     ]
    },
    {
     "id": "examples-example-progress-indicators",
     "name": "Example/Progress Indicators",
     "page": "Examples",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Inline Table Row",
        "Content Area"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Content Area","width":205,"height":251,"outline":0,"node":"6556:11780"},
      {"name":"Type=Inline Table Row","width":205,"height":251,"outline":1,"node":"6556:10829"}
     ],
     "uses": [
      "progress-indicators-indicator",
      "navigation-bars-bar"
     ]
    },
    {
     "id": "examples-example-pickers",
     "name": "Example/Pickers",
     "page": "Examples",
     "variant_props": [
      {
       "name": "Wheels",
       "values": [
        "1",
        "2",
        "3",
        "3 (Mixed Widths)"
       ]
      }
     ],
     "variants": [
      {"name":"Wheels=3 (Mixed Widths)","width":205,"height":251,"outline":0,"node":"6556:12400"},
      {"name":"Wheels=3","width":205,"height":251,"outline":1,"node":"6556:12405"},
      {"name":"Wheels=2","width":205,"height":251,"outline":2,"node":"6556:12384"},
      {"name":"Wheels=1","width":205,"height":251,"outline":3,"node":"6556:10826"}
     ],
     "uses": [
      "navigation-bars-bar",
      "pickers-picker",
      "buttons-button-pill"
     ]
    },
    {
     "id": "examples-example-page-controls",
     "name": "Example/Page Controls",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6556:10247"}
     ],
     "uses": [
      "scrollbar-and-tabs",
      "navigation-bars-bar"
     ]
    },
    {
     "id": "examples-example-notifications",
     "name": "Example/Notifications",
     "page": "Examples",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Banner",
        "Short Look",
        "Long Look"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Long Look","width":205,"height":251,"outline":0,"node":"6556:7440"},
      {"name":"Type=Short Look","width":205,"height":251,"outline":1,"node":"6556:7422"},
      {"name":"Type=Banner","width":205,"height":251,"outline":2,"node":"6556:7430"}
     ],
     "uses": [
      "kit-helpers-watch-faces",
      "notifications-long-look",
      "notifications-short-look",
      "navigation-bars-bar",
      "lists-item-source-list",
      "buttons-button-circular",
      "notifications-banner"
     ]
    },
    {
     "id": "examples-example-navigation-bars",
     "name": "Example/Navigation Bars",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6512:5819"}
     ],
     "uses": [
      "navigation-bars-bar"
     ]
    },
    {
     "id": "examples-example-lists",
     "name": "Example/Lists",
     "page": "Examples",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Grouped List Items",
        "Colorful",
        "Menu",
        "Workout"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Workout","width":205,"height":251,"outline":0,"node":"6512:4246"},
      {"name":"Type=Menu","width":205,"height":251,"outline":1,"node":"6512:4245"},
      {"name":"Type=Colorful","width":205,"height":251,"outline":2,"node":"6512:4243"},
      {"name":"Type=Grouped List Items","width":205,"height":251,"outline":3,"node":"6512:4242"}
     ],
     "uses": [
      "navigation-bars-bar",
      "lists-item-carousel",
      "lists-item-linked-tableview",
      "lists-item-source-list",
      "buttons-button-circular",
      "lists-header",
      "lists-item",
      "lists-footer"
     ]
    },
    {
     "id": "examples-example-errors",
     "name": "Example/Errors",
     "page": "Examples",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Title only",
        "Title + Description",
        "Description only",
        "Symbol + Description",
        "Title with Close button"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Title with Close button","width":205,"height":251,"outline":0,"node":"6512:3580"},
      {"name":"Type=Symbol + Description","width":205,"height":251,"outline":1,"node":"6512:3579"},
      {"name":"Type=Description only","width":205,"height":251,"outline":2,"node":"6512:3578"},
      {"name":"Type=Title + Description","width":205,"height":251,"outline":3,"node":"6512:3577"},
      {"name":"Type=Title only","width":205,"height":251,"outline":4,"node":"6512:3576"}
     ],
     "uses": [
      "alerts-action-sheets-errors-example"
     ]
    },
    {
     "id": "examples-example-buttons",
     "name": "Example/Buttons",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6511:3286"}
     ],
     "uses": [
      "buttons-button-pill",
      "buttons-button-circular",
      "buttons-button-petite",
      "navigation-bars-bar"
     ]
    },
    {
     "id": "examples-example-alerts",
     "name": "Example/Alerts",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6504:3319"}
     ],
     "uses": [
      "kit-helpers-watch-faces",
      "alerts-action-sheets-errors-alert"
     ]
    },
    {
     "id": "examples-action-sheets",
     "name": "Examples/Action Sheets",
     "page": "Examples",
     "variants": [
      {"name":"","width":205,"height":251,"outline":0,"node":"6511:3020"}
     ],
     "uses": [
      "kit-helpers-watch-faces",
      "alerts-action-sheets-errors-sheet"
     ]
    },
    {
     "id": "activity-rings",
     "name": "Activity Rings",
     "page": "Activity Rings",
     "variants": [
      {"name":"","width":66,"height":66,"outline":0,"node":"6556:17727"}
     ]
    },
    {
     "id": "alerts-action-sheets-errors-example",
     "name": "Example",
     "page": "Alerts, Action sheets, Errors",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Title",
        "Title + Description",
        "Description Only",
        "Symbol + Description",
        "Title with Close Button"
       ]
      }
     ],
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Cannot Connect to server\""
      },
      {
       "name": "Desscription",
       "type": "text",
       "default": "\"Something went wrong. Please try again.\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol exclamationmark.triangle"
      }
     ],
     "variants": [
      {"name":"Type=Title with Close Button","width":162,"height":197,"outline":0,"node":"6549:3782"},
      {"name":"Type=Symbol + Description","width":162,"height":197,"outline":1,"node":"6549:3784"},
      {"name":"Type=Description Only","width":162,"height":197,"outline":2,"node":"6549:3788"},
      {"name":"Type=Title + Description","width":162,"height":197,"outline":3,"node":"6549:3786"},
      {"name":"Type=Title","width":162,"height":197,"outline":4,"node":"6549:3780"}
     ],
     "uses": [
      "kit-helpers-watch-faces",
      "navigation-bars-bar"
     ]
    },
    {
     "id": "alerts-action-sheets-errors-sheet",
     "name": "Action Sheet",
     "page": "Alerts, Action sheets, Errors",
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"6479:2670"}
     ],
     "uses": [
      "navigation-bars-bar",
      "buttons-button-pill"
     ]
    },
    {
     "id": "alerts-action-sheets-errors-alert",
     "name": "Alert",
     "page": "Alerts, Action sheets, Errors",
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Messages",
       "type": "text",
       "default": "\"The content of the notification goes he…\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":227,"outline":0,"node":"6479:2221"}
     ],
     "uses": [
      "navigation-bars-bar",
      "buttons-button-pill"
     ]
    },
    {
     "id": "buttons-button-pill",
     "name": "Button - Pill",
     "page": "Buttons",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Default",
        "Secondary",
        "Tertiary",
        "Destructive",
        "Default Floating",
        "Primary Floating",
        "Primary",
        "Destructive Floating"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Action\""
      }
     ],
     "variants": [
      {"name":"Type=Destructive Floating","width":162,"height":44,"outline":0,"node":"8410:1182"},
      {"name":"Type=Destructive","width":162,"height":44,"outline":1,"node":"4410:4443"},
      {"name":"Type=Tertiary","width":162,"height":44,"outline":2,"node":"4410:4441"},
      {"name":"Type=Secondary","width":162,"height":44,"outline":3,"node":"4410:4439"},
      {"name":"Type=Primary Floating","width":162,"height":44,"outline":4,"node":"8404:654"},
      {"name":"Type=Primary","width":162,"height":44,"outline":5,"node":"4410:4437"},
      {"name":"Type=Default Floating","width":162,"height":44,"outline":6,"node":"8403:511"},
      {"name":"Type=Default","width":162,"height":44,"outline":3,"node":"4410:4435"}
     ]
    },
    {
     "id": "buttons-button-pay",
     "name": "Button - Pay",
     "page": "Buttons",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Small",
        "Full width"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Buy with\""
      }
     ],
     "variants": [
      {"name":"Size=Small","width":162,"height":45,"outline":0,"node":"6417:4281"},
      {"name":"Size=Full width","width":162,"height":45,"outline":1,"node":"6417:4287"}
     ]
    },
    {
     "id": "buttons-button-petite",
     "name": "Button - Petite",
     "page": "Buttons",
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Action\""
      }
     ],
     "variants": [
      {"name":"","width":143,"height":26.5,"outline":0,"node":"4413:227"}
     ]
    },
    {
     "id": "buttons-button-corner",
     "name": "Button - Corner",
     "page": "Buttons",
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "SF Symbol xmark"
      }
     ],
     "variants": [
      {"name":"","width":30,"height":30,"outline":0,"node":"4414:134"}
     ]
    },
    {
     "id": "buttons-button-circular",
     "name": "Button - Circular",
     "page": "Buttons",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Default",
        "Primary",
        "Primary Floating",
        "Default Floating"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "SF Symbol plus"
      }
     ],
     "variants": [
      {"name":"Type=Primary Floating","width":39.5,"height":39.5,"outline":0,"node":"8410:1186"},
      {"name":"Type=Primary","width":39.5,"height":39.5,"outline":1,"node":"4412:29832"},
      {"name":"Type=Default Floating","width":39.5,"height":39.5,"outline":2,"node":"8410:1189"},
      {"name":"Type=Default","width":39.5,"height":39.5,"outline":3,"node":"4412:29830"}
     ]
    },
    {
     "id": "lists-footer",
     "name": "Footer",
     "page": "Lists",
     "props": [
      {
       "name": "Text",
       "type": "text",
       "default": "\"Section footer\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":15,"outline":0,"node":"517:38055"}
     ]
    },
    {
     "id": "lists-header",
     "name": "Header",
     "page": "Lists",
     "props": [
      {
       "name": "Text",
       "type": "text",
       "default": "\"Section Header\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":16,"outline":0,"node":"517:38061"}
     ]
    },
    {
     "id": "lists-item",
     "name": "Item",
     "page": "Lists",
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "Text",
       "values": [
        "Default",
        "Subtitle + Title",
        "Label + Subtitle",
        "Label + Symbol",
        "3-Line Label + Symbol"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Symbol - Leading",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Symbol - Trailing",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Bold Text",
       "type": "text",
       "default": "\"Bold Text\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol location.fill"
      }
     ],
     "variants": [
      {"name":"Text=3-Line Label + Symbol","width":162,"height":62.5,"outline":0,"node":"6412:1752"},
      {"name":"Text=Label + Symbol","width":162,"height":43.5,"outline":1,"node":"6412:1739"},
      {"name":"Text=Subtitle + Title","width":162,"height":44.5,"outline":2,"node":"6402:15471"},
      {"name":"Text=Label + Subtitle","width":162,"height":44.5,"outline":3,"node":"6402:23265"},
      {"name":"Text=Default","width":162,"height":43.5,"outline":4,"node":"550:50627"}
     ]
    },
    {
     "id": "lists-item-source-list",
     "name": "Item - Source List",
     "page": "Lists",
     "variant_props": [
      {
       "name": "Scroll State",
       "values": [
        "Full View",
        "Partially Clipped"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol location.fill"
      },
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Large Text",
       "type": "text",
       "default": "\"67º\""
      },
      {
       "name": "Show Subtitle",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Show Symbol",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Scroll State=Partially Clipped","width":162,"height":74.5,"outline":0,"node":"6442:4331"},
      {"name":"Scroll State=Full View","width":162,"height":74.5,"outline":1,"node":"6412:1788"}
     ]
    },
    {
     "id": "lists-item-carousel",
     "name": "Item - Carousel",
     "page": "Lists",
     "variant_props": [
      {
       "name": "Scroll State",
       "values": [
        "Full View",
        "Partially Clipped"
       ]
      },
      {
       "name": "Tinted",
       "values": [
        "True",
        "False"
       ]
      }
     ],
     "props": [
      {
       "name": "Subtitle",
       "type": "text",
       "default": "\"Subtitle\""
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol figure.outdoor.cycle"
      }
     ],
     "variants": [
      {"name":"Scroll State=Partially Clipped, Tinted=False","width":162,"height":91.5,"outline":0,"node":"6442:4341"},
      {"name":"Scroll State=Full View, Tinted=False","width":162,"height":91.5,"outline":1,"node":"6442:2287"},
      {"name":"Scroll State=Partially Clipped, Tinted=True","width":162,"height":91.5,"outline":2,"node":"6442:5422"},
      {"name":"Scroll State=Full View, Tinted=True","width":162,"height":91.5,"outline":3,"node":"6442:5431"}
     ]
    },
    {
     "id": "lists-item-linked-tableview",
     "name": "Item - Linked Tableview",
     "page": "Lists",
     "props": [
      {
       "name": "Show Checkmark",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":43.5,"outline":0,"node":"6442:4783"}
     ]
    },
    {
     "id": "navigation-bars-button-text",
     "name": "_Button - Text",
     "page": "Navigation Bars",
     "helper": true,
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Done\""
      }
     ],
     "variants": [
      {"name":"","width":53,"height":30,"outline":0,"node":"4405:258"}
     ]
    },
    {
     "id": "navigation-bars-bar",
     "name": "Navigation Bar",
     "page": "Navigation Bars",
     "variant_props": [
      {
       "name": "Type",
       "values": [
        "Status Bar",
        "Status + Title",
        "Status + Large Title",
        "Center Aligned",
        "Child - Status + Title",
        "Modal - Default",
        "Modal - 1 Control",
        "Modal - Text Confirm Button",
        "Modal - Text Buttons"
       ]
      }
     ],
     "props": [
      {
       "name": "Time",
       "type": "text",
       "default": "\"10:09\""
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      }
     ],
     "variants": [
      {"name":"Type=Modal - Text Buttons","width":162,"height":47.5,"outline":0,"node":"4403:29988"},
      {"name":"Type=Modal - Text Confirm Button","width":162,"height":47.5,"outline":1,"node":"4403:29997"},
      {"name":"Type=Modal - 1 Control","width":162,"height":47.5,"outline":2,"node":"4403:30003"},
      {"name":"Type=Modal - Default","width":162,"height":47.5,"outline":3,"node":"4403:30007"},
      {"name":"Type=Child - Status + Title","width":162,"height":47.5,"outline":4,"node":"4403:30012"},
      {"name":"Type=Center Aligned","width":162,"height":47.5,"outline":5,"node":"4403:30018"},
      {"name":"Type=Status + Large Title","width":162,"height":47.5,"outline":6,"node":"4403:30025"},
      {"name":"Type=Status + Title","width":162,"height":47.5,"outline":7,"node":"4403:30029"},
      {"name":"Type=Status Bar","width":162,"height":32.5,"outline":8,"node":"4407:4463"}
     ],
     "uses": [
      "navigation-bars-button-text",
      "buttons-button-corner"
     ]
    },
    {
     "id": "notifications-short-look",
     "name": "Notifications - Short Look",
     "page": "Notifications",
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Preview",
       "type": "text",
       "default": "\"Preview of Notification Content. Max 2 …\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"4415:14540"}
     ]
    },
    {
     "id": "notifications-long-look",
     "name": "Notifications - Long Look",
     "page": "Notifications",
     "props": [
      {
       "name": "Show Button 3",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Button 2",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Details",
       "type": "text",
       "default": "\"The content of the notification goes he…\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":197,"outline":0,"node":"4416:1523"}
     ],
     "uses": [
      "buttons-button-pill"
     ]
    },
    {
     "id": "notifications-banner",
     "name": "Notifications - Banner",
     "page": "Notifications",
     "props": [
      {
       "name": "Title",
       "type": "text",
       "default": "\"Title\""
      },
      {
       "name": "Description",
       "type": "text",
       "default": "\"Description\""
      }
     ],
     "variants": [
      {"name":"","width":162,"height":45.5,"outline":0,"node":"4416:828"}
     ]
    },
    {
     "id": "pickers-picker",
     "name": "Picker",
     "page": "Pickers",
     "variant_props": [
      {
       "name": "Selected",
       "values": [
        "1",
        "2",
        "3",
        "None"
       ]
      },
      {
       "name": "Values",
       "values": [
        "1",
        "2",
        "3",
        "3 (mixed widths)"
       ]
      }
     ],
     "props": [
      {
       "name": "Show Label",
       "type": "bool",
       "default": "on"
      }
     ],
     "variants": [
      {"name":"Values=3 (mixed widths), Selected=3","width":158,"height":97,"outline":0,"node":"6446:1844"},
      {"name":"Values=3 (mixed widths), Selected=2","width":158,"height":97,"outline":1,"node":"6446:1728"},
      {"name":"Values=3 (mixed widths), Selected=1","width":158,"height":97,"outline":2,"node":"6445:5814"},
      {"name":"Values=3 (mixed widths), Selected=None","width":158,"height":75,"outline":3,"node":"6446:1989"},
      {"name":"Values=3, Selected=2","width":158,"height":97,"outline":4,"node":"6446:1738"},
      {"name":"Values=3, Selected=1","width":158,"height":97,"outline":5,"node":"6445:5808"},
      {"name":"Values=3, Selected=3","width":158,"height":97,"outline":6,"node":"6446:1854"},
      {"name":"Values=3, Selected=None","width":158,"height":75,"outline":7,"node":"6446:1999"},
      {"name":"Values=2, Selected=2","width":143,"height":97,"outline":8,"node":"6446:1650"},
      {"name":"Values=2, Selected=1","width":143,"height":97,"outline":9,"node":"6445:5802"},
      {"name":"Values=2, Selected=None","width":143,"height":75,"outline":10,"node":"6446:2011"},
      {"name":"Values=1, Selected=1","width":143,"height":97,"outline":11,"node":"6445:1803"},
      {"name":"Values=1, Selected=None","width":143,"height":75,"outline":12,"node":"6446:2019"}
     ],
     "uses": [
      "pickers-wheels",
      "pickers-edit-label"
     ]
    },
    {
     "id": "pickers-wheels",
     "name": "_Wheels",
     "page": "Pickers",
     "helper": true,
     "variant_props": [
      {
       "name": "State",
       "values": [
        "Default",
        "Focused"
       ]
      }
     ],
     "props": [
      {
       "name": "Next",
       "type": "text",
       "default": "\"3\""
      },
      {
       "name": "Before",
       "type": "text",
       "default": "\"1\""
      },
      {
       "name": "Current",
       "type": "text",
       "default": "\"2\""
      }
     ],
     "variants": [
      {"name":"State=Default","width":100,"height":100,"outline":0,"node":"6445:1653"},
      {"name":"State=Focused","width":100,"height":100,"outline":1,"node":"6445:1773"}
     ]
    },
    {
     "id": "pickers-edit-label",
     "name": "_Edit Label",
     "page": "Pickers",
     "helper": true,
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"","width":50,"height":20,"outline":0,"node":"6445:6516"}
     ]
    },
    {
     "id": "progress-indicators-indicator",
     "name": "Progress Indicator",
     "page": "Progress Indicators",
     "hig": "progress-indicators",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "Small (Status Bar)",
        "Medium (Table Row)",
        "Large (Content Area)"
       ]
      }
     ],
     "variants": [
      {"name":"Size=Small (Status Bar)","width":10,"height":10,"outline":0,"node":"9:56632"},
      {"name":"Size=Medium (Table Row)","width":15,"height":15,"outline":1,"node":"4416:6341"},
      {"name":"Size=Large (Content Area)","width":29,"height":29,"outline":2,"node":"40:58444"}
     ],
     "uses": [
      "progress-indicators-spinner"
     ]
    },
    {
     "id": "progress-indicators-spinner",
     "name": "_Spinner",
     "page": "Progress Indicators",
     "helper": true,
     "variants": [
      {"name":"","width":122,"height":122,"outline":0,"node":"4416:6323"}
     ]
    },
    {
     "id": "scrollbar-and-tabs",
     "name": "Tabs",
     "page": "Scrollbar and Tabs",
     "hig": "page-controls",
     "variant_props": [
      {
       "name": "Pages",
       "values": [
        "2",
        "3",
        "4"
       ]
      },
      {
       "name": "Position",
       "values": [
        "1",
        "2",
        "3",
        "4"
       ]
      }
     ],
     "variants": [
      {"name":"Pages=4, Position=4","width":10,"height":197,"outline":0,"node":"6436:1164"},
      {"name":"Pages=4, Position=3","width":10,"height":197,"outline":1,"node":"6436:1170"},
      {"name":"Pages=4, Position=2","width":10,"height":197,"outline":2,"node":"6436:1176"},
      {"name":"Pages=4, Position=1","width":10,"height":197,"outline":3,"node":"6436:1182"},
      {"name":"Pages=3, Position=3","width":10,"height":197,"outline":4,"node":"6436:1188"},
      {"name":"Pages=3, Position=2","width":10,"height":197,"outline":5,"node":"6436:1193"},
      {"name":"Pages=3, Position=1","width":10,"height":197,"outline":6,"node":"6436:1198"},
      {"name":"Pages=2, Position=2","width":10,"height":197,"outline":7,"node":"6436:1203"},
      {"name":"Pages=2, Position=1","width":10,"height":197,"outline":8,"node":"6436:1207"}
     ]
    },
    {
     "id": "scrollbar-and-tabs-2",
     "name": "Scrollbar",
     "page": "Scrollbar and Tabs",
     "hig": "page-controls",
     "variant_props": [
      {
       "name": "Position",
       "values": [
        "1",
        "2",
        "3",
        "4"
       ]
      },
      {
       "name": "Scroll View Height",
       "values": [
        "200%",
        "300%",
        "400%"
       ]
      }
     ],
     "variants": [
      {"name":"Scroll View Height=400%, Position=4","width":10,"height":197,"outline":0,"node":"488:54906"},
      {"name":"Scroll View Height=400%, Position=3","width":10,"height":197,"outline":1,"node":"488:54912"},
      {"name":"Scroll View Height=400%, Position=2","width":10,"height":197,"outline":2,"node":"488:54918"},
      {"name":"Scroll View Height=400%, Position=1","width":10,"height":197,"outline":3,"node":"488:54924"},
      {"name":"Scroll View Height=300%, Position=3","width":10,"height":197,"outline":4,"node":"488:54930"},
      {"name":"Scroll View Height=300%, Position=2","width":10,"height":197,"outline":5,"node":"488:54935"},
      {"name":"Scroll View Height=300%, Position=1","width":10,"height":197,"outline":6,"node":"488:54940"},
      {"name":"Scroll View Height=200%, Position=2","width":10,"height":197,"outline":7,"node":"488:54945"},
      {"name":"Scroll View Height=200%, Position=1","width":10,"height":197,"outline":8,"node":"488:54949"}
     ]
    },
    {
     "id": "sliders-slider",
     "name": "Slider",
     "page": "Sliders",
     "hig": "lists-and-tables",
     "variant_props": [
      {
       "name": "Stops",
       "values": [
        "3",
        "4",
        "5",
        "6"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Continuous",
        "Segmented"
       ]
      },
      {
       "name": "Value",
       "values": [
        "1",
        "3",
        "6",
        "5",
        "4",
        "2"
       ]
      }
     ],
     "props": [
      {
       "name": "Symbol - Trailing",
       "type": "text",
       "default": "SF Symbol speaker.3.fill"
      },
      {
       "name": "Symbol - Leading",
       "type": "text",
       "default": "SF Symbol speaker.1.fill"
      }
     ],
     "variants": [
      {"name":"Type=Continuous, Stops=6, Value=6","width":162,"height":43.5,"outline":0,"node":"6414:2795"},
      {"name":"Type=Continuous, Stops=6, Value=5","width":162,"height":43.5,"outline":1,"node":"6414:2808"},
      {"name":"Type=Continuous, Stops=6, Value=4","width":162,"height":43.5,"outline":2,"node":"6414:2821"},
      {"name":"Type=Continuous, Stops=6, Value=3","width":162,"height":43.5,"outline":3,"node":"6414:2834"},
      {"name":"Type=Continuous, Stops=6, Value=2","width":162,"height":43.5,"outline":4,"node":"6414:2847"},
      {"name":"Type=Continuous, Stops=6, Value=1","width":162,"height":43.5,"outline":5,"node":"6414:2860"},
      {"name":"Type=Continuous, Stops=5, Value=5","width":162,"height":43.5,"outline":6,"node":"6414:2873"},
      {"name":"Type=Continuous, Stops=5, Value=4","width":162,"height":43.5,"outline":7,"node":"6414:2885"},
      {"name":"Type=Continuous, Stops=5, Value=3","width":162,"height":43.5,"outline":8,"node":"6414:2897"},
      {"name":"Type=Continuous, Stops=5, Value=2","width":162,"height":43.5,"outline":9,"node":"6414:2909"},
      {"name":"Type=Continuous, Stops=5, Value=1","width":162,"height":43.5,"outline":10,"node":"6414:2921"},
      {"name":"Type=Continuous, Stops=4, Value=4","width":162,"height":43.5,"outline":11,"node":"6414:2933"},
      {"name":"Type=Continuous, Stops=4, Value=3","width":162,"height":43.5,"outline":12,"node":"6414:2944"},
      {"name":"Type=Continuous, Stops=4, Value=2","width":162,"height":43.5,"outline":13,"node":"6414:2955"},
      {"name":"Type=Continuous, Stops=4, Value=1","width":162,"height":43.5,"outline":14,"node":"6414:2966"},
      {"name":"Type=Continuous, Stops=3, Value=3","width":162,"height":43.5,"outline":15,"node":"6414:2977"},
      {"name":"Type=Continuous, Stops=3, Value=2","width":162,"height":43.5,"outline":16,"node":"6414:2987"},
      {"name":"Type=Continuous, Stops=3, Value=1","width":162,"height":43.5,"outline":17,"node":"6414:2997"},
      {"name":"Type=Segmented, Stops=6, Value=6","width":162,"height":43.5,"outline":18,"node":"6414:2413"},
      {"name":"Type=Segmented, Stops=6, Value=5","width":162,"height":43.5,"outline":19,"node":"6414:2393"},
      {"name":"Type=Segmented, Stops=6, Value=4","width":162,"height":43.5,"outline":2,"node":"6414:2353"},
      {"name":"Type=Segmented, Stops=6, Value=3","width":162,"height":43.5,"outline":20,"node":"6414:2283"},
      {"name":"Type=Segmented, Stops=6, Value=2","width":162,"height":43.5,"outline":4,"node":"6414:2273"},
      {"name":"Type=Segmented, Stops=6, Value=1","width":162,"height":43.5,"outline":5,"node":"6414:2293"},
      {"name":"Type=Segmented, Stops=5, Value=5","width":162,"height":43.5,"outline":6,"node":"6414:2383"},
      {"name":"Type=Segmented, Stops=5, Value=4","width":162,"height":43.5,"outline":21,"node":"6414:2343"},
      {"name":"Type=Segmented, Stops=5, Value=3","width":162,"height":43.5,"outline":8,"node":"6414:2223"},
      {"name":"Type=Segmented, Stops=5, Value=2","width":162,"height":43.5,"outline":22,"node":"6414:2213"},
      {"name":"Type=Segmented, Stops=5, Value=1","width":162,"height":43.5,"outline":23,"node":"6414:2233"},
      {"name":"Type=Segmented, Stops=4, Value=4","width":162,"height":43.5,"outline":11,"node":"6414:2333"},
      {"name":"Type=Segmented, Stops=4, Value=3","width":162,"height":43.5,"outline":12,"node":"6414:2163"},
      {"name":"Type=Segmented, Stops=4, Value=2","width":162,"height":43.5,"outline":24,"node":"6414:2153"},
      {"name":"Type=Segmented, Stops=4, Value=1","width":162,"height":43.5,"outline":25,"node":"6414:2173"},
      {"name":"Type=Segmented, Stops=3, Value=3","width":162,"height":43.5,"outline":15,"node":"6414:2113"},
      {"name":"Type=Segmented, Stops=3, Value=2","width":162,"height":43.5,"outline":16,"node":"6414:2082"},
      {"name":"Type=Segmented, Stops=3, Value=1","width":162,"height":43.5,"outline":17,"node":"6414:762"}
     ]
    },
    {
     "id": "smart-stack-widgets",
     "name": "Smart-Stack",
     "page": "Smart Stack (Widgets)",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "40mm",
        "42mm",
        "44mm",
        "46mm",
        "49mm"
       ]
      }
     ],
     "variants": [
      {"name":"Size=40mm","width":162,"height":197,"outline":0,"node":"6482:7426"},
      {"name":"Size=42mm","width":187,"height":223,"outline":1,"node":"6482:7425"},
      {"name":"Size=44mm","width":184,"height":224,"outline":2,"node":"6482:7424"},
      {"name":"Size=46mm","width":208,"height":248,"outline":3,"node":"6482:7423"},
      {"name":"Size=49mm","width":205,"height":251,"outline":4,"node":"6482:7422"}
     ],
     "uses": [
      "smart-stack-widgets-2"
     ]
    },
    {
     "id": "smart-stack-widgets-layout-guide",
     "name": "Widgets Layout Guide",
     "page": "Smart Stack (Widgets)",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "40mm",
        "42mm",
        "44mm",
        "46mm",
        "49mm"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Accessory Widget Group",
        "Chart",
        "Combo",
        "Gauge",
        "Labeled Content",
        "Label Group",
        "Label Group Double",
        "Label Group with Icon",
        "Label Group with Bar",
        "Progress View",
        "Progress View without Current Value",
        "Progress View with Current Value"
       ]
      }
     ],
     "variants": [
      {"name":"Type=Progress View without Current Value, Size=49mm","width":191,"height":81.5,"outline":0,"node":"6502:3129"},
      {"name":"Type=Progress View without Current Value, Size=46mm","width":194,"height":80.5,"outline":1,"node":"6502:3140"},
      {"name":"Type=Progress View without Current Value, Size=44mm","width":173,"height":76.5,"outline":2,"node":"6502:3151"},
      {"name":"Type=Progress View without Current Value, Size=42mm","width":176,"height":72.5,"outline":3,"node":"6502:3162"},
      {"name":"Type=Progress View without Current Value, Size=40mm","width":152,"height":69.5,"outline":4,"node":"6502:3173"},
      {"name":"Type=Progress View with Current Value, Size=49mm","width":191,"height":81.5,"outline":5,"node":"6503:7872"},
      {"name":"Type=Progress View with Current Value, Size=46mm","width":194,"height":80.5,"outline":6,"node":"6503:7883"},
      {"name":"Type=Progress View with Current Value, Size=44mm","width":173,"height":76.5,"outline":7,"node":"6503:7894"},
      {"name":"Type=Progress View with Current Value, Size=42mm","width":176,"height":72.5,"outline":8,"node":"6503:7905"},
      {"name":"Type=Progress View with Current Value, Size=40mm","width":152,"height":69.5,"outline":9,"node":"6503:7916"},
      {"name":"Type=Progress View, Size=49mm","width":191,"height":81.5,"outline":10,"node":"6502:1376"},
      {"name":"Type=Progress View, Size=46mm","width":194,"height":80.5,"outline":11,"node":"6502:1384"},
      {"name":"Type=Progress View, Size=44mm","width":173,"height":76.5,"outline":12,"node":"6502:1392"},
      {"name":"Type=Progress View, Size=42mm","width":176,"height":72.5,"outline":13,"node":"6502:1400"},
      {"name":"Type=Progress View, Size=40mm","width":152,"height":69.5,"outline":14,"node":"6502:1408"},
      {"name":"Type=Label Group with Bar, Size=49mm","width":191,"height":81.5,"outline":15,"node":"6502:1091"},
      {"name":"Type=Label Group with Bar, Size=46mm","width":194,"height":80.5,"outline":16,"node":"6502:1099"},
      {"name":"Type=Label Group with Bar, Size=44mm","width":173,"height":76.5,"outline":17,"node":"6502:1107"},
      {"name":"Type=Label Group with Bar, Size=42mm","width":176,"height":72.5,"outline":18,"node":"6502:1115"},
      {"name":"Type=Label Group with Bar, Size=40mm","width":152,"height":69.5,"outline":19,"node":"6502:1123"},
      {"name":"Type=Label Group with Icon, Size=49mm","width":191,"height":81.5,"outline":20,"node":"6502:392"},
      {"name":"Type=Label Group with Icon, Size=46mm","width":194,"height":80.5,"outline":21,"node":"6502:400"},
      {"name":"Type=Label Group with Icon, Size=44mm","width":173,"height":76.5,"outline":22,"node":"6502:408"},
      {"name":"Type=Label Group with Icon, Size=42mm","width":176,"height":72.5,"outline":23,"node":"6502:416"},
      {"name":"Type=Label Group with Icon, Size=40mm","width":152,"height":69.5,"outline":24,"node":"6502:424"},
      {"name":"Type=Label Group Double, Size=49mm","width":191,"height":81.5,"outline":25,"node":"6502:2262"},
      {"name":"Type=Label Group Double, Size=46mm","width":194,"height":80.5,"outline":26,"node":"6502:2270"},
      {"name":"Type=Label Group Double, Size=44mm","width":173,"height":76.5,"outline":27,"node":"6502:2278"},
      {"name":"Type=Label Group Double, Size=42mm","width":176,"height":72.5,"outline":28,"node":"6502:2286"},
      {"name":"Type=Label Group Double, Size=40mm","width":152,"height":69.5,"outline":29,"node":"6502:2294"},
      {"name":"Type=Label Group, Size=49mm","width":191,"height":81.5,"outline":30,"node":"6485:3657"},
      {"name":"Type=Label Group, Size=46mm","width":194,"height":80.5,"outline":31,"node":"6485:3672"},
      {"name":"Type=Label Group, Size=44mm","width":173,"height":76.5,"outline":32,"node":"6485:3687"},
      {"name":"Type=Label Group, Size=42mm","width":176,"height":72.5,"outline":33,"node":"6485:3702"},
      {"name":"Type=Label Group, Size=40mm","width":152,"height":69.5,"outline":34,"node":"6485:3717"},
      {"name":"Type=Labeled Content, Size=49mm","width":191,"height":81.5,"outline":35,"node":"6502:1703"},
      {"name":"Type=Labeled Content, Size=46mm","width":194,"height":80.5,"outline":36,"node":"6502:1712"},
      {"name":"Type=Labeled Content, Size=44mm","width":173,"height":76.5,"outline":37,"node":"6502:1721"},
      {"name":"Type=Labeled Content, Size=42mm","width":176,"height":72.5,"outline":38,"node":"6502:1730"},
      {"name":"Type=Labeled Content, Size=40mm","width":152,"height":69.5,"outline":39,"node":"6502:1739"},
      {"name":"Type=Gauge, Size=49mm","width":191,"height":81.5,"outline":40,"node":"6502:1887"},
      {"name":"Type=Gauge, Size=46mm","width":194,"height":80.5,"outline":41,"node":"6502:1894"},
      {"name":"Type=Gauge, Size=44mm","width":173,"height":76.5,"outline":42,"node":"6502:1901"},
      {"name":"Type=Gauge, Size=42mm","width":176,"height":72.5,"outline":43,"node":"6502:1908"},
      {"name":"Type=Gauge, Size=40mm","width":152,"height":69.5,"outline":44,"node":"6502:1915"},
      {"name":"Type=Combo, Size=49mm","width":191,"height":81.5,"outline":45,"node":"6502:2987"},
      {"name":"Type=Combo, Size=46mm","width":194,"height":80.5,"outline":46,"node":"6502:2999"},
      {"name":"Type=Combo, Size=44mm","width":173,"height":76.5,"outline":47,"node":"6502:3011"},
      {"name":"Type=Combo, Size=42mm","width":176,"height":72.5,"outline":48,"node":"6502:3023"},
      {"name":"Type=Combo, Size=40mm","width":152,"height":69.5,"outline":49,"node":"6502:3035"},
      {"name":"Type=Chart, Size=49mm","width":191,"height":81.5,"outline":50,"node":"6485:411"},
      {"name":"Type=Chart, Size=46mm","width":194,"height":80.5,"outline":51,"node":"6485:399"},
      {"name":"Type=Chart, Size=44mm","width":173,"height":76.5,"outline":52,"node":"6485:387"},
      {"name":"Type=Chart, Size=42mm","width":176,"height":72.5,"outline":53,"node":"6485:375"},
      {"name":"Type=Chart, Size=40mm","width":152,"height":69.5,"outline":54,"node":"6484:8317"},
      {"name":"Type=Accessory Widget Group, Size=49mm","width":191,"height":81.5,"outline":55,"node":"6485:3280"},
      {"name":"Type=Accessory Widget Group, Size=46mm","width":194,"height":80.5,"outline":56,"node":"6485:3259"},
      {"name":"Type=Accessory Widget Group, Size=44mm","width":173,"height":76.5,"outline":57,"node":"6485:3238"},
      {"name":"Type=Accessory Widget Group, Size=42mm","width":176,"height":72.5,"outline":58,"node":"6485:3217"},
      {"name":"Type=Accessory Widget Group, Size=40mm","width":152,"height":69.5,"outline":59,"node":"6485:3196"}
     ]
    },
    {
     "id": "smart-stack-widgets-2",
     "name": "Widgets",
     "page": "Smart Stack (Widgets)",
     "variant_props": [
      {
       "name": "Size",
       "values": [
        "40mm",
        "42mm",
        "44mm",
        "46mm",
        "49mm"
       ]
      },
      {
       "name": "Type",
       "values": [
        "Accessory Widget Group",
        "Chart",
        "Combo",
        "Gauge",
        "Labeled Content",
        "Label Group",
        "Label Group Double",
        "Label Group with Icon",
        "Label Group with Bar",
        "Progress View",
        "Progress View - Control with Current Value",
        "Progress View - Control without Current Value"
       ]
      }
     ],
     "props": [
      {
       "name": "Line 1",
       "type": "text",
       "default": "\"Line 1\""
      },
      {
       "name": "Line 2",
       "type": "text",
       "default": "\"Line 2\""
      },
      {
       "name": "Line 3",
       "type": "text",
       "default": "\"Line 3\""
      },
      {
       "name": "Metric",
       "type": "text",
       "default": "\"Metric\""
      },
      {
       "name": "Line 4",
       "type": "text",
       "default": "\"Line 4\""
      },
      {
       "name": "Line 5",
       "type": "text",
       "default": "\"Line 5\""
      },
      {
       "name": "Line 6",
       "type": "text",
       "default": "\"Line 6\""
      },
      {
       "name": "Column 1 - High",
       "type": "text",
       "default": "\"C1H\""
      },
      {
       "name": "Column 2 - High",
       "type": "text",
       "default": "\"C2H\""
      },
      {
       "name": "Column 3 - High",
       "type": "text",
       "default": "\"C3H\""
      },
      {
       "name": "Column 4 - High",
       "type": "text",
       "default": "\"C4H\""
      },
      {
       "name": "Column 5 - High",
       "type": "text",
       "default": "\"C5H\""
      },
      {
       "name": "Column 1 - Low",
       "type": "text",
       "default": "\"C1L\""
      },
      {
       "name": "Column 2 - Low",
       "type": "text",
       "default": "\"C2L\""
      },
      {
       "name": "Column 3 - Low",
       "type": "text",
       "default": "\"C3L\""
      },
      {
       "name": "Column 4 - Low",
       "type": "text",
       "default": "\"C4L\""
      },
      {
       "name": "Column 5 - Low",
       "type": "text",
       "default": "\"C5L\""
      },
      {
       "name": "Symbol",
       "type": "text",
       "default": "SF Symbol square.dashed"
      }
     ],
     "variants": [
      {"name":"Type=Progress View - Control without Current Value, Size=49mm","width":191,"height":81.5,"outline":0,"node":"6503:6617"},
      {"name":"Type=Progress View - Control without Current Value, Size=46mm","width":194,"height":80.5,"outline":1,"node":"6503:6628"},
      {"name":"Type=Progress View - Control without Current Value, Size=44mm","width":173,"height":76.5,"outline":2,"node":"6503:6639"},
      {"name":"Type=Progress View - Control without Current Value, Size=42mm","width":176,"height":72.5,"outline":3,"node":"6503:6650"},
      {"name":"Type=Progress View - Control without Current Value, Size=40mm","width":152,"height":69.5,"outline":4,"node":"6503:6661"},
      {"name":"Type=Progress View - Control with Current Value, Size=49mm","width":191,"height":81.5,"outline":5,"node":"6503:7962"},
      {"name":"Type=Progress View - Control with Current Value, Size=46mm","width":194,"height":80.5,"outline":6,"node":"6503:7969"},
      {"name":"Type=Progress View - Control with Current Value, Size=44mm","width":173,"height":76.5,"outline":7,"node":"6503:7976"},
      {"name":"Type=Progress View - Control with Current Value, Size=42mm","width":176,"height":72.5,"outline":8,"node":"6503:7983"},
      {"name":"Type=Progress View - Control with Current Value, Size=40mm","width":152,"height":69.5,"outline":9,"node":"6503:7990"},
      {"name":"Type=Progress View, Size=49mm","width":191,"height":81.5,"outline":10,"node":"6503:6857"},
      {"name":"Type=Progress View, Size=46mm","width":194,"height":80.5,"outline":11,"node":"6503:6866"},
      {"name":"Type=Progress View, Size=44mm","width":173,"height":76.5,"outline":12,"node":"6503:6875"},
      {"name":"Type=Progress View, Size=42mm","width":176,"height":72.5,"outline":13,"node":"6503:6884"},
      {"name":"Type=Progress View, Size=40mm","width":152,"height":69.5,"outline":14,"node":"6503:6893"},
      {"name":"Type=Label Group with Bar, Size=49mm","width":191,"height":81.5,"outline":15,"node":"6503:6902"},
      {"name":"Type=Label Group with Bar, Size=46mm","width":194,"height":80.5,"outline":16,"node":"6503:6911"},
      {"name":"Type=Label Group with Bar, Size=44mm","width":173,"height":76.5,"outline":17,"node":"6503:6920"},
      {"name":"Type=Label Group with Bar, Size=42mm","width":176,"height":72.5,"outline":18,"node":"6503:6929"},
      {"name":"Type=Label Group with Bar, Size=40mm","width":152,"height":69.5,"outline":19,"node":"6503:6938"},
      {"name":"Type=Label Group with Icon, Size=49mm","width":191,"height":81.5,"outline":20,"node":"6503:6947"},
      {"name":"Type=Label Group with Icon, Size=46mm","width":194,"height":80.5,"outline":21,"node":"6503:6958"},
      {"name":"Type=Label Group with Icon, Size=44mm","width":173,"height":76.5,"outline":22,"node":"6503:6969"},
      {"name":"Type=Label Group with Icon, Size=42mm","width":176,"height":72.5,"outline":23,"node":"6503:6980"},
      {"name":"Type=Label Group with Icon, Size=40mm","width":152,"height":69.5,"outline":24,"node":"6503:6991"},
      {"name":"Type=Label Group Double, Size=49mm","width":191,"height":81.5,"outline":25,"node":"6503:6712"},
      {"name":"Type=Label Group Double, Size=46mm","width":194,"height":80.5,"outline":26,"node":"6503:6724"},
      {"name":"Type=Label Group Double, Size=44mm","width":173,"height":76.5,"outline":27,"node":"6503:6736"},
      {"name":"Type=Label Group Double, Size=42mm","width":176,"height":72.5,"outline":28,"node":"6503:6748"},
      {"name":"Type=Label Group Double, Size=40mm","width":152,"height":69.5,"outline":29,"node":"6503:6760"},
      {"name":"Type=Label Group, Size=49mm","width":191,"height":81.5,"outline":30,"node":"6503:7002"},
      {"name":"Type=Label Group, Size=46mm","width":194,"height":80.5,"outline":31,"node":"6503:7010"},
      {"name":"Type=Label Group, Size=44mm","width":173,"height":76.5,"outline":32,"node":"6503:7018"},
      {"name":"Type=Label Group, Size=42mm","width":176,"height":72.5,"outline":33,"node":"6503:7026"},
      {"name":"Type=Label Group, Size=40mm","width":152,"height":69.5,"outline":34,"node":"6503:7034"},
      {"name":"Type=Labeled Content, Size=49mm","width":191,"height":81.5,"outline":35,"node":"6503:6822"},
      {"name":"Type=Labeled Content, Size=46mm","width":194,"height":80.5,"outline":36,"node":"6503:6829"},
      {"name":"Type=Labeled Content, Size=44mm","width":173,"height":76.5,"outline":37,"node":"6503:6836"},
      {"name":"Type=Labeled Content, Size=42mm","width":176,"height":72.5,"outline":38,"node":"6503:6843"},
      {"name":"Type=Labeled Content, Size=40mm","width":152,"height":69.5,"outline":39,"node":"6503:6850"},
      {"name":"Type=Gauge, Size=49mm","width":191,"height":81.5,"outline":40,"node":"6503:6772"},
      {"name":"Type=Gauge, Size=46mm","width":194,"height":80.5,"outline":41,"node":"6503:6782"},
      {"name":"Type=Gauge, Size=44mm","width":173,"height":76.5,"outline":42,"node":"6503:6792"},
      {"name":"Type=Gauge, Size=42mm","width":176,"height":72.5,"outline":43,"node":"6503:6802"},
      {"name":"Type=Gauge, Size=40mm","width":152,"height":69.5,"outline":44,"node":"6503:6812"},
      {"name":"Type=Combo, Size=49mm","width":191,"height":81.5,"outline":45,"node":"6503:6672"},
      {"name":"Type=Combo, Size=46mm","width":194,"height":80.5,"outline":46,"node":"6503:6680"},
      {"name":"Type=Combo, Size=44mm","width":173,"height":76.5,"outline":47,"node":"6503:6688"},
      {"name":"Type=Combo, Size=42mm","width":176,"height":72.5,"outline":48,"node":"6503:6696"},
      {"name":"Type=Combo, Size=40mm","width":152,"height":69.5,"outline":49,"node":"6503:6704"},
      {"name":"Type=Chart, Size=49mm","width":191,"height":81.5,"outline":50,"node":"6503:7117"},
      {"name":"Type=Chart, Size=46mm","width":194,"height":80.5,"outline":51,"node":"6503:7138"},
      {"name":"Type=Chart, Size=44mm","width":173,"height":76.5,"outline":52,"node":"6503:7159"},
      {"name":"Type=Chart, Size=42mm","width":176,"height":72.5,"outline":53,"node":"6503:7180"},
      {"name":"Type=Chart, Size=40mm","width":152,"height":69.5,"outline":54,"node":"6503:7201"},
      {"name":"Type=Accessory Widget Group, Size=49mm","width":191,"height":81.5,"outline":55,"node":"6503:7042"},
      {"name":"Type=Accessory Widget Group, Size=46mm","width":194,"height":80.5,"outline":56,"node":"6503:7057"},
      {"name":"Type=Accessory Widget Group, Size=44mm","width":173,"height":76.5,"outline":57,"node":"6503:7072"},
      {"name":"Type=Accessory Widget Group, Size=42mm","width":176,"height":72.5,"outline":58,"node":"6503:7087"},
      {"name":"Type=Accessory Widget Group, Size=40mm","width":152,"height":69.5,"outline":59,"node":"6503:7102"}
     ],
     "uses": [
      "smart-stack-widgets-background"
     ]
    },
    {
     "id": "smart-stack-widgets-background",
     "name": "Background",
     "page": "Smart Stack (Widgets)",
     "variant_props": [
      {
       "name": "Style",
       "values": [
        "Over Dark Background",
        "Solid Color",
        "Gradient"
       ]
      }
     ],
     "variants": [
      {"name":"Style=Over Dark Background","width":152,"height":69.5,"outline":0,"node":"6503:7327"},
      {"name":"Style=Solid Color","width":152,"height":69.5,"outline":1,"node":"6503:7333"},
      {"name":"Style=Gradient","width":152,"height":69.5,"outline":2,"node":"6503:7334"}
     ]
    },
    {
     "id": "toggles-toggle",
     "name": "Toggle",
     "page": "Toggles",
     "variant_props": [
      {
       "name": "State",
       "values": [
        "On",
        "Off"
       ]
      }
     ],
     "props": [
      {
       "name": "Label",
       "type": "text",
       "default": "\"Label\""
      }
     ],
     "variants": [
      {"name":"State=Off","width":162,"height":43.5,"outline":0,"node":"6415:920"},
      {"name":"State=On","width":162,"height":43.5,"outline":1,"node":"6415:600"}
     ]
    },
    {
     "id": "kit-helpers-sticker-sheet",
     "name": "_Sticker Sheet",
     "page": "_Kit Helpers",
     "helper": true,
     "variants": [
      {"name":"","width":200,"height":100,"outline":0,"node":"540:189859"}
     ],
     "uses": [
      "kit-helpers-mode"
     ]
    },
    {
     "id": "kit-helpers-mode",
     "name": "_Mode",
     "page": "_Kit Helpers",
     "helper": true,
     "variants": [
      {"name":"","width":54,"height":19,"outline":0,"node":"540:189866"}
     ]
    },
    {
     "id": "kit-helpers-component-header",
     "name": "_Component Header",
     "page": "_Kit Helpers",
     "helper": true,
     "props": [
      {
       "name": "Description",
       "type": "text",
       "default": "\"Description\""
      },
      {
       "name": "Component name",
       "type": "text",
       "default": "\"Component name\""
      },
      {
       "name": "Link 1",
       "type": "text",
       "default": "\"Human Interface Guidelines\""
      },
      {
       "name": "Show Description",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Link 1",
       "type": "bool",
       "default": "on"
      },
      {
       "name": "Show Link 2",
       "type": "bool",
       "default": "off"
      },
      {
       "name": "Link 2",
       "type": "text",
       "default": "\"Human Interface Guidelines\""
      }
     ],
     "variants": [
      {"name":"","width":2000,"height":166,"outline":0,"node":"507:29149"}
     ]
    },
    {
     "id": "kit-helpers-measurement",
     "name": "_Measurement",
     "page": "_Kit Helpers",
     "helper": true,
     "props": [
      {
       "name": "Measurement",
       "type": "text",
       "default": "\"N\""
      }
     ],
     "variants": [
      {"name":"","width":16,"height":28,"outline":0,"node":"2567:19731"}
     ]
    },
    {
     "id": "kit-helpers-watch-faces",
     "name": "Watch Faces",
     "page": "_Kit Helpers",
     "variant_props": [
      {
       "name": "Face",
       "values": [
        "Flux",
        "Activity Analog",
        "Modular"
       ]
      },
      {
       "name": "Size",
       "values": [
        "49mm",
        "46mm",
        "44mm",
        "42mm",
        "40mm"
       ]
      }
     ],
     "variants": [
      {"name":"Face=Modular, Size=49mm","width":205,"height":251,"outline":0,"node":"6502:3370"},
      {"name":"Face=Modular, Size=46mm","width":208,"height":248,"outline":1,"node":"6502:3368"},
      {"name":"Face=Modular, Size=44mm","width":184,"height":224,"outline":2,"node":"6502:3366"},
      {"name":"Face=Modular, Size=42mm","width":187,"height":223,"outline":3,"node":"6502:3364"},
      {"name":"Face=Modular, Size=40mm","width":162,"height":197,"outline":4,"node":"6502:3362"},
      {"name":"Face=Flux, Size=49mm","width":205,"height":251,"outline":5,"node":"6502:3330"},
      {"name":"Face=Flux, Size=46mm","width":208,"height":248,"outline":6,"node":"6502:3328"},
      {"name":"Face=Flux, Size=44mm","width":184,"height":224,"outline":7,"node":"6502:3326"},
      {"name":"Face=Flux, Size=42mm","width":187,"height":223,"outline":8,"node":"6502:3324"},
      {"name":"Face=Flux, Size=40mm","width":162,"height":197,"outline":9,"node":"6502:3322"},
      {"name":"Face=Activity Analog, Size=49mm","width":205,"height":251,"outline":10,"node":"6480:4466"},
      {"name":"Face=Activity Analog, Size=46mm","width":208,"height":248,"outline":11,"node":"6480:4468"},
      {"name":"Face=Activity Analog, Size=44mm","width":184,"height":224,"outline":12,"node":"6480:4467"},
      {"name":"Face=Activity Analog, Size=42mm","width":187,"height":223,"outline":13,"node":"6480:4469"},
      {"name":"Face=Activity Analog, Size=40mm","width":162,"height":197,"outline":14,"node":"6480:4470"}
     ]
    }
   ]
  }
 ]
};
