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

// Sample JSON data for estimates
const estimatesData = [
  {
    id: 1,
    number: "#1116",
    title: "Water Pump R&R",
    status: "Pending",
    statusColor: "red-500",
    repair_status: "Expired",
    createdDate: "01-20-2025",
    expirationDate: "02-27-2025",
    carModel: "2004 Honda CR-V EX",
    userName: "Anthony Masters",
    value: 951.64,
  },
  {
    id: 2,
    number: "#1117",
    title: "Brake Pad Replacement",
    status: "Sent",
    statusColor: "blue-500",
    repair_status: "Viewed",
    createdDate: "02-15-2025",
    expirationDate: "03-15-2025",
    carModel: "2018 Toyota Camry",
    userName: "Jane Doe",
    value: 325.5,
  },
  {
    id: 3,
    number: "#1118",
    title: "Oil Change",
    status: "Accept",
    statusColor: "blue-500",
    repair_status: "Viewed",
    createdDate: "03-05-2025",
    expirationDate: "04-05-2025",
    carModel: "2022 Ford F-150",
    userName: "John Smith",
    value: 110.0,
  },
  {
    id: 4,
    number: "#1119",
    title: "Transmission Flush",
    status: "Pending",
    statusColor: "blue-500",
    repair_status: "Viewed",
    createdDate: "03-10-2025",
    expirationDate: "04-10-2025",
    carModel: "2019 Chevrolet Malibu",
    userName: "Emily Johnson",
    value: 289.99,
  },
  {
    id: 5,
    number: "#1120",
    title: "Tire Rotation",
    status: "Approved",
    statusColor: "green-500",
    repair_status: "Viewed",
    createdDate: "03-15-2025",
    expirationDate: "04-15-2025",
    carModel: "2020 Nissan Altima",
    userName: "Michael Brown",
    value: 79.99,
  },
  {
    id: 6,
    number: "#1121",
    title: "Battery Replacement",
    status: "Sent",
    statusColor: "blue-500",
    repair_status: "Viewed",
    createdDate: "03-20-2025",
    expirationDate: "04-20-2025",
    carModel: "2017 Hyundai Sonata",
    userName: "Sarah Davis",
    value: 199.99,
  },
  {
    id: 7,
    number: "#1122",
    title: "Spark Plug Replacement",
    status: "Pending",
    statusColor: "blue-500",
    repair_status: "New",
    createdDate: "03-25-2025",
    expirationDate: "04-25-2025",
    carModel: "2021 Kia Optima",
    userName: "David Wilson",
    value: 159.99,
  },
];

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
  const [timeframe, setTimeframe] = useState("this-month");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [estimatesPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEstimates, setFilteredEstimates] = useState(estimatesData);
  const [estimates, setEstimates] = useState<RepairRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const results = estimatesData.filter(
      (estimate) =>
        estimate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimate.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimate.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimate.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEstimates(results);
    setCurrentPage(1);
  }, [searchTerm]);

  // Get current estimates
  const indexOfLastEstimate = currentPage * estimatesPerPage;
  const indexOfFirstEstimate = indexOfLastEstimate - estimatesPerPage;
  const currentEstimates = filteredEstimates.slice(
    indexOfFirstEstimate,
    indexOfLastEstimate
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/list-repair-requests/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch estimates");
        const data = await response.json();
        setEstimates(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchEstimates();
  }, []);

  console.log(estimates);
  return (
    <div className="min-h-screen bg-[#B8E1E9]">
      {/* Top Navigation */}
      <div className="flex items-center gap-2 p-4 bg-[#B8E1E9]">
        <Button variant="ghost" className="text-gray-700 hover:bg-blue-100">
          <Home className="h-6 w-6" />
          <span className="ml-2">Back to Home</span>
        </Button>
      </div>

      {/* Header Stats */}
      <div className="bg-[#E8F4F7] p-6 rounded-lg mx-4">
        <div className="text-2xl font-bold mb-4">Estimate</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-gray-600">Total Estimates Created: 32</div>
            <div className="text-gray-600">Total Estimate Value: $12,312</div>
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
        <div className="text-red-500 mt-4">Changes based on the time frame</div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4">
        <div className="w-[200px]">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-six-months">Last Six Months</SelectItem>
              <SelectItem value="specific-date">Specific Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[200px] bg-[#1a237e] text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>

            <SelectItem value="all">All</SelectItem>
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
            <div key={estimate.id} className="bg-white rounded-lg p-4 shadow">
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
                    Created:{" "}
                    {new Date(estimate.created_at).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
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
                    <Badge className={getEstimateStatusColor(estimate.status)}>
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
                  href="#"
                  onClick={() => paginate(currentPage - 1)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({
                length: Math.ceil(filteredEstimates.length / estimatesPerPage),
              }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={() => paginate(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => paginate(currentPage + 1)}
                  className={
                    currentPage ===
                    Math.ceil(filteredEstimates.length / estimatesPerPage)
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
