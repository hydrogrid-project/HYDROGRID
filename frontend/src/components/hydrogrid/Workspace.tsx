import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import { ArrowLeft, Boxes, ChevronDown, FileDown, LayoutGrid, Waypoints } from "lucide-react";
import { Blueprint2D } from "./Blueprint2D";
import { LeftPanel } from "./LeftPanel";
import { RightPanel, type Selection } from "./RightPanel";
import { ThemeToggle } from "./ThemeToggle";
import type { BlueprintSource } from "./Landing";
import {
  buildPipes,
  computeMetrics,
  findRoom,
  type AppModel,
  type Fixture,
  type SimulationState,
  type UserOverride,
} from "@/lib/hydrogrid";
import { exportDocx, exportPdf } from "@/lib/export-docs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Riser3D = lazy(() => import("./Riser3D"));

type ActiveView = "2D_FLOORPLAN" | "3D_RISER";

interface Props {
  blueprint: BlueprintSource;
  model: AppModel;
  onExit: () => void;
}

export function Workspace({ blueprint, model, onExit }: Props) {
  const [activeView, setActiveView] = useState<ActiveView>("2D_FLOORPLAN");
  const [selectedElement, setSelectedElement] = useState<Selection>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>("NORMAL");
  const [chlorination, setChlorination] = useState(false);
  const [monsoon, setMonsoon] = useState(false);
  const [fixtures, setFixtures] = useState<Fixture[]>(model.fixtures);
  const [rooms] = useState(model.rooms);
  const [overrides, setOverrides] = useState<UserOverride[]>([]);
  const [tariffInrPerKl, setTariffInrPerKl] = useState(40);

  const flags = useMemo(
    () => ({
      chlorination,
      contamination: simulationState === "CONTAMINATION_EVENT",
      monsoon: monsoon || simulationState === "SURPLUS_RAIN",
    }),
    [chlorination, monsoon, simulationState],
  );

  const pipes = useMemo(
    () => buildPipes(fixtures, simulationState, overrides, flags, rooms),
    [fixtures, simulationState, overrides, flags, rooms],
  );
  const metrics = useMemo(
    () => computeMetrics(pipes, simulationState, flags, rooms),
    [pipes, simulationState, flags, rooms],
  );

  const selectedId =
    selectedElement?.kind === "pipe"
      ? selectedElement.pipe.id
      : selectedElement?.kind === "fixture"
        ? selectedElement.fixture.id
        : null;
  const selectedRoomId = selectedElement?.kind === "room" ? selectedElement.roomId : null;

  const addFixture = useCallback(
    (draft: Omit<Fixture, "id">) => {
      setFixtures((prev) => {
        const found = findRoom(rooms, draft.x, draft.y, draft.floor);
        const next: Fixture = {
          ...draft,
          id: `FX-${String(prev.length + 1).padStart(2, "0")}`,
          tag: `${draft.type.slice(0, 2).toUpperCase()}-${String(prev.length + 1).padStart(2, "0")}`,
        };
        if (found?.id) next.roomId = found.id;
        return [...prev, next];
      });
    },
    [rooms],
  );

  const toggleSimulation = useCallback((next: Exclude<SimulationState, "NORMAL">) => {
    setSimulationState((prev) => (prev === next ? "NORMAL" : next));
  }, []);

  const applyOverride = useCallback((override: UserOverride) => {
    setOverrides((prev) => {
      const current = prev.find((o) => o.pathId === override.pathId);
      return [...prev.filter((o) => o.pathId !== override.pathId), { ...current, ...override }];
    });
  }, []);

  const recalibrate = useCallback((pathId: string) => {
    setOverrides((prev) => prev.filter((o) => o.pathId !== pathId));
  }, []);

  const exportCtx = {
    projectName: "HydroGrid Studio Dual Network",
    blueprintName: blueprint.name,
    pipes,
    fixtures,
    metrics,
    chlorination,
    tariffInrPerKl,
  };

  return (
    <div className="flex min-h-screen flex-col bg-bp-void text-foreground">
      <header className="flex flex-wrap items-center gap-3 border-b border-bp-wall/25 px-4 py-3">
        <button
          type="button"
          onClick={onExit}
          aria-label="Back to start"
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-bp-wall/60 hover:text-bp-wall"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Waypoints className="h-5 w-5 text-bp-wall" />
        <div>
          <h1 className="font-display text-lg leading-none font-semibold tracking-wide text-foreground">
            HydroGrid Studio
          </h1>
          <p className="bp-label mt-0.5">Generative MEP Plumbing Engine</p>
        </div>
        <span className="rounded-sm border border-bp-wall/40 px-1.5 py-0.5 font-mono text-[10px] text-bp-wall">
          v2.4.1
        </span>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-sm border border-border p-0.5">
            <ViewTab
              active={activeView === "2D_FLOORPLAN"}
              onClick={() => setActiveView("2D_FLOORPLAN")}
              icon={<LayoutGrid className="h-3.5 w-3.5" />}
              label="2D Floorplan"
            />
            <ViewTab
              active={activeView === "3D_RISER"}
              onClick={() => setActiveView("3D_RISER")}
              icon={<Boxes className="h-3.5 w-3.5" />}
              label="3D Riser"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-sm border border-bp-wall/60 bg-bp-wall/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-bp-wall uppercase transition-colors hover:bg-bp-wall/20"
              >
                <FileDown className="h-3.5 w-3.5" /> Export BoM
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportPdf(exportCtx)}>Export PDF schedule</DropdownMenuItem>
              <DropdownMenuItem onClick={() => void exportDocx(exportCtx)}>Export DOCX spec</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:h-[calc(100vh-61px)] lg:flex-row lg:overflow-hidden">
        <aside className="border-b border-bp-wall/25 lg:w-[300px] lg:shrink-0 lg:border-r lg:border-b-0 lg:overflow-y-auto">
          <LeftPanel
            fixtures={fixtures}
            simulation={simulationState}
            blueprint={blueprint}
            chlorination={chlorination}
            monsoon={monsoon}
            onAddFixture={addFixture}
            onToggleSimulation={toggleSimulation}
            onToggleChlorination={() => setChlorination((v) => !v)}
            onToggleMonsoon={() => {
              setMonsoon((v) => {
                const next = !v;
                setSimulationState((prev) =>
                  next ? "SURPLUS_RAIN" : prev === "SURPLUS_RAIN" ? "NORMAL" : prev,
                );
                return next;
              });
            }}
            onSelectFixture={(fixture) => setSelectedElement({ kind: "fixture", fixture })}
          />
        </aside>

        <main className="relative min-h-[70vh] flex-1 p-3 lg:min-h-0">
          <div className="bp-panel h-full min-h-[60vh] w-full rounded-sm p-2 lg:min-h-0">
            {activeView === "2D_FLOORPLAN" ? (
              <Blueprint2D
                pipes={pipes}
                fixtures={fixtures}
                rooms={rooms}
                selectedId={selectedId}
                selectedRoomId={selectedRoomId}
                simulation={simulationState}
                chlorination={chlorination}
                monsoon={monsoon}
                onSelectPipe={(pipe) => setSelectedElement({ kind: "pipe", pipe })}
                onSelectFixture={(fixture) => setSelectedElement({ kind: "fixture", fixture })}
                onSelectRoom={(room) => setSelectedElement({ kind: "room", roomId: room.id, name: room.name })}
              />
            ) : (
              <ClientOnly fallback={<CanvasFallback />}>
                <Suspense fallback={<CanvasFallback />}>
                  <Riser3D
                    pipes={pipes}
                    fixtures={fixtures}
                    rooms={rooms}
                    selectedId={selectedId}
                    simulation={simulationState}
                    chlorination={chlorination}
                    monsoon={monsoon}
                    onSelectPipe={(pipe) => setSelectedElement({ kind: "pipe", pipe })}
                    onSelectFixture={(fixture) => setSelectedElement({ kind: "fixture", fixture })}
                    onClear={() => setSelectedElement(null)}
                  />
                </Suspense>
              </ClientOnly>
            )}
          </div>
          <div className="pointer-events-none absolute bottom-5 left-6 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground">
            <Legend color="#EA580C" label="Blackwater · 110mm soil" />
            <Legend color="#10B981" label="Greywater loop" />
            {chlorination && <Legend color="#06B6D4" label="Chlorinated GW" />}
            {(monsoon || simulationState === "SURPLUS_RAIN") && (
              <Legend color="var(--bp-rain)" label="Storm overflow" />
            )}
          </div>
        </main>

        <aside className="border-t border-bp-wall/25 lg:w-[320px] lg:shrink-0 lg:border-t-0 lg:border-l lg:overflow-y-auto">
          <RightPanel
            metrics={metrics}
            selection={selectedElement}
            simulation={simulationState}
            chlorination={chlorination}
            tariffInrPerKl={tariffInrPerKl}
            pipes={pipes}
            onTariffChange={setTariffInrPerKl}
            onOverride={applyOverride}
            onRecalibrate={recalibrate}
            onClose={() => setSelectedElement(null)}
          />
        </aside>
      </div>
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors ${
        active ? "bg-bp-wall/20 text-bp-wall" : "text-muted-foreground hover:text-bp-wall"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-0.5 w-5" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function CanvasFallback() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center font-mono text-[11px] text-muted-foreground">
      Initialising 3D riser diagram…
    </div>
  );
}
