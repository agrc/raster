"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var utah_design_system_1 = require("@ugrc/utah-design-system");
var react_1 = require("react");
var react_aria_1 = require("react-aria");
var react_error_boundary_1 = require("react-error-boundary");
var react_stately_1 = require("react-stately");
var MapContainer_1 = require("./components/MapContainer");
var Wizard_1 = require("./components/Wizard");
var config_1 = require("./config");
var MapProvider_1 = require("./contexts/MapProvider");
var PreviewProvider_1 = require("./contexts/PreviewProvider");
var TilesContextProvider_1 = require("./contexts/TilesContextProvider");
var WizardMachineProvider_1 = require("./contexts/WizardMachineProvider");
var useUrlParams_1 = require("./hooks/useUrlParams");
var version = import.meta.env.PACKAGE_VERSION;
var ErrorFallback = function (_a) {
    var error = _a.error;
    return (<div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>);
};
var links = [
    {
        key: 'UGRC Homepage',
        action: { url: 'https://gis.utah.gov' },
    },
    {
        key: 'Discover Product Page',
        action: { url: 'https://gis.utah.gov/products/discover/' },
    },
    {
        key: 'UGRC Base Map Information',
        action: { url: 'https://gis.utah.gov/products/sgid/base-maps/' },
    },
    {
        key: 'UGRC Aerial Photography',
        action: { url: 'https://gis.utah.gov/products/sgid/aerial-photography/' },
    },
    {
        key: "Version ".concat(version, " changelog"),
        action: { url: "https://github.com/agrc/raster/releases/v".concat(version) },
    },
];
function App() {
    var app = (0, utah_design_system_1.useFirebaseApp)();
    var urlParams = (0, useUrlParams_1.useUrlParams)();
    var sideBarState = (0, react_stately_1.useOverlayTriggerState)({ defaultOpen: window.innerWidth >= config_1.default.MIN_DESKTOP_WIDTH });
    var sideBarTriggerProps = (0, react_aria_1.useOverlayTrigger)({
        type: 'dialog',
    }, sideBarState);
    // initialize firebase performance metrics
    (0, react_1.useEffect)(function () {
        function initPerformance() {
            return __awaiter(this, void 0, void 0, function () {
                var getPerformance;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('firebase/performance'); })];
                        case 1:
                            getPerformance = (_a.sent()).getPerformance;
                            return [2 /*return*/, getPerformance(app)];
                    }
                });
            });
        }
        if (!import.meta.env.DEV) {
            initPerformance();
        }
    }, [app]);
    return (<>
      <main className="flex h-screen flex-col md:gap-2">
        <utah_design_system_1.Header links={links}>
          <div className="flex h-full grow items-center gap-3">
            <utah_design_system_1.UgrcLogo />
            <h2 className="font-heading text-2xl font-black text-zinc-600 md:text-4xl lg:text-5xl dark:text-zinc-100">
              {urlParams.title || 'UGRC Raster Data Discovery'}
            </h2>
          </div>
        </utah_design_system_1.Header>
        <section className="relative flex min-h-0 flex-1 overflow-x-hidden md:mr-2">
          <MapProvider_1.MapProvider>
            <TilesContextProvider_1.default>
              <PreviewProvider_1.default>
                <WizardMachineProvider_1.default>
                  <utah_design_system_1.Drawer main state={sideBarState} {...sideBarTriggerProps}>
                    <Wizard_1.default />
                  </utah_design_system_1.Drawer>
                  <div className="relative flex flex-1 flex-col rounded border border-b-0 border-zinc-200 dark:border-0 dark:border-zinc-700">
                    <div className="relative flex-1 overflow-hidden dark:rounded">
                      <react_error_boundary_1.ErrorBoundary FallbackComponent={ErrorFallback}>
                        <MapContainer_1.MapContainer />
                      </react_error_boundary_1.ErrorBoundary>
                    </div>
                    <utah_design_system_1.SocialMedia />
                  </div>
                </WizardMachineProvider_1.default>
              </PreviewProvider_1.default>
            </TilesContextProvider_1.default>
          </MapProvider_1.MapProvider>
        </section>
      </main>
      <utah_design_system_1.Footer />
    </>);
}
