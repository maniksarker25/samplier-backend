"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const manage_routes_1 = require("../modules/manage-web/manage.routes");
const normalUser_routes_1 = require("../modules/normalUser/normalUser.routes");
const user_routes_1 = require("../modules/user/user.routes");
const bookmark_routes_1 = require("../modules/bookmark/bookmark.routes");
const bussiness_routes_1 = require("../modules/bussiness/bussiness.routes");
const campaign_routes_1 = require("../modules/campaign/campaign.routes");
const campaignOffer_routes_1 = require("../modules/campaignOffer/campaignOffer.routes");
const cart_routes_1 = require("../modules/cart/cart.routes");
const category_routes_1 = require("../modules/category/category.routes");
const comment_routes_1 = require("../modules/comment/comment.routes");
const complianceInfo_routes_1 = require("../modules/complianceInfo/complianceInfo.routes");
const follow_routes_1 = require("../modules/follow/follow.routes");
const meta_routes_1 = require("../modules/meta/meta.routes");
const notification_routes_1 = require("../modules/notification/notification.routes");
const notificationSetting_routes_1 = require("../modules/notificationSetting/notificationSetting.routes");
const order_routes_1 = require("../modules/order/order.routes");
const paypal_routes_1 = require("../modules/paypal/paypal.routes");
const product_routes_1 = require("../modules/product/product.routes");
const referralSales_routes_1 = require("../modules/referralSales/referralSales.routes");
const return_routes_1 = require("../modules/return/return.routes");
const review_routes_1 = require("../modules/review/review.routes");
const reviewer_routes_1 = require("../modules/reviewer/reviewer.routes");
const reviewReport_routes_1 = require("../modules/reviewReport/reviewReport.routes");
const shippingAddress_routes_1 = require("../modules/shippingAddress/shippingAddress.routes");
const shippo_routes_1 = require("../modules/shippo/shippo.routes");
const store_routes_1 = require("../modules/store/store.routes");
const stripe_routes_1 = require("../modules/stripe/stripe.routes");
const transaction_routes_1 = require("../modules/transaction/transaction.routes");
const variant_routes_1 = require("../modules/variant/variant.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        router: auth_routes_1.authRoutes,
    },
    {
        path: '/user',
        router: user_routes_1.userRoutes,
    },
    {
        path: '/normal-user',
        router: normalUser_routes_1.normalUserRoutes,
    },
    {
        path: '/manage',
        router: manage_routes_1.ManageRoutes,
    },
    {
        path: '/notification',
        router: notification_routes_1.notificationRoutes,
    },
    {
        path: '/compliance-info',
        router: complianceInfo_routes_1.complianceInfoRoutes,
    },
    {
        path: '/bussiness',
        router: bussiness_routes_1.bussinessRoutes,
    },
    {
        path: '/product',
        router: product_routes_1.productRoutes,
    },
    {
        path: '/variant',
        router: variant_routes_1.variantRoutes,
    },
    {
        path: '/store',
        router: store_routes_1.storeRoutes,
    },
    {
        path: '/category',
        router: category_routes_1.categoryRoutes,
    },
    {
        path: '/campaign',
        router: campaign_routes_1.campaignRoutes,
    },
    {
        path: '/transaction',
        router: transaction_routes_1.transactionRoutes,
    },
    {
        path: '/stripe',
        router: stripe_routes_1.stripeRoutes,
    },
    {
        path: '/paypal',
        router: paypal_routes_1.paypalRoutes,
    },
    {
        path: '/reviewer',
        router: reviewer_routes_1.reviewerRoutes,
    },
    {
        path: '/shipping-address',
        router: shippingAddress_routes_1.shippingAddressRoutes,
    },
    {
        path: '/notification-setting',
        router: notificationSetting_routes_1.notificationSettingRoutes,
    },
    {
        path: '/cart',
        router: cart_routes_1.cartRoutes,
    },
    {
        path: '/campaign-offer',
        router: campaignOffer_routes_1.campaignOfferRoutes,
    },
    {
        path: '/campaign-offer',
        router: order_routes_1.orderRoutes,
    },
    {
        path: '/bookmark',
        router: bookmark_routes_1.bookmarkRoutes,
    },
    {
        path: '/review',
        router: review_routes_1.reviewRoutes,
    },
    {
        path: '/comment',
        router: comment_routes_1.commentRoutes,
    },
    {
        path: '/review-report',
        router: reviewReport_routes_1.reviewReportRoutes,
    },
    {
        path: '/referral-sales',
        router: referralSales_routes_1.referralSalesRoutes,
    },
    {
        path: '/meta',
        router: meta_routes_1.metaRoutes,
    },
    {
        path: '/shippo',
        router: shippo_routes_1.shippoRoutes,
    },
    {
        path: '/return',
        router: return_routes_1.returnRoutes,
    },
    {
        path: '/follow',
        router: follow_routes_1.followRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.router));
exports.default = router;
