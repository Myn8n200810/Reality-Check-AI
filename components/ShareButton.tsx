"use client";

export default function ShareButton() {
  const handleShare = async () => {
    const shareText = `Check this out: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Reality Check",
          text: "AI tools for checking decisions and contracts.",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Link copied.");
      }
    } catch {}
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
        <path d="M16 6l-4-4-4 4M12 2v14" />
      </svg>
      Share
    </button>
  );
}