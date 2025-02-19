import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router";
import Loader from "@/components/Loader";

interface RepairRequest {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  repair_details: string;
  repair_status: string;
  previous_visits: number;
  status: string;
  vehicle_name: string;
  estimate_attachments: string;
  repair_date: string;
  sms_sent_3_days: boolean;
  sms_sent_7_days: boolean;
  created_at: string;
  updated_at: string;
}

interface StatisticRequest {
  total_requests: string;
  total_new_requests: string;
  total_expired_requests: string;
  accepted_percentage: string;
}

// Add these color mapping functions
const getRepairStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "NEW":
      return "bg-blue-500";
    case "VIEWED":
      return "bg-green-500";
    case "EXPIRED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getEstimateStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-500";
    case "ACCEPTED":
      return "bg-green-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function EstimateDashboard() {
  const [estimates, setEstimates] = useState<RepairRequest[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [timeframeFilter, setTimeframeFilter] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const queryParams = new URLSearchParams({
          search: searchTerm,
          status: statusFilter.toLowerCase(),
          timeframe: timeframeFilter,
          page: currentPage.toString(),
        });

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/estimate/repair-requests/statistics/?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch estimates");
        const responseData = await response.json();
        setEstimates(responseData.repair_requests);
        setTotalPages(responseData.total_pages || 1);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstimates();
  }, [currentPage, searchTerm, statusFilter, timeframeFilter]);

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
              <SelectItem value="en">
                <span className="flex items-center gap-2">🇺🇸 English</span>
              </SelectItem>
              <SelectItem value="es">
                <span className="flex items-center gap-2">🇪🇸 Español</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <Loader />
        </div>
      ) : (
        <>
          {/* Header Stats */}
          <div className="bg-[#E8F4F7] p-6 rounded-lg mx-4">
            <div className="text-2xl font-bold mb-4">Estimate</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-gray-600">Total Estimates Created: 32</div>
                <div className="text-gray-600">
                  Total Estimate Value: $12,312
                </div>
              </div>
              <div>
                <div className="text-gray-600">Approval Rates: 15%</div>
                <div className="text-gray-600">
                  Approved Estimates Value: $2,005
                </div>
              </div>
              <div>
                <div className="text-gray-600">Expired Estimates: 10</div>
                <div className="text-gray-600">New Estimates: 5</div>
              </div>
            </div>
            <div className="text-red-500 mt-4">
              Changes based on the time frame
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4 p-4">
            <div className="w-[200px]">
              <Select
                value={timeframeFilter}
                onValueChange={setTimeframeFilter}
              >
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px] bg-[#1a237e] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search estimates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Button className="bg-[#1a237e]">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>

            <Button
              variant="secondary"
              className="bg-[#1a237e] text-white"
              onClick={() => setSearchTerm("")}
            >
              Clear Filter
              <X className="h-4 w-4 ml-2" />
            </Button>

            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => navigate("/admin/estimate")}
            >
              Create Estimate
            </Button>
          </div>

          {/* Estimates List */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {estimates.map((estimate) => (
                <div
                  key={estimate.id}
                  className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/estimate/${estimate.id}/view`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={getRepairStatusColor(
                            estimate.repair_status
                          )}
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
                        Created:{" "}
                        {new Date(estimate.created_at).toLocaleDateString(
                          "en-CA",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                        <br />
                        Repair Date:{" "}
                        {new Date(estimate.repair_date).toLocaleDateString(
                          "en-CA",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        <span>{estimate.vehicle_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-5 w-5" />

                        <span>{estimate.username}</span>
                      </div>
                      <div className="flex justify-end">
                        <Badge
                          className={getEstimateStatusColor(estimate.status)}
                        >
                          {estimate.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">
                        {/* ${estimate.value.toFixed(2)} */}
                      </span>
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
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
