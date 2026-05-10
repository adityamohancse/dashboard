import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { commerceRouter } from "./routes/commerce";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_, res) => {
  res.json({ status: "ok", service: "commerce-os-api" });
});

app.use("/api", commerceRouter);

app.listen(PORT, () => {
  console.log(`Commerce OS API running on port ${PORT}`);
});

