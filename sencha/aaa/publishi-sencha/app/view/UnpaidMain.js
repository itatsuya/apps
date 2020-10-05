/*
 * File: app/view/UnpaidMain.js
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

Ext.define('RolandKioskPrint.view.UnpaidMain', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.unpaidmain',

    requires: [
        'RolandKioskPrint.view.UnpaidMainViewModel',
        'RolandKioskPrint.view.UnpaidMainViewController',
        'RolandKioskPrint.view.button.UnpaidToolbarButton',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.form.field.Text',
        'Ext.form.trigger.Trigger',
        'Ext.button.Button',
        'Ext.form.Label',
        'Ext.grid.Panel',
        'Ext.grid.column.RowNumberer',
        'Ext.selection.RowModel',
        'Ext.grid.column.Action'
    ],

    config: {
        localized: {
            title: 'label.unpaid.title'
        }
    },

    controller: 'unpaidmain',
    viewModel: {
        type: 'unpaidmain'
    },
    cls: [
        'pmd-mld-form',
        'pmd-mld-unpaid-form'
    ],
    bodyStyle: 'background-color: rgb(206, 207, 209)
',
    title: 'cotodesign Order Viewer',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },
    dockedItems: [
        {
            xtype: 'toolbar',
            flex: 1,
            cls: 'unpaid-order-form-toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'textfield',
                    localized: {
                        emptyText: 'label.unpaid.searchEmptyText'
                    },
                    cls: 'unpaid-order-search-icon',
                    hideLabel: true,
                    fieldCls: 'unpaid-order-search-field',
                    fieldStyle: 'margin-top: 0px
 padding-top: 0px; !important',
                    emptyText: 'Search',
                    triggers: {
                        search: {
                            handler: 'onSearchButtonClick'
                        }
                    },
                    listeners: {
                        specialkey: 'onSearchFieldSpecialkey',
                        afterrender: 'onTextfieldAfterRender'
                    }
                },
                {
                    xtype: 'button.unpaidtoolbarbutton',
                    margin: '0 5 0 10',
                    iconCls: 'unpaid-toolbar-button-icon unpaid-toolbar-button-refesh fa-repeat',
                    listeners: {
                        click: 'onRefreshButtonClick'
                    }
                },
                {
                    xtype: 'button.unpaidtoolbarbutton',
                    cls: 'unpaid-toolbar-button-help',
                    margin: '0 10 0 10',
                    iconCls: 'unpaid-toolbar-button-icon fa-question',
                    listeners: {
                        click: 'onHelpButtonClick'
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            flex: 1,
            cls: 'separator-bar',
            dock: 'top',
            height: 10,
            header: false
        }
    ],
    items: [
        {
            xtype: 'panel',
            flex: 0.6,
            margin: '5 5 0 5',
            header: false,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    flex: 1,
                    itemId: 'pnlUnpaidOrders',
                    header: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            cls: [
                                'pmd-mld-grid-panel-header',
                                'noborder-right'
                            ],
                            height: 40,
                            header: false,
                            manageHeight: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    cls: 'header-text',
                                    itemId: 'lblUnpaidOrders',
                                    text: '1. Unpaid order list'
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            reference: 'unpaidOrdersList',
                            cls: [
                                'pmd-mld-grid-panel',
                                'noborder-top',
                                'noborder-right'
                            ],
                            flex: 1,
                            itemId: 'unpaidOrdersList',
                            header: false,
                            allowDeselect: true,
                            enableColumnHide: false,
                            enableColumnMove: false,
                            enableColumnResize: false,
                            sortableColumns: false,
                            store: 'UnpaidOrders',
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    localized: {
                                        text: 'label.generic.numberShort'
                                    },
                                    width: 49,
                                    align: 'center',
                                    text: 'NO.'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    localized: {
                                        text: 'label.generic.name'
                                    },
                                    flex: 1,
                                    dataIndex: 'orderId',
                                    tdCls: 'x-grid-cell-special',
                                    text: 'NAME'
                                },
                                {
                                    xtype: 'actioncolumn',
                                    handler: 'confirmPayment',
                                    width: 49,
                                    tdCls: 'unpaid-order-grid-action-column-cell',
                                    iconCls: 'x-fa fa-angle-right unpaid-order-grid-action-column-icon',
                                    items: [
                                        {

                                        }
                                    ]
                                }
                            ],
                            selModel: {
                                selType: 'rowmodel',
                                mode: 'SINGLE'
                            },
                            listeners: {
                                select: 'onUnpaidOrdersListSelect'
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    header: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            cls: [
                                'pmd-mld-grid-panel-header',
                                'noborder-right'
                            ],
                            height: 40,
                            header: false,
                            manageHeight: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    cls: 'header-text',
                                    itemId: 'lblPrintingWaiting',
                                    text: '2. Waiting for printing order'
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            reference: 'printingWaitingOrdersList',
                            cls: [
                                'pmd-mld-grid-panel',
                                'noborder-top',
                                'noborder-right'
                            ],
                            flex: 1,
                            itemId: 'printingWaitingOrdersList',
                            header: false,
                            allowDeselect: true,
                            enableColumnHide: false,
                            enableColumnMove: false,
                            enableColumnResize: false,
                            sortableColumns: false,
                            store: 'PrintingWaitingOrders',
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    localized: {
                                        text: 'label.generic.numberShort'
                                    },
                                    width: 49,
                                    align: 'center',
                                    text: 'NO.'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    localized: {
                                        text: 'label.generic.name'
                                    },
                                    flex: 1,
                                    dataIndex: 'orderId',
                                    text: 'NAME'
                                }
                            ],
                            selModel: {
                                selType: 'rowmodel',
                                mode: 'SINGLE'
                            },
                            listeners: {
                                select: 'onPrintingWaitingOrdersListSelect'
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    header: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            cls: [
                                'pmd-mld-grid-panel-header',
                                'noborder-right'
                            ],
                            height: 40,
                            header: false,
                            manageHeight: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    cls: 'header-text',
                                    itemId: 'lblReceivingPossibility',
                                    text: '3. Receiving possibility'
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            reference: 'readyToReceiveOrdersList',
                            cls: [
                                'pmd-mld-grid-panel',
                                'noborder-top',
                                'noborder-right'
                            ],
                            flex: 1,
                            itemId: 'readyToReceiveOrdersList',
                            header: false,
                            allowDeselect: true,
                            enableColumnHide: false,
                            enableColumnMove: false,
                            enableColumnResize: false,
                            sortableColumns: false,
                            store: 'ReceivingPossiblityOrders',
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    localized: {
                                        text: 'label.generic.numberShort'
                                    },
                                    width: 49,
                                    align: 'center',
                                    text: 'NO.'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    localized: {
                                        text: 'label.generic.name'
                                    },
                                    flex: 1,
                                    dataIndex: 'orderId',
                                    tdCls: 'x-grid-cell-special',
                                    text: 'NAME'
                                },
                                {
                                    xtype: 'actioncolumn',
                                    handler: 'confirmDelivery',
                                    width: 49,
                                    tdCls: 'unpaid-order-grid-action-column-cell',
                                    iconCls: 'x-fa fa-angle-right unpaid-order-grid-action-column-icon',
                                    items: [
                                        {

                                        }
                                    ]
                                }
                            ],
                            selModel: {
                                selType: 'rowmodel',
                                mode: 'SINGLE'
                            },
                            listeners: {
                                select: 'onReadyToReceiveOrdersListSelect'
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    flex: 1,
                    header: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            cls: 'pmd-mld-grid-panel-header',
                            height: 40,
                            header: false,
                            manageHeight: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    cls: 'header-text',
                                    itemId: 'lblDelivered',
                                    text: '4. Delivered'
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            reference: 'deliveredOrdersList',
                            cls: [
                                'pmd-mld-grid-panel',
                                'noborder-top'
                            ],
                            flex: 1,
                            itemId: 'deliveredOrdersList',
                            header: false,
                            allowDeselect: true,
                            enableColumnHide: false,
                            enableColumnMove: false,
                            enableColumnResize: false,
                            sortableColumns: false,
                            store: 'DeliveredOrders',
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    localized: {
                                        text: 'label.generic.numberShort'
                                    },
                                    width: 49,
                                    align: 'center',
                                    text: 'NO.'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    localized: {
                                        text: 'label.generic.name'
                                    },
                                    flex: 1,
                                    dataIndex: 'orderId',
                                    text: 'NAME'
                                }
                            ],
                            selModel: {
                                selType: 'rowmodel',
                                mode: 'SINGLE'
                            },
                            listeners: {
                                select: 'onDeliveredOrdersListSelect'
                            }
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            flex: 0.4,
            cls: 'unpaid-order-form-container-panel',
            margin: '3 5 5 5',
            header: false,
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'panel',
                    flex: 0.3,
                    header: false
                },
                {
                    xtype: 'component',
                    flex: 0.2,
                    itemId: 'imgProductDesign',
                    margin: '20 10 20 0',
                    bind: {
                        hidden: '{!unpaidOrdersList.selection && !printingWaitingOrdersList.selection && !readyToReceiveOrdersList.selection && !deliveredOrdersList.selection}'
                    }
                },
                {
                    xtype: 'panel',
                    flex: 0.5,
                    itemId: 'orderDetailsPanel',
                    margin: '30 0 30 0',
                    minWidth: 225,
                    header: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            flex: 1,
                            border: false,
                            maxHeight: 20,
                            minHeight: 20,
                            header: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            bind: {
                                hidden: '{!unpaidOrdersList.selection && !printingWaitingOrdersList.selection && !readyToReceiveOrdersList.selection && !deliveredOrdersList.selection}'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    flex: 0.2,
                                    minWidth: 110,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            localized: {
                                                text: 'label.unpaid.orderId'
                                            },
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 20 0 0',
                                            text: 'Order ID'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    flex: 0.8,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            text: ':'
                                        },
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 0 0 20',
                                            bind: {
                                                text: '{orderIdValue}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            flex: 1,
                            border: false,
                            maxHeight: 20,
                            minHeight: 20,
                            header: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            bind: {
                                hidden: '{!unpaidOrdersList.selection && !printingWaitingOrdersList.selection && !readyToReceiveOrdersList.selection && !deliveredOrdersList.selection}'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    flex: 0.2,
                                    minWidth: 110,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            localized: {
                                                text: 'label.unpaid.orderQuantity'
                                            },
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 20 0 0',
                                            text: 'Order Quantity'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    flex: 0.8,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            text: ':'
                                        },
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 0 0 20',
                                            bind: {
                                                text: '{orderQuantityVal}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            flex: 1,
                            border: false,
                            maxHeight: 20,
                            minHeight: 20,
                            header: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            bind: {
                                hidden: '{!unpaidOrdersList.selection && !printingWaitingOrdersList.selection && !readyToReceiveOrdersList.selection && !deliveredOrdersList.selection}'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    flex: 0.2,
                                    minWidth: 110,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            localized: {
                                                text: 'label.unpaid.goodsName'
                                            },
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 20 0 0',
                                            text: 'Goods Name'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    flex: 0.8,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            text: ':'
                                        },
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 0 0 20',
                                            bind: {
                                                text: '{goodsNameVal}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            flex: 1,
                            border: false,
                            maxHeight: 20,
                            minHeight: 20,
                            header: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            bind: {
                                hidden: '{!unpaidOrdersList.selection && !printingWaitingOrdersList.selection && !readyToReceiveOrdersList.selection && !deliveredOrdersList.selection}'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    flex: 0.2,
                                    minWidth: 110,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            localized: {
                                                text: 'label.unpaid.goodsCode'
                                            },
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 20 0 0',
                                            text: 'Goods Code'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    flex: 0.8,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            text: ':'
                                        },
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 0 0 20',
                                            bind: {
                                                text: '{goodsCodeVal}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            flex: 1,
                            border: false,
                            maxHeight: 20,
                            minHeight: 20,
                            header: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            bind: {
                                hidden: '{!unpaidOrdersList.selection && !printingWaitingOrdersList.selection && !readyToReceiveOrdersList.selection && !deliveredOrdersList.selection}'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    flex: 0.2,
                                    minWidth: 110,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            localized: {
                                                text: 'label.unpaid.productModel'
                                            },
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 20 0 0',
                                            text: 'Product Model'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    flex: 0.8,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            text: ':'
                                        },
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 0 0 20',
                                            bind: {
                                                text: '{productModelVal}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            flex: 1,
                            border: false,
                            margin: '0 0 20 0',
                            maxHeight: 20,
                            minHeight: 20,
                            header: false,
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            bind: {
                                hidden: '{!unpaidOrdersList.selection && !printingWaitingOrdersList.selection && !readyToReceiveOrdersList.selection && !deliveredOrdersList.selection}'
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    flex: 0.2,
                                    minWidth: 110,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            localized: {
                                                text: 'label.unpaid.price'
                                            },
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 20 0 0',
                                            text: 'Price'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'panel',
                                    flex: 0.8,
                                    header: false,
                                    title: 'My Panel',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            text: ':'
                                        },
                                        {
                                            xtype: 'label',
                                            cls: 'unpaid-order-form-regular-labels',
                                            margin: '0 0 0 20',
                                            bind: {
                                                text: '{totalPriceVal}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    listeners: {
        show: 'onPanelShow',
        hide: 'onPanelHide',
        afterrender: 'onPanelAfterRender'
    }

})
