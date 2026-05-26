const { Telegraf } = require('telegraf');
const wallbit = require('./wallbit');
const { calcularDistribucion, defaultRules } = require('./rules');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// /start
bot.start((ctx) => {
  ctx.reply(`✈️ *¡Bienvenido a Piloto!*

Tu copiloto financiero para freelancers latinos.

Configurá tus reglas una vez y tu plata vuela sola 🚀

*¿Qué puedo hacer?*
/balance — Ver tu saldo actual
/transacciones — Últimos movimientos
/reglas — Ver cómo está configurado tu piloto
/meta — Ver progreso de tus metas
/distribuir <monto> — Simular distribución de un pago

O simplemente preguntame algo:
_"¿Cuánto tengo disponible?"_
_"¿Cuánto gasté este mes?"_
_"Llegaron $2000, ¿cómo los distribuyo?"_`, 
  { parse_mode: 'Markdown' });
});

// /balance
bot.command('balance', async (ctx) => {
  try {
    await ctx.reply('⏳ Consultando tu cuenta...');
    const res = await wallbit.getBalance();
    const data = res.data?.[0];
    
    if (!data) {
      return ctx.reply('💰 Tu cuenta está en $0.00');
    }

    ctx.reply(`💰 *Tu balance actual*

💳 Disponible: *$${data.amount}*
🏦 Cuenta: ${data.currency || 'USD'}

_Actualizado ahora mismo desde Wallbit_ ✅`, 
    { parse_mode: 'Markdown' });
  } catch (err) {
    ctx.reply('❌ Error consultando el balance. Intentá de nuevo.');
  }
});

// /transacciones
bot.command('transacciones', async (ctx) => {
  try {
    await ctx.reply('⏳ Trayendo tus movimientos...');
    const res = await wallbit.getTransactions();
    const txs = res.data?.data || [];

    if (txs.length === 0) {
      return ctx.reply('📋 No hay transacciones todavía.');
    }

    const lista = txs.slice(0, 5).map(tx => 
      `• ${tx.type === 'credit' ? '📥' : '📤'} $${tx.amount} — ${tx.description || 'Movimiento'}`
    ).join('\n');

    ctx.reply(`📋 *Últimas transacciones*\n\n${lista}`, 
    { parse_mode: 'Markdown' });
  } catch (err) {
    ctx.reply('❌ Error trayendo transacciones.');
  }
});

// /reglas
bot.command('reglas', (ctx) => {
  ctx.reply(`⚙️ *Tu piloto configurado así:*

📈 Inversión automática: *${defaultRules.inversion}%* → S&P500
🧾 Impuestos: *${defaultRules.impuestos}%* → Separado
🎯 Metas: *${defaultRules.metas}%* → Ahorro
💳 Libre: *${defaultRules.libre}%* → Para gastar

🔄 DCA activo: *${defaultRules.dca.activo ? 'Sí' : 'No'}*
📊 Ticker: *${defaultRules.dca.ticker}*
💵 Trigger: pagos mayores a *$${defaultRules.dca.trigger}*

_Próximamente podrás cambiar estas reglas desde el chat_ ✨`,
  { parse_mode: 'Markdown' });
});

// /distribuir
bot.command('distribuir', (ctx) => {
  const args = ctx.message.text.split(' ');
  const monto = parseFloat(args[1]);

  if (!monto || isNaN(monto)) {
    return ctx.reply('💡 Usá: /distribuir 2000');
  }

  const dist = calcularDistribucion(monto);

  ctx.reply(`✈️ *Piloto distribuiría $${monto}:*

📈 Inversión (${defaultRules.inversion}%): *$${dist.inversion}*
🧾 Impuestos (${defaultRules.impuestos}%): *$${dist.impuestos}*
🎯 Metas (${defaultRules.metas}%): *$${dist.metas}*
💳 Libre (${defaultRules.libre}%): *$${dist.libre}*

_Esto pasaría automáticamente cuando te llegue un pago_ ✅`,
  { parse_mode: 'Markdown' });
});

// Mensajes de texto libre — IA
bot.on('text', async (ctx) => {
  const mensaje = ctx.message.text.toLowerCase();

  // Respuestas simples sin IA por ahora
  if (mensaje.includes('balance') || mensaje.includes('saldo') || mensaje.includes('tengo')) {
    return ctx.reply('Usá /balance para ver tu saldo actualizado 💰');
  }
  if (mensaje.includes('gasté') || mensaje.includes('gaste') || mensaje.includes('transacci')) {
    return ctx.reply('Usá /transacciones para ver tus movimientos 📋');
  }

  ctx.reply(`✈️ Entendido! Estos son mis comandos por ahora:

/balance — Tu saldo
/transacciones — Tus movimientos  
/reglas — Cómo está configurado tu piloto
/distribuir <monto> — Simular un pago`);
});

module.exports = bot;