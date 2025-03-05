import { Link, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
interface PreviewProps {
  // Template configuration
  logo: string | null;
  layout: string;
  templateData: {
    customerName: boolean;
    billingAddress: boolean;
    phone: boolean;
    email: boolean;
    accountNumber: boolean;
    poNumber: boolean;
    salesRep: boolean;
    Date: boolean;
    itemName: boolean;
    quantity: boolean;
    price: boolean;
    type: boolean;
    description: boolean;
    subtotal: boolean;
    tax: boolean;
    discount: boolean;
    dueAmount: boolean;
  };
}

interface InvoiceDataProps {
  // Invoice content
  customerId: {
    contact_first_name: string;
    contact_last_name: string;
    billing_address_line1: string;
    billing_city: string;
    billing_state: string;
    billing_zip_code: string;
    account_number: string;
    email_address: string;
    phone_number: string;
  };
  po_number: string;
  sales_rep: string;
  created_at: string;
  invoice_items_list: Array<{
    item: {
      item_name: string;
      type: string;
      description: string;
      price: string;
    };
    quantity: number;
    price: string;
    total: string;
  }>;
  subtotal: string;
  total: string;
  amount_due: string;
  tax: {
    tax_rate: string | null;
  };
  discount: {
    discount_rate: string | null;
  };
}

export function SendEstimatePreview(props: PreviewProps & InvoiceDataProps) {
  const { t } = useTranslation();
  return (
    <div className="printable-area">
      <div
        className={cn(
          "bg-white rounded-xl shadow-lg p-6 md:p-8",
          props.layout === "impact" && "border border-gray-100",
          props.layout === "modern" && "shadow-sm"
        )}
      >
        {/* Header Section - Layout Variations */}
        <div className="page-break-after-avoid">
          <div
            className={cn(
              "mb-6 md:mb-8 transition-all",
              props.layout === "impact" && "bg-gray-50 rounded-lg p-6", // Layout 2 with background
              props.layout === "classic" && "border-b pb-6"
            )}
          >
            <div
              className={cn(
                "flex flex-col md:flex-row justify-between",
                props.layout === "impact" && "text-center flex-col",
                props.layout === "modern" && "items-start"
              )}
            >
              {/* Logo/Company Name Section */}
              <div
                className={cn(
                  props.layout === "classic" && "order-1",
                  props.layout === "modern" && "space-y-2"
                )}
              >
                {props.logo ? (
                  <img
                    src={props.logo}
                    alt="Business logo"
                    className={cn(
                      "w-auto object-contain mb-4",
                      props.layout === "impact" ? "mx-auto h-24" : "h-20",
                      props.layout === "modern" && "rounded-lg"
                    )}
                  />
                ) : (
                  <h2
                    className={cn(
                      "font-bold text-gray-800",
                      props.layout === "impact" ? "text-3xl" : "text-2xl",
                      props.layout === "modern" && "tracking-wide"
                    )}
                  >
                    Auto Gig Shop
                  </h2>
                )}
              </div>

              {/* Invoice Customer Info */}
              <div
                className={cn(
                  "space-y-2",
                  props.layout === "classic"
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2",
                  props.layout === "minimal" && "grid-cols-1"
                )}
              >
                <div
                  className={cn(
                    "font-bold text-primary-600",
                    props.layout === "impact" ? "text-3xl" : "text-2xl",
                    props.layout === "modern" && "text-xl"
                  )}
                >
                  {t("billTo")}
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  {props.templateData.billingAddress && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{props.customerId.billing_address_line1}</div>
                      <div>
                        {props.customerId.billing_city},{" "}
                        {props.customerId.billing_state}{" "}
                        {props.customerId.billing_zip_code}
                      </div>
                      {props.templateData.accountNumber && (
                        <div className="mt-2">
                          <span className="font-medium">{t("account")}#:</span>{" "}
                          {props.customerId.account_number}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="pt-2 space-y-1">
                    {props.templateData.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {t("email")}: {props.customerId.email_address}
                      </div>
                    )}
                    {props.templateData.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {t("phone")}: {props.customerId.phone_number}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice Header Info */}
              <div
                className={cn(
                  "space-y-2",
                  props.layout === "classic" && "text-right md:w-1/3",
                  props.layout === "modern" && "mt-4 md:mt-0",
                  props.layout === "minimal" && "hidden"
                )}
              >
                <div
                  className={cn(
                    "font-bold text-primary-600 uppercase",
                    props.layout === "impact" ? "text-3xl" : "text-2xl",
                    props.layout === "modern" && "text-xl"
                  )}
                >
                  {t("estimate")}
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  {props.templateData.customerName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {t("customerName")}:
                      </span>
                      <span className="text-gray-900">
                        {props.customerId.contact_first_name}{" "}
                        {props.customerId.contact_last_name}
                      </span>
                    </div>
                  )}
                  {props.templateData.Date && (
                    <div
                      className={cn(
                        props.layout === "modern"
                          ? "text-gray-700"
                          : "text-gray-500"
                      )}
                    >
                      {new Date(props.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  {props.templateData.poNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("poNumber")}:</span>
                      <span className="text-gray-900">{props.po_number}</span>
                    </div>
                  )}
                  {props.templateData.salesRep && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("salesRep")}::</span>
                      <span className="text-gray-900">{props.sales_rep}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table - Layout Variations */}
        <div className="page-break-inside-avoid">
          <div
            className={cn(
              "overflow-x-auto pb-2",
              props.layout === "modern" && "border rounded-lg"
            )}
          >
            <table className="w-full">
              <thead
                className={cn(
                  "bg-gray-50",
                  props.layout === "modern" && "border-b"
                )}
              >
                <tr>
                  {props.templateData.Date && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      {t("date")}
                    </th>
                  )}
                  {props.templateData.itemName && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("item")}
                    </th>
                  )}
                  {props.templateData.type && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      {t("type")}
                    </th>
                  )}
                  {props.templateData.quantity && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("qty")}
                    </th>
                  )}
                  {props.templateData.price && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("price")}
                    </th>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t("amount")}
                  </th>
                </tr>
              </thead>
              <tbody
                className={cn(
                  "divide-y divide-gray-200",
                  props.layout === "modern" && "divide-gray-100"
                )}
              >
                {props.invoice_items_list.map((invoiceItem, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {props.templateData.Date && (
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {new Date(props.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                    )}
                    {props.templateData.itemName && (
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {invoiceItem.item.item_name}
                        </div>
                        {props.templateData.description && (
                          <div className="mt-1 text-sm text-gray-500">
                            {invoiceItem.item.description}
                          </div>
                        )}
                      </td>
                    )}
                    {props.templateData.type && (
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {invoiceItem.item.type}
                      </td>
                    )}
                    {props.templateData.quantity && (
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {invoiceItem.quantity}
                      </td>
                    )}
                    {props.templateData.price && (
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        ${parseFloat(invoiceItem.price).toFixed(2)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${parseFloat(invoiceItem.total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section - Layout Variations */}
        <div className="totals-section page-break-before-auto">
          <div
            className={cn(
              "mt-8 p-4 rounded-lg",
              props.layout === "impact" && "bg-gray-50",
              props.layout === "modern" && "border-t"
            )}
          >
            <div className="max-w-xs ml-auto space-y-3">
              {props.templateData.subtotal && (
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-600">{t("subtotal")}:</span>
                  <span className="text-gray-900">
                    ${parseFloat(props.subtotal).toFixed(2)}
                  </span>
                </div>
              )}
              {props.templateData.tax && props.tax && (
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-600">
                    {t("tax")} ({props.tax.tax_rate ?? "0"}%):
                  </span>
                  <span className="text-gray-900">
                    ${parseFloat(props.tax.tax_rate ?? "0").toFixed(2)}
                  </span>
                </div>
              )}
              {props.templateData.discount && props.discount && (
                <div className="flex justify-between font-semibold text-sm text-gray-600">
                  <span className="text-gray-600">
                    {t("discount")} ({props.discount.discount_rate ?? "0"}%):
                  </span>
                  <span className="text-gray-900">
                    $
                    {parseFloat(props.discount.discount_rate ?? "0").toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary-600">
                  ${parseFloat(props.total).toFixed(2)}
                </span>
              </div>
              {props.templateData.dueAmount && (
                <div className="flex justify-between ">
                  <span>{t("dueAmount")}</span>
                  <span>${parseFloat(props.amount_due).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="page-break-before-auto">
          <div className="mt-8 p-6 rounded-lg">
            <div className="text-sm space-y-2">
              {props.templateData.customerName && (
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  <a
                    href="https://payment.example.com"
                    className="underline hover:opacity-80"
                  >
                    https://payment.example.com
                  </a>
                </div>
              )}
              {props.templateData.customerName && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Terms: Due on Receipt</span>
                </div>
              )}
              <div className="pt-2 font-medium">
                Thank you for your business!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
