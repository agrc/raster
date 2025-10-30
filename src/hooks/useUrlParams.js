"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrlParams = parseUrlParams;
exports.useUrlParams = useUrlParams;
var react_1 = require("react");
/**
 * Parses URL search parameters and returns structured data
 */
function parseUrlParams() {
    var searchParams = new URLSearchParams(window.location.search);
    var title = searchParams.get('title');
    var cat = searchParams.get('cat');
    var catGroupParam = searchParams.get('catGroup');
    var productsParam = searchParams.get('products');
    // Parse catGroup as comma-separated list
    var catGroup = catGroupParam ? catGroupParam.split(',').map(function (s) { return s.trim(); }) : null;
    // Parse products as comma-separated list of zero-based indices
    var products = productsParam
        ? productsParam
            .split(',')
            .map(function (s) { return parseInt(s.trim(), 10); })
            .filter(function (n) { return !isNaN(n); })
        : null;
    return {
        title: title,
        cat: cat,
        catGroup: catGroup,
        products: products,
    };
}
/**
 * Hook that returns current URL parameters
 */
function useUrlParams() {
    var params = (0, react_1.useMemo)(function () { return parseUrlParams(); }, []);
    // Update document title if title parameter is present
    (0, react_1.useEffect)(function () {
        if (params.title) {
            document.title = params.title;
        }
    }, [params.title]);
    var hasFilters = params.cat !== null || params.catGroup !== null;
    // Reset URL is just the base path with no parameters
    var resetUrl = '/';
    return __assign(__assign({}, params), { hasFilters: hasFilters, resetUrl: resetUrl });
}
