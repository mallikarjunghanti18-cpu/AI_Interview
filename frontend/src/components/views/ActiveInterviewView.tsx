import React, { useState, useEffect, useRef } from 'react';
import { QuestionItem } from '../../types/interview';

interface ActiveInterviewViewProps {
  sessionId: string;
  question: QuestionItem;
  onSubmitAnswer: (answer: string) => Promise<void>;
  onEndSession: () => void;
}

export const ActiveInterviewView: React.FC<ActiveInterviewViewProps> = ({
  sessionId,
  question,
  onSubmitAnswer,
  onEndSession
}) => {
  // Always initialize answerText as empty for a new candidate response
  const [answerText, setAnswerText] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [voiceNotice, setVoiceNotice] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(question.estimated_minutes * 60);
  const [saveStatus, setSaveStatus] = useState<string>('Standby');
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Recognition ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Clear answer and reset state whenever the question changes
  useEffect(() => {
    console.log(
      `[ActiveInterviewView] Question changed to Q${question.question_index} of ${question.total_questions} (id: ${question.question_id}): Resetting answerText state to empty string.`
    );
    setAnswerText('');
    setValidationError('');
    setVoiceNotice('');
    setSaveStatus('Standby');
    setSecondsRemaining(question.estimated_minutes * 60);
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, [question.question_id, question.question_index]);

  // Live timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Word counter
  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(e.target.value);
    if (validationError) setValidationError('');
    setSaveStatus('Typing...');
    setTimeout(() => {
      setSaveStatus(e.target.value.trim() ? 'Auto-saved' : 'Standby');
    }, 600);
  };

  // Web Speech API: Text-to-speech replay (strictly plays audio, does not touch answerText)
  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3000);
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.question_text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API: Speech-to-text dictation
  const handleToggleVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Speech recognition is not supported in this browser. Please type your response.');
      setTimeout(() => setVoiceNotice(''), 4000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    setVoiceNotice('');
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        const trimmed = transcript.trim();
        if (trimmed) {
          setAnswerText((prev) => (prev.trim() ? prev.trim() + ' ' + trimmed : trimmed));
          if (validationError) setValidationError('');
          setSaveStatus('Dictating...');
          setTimeout(() => setSaveStatus('Auto-saved'), 700);
        }
      };

      recognition.onerror = (err: any) => {
        setIsListening(false);
        if (err?.error === 'not-allowed') {
          setVoiceNotice('Microphone access was denied. Please allow microphone access or type your response.');
        } else {
          setVoiceNotice('Microphone standby. Please speak clearly or type your response.');
        }
        setTimeout(() => setVoiceNotice(''), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setVoiceNotice('Could not start microphone. Please type your response.');
      setTimeout(() => setVoiceNotice(''), 4000);
    }
  };

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      setValidationError('Please enter or dictate your response before submitting.');
      return;
    }
    if (isSubmitting) return;
    setValidationError('');
    setIsSubmitting(true);
    try {
      await onSubmitAnswer(answerText.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = (question.question_index / question.total_questions) * 100;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Session Meta Bar */}
      <div className="flex items-center justify-between pt-1 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004ac6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004ac6]" />
          </span>
          <span className="font-mono text-[11px] text-[#434655] font-medium">
            Session: #{sessionId}
          </span>
          <span className="text-[#c3c6d7] text-[12px]">•</span>
          <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#004ac6] font-mono text-[10px] font-semibold tracking-wide">
            Live
          </span>
        </div>

        <button
          onClick={() => setShowExitModal(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#434655] hover:bg-red-50 hover:text-red-700 transition-all active:scale-95 text-[12px] font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">logout</span>
          <span>End Session</span>
        </button>
      </div>

      {/* Interview Progress & Metadata Module */}
      <div className="w-full bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-semibold text-[#0b1c30]">
              Question {question.question_index} of {question.total_questions}
            </span>
            <span className="text-[#c3c6d7] text-[12px]">·</span>
            <span className="font-mono text-[11px] text-[#004ac6] font-medium">
              Est. {question.estimated_minutes} min
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#004ac6] text-[16px]">timer</span>
            <span className="font-mono text-[12px] font-semibold text-[#0b1c30]">
              {formatTimer(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* Stepped Horizontal Progress Bar */}
        <div className="relative w-full h-2 bg-[#e5eeff] rounded-full overflow-hidden flex mb-3">
          <div
            className="h-full bg-[#004ac6] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Dots & Status */}
        <div className="flex items-center justify-between px-1 mb-2.5 overflow-x-auto no-scrollbar gap-1.5 py-0.5 min-w-0">
          {Array.from({ length: question.total_questions }).map((_, idx) => {
            const qNum = idx + 1;
            const isDone = qNum < question.question_index;
            const isCurrent = qNum === question.question_index;

            return (
              <div key={qNum} className="flex flex-col items-center gap-1">
                {isDone ? (
                  <div className="w-3 h-3 rounded-full bg-[#004ac6] flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="relative flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#dbe1ff] flex items-center justify-center animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#004ac6]" />
                    </div>
                  </div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#dce9ff]" />
                )}
                <span
                  className={`font-mono text-[10px] ${
                    isCurrent
                      ? 'text-[#004ac6] font-bold'
                      : isDone
                      ? 'text-[#434655]'
                      : 'text-[#c3c6d7]'
                  }`}
                >
                  Q{qNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Category/Topic Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#f1f5f9]">
          <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#434655] text-[11px] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#004ac6]">account_tree</span>
            {question.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#434655] text-[11px] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#4b41e1]">memory</span>
            {question.topic}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] text-[#0f0069] text-[11px] font-semibold">
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Dynamic Question Card */}
      <div className="relative w-full bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-4">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#004ac6]">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="text-[12px] font-semibold tracking-tight">AI Question Engine</span>
          </div>
          <div className="flex items-center gap-1 text-[#737686]">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            <span className="font-mono text-[11px]">POST /start-interview</span>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-[17px] font-bold text-[#0b1c30] leading-snug">
          {question.question_text}
        </h2>

        {/* Clarification / Audio Prompt Assist */}
        <div className="mt-3.5 pt-3 border-t border-[#f1f5f9] flex items-center justify-between bg-[#eff4ff] rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#004ac6] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[16px]">
                {isPlayingAudio ? 'graphic_eq' : 'volume_up'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-[#0b1c30]">
                Spoken Prompt Replay
              </span>
              <span className="font-mono text-[10px] text-[#737686]">
                English (US) • 0:14s
              </span>
            </div>
          </div>
          <button
            onClick={handlePlayAudio}
            className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
              isPlayingAudio ? 'bg-[#004ac6] text-white' : 'bg-white text-[#004ac6] hover:bg-[#dce9ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPlayingAudio ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
      </div>

      {/* Answer Workspace */}
      <div className={`w-full bg-white rounded-xl p-4 shadow-xs border border-[#e5eeff] mb-4 flex flex-col ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#004ac6] text-[18px]">edit_note</span>
            <label htmlFor="answerInput" className="text-[14px] font-semibold text-[#0b1c30]">
              Your Response
            </label>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6]" />
            <span className="font-mono text-[11px] text-[#737686]">
              {wordCount} words • {saveStatus}
            </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative w-full mb-3">
          <textarea
            id="answerInput"
            value={answerText}
            onChange={handleTextChange}
            placeholder="Type your answer here... Explain your reasoning, trade-offs, and architecture choices."
            rows={isFullscreen ? 14 : 7}
            className="w-full bg-[#eff4ff] text-[#0b1c30] rounded-lg p-3 text-[13px] placeholder:text-[#737686] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#004ac6]/20 border border-transparent focus:border-[#004ac6] transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Dictation & Keyboard Tools Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleToggleVoice}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[13px] font-medium transition-all active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-red-100 text-red-700 animate-pulse'
                : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#004ac6]">
              {isListening ? 'record_voice_over' : 'mic'}
            </span>
            <span>{isListening ? 'Recording response...' : 'Voice Dictation (Standby)'}</span>
          </button>

          <button
            onClick={() => setAnswerText((prev) => prev ? prev + '\n- ' : '- ')}
            title="Add Bullet Point"
            className="w-9 h-9 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] flex items-center justify-center text-[#434655] active:scale-90 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Collapse Editor' : 'Expand Editor'}
            className="w-9 h-9 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] flex items-center justify-center text-[#434655] active:scale-90 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFullscreen ? 'close_fullscreen' : 'open_in_full'}
            </span>
          </button>
        </div>
      </div>

      {/* Submission Button */}
      <div className="w-full flex flex-col gap-2">
        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[12px] font-medium animate-fadeIn">
            <span className="material-symbols-outlined text-[18px] text-amber-600">error</span>
            <span>{validationError}</span>
          </div>
        )}

        {voiceNotice && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-[12px] font-medium">
            <span className="material-symbols-outlined text-[18px] text-blue-600">info</span>
            <span>{voiceNotice}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Evaluating via POST /submit-answer...' : 'Submit Answer'}</span>
          <span className="material-symbols-outlined text-[18px]">bolt</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center px-4">
          <span className="material-symbols-outlined text-[15px] text-[#737686]">psychology</span>
          <p className="text-[12px] text-[#737686]">
            AI evaluates semantic depth, accuracy, and structure.
          </p>
        </div>
      </div>

      {/* Exit Modal Prompt */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-xl p-5 shadow-xl flex flex-col border border-[#e5eeff]">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <h3 className="text-[17px] font-bold text-[#0b1c30] mb-1">
              Exit Interview?
            </h3>
            <p className="text-[13px] text-[#434655] mb-4 leading-relaxed">
              Your current progress on Question {question.question_index} will be saved as draft, but dynamic evaluation will pause.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-[13px] font-medium hover:bg-[#e5eeff] transition-colors cursor-pointer"
              >
                Stay & Complete
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  onEndSession();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-[13px] font-semibold hover:bg-red-700 transition-colors cursor-pointer"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
