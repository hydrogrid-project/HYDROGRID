// Blueprint upload + AI sanity checks, with a silent demo-mode fallback.

import {
  INITIAL_FIXTURES,
  ROOMS,
  sanitizeFixtures,
  type Fixture,
  type FixtureType,
  type Floor,
  type Room,
} from "./hydrogrid";

export interface RawComponent {
  id?: string;
  type?: string;
  floor?: number;
  x?: number;
  y?: number;
  room?: string;
  elevation_m?: number;
}

export interface RawRoom {
  id?: string;
  name?: string;
  bounds?: [number, number, number, number];
  floor?: number;
}

export interface BlueprintPayload {
  rooms?: RawRoom[];
  components?: RawComponent[];
}

export interface AnalysisResult {
  rooms: Room[];
  fixtures: Fixture[];
  demoMode: boolean;
}

const ENDPOINT = "http://127.0.0.1:8000/upload-blueprint";

const KNOWN_TYPES: FixtureType[] = ["Commode", "Washbasin", "Shower", "Kitchen Sink"];

const asFloor = (v: unknown): Floor => (Number(v) === 2 ? 2 : 1);

function normalise(payload: BlueprintPayload): AnalysisResult {
  const rooms: Room[] = (payload.rooms ?? [])
    .filter((r) => Array.isArray(r.bounds) && r.bounds.length === 4)
    .map((r, i) => ({
      id: r.id ?? `R-${i}`,
      name: r.name ?? `Room ${i + 1}`,
      bounds: r.bounds as [number, number, number, number],
      floor: asFloor(r.floor),
    }));

  const fixtures: Fixture[] = (payload.components ?? []).map((c, i) => ({
    id: c.id ?? `FX-${String(i + 1).padStart(2, "0")}`,
    type: (KNOWN_TYPES.includes(c.type as FixtureType) ? c.type : "Washbasin") as FixtureType,
    floor: asFloor(c.floor),
    x: Math.max(0, Math.min(19, Math.round(Number(c.x) || 0))),
    y: Math.max(0, Math.min(19, Math.round(Number(c.y) || 0))),
    room: c.room ?? "Unassigned",
    elevationM: Number(c.elevation_m) || 0.8,
  }));

  if (!rooms.length || !fixtures.length) return demoPayload();
  return { rooms, fixtures: sanitizeFixtures(fixtures), demoMode: false };
}

export function demoPayload(): AnalysisResult {
  // Rich two-storey residential plan with dual plumbing lines. The kitchen
  // deliberately contains a hallucinated "Shower" upstream — sanitised here.
  const raw: Fixture[] = [
    ...INITIAL_FIXTURES.filter((f) => f.id !== "FX-07"),
    { id: "FX-07", type: "Shower", floor: 1, x: 16, y: 6, room: "Kitchen", elevationM: 0.05 },
  ];
  return { rooms: ROOMS, fixtures: sanitizeFixtures(raw), demoMode: true };
}

export async function uploadBlueprint(file: File | null): Promise<AnalysisResult> {
  if (!file) return demoPayload();
  try {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(ENDPOINT, { method: "POST", body });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return normalise((await res.json()) as BlueprintPayload);
  } catch {
    return demoPayload();
  }
}
