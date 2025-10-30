"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Product;
var Graphic_1 = require("@arcgis/core/Graphic");
var jsonUtils_1 = require("@arcgis/core/geometry/support/jsonUtils");
var utah_design_system_1 = require("@ugrc/utah-design-system");
var react_aria_components_1 = require("react-aria-components");
var tailwind_merge_1 = require("tailwind-merge");
var config_1 = require("../config");
var useMap_1 = require("../hooks/useMap");
var usePreview_1 = require("../hooks/usePreview");
var useWizardMachine_1 = require("../hooks/useWizardMachine");
var MoreInfo_1 = require("./MoreInfo");
var TreeItemContent_1 = require("./TreeItemContent");
var utils_1 = require("./utils");
var commonItemClasses = 'rounded ml-3';
var buttonClasses = 'my-0 rounded px-1';
function Product(_a) {
    var feature = _a.feature, id = _a.id, productType = _a.productType;
    var _b = feature.attributes, Product = _b.Product, Category = _b.Category, Description = _b.Description, ServiceName = _b.ServiceName, HTML_Page = _b.HTML_Page, In_House = _b.In_House, Tile_Index = _b.Tile_Index, OBJECTID = _b.OBJECTID, METADATA = _b.METADATA, REPORT = _b.REPORT, FTP_Path = _b.FTP_Path;
    var metadata;
    var report;
    if ((0, utils_1.isUrlLike)(FTP_Path)) {
        if (METADATA) {
            metadata = "".concat(FTP_Path).concat(METADATA);
        }
        if (REPORT) {
            report = "".concat(FTP_Path).concat(REPORT);
        }
    }
    var _c = (0, useMap_1.default)(), zoom = _c.zoom, placeGraphic = _c.placeGraphic;
    var _d = (0, usePreview_1.default)(), selectedPreviewId = _d.selectedPreviewId, addPreview = _d.addPreview, removePreview = _d.removePreview;
    var send = (0, useWizardMachine_1.default)().send;
    var previewId = "".concat(Category, " | ").concat(Product);
    var geometry = (0, jsonUtils_1.fromJSON)(__assign(__assign({ type: 'polygon' }, feature.geometry), { spatialReference: { wkid: 3857 } }));
    var addGraphic = function () {
        placeGraphic(new Graphic_1.default({ geometry: geometry, symbol: config_1.default.RESULT_SYMBOL }));
    };
    var removeGraphic = function () {
        placeGraphic(null);
    };
    var onAddPreview = function () {
        addPreview(previewId, ServiceName);
    };
    var getButtons = function () {
        return (<div className="flex gap-1">
        <utah_design_system_1.Button key="extent" size="extraSmall" className={buttonClasses} onPress={function () { return zoom(geometry); }}>
          Extent
        </utah_design_system_1.Button>
        {ServiceName ? (<utah_design_system_1.ToggleButton key="preview" className={(0, tailwind_merge_1.twJoin)(buttonClasses, 'min-h-6 px-2 text-xs')} isSelected={selectedPreviewId === previewId} onChange={function (isSelected) { return (isSelected ? onAddPreview() : removePreview()); }}>
            Preview
          </utah_design_system_1.ToggleButton>) : null}
      </div>);
    };
    return (<react_aria_components_1.TreeItem id={id} onMouseEnter={addGraphic} onMouseLeave={removeGraphic} textValue={Product} className={"".concat(commonItemClasses, " flex min-h-8 items-center bg-secondary-700 data-[expanded]:rounded-b-none hover:bg-secondary-500 pressed:bg-secondary-600 [&:not(:first-child)]:mt-1")}>
      <TreeItemContent_1.TreeItemContent className="text-white shadow-none" buttons={getButtons()}>
        {Product}
      </TreeItemContent_1.TreeItemContent>
      <react_aria_components_1.TreeItem onMouseEnter={addGraphic} onMouseLeave={removeGraphic} textValue="details" className={"".concat(commonItemClasses, " rounded-t-none bg-white px-2 py-1 text-sm dark:bg-zinc-800 dark:text-white")}>
        <TreeItemContent_1.TreeItemContent>
          <>
            {Description}
            <div className="my-1 flex w-full items-center justify-between">
              <react_aria_components_1.DialogTrigger>
                <utah_design_system_1.Button variant="secondary" size="extraSmall">
                  more info
                </utah_design_system_1.Button>
                <utah_design_system_1.Modal isDismissable>
                  <utah_design_system_1.Dialog>
                    <MoreInfo_1.default title={Description} productType={productType} objectId={OBJECTID}/>
                  </utah_design_system_1.Dialog>
                </utah_design_system_1.Modal>
              </react_aria_components_1.DialogTrigger>
              {(0, utils_1.isUrlLike)(HTML_Page) ? <utah_design_system_1.ExternalLink href={HTML_Page}>web page</utah_design_system_1.ExternalLink> : null}
              {(0, utils_1.isYes)(In_House) ? (<utah_design_system_1.Button variant="accent" size="extraSmall" onPress={function () {
                return send({
                    type: 'DOWNLOAD',
                    productType: productType,
                    tileIndex: Tile_Index,
                    description: Description,
                    metadata: metadata,
                    report: report,
                });
            }}>
                  Download
                </utah_design_system_1.Button>) : null}
            </div>
          </>
        </TreeItemContent_1.TreeItemContent>
      </react_aria_components_1.TreeItem>
    </react_aria_components_1.TreeItem>);
}
