import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { VolunteerInterestModel } from "@/domain/models/VolunteerInterestModel";
import { ROLES } from "@/constants/roles.constants";

// GET /api/volunteer-interests
// Admin: returns ALL interests
// Volunteer: returns only their own
export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  }
  try { await connectMongo(); } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "DB error" }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === ROLES.ADMIN || session.user.role === ROLES.SHELTER_MANAGER;
  const filter = isAdmin ? {} : { volunteerId: session.user.id };

  const interests = await VolunteerInterestModel.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return NextResponse.json({
    interests: interests.map((i) => ({
      id: (i as { _id: { toString(): string } })._id.toString(),
      volunteerId: String((i as { volunteerId?: string }).volunteerId ?? ""),
      volunteerEmail: String((i as { volunteerEmail?: string }).volunteerEmail ?? ""),
      requestId: String((i as { requestId?: string }).requestId ?? ""),
      requestType: String((i as { requestType?: string }).requestType ?? ""),
      requestDescription: String((i as { requestDescription?: string }).requestDescription ?? ""),
      requestSeverity: Number((i as { requestSeverity?: number }).requestSeverity ?? 1),
      status: String((i as { status?: string }).status ?? "open"),
      createdAt: (i as { createdAt?: Date }).createdAt?.toISOString() ?? "",
    })),
  });
}

// POST /api/volunteer-interests
// Volunteer raises their hand for a request
export async function POST(req: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  }
  try { await connectMongo(); } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "DB error" }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== ROLES.VOLUNTEER && session.user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as {
    requestId: string;
    requestType?: string;
    requestDescription?: string;
    requestSeverity?: number;
  };

  if (!body.requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  try {
    const interest = await VolunteerInterestModel.create({
      volunteerId: session.user.id,
      volunteerEmail: session.user.email ?? "",
      requestId: body.requestId,
      requestType: body.requestType ?? "",
      requestDescription: body.requestDescription ?? "",
      requestSeverity: body.requestSeverity ?? 1,
      status: "open",
    });
    return NextResponse.json({ id: interest._id.toString() }, { status: 201 });
  } catch (e: unknown) {
    const err = e as { code?: number };
    if (err?.code === 11000) {
      return NextResponse.json({ error: "already_raised" }, { status: 409 });
    }
    throw e;
  }
}
