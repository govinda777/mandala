import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        await page.goto('http://localhost:5173/mandala/')
        await page.wait_for_timeout(2000) # Let mandala render and animations start

        # Click the random button to ensure it renders a new one
        await page.click('button:has-text("Gerar Aleatória")')
        await page.wait_for_timeout(1000)

        await page.screenshot(path='ui_verification.png')
        await browser.close()

asyncio.run(main())
