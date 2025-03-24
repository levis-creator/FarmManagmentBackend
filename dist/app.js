"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cropRoutes_1 = __importDefault(require("./routes/cropRoutes"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/crops', cropRoutes_1.default);
app.use('/resources', resourceRoutes_1.default);
app.use('/activities', activityRoutes_1.default);
exports.default = app;
