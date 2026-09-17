import { test, expect } from "@playwright/test";
test("menu, keyboard, playable panels and saved settings", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".menu-button")).toHaveText([
    /Play now/,
    /How to play/,
    /Gold Believers Campaign/,
    /Pack ripping/,
    /Settings/,
    /Mini games/,
  ]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: `test-results/${info.project.name}-menu.png`,
    fullPage: true,
  });
  await page.locator(".menu-button").first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator(".menu-button").nth(1)).toBeFocused();
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  for (let i = 1; i <= 3; i++)
    await page
      .getByRole("button", { name: `Awaken rune ${i}`, exact: true })
      .click();
  await expect(page.getByText("3 / 3 RUNES AWAKENED")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".menu-button").first()).toBeFocused();
  await page.getByRole("button", { name: /Pack ripping/ }).click();
  await page.getByRole("button", { name: "Rip the pack" }).click();
  await expect(page.getByText("Dawnkeeper")).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();
  await page.getByRole("button", { name: /Mini games/ }).click();
  for (const r of ["ᚷ", "ᚠ", "ᚹ", "ᚱ"])
    await page.getByRole("button", { name: `Rune ${r}`, exact: true }).click();
  await expect(page.getByRole("status")).toContainText("The seal is restored");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Settings/ }).click();
  await page.getByRole("checkbox", { name: /Menu sound/ }).check();
  await page.getByRole("checkbox", { name: /Living parchment/ }).uncheck();
  await page.reload();
  await expect(page.getByRole("button", { name: "Mute sound" })).toBeVisible();
  await expect(page.locator(".console")).toHaveClass(/still/);
  expect(errors).toEqual([]);
});
