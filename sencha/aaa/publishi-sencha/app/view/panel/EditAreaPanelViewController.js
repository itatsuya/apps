/*
 * File: app/view/panel/EditAreaPanelViewController.js
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

Ext.define('RolandKioskPrint.view.panel.EditAreaPanelViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.editareapanel',

    listen: {
        controller: {
            productmodeldesignercontent: {
                designerClosed: 'onDesignerClosed'
            }
        }
    },

    getNewAreaBounds: function(areaType) {
        var canvasPanel = RolandKioskPrint.AppData.getCanvasPanel()

        var data = canvasPanel.getController().getProductMargins()


        var productWidth = data.widthMM - (data.leftMarginMM + data.rightMarginMM)

        var productHeight = data.heightMM - (data.topMarginMM + data.bottomMarginMM)


        var areaWidth,
            areaHeight,
            constants = RolandKioskPrint.app.constants


        if (areaType == constants.EDIT_AREA_FOIL || areaType == constants.EDIT_AREA_METAL) {
            areaWidth = areaHeight =
                (areaType == constants.EDIT_AREA_FOIL) ? constants.FOIL_PRINT_AREA_SIZE_DEFAULT
                                                       : constants.METAL_PRINT_AREA_SIZE_DEFAULT


            var factor = constants.EDIT_AREA_SIZE_FACTOR

            if (areaWidth > productWidth) {
                areaWidth = factor * productWidth

            }
            if (areaHeight > productHeight) {
                areaWidth = factor * productHeight

            }
        } else {
            var factor = constants.EDIT_AREA_SIZE_FACTOR

            areaWidth = factor * productWidth

            areaHeight = factor * productHeight

        }

        var areaSize = (areaWidth < areaHeight) ? areaWidth : areaHeight
 // Make it a square
        var bounds = {
            left: data.leftMarginMM + (productWidth - areaSize) / 2,
            top: data.topMarginMM + (productHeight - areaSize) / 2,
            width: areaSize,
            height: areaSize
        }


        return bounds

    },

    createEditArea: function(areaType, shapeType, setActive) {
        var canvasPanel = RolandKioskPrint.AppData.getCanvasPanel()

        if (!canvasPanel.getController().canAddObject()) {
            // Check if we have reached the maximum limit on number of objects.
            return

        }

        // Exit clip mode if active.
        canvasPanel.getController().endClipping()


        var canvas = RolandKioskPrint.AppData.getCanvas()


        var bounds = this.getNewAreaBounds(areaType)


        var strokeColor = this.getEditAreaStrokeColor(areaType)

        var strokeWidth = RolandKioskPrint.app.constants.EDIT_AREA_STROKE_WIDTH


        var isProductDesigner =
            (RolandKioskPrint.AppData.appMode == RolandKioskPrint.app.constants.APP_MODE_PRODUCT_DESIGNER)


        var sourceType = (
            isProductDesigner ? RolandKioskPrint.app.constants.OBJECT_SOURCE_PD
                              : RolandKioskPrint.app.constants.OBJECT_SOURCE_PMD
        )


        var printType = RolandKioskPrint.app.constants.PRINT_TYPE_COLOR

        if (areaType == RolandKioskPrint.app.constants.EDIT_AREA_FOIL) {
            printType = RolandKioskPrint.app.constants.PRINT_TYPE_FOIL

        } else if (areaType == RolandKioskPrint.app.constants.EDIT_AREA_METAL) {
            printType = RolandKioskPrint.app.constants.PRINT_TYPE_METAL

        } else if (areaType == RolandKioskPrint.app.constants.EDIT_AREA_CUT) {
            printType = RolandKioskPrint.app.constants.PRINT_TYPE_CUT

        }

        var editArea = canvasPanel.getController().getShapeObject(shapeType)

        editArea.set({
            'fill': false,
            'stroke': strokeColor,
            'strokeWidth': 0,
            'id': 'editarea-' + canvas.nextEditAreaId,
            'deviceStroke': true,
            'deviceStrokeWidth': strokeWidth,
            'perPixelTargetFind': true,
            'targetFindTolerance': RolandKioskPrint.app.constants.EDIT_AREA_HIT_TOLERANCE,
            'editAreaType': areaType, // Custom property
            'sourceType': sourceType,
            'objectCaching': false,
            'printType': printType
        })


        // Scale and position the object appropriately.
        var objBounds = editArea.getBoundingRect(true)

        var scaleX = bounds.width / objBounds.width


        if (scaleX != 1.0) {
            editArea.set({
                'scaleX': scaleX,
                'scaleY': scaleX
            })

        }

        var dy = (objBounds.height * scaleX) - bounds.height


        // Position the object.
        editArea.set({
            'left': bounds.left,
            'top': bounds.top - dy / 2
        })


        canvas.nextEditAreaId++


        canvas.add(editArea)

        editArea.setCoords()


        if (setActive) {
            canvas.setActiveObject(editArea)

        }

        canvas.calcOffset()

        canvas.renderAll()

    },

    initialize: function() {
        // Register for custom canvas ready and finish notifications, if
        // we haven't already. We do not un-register these.
        if (!this.onCanvasReady) {
            var canvas = RolandKioskPrint.AppData.getCanvas()

            var canvasPanel = RolandKioskPrint.AppData.getCanvasPanel()

            var me = this


            this.onCanvasReady = {
                'canvas:x-ready': function() {
                    // Add the default edit area when creating a new foil print template.
                    var productModelData = RolandKioskPrint.AppData.productModelData

                    var editAreas

                    if (productModelData.isFoilPrint()) {
                        editAreas = canvasPanel.getController().getEditAreasByType(RolandKioskPrint.app.constants.EDIT_AREA_FOIL)

                        if (editAreas.length === 0) {
                            me.createEditArea(RolandKioskPrint.app.constants.EDIT_AREA_FOIL,
                                              RolandKioskPrint.app.constants.SHAPE_TYPE_RECTANGLE)

                        }
                    }
                    if (productModelData.isMetalPrint()){
                        editAreas = canvasPanel.getController().getEditAreasByType(RolandKioskPrint.app.constants.EDIT_AREA_METAL)

                        if (editAreas.length === 0) {
                            me.createEditArea(RolandKioskPrint.app.constants.EDIT_AREA_METAL,
                                              RolandKioskPrint.app.constants.SHAPE_TYPE_RECTANGLE)

                        }
                    }
                }
            }

            canvas.on(this.onCanvasReady)

        }
    },

    getEditAreaStrokeColor: function(areaType) {
        var strokeColor

        if (areaType == RolandKioskPrint.app.constants.EDIT_AREA_IMAGE) {
            strokeColor = RolandKioskPrint.app.constants.IMAGE_AREA_STROKE_COLOR

        } else if (areaType == RolandKioskPrint.app.constants.EDIT_AREA_TEXT) {
            strokeColor = RolandKioskPrint.app.constants.TEXT_AREA_STROKE_COLOR

        } else if (areaType == RolandKioskPrint.app.constants.EDIT_AREA_FOIL) {
            strokeColor = RolandKioskPrint.app.constants.FOIL_AREA_STROKE_COLOR

        } else if (areaType == RolandKioskPrint.app.constants.EDIT_AREA_METAL) {
            strokeColor = RolandKioskPrint.app.constants.METAL_AREA_STROKE_COLOR

        } else if (areaType == RolandKioskPrint.app.constants.EDIT_AREA_CUT) {
            strokeColor = RolandKioskPrint.app.constants.CUT_AREA_STROKE_COLOR

        } else {
            // areaType == RolandKioskPrint.app.constants.EDIT_AREA_FREE
            strokeColor = RolandKioskPrint.app.constants.FREE_AREA_STROKE_COLOR

        }

        return strokeColor

    },

    onDesignerClosed: function() {
        // Ensure that the edit area dropdown resets its selection.
        var cboEditAreaTypes = this.getView().down('#cboEditAreaTypes')

        var store = cboEditAreaTypes.getStore()


        store.filtered = false

    },

    onCboEditAreaTypesChange: function(field, newValue, oldValue, eOpts) {
        var strokeColor = this.getEditAreaStrokeColor(newValue)


        var iconCls,
            labelText,
            me = this


        function setStore(store) {
            var shapeView = me.getView().down('#shapeView')

            if (shapeView.getStore() != store) {
                shapeView.setStore(store)

            }
        }

        setStore(this.shapesStore)


        if (newValue == RolandKioskPrint.app.constants.EDIT_AREA_IMAGE) {
            iconCls = 'icomoon2 icon-image-area'

            labelText = RolandKioskPrint.app.getString('label.designer.imageAreaLabel')

        } else if (newValue == RolandKioskPrint.app.constants.EDIT_AREA_TEXT) {
            iconCls = 'icomoon2 icon-text-area'

            labelText = RolandKioskPrint.app.getString('label.designer.textAreaLabel')

        } else if (newValue == RolandKioskPrint.app.constants.EDIT_AREA_FOIL) {
            iconCls = 'icomoon3 icon-foil-area'

            labelText = RolandKioskPrint.app.getString('label.designer.foilAreaLabel')

        } else if (newValue == RolandKioskPrint.app.constants.EDIT_AREA_METAL) {
            iconCls = 'icomoon6 icon-metal-area'

            labelText = RolandKioskPrint.app.getString('label.designer.metalAreaLabel')

        } else if (newValue == RolandKioskPrint.app.constants.EDIT_AREA_CUT) {
            setStore(this.shapeRectStore)

            iconCls = 'icomoon7 icon-cut-area'

            labelText = RolandKioskPrint.app.getString('label.designer.cutAreaLabel')

        } else {
            iconCls = 'icomoon2 icon-free-area'

            labelText = RolandKioskPrint.app.getString('label.designer.freeAreaLabel')

        }

        var lblEditArea = this.getView().down('#lblEditArea')

        var lblEditAreaIcon = this.getView().down('#lblEditAreaIcon')


        lblEditAreaIcon.removeCls([
        'icon-image-area',
        'icon-free-area',
        'icon-text-area',
        'icon-foil-area',
        'icon-metal-area',
        'icomoon2',
        'icomoon3',
        'icomoon6',
        'icomoon7'
        ])


        lblEditAreaIcon.addCls(iconCls)

        lblEditArea.setText(labelText)


        Ext.util.CSS.updateRule('.edit-area-type-icon', 'color', strokeColor)

        Ext.util.CSS.updateRule('.edit-area-shape-type-icon', 'color', strokeColor)

    },

    onPanelBeforeShow: function(component, eOpts) {
        var printType = RolandKioskPrint.AppData.getActivePrintType()


        var cboEditAreaTypes = this.getView().down('#cboEditAreaTypes')

        var store = cboEditAreaTypes.getStore()


        if (!store.filtered || store.printType != printType) {
            store.filtered = true

            store.printType = printType


            store.filterBy(function(record) {
                return (record.get('printType') == this.printType)

            })


            // Select the first record.
            var editAreaTypeData = store.getData()

            if (editAreaTypeData.length > 0) {
                cboEditAreaTypes.setValue(editAreaTypeData.getAt(0).data.editAreaType)

            }
        }
    },

    onShapeViewItemClick: function(dataview, record, item, index, e, eOpts) {
        var cboEditAreaTypes = this.getView().down('#cboEditAreaTypes')

        this.createEditArea(cboEditAreaTypes.getValue(), record.data.shapeType, true)

    },

    onPanelAfterRender: function(component, eOpts) {
        // Populate the edit area type dropdown.
        var editAreaTypeData = [
        [
        RolandKioskPrint.app.constants.EDIT_AREA_IMAGE,
        RolandKioskPrint.app.getString('label.designer.imageAreaLabel'),
        RolandKioskPrint.app.constants.PRINT_TYPE_COLOR
        ],
        [
        RolandKioskPrint.app.constants.EDIT_AREA_TEXT,
        RolandKioskPrint.app.getString('label.designer.textAreaLabel'),
        RolandKioskPrint.app.constants.PRINT_TYPE_COLOR
        ],
        [
        RolandKioskPrint.app.constants.EDIT_AREA_FREE,
        RolandKioskPrint.app.getString('label.designer.freeAreaLabel'),
        RolandKioskPrint.app.constants.PRINT_TYPE_COLOR
        ],
        [
        RolandKioskPrint.app.constants.EDIT_AREA_CUT,
        RolandKioskPrint.app.getString('label.designer.cutAreaLabel'),
        RolandKioskPrint.app.constants.PRINT_TYPE_CUT
        ],
        [
        RolandKioskPrint.app.constants.EDIT_AREA_FOIL,
        RolandKioskPrint.app.getString('label.designer.foilAreaLabel'),
        RolandKioskPrint.app.constants.PRINT_TYPE_FOIL
        ],
        [
        RolandKioskPrint.app.constants.EDIT_AREA_METAL,
        RolandKioskPrint.app.getString('label.designer.metalAreaLabel'),
        RolandKioskPrint.app.constants.PRINT_TYPE_METAL
        ]
        ]


        var store = Ext.create('Ext.data.ArrayStore', {
            // store configs
            storeId: 'editAreaTypes',
            // reader configs
            fields: [
            'editAreaType',
            'editAreaLabel',
            'printType'
            ],
            data: editAreaTypeData
        })


        var cboEditAreaTypes = this.getView().down('#cboEditAreaTypes')

        cboEditAreaTypes.setStore(store)


        this.shapesStore = this.getView().down('#shapeView').getStore()

        this.shapeRectStore = Ext.create('Ext.data.ArrayStore', {
            // store configs
            storeId: 'ShapeRect',
            // reader configs
            fields: [
            'shapeType',
            'iconClass'
            ],
            data: [
            [1, 'icomoon4 icon-rectangle']
            ]
        })

    }

})

