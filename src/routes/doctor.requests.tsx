import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useWallet } from "@/context/WalletContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { keccak256, toUtf8Bytes } from "ethers";
import { User, Heart, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/doctor/requests")({
  component: DoctorRequests,
});

function DoctorRequests() {
  const { user } = useAuth();
  const { organRequests, patients, updateOrganRequest, addBlockchainEvent } = useData();
  const { walletAddress, getContract } = useWallet();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const myRequests = organRequests.filter((r) => r.doctorId === user?.id);
  const selected = myRequests.find((r) => r.id === selectedRequest);
  const selectedPatient = selected ? patients.find((p) => p.id === selected.patientId) : null;

  const handleReview = async () => {
    if (!selectedRequest || !reason.trim()) return;
    setSubmitting(true);

    const reasonHash = keccak256(toUtf8Bytes(reason));
    let txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    if (walletAddress) {
      try {
        const contract = getContract();
        if (contract) {
          const statusCode = decision === "APPROVED" ? 4 : 5;
          const tx = await contract.updateRequestStatus(parseInt(selectedRequest.replace("r", "")), statusCode, reasonHash);
          txHash = tx.hash;
          toast.success(`Transaction submitted: ${txHash.slice(0, 10)}...`);
        }
      } catch (err) {
        console.warn("Contract call failed:", err);
        toast.info("Using mock transaction");
      }
    }

    updateOrganRequest(selectedRequest, { status: decision, reason, txHash });

    addBlockchainEvent({
      id: `e${Date.now()}`,
      type: "RequestStatusUpdated",
      txHash,
      details: `Request ${selectedRequest} → ${decision}`,
      timestamp: new Date().toISOString(),
    });

    toast.success(`Request ${decision.toLowerCase()}`);
    setSelectedRequest(null);
    setReason("");
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Assigned Requests</h1>

      {myRequests.length === 0 ? (
        <p className="text-muted-foreground">No requests assigned to you.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {myRequests.map((r) => {
            const patient = patients.find((p) => p.id === r.patientId);
            return (
              <Card key={r.id} className="cursor-pointer hover:ring-1 hover:ring-primary/50 transition-all" onClick={() => {
                if (r.status === "ASSIGNED" || r.status === "UNDER_REVIEW") {
                  setSelectedRequest(r.id);
                  updateOrganRequest(r.id, { status: "UNDER_REVIEW" });
                }
              }}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{patient?.name || "Unknown"}</span>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{r.organNeeded}</span>
                    <span className={`flex items-center gap-1 ${r.urgencyLevel === "CRITICAL" ? "text-status-rejected" : ""}`}>
                      <AlertTriangle className="w-3.5 h-3.5" />{r.urgencyLevel}
                    </span>
                  </div>
                  {(r.status === "ASSIGNED" || r.status === "UNDER_REVIEW") && (
                    <p className="text-xs text-primary">Click to review →</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Request</DialogTitle>
          </DialogHeader>
          {selectedPatient && selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Patient:</span> {selectedPatient.name}</div>
                <div><span className="text-muted-foreground">Blood Type:</span> {selectedPatient.bloodType}</div>
                <div><span className="text-muted-foreground">Condition:</span> {selectedPatient.medicalCondition}</div>
                <div><span className="text-muted-foreground">Organ:</span> {selected.organNeeded}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Decision</label>
                <div className="flex gap-3">
                  {(["APPROVED", "REJECTED"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDecision(d)}
                      className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-all ${
                        decision === d
                          ? d === "APPROVED" ? "border-status-approved bg-status-approved/10 text-status-approved" : "border-status-rejected bg-status-rejected/10 text-status-rejected"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {d === "APPROVED" ? "✓ Approve" : "✕ Reject"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Medical Reason</label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter your medical assessment..." rows={3} />
              </div>

              <Button onClick={handleReview} disabled={!reason.trim() || submitting} className="w-full">
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
