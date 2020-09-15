const {getSales} = require('./sales')
const {insertSales, getLastSaleId} = require('./gsheets')


async function run(){
    const lastSaleId = await getLastSaleId()
    const sales = await getSales(lastSaleId)
    await insertSales(sales.data, sales.highestId)
}

run()
