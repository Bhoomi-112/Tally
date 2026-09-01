import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://localhost:5173";
let browser;

const results = [];

async function check(name, ok, extra = "") {
  results.push({ name, ok, extra });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  " + extra : ""}`);
}

try {
  browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Home loads with navbar
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  check(
    "home renders navbar + main",
    (await page.isVisible("#nav-logo")) && (await page.isVisible("main"))
  );

  // 2. Click "Chat" nav link → must NOT redirect home (the fixed bug)
  await page.click('nav a[href="/chat"]');
  await page.waitForTimeout(700);
  const chatH1 = await page.textContent("h1");
  const urlAfterChat = page.url();
  check(
    "Nav Chat link navigates to /chat (no bounce home)",
    urlAfterChat.includes("/chat") && /Tally Chat/i.test(chatH1 || ""),
    `url=${urlAfterChat} h1="${chatH1}"`
  );

  // 3. Click "Data" (/viz immersive page)
  await page.goto(BASE + "/");
  await page.waitForTimeout(300);
  await page.click('nav a[href="/viz"]');
  await page.waitForTimeout(1200);
  const vizUrl = page.url();
  check("Nav Data link stays on /viz", vizUrl.includes("/viz"), `url=${vizUrl}`);

  // 4. Click "Census" → stays on /census-data
  await page.goto(BASE + "/");
  await page.waitForTimeout(300);
  await page.click('nav a[href="/census-data"]');
  await page.waitForTimeout(700);
  check("Nav Census link stays on /census-data", page.url().includes("/census-data"), `url=${page.url()}`);

  // 5. Language switcher → Hindi
  await page.goto(BASE + "/");
  await page.waitForTimeout(300);
  await page.click(".lang-btn");
  await page.waitForTimeout(300);
  await page.click('.role-menu .role-option:has-text("हिन्दी")');
  await page.waitForTimeout(400);
  const hindiShown = await page.textContent(".nav-links");
  check("Language switcher → Hindi", /तिथियाँ/.test(hindiShown || ""), `nav="${hindiShown?.trim().slice(0, 40)}"`);

  // 6. Direct deep-link /chat (SPA route)
  await page.goto(BASE + "/chat", { waitUntil: "networkidle" });
  check("Direct deep-link /chat renders", page.url().includes("/chat") && (await page.isVisible("h1")));

  // 7. Bad route falls back to home
  await page.goto(BASE + "/does-not-exist", { waitUntil: "networkidle" });
  check("Unknown route → redirect home", page.url().endsWith("/"), `url=${page.url()}`);
} catch (err) {
  console.error("SMOKE ERROR:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
}

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.error(`\n${failed.length}/${results.length} checks FAILED`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${results.length} checks PASSED`);
}