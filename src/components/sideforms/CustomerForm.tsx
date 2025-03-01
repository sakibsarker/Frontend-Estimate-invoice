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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";
import { useCreateCustomerMutation } from "@/features/server/customerSlice";
import { useTranslation } from "react-i18next";
interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
}

export function CustomerForm({ open, onClose }: CustomerFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    company_name: "",
    contact_first_name: "",
    contact_last_name: "",
    email_address: "",
    phone_number: "",
    billing_country: "US",
    billing_address_line1: "",
    billing_address_line2: "",
    billing_city: "",
    billing_state: "",
    billing_zip_code: "",
    notes: "",
    account_number: "",
  });

  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCustomer(formData).unwrap();

      toast.success("Customer created successfully!");

      setFormData({
        company_name: "",
        contact_first_name: "",
        contact_last_name: "",
        email_address: "",
        phone_number: "",
        billing_country: "US",
        billing_address_line1: "",
        billing_address_line2: "",
        billing_city: "",
        billing_state: "",
        billing_zip_code: "",
        notes: "",
        account_number: "",
      });
      onClose();
    } catch (error: any) {
      console.error("Error creating customer:", error);
      toast.error(error.data?.message || "Error creating customer");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <Toaster />
      <SheetContent className="w-[400px] sm:w-[540px] p-0 h-full">
        <div className="h-full flex flex-col min-h-0">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>{t("newCustomer")}</SheetTitle>
            </div>
          </SheetHeader>
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold">{t("contactDetail")}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="contact_first_name">
                        {t("firstName")}
                      </Label>
                      <Input
                        id="contact_first_name"
                        value={formData.contact_first_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact_first_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="contact_last_name">{t("lastName")}</Label>
                      <Input
                        id="contact_last_name"
                        value={formData.contact_last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact_last_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-destructive">*</span>
                    <Label htmlFor="email_address">{t("email")}</Label>
                    <Input
                      id="email_address"
                      type="email"
                      value={formData.email_address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email_address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-destructive">*</span>
                    <Label htmlFor="phone_number">{t("phone")}</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">{t("companyName")}</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold">{t("billingAddress")}</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("country")}</Label>
                    <Select
                      value={formData.billing_country}
                      onValueChange={(value) =>
                        setFormData({ ...formData, billing_country: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing_address_line1">
                      {t("addressLine1")}
                    </Label>
                    <Input
                      id="billing_address_line1"
                      value={formData.billing_address_line1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_address_line1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing_address_line2">
                      {t("addressLine2")}
                    </Label>
                    <Input
                      id="billing_address_line2"
                      value={formData.billing_address_line2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_address_line2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing_city">{t("city")}</Label>
                    <Input
                      id="billing_city"
                      value={formData.billing_city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing_state">{t("state")}</Label>
                      <Input
                        id="billing_state"
                        value={formData.billing_state}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            billing_state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing_zip_code">{t("zipCode")}</Label>
                      <Input
                        id="billing_zip_code"
                        value={formData.billing_zip_code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            billing_zip_code: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold">
                  {t("additionalInformation")}
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account_number">
                      {t("accountNumber")}{" "}
                    </Label>
                    <Input
                      id="account_number"
                      value={formData.account_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_number: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">{t("notes")}</Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t p-6 bg-background">
              <Button
                type="submit"
                variant="outline"
                className="w-full bg-indigo-600 text-white hover:text-gray-300 hover:bg-indigo-800"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? t("adding") : t("addNewCustomer")}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
