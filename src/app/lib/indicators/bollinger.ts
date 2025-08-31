import { OHLCV, BollingerBandsOptions, BollingerBandsResult } from '../types';

/**
 * Calculates Simple Moving Average (SMA)
 * @param values Array of numbers
 * @param period Period for the moving average
 * @returns Array of SMA values
 */
function calculateSMA(values: number[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  
  return sma;
}

/**
 * Calculates Standard Deviation using sample standard deviation
 * @param values Array of numbers
 * @param period Period for calculation
 * @param mean Mean value for the period
 * @returns Standard deviation
 */
function calculateStandardDeviation(values: number[], period: number, mean: number): number {
  if (period <= 1) return 0;
  
  const sumSquaredDiffs = values.reduce((sum, value) => {
    const diff = value - mean;
    return sum + (diff * diff);
  }, 0);
  
  // Using sample standard deviation (N-1)
  return Math.sqrt(sumSquaredDiffs / (period - 1));
}

/**
 * Computes Bollinger Bands for the given OHLCV data
 * Formula:
 * - Basis (middle band) = SMA(source, length)
 * - StdDev = standard deviation of the last length values of source (sample standard deviation)
 * - Upper = Basis + (StdDev multiplier * StdDev)
 * - Lower = Basis - (StdDev multiplier * StdDev)
 * - Offset: shifts the three series by offset bars on the chart
 * 
 * @param data OHLCV data array
 * @param options Bollinger Bands configuration options
 * @returns Array of Bollinger Bands results
 */
export function computeBollingerBands(
  data: OHLCV[],
  options: BollingerBandsOptions
): BollingerBandsResult[] {
  const { length, source, stdDevMultiplier, offset } = options;
  
  if (data.length === 0 || length <= 0) {
    return [];
  }
  
  // Extract source values
  const sourceValues = data.map(candle => {
    switch (source) {
      case 'open': return candle.open;
      case 'high': return candle.high;
      case 'low': return candle.low;
      case 'close':
      default: return candle.close;
    }
  });
  
  // Calculate SMA (basis)
  const smaValues = calculateSMA(sourceValues, length);
  
  const results: BollingerBandsResult[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < length - 1 || isNaN(smaValues[i])) {
      results.push({
        timestamp: data[i].timestamp,
        basis: NaN,
        upper: NaN,
        lower: NaN
      });
    } else {
      const basis = smaValues[i];
      const periodValues = sourceValues.slice(i - length + 1, i + 1);
      const stdDev = calculateStandardDeviation(periodValues, length, basis);
      
      const upper = basis + (stdDevMultiplier * stdDev);
      const lower = basis - (stdDevMultiplier * stdDev);
      
      results.push({
        timestamp: data[i].timestamp,
        basis,
        upper,
        lower
      });
    }
  }
  
  // Apply offset if specified
  if (offset !== 0) {
    return applyOffset(results, offset);
  }
  
  return results;
}

/**
 * Applies offset to Bollinger Bands results
 * Positive values shift forward, negative values shift backward
 */
function applyOffset(results: BollingerBandsResult[], offset: number): BollingerBandsResult[] {
  if (offset === 0) return results;
  
  const offsetResults = [...results];
  
  if (offset > 0) {
    // Shift forward: move data to the right
    for (let i = results.length - 1; i >= offset; i--) {
      offsetResults[i] = {
        ...results[i - offset],
        timestamp: results[i].timestamp
      };
    }
    // Fill the beginning with NaN
    for (let i = 0; i < offset; i++) {
      offsetResults[i] = {
        ...offsetResults[i],
        basis: NaN,
        upper: NaN,
        lower: NaN
      };
    }
  } else {
    // Shift backward: move data to the left
    const absOffset = Math.abs(offset);
    for (let i = 0; i < results.length - absOffset; i++) {
      offsetResults[i] = {
        ...results[i + absOffset],
        timestamp: results[i].timestamp
      };
    }
    // Fill the end with NaN
    for (let i = results.length - absOffset; i < results.length; i++) {
      offsetResults[i] = {
        ...offsetResults[i],
        basis: NaN,
        upper: NaN,
        lower: NaN
      };
    }
  }
  
  return offsetResults;
}