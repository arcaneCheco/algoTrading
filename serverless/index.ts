import got from "got";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const defaultOptions = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log({ event, context });
  const res = await got(
    "https://pokeapi.co/api/v2/pokemon/ditto",
    defaultOptions
  );
  return JSON.parse(res.body);
};

// for backtesting, don't worry about time discrepancies,
// for live, there are two routes wait for candle to close => maybe for shorter timeframes
// estimate candle 1 min or 10 minutes or so before close
