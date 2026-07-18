"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />
        <p className="text-sm font-semibold tracking-wider text-slate-400 animate-pulse">
          Loading TaskFlow...
        </p>
      </div>
    </div>
  );
}
