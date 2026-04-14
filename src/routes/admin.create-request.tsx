import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { OrganRequest } from "@/data/mockData";

export const Route = createFileRoute("/admin/create-request")({
  component: CreateRequest,
});

function CreateRequest() {
  const { patients, addOrganRequest, addBlockchainEvent } = useData();
  const { walletAddress, getContract } = useWallet();
  const [patientId, setPatientId] = useState("");
  const [organNeeded, setOrganNeeded] = useState("");
  const [urgency, setUrgency] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const organs = ["Kidney", "Liver", "Heart", "Lung", "Pancreas", "Cornea"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let requestId = `r${Date.now()}`;
    const patient = patients.find((p) => p.id === patientId);
    let txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    // Attempt blockchain call
    if (walletAddress) {
      try {
        const contract = await getContract();
        if (contract) {
          const tx = await contract.createRequest(patientId, organNeeded);
          const receipt = await tx.wait();
          const createdLog = receipt?.logs
            .map((log: { topics: ReadonlyArray<string>; data: string }) => {
              try {
                return contract.interface.parseLog(log);
              } catch {
                return null;
              }
            })
            .find((parsed) => parsed?.name === "RequestCreated");
          if (createdLog?.args?.requestId !== undefined) {
            requestId = `r${createdLog.args.requestId.toString()}`;
          }
          txHash = tx.hash;
          toast.success(`Transaction submitted: ${txHash.slice(0, 10)}...`);
        }
      } catch (err) {
        console.warn("Contract call failed (using mock):", err);
        toast.info("Using mock transaction (contract not deployed)");
      }
    } else {
      toast.info("No wallet connected — using mock transaction");
    }

    addOrganRequest({
      id: requestId,
      patientId,
      organNeeded,
      urgencyLevel: urgency as OrganRequest["urgencyLevel"],
      status: "PENDING",
      txHash,
      createdAt: new Date().toISOString().split("T")[0],
    });

    addBlockchainEvent({
      id: `e${Date.now()}`,
      type: "RequestCreated",
      txHash,
      details: `Organ request created for ${patient?.name || patientId} (${organNeeded})`,
      timestamp: new Date().toISOString(),
    });

    toast.success("Organ request created");
    setPatientId(""); setOrganNeeded(""); setUrgency("");
    setSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Organ Request</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} — {p.bloodType}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Organ Needed</label>
              <Select value={organNeeded} onValueChange={setOrganNeeded}>
                <SelectTrigger><SelectValue placeholder="Select organ" /></SelectTrigger>
                <SelectContent>
                  {organs.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Urgency Level</label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                <SelectContent>
                  {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={!patientId || !organNeeded || !urgency || submitting}>
              {submitting ? "Submitting..." : "Create Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
