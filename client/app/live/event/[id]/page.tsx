"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Trophy } from "lucide-react";

export default function PublicScoreboard() {
  const { id } = useParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<Record<string, any>>({});

  const fetchData = async () => {
    if (!id) return;
    try {
      const [eventRes, candRes, scoreRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/candidates/event/${id}`),
        api.get(`/scores/leaderboard/${id}`)
      ]);

      setEvent(eventRes.data);
      
      const candMap: Record<string, any> = {};
      candRes.data.forEach((c: any) => candMap[c.id] = c);
      setCandidates(candMap);
      
      setLeaderboard(scoreRes.data);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds for "Live" feel
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, [id]);

  if (!event) return <div className="p-8 text-white bg-slate-950 min-h-screen">Loading results...</div>;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Button variant="ghost" className="text-slate-400 hover:text-white pl-0" onClick={() => router.push('/live')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
          </Button>
          <div className="text-right">
             <h1 className="text-2xl md:text-4xl font-bold">{event.title}</h1>
             <p className="text-slate-400 text-sm">Live Results</p>
          </div>
        </div>

        <div className="space-y-4">
          {leaderboard.map((entry, index) => {
            const candidate = candidates[entry.candidateId];
            if (!candidate) return null;

            // Coloring logic for top 3
            let bgClass = "bg-slate-900 border-slate-800";
            let rankColor = "text-slate-500 bg-slate-800";
            let rankLabel = "";
            
            if (index === 0) { 
                bgClass = "bg-gradient-to-r from-yellow-900/20 to-slate-900 border-yellow-700/50"; 
                rankColor = "bg-yellow-500 text-yellow-950"; 
                rankLabel = "👑";
            }
            else if (index === 1) { 
                bgClass = "bg-slate-900 border-slate-600"; 
                rankColor = "bg-slate-400 text-slate-900"; 
            }
            else if (index === 2) { 
                bgClass = "bg-slate-900 border-orange-800"; 
                rankColor = "bg-orange-700 text-orange-100"; 
            }

            return (
              <Card key={entry.candidateId} className={`border-l-4 ${bgClass} text-slate-100 transition-all transform hover:scale-[1.01]`}>
                <CardContent className="p-6 flex items-center gap-6">
                  {/* Rank */}
                  <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-xl ${rankColor}`}>
                    {index + 1}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-bold">{candidate.name}</h2>
                        <span>{rankLabel}</span>
                    </div>
                    <p className="text-slate-400">Contestant #{candidate.number}</p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-400">{entry.finalScore.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">Average</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}