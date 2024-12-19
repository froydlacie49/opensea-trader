import React from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { ActivityLogs } from '../components/ActivityLogs';
import { ActiveOffers } from '../components/ActiveOffers';
import { NFTGallery } from '../components/NFTGallery';
import type { ActivityLog, Settings, NFT, ActiveOffer } from '../types';

interface DashboardPageProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  logs: ActivityLog[];
  settings: Settings;
  nfts: NFT[];
  offers: ActiveOffer[];
  onCancelOffer: (id: string) => void;
}

export function DashboardPage({
  isRunning,
  onStart,
  onStop,
  logs,
  settings,
  nfts,
  offers,
  onCancelOffer
}: DashboardPageProps) {
  return (
    <div className="space-y-8">
      <ControlPanel
        isRunning={isRunning}
        onStart={onStart}
        onStop={onStop}
        settings={settings}
      />
      <ActiveOffers offers={offers} onCancelOffer={onCancelOffer} />
      <ActivityLogs logs={logs} />
      <NFTGallery nfts={nfts} />
    </div>
  );
}