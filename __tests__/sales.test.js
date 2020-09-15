const sales = require('../sales')
jest.setTimeout(30000)


// any number lower than the last sale
const saleId = 2015749;


test('object.SKU to contain 9 characters', async () => {
    expect.assertions(1)
    const newSales = await sales.getSales(saleId);

    expect(newSales.data[0].SKU.length).toEqual(9);
})

