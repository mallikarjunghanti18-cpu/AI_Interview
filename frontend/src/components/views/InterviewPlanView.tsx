import React, { useState } from 'react';
import { InterviewPlanResponse } from '../../types/interview';

interface InterviewPlanViewProps {
  plan: InterviewPlanResponse;
  onBeginInterview: () => Promise<void>;
  onBackToAnalysis: () => void;
}


export const InterviewPlanView: React.FC<InterviewPlanViewProps> = ({
  plan,
  onBeginInterview
}) => {
  const safePlan = {
    ...plan,
    modules: {
      technical: 4,
      technical_weight: 40,
      scenario: 4,
      scenario_weight: 40,
      behavioral: 2,
      behavioral_weight: 20,
      ...(plan?.modules ?? {})
    },
    difficulty_distribution: {
      adaptive_level: 'Medium',
      easy_pct: 30,
      medium_pct: 50,
      hard_pct: 20,
      ...(plan?.difficulty_distribution ?? {})
    },
    topics_matrix: plan?.topics_matrix ?? [],
    rules: plan?.rules ?? []
  };

  plan = safePlan;

  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [enableSandbox, setEnableSandbox] = useState<boolean>(true);
  const [enableArchitectureCanvas, setEnableArchitectureCanvas] = useState<boolean>(true);
  const [enableFollowUps, setEnableFollowUps] = useState<boolean>(true);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await onBeginInterview();
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Step Tracker Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-pulse" />
          <span className="text-[12px] font-semibold text-[#004ac6] tracking-wide uppercase">
            Step 3 of 3 • Strategy & Prep
          </span>
        </div>
        <span className="font-mono text-[11px] bg-[#dce9ff] px-2 py-0.5 rounded-full text-[#434655] flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-[#6a1edb]">tune</span>
          Custom AI Curated
        </span>
      </div>

      {/* Plan Overview Hero Banner */}
      <div className="relative w-full rounded-xl bg-white shadow-xs border border-[#e5eeff] p-4 mb-4 overflow-hidden">
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-[#004ac6]/10 via-[#6a1edb]/10 to-transparent rounded-full pointer-events-none blur-xl" />
        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] text-[#737686] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#004ac6]">psychology</span>
              Generated Blueprint
            </span>
            <h1 className="text-[22px] font-bold text-[#0b1c30] tracking-tight mt-0.5 truncate">
              {plan.blueprint_title}
            </h1>
            <p className="text-[12px] text-[#434655] mt-1 leading-relaxed">
              {plan.description}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#dbe1ff] flex items-center justify-center shrink-0 shadow-xs text-[#004ac6]">
            <span className="material-symbols-outlined text-[24px]">terminal</span>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-2 bg-[#eff4ff] p-2.5 rounded-lg border border-[#dbe1ff]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[#004ac6] text-[16px]">quiz</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] text-[#0b1c30] font-semibold">
                {plan.total_questions} Questions
              </span>
              <span className="font-mono text-[10px] text-[#737686]">Structured pool</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[#4b41e1] text-[16px]">schedule</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] text-[#0b1c30] font-semibold">
                {plan.estimated_duration}
              </span>
              <span className="font-mono text-[10px] text-[#737686]">Recommended pace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Composition */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[14px] font-semibold text-[#0b1c30]">Assessment Composition</span>
          <span className="font-mono text-[11px] text-[#004ac6] font-medium">3 Modules</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Technical */}
          <div className="flex flex-col bg-white rounded-xl p-3 shadow-xs border border-[#e5eeff] relative overflow-hidden">
            <div className="w-full h-1 bg-[#004ac6] rounded-full mb-2" />
            <div className="flex items-center justify-between mb-1">
              <span className="material-symbols-outlined text-[#004ac6] text-[18px]">code_blocks</span>
              <span className="text-[18px] font-bold text-[#0b1c30]">
                {plan.modules.technical}
              </span>
            </div>
            <span className="text-[12px] font-medium text-[#0b1c30] truncate">Technical</span>
            <span className="font-mono text-[10px] text-[#737686] mt-0.5">
              {plan.modules.technical_weight}% weight
            </span>
          </div>

          {/* Scenario */}
          <div className="flex flex-col bg-white rounded-xl p-3 shadow-xs border border-[#e5eeff] relative overflow-hidden">
            <div className="w-full h-1 bg-[#4b41e1] rounded-full mb-2" />
            <div className="flex items-center justify-between mb-1">
              <span className="material-symbols-outlined text-[#4b41e1] text-[18px]">alt_route</span>
              <span className="text-[18px] font-bold text-[#0b1c30]">
                {plan.modules.scenario}
              </span>
            </div>
            <span className="text-[12px] font-medium text-[#0b1c30] truncate">Scenario</span>
            <span className="font-mono text-[10px] text-[#737686] mt-0.5">
              {plan.modules.scenario_weight}% weight
            </span>
          </div>

          {/* Behavioral */}
          <div className="flex flex-col bg-white rounded-xl p-3 shadow-xs border border-[#e5eeff] relative overflow-hidden">
            <div className="w-full h-1 bg-[#6a1edb] rounded-full mb-2" />
            <div className="flex items-center justify-between mb-1">
              <span className="material-symbols-outlined text-[#6a1edb] text-[18px]">groups</span>
              <span className="text-[18px] font-bold text-[#0b1c30]">
                {plan.modules.behavioral}
              </span>
            </div>
            <span className="text-[12px] font-medium text-[#0b1c30] truncate">Behavioral</span>
            <span className="font-mono text-[10px] text-[#737686] mt-0.5">
              {plan.modules.behavioral_weight}% weight
            </span>
          </div>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[14px] font-semibold text-[#0b1c30]">
            Difficulty Calibration
          </span>
          <span className="font-mono text-[11px] text-[#434655] bg-[#eff4ff] px-2 py-0.5 rounded-full">
            {plan.difficulty_distribution.adaptive_level}
          </span>
        </div>

        {/* Segmented bar */}
        <div className="w-full h-3 rounded-full bg-[#dce9ff] overflow-hidden flex p-0.5 gap-0.5">
          <div
            className="h-full bg-emerald-500 rounded-l-full"
            style={{ width: `${plan.difficulty_distribution.easy_pct}%` }}
            title="Easy"
          />
          <div
            className="h-full bg-amber-500"
            style={{ width: `${plan.difficulty_distribution.medium_pct}%` }}
            title="Medium"
          />
          <div
            className="h-full bg-red-600 rounded-r-full"
            style={{ width: `${plan.difficulty_distribution.hard_pct}%` }}
            title="Hard"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-2.5 px-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#0b1c30] font-medium">Easy</span>
            <span className="font-mono text-[#737686]">{plan.difficulty_distribution.easy_pct}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[#0b1c30] font-medium">Medium</span>
            <span className="font-mono text-[#737686]">{plan.difficulty_distribution.medium_pct}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-[#0b1c30] font-medium">Hard</span>
            <span className="font-mono text-[#737686]">{plan.difficulty_distribution.hard_pct}%</span>
          </div>
        </div>
      </div>

      {/* Topics Covered Matrix */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[18px]">hub</span>
            <span className="text-[14px] font-semibold text-[#0b1c30]">Topics Covered Matrix</span>
          </div>
          <span className="font-mono text-[11px] text-[#737686]">
            {plan.topics_matrix.length} Key Domains
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {plan.topics_matrix.map((topic, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 bg-[#eff4ff] rounded-lg hover:bg-[#e5eeff] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">{topic.iconName}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-medium text-[#0b1c30] truncate">
                    {topic.title}
                  </span>
                  <span className="font-mono text-[11px] text-[#737686] truncate">
                    {topic.subtopics}
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] bg-white text-[#004ac6] px-2 py-0.5 rounded-full shrink-0 shadow-xs font-semibold">
                {topic.questionCount} Qs
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules of Engagement */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
            <span className="text-[14px] font-semibold text-[#0b1c30]">Rules of Engagement</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Interactive AI
          </span>
        </div>

        <div className="flex flex-col gap-2.5 text-[12px] text-[#0b1c30]">
          {plan.rules.map((rule, idx) => {
            const parts = rule.split(':');
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#dbe1ff] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-mono text-[11px] text-[#004ac6] font-bold">
                    {idx + 1}
                  </span>
                </div>
                <p className="leading-snug">
                  <strong className="font-semibold text-[#0b1c30]">{parts[0]}:</strong>
                  {parts[1] || ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-2.5 w-full">
        <button
          onClick={handleStart}
          disabled={isStarting}
          className="w-full h-12 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px]">rocket_launch</span>
          <span>{isStarting ? 'Initializing Session...' : 'Begin Live Interview'}</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full h-11 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] font-medium text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-[#737686]">tune</span>
          <span>Adjust Plan Parameters</span>
        </button>
      </div>

      {/* API Footer */}
      <div className="flex items-center justify-center gap-2 mt-4 text-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="font-mono text-[11px] text-[#737686]">
          Endpoints: <code className="text-[#0b1c30]">/create-interview-plan</code> • Session State Ready
        </span>
      </div>

      {/* Adjustment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b1c30]/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl border border-[#e5eeff] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[16px] font-bold text-[#0b1c30]">Fine-tune Session</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#737686] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-[12px] text-[#434655] mb-4">
              Modify technical weighting before session activation starts.
            </p>

            <div className="flex flex-col gap-2.5 mb-5">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#eff4ff] cursor-pointer">
                <span className="text-[12px] text-[#0b1c30]">Live Code Execution Sandbox</span>
                <input
                  type="checkbox"
                  checked={enableSandbox}
                  onChange={(e) => setEnableSandbox(e.target.checked)}
                  className="w-4 h-4 rounded text-[#004ac6] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#eff4ff] cursor-pointer">
                <span className="text-[12px] text-[#0b1c30]">System Architecture Canvas</span>
                <input
                  type="checkbox"
                  checked={enableArchitectureCanvas}
                  onChange={(e) => setEnableArchitectureCanvas(e.target.checked)}
                  className="w-4 h-4 rounded text-[#004ac6] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#eff4ff] cursor-pointer">
                <span className="text-[12px] text-[#0b1c30]">Aggressive Follow-up Probing</span>
                <input
                  type="checkbox"
                  checked={enableFollowUps}
                  onChange={(e) => setEnableFollowUps(e.target.checked)}
                  className="w-4 h-4 rounded text-[#004ac6] focus:ring-0"
                />
              </label>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full h-11 bg-[#004ac6] text-white rounded-xl font-semibold text-[13px] hover:bg-[#003ea8] transition-colors cursor-pointer"
            >
              Update Plan & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
