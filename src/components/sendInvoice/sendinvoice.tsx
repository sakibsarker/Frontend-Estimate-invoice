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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  // Print function using jsPDF and html2canvas
  const handlePrint = () => {
    if (contentRef.current) {
      html2canvas(contentRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4"); // A4 size page
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Margins to avoid cutting off content
        const marginX = 10; // Left and right margins
        const marginY = 10; // Top and bottom margins

        let position = 0;
        const pageHeight = 297; // A4 height in mm

        while (position < imgHeight) {
          if (position > 0) {
            pdf.addPage(); // Add a new page for each segment
          }
          pdf.addImage(
            imgData,
            "PNG",
            marginX,
            position > 0 ? -position + marginY : marginY,
            imgWidth - 2 * marginX,
            imgHeight - 2 * marginY
          );
          position += pageHeight - 2 * marginY; // Move to the next page
        }

        // Open the print dialog
        pdf.autoPrint(); // Automatically trigger the print dialog
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank"); // Open the PDF in a new tab and trigger print
      });
    }
  };

  // Function to handle PDF download

  const handleDownloadPdf = () => {
    if (contentRef.current) {
      html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: "#ffffff", // Ensure white background
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4"); // A4 size page
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add margins to avoid cutting off content
        const marginX = 10; // Left and right margins
        const marginY = 10; // Top and bottom margins

        let position = 0;
        const pageHeight = 297; // A4 height in mm

        while (position < imgHeight) {
          if (position > 0) {
            pdf.addPage();
          }
          pdf.addImage(
            imgData,
            "PNG",
            marginX,
            position > 0 ? -position + marginY : marginY,
            imgWidth - 2 * marginX,
            imgHeight - 2 * marginY
          );
          position += pageHeight;
        }

        pdf.save("invoice.pdf"); // Save the PDF with the name "invoice.pdf"
      });
    }
  };

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
          <h2 className="text-xl font-semibold">{t("sendInvoice")}</h2>
          <Button variant="ghost" size="icon" onClick={() => navigate(`/home`)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex overflow-y-auto">
          {/* Left Side - Email Form */}
          <div className="w-[500px] bg-background p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-medium">{t("sendAs")}</h3>
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
                    {t("email")}
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
                    {t("text")}
                  </Button>
                </div>
              </div>

              {sendMethod === "email" ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium"> {t("email")}</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="to" className="text-sm">
                          {t("to")} <span className="text-red-500">*</span>
                        </Label>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-sm text-blue-600"
                        >
                          cc
                        </Button>
                      </div>
                      <Input
                        id="to"
                        className="mt-1.5"
                        value={invoiceData?.customerId?.email_address || ""}
                        readOnly
                      />
                    </div>

                    <div>
                      <Label htmlFor="reply-to" className="text-sm">
                        {t("replyTo")}
                      </Label>
                      <Select defaultValue="john-saba">
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select a contact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto-shop">Auto Shop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm">
                        {t("subject")}
                      </Label>
                      <Input
                        id="subject"
                        className="mt-1.5"
                        readOnly
                        value={`${t("invoice")}-${
                          invoiceData?.invoice_number
                        } | Auto Gig Shop`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="body" className="text-sm">
                          {t("body")}
                        </Label>
                      </div>
                      <Textarea
                        id="body"
                        className="mt-1.5 min-h-[200px]"
                        readOnly
                        value={
                          invoiceData
                            ? `${t("dear")} ${
                                invoiceData.customerId?.contact_first_name
                              } ${
                                invoiceData.customerId?.contact_last_name
                              },\n\n` +
                              `${t("invoiceNumber")}: ${
                                invoiceData.invoice_number
                              }\n` +
                              `Due Date: ${new Date(
                                invoiceData.created_at
                              ).toLocaleDateString()}\n` +
                              `${t("serviceDetails")}:\n` +
                              `- ${t("subtotal")}: $${parseFloat(
                                invoiceData.subtotal
                              ).toFixed(2)}\n` +
                              `- ${t("discount")} (${
                                invoiceData.discount.discount_rate
                              }%): -$${parseFloat(
                                invoiceData.discount.discount_rate
                              ).toFixed(2)}\n` +
                              `- ${t("tax")} (${
                                invoiceData.tax.tax_rate
                              }%): $${parseFloat(
                                invoiceData.tax.tax_rate
                              ).toFixed(2)}\n` +
                              `- ${t("totalDue")}: $${parseFloat(
                                invoiceData.amount_due
                              ).toFixed(2)}\n\n` +
                              `${t("viewFullInvoice")}: [Invoice Link]\n\n` +
                              `${t("thanksMessage")},\n` +
                              `${t("yourTeam")}\n` +
                              `Auto Gig Shop`
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{t("textMessage")}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm">
                        {t("phoneNumber")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        className="mt-1.5"
                        value={invoiceData?.customerId?.phone_number || ""}
                        readOnly
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="text-body" className="text-sm">
                          {t("message")}
                        </Label>
                      </div>
                      <Textarea
                        id="text-body"
                        className="mt-1.5 min-h-[200px]"
                        defaultValue={
                          invoiceData
                            ? `${t("smsInvoiceReady")}:\n` +
                              `${t("amountDue")}: $${parseFloat(
                                invoiceData?.amount_due ?? "0"
                              ).toFixed(2)}\n` +
                              `${t("createdDate")}: ${
                                new Date(invoiceData?.created_at)
                                  .toISOString()
                                  .split("T")[0]
                              }\n` +
                              `${t("subtotal")}: $${parseFloat(
                                invoiceData.subtotal
                              ).toFixed(2)}\n` +
                              `${t("discount")}: $${parseFloat(
                                invoiceData.discount.discount_rate
                              ).toFixed(2)}\n` +
                              `${t("tax")}: $${parseFloat(
                                invoiceData.tax.tax_rate
                              ).toFixed(2)}\n` +
                              `${t("total")}: $${parseFloat(
                                invoiceData.total
                              ).toFixed(2)}\n\n` +
                              `${t("viewInvoice")}: [View Link]`
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between bg-background mt-auto">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/invoice/${invoiceId}/edit`)}
                  >
                    {t("editInvoice")}
                  </Button>
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 text-sm">
                    {sendMethod === "email" ? t("sendEmail") : t("sendText")}
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
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 text-sm"
                  onClick={() => navigate("/template")}
                >
                  Edit Template
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="print:hidden"
                  onClick={handleDownloadPdf}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview content with padding */}

            <div className="p-6 relative overflow-visible" ref={contentRef}>
              {isLoading ? (
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a237e] "></div>
                  <p className="text-[#1a237e] font-medium">
                    PDF Generating...
                  </p>
                </div>
              ) : invoiceData ? (
                <SendInvoicePreview {...mergedPreviewData} {...invoiceData} />
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
