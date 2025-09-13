"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookmarkSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
        ref: 'Product',
    },
    reviewer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Reviewer',
    },
}, {
    timestamps: true,
});
const Bookmark = (0, mongoose_1.model)('Bookmark', bookmarkSchema);
exports.default = Bookmark;
