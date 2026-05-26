require('dotenv').config();
const { iniciarPiloto } = require('./src/scheduler');
const bot = require('./src/bot');

console.log('🛫 Iniciando Piloto...');
iniciarPiloto();

bot.launch();
console.log('🤖 Bot de Telegram activo!');

// Apagado limpio
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));