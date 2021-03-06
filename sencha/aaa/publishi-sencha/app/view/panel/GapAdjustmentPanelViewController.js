/*
 * File: app/view/panel/GapAdjustmentPanelViewController.js
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

Ext.define('RolandKioskPrint.view.panel.GapAdjustmentPanelViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.gapadjustmentpanel',

    parentShown: function() {
        // Update the panel.
        this.updatePanel()


        // Register for further selection change notifications.
        var canvas = RolandKioskPrint.AppData.getCanvas()

        var me = this


        if (!this.onCanvasSelectionChange) {
            this.onCanvasSelectionChange = {
                'selection:created': function() {
                    me.updatePanel()

                },
                'selection:updated': function() {
                    me.updatePanel()

                },
                'selection:cleared': function() {
                    me.updatePanel()

                }
            }

        }
        canvas.on(this.onCanvasSelectionChange)

    },

    parentHidden: function() {
        // Unregister for canvas notifications.
        if (this.onCanvasSelectionChange) {
            var canvas = RolandKioskPrint.AppData.getCanvas()

            canvas.off(this.onCanvasSelectionChange)

        }
    },

    updatePanel: function() {
        var canAlign = false

        var canvas = RolandKioskPrint.AppData.getCanvas()

        var activeObject = canvas.getActiveObject()


        var gapAlignMode = RolandKioskPrint.AppData.getCropMode()

        if (!gapAlignMode) {
            // Enable align if we have multiple items selected.
            // For fabric canvas, this means that we have an active selection group.
            canAlign = (activeObject && !activeObject.isEffectivelyLocked &&
                        !activeObject.isLocked && activeObject.get('type') == 'activeSelection') ? true : false

        }

        if (canAlign){
            var objects = [],
                isProductDesigner = RolandKioskPrint.AppData.isProductDesigner()


            if (activeObject.get('type') == 'activeSelection') {
                objects = activeObject.getObjects()

            } else {
                objects = [activeObject]

            }

            // Gap enables when three objects get actively selected.
            // Minimum three objects need to perform the gap panel actions.
            if (objects !== null && objects.length >2) {
               canAlign = true

            } else {
                 canAlign = false

            }


            // While the edit areas are selectable as targets in product designer, we do not
            // allow those to be moved around.
            if (isProductDesigner) {
                for (var i = 0, length = objects.length
 i < length; i++) {
                    if (objects[i].editAreaType) {
                        canAlign = false

                        break

                    }
                }
            }

            // For now, do not allow foil imprint area to participate in align operation.
            // Going forward, we can do fancy things like aligning to imprint area.
            if (!isProductDesigner) {
                for (var i = 0, length = objects.length
 i < length; i++) {
                    if (RolandKioskPrint.AppData.isImprintArea(objects[i])) {
                        canAlign = false

                        break

                    }
                }
            }
        }


        var view = this.getView()


        view.down('#btnXGapAlign').setDisabled(!canAlign)

        view.down('#btnYGapAlign').setDisabled(!canAlign)


    },

    createSelectionGroup: function(canvas, objects) {
        // Create a selection group for the objects.
        var selectionGroup = new fabric.ActiveSelection(objects, {
            canvas: canvas
        })


        canvas.setActiveObject(selectionGroup)

        return selectionGroup

    },

    onBtnXGapAlignClick: function(button, e, eOpts) {
        // Idea - Object boundary box width get as object width even if it is rotated. while rotating the object,
        // origin point (top , left) will be changed according to rotation angle

        var canvas = RolandKioskPrint.AppData.getCanvas()

        var activeObject = canvas.getActiveObject()


        if (activeObject && !activeObject.isLocked && activeObject.get('type') == 'activeSelection') {
            var objectsInGroup = activeObject.getObjects()

            canvas.discardActiveObject()



            var byLeftValue = objectsInGroup.slice(0)


            byLeftValue.sort(function(a, b) {
                return (a.left - b.left)

            })



            objectsInGroup = byLeftValue


            var minXobjectCenter = objectsInGroup[0].getCenterPoint().x

            var maxXobjectCenter = objectsInGroup[objectsInGroup.length - 1].getCenterPoint().x



            var viewportTransform = canvas.viewportTransform


            var sumOfObjectWidths = 0
 // without first and last object
            for (t = 1
 t < objectsInGroup.length - 1; t++) {
                sumOfObjectWidths += (objectsInGroup[t].getBoundingRect().width + objectsInGroup[t].strokeWidth) / viewportTransform[0]

            }


            //// width and point of objects first and last

            var firstObjectWidth = (objectsInGroup[0].getBoundingRect().width + objectsInGroup[0].strokeWidth) / viewportTransform[0]

            var lastObjectWidth = (objectsInGroup[objectsInGroup.length - 1].getBoundingRect().width + objectsInGroup[objectsInGroup.length - 1].strokeWidth) / viewportTransform[0]


            var minXObjectRight = objectsInGroup[0].getCenterPoint().x + (firstObjectWidth / 2)

            var maxXobjectLeft = objectsInGroup[objectsInGroup.length - 1].getCenterPoint().x - (lastObjectWidth / 2)


            var distance = maxXobjectLeft - minXObjectRight

            var objectgap = (distance - sumOfObjectWidths) / (objectsInGroup.length - 1)


            for (i = 1
 i < objectsInGroup.length - 1; i++) {
                var sumOfPreviousObjects = 0


                //get the sum of previous objects widths
                for (p = 1
 p < i; p++) {

                    sumOfPreviousObjects += (objectsInGroup[p].getBoundingRect().width + objectsInGroup[p].strokeWidth) / viewportTransform[0]

                }

                //current object width
                var currentObjectWidth = (objectsInGroup[i].getBoundingRect().width + objectsInGroup[i].strokeWidth) / viewportTransform[0]


                objectsInGroup[i].left = (objectsInGroup[0].getCenterPoint().x) + (firstObjectWidth / 2) + (i * objectgap) +
                (sumOfPreviousObjects) -
                (objectsInGroup[i].getCenterPoint().x - (objectsInGroup[i].left + currentObjectWidth / 2))

            }


            activeObject = this.createSelectionGroup(canvas, objectsInGroup)


            canvas.renderAll()

            canvas.calcOffset()


            canvas.fire('object:modified', {
                target: activeObject
            })

        }
    },

    onBtnYGapAlignClick: function(button, e, eOpts) {
        // Idea - Object boundary box width get as object width even if it is rotated. while rotating the object,
        // origin point (top , left) will be changed according to rotation angle


        var canvas = RolandKioskPrint.AppData.getCanvas()

        var activeObject = canvas.getActiveObject()


        if (activeObject && !activeObject.isLocked && activeObject.get('type') == 'activeSelection') {
            var objectsInGroup = activeObject.getObjects()

            canvas.discardActiveObject()



            var byLeftValue = objectsInGroup.slice(0)


            byLeftValue.sort(function(a, b) {
                return (a.top - b.top)

            })



            objectsInGroup = byLeftValue


            var minXobjectCenter = objectsInGroup[0].getCenterPoint().y

            var maxXobjectCenter = objectsInGroup[objectsInGroup.length - 1].getCenterPoint().y



            var viewportTransform = canvas.viewportTransform


            var sumOfObjectHeights = 0
 // without first and last object
            for (t = 1
 t < objectsInGroup.length - 1; t++) {
                sumOfObjectHeights += (objectsInGroup[t].getBoundingRect().height + objectsInGroup[t].strokeWidth) / viewportTransform[3]

            }


            //// width and point of objects first and last

            var firstObjectHeight = (objectsInGroup[0].getBoundingRect().height + objectsInGroup[0].strokeWidth) / viewportTransform[3]

            var lastObjectHeight = (objectsInGroup[objectsInGroup.length - 1].getBoundingRect().height + objectsInGroup[objectsInGroup.length - 1].strokeWidth) / viewportTransform[3]


            var minYObjectBottom = objectsInGroup[0].getCenterPoint().y + (firstObjectHeight / 2)

            var maxYObjectTop = objectsInGroup[objectsInGroup.length - 1].getCenterPoint().y - ( lastObjectHeight / 2)


            var distance = maxYObjectTop - minYObjectBottom

            var objectgap = (distance - sumOfObjectHeights) / (objectsInGroup.length - 1)


            for (i = 1
 i < objectsInGroup.length - 1; i++) {
                var sumOfPreviousObjects = 0


                //get the sum of previous objects widths
                for (p = 1
 p < i; p++) {
                    sumOfPreviousObjects += (objectsInGroup[p].getBoundingRect().height + objectsInGroup[p].strokeWidth) / viewportTransform[3]

                }

                //current object width
                var currentObjectWidth = (objectsInGroup[i].getBoundingRect().height + objectsInGroup[i].strokeWidth) / viewportTransform[3]


                objectsInGroup[i].top = (objectsInGroup[0].getCenterPoint().y) + (firstObjectHeight / 2) + (i * objectgap) +
                (sumOfPreviousObjects) -
                (objectsInGroup[i].getCenterPoint().y - (objectsInGroup[i].top + currentObjectWidth / 2))

            }


            activeObject = this.createSelectionGroup(canvas, objectsInGroup)


            canvas.renderAll()

            canvas.calcOffset()


            canvas.fire('object:modified', {
                target: activeObject
            })


        }
    }

})

