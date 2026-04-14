export type RequestStatus = "PENDING" | "ASSIGNED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  contact: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  hospitalId: string;
  walletAddress: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  medicalCondition: string;
  doctorId: string;
}

export interface OrganRequest {
  id: string;
  patientId: string;
  organNeeded: string;
  urgencyLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: RequestStatus;
  doctorId?: string;
  reason?: string;
  txHash?: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  prescribedBy: string;
  date: string;
}

export interface BlockchainEvent {
  id: string;
  type: "RequestCreated" | "RequestAssigned" | "RequestStatusUpdated";
  txHash: string;
  details: string;
  timestamp: string;
}

export const hospitals: Hospital[] = [
  { id: "h1", name: "Metro General Hospital", address: "123 Main St, New York, NY", contact: "+1-555-0101" },
  { id: "h2", name: "City Medical Center", address: "456 Oak Ave, Los Angeles, CA", contact: "+1-555-0202" },
];

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Sarah Chen", specialization: "Cardiology", email: "s.chen@metrogeneral.com", hospitalId: "h1", walletAddress: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B" },
  { id: "d2", name: "Dr. James Wilson", specialization: "Nephrology", email: "j.wilson@metrogeneral.com", hospitalId: "h1", walletAddress: "0x1234567890abcdef1234567890abcdef12345678" },
  { id: "d3", name: "Dr. Maria Rodriguez", specialization: "Hepatology", email: "m.rodriguez@citymedical.com", hospitalId: "h2", walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" },
  { id: "d4", name: "Dr. David Park", specialization: "Pulmonology", email: "d.park@citymedical.com", hospitalId: "h2", walletAddress: "0x9876543210fedcba9876543210fedcba98765432" },
];

export const patients: Patient[] = [
  { id: "p1", name: "Alice Johnson", age: 45, bloodType: "A+", medicalCondition: "End-stage renal disease", doctorId: "d2" },
  { id: "p2", name: "Bob Martinez", age: 52, bloodType: "O-", medicalCondition: "Liver cirrhosis", doctorId: "d3" },
  { id: "p3", name: "Carol Williams", age: 38, bloodType: "B+", medicalCondition: "Heart failure", doctorId: "d1" },
  { id: "p4", name: "Daniel Lee", age: 60, bloodType: "AB+", medicalCondition: "Pulmonary fibrosis", doctorId: "d4" },
  { id: "p5", name: "Emily Davis", age: 29, bloodType: "O+", medicalCondition: "Kidney failure", doctorId: "d2" },
  { id: "p6", name: "Frank Thompson", age: 55, bloodType: "A-", medicalCondition: "Chronic liver disease", doctorId: "d3" },
];

export const organRequests: OrganRequest[] = [
  { id: "r1", patientId: "p1", organNeeded: "Kidney", urgencyLevel: "HIGH", status: "APPROVED", doctorId: "d2", reason: "Patient stable for transplant", txHash: "0xabc123...def456", createdAt: "2025-03-01" },
  { id: "r2", patientId: "p2", organNeeded: "Liver", urgencyLevel: "CRITICAL", status: "UNDER_REVIEW", doctorId: "d3", createdAt: "2025-03-05" },
  { id: "r3", patientId: "p3", organNeeded: "Heart", urgencyLevel: "CRITICAL", status: "ASSIGNED", doctorId: "d1", createdAt: "2025-03-10" },
  { id: "r4", patientId: "p4", organNeeded: "Lung", urgencyLevel: "MEDIUM", status: "PENDING", createdAt: "2025-03-12" },
  { id: "r5", patientId: "p5", organNeeded: "Kidney", urgencyLevel: "HIGH", status: "REJECTED", doctorId: "d2", reason: "Patient not medically ready", txHash: "0x789abc...012def", createdAt: "2025-03-14" },
  { id: "r6", patientId: "p6", organNeeded: "Liver", urgencyLevel: "LOW", status: "PENDING", createdAt: "2025-03-18" },
  { id: "r7", patientId: "p1", organNeeded: "Kidney", urgencyLevel: "HIGH", status: "ASSIGNED", doctorId: "d2", createdAt: "2025-04-01" },
  { id: "r8", patientId: "p3", organNeeded: "Heart", urgencyLevel: "CRITICAL", status: "UNDER_REVIEW", doctorId: "d1", createdAt: "2025-04-05" },
];

export const prescriptions: Prescription[] = [
  { id: "rx1", patientId: "p1", medication: "Tacrolimus", dosage: "5mg twice daily", prescribedBy: "d2", date: "2025-03-02" },
  { id: "rx2", patientId: "p1", medication: "Mycophenolate", dosage: "500mg twice daily", prescribedBy: "d2", date: "2025-03-02" },
  { id: "rx3", patientId: "p2", medication: "Lactulose", dosage: "30ml three times daily", prescribedBy: "d3", date: "2025-03-06" },
  { id: "rx4", patientId: "p3", medication: "Carvedilol", dosage: "25mg twice daily", prescribedBy: "d1", date: "2025-03-11" },
  { id: "rx5", patientId: "p4", medication: "Pirfenidone", dosage: "801mg three times daily", prescribedBy: "d4", date: "2025-03-13" },
  { id: "rx6", patientId: "p5", medication: "Erythropoietin", dosage: "2000 IU weekly", prescribedBy: "d2", date: "2025-03-15" },
];

export const blockchainEvents: BlockchainEvent[] = [
  { id: "e1", type: "RequestCreated", txHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abcd", details: "Organ request #1 created for Patient Alice Johnson (Kidney)", timestamp: "2025-03-01T10:00:00Z" },
  { id: "e2", type: "RequestAssigned", txHash: "0x123abc456def789abc123def456789abc123def456789abc123def456789abcd", details: "Request #1 assigned to Dr. James Wilson", timestamp: "2025-03-02T14:30:00Z" },
  { id: "e3", type: "RequestStatusUpdated", txHash: "0x789def123abc456789abc123def456789abc123def456789abc123def456789a", details: "Request #1 status → APPROVED", timestamp: "2025-03-04T09:15:00Z" },
  { id: "e4", type: "RequestCreated", txHash: "0xdef456789abc123def456789abc123def456789abc123def456789abc123defab", details: "Organ request #2 created for Patient Bob Martinez (Liver)", timestamp: "2025-03-05T11:00:00Z" },
  { id: "e5", type: "RequestAssigned", txHash: "0x456789abc123def456789abc123def456789abc123def456789abc123def456ab", details: "Request #3 assigned to Dr. Sarah Chen", timestamp: "2025-03-10T16:45:00Z" },
];
