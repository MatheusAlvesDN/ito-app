import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('// @ts-ignore', '// @ts-expect-error PWA orientation lock')

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Patched successfully")
