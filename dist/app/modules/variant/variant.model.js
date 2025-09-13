"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const variantSchema = new mongoose_1.Schema({
    bussiness: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    variantOption: { type: String, required: true },
    variantValue: { type: String, required: true },
    color: { type: String, required: false, default: '' },
    weight: { type: String, default: null },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
});
const Variant = (0, mongoose_1.model)('Variant', variantSchema);
exports.default = Variant;
