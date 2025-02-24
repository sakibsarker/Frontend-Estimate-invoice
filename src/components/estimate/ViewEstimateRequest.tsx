import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Mail,
  FileText,
  FileType,
  FileSpreadsheet,
  Image,
  Eye,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";
import {
  useGetRepairRequestByIDQuery,
  useUpdateRepairRequestMutation,
} from "../../features/server/repairRequestSlice";

export default function ViewEstimateRequest() {
  const { estimateId } = useParams<{ estimateId: string }>();
  const navigate = useNavigate();
  const {
    data: estimateData,
    isLoading,
    refetch,
  } = useGetRepairRequestByIDQuery(Number(estimateId));
  const [updateRepairRequest] = useUpdateRepairRequestMutation();

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
    try {
      if (!estimateData) return;

      await updateRepairRequest({
        ...estimateData,
        status,
      }).unwrap();

      toast.success(`Request ${status.toLowerCase()} successfully!`, {
        duration: 4000,
        position: "top-center",
      });

      await refetch();

      if (status === "ACCEPTED") {
        navigate(`/estimate/${estimateId}/invoice/new`);
      }
    } catch (error) {
      toast.error("Failed updating status");
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster />
      {isLoading && <Loader />}

      {!isLoading && (
        <Card className="mx-auto max-w-4xl">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-2xl font-semibold">
              Estimate Request {estimateData?.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Name:</div>
                    <div>{estimateData?.username}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      Phone:
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>{estimateData?.phone_number}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      Email:
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>{estimateData?.email}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">
                      Estimate Submitted on:
                    </div>
                    <div>
                      {estimateData?.created_at &&
                        formatDate(estimateData.created_at)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Vehicle:</div>
                    <div>{estimateData?.vehicle_name}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Previous visits:
                    </div>
                    <div>{estimateData?.previous_visits}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Total Spending:</div>
                    <div>${estimateData?.invoice_total ?? 0}</div>
                  </div>
                </div>
              </div>

              {/* Customer Comment */}
              <div className="space-y-2">
                <h3 className="font-medium">Customer Comment:</h3>
                <div className="rounded-md border bg-gray-50/50 p-4">
                  {estimateData?.repair_details}
                </div>
              </div>

              {/* Customer Attachments */}
              <div className="space-y-2">
                <h3 className="font-medium">Customer Attachments:</h3>
                <div className="rounded-md border bg-gray-50/50 p-4 space-y-4">
                  {estimateData?.attachment_urls?.map(
                    (attachmentUrl, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-gray-100">
                            {(() => {
                              const fileUrl = attachmentUrl.split("?")[0];
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
                                  return (
                                    <FileSpreadsheet className={iconClass} />
                                  );
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
                            {attachmentUrl.split("/").pop()?.split("?")[0]}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm flex items-center gap-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View/ Download
                          </a>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative flex items-center gap-4 pt-4">
                <Button variant="outline" onClick={() => navigate("/estimate")}>
                  Go Back
                </Button>
                <div className="relative">
                  {estimateData?.status === "ACCEPTED" ? (
                    <Link to={`/invoice/${estimateData.invoice_id}/edit`}>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        View Invoice
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 text-sm"
                      onClick={() => updateStatus("ACCEPTED")}
                    >
                      Prepare an Estimate
                    </Button>
                  )}
                </div>
                {estimateData?.status === "PENDING" && (
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-500"
                    onClick={() => updateStatus("REJECTED")}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
