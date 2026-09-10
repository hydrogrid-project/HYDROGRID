<<<<<<< HEAD
import { memo, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
=======
import { memo, useMemo, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
import {
  CELL,
  DFU,
  GRID,
  NODES,
  PIPE_COLORS,
<<<<<<< HEAD
  TRAPS,
  strokeFor,
  type Fixture,
  type Pipe,
  type Room,
  type SimFlags,
=======
  TRAP_OF,
  strokeWidthForDiameter,
  type Fixture,
  type Pipe,
  type Room,
  type SimulationState,
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
} from "@/lib/hydrogrid";

const SIZE = (GRID - 1) * CELL;
const px = (v: number) => v * CELL;

function pathOf(points: Array<[number, number]>) {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${px(x)} ${px(y)}`).join(" ");
}

/** Pull the branch back from its stack so the severed link reads clearly. */
function severed(points: Array<[number, number]>): Array<[number, number]> {
  if (points.length < 2) return points;
  const last = points[points.length - 1]!;
  const prev = points[points.length - 2]!;
  const dx = last[0] - prev[0];
  const dy = last[1] - prev[1];
  const len = Math.hypot(dx, dy) || 1;
  const trimmed: [number, number] = [last[0] - (dx / len) * 1.4, last[1] - (dy / len) * 1.4];
  return [...points.slice(0, -1), trimmed];
}

interface Props {
  pipes: Pipe[];
  fixtures: Fixture[];
  rooms: Room[];
  selectedId: string | null;
<<<<<<< HEAD
  simulation: SimFlags;
=======
  selectedRoomId: string | null;
  simulation: SimulationState;
  chlorination: boolean;
  monsoon: boolean;
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
  onSelectPipe: (pipe: Pipe) => void;
  onSelectFixture: (fixture: Fixture) => void;
  onSelectRoom: (room: Room) => void;
}

<<<<<<< HEAD
const GridLayer = memo(function GridLayer() {
  const lines = useMemo(() => Array.from({ length: GRID }, (_, i) => i * CELL), []);
  return (
    <g stroke="var(--bp-grid)" strokeWidth="1">
      {lines.map((v) => (
        <line key={`v${v}`} x1={v} y1={0} x2={v} y2={SIZE} />
      ))}
      {lines.map((v) => (
        <line key={`h${v}`} x1={0} y1={v} x2={SIZE} y2={v} />
      ))}
    </g>
  );
});

const RoomLayer = memo(function RoomLayer({ rooms }: { rooms: Room[] }) {
  return (
    <g>
      {rooms.map((r) => {
        const [x, y, w, h] = r.bounds;
        return (
          <g key={r.id}>
            <rect
              x={px(x)}
              y={px(y)}
              width={px(w)}
              height={px(h)}
              fill="color-mix(in oklab, var(--bp-wall) 5%, transparent)"
              stroke="var(--bp-wall)"
              strokeWidth="2.5"
              strokeOpacity={r.floor === 2 ? 1 : 0.6}
            />
            <rect
              x={px(x) + 5}
              y={px(y) + 5}
              width={px(w) - 10}
              height={px(h) - 10}
              fill="none"
              stroke="var(--bp-wall)"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
            <rect
              x={px(x) + 6}
              y={px(y) + 6}
              width={Math.max(46, r.name.length * 8.6 + 30)}
              height="18"
              rx="2"
              fill="var(--bp-void)"
              stroke="var(--bp-wall)"
              strokeOpacity="0.55"
            />
            <text
              x={px(x) + 12}
              y={px(y) + 19}
              className="font-mono font-bold"
              fontSize="10.5"
              letterSpacing="1.4"
              fill="var(--bp-wall)"
            >
              {r.name.toUpperCase()} · F{r.floor}
            </text>
          </g>
        );
      })}
    </g>
  );
});

function PipeRun({
=======
const PipeRun = memo(function PipeRun({
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
  pipe,
  active,
  onSelect,
}: {
  pipe: Pipe;
  active: boolean;
  onSelect: () => void;
}) {
<<<<<<< HEAD
  const points = pipe.isolated ? severed(pipe.points) : pipe.points;
  const d = pathOf(points);
  const width = strokeFor(pipe.diameterMm);
  const end = points[points.length - 1]!;
=======
  const d = useMemo(() => pathOf(pipe.points), [pipe.points]);
  const color = PIPE_COLORS[pipe.fluid];
  const width = strokeWidthForDiameter(pipe.pipe_diameter_mm);
  const flow = pipe.fluid === "Greywater" || pipe.fluid === "Chlorinated";
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)

  return (
    <g>
      <path
        d={d}
        fill="none"
<<<<<<< HEAD
        stroke="var(--bp-select)"
        strokeWidth={width + 9}
        strokeLinecap="round"
        className={`transition-opacity duration-200 ${active ? "bp-glow opacity-30" : "opacity-0"}`}
=======
        stroke={color}
        strokeWidth={width + 8}
        strokeLinecap="round"
        className={`pipe-glow ${active ? "pipe-glow-on" : ""}`}
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
      />
      <path
        d={d}
        fill="none"
<<<<<<< HEAD
        stroke={active ? "var(--bp-select)" : PIPE_COLORS[pipe.fluid]}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-[stroke] duration-200 ${pipe.fluid === "Blackwater" ? "" : "bp-flow"}`}
      />
      {pipe.isolated && (
        <g stroke="var(--destructive)" strokeWidth="2.5" strokeLinecap="round">
          <line x1={px(end[0]) - 6} y1={px(end[1]) - 6} x2={px(end[0]) + 6} y2={px(end[1]) + 6} />
          <line x1={px(end[0]) - 6} y1={px(end[1]) + 6} x2={px(end[0]) + 6} y2={px(end[1]) - 6} />
        </g>
      )}
=======
        stroke={active ? "var(--bp-select)" : color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={pipe.severed ? 0.35 : 1}
        strokeDasharray={pipe.severed ? "4 7" : undefined}
        className={flow && !pipe.severed ? "bp-flow-grey" : undefined}
      />
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
      <path
        d={d}
        fill="none"
        stroke="transparent"
<<<<<<< HEAD
        strokeWidth={width + 12}
        className="cursor-pointer"
        onClick={onSelect}
      />
    </g>
  );
}

const MemoPipeRun = memo(PipeRun);

function FixtureGlyph({
  fx,
  active,
  onSelect,
}: {
  fx: Fixture;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <g className="cursor-pointer" onClick={onSelect} aria-label={`${fx.type} ${fx.id}`}>
          <circle
            cx={px(fx.x)}
            cy={px(fx.y)}
            r="12"
            fill="var(--bp-select)"
            className={`transition-opacity duration-200 ${active ? "bp-glow opacity-25" : "opacity-0"}`}
          />
          <circle
            cx={px(fx.x)}
            cy={px(fx.y)}
            r="9"
            fill="var(--bp-void)"
            stroke={active ? "var(--bp-select)" : "var(--bp-wall)"}
            strokeWidth="2.5"
            className="transition-[stroke] duration-200"
          />
          <text
            x={px(fx.x)}
            y={px(fx.y) + 3.5}
            textAnchor="middle"
            className="font-mono"
            fontSize="9"
            fill={active ? "var(--bp-select)" : "var(--bp-wall)"}
          >
            {fx.type === "Kitchen Sink" ? "K" : fx.type[0]}
          </text>
          <text
            x={px(fx.x) + 13}
            y={px(fx.y) - 10}
            className="font-mono"
            fontSize="8.5"
            fill="var(--bp-wall)"
            fillOpacity="0.65"
          >
            {fx.id}·F{fx.floor}
          </text>
        </g>
      </TooltipTrigger>
      <TooltipContent className="font-mono text-[11px]">
        <div className="font-semibold">
          {fx.id} · {fx.type}
        </div>
        <div>
          {DFU[fx.type]} DFU · {fx.room}
        </div>
        <div>Elevation {fx.elevationM.toFixed(2)} m</div>
        <div>Trap: {TRAPS[fx.type]}</div>
      </TooltipContent>
    </Tooltip>
  );
}

const MemoFixtureGlyph = memo(FixtureGlyph);
=======
        strokeWidth="14"
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      />
    </g>
  );
});
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)

export function Blueprint2D({
  pipes,
  fixtures,
  rooms,
  selectedId,
  selectedRoomId,
  simulation,
  chlorination,
  monsoon,
  onSelectPipe,
  onSelectFixture,
  onSelectRoom,
}: Props) {
<<<<<<< HEAD
  return (
    <svg
      viewBox={`${-CELL} ${-CELL} ${SIZE + CELL * 2} ${SIZE + CELL * 2}`}
      className="h-full w-full"
      role="img"
      aria-label="2D plumbing floor plan on a 20 by 20 coordinate grid"
    >
      <GridLayer />
      <RoomLayer rooms={rooms} />

      {simulation.monsoon && (
        <path
          d={`M ${px(NODES.cistern.x)} ${px(NODES.cistern.y)} L ${px(NODES.soakpit.x)} ${px(
            NODES.cistern.y,
          )} L ${px(NODES.soakpit.x)} ${px(NODES.soakpit.y)}`}
          fill="none"
          stroke="var(--bp-rain)"
          strokeWidth="5"
          strokeDasharray="10 8"
          className="bp-flow"
        />
      )}

      {pipes.map((pipe) => (
        <MemoPipeRun
          key={pipe.id}
          pipe={pipe}
          active={selectedId === pipe.id}
          onSelect={() => onSelectPipe(pipe)}
        />
      ))}

      {fixtures.map((fx) => (
        <MemoFixtureGlyph
          key={fx.id}
          fx={fx}
          active={selectedId === fx.id}
          onSelect={() => onSelectFixture(fx)}
        />
      ))}

      {Object.values(NODES).map((n) => {
        const color =
          n.kind === "sewer"
            ? "var(--bp-blackwater)"
            : n.kind === "chlorine"
              ? "#06B6D4"
              : "var(--bp-greywater)";
        const pulsing = simulation.monsoon && n.kind === "soakpit";
        const dim = n.kind === "chlorine" && !simulation.chlorination;
        return (
          <g key={n.id} opacity={dim ? 0.3 : 1}>
            {pulsing && <circle cx={px(n.x)} cy={px(n.y)} r="20" fill="var(--bp-rain)" className="bp-pulse" />}
            <rect
              x={px(n.x) - 11}
              y={px(n.y) - 11}
              width="22"
              height="22"
              fill="var(--bp-void)"
              stroke={color}
              strokeWidth="2.5"
            />
            <rect
              x={px(n.x) - 5}
              y={px(n.y) - 5}
              width="10"
              height="10"
              fill={color}
              fillOpacity="0.7"
            />
            <text
              x={px(n.x)}
              y={px(n.y) + 26}
              textAnchor="middle"
              className="font-mono"
              fontSize="9"
              letterSpacing="1"
              fill="var(--bp-wall)"
              fillOpacity="0.85"
            >
              {n.label.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
=======
  const lines = useMemo(() => Array.from({ length: GRID }, (_, i) => i * CELL), []);
  const [tip, setTip] = useState<Fixture | null>(null);
  const surge = monsoon || simulation === "SURPLUS_RAIN";

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={`${-CELL} ${-CELL} ${SIZE + CELL * 2} ${SIZE + CELL * 2}`}
        className="h-full w-full"
        role="img"
        aria-label="2D plumbing floor plan on a 20 by 20 coordinate grid"
      >
        <g stroke="var(--bp-grid)" strokeWidth="1">
          {lines.map((v) => (
            <line key={`v${v}`} x1={v} y1={0} x2={v} y2={SIZE} />
          ))}
          {lines.map((v) => (
            <line key={`h${v}`} x1={0} y1={v} x2={SIZE} y2={v} />
          ))}
        </g>

        {rooms.map((r) => {
          const [x, y, w, h] = r.bounds;
          const active = selectedRoomId === r.id;
          return (
            <g
              key={r.id}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelectRoom(r);
              }}
            >
              <rect
                x={px(x)}
                y={px(y)}
                width={px(w)}
                height={px(h)}
                className={`room-plate ${active ? "room-plate-on" : ""}`}
                fill="color-mix(in oklab, var(--bp-wall) 5%, transparent)"
                stroke="var(--bp-wall)"
                strokeWidth="2.5"
              />
              <rect
                x={px(x) + 5}
                y={px(y) + 5}
                width={px(w) - 10}
                height={px(h) - 10}
                fill="none"
                stroke="var(--bp-wall)"
                strokeOpacity="0.45"
                strokeWidth="1"
              />
              <g transform={`translate(${px(x) + 10}, ${px(y) + 8})`}>
                <rect
                  rx="3"
                  width={Math.min(px(w) - 20, r.name.length * 8.2 + 16)}
                  height="18"
                  fill="color-mix(in oklab, var(--bp-void) 82%, var(--bp-wall))"
                  stroke="var(--bp-wall)"
                  strokeWidth="1"
                />
                <text
                  x="8"
                  y="13"
                  className="font-mono"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.4"
                  fill="var(--bp-wall)"
                >
                  {r.name.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}

        {surge && (
          <path
            d={`M ${px(NODES.cistern.x)} ${px(NODES.cistern.y)} L ${px(NODES.soakpit.x)} ${px(
              NODES.cistern.y,
            )} L ${px(NODES.soakpit.x)} ${px(NODES.soakpit.y)}`}
            fill="none"
            stroke="var(--bp-rain)"
            strokeWidth="4"
            strokeDasharray="7 6"
            className="bp-flow"
          />
        )}

        {chlorination && (
          <path
            d={`M ${px(NODES.duct.x)} ${px(NODES.duct.y)} L ${px(NODES.chlorination.x)} ${px(
              NODES.duct.y,
            )} L ${px(NODES.chlorination.x)} ${px(NODES.chlorination.y)}`}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3.5"
            className="bp-flow-grey"
          />
        )}

        {pipes.map((pipe) => (
          <PipeRun
            key={pipe.id}
            pipe={pipe}
            active={selectedId === pipe.id}
            onSelect={() => onSelectPipe(pipe)}
          />
        ))}

        {fixtures.map((fx) => {
          const active = selectedId === fx.id;
          return (
            <g
              key={fx.id}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelectFixture(fx);
              }}
              onMouseEnter={() => setTip(fx)}
              onMouseLeave={() => setTip(null)}
              aria-label={`${fx.type} ${fx.id}`}
            >
              <circle
                cx={px(fx.x)}
                cy={px(fx.y)}
                r="11"
                className={`fx-glow ${active ? "fx-glow-on" : ""}`}
                fill="transparent"
                stroke={active ? "var(--bp-select)" : "transparent"}
              />
              <circle
                cx={px(fx.x)}
                cy={px(fx.y)}
                r="9"
                fill="var(--bp-void)"
                stroke={active ? "var(--bp-select)" : "var(--bp-wall)"}
                strokeWidth="2.5"
              />
              <text
                x={px(fx.x)}
                y={px(fx.y) + 3.5}
                textAnchor="middle"
                className="font-mono"
                fontSize="9"
                fill={active ? "var(--bp-select)" : "var(--bp-wall)"}
              >
                {fx.type === "Kitchen Sink" ? "K" : fx.type[0]}
              </text>
              <text
                x={px(fx.x) + 13}
                y={px(fx.y) - 10}
                className="font-mono"
                fontSize="8.5"
                fill="var(--bp-wall)"
                fillOpacity="0.7"
              >
                {(fx.tag ?? fx.id)}·F{fx.floor}
              </text>
            </g>
          );
        })}

        {Object.values(NODES).map((n) => {
          if (n.kind === "chlorination" && !chlorination) return null;
          const pulse = n.kind === "soakpit" && surge;
          return (
            <g key={n.id}>
              <rect
                x={px(n.x) - 11}
                y={px(n.y) - 11}
                width="22"
                height="22"
                fill="var(--bp-void)"
                stroke={
                  n.kind === "sewer"
                    ? "var(--bp-blackwater)"
                    : n.kind === "chlorination"
                      ? "#06B6D4"
                      : "var(--bp-greywater)"
                }
                strokeWidth="2.5"
                className={pulse ? "soak-pulse" : undefined}
              />
              <rect
                x={px(n.x) - 5}
                y={px(n.y) - 5}
                width="10"
                height="10"
                fill={
                  n.kind === "sewer"
                    ? "var(--bp-blackwater)"
                    : n.kind === "chlorination"
                      ? "#06B6D4"
                      : "var(--bp-greywater)"
                }
                fillOpacity="0.7"
              />
              <text
                x={px(n.x)}
                y={px(n.y) + 26}
                textAnchor="middle"
                className="font-mono"
                fontSize="9"
                fontWeight="700"
                letterSpacing="1"
                fill="var(--bp-wall)"
                fillOpacity="0.85"
              >
                {n.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      <HoverCard open={!!tip}>
        <HoverCardTrigger asChild>
          <span className="pointer-events-none absolute inset-0" />
        </HoverCardTrigger>
        {tip && (
          <HoverCardContent className="pointer-events-none w-56" side="right">
            <p className="font-mono text-[10px] tracking-[0.16em] text-bp-wall uppercase">
              {tip.tag ?? tip.id}
            </p>
            <p className="font-display text-sm font-semibold">{tip.type}</p>
            <dl className="mt-1.5 space-y-0.5 font-mono text-[10px] text-muted-foreground">
              <div className="flex justify-between">
                <dt>DFU</dt>
                <dd className="text-foreground">{DFU[tip.type]}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Elevation</dt>
                <dd className="text-foreground">
                  {(tip.elevation_m ?? (tip.floor === 2 ? 3.3 : 0.45)).toFixed(2)} m
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Trap</dt>
                <dd className="text-foreground">{tip.trapType ?? TRAP_OF[tip.type]}</dd>
              </div>
            </dl>
          </HoverCardContent>
        )}
      </HoverCard>
    </div>
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
  );
}
