import got from "got";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import {
  ICandles,
  IGetLatestCandles,
  IGetSinglePosition,
  IPostMarketOrder,
} from "@sharedTypes";
import { assembleQueryString } from "@server/utils";
import dotenv from "dotenv";

dotenv.config();

const defaultOptions = {
  headers: {
    Authorization: `Bearer ${process.env.OANDA_API_KEY}`,
    "Content-Type": "application/json",
  },
};

const baseUrl = process.env.BASE_URL_REST;

const id = process.env.TEST_ACCOUNT_ID!;

const getData = async ({ instrument, params }: ICandles) => {
  const queryString = assembleQueryString(params);
  const url = `${baseUrl}/v3/instruments/${instrument}/candles${queryString}`;
  const response = await got(url, defaultOptions);
  const data = JSON.parse(response.body);
  return data;
};

const getTimeDifference = (date: string) => {
  return (new Date().getTime() - new Date(date).getTime()) / 1000;
};

const getLatestCandle = async (
  { id, params }: IGetLatestCandles,
  latestCandle: any
): Promise<any> => {
  const differenceSeconds = getTimeDifference(latestCandle.time);
  if (differenceSeconds > 10) {
    await new Promise<void>((res) => {
      setTimeout(() => res(), 500);
    });
    const queryString = assembleQueryString(params);
    const url = `${baseUrl}/v3/accounts/${id}/candles/latest${queryString}`;
    const response = await got(url, defaultOptions);
    const data = JSON.parse(response.body);
    const newLatestCandle = data.latestCandles[0].candles[1];
    await getLatestCandle({ id, params }, newLatestCandle);
  }
  return latestCandle;
};

const smaFromCandles = (candles: Array<any>) => {
  const sma =
    candles.reduce((sum: number, { mid }: any) => sum + Number(mid.c), 0) /
    candles.length;

  return sma;
};

const getCurrentPosition = async ({ id, instrument }: IGetSinglePosition) => {
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

const useStrategy = (candle: any, sma: number, position: any) => {
  const { currentPosition, longUnits, shortUnits } = position;
  const { c, h, l } = candle.mid;
  const close = Number(c);
  const high = Number(h);
  const low = Number(l);
  const range = high - low;
  let signal = "HOLD";
  if (close < sma && close - low < 0.2 * range) {
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
  if (close > sma && high - close < 0.2 * range) {
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

const onTime = async () => {
  const smaPeriod = 50;
  const granularity = "H1";
  const instrument = "EUR_GBP";

  const position = await getCurrentPosition({
    id,
    instrument,
  });

  const { candles } = await getData({
    instrument,
    params: { granularity, count: `${smaPeriod}`, price: "M" },
  });

  let latestCandle = candles.pop();

  latestCandle = await getLatestCandle(
    { id, params: { candleSpecifications: `${instrument}:${granularity}:M` } },
    latestCandle
  );

  candles.push(latestCandle);

  const sma = smaFromCandles(candles);

  const { signal, units } = useStrategy(latestCandle, sma, position);

  if (signal === "HOLD") return "HOLDING";

  const orderDetails = await submitMarketOrder({
    id: id,
    body: {
      type: "MARKET",
      instrument,
      units: `${units}`,
      timeInForce: "FOK",
      positionFill: "DEFAULT",
    },
  });

  return orderDetails;
};

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log({ event, context });
  //   const res = await got(
  //     "https://pokeapi.co/api/v2/pokemon/ditto",
  //     defaultOptions
  //   );
  //   return JSON.parse(res.body);

  return await onTime();
};

// (async () => handler({ body: "hey" } as APIGatewayEvent, {} as Context))();
