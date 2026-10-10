export type RoleCategory = 'technical' | 'analytical' | 'frameworks' | 'tools';

export interface SkillItem {
  name: string;
  category: RoleCategory;
}

export interface TopicDistribution {
  title: string;
  count: number;
  duration: string;
  pct: string;
}

export interface JobAnalysisResponse {
  job_title: string;
  confidence: string;
  seniority: string;
  tokens_processed: number;
  latency_ms: number;
  skills: SkillItem[];
  responsibilities: string[];
  topics: TopicDistribution[];
}

export interface TopicCoveredItem {
  title: string;
  subtopics: string;
  questionCount: number;
  iconName: string;
  category: string;
}

export interface InterviewPlanResponse {
  blueprint_title: string;
  description: string;
  total_questions: number;
  estimated_duration: string;
  modules: {
    technical: number;
    technical_weight: number;
    scenario: number;
    scenario_weight: number;
    behavioral: number;
    behavioral_weight: number;
  };
  difficulty_distribution: {
    easy_pct: number;
    medium_pct: number;
    hard_pct: number;
    adaptive_level: string;
  };
  topics_matrix: TopicCoveredItem[];
  rules: string[];
}

export interface QuestionItem {
  question_id: string;
  question_index: number;
  total_questions: number;
  category: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimated_minutes: number;
  question_text: string;
  spoken_audio_duration_sec?: number;
  spoken_audio_url?: string;
  sample_good_answer?: string;
}

export interface AnswerEvaluationResponse {
  score: number;
  max_score: number;
  verdict: string;
  precision_pct: number;
  depth_pct: number;
  clarity_pct: number;
  strengths: string[];
  areas_for_improvement: string[];
  evaluator_assessment: string;
  latency_seconds: number;
  rubric_level: string;
  follow_up_generated?: {
    topic: string;
    question_text: string;
  };
  next_action: 'follow_up' | 'next_question' | 'complete';
}

export interface QuestionAuditItem {
  id: string;
  question_number: number;
  category: string;
  topic: string;
  score: number;
  max_score: number;
  prompt: string;
  answer_excerpt: string;
  strengths: string;
  missing_points: string;
}

export interface InterviewResultResponse {
  session_id: string;
  job_title: string;
  completed_at: string;
  duration_str: string;
  overall_score_pct: number;
  total_points: number;
  max_points: number;
  candidate_verdict: string;
  candidate_name: string;
  candidate_avatar_url: string;
  questions_answered: number;
  total_questions: number;
  accuracy_ratio: string;
  accuracy_detail: string;
  avg_pace: string;
  domain_mastery: {
    domain: string;
    score_pct: number;
    colorClass: string;
  }[];
  demonstrated_strengths: string;
  targeted_areas_for_improvement: string;
  ai_recommendations: string;
  proctor_verified: boolean;
  question_audit: QuestionAuditItem[];
}

export interface InterviewHistoryItem {
  id: string;
  session_id: string;
  job_title: string;
  date_formatted: string;
  timestamp: number;
  benchmark_score_pct: number;
  score_ratio_str: string;
  question_volume: number;
  badge_text: string;
  badge_color: 'primary' | 'secondary' | 'tertiary';
  status: 'Completed' | 'In Progress';
  result?: InterviewResultResponse;
}

export interface BackendConfig {
  baseUrl: string;
  isOnline: boolean;
  lastCheckedTime?: number;
  latencyMs?: number;
  useFallbackIfOffline: boolean;
}
