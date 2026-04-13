import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { ROLES } from "@/constants/roles.constants";
import { RequestModel } from "@/domain/models/RequestModel";

export async function GET(req: Request) {
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

  const role = session.user.role;
  if (role !== ROLES.ADMIN && role !== ROLES.SHELTER_MANAGER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const query: Record<string, any> = { isResourceRequest: true };
  
  if (role === ROLES.ADMIN) {
    query.status = "QUEUED"; // Admin only needs to see pending requests
  } else {
    query.citizenId = session.user.id; // Shelter Manager sees all their requests
  }

  const requests = await RequestModel.find(query)
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  const formatted = requests.map((r: any) => ({
    id: r._id.toString(),
    citizenId: String(r.citizenId),
    type: r.type,
    status: r.status,
    severity: r.severity,
    lat: r.lat,
    lng: r.lng,
    description: r.description ?? "",
    unitsNeeded: (r as any).unitsNeeded || 0,
  }));

  return NextResponse.json({ requests: formatted });
}
