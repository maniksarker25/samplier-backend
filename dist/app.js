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
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
const sendContactUsEmail_1 = __importDefault(require("./app/helper/sendContactUsEmail"));
const webhook_1 = __importDefault(require("./app/handleStripe/webhook"));
const handlePaypalWebhook_1 = __importDefault(require("./app/handlePaypal/handlePaypalWebhook"));
const capturePaypalPayment_1 = __importDefault(require("./app/handlePaypal/capturePaypalPayment"));
const onboardingRefresh_1 = __importDefault(require("./app/handleStripe/onboardingRefresh"));
const auth_1 = __importDefault(require("./app/middlewares/auth"));
const user_constant_1 = require("./app/modules/user/user.constant");
const bussiness_model_1 = __importDefault(require("./app/modules/bussiness/bussiness.model"));
// parser
app.post('/simpli-webhook', express_1.default.raw({ type: 'application/json' }), webhook_1.default);
routes_1.default.post('/paypal-webhook', express_1.default.json(), handlePaypalWebhook_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use('/uploads', express_1.default.static('uploads'));
// application routers ----------------
app.use('/', routes_1.default);
app.post('/contact-us', sendContactUsEmail_1.default);
// onboarding refresh --------------
routes_1.default.get('/stripe/onboarding/refresh', onboardingRefresh_1.default);
app.get('/capture-payment', capturePaypalPayment_1.default);
app.get('/nice', (0, auth_1.default)(user_constant_1.USER_ROLE.bussinessOwner, user_constant_1.USER_ROLE.reviewer), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalIncome = 100;
    const bussiness = yield bussiness_model_1.default.findById(req.user.profileId);
    res.send({ message: 'okey', totalIncome, bussiness });
}));
// global error handler
app.use(globalErrorHandler_1.default);
// not found
app.use(notFound_1.default);
exports.default = app;
