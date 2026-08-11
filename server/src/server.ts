import dotenv from "dotenv";
import path from "path";

// Load environment variables (.env file in server directory or fallback to root .env)
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import app from "./app";

const PORT: number = parseInt(process.env.PORT || "5000", 10);

const server = app.listen(PORT, () => {
  console.log("================================================");
  console.log(`🚀 Tiles Gallery Express Server (SCIC/EJP-13)`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log("================================================");
});

process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

export default server;
