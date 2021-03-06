/*
 * File: app/view/MyModels.js
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

Ext.define('ViewOverviewExtJS.view.MyModels', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mymodels',

    requires: [
        'ViewOverviewExtJS.view.MyModelsViewModel',
        'ViewOverviewExtJS.view.MyModelsViewController',
        'Ext.grid.Panel',
        'Ext.grid.column.Column',
        'Ext.form.field.Display',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.button.Button',
        'Ext.toolbar.Toolbar'
    ],

    controller: 'mymodels',
    viewModel: {
        type: 'mymodels'
    },
    height: 250,
    shrinkWrap: 0,
    width: 400,
    layout: 'border',
    collapsed: false,
    title: 'My Panel',

    items: [
        {
            xtype: 'gridpanel',
            flex: 1,
            region: 'center',
            split: true,
            reference: 'list',
            resizable: false,
            title: '',
            forceFit: true,
            bind: {
                store: '{myModels}'
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'myField',
                    text: 'My Field'
                }
            ],
            listeners: {
                select: 'select'
            }
        },
        {
            xtype: 'panel',
            flex: 1,
            region: 'east',
            split: true,
            reference: 'display',
            width: 150,
            layout: 'card',
            bodyBorder: true,
            items: [
                {
                    xtype: 'panel',
                    reference: 'selectMessage',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            html: '"<h1>Please select a record</h1>"'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    reference: 'details',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'My Field',
                            bind: {
                                value: '{record.myField}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'form',
                    reference: 'form',
                    bodyPadding: 10,
                    title: 'Edit MyModel',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'My Field',
                            name: 'myField'
                        },
                        {
                            xtype: 'container',
                            padding: 10,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    formBind: true,
                                    itemId: 'saveButton',
                                    margin: 5,
                                    text: 'Save',
                                    listeners: {
                                        click: 'save'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    itemId: 'cancelButton',
                                    margin: 5,
                                    text: 'Cancel',
                                    listeners: {
                                        click: 'cancelEdit'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Add',
                    listeners: {
                        click: 'add'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Edit',
                    bind: {
                        hidden: '{!record}'
                    },
                    listeners: {
                        click: 'edit'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Remove',
                    bind: {
                        hidden: '{!record}'
                    },
                    listeners: {
                        click: 'remove'
                    }
                }
            ]
        }
    ]

});