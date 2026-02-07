from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000")

    print("Navigating to Home...")
    # 1. Home Screen
    # Check if JOGAR button is visible
    jogar_btn = page.get_by_role("button", name="JOGAR")
    expect(jogar_btn).to_be_visible()

    # Click JOGAR - force=True because of animate-bounce
    jogar_btn.click(force=True)

    print("Navigating to Register Screen...")
    # 2. Register Screen
    # Check Back Button has aria-label "Voltar"
    back_btn = page.locator('button[aria-label="Voltar"]')
    expect(back_btn).to_be_visible()
    print("Verified: Back button has aria-label='Voltar'")

    # Check Add Button has aria-label "Adicionar jogador"
    add_btn = page.locator('button[aria-label="Adicionar jogador"]')
    expect(add_btn).to_be_visible()
    print("Verified: Add button has aria-label='Adicionar jogador'")

    # Check Input has correct label association
    input_field = page.locator('#player-input')
    expect(input_field).to_be_visible()
    label = page.locator('label[for="player-input"]')
    expect(label).to_be_visible()
    print("Verified: Input has associated label")

    # Add players
    input_field.fill("Player1")
    add_btn.click()
    input_field.fill("Player2")
    add_btn.click()

    # Check Delete Button has aria-label "Remover Player1"
    # Wait for the delete button to appear
    delete_btn = page.locator('button[aria-label="Remover Player1"]')
    expect(delete_btn).to_be_visible()
    print("Verified: Delete button has aria-label='Remover Player1'")

    # Screenshot Register Screen
    page.screenshot(path="verification/register_screen.png")

    # Click Next
    next_btn = page.get_by_role("button", name="PRÓXIMO")
    next_btn.click()

    print("Navigating to Theme Selection...")
    # 3. Theme Selection
    # Check Back Button has aria-label "Voltar"
    back_btn_theme = page.locator('button[aria-label="Voltar"]')
    expect(back_btn_theme).to_be_visible()
    print("Verified: Back button in Theme Selection has aria-label='Voltar'")

    # Select Theme (Classic is usually first)
    # The theme buttons don't have explicit text roles easily accessible, so we click the first button in the list
    # or finding by text inside
    page.get_by_text("Clássico").click()

    # Start Game
    start_btn = page.get_by_role("button", name="INICIAR JOGO")
    start_btn.click()

    print("Navigating to Game Screen...")
    # 4. Game Screen
    # Check Back Button has aria-label "Voltar"
    back_btn_game = page.locator('button[aria-label="Voltar"]')
    expect(back_btn_game).to_be_visible()
    print("Verified: Back button in Game Screen has aria-label='Voltar'")

    # Screenshot Game Screen
    page.screenshot(path="verification/game_screen.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
