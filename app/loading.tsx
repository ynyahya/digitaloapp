export default function RootLoading() {
  return (
    <div className="landing-theme flex min-h-screen items-center justify-center bg-night text-chalk">
      <div className="flex flex-col items-center gap-4">
        <span className="relative inline-flex h-9 w-9">
          <span className="absolute inset-0 animate-ping rounded-full bg-lime/20" />
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-lime/30 bg-lime/10">
            <span className="h-2 w-2 rounded-full bg-lime" />
          </span>
        </span>
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-chalk-dim">
          Loading
        </p>
      </div>
    </div>
  );
}
