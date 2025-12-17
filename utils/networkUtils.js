import os from 'os';

/**
 * Retrieves the machine's local IP address
 * @returns {string} The local IP address (IPv4)
 */
export function getLocalIP() {
    const interfaces = os.networkInterfaces();

    // Browse all network interfaces
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Ignore internal (127.0.0.1) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }

    // Fallback to localhost if no external IP is found
    return 'localhost';
}

/**
 * Displays server configuration information
 * @param {number} port - HTTP Port
 * @param {number} wsPortReflex - WebSocket Port Reflex
 * @param {string} host - Host IP address
 */
export function displayServerInfo(port, wsPortReflex, host) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           🎯 REFLEX SHOT - SERVER STARTED 🎯            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

     console.log('📡 SERVER IP ADDRESS:');
    console.log(`   🌐 ${host}\n`);

    console.log('🔌 ACTIVE PORTS :');
    console.log(`   ├─ HTTP/API    : ${port}`);
    console.log(`   ├─ WS Reflex   : ${wsPortReflex}`);

    // console.log('🌐 ACCESS TO THE GAME :');
    // console.log(`   👉 http://${host}:${port}\n`);

    // console.log('📄 OTHER PAGES :');
    // console.log(`   ├─ Login : http://${host}:${port}/login`);
    // console.log(`   ├─ Test  : http://${host}:${port}/test`);
    // console.log(`   └─ API   : http://${host}:${port}/docs\n`);

    console.log('⚠️  SUPABASE CONFIGURATION:');
    console.log('   Add this callback URL in Supabase:');
    console.log(`   👉 http://${host}:${port}/auth/v1/callback\n`);

    console.log('📋 SHARE WITH PLAYERS:');
    console.log('   Give this address to the other players:');
    console.log(`   👉 http://${host}:${port}\n`);

    console.log('═══════════════════════════════════════════════════════════════\n');
}

/**
 * Displays WebSocket server information
 * @param {number} port - WebSocket port
 * @param {string} type - Server type (Reflex, Tic-Tac-Toe)
 * @param {string} host - Host IP address
 */
export function displayWebSocketInfo(port, type, host) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log(`║        🎮 ${type.toUpperCase()} WEBSOCKET SERVER STARTED 🎮        ║`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📡 SERVER IP ADDRESS:');
    console.log(`   🌐 ${host}\n`);

    console.log('🔌 WEBSOCKET CONNECTION:');
    console.log(`   👉 ws://${host}:${port}\n`);

    console.log('✅ Waiting for player connections...\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
}