import {
  takeScreenshot,
  takeFullPageScreenshot,
  tapElement,
  fillField,
  checkTouchTargets,
  auditFontWeights,
  auditTextTruncation,
  auditLayoutOverflow,
  waitForSelector,
} from "/Users/thanzzzz/.gemini/config/skills/bun-ui-ux-testing/resources/harness.ts";

const targetUrl = "http://localhost:3002/order.html";
const outputDir = "/Users/thanzzzz/.gemini/antigravity/scratch/kape-point-cafe/artifacts/screenshots";

console.log("Starting Bun UI/UX Test on Ordering Portal:", targetUrl);

await using view = new Bun.WebView({ width: 1440, height: 900 });
await view.navigate(targetUrl);
await Bun.sleep(500);

// 1. Unauthenticated state capture
console.log("1. Testing Initial Ordering Portal (Guest State)...");
await takeScreenshot(view, `${outputDir}/10-order-guest-view.png`);

// 2. Open Auth Modal & Perform Quick Demo Sign-In
console.log("2. Testing Sign In Flow...");
await tapElement(view, "#open-auth-modal-btn");
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/11-order-auth-modal.png`);

// Click quick demo login as Juan Dela Cruz
await tapElement(view, "#quick-demo-btn");
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/12-order-authenticated-view.png`);

// 3. Category Filter & Search Test
console.log("3. Testing Category Filter & Search...");
await tapElement(view, '.order-filter-bar .filter-btn[data-category="espresso"]');
await Bun.sleep(300);
await takeScreenshot(view, `${outputDir}/13-order-filtered-espresso.png`);

// 4. Item Customization Modal
console.log("4. Testing Item Customization Flow...");
await tapElement(view, '.order-card[data-id="spanish-latte"] .add-item-trigger-btn');
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/14-order-customization-modal.png`);

// Select Oat Milk & 50% sweet
await tapElement(view, 'input[name="opt-milk"][value="oat"]');
await tapElement(view, 'input[name="opt-sweet"][value="50%"]');
await tapElement(view, 'input[name="opt-shot"][value="extra"]');
await Bun.sleep(300);
await takeScreenshot(view, `${outputDir}/15-order-customized-options.png`);

// Add to tray
await tapElement(view, "#confirm-add-item-btn");
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/16-order-tray-with-item.png`);

// 5. Add a croissant too
await tapElement(view, '.order-filter-bar .filter-btn[data-category="pastry"]');
await Bun.sleep(300);
await tapElement(view, '.order-card[data-id="butter-croissant"] .add-item-trigger-btn');
await Bun.sleep(300);
await tapElement(view, "#confirm-add-item-btn");
await Bun.sleep(400);

// Toggle tumbler discount
await tapElement(view, "#tumbler-discount-checkbox");
await Bun.sleep(300);
await takeScreenshot(view, `${outputDir}/17-order-tray-multiple-items.png`);

// 6. Complete Order & Verify Receipt
console.log("6. Testing Checkout & Receipt Confirmation...");
await tapElement(view, "#checkout-btn");
await Bun.sleep(500);
await takeScreenshot(view, `${outputDir}/18-order-confirmed-receipt.png`);

// Close receipt modal
await tapElement(view, "#receipt-close-btn");
await Bun.sleep(300);

// 7. Viewport & Accessibility Audits on order.html
console.log("7. Auditing Viewports & Accessibility...");
await view.resize(375, 812);
await Bun.sleep(400);
await takeScreenshot(view, `${outputDir}/19-order-mobile-view.png`);
const mobileOverflow = await auditLayoutOverflow(view);
const mobileTouch = await checkTouchTargets(view, 44);

await view.resize(1440, 900);
await Bun.sleep(300);
const fontViolations = await auditFontWeights(view);

console.log("Ordering Portal Test Results:", {
  mobileOverflow: mobileOverflow.hasHorizontalOverflow,
  mobileTouchViolations: mobileTouch.length,
  fontViolations: fontViolations.length
});
