"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Trophy } from "lucide-react"; // <--- Added Trophy
import { CreateCandidateModal } from "@/components/create-candidate-modal";

export default function EventManagementPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);

  const fetchCandidates = () => {
    if (!id) return;
    api.get(`/candidates/event/${id}`).then((res) => setCandidates(res.data));
  };

  useEffect(() => {
    if (!id) return;
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
    fetchCandidates();
  }, [id]);

  if (!event) return <div className="p-8">Loading event...</div>;

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.push('/admin/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>
            <p className="text-slate-500 mt-2">Managing {event.type} Event</p>
          </div>
          
          <div className="flex gap-2">
            {/* NEW: Button to view the Leaderboard */}
            <Button 
              variant="secondary" 
              onClick={() => router.push(`/admin/event/${id}/results`)}
            >
              <Trophy className="w-4 h-4 mr-2" /> View Results
            </Button>

            {/* Modal to Add Candidates */}
            <CreateCandidateModal eventId={id as string} onSuccess={fetchCandidates} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Candidates List */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold">Candidates</h2>
            
            {candidates.length === 0 ? (
                <Card className="bg-slate-100 border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <p>No candidates added yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map((c) => (
                        <Card key={c.id}>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xl text-slate-600">
                                    {c.number}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{c.name}</h3>
                                    <p className="text-xs text-slate-400">ID: {c.id.substring(0, 8)}...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>

        {/* Right Column: Quick Stats / Criteria */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Criteria Config</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {event.config?.criteria?.map((crit: any, idx: number) => (
                            <li key={idx} className="flex justify-between text-sm border-b pb-2 last:border-0">
                                <span>{crit.name}</span>
                                <span className="font-bold">{crit.max} pts</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}