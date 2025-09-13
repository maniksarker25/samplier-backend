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
Object.defineProperty(exports, "__esModule", { value: true });
const notificationSetting_model_1 = require("./notificationSetting.model");
const updateNotificationSetting = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notificationSetting_model_1.NotificationSetting.findOneAndUpdate({ user: userId }, payload, { new: true, runValidators: true });
    return result;
});
const getNotificationSetting = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notificationSetting_model_1.NotificationSetting.findOne({ user: profileId });
    return result;
});
const NotificationSettingService = {
    updateNotificationSetting,
    getNotificationSetting,
};
exports.default = NotificationSettingService;
