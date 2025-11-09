import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { connectRabbit } from "./config/rabbit.js";
import { startConsumer } from "./consumers/message.consumer.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", messageRoutes);
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Server is running 🚀" });
});
const startServer = async () => {
  await connectDB();
  await connectRabbit();
  startConsumer();

  const port = process.env.PORT || 10000;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
};

startServer();
