/*
 * File: app/view/PopupForm.js
 *
 * This file was generated by Sencha Architect version 4.2.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.6.x Modern library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.6.x Modern. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('QuickStart.view.PopupForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.popupform',

    requires: [
        'QuickStart.view.PopupFormViewModel',
        'QuickStart.view.PopupFormViewController',
        'Ext.field.Select',
        'Ext.Toolbar',
        'Ext.Button'
    ],

    config: {
        floating: true
    },

    controller: 'popupform',
    viewModel: {
        type: 'popupform'
    },
    centered: true,
    modal: true,
    title: 'Update Record',

    items: [
        {
            xtype: 'textfield',
            bind: '{employee.firstName}',
            name: 'firstname',
            label: 'First Name'
        },
        {
            xtype: 'textfield',
            bind: '{employee.lastName}',
            name: 'lastname',
            label: 'Last Name'
        },
        {
            xtype: 'textfield',
            bind: '{employee.phoneNumber}',
            name: 'phonenumber',
            label: 'Phone Number'
        },
        {
            xtype: 'selectfield',
            bind: '{employee.officeLocation}',
            name: 'office',
            label: 'Office Location',
            options: [
                {
                    text: 'Redwood City, CA',
                    value: 'rwcca'
                },
                {
                    text: 'Lawrence, KS',
                    value: 'lk'
                },
                {
                    text: 'Frederick, MD',
                    value: 'fmd'
                }
            ]
        },
        {
            xtype: 'toolbar',
            docked: 'bottom',
            items: [
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-check',
                    text: 'Submit',
                    listeners: {
                        tap: 'submitUpdate'
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-close',
                    text: 'Cancel',
                    listeners: {
                        tap: 'cancelUpdate'
                    }
                }
            ]
        }
    ]

});