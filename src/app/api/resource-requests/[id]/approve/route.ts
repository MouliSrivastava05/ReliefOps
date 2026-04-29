import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { ROLES } from "@/constants/roles.constants";
import { RequestModel } from "@/domain/models/RequestModel";
import { ResourceModel } from "@/domain/models/ResourceModel";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
  if (!session?.user?.id || session.user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const p = await params;
  const requestId = p.id;

  const resourceRequest = await RequestModel.findById(requestId);
  if (!resourceRequest) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!resourceRequest.isResourceRequest) {
    return NextResponse.json({ error: "Not a resource request" }, { status: 400 });
  }
  if (resourceRequest.status !== "QUEUED") {
    return NextResponse.json({ error: "Request is not in QUEUED status" }, { status: 400 });
  }

  // Create the resource
  const newResource = new ResourceModel({
    name: `${resourceRequest.type.charAt(0).toUpperCase() + resourceRequest.type.slice(1)} (Requested by Shelter)`,
    type: resourceRequest.type,
    quantityAvailable: resourceRequest.unitsNeeded || 1,
    lat: resourceRequest.lat,
    lng: resourceRequest.lng,
    shelterTag: String(resourceRequest.citizenId),
  });
  await newResource.save();

  // Update request status to RESOLVED
  resourceRequest.status = "RESOLVED";
  await resourceRequest.save();

  return NextResponse.json({ success: true, resourceId: newResource._id });
}
