"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardMachineContext = void 0;
exports.default = WizardMachineProvider;
var react_1 = require("@xstate/react");
var react_2 = require("react");
var useUrlParams_1 = require("../hooks/useUrlParams");
var wizardMachine_1 = require("../services/wizardMachine");
exports.WizardMachineContext = (0, react_2.createContext)(null);
function WizardMachineProvider(_a) {
    var children = _a.children;
    var urlParams = (0, useUrlParams_1.useUrlParams)();
    // Get initial state based on URL parameters
    var initialState = (0, react_2.useMemo)(function () {
        return (0, wizardMachine_1.getInitialState)({
            cat: urlParams.cat,
            catGroup: urlParams.catGroup,
            products: urlParams.products,
        });
    }, [urlParams.cat, urlParams.catGroup, urlParams.products]);
    var _b = (0, react_1.useActor)(wizardMachine_1.machine, {
        input: initialState,
    }), snapshot = _b[0], send = _b[1];
    return <exports.WizardMachineContext.Provider value={{ snapshot: snapshot, send: send }}>{children}</exports.WizardMachineContext.Provider>;
}
