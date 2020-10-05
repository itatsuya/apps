/*
 * File: app/controller/ApplicationData.js
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

Ext.define('RolandKioskPrint.controller.ApplicationData', {
    extend: 'Ext.Base',

    alternateClassName: [
        'RolandKioskPrint.AppData'
    ],
    singleton: true,

    modelLayoutDesignerMode: 0,
    modelLayoutData: null,
    productModelDesignerMode: 0,
    productModelData: null,
    appMode: 0,
    activeCanvas: null,
    activeCanvasPanel: null,
    undoRedoPanel: null,
    helpWindow: null,
    uiSettingsData: null,
    catalogUISettingsData: null,
    toolsPanel: null,
    features: null,
    miscPanel: null,
    designerView: null,
    cropMode: false,
    activePrintType: 'color',
    defaultColor: null,
    defaultFoilColor: null,
    smartGuide: null,

    setActiveCanvas: function(canvas) {
        this.activeCanvas = canvas

    },

    getCanvas: function() {
        return this.activeCanvas

    },

    setActiveCanvasPanel: function(panel) {
        this.activeCanvasPanel = panel

    },

    getCanvasPanel: function() {
        return this.activeCanvasPanel

    },

    setDesignerView: function(designer) {
        this.designerView = designer

    },

    getDesignerView: function() {
        return this.designerView

    },

    setToolsPanel: function(panel) {
        this.toolsPanel = panel

    },

    getToolsPanel: function() {
        return this.toolsPanel

    },

    setUndoRedoPanel: function(panel) {
        this.undoRedoPanel = panel

    },

    getUndoRedoPanel: function() {
        return this.undoRedoPanel

    },

    setMiscPanel: function(panel) {
        this.miscPanel = panel

    },

    getMiscPanel: function() {
        return this.miscPanel

    },

    getHelpWindow: function() {
        return this.helpWindow

    },

    setHelpWindow: function(helpWindow) {
        this.helpWindow = helpWindow

    },

    getDefaultFoilColor: function() {
        return {
            name: this.defaultFoilColor.colorName,
            value: this.defaultFoilColor.colorValue
        }

    },

    setDefaultFoilColor: function(color) {
        this.defaultFoilColor = color

    },

    setCurrentFoilColor: function(foilColor) {
        this.toolsPanel.getController().setFoilColorData({
            'foilColorName': foilColor.name,
            'foilColorValue': foilColor.value
        })

    },

    getCurrentFoilColor: function() {
        var foilColorData = this.toolsPanel.getController().getFoilColorData()

        return {
            name: foilColorData.foilColorName,
            value: foilColorData.foilColorValue
        }

    },

    setVarnishSettings: function(varnishSettings) {
        this.toolsPanel.getController().setColorData({
            'varnishSettings': varnishSettings
        })

    },

    getVarnishSettings: function() {
        var colorData = this.toolsPanel.getController().getColorData()

        return {
            varnishSettings: colorData.varnishSettings
        }

    },

    getURLWithNonce: function(url) {
        var charSpace = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

        var nonce = ''


        for (var i = 0
 i < 5; i++)
            nonce += charSpace.charAt(Math.floor(Math.random() * charSpace.length))


        return url + '?' + nonce

    },

    getUiSettingsData: function() {
        return this.uiSettingsData

    },

    getCatalogUISettingsData: function() {
        return this.catalogUISettingsData

    },

    getFeatures: function() {
        return this.features

    },

    isDongleValid: function() {
        var deferred = new Ext.Deferred()


        Ext.Ajax.request({
            scope: this,
            method: 'GET',
            url: RolandKioskPrint.app.constants.VERIFY_DONGLE_URL,
            success: function(response, opts) {
                var responseData = Ext.decode(response.responseText)


                if (responseData && responseData.result) {
                    deferred.resolve()

                } else {
                    deferred.reject(false)

                }
            },
            failure: function() {
                deferred.reject(true)
 // Connection error
            }
        })


        return deferred.promise

    },

    formatNumber: function(number) {
        if (typeof number != 'number') {
            return number

        }

        var uiSettings = this.getUiSettingsData() || {}

        var decimalPrecision = uiSettings.decimalPrecision


        if (decimalPrecision === 0) {
            return number.toFixed(0)

        } else if (decimalPrecision === undefined) {
            decimalPrecision = 2

        }

        var decimalSeparator = uiSettings.decimalSeparator || '.'

        return number.toFixed(decimalPrecision).toString().replace('.', decimalSeparator)

    },

    isProductDesigner: function() {
        return (this.appMode == RolandKioskPrint.app.constants.APP_MODE_PRODUCT_DESIGNER)

    },

    isProductModelDesigner: function() {
        return (this.appMode == RolandKioskPrint.app.constants.APP_MODE_PRODUCT_MODEL_DESIGNER)

    },

    setSmartGuide: function(value) {
        this.smartGuide = value

    },

    getSmartGuide: function() {
        return this.smartGuide

    },

    isCJK: function(lang) {
        if (lang == 'zh-CN' || lang == 'zh-TW' || lang == 'ja' || lang == 'ko')
            return true

        else
            return false

    },

    setCropMode: function(mode) {
        this.cropMode = mode

    },

    getActivePrintType: function() {
        return this.activePrintType

    },

    setActivePrintType: function(printType) {
        this.activePrintType = printType

    },

    isImprintArea: function(object) {
        return (object.type == 'foil-imprint-area' || object.type == 'metal-imprint-area')

    },

    isActivePrintTypeFoilOrMetal: function() {
        return (this.activePrintType == RolandKioskPrint.app.constants.PRINT_TYPE_FOIL ||
                this.activePrintType == RolandKioskPrint.app.constants.PRINT_TYPE_METAL)

    },

    getCropMode: function() {
        return this.cropMode

    },

    isActivePrintTypeColor: function() {
        return (this.activePrintType == RolandKioskPrint.app.constants.PRINT_TYPE_COLOR)

    },

    isActivePrintTypeFoil: function() {
        return (this.activePrintType == RolandKioskPrint.app.constants.PRINT_TYPE_FOIL)

    },

    isActivePrintTypeMetal: function() {
        return (this.activePrintType == RolandKioskPrint.app.constants.PRINT_TYPE_METAL)

    },

    isActivePrintTypeCut: function() {
        return (this.activePrintType == RolandKioskPrint.app.constants.PRINT_TYPE_CUT)

    },

    getDefaultColor: function() {
        return this.defaultColor

    },

    setDefaultColor: function(color) {
        this.defaultColor = color

    }

})
