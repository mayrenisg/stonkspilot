const cron = require('node-cron');
const wallbit = require('./wallbit');
const { defaultRules, calcularDistribucion } = require('./rules');

let ultimoBalance = null;

async function detectarPagoNuevo() {
  try {
    const res = await wallbit.getBalance();
    const balanceActual = parseFloat(res.data?.[0]?.amount || 0);

    if (ultimoBalance !== null && balanceActual > ultimoBalance) {
      const pago = (balanceActual - ultimoBalance).toFixed(2);
      console.log(`\n🚀 ¡Pago detectado! +$${pago}`);

      const dist = calcularDistribucion(pago);
      console.log(`📊 Distribución automática:`);
      console.log(`   📈 Inversión (${defaultRules.inversion}%): $${dist.inversion}`);
      console.log(`   🧾 Impuestos (${defaultRules.impuestos}%): $${dist.impuestos}`);
      console.log(`   🎯 Metas     (${defaultRules.metas}%):     $${dist.metas}`);
      console.log(`   💳 Libre     (${defaultRules.libre}%):     $${dist.libre}`);

      // Si el pago supera el trigger, invierte automático
      if (pago >= defaultRules.dca.trigger && defaultRules.dca.activo) {
        console.log(`\n✈️  Piloto ejecutando DCA: comprando $${dist.inversion} en ${defaultRules.dca.ticker}...`);
        // await wallbit.buyStock(defaultRules.dca.ticker, dist.inversion);
        console.log(`✅ DCA ejecutado`);
      }
    }

    ultimoBalance = balanceActual;
  } catch (err) {
    console.error('Error en scheduler:', err.message);
  }
}

function iniciarPiloto() {
  console.log('✈️  Piloto activo — monitoreando cada minuto...');
  // Corre cada minuto (en producción sería cada hora)
  cron.schedule('* * * * *', detectarPagoNuevo);
  detectarPagoNuevo(); // corre inmediatamente también
}

module.exports = { iniciarPiloto };