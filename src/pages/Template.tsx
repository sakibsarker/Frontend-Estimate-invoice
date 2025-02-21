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
import { v4 as uuidv4 } from "uuid";
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
  const [defaultTemplateId, setDefaultTemplateId] = useState<string | null>(
    null
  );

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
    setDefaultTemplateId(savedDefault);
  }, []);

  useEffect(() => {
    if (defaultTemplateId) {
      handleSelectTemplate(defaultTemplateId);
    }
  }, [defaultTemplateId]);

  useEffect(() => {
    if (selectedTemplate && typeof currentTemplateId === "number") {
      setTemplateData({
        ...templateData,
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      // Convert to API-compatible format
      const templatePayload: Template = {
        id: currentTemplateId || uuidv4(),
        name: templateData.name,
        selected_layout: selectedLayout,
        logo: logo,

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

      if (currentTemplateId) {
        // Update existing template
        if (typeof currentTemplateId === "number") {
          // API template update
          await updateTemplate(templatePayload).unwrap();
          toast.success("Template updated in API");
        } else {
          // Local template update
          setLocalTemplates((prev) =>
            prev.map((t) => (t.id === currentTemplateId ? templatePayload : t))
          );
          toast.success("Local template updated");
        }
      } else {
        // Always create through API first
        const result = await createTemplate(templatePayload).unwrap();

        // Update local state with API response
        setCurrentTemplateId(result.id);

        // If marked as non-default, also save locally
        if (!templateData.is_default) {
          const newLocalTemplate = {
            ...result,
            id: `local-${result.id}`, // Maintain reference to API ID
          };
          setLocalTemplates((prev) => [...prev, newLocalTemplate]);
        }

        toast.success("Template created successfully");
      }

      // Force reload of API templates
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
      const template = allTemplates.find((t) => t.id === currentTemplateId);
      if (!template) return;

      if (typeof currentTemplateId === "number") {
        // Create full template payload with type safety
        const apiTemplate: Template = {
          ...template,
        };

        await updateTemplate(apiTemplate).unwrap();
        dispatch(templateApi.util.invalidateTags(["Templates"]));
      } else {
        setLocalTemplates((prev) =>
          prev.map((t) => ({
            ...t,
          }))
        );
        localStorage.setItem("defaultTemplate", currentTemplateId);
      }

      // setDefaultTemplateId(currentTemplateId.toString());
      toast.success("Default template updated successfully");
    } catch (error) {
      console.error("Set default failed:", error);
      toast.error("Failed to set default template");
    }
  };

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
            <h1 className="text-2xl font-semibold">Template Manager</h1>
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
                      {template.id === defaultTemplateId && (
                        <span className="text-xs text-green-600 ml-2">
                          (Default)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSaveTemplate} className="min-w-[100px]">
              {currentTemplateId ? "Save Changes" : "Save New"}
            </Button>

            {currentTemplateId && (
              <Button
                variant="outline"
                onClick={handleSetDefault}
                className="min-w-[120px]"
              >
                Set as Default
              </Button>
            )}
          </div>

          {/* Template Name Input */}
          <div className="mb-6">
            <Label htmlFor="templateName">Template Name</Label>
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
              Create New Template
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Design Section */}
            <AccordionItem value="design">
              <AccordionTrigger className="text-sm font-semibold">
                DESIGN
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>Logo</Label>
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
                              Upload Image
                            </span>
                            <span className="text-xs text-gray-400">
                              Files supported: PNG, JPG
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Layout Selection */}
                  <div className="space-y-2">
                    <Label>Layout</Label>
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
                OPTIONS
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {/* invoice Info */}
                  <div className="space-y-2">
                    <Label>Invoice information</Label>
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
