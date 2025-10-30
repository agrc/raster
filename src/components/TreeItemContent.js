"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeItemContent = TreeItemContent;
var utah_design_system_1 = require("@ugrc/utah-design-system");
var lucide_react_1 = require("lucide-react");
var react_aria_components_1 = require("react-aria-components");
var tailwind_merge_1 = require("tailwind-merge");
function TreeItemContent(props) {
    return (<react_aria_components_1.TreeItemContent>
      {function (_a) {
            var hasChildItems = _a.hasChildItems, isExpanded = _a.isExpanded;
            return hasChildItems ? (<div className="flex w-full items-center justify-between">
            <utah_design_system_1.Button slot="chevron" variant="icon" className={(0, tailwind_merge_1.twMerge)('justify-start rounded !pr-2 text-sm dark:text-white', props.className)}>
              <lucide_react_1.ChevronRight className={(0, tailwind_merge_1.twJoin)('size-4 shrink-0 transition-transform duration-200', hasChildItems ? (isExpanded ? 'rotate-90' : '') : undefined)}/>
              {props.children}
            </utah_design_system_1.Button>
            {props.buttons && <div className="mr-1">{props.buttons}</div>}
          </div>) : (props.children);
        }}
    </react_aria_components_1.TreeItemContent>);
}
