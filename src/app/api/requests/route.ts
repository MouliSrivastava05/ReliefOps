import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { DashboardObserver } from "@/domain/patterns/observer/DashboardObserver";
import { RequestRepository } from "@/domain/repositories/RequestRepository";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { RequestService } from "@/services/RequestService";
import { ROLES } from "@/constants/roles.constants";
import { isRequestType } from "@/utils/validators";



export async function GET(req: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 503 });
  }
  try {
    await connectMongo();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Database error" },
      { status: 503 },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const feed = searchParams.get("feed") === "1";

  // For general list, citizens can see their own? 
  // Actually the dashboard needs full list. 
  // Let's restrict feed to staff.
  if (feed && session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SHELTER_MANAGER) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const repo = new RequestRepository();
  const docs = await repo.findAll();

  const requests = docs.map((d) => ({
    id: d._id.toString(),
    citizenId: d.citizenId,
    type: d.type,
    status: d.status,
    severity: d.severity,
    lat: d.lat,
    lng: d.lng,
    description: d.description,
  }));

  if (feed) {
    return NextResponse.json({
      requests,
      allocationEvents: DashboardObserver.snapshot(),
    });
  }

  // Filter for citizens and shelter managers to only see their own if not admin
  const filtered = (session.user.role === ROLES.ADMIN)
    ? requests
    : requests.filter(r => r.citizenId === session.user.id);

  return NextResponse.json({ requests: filtered });
}

export async function POST(req: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "MONGODB_URI is not configured" },
      { status: 503 },
    );
  }
  try {
    await connectMongo();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Database error" },
      { status: 503 },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const type = body.type;
  const severity = Number(body.severity);
  const description = String(body.description ?? "");
  const lat = Number(body.lat);
  const lng = Number(body.lng);

  if (!isRequestType(type) || Number.isNaN(severity) || severity < 1 || severity > 5) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
  }

  const citizenId =
    session.user.role === ROLES.CITIZEN
      ? session.user.id
      : String(body.citizenId ?? session.user.id);

  const repo = new RequestRepository();
  const service = new RequestService(repo);
  const result = await service.createAndQueue({
    citizenId,
    type,
    severity,
    description,
    lat,
    lng,
    isResourceRequest: body.isResourceRequest === true,
    unitsNeeded: Number(body.qty) || 0,
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result, { status: 201 });
}
