/*
 * fabric.js Controls Extension
 * for fabric.js current build
 * Simon Kunz 09.02.2016 for pixolith
 * Licensed under the MIT license.
 */

'use strict';
(function(window) {
    var fabric = window.fabric || ( window.fabric = {} ),
        minExtCompat = '1.6.0',
        isVML = function() {
            return typeof G_vmlCanvasManager !== 'undefined';
        },
        degreesToRadians = fabric.util.degreesToRadians,
        cursorOffset = {
            mt: 0, // n
            tr: 1, // ne
            mr: 2, // e
            br: 3, // se
            mb: 4, // s
            bl: 5, // sw
            ml: 6, // w
            tl: 7, // nw
        };

    if (minExtCompat.localeCompare(window.fabric.version) > -1) {
        console.warn('this extension might not be fully compatible with your version ' +
            'of fabric.js (' + window.fabric.version + ').' +
            'Consider using the latest compatible build of fabric.js (> ' + minExtCompat + ')'
        );
    }

    fabric.util.object.extend(fabric.Object.prototype, {
        /**
         * When true, corners have their specific icons or appearance settings.
         * @type Boolean
         * @default false
         */
        hasCornerSpecificSettings: false,

        /**
         * Inner padding between shape border and drawn image.
         * @type int
         * @default rect
         */
        cornerPadding: 0,

        /**
         * List of adornments to be drawn in selection state.
         * @type array
         */
        selectionAdornments: [],

        /**
         * Set a custom corner icon
         * @param {Object} obj settings and icon url.
         * @param callback function
         */
        customiseControlsAppearance: function(obj, callback) {
            var setting,
                cornerConfig;

            for (setting in obj) {
                if (obj.hasOwnProperty(setting)) {

                    cornerConfig = {};

                    if (obj[setting].cornerStyle !== undefined) {
                        this.cornerStyle = obj[setting].cornerStyle;
                    }

                    if (obj[setting].cornerColor !== undefined) {
                        this.cornerColor = obj[setting].cornerColor;
                    }

                    if (obj[setting].cornerStrokeColor !== undefined) {
                        this.cornerStrokeColor = obj[setting].cornerStrokeColor;
                    }

                    if (obj[setting].cornerSize !== undefined) {
                        this.cornerSize = obj[setting].cornerSize;
                    }

                    if (obj[setting].cornerPadding !== undefined) {
                        this.cornerPadding = obj[setting].cornerPadding;
                    }

                    if (obj[setting].icon !== undefined || obj[setting].settings !== undefined) {
                        this.hasCornerSpecificSettings = true;

                        this[setting + 'EnabledCallback'] = obj[setting].enabledCallback;

                        if (obj[setting].settings !== undefined) {
                            cornerConfig.settings = obj[setting].settings;
                        }

                        if (obj[setting].icon !== undefined) {
                            cornerConfig.icon = obj[setting].icon;

                            this._loadIcon(setting, cornerConfig, function() {
                                if (callback && typeof( callback ) === 'function') {
                                    callback();
                                }
                            });
                        } else {
                            this[setting + 'Settings'] = cornerConfig.settings;
                        }
                    }
                }
            }
        },

        /**
         * loads the icon image as an image src.
         * @param {Object} corner to load an icon.
         * @param cornerConfig as object containing icon url and corner specific settings
         * @param callback function.
         */
        _loadIcon: function(corner, cornerConfig, callback) {
            var self = this,
                icon = new Image();

            icon.onload = function() {
                self[corner + 'Icon'] = this;

                if (cornerConfig.settings) {
                    self[corner + 'Settings'] = cornerConfig.settings;
                }

                if (callback && typeof( callback ) === 'function') {
                    callback();
                }
            };

            icon.onerror = function() {
                fabric.warn(this.src + ' icon is not an image');
            };

            if (cornerConfig.icon.match(/^http[s]?:\/\//) || cornerConfig.icon.substring(0, 2) === '//') {
                icon.crossOrigin = 'Anonymous';
            }

            icon.src = cornerConfig.icon;
        },

        /**
         * copy of the setter method for our american friends.
         * @param {Object} obj containing corner icon urls and settings.
         */
        customizeControlsAppearance: function(obj) {
            this.customiseControlsAppearance(obj);
        },

        /**
         * Adds a selection adornment.
         * @param name of the adornment.
         * @param {Object} obj settings for stroke and fill.
         * @param Callback whether the adornment should be drawn for an instance.
         * @param Callback for custom drawing of adornment for an instance.
         */
        addSelectionAdornment: function(name, obj, shouldDrawCallback, drawCallback) {
            for (var i = 0, len = this.selectionAdornments.length; i < len; i++) {
                if (this.selectionAdornments[i].name == name) {
                    // Already added.
                    return;
                }
            }

            obj.name = name;
            obj.shouldDrawCallback = shouldDrawCallback;
            obj.drawCallback = drawCallback;
            this.selectionAdornments.push(obj);
        },

        /**
         * Draws corners of an object's bounding box.
         * Requires public properties: width, height
         * Requires public options: cornerSize, padding
         * @param {CanvasRenderingContext2D} ctx Context to draw on
         * @return {fabric.Object} thisArg
         * @chainable
         */
        drawControls: function(ctx) {
            if (!this.hasControls) {
                return this;
            }

            this._drawControls(ctx, this._calculateCurrentDimensions());
        },

        /**
         * Draws corners of an object's bounding box in a group.
         * Requires public properties: width, height
         * Requires public options: cornerSize, padding
         * @param {CanvasRenderingContext2D} ctx Context to draw on
         * @return {fabric.Object} thisArg
         * @chainable
         */
        drawControlsInGroup: function(ctx, options) {
            if (!this.hasControls) {
                return this;
            }

            // customTransformMatrix takes absolute values of scaleX, scaleY.
            // While this suffices for clippingGroup clip, the only case where we draw controls on a
            // group child as of now, this is not generic.
            var p = this._getNonTransformedDimensions(),
                matrix = fabric.util.customTransformMatrix(options.scaleX, options.scaleY, options.skewX),
                wh = fabric.util.transformPoint(p, matrix);

            this._drawControls(ctx, wh);
        },

        _drawControls: function(ctx, dim) {
            var width = dim.x,
                height = dim.y,
                scaleOffset = this.cornerSize,
                left = -(width + scaleOffset) / 2,
                top = -(height + scaleOffset) / 2;

            ctx.save();
            if (!this.hasCornerSpecificSettings) {
                ctx.strokeStyle = ctx.fillStyle = this.cornerColor;

                if (!this.transparentCorners) {
                    ctx.strokeStyle = this.cornerStrokeColor;
                }
            }

            ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            ctx.lineWidth = 1;
            this._setLineDash(ctx, this.cornerDashArray, null);

            // top-left
            this._drawControl('tl', ctx,
                left,
                top,
                this.tlIcon,
                this.tlSettings
            );

            // top-right
            this._drawControl('tr', ctx,
                left + width,
                top,
                this.trIcon,
                this.trSettings
            );

            // bottom-left
            this._drawControl('bl', ctx,
                left,
                top + height,
                this.blIcon,
                this.blSettings
            );

            // bottom-right
            this._drawControl('br', ctx,
                left + width,
                top + height,
                this.brIcon,
                this.brSettings
            );

            if (!this.get('lockUniScaling')) {

                // middle-top
                this._drawControl('mt', ctx,
                    left + width / 2,
                    top,
                    this.mtIcon,
                    this.mtSettings
                );

                // middle-bottom
                this._drawControl('mb', ctx,
                    left + width / 2,
                    top + height,
                    this.mbIcon,
                    this.mbSettings
                );

                // middle-right
                this._drawControl('mr', ctx,
                    left + width,
                    top + height / 2,
                    this.mrIcon,
                    this.mrSettings
                );

                // middle-left
                this._drawControl('ml', ctx,
                    left,
                    top + height / 2,
                    this.mlIcon,
                    this.mlSettings
                );
            }

            // middle-top-rotate
            if (this.hasRotatingPoint) {
                this._drawControl('mtr', ctx,
                    left + width / 2,
                    top - this.rotatingPointOffset,
                    this.mtrIcon,
                    this.mtrSettings
                );
            }

            // selection adornments
            var margin = 5;
            left = width / 2;
            top = -(height / 2 - margin);
            var instance = this;
            this.selectionAdornments.forEach(function(adornment) {
                var shouldDraw = adornment.shouldDrawCallback;
                if (shouldDraw && typeof( shouldDraw ) === 'function') {
                    shouldDraw = shouldDraw(instance, adornment);
                }

                if (!shouldDraw) {
                    return;
                }

                var size = adornment.boxSize;

                left = left - margin;
                if (left - size < -width / 2 + margin ||
                    top + size > height / 2 - margin) {
                    // out of object bounds
                    return;
                }

                left -= size;

                ctx.strokeStyle = adornment.strokeColor;
                ctx.fillStyle = adornment.fillColor;

                if (adornment.fillColor) {
                    ctx.save();
                    ctx.globalAlpha = 1;
                    ctx.fillRect(left, top, size, size);
                    ctx.restore();
                }

                if (adornment.strokeColor) {
                    ctx.strokeRect(left, top, size, size);
                }

                if (adornment.drawCallback && typeof( adornment.drawCallback ) === 'function') {
                    adornment.drawCallback(instance, adornment, ctx, left, top);
                }
            });

            ctx.restore();
            return this;
        },

        /** Draw controls either with background-shape and color (transparency) or plain image (modified core method)
         * @private
         * {string} icon url of the control
         */
        _drawControl: function(control, ctx, left, top, icon, settings) {
            if (!this.isControlVisible(control)) {
                return;
            }

            var size = this.cornerSize,
                cornerStrokeColor = this.cornerStrokeColor,
                cornerColor = this.cornerColor,
                cornerStyle = this.cornerStyle,
                cornerPadding = typeof this.cornerPadding === 'number' ? this.cornerPadding : 10;

            var cornerSpecificSettingsEnabled = this.hasCornerSpecificSettings;
            if (this[control + 'EnabledCallback'] && !this[control + 'EnabledCallback'](this)) {
                cornerSpecificSettingsEnabled = false;
            }

            if (settings && cornerSpecificSettingsEnabled) {
                if (settings.cornerSize) {
                    // Set the size, and also recalc left and top.
                    left = left + size / 2 - settings.cornerSize / 2;
                    top = top + size / 2 - settings.cornerSize / 2;
                    size = settings.cornerSize;
                }
                cornerStyle = settings.cornerStyle || cornerStyle;
                cornerColor = settings.cornerColor || cornerColor;
                cornerPadding = typeof settings.cornerPadding === 'number' ? settings.cornerPadding : cornerPadding;
                cornerStrokeColor = settings.cornerStrokeColor || cornerStrokeColor;
            }

            if (this.hasCornerSpecificSettings) {
                ctx.strokeStyle = ctx.fillStyle = cornerColor;
                if (!this.transparentCorners) {
                    ctx.strokeStyle = cornerStrokeColor;
                }
            }

            var fill = !this.transparentCorners;
            var stroke = !this.transparentCorners && cornerStrokeColor;

            switch (cornerStyle) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(left + size / 2, top + size / 2, size / 2, 0, 2 * Math.PI, false);
                    if (fill) {
                        ctx.save();
                        ctx.globalAlpha = 1;
                        ctx.fill();
                        ctx.restore();
                    }
                    if (stroke) {
                        ctx.stroke();
                    }
                    break;
                case 'crop':
                    var strokeWidth = 3;
                    ctx.beginPath();
                    left = left + size / 2;
                    top = top + size / 2;
                    ctx.lineWidth = strokeWidth;

                    if (control === 'tl') {
                        left -= strokeWidth / 2;
                        top -= strokeWidth / 2;
                        ctx.moveTo(left, top + size);
                        ctx.lineTo(left, top);
                        ctx.lineTo(left + size, top);
                    } else if (control === 'tr') {
                        left += strokeWidth / 2;
                        top -= strokeWidth / 2;
                        ctx.moveTo(left, top + size);
                        ctx.lineTo(left, top);
                        ctx.lineTo(left - size, top);
                    } else if (control === 'bl') {
                        left -= strokeWidth / 2;
                        top += strokeWidth / 2;
                        ctx.moveTo(left, top - size);
                        ctx.lineTo(left, top);
                        ctx.lineTo(left + size ,top);
                    } else if (control === 'br') {
                        left += strokeWidth / 2;
                        top += strokeWidth / 2;
                        ctx.moveTo(left, top - size);
                        ctx.lineTo(left, top);
                        ctx.lineTo(left - size, top);
                    } else if (control === 'mb') {
                        top += strokeWidth / 2;
                        ctx.moveTo(left - size, top);
                        ctx.lineTo(left + size, top);
                    } else if (control === 'mt') {
                        top -= strokeWidth / 2;
                        ctx.moveTo(left - size, top);
                        ctx.lineTo(left + size, top);
                    } else if (control === 'ml') {
                        left -= strokeWidth / 2;
                        ctx.moveTo(left, top - size);
                        ctx.lineTo(left, top + size);
                    } else if (control === 'mr') {
                        left += strokeWidth / 2;
                        ctx.moveTo(left, top - size);
                        ctx.lineTo(left, top + size);
                    }

                    if (stroke) {
                        ctx.stroke();
                    }
                    return;
                default:
                    this.transparentCorners || ctx.clearRect(left, top, size, size);
                    if (fill) {
                        ctx.save();
                        ctx.globalAlpha = 1;
                        ctx.fillRect(left, top, size, size);
                        ctx.restore();
                    }
                    if (stroke) {
                        ctx.strokeRect(left, top, size, size);
                    }
                    break;
            }

            if (icon !== undefined && cornerSpecificSettingsEnabled) {
                this._drawImageProportionally(ctx, icon,
                                              left + cornerPadding / 2,
                                              top + cornerPadding / 2,
                                              size - cornerPadding,
                                              size - cornerPadding);
            }
        },

        /**
         * Draws the image in the specified box with proportional scaling.
         * @private
         */
        _drawImageProportionally: function(ctx, img, left, top, width, height) {
            var rx = width / img.width,
                ry = height / img.height;

            if (rx < ry) {
                top += (height - img.height * rx) / 2;
                height = img.height * rx;
            } else {
                left += (width - img.width * ry) / 2;
                width = img.width * ry;
            }

            ctx.drawImage(
                    img,
                    left,
                    top,
                    width,
                    height
            );
        },

        /**
         * Sets the coordinates of the draggable boxes in the corners of
         * the image used to scale/rotate it.
         * @private
         */
        _setCornerCoords: function() {
            var coords = this.oCoords,
                newTheta = degreesToRadians(45 - this.angle),
                /* Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2, */
                /* 0.707106 stands for sqrt(2)/2 */
                cornerHypotenuse = this.cornerSize * 0.707106 * this.cornerHitTolerance,
                cos = fabric.util.cos(newTheta),
                sin = fabric.util.sin(newTheta),
                cosHalfOffsetCommon = cornerHypotenuse * cos,
                sinHalfOffsetCommon = cornerHypotenuse * sin,
                x, y;

            var cornerSettings,
                cornerSize,
                cornerHitTolerance,
                cosHalfOffset,
                sinHalfOffset;

            for (var point in coords) {
                cornerSettings = this[point + 'Settings'];
                if (cornerSettings) {
                    cornerSize = (cornerSettings.cornerSize !== undefined) ? cornerSettings.cornerSize : this.cornerSize;
                    cornerHitTolerance = (cornerSettings.cornerHitTolerance !== undefined) ? cornerSettings.cornerHitTolerance : this.cornerHitTolerance;
                    cornerHypotenuse = cornerSize * 0.707106 * cornerHitTolerance,
                    cosHalfOffset = cornerHypotenuse * cos,
                    sinHalfOffset = cornerHypotenuse * sin;
                } else {
                    cosHalfOffset = cosHalfOffsetCommon,
                    sinHalfOffset = sinHalfOffsetCommon;
                }
                x = coords[point].x;
                y = coords[point].y;
                coords[point].corner = {
                    tl: {
                        x: x - sinHalfOffset,
                        y: y - cosHalfOffset
                    },
                    tr: {
                        x: x + cosHalfOffset,
                        y: y - sinHalfOffset
                    },
                    bl: {
                        x: x - cosHalfOffset,
                        y: y + sinHalfOffset
                    },
                    br: {
                        x: x + sinHalfOffset,
                        y: y + cosHalfOffset
                    }
                };
            }
        },

        /**
         * Removes custom corner settings from an object instance.
         */
        removeCornerSpecificSettings: function() {
            var me = this;
            var corners = ['tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'];
            corners.forEach(function(corner) {
                me[corner + 'Settings'] = undefined;
                me[corner + 'Icon'] = undefined;
            });
            this.hasCornerSpecificSettings = false;
        }
    });

    fabric.util.object.extend(fabric.Canvas.prototype, {
        /**
         * When true, actions can be overwritten
         * @type Boolean
         * @default false
         */
        overwriteActions: false,

        /**
         * When true, cursors are fixed
         * @type Boolean
         * @default false
         */
        fixedCursors: false,

        /**
         * setter Method for actions and cursors.
         * @param {Object} obj containing corner action and cursor url/type.
         */
        customiseControlsBehaviour: function(obj) {
            var setting;

            for (setting in obj) {
                if (obj.hasOwnProperty(setting)) {
                    if (obj[setting].action !== undefined) {
                        this.overwriteActions = true;
                        this.setCustomAction(setting, obj[setting].action, obj[setting].actionSupported, obj[setting].actionDisabled);
                    }

                    if (obj[setting].cursor !== undefined) {
                        this.fixedCursors = true;
                        this.setCustomCursor(setting, obj[setting].cursor);
                    }
                }
            }
        },

        /**
         * loads the icon image as an image src.
         * @param {Object} corner to load an icon.
         * @param action as a string.
         */
        setCustomAction: function(corner, action, actionSupported, actionDisabled) {
            this[corner + 'Action'] = action;
            this[corner + 'ActionSupported'] = actionSupported;
            this[corner + 'ActionDisabled'] = actionDisabled;
        },

        /**
         * loads the icon image as an image src.
         * @param {Object} corner to load an icon.
         * @param cursorUrl as a string.
         */
        setCustomCursor: function(corner, cursorUrl) {
            this[corner + 'cursorIcon'] = cursorUrl;
        },

        /**
         * copy of the setter method for our american friends.
         * @param {Object} obj containing corner action and cursor url/type.
         */
        customizeControlsBehaviour: function(obj) {
            this.customiseControlsBehaviour(obj);
        },

        /**
         * @private
         */
        _getActionFromCorner: function(target, corner, e) {
            if (!corner) {
                return 'drag';
            }

            if (corner) {
                var actionSupported = this.actionIsSupported(corner, target, e);

                if (this[corner + 'Action'] && actionSupported && this.overwriteActions) {
                    switch (corner) {
                        case 'mtr':
                            return this[corner + 'Action'] || 'rotate';
                        case 'ml':
                        case 'mr':
                            if (e[this.altActionKey]) {
                                return e[this.altActionKey] ? 'skewY' : 'scaleX';
                            }
                            return this[corner + 'Action'];
                        case 'mt':
                        case 'mb':
                            if (e[this.altActionKey]) {
                                return e[this.altActionKey] ? 'skewY' : 'scaleY';
                            }
                            return this[corner + 'Action'];
                        default:
                            return this[corner + 'Action'] || 'scale';
                    }
                } else {
                    switch (corner) {
                        case 'mtr':
                            return 'rotate';
                        case 'ml':
                        case 'mr':
                            return e[this.altActionKey] ? 'skewY' : 'scaleX';
                        case 'mt':
                        case 'mb':
                            return e[this.altActionKey] ? 'skewX' : 'scaleY';
                        default:
                            return 'scale';
                    }
                }
            }
            return false;
        },

        /**
         * @private
         * @param {Event} e Event object
         * @param {fabric.Object} target
         */
        _setupCurrentTransform: function(e, target) {
            if (!target) {
                return;
            }

            var pointer = this.getPointer(e),
                corner = target._findTargetCorner(this.getPointer(e, true));

            if (target.get('type') === 'clippingGroup' && target.isClipMode) {
                // pointer is in absolute coordinates.
                var m = target.calcTransformMatrix(),
                    invertedM = fabric.util.invertTransform(m);
                pointer = fabric.util.transformPoint(pointer, invertedM);
                if (corner || target.clip.containsPoint(pointer)) {
                    target = target.clip;
                } else {
                    target = target.element;
                }
            }

            var action = this._getActionFromCorner(target, corner, e),
                origin = this._getOriginFromCorner(target, corner);

            if (!corner) {
                var hit = this.hitTestObjectBadge && this.hitTestObjectBadge(target, pointer);
                if (hit) {
                    if (this.performObjectBadgeAction && this.performObjectBadgeAction(target, hit)) {
                        action = 'void';
                    }
                }
            }

            if (typeof action === 'function') {
                action.call(this, e, target);

                // as of fabric 1.7.11 object cache will try to slice the action to check for scale so we need to convert this to a string
                action = 'void';
            }

            this._currentTransform = {
                target: target,
                action: action,
                corner: corner,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                skewX: target.skewX,
                skewY: target.skewY,
                offsetX: pointer.x - target.left,
                offsetY: pointer.y - target.top,
                originX: origin.x,
                originY: origin.y,
                ex: pointer.x,
                ey: pointer.y,
                lastX: pointer.x,
                lastY: pointer.y,
                left: target.left,
                top: target.top,
                theta: degreesToRadians(target.angle),
                width: target.width * target.scaleX,
                mouseXSign: 1,
                mouseYSign: 1,
                shiftKey: e.shiftKey,
                altKey: e[this.centeredKey]
            };

            this._currentTransform.original = {
                left: target.left,
                top: target.top,
                scaleX: target.scaleX,
                scaleY: target.scaleY,
                skewX: target.skewX,
                skewY: target.skewY,
                originX: origin.x,
                originY: origin.y
            };

            if (action === 'remove') {
                this._removeAction(e, target);
            }

            if (action === 'moveUp') {
                this._moveLayerUpAction(e, target);
            }

            if (action === 'moveDown') {
                this._moveLayerDownAction(e, target);
            }

            if (typeof action === 'object') {
                if (Object.keys(action)[0] === 'rotateByDegrees') {
                    this._rotateByDegrees(e, target, action.rotateByDegrees);
                }
            }

            this._resetCurrentTransform();
        },

        /**
         * Custom remove object action
         * @private
         * @param {Event} e Event object
         * @param {fabric.Object} target
         */
        _removeAction: function(e, target) {
            var _this = this;
            if (this.getActiveObjects() && this.getActiveObjects() !== 'undefined') {
                this.getActiveObjects().forEach(function(o) {
                    o.off();
                    _this.discardActiveObject();
                    _this.remove(o);
                });

            } else {
                target.off();
                this.discardActiveObject();
                this.remove(target);
            }
        },

        /**
         * Custom move up object action
         * @private
         * @param {Event} e Event object
         * @param {fabric.Object} target
         */
        _moveLayerUpAction: function(e, target) {
            if (this.getActiveObjects() && this.getActiveObjects() !== 'undefined') {
                this.getActiveObjects().forEach(function(o) {
                    o.bringForward();
                });
            } else {
                target.bringForward();
            }
        },

        /**
         * Custom move down object action
         * @private
         * @param {Event} e Event object
         * @param {fabric.Object} target
         */
        _moveLayerDownAction: function(e, target) {
            if (this.getActiveObjects() && this.getActiveObjects() !== 'undefined') {
                this.getActiveObjects().forEach(function(o) {
                    o.sendBackwards();
                });
            } else {
                target.sendBackwards();
            }
        },

        /**
         * Custom move down object action
         * @private
         * @param {Event} e Event object
         * @param {fabric.Object} target
         * @param {Integer} value of rotation
         */
        _rotateByDegrees: function(e, target, value) {
            var angle = parseInt(target.get('angle')) + value,
                needsOriginRestore = false;

            if (( target.originX !== 'center' || target.originY !== 'center' ) && target.centeredRotation) {
                this._setOriginToCenter(target);
                needsOriginRestore = true;
            }

            angle = angle > 360 ? angle - 360 : angle;

            if (this.getActiveObjects() && this.getActiveObjects() !== 'undefined') {
                this.getActiveObjects().forEach(function(obj) {
                    obj
                        .set('angle', angle)
                        .setCoords();
                });
            } else {
                target
                    .set('angle', angle)
                    .setCoords();
            }

            if (needsOriginRestore) {
                this._setCenterToOrigin(target);
            }

            this.renderAll();
        },

        /**
         * @private
         * @param {Event} e send the mouse event that generate the finalize down, so it can be used in the event
         */
        _finalizeCurrentTransform: function(e) {
            var transform = this._currentTransform,
                target = transform.target,
                eventName,
                options = {
                    e: e,
                    target: target,
                    transform: transform,
                };

            if (target._scaling) {
                target._scaling = false;
            }

            target.setCoords();

            var group = target.group;
            if (group && group.type === 'clippingGroup' && target === group.element) {
                group._setBounds(target);
            }

            if (transform.actionPerformed || (this.stateful && target.hasStateChanged())) {
                if (transform.actionPerformed) {
                    eventName = this._addEventOptions(options, transform);
                    this._fire(eventName, options);
                }
                this._fire('modified', options);
            }
        },

        /**
         * Sets either the standard behaviour cursors or if fixedCursors is true, tries to set a custom cursor
         * either by using an icon or a build-in cursor. Cursor icon extensions are matched with a regular expression.
         * @private
         * {string} corner name
         * {target} event handler of the hovered corner
         */
        getCornerCursor: function(corner, target, e) {
            var iconUrlPattern = /\.(?:jpe?g|png|gif|jpg|jpeg|svg)$/;

            if (this.actionIsDisabled(corner, target, e)) {
                return this.notAllowedCursor;
            }

            var actionSupported = this.actionIsSupported(corner, target, e);

            if (this.fixedCursors && actionSupported && this[corner + 'cursorIcon']) {
                if (this[corner + 'cursorIcon'].match(iconUrlPattern)) {
                    this.setCursor('url(' + this[corner + 'cursorIcon'] + '), auto');
                } else {
                    if (this[corner + 'cursorIcon'] === 'resize') {
                        this.setCursor(this._getRotatedCornerCursor(corner, target, e));
                    } else {
                        this.setCursor(this[corner + 'cursorIcon']);
                    }
                }
            } else {
                if (corner in cursorOffset) {
                    this.setCursor(this._getRotatedCornerCursor(corner, target, e));
                } else if (corner === 'mtr' && target.hasRotatingPoint) {
                    this.setCursor(this.rotationCursor);
                } else {
                    this.setCursor(this.defaultCursor);
                    return false;
                }
            }

            return false;
        },

        actionIsDisabled: function(corner, target, e) {
            if (this[corner + 'Action'] && this.overwriteActions) {
                if (this[corner + 'ActionDisabled'] !== undefined) {
                    return this[corner + 'ActionDisabled'];
                }
            }

            if (corner === 'mt' || corner === 'mb') {
                return e[this.altActionKey] ? target.lockSkewingX : target.lockScalingY;
            }
            else if (corner === 'ml' || corner === 'mr') {
                return e[this.altActionKey] ? target.lockSkewingY : target.lockScalingX;
            }
            else if (corner === 'mtr') {
                return target.lockRotation;
            }
            else {
                return this._isUniscalePossible(e, target) ?
                    target.lockScalingX && target.lockScalingY : target.lockScalingX || target.lockScalingY;
            }
        },

        actionIsSupported: function(corner, target, e) {
            if (target.get('type') === 'clippingGroup' && target.isClipMode) {
                return false;
            }

            var group = target.group;
            if (group && group.get('type') === 'clippingGroup') {
                return false;
            }

            var actionSupported = this[corner + 'ActionSupported'];
            if (typeof actionSupported === 'function') {
                actionSupported = actionSupported.call(this, target);
            }
            return actionSupported;
        }
    });

    if (typeof exports !== 'undefined') {
        module.exports = this;
    }

})(window);
