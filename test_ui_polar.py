import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        await page.goto('http://localhost:5173/mandala/')
        await page.wait_for_timeout(2000)

        # Select Smooth Polar Curve
        await page.select_option('select:has-text("Generativo")', value='smooth')
        await page.wait_for_timeout(1000)

        await page.screenshot(path='ui_verification_smooth.png')

        # Select Sharp Polar Curve
        await page.select_option('select:has-text("Suave")', value='sharp')
        await page.wait_for_timeout(1000)

        await page.screenshot(path='ui_verification_sharp.png')

        await browser.close()

asyncio.run(main())
