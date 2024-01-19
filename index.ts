import express, { Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import got from "got";
import { CandlestickGranularity, ICandles } from "./sharedTypes";
import { CustomRequest } from "./types";
import { assembleQueryString } from "./utils";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

let baseUrl: string, apiKey: string, accId: string;

if (process.env.NODE_ENV === "DEMO") {
  baseUrl = process.env.BASE_URL_REST_DEMO!;
  apiKey = process.env.OANDA_API_KEY_DEMO!;
  accId = process.env.OANDA_ACC_ID_1_DEMO!;
} else {
  apiKey = "";
}

const defaultOptions = {
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
};

app.get("/accounts", async (req, res) => {
  try {
    const response = await got(`${baseUrl}/v3/accounts`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const accounts = JSON.parse(response.body).accounts;
    res.send(accounts);
  } catch (error) {
    console.log({ error });
  }
});

app.get("/accounts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await got(`${baseUrl}/v3/accounts/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    res.send(JSON.parse(response.body));
  } catch (error) {
    console.log({ error });
  }
});

app.get("/accounts/:id/summary", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await got(`${baseUrl}/v3/accounts/${id}/summary`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    res.send(JSON.parse(response.body));
  } catch (error) {
    console.log({ error });
  }
});

app.get("/accounts/:id/instruments", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await got(`${baseUrl}/v3/accounts/${id}/instruments`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    res.send(JSON.parse(response.body));
  } catch (error) {
    console.log({ error });
  }
});

app.post("/candles", async (req: CustomRequest<ICandles>, res) => {
  const { instrument, params } = req.body;
  const queryString = assembleQueryString(params);

  try {
    const response = await got(
      `${baseUrl}/v3/instruments/${instrument}/candles${queryString}`,
      defaultOptions
    );
    const data = JSON.parse(response.body);
    const candles = data.candles.map(({ time, mid }: any) => ({
      o: Number(mid.o),
      h: Number(mid.h),
      l: Number(mid.l),
      c: Number(mid.c),
      time,
    }));
    res.send(candles);
  } catch (error) {
    console.log({ error });
  }
});

app.get("/instruments/:instrument/candles", async (req, res) => {
  const { instrument } = req.params;
  const queries = req.originalUrl.split("?")[1];
  try {
    const response = await got(
      `${baseUrl}/v3/instruments/${instrument}/candles?${queries}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const data = JSON.parse(response.body);
    const candles = data.candles.map(({ time, mid }: any) => ({
      o: Number(mid.o),
      h: Number(mid.h),
      l: Number(mid.l),
      c: Number(mid.c),
      time,
    }));
    res.send(candles);
  } catch (error) {
    console.log({ error });
  }
});

app.get("/instruments/:instrument/candlesWithSpread", async (req, res) => {
  const { instrument } = req.params;
  const queries = req.originalUrl.split("?")[1];
  const headers = { headers: { Authorization: `Bearer ${apiKey}` } };
  const url = `${baseUrl}/v3/instruments/${instrument}/candles?${queries}&price=M`;
  try {
    const responseMid = await got(url + "&price=M", headers);
    const dataMid = JSON.parse(responseMid.body);
    const responseAsk = await got(url + "&price=A", headers);
    const dataAsk = JSON.parse(responseAsk.body);
    const responseBid = await got(url + "&price=B", headers);
    const dataBid = JSON.parse(responseBid.body);

    const candles = dataMid.candles.map(({ time, mid }: any, i: number) => ({
      o: Number(mid.o),
      h: Number(mid.h),
      l: Number(mid.l),
      c: Number(mid.c),
      ask: Number(dataAsk.candles[i].ask.c),
      bid: Number(dataBid.candles[i].bid.c),
      time,
    }));

    res.send(candles);
  } catch (error) {
    console.log({ error });
  }
});

app.get("/orders/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await got(`${baseUrl}/v3/accounts/${id}/orders`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    res.send(JSON.parse(response.body));
  } catch (error) {
    console.log({ error });
    next(error);
  }
});

app.post("/orders", async (req, res, next) => {
  const { id, type, instrument, timeInForce, units, positionFill } = req.body;
  try {
    const sendBody = {
      order: { type, instrument, timeInForce, units, positionFill },
    };
    const response = await got.post(`${baseUrl}/v3/accounts/${id}/orders`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendBody),
    });
    res.send(JSON.parse(response.body));
  } catch (error) {
    console.log({ error });
    next(error);
  }
});

app.get("/openTrades/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await got(`${baseUrl}/v3/accounts/${id}/openTrades`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    res.send(JSON.parse(response.body));
  } catch (error) {
    console.log({ error });
    next(error);
  }
});

app.get("/trades/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await got(
      `${baseUrl}/v3/accounts/${id}/trades`,
      // `${baseUrl}/v3/accounts/${id}/trades?beforeID=1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.send(JSON.parse(response.body));
  } catch (error) {
    console.log({ error });
    next(error);
  }
});

// app.get("/positions/:id", async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const response = await got(
//       `${baseUrl}/v3/accounts/${id}/trades`,
//       // `${baseUrl}/v3/accounts/${id}/trades?beforeID=1`,
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     res.send(JSON.parse(response.body));
//   } catch (error) {
//     console.log({ error });
//     next(error);
//   }
// });

enum OrderType {
  Market = "MARKET",
  Limit = "LIMIT",
  Stop = "STOP",
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
