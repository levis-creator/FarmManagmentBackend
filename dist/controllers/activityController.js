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
exports.updateActivity = exports.getAllActivitiesWithoutPagination = exports.deleteActivity = exports.getActivityById = exports.getAllActivities = exports.createActivity = exports.errorHandler = void 0;
const Activity_1 = require("../models/Activity");
const mongoose_1 = require("mongoose");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// Utility function for building filters
const buildActivityFilters = (query) => {
    const filter = {};
    if (query.cropId && mongoose_1.Types.ObjectId.isValid(query.cropId)) {
        filter.cropId = new mongoose_1.Types.ObjectId(query.cropId);
    }
    if (query.dateFrom || query.dateTo) {
        filter.date = {};
        if (query.dateFrom)
            filter.date.$gte = new Date(query.dateFrom);
        if (query.dateTo)
            filter.date.$lte = new Date(query.dateTo);
    }
    return filter;
};
// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
    res.status(statusCode).json({ success: false, error: err.name, message: err.message });
};
exports.errorHandler = errorHandler;
// Create Activity
exports.createActivity = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, date, cropId } = req.body;
    if (!description || !date || !cropId || !mongoose_1.Types.ObjectId.isValid(cropId)) {
        throw new Error('Invalid or missing fields: description, date, or cropId');
    }
    const activity = new Activity_1.Activity({
        description,
        date: new Date(date),
        cropId: new mongoose_1.Types.ObjectId(cropId),
    });
    const savedActivity = yield activity.save();
    const populatedActivity = yield Activity_1.Activity.populate(savedActivity, { path: 'cropId' });
    res.status(201).json({
        success: true,
        data: populatedActivity,
        message: 'Activity created successfully',
    });
}));
// Get All Activities
exports.getAllActivities = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = buildActivityFilters(req.query);
    const [activities, total] = yield Promise.all([
        Activity_1.Activity.find(filter).populate('cropId').sort({ date: -1 }).skip(skip).limit(limit),
        Activity_1.Activity.countDocuments(filter),
    ]);
    res.status(200).json({
        success: true,
        data: activities,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
    });
}));
// Get Activity by ID
exports.getActivityById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error('Invalid activity ID format');
    const activity = yield Activity_1.Activity.findById(id).populate('cropId');
    if (!activity)
        throw new Error('Activity not found');
    res.status(200).json({ success: true, data: activity });
}));
// Delete Activity
exports.deleteActivity = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error('Invalid activity ID format');
    const deletedActivity = yield Activity_1.Activity.findByIdAndDelete(id);
    if (!deletedActivity)
        throw new Error('Activity not found');
    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
}));
// Get All Activities without pagination
exports.getAllActivitiesWithoutPagination = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = buildActivityFilters(req.query);
    const activities = yield Activity_1.Activity.find(filter).populate('cropId').sort({ date: -1 });
    res.status(200).json({
        success: true,
        data: activities,
    });
}));
// Update Activity
exports.updateActivity = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, date, cropId } = req.body;
    // Check if the provided ID is valid
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new Error('Invalid activity ID format');
    // Find the activity by ID
    const activity = yield Activity_1.Activity.findById(id);
    // If activity does not exist
    if (!activity)
        throw new Error('Activity not found');
    // Update activity fields
    if (description)
        activity.description = description;
    if (date)
        activity.date = new Date(date);
    if (cropId && mongoose_1.Types.ObjectId.isValid(cropId))
        activity.cropId = new mongoose_1.Types.ObjectId(cropId);
    // Save the updated activity
    const updatedActivity = yield activity.save();
    const populatedActivity = yield Activity_1.Activity.populate(updatedActivity, { path: 'cropId' });
    res.status(200).json({
        success: true,
        data: populatedActivity,
        message: 'Activity updated successfully',
    });
}));
