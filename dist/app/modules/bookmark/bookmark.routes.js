"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const bookmark_controller_1 = __importDefault(require("./bookmark.controller"));
const router = express_1.default.Router();
router.post('/add-delete-bookmark/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), bookmark_controller_1.default.bookmarkAddDelete);
router.get('/my-bookmarks', (0, auth_1.default)(user_constant_1.USER_ROLE.reviewer), bookmark_controller_1.default.getMyBookmark);
exports.bookmarkRoutes = router;
