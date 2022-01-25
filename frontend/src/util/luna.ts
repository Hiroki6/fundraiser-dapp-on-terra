const cc = require("cryptocompare")

export const getExchangeRate = async (): Promise<number> => {
    const exchangeRate = await cc.price("luna", ["EUR"]);
    return exchangeRate.EUR
}