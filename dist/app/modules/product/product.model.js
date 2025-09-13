"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const enum_1 = require("../../utilities/enum");
const ProductSchema = new mongoose_1.Schema({
    bussiness: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Bussiness',
        required: true,
    },
    name: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, required: false },
    status: {
        type: String,
        enum: Object.values(enum_1.ENUM_PRODUCT_STATUS),
        default: enum_1.ENUM_PRODUCT_STATUS.ACTIVE,
    },
    price: {
        type: Number,
        required: true,
    },
    images: { type: [String], required: false, default: [] },
    tags: { type: [String], required: false },
    colors: {
        type: [String],
    },
    sizes: {
        type: [String],
    },
    stock: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Product = mongoose_1.default.model('Product', ProductSchema);
exports.default = Product;
