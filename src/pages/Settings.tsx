import React from 'react';
import { NetworkSettings } from '../components/NetworkSettings';
import type { Settings } from '../types';

interface SettingsPageProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsPage({ settings, onSettingsChange }: SettingsPageProps) {
  return (
    <div className="space-y-8">
      <NetworkSettings
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
}