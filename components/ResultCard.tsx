"use client";

import { useEffect, useRef, useState } from "react";
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
      return "bg-green-500/10 border-green-500/25 shadow-[0_0_40px_rgba(34,197,94,0.07)]";
    case "Medium":
      return "bg-yellow-500/10 border-yellow-500/25 shadow-[0_0_40px_rgba(234,179,8,0.07)]";
    case "High":
      return "bg-orange-500/10 border-orange-500/25 shadow-[0_0_40px_rgba(249,115,22,0.07)]";
    case "Extreme":
      return "bg-red-500/10 border-red-500/25 shadow-[0_0_40px_rgba(239,68,68,0.08)]";
    default:
      return "bg-white/5 border-white/10";
  }
}

function getRiskGuide() {
  return [
    { level: "Extreme", text: "Do NOT proceed", color: "text-red-500" },
    { level: "High", text: "Proceed with safeguards", color: "text-orange-400" },
    { level: "Medium", text: "Verify before acting", color: "text-yellow-400" },
    { level: "Low", text: "Safe with minor caution", color: "text-green-400" },
  ];
}

function revealClass(show: boolean) {
  return `transition-all duration-500 ease-out ${
    show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
  }`;
}

export default function ResultCard({ result, setResult, originalInput }: any) {
  const [showVerdict, setShowVerdict] = useState(false);
  const [showFlags, setShowFlags] = useState(false);
  const [showAction, setShowAction] = useState(false);

  const [showDeeper, setShowDeeper] = useState(false);
  const [deeperInput, setDeeperInput] = useState("");
  const [deeperLoading, setDeeperLoading] = useState(false);

  const [deeperQuestions, setDeeperQuestions] = useState<string[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const deeperRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const keepFollowingRef = useRef(false);

  const stopSmoothScroll = () => {
    keepFollowingRef.current = false;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startSmoothScroll = () => {
    if (keepFollowingRef.current) return;

    keepFollowingRef.current = true;

    const follow = () => {
      if (!keepFollowingRef.current || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const bottomGap = 20;
      const overflow = rect.bottom - (viewportHeight - bottomGap);

      if (overflow > 0.5) {
        const step = Math.max(1, Math.min(overflow * 0.14, 8));
        window.scrollTo({
          top: window.scrollY + step,
          behavior: "auto",
        });
      }

      animationFrameRef.current = requestAnimationFrame(follow);
    };

    animationFrameRef.current = requestAnimationFrame(follow);
  };

  useEffect(() => {
    if (!result) return;

    setShowVerdict(false);
    setShowFlags(false);
    setShowAction(false);

    startSmoothScroll();

    const t1 = setTimeout(() => {
      setShowVerdict(true);
    }, 250);

    const t2 = setTimeout(() => {
      setShowFlags(true);
    }, 900);

    const t3 = setTimeout(() => {
      setShowAction(true);
    }, 1600);

    const stop = setTimeout(() => {
      stopSmoothScroll();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(stop);
      stopSmoothScroll();
    };
  }, [result]);

  const handleCopy = async () => {
    if (!result) return;

    const text = `Reality Check AI

Risk: ${result.risk}

Verdict:
${result.verdict}

Red Flags:
- ${result.redFlags[0]}
- ${result.redFlags[1]}
- ${result.redFlags[2]}

Next Step:
${result.nextStep}`;

    try {
      await navigator.clipboard.writeText(text);

      trackEvent("result_copied", {
        risk: result?.risk || "unknown",
      });
    } catch {}
  };

  const fetchDeeperQuestions = async () => {
    const res = await fetch("/api/deeper-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: originalInput,
        result,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to generate questions");
    }

    const questions = Array.isArray(data.questions)
      ? data.questions.slice(0, 3)
      : [];

    while (questions.length < 3) {
      questions.push("What important fact is still missing?");
    }

    return questions;
  };

  const handleToggleDeeper = async () => {
    if (showDeeper) {
      setShowDeeper(false);
      return;
    }

    if (!originalInput?.trim() || !result || questionsLoading) return;

    setQuestionsLoading(true);

    trackEvent("deeper_analysis_opened", {
      risk: result?.risk || "unknown",
    });

    try {
      const questions = await fetchDeeperQuestions();
      setDeeperQuestions(questions);
      setShowDeeper(true);

      setTimeout(() => {
        deeperRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 120);
    } catch {
      setDeeperQuestions([
        "What key detail is still missing to judge this properly?",
        "What proof or evidence have you actually seen?",
        "What is the downside if this goes wrong?",
      ]);
      setShowDeeper(true);

      setTimeout(() => {
        deeperRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 120);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleDeeperSubmit = async () => {
    if (!originalInput.trim() || !deeperInput.trim()) return;

    setDeeperLoading(true);

    trackEvent("deeper_analysis_submitted", {
      input_length: deeperInput.trim().length,
      question_count: deeperQuestions.length,
    });

    try {
      const res = await fetch("/api/deeper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: originalInput,
          answers: deeperInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed deeper analysis");
      }

      setResult(data);
      setShowDeeper(false);
      setDeeperInput("");
      setDeeperQuestions([]);

      trackEvent("deeper_analysis_completed", {
        risk: data?.risk || "unknown",
      });

      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch (error: any) {
      const message = error?.message || "Failed deeper analysis";

      setResult({
        risk: "Error",
        verdict: message,
        redFlags: ["System error", "Could not refine analysis", "Try again"],
        nextStep: "Retry with clearer details.",
      });

      setShowDeeper(false);
      setDeeperInput("");
      setDeeperQuestions([]);

      trackEvent("deeper_analysis_failed", {
        message,
      });

      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } finally {
      setDeeperLoading(false);
    }
  };

  if (!result) {
    return (
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%)]" />
        <p className="relative z-10 text-white/50 font-medium">
          Your decision analysis will appear here
        </p>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="mx-auto grid max-w-5xl gap-5 md:grid-cols-4">
      <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:col-span-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_30%)]" />

        <div className="relative z-10 space-y-4">
          <div className={`rounded-2xl border p-4 ${getRiskBg(result.risk)}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Decision Risk
            </p>

            <div className="mt-2 flex items-end justify-between gap-4">
              <p className={`text-4xl font-bold ${getRiskColor(result.risk)}`}>
                {result.risk}
              </p>

              <div className="hidden rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/40 md:block">
                Risk Engine
              </div>
            </div>
          </div>

          <div className={revealClass(showVerdict)}>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
              Verdict
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <p className="text-base font-semibold leading-7 text-white md:text-lg">
                {result.verdict}
              </p>
            </div>
          </div>

          <div className={revealClass(showFlags)}>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
              Key Risks
            </p>

            <div className="space-y-2">
              {result.redFlags.map((flag: string, i: number) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-black/45 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/20"
                >
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs">
                      ⚠
                    </div>

                    <p className="text-sm leading-6 text-white/75">{flag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={revealClass(showAction)}>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/40">
              Recommended Action
            </p>

            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-sm leading-6 text-white/85">
                {result.nextStep}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleCopy}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Copy
                </button>

                <button
                  onClick={handleToggleDeeper}
                  disabled={questionsLoading}
                  className="rounded-xl border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                >
                  {questionsLoading
                    ? "Preparing Deeper Analysis..."
                    : showDeeper
                    ? "Hide Deeper Analysis"
                    : "Deeper Analysis"}
                </button>
              </div>
            </div>
          </div>

          {showDeeper && (
            <div
              ref={deeperRef}
              className="rounded-2xl border border-white/10 bg-black/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Deeper Analysis
                </p>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  Add missing context, details, screenshots in text form,
                  pressure points, pricing, promises, or anything else that
                  sharpens the decision.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  AI Follow-Up Questions
                </p>

                <div className="space-y-2">
                  {deeperQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-white/70"
                    >
                      {question}
                    </div>
                  ))}
                </div>
              </div>

              <textarea
                value={deeperInput}
                onChange={(e) => setDeeperInput(e.target.value)}
                placeholder="Answer the questions above or add more details that may change the decision..."
                className="mt-4 h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/70 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/25"
              />

              <button
                onClick={handleDeeperSubmit}
                disabled={deeperLoading}
                className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
              >
                {deeperLoading ? "Refining Analysis..." : "Run Deeper Analysis"}
              </button>
            </div>
          )}

          <p className="text-xs text-white/35">
            * This is not financial, legal, or professional advice. Always
            verify independently.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {getRiskGuide().map((item) => (
          <div
            key={item.level}
            className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.32)] backdrop-blur-2xl"
          >
            <p className={`text-sm font-semibold ${item.color}`}>
              {item.level}
            </p>
            <p className="mt-1 text-xs leading-5 text-white/45">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}