"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, MapPin, Activity as ActivityIcon, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TripEditPage() {
    const params = useParams()
    const router = useRouter()
    const [trip, setTrip] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [newStop, setNewStop] = useState({ cityName: "", arrivalDate: "", departureDate: "", notes: "" })
    
    useEffect(() => {
        const fetchTrip = async () => {
            const res = await fetch(`/api/trips/${params.id}`)
            if (res.ok) {
                const data = await res.json()
                setTrip(data.trip)
            }
            setLoading(false)
        }
        fetchTrip()
    }, [params.id])

    const handleAddStop = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch(`/api/trips/${params.id}/stops`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStop)
        })
        if (res.ok) {
            const data = await res.json()
            setTrip({...trip, stops: [...trip.stops, data.stop]})
            setNewStop({ cityName: "", arrivalDate: "", departureDate: "", notes: "" })
        }
    }

    if (loading) return <div className="text-center py-20 animate-pulse">Loading...</div>
    if (!trip) return <div className="text-center py-20 text-destructive">Trip not found.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
               <Link href={`/trips/${trip.id}`}>
                  <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5"/></Button>
               </Link>
               <div>
                 <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Itinerary: {trip.name}</h1>
                 <p className="text-muted-foreground">Add destinations and activities to your trip.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {trip.stops.length === 0 ? (
                        <div className="bg-white/50 backdrop-blur-md p-8 text-center rounded-xl border-dashed border-2">
                           <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                           <p className="text-muted-foreground">No stops added yet. Start building your route!</p>
                        </div>
                    ) : (
                        trip.stops.map((stop: any) => (
                            <Card key={stop.id} className="bg-white/70 backdrop-blur-md shadow-lg border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-primary" /> {stop.cityName}
                                            </CardTitle>
                                            <CardDescription>
                                                {new Date(stop.arrivalDate).toLocaleDateString()} to {new Date(stop.departureDate).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground mb-4">{stop.notes}</div>
                                    <div className="space-y-2">
                                        <div className="font-semibold text-sm flex items-center gap-2">
                                            <ActivityIcon className="w-4 h-4 text-primary" /> Activities
                                        </div>
                                        {stop.activities && stop.activities.length > 0 ? (
                                            <ul className="space-y-2">
                                                {stop.activities.map((act: any) => (
                                                    <li key={act.id} className="text-sm bg-white p-2 rounded shadow-sm flex justify-between">
                                                        <span>{act.name} <span className="text-muted-foreground">({act.type})</span></span>
                                                        <span className="font-medium text-emerald-600">${act.estimatedCost}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">No activities planned.</div>
                                        )}
                                        {/* Activity Add Dialog/Form could go here, keeping MVP simple, user can add here */}
                                        <div className="mt-4 pt-4 border-t">
                                            <ActivityForm stopId={stop.id} onAdd={(activity) => {
                                                const newStops = trip.stops.map((s: any) => {
                                                    if (s.id === stop.id) {
                                                        return {...s, activities: [...(s.activities || []), activity]}
                                                    }
                                                    return s
                                                })
                                                setTrip({...trip, stops: newStops})
                                            }} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="bg-white/80 backdrop-blur-md shadow-xl sticky top-20">
                        <CardHeader>
                            <CardTitle>Add Destination</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleAddStop}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>City Name</Label>
                                    <Input value={newStop.cityName} onChange={e=>setNewStop({...newStop, cityName: e.target.value})} required placeholder="Paris, France" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Arrival Date</Label>
                                    <Input type="date" value={newStop.arrivalDate} onChange={e=>setNewStop({...newStop, arrivalDate: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Departure Date</Label>
                                    <Input type="date" value={newStop.departureDate} onChange={e=>setNewStop({...newStop, departureDate: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Notes (Optional)</Label>
                                    <Input value={newStop.notes} onChange={e=>setNewStop({...newStop, notes: e.target.value})} placeholder="Staying near Eiffel Tower" />
                                </div>
                            </CardContent>
                            <CardContent>
                                <Button type="submit" className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Stop</Button>
                            </CardContent>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function ActivityForm({ stopId, onAdd }: { stopId: string, onAdd: (activity: any) => void }) {
    const [name, setName] = useState("")
    const [type, setType] = useState("Sightseeing")
    const [cost, setCost] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await fetch(`/api/stops/${stopId}/activities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, type, estimatedCost: cost })
        })
        if (res.ok) {
            const data = await res.json()
            onAdd(data.activity)
            setName("")
            setCost("")
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 p-3 bg-secondary/30 rounded-lg">
            <div className="flex gap-2">
                <Input size={1} className="flex-1 text-sm h-8" placeholder="Activity name (e.g. Louvre)" value={name} onChange={e=>setName(e.target.value)} required />
                <Input type="number" className="w-20 text-sm h-8" placeholder="Cost $" value={cost} onChange={e=>setCost(e.target.value)} required />
            </div>
            <div className="flex justify-between items-center mt-1">
                <select className="text-sm bg-transparent border-none text-muted-foreground focus:ring-0 cursor-pointer" value={type} onChange={e=>setType(e.target.value)}>
                    <option>Sightseeing</option>
                    <option>Food</option>
                    <option>Adventure</option>
                    <option>Nature</option>
                </select>
                <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs disabled:opacity-50" disabled={loading}>Add Activity</Button>
            </div>
        </form>
    )
}
