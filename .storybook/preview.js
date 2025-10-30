"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../src/index.css");
var preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};
exports.default = preview;
