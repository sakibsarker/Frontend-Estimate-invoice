import { FiPrinter } from "react-icons/fi";

interface LineItem {
  description: string;
  rate: number;
  qty: number;
  amount: number;
  checked?: boolean;
}

export default function TemplateOne() {
  const lineItems: LineItem[] = [
    {
      description: "Condenser 3.5 ton",
      rate: 1746.0,
      qty: 1,
      amount: 1746.0,
      checked: true,
    },
    {
      description: "Condenser 2.5",
      rate: 1659.0,
      qty: 1,
      amount: 1659.0,
      checked: true,
    },
    { description: "Air Handler 4", rate: 1800.0, qty: 1, amount: 1800.0 },
    {
      description: "Air handler 2.5 ton",
      rate: 1549.0,
      qty: 1,
      amount: 1549.0,
    },
    { description: 'Ducts 10"', rate: 129.0, qty: 2, amount: 258.0 },
    { description: "AC labor", rate: 1763.0, qty: 1, amount: 1763.0 },
    { description: "Supply plenum", rate: 179.0, qty: 2, amount: 358.0 },
  ];

  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Button - Hidden when printing */}
      <div className="fixed top-4 right-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
        >
          <FiPrinter className="h-5 w-5" />
          <span>Print Invoice</span>
        </button>
      </div>

      {/* Invoice Template - Optimized for printing */}
      <div className="min-h-screen bg-gray-100 p-8 print:bg-white print:p-0">
        <div className="mx-auto max-w-4xl bg-white p-8 shadow-lg print:shadow-none">
          {/* Header Section */}
          <div className="flex justify-between mb-12">
            {/* Logo and Company Info */}
            <div className="flex space-x-6">
              <img
                src="/placeholder.svg"
                alt="Konpetan AC & Heating"
                className="h-24 w-24 object-contain"
              />
              <div className="space-y-1">
                <h1 className="text-xl font-semibold text-gray-900">
                  Konpetan AC & Heating
                </h1>
                <p className="text-gray-600">Schedeur Coris</p>
                <p className="text-gray-600">Business Number: 8327038647</p>
                <p className="text-gray-600">Fresno, Tx</p>
                <p className="text-gray-600">+18327038647</p>
                <p className="text-gray-600">konpetanacheating.com</p>
                <p className="text-gray-600">lejude12@gmail.com</p>
              </div>
            </div>

            {/* Estimate Details */}
            <div className="text-right space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">ESTIMATE</h2>
              <p className="text-gray-600">EST0224</p>
              <div className="mt-4">
                <p className="text-gray-600">DATE</p>
                <p className="font-medium">07/29/2023</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">TOTAL</p>
                <p className="font-medium">USD ${total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* To Section */}
          <div className="mb-8">
            <h3 className="text-gray-600 mb-4">TO</h3>
            <div className="space-y-2">
              <p className="text-gray-900">Name</p>
              <p className="text-gray-900">Phone</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600">DESCRIPTION</th>
                <th className="text-right py-2 text-gray-600">RATE</th>
                <th className="text-right py-2 text-gray-600">QTY</th>
                <th className="text-right py-2 text-gray-600">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3">
                    <div className="flex items-center">
                      {item.checked && (
                        <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {item.description}
                    </div>
                  </td>
                  <td className="text-right py-3">${item.rate.toFixed(2)}</td>
                  <td className="text-right py-3">{item.qty}</td>
                  <td className="text-right py-3">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right py-4 font-medium">
                  TOTAL
                </td>
                <td className="text-right py-4 font-medium">
                  USD ${total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="space-y-4 text-gray-600">
            <p>Please leave a rating/review on</p>
            <a
              href="https://www.hvaccontractorfresnotexas.com/"
              className="text-blue-600 hover:underline print:text-gray-600 print:no-underline"
            >
              https://www.hvaccontractorfresnotexas.com/
            </a>
            <p className="mt-4">
              This is a quote to install 1 2.5ton and 1 3.5ton unit R410A
              Lennox. 2 supply plenums and to run some ducts upstairs big room.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
