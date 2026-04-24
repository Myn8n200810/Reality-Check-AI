export default function LoadingState() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.11),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_30%)]" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Analysis Running
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              Reality engine active
            </h3>
          </div>

          <div className="h-10 w-10 animate-pulse rounded-2xl border border-white/10 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.08)]" />
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-white/60 animate-pulse">
            Analyzing risk signals...
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-white/50 animate-pulse">
            Detecting pressure, promises, and hidden downside...
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/45 p-4 text-white/40 animate-pulse">
            Preparing clear next step...
          </div>
        </div>
      </div>
    </div>
  );
}