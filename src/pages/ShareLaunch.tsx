import { SummarySection } from "@/components/SummarySection";
import { getFromDb } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";

import { useParams, useSearchParams } from "react-router-dom";
import NotFound from "./NotFound";

const ShareLaunch = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  const { data, isLoading } = useQuery({
    queryKey: ["share", id],
    queryFn: () => getFromDb(id),
    enabled: !!id,
  });

  if (!data && !isLoading) {
    return <NotFound />;
  }

  return (
    <SummarySection
      breakdowns={data?.breakdowns ?? []}
      subtotal={data?.subtotal}
      extraTotal={data?.extraTotal}
      grandTotal={data?.grandTotal}
    />
  );
};

export default ShareLaunch;
