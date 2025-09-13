"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../middleware/passport");
const oAuth_controller_1 = __importDefault(require("./oAuth.controller"));
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
//
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), oAuth_controller_1.default.loginWithGoogle);
router.post('/oauth-login', oAuth_controller_1.default.oAuthLogin);
router.post('/link-social', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer, user_constant_1.USER_ROLE.bussinessOwner), oAuth_controller_1.default.oAuthLink);
exports.default = router;
