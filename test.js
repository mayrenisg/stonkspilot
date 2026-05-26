require('dotenv').config();
const wallbit = require('./src/wallbit');

async function testAll() {
  try {
    const balance = await wallbit.getBalance();
    console.log('💰 Balance:', balance);

    const txs = await wallbit.getTransactions();
    console.log('📋 Transacciones:', txs);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

testAll();