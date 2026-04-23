import { NextResponse } from "next/server";
import { model } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body.input;
    const answers = body.answers;

    if (!input || !input.trim()) {
      return NextResponse.json(
        { error: "Original input is required" },
        { status: 400 }
      );
    }

    if (!answers || !answers.trim()) {
      return NextResponse.json(
        { error: "Additional details are required" },
        { status: 400 }
      );
    }

    const prompt = `
Original situation:
${input}

Additional details from user:
${answers}

Re-analyze the full situation and give a stronger improved decision output.

Return ONLY valid raw JSON.
Do NOT wrap in markdown.
Do NOT add explanations.

FORMAT:
{
  "risk": "Low | Medium | High | Extreme",
  "verdict": "short clear verdict",
  "redFlags": ["flag1", "flag2", "flag3"],
  "nextStep": "clear action"
}

RULES:
- Always give exactly 3 redFlags
- Be concise
- Be practical
- Detect scams, pressure, unrealistic claims
- No extra text outside JSON
`;

    const result: any = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        risk: "Medium",
        verdict: "Unable to fully refine analysis, proceed with caution.",
        redFlags: ["Unclear situation", "Incomplete details", "Potential hidden risk"],
        nextStep: "Verify the situation before taking action",
      };
    }

    parsed = {
      risk: parsed.risk || "Medium",
      verdict: parsed.verdict || "Proceed with caution.",
      redFlags: (parsed.redFlags || []).slice(0, 3),
      nextStep: parsed.nextStep || "Verify before acting",
    };

    while (parsed.redFlags.length < 3) {
      parsed.redFlags.push("Potential hidden risk");
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    return NextResponse.json(
      {
        risk: "Error",
        verdict: "Failed deeper analysis",
        redFlags: ["System error", "Try again", "Unknown issue"],
        nextStep: error?.message || "Retry",
      },
      { status: 500 }
    );
  }
}