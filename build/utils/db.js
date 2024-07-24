"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../config/logger");
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        const conn = await mongoose_1.default.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger_1.logger.error(error);
    }
};
exports.default = connectDB;
