import { RequestStateMachine } from "@/domain/patterns/state/RequestStateMachine";

describe("RequestStateMachine", () => {
  it("transitions state", () => {
    const sm = new RequestStateMachine("CREATED");
    sm.transition("VALIDATED");
    expect(sm.getState()).toBe("VALIDATED");
  });
});
