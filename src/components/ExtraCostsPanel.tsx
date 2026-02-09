import { Percent, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExtraCosts } from "@/types/lunch";

interface ExtraCostsPanelProps {
  extras: ExtraCosts;
  onChange: (extras: ExtraCosts) => void;
}

export function ExtraCostsPanel({ extras, onChange }: ExtraCostsPanelProps) {
  const set = (key: keyof ExtraCosts, value: number | string) => {
    onChange({ ...extras, [key]: value });
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Percent className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-semibold">
          Дополнительные расходы
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Процент обслуживания</Label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={extras.taxPercent ?? ""}
            onChange={(e) => {
              const raw = e.target.value;

              // если пусто — сохраняем null
              if (raw === "") {
                set("taxPercent", null);
                return;
              }

              const value = parseFloat(raw);

              if (!isNaN(value)) {
                set("taxPercent", Math.max(0, value));
              }
            }}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
