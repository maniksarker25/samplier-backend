"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const meta_controller_1 = __importDefault(require("./meta.controller"));
const router = express_1.default.Router();
router.get('/get-reviewer-meta-data', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), meta_controller_1.default.getReviewerMetaData);
router.get('/get-bussiness-meta-data', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), meta_controller_1.default.getBussinessMetaData);
exports.metaRoutes = router;
