"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.getUserById = void 0;
const user_model_1 = require("./user.model");
const getUserById = async (id) => {
    return await user_model_1.User.findOne({ _id: id });
};
exports.getUserById = getUserById;
const getAllUser = async () => {
    return await user_model_1.User.find();
};
exports.getAllUser = getAllUser;
