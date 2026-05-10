import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { name, startDate, endDate, description, coverImage } = body;

        if (!name || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const trip = await prisma.trip.create({
            data: {
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description,
                coverImage,
                userId
            }
        });

        return NextResponse.json({ trip });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const trips = await prisma.trip.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { stops: true }
        });
        return NextResponse.json({ trips });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
