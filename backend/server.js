import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/routes/authRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import folderRoutes from './src/routes/folderRoutes.js';
import noteRoutes from './src/routes/noteRoutes.js';

// Load environment variables from .env file
dotenv.config();
// Initialize express app
const app = express();
// Middleware to allow cross-origin requests
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    credentials: true,
}));
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware for routing
app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/notes", noteRoutes);

// Root
app.get("/", (req, res) => res.send("Folder/Note API running"));

// listening on specified port
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`Connection established at port ${PORT}`);
});

