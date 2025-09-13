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
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder2 {
    constructor(model, query) {
        this.query = query;
        this.pipeline = [];
        this.model = model;
    }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.search;
        if (searchTerm) {
            this.pipeline.push({
                $match: {
                    $or: searchableFields.map((field) => ({
                        [field]: { $regex: searchTerm, $options: 'i' },
                    })),
                },
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = ['search', 'sort', 'limit', 'page', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        if (Object.keys(queryObj).length) {
            this.pipeline.push({ $match: queryObj });
        }
        return this;
    }
    sort() {
        const sortField = this.query.sort;
        if (sortField) {
            const order = sortField.startsWith('-') ? -1 : 1;
            const fieldName = sortField.replace('-', '');
            this.pipeline.push({ $sort: { [fieldName]: order } });
        }
        else {
            this.pipeline.push({ $sort: { createdAt: -1 } });
        }
        return this;
    }
    paginate() {
        const page = Number(this === null || this === void 0 ? void 0 : this.query.page) || 1;
        const limit = Math.min(Number(this === null || this === void 0 ? void 0 : this.query.limit) || 10, 50);
        const skip = (page - 1) * limit;
        this.pipeline.push({ $skip: skip }, { $limit: limit });
        return this;
    }
    project(fields = []) {
        const projection = {};
        if (fields.length) {
            fields.forEach((field) => (projection[field] = 1));
        }
        else {
            projection['-_v'] = 0;
        }
        this.pipeline.push({ $project: projection });
        return this;
    }
    countTotal() {
        this.pipeline.push({
            $facet: {
                data: [{ $skip: 0 }, { $limit: 10 }],
                meta: [{ $count: 'total' }],
            },
        });
        this.pipeline.push({
            $project: {
                data: 1,
                total: { $ifNull: [{ $arrayElemAt: ['$meta.total', 0] }, 0] },
            },
        });
        return this;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.aggregate(this.pipeline);
        });
    }
}
exports.default = QueryBuilder2;
