"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface ScoreSheetProps {
  candidate: any;
  eventId: string;
  config: any; // Contains the criteria (e.g., Voice: 50)
  onSuccess: () => void;
}

export function ScoreSheetModal({ candidate, eventId, config, onSuccess }: ScoreSheetProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State to hold scores: { "Voice": 45, "Stage Presence": 20 }
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/scores", {
        eventId,
        candidateId: candidate.id,
        breakdown: scores
      });
      alert("Score submitted!");
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit score");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total live
  const currentTotal = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
           <Star className="w-4 h-4 mr-2" /> Grade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scoring: {candidate.name}</DialogTitle>
          <p className="text-sm text-slate-500">Candidate #{candidate.number}</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          {/* Loop through criteria and create inputs */}
          {config?.criteria?.map((crit: any) => (
            <div key={crit.name} className="flex items-center justify-between gap-4">
              <Label className="w-1/2">{crit.name} <span className="text-xs text-slate-400">(Max {crit.max})</span></Label>
              <Input 
                type="number"
                max={crit.max}
                min={0}
                required
                className="w-1/2 text-right"
                placeholder="0"
                onChange={(e) => setScores({
                    ...scores,
                    [crit.name]: parseInt(e.target.value) || 0
                })}
              />
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-bold text-lg">Total Score:</span>
            <span className="font-bold text-2xl text-blue-600">{currentTotal}</span>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Score"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}