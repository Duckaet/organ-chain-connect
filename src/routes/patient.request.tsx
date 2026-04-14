import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { RequestStepper } from "@/components/RequestStepper";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/patient/request")({
  component: PatientRequest,
});

function PatientRequest() {
  const { user } = useAuth();
  const { organRequests, doctors } = useData();

  const myRequests = organRequests.filter((r) => r.patientId === user?.id);

  if (myRequests.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Organ Request</h1>
        <p className="text-muted-foreground">No organ request is linked to this account yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Organ Request</h1>
      {myRequests.map((r) => {
        const doctor = doctors.find((d) => d.id === r.doctorId);
        return (
          <Card key={r.id}>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{r.organNeeded} Request</p>
                  <p className="text-xs text-muted-foreground">Created {r.createdAt}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <RequestStepper status={r.status} />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Urgency:</span> <span className="font-medium">{r.urgencyLevel}</span></div>
                <div><span className="text-muted-foreground">Doctor:</span> <span className="font-medium">{doctor?.name || "Not assigned"}</span></div>
                {r.reason && <div className="col-span-2"><span className="text-muted-foreground">Reason:</span> <span className="font-medium">{r.reason}</span></div>}
                {r.txHash && <div className="col-span-2"><span className="text-muted-foreground">Tx:</span> <span className="font-mono text-xs">{r.txHash}</span></div>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
