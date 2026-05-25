// Serviço de Sincronização em Tempo Real via WebSockets
export type ConnectedPlayer = {
  id: string;
  name: string;
};

type SyncCallbackMap = {
  onRoomCreated?: (roomCode: string, playerId: string, players: ConnectedPlayer[]) => void;
  onRoomJoined?: (roomCode: string, playerId: string, players: ConnectedPlayer[], gameState: any) => void;
  onPlayerJoined?: (players: ConnectedPlayer[]) => void;
  onPlayerLeft?: (players: ConnectedPlayer[]) => void;
  onStateUpdated?: (gameState: any) => void;
  onBecomeHost?: () => void;
  onError?: (message: string) => void;
};

class SyncService {
  private socket: WebSocket | null = null;
  private callbacks: SyncCallbackMap = {};
  public currentRoomCode: string | null = null;
  public currentPlayerId: string | null = null;
  public isHost: boolean = false;
  private serverUrl: string = 'ws://localhost:3000'; // Default fallback

  // Configura a URL do servidor (importante para dispositivos móveis conectando via IP local)
  public setServerUrl(ipOrUrl: string) {
    let target = ipOrUrl.trim();
    if (!target.startsWith('ws://') && !target.startsWith('wss://')) {
      target = `ws://${target}`;
    }
    // Adiciona porta padrão se não contiver
    if (!target.includes(':', 6)) { // 6 ignora o ws:// ou wss://
      target = `${target}:3000`;
    }
    this.serverUrl = target;
    console.log(`URL do servidor configurada para: ${this.serverUrl}`);
  }

  public getServerUrl(): string {
    return this.serverUrl;
  }

  // Conecta ao servidor WebSocket
  public connect(callbacks: SyncCallbackMap): Promise<void> {
    this.callbacks = { ...this.callbacks, ...callbacks };

    return new Promise((resolve, reject) => {
      // Se já está conectado, resolve imediatamente
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      try {
        console.log(`Conectando em: ${this.serverUrl}...`);
        this.socket = new WebSocket(this.serverUrl);

        this.socket.onopen = () => {
          console.log('Conexão WebSocket estabelecida com sucesso!');
          resolve();
        };

        this.socket.onerror = (err) => {
          console.error('Erro na conexão WebSocket:', err);
          if (this.callbacks.onError) {
            this.callbacks.onError('Falha ao conectar com o servidor multiplayer.');
          }
          reject(err);
        };

        this.socket.onclose = () => {
          console.log('Conexão WebSocket encerrada.');
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  // Desconecta do servidor
  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.currentRoomCode = null;
    this.currentPlayerId = null;
    this.isHost = false;
  }

  // Envia mensagem em formato JSON
  private send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error('WebSocket não está conectado. Mensagem ignorada:', data);
    }
  }

  // Ações de Sala
  public createRoom(hostName: string) {
    this.isHost = true;
    this.send({
      type: 'CREATE_ROOM',
      hostName
    });
  }

  public joinRoom(roomCode: string, playerName: string) {
    this.isHost = false;
    this.send({
      type: 'JOIN_ROOM',
      roomCode,
      playerName
    });
  }

  // Sincronização de Estado
  public syncState(gameState: any) {
    if (!this.currentRoomCode) return;
    this.send({
      type: 'SYNC_STATE',
      roomCode: this.currentRoomCode,
      gameState
    });
  }

  // Processa mensagens recebidas do servidor
  private handleMessage(messageStr: string) {
    try {
      const data = JSON.parse(messageStr);
      const { type } = data;

      switch (type) {
        case 'ROOM_CREATED': {
          const { roomCode, playerId, players } = data;
          this.currentRoomCode = roomCode;
          this.currentPlayerId = playerId;
          this.isHost = true;
          if (this.callbacks.onRoomCreated) {
            this.callbacks.onRoomCreated(roomCode, playerId, players);
          }
          break;
        }

        case 'ROOM_JOINED': {
          const { roomCode, playerId, players, gameState } = data;
          this.currentRoomCode = roomCode;
          this.currentPlayerId = playerId;
          this.isHost = false;
          if (this.callbacks.onRoomJoined) {
            this.callbacks.onRoomJoined(roomCode, playerId, players, gameState);
          }
          break;
        }

        case 'PLAYER_JOINED': {
          const { players } = data;
          if (this.callbacks.onPlayerJoined) {
            this.callbacks.onPlayerJoined(players);
          }
          break;
        }

        case 'PLAYER_LEFT': {
          const { players } = data;
          if (this.callbacks.onPlayerLeft) {
            this.callbacks.onPlayerLeft(players);
          }
          break;
        }

        case 'STATE_UPDATED': {
          const { gameState } = data;
          if (this.callbacks.onStateUpdated) {
            this.callbacks.onStateUpdated(gameState);
          }
          break;
        }

        case 'MAKE_HOST': {
          this.isHost = true;
          if (this.callbacks.onBecomeHost) {
            this.callbacks.onBecomeHost();
          }
          break;
        }

        case 'ERROR': {
          const { message } = data;
          if (this.callbacks.onError) {
            this.callbacks.onError(message);
          }
          break;
        }
      }
    } catch (err) {
      console.error('Erro ao decodificar mensagem de sincronização:', err);
    }
  }
}

export const syncService = new SyncService();
