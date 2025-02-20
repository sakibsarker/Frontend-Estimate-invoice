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
import { toast } from "react-hot-toast";
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

const colors = [
  ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF"],
  ["#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC", "#FFE6E6"],
  ["#00FF00", "#33FF33", "#66FF66", "#99FF99", "#CCFFCC", "#E6FFE6"],
  ["#0000FF", "#3333FF", "#6666FF", "#9999FF", "#CCCCFF", "#E6E6FF"],
];

interface Template {
  id: string | number;
  name: string;
  selected_color: string;
  selected_layout: string;
  logo: string | null;
  customer_name: boolean;
  billing_address: boolean;
  shipping_address: boolean;
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
  is_default: boolean;
}

export default function Template() {
  const [createTemplate] = useCreateTemplateMutation();
  const [updateTemplate] = useUpdateTemplateMutation();
  const { data: apiTemplates = [] } = useGetTemplateQuery();
  const [currentTemplateId, setCurrentTemplateId] = useState<
    string | number | null
  >(null);
  const [selectedColor, setSelectedColor] = useState("#4E4E56");
  const [selectedLayout, setSelectedLayout] = useState("modern");
  const [logo, setLogo] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState({
    name: "New Template",
    is_default: false,
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
        selected_color: selectedColor,
        selected_layout: selectedLayout,
        logo: logo,
        is_default: templateData.is_default,

        // Map all fields to snake_case
        customer_name: templateData.customerName,
        billing_address: templateData.billingAddress,
        shipping_address: templateData.shippingAddress,
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
        // Create new template
        if (templateData.is_default) {
          // API template creation
          const result = await createTemplate(templatePayload).unwrap();
          setCurrentTemplateId(result.id);
          toast.success("Template created in API");
        } else {
          // Local template creation
          const newLocalTemplate = {
            ...templatePayload,
            id: `local-${uuidv4()}`, // Prefix local templates
          };
          setLocalTemplates((prev) => [...prev, newLocalTemplate]);
          setCurrentTemplateId(newLocalTemplate.id);
          toast.success("Local template created");
        }
      }

      // Force reload of API templates
      dispatch(templateApi.util.invalidateTags(["Templates"]));
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save template. Check console for details.");
    }
  };

  const handleSelectTemplate = (templateId: string | number) => {
    const template = allTemplates.find((t) => t.id === templateId);
    if (template) {
      setTemplateData({
        ...templateData,
        ...template,
      });
      setSelectedColor(template.selected_color);
      setSelectedLayout(template.selected_layout);
      setLogo(template.logo);
      setCurrentTemplateId(template.id);
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
          is_default: true,
        };

        await updateTemplate(apiTemplate).unwrap();
        dispatch(templateApi.util.invalidateTags(["Templates"]));
      } else {
        setLocalTemplates((prev) =>
          prev.map((t) => ({
            ...t,
            is_default: t.id === currentTemplateId,
          }))
        );
        localStorage.setItem("defaultTemplate", currentTemplateId);
      }

      setDefaultTemplateId(currentTemplateId.toString());
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
      is_default: false,
    });

    setSelectedColor("#4E4E56");
    setSelectedLayout("modern");
    setLogo(null);
  };

  // Filter only boolean fields for checkboxes
  const booleanFields = [
    "customerName",
    "billingAddress",
    "shippingAddress",
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

                {/* Color Selection */}
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="mb-2"
                  />
                  <div className="grid gap-2">
                    {colors.map((row, i) => (
                      <div key={i} className="flex gap-2">
                        {row.map((color) => (
                          <button
                            key={color}
                            className={`h-6 w-6 rounded-full border ${
                              selectedColor === color
                                ? "ring-2 ring-blue-500 ring-offset-2"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
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
                {/* Customer Info */}
                <div className="space-y-2">
                  <Label>Customer info</Label>
                  <div className="space-y-2">
                    {booleanFields.map((field) => (
                      <div key={field} className="flex items-center space-x-2">
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
          color={selectedColor}
          layout={selectedLayout}
          templateData={{
            customerName: templateData.customerName,
            billingAddress: templateData.billingAddress,
            shippingAddress: templateData.shippingAddress,
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
  );
}
