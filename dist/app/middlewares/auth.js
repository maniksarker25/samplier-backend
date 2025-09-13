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
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const appError_1 = __importDefault(require("../error/appError"));
const user_model_1 = require("../modules/user/user.model");
const catchasync_1 = __importDefault(require("../utilities/catchasync"));
// make costume interface
const auth = (...requiredRoles) => {
    return (0, catchasync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // check if the token is sent from client -----
        // let token = req?.headers?.authorization;
        // if (!token) {
        //   throw new AppError(httpStatus.UNAUTHORIZED, 'Your are not authorized 1');
        // }
        // if (token.startsWith('Bearer ')) {
        //   token = token.slice(7);
        // }
        let token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        if (!token) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // 2️⃣ Remove "Bearer " prefix if exists
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (err) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Token is expired');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, role, email, profileId, iat } = decoded;
        if (!decoded) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Token is expired');
        }
        // get the user if that here ---------
        const user = yield user_model_1.User.findById(id).select('isDeleted isBlocked isVerified passwordChangedAt');
        if (!user) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized');
        }
        if (user.isDeleted) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is already deleted');
        }
        if (user.isBlocked) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked');
        }
        if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'You are not verified user');
        }
        if ((user === null || user === void 0 ? void 0 : user.passwordChangedAt) && iat) {
            const passwordChangeTime = new Date(user === null || user === void 0 ? void 0 : user.passwordChangedAt).getTime() / 1000;
            if (passwordChangeTime > iat) {
                throw new appError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized 2');
            }
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Your are not authorized 3');
        }
        // add those properties in req
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable no-unused-vars */
// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '../utilities/catchasync';
// import AppError from '../error/appError';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import { TUserRole } from '../modules/user/user.interface';
// import { User } from '../modules/user/user.model';
// import { USER_ROLE } from '../modules/user/user.constant';
// import SuperAdmin from '../modules/superAdmin/superAdmin.model';
// import Bussiness from '../modules/bussiness/bussiness.model';
// import Reviewer from '../modules/reviewer/reviewer.model';
// const auth = (...requiredRoles: TUserRole[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req?.headers?.authorization;
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Your are not authorized 1');
//     }
//     let decoded;
//     try {
//       decoded = jwt.verify(
//         token,
//         config.jwt_access_secret as string,
//       ) as JwtPayload;
//     } catch (err) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Token is expired');
//     }
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { id, role, email, username, iat } = decoded;
//     if (!decoded) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Token is expired');
//     }
//     // get the user if that here ---------
//     const user = await User.findById(id);
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'This user does not exist');
//     }
//     if (user.isDeleted) {
//       throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted');
//     }
//     if (user.status === 'blocked') {
//       throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
//     }
//     if (!user?.isVerified) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'You are not verified user');
//     }
//     let profileData;
//     if (role === USER_ROLE.bussinessOwner) {
//       profileData = await Bussiness.findOne({ user: id }).select('_id');
//     } else if (role === USER_ROLE.reviewer) {
//       profileData = await Reviewer.findOne({ user: id }).select('_id');
//     } else if (role === USER_ROLE.superAdmin) {
//       profileData = await SuperAdmin.findOne({ user: id }).select('_id');
//     }
//     if (!profileData) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Unauthorized , user not found');
//     }
//     decoded.profileId = profileData?._id;
//     // if (
//     //   user?.passwordChangedAt &&
//     //   (await User.isJWTIssuedBeforePasswordChange(
//     //     user?.passwordChangedAt,
//     //     iat as number,
//     //   ))
//     // ) {
//     //   throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized 2');
//     // }
//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Your are not authorized 3');
//     }
//     // add those properties in req
//     req.user = decoded as JwtPayload;
//     next();
//   });
// };
// export default auth;
// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '../utilities/catchasync';
// import AppError from '../error/appError';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import { TUserRole } from '../modules/user/user.interface';
// import { User } from '../modules/user/user.model';
// import { USER_ROLE } from '../modules/user/user.constant';
// import SuperAdmin from '../modules/superAdmin/superAdmin.model';
// import Bussiness from '../modules/bussiness/bussiness.model';
// import Reviewer from '../modules/reviewer/reviewer.model';
// const auth = (...requiredRoles: TUserRole[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req?.headers?.authorization;
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }
//     let decoded;
//     try {
//       decoded = jwt.verify(
//         token,
//         config.jwt_access_secret as string,
//       ) as JwtPayload;
//     } catch (err) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Token is expired');
//     }
//     const { id, role } = decoded;
//     if (!decoded) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Token is expired');
//     }
//     // Fetch user and profile data in parallel using Promise.all
//     const userPromise = User.findById(id).select('isVerified status isDeleted');
//     const profilePromise =
//       role === USER_ROLE.bussinessOwner
//         ? Bussiness.findOne({ user: id }).select('_id')
//         : role === USER_ROLE.reviewer
//           ? Reviewer.findOne({ user: id }).select('_id')
//           : role === USER_ROLE.superAdmin
//             ? SuperAdmin.findOne({ user: id }).select('_id')
//             : null;
//     // Wait for both user and profile data
//     const [user, profileData] = await Promise.all([
//       userPromise,
//       profilePromise,
//     ]);
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'This user does not exist');
//     }
//     if (user.isDeleted || user.status === 'blocked' || !user.isVerified) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         'User is either deleted, blocked, or not verified',
//       );
//     }
//     if (!profileData) {
//       throw new AppError(
//         httpStatus.NOT_FOUND,
//         'Unauthorized, user profile not found',
//       );
//     }
//     decoded.profileId = profileData._id;
//     req.user = decoded as JwtPayload;
//     // Check if the user has required roles
//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }
//     next();
//   });
// };
// export default auth;
// try for cacheing
// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '../utilities/catchasync';
// import AppError from '../error/appError';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import { TUserRole } from '../modules/user/user.interface';
// import { User } from '../modules/user/user.model';
// import { USER_ROLE } from '../modules/user/user.constant';
// import SuperAdmin from '../modules/superAdmin/superAdmin.model';
// import Bussiness from '../modules/bussiness/bussiness.model';
// import Reviewer from '../modules/reviewer/reviewer.model';
// import NodeCache from 'node-cache';
// // Initialize in-memory cache (TTL = 1 hour)--------
// const userCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
// const auth = (...requiredRoles: TUserRole[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req?.headers?.authorization;
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }
//     let decoded: JwtPayload;
//     try {
//       decoded = jwt.verify(
//         token,
//         config.jwt_access_secret as string,
//       ) as JwtPayload;
//     } catch (err) {
//       throw new AppError(
//         httpStatus.UNAUTHORIZED,
//         'Token is expired or invalid',
//       );
//     }
//     const { id, role } = decoded;
//     if (!decoded) {
//       throw new AppError(
//         httpStatus.UNAUTHORIZED,
//         'Token is expired or invalid',
//       );
//     }
//     // Check if the profile data is cached
//     const cachedProfile: any = userCache.get(id);
//     if (cachedProfile) {
//       // If data is in the cache, use it directly
//       req.user = { ...decoded, profileId: cachedProfile._id };
//       return next();
//     }
//     // Fetch user and profile data in parallel using Promise.all
//     const userPromise = User.findById(id).select('isVerified status isDeleted');
//     const profilePromise = getProfileByRole(role, id);
//     // Wait for both user and profile data to load
//     const [user, profileData] = await Promise.all([
//       userPromise,
//       profilePromise,
//     ]);
//     // Handle missing user or profile
//     if (
//       !user ||
//       user.isDeleted ||
//       user.status === 'blocked' ||
//       !user.isVerified
//     ) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         'User is either deleted, blocked, or not verified',
//       );
//     }
//     if (!profileData) {
//       throw new AppError(
//         httpStatus.NOT_FOUND,
//         'Unauthorized, user profile not found',
//       );
//     }
//     // Add profile data to the decoded JWT
//     decoded.profileId = profileData._id;
//     req.user = decoded as JwtPayload;
//     // Cache the profile data for future use
//     userCache.set(id, profileData);
//     // Check if the user has required roles
//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(
//         httpStatus.UNAUTHORIZED,
//         'You are not authorized for this role',
//       );
//     }
//     next();
//   });
// };
// // Helper function to fetch profile data based on user role
// const getProfileByRole = async (role: string, userId: string) => {
//   switch (role) {
//     case USER_ROLE.bussinessOwner:
//       return Bussiness.findOne({ user: userId }).select('_id');
//     case USER_ROLE.reviewer:
//       return Reviewer.findOne({ user: userId }).select('_id');
//     case USER_ROLE.superAdmin:
//       return SuperAdmin.findOne({ user: userId }).select('_id');
//     default:
//       return null;
//   }
// };
// export default auth;
