import { decryptData, encryptData } from "@/lib/crypto";
import { supabase } from "@/lib/supabase";
import { IFinalLaunch } from "@/types/lunch";

export const formatMoney = (value: number) =>
  value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "TJS",
    minimumFractionDigits: 2,
  });

const DEVICE_ID_KEY = "lunchsplit_device_id";

// Стабильный идентификатор устройства/браузера, хранится в localStorage.
export const getDeviceId = (): string => {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
};

export const saveToDb = async (bigObject: IFinalLaunch) => {
  try {
    const payload: IFinalLaunch = { ...bigObject, ownerId: getDeviceId() };
    const encryptedString = encryptData(payload);
    const { data, error } = await supabase
      .from("orders")
      .insert([{ data: encryptedString }])
      .select("id")
      .single();

    if (error) throw error;

    return data.id;
  } catch (err) {
    console.error("Ошибка сохранения:", err);

    return null;
  }
};

export const getFromDb = async (id: string): Promise<IFinalLaunch> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("data")
      .eq("id", id)
      .single();

    if (error) throw error;
    return decryptData(data.data);
  } catch (err) {
    console.error("Ошибка загрузки:", err);

    return null;
  }
};

export const deleteFromDb = async (id: string) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении:", error.message);
    return false;
  }
  return true;
};
