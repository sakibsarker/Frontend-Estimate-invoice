export const generateInvoiceNumber = (): string => {
  const now = new Date();
  const datePart = [
    now.getFullYear().toString().slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const uniquePart = String(Math.floor(1000 + Math.random() * 9000));
  return `INV${datePart}${uniquePart}`;
};
