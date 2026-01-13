"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ScoreSheetModal } from "@/components/score-sheet-modal";

export default function JudgeEventPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
    api.get(`/candidates/event/${id}`).then((res) => setCandidates(res.data));
  }, [id]);

  if (!event) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.push('/judge/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">{event.title}</h1>
        <p className="text-slate-500">Judge's View</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((c) => (
          <Card key={c.id} className="overflow-hidden">
            <div className="bg-slate-200 h-32 flex items-center justify-center">
               {/* Placeholder for Photo */}
               <span className="text-4xl font-bold text-slate-400">#{c.number}</span>
            </div>
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-1">{c.name}</h3>
              <p className="text-sm text-slate-500 mb-6">Contestant</p>
              
              <ScoreSheetModal 
                candidate={c} 
                eventId={event.id} 
                config={event.config} 
                onSuccess={() => console.log("Score Refresh?")} 
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}