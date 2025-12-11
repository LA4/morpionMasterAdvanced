// reflexServer.js
import { WebSocketServer, WebSocket } from 'ws'; // Notez l'import ES Module

// État global du jeu
let gameState = {
  players: [],
  gameActive: false,
  roundActive: false,
  roundStartTime: null,
  currentColor: 'red',
  waitingForGreen: false,
  results: []
};

// Configuration
const MIN_WAIT_TIME = 2000;
const MAX_WAIT_TIME = 7000;
const ROUND_COUNT = 5;
let currentRound = 0;

export function startReflexServer(port, host) {
  // Démarrage du serveur WS
  const wss = new WebSocketServer({ port: port, host: '0.0.0.0' });

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║        🎮 SERVEUR WEBSOCKET REFLEX DÉMARRÉ : ${port} 🎮        ║`);
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // --- Fonctions utilitaires ---
  function broadcast(data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  function broadcastGameState() {
    const playerList = gameState.players.map(p => ({
      name: p.name,
      score: p.score,
      ready: p.ready,
      id: p.id
    }));

    broadcast({
      type: 'GAME_STATE',
      payload: {
        players: playerList,
        gameActive: gameState.gameActive,
        currentRound: currentRound,
        totalRounds: ROUND_COUNT
      }
    });
  }

  function calculateScore(reactionTime) {
    if (reactionTime < 200) return 1000;
    if (reactionTime < 300) return 800;
    if (reactionTime < 400) return 600;
    if (reactionTime < 500) return 400;
    if (reactionTime < 700) return 200;
    return 100;
  }

  function startRound() {
    if (currentRound >= ROUND_COUNT) {
      endGame();
      return;
    }

    currentRound++;
    gameState.roundActive = false;
    gameState.currentColor = 'red';
    gameState.waitingForGreen = true;

    gameState.players.forEach(p => {
      p.hasClicked = false;
      p.clickTime = null;
    });

    broadcast({
      type: 'ROUND_START',
      payload: { round: currentRound, color: 'red' }
    });

    const waitTime = Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME) + MIN_WAIT_TIME;

    setTimeout(() => {
      // Vérification si le jeu est toujours actif avant de passer au vert
      if (!gameState.gameActive) return;

      gameState.roundActive = true;
      gameState.currentColor = 'green';
      gameState.roundStartTime = Date.now();
      gameState.waitingForGreen = false;

      broadcast({
        type: 'COLOR_CHANGE',
        payload: { color: 'green' }
      });
    }, waitTime);
  }

  async function endGame() {
    gameState.gameActive = false;
    const ranking = gameState.players
        .sort((a, b) => b.score - a.score)
        .map((p, index) => ({
          rank: index + 1,
          name: p.name,
          score: p.score
                  }
                  ));
    for (const p of gameState.players) {
      try {
        // await sendScoresToAPI(p.);
      } catch (err) {
        console.error('Erreur en envoyant les scores à l\'API:', err);
      }
    }

    broadcast({type: 'GAME_END', payload: {ranking}});

    // Réinitialisation de l'état du jeu
    currentRound = 0;
    gameState.players.forEach(p => {
      p.score = 0;
      p.ready = false;
    });
  }

  // --- Gestion des connexions ---
  wss.on("connection", (ws) => {
    console.log("Un joueur s'est connecté au Reflex Shot");

    ws.send(JSON.stringify({
      type: "CONNECTED",
      content: "Bienvenue dans Reflex Shot !"
    }));

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);

        switch (data.type) {
          case 'JOIN':
            const player = {
              ws: ws,
              id: Date.now(),
              name: data.playerName || 'Joueur',
              score: 0,
              ready: false,
              hasClicked: false,
              clickTime: null
            };
            ws.player = player;
            gameState.players.push(player);

            broadcast({
              type: 'PLAYER_JOINED',
              payload: { playerName: player.name, playerCount: gameState.players.length }
            });
            broadcastGameState();
            break;

          case 'READY':
            if (ws.player) {
              ws.player.ready = true;
              broadcastGameState();
              const allReady = gameState.players.every(p => p.ready);
              // Démarrer si au moins 1 joueur (pour test) ou 2 pour vrai jeu
              if (allReady && gameState.players.length >= 1 && !gameState.gameActive) {
                gameState.gameActive = true;
                currentRound = 0;
                setTimeout(startRound, 2000);
              }
            }
            break;

          case 'CLICK':
            if (ws.player && !ws.player.hasClicked) {
              const clickTime = Date.now();
              if (gameState.currentColor === 'red' || !gameState.roundActive) {
                ws.player.hasClicked = true;
                ws.player.score -= 100;
                ws.send(JSON.stringify({
                  type: 'EARLY_CLICK',
                  payload: { message: 'Trop tôt ! -100 points', score: ws.player.score }
                }));
              } else {
                const reactionTime = clickTime - gameState.roundStartTime;
                const points = calculateScore(reactionTime);
                ws.player.hasClicked = true;
                ws.player.clickTime = reactionTime;
                ws.player.score += points;
                ws.send(JSON.stringify({
                  type: 'VALID_CLICK',
                  payload: { reactionTime, points, totalScore: ws.player.score }
                }));
              }

              const allClicked = gameState.players.every(p => p.hasClicked);
              if (allClicked) {
                const roundResults = gameState.players.map(p => ({
                  name: p.name, reactionTime: p.clickTime, score: p.score
                }));
                broadcast({ type: 'ROUND_END', payload: { results: roundResults } });
                setTimeout(startRound, 3000);
              }
            }
            break;
        }
      } catch (e) {
        console.error("Erreur parsing message:", e);
      }
    });

    ws.on("close", () => {
      if (ws.player) {
        console.log(`${ws.player.name} a quitté la partie`);
        gameState.players = gameState.players.filter(p => p.ws !== ws);
        broadcast({
          type: 'PLAYER_LEFT',
          payload: { playerName: ws.player.name, playerCount: gameState.players.length }
        });
        if (gameState.players.length < 2 && gameState.gameActive) {
          gameState.gameActive = false;
          broadcast({ type: 'GAME_CANCELLED', payload: { message: 'Pas assez de joueurs' } });
        }
        broadcastGameState();
      }
    });
  });
}
async function sendScoresToAPI(ranking) {
  const API_URL = process.env.SCORE_API_URL || 'http://localhost:3000/api/scores';
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: 'reflex-shot', ranking })
    });
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}