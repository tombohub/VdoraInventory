const { GoogleSpreadsheet } = require('google-spreadsheet');
const SHEETS_ID = '182JhoJQ6_uvzi8JALHPN1W0PppbUCH-duNWY-okS4aQ'
const token = require('./token.json')
const sales = require('./sales')


const doc = new GoogleSpreadsheet(SHEETS_ID)
console.log(token)

async function ko() {
    await doc.useRawAccessToken(token)
    await doc.loadInfo()
    console.log(doc.title)

}
ko()