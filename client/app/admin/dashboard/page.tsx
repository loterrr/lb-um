"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreateEventModal } from "@/components/create-event-modal"; // <--- Import this

export default function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  const fetchEvents = () => {
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => {
        if (err.response?.status === 401) router.push("/");
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        
        {/* Pass the fetchEvents function so the list updates automatically */}
        <CreateEventModal onSuccess={fetchEvents} /> 
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.type === 'SOCIO' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {event.type}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                Status: <span className="font-medium text-slate-900">{event.status}</span>
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/admin/event/${event.id}`)}
              >
                Manage Event
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}