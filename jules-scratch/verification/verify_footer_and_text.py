from playwright.sync_api import Page, expect
import os

def test_footer_and_text(page: Page):
    # 0. Create directory if it doesn't exist
    os.makedirs("jules-scratch/verification", exist_ok=True)

    # 1. Arrange: Go to the application's URL.
    page.goto("http://localhost:3002/")

    # 2. Assert: Check if the footer is visible.
    expect(page.locator("footer")).to_be_visible()

    # 3. Act: Click the button to start shooting
    start_shooting_button = page.get_by_role("button", name="開始拍攝")
    start_shooting_button.click()

    # Wait for the generation view to appear
    expect(page.locator("text=現場溝通")).to_be_visible(timeout=60000)

    # 4. Act: Send a message to generate text and an image
    message_input = page.locator("input[placeholder='向模特兒下指令...']")
    message_input.fill("你站在涉谷的十字路口，你的眼神凝重，思考著未來")
    send_button = page.get_by_role("button", name="發送")
    send_button.click()

    # Wait for the response to appear
    expect(page.locator("text=你站在涉谷的十字路口，你的眼神凝重，思考著未來")).to_be_visible(timeout=60000)

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")