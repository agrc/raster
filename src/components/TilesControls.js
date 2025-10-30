"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TilesControls;
var useTiles_1 = require("../hooks/useTiles");
function TilesControls() {
    var count = (0, useTiles_1.default)().count;
    if (!count) {
        return null;
    }
    return (<div className="absolute top-0 z-10 flex w-full items-center justify-center">
      <div className="mx-10 mt-4 flex rounded-md bg-primary-300/75 px-2 py-1 text-zinc-800">
        {count.toLocaleString()} Tiles Found
      </div>
    </div>);
}
