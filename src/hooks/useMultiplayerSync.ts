import { useState, useEffect, useCallback } from 'react';
import { syncService } from '../utils/syncService';
import { toast } from 'sonner';

export function useMultiplayerSync(
  onScreenChange?: (screen: any) => void,
  onGameModeChange?: (mode: any) => void
) {
  const [connectionType, setConnectionType] = useState<'local' | 'multiplayer'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('room')) return 'multiplayer';
    } catch {}
    return 'local';
  });
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [connectedPlayers, setConnectedPlayers] = useState<{ id: string; name: string }[]>([]);
  const [syncGameState, setSyncGameState] = useState<any>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Carregar configurações iniciais salvas
  useEffect(() => {
    const savedName = localStorage.getItem('ito_player_name');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Limpa conexão ao desmontar
  useEffect(() => {
    return () => {
      syncService.disconnect();
    };
  }, []);

  const handleConnect = async (customIp: string, actionType: 'create' | 'join', joinCode?: string, onSuccess?: () => void) => {
    setIsConnecting(true);
    try {
      syncService.setServerUrl(customIp);
      await syncService.connect({
        onRoomCreated: (code, pId, playersList) => {
          setRoomCode(code);
          setPlayerId(pId);
          setIsHost(true);
          setConnectedPlayers([...playersList]);
          setIsConnecting(false);
          toast.success('Sala criada com sucesso!');
          if (onSuccess) onSuccess();
        },
        onRoomJoined: (code, pId, playersList, initialGameState) => {
          setRoomCode(code);
          setPlayerId(pId);
          setIsHost(false);
          setConnectedPlayers([...playersList]);
          setSyncGameState(initialGameState);
          if (initialGameState?.gameMode && onGameModeChange) {
            onGameModeChange(initialGameState.gameMode);
          }
          if (initialGameState?.screen && onScreenChange) {
            onScreenChange(initialGameState.screen);
          }
          setIsConnecting(false);
          toast.success('Entrou na sala!');
          if (onSuccess) onSuccess();
        },
        onPlayerJoined: (playersList) => {
          setConnectedPlayers([...playersList]);
          const newPlayer = playersList[playersList.length - 1];
          if (newPlayer) {
            toast.info(`${newPlayer.name} entrou na sala`);
          }
        },
        onPlayerLeft: (playersList) => {
          setConnectedPlayers([...playersList]);
          toast.info('Um jogador saiu da sala');
        },
        onStateUpdated: (newGameState) => {
          setSyncGameState(newGameState);
          if (newGameState.gameMode && onGameModeChange) {
            onGameModeChange(newGameState.gameMode);
          }
          if (newGameState.screen && onScreenChange) {
            onScreenChange(newGameState.screen);
          }
        },
        onBecomeHost: () => {
          setIsHost(true);
          toast.success('Você agora é o líder da sala!');
        },
        onReactionReceived: (pId, pName, reaction) => {
          window.dispatchEvent(new CustomEvent('ito-reaction', { 
            detail: { playerId: pId, playerName: pName, reaction } 
          }));
        },
        onError: (msg) => {
          setIsConnecting(false);
          toast.error(msg);
        }
      });

      // Salva no localStorage para conveniência
      localStorage.setItem('ito_multiplayer_ip', customIp);
      localStorage.setItem('ito_player_name', playerName);

      if (actionType === 'create') {
        syncService.createRoom(playerName);
      } else if (actionType === 'join' && joinCode) {
        syncService.joinRoom(joinCode, playerName);
      }
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível conectar ao servidor.');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = useCallback(() => {
    syncService.disconnect();
    setRoomCode('');
    setConnectedPlayers([]);
    setSyncGameState(null);
    setIsHost(false);
    setConnectionType('local');
    toast.info('Desconectado da sala');
  }, []);

  return {
    connectionType,
    setConnectionType,
    roomCode,
    isHost,
    connectedPlayers,
    syncGameState,
    playerName,
    setPlayerName,
    playerId,
    isConnecting,
    handleConnect,
    handleDisconnect,
  };
}
