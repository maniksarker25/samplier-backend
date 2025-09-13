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
exports.purchaseShippingLabelForOrder = exports.convertToShippoParcels = exports.generateParcels = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const shippo_1 = __importDefault(require("../../utilities/shippo"));
const order_model_1 = require("../order/order.model");
const shippo_constant_1 = require("./shippo.constant");
const generateParcels = (cartItems) => {
    const parcels = [];
    let currentParcel = {
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        items: [],
    };
    cartItems.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
            const newWeight = currentParcel.weight + item.weight;
            const newLength = currentParcel.length + item.length;
            const newHeight = currentParcel.height + item.height;
            const newWidth = Math.max(currentParcel.width, item.width);
            // Check if adding this item exceeds carrier-safe limits
            if (newWeight > shippo_constant_1.MAX_WEIGHT_LB ||
                newLength > shippo_constant_1.MAX_LENGTH_IN ||
                newHeight > shippo_constant_1.MAX_HEIGHT_IN ||
                newWidth > shippo_constant_1.MAX_WIDTH_IN) {
                // Save current parcel and start a new one
                parcels.push(currentParcel);
                currentParcel = {
                    length: item.length,
                    width: item.width,
                    height: item.height,
                    weight: item.weight,
                    items: [item],
                };
            }
            else {
                // Add item to current parcel
                currentParcel.weight = newWeight;
                currentParcel.length = newLength;
                currentParcel.width = newWidth;
                currentParcel.height = newHeight;
                currentParcel.items.push(item);
            }
        }
    });
    parcels.push(currentParcel); // add the last parcel
    return parcels;
};
exports.generateParcels = generateParcels;
const convertToShippoParcels = (parcels) => {
    return parcels.map((p) => ({
        length: p.length.toString(),
        width: p.width.toString(),
        height: p.height.toString(),
        distanceUnit: 'in',
        weight: p.weight.toString(),
        massUnit: 'lb',
    }));
};
exports.convertToShippoParcels = convertToShippoParcels;
const purchaseShippingLabelForOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const order = yield order_model_1.Order.findById(orderId);
    if (!order || !((_a = order.shipping) === null || _a === void 0 ? void 0 : _a.rateId))
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'No shipping rate selected');
    const transaction = yield shippo_1.default.transactions.create({
        rate: order.shipping.rateId,
        labelFileType: 'PDF',
        async: false,
    });
    order.shipping.trackingNumber = transaction.trackingNumber;
    order.shipping.labelUrl = transaction.labelUrl;
    order.shipping.status = transaction.status; // SUCCESS, ERROR, etc.
    yield order.save();
    return order;
});
exports.purchaseShippingLabelForOrder = purchaseShippingLabelForOrder;
