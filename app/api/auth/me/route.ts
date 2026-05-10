import { NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, avatar: true }
    });

    return NextResponse.json({ user });
}
