import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Droplets, Stethoscope, Heart } from "lucide-react";

export const Route = createFileRoute("/patient/profile")({
  component: PatientProfile,
});

function PatientProfile() {
  const { user } = useAuth();
  const { patients, doctors } = useData();

  const patient = patients.find((p) => p.id === user?.id);
  const doctor = patient ? doctors.find((d) => d.id === patient.doctorId) : null;

  if (!patient) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">No patient record found. Try logging in with a mock patient name (e.g. "Alice Johnson").</p>
      </div>
    );
  }

  const fields = [
    { label: "Name", value: patient.name, icon: User },
    { label: "Age", value: `${patient.age} years`, icon: User },
    { label: "Blood Type", value: patient.bloodType, icon: Droplets },
    { label: "Condition", value: patient.medicalCondition, icon: Heart },
    { label: "Assigned Doctor", value: doctor?.name || "—", icon: Stethoscope },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Medical Profile</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-sm font-medium">{f.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
