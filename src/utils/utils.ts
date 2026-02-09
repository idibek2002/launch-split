export const formatMoney = (value: number) =>
  value.toLocaleString("ru-RU", {
    style: "currency",
    currency: "TJS",
    minimumFractionDigits: 2,
  });
