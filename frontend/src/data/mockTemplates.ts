import { JobAnalysisResponse, InterviewPlanResponse, QuestionItem, QuestionAuditItem, AnswerEvaluationResponse, InterviewResultResponse, InterviewHistoryItem } from '../types/interview';

export const JUNIOR_SYSTEM_ENGINEER_JD = `**Role:** Junior System Engineer  
**Department:** IT Infrastructure & Operations  
**Experience:** Fresher / Entry Level (0–1 years)

**Responsibilities:**
- Provide first-level technical support for hardware, software, and operating system issues.
- Troubleshoot basic network connectivity problems, including LAN, Wi-Fi, DNS, and DHCP.
- Install and configure Windows operating systems and applications.
- Create, update, and resolve IT support tickets while following SLA guidelines.
- Escalate complex technical issues to senior engineers.
- Assist with system monitoring, documentation, and routine IT maintenance.

**Requirements:**
- BE/BTech or equivalent degree in ECE, CSE, IT, or a related field.
- Basic understanding of computer networking, IP addressing, DNS, and DHCP.
- Familiarity with Windows and basic Linux commands.
- Basic knowledge of hardware troubleshooting and IT support.
- Good problem-solving, communication, and teamwork skills.
- No prior work experience required.`;

export const SAMPLE_PRESETS: Record<string, string> = {
  junior_system_engineer: JUNIOR_SYSTEM_ENGINEER_JD,
  system_engineer: JUNIOR_SYSTEM_ENGINEER_JD,
  analyst: JUNIOR_SYSTEM_ENGINEER_JD,

  clickhouse: `Key Responsibilities:
* Collect, clean, transform, and analyze data from different sources.
* Perform exploratory data analysis (EDA) to identify trends, patterns, anomalies, and data-quality issues.
* Write and optimize SQL queries for data extraction, analysis, and reporting.
* Work with ClickHouse for analytical queries and high-volume data analysis.
* Assist in database optimization and performance tuning by identifying slow queries and bottlenecks.
* Analyze query execution plans and support optimization through appropriate indexing and query improvements.
* Prepare data summaries, reports, dashboards, and insights to support business and technical decisions.
* Research new tools, technologies, algorithms, and approaches for upcoming development initiatives.
* Support proof-of-concepts (POCs) and research activities for new data science and analytics solutions.
* Collaborate with developers and technical teams to understand data requirements and implement data-driven solutions.
* Investigate data and performance-related issues and assist with root-cause analysis.
* Document analysis, research findings, optimization results, and recommendations.
Required Skills:
* Basic knowledge of Python and data science concepts.
* Good understanding of SQL and relational databases.
* Basic knowledge of data analysis and data visualization.
* Understanding of Pandas, NumPy, and basic data-processing techniques.
* Basic understanding of statistics and analytical concepts.
* Interest in working with ClickHouse or other analytical databases.
* Basic understanding of database optimization and performance tuning.
* Strong analytical and problem-solving skills.
Key Focus Areas:
* Data Analysis, Python, SQL, ClickHouse, Database Optimization, Performance Tuning, EDA, Research & POCs`,

  data_analyst: `Role: Senior Data Analyst
Department: Growth & Revenue Analytics
Responsibilities:
- Build real-time dashboards in Tableau/Looker for executive cohort analysis.
- Execute complex SQL queries across BigQuery and Snowflake warehouses.
- Perform statistical A/B testing analysis, hypothesis testing, and causal inference experiments.
- Partner with product leads to synthesize clickstream event pipelines into KPI insights.
Requirements:
- 4+ years analytics experience with SQL, dbt, and Python (pandas/numpy).
- Proven track record explaining complex data models to non-technical stakeholders.
- Experience with ETL data pipelines and cohort retention curves.`,

  fullstack: `Role: Senior Full-Stack Architect
Department: Core Platform Infrastructure
Responsibilities:
- Architect modular frontend features using Next.js, TypeScript, and modern state machines.
- Build resilient REST & GraphQL microservices with Node.js and distributed caching tiers.
- Optimize PostgreSQL query latency and implement Kafka event-driven pipelines.
- Establish zero-trust API gateway security (OAuth2, mTLS, rate limiting).
Requirements:
- 5+ years shipping high-throughput customer-facing web applications.
- Strong grasp of distributed systems, ACID boundaries, and concurrency control.
- Experience with container orchestration and observability pipelines.`,

  cloud: `Role: Cloud Operations / SRE Engineer
Department: Infrastructure Reliability
Responsibilities:
- Manage multi-region Kubernetes clusters with ArgoCD GitOps workflows.
- Automate infra-as-code through modular Terraform and Terragrunt pipelines.
- Establish Datadog SLIs/SLOs and participate in high-severity incident triage rotations.
- Enforce network policy isolation, VPC peering, and cost optimization telemetry.
Requirements:
- 3+ years managing production Linux/Kubernetes clusters.
- Experience with zero-trust networking, IAM role hardening, and circuit breakers.
- Proficiency in Python/Bash automation scripting.`
};

export const INITIAL_HISTORY: InterviewHistoryItem[] = [
  {
    id: 'hist-1',
    session_id: 'sess_8f29d',
    job_title: 'Senior Data Analyst',
    date_formatted: 'Yesterday, 4:15 PM',
    timestamp: Date.now() - 86400000,
    benchmark_score_pct: 86,
    score_ratio_str: '8.6/10',
    question_volume: 6,
    badge_text: 'SQL & Modeling Strong',
    badge_color: 'tertiary',
    status: 'Completed'
  },
  {
    id: 'hist-2',
    session_id: 'sess_a190b',
    job_title: 'Full-Stack Software Engineer',
    date_formatted: 'Oct 24, 2024',
    timestamp: Date.now() - 86400000 * 4,
    benchmark_score_pct: 92,
    score_ratio_str: '9.2/10',
    question_volume: 8,
    badge_text: 'Top 5% Distributed Systems',
    badge_color: 'secondary',
    status: 'Completed'
  },
  {
    id: 'hist-3',
    session_id: 'sess_3341c',
    job_title: 'Cloud Security Architect',
    date_formatted: 'Oct 19, 2024',
    timestamp: Date.now() - 86400000 * 9,
    benchmark_score_pct: 78,
    score_ratio_str: '7.8/10',
    question_volume: 5,
    badge_text: 'Zero-Trust Architecture',
    badge_color: 'primary',
    status: 'Completed'
  }
];

export function extractJobDetailsFromText(jdText: string): JobAnalysisResponse {
  const lower = jdText.toLowerCase();
  
  let job_title = 'Senior Software Engineer';
  let seniority = 'Senior • Engineering';
  
  const isJuniorSysEng = lower.includes('junior system engineer') || (lower.includes('system engineer') && (lower.includes('fresher') || lower.includes('entry level') || lower.includes('hardware') || lower.includes('0–1') || lower.includes('sla')));
  const isClickhouseTrack = !isJuniorSysEng && (lower.includes('clickhouse') || (lower.includes('database optimization') && lower.includes('eda')));

  if (isJuniorSysEng) {
    job_title = 'Junior System Engineer';
    seniority = 'Fresher / Entry Level (0–1 yrs) • IT Infrastructure & Operations';
  } else if (isClickhouseTrack) {
    job_title = 'Data Analyst & Database Optimization Associate';
    seniority = 'Associate / Mid • ClickHouse & SQL Tuning';
  } else if (lower.includes('data analyst') || lower.includes('analytics') || lower.includes('tableau')) {
    job_title = 'Senior Data Analyst';
    seniority = 'Senior • BI & Analytics';
  } else if (lower.includes('system engineer') || lower.includes('lead systems') || lower.includes('infrastructure')) {
    job_title = 'Lead Systems & Infrastructure Engineer';
    seniority = 'Staff • Platform Infra';
  } else if (lower.includes('python') || lower.includes('fastapi') || lower.includes('backend python')) {
    job_title = 'Backend Python Developer';
    seniority = 'Mid-Senior • Core API';
  } else if (lower.includes('product manager') || lower.includes('product lead') || lower.includes('roadmap')) {
    job_title = 'Staff Product Manager';
    seniority = 'Staff • Enterprise SaaS';
  } else if (lower.includes('cloud') || lower.includes('sre') || lower.includes('devops')) {
    job_title = 'Senior Cloud Operations & SRE Engineer';
    seniority = 'Senior • Cloud Platform';
  } else if (lower.includes('cyber') || lower.includes('security') || lower.includes('infosec')) {
    job_title = 'Cloud Security Architect';
    seniority = 'Lead • Enterprise Security';
  } else {
    const roleMatch = jdText.match(/role[:\s]+([^\n\r,*]+)/i) || jdText.match(/title[:\s]+([^\n\r,*]+)/i);
    if (roleMatch && roleMatch[1]) {
      job_title = roleMatch[1].replace(/[*#]/g, '').trim();
      seniority = 'Specialist • Custom Track';
    }
  }

  // Generate dynamic skills based on content
  const skills = isJuniorSysEng ? [
    { name: 'Hardware & OS Troubleshooting', category: 'technical' as const },
    { name: 'Network Connectivity (LAN, Wi-Fi, DNS, DHCP)', category: 'technical' as const },
    { name: 'Windows OS Installation & Config', category: 'tools' as const },
    { name: 'IT Support Ticketing & SLA Compliance', category: 'analytical' as const },
    { name: 'Basic Linux Commands & Shell', category: 'tools' as const },
    { name: 'Technical Issue Escalation & Resolution', category: 'analytical' as const },
    { name: 'System Monitoring & Routine Maintenance', category: 'frameworks' as const },
    { name: 'IP Addressing & Subnet Diagnostics', category: 'technical' as const }
  ] : isClickhouseTrack ? [
    { name: 'ClickHouse Analytical Queries', category: 'tools' as const },
    { name: 'SQL Query Optimization', category: 'technical' as const },
    { name: 'Execution Plans & Indexing', category: 'technical' as const },
    { name: 'Exploratory Data Analysis (EDA)', category: 'analytical' as const },
    { name: 'Python (Pandas, NumPy)', category: 'frameworks' as const },
    { name: 'Database Performance Tuning', category: 'technical' as const },
    { name: 'Data Anomaly Detection & Stats', category: 'analytical' as const },
    { name: 'BI Dashboards & POC Research', category: 'tools' as const }
  ] : [
    { name: lower.includes('sql') ? 'SQL Query Optimization' : 'System Architecture', category: 'technical' as const },
    { name: lower.includes('python') ? 'Python / AsyncIO' : 'Data Storytelling', category: 'analytical' as const },
    { name: lower.includes('cloud') ? 'Kubernetes & Docker' : (lower.includes('react') ? 'React & TypeScript' : 'Tableau / Looker'), category: 'tools' as const },
    { name: lower.includes('distributed') ? 'Distributed Systems & ACID' : 'ETL Pipelines', category: 'frameworks' as const },
    { name: 'Statistical Testing & Benchmarks', category: 'analytical' as const },
    { name: lower.includes('kafka') ? 'Event Streams & Kafka' : 'Snowflake DW', category: 'technical' as const },
    { name: 'High Availability (HA) Design', category: 'analytical' as const },
    { name: 'Cohort Retention Analysis', category: 'tools' as const },
  ];

  const responsibilities = isJuniorSysEng ? [
    'Provide first-level technical support for hardware, software, and operating system issues.',
    'Troubleshoot basic network connectivity problems, including LAN, Wi-Fi, DNS, and DHCP.',
    'Install and configure Windows operating systems, business applications, and basic Linux commands.',
    'Create, update, and resolve IT support tickets while strictly adhering to SLA guidelines.',
    'Escalate complex technical issues to senior engineers and maintain system monitoring documentation.'
  ] : isClickhouseTrack ? [
    'Collect, clean, transform, and analyze high-volume data across heterogeneous sources.',
    'Perform exploratory data analysis (EDA) to isolate patterns, trends, and data-quality anomalies.',
    'Write and optimize analytical SQL queries in ClickHouse and examine query execution plans.',
    'Identify database slow query bottlenecks, assist with root-cause analysis, and support research POC initiatives.'
  ] : [
    `Design and maintain scalable ${job_title.toLowerCase()} pipelines and architectural patterns.`,
    'Synthesize complex requirements into high-throughput, fault-tolerant execution milestones.',
    'Partner cross-functionally with Engineering and Leadership to evaluate experiment outcomes.',
    'Audit system latency, memory utilization, and cost metrics for bottleneck resolution.'
  ];

  const topics = isJuniorSysEng ? [
    { title: 'Hardware, Software & OS Diagnostics (Windows & Linux)', count: 3, duration: '10m', pct: '28%' },
    { title: 'Network Connectivity: LAN, Wi-Fi, DNS, DHCP & IP Addressing', count: 3, duration: '12m', pct: '28%' },
    { title: 'IT Helpdesk Ticketing, SLAs & Technical Escalation', count: 2, duration: '8m', pct: '22%' },
    { title: 'System Monitoring, Preventive Maintenance & Routine Documentation', count: 2, duration: '8m', pct: '22%' }
  ] : isClickhouseTrack ? [
    { title: 'ClickHouse Architecture & High-Volume Analytical Queries', count: 3, duration: '12m', pct: '28%' },
    { title: 'SQL Execution Plans & Database Performance Tuning', count: 2, duration: '10m', pct: '22%' },
    { title: 'Exploratory Data Analysis (EDA) & Data Cleansing in Python', count: 2, duration: '8m', pct: '18%' },
    { title: 'Scenario: Diagnosing Slow Analytical Queries & Memory Spills', count: 1, duration: '15m', pct: '32%' }
  ] : [
    { title: `${job_title} Architecture & Core Principles`, count: 3, duration: '12m', pct: '28%' },
    { title: 'Scenario: Fault Tolerance & Edge Cases', count: 2, duration: '10m', pct: '22%' },
    { title: 'Engineering Trade-offs & Mentorship', count: 2, duration: '8m', pct: '18%' },
    { title: 'Deep Dive: System Degradation & Incident Triage', count: 1, duration: '15m', pct: '32%' }
  ];

  return {
    job_title,
    confidence: '98%',
    seniority,
    tokens_processed: Math.floor(1350 + Math.random() * 300),
    latency_ms: Math.floor(210 + Math.random() * 90),
    skills,
    responsibilities,
    topics
  };
}

export function generatePlanForRole(jobTitle: string): InterviewPlanResponse {
  const lower = jobTitle.toLowerCase();
  const isJuniorSysEng = lower.includes('junior system engineer') || (lower.includes('system') && (lower.includes('infrastructure') || lower.includes('support') || lower.includes('hardware') || lower.includes('network') || lower.includes('fresher')));

  if (isJuniorSysEng) {
    return {
      blueprint_title: jobTitle,
      description: `Tailored specifically for Fresher / Entry-Level IT Infrastructure & Operations to validate hardware, network connectivity (LAN/Wi-Fi/DNS/DHCP), OS configuration, IT support ticketing, and problem-solving agility.`,
      total_questions: 10,
      estimated_duration: '~25–30 Mins',
      modules: {
        technical: 5,
        technical_weight: 50,
        scenario: 3,
        scenario_weight: 30,
        behavioral: 2,
        behavioral_weight: 20
      },
      difficulty_distribution: {
        easy_pct: 40,
        medium_pct: 45,
        hard_pct: 15,
        adaptive_level: 'Adaptive Level: Fresher / Entry-Level (0–1 Yrs)'
      },
      topics_matrix: [
        {
          title: 'First-Level Hardware & Operating System Support',
          subtopics: 'Windows 10/11 Installation, Safe Mode, Task Manager, Event Viewer, BSOD',
          questionCount: 3,
          iconName: 'computer',
          category: 'primary'
        },
        {
          title: 'Network Connectivity & Protocol Diagnostics',
          subtopics: 'LAN, Wi-Fi, IP Addressing, DNS Resolution, DHCP Lease & Subnetting',
          questionCount: 3,
          iconName: 'lan',
          category: 'secondary'
        },
        {
          title: 'IT Helpdesk Ticketing, SLAs & Technical Escalation',
          subtopics: 'Incident Prioritization, Root-Cause Documentation, Clear User Communication',
          questionCount: 2,
          iconName: 'confirmation_number',
          category: 'tertiary'
        },
        {
          title: 'Basic Linux Command-Line & Routine System Maintenance',
          subtopics: 'File Permissions, Process Status, Disk Space, Monitoring & Routine Audits',
          questionCount: 2,
          iconName: 'terminal',
          category: 'neutral'
        }
      ],
      rules: [
        'Answer naturally: Use speech via your microphone or type via the integrated response workspace.',
        'Explain step-by-step reasoning: Focus on clear diagnostic methodology, isolation steps, and communication.',
        'No rigid countdown penalty: Take moments to structure your thoughts before explaining solutions.',
        'Real-time feedback: The AI evaluates technical accuracy, practical troubleshooting steps, and customer support empathy.'
      ]
    };
  }

  return {
    blueprint_title: jobTitle,
    description: `Tailored dynamically to validate technical depth, analytical precision, and domain agility for ${jobTitle}.`,
    total_questions: 10,
    estimated_duration: '~25–35 Mins',
    modules: {
      technical: 5,
      technical_weight: 50,
      scenario: 3,
      scenario_weight: 30,
      behavioral: 2,
      behavioral_weight: 20
    },
    difficulty_distribution: {
      easy_pct: 20,
      medium_pct: 50,
      hard_pct: 30,
      adaptive_level: 'Adaptive Level: Mid-Senior'
    },
    topics_matrix: [
      {
        title: 'Core Domain Architecture & Analytical Engines',
        subtopics: 'High-Volume Aggregations, Partitioning, Execution Flow',
        questionCount: 3,
        iconName: 'cloud_sync',
        category: 'primary'
      },
      {
        title: 'Database Optimization & Index Bottlenecks',
        subtopics: 'Query Execution Plans (EXPLAIN), Sorting Keys, Cache Tiers',
        questionCount: 3,
        iconName: 'storage',
        category: 'secondary'
      },
      {
        title: 'Exploratory Analysis, Anomalies & Failure Modes',
        subtopics: 'Data Quality Auditing, Concurrency Limits, Memory Spills',
        questionCount: 2,
        iconName: 'security',
        category: 'tertiary'
      },
      {
        title: 'Proof-of-Concept Research & Cross-Functional Trade-offs',
        subtopics: 'Benchmarking, Stakeholder Reporting, Technical Debt',
        questionCount: 2,
        iconName: 'psychology_alt',
        category: 'neutral'
      }
    ],
    rules: [
      'Answer naturally: Use speech via your microphone or type via the integrated terminal workspace.',
      'Explain step-by-step reasoning: We evaluate mental models and system design choices, not just final answers.',
      'No rigid countdown penalty: Take moments to structure your thoughts. Conversational pauses are natural.',
      'Real-time analysis: The AI evaluates technical depth, precision, clarity, and pragmatic compromise in real time.'
    ]
  };
}

// Extensive question pools to guarantee rich variety without repetition
const CLICKHOUSE_DATA_ANALYST_POOL = [
  {
    category: 'Exploratory Data Analysis',
    topic: 'Data Cleansing & EDA in Python (Pandas/NumPy)',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'When performing exploratory data analysis (EDA) on raw, multi-source datasets using Pandas and NumPy, how do you systematically detect outliers, identify data-quality anomalies, and handle missing values without introducing statistical bias?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Analytical Databases',
    topic: 'ClickHouse Architecture vs. Row-Oriented RDBMS',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'How does ClickHouse achieve sub-second aggregation query performance over billions of records compared to traditional row-oriented relational databases like PostgreSQL or MySQL? What role does columnar compression play?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Database Optimization',
    topic: 'Query Execution Plans & Index Tuning',
    difficulty: 'Hard' as const,
    estimated_minutes: 5,
    question_text: 'When investigating a slow analytical SQL query, walk me through how you examine an execution plan (EXPLAIN). What specific metrics (such as sequential table scans, high memory spill, or hash join costs) tell you where the query bottleneck lies?',
    spoken_audio_duration_sec: 16
  },
  {
    category: 'ClickHouse Engine',
    topic: 'MergeTree Sorting Keys (ORDER BY)',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'In ClickHouse MergeTree engine tables, how do you decide on the primary sorting key (ORDER BY), and why is sorting key column order and cardinality critical for minimizing disk read amplification?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Performance Tuning',
    topic: 'Diagnosing Slow Queries & Memory Spills',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'A critical reporting dashboard executing queries on ClickHouse spikes from 800ms to over 25 seconds during peak analytical load. How would you investigate slow query logs, identify resource bottlenecks, and implement optimizations?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Data Modeling',
    topic: 'Star Schema vs. Denormalized Wide Tables in ClickHouse',
    difficulty: 'Hard' as const,
    estimated_minutes: 4,
    question_text: 'In columnar analytical warehouses like ClickHouse, why are heavily denormalized wide tables often preferred over deeply normalized star or snowflake schemas with multi-table joins? What are the trade-offs in storage and ingestion throughput?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Data Ingestion',
    topic: 'High-Volume Streaming & Ingestion Buffering',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'ClickHouse is optimized for large batch inserts rather than frequent single-row inserts. How do you design an ingestion buffer (e.g., using Buffer engine tables, Kafka engines, or Vector/Flink) to prevent creating excessive small data parts?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'SQL Analytical Functions',
    topic: 'Window Functions & Approximate Aggregations',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'When calculating metrics like daily unique active users or 99th percentile query latencies across tens of millions of events, how do approximate functions like uniqCombined or quantileExactWeighted improve performance over standard COUNT(DISTINCT)?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'ClickHouse Architecture',
    topic: 'Materialized Views & Pre-aggregation Strategies',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'How do Materialized Views work in ClickHouse during insert time, and how would you combine them with SummingMergeTree or AggregatingMergeTree engines to maintain real-time summary dashboards with zero query-time aggregation overhead?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Data Quality & Anomaly Detection',
    topic: 'Automated Data Quality Testing Pipelines',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'How would you implement automated data quality gates (e.g., checking null percentages, schema drift, referential integrity, and value distribution shifts) before raw ingested records become available for business reporting?',
    spoken_audio_duration_sec: 13
  },
  {
    category: 'Database Optimization',
    topic: 'Partitioning Strategy vs. Primary Key in ClickHouse',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'Explain the critical difference between PARTITION BY and ORDER BY in ClickHouse. Why is over-partitioning (e.g., partitioning by day or by hour instead of month) dangerous for the background merge process?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Research & Collaboration',
    topic: 'Proof-of-Concept (POC) & Technology Evaluation',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'Tell me about how you approach a research proof-of-concept (POC) when evaluating a new data science library, database, or algorithm. How do you design benchmarks and present clear recommendations to developers and business stakeholders?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Performance Tuning',
    topic: 'Join Algorithms & Memory Optimization in Analytical SQL',
    difficulty: 'Hard' as const,
    estimated_minutes: 5,
    question_text: 'When performing large-scale joins in ClickHouse, how do hash joins differ from merge joins, and what server settings (such as max_bytes_before_external_join) do you configure to prevent queries from aborting due to out-of-memory errors?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Behavioral & Impact',
    topic: 'Stakeholder Data Storytelling & Dashboard Adoption',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'Describe an instance where your data analysis revealed an unexpected trend or problem that contradicted executive assumptions. How did you validate your findings and communicate the insight convincingly?',
    spoken_audio_duration_sec: 13
  }
];

const DISTRIBUTED_SYSTEMS_POOL = [
  {
    category: 'Technical Architecture',
    topic: 'Core Architecture & Component Coupling',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'When designing the core components for a high-availability distributed service, how do you decouple asynchronous background processing from client-facing latency-critical request paths?',
    spoken_audio_duration_sec: 12
  },
  {
    category: 'Technical Architecture',
    topic: 'Distributed Systems & Caching',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'Given a high-throughput read-heavy service experiencing intermittent cache stampedes, what caching pattern and concurrency control mechanisms would you implement to protect the database layer?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'System Scalability',
    topic: 'Distributed Deadlock & Lock Leases',
    difficulty: 'Hard' as const,
    estimated_minutes: 5,
    question_text: 'In distributed locking implementations across multi-master clusters, what edge conditions can cause race hazards during network partition pauses or garbage collection stops, and how do you remediate them with fencing tokens?',
    spoken_audio_duration_sec: 16
  },
  {
    category: 'Observability & Metrics',
    topic: 'Distributed Tracing & High Cardinality',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'How do you preserve trace context under extreme ingress RPS while retaining high cardinality dimension tags without exhausting storage budgets or degrading ingest telemetry pipelines?',
    spoken_audio_duration_sec: 13
  },
  {
    category: 'Incident Triage',
    topic: 'Cascading Failures & Thundering Herds',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'A critical caching tier restarts abruptly, causing downstream microservices to overwhelm primary database connection pools. Walk me through your first 5 minutes of incident triage and mitigation.',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Data Consistency',
    topic: 'Global Read-After-Write Consistency',
    difficulty: 'Hard' as const,
    estimated_minutes: 5,
    question_text: 'When designing multi-region active-active database clusters, how do you prevent stale reads immediately following an update? What are the tradeoffs of session tokens versus leader leases?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Event-Driven Architecture',
    topic: 'Kafka Partition Rebalancing & Ordering',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'How do you guarantee strict monotonic message ordering across globally distributed Kafka partitions during dynamic consumer group rebalancing without inducing stop-the-world pauses?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Fault Tolerance',
    topic: 'Saga Pattern vs. Two-Phase Commit (2PC)',
    difficulty: 'Hard' as const,
    estimated_minutes: 5,
    question_text: 'Compare the Saga Pattern (choreography vs. orchestration) with Two-Phase Commit (2PC) for cross-service transactions. In what scenarios does 2PC fail under network partitions?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'API & Security',
    topic: 'Rate Limiting & Token Bucket Algorithms',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'How would you architect a global distributed rate limiter that enforces per-user quotas with sub-millisecond overhead across edge Points of Presence (PoPs)?',
    spoken_audio_duration_sec: 13
  },
  {
    category: 'System Design',
    topic: 'Database Connection Pool Exhaustion & Circuit Breakers',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'What metrics and signals indicate that a service connection pool is saturated, and how do exponential backoff with jitter and circuit breaker trip thresholds prevent cascading outage propagation?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Data Structures',
    topic: 'Conflict-Free Replicated Data Types (CRDTs)',
    difficulty: 'Hard' as const,
    estimated_minutes: 5,
    question_text: 'When building collaborative or multi-region applications where network partitions occur, how do state-based and operation-based CRDTs guarantee strong eventual consistency without centralized locks?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Behavioral & Leadership',
    topic: 'Engineering Trade-Offs & Tech Debt',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'Tell me about a time you had to advocate for paying down architectural technical debt against aggressive product release deadlines. How did you quantify the trade-off to executive leadership?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Behavioral & Architecture',
    topic: 'Post-Mortem & Incident Retrospective Culture',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'Walk me through a blameless post-mortem you led or participated in after a major production outage. How did you identify root causes without finger-pointing and ensure corrective action items were prioritized?',
    spoken_audio_duration_sec: 14
  }
];

const JUNIOR_SYSTEM_ENGINEER_POOL = [
  {
    category: 'Network Connectivity',
    topic: 'Physical to Logical Troubleshooting (LAN/Wi-Fi/DHCP)',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'A user calls the IT helpdesk stating their workstation has lost internet access, but their teammates on the same floor are working fine. Walk me through your step-by-step troubleshooting workflow from physical cabling to IP verification.',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Network Protocols',
    topic: 'DHCP Workflow (DORA) & Command-Line Diagnostics',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'Explain how a computer dynamically obtains an IP address using DHCP. Which command-line utilities in Windows and Linux would you use to release, renew, and inspect the network lease?',
    spoken_audio_duration_sec: 13
  },
  {
    category: 'Network Troubleshooting',
    topic: 'DNS Name Resolution vs. IP Connectivity',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'If a user can successfully ping an external IP address (such as 8.8.8.8) but cannot open websites using domain names in their browser, what is likely causing the issue and how would you resolve it using nslookup or hosts configuration?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Operating Systems',
    topic: 'Windows OS Installation, Drivers & Disk Partitioning',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'Describe how you install a clean Windows operating system on a new workstation. How do you handle storage drivers during setup, configure UEFI/GPT partitions, and verify all hardware drivers are properly recognized?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'OS Troubleshooting',
    topic: 'Windows Boot Failures, Safe Mode & Event Viewer',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'A workstation experiences repeated Blue Screen of Death (BSOD) crashes after an automatic update. How do you boot into Safe Mode, inspect Windows Event Viewer logs, and run SFC or DISM commands to restore stability?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'Linux Fundamentals',
    topic: 'Essential Linux CLI Utilities & Permissions',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'Which basic Linux commands do you use to navigate the file system, view running processes, check free disk storage, and modify file read/write permissions? Give specific examples with flags.',
    spoken_audio_duration_sec: 13
  },
  {
    category: 'Hardware Troubleshooting',
    topic: 'Power-On Self-Test (POST) & Component Diagnostics',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'When a desktop computer turns on with spinning fans but shows a blank screen and emits repeated beep codes, what component is typically suspect (e.g. RAM, GPU, CMOS), and how do you systematically test and isolate the fault?',
    spoken_audio_duration_sec: 15
  },
  {
    category: 'IT Service Management',
    topic: 'Ticket Lifecycle & SLA Compliance Guidelines',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'In an IT support environment, how do you manage, document, and prioritize helpdesk tickets according to Service Level Agreements (SLAs)? What details must always be logged before closing a ticket?',
    spoken_audio_duration_sec: 13
  },
  {
    category: 'Escalation Protocols',
    topic: 'Technical Hand-off to Senior Engineers',
    difficulty: 'Medium' as const,
    estimated_minutes: 3,
    question_text: 'When an IT issue cannot be resolved within first-level scope, how do you decide it is time to escalate to senior system or network engineers? What troubleshooting history and diagnostic logs do you compile for a seamless escalation?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'System Maintenance',
    topic: 'Routine Workstation Maintenance & Health Monitoring',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'What routine preventive IT maintenance tasks should be performed on company endpoints to prevent performance degradation, security vulnerabilities, and sudden hardware failure?',
    spoken_audio_duration_sec: 13
  },
  {
    category: 'Performance Diagnostics',
    topic: 'High CPU/Memory Utilization & Resource Bottlenecks',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'An employee complains that their computer freezes whenever they open multiple applications. How do you use Task Manager or Resource Monitor to determine whether the bottleneck is RAM paging, CPU throttling, or a failing mechanical/solid-state drive?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Remote IT Support',
    topic: 'VPN Connectivity & Remote Access Triage',
    difficulty: 'Medium' as const,
    estimated_minutes: 4,
    question_text: 'A remote employee cannot connect to the corporate internal network through the company VPN client, though their home Wi-Fi works for browsing. What diagnostic steps would you walk them through over phone or chat?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'Behavioral & Customer Support',
    topic: 'De-escalating Stressed End-Users & Empathy',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'Describe how you communicate with a non-technical executive or colleague who is angry because an urgent deadline is delayed due to an IT software glitch. How do you maintain professional empathy while resolving the issue?',
    spoken_audio_duration_sec: 14
  },
  {
    category: 'IT Security Basics',
    topic: 'Credential Reset, Phishing Awareness & Endpoint Hygiene',
    difficulty: 'Easy' as const,
    estimated_minutes: 3,
    question_text: 'What security protocols do you follow when verifying an employee identity prior to a password or multi-factor authentication reset? What signs of malware or phishing should first-level IT watch out for?',
    spoken_audio_duration_sec: 13
  }
];

function shufflePool<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateQuestionsForRole(jobTitle: string, totalCount: number = 10): QuestionItem[] {
  const lower = jobTitle.toLowerCase();
  const isJuniorSysEng = lower.includes('junior system engineer') || (lower.includes('system') && (lower.includes('infrastructure') || lower.includes('support') || lower.includes('hardware') || lower.includes('network') || lower.includes('fresher')));
  const isClickhouse = !isJuniorSysEng && (lower.includes('clickhouse') || lower.includes('optimization') || (lower.includes('data') && lower.includes('analyst')));
  const pool = isJuniorSysEng ? JUNIOR_SYSTEM_ENGINEER_POOL : isClickhouse ? CLICKHOUSE_DATA_ANALYST_POOL : DISTRIBUTED_SYSTEMS_POOL;

  // Shuffle pool to ensure questions do not repeat across sessions
  const shuffled = shufflePool(pool);
  const selected = shuffled.slice(0, Math.min(totalCount, shuffled.length));

  return selected.map((q, idx) => ({
    question_id: `q-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
    question_index: idx + 1,
    total_questions: selected.length,
    category: q.category,
    topic: q.topic,
    difficulty: q.difficulty,
    estimated_minutes: q.estimated_minutes,
    question_text: q.question_text,
    spoken_audio_duration_sec: q.spoken_audio_duration_sec
  }));
}

export function evaluateCandidateAnswer(
  qIndex: number,
  answerText: string
): AnswerEvaluationResponse {
  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;
  const lower = answerText.toLowerCase();

  const isDetailed = wordCount >= 25;
  const score = isDetailed ? +(8.0 + Math.min(1.8, wordCount * 0.02)).toFixed(1) : +(5.5 + Math.min(2.0, wordCount * 0.05)).toFixed(1);
  const precision = isDetailed ? Math.min(96, 85 + Math.floor(wordCount * 0.1)) : 68;
  const depth = isDetailed ? Math.min(94, 80 + Math.floor(wordCount * 0.12)) : 60;
  const clarity = isDetailed ? 88 : 72;

  // Dynamically analyze candidate concepts for strengths
  const strengths: string[] = [];
  if (lower.includes('dns') || lower.includes('dhcp') || lower.includes('ip') || lower.includes('ping') || lower.includes('lan') || lower.includes('wi-fi')) {
    strengths.push('Demonstrated methodical network isolation (physical cabling, DHCP lease, DNS resolution, and IP diagnostics).');
  }
  if (lower.includes('windows') || lower.includes('safe mode') || lower.includes('event viewer') || lower.includes('bsod') || lower.includes('sfc')) {
    strengths.push('Effectively leveraged Windows OS diagnostic utilities, safe boot modes, and system log analysis.');
  }
  if (lower.includes('linux') || lower.includes('chmod') || lower.includes('grep') || lower.includes('top') || lower.includes('df')) {
    strengths.push('Articulated correct usage of fundamental Linux command-line utilities and permission inspection.');
  }
  if (lower.includes('hardware') || lower.includes('ram') || lower.includes('post') || lower.includes('motherboard') || lower.includes('beep')) {
    strengths.push('Clear physical hardware troubleshooting methodology (POST beep codes, component isolation, and power verification).');
  }
  if (lower.includes('ticket') || lower.includes('sla') || lower.includes('escalat') || lower.includes('document')) {
    strengths.push('Structured adherence to IT service management SLA guidelines, thorough documentation, and clean senior escalation.');
  }
  if (lower.includes('lock') || lower.includes('mutex') || lower.includes('concurrency')) {
    strengths.push('Demonstrated strong understanding of concurrency control and race condition prevention.');
  }
  if (lower.includes('cache') || lower.includes('redis') || lower.includes('ttl')) {
    strengths.push('Articulated specific caching tier mechanisms and expiration strategies.');
  }
  if (lower.includes('sql') || lower.includes('index') || lower.includes('explain') || lower.includes('query')) {
    strengths.push('Showed solid grasp of query plan diagnostics, execution cost bottlenecks, and indexing.');
  }
  if (lower.includes('clickhouse') || lower.includes('columnar')) {
    strengths.push('Effectively leveraged ClickHouse columnar architecture and aggregation primitives.');
  }
  if (lower.includes('eda') || lower.includes('pandas') || lower.includes('numpy') || lower.includes('outlier')) {
    strengths.push('Structured systematic exploratory data analysis (EDA) and outlier handling workflow.');
  }
  if (strengths.length === 0) {
    strengths.push('Clearly communicated practical troubleshooting steps and step-by-step reasoning.');
    strengths.push('Directly addressed core diagnostic questions with good logical structure.');
  }

  // Identify nuance gaps
  const areas: string[] = [];
  if (!lower.includes('document') && !lower.includes('log') && !lower.includes('ticket')) {
    areas.push('Remember to mention logging troubleshooting steps and user updates in the ticketing system.');
  }
  if (!lower.includes('escalat') && !lower.includes('sla')) {
    areas.push('Could specify clear SLA escalation criteria when first-level resolution thresholds are reached.');
  }
  if (areas.length === 0) {
    areas.push('Could include additional preventative maintenance checks to prevent recurrence.');
  }

  return {
    score: Math.min(10, score),
    max_score: 10,
    verdict: score >= 8.0 ? 'Correct & High Quality' : 'Adequate with Areas for Growth',
    precision_pct: precision,
    depth_pct: depth,
    clarity_pct: clarity,
    strengths,
    areas_for_improvement: areas,
    evaluator_assessment: `"Your response demonstrated clear diagnostic methodology and sound technical troubleshooting. Following up with thorough ticket documentation and SLA awareness reinforces high-quality IT support."`,
    latency_seconds: 1.2,
    rubric_level: 'IT Infrastructure Rubric',
    follow_up_generated: qIndex === 2 ? {
      topic: 'Network Diagnostic Verification',
      question_text: `"Could you elaborate on how you would confirm the default gateway is responding before checking upstream DNS servers?"`
    } : undefined,
    next_action: qIndex === 2 ? 'follow_up' : (qIndex >= 10 ? 'complete' : 'next_question')
  };
}

export function generateFinalReport(
  sessionId: string,
  jobTitle: string,
  candidateAnswers?: Record<number, { question: QuestionItem; answer: string; evaluation: AnswerEvaluationResponse }>,
  sessionQuestions?: QuestionItem[],
  candidateName?: string,
  durationSeconds?: number
): InterviewResultResponse {
  const answerEntries = candidateAnswers ? Object.values(candidateAnswers) : [];
  const lower = jobTitle.toLowerCase();
  const isJuniorSysEng = lower.includes('junior system engineer') || (lower.includes('system') && (lower.includes('infrastructure') || lower.includes('support') || lower.includes('hardware') || lower.includes('network') || lower.includes('fresher')));
  const isClickhouse = !isJuniorSysEng && (lower.includes('clickhouse') || lower.includes('optimization') || (lower.includes('data') && lower.includes('analyst')));

  const name = candidateName || 'Candidate';

  // LIVE INTERVIEW CASE: Calculate dynamically from candidate's actual answers & scores
  if (answerEntries.length > 0) {
    const questionsAnswered = answerEntries.length;
    const totalQuestions = sessionQuestions?.length || answerEntries[0]?.question.total_questions || Math.max(questionsAnswered, 10);
    
    // Sum real scores
    const totalPoints = answerEntries.reduce((sum, item) => sum + (item.evaluation?.score || 0), 0);
    const maxPoints = questionsAnswered * 10;
    const overallScorePct = Math.min(100, Math.max(10, Math.round((totalPoints / maxPoints) * 100)));

    // Real accuracy ratio based on passing score (>= 7.5)
    const passCount = answerEntries.filter((item) => (item.evaluation?.score || 0) >= 7.5).length;
    const nuancedCount = questionsAnswered - passCount;
    const accuracyRatio = `${passCount} : ${nuancedCount}`;
    const accuracyDetail = `${passCount} Pass • ${nuancedCount} Nuanced`;

    // Real or calculated pace
    const totalSec = durationSeconds && durationSeconds > 0 ? durationSeconds : questionsAnswered * 135;
    const avgSec = Math.max(30, Math.round(totalSec / questionsAnswered));
    const avgPace = `${Math.floor(avgSec / 60)}m ${avgSec % 60}s`;

    const durationMin = Math.max(1, Math.round(totalSec / 60));
    const durationStr = `${durationMin}m ${totalSec % 60}s`;

    // Real Candidate verdict
    let candidateVerdict = 'Strong Hire / High Readiness';
    if (overallScorePct >= 90) candidateVerdict = 'Exceptional Hire / Top Percentile';
    else if (overallScorePct >= 80) candidateVerdict = 'Strong Hire / High Readiness';
    else if (overallScorePct >= 70) candidateVerdict = 'Hire / Solid Technical Competence';
    else if (overallScorePct >= 55) candidateVerdict = 'Borderline / Needs Mentorship';
    else candidateVerdict = 'Needs Foundational Skill Building';

    // Real Domain Mastery by category
    const categoryMap = new Map<string, number[]>();
    answerEntries.forEach((item) => {
      const cat = item.question.category || 'Core Technical';
      if (!categoryMap.has(cat)) categoryMap.set(cat, []);
      categoryMap.get(cat)!.push(item.evaluation?.score || 0);
    });

    let domainMastery = Array.from(categoryMap.entries()).map(([domain, scores], idx) => {
      const avg = Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 10)) * 100);
      const colorClass = idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-secondary' : 'bg-tertiary';
      return { domain, score_pct: Math.min(100, Math.max(20, avg)), colorClass };
    });

    // If fewer than 3 domains, supplement with role-specific benchmarks
    if (domainMastery.length < 3) {
      if (isJuniorSysEng) {
        if (!categoryMap.has('Hardware & Operating Systems')) {
          domainMastery.push({ domain: 'Hardware & OS Troubleshooting', score_pct: Math.min(100, overallScorePct + 2), colorClass: 'bg-primary' });
        }
        if (!categoryMap.has('Network Connectivity')) {
          domainMastery.push({ domain: 'Network Connectivity (LAN/Wi-Fi/DHCP)', score_pct: Math.min(100, overallScorePct - 3), colorClass: 'bg-secondary' });
        }
        if (!categoryMap.has('IT Helpdesk & SLAs')) {
          domainMastery.push({ domain: 'IT Helpdesk & SLA Compliance', score_pct: Math.min(100, overallScorePct + 1), colorClass: 'bg-tertiary' });
        }
      } else if (isClickhouse) {
        if (!categoryMap.has('Analytical Queries')) {
          domainMastery.push({ domain: 'ClickHouse Aggregations & Storage', score_pct: Math.min(100, overallScorePct + 3), colorClass: 'bg-primary' });
        }
        if (!categoryMap.has('Query Optimization')) {
          domainMastery.push({ domain: 'SQL Query Optimization & Indexes', score_pct: Math.min(100, overallScorePct - 2), colorClass: 'bg-secondary' });
        }
        if (!categoryMap.has('Exploratory Data Analysis')) {
          domainMastery.push({ domain: 'Exploratory Data Analysis (EDA)', score_pct: Math.min(100, overallScorePct + 1), colorClass: 'bg-tertiary' });
        }
      } else {
        domainMastery.push(
          { domain: 'System Architecture & Scalability', score_pct: Math.min(100, overallScorePct + 2), colorClass: 'bg-primary' },
          { domain: 'Data Consistency & ACID', score_pct: Math.min(100, overallScorePct - 4), colorClass: 'bg-secondary' },
          { domain: 'Incident Triage & Observability', score_pct: Math.min(100, overallScorePct - 1), colorClass: 'bg-tertiary' }
        );
      }
      domainMastery = domainMastery.slice(0, 3);
    }

    // Collect real candidate strengths
    const allStrengths = answerEntries.flatMap((item) => item.evaluation?.strengths || []);
    const uniqueStrengths = Array.from(new Set(allStrengths));
    const demonstratedStrengths = uniqueStrengths.length > 0
      ? uniqueStrengths.slice(0, 3).join(' ')
      : isJuniorSysEng
      ? 'Demonstrated systematic physical-to-logical network troubleshooting and Windows OS diagnostic command usage.'
      : 'Articulated solid architectural reasoning and structured problem-solving across core scenarios.';

    // Collect real candidate areas for improvement
    const allAreas = answerEntries.flatMap((item) => item.evaluation?.areas_for_improvement || []);
    const uniqueAreas = Array.from(new Set(allAreas));
    const targetedAreas = uniqueAreas.length > 0
      ? uniqueAreas.slice(0, 3).join(' ')
      : isJuniorSysEng
      ? 'Remember to proactively document ticket escalation criteria and preventive patch cadence.'
      : 'Consider further quantifying P99 tail latency trade-offs and automated circuit breakers.';

    // Dynamic AI recommendations tailored to role
    const aiRecommendations = isJuniorSysEng
      ? 'Focus on documenting ticket root causes clearly in the helpdesk portal and practicing command-line network diagnostics (ipconfig, ping, tracert, nslookup) to accelerate SLA resolution times.'
      : isClickhouse
      ? 'Deepen familiarity with ClickHouse MergeTree sorting key cardinality trade-offs and optimizing memory limits on analytical joins.'
      : 'Lead with quantitative latency numbers when presenting caching solutions and outline automated circuit breakers during service dependency failures.';

    // Real Question Audit built directly from actual questions and answers
    const questionAudit: QuestionAuditItem[] = answerEntries.map((item, idx) => {
      const qNum = item.question.question_index || idx + 1;
      const cleanExcerpt = item.answer.trim().length > 0
        ? (item.answer.length > 180 ? item.answer.slice(0, 180) + '...' : item.answer)
        : 'Answer submitted via voice dictation';

      return {
        id: `qa-${qNum}`,
        question_number: qNum,
        category: item.question.category,
        topic: item.question.topic,
        score: Math.round(item.evaluation?.score || 8),
        max_score: 10,
        prompt: `"${item.question.question_text}"`,
        answer_excerpt: `"${cleanExcerpt}"`,
        strengths: item.evaluation?.strengths?.[0] || 'Clear diagnostic methodology and step-by-step reasoning.',
        missing_points: item.evaluation?.areas_for_improvement?.[0] || 'Include additional SLA documentation.'
      };
    });

    return {
      session_id: sessionId,
      job_title: jobTitle,
      completed_at: `Completed Today • ${durationStr} duration`,
      duration_str: durationStr,
      overall_score_pct: overallScorePct,
      total_points: Math.round(totalPoints * 10) / 10,
      max_points: maxPoints,
      candidate_verdict: candidateVerdict,
      candidate_name: name,
      candidate_avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      questions_answered: questionsAnswered,
      total_questions: totalQuestions,
      accuracy_ratio: accuracyRatio,
      accuracy_detail: accuracyDetail,
      avg_pace: avgPace,
      domain_mastery: domainMastery,
      demonstrated_strengths: demonstratedStrengths,
      targeted_areas_for_improvement: targetedAreas,
      ai_recommendations: aiRecommendations,
      proctor_verified: true,
      question_audit: questionAudit
    };
  }

  // FALLBACK / HISTORICAL PREVIEW CASE: Dynamically tailored to role
  if (isJuniorSysEng) {
    const overallScore = 84;
    return {
      session_id: sessionId,
      job_title: 'Junior System Engineer',
      completed_at: 'Completed Today • 21m 40s duration',
      duration_str: '21m 40s',
      overall_score_pct: overallScore,
      total_points: 84,
      max_points: 100,
      candidate_verdict: 'Strong Hire / High Readiness',
      candidate_name: name,
      candidate_avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      questions_answered: 10,
      total_questions: 10,
      accuracy_ratio: '8 : 2',
      accuracy_detail: '8 Pass • 2 Nuanced',
      avg_pace: '2m 10s',
      domain_mastery: [
        { domain: 'Hardware & OS Troubleshooting', score_pct: 88, colorClass: 'bg-primary' },
        { domain: 'Network Connectivity (LAN/DNS/DHCP)', score_pct: 82, colorClass: 'bg-secondary' },
        { domain: 'IT Helpdesk & SLA Compliance', score_pct: 80, colorClass: 'bg-tertiary' }
      ],
      demonstrated_strengths: 'Demonstrated methodical step-by-step network isolation from physical cabling to IP lease and DNS resolution. Strong practical command of Windows diagnostic tools (Safe Mode, Event Viewer, SFC/DISM).',
      targeted_areas_for_improvement: 'Ensure precise escalation guidelines and detailed logging in ticketing systems prior to handing issues off to senior network engineers.',
      ai_recommendations: 'Focus on practicing command-line network inspection utilities and documenting root causes thoroughly to maximize first-touch resolution rates.',
      proctor_verified: true,
      question_audit: [
        {
          id: 'qa-1',
          question_number: 1,
          category: 'Network Connectivity',
          topic: 'Workstation Internet Connectivity Loss',
          score: 9,
          max_score: 10,
          prompt: '"A user calls stating workstation has lost internet access while teammates in the same room are fine. Walk through troubleshooting."',
          answer_excerpt: '"I check Ethernet physical link lights, run ipconfig /all to check for 169.254 APIPA IP, ping default gateway, then ping 8.8.8.8 and test DNS..."',
          strengths: 'Methodical OSI layer isolation from physical cable to IP and DNS.',
          missing_points: 'Could mention checking switch port status on managed switches.'
        },
        {
          id: 'qa-2',
          question_number: 2,
          category: 'Network Protocols',
          topic: 'DHCP Workflow (DORA) & Command Tools',
          score: 8,
          max_score: 10,
          prompt: '"Explain how a computer dynamically obtains an IP address using DHCP and the command-line tools to release/renew."',
          answer_excerpt: '"DHCP uses Discover, Offer, Request, Acknowledge (DORA). On Windows I use ipconfig /release and ipconfig /renew. On Linux, dhclient -r..."',
          strengths: 'Accurately stated DORA process and correct command flags.',
          missing_points: 'Did not specify broadcast vs unicast communication stages.'
        },
        {
          id: 'qa-3',
          question_number: 3,
          category: 'OS Troubleshooting',
          topic: 'Windows Boot Failures & BSOD',
          score: 9,
          max_score: 10,
          prompt: '"A workstation experiences repeated BSOD crashes after an update. How do you inspect Event Viewer and run repair tools?"',
          answer_excerpt: '"I boot into Safe Mode with Networking, check Event Viewer under System logs for BugCheck codes, then run sfc /scannow and DISM /Online /Cleanup-Image /RestoreHealth..."',
          strengths: 'Correctly executed SFC and DISM in Safe Mode and checked minidump logs.',
          missing_points: 'Remember to check memory integrity with Windows Memory Diagnostic.'
        },
        {
          id: 'qa-4',
          question_number: 4,
          category: 'Linux Fundamentals',
          topic: 'Essential CLI Commands & Permissions',
          score: 8,
          max_score: 10,
          prompt: '"Which basic Linux commands do you use to view processes, disk storage, and modify permissions?"',
          answer_excerpt: '"I use df -h for disk space, top or ps aux for running processes, and chmod with numeric or symbolic flags for file permissions..."',
          strengths: 'Correct usage of df -h, ps aux, and chmod octal modes.',
          missing_points: 'Could have detailed checking systemd service logs via journalctl -xe.'
        },
        {
          id: 'qa-5',
          question_number: 5,
          category: 'IT Service Management',
          topic: 'Ticket Lifecycle & SLA Compliance',
          score: 8,
          max_score: 10,
          prompt: '"How do you manage, document, and prioritize helpdesk tickets according to SLAs?"',
          answer_excerpt: '"Prioritize by urgency and business impact (P1 outage vs P4 inquiry). Keep user informed with timely updates before SLA breach, log resolution steps before closing..."',
          strengths: 'Customer empathy and adherence to SLA breach timers.',
          missing_points: 'Include tagging ticket categories for recurring problem trend analysis.'
        },
        {
          id: 'qa-6',
          question_number: 6,
          category: 'Hardware Troubleshooting',
          topic: 'POST Beep Codes & Fault Isolation',
          score: 8,
          max_score: 10,
          prompt: '"When a desktop PC turns on with fans spinning but emits repeated beep codes with no display, how do you diagnose?"',
          answer_excerpt: '"Check motherboard manual for beep code pattern (often RAM reseating needed). Test RAM sticks individually in slots, check 24-pin and 8-pin CPU power..."',
          strengths: 'Systematic component isolation starting with memory and power rails.',
          missing_points: 'Remember to reset CMOS battery if BIOS settings are corrupted.'
        }
      ]
    };
  }

  if (isClickhouse) {
    const overallScore = 86;
    return {
      session_id: sessionId,
      job_title: 'Data Analyst & Database Optimization Associate',
      completed_at: 'Completed Today • 23m 15s duration',
      duration_str: '23m 15s',
      overall_score_pct: overallScore,
      total_points: 86,
      max_points: 100,
      candidate_verdict: 'Strong Hire / High Readiness',
      candidate_name: name,
      candidate_avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      questions_answered: 10,
      total_questions: 10,
      accuracy_ratio: '8 : 2',
      accuracy_detail: '8 Pass • 2 Nuanced',
      avg_pace: '2m 19s',
      domain_mastery: [
        { domain: 'ClickHouse Query Tuning', score_pct: 90, colorClass: 'bg-primary' },
        { domain: 'SQL Execution Plans & Indexing', score_pct: 85, colorClass: 'bg-secondary' },
        { domain: 'Exploratory Data Analysis (EDA)', score_pct: 82, colorClass: 'bg-tertiary' }
      ],
      demonstrated_strengths: 'Strong grasp of ClickHouse MergeTree columnar compression and sorting key (ORDER BY) cardinality. Clean approach to exploratory analysis and anomaly detection in Python.',
      targeted_areas_for_improvement: 'Deepen understanding of external dictionary joins and tuning max_bytes_before_external_join during peak aggregations.',
      ai_recommendations: 'Continue exploring Materialized Views combined with SummingMergeTree to eliminate real-time aggregation overhead on high-frequency dashboards.',
      proctor_verified: true,
      question_audit: [
        {
          id: 'qa-1',
          question_number: 1,
          category: 'Analytical Databases',
          topic: 'ClickHouse Columnar Architecture vs RDBMS',
          score: 9,
          max_score: 10,
          prompt: '"How does ClickHouse achieve sub-second aggregation query performance over billions of records compared to traditional RDBMS?"',
          answer_excerpt: '"By storing columns contiguously on disk with compression (LZ4/ZSTD), ClickHouse avoids reading irrelevant columns during aggregate calculations..."',
          strengths: 'Detailed explanation of vectorized execution and columnar disk I/O savings.',
          missing_points: 'Did not cite specific SIMD instruction utilization.'
        },
        {
          id: 'qa-2',
          question_number: 2,
          category: 'Database Optimization',
          topic: 'Query Execution Plans & Index Tuning',
          score: 8,
          max_score: 10,
          prompt: '"When investigating a slow analytical SQL query, walk me through how you examine an execution plan (EXPLAIN)."',
          answer_excerpt: '"I inspect EXPLAIN indexes = 1 to see how many granules are selected versus skipped, and look for high memory parts being read into RAM..."',
          strengths: 'Clear knowledge of ClickHouse granule skipping and sparse primary indexes.',
          missing_points: 'Could detail join pipeline operator memory consumption.'
        }
      ]
    };
  }

  // Default Distributed Systems / Engineering fallback
  return {
    session_id: sessionId,
    job_title: jobTitle,
    completed_at: 'Completed Today • 24m 18s duration',
    duration_str: '24m 18s',
    overall_score_pct: 88,
    total_points: 88,
    max_points: 100,
    candidate_verdict: 'Strong Hire / High Readiness',
    candidate_name: name,
    candidate_avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    questions_answered: 10,
    total_questions: 10,
    accuracy_ratio: '9 : 1',
    accuracy_detail: '9 Pass • 1 Nuanced',
    avg_pace: '2m 14s',
    domain_mastery: [
      { domain: 'System Design & Scalability', score_pct: 92, colorClass: 'bg-primary' },
      { domain: 'Data Consistency & ACID', score_pct: 85, colorClass: 'bg-secondary' },
      { domain: 'Incident Triage & Observability', score_pct: 80, colorClass: 'bg-tertiary' }
    ],
    demonstrated_strengths: 'Articulated sophisticated consensus tradeoffs under extreme network partitioning. Excellent architectural precision when decoupling write-heavy telemetry pipelines.',
    targeted_areas_for_improvement: 'Ensure fencing tokens and epoch counters are explicitly cited earlier in distributed locks to avoid split-brain hazard.',
    ai_recommendations: 'Lead with business-impact numbers when presenting caching compromises and quantify memory overhead vs network transit cost.',
    proctor_verified: true,
    question_audit: [
      {
        id: 'qa-1',
        question_number: 1,
        category: 'Architecture',
        topic: 'High-throughput microservices event ordering',
        score: 9,
        max_score: 10,
        prompt: '"How do you ensure strict monotonic message ordering across globally distributed Kafka partitions during dynamic consumer group rebalancing?"',
        answer_excerpt: '"I instituted key-based deterministic hashing alongside transactional producer IDs and cooperative sticky assignors to prevent partition pauses..."',
        strengths: 'Accurately detailed CooperativeStickyAssignor behavior to eliminate stop-the-world partition revocations.',
        missing_points: 'Did not quantify end-to-end P99 tail latency impact when cross-DC mirror-maker clusters lag.'
      }
    ]
  };
}
