"use client";

import { useState } from "react";
import { X, MoreVertical, Trash2, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
  hasTax: boolean;
}

export default function NewManualInvoiceForm() {
  const [frequency, setFrequency] = useState("one-time");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, price: 0, hasTax: false },
  ]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [taxSearch, setTaxSearch] = useState("");
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [showPaymentTermForm, setShowPaymentTermForm] = useState(false);

  const [customerSearch, setCustomerSearch] = useState("");

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

  const RecurringFields = () => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="space-y-2">
        <Label>Billing interval</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Start date</Label>
        <Input type="date" />
      </div>
      <div className="space-y-2">
        <Label>End date (optional)</Label>
        <Input type="date" />
      </div>
      <div className="space-y-2">
        <Label>Billing cycles (optional)</Label>
        <Input type="number" placeholder="Unlimited if left blank" />
      </div>
    </div>
  );

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
            <h2 className="text-lg font-semibold">Invoice details</h2>

            <div className="space-y-2">
              <Label>Invoice frequency</Label>
              <RadioGroup
                value={frequency}
                onValueChange={setFrequency}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time">One-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Recurring</Label>
                </div>
              </RadioGroup>
            </div>

            {frequency === "recurring" && <RecurringFields />}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Invoice number</Label>
                </div>
                <Input defaultValue="001" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>
                    {frequency === "recurring"
                      ? "First invoice date"
                      : "Invoice date"}
                  </Label>
                </div>
                <Input type="date" defaultValue="2025-01-07" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="paymentTerms"
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setShowPaymentTermForm(true)}
                >
                  Payment terms
                </Label>
                <div className="flex flex-col gap-2">
                  <Select
                    value="paymentTerms"
                    onValueChange={(value) => {
                      if (value === "add") {
                        setShowPaymentTermForm(true);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                      <SelectItem value="add">Add Payment Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Due date</Label>
                </div>
                <Input type="date" defaultValue="2025-01-07" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sales rep</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>PO number</Label>
                <Input />
              </div>
            </div>

            <Button variant="link" className="text-indigo-600 p-0">
              Add custom field
            </Button>
          </div>

          {/* Items Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Items</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center">{item.id}</div>
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
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => removeRow(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Input placeholder="Description" />
                  <div className="grid grid-cols-4 gap-4">
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
                    <div className="space-y-2">
                      <Label>Tax</Label>
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

      {/* Preview Section */}
      <div className="w-[600px] bg-gray-50 p-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold">Auto Gig Shop</h2>
              <p className="text-sm text-gray-500">Bill to</p>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <div className="flex items-center justify-end gap-4">
                  <span className="text-sm text-gray-500">Invoice</span>
                  <span>001</span>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <span className="text-sm text-gray-500">Date</span>
                  <span>Jan 07, 2025</span>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <span className="text-sm text-gray-500">Terms</span>
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    + Add Payment Term
                  </Button>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <span className="text-sm text-gray-500">Due date</span>
                  <span>Jan 07, 2025</span>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <span className="text-sm text-gray-500">Amount due</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-right">Price</th>
                <th className="py-2 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4">1</td>
                <td className="py-2 px-4 text-right">$0.00</td>
                <td className="py-2 px-4 text-right">$0.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t">
                <td colSpan={2} className="py-2 px-4 text-right">
                  Subtotal
                </td>
                <td className="py-2 px-4 text-right">$0.00</td>
              </tr>
              <tr>
                <td colSpan={2} className="py-2 px-4 text-right">
                  Total
                </td>
                <td className="py-2 px-4 text-right">$0.00</td>
              </tr>
              <tr>
                <td colSpan={2} className="py-2 px-4 text-right">
                  Paid
                </td>
                <td className="py-2 px-4 text-right">$0.00</td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-4 bg-black text-white p-4 flex justify-between items-center">
            <span>Amount due</span>
            <span>$0.00</span>
          </div>
        </div>
      </div>
      <CustomerForm
        open={showCustomerForm}
        onClose={() => setShowCustomerForm(false)}
      />
      <ItemForm open={showItemForm} onClose={() => setShowItemForm(false)} />
      <TaxForm open={showTaxForm} onClose={() => setShowTaxForm(false)} />
      <PaymentTermForm
        open={showPaymentTermForm}
        onClose={() => setShowPaymentTermForm(false)}
      />
    </div>
  );
}
