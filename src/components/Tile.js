"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tile;
var utah_design_system_1 = require("@ugrc/utah-design-system");
var react_1 = require("react");
var tailwind_merge_1 = require("tailwind-merge");
function Tile(_a) {
    var attributes = _a.attributes, onHover = _a.onHover, isHighlighted = _a.isHighlighted;
    var OBJECTID = attributes.OBJECTID, TILE = attributes.TILE, SIZE = attributes.SIZE, EXT = attributes.EXT, PATH = attributes.PATH;
    var filename = "".concat(TILE).concat(EXT);
    var rootNodeRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var _a;
        if (isHighlighted) {
            (_a = rootNodeRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [isHighlighted]);
    return (<div ref={rootNodeRef}>
      <utah_design_system_1.Link download className={(0, tailwind_merge_1.twJoin)('flex justify-between rounded p-1 no-underline', isHighlighted && 'bg-zinc-50 font-bold dark:bg-zinc-800')} href={"".concat(PATH).concat(filename)} onMouseEnter={function () { return onHover(OBJECTID, true); }} onMouseLeave={function () { return onHover(OBJECTID, false); }}>
        <span>{filename}</span>
        <span>{SIZE} MB</span>
      </utah_design_system_1.Link>
    </div>);
}
