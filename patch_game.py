import re

with open('src/GameScreen.tsx', 'r') as f:
    content = f.read()

search = """const Confetti = () => {
  // Cria 50 partículas com posições e cores aleatórias
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: ['#FACC15', '#4ADE80', '#60A5FA', '#F472B6'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            backgroundColor: p.color,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};"""

replace = """const Confetti = () => {
  // Cria 50 partículas com posições e cores aleatórias
  const [particles] = useState(() => Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: ['#FACC15', '#4ADE80', '#60A5FA', '#F472B6'][Math.floor(Math.random() * 4)]
  })));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};"""

if search in content:
    with open('src/GameScreen.tsx', 'w') as f:
        f.write(content.replace(search, replace))
    print("Patched successfully")
else:
    print("Search string not found")
