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
import { useCreateTaxMutation } from "@/features/server/taxSlice";
import { useTranslation } from "react-i18next";
interface TaxFormProps {
  open: boolean;
  onClose: () => void;
}

export function TaxForm({ open, onClose }: TaxFormProps) {
  const [taxName, setTaxName] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [errors, setErrors] = useState({
    taxName: false,
    taxRate: false,
  });
  const { t } = useTranslation();

  const [createTax, { isLoading }] = useCreateTaxMutation();

  const validateForm = () => {
    const newErrors = {
      taxName: !taxName.trim(),
      taxRate:
        !taxRate.trim() || isNaN(Number(taxRate)) || Number(taxRate) <= 0,
    };
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      toast.error(t("error.fillRequiredFields"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("tax_name", taxName);
      formData.append("tax_rate", taxRate);

      await createTax(formData).unwrap();

      toast.success("Tax created successfully!");
      setTaxName("");
      setTaxRate("");
      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || "Error creating tax");
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
                <SheetTitle>{t("newTax")}</SheetTitle>
              </div>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="taxName">{t("taxName")}</Label>
                    </div>
                    <Input
                      id="taxName"
                      value={taxName}
                      onChange={(e) => {
                        setTaxName(e.target.value);
                        setErrors((prev) => ({ ...prev, taxName: false }));
                      }}
                      placeholder={t("exampleTaxName")}
                      className={errors.taxName ? "border-red-500" : ""}
                    />
                    {errors.taxName && (
                      <p className="text-red-500 text-sm">
                        {t("error.taxNameRequired")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="taxRate">{t("taxRate")} (%)</Label>
                    </div>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => {
                        setTaxRate(e.target.value);
                        setErrors((prev) => ({ ...prev, taxRate: false }));
                      }}
                      placeholder={t("exampleTaxRate")}
                      className={errors.taxRate ? "border-red-500" : ""}
                    />
                    {errors.taxRate && (
                      <p className="text-red-500 text-sm">
                        {t("error.taxRateRequired")}
                      </p>
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
                  disabled={isLoading}
                >
                  {isLoading ? t("creating") : t("createTax")}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
