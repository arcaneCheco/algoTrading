import express from "express";
import * as CONTROLLER from "@src/controllers";

const router = express.Router();

router.post("/candles", CONTROLLER.getCandles);
router.post("/getOrders", CONTROLLER.getOrders);
router.post("/getPendingOrders", CONTROLLER.getPendingOrders);
router.post("/getTrades", CONTROLLER.getTrades);
router.post("/getOpenTrades", CONTROLLER.getOpenTrades);
router.get("/getAccounts", CONTROLLER.getAccounts);
router.post("/getAccount", CONTROLLER.getAccount);
router.post("/getAccountSummary", CONTROLLER.getAccountSummary);

export default router;
