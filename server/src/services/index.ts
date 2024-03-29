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
  return data;
  const candles = data.candles.map(({ time, mid }: any) => ({
    o: Number(mid.o),
    h: Number(mid.h),
    l: Number(mid.l),
    c: Number(mid.c),
    time,
  }));

  return candles;
};

export const getLatestCandles = async ({ id, params }: IGetLatestCandles) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/accounts/${id}/candles/latest${queryString}`;
  const response = await got(url, defaultOptions);
  const data = JSON.parse(response.body);
  return data;
};

/****
 * 
// TO-DO
 * change get spreads and get candles to use combined pricingComponent, e.g. price=MB
 * 
 */
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

export const getSinglePosition = async ({
  id,
  instrument,
}: IGetSinglePosition) => {
  const url = `${baseUrl}/v3/accounts/${id}/positions/${instrument}`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const getPricing = async ({ id, params }: IGetPricing) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/accounts/${id}/pricing${queryString}`;
  const response = await got(url, defaultOptions);

  return JSON.parse(response.body);
};

export const postMarketOrder = async ({ id, body }: IPostMarketOrder) => {
  const url = `${baseUrl}/v3/accounts/${id}/orders`;
  const response = await got.post(url, {
    body: JSON.stringify({ order: body }),
    ...defaultOptions,
  });

  const data = JSON.parse(response.body);

  return data;
};

export const putCloseOpenPosition = async ({
  id,
  instrument,
  body,
}: ICloseOpenPosition) => {
  console.log({ id, instrument, body });
  const url = `${baseUrl}/v3/accounts/${id}/positions/${instrument}/close`;
  const response = await got.put(url, {
    body: JSON.stringify(body),
    ...defaultOptions,
  });
  const data = JSON.parse(response.body);
  console.log(data);

  return data;
};

export const getTransactionsPages = async ({
  id,
  params,
}: IGetTransactionsPages) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/accounts/${id}/transactions${queryString}`;
  const response = await got(url, defaultOptions);
  const data = JSON.parse(response.body);

  return data;
};

export const getTransactionsSinceID = async ({
  id,
  params,
}: IGetTransactionsSinceID) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/accounts/${id}/transactions/sinceid${queryString}`;
  const response = await got(url, defaultOptions);
  const data = JSON.parse(response.body);

  return data;
};
