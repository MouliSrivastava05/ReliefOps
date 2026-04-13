import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ResourceModel } from "@/domain/models/ResourceModel";
import { ResourceRepository } from "@/domain/repositories/ResourceRepository";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { ResourceService } from "@/services/ResourceService";
import { ROLES } from "@/constants/roles.constants";
import { isRequestType } from "@/utils/validators";

export async function GET() {
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

  const repo = new ResourceRepository();
  const service = new ResourceService(repo);
  const list = await service.list();
  const resources = list.map((r) => ({
    id: r._id.toString(),
    name: r.name,
    type: r.type,
    quantityAvailable: r.quantityAvailable,
    lat: r.lat,
    lng: r.lng,
  }));
  return NextResponse.json({ resources });
}

export async function POST(req: Request) {
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
  if (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SHELTER_MANAGER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const name = String(body.name ?? "");
  const type = body.type;
  const quantityAvailable = Number(body.quantityAvailable ?? 1);
  const lat = Number(body.lat ?? 0);
  const lng = Number(body.lng ?? 0);
  const shelterTag = String(body.shelterTag ?? "");

  if (!name || !isRequestType(type) || Number.isNaN(quantityAvailable) || quantityAvailable < 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const created = await ResourceModel.create({
    name,
    type,
    quantityAvailable,
    lat,
    lng,
    shelterTag,
  });

  return NextResponse.json({ id: created._id.toString() }, { status: 201 });
}
