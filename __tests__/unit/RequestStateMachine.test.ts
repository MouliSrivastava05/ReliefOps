import { RequestStateMachine } from "@/domain/patterns/state/RequestStateMachine";

describe("RequestStateMachine", () => {
  it("transitions state", () => {
    const sm = new RequestStateMachine("PENDING");
    sm.transition("ASSIGNED");
    expect(sm.getState()).toBe("ASSIGNED");
  });
});
