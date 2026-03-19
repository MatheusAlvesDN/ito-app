import subprocess
import time
from playwright.sync_api import sync_playwright

def run_test():
    subprocess.run(["kill $(lsof -t -i:5173) 2>/dev/null || true"], shell=True)
    server_process = subprocess.Popen(["pnpm", "dev"])
    time.sleep(3)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            page.goto("http://localhost:5173")
            page.locator("button:has-text('JOGAR')").click(force=True)
            page.locator("text='Quem vai jogar?'").wait_for(state="visible", timeout=5000)

            input_locator = page.locator("input[placeholder='Nome do participante']")
            input_locator.fill("Alice")

            # The button to add doesn't have the text 'Adicionar' inside it. It has the lucide-plus icon.
            # Using the exact button that appears after the input field in PlayerInput component:
            page.locator("button.bg-sky-500").click(force=True)

            page.locator("span", has_text="Alice").wait_for(state="visible", timeout=5000)

            input_locator.fill("Bob")
            page.locator("button.bg-sky-500").click(force=True)

            page.locator("span", has_text="Bob").wait_for(state="visible", timeout=5000)

            print("Frontend tests passed successfully!")
            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    run_test()
