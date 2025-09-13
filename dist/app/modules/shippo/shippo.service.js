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
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const shippo_1 = require("shippo");
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../error/appError"));
const cart_model_1 = __importDefault(require("../cart/cart.model"));
const shippingAddress_model_1 = __importDefault(require("../shippingAddress/shippingAddress.model"));
const store_model_1 = require("../store/store.model");
const shippo_helper_1 = require("./shippo.helper");
const shippo = new shippo_1.Shippo({ apiKeyHeader: config_1.default.shippo.api_key });
const getShippingOptions = (businessId, shippingAddressId, parcel) => __awaiter(void 0, void 0, void 0, function* () {
    // const store = await Store.findOne({ bussiness: businessId });
    // if (!store) {
    //   throw new AppError(httpStatus.NOT_FOUND, 'Store not found');
    // }
    // const shippingAddress: IShippingAddress | null =
    //   await ShippingAddress.findById(shippingAddressId);
    // if (!shippingAddress) {
    //   throw new AppError(httpStatus.NOT_FOUND, 'Shipping address not found');
    // }
    // Create shipment with Shippo to get available rates
    const addressFrom = {
        name: 'Shawn Ippotle',
        street1: '215 Clayton St.',
        city: 'San Francisco',
        state: 'CA',
        zip: '94117',
        country: 'US',
    };
    const addressTo = {
        name: 'Mr Hippo',
        street1: 'Broadway 1',
        city: 'New York',
        state: 'NY',
        zip: '10007',
        country: 'US',
    };
    const parcel3 = {
        length: '15',
        width: '15',
        height: '5',
        distanceUnit: shippo_1.DistanceUnitEnum.In,
        weight: '20',
        massUnit: shippo_1.WeightUnitEnum.Lb,
    };
    const shipment = yield shippo.shipments.create({
        addressFrom: addressFrom,
        addressTo: addressTo,
        parcels: [parcel3],
        async: false,
    });
    console.log('shipment', shipment);
    return shipment.rates;
});
const getShippingRatesForCheckout = (reviewerId, shippingAddressId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.default.findOne({ reviewer: reviewerId });
    if (!cart || cart.items.length === 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Cart is empty');
    }
    const shippingAddress = yield shippingAddress_model_1.default.findOne({
        _id: shippingAddressId,
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
    const shipment = yield shippo.shipments.create({
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
    // Return all available rates to frontend
    return shipment.rates;
});
const ShippoService = {
    getShippingOptions,
    getShippingRatesForCheckout,
};
exports.default = ShippoService;
