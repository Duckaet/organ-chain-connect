import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/add-doctor")({
  component: AddDoctor,
});

function AddDoctor() {
  const { hospitals, addDoctor } = useData();
  const { walletAddress, getContract } = useWallet();
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [email, setEmail] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [doctorWalletAddress, setDoctorWalletAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (walletAddress && doctorWalletAddress) {
      try {
        const contract = await getContract();
        if (contract) {
          const tx = await contract.registerDoctor(doctorWalletAddress);
          await tx.wait();
          toast.success(`Doctor wallet registered on-chain: ${doctorWalletAddress.slice(0, 10)}...`);
        }
      } catch (err) {
        console.warn("registerDoctor failed (using local-only doctor):", err);
      }
    }

    addDoctor({
      id: `d${Date.now()}`,
      name,
      specialization,
      email,
      hospitalId,
      walletAddress: doctorWalletAddress || "0x0000000000000000000000000000000000000000",
    });
    toast.success(`Dr. ${name} added successfully`);
    setName(""); setSpecialization(""); setEmail(""); setHospitalId(""); setDoctorWalletAddress("");
    setSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Doctor</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Dr. Jane Smith" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialization</label>
              <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} required placeholder="Cardiology" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@hospital.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hospital</label>
              <Select value={hospitalId} onValueChange={setHospitalId} required>
                <SelectTrigger><SelectValue placeholder="Select hospital" /></SelectTrigger>
                <SelectContent>
                  {hospitals.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Doctor Wallet Address</label>
              <Input
                value={doctorWalletAddress}
                onChange={(e) => setDoctorWalletAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={!hospitalId || submitting}>
              {submitting ? "Adding..." : "Add Doctor"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
