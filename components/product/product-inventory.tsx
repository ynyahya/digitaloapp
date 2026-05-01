import { FileText, Lock } from "lucide-react";
import { fileExtensionLabel, formatFileSize } from "./product-helpers";

type ProductFileLite = {
  id: string;
  filename: string;
  sizeBytes: number | null;
  version: string;
};

interface ProductInventoryProps {
  files: ProductFileLite[];
}

export function ProductInventory({ files }: ProductInventoryProps) {
  if (files.length === 0) return null;
  const totalBytes = files.reduce((sum, f) => sum + (f.sizeBytes ?? 0), 0);

  return (
    <section id="inside" className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-chalk-dim">
            What&apos;s inside
          </p>
          <h2 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-chalk md:text-[26px]">
            {files.length} {files.length === 1 ? "file" : "files"} included
          </h2>
        </div>
        <p className="hidden text-right text-[12.5px] text-chalk-muted sm:block">
          {totalBytes > 0 && <>Total {formatFileSize(totalBytes)} · </>}
          Instant download after purchase
        </p>
      </div>

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-white/[0.08] bg-night">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.035]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.06]">
              <FileText className="h-4 w-4 text-chalk-muted" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-chalk">
                {file.filename}
              </p>
              <p className="mt-0.5 text-[11.5px] text-chalk-muted">
                <span className="font-mono uppercase tracking-wide">
                  {fileExtensionLabel(file.filename)}
                </span>
                {file.sizeBytes && (
                  <>
                    <span className="mx-1.5 text-chalk-dim">·</span>
                    {formatFileSize(file.sizeBytes)}
                  </>
                )}
                <span className="mx-1.5 text-chalk-dim">·</span>
                <span className="tabular-nums">v{file.version}</span>
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-chalk-muted">
              <Lock className="h-3 w-3" />
              Unlocks on purchase
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
