import { Separator } from "@/components/ui/separator";

export default function InvoicePreview() {
  return (
    <div className="mx-auto max-w-[800px] min-h-[800px] rounded-lg border bg-white p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Auto Gig Shop</h1>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-8">
        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-600">Invoice</div>
            <div>001</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-600">Date</div>
            <div>Jan 7, 2025</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-600">Due date</div>
            <div>Jan 7, 2025</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">Invoice</div>
          <div className="mt-1 text-sm text-gray-600">9830 Clay Rd</div>
          <div className="text-sm text-gray-600">Houston, TX 77041</div>
          <div className="text-sm text-gray-600">(832) 974-0901</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600">Bill to</div>
        <div>Jose</div>
        <div className="text-sm text-gray-600">8329740901</div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 text-sm font-medium">Quantity</th>
            <th className="py-2 text-sm font-medium">Price</th>
            <th className="py-2 text-right text-sm font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2">1</td>
            <td className="py-2">$100.00</td>
            <td className="py-2 text-right">$100.00 T</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8 space-y-2">
        <div className="flex justify-between">
          <div>Subtotal</div>
          <div>$100.00</div>
        </div>
        <div className="flex justify-between">
          <div>Tax (6%)</div>
          <div>$6.00</div>
        </div>
        <div className="flex justify-between">
          <div>Total</div>
          <div>$106.00</div>
        </div>
        <div className="flex justify-between">
          <div>Paid</div>
          <div>$0.00</div>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <div>Amount due</div>
          <div>$106.00</div>
        </div>
      </div>
    </div>
  );
}
