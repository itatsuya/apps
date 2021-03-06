/*
 * File: app/view/panel/ImagePanelViewController.js
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

Ext.define('RolandKioskPrint.view.panel.ImagePanelViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.panel.imagepanel',

    listen: {
        controller: {
            '*': {
                qrCodeDisplayClosed: 'onQRCodeDisplayClosed'
            },
            orderconfirmation: {
                orderConfirmationClosed: 'onOrderConfirmationClosed'
            },
            designer: {
                designerClosed: 'onDesignerClosed'
            },
            productdesignerimageadjust: {
                imageAdjustPanelClosed: 'onImageAdjustPanelClosed'
            },
            productmodeldesignerimageadjust: {
                imageAdjustPanelClosed: 'onImageAdjustPanelClosed'
            },
            productdesignerimageoutline: {
                outlinePanelClosed: 'onImageOutlinePanelClosed'
            },
            productmodeldesignerimageoutline: {
                outlinePanelClosed: 'onImageOutlinePanelClosed'
            },
            'panel.backgroundpanel': {
                backgroundColorChanged: 'onBackgroundColorChanged'
            }
        }
    },

    onQRCodeDisplayClosed: function() {
        // The user possibly uploaded images from his/her device.
        // Refresh the image list from server.
        this.refreshUserImageList()

    },

    refreshUserImageList: function() {
        var imgView = this.getView().down('#imgView')


        var productModel = RolandKioskPrint.AppData.productModelData

        var printType = RolandKioskPrint.AppData.getActivePrintType()


        // Get the list of user uploaded images.
        var promise

        var isProductModelDesigner = RolandKioskPrint.AppData.appMode == RolandKioskPrint.app.constants.APP_MODE_PRODUCT_MODEL_DESIGNER

        if (isProductModelDesigner) {
            promise = RolandKioskPrint.app.fetchProductModelImages(printType)

        } else {
            promise = RolandKioskPrint.app.fetchUserImages(printType)

        }

        var me = this

        imgView.mask(RolandKioskPrint.app.getString('message.designer.refreshingImageList'))


        promise.then(function(response) {
            var userImageList = Ext.decode(response.responseText)

            imgView.unmask()

            if (userImageList.images && userImageList.images.length > 0) {
                imgView.store.setData(userImageList.images)
 // Add the user images first
            } else {
                imgView.store.setData([{
                    fileName: '',
                    filePath: '',
                    thumbPath: ''
                }])
 // Set dummy data
            }

            imgView.refresh()

        }, function() {
            imgView.unmask()

            Ext.toast(RolandKioskPrint.app.getString('message.designer.userImageRefreshFailed'))

        })

    },

    refreshImageView: function() {
        var imgView = this.getView().down('#imgView')

        imgView.refresh()

    },

    getImageTargetAreas: function(isProductDesigner) {
        var targetAreas = []

        var canvas = RolandKioskPrint.AppData.getCanvas()


        // Check if an edit area is explicity targeted by selection.
        var selectedObjects = canvas.getActiveObjects()


        targetAreas = selectedObjects.filter(function(object) {
            var editAreaType = object.editAreaType

            return (
                editAreaType == RolandKioskPrint.app.constants.EDIT_AREA_IMAGE ||
                editAreaType == RolandKioskPrint.app.constants.EDIT_AREA_FREE ||
                editAreaType == RolandKioskPrint.app.constants.EDIT_AREA_FOIL ||
                editAreaType == RolandKioskPrint.app.constants.EDIT_AREA_METAL
            )

        })


        if (targetAreas.length !== 0) {
            var canvasPanel = RolandKioskPrint.AppData.getCanvasPanel()

            canvasPanel.getController().sortObjects(targetAreas)
 // Arrange left top first.
            return targetAreas

        }

        if (isProductDesigner) {
            // For product designer, we otherwise return a list of all image and free areas.
            // Image areas and free areas are sorted left-top first. See CanvasPanel loadProductDesignJSON.
            targetAreas = canvas.imageAreaList.concat(
                canvas.freeAreaList,
                canvas.foilAreaList,
                canvas.metalAreaList
            )

        }

        return targetAreas

    },

    populateImageCategories: function(categories) {
        var cboImgCategories = this.getView().down('#cboImgCategories')

        var store = cboImgCategories.getStore()

        store.setData(categories)


        if (categories.length > 0) {
            cboImgCategories.setValue(categories[0].categoryName)

        }
    },

    deleteUserImages: function() {
        //Delete user images silently
        Ext.Ajax.request({
            scope: this,
            method: 'DELETE',
            url: RolandKioskPrint.app.constants.END_USER_IMAGE_DELETE_URL,
            success: function(response, opts) {
                var responseData = Ext.decode(response.responseText)

                if (!responseData || !responseData.success) {
                    //Do nothing
                }
            },
            failure: function() {
                //Do nothing
            }
        })

    },

    onOrderConfirmationClosed: function() {
        this.deleteUserImages()

    },

    onDesignerClosed: function() {
        this.deleteUserImages()

    },

    initialize: function() {
        // Set the combo to the "Original" category.
        var cboImgCategories = this.getView().down('#cboImgCategories')

        cboImgCategories.setValue(RolandKioskPrint.app.getString('label.designer.userImageCategoryName'))

    },

    moveImageToUserCategory: function(record) {
        var cboImgCategories = this.getView().down('#cboImgCategories')


        var serverURL = RolandKioskPrint.app.constants.END_USER_TRANSFER_IMAGE_URL

        if (RolandKioskPrint.AppData.appMode == RolandKioskPrint.app.constants.APP_MODE_PRODUCT_MODEL_DESIGNER) {
            serverURL = RolandKioskPrint.app.constants.PRODUCT_MODEL_TRANSFER_IMAGE_URL

        }
        var appData = RolandKioskPrint.AppData


        var filters = []


        if (appData.isActivePrintTypeFoil()) {
            // Apply image binarization filter.
            filters.push({
                name: 'blackwhite'
            })

        } else if (appData.isActivePrintTypeMetal()) {
            // Apply grayscale filter.
            filters.push({
                name: 'grayscale'
            })

        }

        serverURL += '&print-type=' + appData.getActivePrintType()


        var data = {
            filePath: record.data.filePath,
            filters: JSON.stringify(filters)
        }


        this.getView().getEl().mask(RolandKioskPrint.app.getString('message.designer.addingImage'))


        Ext.Ajax.request({
            scope: this,
            method: 'POST',
            url: serverURL,
            jsonData: data,
            success: function(response, opts) {
                this.getView().getEl().unmask()


                var imageData = Ext.decode(response.responseText)

                if (!imageData) {
                    return

                }

                if (imageData.success) {
                    var promise = this.addImageToCanvas(imageData)

                    promise.then(function() {
                        cboImgCategories.setValue(RolandKioskPrint.app.getString('label.designer.userImageCategoryName'))

                    })

                } else if (imageData.uploadStatus == 3) {
                    Ext.Msg.alert(RolandKioskPrint.app.getString('message.generic.failed'),
                                  RolandKioskPrint.app.getString('message.designer.addingImageFailed') + ' ' +
                                  RolandKioskPrint.app.getString('message.designer.numImagesExceeds'))

                } else {
                    Ext.Msg.alert(RolandKioskPrint.app.getString('message.generic.failed'),
                                 RolandKioskPrint.app.getString('message.designer.addingImageFailed'))

                }
            },
            failure: function() {
                this.getView().getEl().unmask()

                Ext.Msg.alert(RolandKioskPrint.app.getString('message.generic.failed'),
                              RolandKioskPrint.app.getString('message.designer.addingImageFailed'))

            }
        })

    },

    addImageToCanvas: function(imageData) {
        var canvas = RolandKioskPrint.AppData.getCanvas()


        // In product designer, images can be added only to image or free edit areas.
        var isProductDesigner =
            (RolandKioskPrint.AppData.appMode == RolandKioskPrint.app.constants.APP_MODE_PRODUCT_DESIGNER)


        var editArea

        var targetAreas = this.getImageTargetAreas(isProductDesigner)

        if (targetAreas.length !== 0) {
            // For product model designer, this picks the selected edit area.
            // For product designer, this would pick up the selected or first available area.
            editArea = targetAreas[0]

        }

        var deferred = new Ext.Deferred()


        if (isProductDesigner && !editArea && canvas.textAreaList.length !== 0) {
            // If product designer, and we only have text areas, we can't place images.
            deferred.reject()

            return deferred.promise

        }

        var activeObjects = canvas.getActiveObjects(),
            objectToReplace


        if (isProductDesigner && activeObjects.length == 1 && this.isReplaceableObject(activeObjects[0])) {
            objectToReplace = activeObjects[0]

        }

        var canvasPanel = RolandKioskPrint.AppData.getCanvasPanel()

        if (!objectToReplace && !canvasPanel.getController().canAddObject()) {
            // Check if we have reached the maximum limit on number of objects.
            deferred.reject()

            return deferred.promise

        }

        // Exit clip mode if active.
        canvasPanel.getController().endClipping()


        var imagePath = RolandKioskPrint.AppData.getURLWithNonce(imageData.thumbPath)


        fabric.Image.fromURL(imagePath, function(img) {
            var bounds = canvasPanel.getController().getProductBounds()


            // If image or free edit area is selected, add the image object to that area.
            if (editArea) {
                bounds = canvasPanel.getController().getBoundingRect(editArea)

            }

            var imprintArea

            if (!editArea && RolandKioskPrint.AppData.isActivePrintTypeFoilOrMetal()) {
                // Set the image to imprint area.
                imprintArea = canvasPanel.getController().getImprintArea(
                    RolandKioskPrint.AppData.getActivePrintType())

                if (imprintArea) {
                    bounds = canvasPanel.getController().getBoundingRect(imprintArea)

                }
            }

            var position = {
                x: bounds.left,
                y: bounds.top
            }


            var scale

            var scaleX = bounds.width / img.width

            var scaleY = bounds.height / img.height


            // Compute the image size preserving the aspect ratio.
            if (scaleX < scaleY) {
                scale = scaleX

                position.y += (bounds.height - scale * img.height) / 2

            } else {
                scale = scaleY

                position.x += (bounds.width - scale * img.width) / 2

            }

            var sourceType = (
                isProductDesigner ? RolandKioskPrint.app.constants.OBJECT_SOURCE_PD
                : RolandKioskPrint.app.constants.OBJECT_SOURCE_PMD
            )


            img.set({
                left: position.x,
                top: position.y,
                sourceType: sourceType,
                origWidth: imageData.origWidth,
                origHeight: imageData.origHeight,
                printType: RolandKioskPrint.AppData.getActivePrintType()
            }).scale(scale)


            // Apply appropriate filters to render on-screen.
            if (RolandKioskPrint.AppData.isActivePrintTypeFoil()) {
                var foilColor = RolandKioskPrint.AppData.getCurrentFoilColor()

                img.filters.push(
                    new fabric.Image.filters.Tint({
                        color: foilColor.value,
                        skipWhite: true
                    })
                )

            } else if (RolandKioskPrint.AppData.isActivePrintTypeMetal()) {
                var productModel = RolandKioskPrint.AppData.productModelData

                var backgroundColor = productModel.backgroundColor

                if (!backgroundColor) {
                    backgroundColor = productModel.materialColor

                }

                img.filters.push(
                    new fabric.Image.filters.Tint({
                        color: backgroundColor
                    })
                )

            }

            if (objectToReplace) {
                canvasPanel.getController().replaceObject(objectToReplace, img)

            } else if (editArea) {
                canvasPanel.getController().addObjectToEditArea(img, editArea)

            } else {
                canvas.add(img)

            }

            img.applyFilters()


            canvas.setActiveObject(img)

            canvas.renderAll()


            deferred.resolve()

        })


        return deferred.promise

    },

    onImageOutlinePanelClosed: function(data) {
        // Check if we should respond.
        if (data.clientView != this.getView().clientView) {
            // Event fired by Client view and we are non-Client, or vice versa.
            return

        }

        // Get the image object we fired the outline panel for.
        var object = this.getSelectedImages()[0]

        var image = object

        if (object.type == 'clippingGroup') {
            image = object.getElement()

        }

        var canvas = RolandKioskPrint.AppData.getCanvas()


        // Need to perform these operations as a single undo/redo step.
        var undoRedoPanel = RolandKioskPrint.AppData.getUndoRedoPanel()

        undoRedoPanel.getController().mute()
 // Mute undo/redo handling. We notify once at end.

        var me = this


        if (data && (!data.outlinePath || data.keepImage)) {
            // No need to edit if we are going to remove the image.
            var getImageFilter = RolandKioskPrint.AppData.getCanvasPanel().getController().getImageFilter

            var imageAdjustFilter = getImageFilter(image, 'ImageAdjust')

            if (!imageAdjustFilter) {
                imageAdjustFilter = new fabric.Image.filters.ImageAdjust({
                    brightness: data.brightness || 0,
                    contrast: data.contrast || 0,
                    gamma: data.gamma || 0
                })

                var tintFilter = getImageFilter(image, 'Tint')

                this.addFilterRelativeToAnother(image.filters, imageAdjustFilter, tintFilter, 0)

            } else {
                imageAdjustFilter.brightness = data.brightness

                imageAdjustFilter.contrast = data.contrast

                imageAdjustFilter.gamma = data.gamma

            }

            var invertFilter = getImageFilter(image, 'Invert')

            if (!invertFilter) {
                invertFilter = new fabric.Image.filters.Invert({
                    invert: data.invert || false
                })

                this.addFilterRelativeToAnother(image.filters, invertFilter, imageAdjustFilter, 1)

            } else {
                invertFilter.invert = data.invert

            }
            image.applyFilters()

        }

        if (data && data.outlinePath) {
            var angle = object.angle * Math.PI / 180


            var scaleX = image.width / image.origWidth,
                scaleY = image.width / image.origWidth


            var layoutProps = ['flipX', 'flipY', 'scaleX', 'scaleY', 'skewX', 'skewY', 'angle']


            // Copy the object transformation properties.
            var options = {}

            layoutProps.forEach(function(prop) {
                options[prop] = object[prop]

            })


            var isProductDesigner = RolandKioskPrint.AppData.isProductDesigner()

            var sourceType = (
                isProductDesigner ? RolandKioskPrint.app.constants.OBJECT_SOURCE_PD
                                  : RolandKioskPrint.app.constants.OBJECT_SOURCE_PMD
            )


            // Create the fabric.Path object for the outline.
            var outlineObject = new fabric.Path(data.outlinePath, {
                fill: false,
                stroke: RolandKioskPrint.app.constants.METAL_OUTLINE_COLOR_DEFAULT,
                strokeWidth: 0,
                deviceStroke: true,
                deviceStrokeWidth: RolandKioskPrint.app.constants.METAL_OUTLINE_STROKE_WIDTH,
                editAreaId : object.editAreaId,
                isOutlinePath: true, // Custom property
                sourceType: sourceType,
                printType : RolandKioskPrint.app.constants.PRINT_TYPE_METAL
            })


            // Adjust it to the image.
            var left = outlineObject.get('left'),
                top = outlineObject.get('top')


            layoutProps.forEach(function(prop) {
                if (prop == 'scaleX') {
                    outlineObject.scaleX = options.scaleX * scaleX

                } else if (prop == 'scaleY') {
                    outlineObject.scaleY = options.scaleY * scaleY

                } else {
                    outlineObject[prop] = options[prop]

                }
            })


            var cos = Math.cos(angle),
                sin = Math.sin(angle)


            var x = left * cos - top * sin,
                y = top * cos + left * sin


            var outLineLeft = object.left + x * outlineObject.scaleX,
                outLineTop = object.top + y * outlineObject.scaleY


            outlineObject.left = outLineLeft

            outlineObject.top = outLineTop


            // Add the outline just after the image/cliping group.
            var index = canvas.getObjects().indexOf(object) + 1

            canvas.insertAt(outlineObject, index)


            // Check if we keep or remove the image.
            if (!data.keepImage) {
                // Remove the image object.
                canvas.discardActiveObject()

                canvas.remove(object)

            }
        }

        undoRedoPanel.getController().unmute()

        canvas.fire('object:modified', object)


        canvas.renderAll()

    },

    onImageAdjustPanelClosed: function(imageData) {
        // Check if we should respond.
        if (imageData.clientView != this.getView().clientView) {
            // Event fired by Client view and we are non-Client, or vice versa.
            return

        }

        var canvas = RolandKioskPrint.AppData.getCanvas()


        // Get the image object we fired the outline panel for.
        var object = this.getSelectedImages()[0]

        var image = object

        if (object.type == 'clippingGroup') {
            image = object.getElement()

        }
        var me = this

        var getImageFilter = RolandKioskPrint.AppData.getCanvasPanel().getController().getImageFilter


        function updateImageFilters(image, imageData) {
            var deferred = new Ext.Deferred()

            var blackWhiteFilter = getImageFilter(image, 'BlackWhite')

            if (!blackWhiteFilter) {
                image.setSrc(imageData.imgPath, function(obj) {
                    blackWhiteFilter = new fabric.Image.filters.BlackWhite({
                        threshold: imageData.threshold
                    })

                    var tintFilter = getImageFilter(obj, 'Tint')

                    me.addFilterRelativeToAnother(obj.filters, blackWhiteFilter, tintFilter, 0)


                    var invert = new fabric.Image.filters.Invert({
                        invert: imageData.invert || false
                    })

                    me.addFilterRelativeToAnother(obj.filters, invert, blackWhiteFilter, 1)

                    obj.applyFilters()

                    deferred.resolve(image)

                })

            } else if (imageData) {
                blackWhiteFilter.threshold = imageData.threshold

                var invertFilter = getImageFilter(image, 'Invert')

                invertFilter.invert = imageData.invert


                image.applyFilters()

                deferred.resolve(image)

            }
            return deferred.promise

        }

        // Need to perform changes as a single undo/redo step.
        var undoRedoPanel = RolandKioskPrint.AppData.getUndoRedoPanel()

        undoRedoPanel.getController().mute()
 // Mute undo/redo handling. We notify once at end.

        updateImageFilters(image, imageData).then(function(img) {
            undoRedoPanel.getController().unmute()

            canvas.fire('object:modified', img)

            canvas.renderAll()

        })

    },

    addFilterRelativeToAnother: function(filters, filter, anotherFilter, diff) {
            var anotherFilterIndex = filters.indexOf(anotherFilter) + diff

            if (anotherFilterIndex >= 0) {
                filters.splice(anotherFilterIndex, 0, filter)

            } else {
                filters.push(filter)

            }
    },

    onBackgroundColorChanged: function(data) {
        // Check if we should respond.
        if (data.clientView != this.getView().clientView) {
            // Event fired by Client view and we are non-Client, or vice versa.
            return

        }

        // Need not do anything if not metal print.
        var productModelData = RolandKioskPrint.AppData.productModelData

        if (!productModelData.isMetalPrint()) {
            return

        }

        var newColor = data.color

        var appData = RolandKioskPrint.AppData

        var canvasController = appData.getCanvasPanel().getController()

        var canvas = appData.getCanvas()


        // Gather all image objects.
        var imageObjects = []

        canvas.getObjects().forEach(function(object) {
            canvasController.enumerateObjects(object, function(o) {
                var type = o.get('type')

                if (o.get('printType') == RolandKioskPrint.app.constants.PRINT_TYPE_METAL &&
                    (type == 'image' || type == 'clippingGroup') && o.get('id') != 'background') {
                    imageObjects.push(o)

                }
                return true

            })

        })


        if (!newColor) { // None color
            var productModel = RolandKioskPrint.AppData.productModelData

            newColor = productModel.materialColor

        }

        var getImageFilter = RolandKioskPrint.AppData.getCanvasPanel().getController().getImageFilter

        for (var i = 0, length = imageObjects.length
 i < length; i++) {
            var imageObject = imageObjects[i]

            if (imageObject.type == 'clippingGroup') {
                imageObject = imageObject.getElement()

            }

            var colorFilter = getImageFilter(imageObject, 'Tint')

            colorFilter.color = newColor

            imageObject.applyFilters()

        }

        canvas.renderAll()

    },

    isReplaceableObject: function(object) {
        if (!object.editAreaId || object.isLocked) {
            return false

        }

        var type = object.get('type'),
            isImage = (type == 'image' || type == 'clippingGroup') && object.id != 'background'

        return object.isPathGroup || isImage

    },

    getSelectedImages: function() {
        var canvas = RolandKioskPrint.AppData.getCanvas()

        var imageObjects = canvas.getActiveObjects().filter(function(o) {
            var type = o.get('type')

            return (type == 'image' || type == 'clippingGroup') && o.get('id') != 'background'

        })

        return imageObjects

    },

    onCboImgCategoriesChange: function(field, newValue, oldValue, eOpts) {
        var frmUploadImagePanel = this.getView().down('#frmUploadImage')

        var foilPrint = RolandKioskPrint.AppData.productModelData.isFoilPrint()


        var isUserImageCategory =
        (newValue == RolandKioskPrint.app.getString('label.designer.userImageCategoryName'))


        // Update the panel UI. Show upload and refresh buttons only for user category.
        frmUploadImagePanel.setVisible(isUserImageCategory)


        if (isUserImageCategory) {
            // Populate view with user images.
            this.refreshUserImageList()

            return

        }

        // Update the image view with the corresponding set of image items.
        var categoriesData = this.getViewModel().getData()

        if (!categoriesData) {
            return

        }

        var imageItems = []

        for (var i = 0
 i < categoriesData.imageCategories.length; i++) {
            var categoryData = categoriesData.imageCategories[i]


            if (categoryData.categoryName == newValue) {
                for (var j = 0
 j < categoryData.imageItems.length; j++) {
                    var imageItem = categoryData.imageItems[j]

                    imageItems.push({
                        fileName: imageItem.fileName,
                        filePath: imageItem.filePath,
                        thumbPath: imageItem.thumbPath,
                        origHeight: imageItem.origHeight,
                        origWidth: imageItem.origWidth
                    })

                }
                break

            }
        }

        var imgView = this.getView().down('#imgView')

        var store = imgView.getStore()

        store.setData(imageItems)


        imgView.refresh()

    },

    onUploadButtonClick: function(button, e, eOpts) {
        var imageUploadData = {
            'imgPanelView': this.getView(),
            'screenType': 'uploadMethodSelection',
            'backgroundImage': false
        }


        var widget

        if (RolandKioskPrint.AppData.isProductModelDesigner()) {
            widget = Ext.widget('productmodeldesignerimageupload')

        } else {
            widget = Ext.widget({
                xtype: 'productdesignerimageupload',
                clientView: true
            })

        }

        widget.getViewModel().setData(imageUploadData)


        if (!window.isAgreedImageUploadDisclaimer) {
            RolandKioskPrint.app.showImageUploadDisclaimer().then(function(dontShowAgain) {
                window.isAgreedImageUploadDisclaimer = dontShowAgain

                RolandKioskPrint.app.showModalView(widget)

            })

        } else {
            RolandKioskPrint.app.showModalView(widget)

        }
    },

    onRefreshButtonClick: function(button, e, eOpts) {
        this.refreshUserImageList()

    },

    onImgViewItemClick: function(dataview, record, item, index, e, eOpts) {
        var appData = RolandKioskPrint.AppData


        var cboImgCategories = this.getView().down('#cboImgCategories')

        var isUserImageCategory =
        (cboImgCategories.getValue() == RolandKioskPrint.app.getString('label.designer.userImageCategoryName'))


        if (appData.isActivePrintTypeFoilOrMetal() && !isUserImageCategory) {
            // Move image to user category and add to canvas.
            this.moveImageToUserCategory(record)

        } else {
            this.addImageToCanvas(record.data)

        }
    },

    onImgViewRefresh: function(dataview, eOpts) {
        const observer = lozad()

        observer.observe()

    },

    onPanelShow: function(component, eOpts) {
        var cboImgCategories = this.getView().down('#cboImgCategories')

        if (cboImgCategories.getValue() == RolandKioskPrint.app.getString('label.designer.userImageCategoryName')) {
            this.refreshUserImageList()

        }

        // In product designer, if the product model contains edit areas, images can
        // be added only to image or free edit areas. Select the target edit area, if
        // none is already targeted.
        var isProductDesigner =
        (RolandKioskPrint.AppData.appMode == RolandKioskPrint.app.constants.APP_MODE_PRODUCT_DESIGNER)

        if (!isProductDesigner) {
            return

        }

        // Can the selected object be replaced?
        var canvas =  RolandKioskPrint.AppData.getCanvas()

        var activeObjects = canvas.getActiveObjects()

        if (activeObjects.length == 1 && this.isReplaceableObject(activeObjects[0])) {
            return

        }

        var canvas = RolandKioskPrint.AppData.getCanvas()


        var targetAreas = this.getImageTargetAreas(true)

        if (targetAreas.length !== 0) {
            // For product designer, this would pick up the selected or first available area.
            if (targetAreas[0] != canvas.getActiveObject()) {
                canvas.setActiveObject(targetAreas[0])

                canvas.renderAll()

            }
        }
    },

    onPanelBeforeRender: function(component, eOpts) {
        // Get the list of images, and populate the controls.
        // Right now, we are using a flat model in ImageCategory, the 'hasMany' association
        // does not compile on Architect 4.0. We populate the flat model stores ourselves from
        // the incoming JSON data.

        var categories = []


        // Add the user images category.
        categories.push({
            categoryName: RolandKioskPrint.app.getString('label.designer.userImageCategoryName')
        })


        var me = this

        var promise = RolandKioskPrint.app.fetchBundledImages()


        promise.then(function(response) {
            var categoriesData = Ext.decode(response.responseText)

            if (categoriesData) {
                me.getViewModel().setData(categoriesData)
 // Stash in the view model

                for (var i = 0
 i < categoriesData.imageCategories.length; i++) {
                    var category = {
                        categoryName: categoriesData.imageCategories[i].categoryName
                    }

                    categories.push(category)

                }
            }

            me.populateImageCategories(categories)

        }, function() {
            me.populateImageCategories(categories)

        })

    }

})

