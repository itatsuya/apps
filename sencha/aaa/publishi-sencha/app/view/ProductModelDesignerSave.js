/*
 * File: app/view/ProductModelDesignerSave.js
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

Ext.define('RolandKioskPrint.view.ProductModelDesignerSave', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.productmodeldesignersave',

    requires: [
        'RolandKioskPrint.view.ProductModelDesignerSaveViewModel',
        'RolandKioskPrint.view.ProductModelDesignerSaveViewController',
        'RolandKioskPrint.view.field.NumberField',
        'RolandKioskPrint.view.button.ActionButton',
        'Ext.grid.Panel',
        'Ext.grid.column.Column',
        'Ext.selection.RowModel',
        'Ext.form.Label',
        'Ext.view.View',
        'Ext.XTemplate',
        'Ext.form.field.Number',
        'Ext.button.Button'
    ],

    config: {
        localized: {
            title: 'label.generic.save'
        }
    },

    controller: 'productmodeldesignersave',
    viewModel: {
        type: 'productmodeldesignersave'
    },
    modal: true,
    cls: 'pmd-mld-form',
    floating: true,
    height: 605,
    width: 586,
    bodyStyle: 'background-color: rgb(206, 207, 209)
',
    title: 'SAVE',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    dockedItems: [
        {
            xtype: 'panel',
            cls: 'separator-bar',
            dock: 'top',
            height: 10,
            header: false
        }
    ],
    listeners: {
        show: 'onPanelShow'
    },

    initConfig: function(instanceConfig) {
        var me = this,
            config = {
                items: [
                    {
                        xtype: 'panel',
                        cls: 'pmd-mld-form-content-panel',
                        flex: 1,
                        header: false,
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'gridpanel',
                                cls: [
                                    'pmd-mld-grid-panel',
                                    'noborder-trl'
                                ],
                                height: 235,
                                itemId: 'productModelList',
                                header: false,
                                enableColumnHide: false,
                                enableColumnMove: false,
                                enableColumnResize: false,
                                sortableColumns: false,
                                store: 'ProductModels',
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        localized: {
                                            text: 'label.generic.name'
                                        },
                                        flex: 1,
                                        dataIndex: 'modelName',
                                        text: 'NAME'
                                    }
                                ],
                                listeners: {
                                    select: 'onProductModelListSelect'
                                },
                                selModel: {
                                    selType: 'rowmodel',
                                    mode: 'SINGLE'
                                }
                            },
                            {
                                xtype: 'panel',
                                flex: 1,
                                cls: 'border-bottom',
                                itemId: 'pnlSpecialEffect',
                                margin: '5 0 0 0',
                                header: false,
                                items: [
                                    {
                                        xtype: 'label',
                                        localized: {
                                            text: 'label.generic.specialEffectConfirmation'
                                        },
                                        cls: 'model-layout-name-label',
                                        margin: '0 0 0 10',
                                        text: 'SPECIAL EFFECT CONFIRMATION'
                                    },
                                    {
                                        xtype: 'dataview',
                                        itemId: 'specialEffectView',
                                        margin: '10 0 0 0',
                                        itemCls: 'save-special-effects-item-wrap',
                                        itemSelector: 'div.save-special-effects-item-wrap',
                                        itemTpl: [
                                            '<img src="{effectThumbPath}" /><span>{effectName}</span>'
                                        ],
                                        store: 'SpecialEffects'
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                margin: '10 0 10 0',
                                width: 100,
                                header: false,
                                layout: {
                                    type: 'vbox',
                                    align: 'center',
                                    pack: 'center',
                                    padding: '0 52.5 0 0'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        validator: function(value) {
                                            value = value.trim()

                                            if (!value) {
                                                return true
 // Let allowBlank handle it
                                            }

                                            // Check for disallowed characters in file name.
                                            var invalidChars = "\\/:*?\"<>|,"

                                            for (var i = 0, length = value.length
 i < length; i++) {
                                                var nameChar = value.charAt(i)

                                                if (invalidChars.indexOf(nameChar) != -1) {
                                                    return RolandKioskPrint.app.getString('message.pmd_mld.nameInvalidChars')

                                                }
                                            }

                                            // Product model name must be of the form w.x.y.z, where w, x and y are
                                            // category and sub-category names, and are optional. z is the product name.
                                            // There can not be more than 4 parts, and each part if present, must be non-blank.
                                            var partNames = value.split('.').map(function(partName) {
                                                return partName.trim()

                                            })


                                            if (partNames.length > 4) {
                                                return RolandKioskPrint.app.getString('message.pmd_mld.pmNameTooManySections')

                                            } else {
                                                for (var i = 0, length = partNames.length
 i < length; i++) {
                                                    if (!partNames[i]) {
                                                        return RolandKioskPrint.app.getString('message.pmd_mld.pmNameInvalid')

                                                    }
                                                }
                                            }

                                            // Create the product model name back with the part names trimmed.
                                            if (partNames.length > 1) {
                                                value = partNames.join('.')

                                            }

                                            // Product model name must not be an existing category/sub-category name.
                                            // Nor, should it try to use an existing product model name as a category.
                                            var contentPanel = this.up('panel').up('panel')

                                            var productModelList = contentPanel.down('#productModelList')


                                            var store = productModelList.getStore()

                                            var names = []


                                            store.each(function(record) {
                                                names.push(record.data.modelName)

                                            })


                                            for (var i = 0, length = names.length
 i < length; i++) {
                                                if (value.lastIndexOf(names[i] + '.', 0) === 0 ||
                                                names[i].lastIndexOf(value + '.', 0) === 0 ) {
                                                    return Ext.String.format(
                                                    RolandKioskPrint.app.getString('message.pmd_mld.pmNameConflict'),
                                                    value, names[i])

                                                }
                                            }

                                            return true

                                        },
                                        localized: {
                                            fieldLabel: 'label.generic.fileName',
                                            blankText: 'message.generic.blankValue',
                                            maxLengthText: 'message.generic.maxLength'
                                        },
                                        itemId: 'txtProductModelName',
                                        width: 522.5,
                                        fieldLabel: 'FILE NAME',
                                        labelAlign: 'right',
                                        labelClsExtra: 'model-layout-name-label',
                                        labelPad: 15,
                                        labelWidth: 170,
                                        fieldCls: 'grey-bg',
                                        allowBlank: false,
                                        allowOnlyWhitespace: false
                                    },
                                    {
                                        xtype: 'textfield',
                                        localized: {
                                            fieldLabel: 'label.generic.goodsCode',
                                            blankText: 'message.generic.blankValue',
                                            maxLengthText: 'message.generic.maxLength'
                                        },
                                        itemId: 'txtGoodsCode',
                                        width: 522.5,
                                        fieldLabel: 'GOODS CODE',
                                        labelAlign: 'right',
                                        labelClsExtra: 'model-layout-name-label',
                                        labelPad: 15,
                                        labelWidth: 170,
                                        fieldCls: 'grey-bg',
                                        allowBlank: false,
                                        allowOnlyWhitespace: false,
                                        bind: {
                                            disabled: '{modelTemplate.customSize}'
                                        }
                                    },
                                    {
                                        xtype: 'textfield',
                                        localized: {
                                            fieldLabel: 'label.generic.goodsName',
                                            blankText: 'message.generic.blankValue',
                                            maxLengthText: 'message.generic.maxLength'
                                        },
                                        itemId: 'txtGoodsName',
                                        width: 522.5,
                                        fieldLabel: 'GOODS NAME',
                                        labelAlign: 'right',
                                        labelClsExtra: 'model-layout-name-label',
                                        labelPad: 15,
                                        labelWidth: 170,
                                        fieldCls: 'grey-bg',
                                        allowBlank: false,
                                        allowOnlyWhitespace: false,
                                        bind: {
                                            disabled: '{modelTemplate.customSize}'
                                        }
                                    },
                                    {
                                        xtype: 'panel',
                                        flex: 1,
                                        margin: '0 0 10 0',
                                        width: 522.5,
                                        header: false,
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        items: [
                                            me.overridePriceConfig({
                                                xtype: 'field.numberfield',
                                                localized: {
                                                    fieldLabel: 'label.generic.price',
                                                    minText: 'message.generic.minValue',
                                                    maxText: 'message.generic.maxValue'
                                                },
                                                itemId: 'txtPricePerUnit',
                                                width: 235,
                                                fieldLabel: 'PRICE',
                                                labelAlign: 'right',
                                                labelClsExtra: 'model-layout-name-label',
                                                labelPad: 15,
                                                labelWidth: 170,
                                                maxValue: 2147483647,
                                                minValue: 0,
                                                flex: 1,
                                                bind: {
                                                    disabled: '{modelTemplate.customSize}'
                                                }
                                            }),
                                            {
                                                xtype: 'textfield',
                                                localized: {
                                                    fieldLabel: 'label.generic.currency',
                                                    blankText: 'message.generic.blankValue',
                                                    maxLengthText: 'message.generic.maxLength'
                                                },
                                                itemId: 'txtCurrency',
                                                width: 215,
                                                fieldLabel: 'CURRENCY',
                                                labelAlign: 'right',
                                                labelClsExtra: 'model-layout-name-label',
                                                labelPad: 15,
                                                fieldCls: 'grey-bg',
                                                allowBlank: false,
                                                allowOnlyWhitespace: false,
                                                bind: {
                                                    disabled: '{modelTemplate.customSize}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'textfield',
                                        localized: {
                                            fieldLabel: 'label.generic.message',
                                            maxLengthText: 'message.generic.maxLength'
                                        },
                                        itemId: 'txtPrintMessage',
                                        width: 522.5,
                                        fieldLabel: 'MESSAGE',
                                        labelAlign: 'right',
                                        labelClsExtra: 'model-layout-name-label',
                                        labelPad: 15,
                                        labelWidth: 170,
                                        fieldCls: 'grey-bg',
                                        bind: {
                                            hidden: '{!isFoilPrintModel && !isMetalPrintModel}'
                                        }
                                    },
                                    {
                                        xtype: 'panel',
                                        margin: '0 0 10 0',
                                        width: 522.5,
                                        header: false,
                                        layout: {
                                            type: 'hbox',
                                            align: 'stretch'
                                        },
                                        bind: {
                                            hidden: '{!isFoilPrintModel}'
                                        },
                                        items: [
                                            {
                                                xtype: 'field.numberfield',
                                                localized: {
                                                    fieldLabel: 'label.generic.powerValue',
                                                    minText: 'message.generic.minValue',
                                                    maxText: 'message.generic.maxValue'
                                                },
                                                itemId: 'txtFoilPowerValue',
                                                width: 305,
                                                fieldLabel: 'POWER VALUE',
                                                labelAlign: 'right',
                                                labelClsExtra: 'model-layout-name-label',
                                                labelPad: 15,
                                                labelWidth: 170,
                                                hideTrigger: false,
                                                minValue: 0
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                margin: '0 0 10 0',
                                header: false,
                                layout: {
                                    type: 'hbox',
                                    pack: 'center'
                                },
                                items: [
                                    {
                                        xtype: 'button.actionbutton',
                                        localized: {
                                            text: 'label.button.cancel'
                                        },
                                        height: 33,
                                        margin: '0 0 0 20',
                                        width: 140,
                                        text: 'CANCEL',
                                        listeners: {
                                            click: 'onCancelButtonClick'
                                        }
                                    },
                                    {
                                        xtype: 'button.actionbutton',
                                        localized: {
                                            text: 'label.button.save'
                                        },
                                        height: 33,
                                        margin: '0 0 0 20',
                                        width: 140,
                                        text: 'SAVE',
                                        listeners: {
                                            click: 'onSaveButtonClick'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

        if (instanceConfig) {
            me.self.getConfigurator().merge(me, config, instanceConfig)

        }
        return me.callParent([config])

    },

    overridePriceConfig: function(config) {
        // Decimal separator is handled by the number field base class.
        var uiSettings = RolandKioskPrint.AppData.getUiSettingsData() || {}

        var decimalPrecision = uiSettings.decimalPrecision


        if (decimalPrecision === undefined) {
            decimalPrecision = 2

        } else if (decimalPrecision === 0) {
            config.allowDecimals = false

        }

        config.decimalPrecision = decimalPrecision

        return config

    }

})
