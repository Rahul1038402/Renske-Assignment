export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BollingerBandsOptions {
  length: number;
  maType: 'SMA';
  source: 'close' | 'open' | 'high' | 'low';
  stdDevMultiplier: number;
  offset: number;
}

export interface BollingerBandsResult {
  timestamp: number;
  basis: number;
  upper: number;
  lower: number;
}

export interface BollingerBandsStyle {
  basis: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  upper: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  lower: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed';
  };
  background: {
    visible: boolean;
    opacity: number;
  };
}

export interface BollingerBandsSettings {
  inputs: BollingerBandsOptions;
  style: BollingerBandsStyle;
}