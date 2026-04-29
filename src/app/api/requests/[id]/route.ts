import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongodb";
import { RequestRepository } from "@/domain/repositories/RequestRepository";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: any) {
  const { id } = await params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid request ID format" }, { status: 400 });
  }

  try {
    await connectMongo();
    const repo = new RequestRepository();
    const doc = await repo.findById(id);
    
    if (!doc) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Explicitly return a clean object to avoid any serialization issues with lean docs
    return NextResponse.json({
      id: doc._id.toString(),
      type: String(doc.type || "unknown"),
      status: String(doc.status || "UNKNOWN"),
      severity: Number(doc.severity || 0),
      description: String(doc.description || ""),
      lat: Number(doc.lat || 0),
      lng: Number(doc.lng || 0),
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    });
  } catch (e) {
    console.error("Tracking API Error:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(_req: Request, { params }: any) {
  const { id } = await params;
  return NextResponse.json({ id, updated: true });
}
