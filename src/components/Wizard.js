"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Wizard;
var utah_design_system_1 = require("@ugrc/utah-design-system");
var useWizardMachine_1 = require("../hooks/useWizardMachine");
var AreaOfInterest_1 = require("./AreaOfInterest");
var Download_1 = require("./Download");
var SearchResults_1 = require("./SearchResults");
var SelectProductTypes_1 = require("./SelectProductTypes");
function Wizard() {
    var _a = (0, useWizardMachine_1.default)(), snapshot = _a.snapshot, send = _a.send;
    return (<div className="px-1 py-1 md:py-0">
      <utah_design_system_1.DisclosureGroup expandedKeys={[snapshot.value]} onExpandedChange={function (newKeys) {
            if (newKeys.size) {
                var firstKey = newKeys.values().next().value;
                send({ type: String(firstKey).toUpperCase() });
            }
        }}>
        <utah_design_system_1.Disclosure id="step1">
          <utah_design_system_1.DisclosureHeader>Step 1 - Select Products</utah_design_system_1.DisclosureHeader>
          <utah_design_system_1.DisclosurePanel className="group-data-[expanded]:px-2">
            <SelectProductTypes_1.default />
          </utah_design_system_1.DisclosurePanel>
        </utah_design_system_1.Disclosure>
        <utah_design_system_1.Disclosure id="step2" isDisabled={!snapshot.context.productTypes.length}>
          <utah_design_system_1.DisclosureHeader>Step 2 - Define Area of Interest</utah_design_system_1.DisclosureHeader>
          <utah_design_system_1.DisclosurePanel className="group-data-[expanded]:px-2">
            <AreaOfInterest_1.default />
          </utah_design_system_1.DisclosurePanel>
        </utah_design_system_1.Disclosure>
        <utah_design_system_1.Disclosure id="step3" isDisabled={!snapshot.context.productTypes.length || !snapshot.context.aoi}>
          <utah_design_system_1.DisclosureHeader>Step 3 - Results</utah_design_system_1.DisclosureHeader>
          <utah_design_system_1.DisclosurePanel className="group-data-[expanded]:px-2">
            <SearchResults_1.default />
          </utah_design_system_1.DisclosurePanel>
        </utah_design_system_1.Disclosure>
        <utah_design_system_1.Disclosure id="step4" isDisabled={!snapshot.context.download}>
          <utah_design_system_1.DisclosureHeader>Step 4 - Download</utah_design_system_1.DisclosureHeader>
          <utah_design_system_1.DisclosurePanel className="group-data-[expanded]:px-2">
            <Download_1.default />
          </utah_design_system_1.DisclosurePanel>
        </utah_design_system_1.Disclosure>
      </utah_design_system_1.DisclosureGroup>
    </div>);
}
