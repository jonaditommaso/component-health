"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX = void 0;
exports.REGEX = {
    useEffect: /(?<!\bimport\s.*{[^}]*\b)useEffect\b(?![^}]*\b\})/g,
    useState: /(?<!\bimport\s.*{[^}]*\b)(useState|React\.useState)\b(?![^}]*\b\})/g
};
//# sourceMappingURL=regex.js.map