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
import { useCreateTemplateMutation } from "@/features/server/templateSlice";

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
  id: string;
  name: string;
  selectedColor: string;
  selectedLayout: string;
  logo: string | null;
  templateData: {
    name: string;
    isDefault: boolean;
    customerFields: {
      customerName: boolean;
      billingAddress: boolean;
      shippingAddress: boolean;
      phone: boolean;
      email: boolean;
      accountNumber: boolean;
    };
    headerFields: {
      poNumber: boolean;
      salesRep: boolean;
      Date: boolean;
    };
    itemFields: {
      date: boolean;
      itemName: boolean;
      quantity: boolean;
      price: boolean;
      type: boolean;
      description: boolean;
    };
    calculationFields: {
      subtotal: boolean;
      tax: boolean;
      discount: boolean;
      dueAmount: boolean;
    };
  };
}

export default function EditInvoice() {
  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem("templates");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState("#4E4E56");
  const [selectedLayout, setSelectedLayout] = useState("modern");
  const [logo, setLogo] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState({
    name: "New Template",
    isDefault: false,
    customerFields: {
      customerName: true,
      billingAddress: true,
      shippingAddress: true,
      phone: true,
      email: true,
      accountNumber: true,
    },
    headerFields: {
      poNumber: true,
      salesRep: true,
      Date: true,
    },
    itemFields: {
      date: true,
      itemName: true,
      quantity: true,
      price: true,
      type: true,
      description: true,
    },
    calculationFields: {
      subtotal: true,
      tax: true,
      discount: true,
      dueAmount: true,
    },
  });
  const [defaultTemplateId, setDefaultTemplateId] = useState<string | null>(
    null
  );
  const [createTemplate] = useCreateTemplateMutation();

  useEffect(() => {
    localStorage.setItem("templates", JSON.stringify(templates));
  }, [templates]);

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
      const templatePayload = {
        name: templateData.name,
        logo: logo,
        selected_color: selectedColor,
        selected_layout: selectedLayout,
        is_default: templateData.isDefault,
        customer_name: templateData.customerFields.customerName,
        billing_address: templateData.customerFields.billingAddress,
        shipping_address: templateData.customerFields.shippingAddress,
        phone: templateData.customerFields.phone,
        email: templateData.customerFields.email,
        account_number: templateData.customerFields.accountNumber,
        po_number: templateData.headerFields.poNumber,
        sales_rep: templateData.headerFields.salesRep,
        date: templateData.headerFields.Date,
        item_name: templateData.itemFields.itemName,
        quantity: templateData.itemFields.quantity,
        price: templateData.itemFields.price,
        type: templateData.itemFields.type,
        description: templateData.itemFields.description,
        subtotal: templateData.calculationFields.subtotal,
        tax: templateData.calculationFields.tax,
        discount: templateData.calculationFields.discount,
        due_amount: templateData.calculationFields.dueAmount,
      };

      const result = await createTemplate(templatePayload).unwrap();
      console.log("Template created successfully:", result);
      setTemplates((prev) => {
        const updated = prev.filter((t) => t.id !== currentTemplateId);
        return [
          ...updated,
          {
            id: uuidv4(),
            name: templateData.name,
            selectedColor,
            selectedLayout,
            logo,
            templateData,
          },
        ];
      });
      setCurrentTemplateId(uuidv4());
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTemplateData(template.templateData);
      setSelectedColor(template.selectedColor);
      setSelectedLayout(template.selectedLayout);
      setLogo(template.logo);
      setCurrentTemplateId(templateId);
    }
  };

  const handleSetDefault = () => {
    if (currentTemplateId) {
      localStorage.setItem("defaultTemplate", currentTemplateId);
      setDefaultTemplateId(currentTemplateId);
    }
  };

  const handleNewTemplate = () => {
    setCurrentTemplateId(null);
    setTemplateData({
      ...templateData,
      name: "New Template " + (templates.length + 1),
      isDefault: false,
    });

    setSelectedColor("#4E4E56");
    setSelectedLayout("modern");
    setLogo(null);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Configuration */}
      <div className="w-[600px] border-r bg-white p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Template Manager</h1>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Select
            value={currentTemplateId || ""}
            onValueChange={handleSelectTemplate}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Template">
                {currentTemplateId
                  ? templates.find((t) => t.id === currentTemplateId)?.name
                  : "Select Template"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
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
                    {Object.entries(templateData.customerFields).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) =>
                              setTemplateData({
                                ...templateData,
                                customerFields: {
                                  ...templateData.customerFields,
                                  [key]: checked as boolean,
                                },
                              })
                            }
                          />
                          <label
                            htmlFor={key}
                            className="text-sm leading-none capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Header Fields */}
                <div className="space-y-2">
                  <Label>Header</Label>
                  <div className="space-y-2">
                    {Object.entries(templateData.headerFields).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) =>
                              setTemplateData({
                                ...templateData,
                                headerFields: {
                                  ...templateData.headerFields,
                                  [key]: checked as boolean,
                                },
                              })
                            }
                          />
                          <label
                            htmlFor={key}
                            className="text-sm leading-none capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Item Fields */}
                <div className="space-y-2">
                  <Label>Item</Label>
                  <div className="space-y-2">
                    {Object.entries(templateData.itemFields).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) =>
                              setTemplateData({
                                ...templateData,
                                itemFields: {
                                  ...templateData.itemFields,
                                  [key]: checked as boolean,
                                },
                              })
                            }
                          />
                          <label
                            htmlFor={key}
                            className="text-sm leading-none capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/*Calculation Fields */}
                <div className="space-y-2">
                  <Label>Calculation</Label>
                  <div className="space-y-2">
                    {Object.entries(templateData.calculationFields).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) =>
                              setTemplateData({
                                ...templateData,
                                calculationFields: {
                                  ...templateData.calculationFields,
                                  [key]: checked as boolean,
                                },
                              })
                            }
                          />
                          <label
                            htmlFor={key}
                            className="text-sm leading-none capitalize"
                          >
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/*Footer Note */}
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
          templateData={templateData}
        />
      </div>
    </div>
  );
}
