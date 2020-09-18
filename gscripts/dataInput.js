/**
 * Submits the inventory form into an inventory_tracking sheet. 
 * Data validation is through the sheet Data validation option
 */
function submitInventoryForm() {
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const inventoryForm    = ss.getSheetByName("Inventory Form"); //Data entry Sheet
  const inventorySheet = ss.getSheetByName("inventory_tracking"); //Data Sheet
  
  //Input fields
  const date = inventoryForm.getRange('F6')
  const item = inventoryForm.getRange('F8')
  const sku = inventoryForm.getRange('F10')
  const transactionType = inventoryForm.getRange('F12')
  const quantity = inventoryForm.getRange('F14')
  const location = inventoryForm.getRange('F16')

  const fieldRanges = [date, item, sku, transactionType, quantity, location]


  /**
   * Sets VLOOKUP formula if either item or SKU is empty. So it can be filled automatically
   * @param {Range} item cell range of the item field
   * @param {Range} sku  cell range of the SKU field
   */
  function setVlookup(item, sku) {
    const itemValue = item.getValue()
    const skuValue = sku.getValue()

    if (itemValue != '') {
      const vlookupFormula = '=vlookup(F8, {products_list!$B$2:$B$31, products_list!$E$2:$E$31}, 2, FALSE)'
      sku.setFormula(vlookupFormula)
    } else if (skuValue != '') {
      const vlookupFormula = '=Vlookup(F10, {products_list!$E$2:$E$31,products_list!$B$2:$B$31}, 2, FALSE)'
      item.setFormula(vlookupFormula)
    }
  }


  /**
   * Checks if the quantity negative if transaction is 'Out'. Most common mistake of inputs.
   * @param {Range} transactionType transaction type form iput field range
   * @param {Range} quantity quantity form input field range
   * @returns {boolean} false if quantity is positive when 'Out', true if not
   */
  function checkQuantity(transactionType, quantity) {
    const ui = SpreadsheetApp.getUi()

    if (transactionType.getValue() === 'Out' && quantity.getValue() > 0) {
      ui.alert('Quantity has to be negative when Out transaction')
      return false
    } else {
      return true
    }
  }

  /**
   * Inserts input data from Inventory Form into inventory_tracking sheet
   * @param {Array} fieldRanges array of input field ranges
   */
  function insertData(fieldRanges){
    const rowData = fieldRanges.map(range => range.getValue())
    const rowValues = [rowData]

    const row = inventorySheet.getLastRow() + 1
    const rowRange = inventorySheet.getRange(row, 1, 1, 6)

    rowRange.setValues(rowValues)

  }

  /**
   * Deletes the values in fomr fields. To use after the form is successfully submitted
   * @param {Array} fieldRanges array of form input fields ranges
   */
  function deleteFields(fieldRanges) {
    for (let fieldRange of fieldRanges) {
      fieldRange.setValue('')
    }
  }





  setVlookup(item, sku)

  if (checkQuantity(transactionType, quantity)) {
    insertData(fieldRanges)
    deleteFields(fieldRanges)
  }

 
 
}