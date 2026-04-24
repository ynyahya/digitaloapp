import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6 text-ink", className)}
      aria-hidden
    >
      <path d="M6 5h20v22H6z" fill="currentColor" fillOpacity=".06" />
      <path
        d="M10 9h8.5a7.5 7.5 0 0 1 0 15H10V9Zm4 4v7h4.5a3.5 3.5 0 1 0 0-7H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo({
  className,
  showMark = true,
  subtitle,
  noLink = false,
}: {
  className?: string;
  showMark?: boolean;
  subtitle?: string;
  noLink?: boolean;
}) {
  const content = (
    <>
      {showMark && <LogoMark />}
      <span className="flex flex-col leading-none">
        <span className="font-sans text-[17px] font-semibold tracking-tight text-ink">
          Digitalo
        </span>
        {subtitle && (
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
            {subtitle}
          </span>
        )}
      </span>
    </>
  );

  if (noLink) {
    return (
      <div className={cn("inline-flex items-center gap-2.5", className)}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Digitalo home"
    >
      {content}
    </Link>
  );
}
