import {expect, test} from "@playwright/test";

test("builds a readiness plan and tracks evidence", async ({page}) => {
  await page.goto("/");
  await page.getByRole("button", {name: "Build my readiness plan"}).click();
  const results = page.getByTestId("results");
  await expect(results).toContainText("ACT NOW");
  await expect(results).toContainText("$920");
  await page.getByLabel("Save every page of the notice and envelope").check();
  await expect(results).toContainText("20% ready");
});

test("switches cases and changes the policy assumption", async ({page}) => {
  await page.goto("/");
  await page.getByRole("button", {name: /SSI household/}).click();
  await page.getByRole("button", {name: "Build my readiness plan"}).click();
  await expect(page.getByTestId("results")).toContainText("10% demo policy assumption");
});

test("validates bad input and recovers from simulated failure", async ({page}) => {
  await page.goto("/");
  await page.getByLabel("Overpayment amount").fill("0");
  await page.getByRole("button", {name: "Build my readiness plan"}).click();
  await expect(page.locator(".error[role=alert]")).toContainText("above zero");
  await page.getByLabel("Overpayment amount").fill("5000");
  await page.getByLabel("Simulate failure").check();
  await page.getByRole("button", {name: "Build my readiness plan"}).click();
  await expect(page.locator(".error[role=alert]")).toContainText("did not respond");
  await page.getByRole("button", {name: "Try again"}).click();
  await expect(page.getByTestId("results")).toBeVisible();
});

test("has no horizontal overflow on mobile", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
