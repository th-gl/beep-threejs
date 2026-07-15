import { chromium } from "playwright";

const shotDir = "/private/tmp/claude-501/-Users-Abuzar-Documents-Sites-child-fe/5927f893-0d7f-4480-b84d-94dc6a5cbacb/scratchpad";

async function shotAttempts(page, name, count = 3, gapMs = 700) {
  for (let i = 0; i < count; i++) {
    await page.screenshot({ path: `${shotDir}/${name}-${i}.png` });
    await page.waitForTimeout(gapMs);
  }
}

async function findLabelCenter(page, text) {
  return page.evaluate((needle) => {
    const nodes = Array.from(document.querySelectorAll("div"));
    const hit = nodes.find((n) => n.textContent?.trim() === needle);
    if (!hit) return null;
    const rect = hit.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }, text);
}

async function walkToBuilding(browser, buildingLabel, shotPrefix, errors) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`[${shotPrefix}] ${msg.text()}`); });
  page.on("pageerror", (err) => errors.push(`[${shotPrefix}] ${String(err)}`));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByText("Step Inside").click();
  await page.waitForTimeout(1200);

  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();

  // sweep a slow drag looking for the building's sign to appear in view
  let target = null;
  const sweeps = [0.15, 0.3, 0.7, 0.85, 0.95, 0.05];
  for (const fx of sweeps) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * fx, box.y + box.height * 0.5, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    target = await findLabelCenter(page, buildingLabel);
    if (target) break;
  }

  console.log(`${shotPrefix} sign found at:`, JSON.stringify(target));
  if (!target) {
    await shotAttempts(page, `${shotPrefix}-not-found`, 2);
    await page.close();
    return;
  }

  await shotAttempts(page, `${shotPrefix}-sighted`, 1, 200);

  // click well below the sign (which floats above the door) to hit the floor near the doorway
  await page.mouse.click(target.x, Math.min(box.y + box.height - 20, target.y + 260));
  await page.waitForTimeout(400);
  await shotAttempts(page, `${shotPrefix}-marker`, 1, 200);
  await page.waitForTimeout(5000); // let the glide fully play out (may need a second leg)

  const roomAfterFirst = await page.locator("h2").first().textContent();
  console.log(`${shotPrefix} room after first glide:`, roomAfterFirst);

  // if still on the street, click again slightly further to step through the door
  if (roomAfterFirst === "Main Street") {
    const target2 = await findLabelCenter(page, buildingLabel);
    if (target2) {
      await page.mouse.click(target2.x, Math.min(box.y + box.height - 20, target2.y + 200));
      await page.waitForTimeout(3500);
    }
  }

  await shotAttempts(page, `${shotPrefix}-final`, 3);
  console.log(`${shotPrefix} room final:`, await page.locator("h2").first().textContent());
  await page.close();
}

const browser = await chromium.launch({ args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const errors = [];

await walkToBuilding(browser, "The Fuel Stop", "town3-fuel", errors);
await walkToBuilding(browser, "The Firehouse", "town3-fire", errors);

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
