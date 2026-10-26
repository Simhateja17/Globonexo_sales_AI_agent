import { describe, expect, it } from "vitest";
import { leadPhoto } from "./lead-photo";

describe("leadPhoto", () => {
  it("reads Apollo's photo from the lead or its raw record", () => {
    expect(leadPhoto({ photoUrl: "https://img.example.com/a.jpg" })).toBe("https://img.example.com/a.jpg");
    expect(leadPhoto({ rawData: { photo_url: "https://img.example.com/b.jpg" } })).toBe("https://img.example.com/b.jpg");
    expect(leadPhoto({ rawData: { contact: { photo_url: "https://img.example.com/c.jpg" } } })).toBe("https://img.example.com/c.jpg");
  });

  it("only allows https links", () => {
    expect(leadPhoto({ rawData: { photo_url: "http://img.example.com/a.jpg" } })).toBe("");
    expect(leadPhoto({ rawData: { photo_url: "javascript:alert(1)" } })).toBe("");
    expect(leadPhoto({ rawData: null })).toBe("");
  });
});
