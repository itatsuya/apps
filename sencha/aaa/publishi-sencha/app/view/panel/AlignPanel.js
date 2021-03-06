/*
 * File: app/view/panel/AlignPanel.js
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

Ext.define('RolandKioskPrint.view.panel.AlignPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.panel.alignpanel',

    requires: [
        'RolandKioskPrint.view.panel.AlignPanelViewModel',
        'RolandKioskPrint.view.panel.AlignPanelViewController',
        'RolandKioskPrint.view.button.PanelButton',
        'Ext.panel.Panel',
        'Ext.button.Button'
    ],

    config: {
        localized: {
            title: 'label.designer.alignTitle'
        }
    },

    controller: 'panel.alignpanel',
    viewModel: {
        type: 'panel.alignpanel'
    },
    cls: 'action-panel',
    width: 120,
    title: 'ALIGN',
    titleAlign: 'center',

    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'panel',
            header: false,
            items: [
                {
                    xtype: 'button.panelbutton',
                    cls: 'icomoon icon-align-horizontial-center first-column',
                    itemId: 'btnAlignMiddle',
                    listeners: {
                        click: 'onAlignMiddleButtonClick'
                    }
                },
                {
                    xtype: 'button.panelbutton',
                    cls: 'icomoon icon-align-vertical-center',
                    itemId: 'btnAlignCenter',
                    listeners: {
                        click: 'onAlignCenterButtonClick'
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            header: false,
            items: [
                {
                    xtype: 'button.panelbutton',
                    cls: 'icomoon icon-align-top first-column',
                    itemId: 'btnAlignTop',
                    listeners: {
                        click: 'onAlignTopButtonClick'
                    }
                },
                {
                    xtype: 'button.panelbutton',
                    cls: 'icomoon icon-align-left',
                    itemId: 'btnAlignLeft',
                    listeners: {
                        click: 'onAlignLeftButtonClick'
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            header: false,
            items: [
                {
                    xtype: 'button.panelbutton',
                    cls: 'icomoon icon-align-bottom first-column',
                    itemId: 'btnAlignBottom',
                    listeners: {
                        click: 'onAlignBottomButtonClick'
                    }
                },
                {
                    xtype: 'button.panelbutton',
                    cls: 'icomoon icon-align-right',
                    itemId: 'btnAlignRight',
                    listeners: {
                        click: 'onAlignRightButtonClick'
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            header: false,
            items: [
                {
                    xtype: 'button.panelbutton',
                    cls: 'icomoon5 icon-align-icon-vertical first-column',
                    itemId: 'btnAlignVerticalCenter',
                    listeners: {
                        click: 'onAlignVerticalCenterButtonClick'
                    }
                },
                {
                    xtype: 'button.panelbutton',
                    cls: 'icomoon5 icon-align-icon-horizontal',
                    itemId: 'btnAlignHorizontalCenter',
                    listeners: {
                        click: 'onAlignHorizontalCenterButtonClick'
                    }
                }
            ]
        }
    ]

})
