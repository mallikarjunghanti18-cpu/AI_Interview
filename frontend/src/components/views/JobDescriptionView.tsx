import React, { useState } from 'react';
import { SAMPLE_PRESETS } from '../../data/mockTemplates';
import { BackendConfig } from '../../types/interview';

interface JobDescriptionViewProps {
  onAnalyze: (jd: string) => Promise<void>;
  backendConfig: BackendConfig;
  initialJd?: string;
}

export const JobDescriptionView: React.FC<JobDescriptionViewProps> = ({
  onAnalyze,
  backendConfig,
  initialJd = ''
}) => {
  const [jdText, setJdText] = useState<string>(initialJd || SAMPLE_PRESETS.junior_system_engineer);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStep, setLoadingStep] = useState<number>(1);

  const handleClear = () => {
    setJdText('');
  };

  const handlePreset = (presetKey: string) => {
    if (SAMPLE_PRESETS[presetKey]) {
      setJdText(SAMPLE_PRESETS[presetKey]);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) setJdText(text);
      }
    } catch {
      // ignore
    }
  };

  const handleAnalyzeClick = async () => {
    if (!jdText.trim()) return;

    setIsAnalyzing(true);
    setLoadingProgress(25);
    setLoadingStep(1);

    const stepTimer1 = setTimeout(() => {
      setLoadingProgress(60);
      setLoadingStep(2);
    }, 600);

    const stepTimer2 = setTimeout(() => {
      setLoadingProgress(90);
      setLoadingStep(3);
    }, 1100);

    try {
      await onAnalyze(jdText);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Step Tracker Header */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#dce9ff] text-[#004ac6]">
            <span className="material-symbols-outlined text-[17px]">psychology</span>
          </div>
          <span className="text-[12px] font-semibold text-[#737686] uppercase tracking-wider">
            Step 1 of 3 • Role Context
          </span>
        </div>
        <h2 className="text-[24px] font-bold text-[#0b1c30] tracking-tight mt-1">
          Start a New Interview
        </h2>
        <p className="text-[14px] text-[#434655]">
          Paste the job description and let AI create your personalized interview simulation.
        </p>
      </div>

      {/* Universal Role Engine Card */}
      <div className="mt-4 bg-[#eff4ff] border border-[#dbe1ff] rounded-xl p-3.5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e2dfff] flex items-center justify-center shrink-0 mt-0.5 text-[#0f0069]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-[#0b1c30]">
              Universal Role Engine
            </span>
            <p className="text-[12px] text-[#434655] mt-0.5 leading-relaxed">
              Works with ANY role — Data Analyst, Software Engineer, System Engineer, Product Manager, or any custom JD.
            </p>
          </div>
        </div>
      </div>

      {/* Textarea Area */}
      <div className="mt-5 flex flex-col">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="jd-input" className="text-[14px] font-semibold text-[#0b1c30] flex items-center gap-1">
            <span>Job Description (JD)</span>
            <span className="text-red-600">*</span>
          </label>
          <span className="font-mono text-[12px] text-[#737686]">
            {jdText.length} characters
          </span>
        </div>

        <div className="relative bg-white rounded-xl shadow-xs border border-[#c3c6d7] overflow-hidden focus-within:border-[#004ac6] focus-within:ring-2 focus-within:ring-[#004ac6]/15 transition-all">
          <textarea
            id="jd-input"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the complete job description here... (e.g. responsibilities, requirements, technical stack, or qualifications)"
            rows={7}
            className="w-full p-3.5 bg-transparent text-[#0b1c30] text-[14px] placeholder:text-[#737686] focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between px-3.5 py-2 bg-[#eff4ff]/70 border-t border-[#e5eeff]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-[#434655]">Parser standby</span>
            </div>
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="flex items-center gap-1 text-[12px] font-medium text-[#004ac6] hover:text-[#003ea8] py-1 px-2 rounded-lg hover:bg-[#dce9ff]/60 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">content_paste</span>
              <span>Paste clipboard</span>
            </button>
          </div>
        </div>

        {/* Info Tip */}
        <div className="mt-2.5 bg-[#dce9ff]/50 rounded-xl p-2.5 flex items-start gap-2.5 border border-[#dbe1ff]">
          <div className="w-5 h-5 rounded-full bg-[#dbe1ff] flex items-center justify-center shrink-0 mt-0.5 text-[#004ac6]">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lightbulb
            </span>
          </div>
          <p className="text-[12px] text-[#434655] leading-normal">
            Providing the complete job description helps generate more relevant questions, technical benchmarks, and realistic evaluation rubrics.
          </p>
        </div>
      </div>

      {/* Quick Sample Presets */}
      <div className="mt-4 flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
          Quick Sample Presets
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handlePreset('junior_system_engineer')}
            className="px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#004ac6] hover:bg-[#dbe1ff] text-[#004ac6] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#004ac6]">terminal</span>
            <span>Junior System Engineer JD</span>
          </button>

          <button
            type="button"
            onClick={() => handlePreset('clickhouse')}
            className="px-3 py-1.5 rounded-full bg-white border border-[#c3c6d7] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#004ac6]">database</span>
            <span>ClickHouse Analyst JD</span>
          </button>

          <button
            type="button"
            onClick={() => handlePreset('data_analyst')}
            className="px-3 py-1.5 rounded-full bg-white border border-[#c3c6d7] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#004ac6]">analytics</span>
            <span>Data Analyst JD</span>
          </button>

          <button
            type="button"
            onClick={() => handlePreset('fullstack')}
            className="px-3 py-1.5 rounded-full bg-white border border-[#c3c6d7] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#4b41e1]">code</span>
            <span>Fullstack Engineer JD</span>
          </button>

          <button
            type="button"
            onClick={() => handlePreset('cloud')}
            className="px-3 py-1.5 rounded-full bg-white border border-[#c3c6d7] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#6a1edb]">cloud</span>
            <span>Cloud Ops JD</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleAnalyzeClick}
          disabled={!jdText.trim() || isAnalyzing}
          className="w-full h-12 bg-[#004ac6] hover:bg-[#003ea8] disabled:opacity-50 text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span>{isAnalyzing ? 'Analyzing JD...' : 'Analyze Job Description'}</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={isAnalyzing}
          className="w-full h-11 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#434655] rounded-xl font-medium text-[14px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">clear_all</span>
          <span>Clear</span>
        </button>
      </div>

      {/* AI Loading Card (Shown when analyzing) */}
      {isAnalyzing && (
        <div className="mt-5 flex flex-col bg-white rounded-xl p-4 shadow-md border border-[#dbe1ff] overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#eaddff] flex items-center justify-center text-[#6a1edb]">
                <span className="material-symbols-outlined text-[20px] animate-pulse">neurology</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#0b1c30]">
                  Analyzing your job description...
                </span>
                <span className="text-[11px] text-[#6a1edb]">Synthesizing role matrix</span>
              </div>
            </div>
            <span className="font-mono text-[12px] font-medium text-[#737686]">
              {loadingProgress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-[#e5eeff] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-[#4b41e1] transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          <div className="mt-3.5 flex flex-col gap-2">
            {/* Step 1 */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#eff4ff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">
                  check_circle
                </span>
                <span className="text-[12px] text-[#0b1c30]">
                  Reading requirements & scopes
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#737686]">Complete</span>
            </div>

            {/* Step 2 */}
            <div className={`flex items-center justify-between p-2 rounded-lg ${loadingStep >= 2 ? 'bg-[#e5eeff]' : 'bg-[#eff4ff] opacity-60'}`}>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${loadingStep > 2 ? 'text-emerald-600' : 'text-[#6a1edb] animate-spin'}`}>
                  {loadingStep > 2 ? 'check_circle' : 'sync'}
                </span>
                <span className="text-[12px] text-[#0b1c30]">
                  Extracting core competencies...
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#6a1edb]">
                {loadingStep > 2 ? 'Complete' : 'In flight'}
              </span>
            </div>

            {/* Step 3 */}
            <div className={`flex items-center justify-between p-2 rounded-lg ${loadingStep >= 3 ? 'bg-[#e5eeff]' : 'bg-[#eff4ff] opacity-60'}`}>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${loadingStep >= 3 ? 'text-[#6a1edb] animate-spin' : 'text-[#737686]'}`}>
                  {loadingStep >= 3 ? 'sync' : 'pending'}
                </span>
                <span className="text-[12px] text-[#434655]">
                  Formatting topic breakdown...
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#737686]">
                {loadingStep >= 3 ? 'In flight' : 'Queued'}
              </span>
            </div>
          </div>

          <div className="mt-3 p-2 rounded-lg bg-[#eff4ff] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] text-[#434655]">
                Endpoint Active: Response code 200
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#004ac6] font-medium">Latency: 182ms</span>
          </div>
        </div>
      )}

      {/* Target endpoint info */}
      <div className="mt-4 p-2.5 rounded-xl bg-[#eff4ff] border border-[#dbe1ff] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[17px] text-[#737686] shrink-0">
            lan
          </span>
          <span className="font-mono text-[11px] text-[#434655] truncate">
            Target: POST {backendConfig.baseUrl}/analyze-jd
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#004ac6] bg-[#dce9ff] px-2 py-0.5 rounded shrink-0">
          REST
        </span>
      </div>

      {/* Security Footer */}
      <div className="mt-4 flex items-center justify-center gap-3 text-[#737686] text-[12px]">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px]">lock</span>
          <span>Confidential session</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px]">bolt</span>
          <span>Zero retention cache</span>
        </div>
      </div>
    </div>
  );
};
