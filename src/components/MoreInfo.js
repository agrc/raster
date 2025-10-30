"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnEmailsIntoLinks = turnEmailsIntoLinks;
exports.default = MoreInfo;
var react_query_1 = require("@tanstack/react-query");
var utah_design_system_1 = require("@ugrc/utah-design-system");
var lucide_react_1 = require("lucide-react");
var react_content_loader_1 = require("react-content-loader");
var tailwind_merge_1 = require("tailwind-merge");
var resolveConfig_1 = require("tailwindcss/resolveConfig");
var usehooks_ts_1 = require("usehooks-ts");
var tailwind_config_1 = require("../../tailwind.config");
var config_1 = require("../config");
var moreInfo_1 = require("../services/moreInfo");
var utils_1 = require("./utils");
var fullConfig = (0, resolveConfig_1.default)(tailwind_config_1.default);
var commonTableCellClasses = 'py-2 [tr:not(:last-child)_&]:border-b';
function turnEmailsIntoLinks(text) {
    if (typeof text !== 'string') {
        return text;
    }
    var emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    var parts = text.split(emailRegex);
    return (<>
      {parts.map(function (part, index) {
            if (emailRegex.test(part)) {
                return (<utah_design_system_1.Link key={index} href={"mailto:".concat(part)}>
              {part}
            </utah_design_system_1.Link>);
            }
            else {
                return part;
            }
        })}
    </>);
}
function MoreInfo(_a) {
    var title = _a.title, productType = _a.productType, objectId = _a.objectId, _b = _a.getMoreInfoFn, getMoreInfoFn = _b === void 0 ? moreInfo_1.default : _b;
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['moreInfo', productType, objectId],
        queryFn: function () { return getMoreInfoFn(productType, objectId); },
    }), data = _c.data, error = _c.error, isLoading = _c.isLoading;
    var isDarkMode = (0, usehooks_ts_1.useDarkMode)().isDarkMode;
    return (<>
      <div slot="title" className="flex items-start justify-between">
        <span className="text-xl font-bold">{title}</span>
        <utah_design_system_1.Button slot="close" variant="icon" size="small" aria-label="Close">
          <lucide_react_1.X />
        </utah_design_system_1.Button>
      </div>
      {isLoading ? (<react_content_loader_1.BulletList backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]} foregroundColor="#FFFFFF"/>) : error || !data ? (<utah_design_system_1.Banner>Error loading more information</utah_design_system_1.Banner>) : (<table className="mt-2">
          <tbody>
            {Object.entries(data).map(function (_a) {
                var fieldName = _a[0], fieldValue = _a[1];
                return (<tr key={fieldName}>
                <td className={(0, tailwind_merge_1.twJoin)(commonTableCellClasses, 'font-semibold')}>
                  {config_1.default.MORE_INFO_FIELD_INFOS[productType][fieldName]}
                </td>
                <td className={(0, tailwind_merge_1.twJoin)(commonTableCellClasses, 'pl-2')}>
                  {(0, utils_1.isUrlLike)(fieldValue) ? (<utah_design_system_1.ExternalLink href={fieldValue}>{fieldValue}</utah_design_system_1.ExternalLink>) : (turnEmailsIntoLinks(fieldValue))}
                </td>
              </tr>);
            })}
          </tbody>
        </table>)}
    </>);
}
