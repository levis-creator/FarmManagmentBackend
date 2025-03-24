"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
const ActivitySchema = new mongoose_1.Schema({
    activity: { type: String },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    cropId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Crop', required: true }, // Relationship with Crop
});
exports.Activity = (0, mongoose_1.model)('Activity', ActivitySchema);
