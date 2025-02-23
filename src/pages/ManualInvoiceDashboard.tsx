import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Search,
  MoreVertical,
  Printer,
  // User,
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
  useDeleteInvoiceMutation,
} from "@/features/server/invoiceSlice";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const { data: stats, isLoading, error } = useGetInvoiceStatisticsQuery();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  //  useEffect to initialize language from localStorage

  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng") || "en";
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  // useEffect to handle date calculations
  useEffect(() => {
    const today = new Date();
    const newEndDate = today.toISOString().split("T")[0];

    switch (timeframe) {
      case "7d":
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        setStartDate(lastWeek.toISOString().split("T")[0]);
        setEndDate(newEndDate);
        break;

      case "30d":
        const lastMonth = new Date(today);
        lastMonth.setDate(today.getDate() - 30);
        setStartDate(lastMonth.toISOString().split("T")[0]);
        setEndDate(newEndDate);
        break;

      case "180d":
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        setStartDate(sixMonthsAgo.toISOString().split("T")[0]);
        setEndDate(newEndDate);
        break;

      case "custom":
        // Reset dates when custom is selected
        setStartDate("");
        setEndDate("");
        break;

      default:
        setStartDate("");
        setEndDate("");
    }

    // Reset to first page when timeframe changes
    setCurrentPage(1);
  }, [timeframe]);

  const {
    data: invoicesData,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch,
  } = useGetInvoiceQuery({
    page: currentPage,
    invoice_status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: searchTerm,
    start_date: startDate,
    end_date: endDate,
  });

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-[#B8E1E9]">
        {/* Top Navigation */}
        <div className="flex items-center gap-2 p-4 bg-[#B8E1E9]">
          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-blue-100"
            onClick={() => navigate("/home")}
          >
            <Home className="h-6 w-6" />
            <span className="ml-2">Back to Home</span>
          </Button>

          {/* Language Selector */}
          <div className="ml-auto flex items-center gap-2">
            <Select
              value={i18n.language}
              onValueChange={(lng: string) => {
                i18n.changeLanguage(lng);
                localStorage.setItem("i18nextLng", lng); // Optional: Save preference
              }}
            >
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
          <div className="text-2xl font-bold mb-4"> {t("invoice")} </div>
          {isLoading ? (
            <div>Wait Loading Invoice...</div>
          ) : error ? (
            <div className="text-red-500">Error loading statistics</div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-gray-600">
                  {t("totalInvoiceCreated")}: {stats.total_invoices}
                </div>
                <div className="text-gray-600">
                  {t("totalInvoiceValue")}: $
                  {stats.total_amount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600">
                  {t("totalPaid")}: ${stats.total_paid.toLocaleString()}
                </div>
                <div className="text-gray-600">
                  {t("totalUnpaid")}: ${stats.total_unpaid.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600">
                  {t("draftInvoices")}: {stats.total_draft}
                </div>
                <div className="text-gray-600">
                  {t("pendingInvoices")}: {stats.total_pending}
                </div>
                <div className="text-gray-600">
                  {t("amountDue")}: ${stats.total_amount_due.toLocaleString()}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-4">
            <div className="w-[200px]">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">This Week</SelectItem>
                  <SelectItem value="30d">This Month</SelectItem>
                  <SelectItem value="180d">Last Six Months</SelectItem>
                  <SelectItem value="custom">Specific Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timeframe === "custom" && (
              <div className="flex items-center gap-2 ml-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                  className="w-[160px]"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-[160px]"
                />
              </div>
            )}
          </div>

          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value);
              setCurrentPage(1); // Reset to first page when changing status
            }}
          >
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
              placeholder="Search invoices..."
              className="w-full"
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(tempSearchTerm);
                  setCurrentPage(1);
                }
              }}
            />
          </div>
          <Button
            className="bg-[#1a237e]"
            onClick={() => {
              setSearchTerm(tempSearchTerm);
              setCurrentPage(1);
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            className="bg-[#1a237e] "
            onClick={() => {
              setSelectedStatus("all");
              setSearchTerm("");
              setTempSearchTerm("");
              setTimeframe(""); // Add this
              setStartDate(""); // Add this
              setEndDate(new Date().toISOString().split("T")[0]); // Reset to today
              setCurrentPage(1);
            }}
          >
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
          {invoicesLoading ? (
            <div>Loading invoices...</div>
          ) : invoicesError ? (
            <div className="text-red-500">Error loading invoices</div>
          ) : invoicesData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {invoicesData.results.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1"
                        onClick={() => navigate(`/invoice/${invoice.id}/edit`)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={getInvoiceStatusColor(
                              invoice.invoice_status
                            )}
                          >
                            {invoice.invoice_status}
                          </Badge>
                          <span className="text-blue-600">
                            {invoice.invoice_number}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async (e) => {
                                  e.stopPropagation(); // Prevent card click event
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this invoice?"
                                    )
                                  ) {
                                    try {
                                      await deleteInvoice(invoice.id).unwrap();
                                      toast.success(
                                        `Invoice ${invoice.id}  deleted successfully`
                                      );
                                      // Optional: Refetch invoices after deletion
                                      refetch();
                                    } catch (error) {
                                      toast.error("Failed to delete invoice");
                                    }
                                  }
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="text-sm text-gray-800 font-normal mb-2">
                          Created:{" "}
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Landmark className="h-5 w-5" />
                          <span>
                            {invoice.payment_method.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex justify-end flex-col items-end mt-2">
                          <div
                            className={`font-semibold ${
                              invoice.invoice_status === "PAID"
                                ? "text-green-600"
                                : invoice.invoice_status === "UNPAID"
                                ? "text-red-600"
                                : invoice.invoice_status === "OVERDUE"
                                ? "text-orange-600"
                                : "text-gray-600"
                            }`}
                          >
                            Total: ${parseFloat(invoice.total).toFixed(2)}
                          </div>
                          <div
                            className={`font-semibold ${
                              invoice.invoice_status === "PAID"
                                ? "text-green-600"
                                : invoice.invoice_status === "UNPAID"
                                ? "text-red-600"
                                : invoice.invoice_status === "OVERDUE"
                                ? "text-orange-600"
                                : "text-gray-600"
                            }`}
                          >
                            Due: ${parseFloat(invoice.amount_due).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/invoice/${invoice.id}/send`)
                          }
                        >
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
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        aria-disabled={!invoicesData?.next}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
