// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db.js";
// import { connectRabbit } from "./config/rabbit.js";
// import { startConsumer } from "./consumers/message.consumer.js";
// import messageRoutes from "./routes/message.routes.js";
// import uploadRoutes from "./routes/upload.routes.js";
// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/api", messageRoutes);
// app.use("/file/api", uploadRoutes);

// app.get("/", (req, res) => {
//   res.json({ status: "OK", message: "Server is running 🚀" });
// });
// const startServer = async () => {
//   await connectDB();
//   await connectRabbit();
//   startConsumer();

//   const port = process.env.PORT || 5000;
//   app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
// };

// startServer();

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db.js";
// import { connectRabbit } from "./config/rabbit.js";
// import { startConsumer } from "./consumers/message.consumer.js";

// import messageRoutes from "./routes/message.routes.js";
// import uploadRoutes from "./routes/upload.routes.js";
// import cloudinaryRoutes from "./routes/cloudinary.routes.js";

// dotenv.config();

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api", messageRoutes); // Chat messages
// app.use("/file/api", uploadRoutes); // File metadata & PDF serving
// app.use("/file/api", cloudinaryRoutes); // Cloudinary signature endpoint

// // Health check
// app.get("/", (req, res) => {
//   res.json({ status: "OK", message: "Server is running 🚀" });
// });

// // Start Server
// const startServer = async () => {
//   try {
//     await connectDB();
//     await connectRabbit();
//     startConsumer();

//     const port = process.env.PORT || 5000;
//     app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
//   } catch (err) {
//     console.error("Failed to start server:", err);
//   }
// };

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

app.use(cors());
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
