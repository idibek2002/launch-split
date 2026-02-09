import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Colleague, Dish, ExtraCosts, ColleagueBreakdown } from "@/types/lunch";
import { calculateDishTotal } from "@/lib/calculations";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ExcelExporterProps {
  colleagues: Colleague[];
  dishes: Dish[];
  extras: ExtraCosts;
  breakdowns: ColleagueBreakdown[];
  subtotal: number;
  extraTotal: number;
  grandTotal: number;
}

export function ExcelExporter({
  colleagues,
  dishes,
  breakdowns,
  subtotal,
  extraTotal,
  grandTotal,
}: ExcelExporterProps) {
  const handleExcelDownload = () => {
    const today = new Date().toISOString().split("T")[0];

    const wb = XLSX.utils.book_new();

    // ===== Sheet 1: Dishes =====
    const dishesData = dishes.map((d) => ({
      Dish: d.name,
      Price: d.price,
      Quantity: d.quantity,
      Total: calculateDishTotal(d),
      SharedBy: d.colleagueIds
        .map((id) => colleagues.find((c) => c.id === id)?.name || "?")
        .join(", "),
    }));

    const ws1 = XLSX.utils.json_to_sheet(dishesData);
    XLSX.utils.book_append_sheet(wb, ws1, "Dishes");

    // ===== Sheet 2: Breakdown =====
    const breakdownData = breakdowns.map((b) => ({
      Colleague: b.colleague.name,
      Subtotal: b.subtotal,
      Extras: b.extraCosts,
      Total: b.total,
    }));

    const ws2 = XLSX.utils.json_to_sheet(breakdownData);
    XLSX.utils.book_append_sheet(wb, ws2, "Breakdown");

    // ===== Summary Sheet =====
    const summaryData = [
      { Label: "Subtotal", Value: subtotal },
      { Label: "Extra Costs", Value: extraTotal },
      { Label: "Grand Total", Value: grandTotal },
    ];

    const ws3 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws3, "Summary");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `LunchSplit_${today}.xlsx`);
  };

  const canExport = dishes.length > 0 && colleagues.length > 0;

  return (
    <Button
      onClick={handleExcelDownload}
      disabled={!canExport}
      className="w-full"
      variant="outline"
    >
      <Download className="w-4 h-4 mr-2" />
      Download Excel
    </Button>
  );
}
