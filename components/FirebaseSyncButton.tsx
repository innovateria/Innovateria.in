'use client';

import { useState } from 'react';
import { Cloud, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { syncAllCMSDataToFirestore } from '@/lib/firebase';

interface FirebaseSyncButtonProps {
  variant?: 'compact' | 'card';
  onSyncComplete?: (results: any) => void;
}

export default function FirebaseSyncButton({
  variant = 'compact',
  onSyncComplete
}: FirebaseSyncButtonProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncStatus('idle');
    setStatusMessage('Fetching CMS data...');

    try {
      // 1. Fetch CMS data from API
      const res = await fetch('/api/admin/firebase-sync');
      if (!res.ok) {
        throw new Error('Failed to fetch CMS data for sync');
      }

      const data = await res.json();
      if (!data.success || !data.cmsData) {
        throw new Error(data.error || 'No CMS data received');
      }

      setStatusMessage('Syncing collections to Firestore...');

      // 2. Write to Firestore collections
      const syncResult = await syncAllCMSDataToFirestore(data.cmsData);

      const totalCollections = Object.keys(syncResult.results).length;
      const totalDocs = Object.values(syncResult.results).reduce((a: number, b: number) => a + b, 0);

      setSyncStatus('success');
      setStatusMessage(`Synced ${totalCollections} collections (${totalDocs} documents) to Firebase!`);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSynced(nowStr);

      if (onSyncComplete) {
        onSyncComplete(syncResult);
      }

      setTimeout(() => {
        setSyncStatus('idle');
        setStatusMessage('');
      }, 4000);
    } catch (err: any) {
      console.error('Firebase sync error:', err);
      setSyncStatus('error');
      setStatusMessage(err.message || 'Firebase sync failed. Check console for details.');
      setTimeout(() => {
        setSyncStatus('idle');
        setStatusMessage('');
      }, 5000);
    } finally {
      setSyncing(false);
    }
  };

  if (variant === 'card') {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Cloud className="text-brand-500" size={18} />
              <span>Firebase Firestore Cloud Database Sync</span>
            </h3>
            <p className="text-xs text-gray-400">
              Synchronize all Admin CMS collections (Services, Projects, Team, Leads, Clients, Settings, Users) directly to Firebase Firestore.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="shrink-0 flex items-center space-x-2 bg-gradient-brand text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all disabled:opacity-50 cursor-pointer"
          >
            {syncing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Syncing Data...</span>
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                <span>Sync All to Firebase</span>
              </>
            )}
          </button>
        </div>

        {/* Status Feedback */}
        {syncStatus === 'success' && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {syncStatus === 'error' && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-400 text-xs">
            <AlertCircle size={18} className="shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
          <span>Target Database: <strong className="text-gray-200">innovateria (Firestore)</strong></span>
          {lastSynced && (
            <span>Last Synced: <strong className="text-brand-400">{lastSynced}</strong></span>
          )}
        </div>
      </div>
    );
  }

  // Compact Header Variant
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={handleSync}
        disabled={syncing}
        className={`glass-card px-3.5 py-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50 ${
          syncStatus === 'success'
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            : syncStatus === 'error'
            ? 'border-red-500/50 bg-red-500/10 text-red-400'
            : 'border-brand-500/30 hover:border-brand-500/60 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 hover:text-brand-300'
        }`}
        title="Sync All CMS Data to Firebase Firestore"
      >
        {syncing ? (
          <>
            <Loader2 size={13} className="animate-spin text-brand-500" />
            <span>Syncing...</span>
          </>
        ) : syncStatus === 'success' ? (
          <>
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>Synced!</span>
          </>
        ) : (
          <>
            <Cloud size={13} className="text-brand-500" />
            <span>Sync to Firebase</span>
          </>
        )}
      </button>
    </div>
  );
}
