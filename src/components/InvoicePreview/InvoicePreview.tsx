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
    <div className="bg-white rounded-lg shadow-sm p-8">
      {/* Header Section */}
      <div
        className={`${
          layout === "impact" ? "text-center" : "flex justify-between"
        } mb-8`}
      >
        <div className={layout === "impact" ? "space-y-4" : ""}>
          {logo ? (
            <img
              src={logo}
              alt="Business logo"
              className={`${
                layout === "impact" ? "mx-auto h-20" : "h-16"
              } object-contain`}
            />
          ) : (
            <h2
              className={`${
                layout === "impact" ? "text-2xl" : "text-xl"
              } font-bold`}
            >
              Auto Gig Shop
            </h2>
          )}

          {layout !== "minimal" && (
            <div
              className={`${layout === "impact" ? "space-y-2" : "text-right"}`}
            >
              <div className="text-lg font-semibold">INVOICE</div>
              <div className="text-sm text-gray-500">
                {templateData.headerFields.poNumber && <>PO #1234 &bull; </>}#
                {templateData.headerFields.salesRep && <>SR-2024 &bull; </>}1
              </div>
              {templateData.headerFields.Date && (
                <div className="text-sm text-gray-500">Jan 24, 2025</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div
        className={`grid ${
          layout === "minimal" ? "grid-cols-1" : "grid-cols-2"
        } gap-8 mb-8 text-sm`}
      >
        <div className="space-y-2">
          {templateData.customerFields.customerName && (
            <div className="font-medium text-gray-700">Bill to</div>
          )}
          {templateData.customerFields.billingAddress && (
            <div className="space-y-1">
              {templateData.customerFields.customerName && (
                <div className="font-medium">Customer Company</div>
              )}
              <div>123 Business Rd</div>
              <div>San Francisco, CA 94107</div>
              {templateData.customerFields.accountNumber && (
                <div className="pt-2">
                  <span className="text-gray-500">Account #:</span> 123-45678
                </div>
              )}
            </div>
          )}
          <div className="pt-2">
            {templateData.customerFields.email && (
              <div>✉️ customer@email.com</div>
            )}
            {templateData.customerFields.phone && <div>📞 (123) 456-7890</div>}
          </div>
        </div>

        {templateData.customerFields.shippingAddress && (
          <div className="space-y-2">
            <div className="font-medium text-gray-700">Ship to</div>
            <div className="space-y-1">
              <div>Customer Name</div>
              <div>PO Box 1234</div>
              <div>San Jose, CA 95054</div>
            </div>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead
            className={`text-left ${
              layout === "minimal" ? "border-b" : "bg-gray-50"
            }`}
          >
            <tr>
              {templateData.itemFields.date && (
                <th className="p-2 text-sm font-medium">Date</th>
              )}
              {templateData.itemFields.itemName && (
                <th className="p-2 text-sm font-medium">Item</th>
              )}
              {templateData.itemFields.type && (
                <th className="p-2 text-sm font-medium">Type</th>
              )}
              {templateData.itemFields.quantity && (
                <th className="p-2 text-sm font-medium text-right">Qty</th>
              )}
              {templateData.itemFields.price && (
                <th className="p-2 text-sm font-medium text-right">Price</th>
              )}
              <th className="p-2 text-sm font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((item) => (
              <tr key={item} className="border-b last:border-b-0">
                {templateData.itemFields.date && (
                  <td className="p-2 text-sm">
                    2024-03-{item.toString().padStart(2, "0")}
                  </td>
                )}
                {templateData.itemFields.itemName && (
                  <td className="p-2">
                    <div className="font-medium">Service {item}</div>
                    {templateData.itemFields.description && (
                      <div className="text-sm text-gray-600 mt-1">
                        Item description details
                      </div>
                    )}
                  </td>
                )}
                {templateData.itemFields.type && (
                  <td className="p-2 text-sm">Service</td>
                )}
                {templateData.itemFields.quantity && (
                  <td className="p-2 text-right">2</td>
                )}
                {templateData.itemFields.price && (
                  <td className="p-2 text-right">$500.00</td>
                )}
                <td className="p-2 text-right font-medium">$1,000.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div
        className={`${layout === "impact" ? "bg-gray-50 p-4 rounded-lg" : ""}`}
      >
        <div className="grid grid-cols-2 gap-4 max-w-xs ml-auto">
          {templateData.calculationFields.subtotal && (
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>$2,000.00</span>
            </div>
          )}
          {templateData.calculationFields.tax && (
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span>$200.00</span>
            </div>
          )}
          {templateData.calculationFields.discount && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-$50.00</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-bold">
            <span>Total:</span>
            <span>$2,150.00</span>
          </div>
          {templateData.calculationFields.dueAmount && (
            <div className="flex justify-between text-red-600">
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
        <div className="text-sm">
          {templateData.footerNote || (
            <>
              <div className="mb-2">
                Payment Link: <u>https://payment.example.com</u>
              </div>
              <div className="mb-2">Terms: Due on Receipt</div>
              <div>Thank you for your business!</div>
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
