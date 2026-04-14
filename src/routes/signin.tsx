import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = signIn(email, password, role);
    if (!result.ok) {
      toast.error(result.message);
      setSubmitting(false);
      return;
    }

    const destination = role === "admin" ? "/admin/dashboard" : role === "doctor" ? "/doctor/requests" : "/patient/profile";
    toast.success("Signed in successfully.");
    navigate({ to: destination });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-accent/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to organixis</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Hospital Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@organixis.app" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
