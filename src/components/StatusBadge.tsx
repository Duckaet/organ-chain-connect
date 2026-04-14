import type { RequestStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-status-pending/20 text-status-pending border-status-pending/30" },
  ASSIGNED: { label: "Assigned", className: "bg-status-assigned/20 text-status-assigned border-status-assigned/30" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-status-review/20 text-status-review border-status-review/30" },
  APPROVED: { label: "Approved", className: "bg-status-approved/20 text-status-approved border-status-approved/30" },
  REJECTED: { label: "Rejected", className: "bg-status-rejected/20 text-status-rejected border-status-rejected/30" },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
}
