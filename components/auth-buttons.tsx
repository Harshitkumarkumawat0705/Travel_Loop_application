"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AuthButtons() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Quick check via client
        fetch("/api/auth/me").then(r => r.json()).then(data => {
            setIsLoggedIn(!!data.user)
        }).catch(() => setIsLoggedIn(false))
    }, [])

    if (isLoggedIn === null) return null // loading

    if (isLoggedIn) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" })
                    window.location.href = "/"
                }}>Logout</Button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Link href="/login">
                <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
                <Button>Sign Up</Button>
            </Link>
        </div>
    )
}
