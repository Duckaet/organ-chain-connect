import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  component: HomeRedirect,
});

function HomeRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate({ to: "/admin/dashboard" });
      return;
    }
    if (user?.role === "doctor") {
      navigate({ to: "/doctor/requests" });
      return;
    }
    if (user?.role === "patient") {
      navigate({ to: "/patient/profile" });
      return;
    }
    navigate({ to: "/landing" });
  }, [navigate, user]);

  return null;
}
