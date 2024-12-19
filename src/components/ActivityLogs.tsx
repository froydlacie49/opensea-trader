import React from 'react';
import { ActivityLog } from '../types';

interface ActivityLogsProps {
  logs: ActivityLog[];
}

export function ActivityLogs({ logs }: ActivityLogsProps) {
  const getLogColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
      </div>
      <div className="p-4 max-h-[400px] overflow-y-auto">
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3">
              <span className="text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={`text-sm ${getLogColor(log.type)}`}>
                {log.message}
              </span>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-gray-500">No activity logs yet</p>
          )}
        </div>
      </div>
    </div>
  );
}