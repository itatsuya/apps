/*
 * File: app/view/panel/FoilColorPanelViewController.js
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

Ext.define('RolandKioskPrint.view.panel.FoilColorPanelViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.foilcolorpanel',

    listen: {
        controller: {
            'panel.undoredopanel': {
                foilColorChanged: 'onFoilColorChange'
            }
        }
    },

    getColorableObjects: function() {
        var colorableObjects = []


        var canvas = RolandKioskPrint.AppData.getCanvas()

        this.getColorableObjectsInner(canvas, colorableObjects)


        return colorableObjects

    },

    getColorableObjectsInner: function(canvasOrGroup, colorableObjects) {
        var objects = canvasOrGroup.getObjects()


        for (var i = 0, length = objects.length
 i < length; i++) {
            var object = objects[i]

            var id = object.get('id')


            // Exclude margin and mask.
            // Exclude background objects.
            // Exclude foil imprint area object.
            if (id == 'margin' || id == 'mask' || id == 'background' || RolandKioskPrint.AppData.isImprintArea(object)) {
                continue

            }

            // Exclude cut path and edit area objects.
            if (object.isCutPath || object.editAreaType) {
                continue

            }

            // For groups, check the child objects.
            var objectType = object.get('type')

            if (objectType == 'group') {
                if (object.isPathGroup) {
                    colorableObjects.push(object)

                    if (!object.isSameColor()) {
                        // SVG design objects.
                        this.getColorableObjectsInner(object, colorableObjects)

                    }
                } else {
                    this.getColorableObjectsInner(object, colorableObjects)

                }
            } else if (objectType == 'clippingGroup') {
                // Get the image being clipped.
                colorableObjects.push(object.getElement())

            } else {
                colorableObjects.push(object)

            }
        }
    },

    getFoilColorData: function() {
        return this.getViewModel().getData()

    },

    setFoilColorData: function(foilColorData) {
        this.getViewModel().setData(foilColorData)


        // Show warning if the foil color of template does not exist in foil color list.
        if (!this.onCanvasStateChange) {
            var canvas = RolandKioskPrint.AppData.getCanvas()

            var me = this


            this.onCanvasStateChange = {
                'canvas:x-ready': function() {
                    me.checkFoilColor()

                }
            }

            canvas.on(this.onCanvasStateChange)

        }
    },

    applyFoilColor: function(colorValue) {
        // Apply foil color to all colorable objects.
        var objects = this.getColorableObjects()
 // art
        var canvas = RolandKioskPrint.AppData.getCanvas()


        for (var i = 0, length = objects.length
 i < length; i++) {
            if (objects[i].get('type') == 'image') {
                // Update the tint filter color.
                var appliedFilters = objects[i].filters

                for (var j = 0, l = appliedFilters.length
 j < l; j++) {
                    var filter = appliedFilters[j]

                    if (filter.type == 'Tint') {
                        filter.color = colorValue

                        break

                    }
                }
                objects[i].applyFilters()

            } else {
                // First set the fill color.
                objects[i].set('fill', colorValue)


                // If the object has a stroke color, change it as well.
                var stroke = objects[i].get('stroke') || ''

                if (stroke !== '') {
                    objects[i].set('stroke', colorValue)

                }
            }
        }
    },

    setActiveFoilColor: function(foilColor) {
        var foilColorView = this.getView().down('#foilColorView')


        // Find the corresponding record in store, and select.
        var store = foilColorView.getStore()

        var record = store.findRecord('colorName', foilColor.name)


        if (record && record.data.colorValue == foilColor.value) {
            foilColorView.select(record, false, true)

        } else {
            foilColorView.getSelectionModel().deselectAll()

        }
    },

    onFoilColorChange: function() {
        var viewModel = this.getViewModel()


        this.setActiveFoilColor({
            name: viewModel.get('foilColorName'),
            value: viewModel.get('foilColorValue')
        })

    },

    checkFoilColor: function() {
        var isProductDesigner = RolandKioskPrint.AppData.isProductDesigner(),
            productModelData = RolandKioskPrint.AppData.productModelData


        if (!productModelData.isFoilPrint()) {
            return

        }

        if (isProductDesigner && productModelData.userFoilColorSelection != 'on') {
            // No validation if we are running product designer and are not allowed to change foil color.
            return

        }

        var foilColorView = this.getView().down('#foilColorView')

        var foilColorName = this.getViewModel().get('foilColorName')

        var foilColorValue = this.getViewModel().get('foilColorValue')


        // Find the corresponding record in store.
        var store = foilColorView.getStore()

        var record = store.findRecord('colorName', foilColorName)


        if (!record || record.data.colorValue != foilColorValue) {
            RolandKioskPrint.app.displayMessage({
                title: RolandKioskPrint.app.getString('message.generic.warning'),
                msg: RolandKioskPrint.app.getString('message.designer.missingFoilColor'),
                buttonText: {
                    ok: RolandKioskPrint.app.getString('label.button.ok')
                },
                icon: Ext.MessageBox.WARNING
            })

        }
    },

    onFoilColorViewItemClick: function(dataview, record, item, index, e, eOpts) {
        this.applyFoilColor(record.data.colorValue)


        // Update the view model data.
        this.getViewModel().set({
            'foilColorName': record.data.colorName,
            'foilColorValue': record.data.colorValue
        })


        var canvas = RolandKioskPrint.AppData.getCanvas()

        canvas.renderAll()


        canvas.fire('object:modified')

    },

    onFoilColorViewContainerClick: function(dataview, e, eOpts) {
        return false
 // Prevent deselection when clicking outside items
    },

    onPanelShow: function(component, eOpts) {
        var viewModel = this.getViewModel()


        this.setActiveFoilColor({
            name: viewModel.get('foilColorName'),
            value: viewModel.get('foilColorValue')
        })

    }

})

