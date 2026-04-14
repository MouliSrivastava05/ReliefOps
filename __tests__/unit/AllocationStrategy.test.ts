import { GreedyStrategy } from "@/domain/patterns/strategy/GreedyStrategy";
import { SeverityStrategy } from "@/domain/patterns/strategy/SeverityStrategy";

describe("AllocationStrategy", () => {
  it("GreedyStrategy returns null when unimplemented", async () => {
    const s = new GreedyStrategy(null as any, null as any);
    await expect(s.allocate("x")).resolves.toBeNull();
  });

  it("SeverityStrategy returns null when unimplemented", async () => {
    const s = new SeverityStrategy(null as any, null as any);
    await expect(s.allocate("x")).resolves.toBeNull();
  });
});
