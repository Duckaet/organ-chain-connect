import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const result = signUp({ name, email, password, role });
    if (!result.ok) {
      toast.error(result.message);
      setSubmitting(false);
      return;
    }

    const destination = role === "admin" ? "/admin/dashboard" : role === "doctor" ? "/doctor/requests" : "/patient/profile";
    toast.success("Account created.");
    navigate({ to: destination });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-accent/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your organixis account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
            </div>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Account"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Already have an account? <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
