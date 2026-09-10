/**
 * The editor's dev tooling annotates every JSX element with `data-tsd-source`.
 * react-three-fiber treats dashed props as nested paths ("data" -> "tsd" -> ...)
 * and throws `R3F: Cannot set "data-tsd-source"`, blanking the 3D canvas.
 *
 * These wrappers are plain `createElement` calls (no JSX, so nothing is injected
 * inside them) and strip any `data-*` props before they reach three.js.
 */
import { createElement, type ComponentType, type ReactNode } from "react";
import { OrbitControls as DreiOrbitControls, Text as DreiText } from "@react-three/drei";

type AnyProps = Record<string, unknown> & { children?: ReactNode };

function stripDataProps(props: AnyProps): AnyProps {
  const out: AnyProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (!key.startsWith("data-")) out[key] = value;
  }
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrap(type: string | ComponentType<any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: AnyProps) => createElement(type as any, stripDataProps(props) as any);
}

export const Group = wrap("group");
export const Mesh = wrap("mesh");
export const LineSegments = wrap("lineSegments");
export const ThreeColor = wrap("color");
export const AmbientLight = wrap("ambientLight");
export const DirectionalLight = wrap("directionalLight");
export const PointLight = wrap("pointLight");
export const BoxGeometry = wrap("boxGeometry");
export const SphereGeometry = wrap("sphereGeometry");
export const CylinderGeometry = wrap("cylinderGeometry");
export const PlaneGeometry = wrap("planeGeometry");
export const MeshStandardMaterial = wrap("meshStandardMaterial");
export const LineBasicMaterial = wrap("lineBasicMaterial");
export const OrbitControls = wrap(DreiOrbitControls);
export const Text = wrap(DreiText);
