from playwright.sync_api import Page, expect

def test_simple_screenshot(page: Page):
    page.goto("http://localhost:3000/")
    page.screenshot(path="jules-scratch/verification/verification.png")