/*
 * File: app/view/ProductModelDesignerSizeViewModel.js
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

Ext.define('RolandKioskPrint.view.ProductModelDesignerSizeViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.productmodeldesignersize',

    requires: [
        'Ext.app.bind.Formula'
    ],

    formulas: {
        panelTitle: function(get) {
            var designerMode = get('designerMode')

            var modelName = get('modelName')


            if (designerMode == RolandKioskPrint.app.constants.PRODUCT_MODEL_EDIT) {
                return this.formatTitle(
                RolandKioskPrint.app.getString('label.pmd_mld.pmdEditTitle'),
                modelName
                )

            } else if (designerMode == RolandKioskPrint.app.constants.PRODUCT_MODEL_IMPORT) {
                return RolandKioskPrint.app.getString('label.pmd_mld.pmdImportTitle')

            } else if (designerMode == RolandKioskPrint.app.constants.PRODUCT_MODEL_PREVIEW) {
                return this.formatTitle(
                RolandKioskPrint.app.getString('label.pmd_mld.pmdPreviewTitle'),
                modelName
                )

            } else {
                return RolandKioskPrint.app.getString('label.pmd_mld.pmdNewTitle')

            }
        }
    },

    formatTitle: function(panelTitle, modelName) {
        return panelTitle + ' - ' + modelName

    }

})
