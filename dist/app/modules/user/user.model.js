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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    profileId: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        // unique: true,
    },
    password: {
        type: String,
        // required: true,
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['bussinessOwner', 'reviewer', 'superAdmin'],
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    verifyCode: {
        type: Number,
    },
    resetCode: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isResetVerified: {
        type: Boolean,
        default: false,
    },
    codeExpireIn: {
        type: Date,
    },
    emailChangeCode: {
        type: Number,
    },
    isEmailChangeVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isStripeAccountConnected: { type: Boolean, default: false },
    stripeConnectedAccountId: { type: String },
    googleId: {
        type: String,
        default: '',
    },
    appleId: {
        type: String,
        default: '',
    },
    facebookId: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
// statics method for check is user exists
userSchema.statics.isUserExists = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ phoneNumber }).select('+password');
    });
};
// statics method for check password match  ----
userSchema.statics.isPasswordMatched = function (plainPasswords, hashPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainPasswords, hashPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChange = function (passwordChangeTimeStamp, jwtIssuedTimeStamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordChangeTime = new Date(passwordChangeTimeStamp).getTime() / 1000;
        return passwordChangeTime > jwtIssuedTimeStamp;
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
