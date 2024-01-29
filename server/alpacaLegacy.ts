import express from "express";
import Alpaca from "@alpacahq/alpaca-trade-api";
import dotenv from "dotenv";
import cors from "cors";
import { TimeFrameUnit } from "@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2";
// import { cryptoBarsRequest } from "@alpacahq/alpaca-trade-api/dist/resources/datav2/rest_v2";

dotenv.config();
const app = express();
const port = 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID_PAPER,
  secretKey: process.env.APCA_API_SECRET_KEY_PAPER,
  paper: true,
});

// alpaca.getAccount().then((account: any) => {
//   console.log("Current Account:", account);
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/assets", async (req, res) => {
  const filters = req.body;
  const assets = await getAssets(filters);
  res.send(assets);
});

app.post("/historicalData", async (req, res) => {
  const args = req.body;
  console.log(args);
  const data = await getHistoricalData(args);
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const getAssets = async (filters: Filters) => {
  try {
    const data = await alpaca.getAssets(filters);
    return data;
  } catch (error) {
    console.log({ error });
  }
};

interface Filters {
  status?: string;
  asset_class?: string;
  exchange?: string;
}

interface HistoricalDataArgs {
  symbol: string;
  start: string;
  end: string;
  timeframe: number;
  timeframeUnit: string;
}

const getHistoricalData = async (args: HistoricalDataArgs) => {
  const { symbol, start, end, timeframe, timeframeUnit } = args;
  try {
    const data = alpaca.getBarsV2(symbol, {
      start,
      end,
      timeframe: alpaca.newTimeframe(
        timeframe,
        // @ts-ignore
        alpaca.timeframeUnit[timeframeUnit]
      ),
      limit: 1000,
    });
    const got = [];
    for await (let b of data) {
      got.push(b);
    }

    return got;
  } catch (error) {
    console.log({ error });
  }
};

/*****
 * mean-reverse algo: https://www.youtube.com/watch?v=jAI6s1WuEus&ab_channel=TheTransparentTrader
 * const MA = movingAverage(close, 50);
 * const profitTarget = 0;
 * const stopLoss = 0;
 * const range = high - low;
 *
 * // entry
 * if (close < MA and close - low < 0.2 * range) {
 *    buy on close;
 * }
 *
 * // exit
 *
 *
 *
 *
 */
