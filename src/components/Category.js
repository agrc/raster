"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Category;
var react_aria_components_1 = require("react-aria-components");
var config_1 = require("../config");
var Product_1 = require("./Product");
var TreeItemContent_1 = require("./TreeItemContent");
var utils_1 = require("./utils");
function Category(_a) {
    var category = _a.category, products = _a.products, productType = _a.productType;
    var categoryLabel = (0, utils_1.removeCurlyBracesContent)(category);
    if (productType === 'lidar') {
        categoryLabel += " (".concat(products[0].attributes[config_1.default.EXTENT_FIELDS.Year_Collected], ")");
    }
    // sort product if there is a config defined
    var sortedProducts = products;
    if (config_1.default.PRODUCT_SORT_ORDER[productType]) {
        var sortOrder = config_1.default.PRODUCT_SORT_ORDER[productType];
        sortedProducts = __spreadArray([], products, true).sort((0, utils_1.getSort)(sortOrder));
    }
    return (<react_aria_components_1.TreeItem textValue={categoryLabel} id={category} key={category} className="mt-1">
      <TreeItemContent_1.TreeItemContent>{categoryLabel}</TreeItemContent_1.TreeItemContent>
      {sortedProducts.map(function (product) { return (<Product_1.default productType={productType} key={product.attributes[config_1.default.EXTENT_FIELDS.OBJECTID]} id={product.attributes[config_1.default.EXTENT_FIELDS.OBJECTID]} feature={product}/>); })}
    </react_aria_components_1.TreeItem>);
}
