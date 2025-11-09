// startServer();
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { connectRabbit } from "./config/rabbit.js";
import { startConsumer } from "./consumers/message.consumer.js";
import messageRoutes from "./routes/message.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();
const app = express();

// CORS configuration - allow both production and development URLs
const corsOptions = {
  origin: [
    "https://demo-idra-chat.netlify.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", messageRoutes);
app.use("/file/api", uploadRoutes);

app.get("/", (req, res) =>
  res.json({ status: "OK", message: "Server is running 🚀" })
);

const startServer = async () => {
  await connectDB();
  await connectRabbit();
  startConsumer();

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
};

startServer();
