/*
 * File: app/view/OrderCreateViewController.js
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

Ext.define('RolandKioskPrint.view.OrderCreateViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ordercreate',

    onBackButtonClick: function(button, e, eOpts) {
        this.redirectTo('#client/editcontent', true)

    },

    onOKButtonClick: function(button, e, eOpts) {
        var printOrderData = this.getViewModel().getData()


        var txtQuantityValue = this.getView().down('#txtQuantityValue')

        if (!txtQuantityValue.isValid()) {
            txtQuantityValue.focus()

            return

        }

        if (printOrderData.quantity < 1) {
            Ext.Msg.alert(RolandKioskPrint.app.getString('message.generic.alert'),
            RolandKioskPrint.app.getString('label.designer.numCopies'), Ext.emptyFn)

            return

        }

        if (printOrderData.customSize) {
            printOrderData.totalPrice = RolandKioskPrint.app.getString('label.generic.customPrice')

        } else {
            var totalPrice = printOrderData.quantity * printOrderData.pricePerUnit

            printOrderData.totalPrice = printOrderData.currency + ' ' + totalPrice.toFixed(2)

        }

        var widget = Ext.widget({
            xtype: 'orderverify',
            clientView: true
        })

        widget.getController().setOrderData(printOrderData)

        RolandKioskPrint.app.showModalView(widget)

    },

    onOrderCreateViewShow: function(component, eOpts) {
        var txtQuantityValue = this.getView().down('#txtQuantityValue')

        txtQuantityValue.maxValue = RolandKioskPrint.app.constants.MAX_ORDER_QUANTITY


        var uiSettings = RolandKioskPrint.AppData.getUiSettingsData() || {}

        if (uiSettings.maxOrderQuantity) {
            txtQuantityValue.maxValue = uiSettings.maxOrderQuantity

        }

        txtQuantityValue.focus()

        txtQuantityValue.selectText()

    },

    onOrderCreateViewBeforeShow: function(component, eOpts) {
        var designerData = this.getViewModel().getData()


        var imgProductDesign = this.getView().down('#imgProductDesign')

        var url = "url('" + designerData.productDesignThumb + "')"


        imgProductDesign.setStyle({
            backgroundImage: url,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center center'
        })

    },

    onOrderCreateViewAfterRender: function(component, eOpts) {
        var navPanel = this.getView().down('#navPanel')

        navPanel.getController().setCurrentStep(RolandKioskPrint.app.constants.ORDER_STEP)


        var priceInfoPanel = this.getView().down('#priceInfoPanel')

        var catalogUISettingsData = RolandKioskPrint.AppData.getCatalogUISettingsData() || {}

        if (catalogUISettingsData.hidePriceOnCatalog) {
            priceInfoPanel.hide()

        }
    }

})

