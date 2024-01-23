import * as MODELS from "@src/services";
import { NextFunction, Request, Response } from "express";
import { ICandles } from "@lt_surge/algo-trading-shared-types";

interface CustomRequest<T> extends Request {
  body: T;
}

export const postCandles = async (
  req: CustomRequest<ICandles>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send(await MODELS.postCandles(req.body));
  } catch (error) {
    console.error(error);
    next(error);
  }
};
