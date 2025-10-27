from playwright.sync_api import Page, expect
import os

def test_mobile_scroll(page: Page):
    # 0. Create directory if it doesn't exist
    os.makedirs("jules-scratch/verification", exist_ok=True)

    # 1. Arrange: Go to the application's URL and set a mobile viewport.
    page.set_viewport_size({"width": 375, "height": 667})
    page.goto("http://localhost:3000/")

    # 2. Act: Click the button to start shooting
    start_shooting_button = page.get_by_role("button", name="開始拍攝")
    start_shooting_button.click()

    # Wait for the generation view to appear
    expect(page.locator("text=現場溝通")).to_be_visible(timeout=60000)

    # Scroll down the conversation panel
    conversation_panel = page.locator(".flex-grow.overflow-y-auto.pr-2.space-y-4")
    conversation_panel.evaluate("node => node.scrollTop = node.scrollHeight")

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")