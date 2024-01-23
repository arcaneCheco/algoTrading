import express from "express";
import * as CONTROLLER from "@src/controllers";

const router = express.Router();

router.post("/candles", CONTROLLER.postCandles);

export default router;
