import { Router } from "express";

export const commerceRouter = Router();

commerceRouter.get("/dashboard-summary", (_req, res) => {
  res.json({
    message: "Connect this route with PostgreSQL/Supabase aggregates.",
    modules: [
      "daily_logs",
      "tests",
      "revisions",
      "attendance",
      "backlogs",
      "goals",
    ],
  });
});

