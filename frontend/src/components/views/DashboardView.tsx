import React from 'react';
import { BackendConfig } from '../../types/interview';

interface DashboardViewProps {
  onStartNew: () => void;
  onViewHistory: () => void;
  backendConfig: BackendConfig;
  onOpenSettings: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartNew,
  onViewHistory,
  backendConfig,
  onOpenSettings
}) => {
  return (
    <div className="flex flex-col w-full pb-8">
      {/* Workspace Bar */}
      <div className="flex items-center justify-between mb-4 mt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#e5eeff] p-1.5 flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[#004ac6] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              badge
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-[#737686] block uppercase tracking-wider">
              Workspace
            </span>
            <span className="text-[17px] font-semibold text-[#0b1c30]">
              Candidate Suite
            </span>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          title="Click to check or configure FastAPI URL"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 shadow-xs hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-medium">
            FastAPI {backendConfig.baseUrl.replace('http://', '')}
          </span>
        </button>
      </div>

      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#eff4ff] via-[#e5eeff] to-[#dce9ff] p-5 shadow-sm mb-5 border border-[#dbe1ff]">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[#4b41e1]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#004ac6] shadow-xs w-fit">
            <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span className="text-[12px] font-semibold tracking-wide">
              AI-Powered Interview Engine
            </span>
          </div>

          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0b1c30] tracking-tight leading-tight mt-1">
            Practice smarter.<br />Interview better.
          </h1>

          <p className="text-[14px] text-[#434655] leading-relaxed max-w-sm">
            AI-powered interviews personalized to the job you're applying for with real-time semantic scoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
            <button
              onClick={onStartNew}
              className="w-full py-3.5 px-4 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Start New Interview</span>
            </button>

            <button
              onClick={onViewHistory}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#f8f9ff] text-[#0b1c30] font-medium text-[14px] flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all border border-[#c3c6d7]/40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#737686]">
                history_edu
              </span>
              <span>View Interview History</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e5eeff] flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#dbe1ff] flex items-center justify-center text-[#00174b] mb-1.5">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <span className="text-[18px] font-bold text-[#0b1c30] leading-tight">12</span>
          <span className="font-mono text-[11px] text-[#737686] mt-0.5">Completed</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e5eeff] flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#e2dfff] flex items-center justify-center text-[#0f0069] mb-1.5">
            <span className="material-symbols-outlined text-[18px]">analytics</span>
          </div>
          <span className="text-[18px] font-bold text-[#0b1c30] leading-tight">
            8.4<span className="text-[12px] font-normal text-[#737686]">/10</span>
          </span>
          <span className="font-mono text-[11px] text-[#737686] mt-0.5">Avg Score</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-[#e5eeff] flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-[#eaddff] flex items-center justify-center text-[#25005a] mb-1.5">
            <span className="material-symbols-outlined text-[18px]">work</span>
          </div>
          <span className="text-[18px] font-bold text-[#0b1c30] leading-tight">4</span>
          <span className="font-mono text-[11px] text-[#737686] mt-0.5">Practiced</span>
        </div>
      </div>

      {/* Simulation Pipeline Stepper */}
      <section className="bg-white rounded-2xl p-4 shadow-xs border border-[#e5eeff] mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold text-[#0b1c30]">Simulation Pipeline</h2>
          <span className="font-mono text-[11px] text-[#004ac6] font-medium">End-to-End</span>
        </div>

        <div className="overflow-x-auto no-scrollbar -mx-2 px-2 py-1">
          <div className="flex items-center min-w-[480px] justify-between">
            <div className="flex flex-col items-center gap-1.5 text-center flex-1">
              <div className="w-9 h-9 rounded-full bg-[#dbe1ff] text-[#00174b] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[19px]">description</span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">1. Job Spec</span>
              <span className="text-[10px] text-[#737686] leading-none">Role input</span>
            </div>

            <div className="h-0.5 w-5 bg-[#dce9ff] rounded-full" />

            <div className="flex flex-col items-center gap-1.5 text-center flex-1">
              <div className="w-9 h-9 rounded-full bg-[#e2dfff] text-[#0f0069] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[19px]">psychology</span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">2. AI Analysis</span>
              <span className="text-[10px] text-[#737686] leading-none">Persona setup</span>
            </div>

            <div className="h-0.5 w-5 bg-[#dce9ff] rounded-full" />

            <div className="flex flex-col items-center gap-1.5 text-center flex-1">
              <div className="w-9 h-9 rounded-full bg-[#eaddff] text-[#25005a] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[19px]">mic</span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">3. Interview</span>
              <span className="text-[10px] text-[#737686] leading-none">Live interactive</span>
            </div>

            <div className="h-0.5 w-5 bg-[#dce9ff] rounded-full" />

            <div className="flex flex-col items-center gap-1.5 text-center flex-1">
              <div className="w-9 h-9 rounded-full bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[19px]">rate_review</span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">4. Evaluation</span>
              <span className="text-[10px] text-[#737686] leading-none">Instant insights</span>
            </div>

            <div className="h-0.5 w-5 bg-[#dce9ff] rounded-full" />

            <div className="flex flex-col items-center gap-1.5 text-center flex-1">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">5. Report</span>
              <span className="text-[10px] text-[#737686] leading-none">Score & gaps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[16px] font-semibold text-[#0b1c30]">Core Capabilities</h2>
        <span className="text-[12px] text-[#004ac6] font-medium">Engine v3.2</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex gap-3.5 items-start">
          <div className="w-10 h-10 rounded-xl bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]">tune</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#0b1c30]">Personalized Questions</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] font-mono text-[10px] text-[#434655]">
                Dynamic
              </span>
            </div>
            <p className="text-[13px] text-[#434655] mt-1 leading-relaxed">
              Questions are generated dynamically from any job description (Software Engineer, Data Analyst, Cloud Architect, etc.).
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] font-mono text-[11px] text-[#434655]">
                Role Context
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] font-mono text-[11px] text-[#434655]">
                Seniority Matching
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex gap-3.5 items-start">
          <div className="w-10 h-10 rounded-xl bg-[#eaddff] text-[#6a1edb] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]">neurology</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#0b1c30]">AI Evaluation</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] font-mono text-[10px] text-[#434655]">
                Real-Time
              </span>
            </div>
            <p className="text-[13px] text-[#434655] mt-1 leading-relaxed">
              Instant granular feedback, scoring, strengths & missing points after every answer.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[11px] font-medium">
                Strengths
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[11px] font-medium">
                Missing Nuances
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex gap-3.5 items-start">
          <div className="w-10 h-10 rounded-xl bg-[#e2dfff] text-[#4b41e1] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]">insights</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#0b1c30]">Performance Report</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] font-mono text-[10px] text-[#434655]">
                Comprehensive
              </span>
            </div>
            <p className="text-[13px] text-[#434655] mt-1 leading-relaxed">
              Understand strengths, weaknesses, and clear actionable areas to improve before the actual hiring panel.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] font-mono text-[11px] text-[#434655]">
                STAR Framework
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] font-mono text-[11px] text-[#434655]">
                Score Card
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Role CTA */}
      <div
        onClick={onStartNew}
        className="mt-5 p-4 rounded-xl bg-[#eff4ff] border border-[#dbe1ff] flex items-center justify-between shadow-xs cursor-pointer hover:bg-[#e5eeff] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#004ac6] shadow-xs">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#0b1c30] block">
              Targeting a specific role?
            </span>
            <span className="text-[12px] text-[#434655]">
              Paste your JD to customize questions instantly
            </span>
          </div>
        </div>
        <button
          onClick={onStartNew}
          className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] hover:bg-[#cbdbf5] transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
