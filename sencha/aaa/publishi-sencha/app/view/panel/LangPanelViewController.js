/*
 * File: app/view/panel/LangPanelViewController.js
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

Ext.define('RolandKioskPrint.view.panel.LangPanelViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.langpanel',

    showContent: function(show) {
        var lblLang = this.getView().down('#lblLang')

        lblLang.setVisible(show)


        var comboBox = this.getView().down('#cboLanguages')

        comboBox.setVisible(show)

    },

    closeLanguagesDropDown: function() {
        var comboBox = this.getView().down('#cboLanguages')

        comboBox.collapse()

    },

    onCboLanguagesChange: function(field, newValue, oldValue, eOpts) {
        var langPanel = this.getView()


        if (langPanel.clientSubView) {
            var curPrefLang = RolandKioskPrint.app.getPrefClientLanguage()

            if (newValue != curPrefLang) {
                RolandKioskPrint.app.setPrefClientLanguage(newValue)

                location.reload()
 // Reload the UI
            }
        } else {
            var curPrefLang = RolandKioskPrint.app.getPrefLanguage()

            if (newValue != curPrefLang) {
                RolandKioskPrint.app.setPrefLanguage(newValue)

                location.reload()
 // Reload the UI
            }
        }
    },

    onPanelAfterRender: function(component, eOpts) {
        var langPanel = this.getView()

        var curPrefLang, store


        var lblLang = langPanel.down('#lblLang')

        lblLang.setText(RolandKioskPrint.app.getString('label.generic.lang', langPanel.clientSubView) + " :")


        var comboBox = langPanel.down('#cboLanguages')

        if (langPanel.clientSubView) {
            curPrefLang = RolandKioskPrint.app.getPrefClientLanguage()

            store = Ext.StoreManager.lookup('ClientLanguages')

        } else {
            curPrefLang = RolandKioskPrint.app.getPrefLanguage()

            store = Ext.StoreManager.lookup('Languages')

        }

        comboBox.setStore(store)

        if (store.isLoaded()) {
            comboBox.setValue(curPrefLang)

        } else {
            store.on({
                'loadrecords': function(store, records) {
                    comboBox.setValue(curPrefLang)

                }
            })

        }
    }

})

