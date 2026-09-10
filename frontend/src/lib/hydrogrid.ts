// HydroGrid Studio — MEP plumbing model, routing solver and metric derivations.

export type FixtureType = "Commode" | "Washbasin" | "Shower" | "Kitchen Sink";
<<<<<<< HEAD
export type FluidClass = "Blackwater" | "Greywater" | "Chlorinated";
export type Floor = 1 | 2;

/** Independent physics simulation toggles wired to the left sidebar. */
export interface SimFlags {
  chlorination: boolean;
  contamination: boolean;
  monsoon: boolean;
}

export const NO_SIM: SimFlags = { chlorination: false, contamination: false, monsoon: false };
=======
export type FluidClass = "Blackwater" | "Greywater" | "Chlorinated" | "StormOverflow";
export type SimulationState = "NORMAL" | "CONTAMINATION_EVENT" | "SURPLUS_RAIN";
export type PipeMaterial = "PVC" | "CPVC" | "Cast Iron" | "PEX";
export type PipeDiameterMm = 32 | 40 | 50 | 75 | 110;
export type AssignmentClass = "Blackwater" | "Greywater" | "Chlorinated" | "StormOverflow" | "Isolated";
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)

export interface Fixture {
  id: string;
  type: FixtureType;
  floor: Floor;
  x: number;
  y: number;
<<<<<<< HEAD
  /** Room name the vision model assigned this fixture to. */
  room: string;
  elevationM: number;
=======
  roomId?: string;
  elevation_m?: number;
  trapType?: string;
  tag?: string;
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
}

export interface GridNode {
  id: string;
  label: string;
  x: number;
  y: number;
<<<<<<< HEAD
  kind: "sewer" | "duct" | "cistern" | "soakpit" | "chlorine";
=======
  kind: "sewer" | "duct" | "cistern" | "soakpit" | "chlorination";
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
}

export interface Room {
  id: string;
  name: string;
<<<<<<< HEAD
  /** [x, y, width, height] in grid cells. */
  bounds: [number, number, number, number];
  floor: Floor;
}

export type PipeMaterial = "PVC" | "CPVC" | "Cast Iron" | "PEX";
export const MATERIALS: PipeMaterial[] = ["PVC", "CPVC", "Cast Iron", "PEX"];
export const DIAMETERS = [32, 40, 50, 75, 110] as const;

export interface PipeOverride {
  lengthM?: number;
  diameterMm?: number;
  material?: PipeMaterial;
}

export type Overrides = Record<string, PipeOverride>;

export interface Pipe {
=======
  bounds: [number, number, number, number];
  floor: 1 | 2;
  label?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface ComponentNode {
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
  id: string;
  type: FixtureType | "Cistern" | "Soak Pit" | "Sewer Stack" | "Chlorination Tank" | "Septic";
  tag: string;
  roomId?: string;
  roomName?: string;
  floor: 0 | 1 | 2;
  x: number;
  y: number;
  elevation_m: number;
  dfu: number;
  trapType: string;
  icon: string;
}

export interface UserOverride {
  pathId: string;
  length_m?: number;
  pipe_diameter_mm?: PipeDiameterMm;
  material?: PipeMaterial;
}

export interface HydraulicPath {
  id: string;
  componentId: string;
  fixtureId: string;
  fixtureType: FixtureType;
  room: string;
  floor: Floor;
  fluid: FluidClass;
<<<<<<< HEAD
  /** Kitchen branch cut from the blackwater bridge by P-trap isolation. */
  isolated: boolean;
  points: Array<[number, number]>;
  target: GridNode;
  diameterMm: number;
=======
  assignmentClass: AssignmentClass;
  diverted: boolean;
  severed: boolean;
  points: Array<[number, number]>;
  target: GridNode;
  diameter: string;
  pipe_diameter_mm: PipeDiameterMm;
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
  material: PipeMaterial;
  runLength: number;
  slope: string;
  dfu: number;
  fittings: string[];
<<<<<<< HEAD
  flowLps: number;
  velocity: number;
  headLoss: number;
  overridden: boolean;
=======
  velocity_ms: number;
  headLoss_m: number;
  generative: {
    length_m: number;
    pipe_diameter_mm: PipeDiameterMm;
    material: PipeMaterial;
  };
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
}

export type Pipe = HydraulicPath;

export const GRID = 20;
export const CELL = 36;

export const FIXTURE_TYPES: FixtureType[] = ["Commode", "Washbasin", "Shower", "Kitchen Sink"];

<<<<<<< HEAD
export const NODES = {
=======
export interface ServiceNodes {
  sewer: GridNode;
  duct: GridNode;
  cistern: GridNode;
  soakpit: GridNode;
  chlorination: GridNode;
}

export const NODES: ServiceNodes = {
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
  sewer: { id: "SEWER-STACK", label: "Sewer Stack", x: 0, y: 8, kind: "sewer" },
  duct: { id: "UTILITY-DUCT", label: "Utility Duct", x: 10, y: 8, kind: "duct" },
  cistern: { id: "CISTERN-B1", label: "Basement Cistern", x: 10, y: 11, kind: "cistern" },
  soakpit: { id: "SOAK-PIT", label: "Soak Pit", x: 17, y: 16, kind: "soakpit" },
<<<<<<< HEAD
  chlorine: { id: "CL-TANK", label: "Chlorination Tank", x: 17, y: 11, kind: "chlorine" },
} satisfies Record<string, GridNode>;
=======
  chlorination: { id: "CL-TANK", label: "Chlorination Tank", x: 13, y: 14, kind: "chlorination" },
};
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)

function room(
  id: string,
  name: string,
  x: number,
  y: number,
  w: number,
  h: number,
  floor: 1 | 2,
): Room {
  return { id, name, label: name, bounds: [x, y, w, h], floor, x, y, w, h };
}

export const ROOMS: Room[] = [
<<<<<<< HEAD
  { id: "R-201", name: "Master Bath", bounds: [2, 2, 6, 5], floor: 2 },
  { id: "R-202", name: "Bedroom", bounds: [11, 2, 7, 5], floor: 2 },
  { id: "R-203", name: "Corridor", bounds: [2, 8, 16, 2], floor: 2 },
  { id: "R-101", name: "Living", bounds: [2, 2, 7, 5], floor: 1 },
  { id: "R-102", name: "Kitchen", bounds: [12, 2, 6, 5], floor: 1 },
  { id: "R-103", name: "Utility Duct", bounds: [2, 8, 16, 2], floor: 1 },
  { id: "R-104", name: "Utility Shaft", bounds: [8, 10, 5, 4], floor: 1 },
  { id: "R-105", name: "Powder Room", bounds: [2, 12, 5, 4], floor: 1 },
];

export const INITIAL_FIXTURES: Fixture[] = [
  { id: "FX-01", type: "Commode", floor: 2, x: 3, y: 3, room: "Master Bath", elevationM: 3.2 },
  { id: "FX-02", type: "Washbasin", floor: 2, x: 6, y: 5, room: "Master Bath", elevationM: 3.8 },
  { id: "FX-03", type: "Shower", floor: 2, x: 7, y: 3, room: "Master Bath", elevationM: 3.05 },
  { id: "FX-04", type: "Kitchen Sink", floor: 1, x: 14, y: 4, room: "Kitchen", elevationM: 0.85 },
  { id: "FX-05", type: "Commode", floor: 1, x: 4, y: 14, room: "Powder Room", elevationM: 0.2 },
  { id: "FX-06", type: "Washbasin", floor: 1, x: 6, y: 13, room: "Powder Room", elevationM: 0.8 },
  { id: "FX-07", type: "Shower", floor: 1, x: 16, y: 6, room: "Kitchen", elevationM: 0.05 },
=======
  room("R-MB", "Master Bath", 2, 2, 6, 5, 2),
  room("R-KT", "Kitchen", 12, 2, 6, 5, 2),
  room("R-CO", "Corridor", 2, 8, 16, 2, 1),
  room("R-UD", "Utility Duct", 8, 7, 5, 2, 1),
  room("R-US", "Utility Shaft", 8, 10, 5, 4, 1),
  room("R-PR", "Powder Room", 2, 12, 5, 4, 1),
];

export const INITIAL_FIXTURES: Fixture[] = [
  { id: "FX-01", type: "Commode", floor: 2, x: 3, y: 3, roomId: "R-MB", tag: "WC-MB-01" },
  { id: "FX-02", type: "Washbasin", floor: 2, x: 6, y: 5, roomId: "R-MB", tag: "WB-MB-01" },
  { id: "FX-03", type: "Shower", floor: 2, x: 7, y: 3, roomId: "R-MB", tag: "SH-MB-01" },
  { id: "FX-04", type: "Kitchen Sink", floor: 2, x: 14, y: 4, roomId: "R-KT", tag: "KS-KT-01" },
  { id: "FX-05", type: "Commode", floor: 1, x: 4, y: 14, roomId: "R-PR", tag: "WC-PR-01" },
  { id: "FX-06", type: "Washbasin", floor: 1, x: 16, y: 6, roomId: "R-KT", tag: "WB-KT-01" },
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
];

export const DFU: Record<FixtureType, number> = {
  Commode: 4,
  Washbasin: 1,
  Shower: 2,
  "Kitchen Sink": 2,
};
<<<<<<< HEAD
=======

export const FIXTURE_ICON: Record<FixtureType, string> = {
  Commode: "wc",
  Washbasin: "basin",
  Shower: "shower",
  "Kitchen Sink": "sink",
};

export const TRAP_OF: Record<FixtureType, string> = {
  Commode: "Integral S-trap",
  Washbasin: "40mm P-trap",
  Shower: "50mm P-trap",
  "Kitchen Sink": "40mm P-trap",
};
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)

export const TRAPS: Record<FixtureType, string> = {
  Commode: "Integral S-trap",
  Washbasin: '1.5" P-trap',
  Shower: '2" P-trap (floor)',
  "Kitchen Sink": '1.5" bottle trap',
};

const FLUID_OF: Record<FixtureType, Exclude<FluidClass, "Chlorinated">> = {
  Commode: "Blackwater",
  Washbasin: "Greywater",
  Shower: "Greywater",
  "Kitchen Sink": "Greywater",
};

export const PIPE_COLORS: Record<FluidClass, string> = {
  Blackwater: "#EA580C",
  Greywater: "#10B981",
  Chlorinated: "#06B6D4",
<<<<<<< HEAD
};

/** Sanitise obviously hallucinated vision output before it reaches state. */
export function sanitizeFixtures(raw: Fixture[]): Fixture[] {
  return raw.map((fx) =>
    fx.room.toLowerCase().includes("kitchen") && fx.type === "Shower"
      ? { ...fx, type: "Kitchen Sink" }
      : fx,
  );
}

/** Orthogonal (Manhattan) route: run along Y first, then X into the stack. */
=======
  StormOverflow: "#3B82F6",
};

export const HAZEN_C: Record<PipeMaterial, number> = {
  PVC: 150,
  CPVC: 150,
  PEX: 140,
  "Cast Iron": 100,
};

export const DIAMETER_OPTIONS: PipeDiameterMm[] = [32, 40, 50, 75, 110];
export const MATERIAL_OPTIONS: PipeMaterial[] = ["PVC", "CPVC", "Cast Iron", "PEX"];

export interface SystemState {
  catchment_area_m2: number;
  greywater_recycling_lpd: number;
  cistern_volume_l: number;
  cistern_level_pct: number;
  freshwater_offset_lpd: number;
  fixture_dfu_total: number;
  status: string;
  pipe_saved_pct: number;
  total_run_m: number;
  harvestable_l: number;
}

export interface BlueprintPayload {
  rooms: Room[];
  components: ComponentNode[];
  hydraulic_paths?: HydraulicPath[];
  system_state?: Partial<SystemState>;
}

export interface AppModel {
  rooms: Room[];
  components: ComponentNode[];
  fixtures: Fixture[];
  system_state: SystemState;
}

>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
function route(fx: Fixture, target: GridNode): Array<[number, number]> {
  const pts: Array<[number, number]> = [[fx.x, fx.y]];
  if (fx.y !== target.y) pts.push([fx.x, target.y]);
  if (fx.x !== target.x) pts.push([target.x, target.y]);
  return pts;
}

function manhattanCells(points: Array<[number, number]>) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    total += Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
  }
  return total;
}

<<<<<<< HEAD
function diameterFor(fluid: FluidClass, type: FixtureType) {
  if (fluid === "Blackwater") return 110;
  if (type === "Shower") return 50;
  if (type === "Kitchen Sink") return 50;
=======
function diameterMmFor(fluid: FluidClass, type: FixtureType): PipeDiameterMm {
  if (fluid === "Blackwater") return 110;
  if (fluid === "Chlorinated") return 50;
  if (type === "Shower") return 50;
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
  return 40;
}

function materialFor(fluid: FluidClass): PipeMaterial {
<<<<<<< HEAD
  return fluid === "Blackwater" ? "PVC" : fluid === "Chlorinated" ? "CPVC" : "PVC";
}

function fittingsFor(type: FixtureType, bends: number, isolated: boolean) {
  const list = [`1x ${TRAPS[type]}`];
  if (bends > 0) list.push(`${bends}x 45° sweep`);
  list.push(type === "Commode" ? "1x Floor Y-junction" : "1x Reducer coupling");
  if (isolated) list.push("1x Anti-backflow isolation valve");
  return list;
}

/** Hazen-Williams head loss (m) with C=140 and a DFU-derived design flow. */
function hydraulics(dfu: number, diameterMm: number, lengthM: number) {
  const flowLps = Number((dfu * 0.16).toFixed(2));
  const d = diameterMm / 1000;
  const area = Math.PI * (d / 2) ** 2;
  const velocity = Number((flowLps / 1000 / area).toFixed(2));
  const q = flowLps / 1000;
  const headLoss = Number(
    ((10.67 * lengthM * Math.pow(q, 1.852)) / (Math.pow(140, 1.852) * Math.pow(d, 4.87))).toFixed(3),
  );
  return { flowLps, velocity, headLoss };
=======
  if (fluid === "Blackwater") return "PVC";
  if (fluid === "Chlorinated") return "CPVC";
  return "PVC";
}

function fittingsFor(type: FixtureType, bends: number, isolated: boolean) {
  const list = [`1x ${TRAP_OF[type]}`];
  if (bends > 0) list.push(`${bends}x 45° sweep`);
  list.push(type === "Commode" ? "1x Floor Y-junction" : "1x Reducer coupling");
  if (isolated) list.push("1x Backflow preventer");
  return list;
}

export function roomContains(r: Room, x: number, y: number, floor?: number) {
  const [rx, ry, rw, rh] = r.bounds;
  const inBounds = x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  if (floor == null) return inBounds;
  return inBounds && r.floor === floor;
}

export function findRoom(rooms: Room[], x: number, y: number, floor: number) {
  return rooms.find((r) => roomContains(r, x, y, floor));
}

function isKitchenNode(
  node: { type: string; roomName?: string; roomId?: string; x?: number; y?: number; floor?: number },
  rooms: Room[],
) {
  const name = (node.roomName ?? "").toLowerCase();
  if (name.includes("kitchen")) return true;
  const byId = rooms.find((r) => r.id === node.roomId);
  if (byId?.name.toLowerCase().includes("kitchen")) return true;
  if (node.x != null && node.y != null) {
    const hit = findRoom(rooms, node.x, node.y, node.floor ?? 2);
    return hit?.name.toLowerCase().includes("kitchen") ?? false;
  }
  return false;
}

export function sanitizeComponents(components: ComponentNode[], rooms: Room[]): ComponentNode[] {
  return components.map((node) => {
    if (node.type === "Shower" && isKitchenNode(node, rooms)) {
      return {
        ...node,
        type: "Kitchen Sink",
        tag: node.tag.replace(/^SH/i, "KS"),
        dfu: DFU["Kitchen Sink"],
        trapType: TRAP_OF["Kitchen Sink"],
        icon: FIXTURE_ICON["Kitchen Sink"],
      };
    }
    return node;
  });
}

export function componentsToFixtures(components: ComponentNode[]): Fixture[] {
  return components
    .filter((c): c is ComponentNode & { type: FixtureType } =>
      FIXTURE_TYPES.includes(c.type as FixtureType),
    )
    .map((c) => {
      const fx: Fixture = {
        id: c.id,
        type: c.type,
        floor: (c.floor === 0 ? 1 : c.floor) as 1 | 2,
        x: c.x,
        y: c.y,
        elevation_m: c.elevation_m,
        trapType: c.trapType,
        tag: c.tag,
      };
      if (c.roomId) fx.roomId = c.roomId;
      return fx;
    });
}

export function fixturesToComponents(fixtures: Fixture[], rooms: Room[]): ComponentNode[] {
  return fixtures.map((fx) => {
    const found = rooms.find((r) => r.id === fx.roomId) ?? findRoom(rooms, fx.x, fx.y, fx.floor);
    const node: ComponentNode = {
      id: fx.id,
      type: fx.type,
      tag: fx.tag ?? fx.id,
      floor: fx.floor,
      x: fx.x,
      y: fx.y,
      elevation_m: fx.elevation_m ?? (fx.floor === 2 ? 3.3 : 0.45),
      dfu: DFU[fx.type],
      trapType: fx.trapType ?? TRAP_OF[fx.type],
      icon: FIXTURE_ICON[fx.type],
    };
    if (found?.id) node.roomId = found.id;
    if (found?.name) node.roomName = found.name;
    return node;
  });
}

export function hydraulicQ_m3s(dfu: number) {
  return (dfu * 0.28) / 1000;
}

export function flowVelocity(dfu: number, diameterMm: number) {
  const d = diameterMm / 1000;
  const area = Math.PI * (d / 2) ** 2;
  const v = hydraulicQ_m3s(dfu) / Math.max(area, 1e-6);
  return Number(v.toFixed(2));
}

export function headLossMeters(lengthM: number, dfu: number, diameterMm: number, material: PipeMaterial) {
  const C = HAZEN_C[material];
  const Q = hydraulicQ_m3s(dfu);
  const d = diameterMm / 1000;
  const hf = (10.67 * lengthM * Q ** 1.852) / (C ** 1.852 * d ** 4.87);
  return Number(Math.max(hf, 0.001).toFixed(3));
}

export function unitCostPerM(diameterMm: number, material: PipeMaterial) {
  const base: Record<number, number> = { 32: 48, 40: 72, 50: 110, 75: 210, 110: 340 };
  const mul: Record<PipeMaterial, number> = { PVC: 1, CPVC: 1.35, PEX: 1.55, "Cast Iron": 2.45 };
  return Math.round((base[diameterMm] ?? 90) * mul[material]);
}

export interface SimFlags {
  chlorination: boolean;
  contamination: boolean;
  monsoon: boolean;
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
}

export function buildPipes(
  fixtures: Fixture[],
<<<<<<< HEAD
  sim: SimFlags,
  overrides: Overrides = {},
): Pipe[] {
  let greyIndex = 0;
  let blackIndex = 0;
=======
  simulation: SimulationState,
  overrides: UserOverride[] = [],
  flags: Partial<SimFlags> = {},
  rooms: Room[] = ROOMS,
): Pipe[] {
  const chlorination = flags.chlorination ?? false;
  const contaminating = flags.contamination ?? simulation === "CONTAMINATION_EVENT";
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)

  return fixtures.map((fx) => {
    const found = rooms.find((r) => r.id === fx.roomId) ?? findRoom(rooms, fx.x, fx.y, fx.floor);
    const inMasterBath = found?.name.toLowerCase().includes("master");
    const inKitchen = found?.name.toLowerCase().includes("kitchen");
    const baseFluid = FLUID_OF[fx.type];
<<<<<<< HEAD
    const chlorinated =
      sim.chlorination && baseFluid === "Greywater" && fx.room === "Master Bath";
    const fluid: FluidClass = chlorinated ? "Chlorinated" : baseFluid;
    const isolated = sim.contamination && fx.room === "Kitchen";
    const target =
      fluid === "Blackwater" ? NODES.sewer : chlorinated ? NODES.chlorine : NODES.duct;
    const points = route(fx, target);
    const cells = manhattanCells(points);
    const bends = Math.max(0, points.length - 2) + 1;
    const prefix = fluid === "Blackwater" ? "BW" : "GW";
    const idx = fluid === "Blackwater" ? ++blackIndex : ++greyIndex;
    const id = `${prefix}-Branch-${String(idx).padStart(2, "0")}`;

    const ov = overrides[id] ?? {};
    const autoLength = Number((cells * 0.5 + (fx.floor === 2 ? 3.2 : 1.6)).toFixed(1));
    const runLength = ov.lengthM ?? autoLength;
    const diameterMm = ov.diameterMm ?? diameterFor(fluid, fx.type);
    const material = ov.material ?? materialFor(fluid);
    const dfu = DFU[fx.type];

    return {
      id,
=======
    const chlorinate = chlorination && baseFluid === "Greywater" && Boolean(inMasterBath);
    const isolateKitchen = contaminating && Boolean(inKitchen) && baseFluid === "Greywater";

    let fluid: FluidClass = chlorinate ? "Chlorinated" : baseFluid;
    let assignment: AssignmentClass = chlorinate ? "Chlorinated" : baseFluid;
    let target: GridNode =
      fluid === "Blackwater" ? NODES.sewer : chlorinate ? NODES.chlorination : NODES.duct;

    if (isolateKitchen) {
      assignment = "Isolated";
      target = NODES.duct;
      fluid = "Greywater";
    }

    let points = route(fx, target);
    if (isolateKitchen && points.length > 1) {
      const last = points[points.length - 1]!;
      points = [...points.slice(0, -1), [last[0] - 1.2, last[1]]];
    }

    const cells = manhattanCells(points);
    const bends = Math.max(0, points.length - 2) + 1;
    const genLength = Number((cells * 0.5 + (fx.floor === 2 ? 3.2 : 1.6)).toFixed(1));
    const genDia = diameterMmFor(fluid, fx.type);
    const genMat = materialFor(fluid);
    const id = `RUN-${fx.id}`;
    const override = overrides.find((o) => o.pathId === id);
    const length = override?.length_m ?? genLength;
    const dia = override?.pipe_diameter_mm ?? genDia;
    const mat = override?.material ?? genMat;

    return {
      id,
      componentId: fx.id,
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
      fixtureId: fx.id,
      fixtureType: fx.type,
      room: fx.room,
      floor: fx.floor,
      fluid,
<<<<<<< HEAD
      isolated,
      points,
      target,
      diameterMm,
      material,
      runLength,
      slope: fluid === "Blackwater" ? "1:40" : "1:50",
      dfu,
      fittings: fittingsFor(fx.type, bends, isolated),
      ...hydraulics(dfu, diameterMm, runLength),
      overridden: Boolean(ov.lengthM || ov.diameterMm || ov.material),
=======
      assignmentClass: assignment,
      diverted: false,
      severed: isolateKitchen,
      points,
      target,
      diameter: `${dia}mm ${mat}`,
      pipe_diameter_mm: dia,
      material: mat,
      runLength: Number(Number(length).toFixed(2)),
      slope: fluid === "Blackwater" ? "1:40" : "1:50",
      dfu: DFU[fx.type],
      fittings: fittingsFor(fx.type, bends, isolateKitchen),
      velocity_ms: flowVelocity(DFU[fx.type], dia),
      headLoss_m: headLossMeters(length, DFU[fx.type], dia, mat),
      generative: { length_m: genLength, pipe_diameter_mm: genDia, material: genMat },
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
    };
  });
}

/** Visual stroke weight bound to the real pipe diameter. */
export function strokeFor(diameterMm: number) {
  return 1.6 + (diameterMm / 110) * 4.4;
}

export interface Metrics {
  pipeSavedPct: number;
  freshwaterOffset: number;
  totalDfu: number;
  totalRun: number;
  harvestable: number;
<<<<<<< HEAD
  catchmentArea: number;
  greywaterRecycled: number;
  cisternLevelPct: number;
  cisternCapacity: number;
  status: string;
  statusTone: "ok" | "warn" | "rain";
}

export function computeMetrics(pipes: Pipe[], sim: SimFlags): Metrics {
  const totalRun = Number(pipes.reduce((s, p) => s + p.runLength, 0).toFixed(1));
  const greyRun = pipes
    .filter((p) => p.fluid !== "Blackwater")
=======
  catchment_area_m2: number;
  greywater_recycling_lpd: number;
  cistern_volume_l: number;
  cistern_level_pct: number;
  status: string;
}

export function computeMetrics(
  pipes: Pipe[],
  simulation: SimulationState,
  flags: Partial<SimFlags> = {},
  rooms: Room[] = ROOMS,
): Metrics {
  const totalRun = Number(pipes.reduce((s, p) => s + p.runLength, 0).toFixed(1));
  const greyRun = pipes
    .filter((p) => p.fluid === "Greywater" || p.fluid === "Chlorinated")
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
    .reduce((s, p) => s + p.runLength, 0);
  const naive = totalRun * 1.18 + 6;
  const pipeSavedPct = Number((((naive - totalRun) / naive) * 100).toFixed(1));
  const totalDfu = pipes.reduce((s, p) => s + p.dfu, 0);
<<<<<<< HEAD
  const greywaterRecycled = Math.round(greyRun * 9);
  const baseOffset = greywaterRecycled + (sim.monsoon ? 320 : 0);
  const freshwaterOffset = Math.round(baseOffset * (sim.chlorination ? 1.4 : 1));
  const cisternCapacity = 2500;
  const harvestable = sim.monsoon ? 2500 : 620;

  const status = sim.contamination
    ? "P-Trap Isolated / Backflow Safe"
    : sim.monsoon
      ? "Storm overflow discharging"
      : sim.chlorination
        ? "Chlorination loop active"
        : "All systems nominal";
=======
  let freshwaterOffset = Math.round(
    greyRun * 9 + (simulation === "SURPLUS_RAIN" || flags.monsoon ? 320 : 0),
  );
  if (flags.chlorination) freshwaterOffset = Math.round(freshwaterOffset * 1.4);
  const catchment = rooms.reduce((s, r) => s + r.bounds[2] * r.bounds[3] * 0.25, 0);
  const status =
    flags.contamination || simulation === "CONTAMINATION_EVENT"
      ? "P-Trap Isolated / Backflow Safe"
      : flags.monsoon || simulation === "SURPLUS_RAIN"
        ? "Monsoon surge — overflow active"
        : flags.chlorination
          ? "Chlorination loop online"
          : "All systems nominal";
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)

  return {
    pipeSavedPct,
    freshwaterOffset,
    totalDfu,
    totalRun,
<<<<<<< HEAD
    harvestable,
    catchmentArea: 128,
    greywaterRecycled,
    cisternLevelPct: Math.min(100, Math.round((harvestable / cisternCapacity) * 100)),
    cisternCapacity,
    status,
    statusTone: sim.contamination ? "warn" : sim.monsoon ? "rain" : "ok",
  };
}

/* ── Bill of materials ─────────────────────────────────────────────────────── */

export const UNIT_COST: Record<number, number> = {
  32: 105,
  40: 140,
  50: 210,
  75: 330,
  110: 520,
};

export interface BomRow {
  key: string;
  fluid: FluidClass;
  diameterMm: number;
  material: PipeMaterial;
  lengthM: number;
  unitCost: number;
  cost: number;
}

export function bomRows(pipes: Pipe[]): BomRow[] {
  const map = new Map<string, BomRow>();
  for (const p of pipes) {
    const key = `${p.fluid}-${p.diameterMm}-${p.material}`;
    const unitCost = UNIT_COST[p.diameterMm] ?? 200;
    const existing = map.get(key);
    if (existing) {
      existing.lengthM = Number((existing.lengthM + p.runLength).toFixed(1));
      existing.cost = Math.round(existing.lengthM * unitCost);
    } else {
      map.set(key, {
        key,
        fluid: p.fluid,
        diameterMm: p.diameterMm,
        material: p.material,
        lengthM: p.runLength,
        unitCost,
        cost: Math.round(p.runLength * unitCost),
      });
    }
  }
  return [...map.values()].sort((a, b) => b.diameterMm - a.diameterMm);
}

export function fixtureCounts(fixtures: Fixture[]) {
  const counts = new Map<FixtureType, number>();
  for (const fx of fixtures) counts.set(fx.type, (counts.get(fx.type) ?? 0) + 1);
  return [...counts.entries()];
}

/* ── Commercial viability ──────────────────────────────────────────────────── */

export const DEFAULT_TARIFF = 45; // INR per kilolitre

export interface Roi {
  annualSavings: number;
  capex: number;
  paybackYears: number;
  series: Array<{ year: number; savings: number; capex: number }>;
}

export function computeRoi(
  metrics: Metrics,
  pipes: Pipe[],
  sim: SimFlags,
  tariff = DEFAULT_TARIFF,
): Roi {
  const pipeCapex = bomRows(pipes).reduce((s, r) => s + r.cost, 0);
  const capex = Math.round(pipeCapex * 1.35 + (sim.chlorination ? 26000 : 0) + 18000);
  const annualSavings = Math.round(((metrics.freshwaterOffset * 365) / 1000) * tariff);
  const paybackYears = annualSavings > 0 ? Number((capex / annualSavings).toFixed(1)) : 0;
  const series = Array.from({ length: 10 }, (_, i) => ({
    year: i + 1,
    savings: annualSavings * (i + 1),
    capex,
  }));
  return { annualSavings, capex, paybackYears, series };
}

/* ── Vendor recommendations ────────────────────────────────────────────────── */

export interface VendorRec {
  application: string;
  spec: string;
  brands: string;
  unitCost: string;
  pressure: string;
  code: string;
}

export const VENDOR_RECS: VendorRec[] = [
  {
    application: "Soil / Blackwater",
    spec: "High-density PVC-SWR or Cast Iron, 110 mm",
    brands: "Supreme, Astral",
    unitCost: "₹480–560 / m",
    pressure: "Gravity (non-pressure)",
    code: "IS 13592 · IS 1726",
  },
  {
    application: "Hot & Cold Potable Supply",
    spec: "SDR 11 CPVC / Multilayer PEX, 25–32 mm",
    brands: "Ashirvad, Finolex",
    unitCost: "₹180–260 / m",
    pressure: "Rated 27.6 bar @ 23°C",
    code: "IS 15778 · IS 15801",
  },
  {
    application: "Greywater Recycling / Drainage",
    spec: "Foam-core underground drainage, 75–110 mm",
    brands: "Prince, Astral",
    unitCost: "₹300–520 / m",
    pressure: "SN4 stiffness class",
    code: "IS 4985 · IS 16098",
  },
];

export function toBillOfMaterials(pipes: Pipe[]) {
  const header =
    "Segment ID,Fixture,Room,Floor,Class,Diameter (mm),Material,Run (m),Slope,DFU,Velocity (m/s),Head loss (m),Fittings";
  const rows = pipes.map((p) =>
    [
      p.id,
      p.fixtureType,
      p.room,
      p.floor,
      p.fluid,
      p.diameterMm,
      p.material,
      p.runLength,
      p.slope,
      p.dfu,
      p.velocity,
      p.headLoss,
      p.fittings.join(" + "),
    ].join(","),
  );
  return [header, ...rows].join("\n");
=======
    harvestable: simulation === "SURPLUS_RAIN" || flags.monsoon ? 1850 : 620,
    catchment_area_m2: Number(catchment.toFixed(1)),
    greywater_recycling_lpd: freshwaterOffset,
    cistern_volume_l: 2500,
    cistern_level_pct: simulation === "SURPLUS_RAIN" || flags.monsoon ? 98 : 54,
    status,
  };
}

export function metricsToSystemState(metrics: Metrics): SystemState {
  return {
    catchment_area_m2: metrics.catchment_area_m2,
    greywater_recycling_lpd: metrics.greywater_recycling_lpd,
    cistern_volume_l: metrics.cistern_volume_l,
    cistern_level_pct: metrics.cistern_level_pct,
    freshwater_offset_lpd: metrics.freshwaterOffset,
    fixture_dfu_total: metrics.totalDfu,
    status: metrics.status,
    pipe_saved_pct: metrics.pipeSavedPct,
    total_run_m: metrics.totalRun,
    harvestable_l: metrics.harvestable,
  };
}

export function strokeWidthForDiameter(mm: number) {
  return Math.max(2.2, Math.min(8, mm / 18));
}

export interface BomLine {
  diameter_mm: number;
  material: PipeMaterial;
  className: string;
  length_m: number;
  unit_inr: number;
  total_inr: number;
}

export function bomByClass(pipes: Pipe[]): BomLine[] {
  const map = new Map<string, BomLine>();
  for (const p of pipes) {
    const key = `${p.pipe_diameter_mm}-${p.material}-${p.fluid}`;
    const unit = unitCostPerM(p.pipe_diameter_mm, p.material);
    const cur = map.get(key);
    if (cur) {
      cur.length_m = Number((cur.length_m + p.runLength).toFixed(2));
      cur.total_inr = Math.round(cur.length_m * cur.unit_inr);
    } else {
      map.set(key, {
        diameter_mm: p.pipe_diameter_mm,
        material: p.material,
        className: p.fluid,
        length_m: p.runLength,
        unit_inr: unit,
        total_inr: Math.round(p.runLength * unit),
      });
    }
  }
  return [...map.values()];
}

export interface RoiModel {
  tariffInrPerKl: number;
  annualSavingsInr: number;
  capexInr: number;
  paybackYears: number;
  series: Array<{ year: number; capex: number; savings: number }>;
}

export function computeRoi(
  freshwaterOffsetLpd: number,
  pipes: Pipe[],
  chlorination: boolean,
  tariffInrPerKl: number,
): RoiModel {
  const annualKl = (freshwaterOffsetLpd * 365) / 1000;
  const annualSavingsInr = Math.round(annualKl * tariffInrPerKl);
  const pipeCapex = bomByClass(pipes).reduce((s, l) => s + l.total_inr, 0);
  const capexInr = pipeCapex + 48000 + (chlorination ? 22000 : 0);
  const paybackYears = annualSavingsInr > 0 ? Number((capexInr / annualSavingsInr).toFixed(1)) : 99;
  const series = Array.from({ length: 8 }, (_, year) => ({
    year,
    capex: capexInr,
    savings: annualSavingsInr * year,
  }));
  return { tariffInrPerKl, annualSavingsInr, capexInr, paybackYears, series };
}

export const VENDOR_CATALOG = [
  {
    application: "Soil / Blackwater",
    standard: "High-density PVC / Cast Iron",
    brands: "Supreme, Astral",
    isCode: "IS 13592 / IS 3989",
    pressure: "SN 8 / non-pressure SWR",
    unitCost: "₹210–₹830 / m",
  },
  {
    application: "Hot / Cold potable supply",
    standard: "SDR 11 CPVC / multilayer PEX",
    brands: "Ashirvad, Finolex",
    isCode: "IS 15778 / IS 15801",
    pressure: "PN 16 / 82°C rated",
    unitCost: "₹95–₹240 / m",
  },
  {
    application: "Greywater recycling / drainage",
    standard: "Foam-core underground drainage",
    brands: "Prince, Astral",
    isCode: "IS 4985 / IS 16098",
    pressure: "SN 4–SN 8 buried",
    unitCost: "₹72–₹340 / m",
  },
  {
    application: "Fixtures & cisterns",
    standard: "Vitreous china / HDPE tanks",
    brands: "Hindware, Sintex",
    isCode: "IS 1726 / IS 12701",
    pressure: "Gravity / atmospheric",
    unitCost: "₹1,800–₹18,000 / unit",
  },
] as const;

function normalizeRoom(
  raw: Partial<Room> & { label?: string; x?: number; y?: number; w?: number; h?: number },
  i: number,
): Room {
  if (raw.bounds) {
    const [x, y, w, h] = raw.bounds;
    const name = raw.name ?? raw.label ?? `Room ${i + 1}`;
    return {
      id: raw.id ?? `R-${i + 1}`,
      name,
      bounds: raw.bounds,
      floor: (raw.floor as 1 | 2) ?? 1,
      label: name,
      x,
      y,
      w,
      h,
    };
  }
  const x = raw.x ?? 0;
  const y = raw.y ?? 0;
  const w = raw.w ?? 4;
  const h = raw.h ?? 4;
  const name = raw.name ?? raw.label ?? `Room ${i + 1}`;
  return {
    id: raw.id ?? `R-${i + 1}`,
    name,
    bounds: [x, y, w, h],
    floor: (raw.floor as 1 | 2) ?? 1,
    label: name,
    x,
    y,
    w,
    h,
  };
}

export function parseBlueprintPayload(raw: unknown): BlueprintPayload {
  const data = (raw ?? {}) as Record<string, unknown>;
  const roomsSrc = (data["rooms"] as Array<Partial<Room>> | undefined) ?? [];
  const payload: BlueprintPayload = {
    rooms: roomsSrc.length ? roomsSrc.map(normalizeRoom) : ROOMS,
    components: (data["components"] as ComponentNode[] | undefined) ?? [],
  };
  const paths = data["hydraulic_paths"] as HydraulicPath[] | undefined;
  const state = data["system_state"] as Partial<SystemState> | undefined;
  if (paths) payload.hydraulic_paths = paths;
  if (state) payload.system_state = state;
  return payload;
}

export function getDemoPayload(): BlueprintPayload {
  return {
    rooms: ROOMS,
    components: [
      {
        id: "FX-01",
        type: "Commode",
        tag: "WC-MB-01",
        roomId: "R-MB",
        roomName: "Master Bath",
        floor: 2,
        x: 3,
        y: 3,
        elevation_m: 3.35,
        dfu: 4,
        trapType: TRAP_OF.Commode,
        icon: "wc",
      },
      {
        id: "FX-02",
        type: "Washbasin",
        tag: "WB-MB-01",
        roomId: "R-MB",
        roomName: "Master Bath",
        floor: 2,
        x: 6,
        y: 5,
        elevation_m: 3.55,
        dfu: 1,
        trapType: TRAP_OF.Washbasin,
        icon: "basin",
      },
      {
        id: "FX-03",
        type: "Shower",
        tag: "SH-MB-01",
        roomId: "R-MB",
        roomName: "Master Bath",
        floor: 2,
        x: 7,
        y: 3,
        elevation_m: 3.2,
        dfu: 2,
        trapType: TRAP_OF.Shower,
        icon: "shower",
      },
      {
        id: "FX-04",
        type: "Shower",
        tag: "SH-KT-HALLUC",
        roomId: "R-KT",
        roomName: "Kitchen",
        floor: 2,
        x: 14,
        y: 4,
        elevation_m: 3.5,
        dfu: 2,
        trapType: TRAP_OF.Shower,
        icon: "shower",
      },
      {
        id: "FX-05",
        type: "Commode",
        tag: "WC-PR-01",
        roomId: "R-PR",
        roomName: "Powder Room",
        floor: 1,
        x: 4,
        y: 14,
        elevation_m: 0.35,
        dfu: 4,
        trapType: TRAP_OF.Commode,
        icon: "wc",
      },
      {
        id: "FX-06",
        type: "Washbasin",
        tag: "WB-KT-01",
        roomId: "R-KT",
        roomName: "Kitchen",
        floor: 2,
        x: 16,
        y: 5,
        elevation_m: 3.55,
        dfu: 1,
        trapType: TRAP_OF.Washbasin,
        icon: "basin",
      },
      {
        id: "FX-07",
        type: "Washbasin",
        tag: "WB-PR-01",
        roomId: "R-PR",
        roomName: "Powder Room",
        floor: 1,
        x: 5,
        y: 13,
        elevation_m: 0.55,
        dfu: 1,
        trapType: TRAP_OF.Washbasin,
        icon: "basin",
      },
    ],
    system_state: { catchment_area_m2: 118, cistern_volume_l: 2500 },
  };
}

export function payloadToModel(payload: BlueprintPayload): AppModel {
  const rooms = payload.rooms.length ? payload.rooms.map(normalizeRoom) : ROOMS;
  const components = sanitizeComponents(
    payload.components.length ? payload.components : fixturesToComponents(INITIAL_FIXTURES, rooms),
    rooms,
  );
  const fixtures = componentsToFixtures(components);
  const pipes = buildPipes(fixtures, "NORMAL", [], {}, rooms);
  const metrics = computeMetrics(pipes, "NORMAL", {}, rooms);
  return {
    rooms,
    components,
    fixtures,
    system_state: { ...metricsToSystemState(metrics), ...payload.system_state },
  };
>>>>>>> 45ffee1 (Finalized HydroGrid Studio MEP dual-plumbing frontend, 3D walls, and ROI dashboard)
}
