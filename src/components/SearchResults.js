"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchResults;
var config_1 = require("../config");
var useUrlParams_1 = require("../hooks/useUrlParams");
var useWizardMachine_1 = require("../hooks/useWizardMachine");
var ProductType_1 = require("./ProductType");
function SearchResults() {
    var snapshot = (0, useWizardMachine_1.default)().snapshot;
    var _a = (0, useUrlParams_1.useUrlParams)(), hasFilters = _a.hasFilters, resetUrl = _a.resetUrl;
    // use the config object keys to make sure that the order in the results is consistent with step 1
    var productTypes = Object.keys(config_1.default.PRODUCT_TYPES).filter(function (type) {
        return snapshot.context.productTypes.includes(type);
    });
    return (<>
      {hasFilters && (<p className="mb-2 text-sm">
          <a href={resetUrl} className="text-primary-500 underline hover:text-primary-600 dark:text-primary-400">
            Want to search for more than{' '}
            {snapshot.context.categoryFilter
                ? Array.isArray(snapshot.context.categoryFilter)
                    ? snapshot.context.categoryFilter.join(', ')
                    : snapshot.context.categoryFilter
                : ''}{' '}
            data?
          </a>
        </p>)}
      {productTypes.map(function (type) {
            return (<ProductType_1.default key={type} productType={type} aoi={snapshot.context.aoi} isOnly={productTypes.length === 1} categoryFilter={snapshot.context.categoryFilter}/>);
        })}
    </>);
}
