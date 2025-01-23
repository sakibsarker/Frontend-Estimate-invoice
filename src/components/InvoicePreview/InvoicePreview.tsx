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
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          {logo ? (
            <img
              src={logo || "/placeholder.svg"}
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
          <div>
            <span className="text-gray-500 mr-4">Terms</span>
            <span>Due on receipt</span>
          </div>
          <div>
            <span className="text-gray-500 mr-4">Due date</span>
            <span>Jan 24, 2025</span>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="flex justify-between mb-8 text-sm">
        <div>
          <div className="text-gray-500 mb-1">Bill to</div>
          <div>Customer company</div>
          <div>customer@email.com</div>
          <div>123-456-7890</div>
        </div>
        <div className="text-right">
          <div className="text-gray-500 mb-1">Ship to</div>
          <div>PO Box 1234</div>
          <div>San Jose, CA 95054</div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead className="text-left border-b">
          <tr>
            <th className="py-2">Item name</th>
            <th className="py-2 text-right">Quantity</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2">
              Labor
              <br />
              <span className="text-sm text-gray-500">Service hours</span>
            </td>
            <td className="py-2 text-right">1</td>
            <td className="py-2 text-right">$1000.00</td>
            <td className="py-2 text-right">$1000.00</td>
          </tr>
          <tr>
            <td className="py-2">
              Materials
              <br />
              <span className="text-sm text-gray-500">
                (to be shipped to site)
              </span>
            </td>
            <td className="py-2 text-right">5</td>
            <td className="py-2 text-right">$50.00</td>
            <td className="py-2 text-right">$250.00</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div className="space-y-2 text-sm">
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

      {/* Footer */}
      <div className="mt-8 text-sm text-gray-600">
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
