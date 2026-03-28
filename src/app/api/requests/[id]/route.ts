import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  return NextResponse.json({ id });
}

export async function PATCH(_req: Request, { params }: Params) {
  const { id } = await params;
  return NextResponse.json({ id, updated: true });
}
