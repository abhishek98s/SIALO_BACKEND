"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swagger = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SIAO_BACKEND API',
            version: '1.0.0',
            description: 'API documentation for Sialo.',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
            },
        ],
    },
    apis: [`${__dirname}/*.ts`], // Path to the API routes
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const swagger = function (app) {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
};
exports.swagger = swagger;
