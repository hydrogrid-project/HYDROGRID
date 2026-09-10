import { Activity, ArrowDownRight, Gauge, Landmark, Ruler, Sparkles, Store, TrendingUp, X } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DFU,
  DIAMETER_OPTIONS,
  MATERIAL_OPTIONS,
  PIPE_COLORS,
  TRAP_OF,
  VENDOR_CATALOG,
  computeRoi,
  flowVelocity,
  headLossMeters,
  type Fixture,
  type Metrics,
  type Pipe,
  type PipeDiameterMm,
  type PipeMaterial,
  type SimulationState,
  type UserOverride,
} from "@/lib/hydrogrid";

export type Selection =
  | { kind: "pipe"; pipe: Pipe }
  | { kind: "fixture"; fixture: Fixture }
  | { kind: "room"; roomId: string; name: string }
  | null;

interface Props {
  metrics: Metrics;
  selection: Selection;
  simulation: SimulationState;
  chlorination: boolean;
  tariffInrPerKl: number;
  pipes: Pipe[];
  onTariffChange: (n: number) => void;
  onOverride: (override: UserOverride) => void;
  onRecalibrate: (pathId: string) => void;
  onClose: () => void;
}

export function RightPanel({
  metrics,
  selection,
  simulation,
  chlorination,
  tariffInrPerKl,
  pipes,
  onTariffChange,
  onOverride,
  onRecalibrate,
  onClose,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      {selection?.kind === "pipe" && (
        <PipeCard
          pipe={pipes.find((p) => p.id === selection.pipe.id) ?? selection.pipe}
          onClose={onClose}
          onOverride={onOverride}
          onRecalibrate={onRecalibrate}
        />
      )}
      {selection?.kind === "fixture" && <FixtureCard fixture={selection.fixture} onClose={onClose} />}
      {selection?.kind === "room" && (
        <div className="bp-panel rounded-sm p-3">
          <div className="bp-label">Room</div>
          <div className="font-display text-xl font-semibold text-bp-select">{selection.name}</div>
          <CloseButton onClose={onClose} />
        </div>
      )}
      <Dashboard
        metrics={metrics}
        simulation={simulation}
        chlorination={chlorination}
        tariffInrPerKl={tariffInrPerKl}
        pipes={pipes}
        onTariffChange={onTariffChange}
      />
    </div>
  );
}

function Dashboard({
  metrics,
  simulation,
  chlorination,
  tariffInrPerKl,
  pipes,
  onTariffChange,
}: {
  metrics: Metrics;
  simulation: SimulationState;
  chlorination: boolean;
  tariffInrPerKl: number;
  pipes: Pipe[];
  onTariffChange: (n: number) => void;
}) {
  const roi = computeRoi(metrics.freshwaterOffset, pipes, chlorination, tariffInrPerKl);
  const statusTone = metrics.status.includes("Backflow")
    ? "text-bp-greywater"
    : simulation === "SURPLUS_RAIN"
      ? "text-bp-rain"
      : chlorination
        ? "text-cyan-400"
        : "text-bp-greywater";

  return (
    <>
      <h2 className="bp-label">Project Metrics</h2>
      <MetricCard
        icon={<Ruler className="h-3.5 w-3.5" />}
        label="Linear Pipe Saved"
        value={`${metrics.pipeSavedPct}%`}
        note={`${metrics.totalRun} m routed · catchment ${metrics.catchment_area_m2} m²`}
      />
      <MetricCard
        icon={<TrendingUp className="h-3.5 w-3.5" />}
        label="Freshwater Offset"
        value={`+${metrics.freshwaterOffset} L/day`}
        note={`Greywater recycle ${metrics.greywater_recycling_lpd} L/day`}
      />
      <MetricCard
        icon={<Gauge className="h-3.5 w-3.5" />}
        label="Total DFU Load"
        value={`${metrics.totalDfu} DFU`}
        note={`Cistern ${metrics.cistern_volume_l} L · ${metrics.cistern_level_pct}%`}
      />
      <MetricCard
        icon={<Activity className="h-3.5 w-3.5" />}
        label="System Status"
        value={metrics.status}
        valueClass={statusTone}
        note={`Reserve ${metrics.harvestable} L`}
      />

      <section className="bp-panel rounded-sm p-3">
        <div className="bp-label flex items-center gap-1.5">
          <Landmark className="h-3.5 w-3.5" /> Commercial viability & ROI
        </div>
        <label className="mt-2 block">
          <span className="bp-label">Municipal tariff (₹ / kL)</span>
          <input
            type="number"
            min={5}
            max={200}
            value={tariffInrPerKl}
            onChange={(e) => onTariffChange(Number(e.target.value) || 0)}
            className="mt-1 w-full rounded-sm border border-border bg-bp-void px-2 py-1.5 font-mono text-xs outline-none focus:border-bp-wall"
          />
        </label>
        <div className="mt-2 font-display text-2xl font-semibold text-bp-wall">
          ₹{roi.annualSavingsInr.toLocaleString("en-IN")}
          <span className="ml-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            / year
          </span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          CAPEX ₹{roi.capexInr.toLocaleString("en-IN")} · payback {roi.paybackYears} yr
        </p>
        <div className="mt-2 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={roi.series} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bp-grid)" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v: number) => `₹${Number(v).toLocaleString("en-IN")}`}
                labelFormatter={(y) => `Year ${y}`}
              />
              <Area type="monotone" dataKey="capex" stroke="#EA580C" fill="#EA580C33" name="CAPEX" />
              <Area type="monotone" dataKey="savings" stroke="#10B981" fill="#10B98133" name="Cumulative savings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bp-panel rounded-sm p-3">
        <div className="bp-label mb-2 flex items-center gap-1.5">
          <Store className="h-3.5 w-3.5" /> MEP material & vendors
        </div>
        <ul className="space-y-2">
          {VENDOR_CATALOG.map((v) => (
            <li key={v.application} className="border-b border-border/50 pb-2 last:border-0">
              <p className="font-mono text-[11px] text-foreground">{v.application}</p>
              <p className="font-mono text-[10px] text-bp-wall">{v.standard}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {v.brands} · {v.isCode}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {v.pressure} · {v.unitCost}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function MetricCard({
  icon,
  label,
  value,
  note,
  valueClass = "text-bp-wall",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  valueClass?: string;
}) {
  return (
    <div className="bp-panel rounded-sm p-3">
      <div className="bp-label flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className={`font-display mt-1.5 text-2xl leading-none font-semibold ${valueClass}`}>{value}</div>
      <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: string | undefined }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 py-1.5 last:border-0">
      <span className="bp-label pt-0.5">{k}</span>
      <span className={`font-mono text-[11px] text-right ${accent ?? "text-foreground"}`}>{v}</span>
    </div>
  );
}

function PipeCard({
  pipe,
  onClose,
  onOverride,
  onRecalibrate,
}: {
  pipe: Pipe;
  onClose: () => void;
  onOverride: (override: UserOverride) => void;
  onRecalibrate: (pathId: string) => void;
}) {
  const velocity = flowVelocity(pipe.dfu, pipe.pipe_diameter_mm);
  const head = headLossMeters(pipe.runLength, pipe.dfu, pipe.pipe_diameter_mm, pipe.material);

  return (
    <div className="bp-panel rounded-sm p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="bp-label">Segment Inspection</div>
          <div className="font-display text-xl font-semibold text-bp-select">{pipe.id}</div>
        </div>
        <span className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: PIPE_COLORS[pipe.fluid] }} />
      </div>
      <Tabs defaultValue="inspect" className="mt-2">
        <TabsList className="h-8 w-full">
          <TabsTrigger value="inspect" className="flex-1 text-[10px]">
            Inspect
          </TabsTrigger>
          <TabsTrigger value="adjust" className="flex-1 text-[10px]">
            Pipe Adjustment
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inspect">
          <Row
            k="Fluid type"
            v={
              pipe.assignmentClass === "Isolated"
                ? "Isolated greywater"
                : pipe.fluid === "Greywater"
                  ? "Light Greywater"
                  : pipe.fluid === "Chlorinated"
                    ? "Chlorinated greywater"
                    : "Blackwater (soil)"
            }
            accent={pipe.severed ? "text-bp-greywater" : undefined}
          />
          <Row k="Calculated diameter" v={`${pipe.pipe_diameter_mm} mm ${pipe.material}`} />
          <Row k="Run length" v={`${pipe.runLength} meters`} />
          <Row k="Required slope" v={pipe.slope} />
          <Row k="Velocity" v={`${velocity} m/s`} />
          <Row k="Head loss" v={`${head} m`} />
          <Row k="Discharge node" v={`${pipe.target.label} (${pipe.target.x},${pipe.target.y})`} />
          <Row k="Served fixture" v={`${pipe.fixtureType} · ${pipe.fixtureId} · F${pipe.floor}`} />
          <Row k="DFU contribution" v={`${pipe.dfu} DFU`} />
          <Row k="Required fittings" v={pipe.fittings.join("\n")} />
          {pipe.severed && (
            <p className="mt-3 flex gap-1.5 rounded-sm border border-bp-greywater/50 bg-bp-greywater/10 p-2 font-mono text-[10px] text-bp-greywater">
              <ArrowDownRight className="h-3.5 w-3.5 shrink-0" />
              Horizontal kitchen–stack bridge severed in the utility duct. P-trap isolated / backflow safe.
            </p>
          )}
        </TabsContent>
        <TabsContent value="adjust" className="space-y-2">
          <label className="block">
            <span className="bp-label">Length (m)</span>
            <input
              type="number"
              min={0.5}
              step={0.1}
              value={pipe.runLength}
              onChange={(e) => onOverride({ pathId: pipe.id, length_m: Number(e.target.value) })}
              className="mt-1 w-full rounded-sm border border-border bg-bp-void px-2 py-1.5 font-mono text-xs"
            />
          </label>
          <label className="block">
            <span className="bp-label">Diameter (mm)</span>
            <select
              value={pipe.pipe_diameter_mm}
              onChange={(e) =>
                onOverride({ pathId: pipe.id, pipe_diameter_mm: Number(e.target.value) as PipeDiameterMm })
              }
              className="mt-1 w-full rounded-sm border border-border bg-bp-void px-2 py-1.5 font-mono text-xs"
            >
              {DIAMETER_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d} mm
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="bp-label">Material</span>
            <select
              value={pipe.material}
              onChange={(e) => onOverride({ pathId: pipe.id, material: e.target.value as PipeMaterial })}
              className="mt-1 w-full rounded-sm border border-border bg-bp-void px-2 py-1.5 font-mono text-xs"
            >
              {MATERIAL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <p className="font-mono text-[10px] text-muted-foreground">
            v = {velocity} m/s · Δh = {head} m · BOM updates live
          </p>
          <button
            type="button"
            onClick={() => onRecalibrate(pipe.id)}
            className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-bp-wall/60 bg-bp-wall/10 py-2 font-mono text-[10px] tracking-[0.15em] text-bp-wall uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Recalibrate
          </button>
        </TabsContent>
      </Tabs>
      <CloseButton onClose={onClose} />
    </div>
  );
}

function FixtureCard({ fixture, onClose }: { fixture: Fixture; onClose: () => void }) {
  return (
    <div className="bp-panel rounded-sm p-3">
      <div className="bp-label">Fixture Inspection</div>
      <div className="font-display text-xl font-semibold text-bp-select">
        {fixture.id} · {fixture.type}
      </div>
      <div className="mt-3">
        <Row k="Tag" v={fixture.tag ?? fixture.id} />
        <Row k="Floor" v={`Floor ${fixture.floor}`} />
        <Row k="Grid coordinate" v={`${fixture.x}, ${fixture.y}`} />
        <Row k="Elevation" v={`${(fixture.elevation_m ?? (fixture.floor === 2 ? 3.3 : 0.45)).toFixed(2)} m`} />
        <Row k="Fixture unit load" v={`${DFU[fixture.type]} DFU`} />
        <Row k="Discharge class" v={fixture.type === "Commode" ? "Blackwater" : "Greywater"} />
        <Row k="Trap" v={fixture.trapType ?? TRAP_OF[fixture.type]} />
      </div>
      <CloseButton onClose={onClose} />
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-sm border border-border py-2 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:border-bp-wall/60 hover:text-bp-wall"
    >
      <X className="h-3.5 w-3.5" /> Close Inspector
    </button>
  );
}
