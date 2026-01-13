"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

interface CreateCandidateModalProps {
  eventId: string;
  onSuccess: () => void;
}

export function CreateCandidateModal({ eventId, onSuccess }: CreateCandidateModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "", 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Explicitly convert to integer
      const payload = {
        eventId,
        name: formData.name,
        number: parseInt(formData.number, 10), // Base 10
      };

      console.log("Sending payload:", payload); // Check your browser console to see what is sent

      await api.post("/candidates", payload);
      
      // 2. Success!
      setFormData({ name: "", number: "" });
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      console.error("Full Error Object:", err);
      // 3. Show the REAL error from the server
      const serverMessage = err.response?.data?.message || "Failed to add candidate";
      alert(`Error: ${JSON.stringify(serverMessage)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
           <UserPlus className="w-4 h-4 mr-2" /> Add Candidate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <Label>Candidate Name / Team</Label>
            <Input 
              placeholder="e.g. Maria Santos or Team Red" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <Label>Candidate Number</Label>
            <Input 
              type="number"
              placeholder="e.g. 1" 
              value={formData.number}
              onChange={(e) => setFormData({...formData, number: e.target.value})}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Candidate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}