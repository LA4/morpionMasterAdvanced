const ws = new WebSocket('ws://10.15.2.246:8080');

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusBadge = document.getElementById('game-status');
const playerNameDisplay = document.getElementById('player-name');
const opponentNameDisplay = document.getElementById('opponent-name');
const restartArea = document.getElementById('restart-area');
const restartBtn = document.getElementById('restart-btn');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// Game State
let username = '';
let boardState = Array(9).fill(null);
let isMyTurn = true; // Optimistic initially/Shared state

// WebSocket Event Listeners
ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        handleMessage(data);
    } catch (e) {
        console.log('Received non-JSON message:', event.data);
    }
};

// UI Interaction
joinBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (name) {
        username = name;
        playerNameDisplay.textContent = username;
        loginScreen.classList.remove('active');
        loginScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('active');

        // Notify others
        sendMessage({ type: 'chat', content: `${username} a rejoint la partie !`, isSystem: true });
        // Request current state update? (Not supported by simple server, assumes fresh start or listening)
    }
});

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;
        if (!boardState[index] && !checkWinner()) {
            const symbol = getNextSymbol();
            sendMessage({
                type: 'move',
                index: index,
                symbol: symbol,
                user: username
            });
        }
    });
});

restartBtn.addEventListener('click', () => {
    sendMessage({ type: 'restart', user: username });
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        sendMessage({ type: 'chat', content: chatInput.value.trim(), user: username });
        chatInput.value = '';
    }
});

// Logic
function sendMessage(data) {
    if (ws.readyState === WebSocket.OPEN) {
        // Add current user to message if missing
        if (!data.user) data.user = username;
        ws.send(JSON.stringify(data));
        console.log(data);
    }
}

function handleMessage(data) {
    switch (data.type) {
        case 'move':
            updateBoard(data.index, data.symbol);
            highlightLastMove(data.index);
            break;
        case 'restart':
            resetBoard();
            addSystemMessage(`${data.user} a relancé la partie.`);
            break;
        case 'chat':
            if (data.isSystem) {
                addSystemMessage(data.content);
            } else {
                addChatMessage(data.user, data.content);
            }
            break;
        case 'leave':
            addSystemMessage(`${data.user || 'Un joueur'} a quitté la partie.`);
            break;
        case 'message': // Default server welcome
            // Ignore or show system
            break;
        default:
            console.log('Unknown message type:', data);
    }
}

function getNextSymbol() {
    const xCount = boardState.filter(s => s === 'X').length;
    const oCount = boardState.filter(s => s === 'O').length;
    return xCount === oCount ? 'X' : 'O';
}

function updateBoard(index, symbol) {
    if (boardState[index]) return; // Already taken

    boardState[index] = symbol;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = symbol;
    cell.classList.add('taken', symbol.toLowerCase());

    checkGameStatus();
}

function highlightLastMove(index) {
    // Remove previous highlights?
    // Simplified for now
}

function checkGameStatus() {
    const winner = checkWinner();
    if (winner) {
        statusBadge.textContent = `Vainqueur : ${winner} !`;
        statusBadge.style.color = 'var(--accent-color)';
        showRestart();
    } else if (!boardState.includes(null)) {
        statusBadge.textContent = "Match Nul !";
        showRestart();
    } else {
        const next = getNextSymbol();
        statusBadge.textContent = `Au tour de ${next}`;
        statusBadge.style.color = 'var(--text-muted)';
    }
}

function resetBoard() {
    boardState = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o');
    });
    statusBadge.textContent = "C'est parti !";
    restartArea.classList.add('hidden');
}

function checkWinner() {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combo of wins) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return null;
}

function showRestart() {
    restartArea.classList.remove('hidden');
}

// Chat UI
function addSystemMessage(text) {
    const div = document.createElement('div');
    div.className = 'system-msg';
    div.textContent = `> ${text}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addChatMessage(user, text) {
    const div = document.createElement('div');
    div.className = 'chat-msg';
    div.innerHTML = `<span>${user}:</span> ${text}`; // Careful with XSS in real apps, simplified here
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
