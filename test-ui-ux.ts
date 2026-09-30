import {
  takeScreenshot,
  takeFullPageScreenshot,
  scrollThroughPage,
  scrollToElement,
  tapElement,
  checkTouchTargets,
  auditFontWeights,
  auditTextTruncation,
  auditLayoutOverflow,
  waitForSelector,
} from "/Users/thanzzzz/.gemini/config/skills/bun-ui-ux-testing/resources/harness.ts";

const targetUrl = "http://localhost:3002";
const outputDir = "/Users/thanzzzz/.gemini/antigravity/scratch/kape-point-cafe/artifacts/screenshots";

await Bun.write(`${outputDir}/.gitkeep`, "");

console.log("Starting Bun UI/UX Test Suite on", targetUrl);

await using view = new Bun.WebView({ width: 1920, height: 1080 });
await view.navigate(targetUrl);
await Bun.sleep(500);

// 1. Full HD Desktop Viewport (1920x1080)
console.log("1. Testing Full HD Desktop (1920x1080)...");
await takeScreenshot(view, `${outputDir}/01-desktop-1920.png`);
await takeFullPageScreenshot(view, `${outputDir}/01-desktop-fullpage.png`);
const desktopOverflow = await auditLayoutOverflow(view);
const desktopTruncation = await auditTextTruncation(view);

// 2. Standard Laptop Viewport (1366x768)
console.log("2. Testing Standard Laptop (1366x768)...");
await view.resize(1366, 768);
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/02-laptop-1366.png`);
const laptopTruncation = await auditTextTruncation(view);
const laptopOverflow = await auditLayoutOverflow(view);

// 3. Compact Desktop (1280x800)
console.log("3. Testing Compact Desktop (1280x800)...");
await view.resize(1280, 800);
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/03-compact-1280.png`);
const compactTruncation = await auditTextTruncation(view);

// 4. Tablet Portrait (768x1024)
console.log("4. Testing Tablet Portrait (768x1024)...");
await view.resize(768, 1024);
await Bun.sleep(400);
await takeFullPageScreenshot(view, `${outputDir}/04-tablet-fullpage.png`);
const tabletOverflow = await auditLayoutOverflow(view);
const tabletTouchTargets = await checkTouchTargets(view, 44);

// 5. Mobile Portrait (375x812)
console.log("5. Testing Mobile Portrait (375x812)...");
await view.resize(375, 812);
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/05-mobile-viewport.png`);
await takeFullPageScreenshot(view, `${outputDir}/05-mobile-fullpage.png`);
const mobileOverflow = await auditLayoutOverflow(view);
const mobileTouchViolations = await checkTouchTargets(view, 44);

// 6. Interactive Testing: Mobile Menu Toggle
console.log("6. Testing Mobile Navigation Drawer...");
await tapElement(view, "#mobile-menu-btn");
await Bun.sleep(300);
await takeScreenshot(view, `${outputDir}/06-mobile-menu-open.png`);
await tapElement(view, "#mobile-menu-btn");
await Bun.sleep(300);

// 7. Interactive Testing: Theme Toggle (Dark Mode)
console.log("7. Testing Dark Mode Toggle...");
await view.resize(1366, 768);
await Bun.sleep(300);
await tapElement(view, "#theme-toggle");
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/07-dark-mode-hero.png`);
await takeFullPageScreenshot(view, `${outputDir}/07-dark-mode-fullpage.png`);

// 8. Interactive Testing: Category Filtering
console.log("8. Testing Menu Category Filter (Espresso & Brews)...");
await scrollToElement(view, "#menu");
await Bun.sleep(300);
await tapElement(view, '.filter-btn[data-category="espresso"]');
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/08-menu-filtered-espresso.png`);

// 9. Interactive Testing: Table Reservation Modal
console.log("9. Testing Table Reservation Modal Dialog...");
await tapElement(view, "#open-reserve-btn-header");
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/09-reservation-modal-open.png`);
await tapElement(view, "#close-modal-btn");
await Bun.sleep(300);

// 10. Typography & Font Weight Audit
console.log("10. Auditing Font Weights...");
const fontViolations = await auditFontWeights(view);

const auditReport = {
  desktop: {
    hasOverflow: desktopOverflow.hasHorizontalOverflow,
    truncationCount: desktopTruncation.length,
    truncations: desktopTruncation
  },
  laptop: {
    hasOverflow: laptopOverflow.hasHorizontalOverflow,
    truncationCount: laptopTruncation.length,
    truncations: laptopTruncation
  },
  tablet: {
    hasOverflow: tabletOverflow.hasHorizontalOverflow,
    touchTargetViolations: tabletTouchTargets.length
  },
  mobile: {
    hasOverflow: mobileOverflow.hasHorizontalOverflow,
    touchViolationsCount: mobileTouchViolations.length,
    touchViolations: mobileTouchViolations
  },
  fontViolations: {
    count: fontViolations.length,
    violations: fontViolations
  }
};

await Bun.write(`${outputDir}/audit-report.json`, JSON.stringify(auditReport, null, 2));
console.log("UI/UX Audit Complete! Report saved to audit-report.json");
console.log(JSON.stringify(auditReport, null, 2));
