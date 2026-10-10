import React from 'react';
import { AnswerEvaluationResponse } from '../../types/interview';

interface AnswerEvaluationViewProps {
  evaluation: AnswerEvaluationResponse;
  currentTopic: string;
  questionIndex: number;
  totalQuestions: number;
  onAnswerFollowUp: () => void;
  onNextQuestion: () => void;
}

export const AnswerEvaluationView: React.FC<AnswerEvaluationViewProps> = ({
  evaluation,
  currentTopic,
  questionIndex,
  totalQuestions,
  onAnswerFollowUp,
  onNextQuestion
}) => {
  // SVG stroke calculation for circular score ring (max 10)
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.7
  const strokeDashoffset = circumference - (evaluation.score / evaluation.max_score) * circumference;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between py-1 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#004ac6] animate-pulse" />
          <span className="text-[12px] font-medium text-[#737686]">
            Interview in Progress
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#004ac6] font-mono text-[11px] font-semibold">
          Question {questionIndex} Evaluated
        </span>
      </div>

      {/* Score & Verdict Hero Card */}
      <div className="relative overflow-hidden rounded-xl bg-white shadow-xs border border-[#e5eeff] p-4">
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-[#004ac6]/5 blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Verdict Badge */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eff4ff] mb-2 border border-[#dbe1ff]">
              <span className="material-symbols-outlined text-[15px] text-[#004ac6]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="text-[12px] text-[#004ac6] font-semibold">
                {evaluation.verdict}
              </span>
            </div>

            <h2 className="text-[20px] font-bold text-[#0b1c30] tracking-tight">
              {currentTopic}
            </h2>

            <div className="flex items-center gap-1 mt-1 text-[#737686]">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <p className="font-mono text-[11px]">
                Analyzed in {evaluation.latency_seconds}s by AI Grader
              </p>
            </div>
          </div>

          {/* Circular Score Ring */}
          <div className="relative flex items-center justify-center shrink-0 w-22 h-22">
            <svg className="w-22 h-22 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-[#e5eeff]"
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-[#004ac6] transition-all duration-1000 ease-out"
                cx="50"
                cy="50"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[20px] font-bold text-[#0b1c30] leading-none">
                {evaluation.score}
              </span>
              <span className="text-[9px] font-medium text-[#737686] leading-tight">
                out of {evaluation.max_score}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Metric Bar */}
        <div className="grid grid-cols-3 gap-1 pt-3 mt-3 bg-[#eff4ff] rounded-lg p-2 border border-[#dbe1ff]/60">
          <div className="text-center">
            <span className="text-[11px] text-[#737686] block">Precision</span>
            <span className="font-mono text-[12px] font-semibold text-[#0b1c30]">
              {evaluation.precision_pct}%
            </span>
          </div>
          <div className="text-center border-l border-[#c3c6d7]/30">
            <span className="text-[11px] text-[#737686] block">Depth</span>
            <span className="font-mono text-[12px] font-semibold text-[#0b1c30]">
              {evaluation.depth_pct}%
            </span>
          </div>
          <div className="text-center border-l border-[#c3c6d7]/30">
            <span className="text-[11px] text-[#737686] block">Clarity</span>
            <span className="font-mono text-[12px] font-semibold text-[#0b1c30]">
              {evaluation.clarity_pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Granular Breakdown Section */}
      <div className="flex flex-col gap-3 mt-3.5">
        {/* Strengths Card */}
        <div className="rounded-xl bg-white p-3.5 shadow-xs border border-[#e5eeff]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#dbe1ff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#004ac6] text-[16px]">verified</span>
            </div>
            <h3 className="text-[14px] font-semibold text-[#0b1c30]">
              Key Strengths Demonstrated
            </h3>
          </div>
          <div className="space-y-2">
            {evaluation.strengths.map((st, i) => (
              <div key={i} className="flex items-start gap-2 bg-[#eff4ff]/70 rounded-lg p-2.5">
                <span className="material-symbols-outlined text-[#004ac6] text-[16px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <p className="text-[12px] text-[#0b1c30] leading-snug">{st}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Points Card */}
        <div className="rounded-xl bg-white p-3.5 shadow-xs border border-[#e5eeff]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#e2dfff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#4b41e1] text-[16px]">lightbulb</span>
            </div>
            <h3 className="text-[14px] font-semibold text-[#0b1c30]">
              Areas for Deeper Nuance
            </h3>
          </div>
          <div className="space-y-2">
            {evaluation.areas_for_improvement.map((area, i) => (
              <div key={i} className="flex items-start gap-2 bg-[#eff4ff]/70 rounded-lg p-2.5">
                <span className="material-symbols-outlined text-[#4b41e1] text-[16px] shrink-0 mt-0.5">
                  info
                </span>
                <p className="text-[12px] text-[#0b1c30] leading-snug">{area}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehensive AI Feedback Card */}
        <div className="rounded-xl bg-white p-3.5 shadow-xs border border-[#e5eeff]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#eaddff] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#6a1edb] text-[16px]">auto_awesome</span>
              </div>
              <h3 className="text-[14px] font-semibold text-[#0b1c30]">Evaluator Assessment</h3>
            </div>
            <span className="font-mono text-[10px] text-[#737686]">{evaluation.rubric_level}</span>
          </div>

          <div className="rounded-lg bg-[#eff4ff] p-3 relative overflow-hidden border-l-4 border-[#004ac6]">
            <p className="text-[13px] text-[#0b1c30] leading-relaxed italic">
              {evaluation.evaluator_assessment}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Next-Action Banner (Follow-up Generated if applicable) */}
      {evaluation.follow_up_generated ? (
        <div className="mt-4 rounded-xl bg-white shadow-sm border border-[#e2dfff] overflow-hidden">
          <div className="p-3.5 bg-gradient-to-r from-[#e2dfff]/50 via-[#eaddff]/30 to-white">
            <div className="flex items-center justify-between mb-1.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4b41e1] text-white shadow-xs">
                <span className="material-symbols-outlined text-[13px]">psychology_alt</span>
                <span className="text-[11px] font-medium tracking-wide">
                  Follow-Up Question Generated
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#737686] font-medium">Deep Dive</span>
            </div>

            <h4 className="text-[14px] font-bold text-[#0b1c30] mt-1">
              {evaluation.follow_up_generated.topic}
            </h4>
            <p className="text-[13px] text-[#434655] mt-1 line-clamp-3 leading-relaxed">
              {evaluation.follow_up_generated.question_text}
            </p>
          </div>

          <div className="p-3.5 flex flex-col gap-2 bg-white">
            <button
              onClick={onAnswerFollowUp}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-[13px] shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span>Answer Follow-Up Question</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>

            <button
              onClick={onNextQuestion}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] font-medium text-[13px] transition-colors cursor-pointer"
            >
              <span>
                {questionIndex >= totalQuestions
                  ? 'View Performance Report'
                  : `Skip to Next Question (${questionIndex + 1} of ${totalQuestions})`}
              </span>
              <span className="material-symbols-outlined text-[17px] text-[#737686]">
                skip_next
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={onNextQuestion}
            className="w-full py-3.5 px-4 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>
              {questionIndex >= totalQuestions
                ? 'Finish Interview & View Final Report'
                : `Continue to Next Question (${questionIndex + 1} of ${totalQuestions})`}
            </span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
};
