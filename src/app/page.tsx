'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import Chart from '../app/components/Chart';
import BollingerSettings from '../app/components/BollingerSettings';
import { computeBollingerBands } from './lib/indicators/bollinger';
import { OHLCV, BollingerBandsSettings, BollingerBandsResult } from '../app/lib/types';

export default function Home() {
  const [ohlcvData, setOhlcvData] = useState<OHLCV[]>([]);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [bollingerSettings, setBollingerSettings] = useState<BollingerBandsSettings>({
    inputs: {
      length: 20,
      maType: 'SMA',
      source: 'close',
      stdDevMultiplier: 2,
      offset: 0
    },
    style: {
      basis: {
        visible: true,
        color: '#FF6B35',
        lineWidth: 1,
        lineStyle: 'solid'
      },
      upper: {
        visible: true,
        color: '#4ECDC4',
        lineWidth: 1,
        lineStyle: 'solid'
      },
      lower: {
        visible: true,
        color: '#4ECDC4',
        lineWidth: 1,
        lineStyle: 'solid'
      },
      background: {
        visible: true,
        opacity: 10
      }
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ohlcv.json');
        const data = await response.json();
        setOhlcvData(data);
      } catch (error) {
        console.error('Error loading OHLCV data:', error);
        generateFallbackData();
      }
    };

    loadData();
  }, []);

  const generateFallbackData = () => {
    const data: OHLCV[] = [];
    const basePrice = 50000;
    const startTime = Date.now() - (200 * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < 200; i++) {
      const timestamp = startTime + (i * 24 * 60 * 60 * 1000);
      const volatility = 0.02;
      const trend = Math.sin(i / 20) * 0.001;
      
      const prevClose = i === 0 ? basePrice : data[i - 1].close;
      const change = (Math.random() - 0.5) * volatility + trend;
      
      const open = prevClose * (1 + (Math.random() - 0.5) * 0.005);
      const close = prevClose * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = 1000 + Math.random() * 2000;
      
      data.push({
        timestamp,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: parseFloat(volume.toFixed(2))
      });
    }
    
    setOhlcvData(data);
  };

  const bollingerData: BollingerBandsResult[] = useMemo(() => {
    if (ohlcvData.length === 0) return [];
    return computeBollingerBands(ohlcvData, bollingerSettings.inputs);
  }, [ohlcvData, bollingerSettings.inputs]);

  const handleAddBollinger = () => {
    setShowBollinger(true);
    setSettingsOpen(true);
  };

  const handleSettingsChange = (newSettings: BollingerBandsSettings) => {
    setBollingerSettings(newSettings);
  };

  const handleRemoveBollinger = () => {
    setShowBollinger(false);
    setSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-400" size={24} />
            <h1 className="text-xl font-bold">FindScan - Bollinger Bands Demo</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              KLineCharts v9.8.9 | {ohlcvData.length} candles
            </div>
            
            {!showBollinger && (
              <button
                onClick={handleAddBollinger}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-medium"
              >
                <Plus size={16} />
                Add Bollinger Bands
              </button>
            )}
            
            {showBollinger && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors font-medium"
                >
                  Settings
                </button>
                <button
                  onClick={handleRemoveBollinger}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors font-medium"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-80px)]">
        {ohlcvData.length > 0 ? (
          <Chart
            data={ohlcvData}
            bollingerData={bollingerData}
            settings={bollingerSettings}
            showBollinger={showBollinger}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading chart data...</p>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <BollingerSettings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={bollingerSettings}
        onSettingsChange={handleSettingsChange}
      />

      {/* Status Bar */}
      {showBollinger && bollingerData.length > 0 && (
        <div className="fixed bottom-4 left-4 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
          <div className="text-sm">
            <span className="text-gray-400">Bollinger Bands:</span>
            <span className="text-blue-400 ml-2">
              Length: {bollingerSettings.inputs.length}
            </span>
            <span className="text-green-400 ml-2">
              StdDev: {bollingerSettings.inputs.stdDevMultiplier}
            </span>
            <span className="text-yellow-400 ml-2">
              Offset: {bollingerSettings.inputs.offset}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}