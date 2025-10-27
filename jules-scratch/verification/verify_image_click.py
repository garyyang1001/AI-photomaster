from playwright.sync_api import Page, expect
import time
import os

def test_image_click(page: Page):
    # 0. Create directory if it doesn't exist
    os.makedirs("jules-scratch/verification", exist_ok=True)

    # 1. Arrange: Go to the application's URL.
    page.goto("http://localhost:3000/")

    # 2. Act: Click the button to start shooting
    start_shooting_button = page.get_by_role("button", name="開始拍攝")
    start_shooting_button.click()

    # Wait for the generation view to appear
    expect(page.locator("text=現場溝通")).to_be_visible(timeout=60000)

    # Find the first image in the conversation history and click it
    # This is a bit of a hack, we're just assuming the first image is the one we want to click
    # A more robust solution would be to use a more specific selector
    history_image = page.locator(".flex-grow.overflow-y-auto.pr-2.space-y-4 img").first
    history_image.click()

    # Add a small delay to ensure the image has time to render
    time.sleep(2)

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")