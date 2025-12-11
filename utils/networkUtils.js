import os from 'os';

/**
 * Récupère l'adresse IP locale de la machine
 * @returns {string} L'adresse IP locale (IPv4)
 */
export function getLocalIP() {
    const interfaces = os.networkInterfaces();

    // Parcourir toutes les interfaces réseau
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Ignorer les adresses internes (127.0.0.1) et non-IPv4
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }

    // Fallback sur localhost si aucune IP externe n'est trouvée
    return 'localhost';
}

/**
 * Affiche les informations de configuration du serveur
 * @param {number} port - Port HTTP
 * @param {number} wsPortReflex - Port WebSocket Reflex
 * @param {number} wsPortMorpion - Port WebSocket Morpion
 * @param {string} host - Adresse IP de l'hôte
 */
export function displayServerInfo(port, wsPortReflex, wsPortMorpion, host) {
    // console.log('\n╔════════════════════════════════════════════════════════════╗');
    // console.log('║           🎯 REFLEX SHOT - SERVEUR DÉMARRÉ 🎯            ║');
    // console.log('╚════════════════════════════════════════════════════════════╝\n');

    // console.log('📡 ADRESSE IP DU SERVEUR :');
    // console.log(`   🌐 ${host}\n`);

    // console.log('🔌 PORTS ACTIFS :');
    // console.log(`   ├─ HTTP/API    : ${port}`);
    // console.log(`   ├─ WS Reflex   : ${wsPortReflex}`);
    // console.log(`   └─ WS Morpion  : ${wsPortMorpion}\n`);

    // console.log('🌐 ACCÈS AU JEU :');
    // console.log(`   👉 http://${host}:${port}\n`);

    // console.log('📄 AUTRES PAGES :');
    // console.log(`   ├─ Login : http://${host}:${port}/login`);
    // console.log(`   ├─ Test  : http://${host}:${port}/test`);
    // console.log(`   └─ API   : http://${host}:${port}/docs\n`);

    // console.log('⚠️  CONFIGURATION SUPABASE :');
    // console.log('   Ajoutez cette URL de callback dans Supabase :');
    // console.log(`   👉 http://${host}:${port}/auth/v1/callback\n`);

    // console.log('📋 PARTAGER AUX JOUEURS :');
    // console.log(`   Donnez cette adresse aux autres joueurs :`);
    // console.log(`   👉 http://${host}:${port}\n`);

    // console.log('═══════════════════════════════════════════════════════════════\n');
}

/**
 * Affiche les informations du serveur WebSocket
 * @param {number} port - Port WebSocket
 * @param {string} type - Type de serveur (Reflex, Morpion)
 * @param {string} host - Adresse IP de l'hôte
 */
export function displayWebSocketInfo(port, type, host) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log(`║        🎮 SERVEUR WEBSOCKET ${type.toUpperCase()} DÉMARRÉ 🎮        ║`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📡 ADRESSE IP DU SERVEUR :');
    console.log(`   🌐 ${host}\n`);

    console.log('🔌 CONNEXION WEBSOCKET :');
    console.log(`   👉 ws://${host}:${port}\n`);

    console.log('✅ En attente de connexions des joueurs...\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
}

