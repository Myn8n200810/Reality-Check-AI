import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeaderAuth from "@/components/HeaderAuth";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(70,70,120,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,140,255,0.16),transparent_28%),linear-gradient(to_bottom,#050505,#090909,#050505)]" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/6 blur-3xl" />

        <div className="absolute left-[18%] top-[24%] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute right-[16%] bottom-[18%] h-52 w-52 rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <header className="relative z-[100]">
        <div className="mx-auto flex h-[92px] max-w-7xl items-center justify-between px-6">
          <div className="flex h-full items-center pl-24">
            <span className="block translate-y-[-8px] text-sm font-medium uppercase leading-none tracking-[0.35em] text-white/85">
              DecidelyAI
            </span>
          </div>

          <div className="flex items-center">
            <HeaderAuth />
          </div>
        </div>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-92px)] items-start px-6 pb-6 pt-0">
        <div className="mx-auto -mt-16 flex w-full max-w-7xl flex-col items-center justify-start">
          <div className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/65 shadow-[0_0_30px_rgba(255,255,255,0.04)] backdrop-blur-xl">
            Professional risk analysis tools
          </div>

          <h1 className="text-center text-4xl font-semibold tracking-tight text-white md:text-6xl">
            DecidelyAI
          </h1>

          <p className="mt-2 text-center text-sm text-white/50">
            Make the right call — every time.
          </p>

          <h2 className="mt-2 max-w-4xl text-center text-5xl font-semibold tracking-tight text-white md:text-7xl">
            Choose your
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              {" "}
              analysis mode
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-center text-base leading-7 text-white/60 md:text-lg">
            Professional tools for spotting hidden risk, pressure,
            harmful terms, and costly mistakes before you commit.
          </p>

          <div className="mt-5 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

            {/* REALITY CHECK */}
            <Link
              href="/reality-check"
              className="btn-press group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.07] p-[1px] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-cyan-400/10 opacity-70 transition group-hover:opacity-100" />

              <div className="relative rounded-[27px] border border-white/8 bg-black/65 p-8 backdrop-blur-2xl">
                <div className="mb-10 h-24 w-full rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.13),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />

                <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Mode 01
                </p>

                <h3 className="mt-3 text-3xl font-semibold text-white">
                  Reality Check AI
                </h3>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
                  Analyze offers, messages, decisions, pressure tactics,
                  and red flags before you act.
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">
                    Continue
                  </span>

                  <span className="btn-press rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                    Open
                  </span>
                </div>
              </div>
            </Link>

            {/* CONTRACT CHECKER */}
            <Link
              href="/contract-checker"
              className="btn-press group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.07] p-[1px] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-violet-400/10 opacity-70 transition group-hover:opacity-100" />

              <div className="relative rounded-[27px] border border-white/8 bg-black/65 p-8 backdrop-blur-2xl">
                <div className="mb-10 h-24 w-full rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.13),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />

                <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Mode 02
                </p>

                <h3 className="mt-3 text-3xl font-semibold text-white">
                  Contract Checker
                </h3>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
                  Review legal wording, suspicious clauses, hidden
                  obligations, and harmful terms in plain English.
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm font-medium text-white/80">
                    Continue
                  </span>

                  <span className="btn-press rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                    Open
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <p className="mt-5 text-center text-sm text-white/45">
            Select a tool to evaluate risk, language, pressure,
            hidden downside, and decision quality.
          </p>
        </div>
      </section>
    </main>
  );
}