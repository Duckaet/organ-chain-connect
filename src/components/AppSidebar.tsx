import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, UserPlus, Users, FileHeart, UserCog,
  ClipboardList, Stethoscope, User, Pill, Heart, Menu, LogOut, X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { WalletButton } from "./WalletButton";

interface NavItem { label: string; to: string; icon: React.ElementType; }

const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Register Hospital", to: "/admin/register-hospital", icon: Building2 },
  { label: "Add Doctor", to: "/admin/add-doctor", icon: UserPlus },
  { label: "Add Patient", to: "/admin/add-patient", icon: Users },
  { label: "Create Request", to: "/admin/create-request", icon: FileHeart },
  { label: "Assign Request", to: "/admin/assign-request", icon: UserCog },
  { label: "All Requests", to: "/admin/requests", icon: ClipboardList },
];

const doctorNav: NavItem[] = [
  { label: "Assigned Requests", to: "/doctor/requests", icon: ClipboardList },
  { label: "My Patients", to: "/doctor/patients", icon: Users },
];

const patientNav: NavItem[] = [
  { label: "My Profile", to: "/patient/profile", icon: User },
  { label: "My Request", to: "/patient/request", icon: Heart },
  { label: "Prescriptions", to: "/patient/prescriptions", icon: Pill },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!user) return <>{children}</>;

  const nav = user.role === "admin" ? adminNav : user.role === "doctor" ? doctorNav : patientNav;
  const roleLabel = user.role === "admin" ? "Hospital Admin" : user.role === "doctor" ? "Doctor" : "Patient";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar border-r border-sidebar-border transition-transform lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-sidebar-foreground">OrganX</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-sidebar-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
          <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b px-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block" />
          <WalletButton />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
