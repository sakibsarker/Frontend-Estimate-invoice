"use client";

import { useState } from "react";
import { X, MoreVertical, Trash2, Plus, UserPlus } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerForm } from "../sideforms/CustomerForm";
import { ItemForm } from "../sideforms/ItemForm";
import { TaxForm } from "../sideforms/TaxForm";
import { PaymentTermForm } from "../sideforms/PaymentTermForm";
import { useParams } from "react-router";
import { DiscountForm } from "../sideforms/DiscountForm";
import { LaborForm } from "../sideforms/LaborForm";
import { OtherChargeForm } from "../sideforms/OtherChargeForm";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
  hasTax: boolean;
}

export default function NewInvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, price: 0, hasTax: false },
  ]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [taxSearch, setTaxSearch] = useState("");
  const [otherChargeSearch, setOtherChargeSearch] = useState("");
  const [discountSearch, setDiscountSearch] = useState("");
  const [laborSearch, setLaborSearch] = useState("");
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [showLaborForm, setShowLaborForm] = useState(false);
  const [showOtherChargeForm, setShowOtherChargeForm] = useState(false);
  const [showPaymentTermForm, setShowPaymentTermForm] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const { estimateId } = useParams<{ estimateId: string }>();

  console.log(estimateId);

  const addNewRow = () => {
    const newId = items.length + 1;
    setItems([
      ...items,
      { id: newId, description: "", quantity: 1, price: 0, hasTax: false },
    ]);
  };

  const removeRow = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="flex-1 p-8 border-r overflow-y-auto pb-20">
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-2xl font-semibold">New invoice</h1>
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-8">
          {/* Customer Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Label className="text-sm font-medium text-red-500 mr-2">*</Label>
              <Label>Customer</Label>
            </div>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Search customers"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="flex-1"
              />
              {customerSearch && (
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start flex items-center gap-2"
                  onClick={() => setShowCustomerForm(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  Add New Customer
                </Button>
              )}
            </div>
          </div>

          {/* Invoice Details Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Estimate details</h2>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Estimate number</Label>
                </div>
                <Input defaultValue="001" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Estimate date</Label>
                </div>
                <Input type="date" defaultValue="2025-01-07" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Expiration date</Label>
                </div>
                <Input type="date" defaultValue="2025-01-07" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Sales rep</Label>
                </div>
                <Input />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Items</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="space-y-4">
                  <div className="w-8 text-center font-bold">{item.id}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex-1">
                        <Input
                          placeholder="Search items"
                          value={itemSearch}
                          onChange={(e) => setItemSearch(e.target.value)}
                          className="w-full"
                        />
                        {itemSearch && (
                          <div className="mt-2 bg-white border rounded-lg p-4 shadow-sm">
                            <div className="text-sm text-gray-500 mb-2">
                              No items found
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full flex items-center justify-center gap-2"
                              onClick={() => setShowItemForm(true)}
                            >
                              <Plus className="h-4 w-4" />
                              Add Item
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Input placeholder="Description" />
                  <div className="grid grid-cols-8 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label className="text-sm font-medium text-red-500 mr-2">
                          *
                        </Label>
                        <Label>Quantity</Label>
                      </div>
                      <Input type="number" defaultValue="1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label className="text-sm font-medium text-red-500 mr-2">
                          *
                        </Label>
                        <Label>Price</Label>
                      </div>
                      <Input type="number" defaultValue="0.00" />
                    </div>
                    <div className="space-y-3">
                      <Label>Paid</Label>
                      <div className="flex items-center">
                        <Checkbox id={`tax-${item.id}`} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Tax</Label>
                      <div className="flex items-center">
                        <Checkbox id={`tax-${item.id}`} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Labor</Label>
                      <div className="flex items-center">
                        <Checkbox id={`tax-${item.id}`} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Other Charge</Label>
                      <div className="flex items-center">
                        <Checkbox id={`tax-${item.id}`} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Discount</Label>
                      <div className="flex items-center">
                        <Checkbox id={`tax-${item.id}`} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <div className="flex items-center justify-between">
                        <span>$0.00</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => removeRow(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={addNewRow}
            >
              Add Row
            </Button>

            <div className="space-y-4 mt-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Tax</span>
                <div className="w-[200px]">
                  <Input
                    placeholder="Search tax rates"
                    value={taxSearch}
                    onChange={(e) => setTaxSearch(e.target.value)}
                  />
                  {taxSearch && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 flex items-center gap-2"
                      onClick={() => setShowTaxForm(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add New Tax Rate
                    </Button>
                  )}
                </div>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Labor Charge</span>
                <div className="w-[200px]">
                  <Input
                    placeholder="Search labor charge"
                    value={laborSearch}
                    onChange={(e) => setLaborSearch(e.target.value)}
                  />
                  {laborSearch && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 flex items-center gap-2"
                      onClick={() => setShowLaborForm(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add New Labor Charge
                    </Button>
                  )}
                </div>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Other Charge</span>
                <div className="w-[200px]">
                  <Input
                    placeholder="Search other charge"
                    value={otherChargeSearch}
                    onChange={(e) => setOtherChargeSearch(e.target.value)}
                  />
                  {otherChargeSearch && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 flex items-center gap-2"
                      onClick={() => setShowOtherChargeForm(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add New Other Charge
                    </Button>
                  )}
                </div>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount</span>
                <div className="w-[200px]">
                  <Input
                    placeholder="Search discount rates"
                    value={discountSearch}
                    onChange={(e) => setDiscountSearch(e.target.value)}
                  />
                  {discountSearch && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 flex items-center gap-2"
                      onClick={() => setShowDiscountForm(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add New Discount Rate
                    </Button>
                  )}
                </div>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span>Total</span>
                <span>$0.00</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Credit</span>
                <div className="text-right">
                  <Input
                    type="number"
                    defaultValue="0.00"
                    className="text-right w-[200px]"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    Total available: $0.00
                  </div>
                </div>
              </div>

              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Amount due</span>
                <span>$0.00</span>
              </div>
            </div>

            {/* Message and Attachments in one row */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="space-y-2">
                <Label>Message on invoice</Label>
                <Textarea
                  placeholder="Enter a message that will be displayed on the invoice"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center h-[160px] flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="text-sm text-gray-600">
                    Drag and drop or upload files
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG, CSV, XLS, XLSX
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
          <div className="flex items-center justify-between max-w-[50%]">
            <div className="text-lg font-semibold">
              Amount due: <span className="text-xl">$0.00</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Hide Preview</Button>
              <Button variant="outline">Save Draft</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Review & Send
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <CustomerForm
        open={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
      />
      <ItemForm open={showItemForm} onClose={() => setShowItemForm(false)} />
      <TaxForm open={showTaxForm} onClose={() => setShowTaxForm(false)} />
      <DiscountForm
        open={showDiscountForm}
        onClose={() => setShowDiscountForm(false)}
      />
      <LaborForm open={showLaborForm} onClose={() => setShowLaborForm(false)} />
      <OtherChargeForm
        open={showOtherChargeForm}
        onClose={() => setShowOtherChargeForm(false)}
      />
      <PaymentTermForm
        open={showPaymentTermForm}
        onClose={() => setShowPaymentTermForm(false)}
      />
    </div>
  );
}
