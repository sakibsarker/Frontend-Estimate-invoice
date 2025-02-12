"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Plus, UserPlus, SquarePlus, Pencil } from "lucide-react";
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
  selectedItemId: number | null;
  description: string;
  quantity: number;
  price: number;
  hasTax: boolean;
}

export default function NewInvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      selectedItemId: null,
      description: "",
      quantity: 1,
      price: 0,
      hasTax: false,
    },
  ]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const [showItemForm, setShowItemForm] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [showLaborForm, setShowLaborForm] = useState(false);
  const [showOtherChargeForm, setShowOtherChargeForm] = useState(false);
  const [showPaymentTermForm, setShowPaymentTermForm] = useState(false);

  const { estimateId } = useParams<{ estimateId: string }>();
  const [taxes, setTaxes] = useState<
    Array<{ id: number; tax_name: string; tax_rate: string }>
  >([]);
  const [selectedTax, setSelectedTax] = useState<number | null>(null);
  const [laborCosts, setLaborCosts] = useState<
    Array<{ id: number; labor_cost_name: string; labor_cost_rate: string }>
  >([]);
  const [selectedLabor, setSelectedLabor] = useState<number | null>(null);
  const [otherCharges, setOtherCharges] = useState<
    Array<{ id: number; othercharges_name: string; othercharges_rate: string }>
  >([]);
  const [selectedOtherCharge, setSelectedOtherCharge] = useState<number | null>(
    null
  );
  const [discounts, setDiscounts] = useState<
    Array<{ id: number; discount_name: string; discount_rate: string }>
  >([]);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [customers, setCustomers] = useState<
    Array<{ id: number; username: string; phone_number: string; email: string }>
  >([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [itemsList, setItemsList] = useState<
    Array<{ id: number; item_name: string; price: string; description: string }>
  >([]);

  console.log(estimateId);

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/taxes/`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch taxes");
        const data = await response.json();
        setTaxes(data);
      } catch (error) {
        console.error("Error fetching taxes:", error);
      }
    };

    fetchTaxes();
  }, []);

  useEffect(() => {
    const fetchLaborCosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/labor-costs/`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch labor costs");
        const data = await response.json();
        setLaborCosts(data);
      } catch (error) {
        console.error("Error fetching labor costs:", error);
      }
    };

    fetchLaborCosts();
  }, []);

  useEffect(() => {
    const fetchOtherCharges = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/other-charges/`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch other charges");
        const data = await response.json();
        setOtherCharges(data);
      } catch (error) {
        console.error("Error fetching other charges:", error);
      }
    };
    fetchOtherCharges();
  }, []);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/discounts/`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch discounts");
        const data = await response.json();
        setDiscounts(data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };
    fetchDiscounts();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/list-repair-requests/`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/iteams/`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        setItemsList(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const addNewRow = () => {
    const newId = items.length + 1;
    setItems([
      ...items,
      {
        id: newId,
        selectedItemId: null,
        description: "",
        quantity: 1,
        price: 0,
        hasTax: false,
      },
    ]);
  };

  const removeRow = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemSelect = (itemId: number, selectedValue: string) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const selectedItem = itemsList.find(
            (i) => i.id.toString() === selectedValue
          );
          return {
            ...item,
            selectedItemId:
              selectedValue === "add-item" ? null : Number(selectedValue),
            price: selectedItem ? parseFloat(selectedItem.price) : 0,
            description: selectedItem?.description || "",
          };
        }
        return item;
      })
    );
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
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Select
                  value={selectedCustomer?.toString() || ""}
                  onValueChange={(value) => {
                    if (value === "add-customer") {
                      setShowCustomerForm(true);
                    } else {
                      setSelectedCustomer(Number(value));
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                      >
                        <div className="flex flex-col">
                          <span>{customer.username}</span>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="add-customer">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <UserPlus className="h-4 w-4" />
                        Add New Customer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowCustomerForm(true)}
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 h-auto py-2 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="text-xs whitespace-nowrap">
                  Add New Customer
                </span>
              </Button>
            </div>
          </div>

          {selectedCustomer && (
            <div className="bg-gray-50 p-4 rounded-md border">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-3 gap-4 flex-1">
                  <div>
                    <Label className="text-sm text-gray-500">
                      Customer Name
                    </Label>
                    <p className="font-medium">
                      {customers.find((c) => c.id === selectedCustomer)
                        ?.username || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      Phone Number
                    </Label>
                    <p className="font-medium">
                      {customers.find((c) => c.id === selectedCustomer)
                        ?.phone_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      Email Address
                    </Label>
                    <p className="font-medium">
                      {customers.find((c) => c.id === selectedCustomer)
                        ?.email || "N/A"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                  onClick={() => setShowCustomerForm(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}

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
                      <Select
                        value={item.selectedItemId?.toString() || ""}
                        onValueChange={(value) =>
                          handleItemSelect(item.id, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Search items" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemsList.map((listItem) => (
                            <SelectItem
                              key={listItem.id}
                              value={listItem.id.toString()}
                            >
                              <div className="flex justify-between w-full">
                                <span>{listItem.item_name}</span>
                                <span>${listItem.price}</span>
                              </div>
                            </SelectItem>
                          ))}
                          <SelectItem value="add-item">
                            <div className="flex items-center gap-2 text-indigo-600">
                              <SquarePlus className="h-4 w-4" />
                              Add New Item
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      setItems(
                        items.map((i) =>
                          i.id === item.id
                            ? { ...i, description: e.target.value }
                            : i
                        )
                      )
                    }
                  />
                  <div className="grid grid-cols-8 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label className="text-sm font-medium text-red-500 mr-2">
                          *
                        </Label>
                        <Label>Quantity</Label>
                      </div>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id
                                ? { ...i, quantity: Number(e.target.value) }
                                : i
                            )
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label className="text-sm font-medium text-red-500 mr-2">
                          *
                        </Label>
                        <Label>Price</Label>
                      </div>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id
                                ? { ...i, price: parseFloat(e.target.value) }
                                : i
                            )
                          )
                        }
                      />
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
              className="bg-indigo-600 text-white hover:text-gray-200 hover:bg-indigo-700"
              onClick={addNewRow}
            >
              Add Row
            </Button>

            <div className="space-y-4 mt-8">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>

              <div className="grid grid-cols-[1fr_200px_1fr] items-center gap-4">
                <span>Tax</span>
                <div className="w-[200px]">
                  <Select
                    value={selectedTax?.toString() || ""}
                    onValueChange={(value) => {
                      if (value === "add-tax") {
                        setShowTaxForm(true);
                      } else {
                        setSelectedTax(Number(value));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax rate" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxes.map((tax) => (
                        <SelectItem key={tax.id} value={tax.id.toString()}>
                          {tax.tax_name} ({tax.tax_rate}%)
                        </SelectItem>
                      ))}
                      <SelectItem value="add-tax">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Plus className="h-4 w-4" />
                          Add Tax Rate
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-right">
                  {selectedTax
                    ? `$${
                        taxes.find((t) => t.id === selectedTax)?.tax_rate || 0
                      }%`
                    : "$0.00"}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_200px_1fr] items-center gap-4">
                <span>Labor Charge</span>
                <div className="w-[200px]">
                  <Select
                    value={selectedLabor?.toString() || ""}
                    onValueChange={(value) => {
                      if (value === "add-labor") {
                        setShowLaborForm(true);
                      } else {
                        setSelectedLabor(Number(value));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select labor charge" />
                    </SelectTrigger>
                    <SelectContent>
                      {laborCosts.map((labor) => (
                        <SelectItem key={labor.id} value={labor.id.toString()}>
                          {labor.labor_cost_name} (${labor.labor_cost_rate}/hr)
                        </SelectItem>
                      ))}
                      <SelectItem value="add-labor">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Plus className="h-4 w-4" />
                          Add Labor Charge
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-right">
                  {selectedLabor
                    ? `$${
                        laborCosts.find((l) => l.id === selectedLabor)
                          ?.labor_cost_rate || 0
                      }`
                    : "$0.00"}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_200px_1fr] items-center gap-4">
                <span>Other Charge</span>
                <div className="w-[200px]">
                  <Select
                    value={selectedOtherCharge?.toString() || ""}
                    onValueChange={(value) => {
                      if (value === "add-other-charge") {
                        setShowOtherChargeForm(true);
                      } else {
                        setSelectedOtherCharge(Number(value));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select other charge" />
                    </SelectTrigger>
                    <SelectContent>
                      {otherCharges.map((charge) => (
                        <SelectItem
                          key={charge.id}
                          value={charge.id.toString()}
                        >
                          {charge.othercharges_name} ($
                          {charge.othercharges_rate})
                        </SelectItem>
                      ))}
                      <SelectItem value="add-other-charge">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Plus className="h-4 w-4" />
                          Add Other Charge
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-right">
                  {selectedOtherCharge
                    ? `$${
                        otherCharges.find((oc) => oc.id === selectedOtherCharge)
                          ?.othercharges_rate || 0
                      }`
                    : "$0.00"}
                </span>
              </div>
              <div className="grid grid-cols-[1fr_200px_1fr] items-center gap-4">
                <span>Discount</span>
                <div className="w-[200px]">
                  <Select
                    value={selectedDiscount?.toString() || ""}
                    onValueChange={(value) => {
                      if (value === "add-discount") {
                        setShowDiscountForm(true);
                      } else {
                        setSelectedDiscount(Number(value));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      {discounts.map((discount) => (
                        <SelectItem
                          key={discount.id}
                          value={discount.id.toString()}
                        >
                          {discount.discount_name} ({discount.discount_rate}%)
                        </SelectItem>
                      ))}
                      <SelectItem value="add-discount">
                        <div className="flex items-center gap-2 text-indigo-600">
                          <Plus className="h-4 w-4" />
                          Add Discount
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-right">
                  {selectedDiscount
                    ? `${
                        discounts.find((d) => d.id === selectedDiscount)
                          ?.discount_rate || 0
                      }%`
                    : "$0.00"}
                </span>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Total</span>
                <span>$0.00</span>
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
        <div className="fixed bottom-0 left-0 right-0 border-t bg-gray-100 p-5">
          <div className="flex items-center justify-between max-w-full">
            <div className="text-2xl font-semibold">
              Amount due: <span className="text-2xl font-bold">$0.00</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="text-2xl p-2">
                Save Draft
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-2xl p-2">
                Review & Send
              </Button>
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
