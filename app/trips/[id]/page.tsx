"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MapPin, Calendar as CalIcon, Map, Settings, Share2, ClipboardList, PenTool, Globe, Lock } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import Link from "next/link"

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];

export default function TripViewPage() {
    const params = useParams()
    const router = useRouter()
    const [trip, setTrip] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [shareUrl, setShareUrl] = useState("")

    useEffect(() => {
        const fetchTrip = async () => {
            const res = await fetch(`/api/trips/${params.id}`)
            if (res.ok) {
                const data = await res.json()
                setTrip(data.trip)
                setShareUrl(window.location.origin + `/trips/public/${data.trip.id}`)
            }
            setLoading(false)
        }
        fetchTrip()
    }, [params.id])

    const togglePublic = async () => {
        const res = await fetch(`/api/trips/${params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPublic: !trip.isPublic })
        })
        if (res.ok) {
            setTrip({...trip, isPublic: !trip.isPublic})
        }
    }

    if (loading) return <div className="text-center py-20 animate-pulse">Loading itinerary...</div>
    if (!trip) return <div className="text-center py-20 text-destructive">Trip not found or unauthorized.</div>

    // Calculate budget
    let totalCost = 0;
    const categoryTotals: Record<string, number> = { "Sightseeing": 0, "Food": 0, "Adventure": 0, "Nature": 0, "Other": 0 };
    trip.stops?.forEach((stop: any) => {
        stop.activities?.forEach((act: any) => {
            totalCost += act.estimatedCost || 0;
            if (categoryTotals[act.type] !== undefined) {
                categoryTotals[act.type] += act.estimatedCost;
            } else {
                categoryTotals["Other"] += act.estimatedCost;
            }
        })
    })

    const chartData = Object.keys(categoryTotals)
        .filter(k => categoryTotals[k] > 0)
        .map(k => ({ name: k, value: categoryTotals[k] }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-2xl">
               {trip.coverImage ? (
                   <img src={trip.coverImage} className="absolute inset-0 w-full h-full object-cover" alt={trip.name} />
               ) : (
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary to-blue-400" />
               )}
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
               <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end text-white">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">{trip.name}</h1>
                  <p className="flex items-center gap-2 mt-2 text-lg text-white/90 drop-shadow">
                      <CalIcon className="w-5 h-5" />
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
               </div>
               <div className="absolute top-4 right-4 flex gap-2">
                   <Button variant="secondary" size="sm" onClick={togglePublic} className={trip.isPublic ? "bg-emerald-500/80 text-white hover:bg-emerald-600/80" : ""}>
                       {trip.isPublic ? <><Globe className="w-4 h-4 mr-2" /> Public</> : <><Lock className="w-4 h-4 mr-2" /> Private</>}
                   </Button>
                   {trip.isPublic && (
                       <Button variant="secondary" size="sm" onClick={() => {
                           navigator.clipboard.writeText(shareUrl)
                           alert("Public URL copied to clipboard: " + shareUrl)
                       }}><Share2 className="w-4 h-4 mr-2" /> Copy Link</Button>
                   )}
                   <Link href={`/trips/${trip.id}/edit`}>
                       <Button variant="secondary" size="sm"><Settings className="w-4 h-4 mr-2"/> Edit Itinerary</Button>
                   </Link>
               </div>
            </div>

            <Tabs defaultValue="itinerary" className="w-full">
                <TabsList className="grid grid-cols-4 max-w-2xl bg-white/50 backdrop-blur-md">
                    <TabsTrigger value="itinerary"><Map className="w-4 h-4 mr-2 hidden sm:block"/> Itinerary</TabsTrigger>
                    <TabsTrigger value="budget"><MapPin className="w-4 h-4 mr-2 hidden sm:block"/> Budget</TabsTrigger>
                    <TabsTrigger value="packing"><ClipboardList className="w-4 h-4 mr-2 hidden sm:block"/> Packing</TabsTrigger>
                    <TabsTrigger value="notes"><PenTool className="w-4 h-4 mr-2 hidden sm:block"/> Notes</TabsTrigger>
                </TabsList>
                
                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="mt-6 space-y-6">
                    {trip.stops?.length === 0 ? (
                        <div className="text-center py-10 bg-white/50 rounded-xl">No destinations added yet.</div>
                    ) : (
                        <div className="relative border-l-2 border-primary/30 ml-4 md:ml-8 space-y-8 pb-8">
                            {trip.stops.map((stop: any, idx: number) => (
                                <div key={stop.id} className="relative pl-8">
                                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-primary ring-4 ring-white" />
                                    <h3 className="text-2xl font-bold text-primary">{stop.cityName}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}
                                    </p>
                                    {stop.notes && <p className="mb-4 text-muted-foreground bg-white/50 p-3 rounded-lg text-sm">{stop.notes}</p>}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {stop.activities?.map((act: any) => (
                                            <Card key={act.id} className="bg-white/80 shadow-sm border-none">
                                                <CardContent className="p-4 flex flex-col gap-1">
                                                    <div className="font-semibold">{act.name}</div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-widest">{act.type}</div>
                                                    <div className="text-emerald-600 font-medium">${act.estimatedCost}</div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Budget Tab */}
                <TabsContent value="budget" className="mt-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Card className="bg-white/70 backdrop-blur-sm">
                           <CardHeader>
                               <CardTitle>Total Estimated Cost</CardTitle>
                           </CardHeader>
                           <CardContent>
                               <div className="text-5xl font-extrabold text-primary">${totalCost}</div>
                               <p className="text-muted-foreground mt-2">Based on activities planned. Hotels and Transport can be added to expenses (feature coming soon!).</p>
                           </CardContent>
                       </Card>
                       <Card className="bg-white/70 backdrop-blur-sm">
                           <CardHeader>
                               <CardTitle>Breakdown</CardTitle>
                           </CardHeader>
                           <CardContent className="flex justify-center h-64">
                               {totalCost === 0 ? (
                                   <div className="flex items-center text-muted-foreground">No costs added yet.</div>
                               ) : (
                                   <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                   </ResponsiveContainer>
                               )}
                           </CardContent>
                       </Card>
                   </div>
                </TabsContent>

                <TabsContent value="packing" className="mt-6">
                    <Card className="bg-white/70 backdrop-blur-sm">
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Packing checklist feature is under construction! (Hackathon MVP scope)
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes" className="mt-6">
                    <Card className="bg-white/70 backdrop-blur-sm">
                        <CardContent className="py-10 text-center text-muted-foreground">
                            Trip Notes and Journaling feature is under construction! (Hackathon MVP scope)
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
