import { ICandles, IGetOrders, IGetTrades, IId } from "../../sharedTypes";
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

// app.get("/accounts/:id/instruments", async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const response = await got(`${baseUrl}/v3/accounts/${id}/instruments`, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//     });
//     res.send(JSON.parse(response.body));
//   } catch (error) {
//     console.log({ error });
//     next(error);
//   }
// });

// app.get("/orders/:id", async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const response = await got(`${baseUrl}/v3/accounts/${id}/orders`, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//     });
//     res.send(JSON.parse(response.body));
//   } catch (error) {
//     console.log({ error });
//     next(error);
//   }
// });

// app.get("/instruments/:instrument/candlesWithSpread", async (req, res) => {
//   const { instrument } = req.params;
//   const queries = req.originalUrl.split("?")[1];
//   const headers = { headers: { Authorization: `Bearer ${apiKey}` } };
//   const url = `${baseUrl}/v3/instruments/${instrument}/candles?${queries}&price=M`;
//   try {
//     const responseMid = await got(url + "&price=M", headers);
//     const dataMid = JSON.parse(responseMid.body);
//     const responseAsk = await got(url + "&price=A", headers);
//     const dataAsk = JSON.parse(responseAsk.body);
//     const responseBid = await got(url + "&price=B", headers);
//     const dataBid = JSON.parse(responseBid.body);

//     const candles = dataMid.candles.map(({ time, mid }: any, i: number) => ({
//       o: Number(mid.o),
//       h: Number(mid.h),
//       l: Number(mid.l),
//       c: Number(mid.c),
//       ask: Number(dataAsk.candles[i].ask.c),
//       bid: Number(dataBid.candles[i].bid.c),
//       time,
//     }));

//     res.send(candles);
//   } catch (error) {
//     console.log({ error });
//   }
// });

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

// // app.get("/positions/:id", async (req, res, next) => {
// //   const { id } = req.params;
// //   try {
// //     const response = await got(
// //       `${baseUrl}/v3/accounts/${id}/trades`,
// //       // `${baseUrl}/v3/accounts/${id}/trades?beforeID=1`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${apiKey}`,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );
// //     res.send(JSON.parse(response.body));
// //   } catch (error) {
// //     console.log({ error });
// //     next(error);
// //   }
// // });
