"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMiddleware = exports.logger = void 0;
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join('logs', 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '5m',
        }),
    ],
});
module.exports = exports.logger;
// Middleware function to log requests and responses
const logMiddleware = (req, res, next) => {
    // Log the request data
    exports.logger.info({
        message: 'Request received',
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body,
        formdata: req.files,
    });
    // Save the original response.send function
    const originalSend = res.send;
    // Override the response.send function to intercept the response body and log it
    res.send = function (body) {
        // Log the response data
        exports.logger.info({
            message: 'Response sent',
            status: res.statusCode,
            body: body,
        });
        // Call the original response.send function
        originalSend.call(this, body);
    };
    next();
};
exports.logMiddleware = logMiddleware;
