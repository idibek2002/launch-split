import { IFinalLaunch } from "@/types/lunch";

import { saveToDb } from "@/utils/utils";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const ShareButton = (data: IFinalLaunch) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleShare = async () => {
    try {
      setLoading(true);

      const shortId = await saveToDb(data);

      if (shortId) {
        const url = `${window.location.origin}/share?id=${shortId}`;
        navigator.clipboard.writeText(url);
        navigate(url);
        toast.success("Link copied!");
      }
    } finally {
      setLoading(false);
    }
  };

  const canShare = data?.breakdowns.length > 0;

  return (
    <Button
      onClick={handleShare}
      disabled={!canShare || loading}
      className="w-full"
      variant="outline"
    >
      {!loading && <Share2Icon size={18} />}
      {loading ? (
        <div className="flex items-center gap-10">
          <Loader2 className="animate-spin" size={18} /> "Поделиться"
        </div>
      ) : (
        "Поделиться"
      )}
    </Button>
  );
};
