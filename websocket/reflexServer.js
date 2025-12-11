const websocket = require("ws");
const os = require("os");
const dotenv = require("dotenv");

dotenv.config();

// Fonction pour récupérer l'IP locale
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const WS_PORT = process.env.WS_PORT_REFLEX || 8081;
const HOST = process.env.HOST || getLocalIP();

const wss = new websocket.Server({ port: WS_PORT });

// Affichage des informations de démarrage
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║        🎮 SERVEUR WEBSOCKET REFLEX DÉMARRÉ 🎮           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');
console.log('📡 ADRESSE IP DU SERVEUR :');
console.log(`   🌐 ${HOST}\n`);
console.log('🔌 CONNEXION WEBSOCKET :');
console.log(`   👉 ws://${HOST}:${WS_PORT}\n`);
console.log('✅ En attente de connexions des joueurs...\n');
console.log('═══════════════════════════════════════════════════════════════\n');

// Gestion du jeu
let gameState = {
  players: [],
  gameActive: false,
  roundActive: false,
  roundStartTime: null,
  currentColor: 'red',
  waitingForGreen: false,
  results: []
};

// Configuration du jeu
const MIN_WAIT_TIME = 2000; // 2 secondes minimum
const MAX_WAIT_TIME = 7000; // 7 secondes maximum
const ROUND_COUNT = 5; // Nombre de rounds par partie
let currentRound = 0;

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === websocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function broadcastGameState() {
  const playerList = gameState.players.map(p => ({
    name: p.name,
    score: p.score,
    ready: p.ready
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
  // Score basé sur le temps de réaction (en millisecondes)
  // Plus rapide = plus de points
  if (reactionTime < 200) return 1000; // Très rapide
  if (reactionTime < 300) return 800;
  if (reactionTime < 400) return 600;
  if (reactionTime < 500) return 400;
  if (reactionTime < 700) return 200;
  return 100; // Plus de 700ms
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

  // Réinitialiser les clics des joueurs
  gameState.players.forEach(p => {
    p.hasClicked = false;
    p.clickTime = null;
  });

  broadcast({
    type: 'ROUND_START',
    payload: {
      round: currentRound,
      color: 'red'
    }
  });

  // Attendre un temps aléatoire avant de passer au vert
  const waitTime = Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME) + MIN_WAIT_TIME;

  setTimeout(() => {
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

function endGame() {
  gameState.gameActive = false;

  // Calculer le classement final
  const ranking = gameState.players
    .sort((a, b) => b.score - a.score)
    .map((p, index) => ({
      rank: index + 1,
      name: p.name,
      score: p.score
    }));

  broadcast({
    type: 'GAME_END',
    payload: { ranking }
  });

  // Réinitialiser pour une nouvelle partie
  currentRound = 0;
  gameState.players.forEach(p => {
    p.score = 0;
    p.ready = false;
  });
}

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
          // Nouveau joueur rejoint la partie
          const player = {
            ws: ws,
            id: data.playerId || Date.now(),
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
            payload: {
              playerName: player.name,
              playerCount: gameState.players.length
            }
          });

          broadcastGameState();
          break;

        case 'READY':
          // Joueur prêt à commencer
          if (ws.player) {
            ws.player.ready = true;
            broadcastGameState();

            // Si tous les joueurs sont prêts et qu'on a au moins 2 joueurs
            const allReady = gameState.players.every(p => p.ready);
            if (allReady && gameState.players.length >= 2 && !gameState.gameActive) {
              gameState.gameActive = true;
              currentRound = 0;

              setTimeout(() => {
                startRound();
              }, 2000);
            }
          }
          break;

        case 'CLICK':
          // Joueur a cliqué
          if (ws.player && !ws.player.hasClicked) {
            const clickTime = Date.now();

            // Vérifier si c'est un clic anticipé (rouge)
            if (gameState.currentColor === 'red' || !gameState.roundActive) {
              ws.player.hasClicked = true;
              ws.player.score -= 100; // Pénalité pour clic anticipé

              ws.send(JSON.stringify({
                type: 'EARLY_CLICK',
                payload: {
                  message: 'Trop tôt ! -100 points',
                  score: ws.player.score
                }
              }));
            } else {
              // Clic valide sur vert
              const reactionTime = clickTime - gameState.roundStartTime;
              const points = calculateScore(reactionTime);

              ws.player.hasClicked = true;
              ws.player.clickTime = reactionTime;
              ws.player.score += points;

              ws.send(JSON.stringify({
                type: 'VALID_CLICK',
                payload: {
                  reactionTime: reactionTime,
                  points: points,
                  totalScore: ws.player.score
                }
              }));
            }

            // Vérifier si tous les joueurs ont cliqué
            const allClicked = gameState.players.every(p => p.hasClicked);
            if (allClicked) {
              // Afficher les résultats du round
              const roundResults = gameState.players.map(p => ({
                name: p.name,
                reactionTime: p.clickTime,
                score: p.score
              }));

              broadcast({
                type: 'ROUND_END',
                payload: { results: roundResults }
              });

              // Passer au round suivant après 3 secondes
              setTimeout(() => {
                startRound();
              }, 3000);
            }
          }
          break;

        default:
          console.log('Message inconnu:', data);
      }
    } catch (e) {
      console.error("Erreur parsing message:", e);
    }
  });

  ws.on("close", () => {
    if (ws.player) {
      console.log(`${ws.player.name} a quitté la partie`);

      // Retirer le joueur de la liste
      gameState.players = gameState.players.filter(p => p.ws !== ws);

      broadcast({
        type: 'PLAYER_LEFT',
        payload: {
          playerName: ws.player.name,
          playerCount: gameState.players.length
        }
      });

      // Si moins de 2 joueurs, arrêter le jeu
      if (gameState.players.length < 2 && gameState.gameActive) {
        gameState.gameActive = false;
        broadcast({
          type: 'GAME_CANCELLED',
          payload: { message: 'Pas assez de joueurs pour continuer' }
        });
      }

      broadcastGameState();
    }
  });
});

