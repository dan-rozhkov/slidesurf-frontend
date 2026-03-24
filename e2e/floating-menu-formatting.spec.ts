import { test, expect } from "@playwright/test";

test.describe("Floating menu partial text formatting", () => {
  test("bold applies only to selected text after paste, not entire line", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Navigate to editor
    await page.goto("/editor");

    // Wait for TipTap editor to load
    const editor = page.locator(".tiptap.ProseMirror").first();
    await editor.waitFor({ timeout: 15000 });

    // Click into the editor to focus
    await editor.click();

    // Set clipboard and paste via keyboard
    await page.evaluate(async () => {
      await navigator.clipboard.writeText(
        "First line of text\nSecond line of text\nThird line of text"
      );
    });
    await page.keyboard.press("Meta+v");

    // Wait for pasted content
    await expect(page.getByText("First line of text").first()).toBeVisible();

    // Verify paste created separate paragraphs
    const firstParagraph = page.getByText("First line of text").first();
    const secondParagraph = page.getByText("Second line of text").first();
    await expect(firstParagraph).toBeVisible();
    await expect(secondParagraph).toBeVisible();

    // Click at the start of first pasted paragraph, then select "First" (5 chars)
    await firstParagraph.click();
    await page.keyboard.press("Home");
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Shift+ArrowRight");
    }

    // The floating menu should appear — find the Bold button
    const floatingMenu = page.locator("div.fixed").filter({
      has: page.locator("button"),
    }).first();
    await floatingMenu.waitFor({ state: "visible", timeout: 5000 });

    // Click Bold button (has lucide-bold SVG class)
    const boldButton = floatingMenu.locator("button").filter({
      has: page.locator(".lucide-bold"),
    });
    await boldButton.click();

    // Verify: only "First" is bold in the first paragraph
    const strongInFirst = firstParagraph.locator("strong");
    await expect(strongInFirst).toHaveCount(1);
    await expect(strongInFirst).toHaveText("First");

    // Verify: second paragraph has NO bold
    const strongInSecond = secondParagraph.locator("strong");
    await expect(strongInSecond).toHaveCount(0);
  });
});
