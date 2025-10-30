"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("@arcgis/core/config");
var react_query_1 = require("@tanstack/react-query");
var esri_theme_toggle_1 = require("@ugrc/esri-theme-toggle");
var utah_design_system_1 = require("@ugrc/utah-design-system");
var react_1 = require("react");
var client_1 = require("react-dom/client");
var App_1 = require("./App");
require("./index.css");
config_1.default.assetsPath = './assets';
(0, esri_theme_toggle_1.default)();
var firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
};
if (import.meta.env.VITE_FIREBASE_CONFIG) {
    firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
}
console.log("Raster app version: ".concat(import.meta.env.PACKAGE_VERSION));
var queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 60 * 1000, // 30 minutes
            refetchOnWindowFocus: false,
        },
    },
});
(0, client_1.createRoot)(document.getElementById('root')).render(<react_1.default.StrictMode>
    <utah_design_system_1.FirebaseAppProvider config={firebaseConfig}>
      <utah_design_system_1.FirebaseAnalyticsProvider>
        <react_query_1.QueryClientProvider client={queryClient}>
          <App_1.default />
        </react_query_1.QueryClientProvider>
      </utah_design_system_1.FirebaseAnalyticsProvider>
    </utah_design_system_1.FirebaseAppProvider>
  </react_1.default.StrictMode>);
