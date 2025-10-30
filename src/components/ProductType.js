"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProductType;
var react_query_1 = require("@tanstack/react-query");
var utah_design_system_1 = require("@ugrc/utah-design-system");
var react_aria_components_1 = require("react-aria-components");
var react_content_loader_1 = require("react-content-loader");
var resolveConfig_1 = require("tailwindcss/resolveConfig");
var usehooks_ts_1 = require("usehooks-ts");
var tailwind_config_js_1 = require("../../tailwind.config.js");
var config_1 = require("../config");
var search_1 = require("../services/search");
var Category_js_1 = require("./Category.js");
var TreeItemContent_1 = require("./TreeItemContent");
var fullConfig = (0, resolveConfig_1.default)(tailwind_config_js_1.default);
var topLevelClasses = 'text-lg font-semibold [&:not(:first-child)]:mt-1';
function ProductType(_a) {
    var productType = _a.productType, aoi = _a.aoi, isOnly = _a.isOnly, categoryFilter = _a.categoryFilter, _b = _a.searchFn, searchFn = _b === void 0 ? search_1.default : _b;
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['searchResults', productType, aoi, categoryFilter],
        queryFn: function () { return searchFn(productType, aoi, categoryFilter); },
    }), data = _c.data, error = _c.error, isLoading = _c.isLoading;
    var isDarkMode = (0, usehooks_ts_1.useDarkMode)().isDarkMode;
    var title = config_1.default.PRODUCT_TYPES[productType];
    if (isLoading) {
        return (<>
        <span className={topLevelClasses}>{title}</span>
        <react_content_loader_1.List backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]} foregroundColor="#FFFFFF"/>
      </>);
    }
    if (error || !data) {
        return (<>
        <span className={topLevelClasses}>{title}</span>
        <utah_design_system_1.Banner className="m-2">Error loading search results</utah_design_system_1.Banner>
      </>);
    }
    var categories = Object.keys(data !== null && data !== void 0 ? data : {});
    var defaultExpandedKeys = [title];
    // save clicks if there is only one category and this is the only product type
    if (isOnly && categories.length === 1) {
        defaultExpandedKeys.push(categories[0]);
    }
    // save clicks if there is only one product in a category
    categories.forEach(function (category) {
        if (data[category].length === 1) {
            var singleProduct = data[category][0];
            defaultExpandedKeys.push(singleProduct.attributes[config_1.default.EXTENT_FIELDS.OBJECTID]);
        }
    });
    return (<react_aria_components_1.Tree aria-label="search results" selectionMode="none" defaultExpandedKeys={defaultExpandedKeys}>
      <react_aria_components_1.TreeItem id={title} textValue={title} className="flex items-center">
        <TreeItemContent_1.TreeItemContent className={topLevelClasses}>{title}</TreeItemContent_1.TreeItemContent>
        {categories.length > 0 ? (categories.map(function (category) { return (<Category_js_1.default key={category} category={category} products={data[category]} productType={productType}/>); })) : (<react_aria_components_1.TreeItem textValue="no-results" id="no-results" className="ml-1 text-sm">
            <TreeItemContent_1.TreeItemContent>No products found</TreeItemContent_1.TreeItemContent>
          </react_aria_components_1.TreeItem>)}
      </react_aria_components_1.TreeItem>
    </react_aria_components_1.Tree>);
}
