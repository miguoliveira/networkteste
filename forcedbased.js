(function() {
    let _shadowRoot;
    let _id;

    let div;
    let widgetName;
    var Ar = [];

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>      
    `;

    class NetworkGraphForceBased extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            _id = createGuid();

            //_shadowRoot.querySelector("#oView").id = "oView";

            this._export_settings = {};
            this._export_settings.title = "";
            this._export_settings.subtitle = "";
            this._export_settings.icon = "";
            this._export_settings.unit = "";
            this._export_settings.footer = "";

            this.addEventListener("click", event => {
                console.log('click');

            });

            this._firstConnection = 0;
        }

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                    if (outlineContainer && outlineContainer.getReactProps) {
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            for (let componentId in components) {
                                let component = components[componentId];
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return {
                                        result: 1
                                    };
                                }
                            });
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            console.log(changedProperties);
            var that = this;
            loadthis(that, changedProperties);
        }

        _renderExportButton() {
            let components = this.metadata ? JSON.parse(this.metadata)["components"] : {};
            console.log("_renderExportButton-components");
            console.log(components);
            console.log("end");
        }

        _firePropertiesChanged() {
            this.title = "FD";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        title: this.title
                    }
                }
            }));
        }

        // SETTINGS
        get title() {
            return this._export_settings.title;
        }
        set title(value) {
            console.log("setTitle:" + value);
            this._export_settings.title = value;
        }

        get subtitle() {
            return this._export_settings.subtitle;
        }
        set subtitle(value) {
            this._export_settings.subtitle = value;
        }

        get icon() {
            return this._export_settings.icon;
        }
        set icon(value) {
            this._export_settings.icon = value;
        }

        get unit() {
            return this._export_settings.unit;
        }
        set unit(value) {
            this._export_settings.unit = value;
        }

        get footer() {
            return this._export_settings.footer;
        }
        set footer(value) {
            this._export_settings.footer = value;
        }

        static get observedAttributes() {
            return [
                "title",
                "subtitle",
                "icon",
                "unit",
                "footer",
                "link"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }

    }
    customElements.define("com-fd-djaja-sap-sac-networkgraphforcebased", NetworkGraphForceBased);

    // UTILS
    function loadthis(that, changedProperties) {
        var that_ = that;

        widgetName = changedProperties.widgetName;
        console.log("widgetName:" + widgetName);
        if (typeof widgetName === "undefined") {
            widgetName = that._export_settings.title.split("|")[0];
            console.log("widgetName_:" + widgetName);
        }

        div = document.createElement('div');
        div.slot = "content_" + widgetName;

        if (that._firstConnection === 0) {
            console.log("--First Time --");

            let div0 = document.createElement('div');
            //div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns="sap.suite.ui.commons.networkgraph" xmlns:layout="sap.suite.ui.commons.networkgraph.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout" height="100%"><Graph enableWheelZoom="false" height="100%" width="100%" nodes="{' + widgetName + '>/nodes}" lines="{' + widgetName + '>/lines}" groups="{' + widgetName + '>/groups}" id="graph_' + widgetName + '"><layoutData><m:FlexItemData minWidth="75%" maxWidth="75%"/></layoutData><layoutAlgorithm><layout:ForceDirectedLayout optimalDistanceConstant="0.26" maxIterations="{settings>/maxIterations}" maxTime="{settings>/maxTime}" initialTemperature="{settings>/initialTemperature}" coolDownStep="{settings>/coolDownStep}"></layout:ForceDirectedLayout></layoutAlgorithm><nodes><Node height="{settings>/height}" key="{' + widgetName +'>key}" title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}" shape="{' + widgetName + '>shape}" status="{' + widgetName + '>status}" x="{' + widgetName + '>x}" y="{' + widgetName + '>y}"><attributes><ElementAttribute label="{' + widgetName + '>label}" value="{' + widgetName + '>value}"/></attributes></Node></nodes><lines><Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}"></Line></lines><groups><Group key="{' + widgetName + '>key}" title="{' + widgetName + '>title}"></Group></groups></Graph></mvc:View></script>';
            div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns="sap.suite.ui.commons.networkgraph" xmlns:layout="sap.suite.ui.commons.networkgraph.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout" height="100%"><l:FixFlex><l:fixContent><m:FlexBox fitContainer="true" renderType="Bare" wrap="Wrap" id="graphWrapper"><m:items><Graph enableWheelZoom="false" height="100%" width="100%" nodes="{' + widgetName + '>/nodes}" lines="{' + widgetName + '>/lines}" groups="{' + widgetName + '>/groups}" id="graph_' + widgetName + '"><layoutData><m:FlexItemData minWidth="100%" maxWidth="100%"/></layoutData><layoutAlgorithm><layout:ForceDirectedLayout optimalDistanceConstant="0.26" maxIterations="{settings>/maxIterations}" maxTime="{settings>/maxTime}" initialTemperature="{settings>/initialTemperature}" coolDownStep="{settings>/coolDownStep}"></layout:ForceDirectedLayout></layoutAlgorithm><nodes><Node height="{settings>/height}" key="{' + widgetName +'>key}" title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}" shape="{' + widgetName + '>shape}" status="{' + widgetName + '>status}" x="{' + widgetName + '>x}" y="{' + widgetName + '>y}"><attributes><ElementAttribute label="{' + widgetName + '>label}" value="{' + widgetName + '>value}"/></attributes></Node></nodes><lines><Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}"></Line></lines><groups><Group key="{' + widgetName + '>key}" title="{' + widgetName + '>title}"></Group></groups></Graph></m:items></m:FlexBox></l:fixContent></l:FixFlex></mvc:View></script>';

            _shadowRoot.appendChild(div0);

            let div1 = document.createElement('div');
            div1.innerHTML = '<div id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"></slot></div>';
            _shadowRoot.appendChild(div1);

            that_.appendChild(div);

            var mapcanvas_divstr = _shadowRoot.getElementById('oView_' + widgetName);
          
            Ar.push({
                'id': widgetName,
                'div': mapcanvas_divstr
            });
            console.log(Ar);
        }

        that_._renderExportButton();

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller",
                "sap/ui/model/json/JSONModel",
                "sap/m/MessageToast",
                "sap/ui/core/library",
                "sap/ui/core/Core",
                'sap/ui/model/Filter',
                'sap/m/library',
                'sap/m/MessageBox',
                'sap/ui/unified/DateRange',
                'sap/ui/core/format/DateFormat',
                "sap/ui/model/BindingMode",
                "sap/ui/unified/CalendarLegendItem",
                "sap/ui/unified/DateTypeRange",
                "sap/ui/unified/library",
                "sap/m/Popover",
                "sap/m/ListBase",
                "sap/m/StandardListItem",
                "sap/m/Select",
                "sap/ui/core/Item",
                "sap/suite/ui/commons/networkgraph/layout/SwimLaneChainLayout"
            ], function(jQuery, Controller, JSONModel, MessageToast, coreLibrary, Core, Filter, mobileLibrary, MessageBox, DateRange, DateFormat, BindingMode, CalendarLegendItem, DateTypeRange, unifiedLibrary, Popover, ListBase, StandardListItem, Select, Item, SwimLaneChainLayout) {
                "use strict";

                var CalendarDayType = unifiedLibrary.CalendarDayType;

                return Controller.extend("myView.Template", {

                    onInit: function () {
                        var this_ = this;

                        if (that._firstConnection === 0) {

                            that._firstConnection = 1;
                                     
                               
                            var data = [{
  "nodes": [
    {
      "key": [0],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["ANCHOR"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [1],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BA"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [2],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BBIG"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [3],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["CY04"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [4],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BAGT"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [5],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["CY02"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [6],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BAHG"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [7],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["MOLD"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [8],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["CY01"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [9],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BAES"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [10],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BADE"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [11],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BALP"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [12],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BABG"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [13],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BAAS"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [14],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["CY05"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [15],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["MVC"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [16],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["PL"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [17],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BAMG"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [18],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BARO"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [19],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["CY06"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [20],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BARS"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [21],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["ES03"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [22],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SGPS"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [23],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BAGR"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [24],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BGBV"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [25],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["CY03"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [26],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["BV_1"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [27],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["IB_2"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [28],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["IB_1"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [29],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SEE_7"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [30],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SEE_1"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [31],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SEE_3"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [32],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SEE_8"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [33],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SEE_2"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [34],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["IB_4"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [35],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["CE_1"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [36],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SEE_4"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [37],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SEE_6"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [38],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["IB_3"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    },
    {
      "key": [39],
      "title": [null],
      "group": [1],
      "status": ["Success"],
      "icon": ["sap-icon://shield"],
      "attributes": [
        {
          "label": ["SEE_5"],
          "value": [null]
        },
        {
          "label": [null],
          "value": [null]
        }
      ]
    }
  ],
  "lines": [
    {
      "from": [0],
      "to": [26]
    },
    {
      "from": [1],
      "to": [27]
    },
    {
      "from": [2],
      "to": [28]
    },
    {
      "from": [3],
      "to": [29]
    },
    {
      "from": [4],
      "to": [30]
    },
    {
      "from": [5],
      "to": [31]
    },
    {
      "from": [6],
      "to": [32]
    },
    {
      "from": [7],
      "to": [27]
    },
    {
      "from": [8],
      "to": [33]
    },
    {
      "from": [9],
      "to": [34]
    },
    {
      "from": [10],
      "to": [35]
    },
    {
      "from": [11],
      "to": [36]
    },
    {
      "from": [12],
      "to": [37]
    },
    {
      "from": [13],
      "to": [37]
    },
    {
      "from": [14],
      "to": [37]
    },
    {
      "from": [15],
      "to": [34]
    },
    {
      "from": [16],
      "to": [35]
    },
    {
      "from": [17],
      "to": [27]
    },
    {
      "from": [18],
      "to": [31]
    },
    {
      "from": [19],
      "to": [36]
    },
    {
      "from": [20],
      "to": [32]
    },
    {
      "from": [21],
      "to": [34]
    },
    {
      "from": [22],
      "to": [38]
    },
    {
      "from": [23],
      "to": [30]
    },
    {
      "from": [24],
      "to": [26]
    },
    {
      "from": [25],
      "to": [39]
    },
    {
      "from": [26],
      "to": ["NA"]
    },
    {
      "from": [27],
      "to": [28]
    },
    {
      "from": [28],
      "to": [26]
    },
    {
      "from": [29],
      "to": [37]
    },
    {
      "from": [30],
      "to": [26]
    },
    {
      "from": [31],
      "to": [33]
    },
    {
      "from": [32],
      "to": [29]
    },
    {
      "from": [33],
      "to": [30]
    },
    {
      "from": [34],
      "to": [38]
    },
    {
      "from": [35],
      "to": [26]
    },
    {
      "from": [36],
      "to": [31]
    },
    {
      "from": [37],
      "to": [39]
    },
    {
      "from": [38],
      "to": [27]
    },
    {
      "from": [39],
      "to": [36]
    }
  ],
  "groups": [
    {
      "key": [1],
      "title": ["Phase One"]
    },
    {
      "key": [2],
      "title": ["Phase Two"]
    },
    {
      "key": [3],
      "title": ["Phase Three"]
    }
  ]
}];
             
                                    var oGraph,
                                    oModel = new JSONModel(data[0]);
                                    oModel.setSizeLimit(Number.MAX_SAFE_INTEGER);

                                    this_.getView().setModel(oModel, that.widgetName);

                                    this_.oModelSettings = new JSONModel({
                                        maxIterations: 200,
                                        maxTime: 500,
                                        initialTemperature: 200,
                                        coolDownStep: 1
                                    });
                                    this_.getView().setModel(this_.oModelSettings, "settings");

                                    this_.oGraph = this_.byId("graph_" + widgetName);
                                    this_.oGraph._fZoomLevel = 0.75;
                                              
                        } 
                    }
                });
            });

            console.log("widgetName Final:" + widgetName);
            var foundIndex = Ar.findIndex(x => x.id == widgetName);
            var divfinal = Ar[foundIndex].div;
            console.log(divfinal);

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
        });
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadScript(src, shadowRoot) {
        return new Promise(function(resolve, reject) {
            let script = document.createElement('script');
            script.src = src;

            script.onload = () => {
                console.log("Load: " + src);
                resolve(script);
            }
            script.onerror = () => reject(new Error(`Script load error for ${src}`));

            shadowRoot.appendChild(script)
        });
    }
})();
