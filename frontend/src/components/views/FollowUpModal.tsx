import React, { useState } from 'react';

interface FollowUpModalProps {
  topic: string;
  questionText: string;
  onSubmit: (answer: string) => Promise<void>;
  onClose: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  topic,
  questionText,
  onSubmit,
  onClose
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setValidationError('Please type your follow-up response before submitting.');
      return;
    }
    if (isSubmitting) return;
    setValidationError('');
    setIsSubmitting(true);
    try {
      await onSubmit(answer.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-2xl border border-[#e5eeff] flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#4b41e1]">
              <span className="material-symbols-outlined text-[18px]">psychology_alt</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#4b41e1] uppercase tracking-wide">
                Follow-Up Question
              </span>
              <h3 className="text-[16px] font-bold text-[#0b1c30] leading-tight">
                {topic}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#737686] hover:text-[#0b1c30] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Question Prompt */}
        <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dbe1ff] mb-3">
          <p className="text-[13px] font-medium text-[#0b1c30] leading-relaxed">
            {questionText}
          </p>
        </div>

        {/* Answer input */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[12px] font-semibold text-[#0b1c30]">
            Your Response
          </label>
          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (validationError) setValidationError('');
            }}
            rows={5}
            placeholder="Explain your approach, system safeguards, and trade-offs..."
            className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d7] rounded-xl text-[13px] text-[#0b1c30] focus:outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15 transition-all resize-none leading-relaxed"
          />
          {validationError && (
            <span className="text-[12px] text-amber-700 font-medium mt-0.5">
              {validationError}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#eff4ff] text-[#434655] text-[13px] font-medium hover:bg-[#e5eeff] cursor-pointer"
          >
            Skip Follow-Up
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white text-[13px] font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Follow-Up'}</span>
            <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
