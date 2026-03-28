import { GreedyStrategy } from "@/domain/patterns/strategy/GreedyStrategy";
import { SeverityStrategy } from "@/domain/patterns/strategy/SeverityStrategy";

describe("AllocationStrategy", () => {
  it("GreedyStrategy returns null when unimplemented", async () => {
    const s = new GreedyStrategy();
    await expect(s.allocate("x")).resolves.toBeNull();
  });

  it("SeverityStrategy returns null when unimplemented", async () => {
    const s = new SeverityStrategy();
    await expect(s.allocate("x")).resolves.toBeNull();
  });
});
