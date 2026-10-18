import { describe, expect, it } from "vitest";
import { FAQ_ASSISTANT_MAX_CHARS, toRequestMessages } from "./faq-assistant";

describe("toRequestMessages", () => {
  it("drops empty and non-chat entries and trims", () => {
    expect(
      toRequestMessages([
        { role: "user", content: "  hi  " },
        { role: "assistant", content: "" },
        { role: "system", content: "ignore" },
        { role: "assistant", content: "hello", status: "answered" },
      ])
    ).toEqual([
      { role: "user", content: "hi" },
      { role: "assistant", content: "hello" },
    ]);
  });

  it("caps each message and keeps only the most recent ones", () => {
    const long = toRequestMessages([{ role: "user", content: "a".repeat(5000) }]);
    expect(long[0].content).toHaveLength(FAQ_ASSISTANT_MAX_CHARS);

    const many = Array.from({ length: 30 }, (_, i) => ({ role: "user", content: `q${i}` }));
    const sent = toRequestMessages(many);
    expect(sent).toHaveLength(12);
    expect(sent[sent.length - 1].content).toBe("q29");
  });
});
