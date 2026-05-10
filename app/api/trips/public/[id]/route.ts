import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const trip = await prisma.trip.findUnique({
            where: { id: params.id },
            include: {
                user: { select: { name: true } },
                stops: { include: { activities: true } },
            }
        });

        if (!trip || !trip.isPublic) return NextResponse.json({ error: 'Not found or private' }, { status: 404 });

        return NextResponse.json({ trip });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
