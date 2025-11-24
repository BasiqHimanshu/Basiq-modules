"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
const jsx_runtime_1 = require("react/jsx-runtime");
function Button({ children }) {
    return ((0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-black text-white rounded", children: children }));
}
