import { Mail, Phone, Link, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewProps {
  // Template configuration
  logo: string | null;
  color: string;
  layout: string;
  templateData: {
    customerName: boolean;
    billingAddress: boolean;
    shippingAddress: boolean;
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
  customerName: string;
  billingAddress: string;
  shippingAddress: string;
  accountNumber: string;
  email: string;
  phone: string;
  poNumber: string;
  salesRep: string;
  createdAt: string;
  items: Array<{
    date: string;
    name: string;
    type: string;
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  dueAmount: number;
}

// Combined props for the component
export function SendInvoicePreview(props: PreviewProps & InvoiceDataProps) {
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

              {/* Add print button to the right side */}
              <div className="flex items-center gap-2">
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
                      "font-bold text-primary-600",
                      props.layout === "impact" ? "text-3xl" : "text-2xl",
                      props.layout === "modern" && "text-xl"
                    )}
                  >
                    INVOICE
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    {props.templateData.customerName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer Name:</span>
                        <span className="text-gray-900">
                          {props.customerName}
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
                        {new Date(props.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                    {props.templateData.poNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">PO Number:</span>
                        <span className="text-gray-900">{props.poNumber}</span>
                      </div>
                    )}
                    {props.templateData.salesRep && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sales Rep:</span>
                        <span className="text-gray-900">{props.salesRep}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Info - Layout Variations */}
        <div className="page-break-after-avoid">
          <div
            className={cn(
              "grid gap-6 mb-8",
              props.layout === "classic" ? "md:grid-cols-3" : "md:grid-cols-2",
              props.layout === "minimal" && "grid-cols-1"
            )}
          >
            {/* Billing Address */}
            <div
              className={cn(
                "p-4 rounded-lg",
                props.layout === "modern" ? "bg-white border" : "bg-gray-50"
              )}
            >
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Bill To
              </h3>
              {props.templateData.billingAddress && (
                <div className="text-sm text-gray-600 space-y-1">
                  {props.billingAddress.split(", ").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                  {props.templateData.accountNumber && (
                    <div className="mt-2">
                      <span className="font-medium">Account #:</span>{" "}
                      {props.accountNumber}
                    </div>
                  )}
                </div>
              )}
              <div className="pt-2 space-y-1">
                {props.templateData.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {props.email}
                  </div>
                )}
                {props.templateData.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {props.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {props.templateData.shippingAddress && (
              <div
                className={cn(
                  "p-4 rounded-lg",
                  props.layout === "modern" ? "bg-white border" : "bg-gray-50",
                  props.layout === "classic" && "md:col-span-2"
                )}
              >
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Ship To
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {/* Customer Name */}
                  <div>{props.customerName}</div>

                  {/* Split shipping address into lines */}
                  {props.shippingAddress.split(", ").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )}
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
                      Date
                    </th>
                  )}
                  {props.templateData.itemName && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                  )}
                  {props.templateData.type && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Type
                    </th>
                  )}
                  {props.templateData.quantity && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                  )}
                  {props.templateData.price && (
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
                  props.layout === "modern" && "divide-gray-100"
                )}
              >
                {props.items.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {props.templateData.Date && (
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {item.date}
                      </td>
                    )}
                    {props.templateData.itemName && (
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        {props.templateData.description && (
                          <div className="mt-1 text-sm text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </td>
                    )}
                    {props.templateData.type && (
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {item.type}
                      </td>
                    )}
                    {props.templateData.quantity && (
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {item.quantity}
                      </td>
                    )}
                    {props.templateData.price && (
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        ${item.price.toFixed(2)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${item.total.toFixed(2)}
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
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">
                    ${props.subtotal.toFixed(2)}
                  </span>
                </div>
              )}
              {props.templateData.tax && (
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="text-gray-900">${props.tax.toFixed(2)}</span>
                </div>
              )}
              {props.templateData.discount && (
                <div className="flex justify-between font-semibold text-sm text-gray-600">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-gray-900">
                    ${props.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary-600">
                  ${props.total.toFixed(2)}
                </span>
              </div>
              {props.templateData.dueAmount && (
                <div className="flex justify-between text-sm font-medium text-red-600">
                  <span>Due Amount:</span>
                  <span>${props.dueAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="page-break-before-auto">
          <div
            className="mt-8 p-6 rounded-lg"
            style={{
              backgroundColor: props.color,
              color: getContrastingTextColor(props.color),
            }}
          >
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
                Thank you for your business! 💙
              </div>
            </div>
          </div>
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
