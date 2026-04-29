import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { globalObserverManager } from "@/domain/patterns/observer/ObserverManager";
import { GreedyStrategy } from "@/domain/patterns/strategy/GreedyStrategy";
import { SeverityStrategy } from "@/domain/patterns/strategy/SeverityStrategy";
import { RequestRepository } from "@/domain/repositories/RequestRepository";
import { ResourceRepository } from "@/domain/repositories/ResourceRepository";
import { authOptions } from "@/lib/auth";
import { connectMongo, isMongoConfigured } from "@/lib/mongodb";
import { AllocationService } from "@/services/AllocationService";
import { ROLES } from "@/constants/roles.constants";

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
  if (
    session.user.role !== ROLES.ADMIN &&
    session.user.role !== ROLES.SHELTER_MANAGER
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as {
    requestId?: string;
    strategy?: "greedy" | "severity";
  };
  const requestId = body.requestId;
  if (!requestId) {
    return NextResponse.json({ error: "requestId required" }, { status: 400 });
  }

  const strategyName = body.strategy === "severity" ? "severity" : "greedy";
  const reqRepo = new RequestRepository();
  const resRepo = new ResourceRepository();
  const strategy =
    strategyName === "severity"
      ? new SeverityStrategy(reqRepo, resRepo)
      : new GreedyStrategy(reqRepo, resRepo);

  const allocation = new AllocationService(
    strategy,
    reqRepo,
    resRepo,
    globalObserverManager,
  );

  const result = await allocation.run(requestId, strategyName);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 409 });
  }
  return NextResponse.json({
    ok: true,
    resourceId: result.resourceId,
    strategy: strategyName,
  });
}
