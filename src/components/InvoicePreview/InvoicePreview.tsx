import { Mail, Phone, Link, FileText } from "lucide-react";

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
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
      {/* Header Section */}
      <div
        className={`${
          layout === "impact"
            ? "text-center"
            : "flex flex-col md:flex-row justify-between"
        } mb-6 md:mb-8`}
      >
        <div
          className={`${
            layout === "impact" ? "space-y-4" : "order-1"
          } mb-6 md:mb-0`}
        >
          {logo ? (
            <img
              src={logo}
              alt="Business logo"
              className={`${
                layout === "impact" ? "mx-auto h-24" : "h-20"
              } w-auto object-contain mb-4`}
            />
          ) : (
            <h2
              className={`${
                layout === "impact" ? "text-3xl" : "text-2xl"
              } font-bold text-gray-800`}
            >
              Auto Gig Shop
            </h2>
          )}
        </div>

        {layout !== "minimal" && (
          <div
            className={`${
              layout === "impact" ? "space-y-2" : "text-right order-2"
            }`}
          >
            <div className="text-2xl font-bold text-primary-600 mb-2">
              INVOICE
            </div>
            <div className="space-y-1 text-sm text-gray-500">
              {templateData.headerFields.poNumber && (
                <div className="flex items-center justify-end gap-2">
                  <span className="font-medium">PO Number:</span>
                  <span>#1234</span>
                </div>
              )}
              {templateData.headerFields.salesRep && (
                <div className="flex items-center justify-end gap-2">
                  <span className="font-medium">Sales Rep:</span>
                  <span>SR-2024</span>
                </div>
              )}
              {templateData.headerFields.Date && (
                <div className="flex items-center justify-end gap-2">
                  <span className="font-medium">Date:</span>
                  <span>Jan 24, 2025</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Client & Company Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Bill To
          </h3>
          {templateData.customerFields.customerName && (
            <div className="font-medium text-gray-900">Customer Company</div>
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
              <div className="flex items-center gap-2 text-sm text-blue-600">
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

        {templateData.customerFields.shippingAddress && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
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

      {/* Items Table */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full">
          <thead className="bg-gray-50">
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
          <tbody className="divide-y divide-gray-200">
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

      {/* Totals Section */}
      <div
        className={`mt-8 ${
          layout === "impact" ? "bg-gray-50" : ""
        } p-4 rounded-lg`}
      >
        <div className="max-w-xs ml-auto space-y-3">
          {templateData.calculationFields.subtotal && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">$2,000.00</span>
            </div>
          )}
          {templateData.calculationFields.tax && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="text-gray-900">$200.00</span>
            </div>
          )}
          {templateData.calculationFields.discount && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Discount:</span>
              <span>-$50.00</span>
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
        className="mt-8 p-6 rounded-lg transition-colors duration-300"
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
