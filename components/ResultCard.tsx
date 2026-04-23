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
      return "bg-green-500/10 border-green-500/20";
    case "Medium":
      return "bg-yellow-500/10 border-yellow-500/20";
    case "High":
      return "bg-orange-500/10 border-orange-500/20";
    case "Extreme":
      return "bg-red-500/10 border-red-500/20";
    default:
      return "bg-gray-800";
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
      <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-lg">
        <p className="text-gray-400 font-medium">
          Your decision analysis will appear here
        </p>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="grid md:grid-cols-4 gap-6">
      <div className="md:col-span-3 space-y-6 rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-lg">
        <div className={`p-4 rounded-xl border ${getRiskBg(result.risk)}`}>
          <p className="text-xs uppercase text-gray-400">Decision Risk</p>
          <p className={`text-3xl font-bold ${getRiskColor(result.risk)}`}>
            {result.risk}
          </p>
        </div>

        <div className={revealClass(showVerdict)}>
          <p className="text-xs uppercase text-gray-400 mb-1">Verdict</p>
          <p className="text-white text-lg font-semibold">{result.verdict}</p>
        </div>

        <div className={revealClass(showFlags)}>
          <p className="text-xs uppercase text-gray-400 mb-2">Key Risks</p>
          <div className="space-y-2">
            {result.redFlags.map((flag: string, i: number) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-black border border-gray-800"
              >
                ⚠ {flag}
              </div>
            ))}
          </div>
        </div>

        <div className={revealClass(showAction)}>
          <p className="text-xs uppercase text-gray-400 mb-1">
            Recommended Action
          </p>

          <p className="text-white leading-7 mb-4">{result.nextStep}</p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              className="px-3 py-1 border border-gray-700 rounded-md"
            >
              Copy
            </button>

            <button
              onClick={handleToggleDeeper}
              disabled={questionsLoading}
              className="px-3 py-1 border border-gray-700 rounded-md disabled:opacity-60"
            >
              {questionsLoading
                ? "Preparing Deeper Analysis..."
                : showDeeper
                ? "Hide Deeper Analysis"
                : "Deeper Analysis"}
            </button>
          </div>
        </div>

        {showDeeper && (
          <div
            ref={deeperRef}
            className="rounded-xl border border-gray-800 bg-black p-4 space-y-4"
          >
            <div>
              <p className="text-xs uppercase text-gray-400 mb-1">
                Deeper Analysis
              </p>
              <p className="text-sm text-gray-400">
                Add missing context, details, screenshots in text form, pressure
                points, pricing, promises, or anything else that sharpens the
                decision.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase text-gray-400">
                AI Follow-Up Questions
              </p>

              <div className="space-y-2">
                {deeperQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-800 bg-gray-950 p-3 text-sm text-gray-300"
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
              className="w-full h-36 rounded-xl bg-gray-950 border border-gray-800 p-4 text-white"
            />

            <button
              onClick={handleDeeperSubmit}
              disabled={deeperLoading}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl disabled:opacity-60"
            >
              {deeperLoading ? "Refining Analysis..." : "Run Deeper Analysis"}
            </button>
          </div>
        )}

        <p className="text-xs text-gray-500">
          * This is not financial, legal, or professional advice. Always verify
          independently.
        </p>
      </div>

      <div className="space-y-3">
        {getRiskGuide().map((item) => (
          <div
            key={item.level}
            className="border border-gray-800 rounded-xl p-3 bg-gray-950"
          >
            <p className={`font-semibold ${item.color}`}>{item.level}</p>
            <p className="text-sm text-gray-400">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}