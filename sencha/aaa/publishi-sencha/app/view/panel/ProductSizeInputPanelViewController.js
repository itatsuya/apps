/*
 * File: app/view/panel/ProductSizeInputPanelViewController.js
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

Ext.define('RolandKioskPrint.view.panel.ProductSizeInputPanelViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.productsizeinputpanel',

    initialize: function(productSizeData) {
        // Store the data off our view model for data bindings to work.
        this.getViewModel().setData(productSizeData)


        // Set the minimum and maximum limits for various product size fields.
        this.setSizeLimits(productSizeData.units)


        // Clear and initialize the input fields.
        this.initInputs()

    },

    setFocus: function() {
        // Give focus to the first widget.
        var txtHeight = this.getView().down('#txtHeight')

        txtHeight.focus()

        txtHeight.selectText()

    },

    validateUserInput: function() {
        // No input validation required for custom size.
        var data = this.getViewModel().getData()

        if (data.customSize) {
            return true

        }

        // Validate in the order these controls appear in the UI.
        var inputItemIds = this.getInputItemIds()


        var invalidItem
 // undefined
        var view = this.getView()


        for (var i = 0
 i < inputItemIds.length; i++) {
            var inputItem = view.down('#' + inputItemIds[i])

            if (!inputItem.isValid()) {
                invalidItem = inputItem

                break

            }
        }

        if (!invalidItem) {
            // Validate if the margin values are too large.
            if (data.topMarginMM + data.bottomMarginMM > data.heightMM) {
                var txtTopMargin = view.down('#txtTopMargin')

                txtTopMargin.markInvalid(RolandKioskPrint.app.getString('message.pmd_mld.marginsTooTall'))


                var txtBottomMargin = view.down('#txtBottomMargin')

                txtBottomMargin.markInvalid(RolandKioskPrint.app.getString('message.pmd_mld.marginsTooTall'))


                invalidItem = txtTopMargin

            } else if (data.leftMarginMM + data.rightMarginMM > data.widthMM) {
                var txtLeftMargin = view.down('#txtLeftMargin')

                txtLeftMargin.markInvalid(RolandKioskPrint.app.getString('message.pmd_mld.marginsTooWide'))


                var txtRightMargin = view.down('#txtRightMargin')

                txtRightMargin.markInvalid(RolandKioskPrint.app.getString('message.pmd_mld.marginsTooWide'))


                invalidItem = txtLeftMargin

            }
        }

        if (!invalidItem) {
            var viewModel = this.getViewModel(),
                printType = data.printType


            var metalPrint =
                viewModel.isPrintType(printType, RolandKioskPrint.app.constants.PRINT_TYPE_METAL)

            var cutPrint =
                viewModel.isPrintType(printType, RolandKioskPrint.app.constants.PRINT_TYPE_CUT)


            if (metalPrint) {
                // For metal print, validate that a material has been selected.
                var cboMaterials = view.down('#cboMaterials')

                if (!cboMaterials.getSelectedRecord()) {
                    cboMaterials.markInvalid('')

                    invalidItem = cboMaterials

                }
            }

            if (!invalidItem && cutPrint) {
                // For cut print, validate that a cut material and material color has been selected.
                var cboCutMaterials = view.down('#cboCutMaterials')

                if (!cboCutMaterials.getSelectedRecord()) {
                    cboCutMaterials.markInvalid('')

                    invalidItem = cboCutMaterials

                }

                if (!invalidItem) {
                    var cboCutMaterialColors = view.down('#cboCutMaterialColors')

                    if (!cboCutMaterialColors.getSelectedRecord()) {
                        cboCutMaterialColors.markInvalid('')

                        invalidItem = cboCutMaterialColors

                    }
                }
            }
        }

        if (!invalidItem) {
            return true

        }

        invalidItem.focus()

        return false

    },

    getProductSizeData: function() {
        var selectedRecord = this.getView().down('#cboCutMaterialColors').getSelectedRecord()


        if (selectedRecord) {
            this.getViewModel().setData({
                cutMaterialColor: selectedRecord.data.colorValue
            })

        }

        return this.getViewModel().getData()

    },

    setSizeLimits: function(units) {
        var txtHeight = this.getView().down('#txtHeight')

        this.setSizeMin(txtHeight, units, RolandKioskPrint.app.constants.PRODUCT_HEIGHT_MIN)

        this.setSizeMax(txtHeight, units, RolandKioskPrint.app.constants.PRODUCT_HEIGHT_MAX)


        var txtWidth = this.getView().down('#txtWidth')

        this.setSizeMin(txtWidth, units, RolandKioskPrint.app.constants.PRODUCT_WIDTH_MIN)

        this.setSizeMax(txtWidth, units, RolandKioskPrint.app.constants.PRODUCT_WIDTH_MAX)


        var txtTopMargin = this.getView().down('#txtTopMargin')

        this.setSizeMin(txtTopMargin, units, RolandKioskPrint.app.constants.PRODUCT_MARGIN_MIN)


        var txtBottomMargin = this.getView().down('#txtBottomMargin')

        this.setSizeMin(txtBottomMargin, units, RolandKioskPrint.app.constants.PRODUCT_MARGIN_MIN)


        var txtLeftMargin = this.getView().down('#txtLeftMargin')

        this.setSizeMin(txtLeftMargin, units, RolandKioskPrint.app.constants.PRODUCT_MARGIN_MIN)


        var txtRightMargin = this.getView().down('#txtRightMargin')

        this.setSizeMin(txtRightMargin, units, RolandKioskPrint.app.constants.PRODUCT_MARGIN_MIN)


        var txtCornerRadius = this.getView().down('#txtCornerRadius')

        this.setSizeMin(txtCornerRadius, units, RolandKioskPrint.app.constants.PRODUCT_CORNER_RADIUS_MIN)


        var txtOffsetX = this.getView().down('#txtOffsetX')

        this.setSizeMin(txtOffsetX, units, RolandKioskPrint.app.constants.PRODUCT_OFFSET_MIN)

        this.setSizeMax(txtOffsetX, units, RolandKioskPrint.app.constants.PRODUCT_OFFSET_MAX)


        var txtOffsetY = this.getView().down('#txtOffsetY')

        this.setSizeMin(txtOffsetY, units, RolandKioskPrint.app.constants.PRODUCT_OFFSET_MIN)

        this.setSizeMax(txtOffsetY, units, RolandKioskPrint.app.constants.PRODUCT_OFFSET_MAX)

    },

    setSizeMin: function(txtfield, units, valueMM) {
        if (units == 'mm') {
            txtfield.minValue = valueMM

        } else {
            var value = this.getViewModel().convertMMToUnit(units, valueMM)

            txtfield.minValue = parseFloat(value.toFixed(4))

        }
    },

    setSizeMax: function(txtfield, units, valueMM) {
        if (units == 'mm') {
            txtfield.maxValue = valueMM

        } else {
            var value = this.getViewModel().convertMMToUnit(units, valueMM)

            txtfield.maxValue = parseFloat(value.toFixed(4))

        }
    },

    initInputs: function() {
        // Clear and initialize all input fields.
        var inputItemIds = this.getInputItemIds(true)

        var inputItemValues = this.getInputItemValues(true)


        var viewModel = this.getViewModel()

        var units = viewModel.get('units')


        for (var i = 0
 i < inputItemIds.length; i++) {
            var inputItem = this.getView().down('#' + inputItemIds[i])

            inputItem.reset()


            var itemValue = viewModel.get(inputItemValues[i])

            if (itemValue !== null) {
                itemValue = viewModel.convertMMToUnit(units, itemValue)

            }
            inputItem.setValue(itemValue)

        }
    },

    validateInputs: function() {
        // Validate all input fields.
        var inputItemIds = this.getInputItemIds(true)


        for (var i = 0
 i < inputItemIds.length; i++) {
            var inputItem = this.getView().down('#' + inputItemIds[i])

            inputItem.validate()

        }
    },

    getInputItemIds: function(getAll) {
        var inputItemIds = [
            'txtHeight',
            'txtWidth',
            'txtTopMargin',
            'txtBottomMargin',
            'txtLeftMargin',
            'txtRightMargin',
            'txtCornerRadius'
        ]


        var data = this.getViewModel().getData()


        var isFoilOrMetalPrint =
            (data.printType == RolandKioskPrint.app.constants.PRINT_TYPE_FOIL ||
             data.printType == RolandKioskPrint.app.constants.PRINT_TYPE_METAL)


        if (getAll || isFoilOrMetalPrint) {
            inputItemIds.push('txtOffsetX')

            inputItemIds.push('txtOffsetY')

        }
        return inputItemIds

    },

    getInputItemValues: function(getAll) {
        var inputItemValues = [
            'heightMM',
            'widthMM',
            'topMarginMM',
            'bottomMarginMM',
            'leftMarginMM',
            'rightMarginMM',
            'cornerRadiusMM'
        ]


        var data = this.getViewModel().getData()


        var isFoilOrMetalPrint =
            (data.printType == RolandKioskPrint.app.constants.PRINT_TYPE_FOIL ||
             data.printType == RolandKioskPrint.app.constants.PRINT_TYPE_METAL)


        if (getAll || isFoilOrMetalPrint) {
            inputItemValues.push('xOffsetMM')

            inputItemValues.push('yOffsetMM')

        }
        return inputItemValues

    },

    fillZeroValueFields: function() {
        var inputItemIds = this.getInputItemIds(true)

        var inputItemValues = this.getInputItemValues(true)


        var viewModel = this.getViewModel()


        for (var i = 0
 i < inputItemIds.length; i++) {
            var itemValue = viewModel.get(inputItemValues[i])

            if (itemValue === 0) {
                var inputItem = this.getView().down('#' + inputItemIds[i])

                inputItem.setValue(itemValue)

            }
        }
    },

    onDetailFoilPropertiesButtonToggle: function(button, pressed, eOpts) {
        this.getView().down('#pnlDetailFoilProperties').setVisible(pressed)

    },

    onCboMaterialsChange: function(field, newValue, oldValue, eOpts) {
        var selectedRecord = field.getSelectedRecord()


        if (selectedRecord) {
            var material = selectedRecord.data


            this.getViewModel().setData({
                materialColor: material.materialColor
            })

        }
    },

    onDetailMetalPropertiesButtonToggle: function(button, pressed, eOpts) {
        this.getView().down('#pnlDetailMetalProperties').setVisible(pressed)

    },

    onCboCutMaterialsChange: function(field, newValue, oldValue, eOpts) {
        var selectedRecord = field.getSelectedRecord()


        if (selectedRecord) {
            var material = selectedRecord.data


            // Populate the colors combobox with the material colors.
            var cboCutMaterialColors = this.getView().down('#cboCutMaterialColors'),
                store = cboCutMaterialColors.getStore()


            store.setData(material.materialColors)


            // Now update the selected color.
            var colorName = this.getViewModel().get('cutMaterialColorName'),
                matchedColor = colorName && RolandKioskPrint.app.getIgnoreCase(store, 'colorName', colorName)


            if (!matchedColor) {
                if (colorName) {
                    colorName = store.getAt(0).data.colorName
 // Pick the first available color
                }
            }

            if (colorName) {
                cboCutMaterialColors.setValue(colorName)

            } else {
                cboCutMaterialColors.reset()

            }
        }
    },

    onUnitsRadiogroupChange: function(field, newValue, oldValue, eOpts) {
        this.setSizeLimits(newValue)
 // Update the limits as per the selected unts.

        // Fill in the zero value fields.
        this.fillZeroValueFields()


        // Validate as limits changed.
        // Do validation in deferred mode, giving view model a chance to update itself.
        var me = this

        setTimeout(function() {
            me.validateInputs()

        }, 10)

    },

    onPanelAfterRender: function(component, eOpts) {
        // Show/hide print type options as per the functions allowed.
        var features = RolandKioskPrint.AppData.getFeatures()


        if (features.allowFoilPrint) {
            var optFoilPrint = this.getView().down('#optFoilPrint')

            optFoilPrint.show()

        }

        if (features.allowMetalPrint) {
            var optMetalPrint = this.getView().down('#optMetalPrint')

            optMetalPrint.show()

        }

        if (features.allowCutPrint) {
            var optCutPrint = this.getView().down('#optCutPrint')

            optCutPrint.show()

        }

        var markingModeData = [
        [RolandKioskPrint.app.getString('label.pmd_mld_pd.markingModeText'), RolandKioskPrint.app.constants.MARKING_MODE_TEXT],
        [RolandKioskPrint.app.getString('label.pmd_mld_pd.markingModePhoto'), RolandKioskPrint.app.constants.MARKING_MODE_PHOTO],
        [RolandKioskPrint.app.getString('label.pmd_mld_pd.markingModeHiDensity'), RolandKioskPrint.app.constants.MARKING_MODE_HI_DENSITY],
        [RolandKioskPrint.app.getString('label.pmd_mld_pd.markingModeAuto'), RolandKioskPrint.app.constants.MARKING_MODE_AUTO]
        ]


        var markingModeStore = Ext.create('Ext.data.ArrayStore', {
            // store configs
            storeId: 'MarkingModes',
            // reader configs
            fields: [
            {
                type: 'string',
                name: 'name'
            },
            {
                type: 'string',
                name: 'type'
            }
            ],
            data: markingModeData
        })


        var cboMarkingMode = this.getView().down('#cboMarkingMode')

        cboMarkingMode.setStore(markingModeStore)


        var cutMaterialColorStore = Ext.create('Ext.data.ArrayStore', {
            // store configs
            storeId: 'MaterialColors',
            // reader configs
            fields: [
            {
                type: 'string',
                name: 'colorName'
            },
            {
                type: 'string',
                name: 'colorValue'
            }
            ],
            data: []
        })


        var cboCutMaterialColors = this.getView().down('#cboCutMaterialColors')

        cboCutMaterialColors.setStore(cutMaterialColorStore)

    }

})

