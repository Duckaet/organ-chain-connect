import { createFileRoute } from "@tanstack/react-router";
import { useData } from "@/context/DataContext";
import { Building2, Stethoscope, Users, FileHeart, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import type { RequestStatus } from "@/data/mockData";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { hospitals, doctors, patients, organRequests, blockchainEvents } = useData();

  const statusCounts = organRequests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: "Hospitals", value: hospitals.length, icon: Building2 },
    { label: "Doctors", value: doctors.length, icon: Stethoscope },
    { label: "Patients", value: patients.length, icon: Users },
    { label: "Total Requests", value: organRequests.length, icon: FileHeart },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Requests by Status</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(["PENDING", "ASSIGNED", "UNDER_REVIEW", "APPROVED", "REJECTED"] as RequestStatus[]).map((s) => (
              <div key={s} className="flex items-center justify-between">
                <StatusBadge status={s} />
                <span className="text-sm font-medium">{statusCounts[s] || 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Blockchain Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {blockchainEvents.slice(0, 5).map((e) => (
              <div key={e.id} className="space-y-1">
                <p className="text-xs text-foreground">{e.details}</p>
                <p className="text-[10px] font-mono text-muted-foreground truncate">
                  tx: {e.txHash.slice(0, 16)}...
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
