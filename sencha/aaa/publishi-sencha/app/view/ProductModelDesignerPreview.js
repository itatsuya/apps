/*
 * File: app/view/ProductModelDesignerPreview.js
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

Ext.define('RolandKioskPrint.view.ProductModelDesignerPreview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.productmodeldesignerpreview',

    requires: [
        'RolandKioskPrint.view.ProductModelDesignerPreviewViewModel',
        'RolandKioskPrint.view.ProductModelDesignerPreviewViewController',
        'RolandKioskPrint.view.button.ActionButton',
        'Ext.panel.Panel',
        'Ext.button.Button'
    ],

    config: {
        localized: {
            title: 'label.pmd_mld.pmdMldTitle'
        }
    },

    controller: 'productmodeldesignerpreview',
    viewModel: {
        type: 'productmodeldesignerpreview'
    },
    cls: 'pmd-mld-form',
    layout: 'fit',
    bodyStyle: 'background-color: rgb(206, 207, 209)
',
    title: 'PRODUCT MODEL DESIGNER - MODEL LAYOUT DESIGNER',

    dockedItems: [
        {
            xtype: 'panel',
            cls: 'separator-bar',
            dock: 'top',
            height: 10,
            header: false
        }
    ],
    items: [
        {
            xtype: 'panel',
            border: false,
            cls: 'pmd-mld-form-content-panel',
            titleAlign: 'center',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bind: {
                title: '{panelTitle}'
            },
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    margin: 10,
                    layout: 'fit',
                    header: false,
                    items: [
                        {
                            xtype: 'component',
                            itemId: 'imgProductModelDesign'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    margin: '0 0 20 0',
                    frameHeader: false,
                    header: false,
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button.actionbutton',
                            localized: {
                                text: 'label.button.close'
                            },
                            margin: '0 20 0 0',
                            text: 'CLOSE',
                            listeners: {
                                click: 'onCloseButtonClick'
                            }
                        }
                    ]
                }
            ]
        }
    ],
    listeners: {
        beforeshow: 'onMainViewBeforeShow'
    }

})
