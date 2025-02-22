import { useState, useEffect } from "react";
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
import {
  useGetRepiarStatisticsQuery,
  useGetRepiarRequstQuery,
} from "@/features/server/repairRequestSlice";

export default function EstimateDashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { data, isLoading, error } = useGetRepiarStatisticsQuery();
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

  // Add this useEffect to handle date calculations
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
        setEndDate(newEndDate);
        break;

      default:
        setStartDate("");
        setEndDate(newEndDate);
    }

    // Reset to first page when timeframe changes
    setCurrentPage(1);
  }, [timeframe]);

  const {
    data: estimatesData,
    isLoading: estimatesLoading,
    error: estimatesError,
    refetch,
  } = useGetRepiarRequstQuery({
    page: currentPage,
    repair_status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: searchTerm,
    start_date: startDate,
    end_date: endDate,
  });

  // Color mapping functions kept for UI consistency
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

  return (
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

      <div className="bg-[#E8F4F7] p-6 rounded-lg mx-4">
        <div className="text-2xl font-bold mb-4">Estimate</div>
        {isLoading ? (
          <div>Wait statistics is showing...</div>
        ) : error ? (
          <div>Error loading statistics</div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-gray-600">
                Total Estimates Created: {data.total_requests}
              </div>
              <div className="text-gray-600">
                New Estimates: {data.total_new_requests}
              </div>
            </div>
            <div>
              <div className="text-gray-600">
                Expired Estimates: {data.total_expired_requests}
              </div>
              <div className="text-gray-600">
                Approval Rates: {data.accepted_percentage.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-gray-600">
                Accepted Percentage: {data.accepted_percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4">
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
          {/* // Add date inputs for custom selection */}
          {timeframe === "custom" && (
            <div className="flex gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          )}
        </div>

        <Select
          value={selectedStatus}
          onValueChange={(value) => {
            setSelectedStatus(value);
            setCurrentPage(1); // Reset to first page when changing filters
          }}
        >
          <SelectTrigger className="w-[200px] bg-[#1a237e] text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="VIEWED">Viewed</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search estimates..."
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
          variant="secondary"
          className="bg-[#1a237e] text-white"
          onClick={() => {
            setSelectedStatus("all");
            setSearchTerm("");
            setTempSearchTerm("");
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
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => navigate("/admin/estimate")}
        >
          Create Estimate
        </Button>
      </div>

      {/* Estimates List */}
      <div className="p-4">
        {estimatesLoading ? (
          <div>Loading estimates...</div>
        ) : estimatesError ? (
          <div>Error loading estimates</div>
        ) : estimatesData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {estimatesData.results.map((estimate) => (
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
                          "en-CA"
                        )}
                        <br />
                        Repair Date:{" "}
                        {new Date(estimate.repair_date).toLocaleDateString(
                          "en-CA"
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
                      aria-disabled={!estimatesData?.next}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
