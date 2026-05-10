import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const stop = await prisma.stop.findUnique({ where: { id: params.id }, include: { trip: true }});
        if (stop?.trip.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { name, type, duration, estimatedCost, description, image } = body;

        const activity = await prisma.activity.create({
            data: {
                stopId: params.id,
                name,
                type,
                duration,
                estimatedCost: Number(estimatedCost),
                description,
                image
            }
        });

        return NextResponse.json({ activity });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
