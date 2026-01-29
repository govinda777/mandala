from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173")

        # Verify title or header
        expect(page.get_by_role("heading", name="Mandala Generator")).to_be_visible()

        # Find the checkbox
        pulsing_checkbox = page.get_by_label("Animação de Respiração")
        expect(pulsing_checkbox).to_be_visible()

        # Click it
        pulsing_checkbox.check()
        expect(pulsing_checkbox).to_be_checked()

        # Wait a bit for potential render update
        page.wait_for_timeout(1000)

        # Take screenshot
        page.screenshot(path="verification/pulsing_enabled.png")

        browser.close()

if __name__ == "__main__":
    run()
