/*
 * File: app/store/Fonts.js
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

Ext.define('RolandKioskPrint.store.Fonts', {
    extend: 'Ext.data.Store',

    requires: [
        'RolandKioskPrint.model.Font',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.util.Filter',
        'Ext.util.Sorter'
    ],

    constructor: function(cfg) {
        var me = this

        cfg = cfg || {}

        me.callParent([Ext.apply({
            storeId: 'Fonts',
            autoLoad: false,
            model: 'RolandKioskPrint.model.Font',
            proxy: {
                type: 'ajax',
                url: '/cotodesign/resources/fonts',
                reader: {
                    type: 'json',
                    rootProperty: 'fonts'
                }
            },
            filters: {
                filterFn: function(item) {
                    // Check if the font is enabled, and has at least one enabled style.
                    var fontData = item.data


                    return (fontData.enabled &&
                    fontData.enabledStyles &&
                    fontData.enabledStyles.length > 0)

                }
            },
            sorters: {
                property: 'familyName'
            }
        }, cfg)])

    }
})
