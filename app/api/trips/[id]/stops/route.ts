import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        // verify ownership
        const trip = await prisma.trip.findUnique({ where: { id: params.id }});
        if (trip?.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { cityName, arrivalDate, departureDate, notes } = body;

        const stop = await prisma.stop.create({
            data: {
                tripId: params.id,
                cityName,
                arrivalDate: new Date(arrivalDate),
                departureDate: new Date(departureDate),
                notes
            }
        });

        return NextResponse.json({ stop });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
