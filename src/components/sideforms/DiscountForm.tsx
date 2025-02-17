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
import { useCreateDiscountMutation } from "@/features/server/discountSlice";

interface DiscountFormProps {
  open: boolean;
  onClose: () => void;
}

export function DiscountForm({ open, onClose }: DiscountFormProps) {
  const [discountName, setDiscountName] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [createDiscount, { isLoading }] = useCreateDiscountMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("discount_name", discountName);
      formData.append("discount_rate", discountRate);

      await createDiscount(formData).unwrap();

      toast.success("Discount created successfully!");
      setDiscountName("");
      setDiscountRate("");
      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || "Error creating discount");
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
                <SheetTitle>New Discount</SheetTitle>
              </div>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="discountName">Discount Name</Label>
                    </div>
                    <Input
                      id="discountName"
                      value={discountName}
                      onChange={(e) => setDiscountName(e.target.value)}
                      placeholder="e.g., Early Bird Special"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="discountRate">Discount Rate (%)</Label>
                    </div>
                    <Input
                      id="discountRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(e.target.value)}
                      placeholder="e.g., 10.00"
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
                  {isLoading ? "Creating..." : "Create Discount"}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
