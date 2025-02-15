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
  const [price, setPrice] = useState("");
  const [taxApplied, setTaxApplied] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountId, setDiscountId] = useState("");
  const [type, setType] = useState<"LABOR" | "PARTS" | "OTHER">("PARTS");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/new-item/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            item_name: itemName,
            price: parseFloat(price),
            tax_applied: taxApplied,
            tax: taxApplied ? parseInt(taxId) : null,
            discount_applied: discountApplied,
            discount: discountApplied ? parseInt(discountId) : null,
            type: type,
          }),
        }
      );

      if (response.ok) {
        toast.success("Item created successfully!");
        // Reset all fields
        setItemName("");
        setPrice("");
        setTaxApplied(false);
        setTaxId("");
        setDiscountApplied(false);
        setDiscountId("");
        setType("PARTS");
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
                  <div className="space-y-2">
                    <Label htmlFor="type">Item Type *</Label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value as "LABOR" | "PARTS" | "OTHER")
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="PARTS">Parts</option>
                      <option value="LABOR">Labor</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input
                      id="itemName"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g., Premium Windshield Wiper"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 24.99"
                    />
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
