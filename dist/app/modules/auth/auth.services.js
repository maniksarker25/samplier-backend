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
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const user_model_1 = require("../user/user.model");
const user_utils_1 = require("../user/user.utils");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const resetPasswordEmailBody_1 = __importDefault(require("../../mailTemplate/resetPasswordEmailBody"));
const sendEmail_1 = __importDefault(require("../../utilities/sendEmail"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_constant_1 = require("../user/user.constant");
const normalUser_model_1 = __importDefault(require("../normalUser/normalUser.model"));
const changeEmailVerificationBody_1 = __importDefault(require("../../mailTemplate/changeEmailVerificationBody"));
const bussiness_model_1 = __importDefault(require("../bussiness/bussiness.model"));
const reviewer_model_1 = __importDefault(require("../reviewer/reviewer.model"));
const generateVerifyCode = () => {
    return Math.floor(10000 + Math.random() * 90000);
};
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user does not exist');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
    }
    if (!user.isVerified) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'You are not verified user . Please verify your email');
    }
    // checking if the password is correct ----
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Password do not match');
    }
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
const loginWithGoogle = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if the user already exists
        const isExistUser = yield user_model_1.User.findOne({ email: payload.email }, { isVerified: true }).session(session);
        // If user exists, create JWT and return tokens
        if (isExistUser) {
            const jwtPayload = {
                id: isExistUser._id,
                profileId: isExistUser.profileId,
                email: isExistUser.email,
                role: isExistUser.role,
            };
            const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
            const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
            yield session.commitTransaction();
            session.endSession();
            return { accessToken, refreshToken };
        }
        // If user doesn't exist, create a new user
        const userDataPayload = {
            email: payload.email,
            phone: payload === null || payload === void 0 ? void 0 : payload.phone,
            role: user_constant_1.USER_ROLE.bussinessOwner,
        };
        const createUser = yield user_model_1.User.create([userDataPayload], { session });
        const normalUserData = {
            name: payload.name,
            email: payload.email,
            profile_image: payload.profile_image,
            user: createUser[0]._id,
        };
        yield normalUser_model_1.default.create([normalUserData], {
            session,
        });
        // Create JWT tokens
        const jwtPayload = {
            id: createUser[0]._id,
            profileId: createUser[0].profileId,
            email: createUser[0].email,
            role: createUser[0].role,
        };
        const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
        const refreshToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
        yield session.commitTransaction();
        session.endSession();
        return { accessToken, refreshToken };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// change password
const changePasswordIntoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.newPassword !== payload.confirmNewPassword) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Password and confirm password doesn't match");
    }
    const user = yield user_model_1.User.findById(userData.id);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user does not exist');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
    }
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user === null || user === void 0 ? void 0 : user.password))) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Password do not match');
    }
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        _id: userData.id,
        role: userData.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, user_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, email, iat } = decoded;
    const user = yield user_model_1.User.findOne({
        $or: [{ email: email }, { username: username }],
    });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user does not exist');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
    }
    // if (
    //   user?.passwordChangedAt &&
    //   (await User.isJWTIssuedBeforePasswordChange(
    //     user?.passwordChangedAt,
    //     iat as number,
    //   ))
    // ) {
    //   throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    // }
    const jwtPayload = {
        id: user === null || user === void 0 ? void 0 : user._id,
        profileId: user === null || user === void 0 ? void 0 : user.profileId,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, user_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
// forgot password
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user does not exist');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
    }
    const resetCode = generateVerifyCode();
    yield user_model_1.User.findOneAndUpdate({ email: email }, {
        resetCode: resetCode,
        isResetVerified: false,
        codeExpireIn: new Date(Date.now() + 5 * 60000),
    });
    // sendEmail(
    //   user.email,
    //   'Reset password code',
    //   resetPasswordEmailBody(user.username, resetCode),
    // );
    (0, sendEmail_1.default)({
        email: user.email,
        subject: 'Reset password code',
        html: (0, resetPasswordEmailBody_1.default)('Dear', resetCode),
    });
    return null;
    // const jwtPayload = {
    //   id: user?._id,
    //   email: user?.email,
    //   role: user?.role as TUserRole,
    // };
    // const resetToken = createToken(
    //   jwtPayload,
    //   config.jwt_access_secret as string,
    //   '10m',
    // );
    // const resetUiLink = `${config.reset_password_ui_link}?${user._id}&token=${resetToken}`;
    // const emailContent = generateResetPasswordEmail(resetUiLink);
    // // Send the email
    // sendEmail(user?.email, 'Reset your password within 10 mins!', emailContent);
});
// verify forgot otp
const verifyResetOtp = (email, resetCode) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user does not exist');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
    }
    if (user.codeExpireIn < new Date(Date.now())) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Reset code is expire');
    }
    if (user.resetCode !== Number(resetCode)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Reset code is invalid');
    }
    yield user_model_1.User.findOneAndUpdate({ email: email }, { isResetVerified: true }, { new: true, runValidators: true });
    return null;
});
// reset password
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.password !== payload.confirmPassword) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Password and confirm password doesn't match");
    }
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user does not exist');
    }
    if (!user.isResetVerified) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'You need to verify reset code before reset password');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
    }
    // verify token -------------
    // const decoded = jwt.verify(
    //   token,
    //   config.jwt_access_secret as string,
    // ) as JwtPayload;
    // // console.log(decoded.userId, payload.id);
    // if (decoded?.userId !== payload?.email) {
    //   throw new AppError(
    //     httpStatus.FORBIDDEN,
    //     'You are forbidden to access this',
    //   );
    // }
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    // update the new password
    yield user_model_1.User.findOneAndUpdate({
        email: payload.email,
    }, {
        password: newHashedPassword,
        isResetVerified: false,
        passwordChangedAt: new Date(),
    });
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
const resendResetCode = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user does not exist');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
    }
    const resetCode = generateVerifyCode();
    yield user_model_1.User.findOneAndUpdate({ email: email }, {
        resetCode: resetCode,
        isResetVerified: false,
        codeExpireIn: new Date(Date.now() + 5 * 60000),
    });
    (0, sendEmail_1.default)({
        email: user.email,
        subject: 'Reset password code',
        html: (0, resetPasswordEmailBody_1.default)('Dear', resetCode),
    });
    return null;
});
// resend verify code ----------------------
const resendVerifyCode = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user does not exist');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
    }
    if (user.isBlocked) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
    }
    const verifyCode = generateVerifyCode();
    yield user_model_1.User.findOneAndUpdate({ email: email }, {
        verifyCode: verifyCode,
        isVerified: false,
        codeExpireIn: new Date(Date.now() + 5 * 60000),
    });
    (0, sendEmail_1.default)({
        email: user.email,
        subject: 'Reset password code',
        html: (0, resetPasswordEmailBody_1.default)('Dear', verifyCode),
    });
    return null;
});
const changeEmail = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userData.id);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Password do not match');
    }
    const code = generateVerifyCode();
    yield user_model_1.User.findByIdAndUpdate(userData.id, {
        emailChangeCode: code,
        codeExpireIn: new Date(Date.now() + 2 * 60000),
    });
    (0, sendEmail_1.default)({
        email: payload.email,
        subject: 'Email Change Verification Code',
        html: (0, changeEmailVerificationBody_1.default)('Dear', code),
    });
});
const verifyEmailCode = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userData.id).session(session);
        if (!user) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        if (user.emailChangeCode !== payload.code) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid verification code');
        }
        if (user.codeExpireIn < new Date(Date.now())) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Code is expire');
        }
        // Update user email
        yield user_model_1.User.findByIdAndUpdate(userData.id, { email: payload.email }, { session });
        // Update related profile based on user role
        if (userData.role === user_constant_1.USER_ROLE.bussinessOwner) {
            yield bussiness_model_1.default.findByIdAndUpdate(userData.profileId, { email: payload.email }, { session });
        }
        else if (userData.role === user_constant_1.USER_ROLE.reviewer) {
            yield reviewer_model_1.default.findByIdAndUpdate(userData.profileId, { email: payload.email }, { session });
        }
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return null;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, `Validation Error: ${error.message}`);
        }
        else if (error instanceof mongoose_1.default.Error.CastError) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid ID format');
        }
        else {
            throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'An error occurred while updating the email');
        }
    }
});
const authServices = {
    loginUserIntoDB,
    changePasswordIntoDB,
    refreshToken,
    forgetPassword,
    resetPassword,
    verifyResetOtp,
    resendResetCode,
    loginWithGoogle,
    resendVerifyCode,
    changeEmail,
    verifyEmailCode,
};
exports.default = authServices;
