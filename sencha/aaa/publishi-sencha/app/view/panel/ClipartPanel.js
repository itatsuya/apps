/*
 * File: app/view/panel/ClipartPanel.js
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

Ext.define('RolandKioskPrint.view.panel.ClipartPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.panel.clipartpanel',

    requires: [
        'RolandKioskPrint.view.panel.ClipartPanelViewModel',
        'RolandKioskPrint.view.panel.ClipartPanelViewController',
        'Ext.form.Label',
        'Ext.form.field.ComboBox',
        'Ext.view.View',
        'Ext.XTemplate'
    ],

    controller: 'panel.clipartpanel',
    viewModel: {
        type: 'panel.clipartpanel'
    },
    border: false,
    minHeight: 330,
    padding: 10,
    style: 'font-weight: bold',
    width: 200,
    bodyStyle: 'background-color: transparent
',
    header: false,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'label',
            localized: {
                text: 'label.designer.clipartCategory'
            },
            cls: 'toolpanel-label',
            text: 'CATEGORY'
        },
        {
            xtype: 'combobox',
            itemId: 'cboCategories',
            fieldCls: 'toolpanel-combo-box',
            editable: false,
            triggerCls: 'toolpanel-combo-box',
            displayField: 'categoryName',
            store: 'ClipartCategories',
            valueField: 'categoryName',
            listeners: {
                change: 'onCboCategoriesChange'
            }
        },
        {
            xtype: 'dataview',
            flex: 1,
            itemId: 'clipartView',
            scrollable: 'vertical',
            itemSelector: 'div.clipart-item-thumb-wrap',
            itemTpl: [
                '<div class="clipart-item-thumb-wrap {[xindex % 2 === 0 ? \'clipart-item-thumb-wrap-even\' : \'clipart-item-thumb-wrap-odd\']}">',
                '	<img src=\'{filePath}\' />',
                '</div>'
            ],
            store: 'ClipartItems',
            listeners: {
                itemclick: 'onClipartViewItemClick'
            }
        }
    ],
    listeners: {
        beforerender: 'onPanelBeforeRender',
        show: 'onPanelShow'
    }

})
