export interface Colleague {
  id: string;
  name: string;
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  quantity: number;
  colleagueIds: string[];
}

export interface ExtraCosts {
  taxPercent: number;
  servicePercent: number;
  tipType: "fixed" | "percent";
  tipValue: number;
}

export interface ColleagueBreakdown {
  colleague: Colleague;
  dishes: { dish: Dish; amount: number }[];
  subtotal: number;
  extraCosts: number;
  total: number;
}

export interface LunchSession {
  id: string;
  date: string;
  colleagues: Colleague[];
  dishes: Dish[];
  extraCosts: ExtraCosts;
}
