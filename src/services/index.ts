import {
  ICandles,
  IGetInstruments,
  IGetOrders,
  IGetTrades,
  IId,
} from "../../sharedTypes";
import { assembleQueryString } from "../utils";
import dotenv from "dotenv";
import got from "got";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), `/.env.${process.env.APP_ENV}`),
});
const baseUrl = process.env.BASE_URL_REST;
const apiKey = process.env.OANDA_API_KEY;

const defaultOptions = {
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
};

export const getCandles = async ({ instrument, params }: ICandles) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/instruments/${instrument}/candles${queryString}`;
  const response = await got(url, defaultOptions);
  const data = JSON.parse(response.body);
  const candles = data.candles.map(({ time, mid }: any) => ({
    o: Number(mid.o),
    h: Number(mid.h),
    l: Number(mid.l),
    c: Number(mid.c),
    time,
  }));

  return candles;
};

export const getSpreads = async ({ instrument, params }: ICandles) => {
  // price query should not be part of schema for this endpoint
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/instruments/${instrument}/candles${queryString}`;

  const responseAsk = await got(
    url + (!!queryString ? "&price=A" : "?price=A"),
    defaultOptions
  );
  const dataAsk = JSON.parse(responseAsk.body);

  const responseBid = await got(
    url + (!!queryString ? "&price=B" : "?price=B"),
    defaultOptions
  );
  const dataBid = JSON.parse(responseBid.body);

  const data = dataAsk.candles.map(({ ask }: any, index: number) => ({
    ask: Number(ask.c),
    bid: Number(dataBid.candles[index].bid.c),
  }));

  return data;
};

export const getOrders = async ({ id, params }: IGetOrders) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/accounts/${id}/orders${queryString}`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getPendingOrders = async ({ id }: IId) => {
  const url = `${baseUrl}/v3/accounts/${id}/pendingOrders`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getTrades = async ({ id, params }: IGetTrades) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/accounts/${id}/trades${queryString}`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getOpenTrades = async ({ id }: IId) => {
  const url = `${baseUrl}/v3/accounts/${id}/openTrades`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getAccounts = async () => {
  const url = `${baseUrl}/v3/accounts`;
  const response = await got(url, defaultOptions);
  return JSON.parse(response.body);
};

export const getAccount = async ({ id }: IId) => {
  const url = `${baseUrl}/v3/accounts/${id}`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getAccountSummary = async ({ id }: IId) => {
  const url = `${baseUrl}/v3/accounts/${id}/summary`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getInstruments = async ({ id, instruments }: IGetInstruments) => {
  const queryString = instruments ? `?instruments=${instruments}` : "";
  const url = `${baseUrl}/v3/accounts/${id}/instruments${queryString}`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getPositions = async ({ id }: IId) => {
  const url = `${baseUrl}/v3/accounts/${id}/positions`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getOpenPositions = async ({ id }: IId) => {
  const url = `${baseUrl}/v3/accounts/${id}/openPositions`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

// app.post("/orders", async (req, res, next) => {
//   const { id, type, instrument, timeInForce, units, positionFill } = req.body;
//   try {
//     const sendBody = {
//       order: { type, instrument, timeInForce, units, positionFill },
//     };
//     const response = await got.post(`${baseUrl}/v3/accounts/${id}/orders`, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(sendBody),
//     });
//     res.send(JSON.parse(response.body));
//   } catch (error) {
//     console.log({ error });
//     next(error);
//   }
// });
