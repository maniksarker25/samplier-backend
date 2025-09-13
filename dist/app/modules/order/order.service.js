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
/* eslint-disable @typescript-eslint/no-explicit-any */
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const shippo_1 = require("shippo");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../error/appError"));
const enum_1 = require("../../utilities/enum");
const paypal_1 = __importDefault(require("../../utilities/paypal"));
const shippo_2 = __importDefault(require("../../utilities/shippo"));
const stripe_1 = __importDefault(require("../../utilities/stripe"));
const cart_model_1 = __importDefault(require("../cart/cart.model"));
const shippingAddress_model_1 = __importDefault(require("../shippingAddress/shippingAddress.model"));
const shippo_helper_1 = require("../shippo/shippo.helper");
const store_model_1 = require("../store/store.model");
const order_model_1 = require("./order.model");
const createOrder = (reviewerId, payload, selectedRateId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cart = yield cart_model_1.default.findOne({ reviewer: reviewerId });
    if (!cart || cart.items.length === 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Cart is empty');
    }
    let deliveryCharge = 0;
    let shippingInfo = null;
    if (selectedRateId) {
        // User selected a shipping rate
        const shippingAddress = yield shippingAddress_model_1.default.findOne({
            _id: payload.shippingAddress,
            reviewer: reviewerId,
        });
        const store = yield store_model_1.Store.findOne({ bussiness: cart.bussiness });
        if (!store) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Store details');
        }
        if (!shippingAddress)
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Shipping address not found');
        const parcels = (0, shippo_helper_1.generateParcels)(cart.items);
        const shippoParcels = parcels.map((p) => ({
            length: p.length.toString(),
            width: p.width.toString(),
            height: p.height.toString(),
            distanceUnit: shippo_1.DistanceUnitEnum.In, // ✅ use enum
            weight: p.weight.toString(),
            massUnit: shippo_1.WeightUnitEnum.Lb, // ✅ use enum
        }));
        const shipment = yield shippo_2.default.shipments.create({
            addressFrom: {
                name: store.name,
                street1: store.street1,
                city: store.city,
                state: store.state,
                zip: store.zip,
                country: store.country,
                phone: store.phone,
            },
            addressTo: {
                name: shippingAddress.name,
                street1: shippingAddress.street1,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zip: shippingAddress.zip,
                country: shippingAddress.country,
                phone: shippingAddress.phone,
            },
            parcels: shippoParcels,
            async: false,
        });
        const selectedRate = shipment.rates.find((r) => r.objectId === selectedRateId);
        if (!selectedRate)
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid shipping rate');
        deliveryCharge = parseFloat(selectedRate.amount);
        shippingInfo = {
            rateId: selectedRate.objectId,
            provider: selectedRate.provider,
            service: selectedRate.servicelevel.name,
            amount: deliveryCharge,
            currency: selectedRate.currency,
            shipmentId: shipment.objectId,
            status: 'PENDING', // not purchased yet
        };
    }
    // Total price including shipping
    const totalPrice = cart.totalPrice + deliveryCharge;
    // Create order
    const order = yield order_model_1.Order.create(Object.assign(Object.assign({}, payload), { reviewer: reviewerId, items: cart.items, totalPrice,
        deliveryCharge, shipping: shippingInfo }));
    // Payment handling
    if (payload.paymentMethod === enum_1.ENUM_PAYMENT_METHOD.STRIPE) {
        const amountInCents = totalPrice * 100;
        const session = yield stripe_1.default.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: 'Order Payment' },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                orderId: order._id.toString(),
                paymentPurpose: enum_1.ENUM_PAYMENT_PURPOSE.ORDER,
            },
            success_url: config_1.default.stripe.stripe_order_payment_success_url,
            cancel_url: config_1.default.stripe.stripe_order_payment_cancel_url,
        });
        yield cart_model_1.default.findOneAndDelete({ reviewer: reviewerId });
        return { url: session.url };
    }
    if (payload.paymentMethod === enum_1.ENUM_PAYMENT_METHOD.PAYPAL) {
        try {
            const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
            request.prefer('return=representation');
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: totalPrice.toFixed(2),
                        },
                        description: `Payment for Order: ${order._id}`,
                        custom_id: order._id.toString(),
                        reference_id: enum_1.ENUM_PAYMENT_PURPOSE.ORDER,
                    },
                ],
                application_context: {
                    brand_name: 'Your Business Name',
                    landing_page: 'LOGIN',
                    user_action: 'PAY_NOW',
                    return_url: `${config_1.default.paypal.payment_capture_url}`,
                    cancel_url: `${config_1.default.stripe.stripe_order_payment_cancel_url}`,
                },
            });
            const response = yield paypal_1.default.execute(request);
            const approvalUrl = (_a = response.result.links.find((link) => link.rel === 'approve')) === null || _a === void 0 ? void 0 : _a.href;
            if (!approvalUrl) {
                throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'PayPal payment creation failed');
            }
            yield cart_model_1.default.findOneAndDelete({ reviewer: reviewerId });
            return { url: approvalUrl };
        }
        catch (error) {
            console.error('PayPal Payment Error:', error);
            throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create PayPal order');
        }
    }
    yield cart_model_1.default.findOneAndDelete({ reviewer: reviewerId });
    return order;
});
// const createOrder = async (reviewerId: string, payload: Partial<IOrder>) => {
//   const cart = await Cart.findOne({ reviewer: reviewerId });
//   if (!cart || cart.items.length === 0) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "You don't have any items for order",
//     );
//   }
//   const result: any = await Order.create({
//     ...payload,
//     ...cart,
//   });
//   const amountInCents = result.totalPrice * 100;
//   // for payment
//   if (payload.paymentMethod === ENUM_PAYMENT_METHOD.STRIPE) {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: { name: 'Campaign Run' },
//             unit_amount: amountInCents,
//           },
//           quantity: 1,
//         },
//       ],
//       metadata: {
//         orderId: result._id.toString(),
//         paymentPurpose: ENUM_PAYMENT_PURPOSE.ORDER,
//       },
//       success_url: config.stripe.stripe_order_payment_success_url,
//       cancel_url: config.stripe.stripe_order_payment_cancel_url,
//     });
//     return { url: session.url };
//   }
//   if (payload.paymentMethod === ENUM_PAYMENT_METHOD.PAYPAL) {
//     try {
//       const request = new paypal.orders.OrdersCreateRequest();
//       request.prefer('return=representation');
//       request.requestBody({
//         intent: 'CAPTURE',
//         purchase_units: [
//           {
//             amount: {
//               currency_code: 'USD',
//               value: result.totalPrice.toFixed(2),
//             },
//             description: `Payment for Campaign: ${result._id}`,
//             custom_id: result?._id.toString(),
//             reference_id: ENUM_PAYMENT_PURPOSE.ORDER,
//           },
//         ],
//         application_context: {
//           brand_name: 'Your Business Name',
//           landing_page: 'LOGIN',
//           user_action: 'PAY_NOW',
//           return_url: `${config.paypal.payment_capture_url}`,
//           cancel_url: `${config.stripe.stripe_order_payment_cancel_url}`,
//         },
//       });
//       const response = await paypalClient.execute(request);
//       const approvalUrl = response.result.links.find(
//         (link: any) => link.rel === 'approve',
//       )?.href;
//       if (!approvalUrl) {
//         throw new AppError(
//           httpStatus.INTERNAL_SERVER_ERROR,
//           'PayPal payment creation failed: No approval URL found',
//         );
//       }
//       return { url: approvalUrl };
//     } catch (error) {
//       console.error('PayPal Payment Error:', error);
//       throw new AppError(
//         httpStatus.INTERNAL_SERVER_ERROR,
//         'Failed to create PayPal order',
//       );
//     }
//   }
//   await Cart.findOneAndDelete({ reviewer: reviewerId });
//   return result;
// };
const getMyOrders = (profileId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.Order.find({ $or: [{ reviewer: profileId }, { bussiness: profileId }] }), query)
        .search([''])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        meta,
        result,
    };
});
const getSingleOrder = (profileId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const order = yield order_model_1.Order.findOne({
        $or: [{ reviewer: profileId }, { bussiness: profileId }],
        _id: orderId,
    });
    if (!order) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    const response = yield axios_1.default.post('https://api.goshippo.com/tracks/', new URLSearchParams({
        carrier: (_a = order.shipping) === null || _a === void 0 ? void 0 : _a.provider,
        tracking_number: (_b = order.shipping) === null || _b === void 0 ? void 0 : _b.trackingNumber,
        metadata: `Order : ${order._id}`,
    }), {
        headers: {
            Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    const trackingData = response.data;
    return {
        order,
        trackingData,
    };
});
const OrderService = {
    createOrder,
    getMyOrders,
    getSingleOrder,
};
exports.default = OrderService;
