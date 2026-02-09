import { useState } from "react";
import {
  Plus,
  Minus,
  Pencil,
  Trash2,
  UtensilsCrossed,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Colleague, Dish } from "@/types/lunch";
import { calculateDishTotal } from "@/lib/calculations";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface DishTableProps {
  dishes: Dish[];
  colleagues: Colleague[];
  onAdd: (dish: Omit<Dish, "id">) => void;
  onEdit: (id: string, data: Partial<Omit<Dish, "id">>) => void;
  onDelete: (id: string) => void;
}

export function DishTable({
  dishes,
  colleagues,
  onAdd,
  onEdit,
  onDelete,
}: DishTableProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    quantity: "1",
    colleagueIds: [] as string[],
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // For assigning colleagues inline
  const [assigningId, setAssigningId] = useState<string | null>(null);

  // Quick add: just name + price, quantity=1, no colleagues yet
  const handleQuickAdd = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Введите название блюда");
      return;
    }
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) {
      toast.error("Введите корректную цену");
      return;
    }
    onAdd({ name: trimmedName, price: p, quantity: 1, colleagueIds: [] });
    setName("");
    setPrice("");
    toast.success(`${trimmedName} добавлено`);
  };

  // Inline quantity +/-
  const changeQuantity = (dishId: string, delta: number) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return;
    const newQty = Math.max(1, dish.quantity + delta);
    onEdit(dishId, { quantity: newQty });
  };

  // Toggle colleague on a dish inline
  const toggleColleagueOnDish = (dishId: string, colleagueId: string) => {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return;
    const ids = dish.colleagueIds.includes(colleagueId)
      ? dish.colleagueIds.filter((id) => id !== colleagueId)
      : [...dish.colleagueIds, colleagueId];
    onEdit(dishId, { colleagueIds: ids });
  };

  // Edit dialog
  const startEdit = (dish: Dish) => {
    setEditForm({
      name: dish.name,
      price: dish.price.toString(),
      quantity: dish.quantity.toString(),
      colleagueIds: [...dish.colleagueIds],
    });
    setEditingId(dish.id);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (!editForm.name.trim()) {
      toast.error("Введите название");
      return;
    }
    const p = parseFloat(editForm.price);
    if (isNaN(p) || p <= 0) {
      toast.error("Введите корректную цену");
      return;
    }
    onEdit(editingId!, {
      name: editForm.name.trim(),
      price: p,
      quantity: parseInt(editForm.quantity) || 1,
      colleagueIds: editForm.colleagueIds,
    });
    setEditDialogOpen(false);
    setEditingId(null);
    toast.success("Блюдо обновлено");
  };

  const toggleEditColleague = (id: string) => {
    setEditForm((f) => ({
      ...f,
      colleagueIds: f.colleagueIds.includes(id)
        ? f.colleagueIds.filter((c) => c !== id)
        : [...f.colleagueIds, id],
    }));
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <UtensilsCrossed className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-semibold">Блюда</h2>
        <Badge variant="secondary" className="ml-auto">
          {dishes.length}
        </Badge>
      </div>

      {/* Quick add: name + price only */}
      <div className="flex gap-2">
        <Input
          placeholder="Название блюда..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
          className="flex-1"
        />
        <Input
          placeholder="Цена"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
          className="w-24"
        />
        <Button onClick={handleQuickAdd} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {dishes.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Добавьте блюда, затем настройте количество и разделите между коллегами
        </p>
      )}

      {/* Dish list with inline controls */}
      <div className="space-y-2">
        {dishes.map((dish) => {
          const total = calculateDishTotal(dish);
          const perPerson =
            dish.colleagueIds.length > 0
              ? total / dish.colleagueIds.length
              : total;
          const isAssigning = assigningId === dish.id;

          return (
            <div
              key={dish.id}
              className="bg-muted/50 rounded-xl px-4 py-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm truncate block">
                    {dish.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {dish.price.toFixed(2)} × {dish.quantity} ={" "}
                    {total.toFixed(2)}
                    {dish.colleagueIds.length > 0 && (
                      <> · {perPerson.toFixed(2)}/чел.</>
                    )}
                  </span>
                </div>

                {/* Quantity +/- */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => changeQuantity(dish.id, -1)}
                    disabled={dish.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {dish.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => changeQuantity(dish.id, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex gap-0.5 shrink-0">
                  <Button
                    size="icon"
                    variant={isAssigning ? "default" : "ghost"}
                    className="h-7 w-7"
                    onClick={() => setAssigningId(isAssigning ? null : dish.id)}
                    title="Разделить между коллегами"
                  >
                    <UserPlus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => startEdit(dish)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => {
                      onDelete(dish.id);
                      toast.success("Блюдо удалено");
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Assigned colleagues badges */}
              {dish.colleagueIds.length > 0 && !isAssigning && (
                <div className="flex flex-wrap gap-1">
                  {dish.colleagueIds.map((cid) => {
                    const c = colleagues.find((col) => col.id === cid);
                    return c ? (
                      <Badge
                        key={cid}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {c.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}

              {/* Inline colleague assignment */}
              {isAssigning && colleagues.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {colleagues.map((c) => {
                    const selected = dish.colleagueIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleColleagueOnDish(dish.id, c.id)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-primary/50"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {isAssigning && colleagues.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Сначала добавьте коллег
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать блюдо</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Название"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Цена"
                type="number"
                step="0.01"
                min="0"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, price: e.target.value }))
                }
              />
              <Input
                placeholder="Кол-во"
                type="number"
                min="1"
                value={editForm.quantity}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, quantity: e.target.value }))
                }
              />
            </div>
            <div>
              <span className="text-sm font-medium mb-2 block">
                Разделить между:
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {colleagues.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={editForm.colleagueIds.includes(c.id)}
                      onCheckedChange={() => toggleEditColleague(c.id)}
                    />
                    <span className="text-sm">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button onClick={handleEditSubmit}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
