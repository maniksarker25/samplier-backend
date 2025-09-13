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
const bussiness_constant_1 = require("./bussiness.constant");
const BussinessSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    bio: {
        type: String,
        default: '',
    },
    bussinessName: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    },
    tradeName: {
        type: String,
    },
    bussinessType: {
        type: String,
        enum: Object.values(bussiness_constant_1.bussinessType),
    },
    industryType: {
        type: String,
        enum: Object.values(bussiness_constant_1.industryType),
    },
    bussinessAddress: {
        type: String,
    },
    phoneNumber: {
        type: String,
        default: '',
    },
    website: {
        type: String,
        match: [
            /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/,
            'Please use a valid website URL.',
        ],
    },
    logo: {
        type: String,
        default: '',
    },
    coverImage: {
        type: String,
        default: '',
    },
    facebook: {
        type: String,
    },
    twiter: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    instagram: {
        type: String,
    },
    taxtIndentificationNumber: {
        type: Number,
    },
    einNumber: {
        type: Number,
    },
    incorparationCertificate: {
        type: String,
    },
    bussinessLicense: {
        type: String,
    },
    isBussinessDocumentProvided: {
        type: Boolean,
        default: false,
    },
    isBussinessInfoProvided: {
        type: Boolean,
        default: false,
    },
    isComplianceInfoProvided: {
        type: Boolean,
        default: false,
    },
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Reviewer' }],
}, {
    timestamps: true,
});
const Bussiness = mongoose_1.default.model('Bussiness', BussinessSchema);
exports.default = Bussiness;
