import sys
import subprocess
import time
from playwright.sync_api import sync_playwright

def verify_frontend():
    # Start the Vite dev server
    print("Starting Vite server...")
    subprocess.run(["kill $(lsof -t -i:5173) 2>/dev/null || true"], shell=True)
    server_process = subprocess.Popen(["pnpm", "dev"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(3) # Wait for server to start

    try:
        with sync_playwright() as p:
            print("Launching browser...")
            browser = p.chromium.launch()
            page = browser.new_page()

            print("Navigating to app...")
            page.goto("http://localhost:5173")

            print("Clicking JOGAR...")
            page.locator("button", has_text="JOGAR").click(force=True)

            print("Adding player 'Alice'...")
            page.get_by_placeholder("Nome do participante").fill("Alice")
            page.locator("button").locator("svg.lucide-plus").locator("..").click()

            print("Adding player 'Bob'...")
            page.get_by_placeholder("Nome do participante").fill("Bob")
            page.keyboard.press("Enter")

            print("Verifying players were added...")
            page.wait_for_selector("text=Alice")
            page.wait_for_selector("text=Bob")

            alice_visible = page.locator("text=Alice").is_visible()
            bob_visible = page.locator("text=Bob").is_visible()

            if alice_visible and bob_visible:
                print("SUCCESS: Players added correctly!")
            else:
                print("FAILURE: Players not found.")
                sys.exit(1)

            browser.close()
    finally:
        print("Cleaning up server...")
        server_process.terminate()

if __name__ == "__main__":
    verify_frontend()
