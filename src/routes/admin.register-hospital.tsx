import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/register-hospital")({
  component: RegisterHospital,
});

function RegisterHospital() {
  const { addHospital } = useData();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHospital({ id: `h${Date.now()}`, name, address, contact });
    toast.success(`Hospital "${name}" registered successfully`);
    setName(""); setAddress(""); setContact("");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register Hospital</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hospital Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Metro General Hospital" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Main St, City" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact</label>
              <Input value={contact} onChange={(e) => setContact(e.target.value)} required placeholder="+1-555-0000" />
            </div>
            <Button type="submit" className="w-full">Register Hospital</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
