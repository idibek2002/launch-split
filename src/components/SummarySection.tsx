import { Receipt } from "lucide-react";
import { ColleagueBreakdown } from "@/types/lunch";
import { Badge } from "@/components/ui/badge";

interface SummarySectionProps {
  breakdowns: ColleagueBreakdown[];
  subtotal: number;
  extraTotal: number;
  grandTotal: number;
}

const formatMoney = (value: number) =>
  value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "TJS",
    minimumFractionDigits: 2,
  });

export function SummarySection({
  breakdowns,
  subtotal,
  extraTotal,
  grandTotal,
}: SummarySectionProps) {
  if (breakdowns.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Receipt className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-semibold">Итог</h2>
      </div>

      {/* Панель итогов */}
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

      {/* По каждому человеку */}
      <div className="space-y-3">
        {breakdowns.map((b) => (
          <div
            key={b.colleague.id}
            className="bg-muted/50 rounded-xl px-4 py-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">{b.colleague.name}</span>
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
    </div>
  );
}
