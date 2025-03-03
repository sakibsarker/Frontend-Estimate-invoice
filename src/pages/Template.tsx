"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Textarea } from "@/components/ui/textarea";
import { InvoicePreview } from "@/components/InvoicePreview/InvoicePreview";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useGetTemplateQuery,
  useCreateTemplateMutation,
  useGetTemplatesByIDQuery,
  useUpdateTemplateMutation,
} from "@/features/server/templateSlice";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { templateApi } from "@/features/server/templateSlice";
import { useTranslation } from "react-i18next";

const layouts = [
  {
    id: "impact",
    name: "Impact",
  },
  {
    id: "classic",
    name: "Classic",
  },
  {
    id: "minimal",
    name: "Minimal",
  },
  {
    id: "modern",
    name: "Modern",
  },
];

interface Template {
  id: string | number;
  name: string;
  selected_layout: string;
  logo: string | null;
  customer_name: boolean;
  billing_address: boolean;
  phone: boolean;
  email: boolean;
  account_number: boolean;
  po_number: boolean;
  sales_rep: boolean;
  date: boolean;
  item_name: boolean;
  quantity: boolean;
  price: boolean;
  type: boolean;
  description: boolean;
  subtotal: boolean;
  tax: boolean;
  discount: boolean;
  due_amount: boolean;
}

export default function Template() {
  const [createTemplate] = useCreateTemplateMutation();
  const [updateTemplate] = useUpdateTemplateMutation();
  const { data: apiTemplates = [] } = useGetTemplateQuery();
  const [currentTemplateId, setCurrentTemplateId] = useState<
    string | number | null
  >(null);
  const [selectedLayout, setSelectedLayout] = useState("modern");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { t } = useTranslation();
  const [templateData, setTemplateData] = useState({
    name: "New Template",
    is_default: false,
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
  });
  const [defaultTemplate, setDefaultTemplate] = useState<string | null>(null);

  const [localTemplates, setLocalTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem("templates");
    return saved ? JSON.parse(saved) : [];
  });

  // Merge API and local templates
  const allTemplates = [...apiTemplates, ...localTemplates];

  const dispatch = useDispatch();

  const { data: selectedTemplate } = useGetTemplatesByIDQuery(
    typeof currentTemplateId === "number" ? currentTemplateId : 0,
    { skip: typeof currentTemplateId !== "number" }
  );

  useEffect(() => {
    localStorage.setItem("templates", JSON.stringify(localTemplates));
  }, [localTemplates]);

  useEffect(() => {
    const savedDefault = localStorage.getItem("defaultTemplate");
    setDefaultTemplate(savedDefault);
  }, []);

  useEffect(() => {
    if (defaultTemplate) {
      handleSelectTemplate(defaultTemplate);
    }
  }, [defaultTemplate]);

  useEffect(() => {
    if (selectedTemplate && typeof currentTemplateId === "number") {
      setTemplateData({
        ...templateData,
        // Map API response fields to local state
        name: selectedTemplate.name,

        customerName: selectedTemplate.customer_name,
        billingAddress: selectedTemplate.billing_address,
        phone: selectedTemplate.phone,
        email: selectedTemplate.email,
        accountNumber: selectedTemplate.account_number,
        poNumber: selectedTemplate.po_number,
        salesRep: selectedTemplate.sales_rep,
        Date: selectedTemplate.date,
        itemName: selectedTemplate.item_name,
        quantity: selectedTemplate.quantity,
        price: selectedTemplate.price,
        type: selectedTemplate.type,
        description: selectedTemplate.description,
        subtotal: selectedTemplate.subtotal,
        tax: selectedTemplate.tax,
        discount: selectedTemplate.discount,
        dueAmount: selectedTemplate.due_amount,
      });
      setSelectedLayout(selectedTemplate.selected_layout);
      setLogo(selectedTemplate.logo);
    }
  }, [selectedTemplate]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const formData = new FormData();

      // Append logo file if exists
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // Append other fields
      formData.append("name", templateData.name);
      formData.append("selected_layout", selectedLayout);
      formData.append("customer_name", String(templateData.customerName));
      formData.append("billing_address", String(templateData.billingAddress));
      formData.append("phone", String(templateData.phone));
      formData.append("email", String(templateData.email));
      formData.append("account_number", String(templateData.accountNumber));
      formData.append("po_number", String(templateData.poNumber));
      formData.append("sales_rep", String(templateData.salesRep));
      formData.append("date", String(templateData.Date));
      formData.append("item_name", String(templateData.itemName));
      formData.append("quantity", String(templateData.quantity));
      formData.append("price", String(templateData.price));
      formData.append("type", String(templateData.type));
      formData.append("description", String(templateData.description));
      formData.append("subtotal", String(templateData.subtotal));
      formData.append("tax", String(templateData.tax));
      formData.append("discount", String(templateData.discount));
      formData.append("due_amount", String(templateData.dueAmount));

      if (currentTemplateId) {
        formData.append("id", currentTemplateId.toString());
        await updateTemplate(formData).unwrap();
        toast.success(`Template ${currentTemplateId} updated`);
      } else {
        const result = await createTemplate(formData).unwrap();
        setCurrentTemplateId(result.id);
        toast.success("Template created successfully");
      }

      dispatch(templateApi.util.invalidateTags(["Templates"]));
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save template");
    }
  };

  const handleSelectTemplate = async (templateId: string | number) => {
    setCurrentTemplateId(templateId);

    try {
      let template: Template | undefined;

      if (typeof templateId === "number") {
        // Fetch from API using Redux Query
        template = selectedTemplate;
      } else {
        // Get from local templates
        template = localTemplates.find((t) => t.id === templateId);
      }

      if (template) {
        setTemplateData({
          ...templateData,
          // Map API response fields to local state
          name: template.name,

          customerName: template.customer_name,
          billingAddress: template.billing_address,
          phone: template.phone,
          email: template.email,
          accountNumber: template.account_number,
          poNumber: template.po_number,
          salesRep: template.sales_rep,
          Date: template.date,
          itemName: template.item_name,
          quantity: template.quantity,
          price: template.price,
          type: template.type,
          description: template.description,
          subtotal: template.subtotal,
          tax: template.tax,
          discount: template.discount,
          dueAmount: template.due_amount,
        });

        setSelectedLayout(template.selected_layout);
        setLogo(template.logo);
      }
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error("Failed to load template");
    }
  };

  // Update the handleSetDefault function
  const handleSetDefault = async () => {
    if (!currentTemplateId) return;

    try {
      const formData = new FormData();

      // Append all current fields
      formData.append("name", templateData.name);
      formData.append("selected_layout", selectedLayout);
      formData.append("customer_name", String(templateData.customerName));
      formData.append("billing_address", String(templateData.billingAddress));
      formData.append("phone", String(templateData.phone));
      formData.append("email", String(templateData.email));
      formData.append("account_number", String(templateData.accountNumber));
      formData.append("po_number", String(templateData.poNumber));
      formData.append("sales_rep", String(templateData.salesRep));
      formData.append("date", String(templateData.Date));
      formData.append("item_name", String(templateData.itemName));
      formData.append("quantity", String(templateData.quantity));
      formData.append("price", String(templateData.price));
      formData.append("type", String(templateData.type));
      formData.append("description", String(templateData.description));
      formData.append("subtotal", String(templateData.subtotal));
      formData.append("tax", String(templateData.tax));
      formData.append("discount", String(templateData.discount));
      formData.append("due_amount", String(templateData.dueAmount));

      // Append logo if exists
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // For localStorage, keep the data URL version
      const fullTemplateData = {
        id: currentTemplateId,
        name: templateData.name,
        selected_layout: selectedLayout,
        logo: logo, // Keep data URL for preview
        customer_name: templateData.customerName,
        billing_address: templateData.billingAddress,
        phone: templateData.phone,
        email: templateData.email,
        account_number: templateData.accountNumber,
        po_number: templateData.poNumber,
        sales_rep: templateData.salesRep,
        date: templateData.Date,
        item_name: templateData.itemName,
        quantity: templateData.quantity,
        price: templateData.price,
        type: templateData.type,
        description: templateData.description,
        subtotal: templateData.subtotal,
        tax: templateData.tax,
        discount: templateData.discount,
        due_amount: templateData.dueAmount,
      };

      // Store complete template data in localStorage
      localStorage.setItem("defaultTemplate", JSON.stringify(fullTemplateData));

      // Update server or local template
      if (typeof currentTemplateId === "number") {
        formData.append("id", currentTemplateId.toString());
        // await updateTemplate(formData).unwrap();
        dispatch(templateApi.util.invalidateTags(["Templates"]));
      } else {
        setLocalTemplates((prev) =>
          prev.map((t) => (t.id === currentTemplateId ? fullTemplateData : t))
        );
      }

      toast.success(`Default Template ${currentTemplateId} set successfully`);
    } catch (error) {
      toast.error("Failed to set template");
    }
  };

  // Add this to load stored template data on component mount
  useEffect(() => {
    const storedTemplate = localStorage.getItem("defaultTemplate");
    if (storedTemplate) {
      const parsedTemplate = JSON.parse(storedTemplate);
      handleSelectTemplate(parsedTemplate.id);
    }
  }, []);

  const handleNewTemplate = () => {
    setCurrentTemplateId(null);
    setTemplateData({
      ...templateData,
      name: "New Template " + (localTemplates.length + 1),
    });

    setSelectedLayout("modern");
    setLogo(null);
  };

  // Filter only boolean fields for checkboxes
  const booleanFields = [
    "customerName",
    "billingAddress",
    "phone",
    "email",
    "accountNumber",
    "poNumber",
    "salesRep",
    "Date",
    "itemName",
    "quantity",
    "price",
    "type",
    "description",
    "subtotal",
    "tax",
    "discount",
    "dueAmount",
  ];

  return (
    <>
      <Toaster />
      <div className="flex min-h-screen">
        {/* Left Panel - Configuration */}
        <div className="w-[600px] border-r bg-white p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">{t("templateManager")}</h1>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Select
              value={currentTemplateId?.toString()}
              onValueChange={(value) => {
                const id = value.includes("local-") ? value : Number(value);
                handleSelectTemplate(id);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Template">
                  {currentTemplateId
                    ? allTemplates.find((t) => t.id === currentTemplateId)?.name
                    : "Select Template"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {allTemplates.map((template) => (
                  <SelectItem
                    key={template.id.toString()}
                    value={template.id.toString()}
                  >
                    <div className="flex items-center justify-between">
                      <span>{template.name}</span>
                      {template.id === defaultTemplate && (
                        <span className="text-xs text-green-600 ml-2">
                          (Default)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleSaveTemplate}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800"
            >
              {currentTemplateId ? t("saveChanges") : t("saveNew")}
            </Button>

            {currentTemplateId && (
              <Button
                variant="outline"
                onClick={handleSetDefault}
                className="min-w-[120px]"
              >
                {t("setAsDefault")}
              </Button>
            )}
          </div>

          {/* Template Name Input */}
          <div className="mb-6">
            <Label htmlFor="templateName">{t("templateName")}</Label>
            <Input
              id="templateName"
              value={templateData.name}
              onChange={(e) =>
                setTemplateData({ ...templateData, name: e.target.value })
              }
              placeholder="Enter template name"
            />
            <Button
              variant="outline"
              onClick={handleNewTemplate}
              className="mt-2 w-full"
            >
              {t("createNewTemplate")}
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Design Section */}
            <AccordionItem value="design">
              <AccordionTrigger className="text-sm font-semibold">
                {t("design")}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>{t("logo")}</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 flex items-center justify-center bg-gray-50">
                        {logo ? (
                          <img
                            src={logo || "/placeholder.svg"}
                            alt="Logo"
                            className="max-h-20 max-w-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-sm text-gray-500">
                            No Logo
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="logo-upload"
                            onChange={handleLogoUpload}
                          />
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Upload className="h-6 w-6 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {t("uploadImage")}
                            </span>
                            <span className="text-xs text-gray-400">
                              {t("filesSupported")}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Layout Selection */}
                  <div className="space-y-2">
                    <Label>{t("layout")}</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {layouts.map((layout) => (
                        <div
                          key={layout.id}
                          className={`cursor-pointer rounded-lg border p-2 text-center ${
                            selectedLayout === layout.id
                              ? "border-blue-500 bg-blue-50"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedLayout(layout.id)}
                        >
                          <span className="text-sm">{layout.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Options Section */}
            <AccordionItem value="options">
              <AccordionTrigger className="text-sm font-semibold">
                {t("options")}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {/* invoice Info */}
                  <div className="space-y-2">
                    <Label>{t("invoiceInformation")}</Label>
                    <div className="space-y-2">
                      {booleanFields.map((field) => (
                        <div
                          key={field}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={field}
                            checked={
                              templateData[
                                field as keyof typeof templateData
                              ] as boolean
                            }
                            onCheckedChange={(checked) =>
                              setTemplateData({
                                ...templateData,
                                [field]: checked,
                              })
                            }
                          />
                          <label
                            htmlFor={field}
                            className="text-sm leading-none capitalize"
                          >
                            {field.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div className="space-y-2">
                    <Label>Footer Note</Label>
                    <Textarea
                      placeholder="Message on template"
                      className="h-20 resize-none"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-gray-50 p-6">
          <InvoicePreview
            logo={logo}
            layout={selectedLayout}
            templateData={{
              customerName: templateData.customerName,
              billingAddress: templateData.billingAddress,
              phone: templateData.phone,
              email: templateData.email,
              accountNumber: templateData.accountNumber,
              poNumber: templateData.poNumber,
              salesRep: templateData.salesRep,
              Date: templateData.Date,
              itemName: templateData.itemName,
              quantity: templateData.quantity,
              price: templateData.price,
              type: templateData.type,
              description: templateData.description,
              subtotal: templateData.subtotal,
              tax: templateData.tax,
              discount: templateData.discount,
              dueAmount: templateData.dueAmount,
            }}
          />
        </div>
      </div>
    </>
  );
}
