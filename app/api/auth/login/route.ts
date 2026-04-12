import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error: "Endpoint legado desativado. Utilize Firebase Authentication no cliente.",
    },
    { status: 410 }
  );
}

