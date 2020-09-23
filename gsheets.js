const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./config/credentials.json')
const SHEETS_ID = '182JhoJQ6_uvzi8JALHPN1W0PppbUCH-duNWY-okS4aQ'


const sheetId = {
    inventory_tracking: 110967983,
    sales: 517801441,
    product_list: 2112668296,
    various_data: 1570397924,
    test: 1654132161
}

/**
 * Authorize and create doc object for using the API methods
 * @returns {Object} doc - service object with spreadsheet methods
 * 
 */
async function createDoc() {
    const doc = new GoogleSpreadsheet(SHEETS_ID)
    
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo()

    return doc
}

/**
 * Retrieves the last sale id from Google Sheet
 * 
 * @returns {Int} Last sale id
 */
async function getLastSaleId() {
    const doc = await createDoc()
    const sheet = await doc.sheetsById[sheetId.various_data]

    console.log('Getting last sale id...')

    await sheet.loadCells('C2')
    const lastSaleId = sheet.getCellByA1('C2')
    
    console.log('Last sale ID is:', lastSaleId.value)
    return lastSaleId.value
}

/**
 * Update the last_sale_id cell in sheets
 * @param {Object} doc 
 * @param {int} saleId new sale id to become last_sale_id in Sheets
 * 
 */
async function updateLastSaleId(doc, saleId) {
    const sheet = await doc.sheetsById[sheetId.various_data]

    console.log('Updating last sale id...')

    await sheet.loadCells('C2')

    const lastSaleId = sheet.getCellByA1('C2')
    
    if (saleId) {
        lastSaleId.value = saleId
        await sheet.saveUpdatedCells()
    } else {
        console.log("sale id is empty")
    }





}



/**
 * Adds new sales into the 'sales' Google Sheet
 * @param {Array} salesData list of new sales objects
 * @param {Object} doc GoogleSpreadsheet object
 * @returns {void}
 * 
 */
async function addSalesRows(salesData, doc) {
    const sheet = doc.sheetsById[sheetId.sales]
    for (let sale of salesData) {

        const rowValues = {
            'Sale Date': sale.date,
            'Sale ID': sale.id,
            'SKU': sale.SKU,
            'Product Name': sale.productName,
            'Quantity': sale.quantity,
            'Price': sale.price

        }
        console.log('Adding sale to the row...')
        await sheet.addRow(rowValues)
    }
}


/**
 * Adds inventory transactions into Google Sheets
 * @param {Array} salesData sales to insert into Sheets
 * @param {GoogleSpreadsheet} doc object to manipulate Sheets
 */
async function addInventoryRows(salesData, doc) {
    const sheet = doc.sheetsById[sheetId.inventory_tracking]
    
    for (let sale of salesData) {
        const rowValues = {
            'Date': sale.date,
            'SKU': sale.SKU,
            'Transaction Type': 'Sale',
            'Quantity': -sale.quantity,
            'Location': 'Nooks'
        }

        console.log('Adding inventory transaction to the row...')
        await sheet.addRow(rowValues)
    }
}

/*================ MAIN FUNCTION *********************/

/**
 * Main function to insert sales data into inventory_tracking and sales sheets,
 * as well to update last_sale_id in various_data sheet
 * @param {Array} salesData sales data to insert into GSheets
 * @param {int} saleId sale id to update last_sale_id cell
 */
async function insertSales(salesData, saleId) {
    const doc = await createDoc()

    await addSalesRows(salesData, doc)
    await addInventoryRows(salesData, doc)

    updateLastSaleId(doc, saleId)
}

module.exports = {insertSales, getLastSaleId}