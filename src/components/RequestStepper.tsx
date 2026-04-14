import type { RequestStatus } from "@/data/mockData";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const steps: { key: RequestStatus; label: string }[] = [
  { key: "PENDING", label: "Created" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "UNDER_REVIEW", label: "Under Review" },
];

const statusOrder: Record<RequestStatus, number> = {
  PENDING: 0, ASSIGNED: 1, UNDER_REVIEW: 2, APPROVED: 3, REJECTED: 3,
};

export function RequestStepper({ status }: { status: RequestStatus }) {
  const currentStep = statusOrder[status];
  const isFinal = status === "APPROVED" || status === "REJECTED";

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => {
        const completed = currentStep > i;
        const active = currentStep === i && !isFinal;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                  completed ? "bg-primary border-primary text-primary-foreground" :
                  active ? "border-primary text-primary bg-primary/10" :
                  "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {completed ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn("text-[10px] mt-1 text-center", completed || active ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 flex-1 mx-1", completed ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        );
      })}
      {/* Final step */}
      <div className="flex items-center flex-1">
        <div className={cn("h-0.5 flex-1 mx-1", isFinal ? (status === "APPROVED" ? "bg-status-approved" : "bg-status-rejected") : "bg-muted")} />
        <div className="flex flex-col items-center flex-1">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
              status === "APPROVED" ? "bg-status-approved border-status-approved text-primary-foreground" :
              status === "REJECTED" ? "bg-status-rejected border-status-rejected text-primary-foreground" :
              "border-muted-foreground/30 text-muted-foreground"
            )}
          >
            {status === "APPROVED" ? <Check className="w-4 h-4" /> :
             status === "REJECTED" ? <X className="w-4 h-4" /> : 4}
          </div>
          <span className={cn("text-[10px] mt-1 text-center", isFinal ? "text-foreground" : "text-muted-foreground")}>
            {isFinal ? (status === "APPROVED" ? "Approved" : "Rejected") : "Decision"}
          </span>
        </div>
      </div>
    </div>
  );
}
