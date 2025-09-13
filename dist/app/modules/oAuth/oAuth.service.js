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
const apple_signin_auth_1 = __importDefault(require("apple-signin-auth"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const google_auth_library_1 = require("google-auth-library");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../error/appError"));
const bussiness_model_1 = __importDefault(require("../bussiness/bussiness.model"));
const reviewer_model_1 = __importDefault(require("../reviewer/reviewer.model"));
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const user_utils_1 = require("../user/user.utils");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
dotenv_1.default.config();
const loginWithGoogle = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const jwtPayload = {
        id: user === null || user === void 0 ? void 0 : user._id,
        profileId: user.profileId,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const loginWithOAuth = (provider, token, role) => __awaiter(void 0, void 0, void 0, function* () {
    let email, id, name, picture;
    if (provider === 'google') {
        const ticket = yield googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invlid token');
        }
        email = payload.email;
        id = payload.sub;
        name = payload.name;
        picture = payload.picture;
    }
    else if (provider === 'facebook') {
        const response = yield axios_1.default.get(`https://graph.facebook.com/me?fields=id,email,name,picture&access_token=${token}`);
        email = response.data.email;
        id = response.data.id;
        name = response.data.name;
        picture = response.data.picture.data.url;
    }
    else if (provider === 'apple') {
        const appleUser = yield apple_signin_auth_1.default.verifyIdToken(token, {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: false,
        });
        email = appleUser.email;
        id = appleUser.sub;
        name = 'Apple User';
    }
    else {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid token, Please try again');
    }
    let user = yield user_model_1.User.findOne({ [`${provider}Id`]: id });
    if (!user) {
        user = new user_model_1.User({
            email,
            [`${provider}Id`]: id,
            name,
            profilePic: picture,
            role,
        });
        yield user.save();
        if (role === user_constant_1.USER_ROLE.bussinessOwner)
            yield bussiness_model_1.default.create({
                user: user._id,
                email: email,
                profile_image: picture,
            });
        else
            yield reviewer_model_1.default.create({
                user: user._id,
                email: email,
                profile_image: picture,
            });
    }
    const jwtPayload = {
        id: user === null || user === void 0 ? void 0 : user._id,
        profileId: user === null || user === void 0 ? void 0 : user.profileId,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken };
});
const linkSocialAccount = (provider, token, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let id;
    if (provider === 'google') {
        const ticket = yield googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid token, Please try again');
        }
        id = payload.sub;
    }
    else if (provider === 'facebook') {
        const response = yield axios_1.default.get(`https://graph.facebook.com/me?fields=id,email&access_token=${token}`);
        id = response.data.id;
    }
    else if (provider === 'apple') {
        const appleUser = yield apple_signin_auth_1.default.verifyIdToken(token, {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: false,
        });
        id = appleUser.sub;
    }
    else {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid token, Please try again');
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const existingUser = yield user_model_1.User.findOne({ [`${provider}Id`]: id });
    if (existingUser && existingUser._id.toString() !== userId) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "'This social account is already linked to another user.'");
    }
    user[`${provider}Id`] = id;
    yield user.save();
    return user;
});
const oAuthService = {
    loginWithOAuth,
    loginWithGoogle,
    linkSocialAccount,
};
exports.default = oAuthService;
