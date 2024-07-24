"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrapper = void 0;
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            fn(req, res, next);
        }
        catch (err) {
            next(err);
            console.log(err.message);
        }
    };
};
exports.asyncWrapper = asyncWrapper;
exports.default = exports.asyncWrapper;
