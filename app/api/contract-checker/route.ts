import { NextResponse } from "next/server";
import { contractModel } from "@/lib/contractModel";
import { contractPrompt } from "@/lib/contractPrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body.input;

    const prompt = `
${contractPrompt}

Contract:
${input}
`;

    const result: any = await contractModel.generateContent(prompt);

    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        risk: "Medium",
        verdict: "Could not fully analyze contract.",
        riskyClauses: [
          { title: "Unclear terms", issue: "Contract wording is not clear" },
          { title: "Potential risk", issue: "Some clauses may be unfair" },
          { title: "Missing safeguards", issue: "Protection is unclear" },
        ],
        nextStep: "Review contract manually before signing",
      };
    }

    // 🔥 normalize structure
    parsed.riskyClauses = (parsed.riskyClauses || []).slice(0, 3);

    while (parsed.riskyClauses.length < 3) {
      parsed.riskyClauses.push({
        title: "Hidden risk",
        issue: "There may be additional risks not clearly stated",
      });
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      risk: "Error",
      verdict: "Contract analysis failed",
      riskyClauses: [
        { title: "System error", issue: "Could not process contract" },
        { title: "Try again", issue: "Temporary failure occurred" },
        { title: "Unknown issue", issue: "Unexpected problem" },
      ],
      nextStep: "Retry with clearer contract text",
    });
  }
}