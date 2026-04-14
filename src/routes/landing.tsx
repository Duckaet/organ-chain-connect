import { createFileRoute, Link } from "@tanstack/react-router";
import type { ElementType } from "react";
import { Building2, HeartPulse, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logoPng from "@/assets/organixis-logo.png";

export const Route = createFileRoute("/landing")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "organixis — Welcome" },
      { name: "description", content: "Clean organ care workflow for hospital admins, doctors, and patients." },
    ],
  }),
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border bg-card px-4 py-2 shadow-sm">
            <img src={logoPng} alt="organixis logo" className="h-8 w-8 rounded-md" />
            <span className="font-semibold tracking-wide">organixis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Organ care, coordinated with clarity.</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Run the full hospital workflow in one place: register teams, create requests, assign doctors, and track patient outcomes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg"><Link to="/signup">Get Started</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/signin">Sign In</Link></Button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <RoleCard icon={Building2} title="Hospital Admin" text="Register hospitals, add teams, create and assign requests." />
          <RoleCard icon={Stethoscope} title="Doctor" text="Review assigned requests and complete decision workflow." />
          <RoleCard icon={UserRound} title="Patient" text="Track request progress and care information clearly." />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2 font-semibold"><HeartPulse className="w-4 h-4 text-primary" /> Full test flow</div>
              <p className="text-sm text-muted-foreground">
                Admin creates requests, assigns doctors, doctors review, and patients see status updates end-to-end.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2 font-semibold"><ShieldCheck className="w-4 h-4 text-primary" /> Blockchain-ready integration</div>
              <p className="text-sm text-muted-foreground">
                Wallet and contract actions are integrated while keeping the app responsive for walkthrough demos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, text }: { icon: ElementType; title: string; text: string }) {
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardContent className="p-6 space-y-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
