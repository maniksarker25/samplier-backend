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
const axios_1 = __importDefault(require("axios"));
const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID';
const ONESIGNAL_API_KEY = 'YOUR_ONESIGNAL_API_KEY';
const sendNotification = (_a) => __awaiter(void 0, [_a], void 0, function* ({ playerIds, message, heading = 'Notification', // Default heading
url, data, }) {
    if (playerIds.length === 0) {
        console.error('No Player IDs provided.');
        return;
    }
    try {
        const payload = {
            app_id: ONESIGNAL_APP_ID,
            include_player_ids: playerIds, // Send notification to these Player IDs
            contents: { en: message },
            headings: { en: heading },
            url, // Optional URL to open on notification click
            data, // Optional data (e.g., order info)
        };
        const response = yield axios_1.default.post('https://onesignal.com/api/v1/notifications', payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${ONESIGNAL_API_KEY}`,
            },
        });
        console.log('Notification sent successfully:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error sending notification:', error);
    }
});
exports.default = sendNotification;
