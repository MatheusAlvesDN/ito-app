import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

search = """// Componente isolado para o input, evita re-renderizar a tela toda a cada tecla digitada
const PlayerInput = ({ onAdd }: { onAdd: (name: string) => void }) => {"""

replace = """// ⚡ Bolt Performance Optimization:
// Extracting PlayerInput into a separate isolated component prevents the parent
// RegisterScreen (and the potentially large list of players) from re-rendering
// on every single keystroke. State is managed locally here and only bubbles up
// when a player is actually added.
const PlayerInput = ({ onAdd }: { onAdd: (name: string) => void }) => {"""

if search in content:
    with open('src/App.tsx', 'w') as f:
        f.write(content.replace(search, replace))
    print("Patched successfully")
else:
    print("Search string not found")
