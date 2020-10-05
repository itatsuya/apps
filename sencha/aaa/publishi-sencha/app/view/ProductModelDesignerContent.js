/*
 * File: app/view/ProductModelDesignerContent.js
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

Ext.define('RolandKioskPrint.view.ProductModelDesignerContent', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.productmodeldesignercontent',

    requires: [
        'RolandKioskPrint.view.ProductModelDesignerContentViewModel',
        'RolandKioskPrint.view.ProductModelDesignerContentViewController',
        'RolandKioskPrint.view.panel.ToolsPanel',
        'RolandKioskPrint.view.panel.CanvasPanel',
        'RolandKioskPrint.view.button.ActionButton',
        'RolandKioskPrint.view.panel.UndoRedoPanel',
        'RolandKioskPrint.view.panel.FlipRotatePanel',
        'RolandKioskPrint.view.panel.GroupPanel',
        'RolandKioskPrint.view.panel.MiscPanel',
        'RolandKioskPrint.view.panel.AlignPanel',
        'RolandKioskPrint.view.panel.LayerPanel',
        'RolandKioskPrint.view.panel.GapAdjustmentPanel',
        'Ext.panel.Panel',
        'Ext.form.field.Checkbox',
        'Ext.button.Button',
        'Ext.panel.Tool'
    ],

    config: {
        localized: {
            title: 'label.pmd_mld.pmdMldTitle'
        }
    },

    controller: 'productmodeldesignercontent',
    viewModel: {
        type: 'productmodeldesignercontent'
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
                type: 'hbox',
                align: 'stretch'
            },
            bind: {
                title: '{panelTitle}'
            },
            dockedItems: [
                {
                    xtype: 'panel.toolspanel',
                    dock: 'left'
                },
                {
                    xtype: 'panel',
                    border: false,
                    dock: 'right',
                    itemId: 'actionPanelContainer',
                    scrollable: 'vertical',
                    bodyCls: 'action-panel-container',
                    header: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel.undoredopanel',
                            itemId: 'undoRedoPanel'
                        },
                        {
                            xtype: 'panel.fliprotatepanel'
                        },
                        {
                            xtype: 'panel.grouppanel'
                        },
                        {
                            xtype: 'panel.miscpanel',
                            itemId: 'miscPanel'
                        },
                        {
                            xtype: 'panel.alignpanel'
                        },
                        {
                            xtype: 'panel.layerpanel'
                        },
                        {
                            xtype: 'panel.gapadjustmentpanel'
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    header: false,
                    title: 'My Panel',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel.canvaspanel',
                            clientPanel: false,
                            itemId: 'canvasPanel',
                            flex: 1
                        },
                        {
                            xtype: 'panel',
                            itemId: 'savePanel',
                            margin: '0 10 20 0',
                            header: false,
                            title: 'My Panel',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'end'
                            },
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    localized: {
                                        boxLabel: 'label.generic.guideline'
                                    },
                                    cls: 'chk-show-hide-guideline',
                                    height: 32,
                                    itemId: 'chkSmartGuide',
                                    margin: '3 10 0 0',
                                    minWidth: 120,
                                    boxLabel: 'Guideline',
                                    checked: true,
                                    listeners: {
                                        change: 'onSmartGuideChange'
                                    }
                                },
                                {
                                    xtype: 'button.actionbutton',
                                    localized: {
                                        text: 'label.button.cancel'
                                    },
                                    margin: '0 0 0 10',
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
                                    margin: '0 0 0 10',
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
    ],
    listeners: {
        beforeshow: 'onMainViewBeforeShow',
        show: 'onMainViewShow',
        hide: 'onMainViewHide',
        afterrender: 'onPanelAfterRender'
    },
    tools: [
        {
            xtype: 'tool',
            callback: 'showHelp',
            cls: 'pmd-mld-help-tool',
            type: 'help'
        }
    ]

})
