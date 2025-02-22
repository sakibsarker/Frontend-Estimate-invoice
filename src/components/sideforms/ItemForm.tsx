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
import { useCreateItemMutation } from "@/features/server/itemSlice";

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
}

export function ItemForm({ open, onClose }: ItemFormProps) {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [type, setType] = useState<"LABOR" | "PARTS" | "OTHER">("PARTS");

  const [createItem, { isLoading }] = useCreateItemMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("item_name", itemName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("type", type);

      await createItem(formData).unwrap();

      toast.success("Item created successfully!");
      // Reset all fields
      setItemName("");
      setDescription("");
      setPrice("");

      setType("PARTS");
      onClose();
    } catch (error: any) {
      console.error("Error creating item:", error);
      toast.error(error.data?.message || "Error creating item");
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
                <SheetTitle>New Item</SheetTitle>
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
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Item description"
                      className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      rows={3}
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
                </div>
              </div>
              <div className="border-t p-6 mt-auto">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full bg-indigo-600 text-white hover:text-gray-300 hover:bg-indigo-800"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Item"}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
