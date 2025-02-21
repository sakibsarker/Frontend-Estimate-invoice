"use client";

import { useState } from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SendInvoicePreview } from "./SendInvoicePreview";
import { useNavigate } from "react-router";
import { useGetInvoicePreviwByIdQuery } from "@/features/server/invoiceSlice";

// Add this static data object above the component
const staticPreviewData = {
  logo: "https://placehold.co/200x50.png",
  color: "#4F46E5",
  layout: "classic",
  templateData: {
    customerName: true,
    billingAddress: true,
    shippingAddress: true,
    phone: true,
    email: true,
    accountNumber: true,
    poNumber: true,
    salesRep: true,
    Date: true,
    itemName: true,
    quantity: true,
    price: true,
    type: true,
    description: true,
    subtotal: true,
    tax: true,
    discount: true,
    dueAmount: true,
  },
};

export default function SendInvoice() {
  const [sendMethod, setSendMethod] = useState<"email" | "text">("email");
  const [sendCopy, setSendCopy] = useState(false);
  const navigate = useNavigate();

  // Add the query hook
  const {
    data: invoiceData,
    isLoading,
    isError,
  } = useGetInvoicePreviwByIdQuery(44); // Pass the invoice ID (44 in this case)

  // Add loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Add error state
  if (isError) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading invoice</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background">
      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Send Invoice</h2>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex overflow-y-auto">
          {/* Left Side - Email Form */}
          <div className="w-[500px] bg-background p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-medium">Send as</h3>
                <div className="flex gap-2">
                  <Button
                    variant={sendMethod === "email" ? "default" : "outline"}
                    className="w-24"
                    onClick={() => setSendMethod("email")}
                  >
                    Email
                  </Button>
                  <Button
                    variant={sendMethod === "text" ? "default" : "outline"}
                    className="w-24"
                    onClick={() => setSendMethod("text")}
                  >
                    Text
                  </Button>
                </div>
              </div>

              {sendMethod === "email" ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="to" className="text-sm">
                          To <span className="text-red-500">*</span>
                        </Label>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm text-blue-600"
                        >
                          cc
                        </Button>
                      </div>
                      <Input id="to" className="mt-1.5" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="copy"
                        checked={sendCopy}
                        onCheckedChange={(checked) =>
                          setSendCopy(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="copy"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Send a copy to me
                      </label>
                    </div>

                    <div>
                      <Label htmlFor="reply-to" className="text-sm">
                        Reply to
                      </Label>
                      <Select defaultValue="john-saba">
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select a contact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john-saba">John Saba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        className="mt-1.5"
                        defaultValue="Invoice 001 due Jan 07, 2025 | Auto Gig Shop"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="body" className="text-sm">
                          Body
                        </Label>
                        <Button variant="ghost" size="icon" className="h-4 w-4">
                          <span className="sr-only">Help</span>ⓘ
                        </Button>
                      </div>
                      <Textarea
                        id="body"
                        className="mt-1.5 min-h-[200px]"
                        defaultValue={`Jose, here's your invoice from Auto Gig Shop

Invoice: 001
Amount due: $106.00
Due: Jan 07, 2025
(Invoice Button)

Thanks,
Auto Gig Shop`}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Text Message</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(000) 000-0000"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="text-body" className="text-sm">
                          Message
                        </Label>
                        <Button variant="ghost" size="icon" className="h-4 w-4">
                          <span className="sr-only">Help</span>ⓘ
                        </Button>
                      </div>
                      <Textarea
                        id="text-body"
                        className="mt-1.5 min-h-[200px]"
                        defaultValue={`Your invoice from Auto Gig Shop is ready.

Amount due: $106.00
Due: Jan 07, 2025

View invoice: [Link]`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between bg-background mt-auto">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/template")}
                  >
                    Edit Invoice
                  </Button>
                  <Button>
                    {sendMethod === "email" ? "Send Email" : "Send Text"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Invoice Preview */}
          <div className="flex-1 bg-gray-50 overflow-y-auto">
            <div className="flex h-12 items-center justify-end border-b px-4 print:hidden">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="print:hidden">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview content with padding */}
            <div className="p-6">
              {invoiceData && (
                <SendInvoicePreview {...staticPreviewData} {...invoiceData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
