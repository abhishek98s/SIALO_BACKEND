"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.getUser = void 0;
const userExceptionMessage_1 = require("./constant/userExceptionMessage");
const UserDAO = __importStar(require("./user.repository"));
const getUser = async (id) => {
    const user = await UserDAO.getUserById(id);
    if (!user)
        throw Error(userExceptionMessage_1.userExceptionMessage.USER_NOT_FOUND);
    return user;
};
exports.getUser = getUser;
const getAllUser = async () => {
    const users = await UserDAO.getAllUser();
    if (!users)
        throw Error(userExceptionMessage_1.userExceptionMessage.USER_NOT_FOUND);
    return users;
};
exports.getAllUser = getAllUser;
