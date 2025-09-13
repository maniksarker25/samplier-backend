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
const config_1 = __importDefault(require("../config"));
const getPayPalAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`${config_1.default.paypal.base_url}/v1/oauth2/token`, 'grant_type=client_credentials', {
        auth: {
            username: config_1.default.paypal.client_id,
            password: config_1.default.paypal.client_secret,
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data.access_token;
});
exports.default = getPayPalAccessToken;
