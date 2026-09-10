import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DIAMETERS,
  MATERIALS,
  UNIT_COST,
  type Pipe,
  type PipeMaterial,
  type PipeOverride,
} from "@/lib/hydrogrid";

interface Props {
  pipe: Pipe | null;
  onOpenChange: (open: boolean) => void;
  onApply: (pipeId: string, override: PipeOverride) => void;
  onRecalibrate: (pipeId: string) => void;
}

const fieldClass =
  "w-full rounded-sm border border-border bg-bp-void px-2 py-1.5 font-mono text-xs text-foreground outline-none focus:border-bp-wall";

export function PipeOverrideDialog({ pipe, onOpenChange, onApply, onRecalibrate }: Props) {
  const [length, setLength] = useState(0);
  const [diameter, setDiameter] = useState<number>(110);
  const [material, setMaterial] = useState<PipeMaterial>("PVC");

  useEffect(() => {
    if (!pipe) return;
    setLength(pipe.runLength);
    setDiameter(pipe.diameterMm);
    setMaterial(pipe.material);
  }, [pipe]);

  useEffect(() => {
    if (!pipe) return;
    onApply(pipe.id, { lengthM: length, diameterMm: diameter, material });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, diameter, material]);

  return (
    <Dialog open={Boolean(pipe)} onOpenChange={onOpenChange}>
      <DialogContent className="bp-panel max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Pipe Adjustment · {pipe?.id ?? ""}
          </DialogTitle>
        </DialogHeader>
        {pipe && (
          <div className="space-y-3">
            <label className="block">
              <span className="bp-label">Length (m)</span>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={length}
                onChange={(e) => setLength(Math.max(0.5, Number(e.target.value) || 0.5))}
                className={`${fieldClass} mt-1`}
              />
            </label>
            <label className="block">
              <span className="bp-label">Diameter (mm)</span>
              <select
                value={diameter}
                onChange={(e) => setDiameter(Number(e.target.value))}
                className={`${fieldClass} mt-1`}
              >
                {DIAMETERS.map((d) => (
                  <option key={d} value={d}>
                    {d} mm
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="bp-label">Material</span>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value as PipeMaterial)}
                className={`${fieldClass} mt-1`}
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <Stat label="Flow velocity" value={`${pipe.velocity} m/s`} />
              <Stat label="Head loss" value={`${pipe.headLoss} m`} />
              <Stat label="Design flow" value={`${pipe.flowLps} L/s`} />
              <Stat
                label="Segment cost"
                value={`₹${Math.round(pipe.runLength * (UNIT_COST[pipe.diameterMm] ?? 200)).toLocaleString("en-IN")}`}
              />
            </div>

            <button
              type="button"
              onClick={() => onRecalibrate(pipe.id)}
              className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-bp-wall/60 bg-bp-wall/10 py-2 font-mono text-[10px] tracking-[0.15em] text-bp-wall uppercase transition-colors hover:bg-bp-wall/20"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Recalibrate
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border p-2">
      <div className="bp-label">{label}</div>
      <div className="mt-0.5 text-bp-wall">{value}</div>
    </div>
  );
}
