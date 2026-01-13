"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Trophy } from "lucide-react";

export default function ResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<Record<string, any>>({});

  const fetchData = async () => {
    if (!id) return;
    
    // 1. Get Event Details
    const eventRes = await api.get(`/events/${id}`);
    setEvent(eventRes.data);

    // 2. Get Candidates (to map ID -> Name)
    const candRes = await api.get(`/candidates/event/${id}`);
    const candMap: Record<string, any> = {};
    candRes.data.forEach((c: any) => candMap[c.id] = c);
    setCandidates(candMap);

    // 3. Get The Scores
    const scoreRes = await api.get(`/scores/leaderboard/${id}`);
    setLeaderboard(scoreRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (!event) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Button variant="ghost" className="mb-2 pl-0" onClick={() => router.push(`/admin/event/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Management
          </Button>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <Trophy className="text-yellow-500 w-8 h-8" />
            Official Results
          </h1>
          <p className="text-slate-500 mt-1">{event.title}</p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Live
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
          <div className="grid grid-cols-12 font-bold text-sm uppercase tracking-wide">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6">Candidate / Team</div>
            <div className="col-span-2 text-center">Judges</div>
            <div className="col-span-2 text-right">Final Average</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No scores submitted yet.
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const candidate = candidates[entry.candidateId];
              if (!candidate) return null;

              // Highlight Top 3
              let rowClass = "border-b last:border-0 hover:bg-slate-50 transition-colors";
              let rankBadge = "text-slate-500";
              
              if (index === 0) { rowClass += " bg-yellow-50"; rankBadge = "bg-yellow-100 text-yellow-700"; } // Gold
              if (index === 1) { rowClass += " bg-slate-50"; rankBadge = "bg-slate-200 text-slate-700"; } // Silver
              if (index === 2) { rowClass += " bg-orange-50"; rankBadge = "bg-orange-100 text-orange-800"; } // Bronze

              return (
                <div key={entry.candidateId} className={`grid grid-cols-12 items-center p-4 ${rowClass}`}>
                  {/* Rank */}
                  <div className="col-span-1 flex justify-center">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${rankBadge}`}>
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Candidate Number */}
                  <div className="col-span-1 text-center font-mono text-slate-400">
                    #{candidate.number}
                  </div>

                  {/* Name */}
                  <div className="col-span-6 font-semibold text-lg">
                    {candidate.name}
                  </div>

                  {/* Judge Count */}
                  <div className="col-span-2 text-center text-sm text-slate-500">
                    {entry.judgeCount} votes
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-right font-bold text-xl text-slate-800">
                    {entry.finalScore.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}