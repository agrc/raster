"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelectProductTypes;
var utah_design_system_1 = require("@ugrc/utah-design-system");
var lucide_react_1 = require("lucide-react");
var react_aria_components_1 = require("react-aria-components");
var config_1 = require("../config");
var useUrlParams_1 = require("../hooks/useUrlParams");
var useWizardMachine_1 = require("../hooks/useWizardMachine");
function SelectProductTypes() {
    var _a = (0, useWizardMachine_1.default)(), snapshot = _a.snapshot, send = _a.send;
    var _b = (0, useUrlParams_1.useUrlParams)(), hasFilters = _b.hasFilters, resetUrl = _b.resetUrl;
    return (<div className="space-y-2">
      {hasFilters && (<p className="text-sm">
          <a href={resetUrl} className="text-primary-500 underline hover:text-primary-600 dark:text-primary-400">
            Want to search for more than {snapshot.context.categoryFilter ? (Array.isArray(snapshot.context.categoryFilter) ? snapshot.context.categoryFilter.join(', ') : snapshot.context.categoryFilter) : ''} data?
          </a>
        </p>)}
      <p className="text-sm">Please select the type of product(s) you are looking for...</p>
      {Object.entries(config_1.default.PRODUCT_TYPES).map(function (_a) {
            var key = _a[0], label = _a[1];
            return (<div key={key}>
          <utah_design_system_1.Checkbox isSelected={snapshot.context.productTypes.includes(key)} onChange={function () { return send({ type: 'TOGGLE_PRODUCT_TYPE', productType: key }); }}>
            <div className="inline-flex items-center gap-0.5">
              {label}
              <react_aria_components_1.TooltipTrigger delay={250}>
                <utah_design_system_1.Button className="hover:bg-transparent" variant="icon" aria-label="More information">
                  <lucide_react_1.HelpCircle className="h-4 w-4"/>
                </utah_design_system_1.Button>
                <utah_design_system_1.Tooltip>{config_1.default.PRODUCT_TYPE_DESCRIPTIONS[key]}</utah_design_system_1.Tooltip>
              </react_aria_components_1.TooltipTrigger>
            </div>
          </utah_design_system_1.Checkbox>
        </div>);
        })}
      <p className="text-sm">...then proceed to Step 2 below</p>
    </div>);
}
