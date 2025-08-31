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

const Chart: React.FC<ChartProps> = ({ data, bollingerData, settings, showBollinger }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<KLineChart | null>(null);
  const overlayId = useRef<string | null>(null);

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

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
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
      
      chartInstance.current = init(chartRef.current, chartOptions);

      const klineData = formatKLineData();
      chartInstance.current.applyNewData(klineData);
    }

    return () => {
      if (chartInstance.current) {
        dispose(chartInstance.current.getDom());
        chartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      const klineData = formatKLineData();
      chartInstance.current.applyNewData(klineData);
    }
  }, [formatKLineData]);

  const drawBollingerBands = useCallback((ctx: CanvasRenderingContext2D, chart: any) => {
    if (!showBollinger || !bollingerData.length) return;

    const chartSize = chartInstance.current?.getSize();
    if (!chartSize) return;

    const visibleData = bollingerData.filter(item => 
      !isNaN(item.basis) && !isNaN(item.upper) && !isNaN(item.lower)
    );

    if (visibleData.length === 0) return;

    const canvasWidth = chartSize.width;
    const canvasHeight = chartSize.height;
    
    const dataLength = visibleData.length;
    const barWidth = canvasWidth / dataLength;
    
    const allPrices = data.flatMap(d => [d.open, d.high, d.low, d.close]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    
    const chartTop = 50;
    const chartBottom = canvasHeight - 100;
    const chartHeightUsable = chartBottom - chartTop;

    const priceToY = (price: number) => {
      return chartTop + (maxPrice - price) / priceRange * chartHeightUsable;
    };

    if (settings.style.background.visible && settings.style.upper.visible && settings.style.lower.visible) {
      ctx.globalAlpha = settings.style.background.opacity / 100;
      ctx.fillStyle = settings.style.upper.color;
      ctx.beginPath();
      
      visibleData.forEach((item, index) => {
        const x = index * barWidth + barWidth / 2;
        const y = priceToY(item.upper);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      for (let i = visibleData.length - 1; i >= 0; i--) {
        const x = i * barWidth + barWidth / 2;
        const y = priceToY(visibleData[i].lower);
        ctx.lineTo(x, y);
      }
      
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    if (settings.style.basis.visible) {
      ctx.strokeStyle = settings.style.basis.color;
      ctx.lineWidth = settings.style.basis.lineWidth;
      if (settings.style.basis.lineStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      visibleData.forEach((item, index) => {
        const x = index * barWidth + barWidth / 2;
        const y = priceToY(item.basis);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    if (settings.style.upper.visible) {
      ctx.strokeStyle = settings.style.upper.color;
      ctx.lineWidth = settings.style.upper.lineWidth;
      if (settings.style.upper.lineStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      visibleData.forEach((item, index) => {
        const x = index * barWidth + barWidth / 2;
        const y = priceToY(item.upper);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    if (settings.style.lower.visible) {
      ctx.strokeStyle = settings.style.lower.color;
      ctx.lineWidth = settings.style.lower.lineWidth;
      if (settings.style.lower.lineStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      visibleData.forEach((item, index) => {
        const x = index * barWidth + barWidth / 2;
        const y = priceToY(item.lower);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }, [showBollinger, bollingerData, settings, data]);

  useEffect(() => {
    if (!chartInstance.current || !chartRef.current) return;

    if (overlayId.current) {
      chartInstance.current.removeOverlay();
      overlayId.current = null;
    }

    if (showBollinger && bollingerData.length > 0) {
      const overlayCanvas = document.createElement('canvas');
      const chartContainer = chartRef.current;
      const chartSize = chartInstance.current.getSize();
      
      overlayCanvas.width = chartSize.width;
      overlayCanvas.height = chartSize.height;
      overlayCanvas.style.position = 'absolute';
      overlayCanvas.style.top = '0';
      overlayCanvas.style.left = '0';
      overlayCanvas.style.pointerEvents = 'none';
      overlayCanvas.style.zIndex = '10';
      
      const ctx = overlayCanvas.getContext('2d');
      if (ctx) {
        drawBollingerBands(ctx, chartInstance.current);
        chartContainer.appendChild(overlayCanvas);
        overlayId.current = 'bollinger-overlay';
      }

      return () => {
        if (overlayCanvas.parentNode) {
          overlayCanvas.parentNode.removeChild(overlayCanvas);
        }
      };
    }
  }, [showBollinger, bollingerData, settings, drawBollingerBands]);

  return (
    <div className="w-full h-full bg-gray-900 relative">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default Chart;