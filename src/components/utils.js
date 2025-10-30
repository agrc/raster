"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSort = getSort;
exports.isYes = isYes;
exports.isUrlLike = isUrlLike;
exports.removeCurlyBracesContent = removeCurlyBracesContent;
var config_1 = require("../config");
function getSort(order) {
    order = order.map(function (val) { return val.toLocaleLowerCase(); });
    return function (a, b) {
        var aValue = a.attributes[config_1.default.EXTENT_FIELDS.Product].toLocaleLowerCase();
        var aIndex = order.findIndex(function (val) { return aValue.includes(val); });
        var bValue = b.attributes[config_1.default.EXTENT_FIELDS.Product].toLocaleLowerCase();
        var bIndex = order.findIndex(function (val) { return bValue.includes(val); });
        // Unmatched items (index === -1) should be sorted to the end, and
        // maintain their relative order among themselves (by returning 0).
        if (aIndex === -1 && bIndex === -1)
            return 0;
        if (aIndex === -1)
            return 1;
        if (bIndex === -1)
            return -1;
        return aIndex - bIndex;
    };
}
function isYes(value) {
    if (typeof value !== 'string') {
        return false;
    }
    return value.trim().toUpperCase() === 'YES';
}
function isUrlLike(text) {
    if (typeof text !== 'string') {
        return false;
    }
    var trimmed = text.trim();
    if (trimmed === '') {
        return false;
    }
    try {
        var url = new URL(trimmed);
        return url.protocol === 'http:' || url.protocol === 'https:';
    }
    catch (_a) {
        return false;
    }
}
function removeCurlyBracesContent(text) {
    // Remove non-nested occurrences of {...} including the braces themselves, then trim.
    return text.replace(/\{[^}]*\}/g, '').trim();
}
