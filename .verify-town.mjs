import { chromium } from "playwright";

const shotDir = "/private/tmp/claude-501/-Users-Abuzar-Documents-Sites-child-fe/5927f893-0d7f-4480-b84d-94dc6a5cbacb/scratchpad";

async function shotAttempts(page, name, count = 3, gapMs = 700) {
  for (let i = 0; i < count; i++) {
    await page.screenshot({ path: `${shotDir}/${name}-${i}.png` });
    await page.waitForTimeout(gapMs);
  }
}

const browser = await chromium.launch({ args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });

const errors = [];

// Pass 1: entry, town overview via map, walk to Beep Beep's door
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[p1] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`[p1] ${String(err)}`));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByText("Step Inside").click();
  await page.waitForTimeout(1500);
  console.log("Room label on entry (should be street/null):", await page.locator("h2").first().textContent());
  await shotAttempts(page, "town-01-street", 3);

  // open the map to see the whole town
  await page.getByText("View Map").click();
  await page.waitForTimeout(1500);
  await shotAttempts(page, "town-02-map", 3);

  // back to walkthrough
  await page.getByText("Back to Walkthrough").click();
  await page.waitForTimeout(1300);

  // tap-to-walk toward Beep Beep's building (south, ahead)
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.55);
  await page.waitForTimeout(400);
  await shotAttempts(page, "town-03-walking-to-door", 2);
  await page.waitForTimeout(3500); // let the longer glide play out
  await shotAttempts(page, "town-04-near-door", 3);

  console.log("CONSOLE_ERRORS_P1:", JSON.stringify(errors));
  await page.close();
}

await browser.close();
