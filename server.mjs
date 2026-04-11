import express from "express";
import cors from "cors";
import allRouter from "./routes/index.mjs";
import searchRouter from "./routes/search.mjs";
import ViteExpress from "vite-express";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/all", allRouter);

app.use("/search", searchRouter);

ViteExpress.listen(app, 3000, () => {
  console.log("Server running on http://localhost:3000");
});