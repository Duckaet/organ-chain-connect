import React, { createContext, useContext, useState, type ReactNode } from "react";
import {
  hospitals as initHospitals,
  doctors as initDoctors,
  patients as initPatients,
  organRequests as initRequests,
  blockchainEvents as initEvents,
  type Hospital, type Doctor, type Patient, type OrganRequest, type BlockchainEvent,
} from "@/data/mockData";

interface DataContextType {
  hospitals: Hospital[];
  doctors: Doctor[];
  patients: Patient[];
  organRequests: OrganRequest[];
  blockchainEvents: BlockchainEvent[];
  addHospital: (h: Hospital) => void;
  addDoctor: (d: Doctor) => void;
  addPatient: (p: Patient) => void;
  addOrganRequest: (r: OrganRequest) => void;
  updateOrganRequest: (id: string, updates: Partial<OrganRequest>) => void;
  addBlockchainEvent: (e: BlockchainEvent) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [hospitals, setHospitals] = useState<Hospital[]>(initHospitals);
  const [doctors, setDoctors] = useState<Doctor[]>(initDoctors);
  const [patients, setPatients] = useState<Patient[]>(initPatients);
  const [organRequests, setOrganRequests] = useState<OrganRequest[]>(initRequests);
  const [blockchainEvents, setBlockchainEvents] = useState<BlockchainEvent[]>(initEvents);

  return (
    <DataContext.Provider
      value={{
        hospitals, doctors, patients, organRequests, blockchainEvents,
        addHospital: (h) => setHospitals((prev) => [...prev, h]),
        addDoctor: (d) => setDoctors((prev) => [...prev, d]),
        addPatient: (p) => setPatients((prev) => [...prev, p]),
        addOrganRequest: (r) => setOrganRequests((prev) => [...prev, r]),
        updateOrganRequest: (id, updates) =>
          setOrganRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r))),
        addBlockchainEvent: (e) => setBlockchainEvents((prev) => [e, ...prev]),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
