"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Add this type definition
type User = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
};

export default function AdminCreateEstimate() {
  const [repairDate, setRepairDate] = useState<Date | undefined>(undefined);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/estimate/list-repair-requests/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Uncomment and update this useEffect
  useEffect(() => {
    const foundUser = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
    if (foundUser) {
      setEmail(foundUser.email);
      setPhone(foundUser.phone_number);
    } else {
      setEmail("");
      setPhone("");
    }
  }, [username, users]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/estimate/repair-requests/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: username,
            email: email,
            phone_number: phone,
            repair_date: repairDate?.toISOString().split("T")[0],
            repair_details: (
              event.currentTarget.elements.namedItem(
                "repair_details"
              ) as HTMLTextAreaElement
            )?.value,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Estimate creation failed");
      }

      const result = await response.json();
      console.log("Estimate created:", result);
      alert("Repair request created successfully!");

      // Reset form
      event.currentTarget.reset();
      setUsername("");
      setEmail("");
      setPhone("");
      setRepairDate(undefined);
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.message || "Failed to create repair request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-2xl font-normal">
            Estimate Request Form:
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Name:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {username ? username : "Select name..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search name..." />
                      <CommandList>
                        <CommandEmpty>No name found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              onSelect={() => {
                                setUsername(user.username);
                                setEmail(user.email);
                                setPhone(user.phone_number);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  username === user.username
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {user.username}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone:</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_name">Vehicle Name</Label>
                <select
                  id="vehicle_name"
                  name="vehicle_name"
                  className="w-full border rounded-lg p-2"
                  required
                >
                  <option value="" disabled selected>
                    Select a vehicle model
                  </option>
                  <optgroup label="BMW">
                    <option value="BMW X5">BMW X5</option>
                    <option value="BMW X3">BMW X3</option>
                    <option value="BMW X7">BMW X7</option>
                    <option value="BMW 3 Series">BMW 3 Series</option>
                    <option value="BMW 5 Series">BMW 5 Series</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="Audi Q5">Audi Q5</option>
                    <option value="Audi Q7">Audi Q7</option>
                    <option value="Audi A4">Audi A4</option>
                    <option value="Audi A6">Audi A6</option>
                    <option value="Audi e-tron">Audi e-tron</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="Audi Q5">Audi Q5</option>
                    <option value="Audi Q7">Audi Q7</option>
                    <option value="Audi A4">Audi A4</option>
                    <option value="Audi A6">Audi A6</option>
                    <option value="Audi e-tron">Audi e-tron</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="Audi Q5">Audi Q5</option>
                    <option value="Audi Q7">Audi Q7</option>
                    <option value="Audi A4">Audi A4</option>
                    <option value="Audi A6">Audi A6</option>
                    <option value="Audi e-tron">Audi e-tron</option>
                  </optgroup>
                  <optgroup label="Audi">
                    <option value="Audi Q5">Audi Q5</option>
                    <option value="Audi Q7">Audi Q7</option>
                    <option value="Audi A4">Audi A4</option>
                    <option value="Audi A6">Audi A6</option>
                    <option value="Audi e-tron">Audi e-tron</option>
                  </optgroup>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimate_attachments">File Attachment</Label>
                <Input
                  id="estimate_attachments"
                  name="estimate_attachments"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repair_date">Repair Date and Time:</Label>
                <DateTimePicker date={repairDate} setDate={setRepairDate} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repair_details">Repair Details:</Label>
              <Textarea
                id="repair_details"
                name="repair_details"
                placeholder="Describe the repairs needed"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
              >
                Submit Estimate Request
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900"
              >
                Close
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-800"
              >
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
