"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./utils/db"));
const logger_1 = require("./config/logger");
const user_routes_1 = __importDefault(require("./domains/user/user.routes"));
const swagger_1 = require("./swagger/swagger");
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = require("./middleware/error-handler");
const app = (0, express_1.default)();
const port = config_1.config.app.port;
const name = config_1.config.app.name;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/user', user_routes_1.default);
(0, swagger_1.swagger)(app);
app.use(not_found_1.default);
app.use(error_handler_1.errorHandlerMiddleware);
app.get('/', (req, res) => {
    res.send('Sialo : Social Media App');
});
const start = async () => {
    try {
        await (0, db_1.default)();
        app.listen(port, () => { console.log(`${name} started at http://localhost:${port}`); });
    }
    catch (err) {
        logger_1.logger.error(err);
    }
};
start();
