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
import { useTranslation } from "react-i18next";
interface ItemFormProps {
  open: boolean;
  onClose: () => void;
}

export function ItemForm({ open, onClose }: ItemFormProps) {
  const { t } = useTranslation();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({
    itemName: false,
    price: false,
  });

  const [type, setType] = useState<"LABOR" | "PARTS" | "OTHER">("PARTS");

  const [createItem, { isLoading }] = useCreateItemMutation();

  const validateForm = () => {
    const newErrors = {
      itemName: !itemName.trim(),
      price: !price.trim() || isNaN(Number(price)) || Number(price) <= 0,
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
                <SheetTitle>{t("newItem")}</SheetTitle>
              </div>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">{t("itemType")} *</Label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value as "LABOR" | "PARTS" | "OTHER")
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="PARTS">{t("parts")}</option>
                      <option value="LABOR">{t("labor")}</option>
                      <option value="OTHER">{t("other")}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemName">{t("itemName")} *</Label>
                    <Input
                      id="itemName"
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value);
                        setErrors((prev) => ({ ...prev, itemName: false }));
                      }}
                      placeholder={t("exampleItem")}
                      className={errors.itemName ? "border-red-500" : ""}
                    />
                    {errors.itemName && (
                      <p className="text-red-500 text-sm">
                        {t("error.itemNameRequired")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t("description")}</Label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("itemDescription")}
                      className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">{t("price")} ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        setErrors((prev) => ({ ...prev, price: false }));
                      }}
                      placeholder={t("examplePrice")}
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">
                        {t("error.priceRequired")}
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
                  {isLoading ? t("creating") : t("addItem")}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
