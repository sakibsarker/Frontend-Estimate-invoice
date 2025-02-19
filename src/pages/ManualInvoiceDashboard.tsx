import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Search,
  MoreVertical,
  Printer,
  User,
  X,
  Car,
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
import { useGetInvoiceStatisticsQuery } from "@/features/server/invoiceSlice";

const getRepairStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-blue-500";
    case "UNPAID":
      return "bg-green-500";
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
      repair_status: "PAID",
      repair_details: "Brake system repair",
      created_at: "2024-03-15",
      repair_date: "2024-03-20",
      vehicle_name: "Toyota Camry",
      username: "John Doe",
      status: "PAID",
    },
    {
      id: 2,
      repair_status: "UNPAID",
      repair_details: "Engine maintenance",
      created_at: "2024-03-16",
      repair_date: "2024-03-21",
      vehicle_name: "Honda Civic",
      username: "Jane Smith",
      status: "UNPAID",
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
            </SelectContent>
          </Select>
        </div>

        <Select>
          <SelectTrigger className="w-[200px] bg-[#1a237e] text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
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

        <Button className="bg-orange-500 hover:bg-orange-600">
          Create Invoice
        </Button>
      </div>

      {/* Estimates List */}
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
                      className={getRepairStatusColor(estimate.repair_status)}
                    >
                      {estimate.repair_status}
                    </Badge>
                    <span className="text-blue-600">
                      (#{estimate.id}) {estimate.repair_details}
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
                    <br />
                    Repair Date: {estimate.repair_date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    <span>{estimate.vehicle_name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-5 w-5" />
                    <span>{estimate.username}</span>
                  </div>
                  <div className="flex justify-end flex-col items-end">
                    <div
                      className={`font-semibold ${
                        estimate.status === "PAID"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Total $1,250.00
                    </div>
                    <div
                      className={`font-semibold ${
                        estimate.status === "PAID"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Due $1,250.00
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
