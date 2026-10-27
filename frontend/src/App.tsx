/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  JobAnalysisResponse,
  InterviewPlanResponse,
  QuestionItem,
  AnswerEvaluationResponse,
  InterviewResultResponse,
  InterviewHistoryItem,
  BackendConfig
} from './types/interview';
import { apiService, getStoredBackendConfig } from './services/api';
import {
  INITIAL_HISTORY,
  SAMPLE_PRESETS,
  extractJobDetailsFromText,
  generateQuestionsForRole
} from './data/mockTemplates';
import { AppHeader } from './components/AppHeader';
import { AppBottomNav, TabKey } from './components/AppBottomNav';
import { DashboardView } from './components/views/DashboardView';
import { JobDescriptionView } from './components/views/JobDescriptionView';
import { JobAnalysisView } from './components/views/JobAnalysisView';
import { InterviewPlanView } from './components/views/InterviewPlanView';
import { ActiveInterviewView } from './components/views/ActiveInterviewView';
import { AnswerEvaluationView } from './components/views/AnswerEvaluationView';
import { FinalReportView } from './components/views/FinalReportView';
import { HistoryView } from './components/views/HistoryView';
import { SettingsView } from './components/views/SettingsView';
import { FollowUpModal } from './components/views/FollowUpModal';

type AppScreen =
  | 'dashboard'
  | 'job_description'
  | 'job_analysis'
  | 'interview_plan'
  | 'active_interview'
  | 'answer_evaluation'
  | 'final_report'
  | 'history'
  | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');
  const [currentTab, setCurrentTab] = useState<TabKey>('dashboard');
  const [backendConfig, setBackendConfig] = useState<BackendConfig>(getStoredBackendConfig());
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Interview state
  const [jdText, setJdText] = useState<string>('');
  const [analysis, setAnalysis] = useState<JobAnalysisResponse | null>(null);
  const [plan, setPlan] = useState<InterviewPlanResponse | null>(null);
  const [sessionId, setSessionId] = useState<string>('sess_8f29d');
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluationResponse | null>(null);
  const [finalReport, setFinalReport] = useState<InterviewResultResponse | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [candidateAnswers, setCandidateAnswers] = useState<Record<number, { question: QuestionItem; answer: string; evaluation: AnswerEvaluationResponse }>>({});
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [candidateName, setCandidateName] = useState<string>(() => {
    return localStorage.getItem('ai_interviewer_candidate_name') || 'Mallikarjun Ghanti';
  });

  useEffect(() => {
    localStorage.setItem('ai_interviewer_candidate_name', candidateName);
  }, [candidateName]);

  // History state
  const [historyList, setHistoryList] = useState<InterviewHistoryItem[]>(() => {
    const saved = localStorage.getItem('ai_interviewer_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return INITIAL_HISTORY;
  });

  // Save history on change
  useEffect(() => {
    localStorage.setItem('ai_interviewer_history', JSON.stringify(historyList));
  }, [historyList]);

  // Ping backend on mount
  useEffect(() => {
    apiService.pingBackend().then(() => {
      setBackendConfig(apiService.getConfig());
    });
  }, []);

  // Sync tab clicks with screens
  const handleTabChange = (tab: TabKey) => {
    setCurrentTab(tab);
    if (tab === 'dashboard') {
      setCurrentScreen('dashboard');
    } else if (tab === 'new-setup') {
      setCurrentScreen('job_description');
    } else if (tab === 'history') {
      setCurrentScreen('history');
    } else if (tab === 'settings') {
      setCurrentScreen('settings');
    }
  };

  // Workflow Handlers
  const handleAnalyzeJd = async (text: string) => {
    setJdText(text);
    const result = await apiService.analyzeJd(text);
    setAnalysis(result);
    setCurrentScreen('job_analysis');
  };

  const handleRolePresetSwitch = (presetKey: string) => {
    if (SAMPLE_PRESETS[presetKey]) {
      const parsed = extractJobDetailsFromText(SAMPLE_PRESETS[presetKey]);
      setAnalysis(parsed);
    }
  };

  
  const handleCreatePlan = async () => {
    if (!analysis) return;

    const planResult = await apiService.createInterviewPlan(analysis);
    setPlan(planResult);
    setCurrentScreen('interview_plan');
  };

const handleBeginInterview = async () => {
  if (!analysis || !plan) {
    alert('Please analyze the job description and create an interview plan first.');
    return;
  }

  try {
    const sessionRes = await apiService.startInterview(analysis, plan);

    console.log('Start interview response:', sessionRes);

    // The backend creates the session but doesn't return a question.
    const firstQuestion = await apiService.getNextQuestion(
      sessionRes.session_id,
      1,
      analysis.job_title
    );

    console.log('First question:', firstQuestion);

    setSessionId(sessionRes.session_id);
    setCandidateAnswers({});
    setSessionStartTime(Date.now());
    setCurrentQuestion(firstQuestion);
    setCurrentScreen('active_interview');
  } catch (error) {
    console.error('Failed to start interview:', error);
    alert(
      error instanceof Error
        ? error.message
        : 'Could not start the interview. Please try again.'
    );
  }
};

  const handleSubmitAnswer = async (answer: string) => {
    if (!currentQuestion) return;
    const evalRes = await apiService.submitAnswer(sessionId, currentQuestion.question_index, answer);
    setCurrentEvaluation(evalRes);
    setCandidateAnswers((prev) => ({
      ...prev,
      [currentQuestion.question_index]: {
        question: currentQuestion,
        answer,
        evaluation: evalRes
      }
    }));
    setCurrentScreen('answer_evaluation');
  };

  const handleFollowUpAnswerSubmit = async (answer: string) => {
    setShowFollowUpModal(false);
    if (!currentQuestion) return;
    const followUpRes = await apiService.submitFollowUpAnswer(sessionId, currentQuestion.question_index, answer);
    setCurrentEvaluation(followUpRes);
    setCandidateAnswers((prev) => ({
      ...prev,
      [currentQuestion.question_index]: {
        question: currentQuestion,
        answer: (prev[currentQuestion.question_index]?.answer ? prev[currentQuestion.question_index].answer + '\n\n[Follow-up answer]: ' : '') + answer,
        evaluation: followUpRes
      }
    }));
    // Proceed to next question or completion
    if (followUpRes.next_action === 'complete' || currentQuestion.question_index >= currentQuestion.total_questions) {
      handleCompleteInterview();
    } else {
      handleNextQuestion();
    }
  };

  
const handleNextQuestion = async () => {
  if (!currentQuestion) return;

  const nextIdx = currentQuestion.question_index + 1;
  const jobTitle = analysis?.job_title || 'Senior Software Engineer';

  if (nextIdx > currentQuestion.total_questions) {
    await handleCompleteInterview();
    return;
  }

  try {
    console.log('Requesting question:', nextIdx);

    const nextQ = await apiService.getNextQuestion(
      sessionId,
      nextIdx,
      jobTitle
    );

    console.log('Received next question:', nextQ);
    console.log('Frontend requested question number:', nextIdx);
    console.log('Backend returned question number:', nextQ.question_index);
    console.log('Backend returned total questions:', nextQ.total_questions);
    console.log('Question text:', nextQ.question_text);

    setCurrentQuestion({
  ...nextQ,
  question_index: nextIdx,
  question_text: nextQ.question_text
});
    setCurrentScreen('active_interview');

    console.log('Switched to active interview screen');
  } catch (error) {
    console.error('Failed to load next question:', error);
    alert('Could not load the next question. Please try again.');
  }
};


  const handleCompleteInterview = async () => {
    const jobTitle = analysis?.job_title || plan?.blueprint_title || 'Junior System Engineer';
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    
    // Dynamically calculate final performance report from candidate's actual answers & scores
    const reportRes = await apiService.getInterviewResult(
      sessionId,
      jobTitle,
      candidateAnswers,
      candidateName,
      elapsedSeconds
    );

    setFinalReport(reportRes);

    // Save to history with accurate real metrics
    const newHistoryItem: InterviewHistoryItem = {
      id: `hist-${Date.now()}`,
      session_id: sessionId,
      job_title: jobTitle,
      date_formatted: 'Just now',
      timestamp: Date.now(),
      benchmark_score_pct: reportRes.overall_score_pct,
      score_ratio_str: `${(reportRes.overall_score_pct / 10).toFixed(1)}/10`,
      question_volume: reportRes.questions_answered || reportRes.total_questions,
      badge_text: (
        reportRes.candidate_verdict ??
        reportRes.overall_feedback ??
        "Interview Completed"
      ).split('/')[0].trim(),
      badge_color: reportRes.overall_score_pct >= 80 ? 'secondary' : 'primary',
      status: 'Completed',
      result: reportRes
    };

    setHistoryList((prev) => [newHistoryItem, ...prev]);
    setCurrentScreen('final_report');
  };

  const handleSelectHistorySession = (item: InterviewHistoryItem) => {
    if (item.result) {
      setFinalReport(item.result);
      setCurrentScreen('final_report');
    } else {
      // Generate result for this past item with role-specific logic
      apiService.getInterviewResult(item.session_id, item.job_title, undefined, candidateName).then((rep) => {
        setFinalReport(rep);
        setCurrentScreen('final_report');
      });
    }
  };

  // Determine header attributes
  const getHeaderProps = () => {
    switch (currentScreen) {
      case 'active_interview':
      case 'answer_evaluation':
        return {
          title: 'Active Interview...',
          subtitle: 'Active',
          showBack: true,
          onBack: () => setCurrentScreen('dashboard')
        };
      case 'final_report':
        return {
          title: 'Session Report',
          subtitle: 'Active',
          showBack: true,
          onBack: () => setCurrentScreen('dashboard')
        };
      case 'job_description':
        return {
          title: 'AI Interviewer',
          subtitle: 'New Interview',
          showBack: true,
          onBack: () => setCurrentScreen('dashboard')
        };
      case 'job_analysis':
        return {
          title: 'AI Interviewer',
          subtitle: 'New Interview',
          showBack: true,
          onBack: () => setCurrentScreen('job_description')
        };
      case 'interview_plan':
        return {
          title: 'AI Interviewer',
          subtitle: 'New Interview',
          showBack: true,
          onBack: () => setCurrentScreen('job_analysis')
        };
      case 'history':
        return {
          title: 'AI Interviewer',
          subtitle: 'Interview History',
          showBack: false
        };
      case 'settings':
        return {
          title: 'AI Interviewer',
          subtitle: 'Settings',
          showBack: true,
          onBack: () => setCurrentScreen('dashboard')
        };
      case 'dashboard':
      default:
        return {
          title: 'AI Interviewer',
          subtitle: 'Dashboard',
          showBack: false
        };
    }
  };

  const showBottomNav =
    currentScreen === 'dashboard' ||
    currentScreen === 'job_description' ||
    currentScreen === 'job_analysis' ||
    currentScreen === 'interview_plan' ||
    currentScreen === 'history' ||
    currentScreen === 'settings';

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col items-center justify-start antialiased">
      {/* Device frame container or responsive container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isMobileFrame
            ? 'max-w-[460px] my-0 sm:my-4 sm:rounded-3xl sm:border-[8px] sm:border-[#0f172a] sm:shadow-2xl sm:overflow-hidden bg-[#f8f9ff] min-h-[100dvh] sm:min-h-[880px]'
            : 'max-w-4xl mx-auto'
        }`}
      >
        {/* Android Phone Top Status Bar mockup when inside phone frame */}
        {isMobileFrame && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-2 pb-1 bg-[#f8f9ff] text-[11px] font-mono text-[#434655] select-none border-b border-[#e5eeff]/40">
            <span>9:41</span>
            <div className="w-16 h-4 bg-[#0f172a]/10 rounded-full" />
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
              <span className="material-symbols-outlined text-[14px]">wifi</span>
              <span className="material-symbols-outlined text-[14px]">battery_full</span>
            </div>
          </div>
        )}

        {/* Global App Header */}
        <AppHeader
          {...getHeaderProps()}
          backendConfig={backendConfig}
          onOpenSettings={() => {
            setCurrentTab('settings');
            setCurrentScreen('settings');
          }}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col px-4 pt-3 ${showBottomNav ? 'pb-24' : 'pb-6'}`}>
          {currentScreen === 'dashboard' && (
            <DashboardView
              onStartNew={() => {
                setCurrentTab('new-setup');
                setCurrentScreen('job_description');
              }}
              onViewHistory={() => {
                setCurrentTab('history');
                setCurrentScreen('history');
              }}
              backendConfig={backendConfig}
              onOpenSettings={() => {
                setCurrentTab('settings');
                setCurrentScreen('settings');
              }}
            />
          )}

          {currentScreen === 'job_description' && (
            <JobDescriptionView
              onAnalyze={handleAnalyzeJd}
              backendConfig={backendConfig}
              initialJd={jdText}
            />
          )}

          {currentScreen === 'job_analysis' && analysis && (
            <JobAnalysisView
              analysis={analysis}
              onCreatePlan={handleCreatePlan}
              onBackToEdit={() => setCurrentScreen('job_description')}
              onSwitchRolePreset={handleRolePresetSwitch}
            />
          )}

          {currentScreen === 'interview_plan' && plan && (
            <InterviewPlanView
              plan={plan}
              onBeginInterview={handleBeginInterview}
              onBackToAnalysis={() => setCurrentScreen('job_analysis')}
            />
          )}

          {currentScreen === 'active_interview' && currentQuestion && (
            <ActiveInterviewView
              sessionId={sessionId}
              question={currentQuestion}
              onSubmitAnswer={handleSubmitAnswer}
              onEndSession={() => setCurrentScreen('dashboard')}
            />
          )}

          {currentScreen === 'answer_evaluation' && currentEvaluation && currentQuestion && (
            <AnswerEvaluationView
              evaluation={currentEvaluation}
              currentTopic={currentQuestion.topic}
              questionIndex={currentQuestion.question_index}
              totalQuestions={currentQuestion.total_questions}
              onAnswerFollowUp={() => setShowFollowUpModal(true)}
              onNextQuestion={handleNextQuestion}
            />
          )}

          {currentScreen === 'final_report' && finalReport && (
            <FinalReportView
              report={finalReport}
              onStartAnother={() => {
                setCurrentTab('new-setup');
                setCurrentScreen('job_description');
              }}
              onReturnDashboard={() => {
                setCurrentTab('dashboard');
                setCurrentScreen('dashboard');
              }}
              onUpdateCandidateName={(newName) => {
                setCandidateName(newName);
                setFinalReport((prev) => (prev ? { ...prev, candidate_name: newName } : null));
              }}
            />
          )}

          {currentScreen === 'history' && (
            <HistoryView
              history={historyList}
              backendConfig={backendConfig}
              onSelectSession={handleSelectHistorySession}
              onStartNew={() => {
                setCurrentTab('new-setup');
                setCurrentScreen('job_description');
              }}
              onRetryConnection={async () => {
                const res = await apiService.pingBackend();
                setBackendConfig(apiService.getConfig());
                if (!res.online) {
                  // Keep user informed
                }
              }}
              onOpenSettings={() => {
                setCurrentTab('settings');
                setCurrentScreen('settings');
              }}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsView
              backendConfig={backendConfig}
              onUpdateConfig={(cfg) => setBackendConfig(cfg)}
              onBackToDashboard={() => {
                setCurrentTab('dashboard');
                setCurrentScreen('dashboard');
              }}
            />
          )}
        </main>

        {/* Global Bottom Navigation Bar */}
        {showBottomNav && (
          <AppBottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        )}

        {/* Follow-up question modal */}
        {showFollowUpModal && currentEvaluation?.follow_up_generated && (
          <FollowUpModal
            topic={currentEvaluation.follow_up_generated.topic}
            questionText={currentEvaluation.follow_up_generated.question_text}
            onSubmit={handleFollowUpAnswerSubmit}
            onClose={() => setShowFollowUpModal(false)}
          />
        )}
      </div>
    </div>
  );
}
