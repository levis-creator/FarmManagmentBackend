"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cropController_1 = require("../controllers/cropController");
const router = express_1.default.Router();
router.post('/', cropController_1.createCrop);
router.get('/', cropController_1.getAllCrops);
router.get('/all', cropController_1.getAllCropsWithoutPagination);
router.get('/:id', cropController_1.getCropById);
router.put('/:id', cropController_1.updateCrop);
router.delete('/:id', cropController_1.deleteCrop);
exports.default = router;
