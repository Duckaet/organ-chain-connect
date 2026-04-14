import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { doctors, patients } from "@/data/mockData";
import { Heart, Building2, Stethoscope, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

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
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/60" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20 blur-xl"
          style={{
            width: 80 + i * 40,
            height: 80 + i * 40,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg space-y-8"
      >
        {/* Glass card */}
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-2xl shadow-primary/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center space-y-3 mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20"
              animate={{ boxShadow: ["0 0 20px rgba(0,200,200,0)", "0 0 30px rgba(0,200,200,0.15)", "0 0 20px rgba(0,200,200,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight">OrganX</h1>
            <p className="text-muted-foreground text-sm">Blockchain-Based Organ Donation Management</p>
          </motion.div>

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select your role</p>
            <div className="grid gap-3">
              {roles.map((r, i) => (
                <motion.button
                  key={r.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(r.value)}
                  className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                    selectedRole === r.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary/50"
                      : "border-border/50 hover:border-primary/30 hover:bg-accent/30"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    selectedRole === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <r.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  {selectedRole === r.value && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name / ID</label>
                    <Input
                      placeholder={selectedRole === "doctor" ? "e.g. Dr. Sarah Chen" : selectedRole === "patient" ? "e.g. Alice Johnson" : "Enter your name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="bg-background/50 border-border/50"
                    />
                    {selectedRole !== "admin" && (
                      <p className="text-[11px] text-muted-foreground">Tip: Use a mock name to get linked data</p>
                    )}
                  </div>
                  <Button onClick={handleLogin} disabled={!name.trim()} className="w-full gap-2 group">
                    Continue as {roles.find((r) => r.value === selectedRole)?.label}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-[11px] text-muted-foreground"
        >
          Secured by Ethereum Smart Contracts
        </motion.p>
      </motion.div>
    </div>
  );
}
