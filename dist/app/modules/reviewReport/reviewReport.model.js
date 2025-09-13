"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewReport_constant_1 = require("./reviewReport.constant");
const reviewReportSchema = new mongoose_1.Schema({
    review: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Review',
        required: true,
    },
    reportReason: {
        type: String,
        enum: Object.values(reviewReport_constant_1.REPORT_REASONS),
        required: true,
    },
    reporter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, { timestamps: true });
reviewReportSchema.index({ review: 1, reviewer: 1 });
const ReviewReport = (0, mongoose_1.model)('ReviewReport', reviewReportSchema);
exports.default = ReviewReport;
