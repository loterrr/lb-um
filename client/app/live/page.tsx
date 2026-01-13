"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trophy, Activity, Music } from "lucide-react";

export default function PublicLivePage() {
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all events (publicly accessible now)
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const socioEvents = events.filter(e => e.type === 'SOCIO');
  const sportEvents = events.filter(e => e.type === 'SPORT');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="mb-12 text-center pt-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
          NEXUS LIVE
        </h1>
        <p className="text-slate-400">Official Real-time Tabulation Board</p>
      </header>

      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* SOCIO SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-2">
            <Music className="w-6 h-6 text-purple-400" /> 
            <h2 className="text-2xl font-bold text-purple-100">Sociocultural Events</h2>
          </div>
          {socioEvents.length === 0 ? <p className="text-slate-600 italic">No events scheduled.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socioEvents.map(event => (
                <EventCard key={event.id} event={event} router={router} color="bg-purple-600 hover:bg-purple-700" />
              ))}
            </div>
          )}
        </section>

        {/* SPORTS SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-2">
            <Activity className="w-6 h-6 text-blue-400" /> 
            <h2 className="text-2xl font-bold text-blue-100">Sports Events</h2>
          </div>
          {sportEvents.length === 0 ? <p className="text-slate-600 italic">No events scheduled.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sportEvents.map(event => (
                <EventCard key={event.id} event={event} router={router} color="bg-blue-600 hover:bg-blue-700" />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

function EventCard({ event, router, color }: any) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-all">
      <CardHeader>
        <CardTitle className="text-slate-100">{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          className={`w-full ${color} text-white`}
          onClick={() => router.push(`/live/event/${event.id}`)} // Goes to Public Scoreboard
        >
          <Trophy className="w-4 h-4 mr-2" /> View Standings
        </Button>
      </CardContent>
    </Card>
  )
}
