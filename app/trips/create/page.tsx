"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function CreateTripPage() {
    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [description, setDescription] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, startDate, endDate, description, coverImage })
            })
            if (res.ok) {
                const { trip } = await res.json()
                router.push(`/trips/${trip.id}/edit`)
            } else {
                alert("Failed to create trip")
            }
        } catch (e) {
            alert("Error creating trip")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Create New Trip</CardTitle>
                    <CardDescription>Start planning your next adventure.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Trip Name</Label>
                            <Input id="name" placeholder="Summer in Europe" value={name} onChange={e=>setName(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input id="startDate" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input id="endDate" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description (Optional)</Label>
                            <Input id="desc" placeholder="A 2-week trip exploring the best of Italy and France" value={description} onChange={e=>setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="img">Cover Image URL (Optional)</Label>
                            <Input id="img" type="url" placeholder="https://picsum.photos/seed/europe/800/400" value={coverImage} onChange={e=>setCoverImage(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Trip"}</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
