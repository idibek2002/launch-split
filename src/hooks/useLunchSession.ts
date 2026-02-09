import { useState, useEffect, useCallback } from "react";
import { Colleague, Dish, ExtraCosts, LunchSession } from "@/types/lunch";
import {
  saveSession,
  loadSession,
  clearSession as clearStorage,
} from "@/lib/storage";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

const defaultExtras: ExtraCosts = {
  taxPercent: 0,
  servicePercent: 0,
  tipType: "fixed",
  tipValue: 0,
};

function createEmptySession(): LunchSession {
  return {
    id: generateId(),
    date: new Date().toISOString().split("T")[0],
    colleagues: [],
    dishes: [],
    extraCosts: { ...defaultExtras },
  };
}

export function useLunchSession() {
  const [session, setSession] = useState<LunchSession>(createEmptySession);

  // Load on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved) setSession(saved);
  }, []);

  // Auto-save
  useEffect(() => {
    saveSession(session);
  }, [session]);

  const update = useCallback((fn: (s: LunchSession) => LunchSession) => {
    setSession((prev) => fn(prev));
  }, []);

  // Colleagues
  const addColleague = useCallback(
    (name: string) => {
      update((s) => ({
        ...s,
        colleagues: [...s.colleagues, { id: generateId(), name }],
      }));
    },
    [update],
  );

  const editColleague = useCallback(
    (id: string, name: string) => {
      update((s) => ({
        ...s,
        colleagues: s.colleagues.map((c) => (c.id === id ? { ...c, name } : c)),
      }));
    },
    [update],
  );

  const deleteColleague = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        colleagues: s.colleagues.filter((c) => c.id !== id),
        dishes: s.dishes.map((d) => ({
          ...d,
          colleagueIds: d.colleagueIds.filter((cid) => cid !== id),
        })),
      }));
    },
    [update],
  );

  // Dishes
  const addDish = useCallback(
    (dish: Omit<Dish, "id">) => {
      update((s) => ({
        ...s,
        dishes: [...s.dishes, { ...dish, id: generateId() }],
      }));
    },
    [update],
  );

  const editDish = useCallback(
    (id: string, data: Partial<Omit<Dish, "id">>) => {
      update((s) => ({
        ...s,
        dishes: s.dishes.map((d) => (d.id === id ? { ...d, ...data } : d)),
      }));
    },
    [update],
  );

  const deleteDish = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        dishes: s.dishes.filter((d) => d.id !== id),
      }));
    },
    [update],
  );

  // Extra costs
  const setExtraCosts = useCallback(
    (extras: ExtraCosts) => {
      update((s) => ({ ...s, extraCosts: extras }));
    },
    [update],
  );

  // Clear
  const clearAll = useCallback(() => {
    clearStorage();
    setSession(createEmptySession());
  }, []);

  return {
    session,
    addColleague,
    editColleague,
    deleteColleague,
    addDish,
    editDish,
    deleteDish,
    setExtraCosts,
    clearAll,
  };
}
