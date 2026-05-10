import { getUserId } from "@/lib/auth"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Plane, Compass, Plus, Calendar } from "lucide-react"
import { format } from "date-fns"

export default async function HomePage() {
  const userId = await getUserId()

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary drop-shadow-sm">
            Traveloop
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[600px] mx-auto">
            Plan your next adventure with ease. Build itineraries, track budgets, and explore the world.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/50 backdrop-blur-sm">Log In</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16 text-left">
           <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
             <CardHeader>
               <Map className="w-10 h-10 text-primary mb-2" />
               <CardTitle>Multi-city Itineraries</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">Easily map out your entire trip stop-by-stop with interactive timelines.</p>
             </CardContent>
           </Card>
           <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
             <CardHeader>
               <Plane className="w-10 h-10 text-primary mb-2" />
               <CardTitle>Activities & Budget</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">Keep track of your expenses and plan your daily activities seamlessly.</p>
             </CardContent>
           </Card>
           <Card className="bg-white/60 backdrop-blur-md border-white/20 shadow-xl">
             <CardHeader>
               <Compass className="w-10 h-10 text-primary mb-2" />
               <CardTitle>Share with Friends</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-muted-foreground">Generate a public link and share your perfect travel plan with anyone.</p>
             </CardContent>
           </Card>
        </div>
      </div>
    )
  }

  // Dashboard for logged in user
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { trips: { orderBy: { startDate: 'asc' }, take: 3 } } })
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Traveler"}! 👋</h1>
          <p className="text-muted-foreground">Here is an overview of your upcoming adventures.</p>
        </div>
        <Link href="/trips/create">
          <Button className="rounded-full shadow-md"><Plus className="w-4 h-4 mr-2" /> Create New Trip</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Recent Trips</h2>
            <Link href="/trips" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {user?.trips && user.trips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.trips.map(trip => (
                <Link href={`/trips/${trip.id}`} key={trip.id}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer bg-white/70 backdrop-blur-sm border-white/40 overflow-hidden group">
                    {trip.coverImage && (
                      <div className="h-32 w-full overflow-hidden">
                        <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <CardHeader className={trip.coverImage ? "pt-4" : ""}>
                      <CardTitle>{trip.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-white/50 backdrop-blur-sm border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                <Map className="w-12 h-12 mb-4 opacity-20" />
                <p>No trips planned yet.</p>
                <Link href="/trips/create" className="text-primary hover:underline mt-2">Start planning your first trip</Link>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-semibold">Recommended Destinations</h2>
           <div className="space-y-4">
              {[
                { name: "Kyoto, Japan", img: "https://picsum.photos/seed/kyoto/400/200", tag: "Culture" },
                { name: "Santorini, Greece", img: "https://picsum.photos/seed/santorini/400/200", tag: "Relaxation" },
                { name: "Banff, Canada", img: "https://picsum.photos/seed/banff/400/200", tag: "Nature" }
              ].map((dest, i) => (
                <Card key={i} className="overflow-hidden border-none shadow-md">
                   <div className="relative h-32 w-full">
                     <img src={dest.img} alt={dest.name} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                       <div>
                         <div className="text-white font-semibold">{dest.name}</div>
                         <div className="text-white/80 text-xs">{dest.tag}</div>
                       </div>
                     </div>
                   </div>
                </Card>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
