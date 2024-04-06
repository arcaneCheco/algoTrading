import {
  ICandles,
  IGetLatestCandles,
  IGetSinglePosition,
  IPostMarketOrder,
} from "@sharedTypes";
import dotenv from "dotenv";
import got from "got";

dotenv.config();

const defaultOptions = {
  headers: {
    Authorization: `Bearer ${process.env.OANDA_API_KEY}`,
    "Content-Type": "application/json",
  },
};

const baseUrl = process.env.BASE_URL_REST;

export const getTimeDifference = (date: string) => {
  return (new Date().getTime() - new Date(date).getTime()) / 1000;
};

export const assembleQueryString = (queryParams?: { [key: string]: any }) => {
  if (!queryParams) return "";

  let isFirst = true;
  return Object.entries(queryParams).reduce((acc, [key, value]) => {
    let delimiter = "";
    if (isFirst) {
      isFirst = false;
    } else {
      delimiter = "&";
    }
    return acc + delimiter + `${key}=${value}`;
  }, "?");
};

export const getLatestCandle = async (
  { id, params }: IGetLatestCandles,
  latestCandle: any
): Promise<any> => {
  const differenceSeconds = getTimeDifference(latestCandle.time);
  if (differenceSeconds > 50) {
    // 50
    await new Promise<void>((res) => {
      setTimeout(() => res(), 200);
    });
    const queryString = assembleQueryString(params);
    const url = `${baseUrl}/v3/accounts/${id}/candles/latest${queryString}`;
    const response = await got(url, defaultOptions);
    const data = JSON.parse(response.body);
    const newLatestCandle = data.latestCandles[0].candles[1];
    return await getLatestCandle({ id, params }, newLatestCandle);
  }
  return latestCandle;
};

export const getData = async ({ instrument, params }: ICandles) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/instruments/${instrument}/candles${queryString}`;
  const response = await got(url, defaultOptions);
  const data = JSON.parse(response.body);
  return data;
};

export const smaFromCandles = (candles: Array<any>) => {
  const sma =
    candles.reduce((sum: number, { mid }: any) => sum + Number(mid.c), 0) /
    candles.length;

  return sma;
};

export const getCurrentPosition = async ({
  id,
  instrument,
}: IGetSinglePosition) => {
  const url = `${baseUrl}/v3/accounts/${id}/positions/${instrument}`;
  const response = await got(url, defaultOptions);
  const data = JSON.parse(response.body);

  const longUnits = Number(data.position.long.units);
  const shortUnits = Number(data.position.short.units);

  let currentPosition = "NONE";
  if (longUnits > 0) {
    currentPosition = "LONG";
  }
  if (shortUnits < 0) {
    currentPosition = "SHORT";
  }

  return { longUnits, shortUnits, currentPosition };
};

export const useStrategy = (candle: any, sma: number, position: any) => {
  const { currentPosition, longUnits, shortUnits } = position;
  const { c, h, l } = candle.mid;
  const close = Number(c);
  const high = Number(h);
  const low = Number(l);
  const range = high - low;
  let signal = "HOLD";
  if (close < sma && close - low < 0.5 * range) {
    if (currentPosition === "LONG") {
      return { signal, units: 0 };
    }
    if (currentPosition === "NONE") {
      return { signal: "BUY", units: 1000 };
    }
    if (currentPosition === "SHORT") {
      return { signal: "BUY", units: 1000 + Math.abs(shortUnits) };
    }
  }
  if (close > sma && high - close < 0.5 * range) {
    if (currentPosition === "LONG") {
      return { signal: "SELLSHORT", units: -1000 - Math.abs(longUnits) };
    }
    if (currentPosition === "NONE") {
      return { signal: "SELLSHORT", units: -1000 };
    }
    if (currentPosition === "SHORT") {
      return { signal, units: 0 };
    }
  } else if (close > sma) {
    if (currentPosition === "LONG") {
      return { signal: "SELL", units: -Math.abs(longUnits) };
    }
    if (currentPosition === "NONE") {
      return { signal, units: 0 };
    }
    if (currentPosition === "SHORT") {
      return { signal, units: 0 };
    }
  } else if (close < sma) {
    if (currentPosition === "LONG") {
      return { signal, units: 0 };
    }
    if (currentPosition === "NONE") {
      return { signal, units: 0 };
    }
    if (currentPosition === "SHORT") {
      return { signal: "BUYTOCOVER", units: Math.abs(shortUnits) };
    }
  }
  return { signal, units: 0 };
};

export const submitMarketOrder = async ({ id, body }: IPostMarketOrder) => {
  const url = `${baseUrl}/v3/accounts/${id}/orders`;
  const response = await got.post(url, {
    body: JSON.stringify({ order: body }),
    ...defaultOptions,
  });

  const data = JSON.parse(response.body);

  return data;
};
