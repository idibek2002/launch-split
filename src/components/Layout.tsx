import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "./Header";
import { deleteFromDb } from "@/utils/utils";
import { useLunchSession } from "@/hooks/useLunchSession";

export const Layout = () => {
  const { clearAll } = useLunchSession();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");

  const onClearAll = async () => {
    if (id) {
      await deleteFromDb(id);
      navigate("/");
    }
    clearAll();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onClearAll={onClearAll} />

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-5">
        <Outlet />
      </main>
    </div>
  );
};
