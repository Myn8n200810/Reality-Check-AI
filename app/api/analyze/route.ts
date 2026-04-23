import { NextResponse } from "next/server";
import { model } from "@/lib/openai";
import { systemPrompt } from "@/lib/prompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body.input;

    if (!input || !input.trim()) {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    const fullPrompt = `${systemPrompt}

Analyze this situation:

${input}

Return ONLY valid JSON.
`;

    const result: any = await model.generateContent(fullPrompt);

    const text = result.response.text();

    console.log("RAW AI RESPONSE:", text);

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);

      parsed = {
        risk: "Medium",
        verdict: "Unable to fully analyze, proceed with caution.",
        redFlags: ["Unclear situation", "Incomplete data", "Potential risk"],
        nextStep: "Verify details before making any decision",
      };
    }

    // Normalize output
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
    console.error("FULL API ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}