import { IFinalLaunch } from "@/types/lunch";

import { saveToDb } from "@/utils/utils";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Check, Copy, ExternalLink, Loader2, Share2Icon } from "lucide-react";
import { toast } from "sonner";

export const ShareButton = (data: IFinalLaunch) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const canShare = data?.breakdowns.length > 0;

  const handleShare = async () => {
    try {
      setLoading(true);

      const id = await saveToDb(data);

      if (!id) {
        toast.error("Не удалось создать ссылку. Попробуйте ещё раз.");
        return;
      }

      const url = `${window.location.origin}/share/${id}`;
      setShareUrl(url);
      setOpen(true);

      // Пытаемся сразу скопировать
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Ссылка скопирована!");
      } catch {
        // Копирование недоступно — пользователь скопирует вручную
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Ссылка скопирована!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        disabled={!canShare || loading}
        className="w-full"
        variant="outline"
      >
        {loading ? (
          <>
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            Создаём ссылку…
          </>
        ) : (
          <>
            <Share2Icon className="mr-1 h-4 w-4" />
            Поделиться
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Share2Icon className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>Ссылка на расчёт готова</DialogTitle>
            <DialogDescription>
              Отправьте эту ссылку коллегам — они увидят разделение счёта.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 text-sm"
            />
            <Button
              type="button"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button asChild variant="outline" className="w-full">
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" />
              Открыть ссылку
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
