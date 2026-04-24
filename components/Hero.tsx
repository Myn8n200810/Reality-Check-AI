export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent)]" />

      <div className="absolute left-8 top-8 hidden h-20 w-20 rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(34,211,238,0.12)] backdrop-blur-xl md:block rotate-[-8deg]">
        <div className="flex h-full items-center justify-center text-3xl">
          ⚠️
        </div>
      </div>

      <div className="absolute right-8 top-10 hidden h-20 w-20 rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(168,85,247,0.12)] backdrop-blur-xl md:block rotate-[8deg]">
        <div className="flex h-full items-center justify-center text-3xl">
          🧠
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden h-16 w-16 -translate-x-1/2 rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(255,255,255,0.08)] backdrop-blur-xl md:block rotate-[45deg]">
        <div className="flex h-full -rotate-[45deg] items-center justify-center text-2xl">
          ✓
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          Instant decision-risk analysis
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Know if you&apos;re about to make a
          <span className="bg-gradient-to-r from-white via-white to-white/55 bg-clip-text text-transparent">
            {" "}bad decision
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
          Paste any deal, message, offer, contract concern, or situation and get
          a sharp risk breakdown before you act.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-3 text-sm text-white/55 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
            Scam signals
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
            Pressure tactics
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
            Clear next step
          </div>
        </div>
      </div>
    </section>
  );
}