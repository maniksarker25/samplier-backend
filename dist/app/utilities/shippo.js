"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shippo_1 = require("shippo");
const config_1 = __importDefault(require("../config"));
const shippo = new shippo_1.Shippo({ apiKeyHeader: config_1.default.shippo.api_key });
exports.default = shippo;
