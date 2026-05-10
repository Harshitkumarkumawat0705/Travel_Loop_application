import { getUserId } from "@/lib/auth"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Cardtitle } from "@/components/ui/card"
import { Plane, Calendar, MapPin, Settings, Share2, Plus } from "lucide-react"
import { format } from "date-fns"

export default async function TripsPage() {
    const userId = await getUserId()
    if (!userId) return null;

    const trips = await prisma.trip.findMany({
        where: { userId },
        orderBy: { startDate: 'asc' },
        include: { stops: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-primary">My Trips</h1>
                <Link href="/trips/create">
                    <Button><Plus className="w-4 h-4 mr-2" /> New Trip</Button>
                </Link>
            </div>
            {trips.length === 0 ? (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-primary/40">
                    <Plane className="w-16 h-16 mx-auto text-primary/40 mb-4" />
                    <p className="text-lg text-muted-foreground">You haven't planned any trips yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map(trip => (
                        <Card key={trip.id} className="overflow-hidden bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all group">
                            {trip.coverImage && (
                                <Link href={`/trips/${trip.id}`}>
                                    <div className="h-40 w-full overflow-hidden">
                                        <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </Link>
                            )}
                            <CardHeader className={trip.coverImage ? "pt-4" : ""}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">
                                            <Link href={`/trips/${trip.id}`} className="hover:text-primary transition-colors">{trip.name}</Link>
                                        </CardTitle>
                                        <CardDescription className="flex items-center mt-2 group-hover:text-primary transition-colors">
                                           <Calendar className="w-4 h-4 mr-1" /> 
                                           {format(new Date(trip.startDate), 'PP')} - {format(new Date(trip.endDate), 'PP')}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{trip.stops.length} Stops planned</span>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-white/50 border-t flex justify-end gap-2 p-3">
                                <Link href={`/trips/${trip.id}/edit`}>
                                    <Button variant="ghost" size="sm"><Settings className="w-4 h-4 mr-1" /> Edit</Button>
                                </Link>
                                <Link href={`/trips/${trip.id}`}>
                                    <Button variant="default" size="sm">View Itinerary</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
