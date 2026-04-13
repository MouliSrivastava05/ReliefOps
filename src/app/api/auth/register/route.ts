import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/domain/models/UserModel";
import { VolunteerModel } from "@/domain/models/VolunteerModel";
import { ROLES } from "@/constants/roles.constants";

export async function POST(req: Request) {
  try {
    await connectMongo();
    
    const body = await req.json();
    const { name, email, password, role, motivation, skills } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (!Object.values(ROLES).includes(role)) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() }).lean().exec();
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    // Role-specific settings
    let status = "active";
    if (role === ROLES.VOLUNTEER || role === ROLES.SHELTER_MANAGER) {
      // Volunteers and Shelter Managers need admin approval
      status = "pending";
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create User
    const newUser = await UserModel.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      status,
      motivation: motivation || undefined,
    });

    // Create Volunteer profile if applicable
    if (role === ROLES.VOLUNTEER && skills && Array.isArray(skills)) {
      await VolunteerModel.create({
        userId: newUser._id.toString(),
        skills: skills.filter(Boolean),
      });
    }

    return NextResponse.json(
      { message: "Registration successful!", status: newUser.status },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
