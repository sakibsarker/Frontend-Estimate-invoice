import { Mail, Phone, Link, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoicePreviewProps {
  logo: string | null;
  color: string;
  layout: string;
  templateData: any;
}

export function InvoicePreview({
  logo,
  color,
  layout,
  templateData,
}: InvoicePreviewProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg p-6 md:p-8",
        layout === "impact" && "border border-gray-100",
        layout === "modern" && "shadow-sm"
      )}
    >
      {/* Header Section - Layout Variations */}
      <div
        className={cn(
          "mb-6 md:mb-8 transition-all",
          layout === "impact" && "bg-gray-50 rounded-lg p-6", // Layout 2 with background
          layout === "classic" && "border-b pb-6"
        )}
      >
        <div
          className={cn(
            "flex flex-col md:flex-row justify-between",
            layout === "impact" && "text-center flex-col",
            layout === "modern" && "items-start"
          )}
        >
          {/* Logo/Company Name Section */}
          <div
            className={cn(
              layout === "classic" && "order-1",
              layout === "modern" && "space-y-2"
            )}
          >
            {logo ? (
              <img
                src={logo}
                alt="Business logo"
                className={cn(
                  "w-auto object-contain mb-4",
                  layout === "impact" ? "mx-auto h-24" : "h-20",
                  layout === "modern" && "rounded-lg"
                )}
              />
            ) : (
              <h2
                className={cn(
                  "font-bold text-gray-800",
                  layout === "impact" ? "text-3xl" : "text-2xl",
                  layout === "modern" && "tracking-wide"
                )}
              >
                Auto Gig Shop
              </h2>
            )}
          </div>

          {/* Invoice Header Info */}
          <div
            className={cn(
              "space-y-2",
              layout === "classic" && "text-right md:w-1/3",
              layout === "modern" && "mt-4 md:mt-0",
              layout === "minimal" && "hidden"
            )}
          >
            <div
              className={cn(
                "font-bold text-primary-600",
                layout === "impact" ? "text-3xl" : "text-2xl",
                layout === "modern" && "text-xl"
              )}
            >
              INVOICE
            </div>
            <div className="space-y-1 text-sm text-gray-500">
              {templateData.headerFields.poNumber && (
                <div
                  className={cn(
                    "flex items-center gap-2",
                    layout === "classic" ? "justify-end" : "justify-center"
                  )}
                >
                  <span>PO Number:</span>
                  <span>#1234</span>
                </div>
              )}
              {templateData.headerFields.Date && (
                <div
                  className={cn(
                    layout === "modern" ? "text-gray-700" : "text-gray-500"
                  )}
                >
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client Info - Layout Variations */}
      <div
        className={cn(
          "grid gap-6 mb-8",
          layout === "classic" ? "md:grid-cols-3" : "md:grid-cols-2",
          layout === "minimal" && "grid-cols-1"
        )}
      >
        {/* Billing Address */}
        <div
          className={cn(
            "p-4 rounded-lg",
            layout === "modern" ? "bg-white border" : "bg-gray-50"
          )}
        >
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Bill To
          </h3>
          {templateData.customerFields.customerName && (
            <div className="font-medium text-gray-900">Customer Name</div>
          )}
          {templateData.customerFields.billingAddress && (
            <div className="text-sm text-gray-600 space-y-1">
              <div>123 Business Road</div>
              <div>San Francisco, CA 94107</div>
              {templateData.customerFields.accountNumber && (
                <div className="mt-2">
                  <span className="font-medium">Account #:</span> 123-45678
                </div>
              )}
            </div>
          )}
          <div className="pt-2 space-y-1">
            {templateData.customerFields.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                customer@email.com
              </div>
            )}
            {templateData.customerFields.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                (123) 456-7890
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        {templateData.customerFields.shippingAddress && (
          <div
            className={cn(
              "p-4 rounded-lg",
              layout === "modern" ? "bg-white border" : "bg-gray-50",
              layout === "classic" && "md:col-span-2"
            )}
          >
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Ship To
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Customer Name</div>
              <div>PO Box 1234</div>
              <div>San Jose, CA 95054</div>
            </div>
          </div>
        )}
      </div>

      {/* Items Table - Layout Variations */}
      <div
        className={cn(
          "overflow-x-auto pb-2",
          layout === "modern" && "border rounded-lg"
        )}
      >
        <table className="w-full">
          <thead
            className={cn("bg-gray-50", layout === "modern" && "border-b")}
          >
            <tr>
              {templateData.itemFields.date && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
              )}
              {templateData.itemFields.itemName && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Item
                </th>
              )}
              {templateData.itemFields.type && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Type
                </th>
              )}
              {templateData.itemFields.quantity && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
              )}
              {templateData.itemFields.price && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              )}
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y divide-gray-200",
              layout === "modern" && "divide-gray-100"
            )}
          >
            {[1, 2].map((item) => (
              <tr key={item} className="hover:bg-gray-50 transition-colors">
                {templateData.itemFields.date && (
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    2024-03-{item.toString().padStart(2, "0")}
                  </td>
                )}
                {templateData.itemFields.itemName && (
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      Service {item}
                    </div>
                    {templateData.itemFields.description && (
                      <div className="mt-1 text-sm text-gray-500">
                        Item description details
                      </div>
                    )}
                  </td>
                )}
                {templateData.itemFields.type && (
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    Service
                  </td>
                )}
                {templateData.itemFields.quantity && (
                  <td className="px-4 py-3 text-right text-sm text-gray-900">
                    2
                  </td>
                )}
                {templateData.itemFields.price && (
                  <td className="px-4 py-3 text-right text-sm text-gray-900">
                    $500.00
                  </td>
                )}
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  $1,000.00
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section - Layout Variations */}
      <div
        className={cn(
          "mt-8 p-4 rounded-lg",
          layout === "impact" && "bg-gray-50",
          layout === "modern" && "border-t"
        )}
      >
        <div className="max-w-xs ml-auto space-y-3">
          {templateData.calculationFields.subtotal && (
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">$2,000.00</span>
            </div>
          )}
          {templateData.calculationFields.tax && (
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="text-gray-900">$200.00</span>
            </div>
          )}
          {templateData.calculationFields.discount && (
            <div className="flex justify-between font-semibold text-sm text-gray-600">
              <span className="text-gray-600">Discount:</span>
              <span className="text-gray-900">$50.00</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold">
            <span className="text-gray-900">Total:</span>
            <span className="text-primary-600">$2,150.00</span>
          </div>
          {templateData.calculationFields.dueAmount && (
            <div className="flex justify-between text-sm font-medium text-red-600">
              <span>Due Amount:</span>
              <span>$2,150.00</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="mt-8 p-6 rounded-lg"
        style={{
          backgroundColor: color,
          color: getContrastingTextColor(color),
        }}
      >
        <div className="text-sm space-y-2">
          {templateData.footerNote || (
            <>
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <a
                  href="https://payment.example.com"
                  className="underline hover:opacity-80"
                >
                  https://payment.example.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Terms: Due on Receipt</span>
              </div>
              <div className="pt-2 font-medium">
                Thank you for your business! 💙
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getContrastingTextColor(hexColor: string) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}
