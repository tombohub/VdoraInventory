'use strict'

const util = require('util')
const request = util.promisify(require('request'))
const fs = require('fs')
const cheerio = require('cheerio')


/**
 * login credentials
 */
const formData = {
    wk_email: "kim@projectvdora.com",
    wk_password: "QueVidorraTienes",
    redirect_url: '',
    wk_login_submit: ''
}

/**
 * login url where we post the login credentials and receive cookies
 */
const loginUrl = 'http://sell.thenooks.ca/index.php?p=login_process&sid=17352'

/**
 * api point from which we receive sales data
 */
const ordersUrl = 'http://sell.thenooks.ca/index.php?p=listing_data&draw=1&columns%5B0%5D%5Bdata%5D=date_add&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=false&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=id&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=order_name&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=date_add&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=customer&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=gateway&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=payment_status&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=tracking_id&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=false&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=fulfillment&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=order_prepare_status&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=order_prepare_status&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=true&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=11&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=false&columns%5B11%5D%5Borderable%5D=false&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=1&order%5B0%5D%5Bdir%5D=desc&start=0&length=15&search%5Bvalue%5D=&search%5Bregex%5D=false&p_value=order&sid=17352&type=false&_=1599811611520'


/**
 * Gets the cookies after login so they can be used for further requests
 * @returns {object} cookies to pass for further requests
 */
async function getCookies() {
    let cookieJar = request.jar()
    
    const options = {
        method: 'POST',
        form: formData,
        url: loginUrl,
        jar: cookieJar,
        followAllRedirects: true
    }
    
    await request(options)

    return cookieJar
}

/**
 * Get the recent orders data
 * @param {object} cookieJar cookies aquired in login request
 * @returns {JSON} recent orders data
 */
async function getOrdersData(cookieJar) {

    const response = await request(ordersUrl, {jar: cookieJar})
    const ordersData = JSON.parse(response.body)
    
    return Array.from(ordersData.data)

}

/**
 * Gets the html page with details of the single sale
 * @param {object} cookieJar cookies acquired from login
 * @param {int} saleId id of the particular sale we want to get details
 * @returns {string} html of the sale details page
 */
async function getSaleDetailsPage(saleId, cookieJar) {

    const url = `http://sell.thenooks.ca/index.php?p=order_desc&oid=${saleId}`
    const response = await request(url, {jar: cookieJar})

    return response.body
}


/**
 * Parse and return sale details from sale details page 
 * @param {string} html html of sale details page to be parsed
 * @returns {object} single sale details 
 */
async function parseSaleDetailsPage(html) {
    const $ = cheerio.load(html)
    const saleDetails = {}
    saleDetails.productName = $('td.def-font').eq(1).text()
    saleDetails.SKU = $('td.def-font').eq(2).text()
    saleDetails.price = $('.price').first().text()
    saleDetails.nooksTax = $('.price').eq(3).text()

    return saleDetails
}


/**
 * from recent orders select new orders since the last recorded order in Google Sheets
 * @param {Array} ordersData orders fetched from Nooks dashboard
 * @param {int} last_id last order(sale) id which is recorderd in Google Sheets
 * @returns {Array} array of new, yet unrecorded orders (sales)
 * 
 */
async function selectNewOrders(ordersData, last_id) {
    let newOrdersData = []
    for (let order of ordersData) {
        if (order.id > last_id) {
            newOrdersData.push(order)
        }
    }

    return newOrdersData
}


/**
 * gets the complete sales data
 * @param {Array} newOrdersData data of new orders since the last recorded order
 * @param {object} cookieJar 
 */
async function getNewSalesData(newOrdersData, cookieJar) {
    let newSalesData = []

    for (let order of newOrdersData) {
        const html = await getSaleDetailsPage(order.id, cookieJar)
        const saleDetails = await parseSaleDetailsPage(html)
        newSalesData.push(Object.assign({id: order.id, date: order.date_add}, saleDetails))
    }

    return newSalesData
    
}



async function getSales() {
    const cookieJar = await getCookies()
    const neOrders = await selectNewOrders(JSON.parse(fs.readFileSync('resources/ordersData.json')), 2015749)
    const data = await getNewSalesData(neOrders, cookieJar)
    console.log(JSON.stringify(data))

   
}


module.exports = {getSales}
