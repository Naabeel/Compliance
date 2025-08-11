import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getNMInfo,
  startScreening,
  getStatus,
  getQueries,
  answerQuery,
} from "./routes/compliance";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Compliance API routes
  app.get("/api/get_nm_info/:nm_id", getNMInfo);
  app.get("/api/start_screening", startScreening);
  app.get("/api/status/:nm_id", getStatus);
  app.get("/api/queries/:nm_id", getQueries);
  app.post("/api/answer_query", answerQuery);

  return app;
}
