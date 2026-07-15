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

// Pass A: map view framing check
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[A] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`[A] ${String(err)}`));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByText("Step Inside").click();
  await page.waitForTimeout(1200);
  await page.getByText("View Map").click();
  await page.waitForTimeout(1500);
  await shotAttempts(page, "town2-map", 3);
  await page.close();
}

// Pass B: walk into the Fuel Station (west side)
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[B] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`[B] ${String(err)}`));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByText("Step Inside").click();
  await page.waitForTimeout(1200);

  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  // turn to face west (left) toward the Fuel Station
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.5, { steps: 15 });
  await page.mouse.up();
  await page.waitForTimeout(500);
  await shotAttempts(page, "town2-facing-fuel", 2);

  // tap far ahead to walk toward it
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.6);
  await page.waitForTimeout(300);
  await page.waitForTimeout(4500);
  await shotAttempts(page, "town2-fuel-arrived", 3);
  console.log("Room after walking to Fuel Station:", await page.locator("h2").first().textContent());
  await page.close();
}

// Pass C: walk into the Firehouse (east side)
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[C] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`[C] ${String(err)}`));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByText("Step Inside").click();
  await page.waitForTimeout(1200);

  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  // turn to face east (right) toward the Firehouse
  await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.5, { steps: 15 });
  await page.mouse.up();
  await page.waitForTimeout(500);

  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.6);
  await page.waitForTimeout(300);
  await page.waitForTimeout(4500);
  await shotAttempts(page, "town2-firehouse-arrived", 3);
  console.log("Room after walking to Firehouse:", await page.locator("h2").first().textContent());
  await page.close();
}

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
