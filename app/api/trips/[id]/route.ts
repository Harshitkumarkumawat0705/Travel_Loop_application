import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const trip = await prisma.trip.findUnique({
            where: { id: params.id },
            include: {
                stops: { include: { activities: true } },
                expenses: true,
                packingItems: true,
                notes: true
            }
        });

        if (!trip) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (trip.userId !== userId && !trip.isPublic) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        return NextResponse.json({ trip });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        
        // ensure owner
        const existing = await prisma.trip.findUnique({ where: { id: params.id }});
        if (existing?.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const trip = await prisma.trip.update({
            where: { id: params.id },
            data: {
                name: body.name,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
                description: body.description,
                coverImage: body.coverImage,
                isPublic: body.isPublic
            }
        });
        return NextResponse.json({ trip });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const existing = await prisma.trip.findUnique({ where: { id: params.id }});
        if (existing?.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await prisma.trip.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
