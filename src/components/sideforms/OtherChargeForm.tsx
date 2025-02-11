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

interface OtherChargeFormProps {
  open: boolean;
  onClose: () => void;
}

export function OtherChargeForm({ open, onClose }: OtherChargeFormProps) {
  const [chargeName, setChargeName] = useState("");
  const [chargeRate, setChargeRate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/other-charges/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            othercharges_name: chargeName,
            othercharges_rate: parseFloat(chargeRate),
          }),
        }
      );

      if (response.ok) {
        toast.success("Other charge created successfully!");
        setChargeName("");
        setChargeRate("");
        onClose();
      } else {
        throw new Error("Failed to create charge");
      }
    } catch (error) {
      toast.error("Error creating charge");
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
                <SheetTitle>New Other Charge</SheetTitle>
              </div>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="chargeName">Charge Name</Label>
                    </div>
                    <Input
                      id="chargeName"
                      value={chargeName}
                      onChange={(e) => setChargeName(e.target.value)}
                      placeholder="e.g., Service Fee"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="chargeRate">Charge Rate ($)</Label>
                    </div>
                    <Input
                      id="chargeRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={chargeRate}
                      onChange={(e) => setChargeRate(e.target.value)}
                      placeholder="e.g., 25.00"
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
                >
                  Create Other Charge
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
