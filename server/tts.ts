import got from "got";
import { Transform } from "stream";

// Create a transform stream that parses chunks of JSON data
const jsonParser = new Transform({
  readableObjectMode: true, // So we can emit parsed objects

  transform(chunk: any, encoding: any, callback: any) {
    // Convert chunk to string
    const strChunk = chunk.toString();

    // Split the string by newlines
    const lines = strChunk.split("\n");
    // console.log({ lines });
    // if (lines[1].length) {
    //   console.log(
    //     "hey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\nhey\n"
    //   );
    // }

    // Attempt to parse each line as JSON
    lines.forEach((line: any) => {
      if (line) {
        // Ignore empty lines
        try {
          const jsonObject = JSON.parse(line);
          this.push(jsonObject); // Emit the parsed object
        } catch (error) {
          // Handle JSON parse error, maybe emit an 'error' event
          this.emit("error", error);
        }
      }
    });

    callback();
  },
});

const streamPrices = (accountId: string, accessToken: string) => {
  const url = `https://stream-fxpractice.oanda.com/v3/accounts/${accountId}/pricing/stream`;
  const instruments = "EUR_USD";
  //   const instruments = "EUR_USD,USD_CAD";
  //   "Accept-Datetime-Format": "RFC3339",

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    searchParams: {
      instruments: instruments,
    },
  };

  const calculateMinuteCandle = (time, price) => {};

  const stream = got.stream(url, options);

  stream.pipe(jsonParser);

  let latestCandlePricingData: Array<number> = [];

  //
  // at HH:59, start collecting stream data;

  let currrentMinute = new Date().getMinutes();
  let nextMinute = (currrentMinute + 1) % 60;

  let collectCandleData = false;

  jsonParser.on("data", (json) => {
    if (json.type === "PRICE") {
      const time = json.time;
      const minute = new Date(time).getMinutes();

      if (minute > currrentMinute || (currrentMinute === 59 && minute === 0)) {
        currrentMinute = minute;
        console.log("calculating candle", time);
        const candle = {
          o: latestCandlePricingData[0],
          h: Math.max(...latestCandlePricingData),
          l: Math.min(...latestCandlePricingData),
          c: latestCandlePricingData[latestCandlePricingData.length - 1],
          time: time,
        };
        console.log({ candle });
        // nextMinute = (currrentMinute + 1) % 60;
        latestCandlePricingData = [];
        console.log("RESET CANDLE DATA");
      }

      const bid = Number(json.bids[0].price);
      const ask = Number(json.asks[0].price);
      const mid = (bid + ask) / 2;
      latestCandlePricingData.push(mid);
    }
  });

  jsonParser.on("error", (error) => {
    console.error("Error connecting to OANDA stream:", error.message);
  });
};

// Usage
const YOUR_ACCESS_TOKEN =
  "b2da5090d7d2ba471a9954e8ffc322dc-a93f8a9377c752423cdfe418a922493b";
const YOUR_ACCOUNT_ID = "101-004-27932368-001";
streamPrices(YOUR_ACCOUNT_ID, YOUR_ACCESS_TOKEN);
