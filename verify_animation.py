from playwright.sync_api import sync_playwright
import time

def verify_animation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:5173")
            # Wait for the component to load
            page.wait_for_selector("text=Mandala Generator")

            # Find the animation checkbox
            # It has label "Animar (Respiração)"
            checkbox = page.get_by_label("Animar (Respiração)")
            if checkbox.is_visible():
                print("Checkbox found")
            else:
                print("Checkbox not visible")

            checkbox.check()
            print("Checkbox checked")

            # Wait a bit for animation to start
            time.sleep(2)

            # Take screenshot
            page.screenshot(path="verification.png")
            print("Screenshot taken")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_animation()
