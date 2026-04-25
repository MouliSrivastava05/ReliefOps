import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { VolunteerApplicationModel } from "@/domain/models/VolunteerApplicationModel";
import { UserModel } from "@/domain/models/UserModel";
import { VolunteerModel } from "@/domain/models/VolunteerModel";
import { ROLES } from "@/constants/roles.constants";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;

  const application = await VolunteerApplicationModel.findById(id).lean().exec();
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const userId = String((application as { userId?: string }).userId ?? "");

  // Approve the application
  await VolunteerApplicationModel.findByIdAndUpdate(id, { status: "approved" });

  // Set the user status to "active" so they can log in
  await UserModel.findByIdAndUpdate(userId, { status: "active" });

  // Create a VolunteerModel entry if it doesn't already exist
  const existing = await VolunteerModel.findOne({ userId }).lean().exec();
  if (!existing) {
    await VolunteerModel.create({
      userId,
      skills: (application as { skills?: string[] }).skills ?? [],
      lat: 0,
      lng: 0,
      available: true,
    });
  }

  return NextResponse.json({ success: true });
}
