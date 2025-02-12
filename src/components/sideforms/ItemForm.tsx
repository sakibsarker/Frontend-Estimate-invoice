"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import toast, { Toaster } from "react-hot-toast";

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
}

export function ItemForm({ open, onClose }: ItemFormProps) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [taxApplied, setTaxApplied] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [laborCostApplied, setLaborCostApplied] = useState(false);
  const [laborCostId, setLaborCostId] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountId, setDiscountId] = useState("");
  const [otherChargeApplied, setOtherChargeApplied] = useState(false);
  const [otherChargeId, setOtherChargeId] = useState("");
  const [paid, setPaid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/iteams/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            item_name: itemName,
            description: description,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            tax_applied: taxApplied,
            tax: taxApplied ? parseInt(taxId) : null,
            labor_cost_applied: laborCostApplied,
            labor_cost: laborCostApplied ? parseInt(laborCostId) : null,
            discount_applied: discountApplied,
            discount: discountApplied ? parseInt(discountId) : null,
            other_charge_applied: otherChargeApplied,
            other_charge: otherChargeApplied ? parseInt(otherChargeId) : null,
            paid: paid,
          }),
        }
      );

      if (response.ok) {
        toast.success("Item created successfully!");
        // Reset all fields
        setItemName("");
        setDescription("");
        setQuantity("");
        setPrice("");
        setTaxApplied(false);
        setTaxId("");
        setLaborCostApplied(false);
        setLaborCostId("");
        setDiscountApplied(false);
        setDiscountId("");
        setOtherChargeApplied(false);
        setOtherChargeId("");
        setPaid(false);
        onClose();
      } else {
        throw new Error("Failed to create item");
      }
    } catch (error) {
      toast.error("Error creating item");
    }
  };

  return (
    <>
      <Toaster />
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px] p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="p-6 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle>New Inventory Item</SheetTitle>
              </div>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input
                      id="itemName"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g., Professional Service"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Item description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g., 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Unit Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g., 110.00"
                      />
                    </div>
                  </div>

                  {/* Tax Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={taxApplied}
                        onChange={(e) => setTaxApplied(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <Label className="text-sm font-medium">Apply Tax</Label>
                    </div>
                    {taxApplied && (
                      <Input
                        placeholder="Tax ID"
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>

                  {/* Labor Cost Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={laborCostApplied}
                        onChange={(e) => setLaborCostApplied(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <Label className="text-sm font-medium">
                        Apply Labor Cost
                      </Label>
                    </div>
                    {laborCostApplied && (
                      <Input
                        placeholder="Labor Cost ID"
                        value={laborCostId}
                        onChange={(e) => setLaborCostId(e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>

                  {/* Discount Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={discountApplied}
                        onChange={(e) => setDiscountApplied(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <Label className="text-sm font-medium">
                        Apply Discount
                      </Label>
                    </div>
                    {discountApplied && (
                      <Input
                        placeholder="Discount ID"
                        value={discountId}
                        onChange={(e) => setDiscountId(e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>

                  {/* Other Charges Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={otherChargeApplied}
                        onChange={(e) =>
                          setOtherChargeApplied(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <Label className="text-sm font-medium">
                        Apply Other Charges
                      </Label>
                    </div>
                    {otherChargeApplied && (
                      <Input
                        placeholder="Other Charge ID"
                        value={otherChargeId}
                        onChange={(e) => setOtherChargeId(e.target.value)}
                        className="mt-1"
                      />
                    )}
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={paid}
                      onChange={(e) => setPaid(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <Label className="text-sm font-medium">Mark as Paid</Label>
                  </div>
                </div>
              </div>
              <div className="border-t p-6 mt-auto">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full bg-indigo-600 text-white hover:text-gray-300 hover:bg-indigo-800"
                  size="lg"
                >
                  Create Item
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
