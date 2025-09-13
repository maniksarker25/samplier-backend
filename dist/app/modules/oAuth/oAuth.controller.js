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
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const catchasync_1 = __importDefault(require("../../utilities/catchasync"));
const oAuth_service_1 = __importDefault(require("./oAuth.service"));
const sendResponse_1 = __importDefault(require("../../utilities/sendResponse"));
const loginWithGoogle = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized user');
    }
    const result = yield oAuth_service_1.default.loginWithGoogle(user);
    res.cookie('refresh-token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User login successfully',
        data: result,
    });
}));
const oAuthLogin = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { provider, token, role } = req.body;
    if (!['google', 'apple', 'facebook'].includes(provider)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid provider');
    }
    const result = yield oAuth_service_1.default.loginWithOAuth(provider, token, role);
    res.cookie('refresh-token', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User login successfully',
        data: result,
    });
}));
const oAuthLink = (0, catchasync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { provider, token } = req.body;
    if (!['google', 'apple', 'facebook'].includes(provider)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid provider');
    }
    const result = yield oAuth_service_1.default.loginWithOAuth(provider, token, req.user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Social link successfully',
        data: result,
    });
}));
const oAuthController = {
    loginWithGoogle,
    oAuthLogin,
    oAuthLink,
};
exports.default = oAuthController;
