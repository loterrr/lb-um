"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateEventModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "SOCIO",
    seasonId: "", // user will paste the ID here for now
    config: { criteria: [] } // Default empty config
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Default criteria for testing
    const defaultCriteria = [
        { name: "Voice Quality", max: 50 }, 
        { name: "Stage Presence", max: 50 }
    ];

    try {
      await api.post("/events", {
        ...formData,
        config: { criteria: defaultCriteria }
      });
      setOpen(false);
      onSuccess(); // Refresh the list
    } catch (err) {
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Create New Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <Label>Event Title</Label>
            <Input 
              placeholder="e.g. Singing Contest" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(val) => setFormData({...formData, type: val})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOCIO">Sociocultural</SelectItem>
                <SelectItem value="SPORT">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Season ID</Label>
            <Input 
              placeholder="Paste Season ID here" 
              value={formData.seasonId}
              onChange={(e) => setFormData({...formData, seasonId: e.target.value})}
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              (Use the ID from Prisma Studio for now, e.g., d8e1...)
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}