import { useCallback, useRef, useState } from "react";
import { Building2, ScanLine, Sparkles, Upload, Waypoints } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export interface BlueprintSource {
  name: string;
  thumbnail: string | null;
  kind: "upload" | "sample";
  file?: File | null;
}

interface Props {
  onAnalyze: (source: BlueprintSource) => void;
}

const ACCEPTED = ["image/png", "image/jpeg"];

export function Landing({ onAnalyze }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED.includes(file.type)) {
        setError("Please choose a PNG or JPG blueprint scan.");
        return;
      }
      setError(null);
      onAnalyze({ name: file.name, thumbnail: URL.createObjectURL(file), kind: "upload", file });
    },
    [onAnalyze],
  );

  return (
    <div className="relative flex min-h-screen flex-col bg-bp-void text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--bp-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--bp-grid) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 50% 35%, black, transparent 75%)",
        }}
      />

      <header className="relative flex items-center gap-3 px-5 py-4">
        <Waypoints className="h-5 w-5 text-bp-wall" />
        <div>
          <span className="font-display text-lg leading-none font-semibold tracking-wide">
            HydroGrid Studio
          </span>
          <p className="bp-label mt-0.5">Generative MEP Plumbing Engine</p>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-5 py-12 text-center">
        <span className="flex items-center gap-1.5 rounded-full border border-bp-wall/40 bg-bp-wall/10 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-bp-wall uppercase">
          <Sparkles className="h-3 w-3" /> Powered by Gemini Vision API
        </span>

        <div>
          <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            Turn any floor plan into an optimised plumbing system
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Drop in a blueprint and HydroGrid reads the rooms, routes dual greywater and blackwater
            stacks, sizes every run, and hands you a rainwater-harvesting-ready bill of materials.
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files[0]);
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className={`bp-panel flex w-full cursor-pointer flex-col items-center gap-3 rounded-sm px-6 py-12 transition-colors ${
            dragging ? "border-bp-wall bg-bp-wall/10" : "hover:border-bp-wall/60"
          }`}
        >
          <Upload className="h-8 w-8 text-bp-wall" />
          <p className="font-display text-xl font-semibold">Drag &amp; drop your blueprint</p>
          <p className="font-mono text-[11px] text-muted-foreground">
            PNG or JPG floor plan · or click to browse
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => accept(e.target.files?.[0])}
          />
        </div>

        {error && <p className="font-mono text-[11px] text-destructive">{error}</p>}

        <div className="flex flex-col items-center gap-3">
          <span className="bp-label">No drawing handy?</span>
          <button
            type="button"
            onClick={() =>
              onAnalyze({ name: "Sample 2BHK · 1,180 sq ft", thumbnail: null, kind: "sample" })
            }
            className="flex items-center gap-2 rounded-sm border border-bp-wall/60 bg-bp-wall/10 px-4 py-2.5 font-mono text-[11px] tracking-[0.15em] text-bp-wall uppercase transition-colors hover:bg-bp-wall/20"
          >
            <Building2 className="h-4 w-4" /> Try the sample 2BHK
          </button>
          <p className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <ScanLine className="h-3 w-3" /> Vision analysis takes a couple of seconds
          </p>
        </div>
      </main>
    </div>
  );
}
