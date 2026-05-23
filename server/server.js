// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import bugRoutes from "./routes/bugRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";



dotenv.config({
path:"./.env"
});

const app = express();

dotenv.config();                                    // dotenv configuration
connectDB();                                        // Import the connectDB function and call it to connect to the database


app.use(express.json());                            // Middleware to parse JSON bodies


app.use(cors());                                    //CORS

app.use("/api/auth", authRoutes);                   // Use login register routes
app.use("/api/projects", projectRoutes);            // projects routes
app.use("/api/bugs", bugRoutes);                    // bug page routes
app.use("/api/dashboard",dashboardRoutes);

app.get("/", (req, res) => {                        // test route
  res.send("Api Is Running...");
});


const PORT = process.env.PORT || 5000;              //port


app.listen(PORT, () => {                            // Start the server
  console.log(`Server is running on port ${PORT}`);
});

