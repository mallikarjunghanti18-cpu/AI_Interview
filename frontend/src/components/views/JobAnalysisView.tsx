import React, { useState } from 'react';
import { JobAnalysisResponse, RoleCategory } from '../../types/interview';

interface JobAnalysisViewProps {
  analysis: JobAnalysisResponse;
  onCreatePlan: () => Promise<void>;
  onBackToEdit: () => void;
  onSwitchRolePreset?: (roleKey: string) => void;
}

export const JobAnalysisView: React.FC<JobAnalysisViewProps> = ({
  analysis,
  onCreatePlan,
  onBackToEdit,
  onSwitchRolePreset
}) => {
  const [pinnedSkills, setPinnedSkills] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const togglePinSkill = (name: string) => {
    setPinnedSkills((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleCreatePlan = async () => {
    setIsSubmitting(true);
    try {
      setShowToast(true);
      await onCreatePlan();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryChipStyle = (cat: RoleCategory) => {
    switch (cat) {
      case 'technical':
        return 'bg-[#dbe1ff] text-[#00174b] border-[#b4c5ff]';
      case 'analytical':
        return 'bg-[#eaddff] text-[#25005a] border-[#d2bbff]';
      case 'frameworks':
        return 'bg-[#e2dfff] text-[#0f0069] border-[#c3c0ff]';
      case 'tools':
      default:
        return 'bg-[#dce9ff] text-[#0b1c30] border-[#c3c6d7]';
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white shadow-xs">
            <span className="material-symbols-outlined text-[15px]">check</span>
          </span>
          <span className="text-[12px] font-medium text-[#737686]">Step 2 of 3</span>
          <span className="text-[#c3c6d7]">•</span>
          <span className="text-[12px] font-semibold text-[#004ac6]">
            AI Analysis Complete
          </span>
        </div>

        {/* Micro API Payload Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#0b1c30] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] font-medium">200 OK • /analyze-jd</span>
        </div>
      </div>

      {/* Role Preset Switcher */}
      {onSwitchRolePreset && (
        <div className="mb-4 bg-[#eff4ff] border border-[#dbe1ff] rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-[#434655] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#6a1edb]">tune</span>
              Dynamic Response Demo
            </span>
            <span className="font-mono text-[10px] text-[#737686]">payload switcher</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => onSwitchRolePreset('junior_system_engineer')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                analysis.job_title === 'Junior System Engineer'
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'bg-white text-[#0b1c30] hover:bg-[#dce9ff] border border-[#c3c6d7]'
              }`}
            >
              Junior System Engineer
            </button>
            <button
              onClick={() => onSwitchRolePreset('clickhouse')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                analysis.job_title.includes('ClickHouse') || analysis.job_title.includes('Optimization')
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'bg-white text-[#0b1c30] hover:bg-[#dce9ff] border border-[#c3c6d7]'
              }`}
            >
              ClickHouse Analyst
            </button>
            <button
              onClick={() => onSwitchRolePreset('data_analyst')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                analysis.job_title === 'Senior Data Analyst'
                  ? 'bg-[#004ac6] text-white shadow-xs'
                  : 'bg-white text-[#0b1c30] hover:bg-[#dce9ff] border border-[#c3c6d7]'
              }`}
            >
              Data Analyst
            </button>
            <button
              onClick={() => onSwitchRolePreset('fullstack')}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap bg-white text-[#0b1c30] hover:bg-[#dce9ff] border border-[#c3c6d7] transition-all cursor-pointer"
            >
              Fullstack Architect
            </button>
            <button
              onClick={() => onSwitchRolePreset('cloud')}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap bg-white text-[#0b1c30] hover:bg-[#dce9ff] border border-[#c3c6d7] transition-all cursor-pointer"
            >
              Cloud Ops
            </button>
          </div>
        </div>
      )}

      {/* Identified Job Role Card */}
      <div className="relative bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-4 overflow-hidden">
        <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-[#4b41e1]/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-medium text-[#737686] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-[#004ac6]">psychology</span>
            Identified Job Role
          </span>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span className="font-mono text-[11px] font-semibold">{analysis.confidence} match</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-[#0b1c30] tracking-tight leading-tight">
            {analysis.job_title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaddff] text-[#25005a] text-[12px] font-medium">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              Detected via Semantic Parser
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#dce9ff] text-[#434655] font-mono text-[11px]">
              {analysis.seniority}
            </span>
          </div>
        </div>

        {/* Live Telemetry Mini-Strip */}
        <div className="mt-4 pt-2.5 flex items-center justify-between bg-[#eff4ff] rounded-lg p-2.5 border border-[#dbe1ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px] text-[#004ac6]">data_object</span>
            <span className="font-mono text-[11px] text-[#434655]">
              Tokens Processed: <span className="text-[#0b1c30] font-semibold">{analysis.tokens_processed}</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 font-medium">
            Latency: {analysis.latency_ms}ms
          </span>
        </div>
      </div>

      {/* Extracted Required Skills */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-semibold text-[#0b1c30]">
              Extracted Required Skills
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#004ac6] font-mono text-[11px] font-semibold">
              {analysis.skills.length}
            </span>
          </div>
          <span className="text-[12px] text-[#737686]">Tap to pin focus</span>
        </div>

        <p className="text-[12px] text-[#434655] mb-3 leading-relaxed">
          Dynamic entities extracted and classified across architectural & domain dimensions.
        </p>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-2">
          {analysis.skills.map((skill) => {
            const isPinned = pinnedSkills[skill.name];
            return (
              <button
                key={skill.name}
                type="button"
                onClick={() => togglePinSkill(skill.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer active:scale-95 ${getCategoryChipStyle(
                  skill.category
                )} ${isPinned ? 'ring-2 ring-[#004ac6] font-bold' : ''}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                <span>{skill.name}</span>
                {isPinned && (
                  <span className="material-symbols-outlined text-[14px]">push_pin</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Skill Category Legend */}
        <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6]" />
            <span className="text-[#434655]">Technical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6a1edb]" />
            <span className="text-[#434655]">Analytical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4b41e1]" />
            <span className="text-[#434655]">Frameworks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span className="text-[#434655]">Tools</span>
          </div>
        </div>
      </div>

      {/* Identified Key Responsibilities */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-semibold text-[#0b1c30]">
            Identified Key Responsibilities
          </h2>
          <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
            checklist
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {analysis.responsibilities.map((resp, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#eff4ff]">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </span>
              <span className="text-[13px] text-[#0b1c30] leading-snug">{resp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Proposed Interview Topics */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[16px] font-semibold text-[#0b1c30]">
              Proposed Interview Topics
            </h2>
            <span className="text-[12px] text-[#737686]">
              Target question distribution plan
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#e2dfff] text-[#0f0069] font-mono text-[11px] font-semibold">
            ~45 mins
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {analysis.topics.map((topic, i) => (
            <div key={i} className="p-3 rounded-lg bg-[#eff4ff] flex flex-col gap-2 border border-[#dbe1ff]/60">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#0b1c30]">{topic.title}</span>
                <span className="font-mono text-[11px] text-[#737686]">{topic.duration}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="w-full bg-[#dce9ff] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#004ac6] h-full rounded-full transition-all duration-500"
                    style={{ width: topic.pct }}
                  />
                </div>
                <span className="font-mono text-[11px] text-[#004ac6] font-semibold shrink-0">
                  {topic.count} Qs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleCreatePlan}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-[15px] shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>{isSubmitting ? 'Generating Plan...' : 'Create Interview Plan'}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <button
          onClick={onBackToEdit}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[#434655] hover:text-[#0b1c30] hover:bg-[#e5eeff] text-[13px] font-medium transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">arrow_back</span>
          <span>Edit Job Description</span>
        </button>

        {showToast && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 mt-1">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">task_alt</span>
            <span className="text-[12px] font-medium">Session scaffold created! Preparing strategy & prep stage...</span>
          </div>
        )}
      </div>
    </div>
  );
};
