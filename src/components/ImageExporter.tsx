import { Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Colleague, Dish, ExtraCosts, ColleagueBreakdown } from "@/types/lunch";
import { formatMoney } from "@/utils/utils";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { Badge } from "./ui/badge";

interface ImageExporterProps {
  breakdowns: ColleagueBreakdown[];
  subtotal: number;
  extraTotal: number;
  grandTotal: number;
}

export function ImageExporter({
  breakdowns,
  subtotal,
  extraTotal,
  grandTotal,
}: ImageExporterProps) {
  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!exportRef.current) return;

    const canvas = await html2canvas(exportRef.current, {
      scale: 6,
      useCORS: true,
      backgroundColor: "#f3f4f6",
    });

    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `LunchSplit_${day}.${month}.${year}.png`;
    link.click();
  };

  const canExport = breakdowns.length > 0;

  return (
    <>
      <div
        ref={exportRef}
        className="absolute -left-[9999px] w-[900px] bg-card rounded-2xl border border-border p-5 space-y-4"
      >
        <h2 className="text-lg font-display font-semibold">Итог</h2>

        {/* Панель итогов */}

        {/* По каждому человеку */}
        <div className="space-y-3">
          {breakdowns.map((b) => (
            <div
              key={b.colleague.id}
              className="bg-muted/50 rounded-xl px-4 py-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">
                  {b.colleague.name}
                </span>
                <span className="text-lg font-bold font-display text-primary">
                  {formatMoney(b.total)}
                </span>
              </div>

              {b.dishes.length > 0 && (
                <div className="space-y-1">
                  {b.dishes.map((d, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs text-muted-foreground"
                    >
                      <span>
                        {d.dish.name}
                        {d.dish.quantity > 1 ? ` ×${d.dish.quantity}` : ""}
                      </span>
                      <span>{formatMoney(d.amount)}</span>
                    </div>
                  ))}

                  {b.extraCosts > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Дополнительные расходы</span>
                      <span>{formatMoney(b.extraCosts)}</span>
                    </div>
                  )}
                </div>
              )}

              {b.dishes.length === 0 && (
                <Badge variant="secondary" className="text-[10px]">
                  Блюда не назначены
                </Badge>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Сумма
            </p>
            <p className="text-base font-bold font-display">
              {formatMoney(subtotal)}
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              Дополнительно
            </p>
            <p className="text-base font-bold font-display">
              {formatMoney(extraTotal)}
            </p>
          </div>

          <div className="bg-primary/10 rounded-xl p-3 text-center border border-primary/20">
            <p className="text-[10px] uppercase tracking-wider text-primary mb-1">
              Итого
            </p>
            <p className="text-base font-bold font-display text-primary">
              {formatMoney(grandTotal)}
            </p>
          </div>
        </div>
      </div>
      <Button
        onClick={handleDownload}
        disabled={!canExport}
        className="w-full"
        variant="outline"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Image
      </Button>
    </>
  );
}
