"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PreviewControls;
var utah_design_system_1 = require("@ugrc/utah-design-system");
var lucide_react_1 = require("lucide-react");
var usePreview_1 = require("../hooks/usePreview");
function PreviewControls() {
    var _a = (0, usePreview_1.default)(), selectedPreviewId = _a.selectedPreviewId, removePreview = _a.removePreview;
    if (!selectedPreviewId) {
        return null;
    }
    return (<div className="absolute top-0 z-10 flex w-full items-center justify-center">
      <div className="mx-10 mt-4 flex rounded-md bg-accent-300/75 px-2 py-1 text-zinc-800">
        {selectedPreviewId}
        <utah_design_system_1.Button className="ml-1" variant="icon" onClick={removePreview} aria-label="Clear preview layer">
          <lucide_react_1.X size={16} className="text-zinc-800"/>
        </utah_design_system_1.Button>
      </div>
    </div>);
}
