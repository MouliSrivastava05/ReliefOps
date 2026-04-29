import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { VolunteerModel } from "@/domain/models/VolunteerModel";
import { ROLES } from "@/constants/roles.constants";

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
  if (session.user.role !== ROLES.VOLUNTEER && session.user.role !== ROLES.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const volunteer = await VolunteerModel.findOne({ userId: session.user.id }).lean().exec();
  if (!volunteer) {
    return NextResponse.json({ error: "Volunteer profile not found" }, { status: 404 });
  }

  return NextResponse.json({
    available: volunteer.available,
    skills: volunteer.skills,
    lat: volunteer.lat,
    lng: volunteer.lng,
  });
}
