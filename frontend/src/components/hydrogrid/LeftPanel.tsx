import { useState } from "react";
import { Beaker, CloudRain, Droplets, FileImage, Plus, Shield, Waves } from "lucide-react";
import type { BlueprintSource } from "./Landing";
import {
  DFU,
  FIXTURE_TYPES,
  NODES,
  type Fixture,
  type FixtureType,
  type SimulationState,
} from "@/lib/hydrogrid";

interface Props {
  fixtures: Fixture[];
  simulation: SimulationState;
  blueprint?: BlueprintSource;
  chlorination: boolean;
  monsoon: boolean;
  onAddFixture: (fixture: Omit<Fixture, "id">) => void;
  onToggleSimulation: (state: Exclude<SimulationState, "NORMAL">) => void;
  onToggleChlorination: () => void;
  onToggleMonsoon: () => void;
  onSelectFixture: (fixture: Fixture) => void;
}

const fieldClass =
  "w-full rounded-sm border border-border bg-bp-void px-2 py-1.5 font-mono text-xs text-foreground outline-none focus:border-bp-wall";

export function LeftPanel({
  fixtures,
  simulation,
  blueprint,
  chlorination,
  monsoon,
  onAddFixture,
  onToggleSimulation,
  onToggleChlorination,
  onToggleMonsoon,
  onSelectFixture,
}: Props) {
  const [type, setType] = useState<FixtureType>("Washbasin");
  const [floor, setFloor] = useState<1 | 2>(1);
  const [x, setX] = useState(8);
  const [y, setY] = useState(5);
  const clamp = (v: number) => Math.max(0, Math.min(19, Math.round(v || 0)));
  const contamination = simulation === "CONTAMINATION_EVENT";

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      {blueprint && (
        <section className="bp-panel rounded-sm p-3">
          <h2 className="bp-label mb-2 flex items-center gap-1.5">
            <FileImage className="h-3 w-3" /> Source Blueprint
          </h2>
          {blueprint.thumbnail ? (
            <img
              src={blueprint.thumbnail}
              alt={`Uploaded blueprint ${blueprint.name}`}
              className="h-28 w-full rounded-sm border border-bp-wall/30 object-cover"
            />
          ) : (
            <div className="flex h-28 w-full items-center justify-center rounded-sm border border-dashed border-bp-wall/40 font-mono text-[10px] tracking-[0.15em] text-bp-wall uppercase">
              Sample 2BHK plan
            </div>
          )}
          <p className="mt-2 truncate font-mono text-[10px] text-muted-foreground">{blueprint.name}</p>
        </section>
      )}

      <section className="bp-panel rounded-sm p-3">
        <h2 className="bp-label mb-3 flex items-center gap-1.5">
          <Droplets className="h-3 w-3" /> Fixture Placement
        </h2>
        <div className="space-y-2.5">
          <label className="block">
            <span className="bp-label">Fixture type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FixtureType)}
              className={`${fieldClass} mt-1`}
            >
              {FIXTURE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t} · {DFU[t]} DFU
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="bp-label">Floor level</span>
            <select
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value) as 1 | 2)}
              className={`${fieldClass} mt-1`}
            >
              <option value={1}>Floor 1</option>
              <option value={2}>Floor 2</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="bp-label">X (0–19)</span>
              <input
                type="number"
                min={0}
                max={19}
                value={x}
                onChange={(e) => setX(clamp(Number(e.target.value)))}
                className={`${fieldClass} mt-1`}
              />
            </label>
            <label className="block">
              <span className="bp-label">Y (0–19)</span>
              <input
                type="number"
                min={0}
                max={19}
                value={y}
                onChange={(e) => setY(clamp(Number(e.target.value)))}
                className={`${fieldClass} mt-1`}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => onAddFixture({ type, floor, x: clamp(x), y: clamp(y) })}
            className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-bp-wall/60 bg-bp-wall/10 py-2 font-mono text-[11px] tracking-[0.15em] text-bp-wall uppercase transition-colors hover:bg-bp-wall/20"
          >
            <Plus className="h-3.5 w-3.5" /> Add Fixture
          </button>
        </div>
      </section>

      <section className="bp-panel rounded-sm p-3">
        <h2 className="bp-label mb-3 flex items-center gap-1.5">
          <Beaker className="h-3 w-3" /> Physics Simulation
        </h2>
        <div className="space-y-2">
          <SimToggle
            icon={<Shield className="h-3.5 w-3.5" />}
            label="Enable Household Chlorination"
            active={chlorination}
            onClick={onToggleChlorination}
          />
          <SimToggle
            icon={<Waves className="h-3.5 w-3.5" />}
            label="Simulate Viscous Contamination"
            active={contamination}
            onClick={() => onToggleSimulation("CONTAMINATION_EVENT")}
          />
          <SimToggle
            icon={<CloudRain className="h-3.5 w-3.5" />}
            label="Simulate Monsoon Surge"
            active={monsoon || simulation === "SURPLUS_RAIN"}
            onClick={onToggleMonsoon}
          />
        </div>
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
          {contamination
            ? "Kitchen–stack bridge isolated in the utility duct. P-traps hold the seal; harvest loop remains backflow-safe."
            : monsoon || simulation === "SURPLUS_RAIN"
              ? "Cistern at capacity — emergency overflow discharging to the soak pit."
              : chlorination
                ? "Master Bath greywater is rerouted to the chlorination tank. Freshwater offset +40%."
                : "All branches nominal. Greywater recovery loop active."}
        </p>
      </section>

      <section className="bp-panel rounded-sm p-3">
        <h2 className="bp-label mb-2">Service Nodes</h2>
        <ul className="space-y-1 font-mono text-[10px] text-muted-foreground">
          {Object.values(NODES)
            .filter((n) => n.kind !== "chlorination" || chlorination)
            .map((n) => (
              <li key={n.id} className="flex justify-between">
                <span>{n.label}</span>
                <span className="text-bp-wall">
                  {n.x},{n.y}
                </span>
              </li>
            ))}
        </ul>
      </section>

      <section className="bp-panel rounded-sm p-3">
        <h2 className="bp-label mb-2">Fixture Schedule ({fixtures.length})</h2>
        <ul className="space-y-1">
          {fixtures.map((fx) => (
            <li key={fx.id}>
              <button
                type="button"
                onClick={() => onSelectFixture(fx)}
                className="flex w-full justify-between rounded-sm px-1 py-1 font-mono text-[10px] text-muted-foreground hover:bg-bp-wall/10 hover:text-bp-wall"
              >
                <span>
                  {fx.id} · {fx.type}
                </span>
                <span>
                  F{fx.floor} · {fx.x},{fx.y}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SimToggle({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-sm border px-2.5 py-2 text-left font-mono text-[10px] tracking-[0.08em] uppercase transition-colors ${
        active
          ? "border-bp-select/70 bg-bp-select/15 text-bp-select"
          : "border-border text-muted-foreground hover:border-bp-wall/60 hover:text-bp-wall"
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      <span className={`h-2 w-2 rounded-full ${active ? "bg-bp-select" : "bg-muted-foreground/40"}`} />
    </button>
  );
}
