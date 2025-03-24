"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const mongoose_1 = require("mongoose");
const ResourceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true },
    cropId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Crop', required: true }, // Relationship with Crop
});
exports.Resource = (0, mongoose_1.model)('Resource', ResourceSchema);
