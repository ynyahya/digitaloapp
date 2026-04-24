export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="flex flex-col items-center gap-4">
        <span className="relative inline-flex h-9 w-9">
          <span className="absolute inset-0 animate-ping rounded-full bg-ink/15" />
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper">
            <span className="h-2 w-2 rounded-full bg-ink" />
          </span>
        </span>
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
          Loading
        </p>
      </div>
    </div>
  );
}
