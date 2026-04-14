import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import type { RequestStatus } from "@/data/mockData";

export const Route = createFileRoute("/admin/requests")({
  component: AllRequests,
});

function AllRequests() {
  const { organRequests, patients, doctors } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = organRequests.filter((r) => {
    const patient = patients.find((p) => p.id === r.patientId);
    const matchesSearch = !search || patient?.name.toLowerCase().includes(search.toLowerCase()) || r.organNeeded.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Organ Requests</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by patient or organ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            {(["PENDING", "ASSIGNED", "UNDER_REVIEW", "APPROVED", "REJECTED"] as RequestStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Organ</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const patient = patients.find((p) => p.id === r.patientId);
              const doctor = doctors.find((d) => d.id === r.doctorId);
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>{patient?.name || "—"}</TableCell>
                  <TableCell>{r.organNeeded}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${r.urgencyLevel === "CRITICAL" ? "text-status-rejected" : r.urgencyLevel === "HIGH" ? "text-status-review" : "text-muted-foreground"}`}>
                      {r.urgencyLevel}
                    </span>
                  </TableCell>
                  <TableCell>{doctor?.name || "—"}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.createdAt}</TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No requests found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
