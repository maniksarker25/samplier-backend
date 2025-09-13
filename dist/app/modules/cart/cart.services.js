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
exports.decreaseCartItemQuantity = exports.removeCartItem = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const product_model_1 = __importDefault(require("../product/product.model"));
const variant_model_1 = __importDefault(require("../variant/variant.model"));
const cart_model_1 = __importDefault(require("./cart.model"));
const addToCart = (_a) => __awaiter(void 0, [_a], void 0, function* ({ reviewerId, bussinessId, productId, variantId, referral, }) {
    var _b;
    console.log('buss', bussinessId);
    let cart = yield cart_model_1.default.findOne({ reviewer: reviewerId });
    if (cart) {
        if (((_b = cart === null || cart === void 0 ? void 0 : cart.bussiness) === null || _b === void 0 ? void 0 : _b.toString()) !== bussinessId) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'You already add item in cart for a different shop , you need to order those or clear cart then you can add to cart for this item');
        }
    }
    if (!cart) {
        cart = new cart_model_1.default({
            reviewer: reviewerId,
            bussiness: bussinessId,
            variant: variantId,
            items: [],
        });
    }
    const existingItem = cart.items.find((item) => item.product.toString() == productId && item.variant == variantId);
    if (existingItem) {
        existingItem.quantity += 1;
    }
    else {
        let price;
        if (variantId) {
            const variant = yield variant_model_1.default.findById(variantId).select('price');
            price = variant === null || variant === void 0 ? void 0 : variant.price;
        }
        else {
            const product = yield product_model_1.default.findById(productId).select('price');
            price = product === null || product === void 0 ? void 0 : product.price;
        }
        // Add new item to the cart
        cart.items.push({
            product: productId,
            variant: variantId,
            quantity: 1,
            price: price,
            referral: referral ? referral : null,
        });
    }
    yield cart.save();
    return cart;
});
// remove cart item
const removeCartItem = (reviewerId, productId, variantId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.default.findOne({ reviewer: reviewerId });
    if (!cart) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Cart not found');
    }
    // cart.items = cart.items.filter(
    //   (item) => item.product.toString() != productId && item.variant != variantId,
    // );
    cart.items = cart.items.filter((item) => !(item.product.toString() == productId && item.variant == variantId));
    yield cart.save();
    return cart;
});
exports.removeCartItem = removeCartItem;
// view cart
const viewCart = (reviewerId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.default.findOne({ reviewer: reviewerId })
        .populate('items.product', 'name images')
        .populate('items.variant');
    if (!cart) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Cart not found');
    }
    return cart;
});
// increase quantity
const increaseCartItemQuantity = (reviewerId, productId, variantId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('profil', productId, variantId);
    const cart = yield cart_model_1.default.findOne({ reviewer: reviewerId });
    if (!cart) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Cart not found');
    }
    const item = cart.items.find((item) => item.product.toString() == productId && item.variant == variantId);
    if (!item) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Item not found');
    }
    item.quantity += 1;
    yield cart.save();
    return cart;
});
// decrease quantity---------------
const decreaseCartItemQuantity = (reviewerId, productId, variantId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.default.findOne({ reviewer: reviewerId });
    if (!cart) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Cart not found');
    }
    const item = cart.items.find((item) => item.product.toString() == productId && item.variant == variantId);
    if (!item) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Item not found');
    }
    if (item.quantity > 1) {
        item.quantity -= 1;
    }
    else {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Quantity cannot be less than 1');
    }
    yield cart.save();
    return cart;
});
exports.decreaseCartItemQuantity = decreaseCartItemQuantity;
const clearCartFromDB = (reviewerId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.default.findOne({ reviewer: reviewerId });
    if (!cart) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "You don't have any cart");
    }
    const result = yield cart_model_1.default.findOneAndDelete({ reviewer: reviewerId });
    return result;
});
const cartServices = {
    addToCart,
    removeCartItem: exports.removeCartItem,
    viewCart,
    increaseCartItemQuantity,
    decreaseCartItemQuantity: exports.decreaseCartItemQuantity,
    clearCartFromDB,
};
exports.default = cartServices;
