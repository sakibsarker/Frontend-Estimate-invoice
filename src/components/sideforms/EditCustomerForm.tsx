"use client";
import { useState, useEffect } from "react";
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
import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from "@/features/server/customerSlice";

interface Customer {
  id: number;
  customer_display_name: string;
  company_name: string;
  contact_first_name: string;
  contact_last_name: string;
  email_address: string;
  phone_number: string;
  billing_country: string;
  billing_address_line1: string;
  billing_address_line2: string;
  billing_city: string;
  billing_state: string;
  billing_zip_code: string;
  shipping_country: string;
  shipping_address_line1: string;
  shipping_address_line2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  notes: string;
  account_number: string;
}

interface EditCustomerFormProps {
  open: boolean;
  onClose: () => void;
  customerId: number | null;
}

export function EditCustomerForm({
  open,
  onClose,
  customerId,
}: EditCustomerFormProps) {
  const {
    data: customer,

    refetch,
  } = useGetCustomerByIdQuery(customerId ?? 0, {
    skip: !customerId,
  });

  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const [formData, setFormData] = useState<Omit<Customer, "id">>({
    customer_display_name: "",
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
    shipping_country: "US",
    shipping_address_line1: "",
    shipping_address_line2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip_code: "",
    notes: "",
    account_number: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        customer_display_name: customer.customer_display_name,
        company_name: customer.company_name,
        contact_first_name: customer.contact_first_name,
        contact_last_name: customer.contact_last_name,
        email_address: customer.email_address,
        phone_number: customer.phone_number,
        billing_country: customer.billing_country,
        billing_address_line1: customer.billing_address_line1,
        billing_address_line2: customer.billing_address_line2,
        billing_city: customer.billing_city,
        billing_state: customer.billing_state,
        billing_zip_code: customer.billing_zip_code,
        shipping_country: customer.shipping_country,
        shipping_address_line1: customer.shipping_address_line1,
        shipping_address_line2: customer.shipping_address_line2,
        shipping_city: customer.shipping_city,
        shipping_state: customer.shipping_state,
        shipping_zip_code: customer.shipping_zip_code,
        notes: customer.notes,
        account_number: customer.account_number,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;

    try {
      await updateCustomer({ id: customerId, ...formData }).unwrap();
      toast.success("Customer updated successfully!");

      // Trigger refetch of customer data
      await refetch();

      onClose();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update customer");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <Toaster />
      <SheetContent className="w-[400px] sm:w-[540px] p-0 h-full">
        <div className="h-full flex flex-col min-h-0">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>Edit Customer</SheetTitle>
            </div>
          </SheetHeader>
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold">Contact details</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <span className="text-destructive">*</span>
                      <Label htmlFor="customer_display_name">
                        Display Name
                      </Label>
                    </div>
                    <Input
                      id="customer_display_name"
                      value={formData.customer_display_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_display_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_first_name">First Name</Label>
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
                      <Label htmlFor="contact_last_name">Last Name</Label>
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
                    <Label htmlFor="email_address">Email</Label>
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
                    <Label htmlFor="phone_number">Phone</Label>
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
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold">Billing Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
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
                      Address Line 1
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
                      Address Line 2
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
                    <Label htmlFor="billing_city">City</Label>
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
                      <Label htmlFor="billing_state">State</Label>
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
                      <Label htmlFor="billing_zip_code">ZIP Code</Label>
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
                <h2 className="text-sm font-semibold">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select
                      value={formData.shipping_country}
                      onValueChange={(value) =>
                        setFormData({ ...formData, shipping_country: value })
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
                    <Label htmlFor="shipping_address_line1">
                      Address Line 1
                    </Label>
                    <Input
                      id="shipping_address_line1"
                      value={formData.shipping_address_line1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_address_line1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_address_line2">
                      Address Line 2
                    </Label>
                    <Input
                      id="shipping_address_line2"
                      value={formData.shipping_address_line2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_address_line2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_city">City</Label>
                    <Input
                      id="shipping_city"
                      value={formData.shipping_city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping_city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping_state">State</Label>
                      <Input
                        id="shipping_state"
                        value={formData.shipping_state}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shipping_state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping_zip_code">ZIP Code</Label>
                      <Input
                        id="shipping_zip_code"
                        value={formData.shipping_zip_code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shipping_zip_code: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold">
                  Additional Information
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account_number">Account Number</Label>
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
                    <Label htmlFor="notes">Notes</Label>
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
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Customer"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
