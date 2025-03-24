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
exports.deleteCrop = exports.updateCrop = exports.getCropById = exports.getAllCropsWithoutPagination = exports.getAllCrops = exports.createCrop = void 0;
const Crop_1 = require("../models/Crop");
const Activity_1 = require("../models/Activity");
const Resource_1 = require("../models/Resource");
const mongoose_1 = __importStar(require("mongoose"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// Create Crop
exports.createCrop = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, plantingDate, status } = req.body;
    if (!name || !plantingDate || !status) {
        throw new Error('Missing required fields: name, plantingDate, or status');
    }
    const crop = new Crop_1.Crop({
        name,
        plantingDate: new Date(plantingDate),
        harvestDate: req.body.harvestDate ? new Date(req.body.harvestDate) : undefined,
        status,
    });
    const savedCrop = yield crop.save();
    res.status(201).json({
        success: true,
        data: savedCrop,
        message: 'Crop created successfully'
    });
}));
// Get All Crops
exports.getAllCrops = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Basic filtering
    const filter = {};
    if (req.query.status) {
        filter.status = req.query.status;
    }
    if (req.query.dateFrom) {
        filter.plantingDate = { $gte: new Date(req.query.dateFrom) };
    }
    if (req.query.dateTo) {
        filter.plantingDate = filter.plantingDate
            ? Object.assign(Object.assign({}, filter.plantingDate), { $lte: new Date(req.query.dateTo) }) : { $lte: new Date(req.query.dateTo) };
    }
    const [crops, total] = yield Promise.all([
        Crop_1.Crop.find(filter)
            .sort({ plantingDate: -1 })
            .skip(skip)
            .limit(limit),
        Crop_1.Crop.countDocuments(filter)
    ]);
    res.status(200).json({
        success: true,
        data: crops,
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
// Get All Crops Without Pagination
exports.getAllCropsWithoutPagination = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (req.query.status) {
        filter.status = req.query.status;
    }
    const crops = yield Crop_1.Crop.find(filter).sort({ plantingDate: -1 });
    res.status(200).json({
        success: true,
        count: crops.length,
        data: crops
    });
}));
// Get Crop by ID
exports.getCropById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error('Invalid crop ID format');
    const crop = yield Crop_1.Crop.findById(id);
    if (!crop)
        throw new Error('Crop not found');
    res.status(200).json({
        success: true,
        data: crop
    });
}));
// Update Crop
exports.updateCrop = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error('Invalid crop ID format');
    const updatedCrop = yield Crop_1.Crop.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedCrop)
        throw new Error('Crop not found');
    res.status(200).json({
        success: true,
        data: updatedCrop,
        message: 'Crop updated successfully'
    });
}));
// Delete Crop (with cascading deletion of activities and resources)
exports.deleteCrop = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error('Invalid crop ID format');
    // Start a transaction for atomic operations
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // First delete all related activities and resources
        yield Promise.all([
            Activity_1.Activity.deleteMany({ cropId: id }).session(session),
            Resource_1.Resource.deleteMany({ cropId: id }).session(session)
        ]);
        // Then delete the crop
        const deletedCrop = yield Crop_1.Crop.findByIdAndDelete(id).session(session);
        if (!deletedCrop) {
            throw new Error('Crop not found');
        }
        // Commit the transaction if all operations succeeded
        yield session.commitTransaction();
        res.status(200).json({
            success: true,
            message: 'Crop and all related activities and resources deleted successfully'
        });
    }
    catch (error) {
        // If any operation fails, abort the transaction
        yield session.abortTransaction();
        throw error;
    }
    finally {
        // End the session
        session.endSession();
    }
}));
