import { NextResponse } from "next/server";

export async function GET() {
    return new NextResponse('1.0.0', {
        status: 200
    }) 
}