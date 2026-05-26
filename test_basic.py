from playwright.sync_api import sync_playwright
import time
import sys
import subprocess

def test_rendering():
    # Build the application
    print("Building application...")
    build_process = subprocess.run(['npm', 'run', 'build'], capture_output=True, text=True)
    if build_process.returncode != 0:
        print(f"Build failed:\n{build_process.stderr}")
        sys.exit(1)

    # Start the preview server
    print("Starting preview server...")
    server_process = subprocess.Popen(
        ['npm', 'run', 'preview'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    # Wait for the server to be ready
    time.sleep(5)

    success = False

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()

            # Listen to console events
            errors = []
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            page.on("pageerror", lambda err: errors.append(str(err)))

            # Go to the local preview server
            page.goto('http://localhost:4173/mandala/')

            # Wait for canvas to be present
            page.wait_for_selector('canvas')

            # Check title
            title = page.title()
            assert "Mandala Generator" in title, f"Expected 'Mandala Generator' in title, got {title}"

            # Wait a bit to ensure no runtime errors pop up after initial render
            time.sleep(2)

            browser.close()

            if errors:
                print(f"Test failed. Browser console errors: {errors}")
            else:
                print("E2E Playwright test passed successfully.")
                success = True
    except Exception as e:
        print(f"Test failed with exception: {e}")
    finally:
        # Kill the preview server
        print("Shutting down preview server...")
        server_process.terminate()
        server_process.wait()

        if success:
            sys.exit(0)
        else:
            sys.exit(1)

if __name__ == "__main__":
    test_rendering()
