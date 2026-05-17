from playwright.sync_api import sync_playwright

def verify_ux():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Using record_video_dir to record a video as required by the Completeness Rule
        context = browser.new_context(record_video_dir=".")
        page = context.new_page()

        try:
            print("Navigating to app...")
            page.goto("http://localhost:5173", wait_until="networkidle")

            # 1. Start game and check "Voltar" (Back) button on RegisterScreen
            print("Clicking 'JOGAR'...")
            page.locator("button:has-text('JOGAR')").click(force=True)
            page.wait_for_selector("span:has-text('Quem vai jogar?')", timeout=5000)

            print("Checking back button on RegisterScreen...")
            back_btn_register = page.locator("button[aria-label='Voltar']")
            if back_btn_register.count() > 0:
                 print("✅ Back button with aria-label='Voltar' found on RegisterScreen.")
            else:
                 print("❌ Back button not found on RegisterScreen.")

            # 2. Check Input Label Association ("Adicionar jogador")
            print("Checking label-input association...")
            player_input = page.locator("input#player-input")
            if player_input.count() > 0:
                print("✅ Input field with id='player-input' found.")
                player_input.fill("Alice")
            else:
                print("❌ Input field 'player-input' not found.")

            # 3. Check "Adicionar jogador" button
            add_player_btn = page.locator("button[aria-label='Adicionar jogador']")
            if add_player_btn.count() > 0:
                 print("✅ Add player button with aria-label='Adicionar jogador' found.")
                 add_player_btn.click()
            else:
                 print("❌ Add player button not found.")

            # Add another player to proceed
            player_input.fill("Bob")
            add_player_btn.click()

            # 4. Check Remove player button
            print("Checking remove player button...")
            remove_player_btn = page.locator("button[aria-label='Remover Alice']")
            if remove_player_btn.count() > 0:
                 print("✅ Remove player button with aria-label='Remover Alice' found.")
            else:
                 print("❌ Remove player button for Alice not found.")

            # Proceed to Theme Selection
            print("Proceeding to Theme Selection...")
            page.locator("button", has_text="PRÓXIMO").click()

            # 5. Check "Voltar" (Back) button on ThemeSelectionScreen
            page.wait_for_selector("h2:has-text('Escolha o Tema')", timeout=5000)
            back_btn_theme = page.locator("button[aria-label='Voltar']")
            if back_btn_theme.count() > 0:
                 print("✅ Back button with aria-label='Voltar' found on ThemeSelectionScreen.")
            else:
                 print("❌ Back button not found on ThemeSelectionScreen.")

            # Select a theme and proceed to GameScreen
            print("Selecting a theme and starting game...")
            page.locator("h3:has-text('Clássico')").click()
            # The button to start has a play icon and "INICIAR JOGO" text
            page.locator("button", has_text="INICIAR JOGO").click(force=True)

            # 6. Check "Voltar" (Back) button on GameScreen
            page.wait_for_selector("span:has-text('RODADA 1')", timeout=5000)
            back_btn_game = page.locator("button[aria-label='Voltar']")
            if back_btn_game.count() > 0:
                 print("✅ Back button with aria-label='Voltar' found on GameScreen.")
            else:
                 print("❌ Back button not found on GameScreen.")

            # Progress the game to the ordering phase to check move buttons
            print("Progressing to ordering phase...")
            # Click 'SORTEAR'
            page.locator("button", has_text="SORTEAR").click(force=True)

            # View numbers for all players
            page.wait_for_selector("strong:has-text('Mantenha segredo!')", timeout=5000)
            for player_name in ["Alice", "Bob"]:
                # The button has the player name and an eye/check icon
                player_btn = page.locator("button").filter(has_text=player_name)
                # Ensure the button is active/not already checked before clicking
                if player_btn.is_enabled():
                    player_btn.click()
                    # The text is rendered lowercase/uppercase via css, check the actual text or wait for 'Passe para'
                    try:
                        page.wait_for_selector("button:has-text('REVELAR')", timeout=2000)
                        page.locator("button", has_text="REVELAR").click()
                    except:
                        pass # Already revealed, or animation skipped
                    page.wait_for_selector("button:has-text('OK, MEMORIZEI')")
                    page.locator("button", has_text="OK, MEMORIZEI").click()

            # Click 'ORDENAR'
            page.locator("button", has_text="ORDENAR").click()

            # 7. Check 'Mover para cima' and 'Mover para baixo' buttons
            print("Checking move buttons on GameScreen...")
            page.wait_for_selector("div.text-xs:has-text('Menor (1)')", timeout=5000)
            move_up_btn = page.locator("button[aria-label='Mover Bob para cima']")
            if move_up_btn.count() > 0:
                print("✅ Move up button found.")
            else:
                print("❌ Move up button not found.")

            move_down_btn = page.locator("button[aria-label='Mover Alice para baixo']")
            if move_down_btn.count() > 0:
                print("✅ Move down button found.")
            else:
                print("❌ Move down button not found.")

            # Proceed to results to check 'Próxima rodada' button
            print("Revealing order...")
            page.locator("button", has_text="REVELAR ORDEM").click()

            # 8. Check 'Próxima rodada' button
            print("Checking next round button on GameScreen...")
            # The button only has an icon, but we added aria-label="Próxima rodada"
            page.wait_for_selector("div.font-black:has-text('!')", timeout=5000) # Wait for 'SUCESSO!' or 'FALHA!'
            next_round_btn = page.locator("button[aria-label='Próxima rodada']")
            if next_round_btn.count() > 0:
                print("✅ Next round button found.")
            else:
                print("❌ Next round button not found.")

            # Take the screenshot as required
            screenshot_path = "verification_screenshot.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="error_screenshot.png")
            print("Saved error_screenshot.png")

        finally:
            print("Closing browser...")
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_ux()
