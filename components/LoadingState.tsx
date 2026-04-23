export default function LoadingState() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 space-y-3 shadow-lg">
      <p className="text-gray-300 animate-pulse">Analyzing risk...</p>
      <p className="text-gray-400 animate-pulse">Detecting red flags...</p>
      <p className="text-gray-500 animate-pulse">Evaluating situation...</p>
    </div>
  );
}