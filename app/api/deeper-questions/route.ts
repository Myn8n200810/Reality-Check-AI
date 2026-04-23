import { NextResponse } from "next/server";
import { model } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body.input;
    const result = body.result;

    if (!input || !input.trim()) {
      return NextResponse.json(
        { error: "Original input is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are Reality Check AI.

Your job is to generate 3 short, highly useful follow-up questions that help improve a decision-risk analysis.

You are NOT giving the final decision here.
You are ONLY asking questions that would most improve the quality of the decision.

Original situation:
${input}

Current analysis:
Risk: ${result?.risk || "Unknown"}
Verdict: ${result?.verdict || "Unknown"}
Red flags: ${Array.isArray(result?.redFlags) ? result.redFlags.join(", ") : "Unknown"}
Next step: ${result?.nextStep || "Unknown"}

Return ONLY valid raw JSON.
Do NOT wrap in markdown.
Do NOT add explanations.

FORMAT:
{
  "questions": [
    "question 1",
    "question 2",
    "question 3"
  ]
}

RULES:
- Exactly 3 questions
- Each question should be short, sharp, and practical
- Ask only what would materially improve the decision
- Focus on uncertainty, proof, pressure, downside, commitment, hidden risk, money, timing, obligations, or manipulation when relevant
- No fluff
`;

    const aiResult: any = await model.generateContent(prompt);
    const text = aiResult.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        questions: [
          "What key detail is still missing to judge this properly?",
          "What proof or evidence have you actually seen?",
          "What is the downside if this goes wrong?",
        ],
      };
    }

    const questions = Array.isArray(parsed?.questions) ? parsed.questions.slice(0, 3) : [];

    while (questions.length < 3) {
      questions.push("What important fact is still missing?");
    }

    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({
      questions: [
        "What key detail is still missing to judge this properly?",
        "What proof or evidence have you actually seen?",
        "What is the downside if this goes wrong?",
      ],
    });
  }
}