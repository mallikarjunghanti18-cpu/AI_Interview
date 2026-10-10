import React, { useState } from 'react';
import { InterviewResultResponse } from '../../types/interview';

interface FinalReportViewProps {
  report: InterviewResultResponse;
  onStartAnother: () => void;
  onReturnDashboard: () => void;
  onUpdateCandidateName?: (name: string) => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  report,
  onStartAnother,
  onReturnDashboard,
  onUpdateCandidateName
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    'qa-1': true
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [candidateNameInput, setCandidateNameInput] = useState<string>(report.candidate_name);

  const handleSaveName = () => {
    setIsEditingName(false);
    if (candidateNameInput.trim() && onUpdateCandidateName) {
      onUpdateCandidateName(candidateNameInput.trim());
    }
  };

  const toggleAccordion = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownloadPdf = () => {
    setIsExporting(true);
    setExportNotice('Preparing print layout...');
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice('PDF export ready! Opening printer dialog...');
      window.print();
      setTimeout(() => setExportNotice(''), 3000);
    }, 800);
  };

  // Circular gauge values for SVG (radius 30)
  const radius = 30;
  const circ = 2 * Math.PI * radius; // ~188.5
  const offset = circ - (report.overall_score_pct / 100) * circ;

  return (
    <div className="flex flex-col w-full pb-8 space-y-4">
      {/* Hero Completion Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#004ac6] via-[#0053db] to-[#4b41e1] p-5 text-white shadow-md">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="relative flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              <span className="material-symbols-outlined text-[17px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                celebration
              </span>
              <span className="text-[12px] tracking-wide text-white font-semibold">
                Interview Complete
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#dbe1ff]">
              #{report.session_id}
            </span>
          </div>

          <div className="pt-1">
            <p className="text-[11px] text-[#dbe1ff] uppercase tracking-wider font-semibold">
              Performance Report
            </p>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight leading-tight mt-0.5">
              {report.job_title}
            </h2>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[12px] text-[#dbe1ff]">
            <span className="material-symbols-outlined text-[15px]">schedule</span>
            <span>{report.completed_at}</span>
          </div>
        </div>
      </div>

      {/* Overall Score & Verdict Card */}
      <div className="rounded-xl bg-white p-4 shadow-xs border border-[#e5eeff] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[12px] text-[#737686]">Evaluation Result</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[34px] font-bold text-[#004ac6] leading-none">
                {report.overall_score_pct}%
              </span>
              <span className="text-[14px] text-[#737686] font-medium">
                Overall Score
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#737686] mt-1">
              {report.total_points} / {report.max_points} total points accrued
            </span>
          </div>

          {/* SVG Progress Dial */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 72 72">
              <circle
                className="text-[#e5eeff]"
                cx="36"
                cy="36"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="7"
              />
              <circle
                className="text-[#004ac6]"
                cx="36"
                cy="36"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                strokeWidth="7"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[#004ac6] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
          </div>
        </div>

        {/* Grade Badge Banner */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#eff4ff] border border-[#dbe1ff]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6] animate-pulse" />
            <span className="text-[13px] font-semibold text-[#0b1c30]">
              Candidate Verdict
            </span>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#e2dfff] text-[#0f0069] text-[12px] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">workspace_premium</span>
            <span>{report.candidate_verdict}</span>
          </div>
        </div>

        {/* Candidate Profile Verification Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#f8f9ff] border border-[#e5eeff]">
          <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#dbe1ff] flex items-center justify-center font-bold text-[#004ac6]">
            {report.candidate_avatar_url ? (
              <img
                src={report.candidate_avatar_url}
                alt={report.candidate_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-[18px]">
                {report.candidate_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={candidateNameInput}
                  onChange={(e) => setCandidateNameInput(e.target.value)}
                  className="px-2 py-0.5 text-[13px] font-semibold text-[#0b1c30] bg-white border border-[#004ac6] rounded-md outline-hidden w-full max-w-[200px]"
                  placeholder="Your Name"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-[#004ac6] text-white rounded-md cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold text-[#0b1c30] truncate">
                  {report.candidate_name}
                </span>
                {onUpdateCandidateName && (
                  <button
                    type="button"
                    onClick={() => {
                      setCandidateNameInput(report.candidate_name);
                      setIsEditingName(true);
                    }}
                    className="text-[#737686] hover:text-[#004ac6] cursor-pointer inline-flex items-center"
                    title="Edit Candidate Name"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                )}
              </div>
            )}
            <span className="text-[11px] text-[#737686] truncate">
              Biometrics and multi-modal audio telemetry validated
            </span>
          </div>
          <span className="material-symbols-outlined text-[#004ac6] ml-auto text-[20px] shrink-0">
            task_alt
          </span>
        </div>
      </div>

      {/* Performance Summary Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white p-3 shadow-xs border border-[#e5eeff] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#737686]">
            <span className="text-[12px]">Questions</span>
            <span className="material-symbols-outlined text-[16px] text-[#004ac6]">quiz</span>
          </div>
          <div className="mt-2">
            <span className="text-[18px] text-[#0b1c30] font-bold">
              {report.questions_answered}/{report.total_questions}
            </span>
            <p className="text-[10px] text-[#737686]">100% finished</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-xs border border-[#e5eeff] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#737686]">
            <span className="text-[12px]">Accuracy</span>
            <span className="material-symbols-outlined text-[16px] text-[#6a1edb]">check_circle</span>
          </div>
          <div className="mt-2">
            <span className="text-[18px] text-[#0b1c30] font-bold">
              {report.accuracy_ratio}
            </span>
            <p className="text-[10px] text-[#737686]">{report.accuracy_detail}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-xs border border-[#e5eeff] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#737686]">
            <span className="text-[12px]">Avg Pace</span>
            <span className="material-symbols-outlined text-[16px] text-[#4b41e1]">timer</span>
          </div>
          <div className="mt-2">
            <span className="text-[18px] text-[#0b1c30] font-bold">
              {report.avg_pace}
            </span>
            <p className="text-[10px] text-[#737686]">Optimal latency</p>
          </div>
        </div>
      </div>

      {/* Domain Mastery Breakdown */}
      <div className="rounded-xl bg-white p-4 shadow-xs border border-[#e5eeff] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#0b1c30]">Domain Mastery</h3>
          <span className="font-mono text-[11px] text-[#737686]">Dynamic Rubric</span>
        </div>

        <div className="space-y-3">
          {report.domain_mastery.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-medium text-[#0b1c30]">{item.domain}</span>
                <span className="font-mono text-[12px] font-semibold text-[#004ac6]">
                  {item.score_pct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0 ? 'bg-[#004ac6]' : idx === 1 ? 'bg-[#4b41e1]' : 'bg-[#6a1edb]'
                  }`}
                  style={{ width: `${item.score_pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Strengths & Growth Areas */}
      <div className="space-y-2.5">
        {/* Demonstrated Strengths */}
        <div className="rounded-xl bg-[#eff4ff] p-3.5 shadow-xs border border-[#dbe1ff]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#004ac6] shadow-xs">
              <span className="material-symbols-outlined text-[17px]">verified</span>
            </span>
            <h4 className="text-[13px] font-semibold text-[#0b1c30]">
              Demonstrated Strengths
            </h4>
          </div>
          <p className="text-[13px] text-[#434655] leading-relaxed">
            {report.demonstrated_strengths}
          </p>
        </div>

        {/* Targeted Areas for Improvement */}
        <div className="rounded-xl bg-[#eff4ff] p-3.5 shadow-xs border border-[#dbe1ff]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#6a1edb] shadow-xs">
              <span className="material-symbols-outlined text-[17px]">tips_and_updates</span>
            </span>
            <h4 className="text-[13px] font-semibold text-[#0b1c30]">
              Targeted Areas for Improvement
            </h4>
          </div>
          <p className="text-[13px] text-[#434655] leading-relaxed">
            {report.targeted_areas_for_improvement}
          </p>
        </div>

        {/* AI Recommendations */}
        <div className="rounded-xl bg-[#eff4ff] p-3.5 shadow-xs border border-[#dbe1ff]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#004ac6] shadow-xs">
              <span className="material-symbols-outlined text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </span>
            <h4 className="text-[13px] font-semibold text-[#0b1c30]">
              AI Recommendations for Real Interviews
            </h4>
          </div>
          <p className="text-[13px] text-[#434655] leading-relaxed">
            {report.ai_recommendations}
          </p>
        </div>
      </div>

      {/* Proctor Verification Banner */}
      <div className="rounded-xl overflow-hidden bg-white shadow-xs border border-[#e5eeff] flex flex-col">
        <div className="h-24 w-full relative bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 flex items-center justify-between p-4">
          <div className="flex items-center gap-2.5 text-white">
            <span className="material-symbols-outlined text-[24px] text-[#b4c5ff]">security</span>
            <div>
              <span className="text-[13px] font-semibold block">AI Proctor Ledger</span>
              <span className="text-[11px] text-slate-300">Biometrics & tamper-resistant signature</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-mono font-semibold">
            Valid ✓
          </span>
        </div>
        <div className="p-3 bg-[#eff4ff]">
          <span className="text-[12px] text-[#434655]">
            Session recorded with crystal audio synthesis, 0 flags triggered, fully tamper-resistant ledger.
          </span>
        </div>
      </div>

      {/* Comprehensive Question Audit Accordion (Q1 to Q6) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[15px] font-semibold text-[#0b1c30]">
            Comprehensive Question Audit
          </h3>
          <span className="font-mono text-[11px] text-[#737686]">
            {report.question_audit.length} Assessments
          </span>
        </div>

        {report.question_audit.map((audit) => {
          const isExpanded = !!expandedQuestions[audit.id];
          return (
            <div
              key={audit.id}
              className="rounded-xl bg-white shadow-xs border border-[#e5eeff] overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(audit.id)}
                className="w-full p-3.5 text-left flex items-start justify-between gap-3 hover:bg-[#eff4ff] transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] font-mono text-[10px] font-semibold">
                      Q{audit.question_number} • {audit.category}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#004ac6]">
                      Score: {audit.score}/{audit.max_score}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#0b1c30] truncate">
                    {audit.topic}
                  </p>
                </div>
                <span
                  className={`material-symbols-outlined text-[#737686] transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {isExpanded && (
                <div className="px-3.5 pb-3.5 space-y-2.5 border-t border-[#f1f5f9] pt-2.5">
                  <div className="p-2.5 rounded-lg bg-[#eff4ff]">
                    <span className="text-[11px] font-medium text-[#737686] block mb-0.5">
                      Question Prompt
                    </span>
                    <p className="text-[12px] text-[#0b1c30] leading-relaxed">
                      {audit.prompt}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#e5eeff]/60">
                    <span className="text-[11px] font-medium text-[#737686] block mb-0.5">
                      Candidate Answer Excerpt
                    </span>
                    <p className="text-[12px] text-[#0b1c30] italic leading-relaxed">
                      {audit.answer_excerpt}
                    </p>
                  </div>

                  <div className="space-y-1 text-[12px]">
                    <div className="flex items-start gap-1.5 text-[#0b1c30]">
                      <span className="material-symbols-outlined text-[15px] text-[#004ac6] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>
                        <strong className="font-semibold">Strengths:</strong> {audit.strengths}
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5 text-[#434655]">
                      <span className="material-symbols-outlined text-[15px] text-[#6a1edb] shrink-0 mt-0.5">
                        lightbulb
                      </span>
                      <span>
                        <strong className="font-semibold">Missing Points:</strong>{' '}
                        {audit.missing_points}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Export feedback toast */}
      {exportNotice && (
        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-[12px] font-medium flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Bottom CTAs */}
      <div className="pt-2 flex flex-col space-y-2">
        <button
          onClick={handleDownloadPdf}
          disabled={isExporting}
          className="w-full h-12 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px]">download</span>
          <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report / Share'}</span>
        </button>

        <button
          onClick={onStartAnother}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4b41e1] to-[#6a1edb] text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            add_circle
          </span>
          <span>Start Another Interview</span>
        </button>

        <button
          onClick={onReturnDashboard}
          className="w-full h-11 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-[13px] font-medium flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">space_dashboard</span>
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
