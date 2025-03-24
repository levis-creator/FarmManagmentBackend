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
exports.Crop = void 0;
const mongoose_1 = require("mongoose");
const Activity_1 = require("./Activity");
const Resource_1 = require("./Resource");
const CropSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    variety: { type: String, required: true },
    plantingDate: { type: Date, required: true },
    harvestDate: { type: Date, required: true },
    status: { type: String, enum: ['Planting', 'Growing', 'Harvesting'], default: 'Planting' },
});
// Add pre-delete hook to remove related activities and resources
CropSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cropId = this._id;
        yield Promise.all([
            Activity_1.Activity.deleteMany({ cropId }),
            Resource_1.Resource.deleteMany({ cropId })
        ]);
        next();
    });
});
exports.Crop = (0, mongoose_1.model)('Crop', CropSchema);
