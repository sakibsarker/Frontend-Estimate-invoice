import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Search,
  MoreVertical,
  Printer,
  User,
  X,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetInvoiceStatisticsQuery,
  useGetInvoiceQuery,
} from "@/features/server/invoiceSlice";

const getInvoiceStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "DRAFT":
      return "bg-gray-300";
    case "SENT":
      return "bg-purple-500";
    case "PAID":
      return "bg-blue-500";
    case "UNPAID":
      return "bg-green-500";
    case "OVERDUE":
      return "bg-red-500";
    case "CANCELLED":
      return "bg-gray-700";
    default:
      return "bg-gray-500";
  }
};

export default function ManualInvoiceDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { data: stats, isLoading, error } = useGetInvoiceStatisticsQuery();
  const navigate = useNavigate();

  // Static sample data
  const staticEstimates = [
    {
      id: 1,
      invoice_status: "PAID",
      invoice_number: "INV-234",
      created_at: "2024-03-15",
      total: 343,
      amount_due: 345,
      payment_method: "CARD",
    },
    {
      id: 2,
      invoice_status: "UNPAID",
      invoice_number: "INV-124",
      created_at: "2024-03-16",
      total: 34,
      amount_due: 3434,
      payment_method: "ONLIN",
    },
  ];

  return (
    <div className="min-h-screen bg-[#B8E1E9]">
      {/* Top Navigation */}
      <div className="flex items-center gap-2 p-4 bg-[#B8E1E9]">
        <Button variant="ghost" className="text-gray-700 hover:bg-blue-100">
          <Home className="h-6 w-6" />
          <span className="ml-2">Back to Home</span>
        </Button>

        {/* Language Selector */}
        <div className="ml-auto flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[150px] bg-[#1a237e] text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="es">🇪🇸 Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Header Stats */}

      <div className="bg-[#E8F4F7] p-6 rounded-lg mx-4">
        <div className="text-2xl font-bold mb-4">Invoice </div>
        {isLoading ? (
          <div>Wait Loading Invoice...</div>
        ) : error ? (
          <div className="text-red-500">Error loading statistics</div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-gray-600">
                Total Invoice Created: {stats.total_invoices}
              </div>
              <div className="text-gray-600">
                Total Invoice Value: ${stats.total_amount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-600">
                Total Paid: ${stats.total_paid.toLocaleString()}
              </div>
              <div className="text-gray-600">
                Total Unpaid: ${stats.total_unpaid.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-600">
                Draft Invoices: {stats.total_draft}
              </div>
              <div className="text-gray-600">
                Pending Invoices:: {stats.total_pending}
              </div>
              <div className="text-gray-600">
                Amount Due: ${stats.total_amount_due.toLocaleString()}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4">
        <div className="w-[200px]">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">This Week</SelectItem>
              <SelectItem value="30d">This Month</SelectItem>
              <SelectItem value="180d">Last Six Months</SelectItem>
              <SelectItem value="custom">Specific Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select>
          <SelectTrigger className="w-[200px] bg-[#1a237e] text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search estimates..."
            className="w-full"
          />
        </div>

        <Button className="bg-[#1a237e]">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>

        <Button variant="secondary" className="bg-[#1a237e] text-white">
          Clear Filter
          <X className="h-4 w-4 ml-2" />
        </Button>

        <Button
          onClick={() => navigate("/invoice/new")}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Create Invoice
        </Button>
      </div>

      {/* invoice List */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {staticEstimates.map((estimate) => (
            <div
              key={estimate.id}
              className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={getInvoiceStatusColor(estimate.invoice_status)}
                    >
                      {estimate.invoice_status}
                    </Badge>
                    <span className="text-blue-600">
                      (#{estimate.id}) {estimate.invoice_number}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-sm text-gray-800 font-normal mb-2">
                    Created: {estimate.created_at}
                  </div>
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    <span>{estimate.payment_method}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 mt-1">
                    <User className="h-5 w-5" />
                    <span>{estimate.username}</span>
                  </div> */}
                  <div className="flex justify-end flex-col items-end">
                    <div
                      className={`font-semibold ${
                        estimate.invoice_status === "PAID"
                          ? "text-green-600"
                          : estimate.invoice_status === "UNPAID"
                          ? "text-red-600"
                          : estimate.invoice_status === "OVERDUE"
                          ? "text-red-600"
                          : estimate.invoice_status === "DRAFT"
                          ? "text-gray-500"
                          : estimate.invoice_status === "SENT"
                          ? "text-purple-600"
                          : "text-gray-600"
                      }`}
                    >
                      Total ${estimate.total}
                    </div>
                    <div
                      className={`font-semibold ${
                        estimate.invoice_status === "PAID"
                          ? "text-green-600"
                          : estimate.invoice_status === "UNPAID"
                          ? "text-red-600"
                          : estimate.invoice_status === "OVERDUE"
                          ? "text-red-600"
                          : estimate.invoice_status === "DRAFT"
                          ? "text-gray-500"
                          : estimate.invoice_status === "SENT"
                          ? "text-purple-600"
                          : "text-gray-600"
                      }`}
                    >
                      Due ${estimate.amount_due}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious aria-disabled={true} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext aria-disabled={true} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
