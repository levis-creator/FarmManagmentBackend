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
exports.deleteResource = exports.updateResource = exports.getResourceById = exports.getAllResourcesWithoutPagination = exports.getAllResources = exports.createResource = void 0;
const Resource_1 = require("../models/Resource");
const mongoose_1 = require("mongoose");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// Create Resource
exports.createResource = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, quantity, type, cropId } = req.body;
    // Validate input
    if (!name || !quantity || !type || !cropId) {
        throw new Error('Missing required fields: name, quantity, type, or cropId');
    }
    if (!mongoose_1.Types.ObjectId.isValid(cropId)) {
        throw new Error('Invalid cropId format');
    }
    const resource = new Resource_1.Resource({
        name,
        quantity,
        type,
        cropId: new mongoose_1.Types.ObjectId(cropId)
    });
    const savedResource = yield resource.save();
    const populatedResource = yield Resource_1.Resource.populate(savedResource, { path: 'cropId' });
    res.status(201).json({
        success: true,
        data: populatedResource,
        message: 'Resource created successfully'
    });
}));
// Get All Resources
exports.getAllResources = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Filtering options
    const filter = {};
    if (req.query.cropId) {
        if (!mongoose_1.Types.ObjectId.isValid(req.query.cropId)) {
            throw new Error('Invalid cropId format');
        }
        filter.cropId = new mongoose_1.Types.ObjectId(req.query.cropId);
    }
    if (req.query.type) {
        filter.type = req.query.type;
    }
    const [resources, total] = yield Promise.all([
        Resource_1.Resource.find(filter)
            .populate('cropId')
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit),
        Resource_1.Resource.countDocuments(filter)
    ]);
    res.status(200).json({
        success: true,
        data: resources,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    });
}));
// Get All Resources Without Pagination
exports.getAllResourcesWithoutPagination = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (req.query.cropId) {
        if (!mongoose_1.Types.ObjectId.isValid(req.query.cropId)) {
            throw new Error('Invalid cropId format');
        }
        filter.cropId = new mongoose_1.Types.ObjectId(req.query.cropId);
    }
    const resources = yield Resource_1.Resource.find(filter)
        .populate('cropId')
        .sort({ name: 1 });
    res.status(200).json({
        success: true,
        count: resources.length,
        data: resources
    });
}));
// Get Resource by ID
exports.getResourceById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid resource ID format');
    }
    const resource = yield Resource_1.Resource.findById(id).populate('cropId');
    if (!resource) {
        throw new Error('Resource not found');
    }
    res.status(200).json({
        success: true,
        data: resource
    });
}));
// Update Resource
exports.updateResource = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid resource ID format');
    }
    if (updateData.cropId && !mongoose_1.Types.ObjectId.isValid(updateData.cropId)) {
        throw new Error('Invalid cropId format');
    }
    const updatedResource = yield Resource_1.Resource.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('cropId');
    if (!updatedResource) {
        throw new Error('Resource not found');
    }
    res.status(200).json({
        success: true,
        data: updatedResource,
        message: 'Resource updated successfully'
    });
}));
// Delete Resource
exports.deleteResource = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid resource ID format');
    }
    const deletedResource = yield Resource_1.Resource.findByIdAndDelete(id);
    if (!deletedResource) {
        throw new Error('Resource not found');
    }
    res.status(200).json({
        success: true,
        message: 'Resource deleted successfully'
    });
}));
