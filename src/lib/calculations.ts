import { Colleague, Dish, ExtraCosts, ColleagueBreakdown } from "@/types/lunch";

export function calculateDishTotal(dish: Dish): number {
  return round2(dish.price * dish.quantity);
}

export function calculateBillSubtotal(dishes: Dish[]): number {
  return round2(dishes.reduce((sum, d) => sum + calculateDishTotal(d), 0));
}

export function calculateExtraCostsTotal(
  subtotal: number,
  extras: ExtraCosts,
): number {
  const tax = round2((subtotal * extras.taxPercent) / 100);
  const service = round2((subtotal * extras.servicePercent) / 100);
  const tip =
    extras.tipType === "percent"
      ? round2((subtotal * extras.tipValue) / 100)
      : round2(extras.tipValue);
  return round2(tax + service + tip);
}

export function calculateGrandTotal(
  dishes: Dish[],
  extras: ExtraCosts,
): number {
  const subtotal = calculateBillSubtotal(dishes);
  return round2(subtotal + calculateExtraCostsTotal(subtotal, extras));
}

export function calculateBreakdowns(
  colleagues: Colleague[],
  dishes: Dish[],
  extras: ExtraCosts,
): ColleagueBreakdown[] {
  const subtotal = calculateBillSubtotal(dishes);
  const extraTotal = calculateExtraCostsTotal(subtotal, extras);

  return colleagues.map((colleague) => {
    const colleagueDishes: { dish: Dish; amount: number }[] = [];
    let personSubtotal = 0;

    for (const dish of dishes) {
      if (dish.colleagueIds.includes(colleague.id)) {
        const shareCount = dish.colleagueIds.length;
        const amount = round2(calculateDishTotal(dish) / shareCount);
        colleagueDishes.push({ dish, amount });
        personSubtotal += amount;
      }
    }

    personSubtotal = round2(personSubtotal);
    const proportion = subtotal > 0 ? personSubtotal / subtotal : 0;
    const personExtra = round2(extraTotal * proportion);

    return {
      colleague,
      dishes: colleagueDishes,
      subtotal: personSubtotal,
      extraCosts: personExtra,
      total: round2(personSubtotal + personExtra),
    };
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
