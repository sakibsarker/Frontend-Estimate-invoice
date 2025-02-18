"use client";

import { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  UserPlus,
  SquarePlus,
  Pencil,
  ChevronsUpDown,
} from "lucide-react";
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
import { EditCustomerForm } from "../sideforms/EditCustomerForm";
import { useGetCustomersQuery } from "@/features/server/customerSlice";
import { useGetTaxsQuery } from "@/features/server/taxSlice";
import { useGetDiscountsQuery } from "@/features/server/discountSlice";
import { useGetItemsQuery } from "@/features/server/itemSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateInvoiceMutation } from "@/features/server/invoiceSlice";
import { useGetRepairRequestByIDQuery } from "@/features/server/repairRequestSlice";

import { toast } from "react-hot-toast";

interface InvoiceItem {
  id: number;
  type: "labor" | "parts" | "other";
  selectedItemId: number | null;
  description: string;
  quantity: number;
  price: number;
  hasTax: boolean;
  hasDiscount: boolean;
  paid: boolean;
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function NewInvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      type: "labor",
      selectedItemId: null,
      description: "",
      quantity: 1,
      price: 0,
      hasTax: true,
      hasDiscount: true,
      paid: true,
    },
    {
      id: 2,
      type: "parts",
      selectedItemId: null,
      description: "",
      quantity: 1,
      price: 0,
      hasTax: true,
      hasDiscount: true,
      paid: true,
    },
    {
      id: 3,
      type: "other",
      selectedItemId: null,
      description: "",
      quantity: 1,
      price: 0,
      hasTax: true,
      hasDiscount: true,
      paid: true,
    },
  ]);
  const { estimateId } = useParams<{ estimateId: string }>();
  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [showLaborForm, setShowLaborForm] = useState(false);
  const [showOtherChargeForm, setShowOtherChargeForm] = useState(false);
  const [showPaymentTermForm, setShowPaymentTermForm] = useState(false);
  // redux query for data fetch
  const { data: customers = [] } = useGetCustomersQuery();
  const { data: itemsList = [] } = useGetItemsQuery();
  const { data: taxes = [] } = useGetTaxsQuery();
  const { data: discounts = [] } = useGetDiscountsQuery();
  const { data: estimateData } = useGetRepairRequestByIDQuery(
    Number(estimateId)
  );

  const [selectedTax, setSelectedTax] = useState<number | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [editShowCustomer, setEditShowCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [taxSearch, setTaxSearch] = useState("");
  const [discountSearch, setDiscountSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [salesRep, setSalesRep] = useState("");

  const addNewRow = () => {
    const newItem: InvoiceItem = {
      id: items.length + 1,
      type: "parts",
      selectedItemId: null,
      description: "",
      quantity: 1,
      price: 0,
      hasTax: true,
      hasDiscount: true,
      paid: true,
    };

    setItems([...items, newItem]);
  };

  const removeRow = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemSelect = (itemId: number, selectedValue: string) => {
    if (selectedValue === "add-item") {
      setShowItemForm(true);
      return;
    }

    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const selectedItem = itemsList.find(
            (i) => i.id.toString() === selectedValue
          );
          return {
            ...item,
            selectedItemId: Number(selectedValue),
            price: selectedItem ? selectedItem.price : 0,
            description: selectedItem?.description || "",
          };
        }
        return item;
      })
    );
  };

  const calculateRowTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.price;
    let total = subtotal;

    if (item.hasTax && selectedTax) {
      const taxRate = taxes.find((t) => t.id === selectedTax)?.tax_rate || 0;
      total += subtotal * (taxRate / 100);
    }

    if (item.hasDiscount && selectedDiscount) {
      const discountRate =
        discounts.find((d) => d.id === selectedDiscount)?.discount_rate || 0;
      total -= subtotal * (discountRate / 100);
    }

    return total.toFixed(2);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const rowTotal = calculateRowTotal(item);
      return total + parseFloat(rowTotal);
    }, 0);
  };

  const calculateAmountDue = () => {
    return items.reduce((total, item) => {
      if (!item.paid) {
        return total + parseFloat(calculateRowTotal(item));
      }
      return total;
    }, 0);
  };

  const handleSaveDraft = async () => {
    const toastId = toast.loading("Saving draft...");
    try {
      if (!selectedCustomer) throw new Error("Customer selection is required");
      if (items.length === 0) throw new Error("At least one item is required");

      const formData = new FormData();

      // 1. Create nested JSON structure for invoice_items
      const invoiceItems = items.map((item) => ({
        item_id: item.selectedItemId,
        quantity: item.quantity,
        price: Number(Number(item.price).toFixed(2)),
        has_tax: item.hasTax,
        has_discount: item.hasDiscount,
        paid: item.paid,
      }));

      // 2. Append as JSON string
      formData.append("invoice_items", JSON.stringify(invoiceItems));

      // 3. Append other fields
      formData.append("customerId", selectedCustomer.toString());
      formData.append("invoice_status", "DRAFT");
      formData.append("payment_method", "CREDIT_CARD");
      formData.append("po_number", "PO-12345");

      // Optional fields
      if (estimateId) formData.append("repair_request", estimateId);
      if (selectedDiscount)
        formData.append("discount", selectedDiscount.toString());
      if (selectedTax) formData.append("tax", selectedTax.toString());
      if (salesRep) formData.append("sales_rep", salesRep);
      if (message) formData.append("message_on_invoice", message);

      // 4. Add attachments
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await createInvoice(formData).unwrap();
      toast.success("Draft saved successfully!", { id: toastId });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save draft";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="flex-1 p-8 border-r overflow-y-auto pb-20">
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-2xl font-semibold">New Estimate Invoice</h1>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedCustomer
                        ? customers.find((c) => c.id === selectedCustomer)
                            ?.customer_display_name
                        : "Select customer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search customers..."
                        value={customerSearch}
                        onValueChange={setCustomerSearch}
                      />
                      <CommandList>
                        <CommandEmpty>No customers found.</CommandEmpty>
                        <CommandGroup>
                          {customers
                            .filter((customer) =>
                              customer.customer_display_name
                                ?.toLowerCase()
                                .includes(customerSearch.toLowerCase())
                            )
                            .map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={customer.customer_display_name}
                                onSelect={() =>
                                  setSelectedCustomer(customer.id)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCustomer === customer.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {customer.customer_display_name}
                                <span className="text-xs text-muted-foreground">
                                  #{customer.email_address}
                                </span>
                              </CommandItem>
                            ))}
                          <CommandItem
                            value="add-customer"
                            onSelect={() => setShowCustomerForm(true)}
                            className="text-indigo-600"
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add New Customer
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                      Contact Name
                    </Label>
                    <p className="font-medium">
                      {customers.find((c) => c.id === selectedCustomer)
                        ?.contact_first_name || "N/A"}{" "}
                      {customers.find((c) => c.id === selectedCustomer)
                        ?.contact_last_name || ""}
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
                        ?.email_address || "N/A"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                  onClick={() => setEditShowCustomer(true)}
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
                <Input
                  value={estimateId}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Estimate date</Label>
                </div>
                <Input
                  type="date"
                  defaultValue={
                    estimateData?.created_at
                      ? formatDate(estimateData.created_at)
                      : ""
                  }
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Expiration date</Label>
                </div>

                <Input
                  type="date"
                  defaultValue={
                    estimateData?.created_at
                      ? formatDate(estimateData.repair_date)
                      : ""
                  }
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label className="text-sm font-medium text-red-500 mr-2">
                    *
                  </Label>
                  <Label>Sales rep</Label>
                </div>
                <Input
                  value={salesRep}
                  onChange={(e) => setSalesRep(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Items</h2>
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={item.id} className="space-y-4">
                  <div className="text-left font-semibold">
                    Item-{index + 1}
                  </div>
                  <div className="flex gap-4 items-center">
                    {/* Type Selector */}
                    <div className="space-y-1">
                      <Label className="text-sm font-medium block">Type</Label>
                      <Select
                        value={item.type}
                        onValueChange={(value: "labor" | "parts" | "other") =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id ? { ...i, type: value } : i
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="parts">Parts</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search Items */}
                    <div className="flex-1">
                      <Label className="text-sm font-medium mb-1 block">
                        Item
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {item.selectedItemId
                              ? itemsList.find(
                                  (i) => i.id === item.selectedItemId
                                )?.item_name
                              : "Search items..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search items..."
                              value={itemSearch}
                              onValueChange={setItemSearch}
                            />
                            <CommandList>
                              <CommandEmpty>No items found.</CommandEmpty>
                              <CommandGroup>
                                {itemsList
                                  .filter(
                                    (listItem) =>
                                      listItem.type ===
                                        item.type.toUpperCase() &&
                                      listItem.item_name
                                        .toLowerCase()
                                        .includes(itemSearch.toLowerCase())
                                  )
                                  .map((listItem) => (
                                    <CommandItem
                                      key={listItem.id}
                                      value={listItem.item_name}
                                      onSelect={() =>
                                        handleItemSelect(
                                          item.id,
                                          listItem.id.toString()
                                        )
                                      }
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          item.selectedItemId === listItem.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <div className="flex justify-between w-full">
                                        <span>{listItem.item_name}</span>
                                        <span>${listItem.price}</span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                <CommandItem
                                  value="add-item"
                                  onSelect={() => setShowItemForm(true)}
                                  className="text-indigo-600"
                                >
                                  <SquarePlus className="mr-2 h-4 w-4" />
                                  Add New Item
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                      <Label className="text-sm font-medium mb-1 block">
                        Description
                      </Label>
                      <Input
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
                    </div>

                    {/* Quantity */}
                    <div>
                      <Label className="text-sm font-medium mb-1 block">
                        Quantity
                      </Label>
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
                        className="w-20"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <Label className="text-sm font-medium mb-1 block">
                        Price
                      </Label>
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
                        className="w-32"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm font-medium block">Tax</Label>
                      <Checkbox
                        checked={item.hasTax}
                        onCheckedChange={(checked) =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id ? { ...i, hasTax: !!checked } : i
                            )
                          )
                        }
                        className="h-5 w-5 rounded-md border-2 border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm font-medium block">
                        Discount
                      </Label>
                      <Checkbox
                        checked={item.hasDiscount}
                        onCheckedChange={(checked) =>
                          setItems(
                            items.map((i) =>
                              i.id === item.id
                                ? { ...i, hasDiscount: !!checked }
                                : i
                            )
                          )
                        }
                        className="h-5 w-5 rounded-md border-2 border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </div>

                    {/* Total & Delete */}
                    <div className="space-y-1">
                      <Label className="text-sm font-medium block">Total</Label>
                      <div className="flex items-center gap-2 w-[140px]">
                        <div className="flex-1">
                          <Label>${calculateRowTotal(item)}</Label>
                        </div>
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

            <div className="flex gap-4 items-center">
              <Button
                onClick={addNewRow}
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-[1fr_200px_1fr] items-center gap-4">
                <span>Tax</span>
                <div className="w-[200px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedTax
                          ? taxes.find((t) => t.id === selectedTax)?.tax_name
                          : "Select tax..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search taxes..."
                          value={taxSearch}
                          onValueChange={setTaxSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No taxes found.</CommandEmpty>
                          <CommandGroup>
                            {taxes
                              .filter((tax) =>
                                tax.tax_name
                                  .toLowerCase()
                                  .includes(taxSearch.toLowerCase())
                              )
                              .map((tax) => (
                                <CommandItem
                                  key={tax.id}
                                  value={tax.tax_name}
                                  onSelect={() => setSelectedTax(tax.id)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedTax === tax.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {tax.tax_name} ({tax.tax_rate}%)
                                </CommandItem>
                              ))}
                            <CommandItem
                              value="add-tax"
                              onSelect={() => setShowTaxForm(true)}
                              className="text-indigo-600"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Tax Rate
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <span className="text-right">
                  {selectedTax
                    ? `${
                        taxes.find((t) => t.id === selectedTax)?.tax_rate || 0
                      }%`
                    : "0%"}
                </span>
              </div>

              <div className="grid grid-cols-[1fr_200px_1fr] items-center gap-4">
                <span>Discount</span>
                <div className="w-[200px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedDiscount
                          ? discounts.find((d) => d.id === selectedDiscount)
                              ?.discount_name
                          : "Select discount..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search discounts..."
                          value={discountSearch}
                          onValueChange={setDiscountSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No discounts found.</CommandEmpty>
                          <CommandGroup>
                            {discounts
                              .filter((discount) =>
                                discount.discount_name
                                  .toLowerCase()
                                  .includes(discountSearch.toLowerCase())
                              )
                              .map((discount) => (
                                <CommandItem
                                  key={discount.id}
                                  value={discount.discount_name}
                                  onSelect={() =>
                                    setSelectedDiscount(discount.id)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedDiscount === discount.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {discount.discount_name} (
                                  {discount.discount_rate}%)
                                </CommandItem>
                              ))}
                            <CommandItem
                              value="add-discount"
                              onSelect={() => setShowDiscountForm(true)}
                              className="text-indigo-600"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Discount
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <span className="text-right">
                  {selectedDiscount
                    ? `${
                        discounts.find((d) => d.id === selectedDiscount)
                          ?.discount_rate || 0
                      }%`
                    : "0%"}
                </span>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Amount due</span>
                <span>${calculateAmountDue().toFixed(2)}</span>
              </div>
            </div>

            {/* Message and Attachments in one row */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="space-y-2">
                <Label>Message on invoice</Label>
                <Textarea
                  placeholder="Enter a message that will be displayed on the invoice"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center h-[160px] flex flex-col items-center justify-center relative"
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setAttachments((prev) => [...prev, ...files]);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setAttachments((prev) => [
                          ...new Set([...prev, ...files]),
                        ]);
                      }
                    }}
                  />
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
                {attachments.length > 0 && (
                  <div className="text-sm mt-2">
                    Attached files: {attachments.map((f) => f.name).join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-gray-100 p-5">
          <div className="flex items-center justify-between max-w-full">
            <div className="text-2xl font-semibold">
              Amount due:{" "}
              <span className="text-2xl font-bold">
                ${calculateAmountDue().toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="text-2xl p-2"
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                {isLoading ? "Saving" : "Save Draft"}
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
      <EditCustomerForm
        open={editShowCustomer}
        onClose={() => setEditShowCustomer(false)}
        customerId={selectedCustomer}
      />
    </div>
  );
}
