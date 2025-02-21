import { Mail, Phone, Link, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoicePreviewProps {
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

export function InvoicePreview({
  logo,
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
              {templateData.customerName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Name:</span>
                  <span className="text-gray-900">Auto Gig Shop</span>
                </div>
              )}
              {templateData.Date && (
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
              {templateData.poNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">PO Number:</span>
                  <span className="text-gray-900">PO-123456</span>
                </div>
              )}
              {templateData.salesRep && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales Rep:</span>
                  <span className="text-gray-900">John Doe</span>
                </div>
              )}
            </div>
          </div>

          {/*Invoice Client Info  */}
          <div
            className={cn(
              "space-y-2",
              layout === "classic" ? "md:grid-cols-3" : "md:grid-cols-2",
              layout === "minimal" && "grid-cols-1"
            )}
          >
            <div
              className={cn(
                "font-bold text-primary-600",
                layout === "impact" ? "text-3xl" : "text-2xl",
                layout === "modern" && "text-xl"
              )}
            >
              Bill To
            </div>
            <div className="space-y-1 text-sm text-gray-500">
              {templateData.billingAddress && (
                <div className="text-sm text-gray-600 space-y-1">
                  <div>123 Business Road</div>
                  <div>San Francisco, CA 94107</div>
                  {templateData.accountNumber && (
                    <div className="mt-2">
                      <span className="font-medium">Account #:</span> 123-45678
                    </div>
                  )}
                </div>
              )}
              <div className="pt-2 space-y-1">
                {templateData.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    customer@email.com
                  </div>
                )}
                {templateData.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    (123) 456-7890
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
              {templateData.Date && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
              )}
              {templateData.itemName && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Item
                </th>
              )}
              {templateData.type && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Type
                </th>
              )}
              {templateData.quantity && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
              )}
              {templateData.price && (
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <tr key={item} className="hover:bg-gray-50 transition-colors">
                {templateData.Date && (
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    2024-03-{item.toString().padStart(2, "0")}
                  </td>
                )}
                {templateData.itemName && (
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      Service {item}
                    </div>
                    {templateData.description && (
                      <div className="mt-1 text-sm text-gray-500">
                        Item description details
                      </div>
                    )}
                  </td>
                )}
                {templateData.type && (
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    Service
                  </td>
                )}
                {templateData.quantity && (
                  <td className="px-4 py-3 text-right text-sm text-gray-900">
                    2
                  </td>
                )}
                {templateData.price && (
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
          {templateData.subtotal && (
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">$2,000.00</span>
            </div>
          )}
          {templateData.tax && (
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="text-gray-900">$200.00</span>
            </div>
          )}
          {templateData.discount && (
            <div className="flex justify-between font-semibold text-sm text-gray-600">
              <span className="text-gray-600">Discount:</span>
              <span className="text-gray-900">$50.00</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold">
            <span className="text-gray-900">Total:</span>
            <span className="text-primary-600">$2,150.00</span>
          </div>
          {templateData.dueAmount && (
            <div className="flex justify-between ">
              <span>Due Amount:</span>
              <span>$2,150.00</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-8 p-6">
        <div className="text-sm space-y-2">
          {templateData.customerName && (
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
          {templateData.customerName && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Terms: Due on Receipt</span>
            </div>
          )}
          <div className="pt-2 font-medium">Thank you for your business!</div>
        </div>
      </div>
    </div>
  );
}
