// Las reglas del usuario — después esto viene de la web app
const defaultRules = {
  inversion: 20,      // % que se invierte automático
  impuestos: 15,      // % que se separa para impuestos
  metas: 10,          // % que va a metas de ahorro
  libre: 55,          // % libre para gastar
  dca: {
    activo: true,
    ticker: 'SPY',    // S&P500
    trigger: 500      // Si llega un pago mayor a $500, ejecuta DCA
  }
};

function calcularDistribucion(monto, reglas = defaultRules) {
  return {
    inversion: (monto * reglas.inversion / 100).toFixed(2),
    impuestos: (monto * reglas.impuestos / 100).toFixed(2),
    metas: (monto * reglas.metas / 100).toFixed(2),
    libre: (monto * reglas.libre / 100).toFixed(2),
  };
}

module.exports = { defaultRules, calcularDistribucion };