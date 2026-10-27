import {
  JobAnalysisResponse,
  InterviewPlanResponse,
  QuestionItem,
  AnswerEvaluationResponse,
  InterviewResultResponse,
  BackendConfig
} from '../types/interview';
import {
  extractJobDetailsFromText,
  generatePlanForRole,
  generateQuestionsForRole,
  evaluateCandidateAnswer,
  generateFinalReport
} from '../data/mockTemplates';

const DEFAULT_CONFIG_KEY = 'ai_interviewer_backend_config';

export function getStoredBackendConfig(): BackendConfig {
  const saved = localStorage.getItem(DEFAULT_CONFIG_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  // Use the deployed backend in production; fall back to localhost for local development.
  const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  return {
    baseUrl: configuredBaseUrl || 'http://127.0.0.1:8000',
    isOnline: false,
    useFallbackIfOffline: true
  };
}

export function saveBackendConfig(config: BackendConfig): void {
  localStorage.setItem(DEFAULT_CONFIG_KEY, JSON.stringify(config));
}

class ApiService {
  private config: BackendConfig = getStoredBackendConfig();
  private sessionQuestionsMap = new Map<string, QuestionItem[]>();
  private latestAnalysis: JobAnalysisResponse | null = null;

  public getConfig(): BackendConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<BackendConfig>): BackendConfig {
    this.config = { ...this.config, ...newConfig };
    saveBackendConfig(this.config);
    return this.getConfig();
  }

  public async pingBackend(): Promise<{ online: boolean; latencyMs: number; error?: string }> {
    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      // Attempt to hit root, /docs or /health
      const resp = await fetch(`${this.config.baseUrl}/docs`, {
        method: 'GET',
        signal: controller.signal,
        headers: { Accept: '*/*' }
      }).catch(async () => {
        return fetch(`${this.config.baseUrl}/health`, {
          method: 'GET',
          signal: controller.signal
        });
      });

      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);

      if (resp.ok || resp.status < 500) {
        this.updateConfig({ isOnline: true, latencyMs, lastCheckedTime: Date.now() });
        return { online: true, latencyMs };
      } else {
        this.updateConfig({ isOnline: false, latencyMs, lastCheckedTime: Date.now() });
        return { online: false, latencyMs, error: `HTTP ${resp.status}` };
      }
    } catch (err: unknown) {
      const latencyMs = Math.round(performance.now() - startTime);
      this.updateConfig({ isOnline: false, latencyMs, lastCheckedTime: Date.now() });
      const errorMsg = err instanceof Error ? err.message : 'Connection failed';
      return { online: false, latencyMs, error: errorMsg };
    }
  }

  // 1. POST /analyze-jd
  public async analyzeJd(jobDescription: string): Promise<JobAnalysisResponse> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${this.config.baseUrl}/analyze-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The FastAPI backend expects the field name `jd_text`.
        body: JSON.stringify({ jd_text: jobDescription }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        const raw = await response.json();
        this.updateConfig({ isOnline: true });

        // Convert backend field names into the shape the frontend components use.
        const rawSkills = Array.isArray(raw?.required_skills) ? raw.required_skills : [];
        const rawResponsibilities = Array.isArray(raw?.responsibilities) ? raw.responsibilities : [];
        const rawTopics = Array.isArray(raw?.interview_topics) ? raw.interview_topics : [];

        const skills = rawSkills.map((item: unknown) => ({
          name: typeof item === 'string' ? item : String((item as any)?.name ?? ''),
          category: 'technical' as const
        })).filter((item: { name: string }) => item.name.trim().length > 0);

        const topics = rawTopics.map((item: unknown) => ({
          title: typeof item === 'string' ? item : String((item as any)?.title ?? (item as any)?.name ?? ''),
          count: Math.max(1, Math.floor(10 / Math.max(rawTopics.length, 1))),
          duration: `${Math.max(3, Math.round(45 / Math.max(rawTopics.length, 1)))} min`,
          pct: `${Math.round(100 / Math.max(rawTopics.length, 1))}%`
        })).filter((item: { title: string }) => item.title.trim().length > 0);

        const normalizedAnalysis: JobAnalysisResponse = {
          job_title: String(raw?.job_title ?? 'Job Role'),
          confidence: 'AI',
          seniority: String(raw?.experience ?? 'Not specified'),
          tokens_processed: jobDescription.trim().split(/\s+/).filter(Boolean).length,
          latency_ms: 0,
          skills,
          responsibilities: rawResponsibilities.map((item: unknown) =>
            typeof item === 'string' ? item : String((item as any)?.description ?? '')
          ).filter((item: string) => item.trim().length > 0),
          topics
        };
        this.latestAnalysis = normalizedAnalysis;
        return normalizedAnalysis;
      }
    } catch {
      // Use local fallback if the API is unavailable or returns an unexpected response.
    }

    await new Promise((r) => setTimeout(r, 900));
    return extractJobDetailsFromText(jobDescription);
  }

// 2. POST /create-interview-plan
public async createInterviewPlan(
  jobTitle: string | JobAnalysisResponse
): Promise<InterviewPlanResponse> {
  const suppliedAnalysis =
    typeof jobTitle === 'object' && jobTitle !== null
      ? jobTitle
      : this.latestAnalysis;

  const title =
    typeof jobTitle === 'string'
      ? jobTitle
      : String(jobTitle?.job_title ?? 'Job Role');

  if (!suppliedAnalysis) {
    throw new Error('Please analyze a job description first.');
  }

  const requestBody = {
    job_title: String(suppliedAnalysis.job_title ?? title),
    experience: String(
      (suppliedAnalysis as any).experience ??
      suppliedAnalysis.seniority ??
      'Fresher'
    ),
    required_skills: Array.isArray(suppliedAnalysis.skills)
      ? suppliedAnalysis.skills.map((item: any) =>
          typeof item === 'string' ? item : String(item?.name ?? '')
        ).filter(Boolean)
      : Array.isArray((suppliedAnalysis as any).required_skills)
        ? (suppliedAnalysis as any).required_skills
        : [],
    responsibilities: Array.isArray(suppliedAnalysis.responsibilities)
      ? suppliedAnalysis.responsibilities.map((item: any) =>
          typeof item === 'string' ? item : String(item?.description ?? '')
        ).filter(Boolean)
      : [],
    interview_topics: Array.isArray(suppliedAnalysis.topics)
      ? suppliedAnalysis.topics.map((item: any) =>
          typeof item === 'string' ? item : String(item?.title ?? item?.name ?? '')
        ).filter(Boolean)
      : Array.isArray((suppliedAnalysis as any).interview_topics)
        ? (suppliedAnalysis as any).interview_topics
        : []
  };

  const response = await fetch(
    `${this.config.baseUrl}/create-interview-plan`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Plan generation failed (${response.status}): ${errorText}`
    );
  }

  const raw = await response.json();

  const difficulty = raw?.difficulty_distribution ?? {};
  const easy = Number(difficulty.easy_pct ?? difficulty.Easy ?? 30);
  const medium = Number(difficulty.medium_pct ?? difficulty.Medium ?? 50);
  const hard = Number(difficulty.hard_pct ?? difficulty.Hard ?? 20);

  const topics = Array.isArray(raw?.topics)
    ? raw.topics
    : requestBody.interview_topics;

  const normalized = {
    ...raw,

    // Fields used by InterviewPlanView
    blueprint_title: `${title} Interview Plan`,
    description: `Interview plan tailored for the ${title} role.`,
    total_questions:
      Number(raw?.technical_questions ?? 4) +
      Number(raw?.scenario_questions ?? 4) +
      Number(raw?.behavioral_questions ?? 2),
    estimated_duration: '30–45 minutes',

    modules: {
      technical: Number(raw?.technical_questions ?? 4),
      technical_weight: 40,
      scenario: Number(raw?.scenario_questions ?? 4),
      scenario_weight: 40,
      behavioral: Number(raw?.behavioral_questions ?? 2),
      behavioral_weight: 20
    },

    difficulty_distribution: {
      ...difficulty,
      adaptive_level: difficulty.adaptive_level ?? 'Medium',
      easy_pct: easy,
      medium_pct: medium,
      hard_pct: hard
    },

    topics_matrix: topics.map((item: any) => ({
      topic: typeof item === 'string'
        ? item
        : String(item?.title ?? item?.name ?? 'General'),
      weight: 'Medium',
      questions: 1
    })),

    rules: Array.isArray(raw?.rules) ? raw.rules : []
  };

  this.updateConfig({ isOnline: true });

  return normalized as InterviewPlanResponse;
}
  
//start interview
public async startInterview(
  analysis: JobAnalysisResponse,
  plan: InterviewPlanResponse
): Promise<{
  session_id: string;
  total_questions: number;
  question: QuestionItem;
}> {
  const response = await fetch(
    `${this.config.baseUrl}/start-interview`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysis: {
          job_title: analysis.job_title,
          experience: String(
            (analysis as any).experience ??
            analysis.seniority ??
            'Fresher'
          ),
          required_skills: Array.isArray(
            (analysis as any).required_skills
          )
            ? (analysis as any).required_skills
            : Array.isArray(analysis.skills)
              ? analysis.skills.map((item: any) =>
                  typeof item === 'string'
                    ? item
                    : String(item?.name ?? '')
                ).filter(Boolean)
              : [],
          responsibilities: Array.isArray(analysis.responsibilities)
            ? analysis.responsibilities.map((item: any) =>
                typeof item === 'string'
                  ? item
                  : String(item?.description ?? '')
              ).filter(Boolean)
            : [],
          interview_topics: Array.isArray(
            (analysis as any).interview_topics
          )
            ? (analysis as any).interview_topics.map((item: any) =>
                typeof item === 'string'
                  ? item
                  : String(item?.title ?? item?.name ?? '')
              ).filter(Boolean)
            : Array.isArray(analysis.topics)
              ? analysis.topics.map((item: any) =>
                  typeof item === 'string'
                    ? item
                    : String(item?.title ?? item?.name ?? '')
                ).filter(Boolean)
              : []
        },
        plan: {
          technical_questions: plan.technical_questions,
          scenario_questions: plan.scenario_questions,
          behavioral_questions: plan.behavioral_questions,
          difficulty_distribution: plan.difficulty_distribution,
          topics: plan.topics
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Start interview failed (${response.status}): ${errorText}`
    );
  }

  this.updateConfig({ isOnline: true });
  return await response.json();
}

  // 4. POST /next-question
  public async getNextQuestion(sessionId: string, questionIndex: number, jobTitle: string): Promise<QuestionItem> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${this.config.baseUrl}/next-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, question_index: questionIndex }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        this.updateConfig({ isOnline: true });
        return await response.json();
      }
    } catch {
      // Fallback handled below
    }

    await new Promise((r) => setTimeout(r, 400));
    let questions = this.sessionQuestionsMap.get(sessionId);
    if (!questions || questions.length === 0) {
      questions = generateQuestionsForRole(jobTitle, 10);
      this.sessionQuestionsMap.set(sessionId, questions);
    }

    const targetIdx = Math.min(Math.max(questionIndex - 1, 0), questions.length - 1);
    return questions[targetIdx];
  }

  // 5. POST /submit-answer
  
public async submitAnswer(
  sessionId: string,
  questionIndex: number,
  answerText: string
): Promise<AnswerEvaluationResponse> {
  const response = await fetch(
    `${this.config.baseUrl}/submit-answer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        candidate_answer: answerText,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Submit answer failed (${response.status}): ${errorText}`
    );
  }

  this.updateConfig({ isOnline: true });
  return await response.json();
}

  // 6. POST /follow-up-question
  public async submitFollowUpAnswer(sessionId: string, questionIndex: number, answerText: string): Promise<AnswerEvaluationResponse> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/follow-up-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          question_index: questionIndex,
          answer_text: answerText
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }

    await new Promise((r) => setTimeout(r, 800));
    return {
      score: 9.0,
      max_score: 10,
      verdict: 'Excellent Resiliency Follow-Up',
      precision_pct: 95,
      depth_pct: 90,
      clarity_pct: 92,
      strengths: [
        'Decisively addressed quorum failover and stale read fences during network partition degradation.'
      ],
      areas_for_improvement: [],
      evaluator_assessment: '"Follow-up response closed the initial partition hazard loop cleanly with practical mitigation heuristics."',
      latency_seconds: 1.1,
      rubric_level: 'L7 Rubric',
      next_action: questionIndex >= 10 ? 'complete' : 'next_question'
    };
  }

  // 7. GET /interview-result/{session_id}
  public async getInterviewResult(
    sessionId: string,
    jobTitle: string,
    candidateAnswers?: Record<number, { question: QuestionItem; answer: string; evaluation: AnswerEvaluationResponse }>,
    candidateName?: string,
    durationSeconds?: number
  ): Promise<InterviewResultResponse> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${this.config.baseUrl}/interview-result/${sessionId}`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
  const data = await response.json();

  // If the backend already returns the expected format
  if (
    data.overall_score_pct !== undefined &&
    data.candidate_verdict !== undefined
  ) {
    return data as InterviewResultResponse;
  }

  // Convert the backend response to the frontend report format
  if (data.percentage !== undefined) {
    const report = generateFinalReport(
      sessionId,
      jobTitle,
      candidateAnswers,
      this.sessionQuestionsMap.get(sessionId),
      candidateName,
      durationSeconds
    );

    return {
      ...report,
      session_id: data.session_id ?? sessionId,
      job_title: data.job_title ?? jobTitle,
      overall_score_pct: Number(data.percentage) || 0,
      total_points: Number(data.total_score) || 0,
      max_points: Number(data.maximum_score) || 0,
      questions_answered: Number(data.answered_questions) || 0,
      total_questions:
        Number(data.total_questions) || report.total_questions,
      candidate_verdict: String(
        data.overall_feedback ?? report.candidate_verdict
      ),
      ai_recommendations: Array.isArray(data.recommendations)
        ? data.recommendations.join(" ")
        : report.ai_recommendations,
    };
  }

  throw new Error("Unexpected interview result format");
}
    } catch {
      // Fallback
    }

    await new Promise((r) => setTimeout(r, 600));
    const sessionQuestions = this.sessionQuestionsMap.get(sessionId);
    return generateFinalReport(sessionId, jobTitle, candidateAnswers, sessionQuestions, candidateName, durationSeconds);
  }
}

export const apiService = new ApiService();
