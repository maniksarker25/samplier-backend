"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
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
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../error/appError"));
const registerSucessEmail_1 = __importDefault(require("../../mailTemplate/registerSucessEmail"));
const sendEmail_1 = __importDefault(require("../../utilities/sendEmail"));
const bussiness_model_1 = __importDefault(require("../bussiness/bussiness.model"));
const normalUser_model_1 = __importDefault(require("../normalUser/normalUser.model"));
const notificationSetting_model_1 = require("../notificationSetting/notificationSetting.model");
const reviewer_model_1 = __importDefault(require("../reviewer/reviewer.model"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const generateVerifyCode = () => {
    return Math.floor(10000 + Math.random() * 90000);
};
const registerBussinessOwner = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExist = yield user_model_1.User.findOne({ email: email });
    if (emailExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'This email already exist');
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const verifyCode = generateVerifyCode();
        const userDataPayload = {
            email: email,
            password: password,
            role: user_constant_1.USER_ROLE.bussinessOwner,
            verifyCode,
            codeExpireIn: new Date(Date.now() + 2 * 60000),
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = yield user_model_1.User.create([userDataPayload], { session });
        const bussinessOwnerPayload = {
            email,
            user: user[0]._id,
        };
        const result = yield bussiness_model_1.default.create([bussinessOwnerPayload], { session });
        yield user_model_1.User.findByIdAndUpdate(user[0]._id, { profileId: result[0]._id }, { session });
        (0, sendEmail_1.default)({
            email: email,
            subject: 'Activate Your Account',
            html: (0, registerSucessEmail_1.default)('Dear', user[0].verifyCode),
        });
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// register reviewer
const registerReviewer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const emailExist = yield user_model_1.User.findOne({ email: payload.email });
    if (emailExist) {
        throw new appError_1.default(http_status_1.default.CONFLICT, 'This email already exist');
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const verifyCode = generateVerifyCode();
        const userDataPayload = {
            email: payload.email,
            password: payload.password,
            role: user_constant_1.USER_ROLE.reviewer,
            verifyCode,
            codeExpireIn: new Date(Date.now() + 2 * 60000),
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = yield user_model_1.User.create([userDataPayload], { session });
        const reviewerPayload = {
            email: payload.email,
            name: payload.name,
            username: payload.username,
            user: user[0]._id,
        };
        const result = yield reviewer_model_1.default.create([reviewerPayload], { session });
        if (!result) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to registered');
        }
        yield user_model_1.User.findByIdAndUpdate(user[0]._id, { profileId: result[0]._id }, { session });
        // ! TODO: need to upgrade the email template
        (0, sendEmail_1.default)({
            email: payload.email,
            subject: 'Activate Your Account',
            html: (0, registerSucessEmail_1.default)('Dear', user[0].verifyCode),
        });
        yield notificationSetting_model_1.NotificationSetting.create({ user: result[0]._id });
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const verifyCode = (email, verifyCode) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.codeExpireIn < new Date(Date.now())) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Verify code is expired');
    }
    if (verifyCode !== user.verifyCode) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Code doesn't match");
    }
    yield user_model_1.User.findOneAndUpdate({ email: email }, { isVerified: true }, { new: true, runValidators: true });
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
const resendVerifyCode = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const verifyCode = generateVerifyCode();
    const updateUser = yield user_model_1.User.findOneAndUpdate({ email: email }, { verifyCode: verifyCode, codeExpireIn: new Date(Date.now() + 5 * 60000) }, { new: true, runValidators: true });
    if (!updateUser) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong . Please again resend the code after a few second');
    }
    (0, sendEmail_1.default)({
        email: user.email,
        subject: 'Activate Your Account',
        html: (0, registerSucessEmail_1.default)('Dear', updateUser.verifyCode),
    });
    return null;
});
// all cron jobs for users
node_cron_1.default.schedule('*/2 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        // Find unverified users whose expiration time has passed
        const expiredUsers = yield user_model_1.User.find({
            isVerified: false,
            codeExpireIn: { $lte: now },
        });
        if (expiredUsers.length > 0) {
            const expiredUserIds = expiredUsers.map((user) => user._id);
            // Delete corresponding NormalUser documents
            const normalUserDeleteResult = yield normalUser_model_1.default.deleteMany({
                user: { $in: expiredUserIds },
            });
            // Delete the expired User documents
            const userDeleteResult = yield user_model_1.User.deleteMany({
                _id: { $in: expiredUserIds },
            });
            console.log(`Deleted ${userDeleteResult.deletedCount} expired inactive users`);
            console.log(`Deleted ${normalUserDeleteResult.deletedCount} associated NormalUser documents`);
        }
    }
    catch (error) {
        console.log('Error deleting expired users and associated data:', error);
    }
}));
const changeUserStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isBlocked: !user.isBlocked }, { new: true, runValidators: true });
    return result;
});
const userServices = {
    registerBussinessOwner,
    registerReviewer,
    verifyCode,
    resendVerifyCode,
    changeUserStatus,
};
exports.default = userServices;
