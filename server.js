const { WebSocketServer } = require('ws');
const http = require('http');

// Criação do servidor HTTP básico
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Servidor de Party Games Online!\n');
});

// Inicialização do WebSocket Server
const wss = new WebSocketServer({ server });

// Banco de dados em memória para as salas e conexões
const rooms = new Map(); // roomCode -> { hostId, players: [{ id, name, ws }], gameState: {} }

// Função utilitária para gerar código de sala aleatório de 4 letras
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Evita colisão
  if (rooms.has(code)) return generateRoomCode();
  return code;
}

// Função utilitária para enviar mensagem para um socket específico
function sendJson(ws, data) {
  if (ws && ws.readyState === 1) { // 1 = OPEN
    ws.send(JSON.stringify(data));
  }
}

// Função utilitária para enviar mensagem para todos na sala
function broadcastToRoom(roomCode, data, excludeWs = null) {
  const room = rooms.get(roomCode);
  if (!room) return;

  room.players.forEach((player) => {
    if (player.ws !== excludeWs && player.ws.readyState === 1) {
      sendJson(player.ws, data);
    }
  });
}

wss.on('connection', (ws) => {
  let playerRoomCode = null;
  let playerId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { type } = data;

      switch (type) {
        case 'CREATE_ROOM': {
          const { hostName } = data;
          const roomCode = generateRoomCode();
          playerId = Math.random().toString(36).substring(2, 9);
          playerRoomCode = roomCode;

          const newRoom = {
            hostId: playerId,
            players: [{ id: playerId, name: hostName, ws }],
            gameState: { phase: 'lobby' }
          };

          rooms.set(roomCode, newRoom);

          sendJson(ws, {
            type: 'ROOM_CREATED',
            roomCode,
            playerId,
            players: [{ id: playerId, name: hostName }]
          });
          
          console.log(`Sala criada: ${roomCode} pelo Host: ${hostName}`);
          break;
        }

        case 'JOIN_ROOM': {
          const { roomCode, playerName } = data;
          const cleanCode = roomCode.toUpperCase().trim();
          const room = rooms.get(cleanCode);

          if (!room) {
            sendJson(ws, { type: 'ERROR', message: 'Sala não encontrada!' });
            return;
          }

          playerId = Math.random().toString(36).substring(2, 9);
          playerRoomCode = cleanCode;

          // Adiciona o jogador à lista
          room.players.push({ id: playerId, name: playerName, ws });

          // Informa o jogador que ele entrou com sucesso
          sendJson(ws, {
            type: 'ROOM_JOINED',
            roomCode: cleanCode,
            playerId,
            isHost: false,
            gameState: room.gameState,
            players: room.players.map(p => ({ id: p.id, name: p.name }))
          });

          // Notifica os outros membros da sala da chegada do novo jogador
          broadcastToRoom(cleanCode, {
            type: 'PLAYER_JOINED',
            players: room.players.map(p => ({ id: p.id, name: p.name }))
          }, ws);

          console.log(`Jogador ${playerName} entrou na sala ${cleanCode}`);
          break;
        }

        case 'SYNC_STATE': {
          const { roomCode, gameState } = data;
          const room = rooms.get(roomCode);

          if (!room) return;

          // Apenas o host ou atualizações legítimas alteram o estado
          room.gameState = { ...room.gameState, ...gameState };

          // Envia o novo estado para todos os integrantes da sala
          broadcastToRoom(roomCode, {
            type: 'STATE_UPDATED',
            gameState: room.gameState
          });
          break;
        }

        default:
          console.log(`Tipo de mensagem desconhecido: ${type}`);
      }
    } catch (err) {
      console.error('Erro ao processar mensagem do WebSocket:', err);
    }
  });

  ws.on('close', () => {
    if (playerRoomCode && rooms.has(playerRoomCode)) {
      const room = rooms.get(playerRoomCode);
      // Remove o jogador da lista
      room.players = room.players.filter(p => p.ws !== ws);

      console.log(`Conexão fechada para jogador da sala ${playerRoomCode}`);

      if (room.players.length === 0) {
        // Se a sala ficou vazia, remove ela da memória
        rooms.delete(playerRoomCode);
        console.log(`Sala ${playerRoomCode} excluída da memória por estar vazia.`);
      } else {
        // Se o host desconectou, reatribui a liderança da sala para o primeiro da lista
        if (room.hostId === playerId) {
          const newHost = room.players[0];
          room.hostId = newHost.id;
          
          sendJson(newHost.ws, { type: 'MAKE_HOST' });
          console.log(`Host desconectou da sala ${playerRoomCode}. Novo Host: ${newHost.name}`);
        }

        // Notifica os outros jogadores que alguém saiu
        broadcastToRoom(playerRoomCode, {
          type: 'PLAYER_LEFT',
          players: room.players.map(p => ({ id: p.id, name: p.name }))
        });
      }
    }
  });
});

// Inicialização do servidor na porta 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(`  Servidor de Sincronização rodando com sucesso!`);
  console.log(`  Porta: ${PORT}`);
  console.log(`  Endereço de Teste: ws://localhost:${PORT}`);
  console.log(`=================================================`);
});
