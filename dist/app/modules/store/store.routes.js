"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const store_validation_1 = __importDefault(require("./store.validation"));
const store_controller_1 = __importDefault(require("./store.controller"));
const router = express_1.default.Router();
router.post('/create-store', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, validateRequest_1.default)(store_validation_1.default.createStoreValidationSchema), store_controller_1.default.createStore);
router.patch('/update-store/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner), (0, validateRequest_1.default)(store_validation_1.default.updateStoreValidationSchema), store_controller_1.default.updateStore);
router.get('/get-bussiness-store/:id', store_controller_1.default.getBussinessStore);
exports.storeRoutes = router;
