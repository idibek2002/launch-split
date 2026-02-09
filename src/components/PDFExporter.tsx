import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Colleague, Dish, ExtraCosts, ColleagueBreakdown } from "@/types/lunch";
import { calculateDishTotal } from "@/lib/calculations";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PDFExporterProps {
  colleagues: Colleague[];
  dishes: Dish[];
  extras: ExtraCosts;
  breakdowns: ColleagueBreakdown[];
  subtotal: number;
  extraTotal: number;
  grandTotal: number;
}

export function PDFExporter({
  colleagues,
  dishes,
  breakdowns,
  subtotal,
  extraTotal,
  grandTotal,
}: PDFExporterProps) {
  const handleDownload = () => {
    const doc = new jsPDF();
    const today = new Date().toISOString().split("T")[0];

    // ===== HEADER BACKGROUND =====
    doc.setFillColor(230, 140, 50);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255);
    doc.setFontSize(22);
    doc.text("LunchSplit Report", 14, 20);

    doc.setFontSize(10);
    doc.text(`Date: ${today}`, 14, 28);

    // ===== COLLEAGUES =====
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(
      `Participants: ${colleagues.map((c) => c.name).join(", ")}`,
      14,
      45,
    );

    // ===== DISHES TABLE =====
    autoTable(doc, {
      startY: 55,
      head: [["Dish", "Price", "Qty", "Total", "Shared by"]],
      body: dishes.map((d) => [
        d.name,
        `$${d.price.toFixed(2)}`,
        d.quantity.toString(),
        `$${calculateDishTotal(d).toFixed(2)}`,
        d.colleagueIds
          .map((id) => colleagues.find((c) => c.id === id)?.name || "?")
          .join(", "),
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [230, 140, 50],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    const finalY = doc["lastAutoTable"].finalY + 10;

    // ===== BREAKDOWN =====
    doc.setFontSize(14);
    doc.text("Individual Breakdown", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Colleague", "Subtotal", "Extras", "Total"]],
      body: breakdowns.map((b) => [
        b.colleague.name,
        `$${b.subtotal.toFixed(2)}`,
        `$${b.extraCosts.toFixed(2)}`,
        `$${b.total.toFixed(2)}`,
      ]),
      headStyles: {
        fillColor: [60, 60, 60],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });

    const summaryY = doc["lastAutoTable"].finalY + 15;

    // ===== TOTAL BLOCK =====
    doc.setFillColor(240, 240, 240);
    doc.rect(14, summaryY - 8, 182, 30, "F");

    doc.setFontSize(11);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 20, summaryY);
    doc.text(`Extra costs: $${extraTotal.toFixed(2)}`, 20, summaryY + 8);

    doc.setFontSize(14);
    doc.setTextColor(230, 140, 50);
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 20, summaryY + 20);

    doc.save(`LunchSplit_${today}.pdf`);
  };

  const canExport = dishes.length > 0 && colleagues.length > 0;

  return (
    <Button
      onClick={handleDownload}
      disabled={!canExport}
      className="w-full"
      variant="outline"
    >
      <Download className="w-4 h-4 mr-2" />
      Download PDF
    </Button>
  );
}
