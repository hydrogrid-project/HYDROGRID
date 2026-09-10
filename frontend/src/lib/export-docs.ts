import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  HeadingLevel,
} from "docx";
import { bomByClass, computeRoi, type Fixture, type Metrics, type Pipe } from "./hydrogrid";

export interface ExportContext {
  projectName: string;
  blueprintName: string;
  pipes: Pipe[];
  fixtures: Fixture[];
  metrics: Metrics;
  chlorination: boolean;
  tariffInrPerKl: number;
}

function fixtureCounts(fixtures: Fixture[]) {
  const map = new Map<string, number>();
  for (const f of fixtures) map.set(f.type, (map.get(f.type) ?? 0) + 1);
  return [...map.entries()];
}

export function exportPdf(ctx: ExportContext) {
  const doc = new jsPDF();
  const bom = bomByClass(ctx.pipes);
  const roi = computeRoi(ctx.metrics.freshwaterOffset, ctx.pipes, ctx.chlorination, ctx.tariffInrPerKl);
  const cost = bom.reduce((s, l) => s + l.total_inr, 0);

  doc.setFontSize(16);
  doc.text("HydroGrid Studio — MEP Schedule", 14, 18);
  doc.setFontSize(10);
  doc.text(`Project: ${ctx.projectName}`, 14, 26);
  doc.text(`Blueprint: ${ctx.blueprintName}`, 14, 32);
  doc.text(`Status: ${ctx.metrics.status}`, 14, 38);
  doc.text(
    `Catchment ${ctx.metrics.catchment_area_m2} m2 · Offset ${ctx.metrics.freshwaterOffset} L/day · DFU ${ctx.metrics.totalDfu}`,
    14,
    44,
  );

  autoTable(doc, {
    startY: 50,
    head: [["Fixture type", "Count"]],
    body: fixtureCounts(ctx.fixtures).map(([t, n]) => [t, String(n)]),
    theme: "grid",
  });

  const afterFixtures = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  autoTable(doc, {
    startY: afterFixtures,
    head: [["Class", "Ø mm", "Material", "Length m", "Unit INR", "Total INR"]],
    body: bom.map((l) => [
      l.className,
      String(l.diameter_mm),
      l.material,
      l.length_m.toFixed(1),
      l.unit_inr.toLocaleString("en-IN"),
      l.total_inr.toLocaleString("en-IN"),
    ]),
    theme: "striped",
  });

  const y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
  doc.text(`Estimated pipe CAPEX: INR ${cost.toLocaleString("en-IN")}`, 14, y);
  doc.text(`System CAPEX (incl. dual network): INR ${roi.capexInr.toLocaleString("en-IN")}`, 14, y + 6);
  doc.text(`Annual water-bill savings: INR ${roi.annualSavingsInr.toLocaleString("en-IN")}`, 14, y + 12);
  doc.text(`Simple payback: ${roi.paybackYears} years @ INR ${ctx.tariffInrPerKl}/kL`, 14, y + 18);
  doc.save("hydrogrid-mep-schedule.pdf");
}

function cell(text: string) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
  });
}

export async function exportDocx(ctx: ExportContext) {
  const bom = bomByClass(ctx.pipes);
  const roi = computeRoi(ctx.metrics.freshwaterOffset, ctx.pipes, ctx.chlorination, ctx.tariffInrPerKl);

  const fixtureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [cell("Fixture"), cell("Count")] }),
      ...fixtureCounts(ctx.fixtures).map(
        ([t, n]) => new TableRow({ children: [cell(t), cell(String(n))] }),
      ),
    ],
  });

  const bomTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [cell("Class"), cell("Ø mm"), cell("Material"), cell("Length m"), cell("Total INR")],
      }),
      ...bom.map(
        (l) =>
          new TableRow({
            children: [
              cell(l.className),
              cell(String(l.diameter_mm)),
              cell(l.material),
              cell(l.length_m.toFixed(1)),
              cell(l.total_inr.toLocaleString("en-IN")),
            ],
          }),
      ),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "HydroGrid Studio MEP Specification", heading: HeadingLevel.TITLE }),
          new Paragraph({ text: `Project: ${ctx.projectName}` }),
          new Paragraph({ text: `Source blueprint: ${ctx.blueprintName}` }),
          new Paragraph({ text: `System status: ${ctx.metrics.status}` }),
          new Paragraph({
            text: `Engineering summary — dual-network plumbing with source segregation. Catchment ${ctx.metrics.catchment_area_m2} m2, freshwater offset ${ctx.metrics.freshwaterOffset} L/day, total DFU ${ctx.metrics.totalDfu}, routed length ${ctx.metrics.totalRun} m.`,
          }),
          new Paragraph({ text: "Fixture schedule", heading: HeadingLevel.HEADING_1 }),
          fixtureTable,
          new Paragraph({ text: "Material itemization", heading: HeadingLevel.HEADING_1 }),
          bomTable,
          new Paragraph({ text: "Commercial viability", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            text: `CAPEX INR ${roi.capexInr.toLocaleString("en-IN")}. Annual savings INR ${roi.annualSavingsInr.toLocaleString("en-IN")} at INR ${ctx.tariffInrPerKl}/kL. Simple payback ${roi.paybackYears} years.`,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hydrogrid-mep-specification.docx";
  a.click();
  URL.revokeObjectURL(url);
}
