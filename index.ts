import express from "express";
import cors from "cors";
import router from "@src/routes";
import { errorHandler } from "@src/middleware";

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
