'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { init, dispose, KLineChart, ChartOptions } from 'klinecharts';
import { OHLCV, BollingerBandsResult, BollingerBandsSettings } from '../lib/types';

interface ChartProps {
  data: OHLCV[];
  bollingerData: BollingerBandsResult[];
  settings: BollingerBandsSettings;
  showBollinger: boolean;
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<KLineChart | null>(null);
  const isInitialized = useRef<boolean>(false);

  const formatKLineData = useCallback(() => {
    return data.map(candle => ({
      timestamp: candle.timestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume
    }));
  }, [data]);

  // Initialize chart only once
  useEffect(() => {
    const chartContainer = chartRef.current;
    if (!chartContainer || isInitialized.current) return;

    console.log('Initializing chart');
    
    // Clear any existing content
    chartContainer.innerHTML = '';

    const chartOptions: ChartOptions = {
      styles: {
        grid: {
          horizontal: {
            color: '#393939',
          },
          vertical: {
            color: '#393939',
          }
        },
        candle: {
          priceMark: {
            high: {
              color: '#26a69a',
            },
            low: {
              color: '#ef5350',
            }
          },
          tooltip: {
            showRule: 'always',
            showType: 'standard',
            custom: [
              { title: 'Time', value: '{time}' },
              { title: 'Open', value: '{open}' },
              { title: 'High', value: '{high}' },
              { title: 'Low', value: '{low}' },
              { title: 'Close', value: '{close}' },
              { title: 'Volume', value: '{volume}' }
            ]
          }
        },
        xAxis: {
          axisLine: {
            color: '#888888'
          }
        },
        yAxis: {
          axisLine: {
            color: '#888888'
          }
        }
      }
    };
    
    try {
      chartInstance.current = init(chartContainer, chartOptions);
      isInitialized.current = true;
      
      if (data.length > 0) {
        const klineData = formatKLineData();
        chartInstance.current.applyNewData(klineData);
      }
      
      console.log('Chart initialized successfully');
    } catch (error) {
      console.error('Chart initialization error:', error);
    }
  }, []); // Empty dependency array is correct here - we only want to initialize once

  // Update chart data when data changes
  useEffect(() => {
    if (!chartInstance.current || !isInitialized.current || data.length === 0) return;
    
    console.log('Updating chart data');
    try {
      const klineData = formatKLineData();
      chartInstance.current.applyNewData(klineData);
    } catch (error) {
      console.error('Chart update error:', error);
    }
  }, [data, formatKLineData]);

  // Cleanup on unmount only
  useEffect(() => {
    const chartContainer = chartRef.current;
    
    return () => {
      console.log('Component unmounting - cleaning up');
      if (chartInstance.current) {
        try {
          dispose(chartInstance.current.getDom());
        } catch (error) {
          console.error('Cleanup error:', error);
        } finally {
          chartInstance.current = null;
          isInitialized.current = false;
        }
      }
      if (chartContainer) {
        chartContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-900 relative">
      <div ref={chartRef} className="w-full h-full" />
      {/* Debug info */}
    </div>
  );
};

export default Chart;