import { NextResponse } from "next/server";

/**
 * Unified AI endpoint for ResumeX tools.
 *
 * Body: { task, input, context?, language? }
 *   task: 'generate' | 'rewrite' | 'summary' | 'jd_optimize' | 'skills' | 'cover_letter' | 'suggest'
 *
 * If process.env.ANTHROPIC_API_KEY is set -> calls the real Anthropic Messages API.
 * Otherwise -> returns a high-quality SIMULATED result with { simulated: true }.
 */

type AITask =
  | "generate"
  | "rewrite"
  | "summary"
  | "jd_optimize"
  | "skills"
  | "cover_letter"
  | "suggest";

const VALID_TASKS: AITask[] = [
  "generate",
  "rewrite",
  "summary",
  "jd_optimize",
  "skills",
  "cover_letter",
  "suggest",
];

const ANTHROPIC_MODEL = "claude-sonnet-4-6";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// Task-specific system prompts steer the live model toward resume-grade output.
function systemPrompt(task: AITask, language?: string): string {
  const lang =
    language && language !== "en"
      ? ` Always respond in the language with code "${language}".`
      : "";

  const base =
    "You are ResumeX AI, an expert career coach and professional resume writer. " +
    "Write concise, ATS-friendly, achievement-oriented content. Avoid clichés and filler. " +
    "Use strong action verbs and quantify impact where plausible. Return only the requested content with no preamble, headers, or explanations." +
    lang;

  switch (task) {
    case "generate":
      return (
        base +
        " The user gives a role/background. Produce a complete, polished resume body in clean plain text " +
        "with clearly labelled sections (Summary, Experience, Education, Skills). Use bullet points for experience."
      );
    case "rewrite":
      return (
        base +
        " Rewrite the provided text to be more impactful, professional, and concise while preserving the original meaning and facts. Keep a similar length."
      );
    case "summary":
      return (
        base +
        " Produce a compelling 3-4 sentence professional summary for the top of a resume, written in the first person implied (no 'I'), tailored to the user's background."
      );
    case "jd_optimize":
      return (
        base +
        " Given resume text and a target job description (in context), rewrite the resume text to align with the job's keywords, requirements, and tone for better ATS matching. Be honest — do not invent experience."
      );
    case "skills":
      return (
        base +
        " Recommend a focused list of 10-15 relevant hard and soft skills for the given role/background. Return a comma-separated list only, ordered by relevance."
      );
    case "cover_letter":
      return (
        base +
        " Write a tailored, confident, one-page cover letter (3-4 short paragraphs) for the role and background provided. Keep it warm but professional. Do not include placeholder brackets unless essential."
      );
    case "suggest":
      return (
        base +
        " Provide 3-5 specific, actionable suggestions to improve the provided resume content or section. Return a short bulleted list."
      );
    default:
      return base;
  }
}

function buildUserMessage(input: string, context?: unknown): string {
  if (context == null) return input;
  let ctxText: string;
  if (typeof context === "string") {
    ctxText = context;
  } else {
    try {
      ctxText = JSON.stringify(context, null, 2);
    } catch {
      ctxText = String(context);
    }
  }
  if (!ctxText || ctxText === "{}" || ctxText === "null") return input;
  return `${input}\n\n--- Context ---\n${ctxText}`;
}

// ── SIMULATED RESPONSES ──────────────────────────────────────────────
// Used when no ANTHROPIC_API_KEY is configured. Templated but genuinely useful.
function simulate(task: AITask, input: string, language?: string): string {
  const ar = language === "ar";
  const subject = input.trim() || (ar ? "ملفك المهني" : "your profile");

  switch (task) {
    case "generate":
      if (ar) {
        return `الملخص المهني\nمحترف نتائجي يتمتع بخبرة في ${subject}، مع سجل مثبت في تحقيق قيمة قابلة للقياس.\n\nالخبرة العملية\n• قاد مبادرات استراتيجية مرتبطة بـ${subject}، مما رفع الكفاءة بنسبة 30%.\n• تعاون مع فرق متعددة التخصصات لتسليم مشاريع عالية الأثر في الموعد المحدد.\n• حسّن العمليات التشغيلية وخفض التكاليف مع الحفاظ على الجودة.\n\nالتعليم\n• درجة ذات صلة في المجال مع تكريم أكاديمي.\n\nالمهارات\nالقيادة • حل المشكلات • التواصل • إدارة المشاريع • التحليل`;
      }
      return `PROFESSIONAL SUMMARY\nResults-driven professional with hands-on experience in ${subject}, bringing a proven record of delivering measurable value and leading high-impact work.\n\nEXPERIENCE\n• Spearheaded strategic initiatives around ${subject}, improving efficiency by ~30%.\n• Partnered with cross-functional teams to ship high-impact projects on schedule.\n• Streamlined operational workflows, reducing costs while raising quality standards.\n\nEDUCATION\n• Relevant degree with academic honors and applied coursework.\n\nSKILLS\nLeadership • Problem-Solving • Communication • Project Management • Data Analysis`;

    case "rewrite":
      if (ar) {
        return `قُدت بنجاح ${subject}، مما أدى إلى تحسينات ملموسة في الكفاءة والجودة. تعاونت بشكل وثيق مع أصحاب المصلحة لتحقيق الأهداف ضمن الجداول الزمنية المحددة، مع الحفاظ على أعلى معايير الأداء.`;
      }
      return `Successfully led ${subject}, driving tangible improvements in efficiency and quality. Collaborated closely with stakeholders to meet objectives within set timelines while maintaining the highest standards of performance.`;

    case "summary":
      if (ar) {
        return `محترف طموح ومتمكن في ${subject}، يتمتع بقدرة مثبتة على تحقيق نتائج استثنائية. يجمع بين التفكير التحليلي ومهارات التواصل القوية لدفع الأهداف الاستراتيجية. يسعى لتوظيف خبرته في بيئة ديناميكية تقدّر الابتكار والتميز.`;
      }
      return `Accomplished professional specializing in ${subject}, with a proven ability to deliver exceptional results. Combines analytical thinking with strong communication skills to drive strategic goals forward. Eager to apply deep expertise within a dynamic environment that values innovation and excellence.`;

    case "jd_optimize":
      if (ar) {
        return `نسخة محسّنة لمطابقة الوصف الوظيفي:\n• أعِد صياغة خبرتك في ${subject} باستخدام الكلمات المفتاحية الواردة في الإعلان الوظيفي.\n• أبرز الإنجازات القابلة للقياس التي تتوافق مع المتطلبات الأساسية للوظيفة.\n• حاذِ نبرة سيرتك الذاتية مع ثقافة الشركة وأولوياتها لزيادة فرص اجتياز أنظمة التتبع (ATS).`;
      }
      return `ATS-optimized version aligned to the target role:\n• Reframed your ${subject} experience using the exact keywords from the job description.\n• Surfaced quantifiable achievements that map to the role's core requirements.\n• Tuned the resume's tone to the company's culture and priorities to improve ATS pass-through and recruiter resonance.`;

    case "skills":
      if (ar) {
        return `مهارات موصى بها لـ${subject}:\nالقيادة، إدارة المشاريع، التفكير التحليلي، حل المشكلات، التواصل الفعّال، العمل الجماعي، إدارة الوقت، التكيف، التفاوض، اتخاذ القرار، الكفاءة التقنية، إدارة أصحاب المصلحة`;
      }
      return `Recommended skills for ${subject}:\nLeadership, Project Management, Analytical Thinking, Problem-Solving, Effective Communication, Team Collaboration, Time Management, Adaptability, Stakeholder Management, Strategic Planning, Data-Driven Decision Making, Technical Proficiency`;

    case "cover_letter":
      if (ar) {
        return `عزيزي مدير التوظيف،\n\nيسعدني التقدم لهذا الدور. خلفيتي في ${subject} زوّدتني بالخبرة والشغف اللازمين لإحداث أثر فوري في فريقكم.\n\nطوال مسيرتي، قدّمت نتائج قابلة للقياس من خلال الجمع بين التفكير الاستراتيجي والتنفيذ الدقيق. أنا واثق من أن مهاراتي تتوافق تمامًا مع احتياجاتكم.\n\nأتطلع لمناقشة كيف يمكنني المساهمة في نجاح مؤسستكم. شكرًا لوقتكم واهتمامكم.\n\nمع خالص التقدير`;
      }
      return `Dear Hiring Manager,\n\nI am excited to apply for this role. My background in ${subject} has equipped me with the experience and drive to make an immediate impact on your team.\n\nThroughout my career, I have consistently delivered measurable results by pairing strategic thinking with meticulous execution. I am confident that my skill set aligns closely with what you are looking for, and I would bring genuine commitment and energy to the position.\n\nI would welcome the opportunity to discuss how I can contribute to your organization's continued success. Thank you for your time and consideration.\n\nSincerely`;

    case "suggest":
      if (ar) {
        return `اقتراحات لتحسين ${subject}:\n• ابدأ كل نقطة بفعل حركة قوي (قاد، طوّر، حسّن).\n• أضف أرقامًا ومقاييس لتحديد أثرك بوضوح.\n• أزل العبارات العامة وركّز على الإنجازات الملموسة.\n• خصّص المحتوى ليتطابق مع الكلمات المفتاحية للوظيفة المستهدفة.`;
      }
      return `Suggestions to improve ${subject}:\n• Start every bullet with a strong action verb (Led, Built, Optimized).\n• Add numbers and metrics to quantify your impact clearly.\n• Remove generic phrases and focus on concrete, outcome-based achievements.\n• Tailor the content to mirror the keywords of your target role.\n• Keep bullets to one or two lines for maximum scannability.`;

    default:
      return input;
  }
}

async function callAnthropic(
  apiKey: string,
  task: AITask,
  input: string,
  context?: unknown,
  language?: string
): Promise<string> {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: systemPrompt(task, language),
      messages: [
        {
          role: "user",
          content: buildUserMessage(input, context),
        },
      ],
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(
      `Anthropic API error ${res.status}: ${detail.slice(0, 500) || res.statusText}`
    );
  }

  const data = await res.json();
  // Messages API returns { content: [{ type: 'text', text: '...' }, ...] }
  const text =
    Array.isArray(data?.content) &&
    data.content
      .filter((b: { type?: string }) => b?.type === "text")
      .map((b: { text?: string }) => b.text ?? "")
      .join("\n")
      .trim();

  if (!text) {
    throw new Error("Anthropic API returned no text content");
  }
  return text;
}

export async function POST(req: Request) {
  try {
    let body: {
      task?: string;
      input?: string;
      context?: unknown;
      language?: string;
    };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { task, input, context, language } = body;

    if (!task || !VALID_TASKS.includes(task as AITask)) {
      return NextResponse.json(
        {
          error: `Invalid task. Expected one of: ${VALID_TASKS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const safeInput = typeof input === "string" ? input : "";
    // 'generate' / 'skills' can run from context alone, but most tasks need input.
    if (!safeInput.trim() && task !== "generate" && task !== "skills") {
      return NextResponse.json(
        { error: "Input is required for this task" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        const result = await callAnthropic(
          apiKey,
          task as AITask,
          safeInput,
          context,
          language
        );
        return NextResponse.json({ result });
      } catch (err) {
        console.error("Anthropic call failed, falling back to simulation:", err);
        // Graceful degradation: never hard-fail the UI if the provider hiccups.
        const result = simulate(task as AITask, safeInput, language);
        return NextResponse.json({
          result,
          simulated: true,
          error: "Live AI unavailable, showing a generated draft instead.",
        });
      }
    }

    // No key configured → simulated demo mode.
    // Small latency so the loading state reads as real work.
    await new Promise((resolve) => setTimeout(resolve, 900));
    const result = simulate(task as AITask, safeInput, language);
    return NextResponse.json({ result, simulated: true });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI content" },
      { status: 500 }
    );
  }
}
