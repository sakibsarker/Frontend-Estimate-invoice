// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Define translations for English and Spanish
const resources = {
  en: {
    translation: {
      invoice: "Invoice",
      total: "Total",
      totalInvoiceCreated: "Total Invoice Created",
      totalInvoiceValue: "Total Invoice Value",
      totalPaid: "Total Paid",
      totalUnpaid: "Total Unpaid",
      draftInvoices: "Draft Invoices",
      pendingInvoices: "Pending Invoices",
      amountDue: "Amount Due",
      estimate: "Estimate",
      totalEstimatesCreated: "Total Estimates Created",
      newEstimates: "New Estimates",
      expiredEstimates: "Expired Estimates",
      approvalRates: "Approval Rates",
      acceptedPercentage: "Accepted Percentage",
      // bill
      billTo: "Bill To",
      customerName: "Customer Name",
      poNumber: "PO Number",
      salesRep: "Sales Rep",
      account: "Account",
      date: "Date",
      item: "Item",
      type: "Type",
      qty: "Qty",
      price: "Price",
      amount: "Amount",
      subtotal: "Subtotal",
      tax: "Tax",
      discount: "Discount",
      dueAmount: "Due Amount",
    },
  },
  es: {
    translation: {
      invoice: "Factura",
      total: "Total",
      totalInvoiceCreated: "Total de facturas creadas",
      totalInvoiceValue: "Valor total de la factura",
      totalPaid: "Total pagado",
      totalUnpaid: "Total no pagado",
      draftInvoices: "Facturas en borrador",
      pendingInvoices: "Facturas pendientes",
      amountDue: "Monto adeudado",
      estimate: "Presupuesto",
      totalEstimatesCreated: "Total de presupuestos creados",
      newEstimates: "Nuevos presupuestos",
      expiredEstimates: "Presupuestos vencidos",
      approvalRates: "Tasas de aprobación",
      acceptedPercentage: "Porcentaje aceptado",
      // bill
      billTo: "Facturar a",
      customerName: "Nombre del cliente",
      poNumber: "Número de orden",
      salesRep: "Representante de ventas",
      account: "Cuenta",
      date: "Fecha",
      item: "Artículo",
      type: "Tipo",
      qty: "Cantidad",
      price: "Precio",
      amount: "Monto",
      subtotal: "Subtotal",
      tax: "Impuesto",
      discount: "Descuento",
      dueAmount: "Monto pendiente",
    },
  },
};

i18n
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Bind i18next with React
  .init({
    resources,
    fallbackLng: "en", // Default language
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
