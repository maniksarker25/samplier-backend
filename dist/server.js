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
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./app/shared/logger");
const config_1 = __importDefault(require("./app/config"));
const DB_1 = __importDefault(require("./app/DB"));
let myServer;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            logger_1.logger.info('DB Connected Successfully');
            const port = typeof config_1.default.port === 'number' ? config_1.default.port : Number(config_1.default.port);
            myServer = app_1.default.listen(port, config_1.default.base_url, () => {
                logger_1.logger.info(`Example app listening on http://${config_1.default.base_url}:${config_1.default.port}`);
                (0, DB_1.default)();
            });
            // myServer = server.listen(port, '0.0.0.0', () => {
            //   logger.info(`Server running on http://0.0.0.0:${port}`);
            //   seedSuperAdmin();
            // });
            // Global unhandled rejection handler
            process.on('unhandledRejection', (error) => {
                logger_1.logger.error('Unhandled Rejection:', error);
                if (myServer) {
                    // myServer.close(() => process.exit(1));
                }
                else {
                    // process.exit(1);
                }
            });
            // Global termination signal handler
            process.on('SIGTERM', () => {
                logger_1.logger.info('SIGTERM signal received');
                if (myServer) {
                    myServer.close(() => logger_1.logger.info('Server closed gracefully'));
                }
            });
        }
        catch (error) {
            logger_1.errorLogger.error('Error in main function:', error);
            throw error;
        }
    });
}
main().catch((err) => logger_1.errorLogger.error('Main function error:', err));
