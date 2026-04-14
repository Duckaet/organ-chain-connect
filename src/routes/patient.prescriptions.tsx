import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { prescriptions, doctors } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Calendar, User } from "lucide-react";

export const Route = createFileRoute("/patient/prescriptions")({
  component: PatientPrescriptions,
});

function PatientPrescriptions() {
  const { user } = useAuth();

  const myPrescriptions = prescriptions.filter((p) => p.patientId === user?.id);

  if (myPrescriptions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Prescriptions</h1>
        <p className="text-muted-foreground">No prescriptions found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Prescriptions</h1>
      <div className="space-y-3">
        {myPrescriptions.map((rx) => {
          const doctor = doctors.find((d) => d.id === rx.prescribedBy);
          return (
            <Card key={rx.id}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{rx.medication}</p>
                  <p className="text-sm text-muted-foreground">{rx.dosage}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{doctor?.name || "—"}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{rx.date}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
