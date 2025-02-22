"use client";

import { useState, useRef } from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SendInvoicePreview } from "./SendInvoicePreview";
import { useNavigate, useParams } from "react-router";
import { useGetInvoicePreviwByIdQuery } from "@/features/server/invoiceSlice";
import { cn } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";

// Add this static data object above the component
const staticPreviewData = {
  logo: "https://placehold.co/200x50.png",
  layout: "classic",
  templateData: {
    customerName: true,
    billingAddress: true,
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
  const { invoiceId } = useParams<{ invoiceId: string }>();
  // Add the query hook
  const {
    data: invoiceData,
    isLoading,
    isError,
  } = useGetInvoicePreviwByIdQuery(Number(invoiceId)); // Pass the invoice ID (44 in this case)
  const [sendMethod, setSendMethod] = useState<"email" | "text">("email");
  const navigate = useNavigate();

  // Get default template from localStorage or use static data
  const savedDefault = localStorage.getItem("defaultTemplate");
  const mergedPreviewData = savedDefault
    ? (() => {
        const parsedDefault = JSON.parse(savedDefault);
        return {
          logo: parsedDefault.logo || staticPreviewData.logo,
          layout: parsedDefault.selected_layout || staticPreviewData.layout,
          templateData: {
            customerName:
              parsedDefault.customer_name ??
              staticPreviewData.templateData.customerName,
            billingAddress:
              parsedDefault.billing_address ??
              staticPreviewData.templateData.billingAddress,
            phone: parsedDefault.phone ?? staticPreviewData.templateData.phone,
            email: parsedDefault.email ?? staticPreviewData.templateData.email,
            accountNumber:
              parsedDefault.account_number ??
              staticPreviewData.templateData.accountNumber,
            poNumber:
              parsedDefault.po_number ??
              staticPreviewData.templateData.poNumber,
            salesRep:
              parsedDefault.sales_rep ??
              staticPreviewData.templateData.salesRep,
            Date: parsedDefault.date ?? staticPreviewData.templateData.Date,
            itemName:
              parsedDefault.item_name ??
              staticPreviewData.templateData.itemName,
            quantity:
              parsedDefault.quantity ?? staticPreviewData.templateData.quantity,
            price: parsedDefault.price ?? staticPreviewData.templateData.price,
            type: parsedDefault.type ?? staticPreviewData.templateData.type,
            description:
              parsedDefault.description ??
              staticPreviewData.templateData.description,
            subtotal:
              parsedDefault.subtotal ?? staticPreviewData.templateData.subtotal,
            tax: parsedDefault.tax ?? staticPreviewData.templateData.tax,
            discount:
              parsedDefault.discount ?? staticPreviewData.templateData.discount,
            dueAmount:
              parsedDefault.due_amount ??
              staticPreviewData.templateData.dueAmount,
          },
        };
      })()
    : staticPreviewData;

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

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
                    className={cn(
                      "w-24",
                      sendMethod === "email" &&
                        "bg-indigo-700 text-white hover:bg-indigo-800"
                    )}
                    onClick={() => setSendMethod("email")}
                  >
                    Email
                  </Button>
                  <Button
                    variant={sendMethod === "text" ? "default" : "outline"}
                    className={cn(
                      "w-24",
                      sendMethod === "text" &&
                        "bg-indigo-700 text-white hover:bg-indigo-800"
                    )}
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
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 text-sm">
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
                  onClick={() => reactToPrintFn()}
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
              {isLoading ? (
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a237e] "></div>
                  <p className="text-[#1a237e] font-medium">
                    PDF Generating...
                  </p>
                </div>
              ) : invoiceData ? (
                <>
                  <div ref={contentRef}>
                    <SendInvoicePreview
                      {...mergedPreviewData}
                      {...invoiceData}
                    />
                  </div>
                </>
              ) : (
                <div className="text-red-500 text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Error loading invoice
                  </h2>
                  <p>Please try again later</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
