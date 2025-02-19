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
      {/* Header - Layout Variations */}
      {layout === "impact" ? (
        <div className="text-center mb-8 space-y-4">
          {logo ? (
            <img
              src={logo}
              alt="Business logo"
              className="mx-auto h-20 object-contain"
            />
          ) : (
            <h2 className="text-2xl font-bold">Auto Gig Shop</h2>
          )}
          <div className="space-y-2">
            <div className="text-xl font-semibold">INVOICE</div>
            <div className="text-sm text-gray-500">#1 | Jan 24, 2025</div>
          </div>
        </div>
      ) : layout === "classic" ? (
        <div className="flex justify-between mb-8 border-b pb-4">
          <div>
            {logo ? (
              <img
                src={logo}
                alt="Business logo"
                className="h-16 object-contain"
              />
            ) : (
              <h2 className="text-xl font-bold">Auto Gig Shop</h2>
            )}
          </div>
          <div className="text-right space-y-1 text-sm">
            <div className="text-lg font-semibold">INVOICE</div>
            <div>#1</div>
            <div>Jan 24, 2025</div>
          </div>
        </div>
      ) : layout === "minimal" ? (
        <div className="mb-8 space-y-2">
          {logo && (
            <img
              src={logo}
              alt="Business logo"
              className="h-12 object-contain mb-4"
            />
          )}
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Invoice #1</div>
            <div className="text-sm text-gray-500">Jan 24, 2025</div>
          </div>
        </div>
      ) : (
        // Modern (default) layout
        <div className="flex justify-between mb-8">
          <div>
            {logo ? (
              <img
                src={logo}
                alt="Business logo"
                className="h-16 object-contain"
              />
            ) : (
              <h2 className="text-xl font-bold">Auto Gig Shop</h2>
            )}
          </div>
          <div className="text-right space-y-1 text-sm">
            <div>
              <span className="text-gray-500 mr-4">Invoice</span>
              <span>1</span>
            </div>
            <div>
              <span className="text-gray-500 mr-4">Date</span>
              <span>Jan 24, 2025</span>
            </div>
          </div>
        </div>
      )}

      {/* Addresses - Layout Variations */}
      <div
        className={`mb-8 text-sm ${
          layout === "impact"
            ? "space-y-4 text-center"
            : layout === "minimal"
            ? "space-y-2"
            : "flex justify-between"
        }`}
      >
        <div className={layout === "impact" ? "space-y-1" : ""}>
          <div className="text-gray-500 mb-1">Bill to</div>
          <div>Customer company</div>
          <div>customer@email.com</div>
          <div>123-456-7890</div>
        </div>

        {layout !== "minimal" && (
          <div className={layout === "impact" ? "space-y-1" : "text-right"}>
            <div className="text-gray-500 mb-1">Ship to</div>
            <div>PO Box 1234</div>
            <div>San Jose, CA 95054</div>
          </div>
        )}
      </div>

      {/* Items Table - Layout Variations */}
      <table
        className={`w-full mb-8 ${
          layout === "modern"
            ? "border"
            : layout === "minimal"
            ? "border-t border-b"
            : ""
        }`}
      >
        <thead
          className={`text-left ${
            layout === "minimal"
              ? "border-b"
              : layout === "impact"
              ? "bg-gray-50"
              : ""
          }`}
        >
          <tr>
            <th className="py-2">Item name</th>
            {layout !== "minimal" && (
              <th className="py-2 text-right">Quantity</th>
            )}
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Table rows with conditional styling */}
          <tr className={layout === "impact" ? "border-b" : ""}>
            <td className="py-2">
              Labor
              {layout !== "minimal" && <br />}
              <span className="text-sm text-gray-500">
                {layout === "minimal" ? "Service hours" : "Labor description"}
              </span>
            </td>
            {layout !== "minimal" && <td className="py-2 text-right">1</td>}
            <td className="py-2 text-right">$1000.00</td>
            <td className="py-2 text-right">$1000.00</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>

      {/* Totals - Layout Variations */}
      <div
        className={`space-y-2 text-sm ${
          layout === "modern"
            ? "border-t pt-4"
            : layout === "impact"
            ? "bg-gray-50 p-4 rounded-lg"
            : ""
        }`}
      >
        <div className="flex justify-between">
          <span>Total</span>
          <span>$1,250.00</span>
        </div>
        <div className="flex justify-between">
          <span>Credit</span>
          <span>$50.00</span>
        </div>
        <div className="flex justify-between">
          <span>Paid</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between pt-2 border-t font-bold text-lg">
          <span>Amount due</span>
          <span>$1,550.00</span>
        </div>
      </div>

      {/* Footer - Consistent across layouts */}
      <div
        className="mt-8 p-4 rounded-b-lg"
        style={{
          backgroundColor: color,
          color: getContrastingTextColor(color),
        }}
      >
        <div className="mb-2">
          Use this link to pay online: https://link.com/example
        </div>
        <div className="mb-2">Notes</div>
        <div>Thank you for your business!</div>
        <div className="mt-2">
          If you have any questions or concerns about the invoice, please
          contact us at your earliest convenience. We value your business and
          appreciate your loyalty.
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
