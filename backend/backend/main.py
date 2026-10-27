from fastapi import FastAPI
import os
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv
import uuid



# -------------------------
# SETUP
# -------------------------

load_dotenv()

env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(env_path)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# DATA MODELS
# -------------------------

class JobDescription(BaseModel):
    jd_text: str


class JDAnalysis(BaseModel):
    job_title: str
    experience: str
    required_skills: list[str]
    responsibilities: list[str]
    interview_topics: list[str]


class InterviewPlan(BaseModel):
    technical_questions: int
    scenario_questions: int
    behavioral_questions: int
    difficulty_distribution: dict
    topics: list[str]


class InterviewQuestion(BaseModel):
    question: str
    category: str
    topic: str
    difficulty: str


class AnswerEvaluation(BaseModel):
    score: int
    correct: bool
    strengths: list[str]
    missing_points: list[str]
    feedback: str
    follow_up_needed: bool


class AnswerRequest(BaseModel):
    question: str
    category: str
    topic: str
    difficulty: str
    candidate_answer: str


# -------------------------
# INTERVIEW SESSION
# -------------------------

class InterviewSession(BaseModel):
    session_id: str
    job_title: str
    total_questions: int
    current_question: int
    status: str

    analysis: JDAnalysis
    plan: InterviewPlan

    questions_asked: list[dict] = Field(default_factory=list)
    answers: list[dict] = Field(default_factory=list)


# -------------------------
# REQUEST MODELS
# -------------------------

class StartInterviewRequest(BaseModel):
    analysis: JDAnalysis
    plan: InterviewPlan


class NextQuestionRequest(BaseModel):
    session_id: str


class SubmitAnswerRequest(BaseModel):
    session_id: str
    candidate_answer: str


class FollowUpRequest(BaseModel):
    session_id: str
    candidate_answer: str


# -------------------------
# SESSION STORAGE
# -------------------------

interview_sessions = {}


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "AI Interviewer Backend is running!"
    }


# =========================================================
# ANALYZE JD
# =========================================================

@app.post("/analyze-jd")
def analyze_jd(job: JobDescription):

    prompt = f"""
You are an expert job-description analyzer for an AI interview platform.

Analyze the following job description.

JOB DESCRIPTION:
{job.jd_text}

Extract:

1. Job title
2. Required experience
3. Required skills
4. Job responsibilities
5. Important interview topics

Rules:
- Use only information supported by the job description.
- Do not invent skills, responsibilities, technologies, or experience.
- If something is not mentioned, write "Not specified".
- Keep skills and responsibilities concise.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": JDAnalysis,
        },
    )

    return response.parsed


# =========================================================
# CREATE INTERVIEW PLAN
# =========================================================

@app.post("/create-interview-plan")
def create_interview_plan(analysis: JDAnalysis):

    prompt = f"""
You are an expert technical interviewer.

Create an interview plan based ONLY on the following job analysis.

Job Title:
{analysis.job_title}

Experience:
{analysis.experience}

Required Skills:
{analysis.required_skills}

Responsibilities:
{analysis.responsibilities}

Interview Topics:
{analysis.interview_topics}

Create a balanced interview plan.

Rules:
- Create a practical interview plan for a fresher.
- Focus only on the skills and topics provided.
- Do not introduce unrelated technologies.
- Use technical, scenario-based, and behavioral questions.
- The total number of questions must be exactly 10.
- Technical + scenario + behavioral questions must equal 10.
- Difficulty must be Easy, Medium, or Hard.

"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": {
                "type": "object",
                "properties": {
                    "technical_questions": {
                        "type": "integer"
                    },
                    "scenario_questions": {
                        "type": "integer"
                    },
                    "behavioral_questions": {
                        "type": "integer"
                    },
                    "difficulty_distribution": {
                        "type": "object",
                        "properties": {
                            "Easy": {
                                "type": "integer"
                            },
                            "Medium": {
                                "type": "integer"
                            },
                            "Hard": {
                                "type": "integer"
                            }
                        },
                        "required": [
                            "Easy",
                            "Medium",
                            "Hard"
                        ]
                    },
                    "topics": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "required": [
                    "technical_questions",
                    "scenario_questions",
                    "behavioral_questions",
                    "difficulty_distribution",
                    "topics"
                ]
            }
        }
    )

    return response.parsed


# =========================================================
# GENERATE SINGLE QUESTION
# =========================================================

@app.post("/generate-question")
def generate_question(plan: InterviewPlan):

    prompt = f"""
You are an experienced technical interviewer.

Generate ONE interview question based on this interview plan.

Technical questions:
{plan.technical_questions}

Scenario questions:
{plan.scenario_questions}

Behavioral questions:
{plan.behavioral_questions}

Difficulty distribution:
{plan.difficulty_distribution}

Topics:
{plan.topics}

Generate one question suitable for a fresher.

Rules:
- Ask only ONE question.
- The question must be directly related to the provided topics.
- Do not ask about unrelated technologies.
- Make the question clear and realistic.
- Category must be Technical, Scenario, or Behavioral.
- ## Experience-Based Interview Difficulty Rules

1. Determine the candidate's seniority from the job title, job description, required experience, responsibilities, and leadership expectations. Do not rely on the job title alone.

2. **Junior / Fresher Roles**
   - Difficulty range: Easy to Medium.
   - Focus on fundamentals, basic technical concepts, common commands, simple troubleshooting, and practical scenarios with clear constraints.
   - Start with easy questions and gradually progress to medium difficulty.
   - Avoid advanced system design, complex distributed systems, and senior-level architectural trade-offs unless explicitly required by the job description.
   - Suggested distribution: 40% Easy, 60% Medium.

3. **Mid-Level Roles**
   - Difficulty range: Medium to Hard.
   - Focus on independent troubleshooting, implementation decisions, performance optimization, practical design, and real-world problem-solving.
   - Include a few challenging questions appropriate to the stated experience.
   - Suggested distribution: 60% Medium, 40% Hard.

4. **Senior / Lead / Architect Roles**
   - Difficulty range: Medium to High.
   - Focus on system design, scalability, reliability, security, architecture trade-offs, production incidents, technical leadership, and complex troubleshooting.
   - Ask scenario-based questions that require reasoning, justification, and evaluation of trade-offs.
   - Suggested distribution: 30% Medium, 50% Hard, 20% Very Hard.

5. Adjust the difficulty according to the actual job requirements. If a role has an unusual combination of seniority and responsibilities, prioritize the job description over generic assumptions.

6. Difficulty must affect the question's complexity and expected answer depth, not merely the wording.

7. Label each question with its difficulty using the existing response schema: Easy, Medium, Hard, or Very Hard.

8. Keep the overall interview challenging but fair. Do not give fresher-level candidates senior architect questions, and do not make senior candidates answer only basic definitions.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": {
                "type": "object",
                "properties": {
                    "question": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "topic": {
                        "type": "string"
                    },
                    "difficulty": {
                        "type": "string"
                    }
                },
                "required": [
                    "question",
                    "category",
                    "topic",
                    "difficulty"
                ]
            }
        }
    )

    return response.parsed


# =========================================================
# EVALUATE ANSWER
# =========================================================

@app.post("/evaluate-answer")
def evaluate_answer(request: AnswerRequest):

    prompt = f"""
You are an experienced job interviewer.

Evaluate the candidate's answer to the interview question.

QUESTION:
{request.question}

CATEGORY:
{request.category}

TOPIC:
{request.topic}

DIFFICULTY:
{request.difficulty}

CANDIDATE ANSWER:
{request.candidate_answer}

Evaluate the answer fairly for a fresher.

Rules:
- Give a score from 0 to 10.
- Check whether the answer is technically correct.
- Identify what the candidate did well.
- Identify important missing points.
- Give simple and constructive feedback.
- Do not expect advanced knowledge from a fresher.
- Set follow_up_needed to true if the answer is incorrect,
  incomplete, or needs clarification.
- Set follow_up_needed to false if the answer is sufficiently correct.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": AnswerEvaluation,
        }
    )

    return response.parsed


# =========================================================
# START INTERVIEW
# =========================================================

@app.post("/start-interview")
def start_interview(request: StartInterviewRequest):

    session_id = str(uuid.uuid4())

    total_questions = (
        request.plan.technical_questions
        + request.plan.scenario_questions
        + request.plan.behavioral_questions
    )

    # Safety: make sure interview contains 10 questions
    if total_questions != 10:
        total_questions = 10

    session = InterviewSession(
        session_id=session_id,
        job_title=request.analysis.job_title,
        total_questions=total_questions,
        current_question=1,
        status="in_progress",
        analysis=request.analysis,
        plan=request.plan
    )

    interview_sessions[session_id] = session

    return {
        "session_id": session_id,
        "job_title": session.job_title,
        "total_questions": session.total_questions,
        "current_question": session.current_question,
        "status": session.status
    }


# =========================================================
# NEXT QUESTION
# =========================================================


@app.post("/next-question")
def next_question(request: NextQuestionRequest):

    session = interview_sessions.get(request.session_id)

    if session is None:
        print("DEBUG: Session not found")
        print("DEBUG: Requested session ID:", request.session_id)
        print("DEBUG: Available session IDs:", list(interview_sessions.keys()))

        return {"error": "Interview session not found"}

    print("DEBUG: Session found:", request.session_id)
    print("DEBUG: Returning question index:", session.current_question)
    print("DEBUG: Total questions:", session.total_questions)

    if session.current_question > session.total_questions:
        session.status = "completed"
        return {
            "message": "Interview completed",
            "status": "completed"
        }

    previous_questions = session.questions_asked
    print("DEBUG: Questions asked count:", len(session.questions_asked))

    prompt = f"""
You are conducting a real job interview.

Generate the next interview question for the candidate.

JOB TITLE:
{session.analysis.job_title}

REQUIRED SKILLS:
{session.analysis.required_skills}

RESPONSIBILITIES:
{session.analysis.responsibilities}

INTERVIEW TOPICS:
{session.analysis.interview_topics}

INTERVIEW PLAN:
Technical questions: {session.plan.technical_questions}
Scenario questions: {session.plan.scenario_questions}
Behavioral questions: {session.plan.behavioral_questions}
Difficulty distribution: {session.plan.difficulty_distribution}

CURRENT QUESTION NUMBER:
{session.current_question}

TOTAL QUESTIONS:
{session.total_questions}

PREVIOUS QUESTIONS:
{previous_questions}

Rules:
- Generate exactly ONE new question.
- Do not repeat previous questions.
- Use only the provided skills, responsibilities, and topics.
- Category must be Technical, Scenario, or Behavioral.
- Difficulty must be Easy, Medium, or Hard.
- Make it appropriate for a fresher.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": InterviewQuestion,
        }
    )

    question = response.parsed

    if question is None:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=502,
            detail="AI did not return a valid interview question"
        )

    session.current_question += 1

    session.questions_asked.append({
        "question_number": session.current_question,
        "question": question.question,
        "category": question.category,
        "topic": question.topic,
        "difficulty": question.difficulty
    })

    return {
        "question_id": str(uuid.uuid4()),
        "question_index": session.current_question,
        "total_questions": session.total_questions,
        "category": question.category,
        "topic": question.topic,
        "difficulty": question.difficulty,
        "estimated_minutes": 2,
        "question_text": question.question
    }

# =========================================================
# SUBMIT ANSWER
# =========================================================

@app.post("/submit-answer")
def submit_answer(request: SubmitAnswerRequest):

    session = interview_sessions.get(request.session_id)

    if session is None:
        return {
            "error": "Interview session not found"
        }

    # Make sure a question exists
    if not session.questions_asked:
        return {
            "error": "No question has been asked yet"
        }

    # Get latest question
    current_question = session.questions_asked[-1]

    prompt = f"""
You are an experienced job interviewer.

Evaluate the candidate's answer.

QUESTION:
{current_question["question"]}

CATEGORY:
{current_question["category"]}

TOPIC:
{current_question["topic"]}

DIFFICULTY:
{current_question["difficulty"]}

CANDIDATE ANSWER:
{request.candidate_answer}

Evaluate the answer fairly for a fresher.

Rules:
-**Strict Answer Evaluation Rules**

1. Evaluate the answer against the actual interview question and its expected technical concepts.
2. Detect gibberish, random characters, irrelevant text, and repeated words.
3. If the answer is meaningless or unrelated, assign a score of **0–1 out of 10**.
4. Do not award points merely because the answer contains many words or sounds confident.
5. Award points only for technically correct, relevant information.
6. An answer that is empty, gibberish, or completely unrelated must never receive a score above 1/10.
7. Provide constructive feedback explaining what essential concepts were missing.
8. Score precision, depth, and clarity consistently with the overall score.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": AnswerEvaluation,
        }
    )

    evaluation = response.parsed

    # -------------------------------------------------
    # SAVE ANSWER + EVALUATION
    # -------------------------------------------------

    session.answers.append({
    "question_number": current_question["question_number"],
    "question": current_question["question"],
    "candidate_answer": request.candidate_answer,

    "score": evaluation.score,
    "correct": evaluation.correct,

    "topic": current_question["topic"],
    "category": current_question["category"],
    "difficulty": current_question["difficulty"],

    "strengths": evaluation.strengths,
    "missing_points": evaluation.missing_points,
    "feedback": evaluation.feedback,
    "follow_up_needed": evaluation.follow_up_needed
})

    # -------------------------------------------------
    # DECIDE NEXT ACTION
    # -------------------------------------------------

    if evaluation.follow_up_needed:

        next_action = "follow_up"

    else:

        session.current_question += 1

        # If all questions are answered
        if session.current_question > session.total_questions:

            session.status = "completed"
            next_action = "completed"

        else:

            next_action = "next_question"

    return {
        "question_number": current_question["question_number"],
        "evaluation": {
            "score": evaluation.score,
            "correct": evaluation.correct,
            "strengths": evaluation.strengths,
            "missing_points": evaluation.missing_points,
            "feedback": evaluation.feedback,
            "follow_up_needed": evaluation.follow_up_needed
        },
        "next_action": next_action
    }


# =========================================================
# FOLLOW-UP QUESTION
# =========================================================

@app.post("/follow-up-question")
def follow_up_question(request: FollowUpRequest):

    session = interview_sessions.get(request.session_id)

    if session is None:
        return {
            "error": "Interview session not found"
        }

    if not session.questions_asked:
        return {
            "error": "No question has been asked yet"
        }

    last_question = session.questions_asked[-1]

    prompt = f"""
You are conducting a professional technical interview.

Generate ONE follow-up question based on the candidate's answer.

ORIGINAL QUESTION:
{last_question["question"]}

CATEGORY:
{last_question["category"]}

TOPIC:
{last_question["topic"]}

DIFFICULTY:
{last_question["difficulty"]}

CANDIDATE ANSWER:
{request.candidate_answer}

Rules:
- Ask exactly ONE follow-up question.
- The follow-up must be directly related to the original question.
- Focus on the candidate's missing or unclear points.
- Do not introduce unrelated technologies.
- Keep it suitable for a fresher.
- Make the question clear and realistic.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": InterviewQuestion,
        }
    )

    follow_up = response.parsed

    return {
        "question": follow_up
    }


# =========================================================
# FINAL INTERVIEW RESULT
# =========================================================

@app.get("/interview-result/{session_id}")
def interview_result(session_id: str):

    session = interview_sessions.get(session_id)

    if session is None:
        return {
            "error": "Interview session not found"
        }

    answers = session.answers

    if not answers:

        return {
            "error": "No answers submitted yet"
        }

    total_questions = session.total_questions
    answered_questions = len(answers)

    total_score = sum(
        answer["score"]
        for answer in answers
    )

    maximum_score = total_questions * 10

    percentage = round(
        (total_score / maximum_score) * 100,
        2
    ) if maximum_score > 0 else 0

    correct_answers = sum(
        1
        for answer in answers
        if answer["correct"]
    )

    incorrect_answers = answered_questions - correct_answers

    # -------------------------------------------------
    # TOPIC PERFORMANCE
    # -------------------------------------------------

    topic_scores = {}

    for answer in answers:

        topic = answer["topic"]

        if topic not in topic_scores:
            topic_scores[topic] = {
                "score": 0,
                "questions": 0
            }

        topic_scores[topic]["score"] += answer["score"]
        topic_scores[topic]["questions"] += 1

    topic_performance = {}

    for topic, data in topic_scores.items():

        topic_percentage = round(
            (data["score"] / (data["questions"] * 10)) * 100,
            2
        )

        topic_performance[topic] = {
            "score": data["score"],
            "questions": data["questions"],
            "percentage": topic_percentage
        }

    # -------------------------------------------------
    # OVERALL PERFORMANCE
    # -------------------------------------------------

    if percentage >= 80:

        overall_feedback = (
            "Excellent performance. The candidate demonstrates "
            "strong understanding of the interview topics."
        )

    elif percentage >= 60:

        overall_feedback = (
            "Good performance. The candidate has a solid foundation "
            "but should improve some technical areas."
        )

    elif percentage >= 40:

        overall_feedback = (
            "Average performance. The candidate should practice "
            "more technical and scenario-based questions."
        )

    else:

        overall_feedback = (
            "The candidate needs more preparation in the core "
            "technical topics before attending interviews."
        )

    # -------------------------------------------------
    # RECOMMENDATIONS
    # -------------------------------------------------

    recommendations = []

    for topic, data in topic_performance.items():

        if data["percentage"] < 60:

            recommendations.append(
                f"Improve knowledge of {topic}"
            )

    if not recommendations:

        recommendations.append(
            "Continue practicing interview questions "
            "to maintain strong performance."
        )

    # -------------------------------------------------
    # FINAL RESPONSE
    # -------------------------------------------------

    return {
        "session_id": session.session_id,
        "job_title": session.job_title,
        "status": session.status,

        "total_questions": total_questions,
        "answered_questions": answered_questions,

        "total_score": total_score,
        "maximum_score": maximum_score,
        "percentage": percentage,

# Field names expected by the frontend
        "total_points": total_score,
        "max_points": maximum_score,
        "overall_score_pct": percentage,
        "questions_answered": answered_questions, 

        "correct_answers": correct_answers,
        "incorrect_answers": incorrect_answers,

        "topic_performance": topic_performance,

        "overall_feedback": overall_feedback,

        "recommendations": recommendations,

        "answers": answers
    }