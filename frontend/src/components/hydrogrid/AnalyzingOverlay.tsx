import { Sparkles } from "lucide-react";

const STEPS = [
  "Reading wall geometry",
  "Detecting fixtures and wet zones",
  "Routing dual-pipe network",
];

export function AnalyzingOverlay({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bp-void px-6 text-center text-foreground">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full border border-bp-wall/50" />
        <span className="absolute inset-3 rounded-full border border-bp-wall/30" />
        <Sparkles className="h-8 w-8 animate-pulse text-bp-wall" />
      </div>
      <div>
        <p className="font-display text-2xl font-semibold">Gemini Vision is reading your plan</p>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">{label}</p>
      </div>
      <ul className="space-y-1.5 font-mono text-[10px] tracking-[0.15em] text-bp-wall uppercase">
        {STEPS.map((step, i) => (
          <li key={step} style={{ animationDelay: `${i * 0.35}s` }} className="animate-pulse">
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
