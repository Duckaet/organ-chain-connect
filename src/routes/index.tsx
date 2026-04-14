import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { doctors, patients } from "@/data/mockData";
import { Heart, Building2, Stethoscope, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "OrganX — Blockchain Organ Donation Management" },
      { name: "description", content: "A blockchain-based organ donation management system" },
    ],
  }),
});

const roles: { value: UserRole; label: string; desc: string; icon: React.ElementType }[] = [
  { value: "admin", label: "Hospital Admin", desc: "Manage hospitals, doctors, patients & organ requests", icon: Building2 },
  { value: "doctor", label: "Doctor", desc: "Review and approve organ donation requests", icon: Stethoscope },
  { value: "patient", label: "Patient", desc: "View your medical profile & request status", icon: User },
];

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");

  if (user) {
    const dest = user.role === "admin" ? "/admin/dashboard" : user.role === "doctor" ? "/doctor/requests" : "/patient/profile";
    navigate({ to: dest });
    return null;
  }

  const handleLogin = () => {
    if (!selectedRole || !name.trim()) return;
    let id = `user-${Date.now()}`;
    // Map to mock data IDs for doctors/patients
    if (selectedRole === "doctor") {
      const doc = doctors.find((d) => d.name.toLowerCase().includes(name.toLowerCase()));
      if (doc) id = doc.id;
    } else if (selectedRole === "patient") {
      const pat = patients.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
      if (pat) id = pat.id;
    }
    login({ id, name: name.trim(), role: selectedRole });
    const dest = selectedRole === "admin" ? "/admin/dashboard" : selectedRole === "doctor" ? "/doctor/requests" : "/patient/profile";
    navigate({ to: dest });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">OrganX</h1>
          <p className="text-muted-foreground text-sm">Blockchain-Based Organ Donation Management</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Select your role</p>
          <div className="grid gap-3">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedRole(r.value)}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  selectedRole === r.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-muted-foreground/50 hover:bg-accent/50"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selectedRole === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <r.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedRole && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name / ID</label>
              <Input
                placeholder={selectedRole === "doctor" ? "e.g. Dr. Sarah Chen" : selectedRole === "patient" ? "e.g. Alice Johnson" : "Enter your name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {selectedRole !== "admin" && (
                <p className="text-[11px] text-muted-foreground">Tip: Use a mock name to get linked data</p>
              )}
            </div>
            <Button onClick={handleLogin} disabled={!name.trim()} className="w-full">
              Continue as {roles.find((r) => r.value === selectedRole)?.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
