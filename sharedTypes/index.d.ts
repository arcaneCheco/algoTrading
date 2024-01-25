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

export type OrderStateFilter =
  | "PENDING"
  | "FILLED"
  | "TRIGGERED"
  | "CANCELLED"
  | "ALL";

export type TradeStateFilter =
  | "OPEN"
  | "CLOSED"
  | "CLOSE_WHEN_TRADEABLE"
  | "ALL";

export interface ICandlesParams {
  from?: string;
  to?: string;
  granularity?: CandlestickGranularity;
}
export interface ICandles {
  instrument: string;
  params: ICandlesParams;
}

export interface IId {
  id: string;
}

export interface IGetLatestCandles extends IId {
  params: {
    candleSpecifications: string;
  };
}

export interface IGetOrders extends IId {
  params?: {
    count?: number;
    ids?: string;
    state?: OrderStateFilter;
    instrument?: string;
    beforeID?: string;
  };
}

export interface IGetTrades extends IId {
  params?: {
    ids?: string;
    state?: TradeStateFilter;
    instrument?: string;
    count?: number;
    beforeID?: string;
  };
}

export interface IGetInstruments extends IId {
  instruments?: string;
}

export interface IGetPricing extends IId {
  params: {
    instruments: string;
    since?: string;
    includeHomeConversions?: boolean;
  };
}

export type OrderType =
  | "MARKET"
  | "LIMIT"
  | "STOP"
  | "MARKET_IF_TOUCHED"
  | "TAKE_PROFIT"
  | "STOP_LOSS"
  | "GUARANTEED_STOP_LOSS"
  | "TRAILING_STOP_LOSS"
  | "FIXED_PRICE";

export type TimeInForce = "GTC" | "GTD" | "GFD" | "FOK" | "IOC";

export type OrderPositionFill =
  | "OPEN_ONLY"
  | "REDUCE_FIRST"
  | "REDUCE_ONLY"
  | "DEFAULT";

export interface IClientExtensions {
  id: string;
  tag: string;
  comment: string;
}

export type TimeInForcePendingOrder = Exclude<TimeInForce, "FOK" | "IOC">;

export interface ITakeProfitDetails {
  price: string;
  timeInForce: TimeInForcePendingOrder; // default=GTC
  gtdTime: string;
  clientExtensions: IClientExtensions;
}

export interface IStopLossDetails {
  price: string;
  distance: string;
  timeInForce: TimeInForcePendingOrder;
  gtdTime: string;
  clientExtensions: IClientExtensions;
}

export interface IGuaranteedStopLossDetails {
  price: string;
  distance: string;
  timeInForce: TimeInForcePendingOrder;
  gtdTime: string;
  clientExtensions: IClientExtensions;
}

export interface ITrailingStopLossDetails {
  distance: string;
  timeInForce: TimeInForcePendingOrder;
  gtdTime: string;
  clientExtensions: IClientExtensions;
}

export interface IMarketOrderRequest {
  type?: OrderType;
  instrument: string;
  units: string;
  timeInForce?: TimeInForce;
  priceBound?: string;
  positionFill?: OrderPositionFill;
  clientExtensions?: IClientExtensions;
  takeProfitOnFill?: ITakeProfitDetails;
  stopLossOnFill?: IStopLossDetails;
  guaranteedStopLossOnFill?: IGuaranteedStopLossDetails;
  trailingStopLossOnFill?: ITrailingStopLossDetails;
  tradeClientExtensions?: IClientExtensions;
}

export interface IPostMarketOrder extends IId {
  body: IMarketOrderRequest;
}

export type CloseoutUnits = "ALL" | "NONE" | `${number}`;

export interface ICloseOpenPosition {
  id: string;
  instrument: string;
  body: {
    // either specify long or short; breaks if both are specified
    longUnits: CloseoutUnits;
    longClientExtensions?: IClientExtensions;
    shortUnits: CloseoutUnits;
    shortClientExtensions?: IClientExtensions;
  };
}
