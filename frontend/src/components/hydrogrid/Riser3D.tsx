import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import {
  GRID,
  NODES,
  PIPE_COLORS,
  type Fixture,
  type Pipe,
  type Room,
  type SimulationState,
} from "@/lib/hydrogrid";
import {
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  OrbitControls,
  PointLight,
  SphereGeometry,
  Text,
  ThreeColor,
} from "./three-safe";

type Vec3 = [number, number, number];

const HALF = (GRID - 1) / 2;
const WALL_H = 2.8;
const floorY = (floor: 1 | 2) => (floor === 2 ? WALL_H : 0);
const world = (x: number, y: number, height: number): Vec3 => [x - HALF, height, y - HALF];

function segmentsFor(pipe: Pipe): Array<[Vec3, Vec3]> {
  const h = floorY(pipe.floor) + 0.28;
  const out: Array<[Vec3, Vec3]> = [];
  for (let i = 1; i < pipe.points.length; i++) {
    const a = pipe.points[i - 1]!;
    const b = pipe.points[i]!;
    out.push([world(a[0], a[1], h), world(b[0], b[1], h)]);
  }
  const end = pipe.points[pipe.points.length - 1]!;
  const dropX = pipe.fluid === "Blackwater" ? NODES.sewer.x : NODES.duct.x;
  const dropY = pipe.fluid === "Blackwater" ? NODES.sewer.y : NODES.duct.y;
  out.push([world(end[0], end[1], h), world(dropX, dropY, h)]);
  out.push([world(dropX, dropY, h), world(dropX, dropY, 0.25)]);
  if (pipe.fluid !== "Blackwater" && !pipe.severed) {
    const dest = pipe.fluid === "Chlorinated" ? NODES.chlorination : NODES.cistern;
    out.push([world(dropX, dropY, 0.25), world(dest.x, dest.y, 0.25)]);
  }
  return out;
}

function Tube({
  from,
  to,
  color,
  radius,
  active,
  onSelect,
}: {
  from: Vec3;
  to: Vec3;
  color: string;
  radius: number;
  active: boolean;
  onSelect?: () => void;
}) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.hypot(dx, dy, dz) || 0.001;
  const mid: Vec3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  const rotation: Vec3 =
    Math.abs(dx) > 0.001 ? [0, 0, Math.PI / 2] : Math.abs(dz) > 0.001 ? [Math.PI / 2, 0, 0] : [0, 0, 0];

  return (
    <Group position={mid} rotation={rotation}>
      <Mesh
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        <CylinderGeometry args={[radius, radius, length, 16]} />
        <MeshStandardMaterial
          color={active ? "#facc15" : color}
          emissive={active ? "#facc15" : color}
          emissiveIntensity={active ? 0.85 : 0.18}
          roughness={0.35}
          metalness={0.5}
        />
      </Mesh>
      <Mesh
        visible={false}
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        <CylinderGeometry args={[radius * 4, radius * 4, length, 8]} />
      </Mesh>
    </Group>
  );
}

function Elbow({ at, color, active }: { at: Vec3; color: string; active: boolean }) {
  return (
    <Mesh position={at}>
      <SphereGeometry args={[0.18, 14, 14]} />
      <MeshStandardMaterial
        color={active ? "#facc15" : color}
        emissive={active ? "#facc15" : color}
        emissiveIntensity={active ? 0.8 : 0.15}
        metalness={0.6}
        roughness={0.3}
      />
    </Mesh>
  );
}

function WallBox({ cx, cz, y, sx, sz }: { cx: number; cz: number; y: number; sx: number; sz: number }) {
  const geom = useMemo(() => new THREE.BoxGeometry(sx, WALL_H, sz), [sx, sz]);
  return (
    <Group position={[cx, y, cz]}>
      <Mesh>
        <BoxGeometry args={[sx, WALL_H, sz]} />
        <MeshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          roughness={0.4}
          metalness={0.05}
          depthWrite={false}
        />
      </Mesh>
      <LineSegments geometry={new THREE.EdgesGeometry(geom)}>
        <LineBasicMaterial color="#7dd3fc" transparent opacity={0.55} />
      </LineSegments>
    </Group>
  );
}

function RoomEnclosure({ room }: { room: Room }) {
  const [x, y, w, h] = room.bounds;
  const t = 0.14;
  const base = floorY(room.floor);
  const midY = base + WALL_H / 2;
  const cx = x + w / 2 - HALF;
  const cz = y + h / 2 - HALF;
  return (
    <Group>
      <Mesh position={[cx, base + 0.02, cz]}>
        <BoxGeometry args={[w, 0.04, h]} />
        <MeshStandardMaterial color="#0ea5e9" transparent opacity={0.14} />
      </Mesh>
      <WallBox cx={x - HALF} cz={cz} y={midY} sx={t} sz={h} />
      <WallBox cx={x + w - HALF} cz={cz} y={midY} sx={t} sz={h} />
      <WallBox cx={cx} cz={y - HALF} y={midY} sx={w} sz={t} />
      <WallBox cx={cx} cz={y + h - HALF} y={midY} sx={w} sz={t} />
      <Text
        position={[cx, base + 0.12, cz]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.38}
        color="#7dd3fc"
        anchorX="center"
        anchorY="middle"
      >
        {room.name.toUpperCase()}
      </Text>
    </Group>
  );
}

interface Props {
  pipes: Pipe[];
  fixtures: Fixture[];
  rooms: Room[];
  selectedId: string | null;
  simulation: SimulationState;
  chlorination: boolean;
  monsoon: boolean;
  onSelectPipe: (pipe: Pipe) => void;
  onSelectFixture: (fixture: Fixture) => void;
  onClear: () => void;
}

export default function Riser3D({
  pipes,
  fixtures,
  rooms,
  selectedId,
  simulation,
  chlorination,
  monsoon,
  onSelectPipe,
  onSelectFixture,
  onClear,
}: Props) {
  const routed = useMemo(
    () => pipes.filter((p) => !p.severed).map((pipe) => ({ pipe, segments: segmentsFor(pipe) })),
    [pipes],
  );
  const surge = monsoon || simulation === "SURPLUS_RAIN";

  return (
    <Canvas
      camera={{ position: [22, 16, 24], fov: 42 }}
      dpr={[1, 2]}
      onPointerMissed={onClear}
      gl={{ antialias: true }}
    >
      <ThreeColor attach="background" args={["#070e1c"]} />
      <AmbientLight intensity={0.75} />
      <DirectionalLight position={[14, 22, 12]} intensity={1.1} />
      <PointLight position={[-12, 8, -10]} intensity={0.5} color="#38bdf8" />

      {rooms.map((r) => (
        <RoomEnclosure key={`${r.id}-${r.floor}`} room={r} />
      ))}

      {routed.map(({ pipe, segments }) => {
        const active = selectedId === pipe.id;
        const color = PIPE_COLORS[pipe.fluid];
        const radius = Math.max(0.08, (pipe.pipe_diameter_mm / 110) * 0.2);
        return (
          <Group key={pipe.id}>
            {segments.map((seg, i) => (
              <Tube
                key={`${pipe.id}-s${i}`}
                from={seg[0]}
                to={seg[1]}
                color={color}
                radius={radius}
                active={active}
                onSelect={() => onSelectPipe(pipe)}
              />
            ))}
            {segments.slice(1).map((seg, i) => (
              <Elbow key={`${pipe.id}-e${i}`} at={seg[0]} color={color} active={active} />
            ))}
          </Group>
        );
      })}

      <Mesh position={world(NODES.cistern.x, NODES.cistern.y, 0.7)}>
        <BoxGeometry args={[2.4, 1.4, 2.0]} />
        <MeshStandardMaterial
          color={surge ? "#60a5fa" : "#0ea5e9"}
          emissive={surge ? "#60a5fa" : "#0b3a52"}
          emissiveIntensity={surge ? 0.7 : 0.2}
          transparent
          opacity={0.78}
        />
      </Mesh>

      <Mesh position={world(NODES.sewer.x, NODES.sewer.y, 1.4)}>
        <CylinderGeometry args={[0.28, 0.28, 2.8, 16]} />
        <MeshStandardMaterial color="#EA580C" emissive="#EA580C" emissiveIntensity={0.25} />
      </Mesh>

      {chlorination && (
        <Mesh position={world(NODES.chlorination.x, NODES.chlorination.y, 0.8)}>
          <CylinderGeometry args={[0.7, 0.7, 1.5, 20]} />
          <MeshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.55} transparent opacity={0.8} />
        </Mesh>
      )}

      <Mesh position={world(NODES.soakpit.x, NODES.soakpit.y, 0.45)}>
        <CylinderGeometry args={[0.9, 1.05, 0.9, 20]} />
        <MeshStandardMaterial
          color="#10b981"
          emissive={surge ? "#3B82F6" : "#065f46"}
          emissiveIntensity={surge ? 0.9 : 0.2}
          transparent
          opacity={0.8}
        />
      </Mesh>

      {surge && (
        <>
          <Tube
            from={world(NODES.cistern.x, NODES.cistern.y, 0.9)}
            to={world(NODES.soakpit.x, NODES.cistern.y, 0.9)}
            color="#3B82F6"
            radius={0.12}
            active={false}
          />
          <Tube
            from={world(NODES.soakpit.x, NODES.cistern.y, 0.9)}
            to={world(NODES.soakpit.x, NODES.soakpit.y, 0.9)}
            color="#3B82F6"
            radius={0.12}
            active={false}
          />
        </>
      )}

      {fixtures.map((fx) => {
        const active = selectedId === fx.id;
        const isTank = fx.type === "Commode";
        return (
          <Mesh
            key={fx.id}
            position={world(fx.x, fx.y, floorY(fx.floor) + 0.45)}
            onClick={(e: { stopPropagation: () => void }) => {
              e.stopPropagation();
              onSelectFixture(fx);
            }}
          >
            <BoxGeometry args={isTank ? [0.7, 0.55, 0.85] : [0.55, 0.55, 0.55]} />
            <MeshStandardMaterial
              color={active ? "#facc15" : fx.type === "Kitchen Sink" ? "#38bdf8" : "#7dd3fc"}
              emissive={active ? "#facc15" : "#38bdf8"}
              emissiveIntensity={active ? 0.8 : 0.25}
            />
          </Mesh>
        );
      })}

      <OrbitControls enablePan makeDefault target={[0, 2.2, 0]} maxDistance={60} minDistance={8} />
    </Canvas>
  );
}
