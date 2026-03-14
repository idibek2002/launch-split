import { decryptData, encryptData } from "@/lib/crypto";
import { supabase } from "@/lib/supabase";
import { IFinalLaunch } from "@/types/lunch";

export const formatMoney = (value: number) =>
  value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "TJS",
    minimumFractionDigits: 2,
  });

export const saveToDb = async (bigObject: IFinalLaunch) => {
  try {
    const encryptedString = encryptData(bigObject);
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

export const deleteFromDb = async (id) => {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении:", error.message);
    return false;
  }
  return true;
};
