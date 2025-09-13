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
const enum_1 = require("../../utilities/enum");
const bussiness_model_1 = __importDefault(require("../bussiness/bussiness.model"));
const order_model_1 = require("../order/order.model");
const reviewer_model_1 = __importDefault(require("../review/reviewer.model"));
const moment_1 = __importDefault(require("moment"));
const getReviewerMetaData = (reviewerId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { dateRange } = query;
    let currentDateFilter = {};
    let previousDateFilter = {};
    const today = (0, moment_1.default)().startOf('day');
    switch (dateRange) {
        case 'Today':
            currentDateFilter = {
                createdAt: {
                    $gte: today.toDate(),
                    $lt: (0, moment_1.default)().endOf('day').toDate(),
                },
            };
            previousDateFilter = {
                createdAt: {
                    $gte: (0, moment_1.default)().subtract(1, 'day').startOf('day').toDate(),
                    $lt: (0, moment_1.default)().subtract(1, 'day').endOf('day').toDate(),
                },
            };
            break;
        case 'This week':
            currentDateFilter = {
                createdAt: {
                    $gte: today.startOf('week').toDate(),
                    $lt: today.endOf('week').toDate(),
                },
            };
            previousDateFilter = {
                createdAt: {
                    $gte: today.subtract(1, 'week').startOf('week').toDate(),
                    $lt: today.startOf('week').toDate(),
                },
            };
            break;
        case 'Last week':
            currentDateFilter = {
                createdAt: {
                    $gte: today.subtract(1, 'week').startOf('week').toDate(),
                    $lt: today.startOf('week').toDate(),
                },
            };
            previousDateFilter = {
                createdAt: {
                    $gte: today.subtract(2, 'week').startOf('week').toDate(),
                    $lt: today.subtract(1, 'week').startOf('week').toDate(),
                },
            };
            break;
        case 'This month':
            currentDateFilter = {
                createdAt: {
                    $gte: today.startOf('month').toDate(),
                    $lt: today.endOf('month').toDate(),
                },
            };
            previousDateFilter = {
                createdAt: {
                    $gte: today.subtract(1, 'month').startOf('month').toDate(),
                    $lt: today.startOf('month').toDate(),
                },
            };
            break;
        case 'Last month':
            currentDateFilter = {
                createdAt: {
                    $gte: today.subtract(1, 'month').startOf('month').toDate(),
                    $lt: today.startOf('month').toDate(),
                },
            };
            previousDateFilter = {
                createdAt: {
                    $gte: today.subtract(2, 'month').startOf('month').toDate(),
                    $lt: today.subtract(1, 'month').startOf('month').toDate(),
                },
            };
            break;
        case 'Last 6 Month':
            currentDateFilter = {
                createdAt: { $gte: today.subtract(6, 'months').toDate() },
            };
            previousDateFilter = {
                createdAt: {
                    $gte: today.subtract(12, 'months').toDate(),
                    $lt: today.subtract(6, 'months').toDate(),
                },
            };
            break;
        case 'This Year':
            currentDateFilter = {
                createdAt: { $gte: today.startOf('year').toDate() },
            };
            previousDateFilter = {
                createdAt: {
                    $gte: today.subtract(1, 'year').startOf('year').toDate(),
                    $lt: today.startOf('year').toDate(),
                },
            };
            break;
        default:
            currentDateFilter = {};
            previousDateFilter = {};
    }
    const currentTotalReview = yield reviewer_model_1.default.countDocuments(Object.assign({ reviewer: reviewerId }, currentDateFilter));
    const previousTotalReview = yield reviewer_model_1.default.countDocuments(Object.assign({ reviewer: reviewerId }, previousDateFilter));
    const currentTotalOrderShipment = yield order_model_1.Order.countDocuments(Object.assign({ reviewer: reviewerId, $or: [
            { deliveryStatus: enum_1.ENUM_DELIVERY_STATUS.waiting },
            { deliveryStatus: enum_1.ENUM_DELIVERY_STATUS.shipped },
        ] }, currentDateFilter));
    const previousTotalOrderShipment = yield order_model_1.Order.countDocuments(Object.assign({ reviewer: reviewerId, $or: [
            { deliveryStatus: enum_1.ENUM_DELIVERY_STATUS.waiting },
            { deliveryStatus: enum_1.ENUM_DELIVERY_STATUS.shipped },
        ] }, previousDateFilter));
    const currentTotalEarning = 2398;
    const previousTotalEarning = 3996;
    const getPercentageChange = (current, previous) => {
        if (previous === 0)
            return current > 0 ? 100 : 0; // Avoid division by zero
        return ((current - previous) / previous) * 100;
    };
    return {
        totalEarning: {
            value: currentTotalEarning,
            change: getPercentageChange(currentTotalEarning, previousTotalEarning),
        },
        totalReview: {
            value: currentTotalReview,
            change: getPercentageChange(currentTotalReview, previousTotalReview),
        },
        itemInShipment: {
            value: currentTotalOrderShipment.toFixed,
            change: getPercentageChange(currentTotalOrderShipment, previousTotalOrderShipment),
        },
    };
});
const getBussinessMetaData = (bussinessId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const totalEarning = 100;
    const bussiness = yield bussiness_model_1.default.findById(bussinessId);
    return {
        totalEarning,
        bussiness,
    };
});
const MetaService = {
    getReviewerMetaData,
    getBussinessMetaData,
};
exports.default = MetaService;
