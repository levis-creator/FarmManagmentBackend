import express from 'express';
import cors from 'cors';
import cropRoutes from './routes/cropRoutes';
import resourceRoutes from './routes/resourceRoutes';
import activityRoutes from './routes/activityRoutes';

const app = express();

// Configure CORS
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/crops', cropRoutes);
app.use('/resources', resourceRoutes);
app.use('/activities', activityRoutes);

// Handle preflight requests
app.options('*', cors(corsOptions));

export default app;