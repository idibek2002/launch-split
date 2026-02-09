import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Colleague } from "@/types/lunch";
import { toast } from "sonner";

interface ColleagueFormProps {
  colleagues: Colleague[];
  onAdd: (name: string) => void;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  getTotalOwed: (id: string) => number;
}

export function ColleagueForm({
  colleagues,
  onAdd,
  onEdit,
  onDelete,
  getTotalOwed,
}: ColleagueFormProps) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (
      colleagues.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      toast.error("Коллега уже существует");
      return;
    }
    onAdd(trimmed);
    setName("");
    toast.success(`${trimmed} добавлен`);
  };

  const handleEdit = (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    onEdit(id, trimmed);
    setEditingId(null);
    toast.success("Имя обновлено");
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-semibold">Коллеги</h2>
        <Badge variant="secondary" className="ml-auto">
          {colleagues.length}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Введите имя коллеги..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1"
        />
        <Button onClick={handleAdd} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {colleagues.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Добавьте коллег, которые участвовали в обеде
        </p>
      )}

      <div className="space-y-2">
        {colleagues.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2"
          >
            {editingId === c.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEdit(c.id)}
                  className="flex-1 h-8"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleEdit(c.id)}
                >
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setEditingId(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium">{c.name}</span>
                <span className="text-xs font-semibold text-primary">
                  ${getTotalOwed(c.id).toFixed(2)}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => {
                    setEditingId(c.id);
                    setEditName(c.name);
                  }}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => {
                    onDelete(c.id);
                    toast.success("Коллега удалён");
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
