from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Go to Home
    page.goto("http://localhost:5173")

    # Click JOGAR - force click because of animation
    print("Clicking JOGAR (forcing)...")
    page.get_by_text("JOGAR").click(force=True)

    # Verify Register Screen Accessibility
    print("Verifying Register Screen...")

    # 1. Back Button
    try:
        page.get_by_role("button", name="Voltar").wait_for(state="visible", timeout=5000)
        print("✅ Found 'Voltar' button by role+name")
    except Exception as e:
        print(f"❌ Could not find 'Voltar' button: {e}")

    # 2. Input Label association
    try:
        # get_by_role("textbox", name="Adicionar Jogador") confirms the label association works
        input_field = page.get_by_role("textbox", name="Adicionar Jogador")
        input_field.fill("Alice")
        print("✅ Found input by role 'textbox' with name 'Adicionar Jogador' and filled it")
    except Exception as e:
        print(f"❌ Could not find input: {e}")

    # 3. Add Player Button
    try:
        # get_by_role("button", name="Adicionar jogador") confirms the aria-label works
        add_btn = page.get_by_role("button", name="Adicionar jogador")
        add_btn.click()
        print("✅ Found 'Adicionar jogador' button by role+name and clicked it")
    except Exception as e:
        print(f"❌ Could not find 'Adicionar jogador' button: {e}")

    # 4. Remove Player Button (for the player we just added)
    try:
        # Wait for the item to appear in the list
        page.get_by_text("Alice").wait_for(state="visible", timeout=5000)

        # Find the remove button for Alice
        remove_btn = page.get_by_role("button", name="Remover Alice")
        remove_btn.wait_for(state="visible", timeout=5000)
        print("✅ Found 'Remover Alice' button by role+name")
    except Exception as e:
        print(f"❌ Could not find 'Remover Alice' button: {e}")

    # Take screenshot
    page.screenshot(path="verification_accessibility.png")
    print("Screenshot saved to verification_accessibility.png")

    browser.close()

with sync_playwright() as p:
    run(p)
