"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const bussiness_model_1 = __importDefault(require("../modules/bussiness/bussiness.model"));
const reviewer_model_1 = __importDefault(require("../modules/reviewer/reviewer.model"));
const superAdmin_model_1 = __importDefault(require("../modules/superAdmin/superAdmin.model"));
const user_constant_1 = require("../modules/user/user.constant");
const simpleAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return next(); // Continue if no token is provided
        }
        let decoded = null;
        try {
            // Verify token to check validity
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (err) {
            // If token expired, decode without verifying
            if (err.name === 'TokenExpiredError') {
                decoded = jsonwebtoken_1.default.decode(token);
            }
            else {
                return next(); // Ignore other errors
            }
        }
        if (decoded) {
            const { id, role } = decoded;
            let profileData;
            if (role === user_constant_1.USER_ROLE.bussinessOwner) {
                profileData = yield bussiness_model_1.default.findOne({ user: id }).select('_id');
            }
            else if (role === user_constant_1.USER_ROLE.superAdmin) {
                profileData = yield superAdmin_model_1.default.findOne({ user: id }).select('_id');
            }
            else if (role === user_constant_1.USER_ROLE.reviewer) {
                profileData = yield reviewer_model_1.default.findOne({ user: id }).select('_id');
            }
            if (profileData) {
                decoded.profileId = profileData._id;
            }
            req.user = decoded;
        }
        next(); // Proceed to the next middleware
    }
    catch (error) {
        console.log(error);
        next(); // Ignore errors and proceed
    }
});
exports.default = simpleAuth;
