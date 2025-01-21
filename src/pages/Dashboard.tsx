import React, { useEffect, useState, useCallback } from "react";
import { ControlPanel } from "../components/ControlPanel";
import { ActivityLogs } from "../components/ActivityLogs";
import { ActiveOffers } from "../components/ActiveOffers";
import { NFTGallery } from "../components/NFTGallery";
import type {
  ActivityLog,
  Settings,
  NFT,
  ActiveOffer,
  Account,
} from "../types";

interface DashboardPageProps {
  settings: Settings;
  accounts: Account[];
  logs: ActivityLog[];
  nfts: NFT[];
  offers: ActiveOffer[];
  onCancelOffer: (id: string) => void;
  onActivityLog: (message: string, type?: ActivityLog["type"]) => void;
}

export function DashboardPage({
  settings,
  accounts = [], // Provide default empty array
  logs = [],
  nfts = [],
  offers = [],
  onCancelOffer,
  onActivityLog,
}: DashboardPageProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationInterval, setSimulationInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  const handleStart = useCallback(async () => {
    try {
      // Check for accounts
      if (!Array.isArray(accounts) || accounts.length === 0) {
        throw new Error(
          "Please add at least one account before starting automation"
        );
      }

      // Start simulation
      setIsRunning(true);
      onActivityLog("Automation started successfully", "success");

      // Simulate bot activity with random messages every 30-60 seconds
      const interval = setInterval(() => {
        const messages = [
          "Scanning top collections for opportunities...",
          "Analyzing market trends...",
          "Monitoring floor prices...",
          "Checking for profitable trades...",
          "Evaluating potential NFT purchases...",
          "Updating market data...",
          "Reviewing active offers...",
        ];
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        onActivityLog(randomMessage, "info");
      }, 30000 + Math.random() * 30000); // Random interval between 30-60 seconds

      setSimulationInterval(interval);
    } catch (error) {
      onActivityLog(`Failed to start automation: ${error.message}`, "error");
    }
  }, [accounts, onActivityLog]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    onActivityLog("Automation stopped", "warning");
  }, [simulationInterval, onActivityLog]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <ControlPanel
            isRunning={isRunning}
            onStart={handleStart}
            onStop={handleStop}
            settings={settings}
          />
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <ActivityLogs logs={logs} />
        </div>

        {/* Network Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Network Status</h2>
          <div className="space-y-2">
            {Object.entries(settings.networks).map(
              ([network, networkSettings]) => (
                <div
                  key={network}
                  className="flex items-center justify-between"
                >
                  <span className="capitalize">{network}</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      networkSettings.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {networkSettings.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Active Offers */}
        <div className="bg-white rounded-lg shadow p-6">
          <ActiveOffers offers={offers} onCancelOffer={onCancelOffer} />
        </div>

        {/* NFT Gallery */}
        <div className="bg-white rounded-lg shadow p-6">
          <NFTGallery nfts={nfts} />
        </div>
      </div>
    </div>
  );
}
