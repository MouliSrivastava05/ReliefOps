import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { VolunteerApplicationModel } from "@/domain/models/VolunteerApplicationModel";
import { UserModel } from "@/domain/models/UserModel";
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

  // Mark application as rejected
  await VolunteerApplicationModel.findByIdAndUpdate(id, { status: "rejected" });

  // Mark the user as rejected (not active, still blocked)
  await UserModel.findByIdAndUpdate(userId, { status: "rejected" });

  return NextResponse.json({ success: true });
}
