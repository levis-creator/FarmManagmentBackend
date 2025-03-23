import express from 'express';
import cors from 'cors';
import cropRoutes from './routes/cropRoutes';
import resourceRoutes from './routes/resourceRoutes';
import activityRoutes from './routes/activityRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/crops', cropRoutes);
app.use('/resources', resourceRoutes);
app.use('/activities', activityRoutes);

export default app;