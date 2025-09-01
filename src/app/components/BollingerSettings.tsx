'use client';

import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { BollingerBandsSettings } from '../lib/types';

interface BollingerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BollingerBandsSettings;
  onSettingsChange: (settings: BollingerBandsSettings) => void;
}

const BollingerSettings: React.FC<BollingerSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}) => {
  const [activeTab, setActiveTab] = useState<'inputs' | 'style'>('inputs');

  const handleInputChange = (key: keyof BollingerBandsSettings['inputs'], value: number | string) => {
    const newSettings = {
      ...settings,
      inputs: {
        ...settings.inputs,
        [key]: value
      }
    };
    onSettingsChange(newSettings);
  };

  const handleStyleChange = (
    section: keyof BollingerBandsSettings['style'], 
    key: string, 
    value: number | string | boolean
  ) => {
    const newSettings = {
      ...settings,
      style: {
        ...settings.style,
        [section]: {
          ...settings.style[section],
          [key]: value
        }
      }
    };
    onSettingsChange(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-3/6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Bollinger Bands Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'inputs'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('inputs')}
          >
            Inputs
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'style'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                : 'text-gray-300 hover:text-white'
            }`}
            onClick={() => setActiveTab('style')}
          >
            Style
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'inputs' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Length
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.inputs.length}
                  onChange={(e) => handleInputChange('length', parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Basic MA Type
                </label>
                <select
                  value={settings.inputs.maType}
                  onChange={(e) => handleInputChange('maType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SMA">SMA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Source
                </label>
                <select
                  value={settings.inputs.source}
                  onChange={(e) => handleInputChange('source', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="close">Close</option>
                  <option value="open">Open</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  StdDev (multiplier)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={settings.inputs.stdDevMultiplier}
                  onChange={(e) => handleInputChange('stdDevMultiplier', parseFloat(e.target.value) || 2)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Offset
                </label>
                <input
                  type="number"
                  min="-50"
                  max="50"
                  value={settings.inputs.offset}
                  onChange={(e) => handleInputChange('offset', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-6">
              {/* Basis (Middle Band) */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Basic (Middle Band)</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.style.basis.visible}
                      onChange={(e) => handleStyleChange('basis', 'visible', e.target.checked)}
                      className="mr-2 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Color</label>
                      <input
                        type="color"
                        value={settings.style.basis.color}
                        onChange={(e) => handleStyleChange('basis', 'color', e.target.value)}
                        className="w-full h-8 rounded border border-gray-600 bg-gray-700"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Line Width</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={settings.style.basis.lineWidth}
                        onChange={(e) => handleStyleChange('basis', 'lineWidth', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Line Style</label>
                    <select
                      value={settings.style.basis.lineStyle}
                      onChange={(e) => handleStyleChange('basis', 'lineStyle', e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Upper Band */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Upper Band</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.style.upper.visible}
                      onChange={(e) => handleStyleChange('upper', 'visible', e.target.checked)}
                      className="mr-2 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Color</label>
                      <input
                        type="color"
                        value={settings.style.upper.color}
                        onChange={(e) => handleStyleChange('upper', 'color', e.target.value)}
                        className="w-full h-8 rounded border border-gray-600 bg-gray-700"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Line Width</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={settings.style.upper.lineWidth}
                        onChange={(e) => handleStyleChange('upper', 'lineWidth', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Line Style</label>
                    <select
                      value={settings.style.upper.lineStyle}
                      onChange={(e) => handleStyleChange('upper', 'lineStyle', e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Lower Band */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Lower Band</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.style.lower.visible}
                      onChange={(e) => handleStyleChange('lower', 'visible', e.target.checked)}
                      className="mr-2 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Color</label>
                      <input
                        type="color"
                        value={settings.style.lower.color}
                        onChange={(e) => handleStyleChange('lower', 'color', e.target.value)}
                        className="w-full h-8 rounded border border-gray-600 bg-gray-700"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 mb-1">Line Width</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={settings.style.lower.lineWidth}
                        onChange={(e) => handleStyleChange('lower', 'lineWidth', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Line Style</label>
                    <select
                      value={settings.style.lower.lineStyle}
                      onChange={(e) => handleStyleChange('lower', 'lineStyle', e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Background Fill */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Background Fill</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.style.background.visible}
                      onChange={(e) => handleStyleChange('background', 'visible', e.target.checked)}
                      className="mr-2 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Visible</span>
                  </label>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Opacity (%)</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={settings.style.background.opacity}
                      onChange={(e) => handleStyleChange('background', 'opacity', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-400 text-center">
                      {settings.style.background.opacity}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default BollingerSettings;