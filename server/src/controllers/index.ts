import * as MODELS from "@src/services";
import { NextFunction, Request, Response } from "express";
// import { ICandles } from "@lt_surge/algo-trading-shared-types";
import {
  ICandles,
  ICloseOpenPosition,
  IGetInstruments,
  IGetLatestCandles,
  IGetOrders,
  IGetPricing,
  IGetSinglePosition,
  IGetTrades,
  IGetTransactionsPages,
  IGetTransactionsSinceID,
  IId,
  IPostMarketOrder,
} from "@sharedTypes";

interface CustomRequest<T> extends Request {
  body: T;
}

// import { Send } from "express-serve-static-core";
// interface TypedResponse<ResBody> extends Express.Response {
//   send: Send<ResBody, this>;
// }
// res: TypedResponse<{ o: number; h: number; l: number; c: number; time: string }[]>,

type CntrlFn<Body = void> = (
  req: CustomRequest<Body>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const getCandles: CntrlFn<ICandles> = async (req, res, next) => {
  try {
    res.send(await MODELS.getCandles(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getLatestCandles: CntrlFn<IGetLatestCandles> = async (
  req,
  res,
  next
) => {
  try {
    res.send(await MODELS.getLatestCandles(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOrders: CntrlFn<IGetOrders> = async (req, res, next) => {
  try {
    res.send(await MODELS.getOrders(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getPendingOrders: CntrlFn<IId> = async (req, res, next) => {
  try {
    res.send(await MODELS.getPendingOrders(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getTrades: CntrlFn<IGetTrades> = async (req, res, next) => {
  try {
    res.send(await MODELS.getTrades(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOpenTrades: CntrlFn<IId> = async (req, res, next) => {
  try {
    res.send(await MODELS.getOpenTrades(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAccounts: CntrlFn = async (req, res, next) => {
  try {
    res.send(await MODELS.getAccounts());
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAccount: CntrlFn<IId> = async (req, res, next) => {
  try {
    res.send(await MODELS.getAccount(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAccountSummary: CntrlFn<IId> = async (req, res, next) => {
  try {
    res.send(await MODELS.getAccountSummary(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getInstruments: CntrlFn<IGetInstruments> = async (
  req,
  res,
  next
) => {
  try {
    res.send(await MODELS.getInstruments(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSpreads: CntrlFn<ICandles> = async (req, res, next) => {
  try {
    res.send(await MODELS.getSpreads(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getPositions: CntrlFn<IId> = async (req, res, next) => {
  try {
    res.send(await MODELS.getPositions(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOpenPositions: CntrlFn<IId> = async (req, res, next) => {
  try {
    res.send(await MODELS.getOpenPositions(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getSinglePosition: CntrlFn<IGetSinglePosition> = async (
  req,
  res,
  next
) => {
  try {
    res.send(await MODELS.getSinglePosition(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getPricing: CntrlFn<IGetPricing> = async (req, res, next) => {
  try {
    res.send(await MODELS.getPricing(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const postMarketOrder: CntrlFn<IPostMarketOrder> = async (
  req,
  res,
  next
) => {
  try {
    res.send(await MODELS.postMarketOrder(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const putCloseOpenPosition: CntrlFn<ICloseOpenPosition> = async (
  req,
  res,
  next
) => {
  try {
    res.send(await MODELS.putCloseOpenPosition(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getTransactionsPages: CntrlFn<IGetTransactionsPages> = async (
  req,
  res,
  next
) => {
  try {
    res.send(await MODELS.getTransactionsPages(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getTransactionsSinceID: CntrlFn<IGetTransactionsSinceID> = async (
  req,
  res,
  next
) => {
  try {
    res.send(await MODELS.getTransactionsSinceID(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
