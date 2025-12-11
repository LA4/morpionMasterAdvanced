// --- Global State Variables ---
// Manages server config, socket connection, player identity, and game status
let SERVER_CONFIG = null;
let WS_URL = null;
let ws = null;
let playerName = "";
let gameActive = false;
let canClick = false;
let wsConnected = false;
let pendingReady = false;

// --- DOM References ---
// Stores references to HTML elements to avoid repeated DOM queries
let gameArea, instructionText, roundInfo, welcomeMessage, connectionStatus, playersArea, btnReady, resultMessage, ranking, rankingList, btnLogout;

// --- Constants ---
// Fallback connection details in case API config fails
const DEFAULT_EXPLICIT_HOST = "10.15.3.45";
const DEFAULT_EXPLICIT_PORT = 8081;

// Fetches dynamic server configuration (IP/Port) from the REST API
// Sets the correct WebSocket URL based on the server's network environment
async function fetchServerConfig() {
    try {
        const response = await fetch("/api/config");
        SERVER_CONFIG = await response.json();
        if (SERVER_CONFIG && SERVER_CONFIG.wsReflexUrl) {
            WS_URL = SERVER_CONFIG.wsReflexUrl;
        }
        return true;
    } catch (error) {
        // Fallback to local hostname if the API call fails
        const proto = location.protocol === "https:" ? "wss" : "ws";
        WS_URL = `${proto}://${window.location.hostname}:8081`;
        return false;
    }
}

// Initializes the WebSocket connection and handles lifecycle events
// Manages auto-reconnection logic and initial player 'JOIN' handshake
function connectWebSocket() {
    // Determine URL if not already set
    if (!WS_URL) {
        const proto = location.protocol === "https:" ? "wss" : "ws";
        WS_URL = `${proto}://${DEFAULT_EXPLICIT_HOST}:${DEFAULT_EXPLICIT_PORT}/`;
    }

    // Prevent multiple connections
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
        return;
    }

    ws = new WebSocket(WS_URL);

    // Event: Connection established
    ws.onopen = () => {
        wsConnected = true;
        connectionStatus.innerText = "Connecté";
        connectionStatus.style.color = "green";
        btnReady.disabled = false;
        btnReady.textContent = "PRÊT !";

        // Register player with server
        ws.send(JSON.stringify({ type: "JOIN", playerName: playerName }));

        // Handle edge case where user clicked 'Ready' before connection finished
        if (pendingReady) {
            pendingReady = false;
            ws.send(JSON.stringify({ type: "READY" }));
            btnReady.disabled = true;
            btnReady.textContent = "En attente...";
            instructionText.textContent = "En attente des autres joueurs...";
        }
    };

    // Event: Message received
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            handleMessage(data);
        } catch (e) {
            console.error(e);
        }
    };

    // Event: Connection lost (triggers retry)
    ws.onclose = () => {
        wsConnected = false;
        connectionStatus.innerText = "Déconnecté";
        connectionStatus.style.color = "red";
        btnReady.disabled = true;
        setTimeout(() => connectWebSocket(), 1000);
    };

    ws.onerror = (err) => {
        try { ws.close(); } catch (e) {}
    };
}

// Central dispatcher: Routes incoming server messages to specific UI logic
// Handles game states, score updates, round changes, and errors
function handleMessage(data) {
    switch (data.type) {
        case "CONNECTED":
            break;
        case "GAME_STATE":
            updatePlayersDisplay(data.payload.players);
            if (data.payload.gameActive) {
                roundInfo.textContent = `Round ${data.payload.currentRound} / ${data.payload.totalRounds}`;
            }
            break;
        case "PLAYER_JOINED":
        case "PLAYER_LEFT":
            instructionText.textContent = `${data.payload.playerName} ${data.type === 'PLAYER_JOINED' ? 'a rejoint' : 'a quitté'} (${data.payload.playerCount} joueur(s))`;
            break;
        case "ROUND_START":
            gameActive = true;
            canClick = false;
            btnReady.classList.add("hidden");
            resultMessage.classList.add("hidden");
            gameArea.className = "color-red"; // Visual cue: Wait
            roundInfo.textContent = `Round ${data.payload.round}`;
            instructionText.textContent = "Attendez le VERT...";
            break;
        case "COLOR_CHANGE":
            if (data.payload.color === "green") {
                canClick = true;
                gameArea.classList.remove("color-red");
                gameArea.classList.add("color-green", "clickable"); // Visual cue: Go!
                instructionText.textContent = "🎯 CLIQUEZ MAINTENANT !";
            }
            break;
        case "EARLY_CLICK":
            canClick = false;
            showResult(data.payload.message, false); // Penalty
            break;
        case "VALID_CLICK":
            canClick = false;
            gameArea.classList.remove("clickable");
            showResult(`⚡ ${data.payload.reactionTime}ms ! +${data.payload.points} points`, true); // Success
            break;
        case "ROUND_END":
            gameArea.className = "";
            instructionText.textContent = "Round terminé !";
            updatePlayersDisplay(data.payload.results.map((r) => ({ name: r.name, score: r.score, ready: true })));
            break;
        case "GAME_END":
            showFinalRanking(data.payload.ranking);
            break;
        case "GAME_CANCELLED":
            gameActive = false;
            instructionText.textContent = data.payload.message;
            btnReady.classList.remove("hidden");
            btnReady.disabled = false;
            gameArea.className = "";
            break;
    }
}

// Renders the list of connected players, their scores, and ready status
function updatePlayersDisplay(players) {
    playersArea.innerHTML = "";
    players.forEach((player) => {
        const card = document.createElement("div");
        card.className = "player-card";
        card.innerHTML = `
            <h3>${player.name}</h3>
            <div class="player-score">${player.score || 0} pts</div>
            <div class="player-status ${player.ready ? "ready" : "waiting"}">
                ${player.ready ? "✓ Prêt" : "En attente..."}
            </div>`;
        playersArea.appendChild(card);
    });
}

// Displays transient feedback (success or error) to the user
function showResult(message, isGood) {
    resultMessage.textContent = message;
    resultMessage.className = isGood ? "result-good" : "result-bad";
    resultMessage.classList.remove("hidden");
}

// Hides the game area and displays the final scoreboard
function showFinalRanking(rankingData) {
    gameArea.classList.add("hidden");
    ranking.classList.remove("hidden");
    rankingList.innerHTML = "";
    rankingData.forEach((player, index) => {
        const rankClass = index === 0 ? "first" : index === 1 ? "second" : index === 2 ? "third" : "";
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
        const item = document.createElement("div");
        item.className = `rank-item ${rankClass}`;
        item.innerHTML = `<span style="font-size: 1.5em;">${medal} ${player.rank}. ${player.name}</span><span style="font-size: 1.5em; font-weight: bold;">${player.score} pts</span>`;
        rankingList.appendChild(item);
    });
}

// Clears authentication cookies, closes socket, and redirects to login
function logout() {
    document.cookie = "sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user-name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (ws) ws.close();
    window.location.href = "/login";
}

// Extracts user authentication details (name/token) from cookies
function getUserInfo() {
    const tokenCookie = document.cookie.split("; ").find((row) => row.startsWith("sb-access-token="));
    if (!tokenCookie) {
        // window.location.href = "/login";
        return;
    }
    const nameCookie = document.cookie.split("; ").find((row) => row.startsWith("user-name="));
    playerName = nameCookie ? decodeURIComponent(nameCookie.split("=")[1]) : "Joueur";
    welcomeMessage.innerText = `Bienvenue, ${playerName} !`;
}

// Attaches event handlers to UI buttons and the game area
function setupEventListeners() {
    // 'Ready' button logic
    btnReady.addEventListener("click", () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "READY" }));
            btnReady.disabled = true;
            btnReady.textContent = "En attente...";
            instructionText.textContent = "En attente des autres joueurs...";
        } else {
            pendingReady = true;
            btnReady.disabled = true;
            btnReady.textContent = "Connexion...";
        }
    });

    // Game area click logic (the actual gameplay interaction)
    gameArea.addEventListener("click", () => {
        if (canClick && gameActive) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "CLICK" }));
            }
        }
    });

    btnLogout.onclick = logout;
}

// Main entry point: Initializes DOM references, fetches config, and starts app
async function init() {
    // DOM Initializations
    gameArea = document.getElementById("game-area");
    instructionText = document.getElementById("instruction-text");
    roundInfo = document.getElementById("round-info");
    welcomeMessage = document.getElementById("welcome-message");
    connectionStatus = document.getElementById("connection-status");
    playersArea = document.getElementById("players-area");
    btnReady = document.getElementById("btn-ready");
    resultMessage = document.getElementById("result-message");
    ranking = document.getElementById("ranking");
    rankingList = document.getElementById("ranking-list");
    btnLogout = document.getElementById("btn-logout");

    setupEventListeners();
    getUserInfo();
    await fetchServerConfig();
    connectWebSocket();
}

export { init, logout };