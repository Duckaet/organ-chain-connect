import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/assign-request")({
  component: AssignRequest,
});

function AssignRequest() {
  const { organRequests, doctors, patients, updateOrganRequest, addBlockchainEvent } = useData();
  const { walletAddress, getContract } = useWallet();
  const [requestId, setRequestId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pendingRequests = organRequests.filter((r) => r.status === "PENDING");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const doctor = doctors.find((d) => d.id === doctorId);
    let txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    if (walletAddress && doctor) {
      try {
        const contract = getContract();
        if (contract) {
          const tx = await contract.assignRequest(parseInt(requestId.replace("r", "")), doctor.walletAddress);
          txHash = tx.hash;
          toast.success(`Transaction submitted: ${txHash.slice(0, 10)}...`);
        }
      } catch (err) {
        console.warn("Contract call failed (using mock):", err);
        toast.info("Using mock transaction");
      }
    }

    updateOrganRequest(requestId, { status: "ASSIGNED", doctorId, txHash });

    addBlockchainEvent({
      id: `e${Date.now()}`,
      type: "RequestAssigned",
      txHash,
      details: `Request ${requestId} assigned to ${doctor?.name || doctorId}`,
      timestamp: new Date().toISOString(),
    });

    toast.success("Request assigned successfully");
    setRequestId(""); setDoctorId("");
    setSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Assign Request to Doctor</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pending Request</label>
              <Select value={requestId} onValueChange={setRequestId}>
                <SelectTrigger><SelectValue placeholder="Select request" /></SelectTrigger>
                <SelectContent>
                  {pendingRequests.map((r) => {
                    const p = patients.find((pt) => pt.id === r.patientId);
                    return <SelectItem key={r.id} value={r.id}>{r.id} — {p?.name} ({r.organNeeded})</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign to Doctor</label>
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialization}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={!requestId || !doctorId || submitting}>
              {submitting ? "Assigning..." : "Assign Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
