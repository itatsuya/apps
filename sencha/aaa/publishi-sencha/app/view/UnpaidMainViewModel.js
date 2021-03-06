/*
 * File: app/view/UnpaidMainViewModel.js
 *
 * This file was generated by Sencha Architect version 4.2.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.6.x Classic library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.6.x Classic. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('RolandKioskPrint.view.UnpaidMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.unpaidmain',

    requires: [
        'Ext.app.bind.Formula'
    ],

    formulas: {
        orderIdValue: function(get) {
            var orderIdVal = get('orderId')

            return orderIdVal

        },
        orderQuantityVal: function(get) {
            var orderQuantityVal = get('orderQuantity')

            return orderQuantityVal

        },
        goodsNameVal: function(get) {
            var goodsNameVal = get('goodsName')

            return goodsNameVal

        },
        goodsCodeVal: function(get) {
            var goodsCodeVal = get('goodsCode')

            return goodsCodeVal

        },
        totalPriceVal: function(get) {
            var totalPriceVal = get('totalPrice')

            var parts = totalPriceVal.split(' ')


            if (parts.length < 2) {
                return totalPriceVal

            }

            // Backward compatibility with old orders.
            var price = parseFloat(parts[1])

            if (isNaN(price)) {
                price = parseFloat(parts[0])

                totalPriceVal = parts[1] + ' ' + RolandKioskPrint.AppData.formatNumber(price)

            } else {
                totalPriceVal = parts[0] + ' ' + RolandKioskPrint.AppData.formatNumber(price)

            }

            return totalPriceVal

        },
        productModelVal: function(get) {
            var productModelVal = get('productModel')

            return productModelVal

        }
    }

})
