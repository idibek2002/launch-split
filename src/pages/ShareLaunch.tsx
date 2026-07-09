import { SummarySection } from "@/components/SummarySection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteFromDb, getDeviceId, getFromDb } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { Link2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";

const ShareLaunch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["share", id],
    queryFn: () => getFromDb(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return <NotFound />;
  }

  // Владелец — тот, кто открыл ссылку с того же устройства, что создало расчёт.
  const isOwner = !!data.ownerId && data.ownerId === getDeviceId();

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    const ok = await deleteFromDb(id);
    setDeleting(false);

    if (ok) {
      toast.success("Расчёт удалён");
      navigate("/");
    } else {
      toast.error("Не удалось удалить расчёт");
    }
  };

  return (
    <div className="space-y-5">
      {/* Метка «общий расчёт» */}
      <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Link2 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">Общий расчёт</p>
          <p className="text-xs text-muted-foreground">
            {isOwner
              ? "Вы создали этот расчёт"
              : "Кто-то поделился с вами разделением счёта"}
          </p>
        </div>
      </div>

      <SummarySection
        breakdowns={data.breakdowns ?? []}
        subtotal={data.subtotal}
        extraTotal={data.extraTotal}
        grandTotal={data.grandTotal}
        payUrl="https://alifmobi.page.link"
      />

      {/* Удалить — только для владельца (то же устройство) */}
      {isOwner && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              disabled={deleting}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Удалить расчёт
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить расчёт?</AlertDialogTitle>
              <AlertDialogDescription>
                Ссылка перестанет работать для всех, кому вы её отправили. Это
                действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Да, удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

    </div>
  );
};

export default ShareLaunch;
