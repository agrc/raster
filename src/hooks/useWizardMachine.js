"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useWizardMachine;
var react_1 = require("react");
var WizardMachineProvider_1 = require("../contexts/WizardMachineProvider");
function useWizardMachine() {
    var context = (0, react_1.useContext)(WizardMachineProvider_1.WizardMachineContext);
    if (context === null) {
        throw new Error('useWizardMachine must be used within a WizardMachineProvider');
    }
    return context;
}
