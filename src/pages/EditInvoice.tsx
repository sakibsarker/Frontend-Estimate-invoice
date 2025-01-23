"use client";

import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InvoicePreview } from "@/components/InvoicePreview/InvoicePreview";

const layouts = [
  {
    id: "impact",
    name: "Impact",
    image: "/placeholder.svg?height=100&width=80",
  },
  {
    id: "classic",
    name: "Classic",
    image: "/placeholder.svg?height=100&width=80",
  },
  {
    id: "minimal",
    name: "Minimal",
    image: "/placeholder.svg?height=100&width=80",
  },
  {
    id: "modern",
    name: "Modern",
    image: "/placeholder.svg?height=100&width=80",
  },
];

const colors = [
  ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF"],
  ["#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC", "#FFE6E6"],
  ["#00FF00", "#33FF33", "#66FF66", "#99FF99", "#CCFFCC", "#E6FFE6"],
  ["#0000FF", "#3333FF", "#6666FF", "#9999FF", "#CCCCFF", "#E6E6FF"],
];

export default function EditInvoice() {
  const [selectedColor, setSelectedColor] = useState("#4E4E56");
  const [selectedLayout, setSelectedLayout] = useState("modern");
  const [logo, setLogo] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState({
    name: "Untitled",
    isDefault: false,
    businessInfo: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
    customerFields: {
      billingAddress: true,
      shippingAddress: true,
      phone: true,
      email: true,
      accountNumber: true,
    },
    headerFields: {
      paymentTerms: true,
      dueDate: true,
      poNumber: true,
      salesRep: true,
    },
    itemFields: {
      date: true,
      itemName: true,
      quantity: true,
      price: true,
    },
  });

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

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Configuration */}
      <div className="w-[600px] border-r bg-white p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">New Template</h1>
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={templateData.name}
              onChange={(e) =>
                setTemplateData({ ...templateData, name: e.target.value })
              }
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={templateData.isDefault}
                onCheckedChange={(checked) =>
                  setTemplateData({
                    ...templateData,
                    isDefault: checked as boolean,
                  })
                }
              />
              <label
                htmlFor="isDefault"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set as my default template
              </label>
            </div>
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
                          <img
                            src={layout.image || "/placeholder.svg"}
                            alt={layout.name}
                            className="mb-2 w-full"
                          />
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
                  {/* Business Info */}
                  <div className="space-y-2">
                    <Label>Your business info</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Company profile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profile1">
                          Company Profile 1
                        </SelectItem>
                        <SelectItem value="profile2">
                          Company Profile 2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2">
                    <Label>Customer info</Label>
                    <div className="space-y-2">
                      {Object.entries(templateData.customerFields).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2"
                          >
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
                          <div
                            key={key}
                            className="flex items-center space-x-2"
                          >
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
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Add field
                    </Button>
                  </div>

                  {/* Item Fields */}
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <div className="space-y-2">
                      {Object.entries(templateData.itemFields).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center space-x-2"
                          >
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
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Column
                    </Button>
                  </div>

                  {/* Subtotal & Footer */}
                  <div className="space-y-2">
                    <Label>Subtotal & Footer</Label>
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
