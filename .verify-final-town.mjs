import { chromium } from "playwright";

const shotDir = "/private/tmp/claude-501/-Users-Abuzar-Documents-Sites-child-fe/5927f893-0d7f-4480-b84d-94dc6a5cbacb/scratchpad";

async function findLabelCenter(page, text) {
  return page.evaluate((needle) => {
    const nodes = Array.from(document.querySelectorAll("div"));
    const hit = nodes.find((n) => n.textContent?.trim() === needle && n.getBoundingClientRect().width > 0);
    if (!hit) return null;
    const rect = hit.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }, text);
}

async function walkToBuilding(browser, buildingLabel, direction, shotPrefix, errors) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[${shotPrefix}] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`[${shotPrefix}] ${String(err)}`));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByText("Step Inside").click();
  await page.waitForTimeout(1200);

  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  let cursorX = box.width * 0.5;

  for (let i = 0; i < 10; i++) {
    const nextX = box.x + Math.max(0.05, Math.min(0.95, cursorX / box.width + direction * 0.06)) * box.width;
    await page.mouse.move(box.x + cursorX, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(nextX, box.y + box.height * 0.5, { steps: 10 });
    await page.mouse.up();
    cursorX = nextX - box.x;
    await page.waitForTimeout(350);
    const label = await findLabelCenter(page, buildingLabel);
    if (label && Math.abs(label.x - (box.x + box.width / 2)) < 40) break;
  }

  await page.keyboard.down("w");
  await page.waitForTimeout(25000);
  await page.keyboard.up("w");
  await page.waitForTimeout(1500);

  await page.screenshot({ path: `${shotDir}/final-${shotPrefix}.png` });
  console.log(`${shotPrefix} room final:`, await page.locator("h2").first().textContent());
  await page.close();
}

const browser = await chromium.launch({ args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const errors = [];

await walkToBuilding(browser, "The Fuel Stop", -1, "fuel", errors);
await walkToBuilding(browser, "The Firehouse", 1, "fire", errors);

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
