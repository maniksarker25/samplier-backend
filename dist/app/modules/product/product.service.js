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
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const deleteFromS2_1 = require("../../aws/deleteFromS2");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../error/appError"));
const enum_1 = require("../../utilities/enum");
const bookmark_mode_1 = __importDefault(require("../bookmark/bookmark.mode"));
const category_model_1 = __importDefault(require("../category/category.model"));
const product_model_1 = __importDefault(require("./product.model"));
// create product into db
// const createProductIntoDB = async (
//   profileId: string,
//   payload: IProduct,
//   files: any,
// ) => {
//   const category = await Category.findById(payload.category);
//   if (!category) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
//   }
//   let productImages: string[] = [];
//   if (Array.isArray(files)) {
//     productImages = files
//       .filter((file: any) => file.fieldname === 'product_image')
//       .map((file: any) => file.path);
//   }
//   // variant images
//   const variantImagesMap: { [key: string]: string[] } = {};
//   if (Array.isArray(files)) {
//     files.forEach((file: any) => {
//       if (file.fieldname.startsWith('variant_image_')) {
//         const sku = file.fieldname.replace('variant_image_', '');
//         if (!variantImagesMap[sku]) {
//           variantImagesMap[sku] = [];
//         }
//         variantImagesMap[sku].push(file.path);
//       }
//     });
//   }
//   const result = await Product.create({
//     ...payload,
//     bussiness: profileId,
//     images: productImages,
//   });
//   const updatedVariants = payload.variants.map((variant) => ({
//     ...variant,
//     images: variantImagesMap[variant.sku] || [],
//     product: result._id,
//     bussiness: profileId,
//   }));
//   await Variant.insertMany(updatedVariants);
//   return result;
// };
// save as drafh -----------------
// const saveProductAsDraftIntoDB = async (
//   profileId: string,
//   payload: IProduct,
//   files: any,
// ) => {
//   const category = await Category.findById(payload.category);
//   if (!category) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
//   }
//   let productImages: string[] = [];
//   if (Array.isArray(files)) {
//     productImages = files
//       .filter((file: any) => file.fieldname === 'product_image')
//       .map((file: any) => file.path);
//   }
//   // variant images
//   const variantImagesMap: { [key: string]: string[] } = {};
//   if (Array.isArray(files)) {
//     files.forEach((file: any) => {
//       if (file.fieldname.startsWith('variant_image_')) {
//         const sku = file.fieldname.replace('variant_image_', '');
//         if (!variantImagesMap[sku]) {
//           variantImagesMap[sku] = [];
//         }
//         variantImagesMap[sku].push(file.path);
//       }
//     });
//   }
//   const result = await Product.create({
//     ...payload,
//     bussiness: profileId,
//     images: productImages,
//     status: ENUM_PRODUCT_STATUS.DRAFT,
//   });
//   const updatedVariants = payload.variants.map((variant) => ({
//     ...variant,
//     images: variantImagesMap[variant.sku] || [],
//     product: result._id,
//     bussiness: profileId,
//   }));
//   await Variant.insertMany(updatedVariants);
//   return result;
// };
const createProduct = (bussinessId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findById(payload.category);
    if (!category) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
    }
    const result = yield product_model_1.default.create(Object.assign(Object.assign({}, payload), { bussiness: bussinessId }));
    return result;
});
const publishProductFromDraft = (profileId, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const product = yield product_model_1.default.findOne({
        bussiness: profileId,
        _id: id,
        status: enum_1.ENUM_PRODUCT_STATUS.DRAFT,
    });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    payload.status = enum_1.ENUM_PRODUCT_STATUS.ACTIVE;
    const result = yield product_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    //TODO: if you want to uplaod images in cloud then need to change here
    if (product.images && ((_a = product.images) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        for (const imageUrl of product.images) {
            (0, deleteFromS2_1.deleteFileFromS3)(imageUrl);
        }
    }
    return result;
});
const deleteSingleProduct = (profileId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findOneAndUpdate({ bussiness: profileId, _id: id }, { isDeleted: true }, { new: true, runValidators: true });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    return product;
});
const softDeleteSingleProduct = (profileId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findOneAndUpdate({ bussiness: profileId, _id: id }, { status: enum_1.ENUM_PRODUCT_STATUS.ARCHIVED }, { new: true, runValidators: true });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    return product;
});
// change product status -------------
const changeProductStatus = (profileId, id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findOne({ bussiness: profileId, _id: id });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    const result = yield product_model_1.default.findByIdAndUpdate(id, { status: status }, { new: true, runValidators: true });
    return result;
});
const getAllProduct = (query, reviewerId) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.default.find({ isDeleted: false }), query)
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    const productIds = result.map((product) => product._id);
    const bookmarks = yield bookmark_mode_1.default.find({
        reviewer: reviewerId,
        product: { $in: productIds },
    }).select('product');
    const bookmarkedProductIds = new Set(bookmarks.map((bookmark) => bookmark.product.toString()));
    const productsWithBookmarkStatus = result.map((product) => (Object.assign(Object.assign({}, product.toObject()), { isBookmark: bookmarkedProductIds.has(product._id.toString()) })));
    return {
        meta,
        result: productsWithBookmarkStatus,
    };
});
// const getSingleProductFromDB = async (id: string) => {
//   const result = await Product.findById(id)
//     .populate({
//       path: 'bussiness',
//       select: 'bussinessName coverImage logo phoneNumber',
//     })
//     .populate({ path: 'category' });
//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
//   }
//   return result;
// };
const getSingleProductFromDB = (id, reviewerId) => __awaiter(void 0, void 0, void 0, function* () {
    // validate product id
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid product id');
    }
    const objectId = new mongoose_1.default.Types.ObjectId(id);
    // validate reviewer id (optional)
    let reviewerObjectId = null;
    if (reviewerId && mongoose_1.default.Types.ObjectId.isValid(reviewerId)) {
        reviewerObjectId = new mongoose_1.default.Types.ObjectId(reviewerId);
    }
    const pipeline = [
        { $match: { _id: objectId, isDeleted: false } },
        // Lookup business (selected fields)
        {
            $lookup: {
                from: 'bussinesses', // make sure this matches your actual collection name
                let: { bussinessId: '$bussiness' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$bussinessId'] } } },
                    {
                        $project: {
                            _id: 1,
                            bussinessName: 1,
                            coverImage: 1,
                            logo: 1,
                            phoneNumber: 1,
                        },
                    },
                ],
                as: 'bussiness',
            },
        },
        { $unwind: { path: '$bussiness', preserveNullAndEmptyArrays: true } },
        // Lookup category
        {
            $lookup: {
                from: 'categories',
                let: { categoryId: '$category' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$categoryId'] } } },
                    { $project: { _id: 1, name: 1 } }, // change fields as needed
                ],
                as: 'category',
            },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        // Lookup reviews and calculate avg rating
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews',
            },
        },
        {
            $addFields: {
                avgRating: { $ifNull: [{ $avg: '$reviews.rating' }, 0] },
            },
        },
    ];
    // If reviewer provided and valid -> lookup bookmark
    if (reviewerObjectId) {
        pipeline.push({
            $lookup: {
                from: 'bookmarks', // ensure matches your bookmarks collection
                let: { productId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$product', '$$productId'] },
                                    { $eq: ['$reviewer', reviewerObjectId] }, // compare to constant ObjectId
                                ],
                            },
                        },
                    },
                    { $limit: 1 },
                ],
                as: 'bookmark',
            },
        }, {
            $addFields: {
                isBookmark: { $gt: [{ $size: '$bookmark' }, 0] },
            },
        }, 
        // cleanup
        {
            $project: {
                reviews: 0,
                bookmark: 0,
            },
        });
    }
    else {
        // no reviewer -> always false
        pipeline.push({
            $addFields: {
                isBookmark: false,
            },
        }, {
            $project: {
                reviews: 0,
            },
        });
    }
    const result = yield product_model_1.default.aggregate(pipeline);
    if (!result || result.length === 0) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    return result[0];
});
// update product
const updateProductIntoDB = (bussinessId, productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (payload.category) {
        const category = yield category_model_1.default.exists({ _id: payload.category });
        if (!category) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
        }
    }
    const product = yield product_model_1.default.findOne({
        bussiness: bussinessId,
        _id: productId,
    });
    if (!product) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    if (payload.newImages) {
        payload.images = [...payload.newImages, ...product.images];
    }
    else {
        payload.images = [...product.images];
    }
    if (payload === null || payload === void 0 ? void 0 : payload.deletedImages) {
        payload.images = payload.images.filter((url) => { var _a; return !((_a = payload === null || payload === void 0 ? void 0 : payload.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(url)); });
    }
    const result = yield product_model_1.default.findByIdAndUpdate(productId, payload, {
        new: true,
        runValidators: true,
    });
    if ((_a = payload.deletedImages) === null || _a === void 0 ? void 0 : _a.length) {
        yield Promise.all(payload.deletedImages.map(deleteFromS2_1.deleteFileFromS3));
    }
    return result;
});
const ProductService = {
    createProduct,
    // createProductIntoDB,
    // saveProductAsDraftIntoDB,
    publishProductFromDraft,
    deleteSingleProduct,
    softDeleteSingleProduct,
    changeProductStatus,
    getAllProduct,
    getSingleProductFromDB,
    updateProductIntoDB,
};
exports.default = ProductService;
