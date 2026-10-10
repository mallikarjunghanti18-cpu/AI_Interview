import React, { useState } from 'react';
import { InterviewHistoryItem, BackendConfig } from '../../types/interview';

interface HistoryViewProps {
  history: InterviewHistoryItem[];
  backendConfig: BackendConfig;
  onSelectSession: (item: InterviewHistoryItem) => void;
  onStartNew: () => void;
  onRetryConnection: () => Promise<void>;
  onOpenSettings: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  backendConfig,
  onSelectSession,
  onStartNew,
  onRetryConnection,
  onOpenSettings
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'inprogress'>('all');
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const filteredItems = history.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return item.status === 'Completed';
    if (filter === 'inprogress') return item.status === 'In Progress';
    return true;
  });

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetryConnection();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText('python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000');
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-8 gap-4">
      {/* Segmented Filter Controls */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all shadow-xs cursor-pointer ${
            filter === 'all'
              ? 'bg-[#004ac6] text-white'
              : 'bg-[#e5eeff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">folder_special</span>
          <span>All Roles</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-current text-[10px]">
            {history.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
            filter === 'completed'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#e5eeff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">check_circle</span>
          <span>Completed</span>
        </button>

        <button
          onClick={() => setFilter('inprogress')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
            filter === 'inprogress'
              ? 'bg-[#004ac6] text-white shadow-xs'
              : 'bg-[#e5eeff] text-[#434655] hover:bg-[#dce9ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">pending</span>
          <span>In Progress</span>
        </button>
      </div>

      {/* History Summary Badge Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#eff4ff] border border-[#dbe1ff] text-[#0b1c30]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[19px]">auto_graph</span>
          <span className="text-[12px] text-[#434655]">Average Overall Score</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[16px] font-bold text-[#004ac6] tracking-tight">85.3%</span>
          <span className="material-symbols-outlined text-emerald-600 text-[17px]">trending_up</span>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-4 rounded-xl bg-white shadow-xs border border-[#e5eeff] hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center shrink-0 text-[#004ac6]">
                  <span className="material-symbols-outlined text-[22px]">
                    {item.badge_color === 'secondary'
                      ? 'code'
                      : item.badge_color === 'tertiary'
                      ? 'analytics'
                      : 'shield'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-[15px] font-bold text-[#0b1c30] truncate">
                    {item.job_title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[#737686] text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    <span>{item.date_formatted}</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#0b1c30] text-[11px] font-medium flex items-center gap-1 shrink-0 border border-[#dbe1ff]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {item.status}
              </span>
            </div>

            {/* Performance Telemetry Row */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#eff4ff] mb-3 border border-[#dbe1ff]/60">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#737686]">Benchmark Score</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[15px] font-bold text-[#004ac6]">
                    {item.benchmark_score_pct}%
                  </span>
                  <span className="font-mono text-[11px] text-[#737686]">
                    ({item.score_ratio_str})
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#737686]">Question Volume</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[#004ac6] text-[16px]">quiz</span>
                  <span className="text-[13px] font-semibold text-[#0b1c30]">
                    {item.question_volume} Questions
                  </span>
                </div>
              </div>
            </div>

            {/* Insight Pill & Action */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#4b41e1] text-[11px] font-medium border border-[#dbe1ff]">
                <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                <span>{item.badge_text}</span>
              </div>
              <button
                onClick={() => onSelectSession(item)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#dce9ff] text-[#004ac6] hover:bg-[#004ac6] hover:text-white text-[12px] font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <span>View Report</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-[#eff4ff] text-center border border-[#dbe1ff]">
            <div className="w-12 h-12 rounded-full bg-[#dce9ff] flex items-center justify-center mb-2 text-[#004ac6]">
              <span className="material-symbols-outlined text-[24px]">hourglass_empty</span>
            </div>
            <h3 className="text-[15px] font-bold text-[#0b1c30]">No Sessions In Progress</h3>
            <p className="text-[12px] text-[#434655] max-w-xs mt-1 mb-3">
              All your prior mock interviews have concluded and generated comprehensive diagnostic feedback.
            </p>
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-lg bg-white border border-[#c3c6d7] text-[#004ac6] text-[12px] font-semibold"
            >
              Return to All Roles
            </button>
          </div>
        )}
      </div>

      {/* Backend Connection Notice Card (Exact match to Stitch Image 15) */}
      <div className="flex flex-col p-4 rounded-xl bg-red-50 text-red-900 border border-red-200 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 text-white mt-0.5">
            <span className="material-symbols-outlined text-[19px]">bolt</span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-red-950 tracking-tight">
                Backend Connection Notice
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-200/60 font-mono text-[10px] text-red-900 font-semibold">
                {backendConfig.isOnline ? 'HTTP 200' : 'HTTP 503'}
              </span>
            </div>

            <p className="text-[12px] text-red-900 mt-1 leading-relaxed">
              {backendConfig.isOnline
                ? `Connected to live FastAPI backend at ${backendConfig.baseUrl}. All endpoints operational.`
                : `Could not connect to ${backendConfig.baseUrl}. Verify the local FastAPI inference engine is running.`}
            </p>

            {/* Command snippet */}
            <div className="mt-2.5 p-2 rounded-lg bg-white/90 text-[#0b1c30] font-mono text-[11px] flex items-center justify-between border border-red-200 gap-2">
              <code className="select-all truncate">
                uvicorn main:app --reload
              </code>
              <button
                type="button"
                onClick={handleCopySnippet}
                title="Copy launch command"
                className="p-1 rounded hover:bg-gray-100 text-[#434655] transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedSnippet ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            {/* Recovery controls */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-red-800 font-medium">
                <span className={`w-2 h-2 rounded-full ${backendConfig.isOnline ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                <span>
                  {backendConfig.isOnline
                    ? 'Connected to local FastAPI engine'
                    : `Polling ${backendConfig.baseUrl.replace('http://', '')}...`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-red-200 text-red-900 text-[12px] font-medium hover:bg-red-100/50 cursor-pointer"
                >
                  Configure
                </button>

                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-[12px] font-semibold shadow-xs hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[15px] ${isRetrying ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>{isRetrying ? 'Connecting...' : 'Retry Connection'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start New Interview CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#eff4ff] border border-[#dbe1ff] gap-3 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#004ac6] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">video_call</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-[14px] font-bold text-[#0b1c30]">Ready to practice another role?</h3>
            <p className="text-[12px] text-[#434655]">Select from 40+ engineering, product, and leadership tracks.</p>
          </div>
        </div>

        <button
          onClick={onStartNew}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Start New Interview</span>
        </button>
      </div>
    </div>
  );
};
