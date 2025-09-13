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
const user_constant_1 = require("../user/user.constant");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const notification_model_1 = __importDefault(require("./notification.model"));
// import getAdminNotificationCount from '../../helper/getAdminNotification';
// import getUnseenNotificationCount from '../../helper/getUnseenNotification';
const getAllNotificationFromDB = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    if ((user === null || user === void 0 ? void 0 : user.role) === user_constant_1.USER_ROLE.superAdmin) {
        const notificationQuery = new QueryBuilder_1.default(notification_model_1.default.find({ receiver: user_constant_1.USER_ROLE.superAdmin }), query)
            .search(['name'])
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = yield notificationQuery.modelQuery;
        const meta = yield notificationQuery.countTotal();
        return { meta, result };
    }
    else {
        const notificationQuery = new QueryBuilder_1.default(notification_model_1.default.find({ receiver: user === null || user === void 0 ? void 0 : user.profileId }), query)
            .search(['name'])
            .filter()
            .sort()
            .paginate()
            .fields();
        const result = yield notificationQuery.modelQuery;
        const meta = yield notificationQuery.countTotal();
        return { meta, result };
    }
});
const seeNotification = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if ((user === null || user === void 0 ? void 0 : user.role) === user_constant_1.USER_ROLE.superAdmin) {
        result = yield notification_model_1.default.updateMany({ receiver: user_constant_1.USER_ROLE.superAdmin }, { seen: true }, { runValidators: true, new: true });
        // const adminUnseenNotificationCount = await getAdminNotificationCount();
        //@ts-ignore
        // global.io.emit('admin-notifications', adminUnseenNotificationCount);
    }
    if ((user === null || user === void 0 ? void 0 : user.role) !== user_constant_1.USER_ROLE.superAdmin) {
        result = yield notification_model_1.default.updateMany({ receiver: user === null || user === void 0 ? void 0 : user.profileId }, { seen: true }, { runValidators: true, new: true });
    }
    //   const updatedNotificationCount = await getUnseenNotificationCount(
    //     user?.userId,
    //   );
    //@ts-ignore
    //   global.io.to(user?.userId).emit('notifications', updatedNotificationCount);
    return result;
});
const notificationService = {
    getAllNotificationFromDB,
    seeNotification,
};
exports.default = notificationService;
