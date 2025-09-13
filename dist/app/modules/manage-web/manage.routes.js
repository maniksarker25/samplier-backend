"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const manage_controller_1 = require("./manage.controller");
const user_constant_1 = require("../user/user.constant");
const fileUploader_1 = require("../../helper/fileUploader");
const router = express_1.default.Router();
router.post('/add-about-us', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.addAboutUs);
router.post('/add-faq', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.addFAQ);
router.post('/add-terms-conditions', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.addTermsConditions);
router.post('/add-partner', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.addPartner);
router.post('/add-contact-us', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.addContactUs);
router.post('/add-privacy-policy', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.addPrivacyPolicy);
router.post('/add-slider', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), (0, fileUploader_1.uploadFile)(), manage_controller_1.ManageController.addSlider);
router.get('/get-privacy-policy', 
// auth(USER_ROLE.superAdmin),
manage_controller_1.ManageController.getPrivacyPolicy);
router.get('/get-partner', 
// auth(USER_ROLE.superAdmin),
manage_controller_1.ManageController.getPartner);
router.get('/get-slider', 
// auth(USER_ROLE.superAdmin),
manage_controller_1.ManageController.getSlider);
router.get('/get-faq', manage_controller_1.ManageController.getFAQ);
router.get('/get-about-us', 
// auth(USER_ROLE.superAdmin),
manage_controller_1.ManageController.getAboutUs);
router.get('/get-terms-conditions', 
// auth(USER_ROLE.superAdmin),
manage_controller_1.ManageController.getTermsConditions);
router.get('/get-contact-us', 
// auth(USER_ROLE.superAdmin),
manage_controller_1.ManageController.getContactUs);
router.patch('/edit-privacy-policy/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.editPrivacyPolicy);
router.patch('/edit-partner/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.editPartner);
router.patch('/edit-slider/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), (0, fileUploader_1.uploadFile)(), manage_controller_1.ManageController.editSlider);
router.patch('/edit-faq/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.editFAQ);
router.patch('/edit-about-us/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.editAboutUs);
router.patch('/edit-terms-conditions/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.editTermsConditions);
router.patch('/edit-contact-us/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.editContactUs);
router.delete('/delete-about-us/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.deleteAboutUs);
router.delete('/delete-slider/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.deleteSlider);
router.delete('/delete-faq/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.deleteFAQ);
router.delete('/delete-contact-us/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.deleteContactUs);
router.delete('/delete-privacy-policy/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.deletePrivacyPolicy);
router.delete('/delete-partner/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.deletePartner);
router.delete('/delete-terms-conditions/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), manage_controller_1.ManageController.deleteTermsConditions);
exports.ManageRoutes = router;
