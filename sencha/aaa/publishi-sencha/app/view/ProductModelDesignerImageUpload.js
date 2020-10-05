/*
 * File: app/view/ProductModelDesignerImageUpload.js
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

Ext.define('RolandKioskPrint.view.ProductModelDesignerImageUpload', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.productmodeldesignerimageupload',

    requires: [
        'RolandKioskPrint.view.ProductModelDesignerImageUploadViewModel',
        'RolandKioskPrint.view.ProductModelDesignerImageUploadViewController',
        'RolandKioskPrint.view.panel.ImageUploadPanel',
        'RolandKioskPrint.view.button.ActionButton',
        'Ext.panel.Panel',
        'Ext.form.Label',
        'Ext.button.Button'
    ],

    config: {
        localized: {
            title: 'label.designer.pmdQRCodeTitle'
        }
    },

    controller: 'productmodeldesignerimageupload',
    viewModel: {
        type: 'productmodeldesignerimageupload'
    },
    modal: true,
    cls: 'pmd-mld-form',
    floating: true,
    height: 400,
    width: 600,
    bodyStyle: 'background-color: rgb(206, 207, 209)
',
    title: 'IMPORT',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    dockedItems: [
        {
            xtype: 'panel',
            flex: 1,
            cls: 'separator-bar',
            dock: 'top',
            height: 8,
            header: false,
            title: 'My Panel'
        }
    ],
    items: [
        {
            xtype: 'panel',
            flex: 1,
            cls: 'pmd-mld-form-content-panel',
            header: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'product-qr-code-top-label',
                    height: 50,
                    bind: {
                        text: '{labelString}'
                    }
                },
                {
                    xtype: 'panel.imageuploadpanel',
                    cls: [
                        'noborder-trl',
                        'pmd-mld-grid-panel'
                    ],
                    flex: 0.9
                },
                {
                    xtype: 'panel',
                    flex: 0.1,
                    margin: '10 0 10 0',
                    maxHeight: 30,
                    header: false,
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'button.actionbutton',
                            itemId: 'btnCloseBack',
                            margin: '0 10 0 0',
                            width: 100,
                            bind: {
                                text: '{closeBackBtnText}'
                            },
                            listeners: {
                                click: 'onCloseBackButtonClick'
                            }
                        },
                        {
                            xtype: 'button.actionbutton',
                            hidden: true,
                            itemId: 'btnNextClose',
                            margin: '0 10 0 0',
                            width: 100,
                            bind: {
                                text: '{nextCloseBtnText}'
                            },
                            listeners: {
                                click: 'onNextCloseButtonClick'
                            }
                        }
                    ]
                }
            ]
        }
    ]

})
