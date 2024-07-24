"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const errorHandlerMiddleware = (err, req, res) => {
    return res.status(500).json({
        msg: 'Something went wrong, try again later',
        error: err.message,
    });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
