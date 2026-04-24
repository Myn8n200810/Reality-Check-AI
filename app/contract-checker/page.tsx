"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

function getRiskColor(risk: string) {
  switch (risk) {
    case "Low":
      return "text-green-400";
    case "Medium":
      return "text-yellow-400";
    case "High":
      return "text-orange-400";
    case "Extreme":
      return "text-red-500";
    default:
      return "text-gray-300";
  }
}

function getRiskBg(risk: string) {
  switch (risk) {
    case "Low":
      return "bg-green-500/10 border-green-500/25";
    case "Medium":
      return "bg-yellow-500/10 border-yellow-500/25";
    case "High":
      return "bg-orange-500/10 border-orange-500/25";
    case "Extreme":
      return "bg-red-500/10 border-red-500/25";
    default:
      return "bg-white/5 border-white/10";
  }
}

export default function ContractCheckerPage() {
  const [contract, setContract] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    const trimmed = contract.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);

    trackEvent("contract_checker_submitted", {
      input_length: trimmed.length,
    });

    try {
      const res = await fetch("/api/contract-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Contract check failed");
      }

      setResult(data);

      trackEvent("contract_checker_completed", {
        risk: data?.risk || "unknown",
        risky_clause_count: Array.isArray(data?.riskyClauses)
          ? data.riskyClauses.length
          : 0,
      });
    } catch (error: any) {
      const message = error?.message || "Contract check failed";

      setResult({
        risk: "Error",
        summary: message,
        riskyClauses: [
          {
            clause: "Request failed",
            whyRisky: "The contract could not be analyzed.",
            whatToDo: "Try again with clearer contract text.",
          },
          {
            clause: "System issue",
            whyRisky: "The AI route may not have responded correctly.",
            whatToDo: "Retry after a few seconds.",
          },
          {
            clause: "Incomplete analysis",
            whyRisky: "No reliable result was produced.",
            whatToDo: "Do not rely on this result.",
          },
        ],
        nextStep: "Try again.",
      });

      trackEvent("contract_checker_failed", {
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.13),transparent_32%),linear-gradient(to_bottom,#020202,#070707,#020202)]" />

      <div className="absolute inset-0 opacity-35">
        <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute right-[12%] bottom-[18%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="relative z-10 px-4 py-8 md:py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              ← Back
            </Link>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/45 backdrop-blur-xl">
              Mode 02
            </div>
          </div>

          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent)]" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/55">
                Contract risk scanner
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Check contracts for
                <span className="bg-gradient-to-r from-white via-white to-white/55 bg-clip-text text-transparent">
                  {" "}
                  shady terms
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
                Paste contract text and get a plain-English risk breakdown of
                unfair clauses, vague obligations, hidden costs, and harmful
                terms before you sign.
              </p>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.09),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_28%)]" />

            <div className="relative z-10 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Contract Input
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Paste the contract text
                </h2>
              </div>

              <textarea
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                placeholder="Paste contract terms, agreement clauses, offer letters, service agreements, or policy text here..."
                className="h-56 w-full resize-none rounded-2xl border border-white/10 bg-black/60 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none placeholder:text-white/30 focus:border-white/25"
              />

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full rounded-2xl bg-white py-3.5 font-semibold text-black shadow-[0_18px_60px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 disabled:opacity-60"
              >
                {loading ? "Checking Contract..." : "Check Contract"}
              </button>
            </div>
          </section>

          {loading && (
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <p className="text-white/60 animate-pulse">
                Scanning clauses, obligations, and hidden risks...
              </p>
            </div>
          )}

          {result && (
            <section className="mx-auto grid max-w-5xl gap-5 md:grid-cols-4">
              <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:col-span-3">
                <div className="relative z-10 space-y-4">
                  <div
                    className={`rounded-2xl border p-4 ${getRiskBg(
                      result.risk
                    )}`}
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Contract Risk
                    </p>
                    <p
                      className={`mt-2 text-4xl font-bold ${getRiskColor(
                        result.risk
                      )}`}
                    >
                      {result.risk}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                      Summary
                    </p>
                    <p className="text-base leading-7 text-white/80">
                      {result.summary || result.verdict}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                      Risky Clauses
                    </p>

                    <div className="space-y-3">
                      {(result.riskyClauses || []).map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="rounded-2xl border border-white/10 bg-black/45 p-4"
                          >
                            <p className="font-semibold text-white">
                              {item.clause || item.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/60">
                              {item.whyRisky || item.issue}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-white/80">
                              <span className="text-white/40">Action: </span>
                              {item.whatToDo ||
                                "Review this clause carefully before signing."}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
                      Next Step
                    </p>
                    <p className="text-sm leading-6 text-white/85">
                      {result.nextStep}
                    </p>
                  </div>

                  <p className="text-xs text-white/35">
                    * This is not financial, legal, or professional advice.
                    Always verify independently.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  "Hidden fees",
                  "Vague duties",
                  "Liability traps",
                  "Auto renewal",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-sm text-white/55 backdrop-blur-2xl"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}