// Structured MEP schedule exports: PDF (jsPDF + autotable) and DOCX (docx).

import {
  bomRows,
  fixtureCounts,
  type Fixture,
  type Metrics,
  type Pipe,
  type Roi,
} from "./hydrogrid";

interface ExportInput {
  projectName: string;
  pipes: Pipe[];
  fixtures: Fixture[];
  metrics: Metrics;
  roi: Roi;
}

const inr = (v: number) => `INR ${v.toLocaleString("en-IN")}`;

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportPdf({ projectName, pipes, fixtures, metrics, roi }: ExportInput) {
  const [{ jsPDF }, autoTableMod] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = autoTableMod.default;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFontSize(18);
  doc.text("HydroGrid Studio — MEP Plumbing Schedule", 40, 50);
  doc.setFontSize(10);
  doc.text(
    [
      `Project: ${projectName}`,
      `Issued: ${new Date().toLocaleString()}`,
      `Total DFU: ${metrics.totalDfu}   Total run: ${metrics.totalRun} m   Pipe saved: ${metrics.pipeSavedPct}%`,
      `Freshwater offset: ${metrics.freshwaterOffset} L/day   Annual saving: ${inr(roi.annualSavings)}`,
    ],
    40,
    70,
  );

  autoTable(doc, {
    startY: 130,
    head: [["Fixture type", "Count", "DFU each"]],
    body: fixtureCounts(fixtures).map(([type, count]) => [type, String(count), ""]),
    theme: "grid",
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    head: [["Class", "Dia (mm)", "Material", "Length (m)", "Unit (INR/m)", "Cost (INR)"]],
    body: bomRows(pipes).map((r) => [
      r.fluid,
      String(r.diameterMm),
      r.material,
      r.lengthM.toFixed(1),
      String(r.unitCost),
      r.cost.toLocaleString("en-IN"),
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
  });

  autoTable(doc, {
    head: [["Segment", "Fixture", "Floor", "Dia", "Run (m)", "Slope", "Velocity", "Head loss"]],
    body: pipes.map((p) => [
      p.id,
      `${p.fixtureType} (${p.room})`,
      `F${p.floor}`,
      `${p.diameterMm} mm`,
      p.runLength.toFixed(1),
      p.slope,
      `${p.velocity} m/s`,
      `${p.headLoss} m`,
    ]),
    theme: "striped",
    styles: { fontSize: 8 },
  });

  const y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 600;
  doc.setFontSize(10);
  doc.text(
    `Estimated CAPEX ${inr(roi.capex)} · payback ${roi.paybackYears} years`,
    40,
    Math.min(y + 30, 800),
  );

  download(doc.output("blob"), "hydrogrid-mep-schedule.pdf");
}

export async function exportDocx({ projectName, pipes, fixtures, metrics, roi }: ExportInput) {
  const { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, TextRun } =
    await import("docx");

  const cell = (text: string, bold = false) =>
    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, bold })] })] });

  const bomTable = new Table({
    rows: [
      new TableRow({
        children: ["Class", "Dia (mm)", "Material", "Length (m)", "Cost (INR)"].map((h) =>
          cell(h, true),
        ),
      }),
      ...bomRows(pipes).map(
        (r) =>
          new TableRow({
            children: [
              cell(r.fluid),
              cell(String(r.diameterMm)),
              cell(r.material),
              cell(r.lengthM.toFixed(1)),
              cell(r.cost.toLocaleString("en-IN")),
            ],
          }),
      ),
    ],
  });

  const scheduleTable = new Table({
    rows: [
      new TableRow({
        children: ["Segment", "Fixture", "Floor", "Dia (mm)", "Run (m)", "Slope"].map((h) =>
          cell(h, true),
        ),
      }),
      ...pipes.map(
        (p) =>
          new TableRow({
            children: [
              cell(p.id),
              cell(`${p.fixtureType} (${p.room})`),
              cell(`F${p.floor}`),
              cell(String(p.diameterMm)),
              cell(p.runLength.toFixed(1)),
              cell(p.slope),
            ],
          }),
      ),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "HydroGrid Studio — MEP Specification", heading: HeadingLevel.TITLE }),
          new Paragraph(`Project: ${projectName}`),
          new Paragraph(`Issued: ${new Date().toLocaleString()}`),
          new Paragraph({ text: "Engineering Summary", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(
            `Dual-network drainage carrying ${metrics.totalDfu} DFU across ${fixtures.length} fixtures, with ${metrics.totalRun} m of routed pipe (${metrics.pipeSavedPct}% shorter than a naive single-stack layout). Recovered greywater offsets ${metrics.freshwaterOffset} L/day of freshwater, worth ${inr(roi.annualSavings)} per year against a CAPEX of ${inr(roi.capex)} (payback ${roi.paybackYears} years).`,
          ),
          new Paragraph({ text: "Material Itemisation", heading: HeadingLevel.HEADING_1 }),
          bomTable,
          new Paragraph({ text: "Segment Schedule", heading: HeadingLevel.HEADING_1 }),
          scheduleTable,
        ],
      },
    ],
  });

  download(await Packer.toBlob(doc), "hydrogrid-mep-specification.docx");
}
