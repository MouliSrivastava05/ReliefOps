import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { VolunteerApplicationModel } from "@/domain/models/VolunteerApplicationModel";
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
  if (session.user.role !== ROLES.ADMIN && session.user.role !== ROLES.SHELTER_MANAGER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const applications = await VolunteerApplicationModel.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return NextResponse.json({
    applications: applications.map((a) => ({
      id: (a as { _id: { toString(): string } })._id.toString(),
      userId: String(a.userId),
      email: String(a.email),
      name: String((a as { name?: string }).name ?? ""),
      skills: (a as { skills?: string[] }).skills ?? [],
      message: String((a as { message?: string }).message ?? ""),
      status: String(a.status),
      createdAt: (a as { createdAt?: Date }).createdAt?.toISOString() ?? "",
    })),
  });
}
