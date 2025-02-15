import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Printer,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  FileType,
  FileSpreadsheet,
  Image,
  Eye,
  Download,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";
interface EstimateData {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  repair_details: string;
  previous_visits: number;
  status: string;
  vehicle_name: string;
  estimate_attachments?: string;
  repair_date: string;
  created_at: string;
  updated_at: string;
}

export default function EstimateRequestPage() {
  const { estimateId } = useParams<{ estimateId: string }>();
  const navigate = useNavigate();
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEstimateData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/estimate/repair-requests/${estimateId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: EstimateData = await response.json();
        setEstimateData(data);
      } catch (error) {
        console.error("Error fetching estimate data:", error);
      }
    };

    if (estimateId) {
      fetchEstimateData();
    }
  }, [estimateId]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updateStatus = async (status: "ACCEPTED" | "REJECTED") => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/estimate/repair-requests/${estimateId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const data = await response.json();
      setEstimateData(data);

      toast.success(`Request ${status.toLowerCase()} successfully!`, {
        duration: 4000,
        position: "top-center",
      });

      if (status === "ACCEPTED") {
        navigate(`/estimate/${estimateId}/invoice/new`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to ${status.toLowerCase()} request`, {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!estimateData) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster />
      {loading && <Loader />}

      <Card className="mx-auto max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-2xl font-normal">
            Estimate Request:
          </CardTitle>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Printer className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-2">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Name:</div>
                  <div>{estimateData.username}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    Phone:
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>{estimateData.phone_number}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    Email:
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>{estimateData.email}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500">
                    Estimate Submitted on:
                  </div>
                  <div>{formatDate(estimateData.created_at)}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Vehicle:</div>
                  <div>{estimateData.vehicle_name}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Previous visits:</div>
                  <div>{estimateData.previous_visits}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Total Spending:</div>
                  <div>$0</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    Message Customer
                    <MessageSquare className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Comment */}
            <div className="space-y-2">
              <h3 className="font-medium">Customer Comment:</h3>
              <div className="rounded-md border bg-gray-50/50 p-4">
                {estimateData.repair_details}
              </div>
            </div>

            {/* Customer Attachment */}
            <div className="space-y-2">
              <h3 className="font-medium">Customer Attachment:</h3>
              <div className="rounded-md border bg-gray-50/50 p-4">
                {estimateData.estimate_attachments && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-100">
                        {(() => {
                          const fileUrl =
                            estimateData.estimate_attachments.split("?")[0];
                          const fileName =
                            fileUrl.split("/").pop() || "attachment";
                          const fileExtension = fileName
                            .split(".")
                            .pop()
                            ?.toLowerCase();

                          const iconClass = "h-5 w-5 text-gray-600";

                          switch (fileExtension) {
                            case "pdf":
                              return <FileText className={iconClass} />;
                            case "doc":
                            case "docx":
                              return <FileType className={iconClass} />;
                            case "xls":
                            case "xlsx":
                              return <FileSpreadsheet className={iconClass} />;
                            case "jpg":
                            case "jpeg":
                            case "png":
                              return <Image className={iconClass} />;
                            default:
                              return <FileType className={iconClass} />;
                          }
                        })()}
                      </div>
                      <span className="font-medium text-sm">
                        {
                          estimateData.estimate_attachments
                            .split("/")
                            .pop()
                            ?.split("?")[0]
                        }
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={estimateData.estimate_attachments}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm flex items-center gap-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </a>
                      <a
                        href={estimateData.estimate_attachments}
                        download
                        className="px-3 py-1.5 text-sm flex items-center gap-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative flex items-center gap-4 pt-4">
              <Button
                variant="secondary"
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={() => navigate("/estimate")}
              >
                Back to home page
              </Button>
              <div className="relative">
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => updateStatus("ACCEPTED")}
                >
                  Prepare an Estimate
                </Button>
              </div>
              <Button
                variant="destructive"
                className="bg-blue-600 hover:bg-blue-900"
                onClick={() => updateStatus("REJECTED")}
              >
                Reject
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
