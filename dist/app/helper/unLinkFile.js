"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const unlinkFile = (filePath) => {
    const fullPath = path_1.default.join(process.cwd(), filePath);
    // Check if the file exists----
    if (fs_1.default.existsSync(fullPath)) {
        // Unlink the file if it exists---------
        fs_1.default.unlink(fullPath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${filePath}`, err);
            }
            else {
                console.log(`File deleted: ${filePath}`);
            }
        });
    }
    else {
        console.log(`File does not exist`);
    }
};
exports.default = unlinkFile;
