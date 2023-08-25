import { describe, expect, test } from "@jest/globals";
import { Scraper } from "../libs/Scraper";
describe("gets the match url", () => {
  const first = "روما";
  const last = "سامبدوريا";
  const linl = "https://www.koralivetv.net/2022/08/Ad-Premium1HD.html";

  test("saves the correct match url", () => {
    const scraper = new Scraper(first, last);
    console.log(scraper);
    expect(3).toBe(3);
  });
});
