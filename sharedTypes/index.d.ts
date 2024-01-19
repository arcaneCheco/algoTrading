export type CandlestickGranularity =
  | "S5"
  | "S10"
  | "S15"
  | "S30"
  | "M1"
  | "M2"
  | "M3"
  | "M4"
  | "M5"
  | "M10"
  | "M15"
  | "M30"
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H6"
  | "H8"
  | "H12"
  | "D"
  | "W"
  | "M";

export interface ICandlesParams {
  from?: string;
  to?: string;
  granularity?: CandlestickGranularity;
}
export interface ICandles {
  instrument: string;
  params: ICandlesParams;
}
