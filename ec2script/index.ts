import schedule from "node-schedule";
import dotenv from "dotenv";
import {
  getCurrentPosition,
  getData,
  getLatestCandle,
  smaFromCandles,
  submitMarketOrder,
  useStrategy,
} from "@src/utils";

dotenv.config();

const tradeID = "trade_1234";

const id = process.env.TEST_ACCOUNT_ID!;

const onTime = async () => {
  const smaPeriod = 40;
  const granularity = "M30";
  const instrument = "EUR_USD";

  console.log("time at which function is called", new Date().toISOString());

  const position = await getCurrentPosition({
    id,
    instrument,
  });

  const { candles } = await getData({
    instrument,
    params: { granularity, count: `${smaPeriod}`, price: "M" },
  });

  let latestCandle = candles.pop();

  console.log("time at which data is queried", new Date().toISOString());

  latestCandle = await getLatestCandle(
    { id, params: { candleSpecifications: `${instrument}:${granularity}:M` } },
    latestCandle
  );

  console.log("time at which data is received", new Date().toISOString());

  candles.push(latestCandle);

  const sma = smaFromCandles(candles);

  const { signal, units } = useStrategy(latestCandle, sma, position);

  console.log({ signal });

  if (signal === "HOLD") return "HOLDING";

  const decimalPositions = latestCandle.mid.c.split(".")[1].length;
  const stopLossPercentage = 2.5 / 100;
  const stopLossDistance = (
    Number(latestCandle.mid.c) * stopLossPercentage
  ).toFixed(decimalPositions);

  const orderDetails = await submitMarketOrder({
    id,
    body: {
      type: "MARKET",
      instrument,
      units: `${units}`,
      timeInForce: "FOK",
      positionFill: "DEFAULT",
      stopLossOnFill: {
        distance: stopLossDistance,
      },
      clientExtensions: {
        id: tradeID,
      },
    },
  });

  return orderDetails;
};

// const job = schedule.scheduleJob("0/30 * * ? * *", async () => {
//   await onTime();
// });
const job = schedule.scheduleJob("0 0/30 * ? * *", async () => {
  await onTime();
});

// (async () => {
//   const t = await submitMarketOrder({
//     id: id,
//     body: {
//       type: "MARKET",
//       instrument: "EUR_JPY",
//       units: `${-500}`,
//       timeInForce: "FOK",
//       positionFill: "DEFAULT",
//       stopLossOnFill: {
//         distance: "4.2",
//       },
//       clientExtensions: {
//         id: tradeID,
//       },
//     },
//   });
//   console.log(t);
//   return t;
// })();
