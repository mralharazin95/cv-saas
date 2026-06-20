import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, type, language } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // SIMULATED AI RESPONSE (Since no API key is provided)
    // In production, replace this with an actual call to OpenAI/Anthropic/Gemini
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API latency

    let improvedText = text;

    if (type === "summary") {
      if (language === "ar") {
        improvedText = `مُتخصص طموح وذو خبرة في مجالي، أمتلك قدرة مثبتة على تحقيق نتائج استثنائية. ${text} أطمح لتوظيف مهاراتي في بيئة عمل ديناميكية لتحقيق أهداف المؤسسة وتطوير مسيرتي المهنية.`;
      } else {
        improvedText = `Results-driven professional with a proven track record of delivering exceptional value. ${text} I am eager to leverage my diverse skill set within a dynamic team environment to drive strategic goals and continuous improvement.`;
      }
    } else if (type === "experience") {
      if (language === "ar") {
        improvedText = `• قمت بتنفيذ المبادرات الاستراتيجية بنجاح: ${text}\n• حسّنت العمليات التشغيلية، مما أدى إلى زيادة الكفاءة.\n• تعاونت مع فرق متعددة التخصصات لتحقيق وتسليم مشاريع عالية الجودة.`;
      } else {
        improvedText = `• Successfully spearheaded strategic initiatives: ${text}\n• Optimized operational workflows, significantly increasing overall efficiency.\n• Collaborated with cross-functional teams to deliver high-quality project milestones on schedule.`;
      }
    }

    return NextResponse.json({ improvedText });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
