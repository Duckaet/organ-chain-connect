import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { User, Droplets, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/doctor/patients")({
  component: DoctorPatients,
});

function DoctorPatients() {
  const { user } = useAuth();
  const { patients } = useData();

  const myPatients = patients.filter((p) => p.doctorId === user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Patients</h1>
      {myPatients.length === 0 ? (
        <p className="text-muted-foreground">No patients assigned to you.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myPatients.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Age: {p.age}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" />{p.bloodType}</span>
                  <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" />{p.medicalCondition}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
