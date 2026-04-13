import { RequestFactory } from "@/domain/patterns/factory/RequestFactory";

describe("RequestFactory", () => {
  it("creates medical request", () => {
    const r = RequestFactory.create("medical", "1", "c1", 3);
    expect(r).toBeDefined();
  });
});
