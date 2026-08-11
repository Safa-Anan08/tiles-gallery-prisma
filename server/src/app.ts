import express, { Application, Request, Response } from "express";
import cors from "cors";
import apiRouter from "./routes";
import v1Router from "./routes/v1";
import { notFoundHandler } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/errorHandler";

const app: Application = express();

// Allowed Origins Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

// CORS Middleware Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during local development
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsing Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Primary API Router Mount (/api and /api/v1)
app.use("/api", apiRouter);
app.use("/api/v1", v1Router);

// Root Endpoint Fallback
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Tiles Gallery Express API Server (SCIC/EJP-13)",
    data: {
      status: "online",
      version: "1.0.0",
      endpoints: ["/api/health", "/api/v1/health"],
    },
  });
});

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
