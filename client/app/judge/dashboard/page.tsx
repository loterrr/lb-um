"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function JudgeDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch events (In a real app, we might filter this to only assigned events)
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => {
        if (err.response?.status === 401) router.push("/");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Judge's Panel</h1>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <CardHeader>
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                Status: <span className="font-medium text-slate-900">{event.status}</span>
              </p>
              <Button 
                className="w-full"
                onClick={() => router.push(`/judge/event/${event.id}`)}
              >
                Enter & Score
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}