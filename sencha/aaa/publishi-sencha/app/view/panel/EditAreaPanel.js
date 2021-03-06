/*
 * File: app/view/panel/EditAreaPanel.js
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

Ext.define('RolandKioskPrint.view.panel.EditAreaPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.panel.editareapanel',

    requires: [
        'RolandKioskPrint.view.panel.EditAreaPanelViewModel',
        'RolandKioskPrint.view.panel.EditAreaPanelViewController',
        'Ext.form.Label',
        'Ext.form.field.ComboBox',
        'Ext.panel.Panel',
        'Ext.view.View',
        'Ext.XTemplate'
    ],

    controller: 'panel.editareapanel',
    viewModel: {
        type: 'panel.editareapanel'
    },
    border: false,
    minHeight: 330,
    padding: 10,
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
                text: 'label.designer.areaTypeLabel'
            },
            cls: 'toolpanel-label',
            text: 'AREA TYPE'
        },
        {
            xtype: 'combobox',
            itemId: 'cboEditAreaTypes',
            fieldCls: 'toolpanel-combo-box',
            editable: false,
            triggerCls: 'toolpanel-combo-box',
            displayField: 'editAreaLabel',
            valueField: 'editAreaType',
            listeners: {
                change: 'onCboEditAreaTypesChange'
            }
        },
        {
            xtype: 'panel',
            height: 40,
            margin: '0 0 10 0',
            bodyStyle: '\'background-color: transparent
\'',
            header: false,
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'icomoon2 icon-image-area edit-area-type-icon',
                    itemId: 'lblEditAreaIcon',
                    margin: '0 10 0 15'
                },
                {
                    xtype: 'label',
                    localized: {
                        text: 'label.designer.areaTypeLabel'
                    },
                    flex: 1,
                    cls: 'toolpanel-label',
                    itemId: 'lblEditArea',
                    text: 'AREA TYPE'
                }
            ]
        },
        {
            xtype: 'label',
            localized: {
                text: 'label.designer.areaShapeLabel'
            },
            cls: 'toolpanel-label',
            text: 'AREA SHAPE'
        },
        {
            xtype: 'dataview',
            flex: 1,
            itemId: 'shapeView',
            scrollable: 'vertical',
            itemSelector: 'div.shape-type-item-thumb-wrap',
            itemTpl: [
                '<div class = "shape-type-item-thumb-wrap {iconClass} edit-area-shape-type-icon {[xindex % 2 === 0 ? \'shape-type-item-thumb-wrap-even\' : \'shape-type-item-thumb-wrap-odd\']}"></div>'
            ],
            store: 'Shapes',
            listeners: {
                itemclick: 'onShapeViewItemClick'
            }
        }
    ],
    listeners: {
        beforeshow: 'onPanelBeforeShow',
        afterrender: 'onPanelAfterRender'
    }

})
