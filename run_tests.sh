#!/bin/bash

# Free port 5173 if in use
kill $(lsof -t -i :5173) 2>/dev/null || true

# Start Vite dev server in the background
pnpm dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Create a simple python playwright test to verify UI interaction
cat << 'EOF' > test_frontend.py
from playwright.sync_api import sync_playwright
import time

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:5173')

        # Test HomeScreen
        page.wait_for_selector('button:has-text("JOGAR")')
        page.get_by_role("button", name="JOGAR").click(force=True)

        # Test RegisterScreen
        page.wait_for_selector('input[placeholder="Nome do participante"]')
        page.locator('input[placeholder="Nome do participante"]').fill("Alice")
        page.get_by_role("button").filter(has=page.locator("svg.lucide-plus")).click()

        page.locator('input[placeholder="Nome do participante"]').fill("Bob")
        page.get_by_role("button").filter(has=page.locator("svg.lucide-plus")).click()

        page.get_by_role("button", name="PRÓXIMO").click(force=True)

        # Test Theme Selection
        page.wait_for_selector('h3:has-text("Anime")')
        page.locator('button', has=page.locator('h3:has-text("Anime")')).click()

        page.get_by_role("button", name="INICIAR JOGO").click(force=True)

        # Test Game Screen (Basic presence check)
        page.wait_for_selector('h2:has-text("Novo Sorteio")')
        page.get_by_role("button", name="SORTEAR").click(force=True)

        # Wait for rolling to finish
        time.sleep(3)
        page.wait_for_selector('text="Mantenha segredo!"')

        browser.close()
        print("Frontend tests passed successfully.")

if __name__ == "__main__":
    run_test()
EOF

# Run the test
python3 test_frontend.py
TEST_EXIT_CODE=$?

# Cleanup
kill $SERVER_PID
rm test_frontend.py

exit $TEST_EXIT_CODE
