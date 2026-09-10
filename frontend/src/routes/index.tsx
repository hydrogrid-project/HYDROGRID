import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AnalyzingOverlay } from "@/components/hydrogrid/AnalyzingOverlay";
import { Landing, type BlueprintSource } from "@/components/hydrogrid/Landing";
import { Workspace } from "@/components/hydrogrid/Workspace";
import { uploadBlueprint } from "@/lib/blueprint-api";
import type { AppModel } from "@/lib/hydrogrid";

const title = "HydroGrid Studio — Generative MEP Plumbing CAD Engine";
const description =
  "Upload a floor plan and HydroGrid routes dual greywater and blackwater stacks, inspects every segment in 2D and 3D, and exports a rainwater-harvesting-ready bill of materials.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HydroGridStudio,
});

type Stage = "LANDING" | "ANALYZING" | "WORKSPACE";

function HydroGridStudio() {
  const [stage, setStage] = useState<Stage>("LANDING");
  const [blueprint, setBlueprint] = useState<BlueprintSource | null>(null);
  const [model, setModel] = useState<AppModel | null>(null);

  const analyze = useCallback((source: BlueprintSource) => {
    setBlueprint(source);
    setModel(null);
    setStage("ANALYZING");
  }, []);

  useEffect(() => {
    if (stage !== "ANALYZING" || !blueprint) return;
    let cancelled = false;
    void uploadBlueprint(blueprint.file).then((next) => {
      if (cancelled) return;
      setModel(next);
      setStage("WORKSPACE");
    });
    return () => {
      cancelled = true;
    };
  }, [stage, blueprint]);

  if (stage === "ANALYZING" && blueprint) {
    return <AnalyzingOverlay label={blueprint.name} />;
  }

  if (stage === "WORKSPACE" && blueprint && model) {
    return (
      <Workspace
        blueprint={blueprint}
        model={model}
        onExit={() => {
          setStage("LANDING");
          setModel(null);
        }}
      />
    );
  }

  return <Landing onAnalyze={analyze} />;
}
