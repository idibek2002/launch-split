import { useLunchSession } from "@/hooks/useLunchSession";
import {
  calculateBillSubtotal,
  calculateExtraCostsTotal,
  calculateGrandTotal,
  calculateBreakdowns,
} from "@/lib/calculations";
import { Header } from "@/components/Header";
import { ColleagueForm } from "@/components/ColleagueForm";
import { DishTable } from "@/components/DishTable";
import { ExtraCostsPanel } from "@/components/ExtraCostsPanel";
import { SummarySection } from "@/components/SummarySection";
import { ImageExporter } from "@/components/ImageExporter";

const Index = () => {
  const {
    session,
    addColleague,
    editColleague,
    deleteColleague,
    addDish,
    editDish,
    deleteDish,
    setExtraCosts,
    clearAll,
  } = useLunchSession();

  const { colleagues, dishes, extraCosts } = session;
  const subtotal = calculateBillSubtotal(dishes);
  const extraTotal = calculateExtraCostsTotal(subtotal, extraCosts);
  const grandTotal = calculateGrandTotal(dishes, extraCosts);
  const breakdowns = calculateBreakdowns(colleagues, dishes, extraCosts);

  const getTotalOwed = (id: string) => {
    const b = breakdowns.find((b) => b.colleague.id === id);
    return b?.total || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onClearAll={clearAll} />

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-5">
        <ColleagueForm
          colleagues={colleagues}
          onAdd={addColleague}
          onEdit={editColleague}
          onDelete={deleteColleague}
          getTotalOwed={getTotalOwed}
        />

        <DishTable
          dishes={dishes}
          colleagues={colleagues}
          onAdd={addDish}
          onEdit={editDish}
          onDelete={deleteDish}
        />

        <ExtraCostsPanel extras={extraCosts} onChange={setExtraCosts} />

        <SummarySection
          breakdowns={breakdowns}
          subtotal={subtotal}
          extraTotal={extraTotal}
          grandTotal={grandTotal}
        />

        {/* <PDFExporter
          colleagues={colleagues}
          dishes={dishes}
          extras={extraCosts}
          breakdowns={breakdowns}
          subtotal={subtotal}
          extraTotal={extraTotal}
          grandTotal={grandTotal}
        /> */}

        <ImageExporter
          breakdowns={breakdowns}
          subtotal={subtotal}
          extraTotal={extraTotal}
          grandTotal={grandTotal}
        />
        {/* <ExcelExporter
          colleagues={colleagues}
          dishes={dishes}
          extras={extraCosts}
          breakdowns={breakdowns}
          subtotal={subtotal}
          extraTotal={extraTotal}
          grandTotal={grandTotal}
        /> */}
      </main>
    </div>
  );
};

export default Index;
