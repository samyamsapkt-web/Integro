import cors from "cors";
import express from "express";
import { config, validateConfig } from "./config.js";
import { requireAuth } from "./middleware/requireAuth.js";
import healthRoutes from "./routes/healthRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";

validateConfig();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.frontendOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Blocked by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "INNOVISR SIaaS API",
    status: "online"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/profile", requireAuth, profileRoutes);
app.use("/api/workflows", requireAuth, workflowRoutes);

app.listen(config.port, () => {
  console.log(`SIaaS backend running on port ${config.port}`);
});
