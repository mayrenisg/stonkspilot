const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.wallbit.io/api/public/v1',
  headers: { 'X-API-Key': process.env.WALLBIT_API_KEY }
});

async function getBalance() {
  const res = await client.get('/balance/checking');
  return res.data;
}

async function getTransactions() {
  const res = await client.get('/transactions');
  return res.data;
}

async function buyStock(ticker, amount) {
  const res = await client.post('/trade/buy', { ticker, amount });
  return res.data;
}

module.exports = { getBalance, getTransactions, buyStock };