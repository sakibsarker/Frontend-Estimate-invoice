import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, MessageSquare, Phone, Mail } from "lucide-react";

export default function EstimateRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
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
                  <div>Alice Powell</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    Phone:
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>457-324-7463</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    Email:
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>alice-powell@gmail.com</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500">
                    Estimate Submitted on:
                  </div>
                  <div>2/10/2025 at 3 pm</div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Vehicle:</div>
                  <div>Audi Q5</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Previous visits:</div>
                  <div>2</div>
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
                What will it cost to change my front seat?
              </div>
            </div>

            {/* Customer Attachment */}
            <div className="space-y-2">
              <h3 className="font-medium">Customer Attachment:</h3>
              <div className="rounded-md border bg-gray-50/50 p-4 min-h-[100px]">
                {/* Placeholder for attachments */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative flex items-center gap-4 pt-4">
              <Button
                variant="secondary"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Back to home page
              </Button>
              <div className="relative">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Prepare an Estimate
                </Button>
              </div>
              <Button
                variant="destructive"
                className="bg-blue-800 hover:bg-blue-900"
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
