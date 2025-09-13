"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENUM_REF_TYPE = exports.ENUM_RECEIVER_TYPE = exports.ENUM_SENDER_TYPE = exports.ENUM_DELIVERY_STATUS = exports.ENUM_SKIP_VALUE = exports.INTEREST_STATUS = exports.GENDER = exports.TRANSACTION_STATUS = exports.CAMPAIGN_STATUS = exports.ENUM_PAYMENT_PURPOSE = exports.ENUM_TRANSACTION_STATUS = exports.ENUM_INVITE_STATUS = exports.ENUM_PAYMENT_METHOD = exports.ENUM_PAYMENT_BY = exports.ENUM_TRANSACTION_TYPE = exports.ENUM_REDEEM_STATUS = exports.ENUM_DELIVERY_OPTION = exports.ENUM_USER_STATUS = exports.ENUM_TIP_BY = exports.ENUM_PAYMENT_STATUS = exports.ENUM_PRODUCT_STATUS = void 0;
exports.ENUM_PRODUCT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DRAFT: 'draft',
    ARCHIVED: 'archived',
};
exports.ENUM_PAYMENT_STATUS = {
    PENDING: 'Pending',
    SUCCESS: 'Success',
};
exports.ENUM_TIP_BY = {
    PROFILE_BALANCE: 'Profile balance',
    CREDIT_CARD: 'Credit card',
    PAYPAL: 'Paypal',
};
exports.ENUM_USER_STATUS = {
    IN_PROGRESS: 'in-progress',
    BLOCKED: 'blocked',
};
exports.ENUM_DELIVERY_OPTION = {
    EMAIL: 'Email',
    SHIPPING_ADDRESS: 'Shipping Address',
};
exports.ENUM_REDEEM_STATUS = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
};
exports.ENUM_TRANSACTION_TYPE = {
    DEPOSIT: 'Deposit',
    WITHDRAW: 'Withdraw',
};
exports.ENUM_PAYMENT_BY = {
    CREDIT_CARD: 'Credit Card',
    PAYPAL: 'Paypal',
    ACH: 'ACH',
    CHECK: 'Check',
};
exports.ENUM_PAYMENT_METHOD = {
    STRIPE: 'Stripe',
    PAYPAL: 'Paypal',
};
exports.ENUM_INVITE_STATUS = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
};
exports.ENUM_TRANSACTION_STATUS = {
    PENDING: 'Pending',
    SUCCESS: 'Success',
};
exports.ENUM_PAYMENT_PURPOSE = {
    CAMPAIGN_RUN: 'Campaign Run',
    ORDER: 'Order',
};
exports.CAMPAIGN_STATUS = {
    ACTIVE: 'Active',
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    PAUSED: 'Paused',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
};
exports.TRANSACTION_STATUS = {
    SUCCESSFULL: 'Successful',
    FAILED: 'Failed',
};
exports.GENDER = {
    MALE: 'Male',
    FEMALE: 'Female',
    Other: 'Other',
};
exports.INTEREST_STATUS = {
    COMPLETED: 'Completed',
    SKIPPED: 'Skipped',
    IN_PROGRESS: 'In-Progress',
};
exports.ENUM_SKIP_VALUE = {
    interestedCategoryStatus: 'interestedCategoryStatus',
    shippingInformationStatus: 'shippingInformationStatus',
    currentShareReviewStatus: 'currentShareReviewStatus',
    profileDetailStatus: 'profileDetailStatus',
    socailInfoStatus: 'socailInfoStatus',
};
exports.ENUM_DELIVERY_STATUS = {
    shipped: 'Shipped',
    waiting: 'Waiting to be shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};
exports.ENUM_SENDER_TYPE = {
    REVIEWER: 'Reviewer',
    BUSSINESS_OWNER: 'BussinessOwner',
    PLATFORM: 'Platform',
};
exports.ENUM_RECEIVER_TYPE = {
    REVIEWER: 'Reviewer',
    BUSSINESS_OWNER: 'BussinessOwner',
};
exports.ENUM_REF_TYPE = {
    BUSSINESS: 'Bussiness',
    REVIEWER: 'Reviewer',
    ORDER: 'Order',
    RETURN: 'Return',
};
