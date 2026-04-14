import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/add-patient")({
  component: AddPatient,
});

function AddPatient() {
  const { doctors, addPatient } = useData();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [condition, setCondition] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient({ id: `p${Date.now()}`, name, age: parseInt(age), bloodType, medicalCondition: condition, doctorId });
    toast.success(`Patient ${name} added successfully`);
    setName(""); setAge(""); setBloodType(""); setCondition(""); setDoctorId("");
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Patient</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="45" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Blood Type</label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((bt) => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Medical Condition</label>
              <Input value={condition} onChange={(e) => setCondition(e.target.value)} required placeholder="End-stage renal disease" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned Doctor</label>
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialization}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={!bloodType || !doctorId}>Add Patient</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
