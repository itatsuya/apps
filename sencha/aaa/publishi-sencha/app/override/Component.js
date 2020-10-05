Ext.define('RolandKioskPrint.override.Component', {
    override: 'Ext.Component',
    
    initComponent: function() {
        var me = this


        me.localize()

        me.callParent(arguments)

    },

    localize: function () {
        var me = this,
            localized = me.localized,
            key


        if (Ext.isObject(localized)) {
            // Client view or a descendent component.
            var isClientView = (me.clientView ||
                    RolandKioskPrint.AppData.creatingClientView ||
                    RolandKioskPrint.AppData.renderingClientView) ? true : false


            for (var prop in localized) {
                key = localized[prop]

                if (key) {
                    me[prop] = RolandKioskPrint.app.getString(key, isClientView)

                }
            }
        }
    },

    show: function(animateTarget, cb, scope) {
        var me = this


        // File inputs get created in the show method.
        if (me.clientView) {
            // We are creating a client view.
            RolandKioskPrint.AppData.renderingClientView = true

        }

        me.callParent(arguments)


        if (me.clientView) {
            RolandKioskPrint.AppData.renderingClientView = false

        }
    }
})


Ext.define('RolandKioskPrint.override.Panel', {
    override: 'Ext.panel.Panel',

    initItems: function() {
        var me = this


        if (me.clientView) {
            // We are creating a client view.
            RolandKioskPrint.AppData.creatingClientView = true

        }

        me.callParent(arguments)


        if (me.clientView) {
            RolandKioskPrint.AppData.creatingClientView = false

        }
    }
})

