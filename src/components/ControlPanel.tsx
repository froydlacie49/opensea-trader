import React, { useState, useEffect } from 'react';
import { Play, Square, Timer } from 'lucide-react';
import { ActiveNetworks } from './ActiveNetworks';
import type { Settings } from '../types';

interface ControlPanelProps {
  onStart: () => void;
  onStop: () => void;
  isRunning: boolean;
  settings: Settings;
}

export function ControlPanel({ onStart, onStop, isRunning, settings }: ControlPanelProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning) {
      // Set start time when automation starts
      if (!startTime) {
        setStartTime(Date.now());
      }

      // Update elapsed time every second
      intervalId = setInterval(() => {
        if (startTime) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
    } else {
      // Reset timer when stopped
      setStartTime(null);
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, startTime]);

  // Format elapsed time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number): string => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Control Panel</h2>
        <div className="flex items-center space-x-2">
          <Timer className="w-5 h-5 text-gray-500" />
          <span className="text-lg font-mono">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onStart}
          disabled={isRunning}
          className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2
            ${isRunning 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          <Play className="w-5 h-5" />
          <span>Start</span>
        </button>
        <button
          onClick={onStop}
          disabled={!isRunning}
          className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2
            ${!isRunning 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-red-600 text-white hover:bg-red-700'}`}
        >
          <Square className="w-5 h-5" />
          <span>Stop</span>
        </button>
      </div>

      {isRunning && (
        <div className="mt-4 flex items-center justify-center">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="ml-3 text-sm text-green-600 font-medium">Running</span>
        </div>
      )}

      <ActiveNetworks settings={settings} />
    </div>
  );
}