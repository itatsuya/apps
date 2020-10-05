/*! Fabric.js Copyright 2008-2015, Printio (Juriy Zaytsev, Maxim Chernyak) */
var fabric = fabric || {
    version: "1.7.6"
};
if (typeof exports !== "undefined") {
    exports.fabric = fabric
}
if (typeof document !== "undefined" && typeof window !== "undefined") {
    fabric.document = document;
    fabric.window = window;
    window.fabric = fabric
} else {
    fabric.document = require("jsdom").jsdom(decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E"));
    if (fabric.document.createWindow) {
        fabric.window = fabric.document.createWindow()
    } else {
        fabric.window = fabric.document.parentWindow
    }
}
fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement;
fabric.isLikelyNode = typeof Buffer !== "undefined" && typeof window === "undefined";
fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id"];
fabric.DPI = 96;
fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)";
fabric.fontPaths = {};
fabric.iMatrix = [1, 0, 0, 1, 0, 0];
fabric.charWidthsCache = {};
fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1;
if (typeof JSON !== "object") {
    JSON = {}
}(function() {
    function f(n) {
        return n < 10 ? "0" + n : n
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf()
        }
    }
    var cx, escapable, gap, indent, meta, rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null"
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null"
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v
        }
    }
    if (typeof JSON.stringify !== "function") {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        };
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {
                "": value
            })
        }
    }
    if (typeof JSON.parse !== "function") {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}(function(n) {
    n.modifyEventListener = false;
    n.modifySelectors = false;
    n.configure = function(s) {
        if (isFinite(s.modifyEventListener)) {
            n.modifyEventListener = s.modifyEventListener
        }
        if (isFinite(s.modifySelectors)) {
            n.modifySelectors = s.modifySelectors
        }
        if (e === false && n.modifyEventListener) {
            l()
        }
        if (f === false && n.modifySelectors) {
            o()
        }
    };
    n.add = function(v, t, u, s) {
        return d(v, t, u, s, "add")
    };
    n.remove = function(v, t, u, s) {
        return d(v, t, u, s, "remove")
    };
    n.returnFalse = function(s) {
        return false
    };
    n.stop = function(s) {
        if (!s) {
            return
        }
        if (s.stopPropagation) {
            s.stopPropagation()
        }
        s.cancelBubble = true;
        s.cancelBubbleCount = 0
    };
    n.prevent = function(s) {
        if (!s) {
            return
        }
        if (s.preventDefault) {
            s.preventDefault()
        } else {
            if (s.preventManipulation) {
                s.preventManipulation()
            } else {
                s.returnValue = false
            }
        }
    };
    n.cancel = function(s) {
        n.stop(s);
        n.prevent(s)
    };
    n.blur = function() {
        var s = document.activeElement;
        if (!s) {
            return
        }
        var t = document.activeElement.nodeName;
        if (t === "INPUT" || t === "TEXTAREA" || s.contentEditable === "true") {
            if (s.blur) {
                s.blur()
            }
        }
    };
    n.getEventSupport = function(u, t) {
        if (typeof(u) === "string") {
            t = u;
            u = window
        }
        t = "on" + t;
        if (t in u) {
            return true
        }
        if (!u.setAttribute) {
            u = document.createElement("div")
        }
        if (u.setAttribute && u.removeAttribute) {
            u.setAttribute(t, "");
            var s = typeof u[t] === "function";
            if (typeof u[t] !== "undefined") {
                u[t] = null
            }
            u.removeAttribute(t);
            return s
        }
    };
    var q = function(u) {
        if (!u || typeof(u) !== "object") {
            return u
        }
        var s = new u.constructor();
        for (var t in u) {
            if (!u[t] || typeof(u[t]) !== "object") {
                s[t] = u[t]
            } else {
                s[t] = q(u[t])
            }
        }
        return s
    };
    var d = function(S, u, v, R, D, N) {
        R = R || {};
        if (String(S) === "[object Object]") {
            var U = S;
            S = U.target;
            delete U.target;
            if (U.type && U.listener) {
                u = U.type;
                delete U.type;
                v = U.listener;
                delete U.listener;
                for (var V in U) {
                    R[V] = U[V]
                }
            } else {
                for (var w in U) {
                    var K = U[w];
                    if (typeof(K) === "function") {
                        continue
                    }
                    R[w] = K
                }
                var T = {};
                for (var V in U) {
                    var w = V.split(",");
                    var H = U[V];
                    var B = {};
                    for (var L in R) {
                        B[L] = R[L]
                    }
                    if (typeof(H) === "function") {
                        var v = H
                    } else {
                        if (typeof(H.listener) === "function") {
                            var v = H.listener;
                            for (var L in H) {
                                if (typeof(H[L]) === "function") {
                                    continue
                                }
                                B[L] = H[L]
                            }
                        } else {
                            continue
                        }
                    }
                    for (var J = 0; J < w.length; J++) {
                        T[V] = eventjs.add(S, w[J], v, B, D)
                    }
                }
                return T
            }
        }
        if (!S || !u || !v) {
            return
        }
        if (typeof(S) === "string" && u === "ready") {
            if (window.eventjs_stallOnReady) {
                u = "load";
                S = window
            } else {
                var x = (new Date()).getTime();
                var A = R.timeout;
                var I = R.interval || 1000 / 60;
                var O = window.setInterval(function() {
                    if ((new Date()).getTime() - x > A) {
                        window.clearInterval(O)
                    }
                    if (document.querySelector(S)) {
                        window.clearInterval(O);
                        setTimeout(v, 1)
                    }
                }, I);
                return
            }
        }
        if (typeof(S) === "string") {
            S = document.querySelectorAll(S);
            if (S.length === 0) {
                return b("Missing target on listener!", arguments)
            }
            if (S.length === 1) {
                S = S[0]
            }
        }
        var M;
        var s = {};
        if (S.length > 0 && S !== window) {
            for (var z = 0, G = S.length; z < G; z++) {
                M = d(S[z], u, v, q(R), D);
                if (M) {
                    s[z] = M
                }
            }
            return i(s)
        }
        if (typeof(u) === "string") {
            u = u.toLowerCase();
            if (u.indexOf(" ") !== -1) {
                u = u.split(" ")
            } else {
                if (u.indexOf(",") !== -1) {
                    u = u.split(",")
                }
            }
        }
        if (typeof(u) !== "string") {
            if (typeof(u.length) === "number") {
                for (var y = 0, E = u.length; y < E; y++) {
                    M = d(S, u[y], v, q(R), D);
                    if (M) {
                        s[u[y]] = M
                    }
                }
            } else {
                for (var V in u) {
                    if (typeof(u[V]) === "function") {
                        M = d(S, V, u[V], q(R), D)
                    } else {
                        M = d(S, V, u[V].listener, q(u[V]), D)
                    }
                    if (M) {
                        s[V] = M
                    }
                }
            }
            return i(s)
        } else {
            if (u.indexOf("on") === 0) {
                u = u.substr(2)
            }
        }
        if (typeof(S) !== "object") {
            return b("Target is not defined!", arguments)
        }
        if (typeof(v) !== "function") {
            return b("Listener is not a function!", arguments)
        }
        var Q = R.useCapture || false;
        var F = c(S) + "." + c(v) + "." + (Q ? 1 : 0);
        if (n.Gesture && n.Gesture._gestureHandlers[u]) {
            F = u + F;
            if (D === "remove") {
                if (!j[F]) {
                    return
                }
                j[F].remove();
                delete j[F]
            } else {
                if (D === "add") {
                    if (j[F]) {
                        j[F].add();
                        return j[F]
                    }
                    if (R.useCall && !n.modifyEventListener) {
                        var P = v;
                        v = function(Y, W) {
                            for (var X in W) {
                                Y[X] = W[X]
                            }
                            return P.call(S, Y)
                        }
                    }
                    R.gesture = u;
                    R.target = S;
                    R.listener = v;
                    R.fromOverwrite = N;
                    j[F] = n.proxy[u](R)
                }
            }
            return j[F]
        } else {
            var t = g(u);
            for (var J = 0, C; J < t.length; J++) {
                u = t[J];
                C = u + "." + F;
                if (D === "remove") {
                    if (!j[C]) {
                        continue
                    }
                    S[r](u, v, Q);
                    delete j[C]
                } else {
                    if (D === "add") {
                        if (j[C]) {
                            return j[C]
                        }
                        S[m](u, v, Q);
                        j[C] = {
                            id: C,
                            type: u,
                            target: S,
                            listener: v,
                            remove: function() {
                                for (var W = 0; W < t.length; W++) {
                                    n.remove(S, t[W], v, R)
                                }
                            }
                        }
                    }
                }
            }
            return j[C]
        }
    };
    var i = function(s) {
        return {
            remove: function() {
                for (var t in s) {
                    s[t].remove()
                }
            },
            add: function() {
                for (var t in s) {
                    s[t].add()
                }
            }
        }
    };
    var b = function(s, t) {
        if (typeof(console) === "undefined") {
            return
        }
        if (typeof(console.error) === "undefined") {
            return
        }
        console.error(s, t)
    };
    var p = {
        msPointer: ["MSPointerDown", "MSPointerMove", "MSPointerUp"],
        touch: ["touchstart", "touchmove", "touchend"],
        mouse: ["mousedown", "mousemove", "mouseup"]
    };
    var h = {
        MSPointerDown: 0,
        MSPointerMove: 1,
        MSPointerUp: 2,
        touchstart: 0,
        touchmove: 1,
        touchend: 2,
        mousedown: 0,
        mousemove: 1,
        mouseup: 2
    };
    var a = (function() {
        n.supports = {};
        if (window.navigator.msPointerEnabled) {
            n.supports.msPointer = true
        }
        if (n.getEventSupport("touchstart")) {
            n.supports.touch = true
        }
        if (n.getEventSupport("mousedown")) {
            n.supports.mouse = true
        }
    })();
    var g = (function() {
        return function(v) {
            var w = document.addEventListener ? "" : "on";
            var s = h[v];
            if (isFinite(s)) {
                var u = [];
                for (var t in n.supports) {
                    u.push(w + p[t][s])
                }
                return u
            } else {
                return [w + v]
            }
        }
    })();
    var j = {};
    var k = 0;
    var c = function(s) {
        if (s === window) {
            return "#window"
        }
        if (s === document) {
            return "#document"
        }
        if (!s.uniqueID) {
            s.uniqueID = "e" + k++
        }
        return s.uniqueID
    };
    var m = document.addEventListener ? "addEventListener" : "attachEvent";
    var r = document.removeEventListener ? "removeEventListener" : "detachEvent";
    n.createPointerEvent = function(t, z, s) {
        var w = z.gesture;
        var x = z.target;
        var A = t.changedTouches || n.proxy.getCoords(t);
        if (A.length) {
            var B = A[0];
            z.pointers = s ? [] : A;
            z.pageX = B.pageX;
            z.pageY = B.pageY;
            z.x = z.pageX;
            z.y = z.pageY
        }
        var v = document.createEvent("Event");
        v.initEvent(w, true, true);
        v.originalEvent = t;
        for (var u in z) {
            if (u === "target") {
                continue
            }
            v[u] = z[u]
        }
        var y = v.type;
        if (n.Gesture && n.Gesture._gestureHandlers[y]) {
            z.oldListener.call(x, v, z, false)
        }
    };
    var e = false;
    var l = function() {
        if (!window.HTMLElement) {
            return
        }
        var s = function(u) {
            var t = function(v) {
                var x = v + "EventListener";
                var w = u[x];
                u[x] = function(B, C, y) {
                    if (n.Gesture && n.Gesture._gestureHandlers[B]) {
                        var z = y;
                        if (typeof(y) === "object") {
                            z.useCall = true
                        } else {
                            z = {
                                useCall: true,
                                useCapture: y
                            }
                        }
                        d(this, B, C, z, v, true)
                    } else {
                        var A = g(B);
                        for (var D = 0; D < A.length; D++) {
                            w.call(this, A[D], C, y)
                        }
                    }
                }
            };
            t("add");
            t("remove")
        };
        if (navigator.userAgent.match(/Firefox/)) {
            s(HTMLDivElement.prototype);
            s(HTMLCanvasElement.prototype)
        } else {
            s(HTMLElement.prototype)
        }
        s(document);
        s(window)
    };
    var f = false;
    var o = function() {
        var s = NodeList.prototype;
        s.removeEventListener = function(u, w, t) {
            for (var x = 0, v = this.length; x < v; x++) {
                this[x].removeEventListener(u, w, t)
            }
        };
        s.addEventListener = function(u, w, t) {
            for (var x = 0, v = this.length; x < v; x++) {
                this[x].addEventListener(u, w, t)
            }
        }
    };
    return n
})(eventjs);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    a.pointerSetup = function(f, e) {
        f.target = f.target || window;
        f.doc = f.target.ownerDocument || f.target;
        f.minFingers = f.minFingers || f.fingers || 1;
        f.maxFingers = f.maxFingers || f.fingers || Infinity;
        f.position = f.position || "relative";
        delete f.fingers;
        e = e || {};
        e.enabled = true;
        e.gesture = f.gesture;
        e.target = f.target;
        e.env = f.env;
        if (eventjs.modifyEventListener && f.fromOverwrite) {
            f.oldListener = f.listener;
            f.listener = eventjs.createPointerEvent
        }
        var d = 0;
        var g = e.gesture.indexOf("pointer") === 0 && eventjs.modifyEventListener ? "pointer" : "mouse";
        if (f.oldListener) {
            e.oldListener = f.oldListener
        }
        e.listener = f.listener;
        e.proxy = function(h) {
            e.defaultListener = f.listener;
            f.listener = h;
            h(f.event, e)
        };
        e.add = function() {
            if (e.enabled === true) {
                return
            }
            if (f.onPointerDown) {
                eventjs.add(f.target, g + "down", f.onPointerDown)
            }
            if (f.onPointerMove) {
                eventjs.add(f.doc, g + "move", f.onPointerMove)
            }
            if (f.onPointerUp) {
                eventjs.add(f.doc, g + "up", f.onPointerUp)
            }
            e.enabled = true
        };
        e.remove = function() {
            if (e.enabled === false) {
                return
            }
            if (f.onPointerDown) {
                eventjs.remove(f.target, g + "down", f.onPointerDown)
            }
            if (f.onPointerMove) {
                eventjs.remove(f.doc, g + "move", f.onPointerMove)
            }
            if (f.onPointerUp) {
                eventjs.remove(f.doc, g + "up", f.onPointerUp)
            }
            e.reset();
            e.enabled = false
        };
        e.pause = function(h) {
            if (f.onPointerMove && (!h || h.move)) {
                eventjs.remove(f.doc, g + "move", f.onPointerMove)
            }
            if (f.onPointerUp && (!h || h.up)) {
                eventjs.remove(f.doc, g + "up", f.onPointerUp)
            }
            d = f.fingers;
            f.fingers = 0
        };
        e.resume = function(h) {
            if (f.onPointerMove && (!h || h.move)) {
                eventjs.add(f.doc, g + "move", f.onPointerMove)
            }
            if (f.onPointerUp && (!h || h.up)) {
                eventjs.add(f.doc, g + "up", f.onPointerUp)
            }
            f.fingers = d
        };
        e.reset = function() {
            f.tracker = {};
            f.fingers = 0
        };
        return e
    };
    var b = eventjs.supports;
    eventjs.isMouse = !!b.mouse;
    eventjs.isMSPointer = !!b.touch;
    eventjs.isTouch = !!b.msPointer;
    a.pointerStart = function(e, r, o) {
        var p = (e.type || "mousedown").toUpperCase();
        if (p.indexOf("MOUSE") === 0) {
            eventjs.isMouse = true;
            eventjs.isTouch = false;
            eventjs.isMSPointer = false
        } else {
            if (p.indexOf("TOUCH") === 0) {
                eventjs.isMouse = false;
                eventjs.isTouch = true;
                eventjs.isMSPointer = false
            } else {
                if (p.indexOf("MSPOINTER") === 0) {
                    eventjs.isMouse = false;
                    eventjs.isTouch = false;
                    eventjs.isMSPointer = true
                }
            }
        }
        var k = function(z, t) {
            var v = o.bbox;
            var u = h[t] = {};
            switch (o.position) {
                case "absolute":
                    u.offsetX = 0;
                    u.offsetY = 0;
                    break;
                case "differenceFromLast":
                    u.offsetX = z.pageX;
                    u.offsetY = z.pageY;
                    break;
                case "difference":
                    u.offsetX = z.pageX;
                    u.offsetY = z.pageY;
                    break;
                case "move":
                    u.offsetX = z.pageX - v.x1;
                    u.offsetY = z.pageY - v.y1;
                    break;
                default:
                    u.offsetX = v.x1 - v.scrollLeft;
                    u.offsetY = v.y1 - v.scrollTop;
                    break
            }
            var i = z.pageX - u.offsetX;
            var w = z.pageY - u.offsetY;
            u.rotation = 0;
            u.scale = 1;
            u.startTime = u.moveTime = (new Date()).getTime();
            u.move = {
                x: i,
                y: w
            };
            u.start = {
                x: i,
                y: w
            };
            o.fingers++
        };
        o.event = e;
        if (r.defaultListener) {
            o.listener = r.defaultListener;
            delete r.defaultListener
        }
        var s = !o.fingers;
        var h = o.tracker;
        var n = e.changedTouches || a.getCoords(e);
        var g = n.length;
        for (var m = 0; m < g; m++) {
            var l = n[m];
            var f = l.identifier || Infinity;
            if (o.fingers) {
                if (o.fingers >= o.maxFingers) {
                    var d = [];
                    for (var f in o.tracker) {
                        d.push(f)
                    }
                    r.identifier = d.join(",");
                    return s
                }
                var j = 0;
                for (var q in h) {
                    if (h[q].up) {
                        delete h[q];
                        k(l, f);
                        o.cancel = true;
                        break
                    }
                    j++
                }
                if (h[f]) {
                    continue
                }
                k(l, f)
            } else {
                h = o.tracker = {};
                r.bbox = o.bbox = a.getBoundingBox(o.target);
                o.fingers = 0;
                o.cancel = false;
                k(l, f)
            }
        }
        var d = [];
        for (var f in o.tracker) {
            d.push(f)
        }
        r.identifier = d.join(",");
        return s
    };
    a.pointerEnd = function(e, p, n, j) {
        var m = e.touches || [];
        var h = m.length;
        var o = {};
        for (var l = 0; l < h; l++) {
            var k = m[l];
            var f = k.identifier;
            o[f || Infinity] = true
        }
        for (var f in n.tracker) {
            var g = n.tracker[f];
            if (o[f] || g.up) {
                continue
            }
            if (j) {
                j({
                    pageX: g.pageX,
                    pageY: g.pageY,
                    changedTouches: [{
                        pageX: g.pageX,
                        pageY: g.pageY,
                        identifier: f === "Infinity" ? Infinity : f
                    }]
                }, "up")
            }
            g.up = true;
            n.fingers--
        }
        if (n.fingers !== 0) {
            return false
        }
        var d = [];
        n.gestureFingers = 0;
        for (var f in n.tracker) {
            n.gestureFingers++;
            d.push(f)
        }
        p.identifier = d.join(",");
        return true
    };
    a.getCoords = function(d) {
        if (typeof(d.pageX) !== "undefined") {
            a.getCoords = function(e) {
                return Array({
                    type: "mouse",
                    x: e.pageX,
                    y: e.pageY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    identifier: e.pointerId || Infinity
                })
            }
        } else {
            a.getCoords = function(e) {
                var f = document.documentElement;
                e = e || window.event;
                return Array({
                    type: "mouse",
                    x: e.clientX + f.scrollLeft,
                    y: e.clientY + f.scrollTop,
                    pageX: e.clientX + f.scrollLeft,
                    pageY: e.clientY + f.scrollTop,
                    identifier: Infinity
                })
            }
        }
        return a.getCoords(d)
    };
    a.getCoord = function(f) {
        if ("ontouchstart" in window) {
            var e = 0;
            var d = 0;
            a.getCoord = function(g) {
                var h = g.changedTouches;
                if (h && h.length) {
                    return {
                        x: e = h[0].pageX,
                        y: d = h[0].pageY
                    }
                } else {
                    return {
                        x: e,
                        y: d
                    }
                }
            }
        } else {
            if (typeof(f.pageX) !== "undefined" && typeof(f.pageY) !== "undefined") {
                a.getCoord = function(g) {
                    return {
                        x: g.pageX,
                        y: g.pageY
                    }
                }
            } else {
                a.getCoord = function(g) {
                    var h = document.documentElement;
                    g = g || window.event;
                    return {
                        x: g.clientX + h.scrollLeft,
                        y: g.clientY + h.scrollTop
                    }
                }
            }
        }
        return a.getCoord(f)
    };
    var c = function(e, d) {
        var f = parseFloat(e.getPropertyValue(d), 10);
        return isFinite(f) ? f : 0
    };
    a.getBoundingBox = function(g) {
        if (g === window || g === document) {
            g = document.body
        }
        var n = {};
        var m = g.getBoundingClientRect();
        n.width = m.width;
        n.height = m.height;
        n.x1 = m.left;
        n.y1 = m.top;
        n.scaleX = m.width / g.offsetWidth || 1;
        n.scaleY = m.height / g.offsetHeight || 1;
        n.scrollLeft = 0;
        n.scrollTop = 0;
        var f = window.getComputedStyle(g);
        var e = f.getPropertyValue("box-sizing") === "border-box";
        if (e === false) {
            var h = c(f, "border-left-width");
            var l = c(f, "border-right-width");
            var d = c(f, "border-bottom-width");
            var k = c(f, "border-top-width");
            n.border = [h, l, k, d];
            n.x1 += h;
            n.y1 += k;
            n.width -= l + h;
            n.height -= d + k
        }
        n.x2 = n.x1 + n.width;
        n.y2 = n.y1 + n.height;
        var j = f.getPropertyValue("position");
        var i = j === "fixed" ? g : g.parentNode;
        while (i !== null) {
            if (i === document.body) {
                break
            }
            if (i.scrollTop === undefined) {
                break
            }
            var f = window.getComputedStyle(i);
            var j = f.getPropertyValue("position");
            if (j === "absolute") {} else {
                if (j === "fixed") {
                    n.scrollTop -= i.parentNode.scrollTop;
                    n.scrollLeft -= i.parentNode.scrollLeft;
                    break
                } else {
                    n.scrollLeft += i.scrollLeft;
                    n.scrollTop += i.scrollTop
                }
            }
            i = i.parentNode
        }
        n.scrollBodyLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        n.scrollBodyTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        n.scrollLeft -= n.scrollBodyLeft;
        n.scrollTop -= n.scrollBodyTop;
        return n
    };
    (function() {
        var e = navigator.userAgent.toLowerCase();
        var f = e.indexOf("macintosh") !== -1;
        var d;
        if (f && e.indexOf("khtml") !== -1) {
            d = {
                91: true,
                93: true
            }
        } else {
            if (f && e.indexOf("firefox") !== -1) {
                d = {
                    224: true
                }
            } else {
                d = {
                    17: true
                }
            }
        }(a.metaTrackerReset = function() {
            eventjs.fnKey = a.fnKey = false;
            eventjs.metaKey = a.metaKey = false;
            eventjs.escKey = a.escKey = false;
            eventjs.ctrlKey = a.ctrlKey = false;
            eventjs.shiftKey = a.shiftKey = false;
            eventjs.altKey = a.altKey = false
        })();
        a.metaTracker = function(h) {
            var g = h.type === "keydown";
            if (h.keyCode === 27) {
                eventjs.escKey = a.escKey = g
            }
            if (d[h.keyCode]) {
                eventjs.metaKey = a.metaKey = g
            }
            eventjs.ctrlKey = a.ctrlKey = h.ctrlKey;
            eventjs.shiftKey = a.shiftKey = h.shiftKey;
            eventjs.altKey = a.altKey = h.altKey
        }
    })();
    return a
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
eventjs.MutationObserver = (function() {
    var b = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var a = !b && (function() {
        var e = document.createElement("p");
        var c = false;
        var d = function() {
            c = true
        };
        if (e.addEventListener) {
            e.addEventListener("DOMAttrModified", d, false)
        } else {
            if (e.attachEvent) {
                e.attachEvent("onDOMAttrModified", d)
            } else {
                return false
            }
        }
        e.setAttribute("id", "target");
        return c
    })();
    return function(c, f) {
        if (b) {
            var e = {
                subtree: false,
                attributes: true
            };
            var d = new b(function(g) {
                g.forEach(function(h) {
                    f.call(h.target, h.attributeName)
                })
            });
            d.observe(c, e)
        } else {
            if (a) {
                eventjs.add(c, "DOMAttrModified", function(g) {
                    f.call(c, g.attrName)
                })
            } else {
                if ("onpropertychange" in document.body) {
                    eventjs.add(c, "propertychange", function(g) {
                        f.call(c, window.event.propertyName)
                    })
                }
            }
        }
    }
})();
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    a.click = function(c) {
        c.gesture = c.gesture || "click";
        c.maxFingers = c.maxFingers || c.fingers || 1;
        c.onPointerDown = function(d) {
            if (a.pointerStart(d, b, c)) {
                eventjs.add(c.target, "mouseup", c.onPointerUp)
            }
        };
        c.onPointerUp = function(e) {
            if (a.pointerEnd(e, b, c)) {
                eventjs.remove(c.target, "mouseup", c.onPointerUp);
                var k = e.changedTouches || a.getCoords(e);
                var d = k[0];
                var l = c.bbox;
                var f = a.getBoundingBox(c.target);
                var g = d.pageY - f.scrollBodyTop;
                var h = d.pageX - f.scrollBodyLeft;
                if (h > l.x1 && g > l.y1 && h < l.x2 && g < l.y2 && l.scrollTop === f.scrollTop) {
                    for (var j in c.tracker) {
                        break
                    }
                    var i = c.tracker[j];
                    b.x = i.start.x;
                    b.y = i.start.y;
                    c.listener(e, b)
                }
            }
        };
        var b = a.pointerSetup(c);
        b.state = "click";
        eventjs.add(c.target, "mousedown", c.onPointerDown);
        return b
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.click = a.click;
    return a
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    a.dbltap = a.dblclick = function(f) {
        f.gesture = f.gesture || "dbltap";
        f.maxFingers = f.maxFingers || f.fingers || 1;
        var e = 700;
        var i, h, g;
        var d, c;
        f.onPointerDown = function(k) {
            var j = k.changedTouches || a.getCoords(k);
            if (i && !h) {
                c = j[0];
                h = (new Date()).getTime() - i
            } else {
                d = j[0];
                i = (new Date()).getTime();
                h = 0;
                clearTimeout(g);
                g = setTimeout(function() {
                    i = 0
                }, e)
            }
            if (a.pointerStart(k, b, f)) {
                eventjs.add(f.target, "mousemove", f.onPointerMove).listener(k);
                eventjs.add(f.target, "mouseup", f.onPointerUp)
            }
        };
        f.onPointerMove = function(l) {
            if (i && !h) {
                var j = l.changedTouches || a.getCoords(l);
                c = j[0]
            }
            var n = f.bbox;
            var m = (c.pageX - n.x1);
            var k = (c.pageY - n.y1);
            if (!(m > 0 && m < n.width && k > 0 && k < n.height && Math.abs(c.pageX - d.pageX) <= 25 && Math.abs(c.pageY - d.pageY) <= 25)) {
                eventjs.remove(f.target, "mousemove", f.onPointerMove);
                clearTimeout(g);
                i = h = 0
            }
        };
        f.onPointerUp = function(l) {
            if (a.pointerEnd(l, b, f)) {
                eventjs.remove(f.target, "mousemove", f.onPointerMove);
                eventjs.remove(f.target, "mouseup", f.onPointerUp)
            }
            if (i && h) {
                if (h <= e) {
                    b.state = f.gesture;
                    for (var k in f.tracker) {
                        break
                    }
                    var j = f.tracker[k];
                    b.x = j.start.x;
                    b.y = j.start.y;
                    f.listener(l, b)
                }
                clearTimeout(g);
                i = h = 0
            }
        };
        var b = a.pointerSetup(f);
        b.state = "dblclick";
        eventjs.add(f.target, "mousedown", f.onPointerDown);
        return b
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.dbltap = a.dbltap;
    eventjs.Gesture._gestureHandlers.dblclick = a.dblclick;
    return a
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    a.dragElement = function(c, b) {
        a.drag({
            event: b,
            target: c,
            position: "move",
            listener: function(e, d) {
                c.style.left = d.x + "px";
                c.style.top = d.y + "px";
                eventjs.prevent(e)
            }
        })
    };
    a.drag = function(c) {
        c.gesture = "drag";
        c.onPointerDown = function(d) {
            if (a.pointerStart(d, b, c)) {
                if (!c.monitor) {
                    eventjs.add(c.doc, "mousemove", c.onPointerMove);
                    eventjs.add(c.doc, "mouseup", c.onPointerUp)
                }
            }
            c.onPointerMove(d, "down")
        };
        c.onPointerMove = function(e, d) {
            if (!c.tracker) {
                return c.onPointerDown(e)
            }
            var l = c.bbox;
            var j = e.changedTouches || a.getCoords(e);
            var f = j.length;
            for (var h = 0; h < f; h++) {
                var g = j[h];
                var k = g.identifier || Infinity;
                var m = c.tracker[k];
                if (!m) {
                    continue
                }
                m.pageX = g.pageX;
                m.pageY = g.pageY;
                b.state = d || "move";
                b.identifier = k;
                b.start = m.start;
                b.fingers = c.fingers;
                if (c.position === "differenceFromLast") {
                    b.x = (m.pageX - m.offsetX);
                    b.y = (m.pageY - m.offsetY);
                    m.offsetX = m.pageX;
                    m.offsetY = m.pageY
                } else {
                    b.x = (m.pageX - m.offsetX);
                    b.y = (m.pageY - m.offsetY)
                }
                c.listener(e, b)
            }
        };
        c.onPointerUp = function(d) {
            if (a.pointerEnd(d, b, c, c.onPointerMove)) {
                if (!c.monitor) {
                    eventjs.remove(c.doc, "mousemove", c.onPointerMove);
                    eventjs.remove(c.doc, "mouseup", c.onPointerUp)
                }
            }
        };
        var b = a.pointerSetup(c);
        if (c.event) {
            c.onPointerDown(c.event)
        } else {
            eventjs.add(c.target, "mousedown", c.onPointerDown);
            if (c.monitor) {
                eventjs.add(c.doc, "mousemove", c.onPointerMove);
                eventjs.add(c.doc, "mouseup", c.onPointerUp)
            }
        }
        return b
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.drag = a.drag;
    return a
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(b) {
    var c = Math.PI / 180;
    var a = function(g, h) {
        var f = 0;
        var e = 0;
        var i = 0;
        for (var d in h) {
            var j = h[d];
            if (j.up) {
                continue
            }
            f += j.move.x;
            e += j.move.y;
            i++
        }
        g.x = f /= i;
        g.y = e /= i;
        return g
    };
    b.gesture = function(e) {
        e.gesture = e.gesture || "gesture";
        e.minFingers = e.minFingers || e.fingers || 2;
        e.onPointerDown = function(i) {
            var g = e.fingers;
            if (b.pointerStart(i, d, e)) {
                eventjs.add(e.doc, "mousemove", e.onPointerMove);
                eventjs.add(e.doc, "mouseup", e.onPointerUp)
            }
            if (e.fingers === e.minFingers && g !== e.fingers) {
                d.fingers = e.minFingers;
                d.scale = 1;
                d.rotation = 0;
                d.state = "start";
                var f = "";
                for (var h in e.tracker) {
                    f += h
                }
                d.identifier = parseInt(f);
                a(d, e.tracker);
                e.listener(i, d)
            }
        };
        e.onPointerMove = function(s, l) {
            var f = e.bbox;
            var u = e.tracker;
            var p = s.changedTouches || b.getCoords(s);
            var g = p.length;
            for (var v = 0; v < g; v++) {
                var m = p[v];
                var j = m.identifier || Infinity;
                var q = u[j];
                if (!q) {
                    continue
                }
                q.move.x = (m.pageX - f.x1);
                q.move.y = (m.pageY - f.y1)
            }
            if (e.fingers < e.minFingers) {
                return
            }
            var p = [];
            var x = 0;
            var r = 0;
            a(d, u);
            for (var j in u) {
                var m = u[j];
                if (m.up) {
                    continue
                }
                var k = m.start;
                if (!k.distance) {
                    var o = k.x - d.x;
                    var n = k.y - d.y;
                    k.distance = Math.sqrt(o * o + n * n);
                    k.angle = Math.atan2(o, n) / c
                }
                var o = m.move.x - d.x;
                var n = m.move.y - d.y;
                var h = Math.sqrt(o * o + n * n);
                x += h / k.distance;
                var w = Math.atan2(o, n) / c;
                var t = (k.angle - w + 360) % 360 - 180;
                m.DEG2 = m.DEG1;
                m.DEG1 = t > 0 ? t : -t;
                if (typeof(m.DEG2) !== "undefined") {
                    if (t > 0) {
                        m.rotation += m.DEG1 - m.DEG2
                    } else {
                        m.rotation -= m.DEG1 - m.DEG2
                    }
                    r += m.rotation
                }
                p.push(m.move)
            }
            d.touches = p;
            d.fingers = e.fingers;
            d.scale = x / e.fingers;
            d.rotation = r / e.fingers;
            d.state = "change";
            e.listener(s, d)
        };
        e.onPointerUp = function(g) {
            var f = e.fingers;
            if (b.pointerEnd(g, d, e)) {
                eventjs.remove(e.doc, "mousemove", e.onPointerMove);
                eventjs.remove(e.doc, "mouseup", e.onPointerUp)
            }
            if (f === e.minFingers && e.fingers < e.minFingers) {
                d.fingers = e.fingers;
                d.state = "end";
                e.listener(g, d)
            }
        };
        var d = b.pointerSetup(e);
        eventjs.add(e.target, "mousedown", e.onPointerDown);
        return d
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.gesture = b.gesture;
    return b
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    a.pointerdown = a.pointermove = a.pointerup = function(d) {
        d.gesture = d.gesture || "pointer";
        if (d.target.isPointerEmitter) {
            return
        }
        var b = true;
        d.onPointerDown = function(e) {
            b = false;
            c.gesture = "pointerdown";
            d.listener(e, c)
        };
        d.onPointerMove = function(e) {
            c.gesture = "pointermove";
            d.listener(e, c, b)
        };
        d.onPointerUp = function(e) {
            b = true;
            c.gesture = "pointerup";
            d.listener(e, c, true)
        };
        var c = a.pointerSetup(d);
        eventjs.add(d.target, "mousedown", d.onPointerDown);
        eventjs.add(d.target, "mousemove", d.onPointerMove);
        eventjs.add(d.doc, "mouseup", d.onPointerUp);
        d.target.isPointerEmitter = true;
        return c
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.pointerdown = a.pointerdown;
    eventjs.Gesture._gestureHandlers.pointermove = a.pointermove;
    eventjs.Gesture._gestureHandlers.pointerup = a.pointerup;
    return a
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    a.shake = function(f) {
        var k = {
            gesture: "devicemotion",
            acceleration: {},
            accelerationIncludingGravity: {},
            target: f.target,
            listener: f.listener,
            remove: function() {
                window.removeEventListener("devicemotion", e, false)
            }
        };
        var d = 4;
        var g = 1000;
        var h = 200;
        var b = 3;
        var c = (new Date()).getTime();
        var j = {
            x: 0,
            y: 0,
            z: 0
        };
        var i = {
            x: {
                count: 0,
                value: 0
            },
            y: {
                count: 0,
                value: 0
            },
            z: {
                count: 0,
                value: 0
            }
        };
        var e = function(w) {
            var s = 0.8;
            var m = w.accelerationIncludingGravity;
            j.x = s * j.x + (1 - s) * m.x;
            j.y = s * j.y + (1 - s) * m.y;
            j.z = s * j.z + (1 - s) * m.z;
            k.accelerationIncludingGravity = j;
            k.acceleration.x = m.x - j.x;
            k.acceleration.y = m.y - j.y;
            k.acceleration.z = m.z - j.z;
            if (f.gesture === "devicemotion") {
                f.listener(w, k);
                return
            }
            var t = "xyz";
            var l = (new Date()).getTime();
            for (var q = 0, p = t.length; q < p; q++) {
                var r = t[q];
                var v = k.acceleration[r];
                var u = i[r];
                var z = Math.abs(v);
                if (l - c < g) {
                    continue
                }
                if (z > d) {
                    var y = l * v / z;
                    var x = Math.abs(y + u.value);
                    if (u.value && x < h) {
                        u.value = y;
                        u.count++;
                        if (u.count === b) {
                            f.listener(w, k);
                            c = l;
                            u.value = 0;
                            u.count = 0
                        }
                    } else {
                        u.value = y;
                        u.count = 1
                    }
                }
            }
        };
        if (!window.addEventListener) {
            return
        }
        window.addEventListener("devicemotion", e, false);
        return k
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.shake = a.shake;
    return a
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    var b = Math.PI / 180;
    a.swipe = function(d) {
        d.snap = d.snap || 90;
        d.threshold = d.threshold || 1;
        d.gesture = d.gesture || "swipe";
        d.onPointerDown = function(e) {
            if (a.pointerStart(e, c, d)) {
                eventjs.add(d.doc, "mousemove", d.onPointerMove).listener(e);
                eventjs.add(d.doc, "mouseup", d.onPointerUp)
            }
        };
        d.onPointerMove = function(h) {
            var j = h.changedTouches || a.getCoords(h);
            var g = j.length;
            for (var f = 0; f < g; f++) {
                var l = j[f];
                var e = l.identifier || Infinity;
                var k = d.tracker[e];
                if (!k) {
                    continue
                }
                k.move.x = l.pageX;
                k.move.y = l.pageY;
                k.moveTime = (new Date()).getTime()
            }
        };
        d.onPointerUp = function(g) {
            if (a.pointerEnd(g, c, d)) {
                eventjs.remove(d.doc, "mousemove", d.onPointerMove);
                eventjs.remove(d.doc, "mouseup", d.onPointerUp);
                var r;
                var q;
                var m;
                var j;
                var i = {
                    x: 0,
                    y: 0
                };
                var t = 0;
                var s = 0;
                var l = 0;
                for (var h in d.tracker) {
                    var p = d.tracker[h];
                    var n = p.move.x - p.start.x;
                    var k = p.move.y - p.start.y;
                    t += p.move.x;
                    s += p.move.y;
                    i.x += p.start.x;
                    i.y += p.start.y;
                    l++;
                    var f = Math.sqrt(n * n + k * k);
                    var e = p.moveTime - p.startTime;
                    var j = Math.atan2(n, k) / b + 180;
                    var q = e ? f / e : 0;
                    if (typeof(m) === "undefined") {
                        m = j;
                        r = q
                    } else {
                        if (Math.abs(j - m) <= 20) {
                            m = (m + j) / 2;
                            r = (r + q) / 2
                        } else {
                            return
                        }
                    }
                }
                var o = d.gestureFingers;
                if (d.minFingers <= o && d.maxFingers >= o) {
                    if (r > d.threshold) {
                        i.x /= l;
                        i.y /= l;
                        c.start = i;
                        c.x = t / l;
                        c.y = s / l;
                        c.angle = -((((m / d.snap + 0.5) >> 0) * d.snap || 360) - 360);
                        c.velocity = r;
                        c.fingers = o;
                        c.state = "swipe";
                        d.listener(g, c)
                    }
                }
            }
        };
        var c = a.pointerSetup(d);
        eventjs.add(d.target, "mousedown", d.onPointerDown);
        return c
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.swipe = a.swipe;
    return a
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    a.longpress = function(b) {
        b.gesture = "longpress";
        return a.tap(b)
    };
    a.tap = function(c) {
        c.delay = c.delay || 500;
        c.timeout = c.timeout || 250;
        c.driftDeviance = c.driftDeviance || 10;
        c.gesture = c.gesture || "tap";
        var e, d;
        c.onPointerDown = function(f) {
            if (a.pointerStart(f, b, c)) {
                e = (new Date()).getTime();
                eventjs.add(c.doc, "mousemove", c.onPointerMove).listener(f);
                eventjs.add(c.doc, "mouseup", c.onPointerUp);
                if (c.gesture !== "longpress") {
                    return
                }
                d = setTimeout(function() {
                    if (f.cancelBubble && ++f.cancelBubbleCount > 1) {
                        return
                    }
                    var h = 0;
                    for (var i in c.tracker) {
                        var g = c.tracker[i];
                        if (g.end === true) {
                            return
                        }
                        if (c.cancel) {
                            return
                        }
                        h++
                    }
                    if (c.minFingers <= h && c.maxFingers >= h) {
                        b.state = "start";
                        b.fingers = h;
                        b.x = g.start.x;
                        b.y = g.start.y;
                        c.listener(f, b)
                    }
                }, c.delay)
            }
        };
        c.onPointerMove = function(g) {
            var p = c.bbox;
            var l = g.changedTouches || a.getCoords(g);
            var h = l.length;
            for (var k = 0; k < h; k++) {
                var j = l[k];
                var m = j.identifier || Infinity;
                var s = c.tracker[m];
                if (!s) {
                    continue
                }
                var o = (j.pageX - p.x1);
                var n = (j.pageY - p.y1);
                var r = o - s.start.x;
                var q = n - s.start.y;
                var f = Math.sqrt(r * r + q * q);
                if (!(o > 0 && o < p.width && n > 0 && n < p.height && f <= c.driftDeviance)) {
                    eventjs.remove(c.doc, "mousemove", c.onPointerMove);
                    c.cancel = true;
                    return
                }
            }
        };
        c.onPointerUp = function(g) {
            if (a.pointerEnd(g, b, c)) {
                clearTimeout(d);
                eventjs.remove(c.doc, "mousemove", c.onPointerMove);
                eventjs.remove(c.doc, "mouseup", c.onPointerUp);
                if (g.cancelBubble && ++g.cancelBubbleCount > 1) {
                    return
                }
                if (c.gesture === "longpress") {
                    if (b.state === "start") {
                        b.state = "end";
                        c.listener(g, b)
                    }
                    return
                }
                if (c.cancel) {
                    return
                }
                if ((new Date()).getTime() - e > c.timeout) {
                    return
                }
                var f = c.gestureFingers;
                if (c.minFingers <= f && c.maxFingers >= f) {
                    b.state = "tap";
                    b.fingers = c.gestureFingers;
                    c.listener(g, b)
                }
            }
        };
        var b = a.pointerSetup(c);
        eventjs.add(c.target, "mousedown", c.onPointerDown);
        return b
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.tap = a.tap;
    eventjs.Gesture._gestureHandlers.longpress = a.longpress;
    return a
})(eventjs.proxy);
if (typeof(eventjs) === "undefined") {
    var eventjs = {}
}
if (typeof(eventjs.proxy) === "undefined") {
    eventjs.proxy = {}
}
eventjs.proxy = (function(a) {
    a.wheelPreventElasticBounce = function(b) {
        if (!b) {
            return
        }
        if (typeof(b) === "string") {
            b = document.querySelector(b)
        }
        eventjs.add(b, "wheel", function(d, c) {
            c.preventElasticBounce();
            eventjs.stop(d)
        })
    };
    a.wheel = function(f) {
        var c;
        var h = f.timeout || 150;
        var e = 0;
        var j = {
            gesture: "wheel",
            state: "start",
            wheelDelta: 0,
            target: f.target,
            listener: f.listener,
            preventElasticBounce: function(l) {
                var o = this.target;
                var n = o.scrollTop;
                var m = n + o.offsetHeight;
                var k = o.scrollHeight;
                if (m === k && this.wheelDelta <= 0) {
                    eventjs.cancel(l)
                } else {
                    if (n === 0 && this.wheelDelta >= 0) {
                        eventjs.cancel(l)
                    }
                }
                eventjs.stop(l)
            },
            add: function() {
                f.target[i](g, b, false)
            },
            remove: function() {
                f.target[d](g, b, false)
            }
        };
        var b = function(k) {
            k = k || window.event;
            j.state = e++ ? "change" : "start";
            j.wheelDelta = k.detail ? k.detail * -20 : k.wheelDelta;
            f.listener(k, j);
            clearTimeout(c);
            c = setTimeout(function() {
                e = 0;
                j.state = "end";
                j.wheelDelta = 0;
                f.listener(k, j)
            }, h)
        };
        var i = document.addEventListener ? "addEventListener" : "attachEvent";
        var d = document.removeEventListener ? "removeEventListener" : "detachEvent";
        var g = eventjs.getEventSupport("mousewheel") ? "mousewheel" : "DOMMouseScroll";
        f.target[i](g, b, false);
        return j
    };
    eventjs.Gesture = eventjs.Gesture || {};
    eventjs.Gesture._gestureHandlers = eventjs.Gesture._gestureHandlers || {};
    eventjs.Gesture._gestureHandlers.wheel = a.wheel;
    return a
})(eventjs.proxy);
if (typeof(Event) === "undefined") {
    var Event = {}
}
if (typeof(Event.proxy) === "undefined") {
    Event.proxy = {}
}
Event.proxy = (function(a) {
    a.orientation = function(c) {
        var b = {
            gesture: "orientationchange",
            previous: null,
            current: window.orientation,
            target: c.target,
            listener: c.listener,
            remove: function() {
                window.removeEventListener("orientationchange", d, false)
            }
        };
        var d = function(f) {
            b.previous = b.current;
            b.current = window.orientation;
            if (b.previous !== null && b.previous != b.current) {
                c.listener(f, b);
                return
            }
        };
        if (window.DeviceOrientationEvent) {
            window.addEventListener("orientationchange", d, false)
        }
        return b
    };
    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.orientation = a.orientation;
    return a
})(Event.proxy);
(function() {
    function e(g, h) {
        if (!this.__eventListeners[g]) {
            return
        }
        var f = this.__eventListeners[g];
        if (h) {
            f[f.indexOf(h)] = false
        } else {
            fabric.util.array.fill(f, false)
        }
    }

    function d(f, g) {
        if (!this.__eventListeners) {
            this.__eventListeners = {}
        }
        if (arguments.length === 1) {
            for (var h in f) {
                this.on(h, f[h])
            }
        } else {
            if (!this.__eventListeners[f]) {
                this.__eventListeners[f] = []
            }
            this.__eventListeners[f].push(g)
        }
        return this
    }

    function a(f, g) {
        if (!this.__eventListeners) {
            return
        }
        if (arguments.length === 0) {
            for (f in this.__eventListeners) {
                e.call(this, f)
            }
        } else {
            if (arguments.length === 1 && typeof arguments[0] === "object") {
                for (var h in f) {
                    e.call(this, h, f[h])
                }
            } else {
                e.call(this, f, g)
            }
        }
        return this
    }

    function b(h, j) {
        if (!this.__eventListeners) {
            return
        }
        var g = this.__eventListeners[h];
        if (!g) {
            return
        }
        for (var k = 0, f = g.length; k < f; k++) {
            g[k] && g[k].call(this, j || {})
        }
        this.__eventListeners[h] = g.filter(function(i) {
            return i !== false
        });
        return this
    }

    function c(h) {
        if (!this.__eventListeners) {
            return false
        }
        if (!this.__eventListeners[h]) {
            return false
        } else {
            var g = this.__eventListeners[h];
            for (var j = 0, f = g.length; j < f; j++) {
                if (g[j]) {
                    return true
                }
            }
            return false
        }
    }
    fabric.Observable = {
        observe: d,
        stopObserving: a,
        fire: b,
        on: d,
        off: a,
        trigger: b,
        isListening: c
    }
})();
fabric.Collection = {
    _objects: [],
    add: function() {
        this._objects.push.apply(this._objects, arguments);
        if (this._onObjectAdded) {
            for (var a = 0, b = arguments.length; a < b; a++) {
                this._onObjectAdded(arguments[a])
            }
        }
        this.renderOnAddRemove && this.renderAll();
        return this
    },
    insertAt: function(b, a, d) {
        var c = this.getObjects();
        if (d) {
            c[a] = b
        } else {
            c.splice(a, 0, b)
        }
        this._onObjectAdded && this._onObjectAdded(b);
        this.renderOnAddRemove && this.renderAll();
        return this
    },
    remove: function() {
        var e = this.getObjects(),
            b, a = false;
        for (var c = 0, d = arguments.length; c < d; c++) {
            b = e.indexOf(arguments[c]);
            if (b !== -1) {
                a = true;
                e.splice(b, 1);
                this._onObjectRemoved && this._onObjectRemoved(arguments[c])
            }
        }
        this.renderOnAddRemove && a && this.renderAll();
        return this
    },
    removeStartingAt: function(b) {
        var e = this.getObjects();
        var a = e.splice(b);
        for (var c = 0, d = a.length; c < d; c++) {
            this._onObjectRemoved && this._onObjectRemoved(a[c])
        }
        this.renderOnAddRemove && (a.length > 0) && this.renderAll();
        return this
    },
    forEachObject: function(e, c) {
        var d = this.getObjects();
        for (var b = 0, a = d.length; b < a; b++) {
            e.call(c, d[b], b, d)
        }
        return this
    },
    getObjects: function(a) {
        if (typeof a === "undefined") {
            return this._objects
        }
        return this._objects.filter(function(b) {
            return b.type === a
        })
    },
    item: function(a) {
        return this.getObjects()[a]
    },
    isEmpty: function() {
        return this.getObjects().length === 0
    },
    size: function() {
        return this.getObjects().length
    },
    contains: function(a) {
        return this.getObjects().indexOf(a) > -1
    },
    complexity: function() {
        return this.getObjects().reduce(function(a, b) {
            a += b.complexity ? b.complexity() : 0;
            return a
        }, 0)
    }
};
fabric.CommonMethods = {
    _setOptions: function(a) {
        for (var b in a) {
            this.set(b, a[b])
        }
    },
    _initGradient: function(a, b) {
        if (a && a.colorStops && !(a instanceof fabric.Gradient)) {
            this.set(b, new fabric.Gradient(a))
        }
    },
    _initPattern: function(a, b, c) {
        if (a && a.source && !(a instanceof fabric.Pattern)) {
            this.set(b, new fabric.Pattern(a, c))
        } else {
            c && c()
        }
    },
    _initClipping: function(a) {
        if (!a.clipTo || typeof a.clipTo !== "string") {
            return
        }
        var b = fabric.util.getFunctionBody(a.clipTo);
        if (typeof b !== "undefined") {
            this.clipTo = new Function("ctx", b)
        }
    },
    _setObject: function(a) {
        for (var b in a) {
            this._set(b, a[b])
        }
    },
    set: function(a, b) {
        if (typeof a === "object") {
            this._setObject(a)
        } else {
            if (typeof b === "function" && a !== "clipTo") {
                this._set(a, b(this.get(a)))
            } else {
                this._set(a, b)
            }
        }
        return this
    },
    _set: function(a, b) {
        this[a] = b
    },
    toggle: function(b) {
        var a = this.get(b);
        if (typeof a === "boolean") {
            this.set(b, !a)
        }
        return this
    },
    get: function(a) {
        return this[a]
    }
};
(function(e) {
    var f = Math.sqrt,
        c = Math.atan2,
        d = Math.pow,
        a = Math.abs,
        b = Math.PI / 180;
    fabric.util = {
        removeFromArray: function(i, h) {
            var g = i.indexOf(h);
            if (g !== -1) {
                i.splice(g, 1)
            }
            return i
        },
        getRandomInt: function(h, g) {
            return Math.floor(Math.random() * (g - h + 1)) + h
        },
        degreesToRadians: function(g) {
            return g * b
        },
        radiansToDegrees: function(g) {
            return g / b
        },
        rotatePoint: function(g, i, j) {
            g.subtractEquals(i);
            var h = fabric.util.rotateVector(g, j);
            return new fabric.Point(h.x, h.y).addEquals(i)
        },
        rotateVector: function(g, l) {
            var h = Math.sin(l),
                j = Math.cos(l),
                k = g.x * j - g.y * h,
                i = g.x * h + g.y * j;
            return {
                x: k,
                y: i
            }
        },
        transformPoint: function(i, h, g) {
            if (g) {
                return new fabric.Point(h[0] * i.x + h[2] * i.y, h[1] * i.x + h[3] * i.y)
            }
            return new fabric.Point(h[0] * i.x + h[2] * i.y + h[4], h[1] * i.x + h[3] * i.y + h[5])
        },
        makeBoundingBoxFromPoints: function(n) {
            var i = [n[0].x, n[1].x, n[2].x, n[3].x],
                l = fabric.util.array.min(i),
                h = fabric.util.array.max(i),
                j = Math.abs(l - h),
                m = [n[0].y, n[1].y, n[2].y, n[3].y],
                k = fabric.util.array.min(m),
                g = fabric.util.array.max(m),
                o = Math.abs(k - g);
            return {
                left: l,
                top: k,
                width: j,
                height: o
            }
        },
        invertTransform: function(h) {
            var g = 1 / (h[0] * h[3] - h[1] * h[2]),
                i = [g * h[3], -g * h[1], -g * h[2], g * h[0]],
                j = fabric.util.transformPoint({
                    x: h[4],
                    y: h[5]
                }, i, true);
            i[4] = -j.x;
            i[5] = -j.y;
            return i
        },
        toFixed: function(h, g) {
            return parseFloat(Number(h).toFixed(g))
        },
        parseUnit: function(j, i) {
            var h = /\D{0,2}$/.exec(j),
                g = parseFloat(j);
            if (!i) {
                i = fabric.Text.DEFAULT_SVG_FONT_SIZE
            }
            switch (h[0]) {
                case "mm":
                    return g * fabric.DPI / 25.4;
                case "cm":
                    return g * fabric.DPI / 2.54;
                case "in":
                    return g * fabric.DPI;
                case "pt":
                    return g * fabric.DPI / 72;
                case "pc":
                    return g * fabric.DPI / 72 * 12;
                case "em":
                    return g * i;
                default:
                    return g
            }
        },
        falseFunction: function() {
            return false
        },
        getKlass: function(h, g) {
            h = fabric.util.string.camelize(h.charAt(0).toUpperCase() + h.slice(1));
            return fabric.util.resolveNamespace(g)[h]
        },
        resolveNamespace: function(j) {
            if (!j) {
                return fabric
            }
            var l = j.split("."),
                g = l.length,
                h, k = e || fabric.window;
            for (h = 0; h < g; ++h) {
                k = k[l[h]]
            }
            return k
        },
        loadImage: function(i, k, j, h) {
            if (!i) {
                k && k.call(j, i);
                return
            }
            var g = fabric.util.createImage();
            g.onload = function() {
                k && k.call(j, g);
                g = g.onload = g.onerror = null
            };
            g.onerror = function() {
                fabric.log("Error loading " + g.src);
                k && k.call(j, null, true);
                g = g.onload = g.onerror = null
            };
            if (i.indexOf("data") !== 0 && h) {
                g.crossOrigin = h
            }
            g.src = i
        },
        enlivenObjects: function(n, m, i, k) {
            n = n || [];

            function h() {
                if (++l === o) {
                    m && m(g)
                }
            }
            var g = [],
                l = 0,
                o = n.length,
                j = true;
            if (!o) {
                m && m(g);
                return
            }
            n.forEach(function(r, q) {
                if (!r || !r.type) {
                    h();
                    return
                }
                var p = fabric.util.getKlass(r.type, i);
                p.fromObject(r, function(t, s) {
                    s || (g[q] = t);
                    k && k(r, t, q, s);
                    h()
                }, j)
            })
        },
        enlivenPatterns: function(h, l) {
            h = h || [];

            function j() {
                if (++g === k) {
                    l && l(i)
                }
            }
            var i = [],
                g = 0,
                k = h.length;
            if (!k) {
                l && l(i);
                return
            }
            h.forEach(function(n, m) {
                if (n && n.source) {
                    new fabric.Pattern(n, function(o) {
                        i[m] = o;
                        j()
                    })
                } else {
                    i[m] = n;
                    j()
                }
            })
        },
        groupSVGElements: function(i, h, j) {
            var g;
            g = new fabric.PathGroup(i, h);
            if (typeof j !== "undefined") {
                g.setSourcePath(j)
            }
            return g
        },
        populateWithProperties: function(l, h, k) {
            if (k && Object.prototype.toString.call(k) === "[object Array]") {
                for (var j = 0, g = k.length; j < g; j++) {
                    if (k[j] in l) {
                        h[k[j]] = l[k[j]]
                    }
                }
            }
        },
        drawDashedLine: function(p, n, k, g, l, r) {
            var s = g - n,
                q = l - k,
                i = f(s * s + q * q),
                h = c(q, s),
                o = r.length,
                j = 0,
                m = true;
            p.save();
            p.translate(n, k);
            p.moveTo(0, 0);
            p.rotate(h);
            n = 0;
            while (i > n) {
                n += r[j++ % o];
                if (n > i) {
                    n = i
                }
                p[m ? "lineTo" : "moveTo"](n, 0);
                m = !m
            }
            p.restore()
        },
        createCanvasElement: function(g) {
            g || (g = fabric.document.createElement("canvas"));
            if (!g.getContext && typeof G_vmlCanvasManager !== "undefined") {
                G_vmlCanvasManager.initElement(g)
            }
            return g
        },
        createImage: function() {
            return fabric.isLikelyNode ? new(require("canvas").Image)() : fabric.document.createElement("img")
        },
        createAccessors: function(g) {
            var l = g.prototype,
                j, m, n, h, k;
            for (j = l.stateProperties.length; j--;) {
                m = l.stateProperties[j];
                n = m.charAt(0).toUpperCase() + m.slice(1);
                h = "set" + n;
                k = "get" + n;
                if (!l[k]) {
                    l[k] = (function(i) {
                        return new Function('return this.get("' + i + '")')
                    })(m)
                }
                if (!l[h]) {
                    l[h] = (function(i) {
                        return new Function("value", 'return this.set("' + i + '", value)')
                    })(m)
                }
            }
        },
        clipContext: function(h, g) {
            g.save();
            g.beginPath();
            h.clipTo(g);
            g.clip()
        },
        multiplyTransformMatrices: function(h, g, i) {
            return [h[0] * g[0] + h[2] * g[1], h[1] * g[0] + h[3] * g[1], h[0] * g[2] + h[2] * g[3], h[1] * g[2] + h[3] * g[3], i ? 0 : h[0] * g[4] + h[2] * g[5] + h[4], i ? 0 : h[1] * g[4] + h[3] * g[5] + h[5]]
        },
        qrDecompose: function(g) {
            var l = c(g[1], g[0]),
                i = d(g[0], 2) + d(g[1], 2),
                j = f(i),
                h = (g[0] * g[3] - g[2] * g[1]) / j,
                k = c(g[0] * g[2] + g[1] * g[3], i);
            return {
                angle: l / b,
                scaleX: j,
                scaleY: h,
                skewX: k / b,
                skewY: 0,
                translateX: g[4],
                translateY: g[5]
            }
        },
        customTransformMatrix: function(i, h, k) {
            var g = [1, 0, a(Math.tan(k * b)), 1],
                j = [a(i), 0, 0, a(h)];
            return fabric.util.multiplyTransformMatrices(j, g, true)
        },
        resetObjectTransform: function(g) {
            g.scaleX = 1;
            g.scaleY = 1;
            g.skewX = 0;
            g.skewY = 0;
            g.flipX = false;
            g.flipY = false;
            g.setAngle(0)
        },
        getFunctionBody: function(g) {
            return (String(g).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
        },
        isTransparent: function(q, o, n, m) {
            if (m > 0) {
                if (o > m) {
                    o -= m
                } else {
                    o = 0
                }
                if (n > m) {
                    n -= m
                } else {
                    n = 0
                }
            }
            var h = true,
                k, p, g = q.getImageData(o, n, (m * 2) || 1, (m * 2) || 1),
                j = g.data.length;
            for (k = 3; k < j; k += 4) {
                p = g.data[k];
                h = p <= 0;
                if (h === false) {
                    break
                }
            }
            g = null;
            return h
        },
        parsePreserveAspectRatioAttribute: function(j) {
            var k = "meet",
                h = "Mid",
                g = "Mid",
                i = j.split(" "),
                l;
            if (i && i.length) {
                k = i.pop();
                if (k !== "meet" && k !== "slice") {
                    l = k;
                    k = "meet"
                } else {
                    if (i.length) {
                        l = i.pop()
                    }
                }
            }
            h = l !== "none" ? l.slice(1, 4) : "none";
            g = l !== "none" ? l.slice(5, 8) : "none";
            return {
                meetOrSlice: k,
                alignX: h,
                alignY: g
            }
        },
        clearFabricFontCache: function(g) {
            if (!g) {
                fabric.charWidthsCache = {}
            } else {
                if (fabric.charWidthsCache[g]) {
                    delete fabric.charWidthsCache[g]
                }
            }
        }
    }
})(typeof exports !== "undefined" ? exports : this);
(function() {
    var b = {},
        c = {},
        h = {},
        d = Array.prototype.join;

    function g(m, k, r, q, j, B, w) {
        var S = d.call(arguments);
        if (b[S]) {
            return b[S]
        }
        var I = Math.PI,
            t = w * I / 180,
            O = Math.sin(t),
            H = Math.cos(t),
            C = 0,
            z = 0;
        r = Math.abs(r);
        q = Math.abs(q);
        var G = -H * m * 0.5 - O * k * 0.5,
            D = -H * k * 0.5 + O * m * 0.5,
            P = r * r,
            p = q * q,
            l = D * D,
            L = G * G,
            N = P * p - P * l - p * L,
            K = 0;
        if (N < 0) {
            var A = Math.sqrt(1 - N / (P * p));
            r *= A;
            q *= A
        } else {
            K = (j === B ? -1 : 1) * Math.sqrt(N / (P * l + p * L))
        }
        var o = K * r * D / q,
            n = -K * q * G / r,
            F = H * o - O * n + m * 0.5,
            Q = O * o + H * n + k * 0.5,
            R = e(1, 0, (G - o) / r, (D - n) / q),
            E = e((G - o) / r, (D - n) / q, (-G - o) / r, (-D - n) / q);
        if (B === 0 && E > 0) {
            E -= 2 * I
        } else {
            if (B === 1 && E < 0) {
                E += 2 * I
            }
        }
        var J = Math.ceil(Math.abs(E / I * 2)),
            v = [],
            y = E / J,
            u = 8 / 3 * Math.sin(y / 4) * Math.sin(y / 4) / Math.sin(y / 2),
            x = R + y;
        for (var M = 0; M < J; M++) {
            v[M] = f(R, x, H, O, r, q, F, Q, u, C, z);
            C = v[M][4];
            z = v[M][5];
            R = x;
            x += y
        }
        b[S] = v;
        return v
    }

    function f(t, r, x, B, o, n, w, D, p, v, u) {
        var k = d.call(arguments);
        if (c[k]) {
            return c[k]
        }
        var m = Math.cos(t),
            z = Math.sin(t),
            l = Math.cos(r),
            y = Math.sin(r),
            j = x * o * l - B * n * y + w,
            i = B * o * l + x * n * y + D,
            s = v + p * (-x * o * z - B * n * m),
            q = u + p * (-B * o * z + x * n * m),
            C = j + p * (x * o * y + B * n * l),
            A = i + p * (B * o * y - x * n * l);
        c[k] = [s, q, C, A, j, i];
        return c[k]
    }

    function e(l, k, n, m) {
        var j = Math.atan2(k, l),
            i = Math.atan2(m, n);
        if (i >= j) {
            return i - j
        } else {
            return 2 * Math.PI - (j - i)
        }
    }
    fabric.util.drawArc = function(x, p, o, u) {
        var m = u[0],
            j = u[1],
            n = u[2],
            v = u[3],
            w = u[4],
            s = u[5],
            q = u[6],
            l = [
                [],
                [],
                [],
                []
            ],
            k = g(s - p, q - o, m, j, v, w, n);
        for (var r = 0, t = k.length; r < t; r++) {
            l[r][0] = k[r][0] + p;
            l[r][1] = k[r][1] + o;
            l[r][2] = k[r][2] + p;
            l[r][3] = k[r][3] + o;
            l[r][4] = k[r][4] + p;
            l[r][5] = k[r][5] + o;
            x.bezierCurveTo.apply(x, l[r])
        }
    };
    fabric.util.getBoundsOfArc = function(p, o, m, k, n, x, y, t, r) {
        var w = 0,
            v = 0,
            q, j = [],
            l = g(t - p, r - o, m, k, x, y, n);
        for (var s = 0, u = l.length; s < u; s++) {
            q = a(w, v, l[s][0], l[s][1], l[s][2], l[s][3], l[s][4], l[s][5]);
            j.push({
                x: q[0].x + p,
                y: q[0].y + o
            });
            j.push({
                x: q[1].x + p,
                y: q[1].y + o
            });
            w = l[s][4];
            v = l[s][5]
        }
        return j
    };

    function a(L, o, K, m, J, l, I, k) {
        var Q = d.call(arguments);
        if (h[Q]) {
            return h[Q]
        }
        var P = Math.sqrt,
            E = Math.min,
            H = Math.max,
            B = Math.abs,
            C = [],
            p = [
                [],
                []
            ],
            O, N, M, z, v, s, n, q;
        N = 6 * L - 12 * K + 6 * J;
        O = -3 * L + 9 * K - 9 * J + 3 * I;
        M = 3 * K - 3 * L;
        for (var G = 0; G < 2; ++G) {
            if (G > 0) {
                N = 6 * o - 12 * m + 6 * l;
                O = -3 * o + 9 * m - 9 * l + 3 * k;
                M = 3 * m - 3 * o
            }
            if (B(O) < 1e-12) {
                if (B(N) < 1e-12) {
                    continue
                }
                z = -M / N;
                if (0 < z && z < 1) {
                    C.push(z)
                }
                continue
            }
            n = N * N - 4 * M * O;
            if (n < 0) {
                continue
            }
            q = P(n);
            v = (-N + q) / (2 * O);
            if (0 < v && v < 1) {
                C.push(v)
            }
            s = (-N - q) / (2 * O);
            if (0 < s && s < 1) {
                C.push(s)
            }
        }
        var u, r, F = C.length,
            A = F,
            D;
        while (F--) {
            z = C[F];
            D = 1 - z;
            u = (D * D * D * L) + (3 * D * D * z * K) + (3 * D * z * z * J) + (z * z * z * I);
            p[0][F] = u;
            r = (D * D * D * o) + (3 * D * D * z * m) + (3 * D * z * z * l) + (z * z * z * k);
            p[1][F] = r
        }
        p[0][A] = L;
        p[1][A] = o;
        p[0][A + 1] = I;
        p[1][A + 1] = k;
        var w = [{
            x: E.apply(null, p[0]),
            y: E.apply(null, p[1])
        }, {
            x: H.apply(null, p[0]),
            y: H.apply(null, p[1])
        }];
        h[Q] = w;
        return w
    }
    fabric.util.getBoundsOfCurve = a
})();
(function() {
    var f = Array.prototype.slice;

    function b(m, l) {
        var j = f.call(arguments, 2),
            h = [];
        for (var k = 0, g = m.length; k < g; k++) {
            h[k] = j.length ? m[k][l].apply(m[k], j) : m[k][l].call(m[k])
        }
        return h
    }

    function a(h, g) {
        return e(h, g, function(j, i) {
            return j >= i
        })
    }

    function c(h, g) {
        return e(h, g, function(j, i) {
            return j < i
        })
    }

    function d(i, h) {
        var g = i.length;
        while (g--) {
            i[g] = h
        }
        return i
    }

    function e(l, j, k) {
        if (!l || l.length === 0) {
            return
        }
        var h = l.length - 1,
            g = j ? l[h][j] : l[h];
        if (j) {
            while (h--) {
                if (k(l[h][j], g)) {
                    g = l[h][j]
                }
            }
        } else {
            while (h--) {
                if (k(l[h], g)) {
                    g = l[h]
                }
            }
        }
        return g
    }
    fabric.util.array = {
        fill: d,
        invoke: b,
        min: c,
        max: a
    }
})();
(function() {
    function b(d, h, e) {
        if (e) {
            if (!fabric.isLikelyNode && h instanceof Element) {
                d = h
            } else {
                if (h instanceof Array) {
                    d = [];
                    for (var f = 0, c = h.length; f < c; f++) {
                        d[f] = b({}, h[f], e)
                    }
                } else {
                    if (h && typeof h === "object") {
                        for (var g in h) {
                            if (h.hasOwnProperty(g)) {
                                d[g] = b({}, h[g], e)
                            }
                        }
                    } else {
                        d = h
                    }
                }
            }
        } else {
            for (var g in h) {
                d[g] = h[g]
            }
        }
        return d
    }

    function a(d, c) {
        return b({}, d, c)
    }
    fabric.util.object = {
        extend: b,
        clone: a
    }
})();
(function() {
    function b(d) {
        return d.replace(/-+(.)?/g, function(e, f) {
            return f ? f.toUpperCase() : ""
        })
    }

    function c(d, e) {
        return d.charAt(0).toUpperCase() + (e ? d.slice(1) : d.slice(1).toLowerCase())
    }

    function a(d) {
        return d.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }
    fabric.util.string = {
        camelize: b,
        capitalize: c,
        escapeXml: a
    }
})();
(function() {
    var g = Array.prototype.slice,
        f = function() {},
        d = (function() {
            for (var h in {
                    toString: 1
                }) {
                if (h === "toString") {
                    return false
                }
            }
            return true
        })(),
        c = function(h, k, i) {
            for (var j in k) {
                if (j in h.prototype && typeof h.prototype[j] === "function" && (k[j] + "").indexOf("callSuper") > -1) {
                    h.prototype[j] = (function(l) {
                        return function() {
                            var n = this.constructor.superclass;
                            this.constructor.superclass = i;
                            var m = k[l].apply(this, arguments);
                            this.constructor.superclass = n;
                            if (l !== "initialize") {
                                return m
                            }
                        }
                    })(j)
                } else {
                    h.prototype[j] = k[j]
                }
                if (d) {
                    if (k.toString !== Object.prototype.toString) {
                        h.prototype.toString = k.toString
                    }
                    if (k.valueOf !== Object.prototype.valueOf) {
                        h.prototype.valueOf = k.valueOf
                    }
                }
            }
        };

    function b() {}

    function a(h) {
        var i = this.constructor.superclass.prototype[h];
        return (arguments.length > 1) ? i.apply(this, g.call(arguments, 1)) : i.call(this)
    }

    function e() {
        var l = null,
            k = g.call(arguments, 0);
        if (typeof k[0] === "function") {
            l = k.shift()
        }

        function h() {
            this.initialize.apply(this, arguments)
        }
        h.superclass = l;
        h.subclasses = [];
        if (l) {
            b.prototype = l.prototype;
            h.prototype = new b();
            l.subclasses.push(h)
        }
        for (var j = 0, m = k.length; j < m; j++) {
            c(h, k[j], l)
        }
        if (!h.prototype.initialize) {
            h.prototype.initialize = f
        }
        h.prototype.constructor = h;
        h.prototype.callSuper = a;
        return h
    }
    fabric.util.createClass = e
})();
(function() {
    var r = "unknown";

    function m(u) {
        var x = Array.prototype.slice.call(arguments, 1),
            w, v, s = x.length;
        for (v = 0; v < s; v++) {
            w = typeof u[x[v]];
            if (!(/^(?:function|object|unknown)$/).test(w)) {
                return false
            }
        }
        return true
    }
    var g, q, j = (function() {
        var s = 0;
        return function(t) {
            return t.__uniqueID || (t.__uniqueID = "uniqueID__" + s++)
        }
    })();
    (function() {
        var s = {};
        g = function(t) {
            return s[t]
        };
        q = function(u, t) {
            s[u] = t
        }
    })();

    function d(s, t) {
        return {
            handler: t,
            wrappedHandler: l(s, t)
        }
    }

    function l(s, t) {
        return function(u) {
            t.call(g(s), u || fabric.window.event)
        }
    }

    function f(t, s) {
        return function(x) {
            if (o[t] && o[t][s]) {
                var v = o[t][s];
                for (var w = 0, u = v.length; w < u; w++) {
                    v[w].call(this, x || fabric.window.event)
                }
            }
        }
    }
    var p = (m(fabric.document.documentElement, "addEventListener", "removeEventListener") && m(fabric.window, "addEventListener", "removeEventListener")),
        h = (m(fabric.document.documentElement, "attachEvent", "detachEvent") && m(fabric.window, "attachEvent", "detachEvent")),
        n = {},
        o = {},
        k, c;
    if (p) {
        k = function(u, s, v, t) {
            u.addEventListener(s, v, h ? false : t)
        };
        c = function(u, s, v, t) {
            u.removeEventListener(s, v, h ? false : t)
        }
    } else {
        if (h) {
            k = function(u, s, v) {
                var t = j(u);
                q(t, u);
                if (!n[t]) {
                    n[t] = {}
                }
                if (!n[t][s]) {
                    n[t][s] = []
                }
                var w = d(t, v);
                n[t][s].push(w);
                u.attachEvent("on" + s, w.wrappedHandler)
            };
            c = function(w, t, x) {
                var v = j(w),
                    y;
                if (n[v] && n[v][t]) {
                    for (var u = 0, s = n[v][t].length; u < s; u++) {
                        y = n[v][t][u];
                        if (y && y.handler === x) {
                            w.detachEvent("on" + t, y.wrappedHandler);
                            n[v][t][u] = null
                        }
                    }
                }
            }
        } else {
            k = function(u, s, v) {
                var t = j(u);
                if (!o[t]) {
                    o[t] = {}
                }
                if (!o[t][s]) {
                    o[t][s] = [];
                    var w = u["on" + s];
                    if (w) {
                        o[t][s].push(w)
                    }
                    u["on" + s] = f(t, s)
                }
                o[t][s].push(v)
            };
            c = function(x, u, y) {
                var w = j(x);
                if (o[w] && o[w][u]) {
                    var t = o[w][u];
                    for (var v = 0, s = t.length; v < s; v++) {
                        if (t[v] === y) {
                            t.splice(v, 1)
                        }
                    }
                }
            }
        }
    }
    fabric.util.addListener = k;
    fabric.util.removeListener = c;

    function i(u) {
        u || (u = fabric.window.event);
        var t = u.target || (typeof u.srcElement !== r ? u.srcElement : null),
            s = fabric.util.getScrollLeftTop(t);
        return {
            x: b(u) + s.left,
            y: a(u) + s.top
        }
    }
    var b = function(s) {
            return (typeof s.clientX !== r ? s.clientX : 0)
        },
        a = function(s) {
            return (typeof s.clientY !== r ? s.clientY : 0)
        };

    function e(t, v, s) {
        var u = t.type === "touchend" ? "changedTouches" : "touches";
        return (t[u] && t[u][0] ? (t[u][0][v] - (t[u][0][v] - t[u][0][s])) || t[s] : t[s])
    }
    if (fabric.isTouchSupported) {
        b = function(s) {
            return e(s, "pageX", "clientX")
        };
        a = function(s) {
            return e(s, "pageY", "clientY")
        }
    }
    fabric.util.getPointer = i;
    fabric.util.object.extend(fabric.util, fabric.Observable)
})();
(function() {
    function d(g, i) {
        var k = g.style;
        if (!k) {
            return g
        }
        if (typeof i === "string") {
            g.style.cssText += ";" + i;
            return i.indexOf("opacity") > -1 ? b(g, i.match(/opacity:\s*(\d?\.?\d*)/)[1]) : g
        }
        for (var j in i) {
            if (j === "opacity") {
                b(g, i[j])
            } else {
                var h = (j === "float" || j === "cssFloat") ? (typeof k.styleFloat === "undefined" ? "cssFloat" : "styleFloat") : j;
                k[h] = i[j]
            }
        }
        return g
    }
    var f = fabric.document.createElement("div"),
        e = typeof f.style.opacity === "string",
        a = typeof f.style.filter === "string",
        c = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
        b = function(g) {
            return g
        };
    if (e) {
        b = function(g, h) {
            g.style.opacity = h;
            return g
        }
    } else {
        if (a) {
            b = function(g, h) {
                var i = g.style;
                if (g.currentStyle && !g.currentStyle.hasLayout) {
                    i.zoom = 1
                }
                if (c.test(i.filter)) {
                    h = h >= 0.9999 ? "" : ("alpha(opacity=" + (h * 100) + ")");
                    i.filter = i.filter.replace(c, h)
                } else {
                    i.filter += " alpha(opacity=" + (h * 100) + ")"
                }
                return g
            }
        }
    }
    fabric.util.setStyle = d
})();
(function() {
    var j = Array.prototype.slice;

    function i(l) {
        return typeof l === "string" ? fabric.document.getElementById(l) : l
    }
    var k, c = function(l) {
        return j.call(l, 0)
    };
    try {
        k = c(fabric.document.childNodes) instanceof Array
    } catch (b) {}
    if (!k) {
        c = function(m) {
            var l = new Array(m.length),
                n = m.length;
            while (n--) {
                l[n] = m[n]
            }
            return l
        }
    }

    function d(m, l) {
        var n = fabric.document.createElement(m);
        for (var o in l) {
            if (o === "class") {
                n.className = l[o]
            } else {
                if (o === "for") {
                    n.htmlFor = l[o]
                } else {
                    n.setAttribute(o, l[o])
                }
            }
        }
        return n
    }

    function h(l, m) {
        if (l && (" " + l.className + " ").indexOf(" " + m + " ") === -1) {
            l.className += (l.className ? " " : "") + m
        }
    }

    function g(m, n, l) {
        if (typeof n === "string") {
            n = d(n, l)
        }
        if (m.parentNode) {
            m.parentNode.replaceChild(n, m)
        }
        n.appendChild(m);
        return n
    }

    function a(n) {
        var p = 0,
            o = 0,
            m = fabric.document.documentElement,
            l = fabric.document.body || {
                scrollLeft: 0,
                scrollTop: 0
            };
        while (n && (n.parentNode || n.host)) {
            n = n.parentNode || n.host;
            if (n === fabric.document) {
                p = l.scrollLeft || m.scrollLeft || 0;
                o = l.scrollTop || m.scrollTop || 0
            } else {
                p += n.scrollLeft || 0;
                o += n.scrollTop || 0
            }
            if (n.nodeType === 1 && fabric.util.getElementStyle(n, "position") === "fixed") {
                break
            }
        }
        return {
            left: p,
            top: o
        }
    }

    function f(o) {
        var m, r = o && o.ownerDocument,
            p = {
                left: 0,
                top: 0
            },
            s = {
                left: 0,
                top: 0
            },
            q, n = {
                borderLeftWidth: "left",
                borderTopWidth: "top",
                paddingLeft: "left",
                paddingTop: "top"
            };
        if (!r) {
            return s
        }
        for (var l in n) {
            s[n[l]] += parseInt(e(o, l), 10) || 0
        }
        m = r.documentElement;
        if (typeof o.getBoundingClientRect !== "undefined") {
            p = o.getBoundingClientRect()
        }
        q = a(o);
        return {
            left: p.left + q.left - (m.clientLeft || 0) + s.left,
            top: p.top + q.top - (m.clientTop || 0) + s.top
        }
    }
    var e;
    if (fabric.document.defaultView && fabric.document.defaultView.getComputedStyle) {
        e = function(m, l) {
            var n = fabric.document.defaultView.getComputedStyle(m, null);
            return n ? n[l] : undefined
        }
    } else {
        e = function(m, l) {
            var n = m.style[l];
            if (!n && m.currentStyle) {
                n = m.currentStyle[l]
            }
            return n
        }
    }(function() {
        var m = fabric.document.documentElement.style,
            n = "userSelect" in m ? "userSelect" : "MozUserSelect" in m ? "MozUserSelect" : "WebkitUserSelect" in m ? "WebkitUserSelect" : "KhtmlUserSelect" in m ? "KhtmlUserSelect" : "";

        function o(p) {
            if (typeof p.onselectstart !== "undefined") {
                p.onselectstart = fabric.util.falseFunction
            }
            if (n) {
                p.style[n] = "none"
            } else {
                if (typeof p.unselectable === "string") {
                    p.unselectable = "on"
                }
            }
            return p
        }

        function l(p) {
            if (typeof p.onselectstart !== "undefined") {
                p.onselectstart = null
            }
            if (n) {
                p.style[n] = ""
            } else {
                if (typeof p.unselectable === "string") {
                    p.unselectable = ""
                }
            }
            return p
        }
        fabric.util.makeElementUnselectable = o;
        fabric.util.makeElementSelectable = l
    })();
    (function() {
        function l(m, q) {
            var o = fabric.document.getElementsByTagName("head")[0],
                n = fabric.document.createElement("script"),
                p = true;
            n.onload = n.onreadystatechange = function(r) {
                if (p) {
                    if (typeof this.readyState === "string" && this.readyState !== "loaded" && this.readyState !== "complete") {
                        return
                    }
                    p = false;
                    q(r || fabric.window.event);
                    n = n.onload = n.onreadystatechange = null
                }
            };
            n.src = m;
            o.appendChild(n)
        }
        fabric.util.getScript = l
    })();
    fabric.util.getById = i;
    fabric.util.toArray = c;
    fabric.util.makeElement = d;
    fabric.util.addClass = h;
    fabric.util.wrapElement = g;
    fabric.util.getScrollLeftTop = a;
    fabric.util.getElementOffset = f;
    fabric.util.getElementStyle = e
})();
(function() {
    function d(e, f) {
        return e + (/\?/.test(e) ? "&" : "?") + f
    }
    var c = (function() {
        var h = [function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function() {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0")
        }, function() {
            return new XMLHttpRequest()
        }];
        for (var e = h.length; e--;) {
            try {
                var g = h[e]();
                if (g) {
                    return h[e]
                }
            } catch (f) {}
        }
    })();

    function a() {}

    function b(g, f) {
        f || (f = {});
        var j = f.method ? f.method.toUpperCase() : "GET",
            h = f.onComplete || function() {},
            i = c(),
            e = f.body || f.parameters;
        i.onreadystatechange = function() {
            if (i.readyState === 4) {
                h(i);
                i.onreadystatechange = a
            }
        };
        if (j === "GET") {
            e = null;
            if (typeof f.parameters === "string") {
                g = d(g, f.parameters)
            }
        }
        i.open(j, g, true);
        if (j === "POST" || j === "PUT") {
            i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        }
        i.send(e);
        return i
    }
    fabric.util.request = b
})();
fabric.log = function() {};
fabric.warn = function() {};
if (typeof console !== "undefined") {
    ["log", "warn"].forEach(function(a) {
        if (typeof console[a] !== "undefined" && typeof console[a].apply === "function") {
            fabric[a] = function() {
                return console[a].apply(console, arguments)
            }
        }
    })
}(function() {
    function a(d) {
        b(function(k) {
            d || (d = {});
            var f = k || +new Date(),
                h = d.duration || 500,
                o = f + h,
                g, l = d.onChange || function() {},
                i = d.abort || function() {
                    return false
                },
                m = d.easing || function(r, q, u, s) {
                    return -u * Math.cos(r / s * (Math.PI / 2)) + u + q
                },
                e = "startValue" in d ? d.startValue : 0,
                n = "endValue" in d ? d.endValue : 100,
                p = d.byValue || n - e;
            d.onStart && d.onStart();
            (function j(q) {
                g = q || +new Date();
                var r = g > o ? h : (g - f);
                if (i()) {
                    d.onComplete && d.onComplete();
                    return
                }
                l(m(r, e, p, h));
                if (g > o) {
                    d.onComplete && d.onComplete();
                    return
                }
                b(j)
            })(f)
        })
    }
    var c = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(d) {
        fabric.window.setTimeout(d, 1000 / 60)
    };

    
    function b() {
        return c.apply(fabric.window, arguments)
    }
    fabric.util.animate = a;
    fabric.util.requestAnimFrame = b
    
})();
(function() {
    function a(e, c, f) {
        var d = "rgba(" + parseInt((e[0] + f * (c[0] - e[0])), 10) + "," + parseInt((e[1] + f * (c[1] - e[1])), 10) + "," + parseInt((e[2] + f * (c[2] - e[2])), 10);
        d += "," + (e && c ? parseFloat(e[3] + f * (c[3] - e[3])) : 1);
        d += ")";
        return d
    }

    function b(d, f, h, c) {
        var g = new fabric.Color(d).getSource(),
            e = new fabric.Color(f).getSource();
        c = c || {};
        fabric.util.animate(fabric.util.object.extend(c, {
            duration: h || 500,
            startValue: g,
            endValue: e,
            byValue: e,
            easing: function(j, i, l, m) {
                var k = c.colorEasing ? c.colorEasing(j, m) : 1 - Math.cos(j / m * (Math.PI / 2));
                return a(i, l, k)
            }
        }))
    }
    fabric.util.animateColor = b
})();
(function() {
    function y(C, F, E, D) {
        if (C < Math.abs(F)) {
            C = F;
            D = E / 4
        } else {
            if (F === 0 && C === 0) {
                D = E / (2 * Math.PI) * Math.asin(1)
            } else {
                D = E / (2 * Math.PI) * Math.asin(F / C)
            }
        }
        return {
            a: C,
            c: F,
            p: E,
            s: D
        }
    }

    function p(D, C, E) {
        return D.a * Math.pow(2, 10 * (C -= 1)) * Math.sin((C * E - D.s) * (2 * Math.PI) / D.p)
    }

    function o(D, C, F, E) {
        return F * ((D = D / E - 1) * D * D + 1) + C
    }

    function s(D, C, F, E) {
        D /= E / 2;
        if (D < 1) {
            return F / 2 * D * D * D + C
        }
        return F / 2 * ((D -= 2) * D * D + 2) + C
    }

    function r(D, C, F, E) {
        return F * (D /= E) * D * D * D + C
    }

    function f(D, C, F, E) {
        return -F * ((D = D / E - 1) * D * D * D - 1) + C
    }

    function j(D, C, F, E) {
        D /= E / 2;
        if (D < 1) {
            return F / 2 * D * D * D * D + C
        }
        return -F / 2 * ((D -= 2) * D * D * D - 2) + C
    }

    function w(D, C, F, E) {
        return F * (D /= E) * D * D * D * D + C
    }

    function i(D, C, F, E) {
        return F * ((D = D / E - 1) * D * D * D * D + 1) + C
    }

    function l(D, C, F, E) {
        D /= E / 2;
        if (D < 1) {
            return F / 2 * D * D * D * D * D + C
        }
        return F / 2 * ((D -= 2) * D * D * D * D + 2) + C
    }

    function e(D, C, F, E) {
        return -F * Math.cos(D / E * (Math.PI / 2)) + F + C
    }

    function m(D, C, F, E) {
        return F * Math.sin(D / E * (Math.PI / 2)) + C
    }

    function t(D, C, F, E) {
        return -F / 2 * (Math.cos(Math.PI * D / E) - 1) + C
    }

    function B(D, C, F, E) {
        return (D === 0) ? C : F * Math.pow(2, 10 * (D / E - 1)) + C
    }

    function c(D, C, F, E) {
        return (D === E) ? C + F : F * (-Math.pow(2, -10 * D / E) + 1) + C
    }

    function h(D, C, F, E) {
        if (D === 0) {
            return C
        }
        if (D === E) {
            return C + F
        }
        D /= E / 2;
        if (D < 1) {
            return F / 2 * Math.pow(2, 10 * (D - 1)) + C
        }
        return F / 2 * (-Math.pow(2, -10 * --D) + 2) + C
    }

    function g(D, C, F, E) {
        return -F * (Math.sqrt(1 - (D /= E) * D) - 1) + C
    }

    function n(D, C, F, E) {
        return F * Math.sqrt(1 - (D = D / E - 1) * D) + C
    }

    function v(D, C, F, E) {
        D /= E / 2;
        if (D < 1) {
            return -F / 2 * (Math.sqrt(1 - D * D) - 1) + C
        }
        return F / 2 * (Math.sqrt(1 - (D -= 2) * D) + 1) + C
    }

    function q(E, C, J, I) {
        var F = 1.70158,
            H = 0,
            D = J;
        if (E === 0) {
            return C
        }
        E /= I;
        if (E === 1) {
            return C + J
        }
        if (!H) {
            H = I * 0.3
        }
        var G = y(D, J, H, F);
        return -p(G, E, I) + C
    }

    function x(E, C, J, I) {
        var F = 1.70158,
            H = 0,
            D = J;
        if (E === 0) {
            return C
        }
        E /= I;
        if (E === 1) {
            return C + J
        }
        if (!H) {
            H = I * 0.3
        }
        var G = y(D, J, H, F);
        return G.a * Math.pow(2, -10 * E) * Math.sin((E * I - G.s) * (2 * Math.PI) / G.p) + G.c + C
    }

    function a(E, C, J, I) {
        var F = 1.70158,
            H = 0,
            D = J;
        if (E === 0) {
            return C
        }
        E /= I / 2;
        if (E === 2) {
            return C + J
        }
        if (!H) {
            H = I * (0.3 * 1.5)
        }
        var G = y(D, J, H, F);
        if (E < 1) {
            return -0.5 * p(G, E, I) + C
        }
        return G.a * Math.pow(2, -10 * (E -= 1)) * Math.sin((E * I - G.s) * (2 * Math.PI) / G.p) * 0.5 + G.c + C
    }

    function k(D, C, G, F, E) {
        if (E === undefined) {
            E = 1.70158
        }
        return G * (D /= F) * D * ((E + 1) * D - E) + C
    }

    function u(D, C, G, F, E) {
        if (E === undefined) {
            E = 1.70158
        }
        return G * ((D = D / F - 1) * D * ((E + 1) * D + E) + 1) + C
    }

    function z(D, C, G, F, E) {
        if (E === undefined) {
            E = 1.70158
        }
        D /= F / 2;
        if (D < 1) {
            return G / 2 * (D * D * (((E *= (1.525)) + 1) * D - E)) + C
        }
        return G / 2 * ((D -= 2) * D * (((E *= (1.525)) + 1) * D + E) + 2) + C
    }

    function d(D, C, F, E) {
        return F - b(E - D, 0, F, E) + C
    }

    function b(D, C, F, E) {
        if ((D /= E) < (1 / 2.75)) {
            return F * (7.5625 * D * D) + C
        } else {
            if (D < (2 / 2.75)) {
                return F * (7.5625 * (D -= (1.5 / 2.75)) * D + 0.75) + C
            } else {
                if (D < (2.5 / 2.75)) {
                    return F * (7.5625 * (D -= (2.25 / 2.75)) * D + 0.9375) + C
                } else {
                    return F * (7.5625 * (D -= (2.625 / 2.75)) * D + 0.984375) + C
                }
            }
        }
    }

    function A(D, C, F, E) {
        if (D < E / 2) {
            return d(D * 2, 0, F, E) * 0.5 + C
        }
        return b(D * 2 - E, 0, F, E) * 0.5 + F * 0.5 + C
    }
    fabric.util.ease = {
        easeInQuad: function(D, C, F, E) {
            return F * (D /= E) * D + C
        },
        easeOutQuad: function(D, C, F, E) {
            return -F * (D /= E) * (D - 2) + C
        },
        easeInOutQuad: function(D, C, F, E) {
            D /= (E / 2);
            if (D < 1) {
                return F / 2 * D * D + C
            }
            return -F / 2 * ((--D) * (D - 2) - 1) + C
        },
        easeInCubic: function(D, C, F, E) {
            return F * (D /= E) * D * D + C
        },
        easeOutCubic: o,
        easeInOutCubic: s,
        easeInQuart: r,
        easeOutQuart: f,
        easeInOutQuart: j,
        easeInQuint: w,
        easeOutQuint: i,
        easeInOutQuint: l,
        easeInSine: e,
        easeOutSine: m,
        easeInOutSine: t,
        easeInExpo: B,
        easeOutExpo: c,
        easeInOutExpo: h,
        easeInCirc: g,
        easeOutCirc: n,
        easeInOutCirc: v,
        easeInElastic: q,
        easeOutElastic: x,
        easeInOutElastic: a,
        easeInBack: k,
        easeOutBack: u,
        easeInOutBack: z,
        easeInBounce: d,
        easeOutBounce: b,
        easeInOutBounce: A
    }
})();
(function(w) {
    var r = w.fabric || (w.fabric = {}),
        B = r.util.object.extend,
        C = r.util.object.clone,
        q = r.util.toFixed,
        t = r.util.parseUnit,
        y = r.util.multiplyTransformMatrices,
        n = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/i,
        a = /^(symbol|image|marker|pattern|view|svg)$/i,
        m = /^(?:pattern|defs|symbol|metadata|clipPath|mask)$/i,
        c = /^(symbol|g|a|svg)$/i,
        z = {
            cx: "left",
            x: "left",
            r: "radius",
            cy: "top",
            y: "top",
            display: "visible",
            visibility: "visible",
            transform: "transformMatrix",
            "fill-opacity": "fillOpacity",
            "fill-rule": "fillRule",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-style": "fontStyle",
            "font-weight": "fontWeight",
            "stroke-dasharray": "strokeDashArray",
            "stroke-linecap": "strokeLineCap",
            "stroke-linejoin": "strokeLineJoin",
            "stroke-miterlimit": "strokeMiterLimit",
            "stroke-opacity": "strokeOpacity",
            "stroke-width": "strokeWidth",
            "text-decoration": "textDecoration",
            "text-anchor": "originX"
        },
        h = {
            stroke: "strokeOpacity",
            fill: "fillOpacity"
        };
    r.cssRules = {};
    r.gradientDefs = {};

    function d(D) {
        if (D in z) {
            return z[D]
        }
        return D
    }

    function j(D, I, G, H) {
        var E = Object.prototype.toString.call(I) === "[object Array]",
            F;
        if ((D === "fill" || D === "stroke") && I === "none") {
            I = ""
        } else {
            if (D === "strokeDashArray") {
                if (I === "none") {
                    I = null
                } else {
                    I = I.replace(/,/g, " ").split(/\s+/).map(function(J) {
                        return parseFloat(J)
                    })
                }
            } else {
                if (D === "transformMatrix") {
                    if (G && G.transformMatrix) {
                        I = y(G.transformMatrix, r.parseTransformAttribute(I))
                    } else {
                        I = r.parseTransformAttribute(I)
                    }
                } else {
                    if (D === "visible") {
                        I = (I === "none" || I === "hidden") ? false : true;
                        if (G && G.visible === false) {
                            I = false
                        }
                    } else {
                        if (D === "originX") {
                            I = I === "start" ? "left" : I === "end" ? "right" : "center"
                        } else {
                            F = E ? I.map(t) : t(I, H)
                        }
                    }
                }
            }
        }
        return (!E && isNaN(F) ? I : F)
    }

    function f(F) {
        for (var D in h) {
            if (typeof F[h[D]] === "undefined" || F[D] === "") {
                continue
            }
            if (typeof F[D] === "undefined") {
                if (!r.Object.prototype[D]) {
                    continue
                }
                F[D] = r.Object.prototype[D]
            }
            if (F[D].indexOf("url(") === 0) {
                continue
            }
            var E = new r.Color(F[D]);
            F[D] = E.setAlpha(q(E.getAlpha() * F[h[D]], 2)).toRgba()
        }
        return F
    }

    function v(H, F) {
        var I, G = [],
            D;
        for (var E = 0; E < F.length; E++) {
            I = F[E];
            D = H.getElementsByTagName(I);
            G = G.concat(Array.prototype.slice.call(D))
        }
        return G
    }
    r.parseTransformAttribute = (function() {
        function D(X, Y) {
            var Z = Math.cos(Y[0]),
                W = Math.sin(Y[0]),
                V = 0,
                aa = 0;
            if (Y.length === 3) {
                V = Y[1];
                aa = Y[2]
            }
            X[0] = Z;
            X[1] = W;
            X[2] = -W;
            X[3] = Z;
            X[4] = V - (Z * V - W * aa);
            X[5] = aa - (W * V + Z * aa)
        }

        function G(X, Y) {
            var W = Y[0],
                V = (Y.length === 2) ? Y[1] : Y[0];
            X[0] = W;
            X[3] = V
        }

        function T(V, W, X) {
            V[X] = Math.tan(r.util.degreesToRadians(W[0]))
        }

        function O(V, W) {
            V[4] = W[0];
            if (W.length === 2) {
                V[5] = W[1]
            }
        }
        var I = [1, 0, 0, 1, 0, 0],
            E = r.reNum,
            Q = "(?:\\s+,?\\s*|,\\s*)",
            J = "(?:(skewX)\\s*\\(\\s*(" + E + ")\\s*\\))",
            H = "(?:(skewY)\\s*\\(\\s*(" + E + ")\\s*\\))",
            R = "(?:(rotate)\\s*\\(\\s*(" + E + ")(?:" + Q + "(" + E + ")" + Q + "(" + E + "))?\\s*\\))",
            U = "(?:(scale)\\s*\\(\\s*(" + E + ")(?:" + Q + "(" + E + "))?\\s*\\))",
            M = "(?:(translate)\\s*\\(\\s*(" + E + ")(?:" + Q + "(" + E + "))?\\s*\\))",
            P = "(?:(matrix)\\s*\\(\\s*(" + E + ")" + Q + "(" + E + ")" + Q + "(" + E + ")" + Q + "(" + E + ")" + Q + "(" + E + ")" + Q + "(" + E + ")\\s*\\))",
            N = "(?:" + P + "|" + M + "|" + U + "|" + R + "|" + J + "|" + H + ")",
            K = "(?:" + N + "(?:" + Q + "*" + N + ")*)",
            S = "^\\s*(?:" + K + "?)\\s*$",
            L = new RegExp(S),
            F = new RegExp(N, "g");
        return function(Y) {
            var V = I.concat(),
                W = [];
            if (!Y || (Y && !L.test(Y))) {
                return V
            }
            Y.replace(F, function(ac) {
                var Z = new RegExp(N).exec(ac).filter(function(ad) {
                        return (!!ad)
                    }),
                    aa = Z[1],
                    ab = Z.slice(2).map(parseFloat);
                switch (aa) {
                    case "translate":
                        O(V, ab);
                        break;
                    case "rotate":
                        ab[0] = r.util.degreesToRadians(ab[0]);
                        D(V, ab);
                        break;
                    case "scale":
                        G(V, ab);
                        break;
                    case "skewX":
                        T(V, ab, 2);
                        break;
                    case "skewY":
                        T(V, ab, 1);
                        break;
                    case "matrix":
                        V = ab;
                        break
                }
                W.push(V.concat());
                V = I.concat()
            });
            var X = W[0];
            while (W.length > 1) {
                W.shift();
                X = r.util.multiplyTransformMatrices(X, W[0])
            }
            return X
        }
    })();

    function s(F, E) {
        var D, G;
        F.replace(/;\s*$/, "").split(";").forEach(function(H) {
            var I = H.split(":");
            D = d(I[0].trim().toLowerCase());
            G = j(D, I[1].trim());
            E[D] = G
        })
    }

    function p(F, E) {
        var D, G;
        for (var H in F) {
            if (typeof F[H] === "undefined") {
                continue
            }
            D = d(H.toLowerCase());
            G = j(D, F[H]);
            E[D] = G
        }
    }

    function A(E, D) {
        var F = {};
        for (var H in r.cssRules[D]) {
            if (x(E, H.split(" "))) {
                for (var G in r.cssRules[D][H]) {
                    F[G] = r.cssRules[D][H][G]
                }
            }
        }
        return F
    }

    function x(F, E) {
        var D, G = true;
        D = l(F, E.pop());
        if (D && E.length) {
            G = o(F, E)
        }
        return D && G && (E.length === 0)
    }

    function o(F, E) {
        var D, G = true;
        while (F.parentNode && F.parentNode.nodeType === 1 && E.length) {
            if (G) {
                D = E.pop()
            }
            F = F.parentNode;
            G = l(F, D)
        }
        return E.length === 0
    }

    function l(F, D) {
        var J = F.nodeName,
            H = F.getAttribute("class"),
            I = F.getAttribute("id"),
            G;
        G = new RegExp("^" + J, "i");
        D = D.replace(G, "");
        if (I && D.length) {
            G = new RegExp("#" + I + "(?![a-zA-Z\\-]+)", "i");
            D = D.replace(G, "")
        }
        if (H && D.length) {
            H = H.split(" ");
            for (var E = H.length; E--;) {
                G = new RegExp("\\." + H[E] + "(?![a-zA-Z\\-]+)", "i");
                D = D.replace(G, "")
            }
        }
        return D.length === 0
    }

    function u(H, I) {
        var E;
        H.getElementById && (E = H.getElementById(I));
        if (E) {
            return E
        }
        var G, D, F = H.getElementsByTagName("*");
        for (D = 0; D < F.length; D++) {
            G = F[D];
            if (I === G.getAttribute("id")) {
                return G
            }
        }
    }

    function g(Q) {
        var S = v(Q, ["use", "svg:use"]),
            L = 0;
        while (S.length && L < S.length) {
            var G = S[L],
                J = G.getAttribute("xlink:href").substr(1),
                P = G.getAttribute("x") || 0,
                O = G.getAttribute("y") || 0,
                H = u(Q, J).cloneNode(true),
                D = (H.getAttribute("transform") || "") + " translate(" + P + ", " + O + ")",
                M, F = S.length,
                N, K, R, I;
            i(H);
            if (/^svg$/i.test(H.nodeName)) {
                var E = H.ownerDocument.createElement("g");
                for (K = 0, R = H.attributes, I = R.length; K < I; K++) {
                    N = R.item(K);
                    E.setAttribute(N.nodeName, N.nodeValue)
                }
                while (H.firstChild) {
                    E.appendChild(H.firstChild)
                }
                H = E
            }
            for (K = 0, R = G.attributes, I = R.length; K < I; K++) {
                N = R.item(K);
                if (N.nodeName === "x" || N.nodeName === "y" || N.nodeName === "xlink:href") {
                    continue
                }
                if (N.nodeName === "transform") {
                    D = N.nodeValue + " " + D
                } else {
                    H.setAttribute(N.nodeName, N.nodeValue)
                }
            }
            H.setAttribute("transform", D);
            H.setAttribute("instantiated_by_use", "1");
            H.removeAttribute("id");
            M = G.parentNode;
            M.replaceChild(H, G);
            if (S.length === F) {
                L++
            }
        }
    }
    var k = new RegExp("^\\s*(" + r.reNum + "+)\\s*,?\\s*(" + r.reNum + "+)\\s*,?\\s*(" + r.reNum + "+)\\s*,?\\s*(" + r.reNum + "+)\\s*$");

    function i(E) {
        var F = E.getAttribute("viewBox"),
            V = 1,
            T = 1,
            U = 0,
            S = 0,
            H, N, Q, D, M = E.getAttribute("width"),
            O = E.getAttribute("height"),
            I = E.getAttribute("x") || 0,
            G = E.getAttribute("y") || 0,
            J = E.getAttribute("preserveAspectRatio") || "",
            W = (!F || !a.test(E.nodeName) || !(F = F.match(k))),
            L = (!M || !O || M === "100%" || O === "100%"),
            P = W && L,
            R = {},
            K = "";
        R.width = 0;
        R.height = 0;
        R.toBeParsed = P;
        if (P) {
            return R
        }
        if (W) {
            R.width = t(M);
            R.height = t(O);
            return R
        }
        U = -parseFloat(F[1]);
        S = -parseFloat(F[2]);
        H = parseFloat(F[3]);
        N = parseFloat(F[4]);
        if (!L) {
            R.width = t(M);
            R.height = t(O);
            V = R.width / H;
            T = R.height / N
        } else {
            R.width = H;
            R.height = N
        }
        J = r.util.parsePreserveAspectRatioAttribute(J);
        if (J.alignX !== "none") {
            T = V = (V > T ? T : V)
        }
        if (V === 1 && T === 1 && U === 0 && S === 0 && I === 0 && G === 0) {
            return R
        }
        if (I || G) {
            K = " translate(" + t(I) + " " + t(G) + ") "
        }
        Q = K + " matrix(" + V + " 0 0 " + T + " " + (U * V) + " " + (S * T) + ") ";
        if (E.nodeName === "svg") {
            D = E.ownerDocument.createElement("g");
            while (E.firstChild) {
                D.appendChild(E.firstChild)
            }
            E.appendChild(D)
        } else {
            D = E;
            Q = D.getAttribute("transform") + Q
        }
        D.setAttribute("transform", Q);
        return R
    }

    function b(D, E) {
        while (D && (D = D.parentNode)) {
            if (D.nodeName && E.test(D.nodeName.replace("svg:", "")) && !D.getAttribute("instantiated_by_use")) {
                return true
            }
        }
        return false
    }
    r.parseSVGDocument = function(M, N, K, F) {
        if (!M) {
            return
        }
        g(M);
        var L = r.Object.__uid++,
            O = i(M),
            G = r.util.toArray(M.getElementsByTagName("*"));
        O.svgUid = L;
        if (G.length === 0 && r.isLikelyNode) {
            G = M.selectNodes('//*[name(.)!="svg"]');
            var I = [];
            for (var H = 0, J = G.length; H < J; H++) {
                I[H] = G[H]
            }
            G = I
        }
        var D = G.filter(function(P) {
            i(P);
            return n.test(P.nodeName.replace("svg:", "")) && !b(P, m)
        });
        if (!D || (D && !D.length)) {
            N && N([], {});
            return
        }
        if (F) {
            for (var H = 0, J = D.length; H < J; H++) {
                var E = D[H];
                if (E.nodeName === "image" && E.hasAttribute("xlink:href")) {
                    E.setAttribute("xlink:href", F(E.getAttribute("xlink:href"), E.getAttribute("id")))
                }
            }
        }
        r.gradientDefs[L] = r.getGradientDefs(M);
        r.cssRules[L] = r.getCSSRules(M);
        r.parseElements(D, function(P) {
            if (N) {
                N(P, O)
            }
        }, C(O), K)
    };
    var e = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + r.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + r.reNum + "))?\\s+(.*)");
    B(r, {
        parseFontDeclaration: function(J, E) {
            var G = J.match(e);
            if (!G) {
                return
            }
            var K = G[1],
                F = G[3],
                I = G[4],
                H = G[5],
                D = G[6];
            if (K) {
                E.fontStyle = K
            }
            if (F) {
                E.fontWeight = isNaN(parseFloat(F)) ? F : parseFloat(F)
            }
            if (I) {
                E.fontSize = t(I)
            }
            if (D) {
                E.fontFamily = D
            }
            if (H) {
                E.lineHeight = H === "normal" ? 1 : H
            }
        },
        getGradientDefs: function(K) {
            var J = ["linearGradient", "radialGradient", "svg:linearGradient", "svg:radialGradient"],
                I = v(K, J),
                E, H = 0,
                D, G, L = {},
                M = {};
            H = I.length;
            while (H--) {
                E = I[H];
                G = E.getAttribute("xlink:href");
                D = E.getAttribute("id");
                if (G) {
                    M[D] = G.substr(1)
                }
                L[D] = E
            }
            for (D in M) {
                var F = L[M[D]].cloneNode(true);
                E = L[D];
                while (F.firstChild) {
                    E.appendChild(F.firstChild)
                }
            }
            return L
        },
        parseAttributes: function(G, F, D) {
            if (!G) {
                return
            }
            var J, E = {},
                I;
            if (typeof D === "undefined") {
                D = G.getAttribute("svgUid")
            }
            if (G.parentNode && c.test(G.parentNode.nodeName)) {
                E = r.parseAttributes(G.parentNode, F, D)
            }
            I = (E && E.fontSize) || G.getAttribute("font-size") || r.Text.DEFAULT_SVG_FONT_SIZE;
            var H = F.reduce(function(L, K) {
                J = G.getAttribute(K);
                if (J) {
                    K = d(K);
                    J = j(K, J, E, I);
                    L[K] = J
                }
                return L
            }, {});
            H = B(H, B(A(G, D), r.parseStyleAttribute(G)));
            if (H.font) {
                r.parseFontDeclaration(H.font, H)
            }
            return f(B(E, H))
        },
        parseElements: function(F, G, E, D) {
            new r.ElementsParser(F, G, E, D).parse()
        },
        parseStyleAttribute: function(E) {
            var D = {},
                F = E.getAttribute("style");
            if (!F) {
                return D
            }
            if (typeof F === "string") {
                s(F, D)
            } else {
                p(F, D)
            }
            return D
        },
        parsePointsAttribute: function(G) {
            if (!G) {
                return null
            }
            G = G.replace(/,/g, " ").trim();
            G = G.split(/\s+/);
            var E = [],
                F, D;
            F = 0;
            D = G.length;
            for (; F < D; F += 2) {
                E.push({
                    x: parseFloat(G[F]),
                    y: parseFloat(G[F + 1])
                })
            }
            return E
        },
        getCSSRules: function(I) {
            var G = I.getElementsByTagName("style"),
                E = {},
                J;
            for (var F = 0, D = G.length; F < D; F++) {
                var H = G[F].textContent || G[F].text;
                H = H.replace(/\/\*[\s\S]*?\*\//g, "");
                if (H.trim() === "") {
                    continue
                }
                J = H.match(/[^{]*\{[\s\S]*?\}/g);
                J = J.map(function(K) {
                    return K.trim()
                });
                J.forEach(function(Q) {
                    var O = Q.match(/([\s\S]*?)\s*\{([^}]*)\}/),
                        M = {},
                        K = O[2].trim(),
                        S = K.replace(/;$/, "").split(/\s*;\s*/);
                    for (var N = 0, P = S.length; N < P; N++) {
                        var L = S[N].split(/\s*:\s*/),
                            T = d(L[0]),
                            R = j(T, L[1], L[0]);
                        M[T] = R
                    }
                    Q = O[1];
                    Q.split(",").forEach(function(U) {
                        U = U.replace(/^svg/i, "").trim();
                        if (U === "") {
                            return
                        }
                        if (E[U]) {
                            r.util.object.extend(E[U], M)
                        } else {
                            E[U] = r.util.object.clone(M)
                        }
                    })
                })
            }
            return E
        },
        loadSVGFromURL: function(E, H, D, F) {
            E = E.replace(/^\n\s*/, "").trim();
            new r.util.request(E, {
                method: "get",
                onComplete: G
            });

            function G(J) {
                var I = J.responseXML;
                if (I && !I.documentElement && r.window.ActiveXObject && J.responseText) {
                    I = new ActiveXObject("Microsoft.XMLDOM");
                    I.async = "false";
                    I.loadXML(J.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))
                }
                if (!I || !I.documentElement) {
                    H && H(null)
                }
                r.parseSVGDocument(I.documentElement, function(L, K) {
                    H && H(L, K)
                }, D, F)
            }
        },
        loadSVGFromString: function(E, I, D, F) {
            E = E.trim();
            var G;
            if (typeof DOMParser !== "undefined") {
                var H = new DOMParser();
                if (H && H.parseFromString) {
                    G = H.parseFromString(E, "text/xml")
                }
            } else {
                if (r.window.ActiveXObject) {
                    G = new ActiveXObject("Microsoft.XMLDOM");
                    G.async = "false";
                    G.loadXML(E.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))
                }
            }
            r.parseSVGDocument(G.documentElement, function(K, J) {
                I(K, J)
            }, D, F)
        }
    })
})(typeof exports !== "undefined" ? exports : this);
fabric.ElementsParser = function(c, d, b, a) {
    this.elements = c;
    this.callback = d;
    this.options = b;
    this.reviver = a;
    this.svgUid = (b && b.svgUid) || 0
};
fabric.ElementsParser.prototype.parse = function() {
    this.instances = new Array(this.elements.length);
    this.numElements = this.elements.length;
    this.createObjects()
};
fabric.ElementsParser.prototype.createObjects = function() {
    for (var b = 0, a = this.elements.length; b < a; b++) {
        this.elements[b].setAttribute("svgUid", this.svgUid);
        (function(d, c) {
            setTimeout(function() {
                d.createObject(d.elements[c], c)
            }, 0)
        })(this, b)
    }
};
fabric.ElementsParser.prototype.createObject = function(c, b) {
    var a = fabric[fabric.util.string.capitalize(c.tagName.replace("svg:", ""))];
    if (a && a.fromElement) {
        try {
            this._createObject(a, c, b)
        } catch (d) {
            fabric.log(d)
        }
    } else {
        this.checkIfDone()
    }
};
fabric.ElementsParser.prototype._createObject = function(a, c, b) {
    if (a.async) {
        a.fromElement(c, this.createCallback(b, c), this.options)
    } else {
        var d = a.fromElement(c, this.options);
        this.resolveGradient(d, "fill");
        this.resolveGradient(d, "stroke");
        this.reviver && this.reviver(c, d);
        this.instances[b] = d;
        this.checkIfDone()
    }
};
fabric.ElementsParser.prototype.createCallback = function(a, b) {
    var c = this;
    return function(d) {
        c.resolveGradient(d, "fill");
        c.resolveGradient(d, "stroke");
        c.reviver && c.reviver(b, d);
        c.instances[a] = d;
        c.checkIfDone()
    }
};
fabric.ElementsParser.prototype.resolveGradient = function(d, c) {
    var a = d.get(c);
    if (!(/^url\(/).test(a)) {
        return
    }
    var b = a.slice(5, a.length - 1);
    if (fabric.gradientDefs[this.svgUid][b]) {
        d.set(c, fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][b], d))
    }
};
fabric.ElementsParser.prototype.checkIfDone = function() {
    if (--this.numElements === 0) {
        this.instances = this.instances.filter(function(a) {
            return a != null
        });
        this.callback(this.instances)
    }
};
(function(b) {
    var c = b.fabric || (b.fabric = {});
    if (c.Point) {
        c.warn("fabric.Point is already defined");
        return
    }
    c.Point = a;

    function a(d, e) {
        this.x = d;
        this.y = e
    }
    a.prototype = {
        type: "point",
        constructor: a,
        add: function(d) {
            return new a(this.x + d.x, this.y + d.y)
        },
        addEquals: function(d) {
            this.x += d.x;
            this.y += d.y;
            return this
        },
        scalarAdd: function(d) {
            return new a(this.x + d, this.y + d)
        },
        scalarAddEquals: function(d) {
            this.x += d;
            this.y += d;
            return this
        },
        subtract: function(d) {
            return new a(this.x - d.x, this.y - d.y)
        },
        subtractEquals: function(d) {
            this.x -= d.x;
            this.y -= d.y;
            return this
        },
        scalarSubtract: function(d) {
            return new a(this.x - d, this.y - d)
        },
        scalarSubtractEquals: function(d) {
            this.x -= d;
            this.y -= d;
            return this
        },
        multiply: function(d) {
            return new a(this.x * d, this.y * d)
        },
        multiplyEquals: function(d) {
            this.x *= d;
            this.y *= d;
            return this
        },
        divide: function(d) {
            return new a(this.x / d, this.y / d)
        },
        divideEquals: function(d) {
            this.x /= d;
            this.y /= d;
            return this
        },
        eq: function(d) {
            return (this.x === d.x && this.y === d.y)
        },
        lt: function(d) {
            return (this.x < d.x && this.y < d.y)
        },
        lte: function(d) {
            return (this.x <= d.x && this.y <= d.y)
        },
        gt: function(d) {
            return (this.x > d.x && this.y > d.y)
        },
        gte: function(d) {
            return (this.x >= d.x && this.y >= d.y)
        },
        lerp: function(e, d) {
            if (typeof d === "undefined") {
                d = 0.5
            }
            d = Math.max(Math.min(1, d), 0);
            return new a(this.x + (e.x - this.x) * d, this.y + (e.y - this.y) * d)
        },
        distanceFrom: function(f) {
            var e = this.x - f.x,
                d = this.y - f.y;
            return Math.sqrt(e * e + d * d)
        },
        midPointFrom: function(d) {
            return this.lerp(d)
        },
        min: function(d) {
            return new a(Math.min(this.x, d.x), Math.min(this.y, d.y))
        },
        max: function(d) {
            return new a(Math.max(this.x, d.x), Math.max(this.y, d.y))
        },
        toString: function() {
            return this.x + "," + this.y
        },
        setXY: function(d, e) {
            this.x = d;
            this.y = e;
            return this
        },
        setX: function(d) {
            this.x = d;
            return this
        },
        setY: function(d) {
            this.y = d;
            return this
        },
        setFromPoint: function(d) {
            this.x = d.x;
            this.y = d.y;
            return this
        },
        swap: function(e) {
            var d = this.x,
                f = this.y;
            this.x = e.x;
            this.y = e.y;
            e.x = d;
            e.y = f
        },
        clone: function() {
            return new a(this.x, this.y)
        }
    }
})(typeof exports !== "undefined" ? exports : this);
(function(a) {
    var b = a.fabric || (a.fabric = {});
    if (b.Intersection) {
        b.warn("fabric.Intersection is already defined");
        return
    }

    function c(d) {
        this.status = d;
        this.points = []
    }
    b.Intersection = c;
    b.Intersection.prototype = {
        constructor: c,
        appendPoint: function(d) {
            this.points.push(d);
            return this
        },
        appendPoints: function(d) {
            this.points = this.points.concat(d);
            return this
        }
    };
    b.Intersection.intersectLineLine = function(h, g, l, k) {
        var m, e = (k.x - l.x) * (h.y - l.y) - (k.y - l.y) * (h.x - l.x),
            j = (g.x - h.x) * (h.y - l.y) - (g.y - h.y) * (h.x - l.x),
            i = (k.y - l.y) * (g.x - h.x) - (k.x - l.x) * (g.y - h.y);
        if (i !== 0) {
            var f = e / i,
                d = j / i;
            if (0 <= f && f <= 1 && 0 <= d && d <= 1) {
                m = new c("Intersection");
                m.appendPoint(new b.Point(h.x + f * (g.x - h.x), h.y + f * (g.y - h.y)))
            } else {
                m = new c()
            }
        } else {
            if (e === 0 || j === 0) {
                m = new c("Coincident")
            } else {
                m = new c("Parallel")
            }
        }
        return m
    };
    b.Intersection.intersectLinePolygon = function(e, d, l) {
        var m = new c(),
            f = l.length,
            k, j, g;
        for (var h = 0; h < f; h++) {
            k = l[h];
            j = l[(h + 1) % f];
            g = c.intersectLineLine(e, d, k, j);
            m.appendPoints(g.points)
        }
        if (m.points.length > 0) {
            m.status = "Intersection"
        }
        return m
    };
    b.Intersection.intersectPolygonPolygon = function(j, h) {
        var f = new c(),
            l = j.length;
        for (var k = 0; k < l; k++) {
            var g = j[k],
                e = j[(k + 1) % l],
                d = c.intersectLinePolygon(g, e, h);
            f.appendPoints(d.points)
        }
        if (f.points.length > 0) {
            f.status = "Intersection"
        }
        return f
    };
    b.Intersection.intersectPolygonRectangle = function(n, e, d) {
        var g = e.min(d),
            m = e.max(d),
            f = new b.Point(m.x, g.y),
            l = new b.Point(g.x, m.y),
            k = c.intersectLinePolygon(g, f, n),
            j = c.intersectLinePolygon(f, m, n),
            i = c.intersectLinePolygon(m, l, n),
            h = c.intersectLinePolygon(l, g, n),
            o = new c();
        o.appendPoints(k.points);
        o.appendPoints(j.points);
        o.appendPoints(i.points);
        o.appendPoints(h.points);
        if (o.points.length > 0) {
            o.status = "Intersection"
        }
        return o
    }
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {});
    if (c.Color) {
        c.warn("fabric.Color is already defined.");
        return
    }

    function d(e) {
        if (!e) {
            this.setSource([0, 0, 0, 1])
        } else {
            this._tryParsingColor(e)
        }
    }
    c.Color = d;
    c.Color.prototype = {
        _tryParsingColor: function(e) {
            var f;
            if (e in d.colorNameMap) {
                e = d.colorNameMap[e]
            }
            if (e === "transparent") {
                f = [255, 255, 255, 0]
            }
            if (!f) {
                f = d.sourceFromHex(e)
            }
            if (!f) {
                f = d.sourceFromRgb(e)
            }
            if (!f) {
                f = d.sourceFromHsl(e)
            }
            if (!f) {
                f = [0, 0, 0, 1]
            }
            if (f) {
                this.setSource(f)
            }
        },
        _rgbToHsl: function(e, k, n) {
            e /= 255;
            k /= 255;
            n /= 255;
            var j, p, f, o = c.util.array.max([e, k, n]),
                i = c.util.array.min([e, k, n]);
            f = (o + i) / 2;
            if (o === i) {
                j = p = 0
            } else {
                var m = o - i;
                p = f > 0.5 ? m / (2 - o - i) : m / (o + i);
                switch (o) {
                    case e:
                        j = (k - n) / m + (k < n ? 6 : 0);
                        break;
                    case k:
                        j = (n - e) / m + 2;
                        break;
                    case n:
                        j = (e - k) / m + 4;
                        break
                }
                j /= 6
            }
            return [Math.round(j * 360), Math.round(p * 100), Math.round(f * 100)]
        },
        getSource: function() {
            return this._source
        },
        setSource: function(e) {
            this._source = e
        },
        toRgb: function() {
            var e = this.getSource();
            return "rgb(" + e[0] + "," + e[1] + "," + e[2] + ")"
        },
        toRgba: function() {
            var e = this.getSource();
            return "rgba(" + e[0] + "," + e[1] + "," + e[2] + "," + e[3] + ")"
        },
        toHsl: function() {
            var f = this.getSource(),
                e = this._rgbToHsl(f[0], f[1], f[2]);
            return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
        },
        toHsla: function() {
            var f = this.getSource(),
                e = this._rgbToHsl(f[0], f[1], f[2]);
            return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + f[3] + ")"
        },
        toHex: function() {
            var i = this.getSource(),
                h, f, e;
            h = i[0].toString(16);
            h = (h.length === 1) ? ("0" + h) : h;
            f = i[1].toString(16);
            f = (f.length === 1) ? ("0" + f) : f;
            e = i[2].toString(16);
            e = (e.length === 1) ? ("0" + e) : e;
            return h.toUpperCase() + f.toUpperCase() + e.toUpperCase()
        },
        toHexa: function() {
            var f = this.getSource(),
                e;
            e = f[3] * 255;
            e = e.toString(16);
            e = (e.length === 1) ? ("0" + e) : e;
            return this.toHex() + e.toUpperCase()
        },
        getAlpha: function() {
            return this.getSource()[3]
        },
        setAlpha: function(f) {
            var e = this.getSource();
            e[3] = f;
            this.setSource(e);
            return this
        },
        toGrayscale: function() {
            var g = this.getSource(),
                f = parseInt((g[0] * 0.3 + g[1] * 0.59 + g[2] * 0.11).toFixed(0), 10),
                e = g[3];
            this.setSource([f, f, f, e]);
            return this
        },
        toBlackWhite: function(e) {
            var h = this.getSource(),
                g = (h[0] * 0.3 + h[1] * 0.59 + h[2] * 0.11).toFixed(0),
                f = h[3];
            e = e || 127;
            g = (Number(g) < Number(e)) ? 0 : 255;
            this.setSource([g, g, g, f]);
            return this
        },
        overlayWith: function(l) {
            if (!(l instanceof d)) {
                l = new d(l)
            }
            var e = [],
                k = this.getAlpha(),
                h = 0.5,
                j = this.getSource(),
                f = l.getSource();
            for (var g = 0; g < 3; g++) {
                e.push(Math.round((j[g] * (1 - h)) + (f[g] * h)))
            }
            e[3] = k;
            this.setSource(e);
            return this
        }
    };
    c.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
    c.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/;
    c.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;
    c.Color.colorNameMap = {
        aqua: "#00FFFF",
        black: "#000000",
        blue: "#0000FF",
        fuchsia: "#FF00FF",
        gray: "#808080",
        grey: "#808080",
        green: "#008000",
        lime: "#00FF00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        orange: "#FFA500",
        purple: "#800080",
        red: "#FF0000",
        silver: "#C0C0C0",
        teal: "#008080",
        white: "#FFFFFF",
        yellow: "#FFFF00"
    };

    function a(g, f, e) {
        if (e < 0) {
            e += 1
        }
        if (e > 1) {
            e -= 1
        }
        if (e < 1 / 6) {
            return g + (f - g) * 6 * e
        }
        if (e < 1 / 2) {
            return f
        }
        if (e < 2 / 3) {
            return g + (f - g) * (2 / 3 - e) * 6
        }
        return g
    }
    c.Color.fromRgb = function(e) {
        return d.fromSource(d.sourceFromRgb(e))
    };
    c.Color.sourceFromRgb = function(f) {
        var h = f.match(d.reRGBa);
        if (h) {
            var j = parseInt(h[1], 10) / (/%$/.test(h[1]) ? 100 : 1) * (/%$/.test(h[1]) ? 255 : 1),
                i = parseInt(h[2], 10) / (/%$/.test(h[2]) ? 100 : 1) * (/%$/.test(h[2]) ? 255 : 1),
                e = parseInt(h[3], 10) / (/%$/.test(h[3]) ? 100 : 1) * (/%$/.test(h[3]) ? 255 : 1);
            return [parseInt(j, 10), parseInt(i, 10), parseInt(e, 10), h[4] ? parseFloat(h[4]) : 1]
        }
    };
    c.Color.fromRgba = d.fromRgb;
    c.Color.fromHsl = function(e) {
        return d.fromSource(d.sourceFromHsl(e))
    };
    c.Color.sourceFromHsl = function(k) {
        var n = k.match(d.reHSLa);
        if (!n) {
            return
        }
        var m = (((parseFloat(n[1]) % 360) + 360) % 360) / 360,
            u = parseFloat(n[2]) / (/%$/.test(n[2]) ? 100 : 1),
            j = parseFloat(n[3]) / (/%$/.test(n[3]) ? 100 : 1),
            e, o, t;
        if (u === 0) {
            e = o = t = j
        } else {
            var f = j <= 0.5 ? j * (u + 1) : j + u - j * u,
                i = j * 2 - f;
            e = a(i, f, m + 1 / 3);
            o = a(i, f, m);
            t = a(i, f, m - 1 / 3)
        }
        return [Math.round(e * 255), Math.round(o * 255), Math.round(t * 255), n[4] ? parseFloat(n[4]) : 1]
    };
    c.Color.fromHsla = d.fromHsl;
    c.Color.fromHex = function(e) {
        return d.fromSource(d.sourceFromHex(e))
    };
    c.Color.sourceFromHex = function(i) {
        if (i.match(d.reHex)) {
            var m = i.slice(i.indexOf("#") + 1),
                f = (m.length === 3 || m.length === 4),
                j = (m.length === 8 || m.length === 4),
                l = f ? (m.charAt(0) + m.charAt(0)) : m.substring(0, 2),
                k = f ? (m.charAt(1) + m.charAt(1)) : m.substring(2, 4),
                e = f ? (m.charAt(2) + m.charAt(2)) : m.substring(4, 6),
                h = j ? (f ? (m.charAt(3) + m.charAt(3)) : m.substring(6, 8)) : "FF";
            return [parseInt(l, 16), parseInt(k, 16), parseInt(e, 16), parseFloat((parseInt(h, 16) / 255).toFixed(2))]
        }
    };
    c.Color.fromSource = function(e) {
        var f = new d();
        f.setSource(e);
        return f
    }
})(typeof exports !== "undefined" ? exports : this);
(function() {
    function d(f) {
        var e = f.getAttribute("style"),
            h = f.getAttribute("offset") || 0,
            g, m, l;
        h = parseFloat(h) / (/%$/.test(h) ? 100 : 1);
        h = h < 0 ? 0 : h > 1 ? 1 : h;
        if (e) {
            var k = e.split(/\s*;\s*/);
            if (k[k.length - 1] === "") {
                k.pop()
            }
            for (var j = k.length; j--;) {
                var n = k[j].split(/\s*:\s*/),
                    p = n[0].trim(),
                    o = n[1].trim();
                if (p === "stop-color") {
                    g = o
                } else {
                    if (p === "stop-opacity") {
                        l = o
                    }
                }
            }
        }
        if (!g) {
            g = f.getAttribute("stop-color") || "rgb(0,0,0)"
        }
        if (!l) {
            l = f.getAttribute("stop-opacity")
        }
        g = new fabric.Color(g);
        m = g.getAlpha();
        l = isNaN(parseFloat(l)) ? 1 : parseFloat(l);
        l *= m;
        return {
            offset: h,
            color: g.toRgb(),
            opacity: l
        }
    }

    function b(e) {
        return {
            x1: e.getAttribute("x1") || 0,
            y1: e.getAttribute("y1") || 0,
            x2: e.getAttribute("x2") || "100%",
            y2: e.getAttribute("y2") || 0
        }
    }

    function c(e) {
        return {
            x1: e.getAttribute("fx") || e.getAttribute("cx") || "50%",
            y1: e.getAttribute("fy") || e.getAttribute("cy") || "50%",
            r1: 0,
            x2: e.getAttribute("cx") || "50%",
            y2: e.getAttribute("cy") || "50%",
            r2: e.getAttribute("r") || "50%"
        }
    }
    fabric.Gradient = fabric.util.createClass({
        offsetX: 0,
        offsetY: 0,
        initialize: function(e) {
            e || (e = {});
            var f = {};
            this.id = fabric.Object.__uid++;
            this.type = e.type || "linear";
            f = {
                x1: e.coords.x1 || 0,
                y1: e.coords.y1 || 0,
                x2: e.coords.x2 || 0,
                y2: e.coords.y2 || 0
            };
            if (this.type === "radial") {
                f.r1 = e.coords.r1 || 0;
                f.r2 = e.coords.r2 || 0
            }
            this.coords = f;
            this.colorStops = e.colorStops.slice();
            if (e.gradientTransform) {
                this.gradientTransform = e.gradientTransform
            }
            this.offsetX = e.offsetX || this.offsetX;
            this.offsetY = e.offsetY || this.offsetY
        },
        addColorStop: function(g) {
            for (var e in g) {
                var f = new fabric.Color(g[e]);
                this.colorStops.push({
                    offset: e,
                    color: f.toRgb(),
                    opacity: f.getAlpha()
                })
            }
            return this
        },
        toObject: function(f) {
            var e = {
                type: this.type,
                coords: this.coords,
                colorStops: this.colorStops,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
            };
            fabric.util.populateWithProperties(this, e, f);
            return e
        },
        toSVG: function(g) {
            var j = fabric.util.object.clone(this.coords),
                f, e;
            this.colorStops.sort(function(l, i) {
                return l.offset - i.offset
            });
            if (!(g.group && g.group.type === "path-group")) {
                for (var k in j) {
                    if (k === "x1" || k === "x2" || k === "r2") {
                        j[k] += this.offsetX - g.width / 2
                    } else {
                        if (k === "y1" || k === "y2") {
                            j[k] += this.offsetY - g.height / 2
                        }
                    }
                }
            }
            e = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"';
            if (this.gradientTransform) {
                e += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" '
            }
            if (this.type === "linear") {
                f = ["<linearGradient ", e, ' x1="', j.x1, '" y1="', j.y1, '" x2="', j.x2, '" y2="', j.y2, '">\n']
            } else {
                if (this.type === "radial") {
                    f = ["<radialGradient ", e, ' cx="', j.x2, '" cy="', j.y2, '" r="', j.r2, '" fx="', j.x1, '" fy="', j.y1, '">\n']
                }
            }
            for (var h = 0; h < this.colorStops.length; h++) {
                f.push("<stop ", 'offset="', (this.colorStops[h].offset * 100) + "%", '" style="stop-color:', this.colorStops[h].color, (this.colorStops[h].opacity !== null ? ";stop-opacity: " + this.colorStops[h].opacity : ";"), '"/>\n')
            }
            f.push((this.type === "linear" ? "</linearGradient>\n" : "</radialGradient>\n"));
            return f.join("")
        },
        toLive: function(o, f) {
            var m, e, n = fabric.util.object.clone(this.coords);
            if (!this.type) {
                return
            }
            if (f.group && f.group.type === "path-group") {
                for (e in n) {
                    if (e === "x1" || e === "x2") {
                        n[e] += -this.offsetX + f.width / 2
                    } else {
                        if (e === "y1" || e === "y2") {
                            n[e] += -this.offsetY + f.height / 2
                        }
                    }
                }
            }
            if (this.type === "linear") {
                m = o.createLinearGradient(n.x1, n.y1, n.x2, n.y2)
            } else {
                if (this.type === "radial") {
                    m = o.createRadialGradient(n.x1, n.y1, n.r1, n.x2, n.y2, n.r2)
                }
            }
            for (var j = 0, l = this.colorStops.length; j < l; j++) {
                var g = this.colorStops[j].color,
                    k = this.colorStops[j].opacity,
                    h = this.colorStops[j].offset;
                if (typeof k !== "undefined") {
                    g = new fabric.Color(g).setAlpha(k).toRgba()
                }
                m.addColorStop(parseFloat(h), g)
            }
            return m
        }
    });
    fabric.util.object.extend(fabric.Gradient, {
        fromElement: function(f, p) {
            var n = f.getElementsByTagName("stop"),
                l, h = f.getAttribute("gradientUnits") || "objectBoundingBox",
                e = f.getAttribute("gradientTransform"),
                g = [],
                o, k;
            if (f.nodeName === "linearGradient" || f.nodeName === "LINEARGRADIENT") {
                l = "linear"
            } else {
                l = "radial"
            }
            if (l === "linear") {
                o = b(f)
            } else {
                if (l === "radial") {
                    o = c(f)
                }
            }
            for (var j = n.length; j--;) {
                g.push(d(n[j]))
            }
            k = a(p, o, h);
            var m = new fabric.Gradient({
                type: l,
                coords: o,
                colorStops: g,
                offsetX: -p.left,
                offsetY: -p.top
            });
            if (e || k !== "") {
                m.gradientTransform = fabric.parseTransformAttribute((e || "") + k)
            }
            return m
        },
        forObject: function(f, e) {
            e || (e = {});
            a(f, e.coords, "userSpaceOnUse");
            return new fabric.Gradient(e)
        }
    });

    function a(h, m, g) {
        var f, l = 0,
            k = 1,
            i = "";
        for (var e in m) {
            if (m[e] === "Infinity") {
                m[e] = 1
            } else {
                if (m[e] === "-Infinity") {
                    m[e] = 0
                }
            }
            f = parseFloat(m[e], 10);
            if (typeof m[e] === "string" && /^\d+%$/.test(m[e])) {
                k = 0.01
            } else {
                k = 1
            }
            if (e === "x1" || e === "x2" || e === "r2") {
                k *= g === "objectBoundingBox" ? h.width : 1;
                l = g === "objectBoundingBox" ? h.left || 0 : 0
            } else {
                if (e === "y1" || e === "y2") {
                    k *= g === "objectBoundingBox" ? h.height : 1;
                    l = g === "objectBoundingBox" ? h.top || 0 : 0
                }
            }
            m[e] = f * k + l
        }
        if (h.type === "ellipse" && m.r2 !== null && g === "objectBoundingBox" && h.rx !== h.ry) {
            var j = h.ry / h.rx;
            i = " scale(1, " + j + ")";
            if (m.y1) {
                m.y1 /= j
            }
            if (m.y2) {
                m.y2 /= j
            }
        }
        return i
    }
})();
(function() {
    var a = fabric.util.toFixed;
    fabric.Pattern = fabric.util.createClass({
        repeat: "repeat",
        offsetX: 0,
        offsetY: 0,
        initialize: function(b, d) {
            b || (b = {});
            this.id = fabric.Object.__uid++;
            this.setOptions(b);
            if (!b.source || (b.source && typeof b.source !== "string")) {
                d && d(this);
                return
            }
            if (typeof fabric.util.getFunctionBody(b.source) !== "undefined") {
                this.source = new Function(fabric.util.getFunctionBody(b.source));
                d && d(this)
            } else {
                var c = this;
                this.source = fabric.util.createImage();
                fabric.util.loadImage(b.source, function(e) {
                    c.source = e;
                    d && d(c)
                })
            }
        },
        toObject: function(e) {
            var c = fabric.Object.NUM_FRACTION_DIGITS,
                d, b;
            if (typeof this.source === "function") {
                d = String(this.source)
            } else {
                if (typeof this.source.src === "string") {
                    d = this.source.src
                } else {
                    if (typeof this.source === "object" && this.source.toDataURL) {
                        d = this.source.toDataURL()
                    }
                }
            }
            b = {
                type: "pattern",
                source: d,
                repeat: this.repeat,
                offsetX: a(this.offsetX, c),
                offsetY: a(this.offsetY, c),
            };
            fabric.util.populateWithProperties(this, b, e);
            return b
        },
        toSVG: function(c) {
            var b = typeof this.source === "function" ? this.source() : this.source,
                g = b.width / c.width,
                e = b.height / c.height,
                f = this.offsetX / c.width,
                d = this.offsetY / c.height,
                h = "";
            if (this.repeat === "repeat-x" || this.repeat === "no-repeat") {
                e = 1
            }
            if (this.repeat === "repeat-y" || this.repeat === "no-repeat") {
                g = 1
            }
            if (b.src) {
                h = b.src
            } else {
                if (b.toDataURL) {
                    h = b.toDataURL()
                }
            }
            return '<pattern id="SVGID_' + this.id + '" x="' + f + '" y="' + d + '" width="' + g + '" height="' + e + '">\n<image x="0" y="0" width="' + b.width + '" height="' + b.height + '" xlink:href="' + h + '"></image>\n</pattern>\n'
        },
        setOptions: function(b) {
            for (var c in b) {
                this[c] = b[c]
            }
        },
        toLive: function(b) {
            var c = typeof this.source === "function" ? this.source() : this.source;
            if (!c) {
                return ""
            }
            if (typeof c.src !== "undefined") {
                if (!c.complete) {
                    return ""
                }
                if (c.naturalWidth === 0 || c.naturalHeight === 0) {
                    return ""
                }
            }
            return b.createPattern(c, this.repeat)
        }
    })
})();
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        a = c.util.toFixed;
    if (c.Shadow) {
        c.warn("fabric.Shadow is already defined.");
        return
    }
    c.Shadow = c.util.createClass({
        color: "rgb(0,0,0)",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: false,
        includeDefaultValues: true,
        initialize: function(d) {
            if (typeof d === "string") {
                d = this._parseShadow(d)
            }
            for (var e in d) {
                this[e] = d[e]
            }
            this.id = c.Object.__uid++
        },
        _parseShadow: function(g) {
            var f = g.trim(),
                e = c.Shadow.reOffsetsAndBlur.exec(f) || [],
                d = f.replace(c.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)";
            return {
                color: d.trim(),
                offsetX: parseInt(e[1], 10) || 0,
                offsetY: parseInt(e[2], 10) || 0,
                blur: parseInt(e[3], 10) || 0
            }
        },
        toString: function() {
            return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
        },
        toSVG: function(e) {
            var d = 40,
                i = 40,
                f = c.Object.NUM_FRACTION_DIGITS,
                h = c.util.rotateVector({
                    x: this.offsetX,
                    y: this.offsetY
                }, c.util.degreesToRadians(-e.angle)),
                g = 20;
            if (e.width && e.height) {
                d = a((Math.abs(h.x) + this.blur) / e.width, f) * 100 + g;
                i = a((Math.abs(h.y) + this.blur) / e.height, f) * 100 + g
            }
            if (e.flipX) {
                h.x *= -1
            }
            if (e.flipY) {
                h.y *= -1
            }
            return ('<filter id="SVGID_' + this.id + '" y="-' + i + '%" height="' + (100 + 2 * i) + '%" x="-' + d + '%" width="' + (100 + 2 * d) + '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' + a(this.blur ? this.blur / 2 : 0, f) + '"></feGaussianBlur>\n\t<feOffset dx="' + a(h.x, f) + '" dy="' + a(h.y, f) + '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' + this.color + '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n')
        },
        toObject: function() {
            if (this.includeDefaultValues) {
                return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY,
                    affectStroke: this.affectStroke
                }
            }
            var e = {},
                d = c.Shadow.prototype;
            ["color", "blur", "offsetX", "offsetY", "affectStroke"].forEach(function(f) {
                if (this[f] !== d[f]) {
                    e[f] = this[f]
                }
            }, this);
            return e
        }
    });
    c.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/
})(typeof exports !== "undefined" ? exports : this);
(function() {
    if (fabric.StaticCanvas) {
        fabric.warn("fabric.StaticCanvas is already defined.");
        return
    }
    var g = fabric.util.object.extend,
        d = fabric.util.getElementOffset,
        f = fabric.util.removeFromArray,
        a = fabric.util.toFixed,
        e = fabric.util.transformPoint,
        b = fabric.util.invertTransform,
        c = new Error("Could not initialize `canvas` element");
    fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
        initialize: function(i, h) {
            h || (h = {});
            this._initStatic(i, h)
        },
        backgroundColor: "",
        backgroundImage: null,
        overlayColor: "",
        overlayImage: null,
        includeDefaultValues: true,
        stateful: false,
        renderOnAddRemove: true,
        clipTo: null,
        controlsAboveOverlay: false,
        allowTouchScrolling: false,
        imageSmoothingEnabled: true,
        viewportTransform: fabric.iMatrix.concat(),
        backgroundVpt: true,
        overlayVpt: true,
        onBeforeScaleRotate: function() {},
        enableRetinaScaling: true,
        vptCoords: {},
        _initStatic: function(j, i) {
            var h = fabric.StaticCanvas.prototype.renderAll.bind(this);
            this._objects = [];
            this._createLowerCanvas(j);
            this._initOptions(i);
            this._setImageSmoothing();
            if (!this.interactive) {
                this._initRetinaScaling()
            }
            if (i.overlayImage) {
                this.setOverlayImage(i.overlayImage, h)
            }
            if (i.backgroundImage) {
                this.setBackgroundImage(i.backgroundImage, h)
            }
            if (i.backgroundColor) {
                this.setBackgroundColor(i.backgroundColor, h)
            }
            if (i.overlayColor) {
                this.setOverlayColor(i.overlayColor, h)
            }
            this.calcOffset()
        },
        _isRetinaScaling: function() {
            return (fabric.devicePixelRatio !== 1 && this.enableRetinaScaling)
        },
        getRetinaScaling: function() {
            return this._isRetinaScaling() ? fabric.devicePixelRatio : 1
        },
        _initRetinaScaling: function() {
            if (!this._isRetinaScaling()) {
                return
            }
            this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio);
            this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio);
            this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio)
        },
        calcOffset: function() {
            this._offset = d(this.lowerCanvasEl);
            return this
        },
        setOverlayImage: function(i, j, h) {
            return this.__setBgOverlayImage("overlayImage", i, j, h)
        },
        setBackgroundImage: function(i, j, h) {
            return this.__setBgOverlayImage("backgroundImage", i, j, h)
        },
        setOverlayColor: function(i, h) {
            return this.__setBgOverlayColor("overlayColor", i, h)
        },
        setBackgroundColor: function(h, i) {
            return this.__setBgOverlayColor("backgroundColor", h, i)
        },
        _setImageSmoothing: function() {
            var h = this.getContext();
            h.imageSmoothingEnabled = h.imageSmoothingEnabled || h.webkitImageSmoothingEnabled || h.mozImageSmoothingEnabled || h.msImageSmoothingEnabled || h.oImageSmoothingEnabled;
            h.imageSmoothingEnabled = this.imageSmoothingEnabled
        },
        __setBgOverlayImage: function(i, j, k, h) {
            if (typeof j === "string") {
                fabric.util.loadImage(j, function(l) {
                    l && (this[i] = new fabric.Image(l, h));
                    k && k(l)
                }, this, h && h.crossOrigin)
            } else {
                h && j.setOptions(h);
                this[i] = j;
                k && k(j)
            }
            return this
        },
        __setBgOverlayColor: function(i, h, j) {
            this[i] = h;
            this._initGradient(h, i);
            this._initPattern(h, i, j);
            return this
        },
        _createCanvasElement: function(i) {
            var h = fabric.util.createCanvasElement(i);
            if (!h.style) {
                h.style = {}
            }
            if (!h) {
                throw c
            }
            if (typeof h.getContext === "undefined") {
                throw c
            }
            return h
        },
        _initOptions: function(h) {
            this._setOptions(h);
            this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0;
            this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0;
            if (!this.lowerCanvasEl.style) {
                return
            }
            this.lowerCanvasEl.width = this.width;
            this.lowerCanvasEl.height = this.height;
            this.lowerCanvasEl.style.width = this.width + "px";
            this.lowerCanvasEl.style.height = this.height + "px";
            this.viewportTransform = this.viewportTransform.slice()
        },
        _createLowerCanvas: function(h) {
            this.lowerCanvasEl = fabric.util.getById(h) || this._createCanvasElement(h);
            fabric.util.addClass(this.lowerCanvasEl, "lower-canvas");
            if (this.interactive) {
                this._applyCanvasStyle(this.lowerCanvasEl)
            }
            this.contextContainer = this.lowerCanvasEl.getContext("2d")
        },
        getWidth: function() {
            return this.width
        },
        getHeight: function() {
            return this.height
        },
        setWidth: function(i, h) {
            return this.setDimensions({
                width: i
            }, h)
        },
        setHeight: function(i, h) {
            return this.setDimensions({
                height: i
            }, h)
        },
        setDimensions: function(j, i) {
            var h;
            i = i || {};
            for (var k in j) {
                h = j[k];
                if (!i.cssOnly) {
                    this._setBackstoreDimension(k, j[k]);
                    h += "px"
                }
                if (!i.backstoreOnly) {
                    this._setCssDimension(k, h)
                }
            }
            this._initRetinaScaling();
            this._setImageSmoothing();
            this.calcOffset();
            if (!i.cssOnly) {
                this.renderAll()
            }
            return this
        },
        _setBackstoreDimension: function(i, h) {
            this.lowerCanvasEl[i] = h;
            if (this.upperCanvasEl) {
                this.upperCanvasEl[i] = h
            }
            if (this.cacheCanvasEl) {
                this.cacheCanvasEl[i] = h
            }
            this[i] = h;
            return this
        },
        _setCssDimension: function(i, h) {
            this.lowerCanvasEl.style[i] = h;
            if (this.upperCanvasEl) {
                this.upperCanvasEl.style[i] = h
            }
            if (this.wrapperEl) {
                this.wrapperEl.style[i] = h
            }
            return this
        },
        getZoom: function() {
            return this.viewportTransform[0]
        },
        setViewportTransform: function(o) {
            var n = this._activeGroup,
                k, j = false,
                m = true;
            this.viewportTransform = o;
            for (var l = 0, h = this._objects.length; l < h; l++) {
                k = this._objects[l];
                k.group || k.setCoords(j, m)
            }
            if (n) {
                n.setCoords(j, m)
            }
            this.calcViewportBoundaries();
            this.renderAll();
            return this
        },
        zoomToPoint: function(h, j) {
            var i = h,
                l = this.viewportTransform.slice(0);
            h = e(h, b(this.viewportTransform));
            l[0] = j;
            l[3] = j;
            var k = e(h, l);
            l[4] += i.x - k.x;
            l[5] += i.y - k.y;
            return this.setViewportTransform(l)
        },
        setZoom: function(h) {
            this.zoomToPoint(new fabric.Point(0, 0), h);
            return this
        },
        absolutePan: function(h) {
            var i = this.viewportTransform.slice(0);
            i[4] = -h.x;
            i[5] = -h.y;
            return this.setViewportTransform(i)
        },
        relativePan: function(h) {
            return this.absolutePan(new fabric.Point(-h.x - this.viewportTransform[4], -h.y - this.viewportTransform[5]))
        },
        getElement: function() {
            return this.lowerCanvasEl
        },
        _onObjectAdded: function(h) {
            this.stateful && h.setupState();
            h._set("canvas", this);
            h.setCoords();
            this.fire("object:added", {
                target: h
            });
            h.fire("added")
        },
        _onObjectRemoved: function(h) {
            this.fire("object:removed", {
                target: h
            });
            h.fire("removed");
            delete h.canvas
        },
        clearContext: function(h) {
            h.clearRect(0, 0, this.width, this.height);
            return this
        },
        getContext: function() {
            return this.contextContainer
        },
        clear: function() {
            this._objects.length = 0;
            this.backgroundImage = null;
            this.overlayImage = null;
            this.backgroundColor = "";
            this.overlayColor = "";
            if (this._hasITextHandlers) {
                this.off("mouse:up", this._mouseUpITextHandler);
                this._iTextInstances = null;
                this._hasITextHandlers = false
            }
            this.clearContext(this.contextContainer);
            this.fire("canvas:cleared");
            this.renderAll();
            return this
        },
        renderAll: function() {
            var h = this.contextContainer;
            this.renderCanvas(h, this._objects);
            return this
        },
        calcViewportBoundaries: function() {
            var j = {},
                i = this.getWidth(),
                h = this.getHeight(),
                k = b(this.viewportTransform);
            j.tl = e({
                x: 0,
                y: 0
            }, k);
            j.br = e({
                x: i,
                y: h
            }, k);
            j.tr = new fabric.Point(j.br.x, j.tl.y);
            j.bl = new fabric.Point(j.tl.x, j.br.y);
            this.vptCoords = j;
            return j
        },
        renderCustomBackground: null,
        renderCustomBaseLayer: null,
        renderCustomOverlay: null,
        renderCanvas: function(h, i) {
            this.calcViewportBoundaries();
            this.clearContext(h);
            this.fire("before:render");
            this._renderBackground(h);
            if (this.renderCustomBackground) {
                this.renderCustomBackground(h)
            }
            if (this.clipTo) {
                fabric.util.clipContext(this, h)
            }
            if (this.renderCustomBaseLayer) {
                this.renderCustomBaseLayer(h)
            }
            h.save();
            h.transform.apply(h, this.viewportTransform);
            this._renderObjects(h, i);
            h.restore();
            if (!this.controlsAboveOverlay && this.interactive) {
                this.drawControls(h)
            }
            if (this.clipTo) {
                h.restore()
            }
            this._renderOverlay(h);
            if (this.renderCustomOverlay) {
                this.renderCustomOverlay(h)
            }
            if (this.controlsAboveOverlay && this.interactive) {
                this.drawControls(h)
            }
            this.fire("after:render")
        },
        _renderObjects: function(h, l) {
            for (var j = 0, k = l.length; j < k; ++j) {
                l[j] && l[j].render(h)
            }
        },
        _renderBackgroundOrOverlay: function(h, j) {
            var i = this[j + "Color"];
            if (i) {
                h.fillStyle = i.toLive ? i.toLive(h, this) : i;
                h.fillRect(i.offsetX || 0, i.offsetY || 0, this.width, this.height)
            }
            i = this[j + "Image"];
            if (i) {
                if (this[j + "Vpt"]) {
                    h.save();
                    h.transform.apply(h, this.viewportTransform)
                }
                i.render(h);
                this[j + "Vpt"] && h.restore()
            }
        },
        _renderBackground: function(h) {
            this._renderBackgroundOrOverlay(h, "background")
        },
        _renderOverlay: function(h) {
            this._renderBackgroundOrOverlay(h, "overlay")
        },
        getCenter: function() {
            return {
                top: this.getHeight() / 2,
                left: this.getWidth() / 2
            }
        },
        centerObjectH: function(h) {
            return this._centerObject(h, new fabric.Point(this.getCenter().left, h.getCenterPoint().y))
        },
        centerObjectV: function(h) {
            return this._centerObject(h, new fabric.Point(h.getCenterPoint().x, this.getCenter().top))
        },
        centerObject: function(i) {
            var h = this.getCenter();
            return this._centerObject(i, new fabric.Point(h.left, h.top))
        },
        viewportCenterObject: function(h) {
            var i = this.getVpCenter();
            return this._centerObject(h, i)
        },
        viewportCenterObjectH: function(h) {
            var i = this.getVpCenter();
            this._centerObject(h, new fabric.Point(i.x, h.getCenterPoint().y));
            return this
        },
        viewportCenterObjectV: function(h) {
            var i = this.getVpCenter();
            return this._centerObject(h, new fabric.Point(h.getCenterPoint().x, i.y))
        },
        getVpCenter: function() {
            var h = this.getCenter(),
                i = b(this.viewportTransform);
            return e({
                x: h.left,
                y: h.top
            }, i)
        },
        _centerObject: function(i, h) {
            i.setPositionByOrigin(h, "center", "center");
            this.renderAll();
            return this
        },
        toDatalessJSON: function(h) {
            return this.toDatalessObject(h)
        },
        toObject: function(h) {
            return this._toObjectMethod("toObject", h)
        },
        toDatalessObject: function(h) {
            return this._toObjectMethod("toDatalessObject", h)
        },
        _toObjectMethod: function(h, j) {
            var i = {
                objects: this._toObjects(h, j)
            };
            g(i, this.__serializeBgOverlay(h, j));
            fabric.util.populateWithProperties(this, i, j);
            return i
        },
        _toObjects: function(h, i) {
            return this.getObjects().filter(function(j) {
                return !j.excludeFromExport
            }).map(function(j) {
                return this._toObject(j, h, i)
            }, this)
        },
        _toObject: function(h, j, l) {
            var i;
            if (!this.includeDefaultValues) {
                i = h.includeDefaultValues;
                h.includeDefaultValues = false
            }
            var k = h[j](l);
            if (!this.includeDefaultValues) {
                h.includeDefaultValues = i
            }
            return k
        },
        __serializeBgOverlay: function(h, j) {
            var i = {};
            if (this.backgroundColor) {
                i.background = this.backgroundColor.toObject ? this.backgroundColor.toObject(j) : this.backgroundColor
            }
            if (this.overlayColor) {
                i.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(j) : this.overlayColor
            }
            if (this.backgroundImage) {
                i.backgroundImage = this._toObject(this.backgroundImage, h, j)
            }
            if (this.overlayImage) {
                i.overlayImage = this._toObject(this.overlayImage, h, j)
            }
            return i
        },
        svgViewportTransformation: true,
        writeCanvasClipPathToSVG: null,
        getCanvasClipPathSVGId: null,
        writeObjectClipPathsToSVG: null,
        getObjectClipPathSVGId: null,
        toSVG: function(j, h) {
            j || (j = {});
            var i = [];
            this._setSVGPreamble(i, j);
            this._setSVGHeader(i, j);
            this._setSVGBgOverlayColor(i, "backgroundColor");
            this._setSVGBgOverlayImage(i, "backgroundImage", h);
            this._setSVGObjects(i, h);
            this._setSVGBgOverlayColor(i, "overlayColor");
            this._setSVGBgOverlayImage(i, "overlayImage", h);
            i.push("</svg>");
            return i.join("")
        },
        _setSVGPreamble: function(h, i) {
            if (i.suppressPreamble) {
                return
            }
            h.push('<?xml version="1.0" encoding="', (i.encoding || "UTF-8"), '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
        },
        _setSVGHeader: function(i, j) {
            var l = j.width || this.width,
                h = j.height || this.height,
                n, m = 'viewBox="0 0 ' + this.width + " " + this.height + '" ',
                k = fabric.Object.NUM_FRACTION_DIGITS;
            if (j.viewBox) {
                m = 'viewBox="' + j.viewBox.x + " " + j.viewBox.y + " " + j.viewBox.width + " " + j.viewBox.height + '" '
            } else {
                if (this.svgViewportTransformation) {
                    n = this.viewportTransform;
                    m = 'viewBox="' + a(-n[4] / n[0], k) + " " + a(-n[5] / n[3], k) + " " + a(this.width / n[0], k) + " " + a(this.height / n[3], k) + '" '
                }
            }
            i.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', l, '" ', 'height="', h, '" ', m, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>\n", this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), this.createSVGClipPathMarkup(), this.createSVGColorProfilesMarkup(), "</defs>\n")
        },
        createSVGFontFacesMarkup: function() {
            var v = "",
                q = {},
                o, r, k, w, s, t, h, l = fabric.fontPaths,
                u = this.getObjects();
            for (var n = 0, p = u.length; n < p; n++) {
                o = u[n];
                r = o.fontFamily;
                if (o.type.indexOf("text") === -1 || q[r] || !l[r]) {
                    continue
                }
                q[r] = true;
                if (!o.styles) {
                    continue
                }
                k = o.styles;
                for (s in k) {
                    w = k[s];
                    for (h in w) {
                        t = w[h];
                        r = t.fontFamily;
                        if (!q[r] && l[r]) {
                            q[r] = true
                        }
                    }
                }
            }
            for (var m in q) {
                v += ["\t\t@font-face {\n", "\t\t\tfont-family: '", m, "';\n", "\t\t\tsrc: url('", l[m], "');\n", "\t\t}\n"].join("")
            }
            if (v) {
                v = ['\t<style type="text/css">', "<![CDATA[\n", v, "]]>", "</style>\n"].join("")
            }
            return v
        },
        createSVGRefElementsMarkup: function() {
            var i = this,
                h = ["backgroundColor", "overlayColor"].map(function(k) {
                    var j = i[k];
                    if (j && j.toLive) {
                        return j.toSVG(i, false)
                    }
                });
            return h.join("")
        },
        createSVGClipPathMarkup: function() {
            var h = [];
            if (this.clipTo && this.writeCanvasClipPathToSVG) {
                h.push(this.writeCanvasClipPathToSVG())
            }
            if (this.writeObjectClipPathsToSVG) {
                h.push(this.writeObjectClipPathsToSVG())
            }
            return h.join("")
        },
        createSVGColorProfilesMarkup: function() {
            if (this.writeColorProfilesToSVG) {
                return this.writeColorProfilesToSVG()
            }
            return ""
        },
        _setSVGObjects: function(l, k) {
            var j;
            var o = this.getObjects();
            var m, h;
            var n;
            if (this.clipTo && this.getCanvasClipPathSVGId && o.length > 0) {
                n = this.getCanvasClipPathSVGId();
                for (m = 0, h = n.length; m < h; m++) {
                    l.push('<g clip-path="url(#' + n[m] + ')">')
                }
            }
            for (m = 0, h = o.length; m < h; m++) {
                j = o[m];
                if (j.excludeFromExport) {
                    continue
                }
                this._setSVGObject(l, j, k)
            }
            if (n) {
                for (m = 0, h = n.length; m < h; m++) {
                    l.push("</g>")
                }
            }
        },
        _setSVGObject: function(j, i, h) {
            var k = false;
            if (i.clipTo && this.getObjectClipPathSVGId) {
                j.push('<g clip-path="url(#' + this.getObjectClipPathSVGId(i) + ')">');
                k = true
            }
            j.push(i.toSVG(h));
            if (k) {
                j.push("</g>")
            }
        },
        _setSVGBgOverlayImage: function(i, j, h) {
            if (this[j] && this[j].toSVG) {
                i.push(this[j].toSVG(h))
            }
        },
        _setSVGBgOverlayColor: function(h, k) {
            var i = this[k];
            if (!i) {
                return
            }
            if (i.toLive) {
                var j = i.repeat;
                h.push('<rect transform="translate(', this.width / 2, ",", this.height / 2, ')"', ' x="', i.offsetX - this.width / 2, '" y="', i.offsetY - this.height / 2, '" ', 'width="', (j === "repeat-y" || j === "no-repeat" ? i.source.width : this.width), '" height="', (j === "repeat-x" || j === "no-repeat" ? i.source.height : this.height), '" fill="url(#SVGID_' + i.id + ')"', "></rect>\n")
            } else {
                h.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[k], '"', "></rect>\n")
            }
        },
        lowestFgObjectIndex: 0,
        getLowestObjectIndex: null,
        getHighestObjectIndex: null,
        sendToBack: function(j) {
            if (!j) {
                return this
            }
            var l = this._activeGroup,
                k, m, n, h;
            if (j === l) {
                n = l._objects;
                for (k = n.length; k--;) {
                    m = n[k];
                    f(this._objects, m);
                    h = this.lowestFgObjectIndex;
                    if (this.getLowestObjectIndex !== null) {
                        h = this.getLowestObjectIndex(m)
                    }
                    this._objects.splice(h, 0, m)
                }
            } else {
                f(this._objects, j);
                h = this.lowestFgObjectIndex;
                if (this.getLowestObjectIndex !== null) {
                    h = this.getLowestObjectIndex(j)
                }
                this._objects.splice(h, 0, j)
            }
            return this.renderAll && this.renderAll()
        },
        bringToFront: function(h) {
            if (!h) {
                return this
            }
            var l = this._activeGroup,
                j, m, n, k;
            if (h === l) {
                n = l._objects;
                for (j = 0; j < n.length; j++) {
                    m = n[j];
                    f(this._objects, m);
                    k = this._objects.length;
                    if (this.getHighestObjectIndex !== null) {
                        k = this.getHighestObjectIndex(m)
                    }
                    this._objects.splice(k, 0, m)
                }
            } else {
                f(this._objects, h);
                k = this._objects.length;
                if (this.getHighestObjectIndex !== null) {
                    k = this.getHighestObjectIndex(h)
                }
                this._objects.splice(k, 0, h)
            }
            return this.renderAll && this.renderAll()
        },
        sendBackwards: function(k) {
            if (!k) {
                return this
            }
            var n = this._activeGroup,
                l, o, h, m, p, j;
            if (k === n) {
                p = n._objects;
                j = this.lowestFgObjectIndex;
                if (this.getLowestObjectIndex !== null) {
                    j = this.getLowestObjectIndex(p[0])
                }
                for (l = 0; l < p.length; l++) {
                    o = p[l];
                    h = this._objects.indexOf(o);
                    m = h;
                    if (h !== j) {
                        m = h - 1;
                        f(this._objects, o);
                        this._objects.splice(m, 0, o)
                    }
                    j = m + 1
                }
            } else {
                h = this._objects.indexOf(k);
                j = this.lowestFgObjectIndex;
                if (this.getLowestObjectIndex !== null) {
                    j = this.getLowestObjectIndex(k)
                }
                if (h !== j) {
                    m = h - 1;
                    f(this._objects, k);
                    this._objects.splice(m, 0, k)
                }
            }
            this.renderAll && this.renderAll();
            return this
        },
        bringForward: function(j) {
            if (!j) {
                return this
            }
            var n = this._activeGroup,
                k, o, h, m, p;
            var l = this._objects.length - 1;
            if (j === n) {
                p = n._objects;
                l = this._objects.length - 1;
                if (this.getHighestObjectIndex !== null) {
                    l = this.getHighestObjectIndex(p[p.length - 1]) - 1
                }
                for (k = p.length; k--;) {
                    o = p[k];
                    h = this._objects.indexOf(o);
                    m = h;
                    if (h !== l) {
                        m = h + 1;
                        f(this._objects, o);
                        this._objects.splice(m, 0, o)
                    }
                    l = m - 1
                }
            } else {
                h = this._objects.indexOf(j);
                l = this._objects.length - 1;
                if (this.getHighestObjectIndex !== null) {
                    l = this.getHighestObjectIndex(j) - 1
                }
                if (h !== l) {
                    m = h + 1;
                    f(this._objects, j);
                    this._objects.splice(m, 0, j)
                }
            }
            this.renderAll && this.renderAll();
            return this
        },
        moveTo: function(i, h) {
            f(this._objects, i);
            this._objects.splice(h, 0, i);
            return this.renderAll && this.renderAll()
        },
        dispose: function() {
            this.clear();
            return this
        },
        toString: function() {
            return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this.getObjects().length + " }>"
        }
    });
    g(fabric.StaticCanvas.prototype, fabric.Observable);
    g(fabric.StaticCanvas.prototype, fabric.Collection);
    g(fabric.StaticCanvas.prototype, fabric.DataURLExporter);
    g(fabric.StaticCanvas, {
        EMPTY_JSON: '{"objects": [], "background": "white"}',
        supports: function(i) {
            var j = fabric.util.createCanvasElement();
            if (!j || !j.getContext) {
                return null
            }
            var h = j.getContext("2d");
            if (!h) {
                return null
            }
            switch (i) {
                case "getImageData":
                    return typeof h.getImageData !== "undefined";
                case "setLineDash":
                    return typeof h.setLineDash !== "undefined";
                case "toDataURL":
                    return typeof j.toDataURL !== "undefined";
                case "toDataURLWithQuality":
                    try {
                        j.toDataURL("image/jpeg", 0);
                        return true
                    } catch (k) {}
                    return false;
                default:
                    return null
            }
        }
    });
    fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject
})();
fabric.BaseBrush = fabric.util.createClass({
    color: "rgb(0, 0, 0)",
    width: 1,
    shadow: null,
    strokeLineCap: "round",
    strokeLineJoin: "round",
    strokeDashArray: null,
    setShadow: function(a) {
        this.shadow = new fabric.Shadow(a);
        return this
    },
    _setBrushStyles: function() {
        var a = this.canvas.contextTop;
        a.strokeStyle = this.color;
        a.lineWidth = this.width;
        a.lineCap = this.strokeLineCap;
        a.lineJoin = this.strokeLineJoin;
        if (this.strokeDashArray && fabric.StaticCanvas.supports("setLineDash")) {
            a.setLineDash(this.strokeDashArray)
        }
    },
    _setShadow: function() {
        if (!this.shadow) {
            return
        }
        var a = this.canvas.contextTop,
            b = this.canvas.getZoom();
        a.shadowColor = this.shadow.color;
        a.shadowBlur = this.shadow.blur * b;
        a.shadowOffsetX = this.shadow.offsetX * b;
        a.shadowOffsetY = this.shadow.offsetY * b
    },
    _resetShadow: function() {
        var a = this.canvas.contextTop;
        a.shadowColor = "";
        a.shadowBlur = a.shadowOffsetX = a.shadowOffsetY = 0
    }
});
(function() {
    fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
        initialize: function(a) {
            this.canvas = a;
            this._points = []
        },
        onMouseDown: function(a) {
            this._prepareForDrawing(a);
            this._captureDrawingPath(a);
            this._render()
        },
        onMouseMove: function(a) {
            this._captureDrawingPath(a);
            this.canvas.clearContext(this.canvas.contextTop);
            this._render()
        },
        onMouseUp: function() {
            this._finalizeAndAddPath()
        },
        _prepareForDrawing: function(b) {
            var a = new fabric.Point(b.x, b.y);
            this._reset();
            this._addPoint(a);
            this.canvas.contextTop.moveTo(a.x, a.y)
        },
        _addPoint: function(a) {
            this._points.push(a)
        },
        _reset: function() {
            this._points.length = 0;
            this._setBrushStyles();
            this._setShadow()
        },
        _captureDrawingPath: function(a) {
            var b = new fabric.Point(a.x, a.y);
            this._addPoint(b)
        },
        _render: function() {
            var b = this.canvas.contextTop,
                c = this.canvas.viewportTransform,
                f = this._points[0],
                e = this._points[1];
            b.save();
            b.transform(c[0], c[1], c[2], c[3], c[4], c[5]);
            b.beginPath();
            if (this._points.length === 2 && f.x === e.x && f.y === e.y) {
                f.x -= 0.5;
                e.x += 0.5
            }
            b.moveTo(f.x, f.y);
            for (var d = 1, a = this._points.length; d < a; d++) {
                var g = f.midPointFrom(e);
                b.quadraticCurveTo(f.x, f.y, g.x, g.y);
                f = this._points[d];
                e = this._points[d + 1]
            }
            b.lineTo(f.x, f.y);
            b.stroke();
            b.restore()
        },
        convertPointsToSVGPath: function(c) {
            var e = [],
                f = new fabric.Point(c[0].x, c[0].y),
                d = new fabric.Point(c[1].x, c[1].y);
            e.push("M ", c[0].x, " ", c[0].y, " ");
            for (var b = 1, a = c.length; b < a; b++) {
                var g = f.midPointFrom(d);
                e.push("Q ", f.x, " ", f.y, " ", g.x, " ", g.y, " ");
                f = new fabric.Point(c[b].x, c[b].y);
                if ((b + 1) < c.length) {
                    d = new fabric.Point(c[b + 1].x, c[b + 1].y)
                }
            }
            e.push("L ", f.x, " ", f.y, " ");
            return e
        },
        createPath: function(b) {
            var a = new fabric.Path(b, {
                fill: null,
                stroke: this.color,
                strokeWidth: this.width,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeDashArray: this.strokeDashArray,
                originX: "center",
                originY: "center"
            });
            if (this.shadow) {
                this.shadow.affectStroke = true;
                a.setShadow(this.shadow)
            }
            return a
        },
        _finalizeAndAddPath: function() {
            var a = this.canvas.contextTop;
            a.closePath();
            var c = this.convertPointsToSVGPath(this._points).join("");
            if (c === "M 0 0 Q 0 0 0 0 L 0 0") {
                this.canvas.renderAll();
                return
            }
            var b = this.createPath(c);
            this.canvas.add(b);
            b.setCoords();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderAll();
            this.canvas.fire("path:created", {
                path: b
            })
        }
    })
})();
fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    initialize: function(a) {
        this.canvas = a;
        this.points = []
    },
    drawDot: function(d) {
        var a = this.addPoint(d),
            b = this.canvas.contextTop,
            c = this.canvas.viewportTransform;
        b.save();
        b.transform(c[0], c[1], c[2], c[3], c[4], c[5]);
        b.fillStyle = a.fill;
        b.beginPath();
        b.arc(a.x, a.y, a.radius, 0, Math.PI * 2, false);
        b.closePath();
        b.fill();
        b.restore()
    },
    onMouseDown: function(a) {
        this.points.length = 0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.drawDot(a)
    },
    onMouseMove: function(a) {
        this.drawDot(a)
    },
    onMouseUp: function() {
        var g = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        var f = [];
        for (var c = 0, b = this.points.length; c < b; c++) {
            var a = this.points[c],
                e = new fabric.Circle({
                    radius: a.radius,
                    left: a.x,
                    top: a.y,
                    originX: "center",
                    originY: "center",
                    fill: a.fill
                });
            this.shadow && e.setShadow(this.shadow);
            f.push(e)
        }
        var d = new fabric.Group(f, {
            originX: "center",
            originY: "center"
        });
        d.canvas = this.canvas;
        this.canvas.add(d);
        this.canvas.fire("path:created", {
            path: d
        });
        this.canvas.clearContext(this.canvas.contextTop);
        this._resetShadow();
        this.canvas.renderOnAddRemove = g;
        this.canvas.renderAll()
    },
    addPoint: function(c) {
        var d = new fabric.Point(c.x, c.y),
            a = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
            b = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
        d.radius = a;
        d.fill = b;
        this.points.push(d);
        return d
    }
});
fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    density: 20,
    dotWidth: 1,
    dotWidthVariance: 1,
    randomOpacity: false,
    optimizeOverlapping: true,
    initialize: function(a) {
        this.canvas = a;
        this.sprayChunks = []
    },
    onMouseDown: function(a) {
        this.sprayChunks.length = 0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.addSprayChunk(a);
        this.render()
    },
    onMouseMove: function(a) {
        this.addSprayChunk(a);
        this.render()
    },
    onMouseUp: function() {
        var e = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        var h = [];
        for (var c = 0, a = this.sprayChunks.length; c < a; c++) {
            var d = this.sprayChunks[c];
            for (var b = 0, k = d.length; b < k; b++) {
                var f = new fabric.Rect({
                    width: d[b].width,
                    height: d[b].width,
                    left: d[b].x + 1,
                    top: d[b].y + 1,
                    originX: "center",
                    originY: "center",
                    fill: this.color
                });
                this.shadow && f.setShadow(this.shadow);
                h.push(f)
            }
        }
        if (this.optimizeOverlapping) {
            h = this._getOptimizedRects(h)
        }
        var g = new fabric.Group(h, {
            originX: "center",
            originY: "center"
        });
        g.canvas = this.canvas;
        this.canvas.add(g);
        this.canvas.fire("path:created", {
            path: g
        });
        this.canvas.clearContext(this.canvas.contextTop);
        this._resetShadow();
        this.canvas.renderOnAddRemove = e;
        this.canvas.renderAll()
    },
    _getOptimizedRects: function(c) {
        var b = {},
            e;
        for (var d = 0, a = c.length; d < a; d++) {
            e = c[d].left + "" + c[d].top;
            if (!b[e]) {
                b[e] = c[d]
            }
        }
        var f = [];
        for (e in b) {
            f.push(b[e])
        }
        return f
    },
    render: function() {
        var c = this.canvas.contextTop;
        c.fillStyle = this.color;
        var d = this.canvas.viewportTransform;
        c.save();
        c.transform(d[0], d[1], d[2], d[3], d[4], d[5]);
        for (var e = 0, b = this.sprayChunkPoints.length; e < b; e++) {
            var a = this.sprayChunkPoints[e];
            if (typeof a.opacity !== "undefined") {
                c.globalAlpha = a.opacity
            }
            c.fillRect(a.x, a.y, a.width, a.width)
        }
        c.restore()
    },
    addSprayChunk: function(f) {
        this.sprayChunkPoints = [];
        var c, g, e, b = this.width / 2;
        for (var d = 0; d < this.density; d++) {
            c = fabric.util.getRandomInt(f.x - b, f.x + b);
            g = fabric.util.getRandomInt(f.y - b, f.y + b);
            if (this.dotWidthVariance) {
                e = fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance)
            } else {
                e = this.dotWidth
            }
            var a = new fabric.Point(c, g);
            a.width = e;
            if (this.randomOpacity) {
                a.opacity = fabric.util.getRandomInt(0, 100) / 100
            }
            this.sprayChunkPoints.push(a)
        }
        this.sprayChunks.push(this.sprayChunkPoints)
    }
});
fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    getPatternSrc: function() {
        var d = 20,
            b = 5,
            c = fabric.document.createElement("canvas"),
            a = c.getContext("2d");
        c.width = c.height = d + b;
        a.fillStyle = this.color;
        a.beginPath();
        a.arc(d / 2, d / 2, d / 2, 0, Math.PI * 2, false);
        a.closePath();
        a.fill();
        return c
    },
    getPatternSrcFunction: function() {
        return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
    },
    getPattern: function() {
        return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
    },
    _setBrushStyles: function() {
        this.callSuper("_setBrushStyles");
        this.canvas.contextTop.strokeStyle = this.getPattern()
    },
    createPath: function(c) {
        var b = this.callSuper("createPath", c),
            a = b._getLeftTopCoords().scalarAdd(b.strokeWidth / 2);
        b.stroke = new fabric.Pattern({
            source: this.source || this.getPatternSrcFunction(),
            offsetX: -a.x,
            offsetY: -a.y
        });
        return b
    }
});
(function() {
    var c = fabric.util.getPointer,
        d = fabric.util.degreesToRadians,
        f = fabric.util.radiansToDegrees,
        e = Math.atan2,
        b = Math.abs,
        h = fabric.StaticCanvas.supports("setLineDash"),
        a = 0.5;
    fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
        initialize: function(j, i) {
            i || (i = {});
            this._initStatic(j, i);
            this._initInteractive();
            this._createCacheCanvas()
        },
        uniScaleTransform: false,
        uniScaleKey: "shiftKey",
        centeredScaling: false,
        centeredRotation: false,
        centeredKey: "altKey",
        altActionKey: "shiftKey",
        interactive: true,
        selection: true,
        selectionKey: "shiftKey",
        altSelectionKey: null,
        selectionColor: "rgba(100, 100, 255, 0.3)",
        selectionDashArray: [],
        selectionBorderColor: "rgba(255, 255, 255, 0.3)",
        selectionLineWidth: 1,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        freeDrawingCursor: "crosshair",
        rotationCursor: "crosshair",
        containerClass: "canvas-container",
        perPixelTargetFind: false,
        targetFindTolerance: 0,
        skipTargetFind: false,
        isDrawingMode: false,
        preserveObjectStacking: false,
        snapAngle: 0,
        snapThreshold: null,
        stopContextMenu: false,
        fireRightClick: false,
        allowObjectMove: null,
        _initInteractive: function() {
            this._currentTransform = null;
            this._groupSelector = null;
            this._initWrapperElement();
            this._createUpperCanvas();
            this._initEventListeners();
            this._initRetinaScaling();
            this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this);
            this.calcOffset()
        },
        _chooseObjectsToRender: function() {
            var n = this.getActiveGroup(),
                m = this.getActiveObject(),
                k, p = [],
                j = [];
            if ((n || m) && !this.preserveObjectStacking) {
                for (var l = 0, o = this._objects.length; l < o; l++) {
                    k = this._objects[l];
                    if ((!n || !n.contains(k)) && k !== m) {
                        p.push(k)
                    } else {
                        j.push(k)
                    }
                }
                if (n) {
                    n._set("_objects", j);
                    p.push(n)
                }
                m && p.push(m)
            } else {
                p = this._objects
            }
            return p
        },
        renderAll: function() {
            if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
                this.clearContext(this.contextTop);
                this.contextTopDirty = false
            }
            var i = this.contextContainer;
            this.renderCanvas(i, this._chooseObjectsToRender());
            return this
        },
        renderTop: function() {
            var i = this.contextTop;
            this.clearContext(i);
            if (this.selection && this._groupSelector) {
                this._drawSelection(i)
            }
            this.fire("after:render");
            this.contextTopDirty = true;
            return this
        },
        _resetCurrentTransform: function() {
            var i = this._currentTransform;
            i.target.set({
                scaleX: i.original.scaleX,
                scaleY: i.original.scaleY,
                skewX: i.original.skewX,
                skewY: i.original.skewY,
                left: i.original.left,
                top: i.original.top
            });
            if (this._shouldCenterTransform(i.target)) {
                if (i.action === "rotate") {
                    this._setOriginToCenter(i.target)
                } else {
                    if (i.originX !== "center") {
                        if (i.originX === "right") {
                            i.mouseXSign = -1
                        } else {
                            i.mouseXSign = 1
                        }
                    }
                    if (i.originY !== "center") {
                        if (i.originY === "bottom") {
                            i.mouseYSign = -1
                        } else {
                            i.mouseYSign = 1
                        }
                    }
                    i.originX = "center";
                    i.originY = "center"
                }
            } else {
                i.originX = i.original.originX;
                i.originY = i.original.originY
            }
        },
        containsPoint: function(m, l, i) {
            var j = true,
                n = i || this.getPointer(m, j),
                k;
            if (l.group && l.group === this.getActiveGroup()) {
                k = this._normalizePointer(l.group, n)
            } else {
                k = {
                    x: n.x,
                    y: n.y
                }
            }
            return (l.containsPoint(k) || l._findTargetCorner(n))
        },
        _normalizePointer: function(k, n) {
            var j = k.calcTransformMatrix(),
                i = fabric.util.invertTransform(j),
                l = this.restorePointerVpt(n);
            return fabric.util.transformPoint(l, i)
        },
        isTargetTransparent: function(o, i, p) {
            var k = o.hasBorders,
                l = o.transparentCorners,
                j = this.contextCache,
                n = o.selectionBackgroundColor;
            o.hasBorders = o.transparentCorners = false;
            o.selectionBackgroundColor = "";
            j.save();
            this.targetFind = true;
            j.transform.apply(j, this.viewportTransform);
            o.render(j);
            this.targetFind = false;
            j.restore();
            o.active && o._renderControls(j);
            o.hasBorders = k;
            o.transparentCorners = l;
            o.selectionBackgroundColor = n;
            var m = fabric.util.isTransparent(j, i, p, o.targetFindTolerance);
            this.clearContext(j);
            return m
        },
        _shouldClearSelection: function(l, k) {
            var j = this.getActiveGroup(),
                i = this.getActiveObject();
            return (!k || (k && j && !j.contains(k) && j !== k && !l[this.selectionKey]) || (k && !k.evented) || (k && !k.selectable && i && i !== k))
        },
        _shouldCenterTransform: function(k) {
            if (!k) {
                return
            }
            var j = this._currentTransform,
                i;
            if (j.action === "scale" || j.action === "scaleX" || j.action === "scaleY") {
                i = this.centeredScaling || k.centeredScaling
            } else {
                if (j.action === "rotate") {
                    i = this.centeredRotation || k.centeredRotation
                }
            }
            return i ? !j.altKey : j.altKey
        },
        _getOriginFromCorner: function(k, j) {
            var i = {
                x: k.originX,
                y: k.originY
            };
            if (j === "ml" || j === "tl" || j === "bl") {
                i.x = "right"
            } else {
                if (j === "mr" || j === "tr" || j === "br") {
                    i.x = "left"
                }
            }
            if (j === "tl" || j === "mt" || j === "tr") {
                i.y = "bottom"
            } else {
                if (j === "bl" || j === "mb" || j === "br") {
                    i.y = "top"
                }
            }
            return i
        },
        _getActionFromCorner: function(k, i, j) {
            if (!i) {
                return "drag"
            }
            switch (i) {
                case "mtr":
                    return "rotate";
                case "ml":
                case "mr":
                    return j[this.altActionKey] ? "skewY" : "scaleX";
                case "mt":
                case "mb":
                    return j[this.altActionKey] ? "skewX" : "scaleY";
                default:
                    return "scale"
            }
        },
        _setupCurrentTransform: function(m, l) {
            if (!l) {
                return
            }
            var n = this.getPointer(m),
                j = l._findTargetCorner(this.getPointer(m, true)),
                k = this._getActionFromCorner(l, j, m),
                i = this._getOriginFromCorner(l, j);
            this._currentTransform = {
                target: l,
                action: k,
                corner: j,
                scaleX: l.scaleX,
                scaleY: l.scaleY,
                skewX: l.skewX,
                skewY: l.skewY,
                offsetX: n.x - l.left,
                offsetY: n.y - l.top,
                originX: i.x,
                originY: i.y,
                ex: n.x,
                ey: n.y,
                lastX: n.x,
                lastY: n.y,
                left: l.left,
                top: l.top,
                theta: d(l.angle),
                width: l.width * l.scaleX,
                mouseXSign: 1,
                mouseYSign: 1,
                shiftKey: m.shiftKey,
                altKey: m[this.centeredKey]
            };
            this._currentTransform.original = {
                left: l.left,
                top: l.top,
                scaleX: l.scaleX,
                scaleY: l.scaleY,
                skewX: l.skewX,
                skewY: l.skewY,
                originX: i.x,
                originY: i.y
            };
            this._resetCurrentTransform()
        },
        _translateObject: function(i, p) {
            var k = this._currentTransform,
                o = k.target,
                n = i - k.offsetX,
                j = p - k.offsetY,
                m = !o.get("lockMovementX") && o.left !== n,
                l = !o.get("lockMovementY") && o.top !== j;
            if (m || l) {
                if (o.canvas && o.canvas.allowObjectMove && !o.canvas.allowObjectMove(o, n, j)) {
                    return false
                }
            }
            m && o.set("left", n);
            l && o.set("top", j);
            return m || l
        },
        _changeSkewTransformOrigin: function(n, p, j) {
            var m = "originX",
                k = {
                    0: "center"
                },
                r = p.target.skewX,
                q = "left",
                o = "right",
                l = p.corner === "mt" || p.corner === "ml" ? 1 : -1,
                i = 1;
            n = n > 0 ? 1 : -1;
            if (j === "y") {
                r = p.target.skewY;
                q = "top";
                o = "bottom";
                m = "originY"
            }
            k[-1] = q;
            k[1] = o;
            p.target.flipX && (i *= -1);
            p.target.flipY && (i *= -1);
            if (r === 0) {
                p.skewSign = -l * n * i;
                p[m] = k[-n]
            } else {
                r = r > 0 ? 1 : -1;
                p.skewSign = r;
                p[m] = k[r * l * i]
            }
        },
        _skewObject: function(r, q, o) {
            var u = this._currentTransform,
                n = u.target,
                w = false,
                k = n.get("lockSkewingX"),
                j = n.get("lockSkewingY");
            if ((k && o === "x") || (j && o === "y")) {
                return false
            }
            var i = n.getCenterPoint(),
                s = n.toLocalPoint(new fabric.Point(r, q), "center", "center")[o],
                v = n.toLocalPoint(new fabric.Point(u.lastX, u.lastY), "center", "center")[o],
                p, l, m = n._getTransformedDimensions();
            this._changeSkewTransformOrigin(s - v, u, o);
            p = n.toLocalPoint(new fabric.Point(r, q), u.originX, u.originY)[o];
            l = n.translateToOriginPoint(i, u.originX, u.originY);
            w = this._setObjectSkew(p, u, o, m);
            u.lastX = r;
            u.lastY = q;
            n.setPositionByOrigin(l, u.originX, u.originY);
            return w
        },
        _setObjectSkew: function(s, k, p, q) {
            var o = k.target,
                i, x = false,
                n = k.skewSign,
                m, j, w, v, l, r, u, t;
            if (p === "x") {
                w = "y";
                v = "Y";
                l = "X";
                u = 0;
                t = o.skewY
            } else {
                w = "x";
                v = "X";
                l = "Y";
                u = o.skewX;
                t = 0
            }
            j = o._getTransformedDimensions(u, t);
            r = 2 * Math.abs(s) - j[p];
            if (r <= 2) {
                i = 0
            } else {
                i = n * Math.atan((r / o["scale" + l]) / (j[w] / o["scale" + v]));
                i = fabric.util.radiansToDegrees(i)
            }
            x = o["skew" + l] !== i;
            o.set("skew" + l, i);
            if (o["skew" + v] !== 0) {
                m = o._getTransformedDimensions();
                i = (q[w] / m[w]) * o["scale" + v];
                o.set("scale" + v, i)
            }
            return x
        },
        _scaleObject: function(s, r, o) {
            var u = this._currentTransform,
                m = u.target,
                p = m.get("lockScalingX"),
                n = m.get("lockScalingY"),
                i = m.get("lockScalingFlip");
            if (p && n) {
                return false
            }
            var j = m.translateToOriginPoint(m.getCenterPoint(), u.originX, u.originY),
                q = m.toLocalPoint(new fabric.Point(s, r), u.originX, u.originY),
                l = m._getTransformedDimensions(),
                k = false;
            this._setLocalMouse(q, u);
            k = this._setObjectScale(q, u, p, n, o, i, l);
            m.setPositionByOrigin(j, u.originX, u.originY);
            return k
        },
        _setObjectScale: function(s, j, q, o, p, i, r) {
            var n = j.target,
                m = false,
                l = false,
                k = false,
                w, v, u, t;
            u = s.x * n.scaleX / r.x;
            t = s.y * n.scaleY / r.y;
            w = n.scaleX !== u;
            v = n.scaleY !== t;
            if (i && u <= 0 && u < n.scaleX) {
                m = true
            }
            if (i && t <= 0 && t < n.scaleY) {
                l = true
            }
            if (p === "equally" && !q && !o) {
                m || l || (k = this._scaleObjectEqually(s, n, j, r))
            } else {
                if (!p) {
                    m || q || (n.set("scaleX", u) && (k = k || w));
                    l || o || (n.set("scaleY", t) && (k = k || v))
                } else {
                    if (p === "x" && !n.get("lockUniScaling")) {
                        m || q || (n.set("scaleX", u) && (k = k || w))
                    } else {
                        if (p === "y" && !n.get("lockUniScaling")) {
                            l || o || (n.set("scaleY", t) && (k = k || v))
                        }
                    }
                }
            }
            j.newScaleX = u;
            j.newScaleY = t;
            m || l || this._flipObject(j, p);
            return k
        },
        _scaleObjectEqually: function(o, k, j, n) {
            var m = o.y + o.x,
                l = n.y * j.original.scaleY / k.scaleY + n.x * j.original.scaleX / k.scaleX,
                i;
            j.newScaleX = j.original.scaleX * m / l;
            j.newScaleY = j.original.scaleY * m / l;
            i = j.newScaleX !== k.scaleX || j.newScaleY !== k.scaleY;
            k.set("scaleX", j.newScaleX);
            k.set("scaleY", j.newScaleY);
            return i
        },
        _flipObject: function(i, j) {
            if (i.newScaleX < 0 && j !== "y") {
                if (i.originX === "left") {
                    i.originX = "right"
                } else {
                    if (i.originX === "right") {
                        i.originX = "left"
                    }
                }
            }
            if (i.newScaleY < 0 && j !== "x") {
                if (i.originY === "top") {
                    i.originY = "bottom"
                } else {
                    if (i.originY === "bottom") {
                        i.originY = "top"
                    }
                }
            }
        },
        _setLocalMouse: function(m, i) {
            var l = i.target,
                j = this.getZoom(),
                k = l.padding / j;
            if (i.originX === "right") {
                m.x *= -1
            } else {
                if (i.originX === "center") {
                    m.x *= i.mouseXSign * 2;
                    if (m.x < 0) {
                        i.mouseXSign = -i.mouseXSign
                    }
                }
            }
            if (i.originY === "bottom") {
                m.y *= -1
            } else {
                if (i.originY === "center") {
                    m.y *= i.mouseYSign * 2;
                    if (m.y < 0) {
                        i.mouseYSign = -i.mouseYSign
                    }
                }
            }
            if (b(m.x) > k) {
                if (m.x < 0) {
                    m.x += k
                } else {
                    m.x -= k
                }
            } else {
                m.x = 0
            }
            if (b(m.y) > k) {
                if (m.y < 0) {
                    m.y += k
                } else {
                    m.y -= k
                }
            } else {
                m.y = 0
            }
        },
        _rotateObject: function(p, n) {
            var r = this._currentTransform;
            if (r.target.get("lockRotation")) {
                return false
            }
            var k = e(r.ey - r.top, r.ex - r.left),
                q = e(n - r.top, p - r.left),
                l = f(q - k + r.theta),
                o = true;
            if (l < 0) {
                l = 360 + l
            }
            l %= 360;
            if (r.target.snapAngle > 0) {
                var j = r.target.snapAngle,
                    m = r.target.snapThreshold || j,
                    i = Math.ceil(l / j) * j,
                    s = Math.floor(l / j) * j;
                if (Math.abs(l - s) < m) {
                    l = s
                } else {
                    if (Math.abs(l - i) < m) {
                        l = i
                    }
                }
                if (r.target.angle === l) {
                    o = false
                }
            }
            r.target.angle = l;
            return o
        },
        setCursor: function(i) {
            this.upperCanvasEl.style.cursor = i
        },
        _resetObjectTransform: function(i) {
            i.scaleX = 1;
            i.scaleY = 1;
            i.skewX = 0;
            i.skewY = 0;
            i.setAngle(0)
        },
        _drawSelection: function(j) {
            var i = this._groupSelector,
                p = i.left,
                o = i.top,
                n = b(p),
                l = b(o);
            if (this.selectionColor) {
                j.fillStyle = this.selectionColor;
                j.fillRect(i.ex - ((p > 0) ? 0 : -p), i.ey - ((o > 0) ? 0 : -o), n, l)
            }
            if (!this.selectionLineWidth || !this.selectionBorderColor) {
                return
            }
            j.lineWidth = this.selectionLineWidth;
            j.strokeStyle = this.selectionBorderColor;
            if (this.selectionDashArray.length > 1 && !h) {
                var m = i.ex + a - ((p > 0) ? 0 : n),
                    k = i.ey + a - ((o > 0) ? 0 : l);
                j.beginPath();
                fabric.util.drawDashedLine(j, m, k, m + n, k, this.selectionDashArray);
                fabric.util.drawDashedLine(j, m, k + l - 1, m + n, k + l - 1, this.selectionDashArray);
                fabric.util.drawDashedLine(j, m, k, m, k + l, this.selectionDashArray);
                fabric.util.drawDashedLine(j, m + n - 1, k, m + n - 1, k + l, this.selectionDashArray);
                j.closePath();
                j.stroke()
            } else {
                fabric.Object.prototype._setLineDash.call(this, j, this.selectionDashArray);
                j.strokeRect(i.ex + a - ((p > 0) ? 0 : n), i.ey + a - ((o > 0) ? 0 : l), n, l)
            }
        },
        findTarget: function(p, n) {
            if (this.skipTargetFind) {
                return
            }
            var s = true,
                j = this.getPointer(p, s),
                l = this.getActiveGroup(),
                k = this.getActiveObject(),
                m;
            if (l && !n && l === this._searchPossibleTargets([l], j)) {
                this._fireOverOutEvents(l, p);
                return l
            }
            if (k && k._findTargetCorner(j)) {
                this._fireOverOutEvents(k, p);
                return k
            }
            if (k && k === this._searchPossibleTargets([k], j)) {
                if (!this.preserveObjectStacking) {
                    this._fireOverOutEvents(k, p);
                    return k
                } else {
                    m = k
                }
            }
            this.targets = [];
            var q = this._searchPossibleTargets(this._objects, j);
            if (q && q.editAreaId) {
                var r;
                for (var o = 0; o < this._objects.length; o++) {
                    if (this._objects[o].id == q.editAreaId) {
                        r = this._objects[o];
                        break
                    }
                }
                if (r && r === this._searchPossibleTargets([r], j)) {
                    q = r
                }
            }
            if (p[this.altSelectionKey] && q && m && q !== m) {
                q = m
            }
            this._fireOverOutEvents(q, p);
            return q
        },
        _fireOverOutEvents: function(j, i) {
            if (j) {
                if (this._hoveredTarget !== j) {
                    if (this._hoveredTarget) {
                        this.fire("mouse:out", {
                            target: this._hoveredTarget,
                            e: i
                        });
                        this._hoveredTarget.fire("mouseout")
                    }
                    this.fire("mouse:over", {
                        target: j,
                        e: i
                    });
                    j.fire("mouseover");
                    this._hoveredTarget = j
                }
            } else {
                if (this._hoveredTarget) {
                    this.fire("mouse:out", {
                        target: this._hoveredTarget,
                        e: i
                    });
                    this._hoveredTarget.fire("mouseout");
                    this._hoveredTarget = null
                }
            }
        },
        _checkTarget: function(k, j) {
            if (j && j.visible && j.evented && this.containsPoint(null, j, k)) {
                if ((this.perPixelTargetFind || j.perPixelTargetFind) && !j.isEditing) {
                    var i = this.isTargetTransparent(j, k.x, k.y);
                    if (!i) {
                        return true
                    }
                } else {
                    return true
                }
            }
        },
        _searchPossibleTargets: function(m, o) {
            var n, k = m.length,
                j, l;
            while (k--) {
                if (this._checkTarget(o, m[k])) {
                    n = m[k];
                    if (n.type === "group" && n.subTargetCheck) {
                        j = this._normalizePointer(n, o);
                        l = this._searchPossibleTargets(n._objects, j);
                        l && this.targets.push(l)
                    }
                    break
                }
            }
            return n
        },
        restorePointerVpt: function(i) {
            return fabric.util.transformPoint(i, fabric.util.invertTransform(this.viewportTransform))
        },
        getPointer: function(o, m, l) {
            if (!l) {
                l = this.upperCanvasEl
            }
            var p = c(o),
                n = l.getBoundingClientRect(),
                k = n.width || 0,
                i = n.height || 0,
                j;
            if (!k || !i) {
                if ("top" in n && "bottom" in n) {
                    i = Math.abs(n.top - n.bottom)
                }
                if ("right" in n && "left" in n) {
                    k = Math.abs(n.right - n.left)
                }
            }
            this.calcOffset();
            p.x = p.x - this._offset.left;
            p.y = p.y - this._offset.top;
            if (!m) {
                p = this.restorePointerVpt(p)
            }
            if (k === 0 || i === 0) {
                j = {
                    width: 1,
                    height: 1
                }
            } else {
                j = {
                    width: l.width / k,
                    height: l.height / i
                }
            }
            return {
                x: p.x * j.width,
                y: p.y * j.height
            }
        },
        _createUpperCanvas: function() {
            var i = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
            this.upperCanvasEl = this._createCanvasElement();
            fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + i);
            this.wrapperEl.appendChild(this.upperCanvasEl);
            this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl);
            this._applyCanvasStyle(this.upperCanvasEl);
            this.contextTop = this.upperCanvasEl.getContext("2d")
        },
        _createCacheCanvas: function() {
            this.cacheCanvasEl = this._createCanvasElement();
            this.cacheCanvasEl.setAttribute("width", this.width);
            this.cacheCanvasEl.setAttribute("height", this.height);
            this.contextCache = this.cacheCanvasEl.getContext("2d")
        },
        _initWrapperElement: function() {
            this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                "class": this.containerClass
            });
            fabric.util.setStyle(this.wrapperEl, {
                width: this.getWidth() + "px",
                height: this.getHeight() + "px",
                position: "relative"
            });
            fabric.util.makeElementUnselectable(this.wrapperEl)
        },
        _applyCanvasStyle: function(j) {
            var k = this.getWidth() || j.width,
                i = this.getHeight() || j.height;
            fabric.util.setStyle(j, {
                position: "absolute",
                width: k + "px",
                height: i + "px",
                left: 0,
                top: 0,
                "touch-action": "none"
            });
            j.width = k;
            j.height = i;
            fabric.util.makeElementUnselectable(j)
        },
        _copyCanvasStyle: function(j, i) {
            i.style.cssText = j.style.cssText
        },
        getSelectionContext: function() {
            return this.contextTop
        },
        getSelectionElement: function() {
            return this.upperCanvasEl
        },
        _setActiveObject: function(i) {
            var j = this._activeObject;
            if (j) {
                j.set("active", false);
                if (i !== j && j.onDeselect && typeof j.onDeselect === "function") {
                    j.onDeselect()
                }
            }
            this._activeObject = i;
            i.set("active", true)
        },
        setActiveObject: function(i, k) {
            var j = this.getActiveObject();
            if (j && j !== i) {
                j.fire("deselected", {
                    e: k
                })
            }
            this._setActiveObject(i);
            this.renderAll();
            this.fire("object:selected", {
                target: i,
                e: k
            });
            i.fire("selected", {
                e: k
            });
            return this
        },
        getActiveObject: function() {
            return this._activeObject
        },
        _onObjectRemoved: function(i) {
            if (this.getActiveObject() === i) {
                this.fire("before:selection:cleared", {
                    target: i
                });
                this._discardActiveObject();
                this.fire("selection:cleared", {
                    target: i
                });
                i.fire("deselected")
            }
            if (this._hoveredTarget === i) {
                this._hoveredTarget = null
            }
            this.callSuper("_onObjectRemoved", i)
        },
        _discardActiveObject: function() {
            var i = this._activeObject;
            if (i) {
                i.set("active", false);
                if (i.onDeselect && typeof i.onDeselect === "function") {
                    i.onDeselect()
                }
            }
            this._activeObject = null
        },
        discardActiveObject: function(j) {
            var i = this._activeObject;
            if (i) {
                this.fire("before:selection:cleared", {
                    target: i,
                    e: j
                });
                this._discardActiveObject();
                this.fire("selection:cleared", {
                    e: j
                });
                i.fire("deselected", {
                    e: j
                })
            }
            return this
        },
        _setActiveGroup: function(i) {
            this._activeGroup = i;
            if (i) {
                i.set("active", true)
            }
        },
        setActiveGroup: function(j, i) {
            this._setActiveGroup(j);
            if (j) {
                this.fire("object:selected", {
                    target: j,
                    e: i
                });
                j.fire("selected", {
                    e: i
                })
            }
            return this
        },
        getActiveGroup: function() {
            return this._activeGroup
        },
        _discardActiveGroup: function() {
            var i = this.getActiveGroup();
            if (i) {
                i.destroy()
            }
            this.setActiveGroup(null)
        },
        discardActiveGroup: function(j) {
            var i = this.getActiveGroup();
            if (i) {
                this.fire("before:selection:cleared", {
                    e: j,
                    target: i
                });
                this._discardActiveGroup();
                this.fire("selection:cleared", {
                    e: j
                })
            }
            return this
        },
        deactivateAll: function() {
            var k = this.getObjects(),
                l = 0,
                j = k.length,
                m;
            for (; l < j; l++) {
                m = k[l];
                m && m.set("active", false)
            }
            this._discardActiveGroup();
            this._discardActiveObject();
            return this
        },
        deactivateAllWithDispatch: function(i) {
            this.discardActiveGroup(i);
            this.discardActiveObject(i);
            this.deactivateAll();
            return this
        },
        dispose: function() {
            this.callSuper("dispose");
            var i = this.wrapperEl;
            this.removeListeners();
            i.removeChild(this.upperCanvasEl);
            i.removeChild(this.lowerCanvasEl);
            delete this.upperCanvasEl;
            if (i.parentNode) {
                i.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl)
            }
            delete this.wrapperEl;
            return this
        },
        clear: function() {
            this.discardActiveGroup();
            this.discardActiveObject();
            this.clearContext(this.contextTop);
            return this.callSuper("clear")
        },
        drawControls: function(i) {
            var j = this.getActiveGroup();
            if (j) {
                j._renderControls(i)
            } else {
                this._drawObjectsControls(i)
            }
        },
        _drawObjectsControls: function(k) {
            for (var l = 0, j = this._objects.length; l < j; ++l) {
                if (!this._objects[l] || !this._objects[l].active) {
                    continue
                }
                this._objects[l]._renderControls(k)
            }
        },
        _toObject: function(i, j, m) {
            var l = this._realizeGroupTransformOnObject(i),
                k = this.callSuper("_toObject", i, j, m);
            this._unwindGroupTransformOnObject(i, l);
            return k
        },
        _realizeGroupTransformOnObject: function(i) {
            var j = ["angle", "flipX", "flipY", "height", "left", "scaleX", "scaleY", "top", "width"];
            if (i.group && i.group === this.getActiveGroup()) {
                var k = {};
                j.forEach(function(l) {
                    k[l] = i[l]
                });
                this.getActiveGroup().realizeTransform(i);
                return k
            } else {
                return null
            }
        },
        _unwindGroupTransformOnObject: function(i, j) {
            if (j) {
                i.set(j)
            }
        },
        _setSVGObject: function(k, j, i) {
            var l;
            l = this._realizeGroupTransformOnObject(j);
            this.callSuper("_setSVGObject", k, j, i);
            this._unwindGroupTransformOnObject(j, l)
        },
    });
    for (var g in fabric.StaticCanvas) {
        if (g !== "prototype") {
            fabric.Canvas[g] = fabric.StaticCanvas[g]
        }
    }
    if (fabric.isTouchSupported) {
        fabric.Canvas.prototype._setCursorFromEvent = function() {}
    }
    fabric.Element = fabric.Canvas
})();
(function() {
    var a = {
            mt: 0,
            tr: 1,
            mr: 2,
            br: 3,
            mb: 4,
            bl: 5,
            ml: 6,
            tl: 7
        },
        b = fabric.util.addListener,
        c = fabric.util.removeListener;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        cursorMap: ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"],
        _initEventListeners: function() {
            this._bindEvents();
            b(fabric.window, "resize", this._onResize);
            b(this.upperCanvasEl, "mousedown", this._onMouseDown);
            b(this.upperCanvasEl, "mousemove", this._onMouseMove);
            b(this.upperCanvasEl, "mouseout", this._onMouseOut);
            b(this.upperCanvasEl, "mouseenter", this._onMouseEnter);
            b(this.upperCanvasEl, "wheel", this._onMouseWheel);
            b(this.upperCanvasEl, "contextmenu", this._onContextMenu);
            b(this.upperCanvasEl, "touchstart", this._onMouseDown, {
                passive: false
            });
            b(this.upperCanvasEl, "touchmove", this._onMouseMove, {
                passive: false
            });
            if (typeof eventjs !== "undefined" && "add" in eventjs) {
                eventjs.add(this.upperCanvasEl, "gesture", this._onGesture);
                eventjs.add(this.upperCanvasEl, "drag", this._onDrag);
                eventjs.add(this.upperCanvasEl, "orientation", this._onOrientationChange);
                eventjs.add(this.upperCanvasEl, "shake", this._onShake);
                eventjs.add(this.upperCanvasEl, "longpress", this._onLongPress)
            }
        },
        _bindEvents: function() {
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseMove = this._onMouseMove.bind(this);
            this._onMouseUp = this._onMouseUp.bind(this);
            this._onResize = this._onResize.bind(this);
            this._onGesture = this._onGesture.bind(this);
            this._onDrag = this._onDrag.bind(this);
            this._onShake = this._onShake.bind(this);
            this._onLongPress = this._onLongPress.bind(this);
            this._onOrientationChange = this._onOrientationChange.bind(this);
            this._onMouseWheel = this._onMouseWheel.bind(this);
            this._onMouseOut = this._onMouseOut.bind(this);
            this._onMouseEnter = this._onMouseEnter.bind(this);
            this._onContextMenu = this._onContextMenu.bind(this)
        },
        removeListeners: function() {
            c(fabric.window, "resize", this._onResize);
            c(this.upperCanvasEl, "mousedown", this._onMouseDown);
            c(this.upperCanvasEl, "mousemove", this._onMouseMove);
            c(this.upperCanvasEl, "mouseout", this._onMouseOut);
            c(this.upperCanvasEl, "mouseenter", this._onMouseEnter);
            c(this.upperCanvasEl, "wheel", this._onMouseWheel);
            c(this.upperCanvasEl, "contextmenu", this._onContextMenu);
            c(this.upperCanvasEl, "touchstart", this._onMouseDown);
            c(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (typeof eventjs !== "undefined" && "remove" in eventjs) {
                eventjs.remove(this.upperCanvasEl, "gesture", this._onGesture);
                eventjs.remove(this.upperCanvasEl, "drag", this._onDrag);
                eventjs.remove(this.upperCanvasEl, "orientation", this._onOrientationChange);
                eventjs.remove(this.upperCanvasEl, "shake", this._onShake);
                eventjs.remove(this.upperCanvasEl, "longpress", this._onLongPress)
            }
        },
        _onGesture: function(f, d) {
            this.__onTransformGesture && this.__onTransformGesture(f, d)
        },
        _onDrag: function(f, d) {
            this.__onDrag && this.__onDrag(f, d)
        },
        _onMouseWheel: function(d) {
            this.__onMouseWheel(d)
        },
        _onMouseOut: function(f) {
            var d = this._hoveredTarget;
            this.fire("mouse:out", {
                target: d,
                e: f
            });
            this._hoveredTarget = null;
            d && d.fire("mouseout", {
                e: f
            })
        },
        _onMouseEnter: function(d) {
            if (!this.findTarget(d)) {
                this.fire("mouse:over", {
                    target: null,
                    e: d
                });
                this._hoveredTarget = null
            }
        },
        _onOrientationChange: function(f, d) {
            this.__onOrientationChange && this.__onOrientationChange(f, d)
        },
        _onShake: function(f, d) {
            this.__onShake && this.__onShake(f, d)
        },
        _onLongPress: function(f, d) {
            this.__onLongPress && this.__onLongPress(f, d)
        },
        _onContextMenu: function(d) {
            if (this.stopContextMenu) {
                d.stopPropagation();
                d.preventDefault()
            }
            return false
        },
        _onMouseDown: function(d) {
            this.__onMouseDown(d);
            b(fabric.document, "touchend", this._onMouseUp, {
                passive: false
            });
            b(fabric.document, "touchmove", this._onMouseMove, {
                passive: false
            });
            c(this.upperCanvasEl, "mousemove", this._onMouseMove);
            c(this.upperCanvasEl, "touchmove", this._onMouseMove);
            if (d.type === "touchstart") {
                c(this.upperCanvasEl, "mousedown", this._onMouseDown)
            } else {
                b(fabric.document, "mouseup", this._onMouseUp);
                b(fabric.document, "mousemove", this._onMouseMove)
            }
        },
        _onMouseUp: function(d) {
            this.__onMouseUp(d);
            c(fabric.document, "mouseup", this._onMouseUp);
            c(fabric.document, "touchend", this._onMouseUp);
            c(fabric.document, "mousemove", this._onMouseMove);
            c(fabric.document, "touchmove", this._onMouseMove);
            b(this.upperCanvasEl, "mousemove", this._onMouseMove);
            b(this.upperCanvasEl, "touchmove", this._onMouseMove, {
                passive: false
            });
            if (d.type === "touchend") {
                var f = this;
                setTimeout(function() {
                    b(f.upperCanvasEl, "mousedown", f._onMouseDown)
                }, 400)
            }
        },
        _onMouseMove: function(d) {
            !this.allowTouchScrolling && d.preventDefault && d.preventDefault();
            this.__onMouseMove(d)
        },
        _onResize: function() {
            this.calcOffset()
        },
        _shouldRender: function(e, f) {
            var d = this.getActiveGroup() || this.getActiveObject();
            if (d && d.isEditing && e === d) {
                return false
            }
            return !!((e && (e.isMoving || e !== d)) || (!e && !!d) || (!e && !d && !this._groupSelector) || (f && this._previousPointer && this.selection && (f.x !== this._previousPointer.x || f.y !== this._previousPointer.y)))
        },
        __onMouseUp: function(j) {
            var i, h = true,
                f = this._currentTransform,
                d = this._groupSelector,
                g = (!d || (d.left === 0 && d.top === 0));
            if (this.isDrawingMode && this._isCurrentlyDrawing) {
                this._onMouseUpInDrawingMode(j);
                return
            }
            if (f) {
                this._finalizeCurrentTransform();
                h = !f.actionPerformed
            }
            i = h ? this.findTarget(j, true) : f.target;
            var k = this._shouldRender(i, this.getPointer(j));
            if (i || !g) {
                this._maybeGroupObjects(j)
            } else {
                this._groupSelector = null;
                this._currentTransform = null
            }
            if (i) {
                i.isMoving = false
            }
            this._handleCursorAndEvent(j, i, "up");
            i && (i.__corner = 0);
            k && this.renderAll()
        },
        _handleCursorAndEvent: function(g, f, d) {
            this._setCursorFromEvent(g, f);
            this._handleEvent(g, d, f ? f : null)
        },
        _handleEvent: function(l, j, h) {
            var k = typeof h === "undefined" ? this.findTarget(l) : h,
                d = this.targets || [],
                f = {
                    e: l,
                    target: k,
                    subTargets: d
                };
            this.fire("mouse:" + j, f);
            k && k.fire("mouse" + j, f);
            for (var g = 0; g < d.length; g++) {
                d[g].fire("mouse" + j, f)
            }
        },
        _finalizeCurrentTransform: function() {
            var d = this._currentTransform,
                e = d.target;
            if (e._scaling) {
                e._scaling = false
            }
            e.setCoords();
            this._restoreOriginXY(e);
            if (d.actionPerformed || (this.stateful && e.hasStateChanged())) {
                this.fire("object:modified", {
                    target: e
                });
                e.fire("modified")
            }
        },
        _restoreOriginXY: function(e) {
            if (this._previousOriginX && this._previousOriginY) {
                var d = e.translateToOriginPoint(e.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                e.originX = this._previousOriginX;
                e.originY = this._previousOriginY;
                e.left = d.x;
                e.top = d.y;
                this._previousOriginX = null;
                this._previousOriginY = null
            }
        },
        _onMouseDownInDrawingMode: function(d) {
            this._isCurrentlyDrawing = true;
            this.discardActiveObject(d).renderAll();
            if (this.clipTo) {
                fabric.util.clipContext(this, this.contextTop)
            }
            var f = this.getPointer(d);
            this.freeDrawingBrush.onMouseDown(f);
            this._handleEvent(d, "down")
        },
        _onMouseMoveInDrawingMode: function(d) {
            if (this._isCurrentlyDrawing) {
                var f = this.getPointer(d);
                this.freeDrawingBrush.onMouseMove(f)
            }
            this.setCursor(this.freeDrawingCursor);
            this._handleEvent(d, "move")
        },
        _onMouseUpInDrawingMode: function(d) {
            this._isCurrentlyDrawing = false;
            if (this.clipTo) {
                this.contextTop.restore()
            }
            this.freeDrawingBrush.onMouseUp();
            this._handleEvent(d, "up")
        },
        __onMouseDown: function(h) {
            var g = this.findTarget(h);
            var f = "which" in h ? h.which === 3 : h.button === 2;
            if (f) {
                if (this.fireRightClick) {
                    this._handleEvent(h, "down", g ? g : null)
                }
                return
            }
            if (this.isDrawingMode) {
                this._onMouseDownInDrawingMode(h);
                return
            }
            if (this._currentTransform) {
                return
            }
            var j = this.getPointer(h, true);
            this._previousPointer = j;
            var i = this._shouldRender(g, j),
                d = this._shouldGroup(h, g);
            if (this._shouldClearSelection(h, g)) {
                this._clearSelection(h, g, j)
            } else {
                if (d) {
                    this._handleGrouping(h, g);
                    g = this.getActiveGroup()
                }
            }
            if (g) {
                if (g.selectable && (g.__corner || !d)) {
                    this._beforeTransform(h, g);
                    this._setupCurrentTransform(h, g)
                }
                if (g !== this.getActiveGroup() && g !== this.getActiveObject()) {
                    this.deactivateAll();
                    g.selectable && this.setActiveObject(g, h)
                }
            }
            this._handleEvent(h, "down", g ? g : null);
            i && this.renderAll()
        },
        _beforeTransform: function(f, d) {
            this.stateful && d.saveState();
            if (d._findTargetCorner(this.getPointer(f))) {
                this.onBeforeScaleRotate(d)
            }
        },
        _clearSelection: function(f, d, g) {
            this.deactivateAllWithDispatch(f);
            if (d && d.selectable) {
                this.setActiveObject(d, f)
            } else {
                if (this.selection) {
                    this._groupSelector = {
                        ex: g.x,
                        ey: g.y,
                        top: 0,
                        left: 0
                    }
                }
            }
        },
        _setOriginToCenter: function(e) {
            this._previousOriginX = this._currentTransform.target.originX;
            this._previousOriginY = this._currentTransform.target.originY;
            var d = e.getCenterPoint();
            e.originX = "center";
            e.originY = "center";
            e.left = d.x;
            e.top = d.y;
            this._currentTransform.left = e.left;
            this._currentTransform.top = e.top
        },
        _setCenterToOrigin: function(e) {
            var d = e.translateToOriginPoint(e.getCenterPoint(), this._previousOriginX, this._previousOriginY);
            e.originX = this._previousOriginX;
            e.originY = this._previousOriginY;
            e.left = d.x;
            e.top = d.y;
            this._previousOriginX = null;
            this._previousOriginY = null
        },
        __onMouseMove: function(g) {
            var f, h;
            if (this.isDrawingMode) {
                this._onMouseMoveInDrawingMode(g);
                return
            }
            if (typeof g.touches !== "undefined" && g.touches.length > 1) {
                return
            }
            var d = this._groupSelector;
            if (d) {
                h = this.getPointer(g, true);
                d.left = h.x - d.ex;
                d.top = h.y - d.ey;
                this.renderTop()
            } else {
                if (!this._currentTransform) {
                    f = this.findTarget(g);
                    this._setCursorFromEvent(g, f)
                } else {
                    this._transformObject(g)
                }
            }
            this._handleEvent(g, "move", f ? f : null)
        },
        __onMouseWheel: function(d) {
            this._handleEvent(d, "wheel")
        },
        _transformObject: function(f) {
            var g = this.getPointer(f),
                d = this._currentTransform;
            d.reset = false;
            d.target.isMoving = true;
            d.shiftKey = f.shiftKey;
            d.altKey = f[this.centeredKey];
            this._beforeScaleTransform(f, d);
            this._performTransformAction(f, d, g);
            d.actionPerformed && this.renderAll()
        },
        _performTransformAction: function(i, f, k) {
            var d = k.x,
                l = k.y,
                h = f.target,
                g = f.action,
                j = false;
            if (g === "rotate") {
                (j = this._rotateObject(d, l)) && this._fire("rotating", h, i)
            } else {
                if (g === "scale") {
                    (j = this._onScale(i, f, d, l)) && this._fire("scaling", h, i)
                } else {
                    if (g === "scaleX") {
                        (j = this._scaleObject(d, l, "x")) && this._fire("scaling", h, i)
                    } else {
                        if (g === "scaleY") {
                            (j = this._scaleObject(d, l, "y")) && this._fire("scaling", h, i)
                        } else {
                            if (g === "skewX") {
                                (j = this._skewObject(d, l, "x")) && this._fire("skewing", h, i)
                            } else {
                                if (g === "skewY") {
                                    (j = this._skewObject(d, l, "y")) && this._fire("skewing", h, i)
                                } else {
                                    j = this._translateObject(d, l);
                                    if (j) {
                                        this._fire("moving", h, i);
                                        this.setCursor(h.moveCursor || this.moveCursor)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            f.actionPerformed = f.actionPerformed || j
        },
        _fire: function(d, g, f) {
            this.fire("object:" + d, {
                target: g,
                e: f
            });
            g.fire(d, {
                e: f
            })
        },
        _beforeScaleTransform: function(g, d) {
            if (d.action === "scale" || d.action === "scaleX" || d.action === "scaleY") {
                var f = this._shouldCenterTransform(d.target);
                if ((f && (d.originX !== "center" || d.originY !== "center")) || (!f && d.originX === "center" && d.originY === "center")) {
                    this._resetCurrentTransform();
                    d.reset = true
                }
            }
        },
        _onScale: function(g, f, d, h) {
            if ((g[this.uniScaleKey] || this.uniScaleTransform) && !f.target.get("lockUniScaling")) {
                f.currentAction = "scale";
                return this._scaleObject(d, h)
            } else {
                if (!f.reset && f.currentAction === "scale") {
                    this._resetCurrentTransform()
                }
                f.currentAction = "scaleEqually";
                return this._scaleObject(d, h, "equally")
            }
        },
        _setCursorFromEvent: function(h, g) {
            if (!g || !g.selectable) {
                this.setCursor(this.defaultCursor);
                return false
            }
            var i = g.hoverCursor || this.hoverCursor,
                d = this.getActiveGroup(),
                f = g._findTargetCorner && (!d || !d.contains(g)) && g._findTargetCorner(this.getPointer(h, true));
            if (!f) {
                this.setCursor(i)
            } else {
                this._setCornerCursor(f, g, h)
            }
            return true
        },
        _setCornerCursor: function(d, g, f) {
            if (d in a) {
                this.setCursor(this._getRotatedCornerCursor(d, g, f))
            } else {
                if (d === "mtr" && g.hasRotatingPoint) {
                    this.setCursor(this.rotationCursor)
                } else {
                    this.setCursor(this.defaultCursor);
                    return false
                }
            }
        },
        _getRotatedCornerCursor: function(d, g, f) {
            var h = Math.round((g.getAngle() % 360) / 45);
            if (h < 0) {
                h += 8
            }
            h += a[d];
            if (f[this.altActionKey] && a[d] % 2 === 0) {
                h += 2
            }
            h %= 8;
            return this.cursorMap[h]
        }
    })
})();
(function() {
    var b = Math.min,
        a = Math.max;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        _shouldGroup: function(f, d) {
            var c = this.getActiveObject();
            return f[this.selectionKey] && d && d.selectable && (this.getActiveGroup() || (c && c !== d)) && this.selection
        },
        _handleGrouping: function(f, d) {
            var c = this.getActiveGroup();
            if (d === c) {
                d = this.findTarget(f, true);
                if (!d) {
                    return
                }
            }
            if (c) {
                this._updateActiveGroup(d, f)
            } else {
                this._createActiveGroup(d, f)
            }
            if (this._activeGroup) {
                this._activeGroup.saveCoords()
            }
        },
        _updateActiveGroup: function(f, d) {
            var c = this.getActiveGroup();
            if (c.contains(f)) {
                c.removeWithUpdate(f);
                f.set("active", false);
                if (c.size() === 1) {
                    this.discardActiveGroup(d);
                    this.setActiveObject(c.item(0));
                    return
                }
            } else {
                c.addWithUpdate(f)
            }
            this.fire("selection:created", {
                target: c,
                e: d
            });
            c.set("active", true)
        },
        _createActiveGroup: function(f, d) {
            if (this._activeObject && f !== this._activeObject) {
                var c = this._createGroup(f);
                c.addWithUpdate();
                this.setActiveGroup(c);
                this._activeObject = null;
                this.fire("selection:created", {
                    target: c,
                    e: d
                })
            }
            f.set("active", true)
        },
        _createGroup: function(f) {
            var e = this.getObjects(),
                c = e.indexOf(this._activeObject) < e.indexOf(f),
                d = c ? [this._activeObject, f] : [f, this._activeObject];
            this._activeObject.isEditing && this._activeObject.exitEditing();
            return new fabric.Group(d, {
                canvas: this
            })
        },
        pruneGroupSelection: null,
        _groupSelectedObjects: function(d) {
            var c = this._collectObjects();
            if (this.pruneGroupSelection) {
                this.pruneGroupSelection(c)
            }
            if (c.length === 1) {
                this.setActiveObject(c[0], d)
            } else {
                if (c.length > 1) {
                    c = new fabric.Group(c.reverse(), {
                        canvas: this
                    });
                    c.addWithUpdate();
                    this.setActiveGroup(c, d);
                    c.saveCoords();
                    this.fire("selection:created", {
                        target: c
                    });
                    this.renderAll()
                }
            }
        },
        _collectObjects: function() {
            var m = [],
                g, d = this._groupSelector.ex,
                k = this._groupSelector.ey,
                c = d + this._groupSelector.left,
                h = k + this._groupSelector.top,
                f = new fabric.Point(b(d, c), b(k, h)),
                j = new fabric.Point(a(d, c), a(k, h)),
                l = d === c && k === h;
            for (var e = this._objects.length; e--;) {
                g = this._objects[e];
                if (!g || !g.selectable || !g.visible) {
                    continue
                }
                if (g.intersectsWithRect(f, j) || g.isContainedWithinRect(f, j) || g.containsPoint(f) || g.containsPoint(j)) {
                    if (g.perPixelTargetFind && g.containsPoint(f) && g.containsPoint(j)) {
                        continue
                    }
                    g.set("active", true);
                    m.push(g);
                    if (l) {
                        break
                    }
                }
            }
            return m
        },
        _maybeGroupObjects: function(d) {
            if (this.selection && this._groupSelector) {
                this._groupSelectedObjects(d)
            }
            var c = this.getActiveGroup();
            if (c) {
                c.setObjectsCoords().setCoords();
                c.isMoving = false;
                this.setCursor(this.defaultCursor)
            }
            this._groupSelector = null;
            this._currentTransform = null
        }
    })
})();
(function() {
    var a = fabric.StaticCanvas.supports("toDataURLWithQuality");
    fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(b) {
            b || (b = {});
            var c = b.format || "png",
                f = b.quality || 1,
                e = b.multiplier || 1,
                d = {
                    left: b.left || 0,
                    top: b.top || 0,
                    width: b.width || 0,
                    height: b.height || 0,
                };
            return this.__toDataURLWithMultiplier(c, f, d, e)
        },
        __toDataURLWithMultiplier: function(k, l, d, o) {
            var m = this.getWidth(),
                p = this.getHeight(),
                h = (d.width || this.getWidth()) * o,
                j = (d.height || this.getHeight()) * o,
                n = this.getZoom(),
                i = n * o,
                b = this.viewportTransform,
                f = (b[4] - d.left) * o,
                c = (b[5] - d.top) * o,
                e = [i, 0, 0, i, f, c],
                q = this.interactive;
            this.viewportTransform = e;
            this.interactive && (this.interactive = false);
            if (m !== h || p !== j) {
                this.setDimensions({
                    width: h,
                    height: j
                })
            } else {
                this.renderAll()
            }
            var g = this.__toDataURL(k, l, d);
            q && (this.interactive = q);
            this.viewportTransform = b;
            this.setDimensions({
                width: m,
                height: p
            });
            return g
        },
        __toDataURL: function(d, e) {
            var b = this.contextContainer.canvas;
            if (d === "jpg") {
                d = "jpeg"
            }
            var c = a ? b.toDataURL("image/" + d, e) : b.toDataURL("image/" + d);
            return c
        },
        toDataURLWithMultiplier: function(b, d, c) {
            return this.toDataURL({
                format: b,
                multiplier: d,
                quality: c
            })
        },
    })
})();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromDatalessJSON: function(c, b, d, a) {
        return this.loadFromJSON(c, b, d, a)
    },
    loadFromJSON: function(c, b, f, a) {
        if (!c) {
            return
        }
        var d = (typeof c === "string") ? JSON.parse(c) : fabric.util.object.clone(c);
        if (!b) {
            this.clear()
        }
        var e = this;
        this._enlivenObjects(d.objects, b, function() {
            e._setBgOverlay(d, function() {
                delete d.objects;
                delete d.backgroundImage;
                delete d.overlayImage;
                delete d.background;
                delete d.overlay;
                e._setOptions(d);
                f && f()
            })
        }, a);
        return this
    },
    _setBgOverlay: function(c, e) {
        var d = this,
            b = {
                backgroundColor: false,
                overlayColor: false,
                backgroundImage: false,
                overlayImage: false
            };
        if (!c.backgroundImage && !c.overlayImage && !c.background && !c.overlay) {
            e && e();
            return
        }
        var a = function() {
            if (b.backgroundImage && b.overlayImage && b.backgroundColor && b.overlayColor) {
                d.renderAll();
                e && e()
            }
        };
        this.__setBgOverlay("backgroundImage", c.backgroundImage, b, a);
        this.__setBgOverlay("overlayImage", c.overlayImage, b, a);
        this.__setBgOverlay("backgroundColor", c.background, b, a);
        this.__setBgOverlay("overlayColor", c.overlay, b, a)
    },
    __setBgOverlay: function(c, b, a, e) {
        var d = this;
        if (!b) {
            a[c] = true;
            e && e();
            return
        }
        if (c === "backgroundImage" || c === "overlayImage") {
            fabric.util.enlivenObjects([b], function(f) {
                d[c] = f[0];
                a[c] = true;
                e && e()
            })
        } else {
            this["set" + fabric.util.string.capitalize(c, true)](b, function() {
                a[c] = true;
                e && e()
            })
        }
    },
    _enlivenObjects: function(c, b, f, a) {
        var e = this;
        if (!c || c.length === 0) {
            f && f();
            return
        }
        var d = this.renderOnAddRemove;
        this.renderOnAddRemove = false;
        fabric.util.enlivenObjects(c, function(g) {
            g.forEach(function(i, h) {
                if (!b) {
                    e.insertAt(i, h)
                } else {
                    e.add(i)
                }
            });
            e.renderOnAddRemove = d;
            f && f()
        }, null, a)
    },
    _toDataURL: function(a, b) {
        this.clone(function(c) {
            b(c.toDataURL(a))
        })
    },
    _toDataURLWithMultiplier: function(a, c, b) {
        this.clone(function(d) {
            b(d.toDataURLWithMultiplier(a, c))
        })
    },
    clone: function(c, a) {
        var b = JSON.stringify(this.toJSON(a));
        this.cloneWithoutData(function(d) {
            d.loadFromJSON(b, false, function() {
                c && c(d)
            })
        })
    },
    cloneWithoutData: function(c) {
        var a = fabric.document.createElement("canvas");
        a.width = this.getWidth();
        a.height = this.getHeight();
        var b = new fabric.Canvas(a);
        b.clipTo = this.clipTo;
        if (this.backgroundImage) {
            b.setBackgroundImage(this.backgroundImage.src, function() {
                b.renderAll();
                c && c(b)
            });
            b.backgroundImageOpacity = this.backgroundImageOpacity;
            b.backgroundImageStretch = this.backgroundImageStretch
        } else {
            c && c(b)
        }
    }
});
(function() {
    var a = fabric.util.degreesToRadians,
        b = fabric.util.radiansToDegrees;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        __onTransformGesture: function(f, c) {
            if (this.isDrawingMode || !f.touches || f.touches.length !== 2 || "gesture" !== c.gesture) {
                return
            }
            var d = this.findTarget(f);
            if ("undefined" !== typeof d) {
                this.__gesturesParams = {
                    e: f,
                    self: c,
                    target: d
                };
                this.__gesturesRenderer()
            }
            this.fire("touch:gesture", {
                target: d,
                e: f,
                self: c
            })
        },
        __gesturesParams: null,
        __gesturesRenderer: function() {
            if (this.__gesturesParams === null || this._currentTransform === null) {
                return
            }
            var c = this.__gesturesParams.self,
                d = this._currentTransform,
                f = this.__gesturesParams.e;
            d.action = "scale";
            d.originX = d.originY = "center";
            this._setOriginToCenter(d.target);
            this._scaleObjectBy(c.scale, f);
            if (c.rotation !== 0) {
                d.action = "rotate";
                this._rotateObjectByAngle(c.rotation, f)
            }
            this._setCenterToOrigin(d.target);
            this.renderAll();
            d.action = "drag"
        },
        __onDrag: function(d, c) {
            this.fire("touch:drag", {
                e: d,
                self: c
            })
        },
        __onOrientationChange: function(d, c) {
            this.fire("touch:orientation", {
                e: d,
                self: c
            })
        },
        __onShake: function(d, c) {
            this.fire("touch:shake", {
                e: d,
                self: c
            })
        },
        __onLongPress: function(d, c) {
            this.fire("touch:longpress", {
                e: d,
                self: c
            })
        },
        _scaleObjectBy: function(d, k) {
            var c = this._currentTransform,
                j = c.target,
                h = j.get("lockScalingX"),
                f = j.get("lockScalingY");
            if (h && f) {
                return
            }
            j._scaling = true;
            var g = j.translateToOriginPoint(j.getCenterPoint(), c.originX, c.originY),
                i = j._getTransformedDimensions();
            this._setObjectScale(new fabric.Point(c.scaleX * i.x * d / j.scaleX, c.scaleY * i.y * d / j.scaleY), c, h, f, null, j.get("lockScalingFlip"), i);
            j.setPositionByOrigin(g, c.originX, c.originY);
            this._fire("scaling", j, k)
        },
        _rotateObjectByAngle: function(f, d) {
            var c = this._currentTransform;
            if (c.target.get("lockRotation")) {
                return
            }
            c.target.angle = b(a(f) + c.theta);
            this._fire("rotating", c.target, d)
        }
    })
})();
(function(b) {
    var e = b.fabric || (b.fabric = {}),
        g = e.util.object.extend,
        h = e.util.object.clone,
        d = e.util.toFixed,
        f = e.util.string.capitalize,
        c = e.util.degreesToRadians,
        i = e.StaticCanvas.supports("setLineDash"),
        a = !e.isLikelyNode;
    if (e.Object) {
        return
    }
    e.Object = e.util.createClass(e.CommonMethods, {
        type: "object",
        originX: "left",
        originY: "top",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        opacity: 1,
        angle: 0,
        skewX: 0,
        skewY: 0,
        cornerSize: 13,
        transparentCorners: true,
        hoverCursor: null,
        moveCursor: null,
        padding: 0,
        borderColor: "rgba(102,153,255,0.75)",
        borderDashArray: null,
        cornerColor: "rgba(102,153,255,0.5)",
        cornerStrokeColor: null,
        cornerStyle: "rect",
        cornerHitTolerance: 1,
        cornerDashArray: null,
        centeredScaling: false,
        centeredRotation: true,
        fill: "rgb(0,0,0)",
        fillRule: "nonzero",
        globalCompositeOperation: "source-over",
        backgroundColor: "",
        selectionBackgroundColor: "",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: "butt",
        strokeLineJoin: "miter",
        strokeMiterLimit: 10,
        shadow: null,
        borderOpacityWhenMoving: 0.4,
        borderScaleFactor: 1,
        transformMatrix: null,
        minScaleLimit: 0.01,
        selectable: true,
        evented: true,
        visible: true,
        hasControls: true,
        hasBorders: true,
        hasRotatingPoint: true,
        rotatingPointOffset: 40,
        perPixelTargetFind: false,
        targetFindTolerance: 0,
        includeDefaultValues: true,
        clipTo: null,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        lockUniScaling: false,
        lockSkewingX: false,
        lockSkewingY: false,
        lockScalingFlip: false,
        excludeFromExport: false,
        objectCaching: a,
        statefullCache: false,
        noScaleCache: true,
        dirty: false,
        needsItsOwnCache: false,
        stateProperties: ("top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule globalCompositeOperation shadow clipTo visible backgroundColor skewX skewY").split(" "),
        cacheProperties: ("fill stroke strokeWidth strokeDashArray width height stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit fillRule backgroundColor").split(" "),
        initialize: function(j) {
            j = j || {};
            if (j) {
                this.setOptions(j)
            }
            if (this.objectCaching) {
                this._createCacheCanvas();
                this.setupState({
                    propertySet: "cacheProperties"
                })
            }
        },
        _createCacheCanvas: function() {
            this._cacheCanvas = e.document.createElement("canvas");
            this._cacheContext = this._cacheCanvas.getContext("2d");
            this._updateCacheCanvas()
        },
        _getCacheCanvasDimensions: function() {
            var o = this.canvas && this.canvas.getZoom() || 1,
                l = this.getObjectScaling(),
                q = this._getNonTransformedDimensions(),
                k = this.canvas && this.canvas._isRetinaScaling() ? e.devicePixelRatio : 1,
                p = l.scaleX * o * k,
                n = l.scaleY * o * k,
                m = q.x * p,
                j = q.y * n;
            return {
                width: Math.ceil(m) + 2,
                height: Math.ceil(j) + 2,
                zoomX: p,
                zoomY: n
            }
        },
        _updateCacheCanvas: function() {
            if (this.noScaleCache && this.canvas && this.canvas._currentTransform) {
                var n = this.canvas._currentTransform.action;
                if (n.slice(0, 5) === "scale") {
                    return false
                }
            }
            var o = this._getCacheCanvasDimensions(),
                k = o.width,
                j = o.height,
                m = o.zoomX,
                l = o.zoomY;
            if (k !== this.cacheWidth || j !== this.cacheHeight) {
                this._cacheCanvas.width = k;
                this._cacheCanvas.height = j;
                this._cacheContext.translate(k / 2, j / 2);
                this._cacheContext.scale(m, l);
                this.cacheWidth = k;
                this.cacheHeight = j;
                this.zoomX = m;
                this.zoomY = l;
                return true
            }
            return false
        },
        setOptions: function(j) {
            this._setOptions(j);
            this._initGradient(j.fill, "fill");
            this._initGradient(j.stroke, "stroke");
            this._initClipping(j);
            this._initPattern(j.fill, "fill");
            this._initPattern(j.stroke, "stroke")
        },
        transform: function(k, l) {
            if (this.group && !this.group._transformDone && this.group === this.canvas._activeGroup) {
                this.group.transform(k)
            }
            var j = l ? this._getLeftTopCoords() : this.getCenterPoint();
            k.translate(j.x, j.y);
            this.angle && k.rotate(c(this.angle));
            k.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1));
            this.skewX && k.transform(1, 0, Math.tan(c(this.skewX)), 1, 0, 0);
            this.skewY && k.transform(1, Math.tan(c(this.skewY)), 0, 1, 0, 0)
        },
        toObject: function(l) {
            var k = e.Object.NUM_FRACTION_DIGITS,
                j = {
                    type: this.type,
                    originX: this.originX,
                    originY: this.originY,
                    left: d(this.left, k),
                    top: d(this.top, k),
                    width: d(this.width, k),
                    height: d(this.height, k),
                    fill: (this.fill && this.fill.toObject) ? this.fill.toObject() : this.fill,
                    stroke: (this.stroke && this.stroke.toObject) ? this.stroke.toObject() : this.stroke,
                    strokeWidth: d(this.strokeWidth, k),
                    strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                    strokeLineCap: this.strokeLineCap,
                    strokeLineJoin: this.strokeLineJoin,
                    strokeMiterLimit: d(this.strokeMiterLimit, k),
                    scaleX: d(this.scaleX, k),
                    scaleY: d(this.scaleY, k),
                    angle: d(this.getAngle(), k),
                    flipX: this.flipX,
                    flipY: this.flipY,
                    opacity: d(this.opacity, k),
                    shadow: (this.shadow && this.shadow.toObject) ? this.shadow.toObject() : this.shadow,
                    visible: this.visible,
                    clipTo: this.clipTo && String(this.clipTo),
                    backgroundColor: this.backgroundColor,
                    fillRule: this.fillRule,
                    globalCompositeOperation: this.globalCompositeOperation,
                    transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : null,
                    skewX: d(this.skewX, k),
                    skewY: d(this.skewY, k)
                };
            e.util.populateWithProperties(this, j, l);
            if (!this.includeDefaultValues) {
                j = this._removeDefaultValues(j)
            }
            return j
        },
        toDatalessObject: function(j) {
            return this.toObject(j)
        },
        _removeDefaultValues: function(k) {
            var j = e.util.getKlass(k.type).prototype,
                l = j.stateProperties;
            l.forEach(function(n) {
                if (k[n] === j[n]) {
                    delete k[n]
                }
                var m = Object.prototype.toString.call(k[n]) === "[object Array]" && Object.prototype.toString.call(j[n]) === "[object Array]";
                if (m && k[n].length === 0 && j[n].length === 0) {
                    delete k[n]
                }
            });
            return k
        },
        toString: function() {
            return "#<fabric." + f(this.type) + ">"
        },
        getObjectScaling: function() {
            var k = this.scaleX,
                j = this.scaleY;
            if (this.group) {
                var l = this.group.getObjectScaling();
                k *= l.scaleX;
                j *= l.scaleY
            }
            return {
                scaleX: k,
                scaleY: j
            }
        },
        _set: function(j, k) {
            var l = (j === "scaleX" || j === "scaleY");
            if (l) {
                k = this._constrainScale(k)
            }
            if (j === "scaleX" && k < 0) {
                this.flipX = !this.flipX;
                k *= -1
            } else {
                if (j === "scaleY" && k < 0) {
                    this.flipY = !this.flipY;
                    k *= -1
                } else {
                    if (j === "shadow" && k && !(k instanceof e.Shadow)) {
                        k = new e.Shadow(k)
                    } else {
                        if (j === "dirty" && this.group) {
                            this.group.set("dirty", k)
                        }
                    }
                }
            }
            this[j] = k;
            if (this.cacheProperties.indexOf(j) > -1) {
                if (this.group) {
                    this.group.set("dirty", true)
                }
                this.dirty = true
            }
            if (j === "width" || j === "height") {
                this.minScaleLimit = Math.min(0.1, 1 / Math.max(this.width, this.height))
            }
            return this
        },
        setOnGroup: function() {},
        setSourcePath: function(j) {
            this.sourcePath = j;
            return this
        },
        getViewportTransform: function() {
            if (this.canvas && this.canvas.viewportTransform) {
                return this.canvas.viewportTransform
            }
            return e.iMatrix.concat()
        },
        render: function(j, k) {
            if ((this.width === 0 && this.height === 0) || !this.visible) {
                return
            }
            j.save();
            this.clipTo && e.util.clipContext(this, j);
            this._setupCompositeOperation(j);
            this.drawSelectionBackground(j);
            if (!k) {
                this.transform(j)
            }
            this._setOpacity(j);
            this._setShadow(j);
            if (this.transformMatrix) {
                j.transform.apply(j, this.transformMatrix)
            }
            if (this.objectCaching && (!this.group || this.needsItsOwnCache)) {
                if (!this._cacheCanvas) {
                    this._createCacheCanvas()
                }
                if (this.isCacheDirty(k)) {
                    this.statefullCache && this.saveState({
                        propertySet: "cacheProperties"
                    });
                    this.drawObject(this._cacheContext, k);
                    this.dirty = false
                }
                this.drawCacheOnCanvas(j)
            } else {
                this.drawObject(j, k);
                if (k && this.objectCaching && this.statefullCache) {
                    this.saveState({
                        propertySet: "cacheProperties"
                    })
                }
            }
            this.clipTo && j.restore();
            j.restore()
        },
        drawObject: function(j, k) {
            this._renderBackground(j);
            this._setStrokeStyles(j);
            this._setFillStyles(j);
            this._render(j, k)
        },
        drawCacheOnCanvas: function(j) {
            j.scale(1 / this.zoomX, 1 / this.zoomY);
            j.drawImage(this._cacheCanvas, -this.cacheWidth / 2, -this.cacheHeight / 2)
        },
        isCacheDirty: function(k) {
            if (!k && this._updateCacheCanvas()) {
                return true
            } else {
                if (this.dirty || (this.statefullCache && this.hasStateChanged("cacheProperties"))) {
                    if (!k) {
                        var l = this.cacheWidth / this.zoomX;
                        var j = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-l / 2, -j / 2, l, j)
                    }
                    return true
                }
            }
            return false
        },
        _renderBackground: function(j) {
            if (!this.backgroundColor) {
                return
            }
            var k = this._getNonTransformedDimensions();
            j.fillStyle = this.backgroundColor;
            j.fillRect(-k.x / 2, -k.y / 2, k.x, k.y);
            this._removeShadow(j)
        },
        _setOpacity: function(j) {
            j.globalAlpha *= this.opacity
        },
        _setStrokeStyles: function(j) {
            if (this.stroke) {
                j.lineWidth = this.strokeWidth;
                j.lineCap = this.strokeLineCap;
                j.lineJoin = this.strokeLineJoin;
                j.miterLimit = this.strokeMiterLimit;
                j.strokeStyle = this.stroke.toLive ? this.stroke.toLive(j, this) : this.stroke
            }
        },
        _setFillStyles: function(j) {
            if (this.fill) {
                j.fillStyle = this.fill.toLive ? this.fill.toLive(j, this) : this.fill
            }
        },
        _setLineDash: function(j, k, l) {
            if (!k) {
                return
            }
            if (1 & k.length) {
                k.push.apply(k, k)
            }
            if (i) {
                j.setLineDash(k)
            } else {
                l && l(j)
            }
        },
        _renderControls: function(j, n) {
            if (!this.active || n || (this.group && this.group !== this.canvas.getActiveGroup())) {
                return
            }
            var m = this.getViewportTransform(),
                k = this.calcTransformMatrix(),
                l;
            k = e.util.multiplyTransformMatrices(m, k);
            l = e.util.qrDecompose(k);
            j.save();
            j.translate(l.translateX, l.translateY);
            j.lineWidth = 1 * this.borderScaleFactor;
            if (!this.group) {
                j.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1
            }
            if (this.group && this.group === this.canvas.getActiveGroup()) {
                j.rotate(c(l.angle));
                this.drawBordersInGroup(j, l)
            } else {
                j.rotate(c(this.angle));
                this.drawBorders(j)
            }
            this.drawControls(j);
            j.restore()
        },
        _setShadow: function(j) {
            if (!this.shadow) {
                return
            }
            var l = (this.canvas && this.canvas.viewportTransform[0]) || 1,
                k = (this.canvas && this.canvas.viewportTransform[3]) || 1,
                m = this.getObjectScaling();
            if (this.canvas && this.canvas._isRetinaScaling()) {
                l *= e.devicePixelRatio;
                k *= e.devicePixelRatio
            }
            j.shadowColor = this.shadow.color;
            j.shadowBlur = this.shadow.blur * (l + k) * (m.scaleX + m.scaleY) / 4;
            j.shadowOffsetX = this.shadow.offsetX * l * m.scaleX;
            j.shadowOffsetY = this.shadow.offsetY * k * m.scaleY
        },
        _removeShadow: function(j) {
            if (!this.shadow) {
                return
            }
            j.shadowColor = "";
            j.shadowBlur = j.shadowOffsetX = j.shadowOffsetY = 0
        },
        _applyPatternGradientTransform: function(k, m) {
            if (!m.toLive) {
                return
            }
            var l = m.gradientTransform || m.patternTransform;
            if (l) {
                k.transform.apply(k, l)
            }
            var j = -this.width / 2 + m.offsetX || 0,
                n = -this.height / 2 + m.offsetY || 0;
            k.translate(j, n)
        },
        _renderFill: function(j) {
            if (!this.fill) {
                return
            }
            j.save();
            this._applyPatternGradientTransform(j, this.fill);
            if (this.fillRule === "evenodd") {
                j.fill("evenodd")
            } else {
                j.fill()
            }
            j.restore()
        },
        _renderStroke: function(j) {
            if (!this.stroke || this.strokeWidth === 0) {
                return
            }
            if (this.shadow && !this.shadow.affectStroke) {
                this._removeShadow(j)
            }
            j.save();
            this._setLineDash(j, this.strokeDashArray, this._renderDashedStroke);
            this._applyPatternGradientTransform(j, this.stroke);
            j.stroke();
            j.restore()
        },
        clone: function(k, j) {
            if (this.constructor.fromObject) {
                return this.constructor.fromObject(this.toObject(j), k)
            }
            return new e.Object(this.toObject(j))
        },
        cloneAsImage: function(l, j) {
            var k = this.toDataURL(j);
            e.util.loadImage(k, function(m) {
                if (l) {
                    l(new e.Image(m))
                }
            });
            return this
        },
        toDataURL: function(l) {
            l || (l = {});
            var m = e.util.createCanvasElement(),
                k = this.getBoundingRect();
            m.width = k.width;
            m.height = k.height;
            e.util.wrapElement(m, "div");
            var j = new e.StaticCanvas(m, {
                enableRetinaScaling: l.enableRetinaScaling
            });
            if (l.format === "jpg") {
                l.format = "jpeg"
            }
            if (l.format === "jpeg") {
                j.backgroundColor = "#fff"
            }
            var o = {
                active: this.get("active"),
                left: this.getLeft(),
                top: this.getTop()
            };
            this.set("active", false);
            this.setPositionByOrigin(new e.Point(j.getWidth() / 2, j.getHeight() / 2), "center", "center");
            var p = this.canvas;
            j.add(this);
            var n = j.toDataURL(l);
            this.set(o).setCoords();
            this.canvas = p;
            j.dispose();
            j = null;
            return n
        },
        isType: function(j) {
            return this.type === j
        },
        complexity: function() {
            return 1
        },
        toJSON: function(j) {
            return this.toObject(j)
        },
        setGradient: function(k, j) {
            j || (j = {});
            var l = {
                colorStops: []
            };
            l.type = j.type || (j.r1 || j.r2 ? "radial" : "linear");
            l.coords = {
                x1: j.x1,
                y1: j.y1,
                x2: j.x2,
                y2: j.y2
            };
            if (j.r1 || j.r2) {
                l.coords.r1 = j.r1;
                l.coords.r2 = j.r2
            }
            l.gradientTransform = j.gradientTransform;
            e.Gradient.prototype.addColorStop.call(l, j.colorStops);
            return this.set(k, e.Gradient.forObject(this, l))
        },
        setPatternFill: function(j) {
            return this.set("fill", new e.Pattern(j))
        },
        setShadow: function(j) {
            return this.set("shadow", j ? new e.Shadow(j) : null)
        },
        setColor: function(j) {
            this.set("fill", j);
            return this
        },
        setAngle: function(k) {
            var j = (this.originX !== "center" || this.originY !== "center") && this.centeredRotation;
            if (j) {
                this._setOriginToCenter()
            }
            this.set("angle", k);
            if (j) {
                this._resetOrigin()
            }
            return this
        },
        centerH: function() {
            this.canvas && this.canvas.centerObjectH(this);
            return this
        },
        viewportCenterH: function() {
            this.canvas && this.canvas.viewportCenterObjectH(this);
            return this
        },
        centerV: function() {
            this.canvas && this.canvas.centerObjectV(this);
            return this
        },
        viewportCenterV: function() {
            this.canvas && this.canvas.viewportCenterObjectV(this);
            return this
        },
        center: function() {
            this.canvas && this.canvas.centerObject(this);
            return this
        },
        viewportCenter: function() {
            this.canvas && this.canvas.viewportCenterObject(this);
            return this
        },
        remove: function() {
            this.canvas && this.canvas.remove(this);
            return this
        },
        getLocalPointer: function(k, l) {
            l = l || this.canvas.getPointer(k);
            var j = new e.Point(l.x, l.y),
                m = this._getLeftTopCoords();
            if (this.angle) {
                j = e.util.rotatePoint(j, m, c(-this.angle))
            }
            return {
                x: j.x - m.x,
                y: j.y - m.y
            }
        },
        _setupCompositeOperation: function(j) {
            if (this.globalCompositeOperation) {
                j.globalCompositeOperation = this.globalCompositeOperation
            }
        }
    });
    e.util.createAccessors(e.Object);
    e.Object.prototype.rotate = e.Object.prototype.setAngle;
    g(e.Object.prototype, e.Observable);
    e.Object.NUM_FRACTION_DIGITS = 2;
    e.Object._fromObject = function(o, n, p, m, l) {
        var k = e[o];
        n = h(n, true);
        if (m) {
            e.util.enlivenPatterns([n.fill, n.stroke], function(r) {
                n.fill = r[0];
                n.stroke = r[1];
                var q = l ? new k(n[l], n) : new k(n);
                p && p(q)
            })
        } else {
            var j = l ? new k(n[l], n) : new k(n);
            p && p(j);
            return j
        }
    };
    e.Object.__uid = 0
})(typeof exports !== "undefined" ? exports : this);
(function() {
    var a = fabric.util.degreesToRadians,
        c = {
            left: -0.5,
            center: 0,
            right: 0.5
        },
        b = {
            top: -0.5,
            center: 0,
            bottom: 0.5
        };
    fabric.util.object.extend(fabric.Object.prototype, {
        translateToGivenOrigin: function(m, e, d, k, i) {
            var l = m.x,
                j = m.y,
                h, f, g;
            if (typeof e === "string") {
                e = c[e]
            } else {
                e -= 0.5
            }
            if (typeof k === "string") {
                k = c[k]
            } else {
                k -= 0.5
            }
            h = k - e;
            if (typeof d === "string") {
                d = b[d]
            } else {
                d -= 0.5
            }
            if (typeof i === "string") {
                i = b[i]
            } else {
                i -= 0.5
            }
            f = i - d;
            if (h || f) {
                g = this._getTransformedDimensions();
                l = m.x + h * g.x;
                j = m.y + f * g.y
            }
            return new fabric.Point(l, j)
        },
        translateToCenterPoint: function(d, f, e) {
            var g = this.translateToGivenOrigin(d, f, e, "center", "center");
            if (this.angle) {
                return fabric.util.rotatePoint(g, d, a(this.angle))
            }
            return g
        },
        translateToOriginPoint: function(d, f, e) {
            var g = this.translateToGivenOrigin(d, "center", "center", f, e);
            if (this.angle) {
                return fabric.util.rotatePoint(g, d, a(this.angle))
            }
            return g
        },
        getCenterPoint: function() {
            var d = new fabric.Point(this.left, this.top);
            return this.translateToCenterPoint(d, this.originX, this.originY)
        },
        getPointByOrigin: function(f, e) {
            var d = this.getCenterPoint();
            return this.translateToOriginPoint(d, f, e)
        },
        toLocalPoint: function(e, g, f) {
            var d = this.getCenterPoint(),
                i, h;
            if (typeof g !== "undefined" && typeof f !== "undefined") {
                i = this.translateToGivenOrigin(d, "center", "center", g, f)
            } else {
                i = new fabric.Point(this.left, this.top)
            }
            h = new fabric.Point(e.x, e.y);
            if (this.angle) {
                h = fabric.util.rotatePoint(h, d, -a(this.angle))
            }
            return h.subtractEquals(i)
        },
        setPositionByOrigin: function(h, g, f) {
            var e = this.translateToCenterPoint(h, g, f),
                d = this.translateToOriginPoint(e, this.originX, this.originY);
            this.set("left", d.x);
            this.set("top", d.y)
        },
        adjustPosition: function(j) {
            var i = a(this.angle),
                g = this.getWidth(),
                f = Math.cos(i) * g,
                d = Math.sin(i) * g,
                h, e;
            if (typeof this.originX === "string") {
                h = c[this.originX]
            } else {
                h = this.originX - 0.5
            }
            if (typeof j === "string") {
                e = c[j]
            } else {
                e = j - 0.5
            }
            this.left += f * (e - h);
            this.top += d * (e - h);
            this.setCoords();
            this.originX = j
        },
        _setOriginToCenter: function() {
            this._originalOriginX = this.originX;
            this._originalOriginY = this.originY;
            var d = this.getCenterPoint();
            this.originX = "center";
            this.originY = "center";
            this.left = d.x;
            this.top = d.y
        },
        _resetOrigin: function() {
            var d = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
            this.originX = this._originalOriginX;
            this.originY = this._originalOriginY;
            this.left = d.x;
            this.top = d.y;
            this._originalOriginX = null;
            this._originalOriginY = null
        },
        _getLeftTopCoords: function() {
            return this.translateToOriginPoint(this.getCenterPoint(), "left", "top")
        }
    })
})();
(function() {
    function c(d) {
        return [new fabric.Point(d.tl.x, d.tl.y), new fabric.Point(d.tr.x, d.tr.y), new fabric.Point(d.br.x, d.br.y), new fabric.Point(d.bl.x, d.bl.y)]
    }
    var a = fabric.util.degreesToRadians,
        b = fabric.util.multiplyTransformMatrices;
    fabric.util.object.extend(fabric.Object.prototype, {
        oCoords: null,
        aCoords: null,
        getCoords: function(f, d) {
            if (!this.oCoords) {
                this.setCoords()
            }
            var e = f ? this.aCoords : this.oCoords;
            return c(d ? this.calcCoords(f) : e)
        },
        intersectsWithRect: function(d, f, i, e) {
            var g = this.getCoords(i, e),
                h = fabric.Intersection.intersectPolygonRectangle(g, d, f);
            return h.status === "Intersection"
        },
        intersectsWithObject: function(d, g, e) {
            var f = fabric.Intersection.intersectPolygonPolygon(this.getCoords(g, e), d.getCoords(g, e));
            return f.status === "Intersection" || d.isContainedWithinObject(this, g, e) || this.isContainedWithinObject(d, g, e)
        },
        isContainedWithinObject: function(d, j, g) {
            var h = this.getCoords(j, g),
                f = 0,
                e = d._getImageLines(g ? d.calcCoords(j) : j ? d.aCoords : d.oCoords);
            for (; f < 4; f++) {
                if (!d.containsPoint(h[f], e)) {
                    return false
                }
            }
            return true
        },
        isContainedWithinRect: function(d, g, h, f) {
            var e = this.getBoundingRect(h, f);
            return (e.left >= d.x && e.left + e.width <= g.x && e.top >= d.y && e.top + e.height <= g.y)
        },
        containsPoint: function(d, f, h, g) {
            var f = f || this._getImageLines(g ? this.calcCoords(h) : h ? this.aCoords : this.oCoords),
                e = this._findCrossPoints(d, f);
            return (e !== 0 && e % 2 === 1)
        },
        isOnScreen: function(h) {
            if (!this.canvas) {
                return false
            }
            var e = this.canvas.vptCoords.tl,
                g = this.canvas.vptCoords.br;
            var j = this.getCoords(true, h),
                d;
            for (var f = 0; f < 4; f++) {
                d = j[f];
                if (d.x <= g.x && d.x >= e.x && d.y <= g.y && d.y >= e.y) {
                    return true
                }
            }
            return false
        },
        _getImageLines: function(d) {
            return {
                topline: {
                    o: d.tl,
                    d: d.tr
                },
                rightline: {
                    o: d.tr,
                    d: d.br
                },
                bottomline: {
                    o: d.br,
                    d: d.bl
                },
                leftline: {
                    o: d.bl,
                    d: d.tl
                }
            }
        },
        _findCrossPoints: function(k, m) {
            var j, i, e, d, h, g = 0,
                f;
            for (var l in m) {
                f = m[l];
                if ((f.o.y < k.y) && (f.d.y < k.y)) {
                    continue
                }
                if ((f.o.y >= k.y) && (f.d.y >= k.y)) {
                    continue
                }
                if ((f.o.x === f.d.x) && (f.o.x >= k.x)) {
                    h = f.o.x
                } else {
                    j = 0;
                    i = (f.d.y - f.o.y) / (f.d.x - f.o.x);
                    e = k.y - j * k.x;
                    d = f.o.y - i * f.o.x;
                    h = -(e - d) / (j - i)
                }
                if (h >= k.x) {
                    g += 1
                }
                if (g === 2) {
                    break
                }
            }
            return g
        },
        getBoundingRectWidth: function() {
            return this.getBoundingRect().width
        },
        getBoundingRectHeight: function() {
            return this.getBoundingRect().height
        },
        getBoundingRect: function(f, d) {
            var e = this.getCoords(f, d);
            return fabric.util.makeBoundingBoxFromPoints(e)
        },
        getWidth: function() {
            return this._getTransformedDimensions().x
        },
        getHeight: function() {
            return this._getTransformedDimensions().y
        },
        _constrainScale: function(d) {
            if (Math.abs(d) < this.minScaleLimit) {
                if (d < 0) {
                    return -this.minScaleLimit
                } else {
                    return this.minScaleLimit
                }
            }
            return d
        },
        scale: function(d) {
            d = this._constrainScale(d);
            if (d < 0) {
                this.flipX = !this.flipX;
                this.flipY = !this.flipY;
                d *= -1
            }
            this.scaleX = d;
            this.scaleY = d;
            return this.setCoords()
        },
        scaleToWidth: function(e) {
            var d = this.getBoundingRect().width / this.getWidth();
            return this.scale(e / this.width / d)
        },
        scaleToHeight: function(e) {
            var d = this.getBoundingRect().height / this.getHeight();
            return this.scale(e / this.height / d)
        },
        calcCoords: function(w) {
            var j = a(this.angle),
                z = this.getViewportTransform(),
                q = w ? this._getTransformedDimensions() : this._calculateCurrentDimensions(),
                l = q.x,
                g = q.y,
                t = Math.sin(j),
                n = Math.cos(j),
                k = l > 0 ? Math.atan(g / l) : 0,
                m = (l / Math.cos(k)) / 2,
                v = Math.cos(k + j) * m,
                u = Math.sin(k + j) * m,
                x = this.getCenterPoint(),
                r = w ? x : fabric.util.transformPoint(x, z),
                h = new fabric.Point(r.x - v, r.y - u),
                e = new fabric.Point(h.x + (l * n), h.y + (l * t)),
                f = new fabric.Point(h.x - (g * t), h.y + (g * n)),
                y = new fabric.Point(r.x + v, r.y + u);
            if (!w) {
                var s = new fabric.Point((h.x + f.x) / 2, (h.y + f.y) / 2),
                    o = new fabric.Point((e.x + h.x) / 2, (e.y + h.y) / 2),
                    p = new fabric.Point((y.x + e.x) / 2, (y.y + e.y) / 2),
                    d = new fabric.Point((y.x + f.x) / 2, (y.y + f.y) / 2),
                    i = new fabric.Point(o.x + t * this.rotatingPointOffset, o.y - n * this.rotatingPointOffset)
            }
            var r = {
                tl: h,
                tr: e,
                br: y,
                bl: f,
            };
            if (!w) {
                r.ml = s;
                r.mt = o;
                r.mr = p;
                r.mb = d;
                r.mtr = i
            }
            return r
        },
        setCoords: function(e, d) {
            this.oCoords = this.calcCoords(e);
            if (!d) {
                this.aCoords = this.calcCoords(true)
            }
            e || (this._setCornerCoords && this._setCornerCoords());
            return this
        },
        _calcRotateMatrix: function() {
            if (this.angle) {
                var e = a(this.angle),
                    f = Math.cos(e),
                    d = Math.sin(e);
                return [f, d, -d, f, 0, 0]
            }
            return fabric.iMatrix.concat()
        },
        calcTransformMatrix: function(g) {
            var d = this.getCenterPoint(),
                h = [1, 0, 0, 1, d.x, d.y],
                i = this._calcRotateMatrix(),
                e = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, true),
                f = this.group && !g ? this.group.calcTransformMatrix() : fabric.iMatrix.concat();
            f = b(f, h);
            f = b(f, i);
            f = b(f, e);
            return f
        },
        _calcDimensionsTransformMatrix: function(i, h, g) {
            var e = [1, 0, Math.tan(a(i)), 1],
                d = [1, Math.tan(a(h)), 0, 1],
                l = this.scaleX * (g && this.flipX ? -1 : 1),
                j = this.scaleY * (g && this.flipY ? -1 : 1),
                k = [l, 0, 0, j],
                f = b(k, e, true);
            return b(f, d, true)
        },
        _getNonTransformedDimensions: function() {
            var f = this.strokeWidth,
                d = this.width + f,
                e = this.height + f;
            return {
                x: d,
                y: e
            }
        },
        _getTransformedDimensions: function(h, g) {
            if (typeof h === "undefined") {
                h = this.skewX
            }
            if (typeof g === "undefined") {
                g = this.skewY
            }
            var d = this._getNonTransformedDimensions(),
                m = d.x / 2,
                l = d.y / 2,
                j = [{
                    x: -m,
                    y: -l
                }, {
                    x: m,
                    y: -l
                }, {
                    x: -m,
                    y: l
                }, {
                    x: m,
                    y: l
                }],
                f, e = this._calcDimensionsTransformMatrix(h, g, false),
                k;
            for (f = 0; f < j.length; f++) {
                j[f] = fabric.util.transformPoint(j[f], e)
            }
            k = fabric.util.makeBoundingBoxFromPoints(j);
            return {
                x: k.width,
                y: k.height
            }
        },
        _calculateCurrentDimensions: function() {
            var f = this.getViewportTransform(),
                e = this._getTransformedDimensions(),
                d = fabric.util.transformPoint(e, f, true);
            return d.scalarAdd(2 * this.padding)
        },
    })
})();
fabric.util.object.extend(fabric.Object.prototype, {
    sendToBack: function() {
        if (this.group) {
            fabric.StaticCanvas.prototype.sendToBack.call(this.group, this)
        } else {
            this.canvas.sendToBack(this)
        }
        return this
    },
    bringToFront: function() {
        if (this.group) {
            fabric.StaticCanvas.prototype.bringToFront.call(this.group, this)
        } else {
            this.canvas.bringToFront(this)
        }
        return this
    },
    sendBackwards: function(a) {
        if (this.group) {
            fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, a)
        } else {
            this.canvas.sendBackwards(this, a)
        }
        return this
    },
    bringForward: function(a) {
        if (this.group) {
            fabric.StaticCanvas.prototype.bringForward.call(this.group, this, a)
        } else {
            this.canvas.bringForward(this, a)
        }
        return this
    },
    moveTo: function(a) {
        if (this.group) {
            fabric.StaticCanvas.prototype.moveTo.call(this.group, this, a)
        } else {
            this.canvas.moveTo(this, a)
        }
        return this
    }
});
(function() {
    function a(f, d) {
        if (!d) {
            return f + ": none; "
        } else {
            if (d.toLive) {
                return f + ": url(#SVGID_" + d.id + "); "
            } else {
                var b = new fabric.Color(d),
                    e = f + ": " + b.toRgb() + "; ",
                    c = b.getAlpha();
                if (c !== 1) {
                    e += f + "-opacity: " + c.toString() + "; "
                }
                return e
            }
        }
    }
    fabric.util.object.extend(fabric.Object.prototype, {
        getSvgStyles: function(h) {
            var e = this.fillRule,
                j = this.strokeWidth ? this.strokeWidth : "0",
                i = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none",
                m = this.strokeLineCap ? this.strokeLineCap : "butt",
                f = this.strokeLineJoin ? this.strokeLineJoin : "miter",
                d = this.strokeMiterLimit ? this.strokeMiterLimit : "4",
                g = typeof this.opacity !== "undefined" ? this.opacity : "1",
                b = this.visible ? "" : " visibility: hidden;",
                c = h ? "" : this.getSvgFilter(),
                l = a("fill", this.fill),
                k = a("stroke", this.stroke);
            return [k, "stroke-width: ", j, "; ", "stroke-dasharray: ", i, "; ", "stroke-linecap: ", m, "; ", "stroke-linejoin: ", f, "; ", "stroke-miterlimit: ", d, "; ", l, "fill-rule: ", e, "; ", "opacity: ", g, ";", c, b].join("")
        },
        getSvgFilter: function() {
            return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : ""
        },
        getSvgId: function() {
            return this.id ? 'id="' + this.id + '" ' : ""
        },
        getSvgTransform: function() {
            if (this.group && this.group.type === "path-group") {
                return ""
            }
            var c = fabric.util.toFixed,
                f = this.getAngle(),
                m = (this.getSkewX() % 360),
                l = (this.getSkewY() % 360),
                b = this.getCenterPoint(),
                p = fabric.Object.NUM_FRACTION_DIGITS,
                g = this.type === "path-group" ? "" : "translate(" + c(b.x, p) + " " + c(b.y, p) + ")",
                o = f !== 0 ? (" rotate(" + c(f, p) + ")") : "",
                h = (this.scaleX === 1 && this.scaleY === 1) ? "" : (" scale(" + c(this.scaleX, p) + " " + c(this.scaleY, p) + ")"),
                j = m !== 0 ? " skewX(" + c(m, p) + ")" : "",
                i = l !== 0 ? " skewY(" + c(l, p) + ")" : "",
                e = this.type === "path-group" ? this.width : 0,
                n = this.flipX ? " matrix(-1 0 0 1 " + e + " 0) " : "",
                d = this.type === "path-group" ? this.height : 0,
                k = this.flipY ? " matrix(1 0 0 -1 0 " + d + ")" : "";
            return [g, o, h, n, k, j, i].join("")
        },
        getSvgTransformMatrix: function() {
            return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ") " : ""
        },
        _createBaseSVGMarkup: function() {
            var b = [];
            if (this.fill && this.fill.toLive) {
                b.push(this.fill.toSVG(this, false))
            }
            if (this.stroke && this.stroke.toLive) {
                b.push(this.stroke.toSVG(this, false))
            }
            if (this.shadow) {
                b.push(this.shadow.toSVG(this))
            }
            return b
        }
    })
})();
(function() {
    var d = fabric.util.object.extend,
        a = "stateProperties";

    function c(g, e, h) {
        var i = {},
            f = true;
        h.forEach(function(j) {
            i[j] = g[j]
        });
        d(g[e], i, f)
    }

    function b(f, j, k) {
        if (!fabric.isLikelyNode && f instanceof Element) {
            return f === j
        } else {
            if (f instanceof Array) {
                if (f.length !== j.length) {
                    return false
                }
                for (var h = 0, e = f.length; h < e; h++) {
                    if (f[h] !== j[h]) {
                        return false
                    }
                }
                return true
            } else {
                if (f && typeof f === "object") {
                    if (!k && Object.keys(f).length !== Object.keys(j).length) {
                        return false
                    }
                    for (var g in f) {
                        if (!b(f[g], j[g])) {
                            return false
                        }
                    }
                    return true
                } else {
                    return f === j
                }
            }
        }
    }
    fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function(e) {
            e = e || a;
            e = "_" + e;
            return !b(this[e], this, true)
        },
        saveState: function(g) {
            var f = g && g.propertySet || a,
                e = "_" + f;
            if (!this[e]) {
                return this.setupState(g)
            }
            c(this, e, this[f]);
            if (g && g.stateProperties) {
                c(this, e, g.stateProperties)
            }
            return this
        },
        setupState: function(f) {
            f = f || {};
            var e = f.propertySet || a;
            f.propertySet = e;
            this["_" + e] = {};
            this.saveState(f);
            return this
        }
    })
})();
(function() {
    var a = fabric.util.degreesToRadians,
        b = function() {
            return typeof G_vmlCanvasManager !== "undefined"
        };
    fabric.util.object.extend(fabric.Object.prototype, {
        _controlsVisibility: null,
        _findTargetCorner: function(h) {
            if (!this.hasControls || !this.active) {
                return false
            }
            var g = h.x,
                e = h.y,
                d, c;
            this.__corner = 0;
            for (var f in this.oCoords) {
                if (!this.isControlVisible(f)) {
                    continue
                }
                if (f === "mtr" && !this.hasRotatingPoint) {
                    continue
                }
                if (this.get("lockUniScaling") && (f === "mt" || f === "mr" || f === "mb" || f === "ml")) {
                    continue
                }
                c = this._getImageLines(this.oCoords[f].corner);
                d = this._findCrossPoints({
                    x: g,
                    y: e
                }, c);
                if (d !== 0 && d % 2 === 1) {
                    this.__corner = f;
                    return f
                }
            }
            return false
        },
        _setCornerCoords: function() {
            var i = this.oCoords,
                g = a(45 - this.angle),
                h = this.cornerSize * 0.707106 * this.cornerHitTolerance,
                e = h * Math.cos(g),
                f = h * Math.sin(g),
                d, j;
            for (var c in i) {
                d = i[c].x;
                j = i[c].y;
                i[c].corner = {
                    tl: {
                        x: d - f,
                        y: j - e
                    },
                    tr: {
                        x: d + e,
                        y: j - f
                    },
                    bl: {
                        x: d - e,
                        y: j + f
                    },
                    br: {
                        x: d + f,
                        y: j + e
                    }
                }
            }
        },
        drawSelectionBackground: function(e) {
            if (!this.selectionBackgroundColor || this.group || !this.active) {
                return this
            }
            e.save();
            var c = this.getCenterPoint(),
                d = this._calculateCurrentDimensions(),
                f = this.canvas.viewportTransform;
            e.translate(c.x, c.y);
            e.scale(1 / f[0], 1 / f[3]);
            e.rotate(a(this.angle));
            e.fillStyle = this.selectionBackgroundColor;
            e.fillRect(-d.x / 2, -d.y / 2, d.x, d.y);
            e.restore();
            return this
        },
        drawBorders: function(e) {
            if (!this.hasBorders) {
                return this
            }
            var d = this._calculateCurrentDimensions(),
                h = 1 / this.borderScaleFactor,
                f = d.x + h,
                c = d.y + h;
            e.save();
            e.strokeStyle = this.borderColor;
            this._setLineDash(e, this.borderDashArray, null);
            e.strokeRect(-f / 2, -c / 2, f, c);
            if (this.hasRotatingPoint && this.isControlVisible("mtr") && !this.get("lockRotation") && this.hasControls) {
                var g = -c / 2;
                e.beginPath();
                e.moveTo(0, g);
                e.lineTo(0, g - this.rotatingPointOffset);
                e.closePath();
                e.stroke()
            }
            e.restore();
            return this
        },
        drawBordersInGroup: function(e, g) {
            if (!this.hasBorders) {
                return this
            }
            var i = this._getNonTransformedDimensions(),
                f = fabric.util.customTransformMatrix(g.scaleX, g.scaleY, g.skewX),
                d = fabric.util.transformPoint(i, f),
                j = 1 / this.borderScaleFactor,
                h = d.x + j,
                c = d.y + j;
            e.save();
            this._setLineDash(e, this.borderDashArray, null);
            e.strokeStyle = this.borderColor;
            e.strokeRect(-h / 2, -c / 2, h, c);
            e.restore();
            return this
        },
        drawControls: function(f) {
            if (!this.hasControls) {
                return this
            }
            var e = this._calculateCurrentDimensions(),
                h = e.x,
                d = e.y,
                c = this.cornerSize,
                j = -(h + c) / 2,
                i = -(d + c) / 2,
                g = this.transparentCorners ? "stroke" : "fill";
            f.save();
            f.strokeStyle = f.fillStyle = this.cornerColor;
            if (!this.transparentCorners) {
                f.strokeStyle = this.cornerStrokeColor
            }
            this._setLineDash(f, this.cornerDashArray, null);
            this._drawControl("tl", f, g, j, i);
            this._drawControl("tr", f, g, j + h, i);
            this._drawControl("bl", f, g, j, i + d);
            this._drawControl("br", f, g, j + h, i + d);
            if (!this.get("lockUniScaling")) {
                this._drawControl("mt", f, g, j + h / 2, i);
                this._drawControl("mb", f, g, j + h / 2, i + d);
                this._drawControl("mr", f, g, j + h, i + d / 2);
                this._drawControl("ml", f, g, j, i + d / 2)
            }
            if (this.hasRotatingPoint) {
                this._drawControl("mtr", f, g, j + h / 2, i - this.rotatingPointOffset)
            }
            f.restore();
            return this
        },
        _drawControl: function(i, c, d, h, g) {
            if (!this.isControlVisible(i)) {
                return
            }
            var e = this.cornerSize,
                f = !this.transparentCorners && this.cornerStrokeColor;
            switch (this.cornerStyle) {
                case "circle":
                    c.beginPath();
                    c.arc(h + e / 2, g + e / 2, e / 2, 0, 2 * Math.PI, false);
                    c[d]();
                    if (f) {
                        c.stroke()
                    }
                    break;
                default:
                    b() || this.transparentCorners || c.clearRect(h, g, e, e);
                    c[d + "Rect"](h, g, e, e);
                    if (f) {
                        c.strokeRect(h, g, e, e)
                    }
            }
        },
        isControlVisible: function(c) {
            return this._getControlsVisibility()[c]
        },
        setControlVisible: function(c, d) {
            this._getControlsVisibility()[c] = d;
            return this
        },
        setControlsVisibility: function(c) {
            c || (c = {});
            for (var d in c) {
                this.setControlVisible(d, c[d])
            }
            return this
        },
        _getControlsVisibility: function() {
            if (!this._controlsVisibility) {
                this._controlsVisibility = {
                    tl: true,
                    tr: true,
                    br: true,
                    bl: true,
                    ml: true,
                    mt: true,
                    mr: true,
                    mb: true,
                    mtr: true
                }
            }
            return this._controlsVisibility
        }
    })
})();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    FX_DURATION: 500,
    fxCenterObjectH: function(b, c) {
        c = c || {};
        var d = function() {},
            e = c.onComplete || d,
            a = c.onChange || d,
            f = this;
        fabric.util.animate({
            startValue: b.get("left"),
            endValue: this.getCenter().left,
            duration: this.FX_DURATION,
            onChange: function(g) {
                b.set("left", g);
                f.renderAll();
                a()
            },
            onComplete: function() {
                b.setCoords();
                e()
            }
        });
        return this
    },
    fxCenterObjectV: function(b, c) {
        c = c || {};
        var d = function() {},
            e = c.onComplete || d,
            a = c.onChange || d,
            f = this;
        fabric.util.animate({
            startValue: b.get("top"),
            endValue: this.getCenter().top,
            duration: this.FX_DURATION,
            onChange: function(g) {
                b.set("top", g);
                f.renderAll();
                a()
            },
            onComplete: function() {
                b.setCoords();
                e()
            }
        });
        return this
    },
    fxRemove: function(b, c) {
        c = c || {};
        var d = function() {},
            e = c.onComplete || d,
            a = c.onChange || d,
            f = this;
        fabric.util.animate({
            startValue: b.get("opacity"),
            endValue: 0,
            duration: this.FX_DURATION,
            onStart: function() {
                b.set("active", false)
            },
            onChange: function(g) {
                b.set("opacity", g);
                f.renderAll();
                a()
            },
            onComplete: function() {
                f.remove(b);
                e()
            }
        });
        return this
    }
});
fabric.util.object.extend(fabric.Object.prototype, {
    animate: function() {
        if (arguments[0] && typeof arguments[0] === "object") {
            var e = [],
                d, b;
            for (d in arguments[0]) {
                e.push(d)
            }
            for (var c = 0, a = e.length; c < a; c++) {
                d = e[c];
                b = c !== a - 1;
                this._animate(d, arguments[0][d], arguments[1], b)
            }
        } else {
            this._animate.apply(this, arguments)
        }
        return this
    },
    _animate: function(e, g, c, a) {
        var f = this,
            b;
        g = g.toString();
        if (!c) {
            c = {}
        } else {
            c = fabric.util.object.clone(c)
        }
        if (~e.indexOf(".")) {
            b = e.split(".")
        }
        var d = b ? this.get(b[0])[b[1]] : this.get(e);
        if (!("from" in c)) {
            c.from = d
        }
        if (~g.indexOf("=")) {
            g = d + parseFloat(g.replace("=", ""))
        } else {
            g = parseFloat(g)
        }
        fabric.util.animate({
            startValue: c.from,
            endValue: g,
            byValue: c.by,
            easing: c.easing,
            duration: c.duration,
            abort: c.abort && function() {
                return c.abort.call(f)
            },
            onChange: function(h) {
                if (b) {
                    f[b[0]][b[1]] = h
                } else {
                    f.set(e, h)
                }
                if (a) {
                    return
                }
                c.onChange && c.onChange()
            },
            onComplete: function() {
                if (a) {
                    return
                }
                f.setCoords();
                c.onComplete && c.onComplete()
            }
        })
    }
});
(function(c) {
    var d = c.fabric || (c.fabric = {}),
        h = d.util.object.extend,
        g = d.util.object.clone,
        a = {
            x1: 1,
            x2: 1,
            y1: 1,
            y2: 1
        },
        e = d.StaticCanvas.supports("setLineDash");
    if (d.Line) {
        d.warn("fabric.Line is already defined");
        return
    }
    var b = d.Object.prototype.cacheProperties.concat();
    b.push("x1", "x2", "y1", "y2");
    d.Line = d.util.createClass(d.Object, {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        cacheProperties: b,
        initialize: function(j, i) {
            if (!j) {
                j = [0, 0, 0, 0]
            }
            this.callSuper("initialize", i);
            this.set("x1", j[0]);
            this.set("y1", j[1]);
            this.set("x2", j[2]);
            this.set("y2", j[3]);
            this._setWidthHeight(i)
        },
        _setWidthHeight: function(i) {
            i || (i = {});
            this.width = Math.abs(this.x2 - this.x1);
            this.height = Math.abs(this.y2 - this.y1);
            this.left = "left" in i ? i.left : this._getLeftToOriginX();
            this.top = "top" in i ? i.top : this._getTopToOriginY()
        },
        _set: function(i, j) {
            this.callSuper("_set", i, j);
            if (typeof a[i] !== "undefined") {
                this._setWidthHeight()
            }
            return this
        },
        _getLeftToOriginX: f({
            origin: "originX",
            axis1: "x1",
            axis2: "x2",
            dimension: "width"
        }, {
            nearest: "left",
            center: "center",
            farthest: "right"
        }),
        _getTopToOriginY: f({
            origin: "originY",
            axis1: "y1",
            axis2: "y2",
            dimension: "height"
        }, {
            nearest: "top",
            center: "center",
            farthest: "bottom"
        }),
        _render: function(i, l) {
            i.beginPath();
            if (l) {
                var k = this.getCenterPoint();
                i.translate(k.x - this.strokeWidth / 2, k.y - this.strokeWidth / 2)
            }
            if (!this.strokeDashArray || this.strokeDashArray && e) {
                var j = this.calcLinePoints();
                i.moveTo(j.x1, j.y1);
                i.lineTo(j.x2, j.y2)
            }
            i.lineWidth = this.strokeWidth;
            var m = i.strokeStyle;
            i.strokeStyle = this.stroke || i.fillStyle;
            this.stroke && this._renderStroke(i);
            i.strokeStyle = m
        },
        _renderDashedStroke: function(i) {
            var j = this.calcLinePoints();
            i.beginPath();
            d.util.drawDashedLine(i, j.x1, j.y1, j.x2, j.y2, this.strokeDashArray);
            i.closePath()
        },
        toObject: function(i) {
            return h(this.callSuper("toObject", i), this.calcLinePoints())
        },
        _getNonTransformedDimensions: function() {
            var i = this.callSuper("_getNonTransformedDimensions");
            if (this.strokeLineCap === "butt") {
                if (i.x === 0) {
                    i.y -= this.strokeWidth
                }
                if (i.y === 0) {
                    i.x -= this.strokeWidth
                }
            }
            return i
        },
        calcLinePoints: function() {
            var n = this.x1 <= this.x2 ? -1 : 1,
                m = this.y1 <= this.y2 ? -1 : 1,
                j = (n * this.width * 0.5),
                l = (m * this.height * 0.5),
                i = (n * this.width * -0.5),
                k = (m * this.height * -0.5);
            return {
                x1: j,
                x2: i,
                y1: l,
                y2: k
            }
        },
        toSVG: function(i) {
            var j = this._createBaseSVGMarkup(),
                k = {
                    x1: this.x1,
                    x2: this.x2,
                    y1: this.y1,
                    y2: this.y2
                };
            if (!(this.group && this.group.type === "path-group")) {
                k = this.calcLinePoints()
            }
            j.push("<line ", this.getSvgId(), 'x1="', k.x1, '" y1="', k.y1, '" x2="', k.x2, '" y2="', k.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return i ? i(j.join(""), this) : j.join("")
        },
    });
    d.Line.ATTRIBUTE_NAMES = d.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" "));
    d.Line.fromElement = function(j, i) {
        i = i || {};
        var l = d.parseAttributes(j, d.Line.ATTRIBUTE_NAMES),
            k = [l.x1 || 0, l.y1 || 0, l.x2 || 0, l.y2 || 0];
        i.originX = "left";
        i.originY = "top";
        return new d.Line(k, h(l, i))
    };
    d.Line.fromObject = function(m, n, l) {
        function i(o) {
            delete o.points;
            n && n(o)
        }
        var k = g(m, true);
        k.points = [m.x1, m.y1, m.x2, m.y2];
        var j = d.Object._fromObject("Line", k, i, l, "points");
        if (j) {
            delete j.points
        }
        return j
    };

    function f(j, o) {
        var m = j.origin,
            p = j.axis1,
            n = j.axis2,
            l = j.dimension,
            k = o.nearest,
            i = o.center,
            q = o.farthest;
        return function() {
            switch (this.get(m)) {
                case k:
                    return Math.min(this.get(p), this.get(n));
                case i:
                    return Math.min(this.get(p), this.get(n)) + (0.5 * this.get(l));
                case q:
                    return Math.max(this.get(p), this.get(n))
            }
        }
    }
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = Math.PI,
        f = c.util.object.extend;
    if (c.Circle) {
        c.warn("fabric.Circle is already defined.");
        return
    }
    var a = c.Object.prototype.cacheProperties.concat();
    a.push("radius");
    c.Circle = c.util.createClass(c.Object, {
        type: "circle",
        radius: 0,
        startAngle: 0,
        endAngle: e * 2,
        cacheProperties: a,
        initialize: function(g) {
            this.callSuper("initialize", g);
            this.set("radius", g && g.radius || 0)
        },
        _set: function(g, h) {
            this.callSuper("_set", g, h);
            if (g === "radius") {
                this.setRadius(h)
            }
            return this
        },
        toObject: function(g) {
            return this.callSuper("toObject", ["radius", "startAngle", "endAngle"].concat(g))
        },
        toSVG: function(l) {
            var q = this._createBaseSVGMarkup(),
                m = 0,
                k = 0,
                g = this.endAngle - this.startAngle,
                o = 0.0001;
            if (Math.abs(g) >= (2 * e) - o) {
                if (this.group && this.group.type === "path-group") {
                    m = this.left + this.radius;
                    k = this.top + this.radius
                }
                q.push("<circle ", this.getSvgId(), 'cx="' + m + '" cy="' + k + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n')
            } else {
                if (this.group && this.group.type === "path-group") {
                    m = this.left + this.radius;
                    k = this.top + this.radius
                }
                var j = Math.cos(this.startAngle) * this.radius + m,
                    i = Math.sin(this.startAngle) * this.radius + k,
                    p = Math.cos(this.endAngle) * this.radius + m,
                    n = Math.sin(this.endAngle) * this.radius + k,
                    h = Math.abs(g),
                    r = h > e ? "1" : "0";
                q.push('<path d="M ' + j + " " + i, " A " + this.radius + " " + this.radius, " 0 ", +r + " 1", " " + p + " " + n, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n')
            }
            return l ? l(q.join(""), this) : q.join("")
        },
        _render: function(g, h) {
            g.beginPath();
            g.arc(h ? this.left + this.radius : 0, h ? this.top + this.radius : 0, this.radius, this.startAngle, this.endAngle, false);
            this._renderFill(g);
            this._renderStroke(g)
        },
        getRadiusX: function() {
            return this.get("radius") * this.get("scaleX")
        },
        getRadiusY: function() {
            return this.get("radius") * this.get("scaleY")
        },
        setRadius: function(g) {
            this.radius = g;
            return this.set("width", g * 2).set("height", g * 2)
        },
    });
    c.Circle.ATTRIBUTE_NAMES = c.SHARED_ATTRIBUTES.concat("cx cy r".split(" "));
    c.Circle.fromElement = function(h, g) {
        g || (g = {});
        var i = c.parseAttributes(h, c.Circle.ATTRIBUTE_NAMES);
        if (!d(i)) {
            throw new Error("value of `r` attribute is required and can not be negative")
        }
        i.left = i.left || 0;
        i.top = i.top || 0;
        var j = new c.Circle(f(i, g));
        j.left -= j.radius;
        j.top -= j.radius;
        return j
    };

    function d(g) {
        return (("radius" in g) && (g.radius >= 0))
    }
    c.Circle.fromObject = function(h, i, g) {
        return c.Object._fromObject("Circle", h, i, g)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(a) {
    var b = a.fabric || (a.fabric = {});
    if (b.Triangle) {
        b.warn("fabric.Triangle is already defined");
        return
    }
    b.Triangle = b.util.createClass(b.Object, {
        type: "triangle",
        initialize: function(c) {
            this.callSuper("initialize", c);
            this.set("width", c && c.width || 100).set("height", c && c.height || 100)
        },
        _render: function(c) {
            var d = this.width / 2,
                e = this.height / 2;
            c.beginPath();
            c.moveTo(-d, e);
            c.lineTo(0, -e);
            c.lineTo(d, e);
            c.closePath();
            this._renderFill(c);
            this._renderStroke(c)
        },
        _renderDashedStroke: function(c) {
            var d = this.width / 2,
                e = this.height / 2;
            c.beginPath();
            b.util.drawDashedLine(c, -d, e, 0, -e, this.strokeDashArray);
            b.util.drawDashedLine(c, 0, -e, d, e, this.strokeDashArray);
            b.util.drawDashedLine(c, d, e, -d, e, this.strokeDashArray);
            c.closePath()
        },
        toSVG: function(c) {
            var d = this._createBaseSVGMarkup(),
                e = this.width / 2,
                f = this.height / 2,
                g = [-e + " " + f, "0 " + -f, e + " " + f].join(",");
            d.push("<polygon ", this.getSvgId(), 'points="', g, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>');
            return c ? c(d.join(""), this) : d.join("")
        },
    });
    b.Triangle.fromObject = function(d, e, c) {
        return b.Object._fromObject("Triangle", d, e, c)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        d = Math.PI * 2,
        e = c.util.object.extend;
    if (c.Ellipse) {
        c.warn("fabric.Ellipse is already defined.");
        return
    }
    var a = c.Object.prototype.cacheProperties.concat();
    a.push("rx", "ry");
    c.Ellipse = c.util.createClass(c.Object, {
        type: "ellipse",
        rx: 0,
        ry: 0,
        cacheProperties: a,
        initialize: function(f) {
            this.callSuper("initialize", f);
            this.set("rx", f && f.rx || 0);
            this.set("ry", f && f.ry || 0)
        },
        _set: function(f, g) {
            this.callSuper("_set", f, g);
            switch (f) {
                case "rx":
                    this.rx = g;
                    this.set("width", g * 2);
                    break;
                case "ry":
                    this.ry = g;
                    this.set("height", g * 2);
                    break
            }
            return this
        },
        getRx: function() {
            return this.get("rx") * this.get("scaleX")
        },
        getRy: function() {
            return this.get("ry") * this.get("scaleY")
        },
        toObject: function(f) {
            return this.callSuper("toObject", ["rx", "ry"].concat(f))
        },
        toSVG: function(g) {
            var h = this._createBaseSVGMarkup(),
                f = 0,
                i = 0;
            if (this.group && this.group.type === "path-group") {
                f = this.left + this.rx;
                i = this.top + this.ry
            }
            h.push("<ellipse ", this.getSvgId(), 'cx="', f, '" cy="', i, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return g ? g(h.join(""), this) : h.join("")
        },
        _render: function(f, g) {
            f.beginPath();
            f.save();
            f.transform(1, 0, 0, this.ry / this.rx, 0, 0);
            f.arc(g ? this.left + this.rx : 0, g ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, d, false);
            f.restore();
            this._renderFill(f);
            this._renderStroke(f)
        },
    });
    c.Ellipse.ATTRIBUTE_NAMES = c.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" "));
    c.Ellipse.fromElement = function(g, f) {
        f || (f = {});
        var i = c.parseAttributes(g, c.Ellipse.ATTRIBUTE_NAMES);
        i.left = i.left || 0;
        i.top = i.top || 0;
        var h = new c.Ellipse(e(i, f));
        h.top -= h.ry;
        h.left -= h.rx;
        return h
    };
    c.Ellipse.fromObject = function(g, h, f) {
        return c.Object._fromObject("Ellipse", g, h, f)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(a) {
    var b = a.fabric || (a.fabric = {}),
        d = b.util.object.extend;
    if (b.Rect) {
        b.warn("fabric.Rect is already defined");
        return
    }
    var c = b.Object.prototype.stateProperties.concat();
    c.push("rx", "ry");
    b.Rect = b.util.createClass(b.Object, {
        stateProperties: c,
        type: "rect",
        rx: 0,
        ry: 0,
        deviceStroke: false,
        deviceStrokeWidth: 1,
        strokeDashArray: null,
        initialize: function(e) {
            this.callSuper("initialize", e);
            this._initRxRy();
            if (this.deviceStroke) {
                this.objectCaching = false
            }
        },
        _initRxRy: function() {
            if (this.rx && !this.ry) {
                this.ry = this.rx
            } else {
                if (this.ry && !this.rx) {
                    this.rx = this.ry
                }
            }
        },
        _render: function(p, g) {
            if (this.deviceStroke) {
                this._renderDeviceStroke(p, g);
                return
            }
            if (this.width === 1 && this.height === 1) {
                p.fillRect(-0.5, -0.5, 1, 1);
                return
            }
            var f = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                e = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                o = this.width,
                j = this.height,
                n = g ? this.left : -this.width / 2,
                m = g ? this.top : -this.height / 2,
                l = f !== 0 || e !== 0,
                i = 1 - 0.5522847498;
            p.beginPath();
            p.moveTo(n + f, m);
            p.lineTo(n + o - f, m);
            l && p.bezierCurveTo(n + o - i * f, m, n + o, m + i * e, n + o, m + e);
            p.lineTo(n + o, m + j - e);
            l && p.bezierCurveTo(n + o, m + j - i * e, n + o - i * f, m + j, n + o - f, m + j);
            p.lineTo(n + f, m + j);
            l && p.bezierCurveTo(n + i * f, m + j, n, m + j - i * e, n, m + j - e);
            p.lineTo(n, m + e);
            l && p.bezierCurveTo(n, m + i * e, n + i * f, m, n + f, m);
            p.closePath();
            this._renderFill(p);
            this._renderStroke(p)
        },
        _renderDeviceStroke: function(n, i) {
            n.save();
            var h = this.canvas ? this.canvas.getRetinaScaling() : b.devicePixelRatio;
            if (this.canvas && this.canvas.targetFind) {
                h = 1
            }
            n.setTransform(h, 0, 0, h, 0, 0);
            n.save();
            var j = this.getViewportTransform(),
                l = this.calcTransformMatrix(),
                o;
            l = b.util.multiplyTransformMatrices(j, l);
            o = b.util.qrDecompose(l);
            n.translate(o.translateX, o.translateY);
            if (this.group) {
                n.rotate(o.angle * Math.PI / 180);
                var g = this._getNonTransformedDimensions(),
                    l = b.util.customTransformMatrix(o.scaleX, o.scaleY, o.skewX),
                    e = b.util.transformPoint(g, l),
                    f = e.x,
                    m = e.y;
                n.beginPath();
                n.rect(-f / 2, -m / 2, f, m);
                n.closePath();
                n.restore()
            } else {
                n.rotate(this.angle * Math.PI / 180);
                var e = this._calculateCurrentDimensions(),
                    k = 1 / this.borderScaleFactor,
                    f = e.x,
                    m = e.y;
                n.beginPath();
                n.rect(-f / 2, -m / 2, f, m);
                n.closePath();
                n.restore()
            }
            n.lineWidth = this.deviceStrokeWidth;
            this._setLineDash(n, this.strokeDashArray);
            if (this.stroke) {
                n.stroke()
            }
            n.restore();
            return this
        },
        _renderDashedStroke: function(g) {
            var e = -this.width / 2,
                j = -this.height / 2,
                f = this.width,
                i = this.height;
            g.beginPath();
            b.util.drawDashedLine(g, e, j, e + f, j, this.strokeDashArray);
            b.util.drawDashedLine(g, e + f, j, e + f, j + i, this.strokeDashArray);
            b.util.drawDashedLine(g, e + f, j + i, e, j + i, this.strokeDashArray);
            b.util.drawDashedLine(g, e, j + i, e, j, this.strokeDashArray);
            g.closePath()
        },
        toObject: function(e) {
            return this.callSuper("toObject", ["rx", "ry", "deviceStroke", "deviceStrokeWidth"].concat(e))
        },
        toSVG: function(f) {
            var g = this._createBaseSVGMarkup(),
                e = this.left,
                h = this.top;
            if (!(this.group && this.group.type === "path-group")) {
                e = -this.width / 2;
                h = -this.height / 2
            }
            g.push("<rect ", this.getSvgId(), 'x="', e, '" y="', h, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n');
            return f ? f(g.join(""), this) : g.join("")
        },
    });
    b.Rect.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" "));
    b.Rect.fromElement = function(f, e) {
        if (!f) {
            return null
        }
        e = e || {};
        var h = b.parseAttributes(f, b.Rect.ATTRIBUTE_NAMES);
        h.left = h.left || 0;
        h.top = h.top || 0;
        var g = new b.Rect(d((e ? b.util.object.clone(e) : {}), h));
        g.visible = g.visible && g.width > 0 && g.height > 0;
        return g
    };
    b.Rect.fromObject = function(f, g, e) {
        return b.Object._fromObject("Rect", f, g, e)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(e) {
    var f = e.fabric || (e.fabric = {}),
        g = f.util.object.extend,
        c = f.util.array.min,
        b = f.util.array.max,
        a = f.util.toFixed;
    if (f.Polyline) {
        f.warn("fabric.Polyline is already defined");
        return
    }
    var d = f.Object.prototype.cacheProperties.concat();
    d.push("points");
    f.Polyline = f.util.createClass(f.Object, {
        type: "polyline",
        points: null,
        minX: 0,
        minY: 0,
        cacheProperties: d,
        initialize: function(i, h) {
            h = h || {};
            this.points = i || [];
            this.callSuper("initialize", h);
            this._calcDimensions();
            if (!("top" in h)) {
                this.top = this.minY
            }
            if (!("left" in h)) {
                this.left = this.minX
            }
            this.pathOffset = {
                x: this.minX + this.width / 2,
                y: this.minY + this.height / 2
            }
        },
        _calcDimensions: function() {
            var i = this.points,
                h = c(i, "x"),
                l = c(i, "y"),
                k = b(i, "x"),
                j = b(i, "y");
            this.width = (k - h) || 0;
            this.height = (j - l) || 0;
            this.minX = h || 0;
            this.minY = l || 0
        },
        toObject: function(h) {
            return g(this.callSuper("toObject", h), {
                points: this.points.concat()
            })
        },
        toSVG: function(j) {
            var n = [],
                l, k = this._createBaseSVGMarkup();
            for (var m = 0, h = this.points.length; m < h; m++) {
                n.push(a(this.points[m].x, 2), ",", a(this.points[m].y, 2), " ")
            }
            if (!(this.group && this.group.type === "path-group")) {
                l = " translate(" + (-this.pathOffset.x) + ", " + (-this.pathOffset.y) + ") "
            }
            k.push("<", this.type, " ", this.getSvgId(), 'points="', n.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), l, " ", this.getSvgTransformMatrix(), '"/>\n');
            return j ? j(k.join(""), this) : k.join("")
        },
        commonRender: function(l, n) {
            var k, j = this.points.length,
                h = n ? 0 : this.pathOffset.x,
                o = n ? 0 : this.pathOffset.y;
            if (!j || isNaN(this.points[j - 1].y)) {
                return false
            }
            l.beginPath();
            l.moveTo(this.points[0].x - h, this.points[0].y - o);
            for (var m = 0; m < j; m++) {
                k = this.points[m];
                l.lineTo(k.x - h, k.y - o)
            }
            return true
        },
        _render: function(h, i) {
            if (!this.commonRender(h, i)) {
                return
            }
            this._renderFill(h);
            this._renderStroke(h)
        },
        _renderDashedStroke: function(j) {
            var m, l;
            j.beginPath();
            for (var k = 0, h = this.points.length; k < h; k++) {
                m = this.points[k];
                l = this.points[k + 1] || m;
                f.util.drawDashedLine(j, m.x, m.y, l.x, l.y, this.strokeDashArray)
            }
        },
        complexity: function() {
            return this.get("points").length
        }
    });
    f.Polyline.ATTRIBUTE_NAMES = f.SHARED_ATTRIBUTES.concat();
    f.Polyline.fromElement = function(i, h) {
        if (!i) {
            return null
        }
        h || (h = {});
        var j = f.parsePointsAttribute(i.getAttribute("points")),
            k = f.parseAttributes(i, f.Polyline.ATTRIBUTE_NAMES);
        return new f.Polyline(j, f.util.object.extend(k, h))
    };
    f.Polyline.fromObject = function(i, j, h) {
        return f.Object._fromObject("Polyline", i, j, h, "points")
    }
})(typeof exports !== "undefined" ? exports : this);
(function(a) {
    var b = a.fabric || (a.fabric = {}),
        c = b.util.object.extend;
    if (b.Polygon) {
        b.warn("fabric.Polygon is already defined");
        return
    }
    b.Polygon = b.util.createClass(b.Polyline, {
        type: "polygon",
        _render: function(d, e) {
            if (!this.commonRender(d, e)) {
                return
            }
            d.closePath();
            this._renderFill(d);
            this._renderStroke(d)
        },
        _renderDashedStroke: function(d) {
            this.callSuper("_renderDashedStroke", d);
            d.closePath()
        },
    });
    b.Polygon.ATTRIBUTE_NAMES = b.SHARED_ATTRIBUTES.concat();
    b.Polygon.fromElement = function(e, d) {
        if (!e) {
            return null
        }
        d || (d = {});
        var f = b.parsePointsAttribute(e.getAttribute("points")),
            g = b.parseAttributes(e, b.Polygon.ATTRIBUTE_NAMES);
        return new b.Polygon(f, c(g, d))
    };
    b.Polygon.fromObject = function(e, f, d) {
        return b.Object._fromObject("Polygon", e, f, d, "points")
    }
})(typeof exports !== "undefined" ? exports : this);
(function(a) {
    var c = a.fabric || (a.fabric = {}),
        e = c.util.array.min,
        h = c.util.array.max,
        g = c.util.object.extend,
        b = Object.prototype.toString,
        i = c.util.drawArc,
        j = {
            m: 2,
            l: 2,
            h: 1,
            v: 1,
            c: 6,
            s: 4,
            q: 4,
            t: 2,
            a: 7
        },
        f = {
            m: "l",
            M: "L"
        };
    if (c.Path) {
        c.warn("fabric.Path is already defined");
        return
    }
    var d = c.Object.prototype.cacheProperties.concat();
    d.push("path");
    c.Path = c.util.createClass(c.Object, {
        type: "path",
        path: null,
        minX: 0,
        minY: 0,
        cacheProperties: d,
        initialize: function(m, l) {
            l = l || {};
            if (l) {
                this.setOptions(l)
            }
            if (!m) {
                m = []
            }
            var k = b.call(m) === "[object Array]";
            this.path = k ? m : m.match && m.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
            if (!this.path) {
                return
            }
            if (!k) {
                this.path = this._parsePath()
            }
            this._setPositionDimensions(l);
            if (l.sourcePath) {
                this.setSourcePath(l.sourcePath)
            }
            if (this.objectCaching) {
                this._createCacheCanvas();
                this.setupState({
                    propertySet: "cacheProperties"
                })
            }
        },
        _setPositionDimensions: function(l) {
            var k = this._parseDimensions();
            this.minX = k.left;
            this.minY = k.top;
            this.width = k.width;
            this.height = k.height;
            if (typeof l.left === "undefined") {
                this.left = k.left + (this.originX === "center" ? this.width / 2 : this.originX === "right" ? this.width : 0)
            }
            if (typeof l.top === "undefined") {
                this.top = k.top + (this.originY === "center" ? this.height / 2 : this.originY === "bottom" ? this.height : 0)
            }
            this.pathOffset = this.pathOffset || {
                x: this.minX + this.width / 2,
                y: this.minY + this.height / 2
            }
        },
        _renderPathCommands: function(A) {
            var s, q = null,
                C = 0,
                z = 0,
                v = 0,
                u = 0,
                k = 0,
                B = 0,
                p, o, m = -this.pathOffset.x,
                w = -this.pathOffset.y;
            if (this.group && this.group.type === "path-group") {
                m = 0;
                w = 0
            }
            A.beginPath();
            for (var n = 0, r = this.path.length; n < r; ++n) {
                s = this.path[n];
                switch (s[0]) {
                    case "l":
                        v += s[1];
                        u += s[2];
                        A.lineTo(v + m, u + w);
                        break;
                    case "L":
                        v = s[1];
                        u = s[2];
                        A.lineTo(v + m, u + w);
                        break;
                    case "h":
                        v += s[1];
                        A.lineTo(v + m, u + w);
                        break;
                    case "H":
                        v = s[1];
                        A.lineTo(v + m, u + w);
                        break;
                    case "v":
                        u += s[1];
                        A.lineTo(v + m, u + w);
                        break;
                    case "V":
                        u = s[1];
                        A.lineTo(v + m, u + w);
                        break;
                    case "m":
                        v += s[1];
                        u += s[2];
                        C = v;
                        z = u;
                        A.moveTo(v + m, u + w);
                        break;
                    case "M":
                        v = s[1];
                        u = s[2];
                        C = v;
                        z = u;
                        A.moveTo(v + m, u + w);
                        break;
                    case "c":
                        p = v + s[5];
                        o = u + s[6];
                        k = v + s[3];
                        B = u + s[4];
                        A.bezierCurveTo(v + s[1] + m, u + s[2] + w, k + m, B + w, p + m, o + w);
                        v = p;
                        u = o;
                        break;
                    case "C":
                        v = s[5];
                        u = s[6];
                        k = s[3];
                        B = s[4];
                        A.bezierCurveTo(s[1] + m, s[2] + w, k + m, B + w, v + m, u + w);
                        break;
                    case "s":
                        p = v + s[3];
                        o = u + s[4];
                        if (q[0].match(/[CcSs]/) === null) {
                            k = v;
                            B = u
                        } else {
                            k = 2 * v - k;
                            B = 2 * u - B
                        }
                        A.bezierCurveTo(k + m, B + w, v + s[1] + m, u + s[2] + w, p + m, o + w);
                        k = v + s[1];
                        B = u + s[2];
                        v = p;
                        u = o;
                        break;
                    case "S":
                        p = s[3];
                        o = s[4];
                        if (q[0].match(/[CcSs]/) === null) {
                            k = v;
                            B = u
                        } else {
                            k = 2 * v - k;
                            B = 2 * u - B
                        }
                        A.bezierCurveTo(k + m, B + w, s[1] + m, s[2] + w, p + m, o + w);
                        v = p;
                        u = o;
                        k = s[1];
                        B = s[2];
                        break;
                    case "q":
                        p = v + s[3];
                        o = u + s[4];
                        k = v + s[1];
                        B = u + s[2];
                        A.quadraticCurveTo(k + m, B + w, p + m, o + w);
                        v = p;
                        u = o;
                        break;
                    case "Q":
                        p = s[3];
                        o = s[4];
                        A.quadraticCurveTo(s[1] + m, s[2] + w, p + m, o + w);
                        v = p;
                        u = o;
                        k = s[1];
                        B = s[2];
                        break;
                    case "t":
                        p = v + s[1];
                        o = u + s[2];
                        if (q[0].match(/[QqTt]/) === null) {
                            k = v;
                            B = u
                        } else {
                            k = 2 * v - k;
                            B = 2 * u - B
                        }
                        A.quadraticCurveTo(k + m, B + w, p + m, o + w);
                        v = p;
                        u = o;
                        break;
                    case "T":
                        p = s[1];
                        o = s[2];
                        if (q[0].match(/[QqTt]/) === null) {
                            k = v;
                            B = u
                        } else {
                            k = 2 * v - k;
                            B = 2 * u - B
                        }
                        A.quadraticCurveTo(k + m, B + w, p + m, o + w);
                        v = p;
                        u = o;
                        break;
                    case "a":
                        i(A, v + m, u + w, [s[1], s[2], s[3], s[4], s[5], s[6] + v + m, s[7] + u + w]);
                        v += s[6];
                        u += s[7];
                        break;
                    case "A":
                        i(A, v + m, u + w, [s[1], s[2], s[3], s[4], s[5], s[6] + m, s[7] + w]);
                        v = s[6];
                        u = s[7];
                        break;
                    case "z":
                    case "Z":
                        v = C;
                        u = z;
                        A.closePath();
                        break
                }
                q = s
            }
        },
        _render: function(k) {
            this._renderPathCommands(k);
            this._renderFill(k);
            this._renderStroke(k)
        },
        toString: function() {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
        },
        toObject: function(l) {
            var k = g(this.callSuper("toObject", ["sourcePath", "pathOffset"].concat(l)), {
                path: this.path.map(function(m) {
                    return m.slice()
                }),
                top: this.top,
                left: this.left,
            });
            return k
        },
        toDatalessObject: function(l) {
            var k = this.toObject(l);
            if (this.sourcePath) {
                k.path = this.sourcePath
            }
            delete k.sourcePath;
            return k
        },
        toSVG: function(l) {
            var q = [],
                m = this._createBaseSVGMarkup(),
                n = "";
            for (var o = 0, k = this.path.length; o < k; o++) {
                q.push(this.path[o].join(" "))
            }
            var p = q.join(" ");
            if (!(this.group && this.group.type === "path-group")) {
                n = " translate(" + (-this.pathOffset.x) + ", " + (-this.pathOffset.y) + ") "
            }
            m.push("<path ", this.getSvgId(), 'd="', p, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), n, this.getSvgTransformMatrix(), '" stroke-linecap="round" ', "/>\n");
            return l ? l(m.join(""), this) : m.join("")
        },
        complexity: function() {
            return this.path.length
        },
        _parsePath: function() {
            var B = [],
                w = [],
                x, u, z = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig,
                r, l;
            for (var p = 0, v, s = this.path.length; p < s; p++) {
                x = this.path[p];
                l = x.slice(1).trim();
                w.length = 0;
                while ((r = z.exec(l))) {
                    w.push(r[0])
                }
                v = [x.charAt(0)];
                for (var o = 0, y = w.length; o < y; o++) {
                    u = parseFloat(w[o]);
                    if (!isNaN(u)) {
                        v.push(u)
                    }
                }
                var n = v[0],
                    A = j[n.toLowerCase()],
                    q = f[n] || n;
                if (v.length - 1 > A) {
                    for (var m = 1, t = v.length; m < t; m += A) {
                        B.push([n].concat(v.slice(m, m + A)));
                        n = q
                    }
                } else {
                    B.push(v)
                }
            }
            return B
        },
        _parseDimensions: function() {
            var p = [],
                l = [],
                w, n = null,
                C = 0,
                B = 0,
                u = 0,
                t = 0,
                m = 0,
                k = 0,
                r, q, s;
            for (var z = 0, A = this.path.length; z < A; ++z) {
                w = this.path[z];
                switch (w[0]) {
                    case "l":
                        u += w[1];
                        t += w[2];
                        s = [];
                        break;
                    case "L":
                        u = w[1];
                        t = w[2];
                        s = [];
                        break;
                    case "h":
                        u += w[1];
                        s = [];
                        break;
                    case "H":
                        u = w[1];
                        s = [];
                        break;
                    case "v":
                        t += w[1];
                        s = [];
                        break;
                    case "V":
                        t = w[1];
                        s = [];
                        break;
                    case "m":
                        u += w[1];
                        t += w[2];
                        C = u;
                        B = t;
                        s = [];
                        break;
                    case "M":
                        u = w[1];
                        t = w[2];
                        C = u;
                        B = t;
                        s = [];
                        break;
                    case "c":
                        r = u + w[5];
                        q = t + w[6];
                        m = u + w[3];
                        k = t + w[4];
                        s = c.util.getBoundsOfCurve(u, t, u + w[1], t + w[2], m, k, r, q);
                        u = r;
                        t = q;
                        break;
                    case "C":
                        u = w[5];
                        t = w[6];
                        m = w[3];
                        k = w[4];
                        s = c.util.getBoundsOfCurve(u, t, w[1], w[2], m, k, u, t);
                        break;
                    case "s":
                        r = u + w[3];
                        q = t + w[4];
                        if (n[0].match(/[CcSs]/) === null) {
                            m = u;
                            k = t
                        } else {
                            m = 2 * u - m;
                            k = 2 * t - k
                        }
                        s = c.util.getBoundsOfCurve(u, t, m, k, u + w[1], t + w[2], r, q);
                        m = u + w[1];
                        k = t + w[2];
                        u = r;
                        t = q;
                        break;
                    case "S":
                        r = w[3];
                        q = w[4];
                        if (n[0].match(/[CcSs]/) === null) {
                            m = u;
                            k = t
                        } else {
                            m = 2 * u - m;
                            k = 2 * t - k
                        }
                        s = c.util.getBoundsOfCurve(u, t, m, k, w[1], w[2], r, q);
                        u = r;
                        t = q;
                        m = w[1];
                        k = w[2];
                        break;
                    case "q":
                        r = u + w[3];
                        q = t + w[4];
                        m = u + w[1];
                        k = t + w[2];
                        s = c.util.getBoundsOfCurve(u, t, m, k, m, k, r, q);
                        u = r;
                        t = q;
                        break;
                    case "Q":
                        m = w[1];
                        k = w[2];
                        s = c.util.getBoundsOfCurve(u, t, m, k, m, k, w[3], w[4]);
                        u = w[3];
                        t = w[4];
                        break;
                    case "t":
                        r = u + w[1];
                        q = t + w[2];
                        if (n[0].match(/[QqTt]/) === null) {
                            m = u;
                            k = t
                        } else {
                            m = 2 * u - m;
                            k = 2 * t - k
                        }
                        s = c.util.getBoundsOfCurve(u, t, m, k, m, k, r, q);
                        u = r;
                        t = q;
                        break;
                    case "T":
                        r = w[1];
                        q = w[2];
                        if (n[0].match(/[QqTt]/) === null) {
                            m = u;
                            k = t
                        } else {
                            m = 2 * u - m;
                            k = 2 * t - k
                        }
                        s = c.util.getBoundsOfCurve(u, t, m, k, m, k, r, q);
                        u = r;
                        t = q;
                        break;
                    case "a":
                        s = c.util.getBoundsOfArc(u, t, w[1], w[2], w[3], w[4], w[5], w[6] + u, w[7] + t);
                        u += w[6];
                        t += w[7];
                        break;
                    case "A":
                        s = c.util.getBoundsOfArc(u, t, w[1], w[2], w[3], w[4], w[5], w[6], w[7]);
                        u = w[6];
                        t = w[7];
                        break;
                    case "z":
                    case "Z":
                        u = C;
                        t = B;
                        break
                }
                n = w;
                s.forEach(function(o) {
                    p.push(o.x);
                    l.push(o.y)
                });
                p.push(u);
                l.push(t)
            }
            var G = e(p) || 0,
                F = e(l) || 0,
                E = h(p) || 0,
                D = h(l) || 0,
                I = E - G,
                H = D - F,
                v = {
                    left: G,
                    top: F,
                    width: I,
                    height: H
                };
            return v
        }
    });
    c.Path.fromObject = function(l, n, k) {
        var m;
        if (typeof l.path === "string") {
            c.loadSVGFromURL(l.path, function(o) {
                var p = l.path;
                m = o[0];
                delete l.path;
                c.util.object.extend(m, l);
                m.setSourcePath(p);
                n && n(m)
            })
        } else {
            return c.Object._fromObject("Path", l, n, k, "path")
        }
    };
    c.Path.ATTRIBUTE_NAMES = c.SHARED_ATTRIBUTES.concat(["d"]);
    c.Path.fromElement = function(l, n, k) {
        var m = c.parseAttributes(l, c.Path.ATTRIBUTE_NAMES);
        n && n(new c.Path(m.d, g(m, k)))
    };
    c.Path.async = true
})(typeof exports !== "undefined" ? exports : this);
(function(a) {
    var b = a.fabric || (a.fabric = {}),
        c = b.util.object.extend;
    if (b.PathGroup) {
        b.warn("fabric.PathGroup is already defined");
        return
    }
    b.PathGroup = b.util.createClass(b.Object, {
        type: "path-group",
        fill: "",
        initialize: function(f, d) {
            d = d || {};
            this.paths = f || [];
            for (var e = this.paths.length; e--;) {
                this.paths[e].group = this
            }
            if (d.toBeParsed) {
                this.parseDimensionsFromPaths(d);
                delete d.toBeParsed
            }
            this.setOptions(d);
            this.setCoords();
            if (d.sourcePath) {
                this.setSourcePath(d.sourcePath)
            }
            if (this.objectCaching) {
                this._createCacheCanvas();
                this.setupState({
                    propertySet: "cacheProperties"
                })
            }
        },
        parseDimensionsFromPaths: function(r) {
            var l, d, g = [],
                o = [],
                q, n, e, f;
            for (var h = this.paths.length; h--;) {
                q = this.paths[h];
                n = q.height + q.strokeWidth;
                e = q.width + q.strokeWidth;
                l = [{
                    x: q.left,
                    y: q.top
                }, {
                    x: q.left + e,
                    y: q.top
                }, {
                    x: q.left,
                    y: q.top + n
                }, {
                    x: q.left + e,
                    y: q.top + n
                }];
                f = this.paths[h].transformMatrix;
                for (var k = 0; k < l.length; k++) {
                    d = l[k];
                    if (f) {
                        d = b.util.transformPoint(d, f, false)
                    }
                    g.push(d.x);
                    o.push(d.y)
                }
            }
            r.width = Math.max.apply(null, g);
            r.height = Math.max.apply(null, o)
        },
        drawObject: function(e) {
            e.save();
            e.translate(-this.width / 2, -this.height / 2);
            for (var f = 0, d = this.paths.length; f < d; ++f) {
                this.paths[f].render(e, true)
            }
            e.restore()
        },
        isCacheDirty: function() {
            if (this.callSuper("isCacheDirty")) {
                return true
            }
            if (!this.statefullCache) {
                return false
            }
            for (var e = 0, d = this.paths.length; e < d; e++) {
                if (this.paths[e].isCacheDirty(true)) {
                    var f = this._getNonTransformedDimensions();
                    this._cacheContext.clearRect(-f.x / 2, -f.y / 2, f.x, f.y);
                    return true
                }
            }
            return false
        },
        _set: function(f, e) {
            if ((f === "fill" || f === "stroke") && this.isSameColor()) {
                var d = this.paths.length;
                while (d--) {
                    this.paths[d]._set(f, e)
                }
            }
            return this.callSuper("_set", f, e)
        },
        toObject: function(f) {
            var d = this.paths.map(function(i) {
                var g = i.includeDefaultValues;
                i.includeDefaultValues = i.group.includeDefaultValues;
                var h = i.toObject(f);
                i.includeDefaultValues = g;
                return h
            });
            var e = c(this.callSuper("toObject", ["sourcePath"].concat(f)), {
                paths: d
            });
            return e
        },
        toDatalessObject: function(e) {
            var d = this.toObject(e);
            if (this.sourcePath) {
                d.paths = this.sourcePath
            }
            return d
        },
        toSVG: function(f) {
            var j = this.getObjects(),
                k = this.getPointByOrigin("left", "top"),
                e = "translate(" + k.x + " " + k.y + ")",
                g = this._createBaseSVGMarkup();
            g.push("<g ", this.getSvgId(), 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransformMatrix(), e, this.getSvgTransform(), '" ', ">\n");
            for (var h = 0, d = j.length; h < d; h++) {
                if (j[h].excludeFromExport) {
                    continue
                }
                g.push("\t", j[h].toSVG(f))
            }
            g.push("</g>\n");
            return f ? f(g.join(""), this) : g.join("")
        },
        toString: function() {
            return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>"
        },
        isSameColor: function() {
            var e = this.getObjects()[0].get("fill") || "";
            if (typeof e !== "string") {
                return false
            }
            var d = this.getObjects()[0].get("stroke") || "";
            if (typeof d !== "string") {
                return false
            }
            e = e.toLowerCase();
            d = d.toLowerCase();
            return this.getObjects().every(function(g) {
                var h = g.get("fill") || "";
                var f = g.get("stroke") || "";
                return typeof h === "string" && h.toLowerCase() === e && typeof f === "string" && f.toLowerCase() === d
            })
        },
        complexity: function() {
            return this.paths.reduce(function(d, e) {
                return d + ((e && e.complexity) ? e.complexity() : 0)
            }, 0)
        },
        getObjects: function() {
            return this.paths
        }
    });
    b.PathGroup.fromObject = function(e, f) {
        var d = e.paths;
        delete e.paths;
        if (typeof orignalPaths === "string") {
            b.loadSVGFromURL(d, function(h) {
                var i = d;
                var g = b.util.groupSVGElements(h, e, i);
                e.paths = d;
                f(g)
            })
        } else {
            b.util.enlivenObjects(d, function(h) {
                var g = new b.PathGroup(h, e);
                e.paths = d;
                f(g)
            })
        }
    };
    b.PathGroup.async = true
})(typeof exports !== "undefined" ? exports : this);
(function(c) {
    var d = c.fabric || (c.fabric = {}),
        f = d.util.object.extend,
        b = d.util.array.min,
        a = d.util.array.max;
    if (d.Group) {
        return
    }
    var e = {
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true
    };
    d.Group = d.util.createClass(d.Object, d.Collection, {
        type: "group",
        strokeWidth: 0,
        subTargetCheck: false,
        initialize: function(j, g, k) {
            g = g || {};
            this._objects = [];
            k && this.callSuper("initialize", g);
            this._objects = j || [];
            for (var h = this._objects.length; h--;) {
                this._objects[h].group = this
            }
            this.originalState = {};
            if (g.originX) {
                this.originX = g.originX
            }
            if (g.originY) {
                this.originY = g.originY
            }
            if (k) {
                this._updateObjectsCoords(true)
            } else {
                this._calcBounds();
                this._updateObjectsCoords();
                this.callSuper("initialize", g)
            }
            this.setCoords();
            this.saveCoords()
        },
        _updateObjectsCoords: function(h) {
            var g = this.getCenterPoint();
            for (var j = this._objects.length; j--;) {
                this._updateObjectCoords(this._objects[j], g, h)
            }
        },
        _updateObjectCoords: function(i, g, h) {
            i.__origHasControls = i.hasControls;
            i.hasControls = false;
            if (h) {
                return
            }
            var l = i.getLeft(),
                m = i.getTop(),
                k = true,
                j = true;
            i.set({
                left: l - g.x,
                top: m - g.y
            });
            i.setCoords(k, j)
        },
        toString: function() {
            return "#<fabric.Group: (" + this.complexity() + ")>"
        },
        addWithUpdate: function(g) {
            this._restoreObjectsState();
            d.util.resetObjectTransform(this);
            if (g) {
                this._objects.push(g);
                g.group = this;
                g._set("canvas", this.canvas)
            }
            this.forEachObject(this._setObjectActive, this);
            this._calcBounds();
            this._updateObjectsCoords();
            this.dirty = true;
            return this
        },
        _setObjectActive: function(g) {
            g.set("active", true);
            g.group = this
        },
        removeWithUpdate: function(g) {
            this._restoreObjectsState();
            d.util.resetObjectTransform(this);
            this.forEachObject(this._setObjectActive, this);
            this.remove(g);
            this._calcBounds();
            this._updateObjectsCoords();
            this.dirty = true;
            return this
        },
        _onObjectAdded: function(g) {
            this.dirty = true;
            g.group = this;
            g._set("canvas", this.canvas)
        },
        _onObjectRemoved: function(g) {
            this.dirty = true;
            delete g.group;
            g.set("active", false)
        },
        delegatedProperties: {
            fill: true,
            stroke: true,
            strokeWidth: true,
            fontFamily: true,
            fontWeight: true,
            fontSize: true,
            fontStyle: true,
            lineHeight: true,
            textDecoration: true,
            textAlign: true,
            backgroundColor: true
        },
        _set: function(h, j) {
            var g = this._objects.length;
            if (this.delegatedProperties[h] || h === "canvas") {
                while (g--) {
                    this._objects[g].set(h, j)
                }
            } else {
                while (g--) {
                    this._objects[g].setOnGroup(h, j)
                }
            }
            this.callSuper("_set", h, j)
        },
        toObject: function(h) {
            var g = this.getObjects().map(function(j) {
                var i = j.includeDefaultValues;
                j.includeDefaultValues = j.group.includeDefaultValues;
                var k = j.toObject(h);
                j.includeDefaultValues = i;
                return k
            });
            return f(this.callSuper("toObject", h), {
                objects: g
            })
        },
        render: function(g) {
            this._transformDone = true;
            this.callSuper("render", g);
            this._transformDone = false
        },
        drawObject: function(h) {
            for (var j = 0, g = this._objects.length; j < g; j++) {
                this._renderObject(this._objects[j], h)
            }
        },
        isCacheDirty: function() {
            if (this.callSuper("isCacheDirty")) {
                return true
            }
            if (!this.statefullCache) {
                return false
            }
            for (var h = 0, g = this._objects.length; h < g; h++) {
                if (this._objects[h].isCacheDirty(true)) {
                    var j = this._getNonTransformedDimensions();
                    this._cacheContext.clearRect(-j.x / 2, -j.y / 2, j.x, j.y);
                    return true
                }
            }
            return false
        },
        _renderControls: function(h, k) {
            h.save();
            h.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
            this.callSuper("_renderControls", h, k);
            for (var j = 0, g = this._objects.length; j < g; j++) {
                this._objects[j]._renderControls(h)
            }
            h.restore()
        },
        _renderObject: function(i, h) {
            if (!i.visible) {
                return
            }
            var g = i.hasRotatingPoint;
            i.hasRotatingPoint = false;
            i.render(h);
            i.hasRotatingPoint = g
        },
        _restoreObjectsState: function() {
            this._objects.forEach(this._restoreObjectState, this);
            return this
        },
        realizeTransform: function(j) {
            var h = j.calcTransformMatrix(),
                i = d.util.qrDecompose(h),
                g = new d.Point(i.translateX, i.translateY);
            j.flipX = false;
            j.flipY = false;
            j.set("scaleX", i.scaleX);
            j.set("scaleY", i.scaleY);
            j.skewX = i.skewX;
            j.skewY = i.skewY;
            j.angle = i.angle;
            j.setPositionByOrigin(g, "center", "center");
            return j
        },
        _restoreObjectState: function(g) {
            this.realizeTransform(g);
            g.setCoords();
            g.hasControls = g.__origHasControls;
            delete g.__origHasControls;
            g.set("active", false);
            delete g.group;
            return this
        },
        destroy: function() {
            return this._restoreObjectsState()
        },
        saveCoords: function() {
            this._originalLeft = this.get("left");
            this._originalTop = this.get("top");
            return this
        },
        hasMoved: function() {
            return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top")
        },
        setObjectsCoords: function() {
            var h = true,
                g = true;
            this.forEachObject(function(i) {
                i.setCoords(h, g)
            });
            return this
        },
        _calcBounds: function(l) {
            var p = [],
                n = [],
                h, g, s = ["tr", "br", "bl", "tl"],
                q = 0,
                k = this._objects.length,
                m, t = s.length,
                r = true;
            for (; q < k; ++q) {
                h = this._objects[q];
                h.setCoords(r);
                for (m = 0; m < t; m++) {
                    g = s[m];
                    p.push(h.oCoords[g].x);
                    n.push(h.oCoords[g].y)
                }
            }
            this.set(this._getBounds(p, n, l))
        },
        _getBounds: function(i, h, l) {
            var j = new d.Point(b(i), b(h)),
                g = new d.Point(a(i), a(h)),
                k = {
                    width: (g.x - j.x) || 0,
                    height: (g.y - j.y) || 0
                };
            if (!l) {
                k.left = j.x || 0;
                k.top = j.y || 0;
                if (this.originX === "center") {
                    k.left += k.width / 2
                }
                if (this.originX === "right") {
                    k.left += k.width
                }
                if (this.originY === "center") {
                    k.top += k.height / 2
                }
                if (this.originY === "bottom") {
                    k.top += k.height
                }
            }
            return k
        },
        toSVG: function(h) {
            var j = this._createBaseSVGMarkup();
            j.push("<g ", this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '" style="', this.getSvgFilter(), '">\n');
            for (var k = 0, g = this._objects.length; k < g; k++) {
                j.push("\t", this._objects[k].toSVG(h))
            }
            j.push("</g>\n");
            return h ? h(j.join(""), this) : j.join("")
        },
        get: function(j) {
            if (j in e) {
                if (this[j]) {
                    return this[j]
                } else {
                    for (var h = 0, g = this._objects.length; h < g; h++) {
                        if (this._objects[h][j]) {
                            return true
                        }
                    }
                    return false
                }
            } else {
                if (j in this.delegatedProperties) {
                    return this._objects[0] && this._objects[0].get(j)
                }
                return this[j]
            }
        }
    });
    d.Group.fromObject = function(g, h) {
        d.util.enlivenObjects(g.objects, function(i) {
            delete g.objects;
            h && h(new d.Group(i, g, true))
        })
    };
    d.Group.async = true
})(typeof exports !== "undefined" ? exports : this);
(function(a) {
    var c = fabric.util.object.extend;
    if (!a.fabric) {
        a.fabric = {}
    }
    if (a.fabric.Image) {
        fabric.warn("fabric.Image is already defined.");
        return
    }
    var b = fabric.Object.prototype.stateProperties.concat();
    b.push("alignX", "alignY", "meetOrSlice");
    fabric.Image = fabric.util.createClass(fabric.Object, {
        type: "image",
        crossOrigin: "",
        alignX: "none",
        alignY: "none",
        meetOrSlice: "meet",
        strokeWidth: 0,
        _lastScaleX: 1,
        _lastScaleY: 1,
        minimumScaleTrigger: 0.5,
        stateProperties: b,
        objectCaching: false,
        initialize: function(e, d, f) {
            d || (d = {});
            this.filters = [];
            this.resizeFilters = [];
            this.callSuper("initialize", d);
            this._initElement(e, d, f)
        },
        getElement: function() {
            return this._element
        },
        setElement: function(f, h, e) {
            var d, g;
            this._element = f;
            this._originalElement = f;
            this._initConfig(e);
            if (this.resizeFilters.length === 0) {
                d = h
            } else {
                g = this;
                d = function() {
                    g.applyFilters(h, g.resizeFilters, g._filteredEl || g._originalElement, true)
                }
            }
            if (this.filters.length !== 0) {
                this.applyFilters(d)
            } else {
                if (d) {
                    d(this)
                }
            }
            return this
        },
        setCrossOrigin: function(d) {
            this.crossOrigin = d;
            this._element.crossOrigin = d;
            return this
        },
        getOriginalSize: function() {
            var d = this.getElement();
            return {
                width: d.width,
                height: d.height
            }
        },
        _stroke: function(e) {
            if (!this.stroke || this.strokeWidth === 0) {
                return
            }
            var d = this.width / 2,
                f = this.height / 2;
            e.beginPath();
            e.moveTo(-d, -f);
            e.lineTo(d, -f);
            e.lineTo(d, f);
            e.lineTo(-d, f);
            e.lineTo(-d, -f);
            e.closePath()
        },
        _renderDashedStroke: function(f) {
            var d = -this.width / 2,
                i = -this.height / 2,
                e = this.width,
                g = this.height;
            f.save();
            this._setStrokeStyles(f);
            f.beginPath();
            fabric.util.drawDashedLine(f, d, i, d + e, i, this.strokeDashArray);
            fabric.util.drawDashedLine(f, d + e, i, d + e, i + g, this.strokeDashArray);
            fabric.util.drawDashedLine(f, d + e, i + g, d, i + g, this.strokeDashArray);
            fabric.util.drawDashedLine(f, d, i + g, d, i, this.strokeDashArray);
            f.closePath();
            f.restore()
        },
        toObject: function(i) {
            var h = [],
                g = [],
                f = 1,
                d = 1;
            this.filters.forEach(function(j) {
                if (j) {
                    if (j.type === "Resize") {
                        f *= j.scaleX;
                        d *= j.scaleY
                    }
                    h.push(j.toObject())
                }
            });
            this.resizeFilters.forEach(function(j) {
                j && g.push(j.toObject())
            });
            var e = c(this.callSuper("toObject", ["crossOrigin", "alignX", "alignY", "meetOrSlice"].concat(i)), {
                src: this.getSrc(),
                filters: h,
                resizeFilters: g,
            });
            e.width /= f;
            e.height /= d;
            return e
        },
        toSVG: function(e) {
            var f = this._createBaseSVGMarkup(),
                d = -this.width / 2,
                j = -this.height / 2,
                i = "none",
                g = false;
            if (this.group && this.group.type === "path-group") {
                d = this.left;
                j = this.top
            }
            if (this.alignX !== "none" && this.alignY !== "none") {
                i = "x" + this.alignX + "Y" + this.alignY + " " + this.meetOrSlice
            }
            f.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', "<image ", this.getSvgId(), 'xlink:href="', this.getSvgSrc(g), '" x="', d, '" y="', j, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="', i, '"', "></image>\n");
            if (this.stroke || this.strokeDashArray) {
                var h = this.fill;
                this.fill = null;
                f.push("<rect ", 'x="', d, '" y="', j, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n');
                this.fill = h
            }
            f.push("</g>\n");
            return e ? e(f.join(""), this) : f.join("")
        },
        getSrc: function(d) {
            var e = d ? this._element : this._originalElement;
            if (e) {
                return fabric.isLikelyNode ? e._src : e.src
            } else {
                return this.src || ""
            }
        },
        setSrc: function(e, f, d) {
            fabric.util.loadImage(e, function(g) {
                return this.setElement(g, f, d)
            }, this, d && d.crossOrigin)
        },
        toString: function() {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
        },
        applyFilters: function(n, e, m, j) {
            e = e || this.filters;
            m = m || this._originalElement;
            if (!m) {
                return
            }
            var g = fabric.util.createImage(),
                i = this.canvas ? this.canvas.getRetinaScaling() : fabric.devicePixelRatio,
                d = this.minimumScaleTrigger / i,
                h = this,
                l, k;
            if (e.length === 0) {
                this._element = m;
                n && n(this);
                return m
            }
            var f = fabric.util.createCanvasElement();
            f.width = m.width;
            f.height = m.height;
            f.getContext("2d").drawImage(m, 0, 0, m.width, m.height);
            e.forEach(function(o) {
                if (!o) {
                    return
                }
                if (j) {
                    l = h.scaleX < d ? h.scaleX : 1;
                    k = h.scaleY < d ? h.scaleY : 1;
                    if (l * i < 1) {
                        l *= i
                    }
                    if (k * i < 1) {
                        k *= i
                    }
                } else {
                    l = o.scaleX;
                    k = o.scaleY
                }
                o.applyTo(f, l, k);
                if (!j && o.type === "Resize") {
                    h.width *= o.scaleX;
                    h.height *= o.scaleY
                }
            });
            g.width = f.width;
            g.height = f.height;
            if (fabric.isLikelyNode) {
                g.src = f.toBuffer(undefined, fabric.Image.pngCompression);
                h._element = g;
                !j && (h._filteredEl = g);
                n && n(h)
            } else {
                g.onload = function() {
                    h._element = g;
                    !j && (h._filteredEl = g);
                    n && n(h);
                    g.onload = f = null
                };
                g.src = f.toDataURL("image/png")
            }
            return f
        },
        _render: function(f, h) {
            var d, i, e = this._findMargins(),
                g;
            d = (h ? this.left : -this.width / 2);
            i = (h ? this.top : -this.height / 2);
            if (this.meetOrSlice === "slice") {
                f.beginPath();
                f.rect(d, i, this.width, this.height);
                f.clip()
            }
            if (this.isMoving === false && this.resizeFilters.length && this._needsResize()) {
                this._lastScaleX = this.scaleX;
                this._lastScaleY = this.scaleY;
                g = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, true)
            } else {
                g = this._element
            }
            g && f.drawImage(g, d + e.marginX, i + e.marginY, e.width, e.height);
            this._stroke(f);
            this._renderStroke(f)
        },
        _needsResize: function() {
            return (this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY)
        },
        _findMargins: function() {
            var g = this.width,
                d = this.height,
                i, h, f = 0,
                e = 0;
            if (this.alignX !== "none" || this.alignY !== "none") {
                i = [this.width / this._element.width, this.height / this._element.height];
                h = this.meetOrSlice === "meet" ? Math.min.apply(null, i) : Math.max.apply(null, i);
                g = this._element.width * h;
                d = this._element.height * h;
                if (this.alignX === "Mid") {
                    f = (this.width - g) / 2
                }
                if (this.alignX === "Max") {
                    f = this.width - g
                }
                if (this.alignY === "Mid") {
                    e = (this.height - d) / 2
                }
                if (this.alignY === "Max") {
                    e = this.height - d
                }
            }
            return {
                width: g,
                height: d,
                marginX: f,
                marginY: e
            }
        },
        _resetWidthHeight: function() {
            var d = this.getElement();
            this.set("width", d.width);
            this.set("height", d.height)
        },
        _initElement: function(e, d, f) {
            this.setElement(fabric.util.getById(e), f, d);
            fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
        },
        _initConfig: function(d) {
            d || (d = {});
            this.setOptions(d);
            this._setWidthHeight(d);
            if (this._element && this.crossOrigin) {
                this._element.crossOrigin = this.crossOrigin
            }
        },
        _initFilters: function(d, e) {
            if (d && d.length) {
                fabric.util.enlivenObjects(d, function(f) {
                    e && e(f)
                }, "fabric.Image.filters")
            } else {
                e && e()
            }
        },
        _setWidthHeight: function(d) {
            this.width = "width" in d ? d.width : (this.getElement() ? this.getElement().width || 0 : 0);
            this.height = "height" in d ? d.height : (this.getElement() ? this.getElement().height || 0 : 0)
        },
    });
    fabric.Image.CSS_CANVAS = "canvas-img";
    fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc;
    fabric.Image.fromObject = function(d, e) {
        fabric.util.loadImage(d.src, function(f, g) {
            if (g) {
                e && e(null, g);
                return
            }
            fabric.Image.prototype._initFilters.call(d, d.filters, function(h) {
                d.filters = h || [];
                fabric.Image.prototype._initFilters.call(d, d.resizeFilters, function(i) {
                    d.resizeFilters = i || [];
                    return new fabric.Image(f, d, e)
                })
            })
        }, null, d.crossOrigin)
    };
    fabric.Image.fromURL = function(d, f, e) {
        fabric.util.loadImage(d, function(g) {
            f && f(new fabric.Image(g, e))
        }, null, e && e.crossOrigin)
    };
    fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href".split(" "));
    fabric.Image.fromElement = function(e, h, d) {
        var f = fabric.parseAttributes(e, fabric.Image.ATTRIBUTE_NAMES),
            g;
        if (f.preserveAspectRatio) {
            g = fabric.util.parsePreserveAspectRatioAttribute(f.preserveAspectRatio);
            c(f, g)
        }
        fabric.Image.fromURL(f["xlink:href"], h, c((d ? fabric.util.object.clone(d) : {}), f))
    };
    fabric.Image.async = true;
    fabric.Image.pngCompression = 1
})(typeof exports !== "undefined" ? exports : this);
fabric.util.object.extend(fabric.Object.prototype, {
    _getAngleValueForStraighten: function() {
        var a = this.getAngle() % 360;
        if (a > 0) {
            return Math.round((a - 1) / 90) * 90
        }
        return Math.round(a / 90) * 90
    },
    straighten: function() {
        this.setAngle(this._getAngleValueForStraighten());
        return this
    },
    fxStraighten: function(b) {
        b = b || {};
        var c = function() {},
            d = b.onComplete || c,
            a = b.onChange || c,
            e = this;
        fabric.util.animate({
            startValue: this.get("angle"),
            endValue: this._getAngleValueForStraighten(),
            duration: this.FX_DURATION,
            onChange: function(f) {
                e.setAngle(f);
                a()
            },
            onComplete: function() {
                e.setCoords();
                d()
            },
            onStart: function() {
                e.set("active", false)
            }
        });
        return this
    }
});
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    straightenObject: function(a) {
        a.straighten();
        this.renderAll();
        return this
    },
    fxStraightenObject: function(a) {
        a.fxStraighten({
            onChange: this.renderAll.bind(this)
        });
        return this
    }
});
fabric.Image.filters = fabric.Image.filters || {};
fabric.Image.filters.BaseFilter = fabric.util.createClass({
    type: "BaseFilter",
    initialize: function(a) {
        if (a) {
            this.setOptions(a)
        }
    },
    setOptions: function(a) {
        for (var b in a) {
            this[b] = a[b]
        }
    },
    toObject: function() {
        return {
            type: this.type
        }
    },
    toJSON: function() {
        return this.toObject()
    }
});
fabric.Image.filters.BaseFilter.fromObject = function(a, c) {
    var b = new fabric.Image.filters[a.type](a);
    c && c(b);
    return b
};
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Brightness = d(a.BaseFilter, {
        type: "Brightness",
        initialize: function(f) {
            f = f || {};
            this.brightness = f.brightness || 0
        },
        applyTo: function(j) {
            var h = j.getContext("2d"),
                m = h.getImageData(0, 0, j.width, j.height),
                k = m.data,
                l = this.brightness;
            for (var g = 0, f = k.length; g < f; g += 4) {
                k[g] += l;
                k[g + 1] += l;
                k[g + 2] += l
            }
            h.putImageData(m, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                brightness: this.brightness
            })
        }
    });
    c.Image.filters.Brightness.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Convolute = d(a.BaseFilter, {
        type: "Convolute",
        initialize: function(f) {
            f = f || {};
            this.opaque = f.opaque;
            this.matrix = f.matrix || [0, 0, 0, 0, 1, 0, 0, 0, 0]
        },
        applyTo: function(m) {
            var D = this.matrix,
                j = m.getContext("2d"),
                v = j.getImageData(0, 0, m.width, m.height),
                h = Math.round(Math.sqrt(D.length)),
                l = Math.floor(h / 2),
                n = v.data,
                w = v.width,
                G = v.height,
                o = j.createImageData(w, G),
                H = o.data,
                t = this.opaque ? 1 : 0,
                u, C, E, F, z, B, A, s, f;
            for (var p = 0; p < G; p++) {
                for (var q = 0; q < w; q++) {
                    z = (p * w + q) * 4;
                    u = 0;
                    C = 0;
                    E = 0;
                    F = 0;
                    for (var i = 0; i < h; i++) {
                        for (var k = 0; k < h; k++) {
                            A = p + i - l;
                            B = q + k - l;
                            if (A < 0 || A > G || B < 0 || B > w) {
                                continue
                            }
                            s = (A * w + B) * 4;
                            f = D[i * h + k];
                            u += n[s] * f;
                            C += n[s + 1] * f;
                            E += n[s + 2] * f;
                            F += n[s + 3] * f
                        }
                    }
                    H[z] = u;
                    H[z + 1] = C;
                    H[z + 2] = E;
                    H[z + 3] = F + t * (255 - F)
                }
            }
            j.putImageData(o, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                opaque: this.opaque,
                matrix: this.matrix
            })
        }
    });
    c.Image.filters.Convolute.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.GradientTransparency = d(a.BaseFilter, {
        type: "GradientTransparency",
        initialize: function(f) {
            f = f || {};
            this.threshold = f.threshold || 100
        },
        applyTo: function(k) {
            var j = k.getContext("2d"),
                n = j.getImageData(0, 0, k.width, k.height),
                m = n.data,
                g = this.threshold,
                l = m.length;
            for (var h = 0, f = m.length; h < f; h += 4) {
                m[h + 3] = g + 255 * (l - h) / l
            }
            j.putImageData(n, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                threshold: this.threshold
            })
        }
    });
    c.Image.filters.GradientTransparency.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        a = c.Image.filters,
        d = c.util.createClass;
    a.Grayscale = d(a.BaseFilter, {
        type: "Grayscale",
        applyTo: function(h) {
            var g = h.getContext("2d"),
                k = g.getImageData(0, 0, h.width, h.height),
                j = k.data,
                e = k.width * k.height * 4,
                f = 0,
                i;
            while (f < e) {
                i = (j[f] + j[f + 1] + j[f + 2]) / 3;
                j[f] = i;
                j[f + 1] = i;
                j[f + 2] = i;
                f += 4
            }
            g.putImageData(k, 0, 0)
        }
    });
    c.Image.filters.Grayscale.fromObject = function(e, f) {
        e = e || {};
        e.type = "Grayscale";
        return c.Image.filters.BaseFilter.fromObject(e, f)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        a = c.Image.filters,
        d = c.util.createClass;
    a.BlackWhite = d(a.BaseFilter, {
        type: "BlackWhite",
        initialize: function(e) {
            e = e || {};
            this.threshold = e.threshold || 127
        },
        applyTo: function(i) {
            var h = i.getContext("2d"),
                e = h.getImageData(0, 0, i.width, i.height),
                m = e.data,
                o = e.width * e.height * 4,
                n = 0,
                g;
            while (n < o) {
                var l = m[n + 3];
                if (l != 0) {
                    l = l / 255
                }
                var f = (1 - l) * 255;
                var j = ((m[n] * l) + f) * 0.299;
                var k = ((m[n + 1] * l) + f) * 0.587;
                var p = ((m[n + 2] * l) + f) * 0.114;
                g = (j + k + p).toFixed(0);
                g = (g < this.threshold) ? 0 : 255;
                m[n] = g;
                m[n + 1] = g;
                m[n + 2] = g;
                m[n + 3] = 255;
                n += 4
            }
            h.putImageData(e, 0, 0)
        },
        toObject: function() {
            return extend(this.callSuper("toObject"), {
                threshold: this.threshold
            })
        }
    });
    c.Image.filters.BlackWhite.fromObject = function(e, f) {
        e = e || {};
        e.type = "BlackWhite";
        return c.Image.filters.BaseFilter.fromObject(e, f)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        a = c.Image.filters,
        d = c.util.createClass;
    a.Invert = d(a.BaseFilter, {
        type: "Invert",
        applyTo: function(h) {
            var g = h.getContext("2d"),
                k = g.getImageData(0, 0, h.width, h.height),
                j = k.data,
                e = j.length,
                f;
            for (f = 0; f < e; f += 4) {
                j[f] = 255 - j[f];
                j[f + 1] = 255 - j[f + 1];
                j[f + 2] = 255 - j[f + 2]
            }
            g.putImageData(k, 0, 0)
        }
    });
    c.Image.filters.Invert.fromObject = function(e, f) {
        e = e || {};
        e.type = "Invert";
        return c.Image.filters.BaseFilter.fromObject(e, f)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Mask = d(a.BaseFilter, {
        type: "Mask",
        initialize: function(f) {
            f = f || {};
            this.mask = f.mask;
            this.channel = [0, 1, 2, 3].indexOf(f.channel) > -1 ? f.channel : 0
        },
        applyTo: function(k) {
            if (!this.mask) {
                return
            }
            var g = k.getContext("2d"),
                f = g.getImageData(0, 0, k.width, k.height),
                l = f.data,
                n = this.mask.getElement(),
                p = c.util.createCanvasElement(),
                o = this.channel,
                m, j = f.width * f.height * 4;
            p.width = k.width;
            p.height = k.height;
            p.getContext("2d").drawImage(n, 0, 0, k.width, k.height);
            var h = p.getContext("2d").getImageData(0, 0, k.width, k.height),
                q = h.data;
            for (m = 0; m < j; m += 4) {
                l[m + 3] = q[m + o]
            }
            g.putImageData(f, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                mask: this.mask.toObject(),
                channel: this.channel
            })
        }
    });
    c.Image.filters.Mask.fromObject = function(f, g) {
        c.util.loadImage(f.mask.src, function(h) {
            f.mask = new c.Image(h, f.mask);
            return c.Image.filters.BaseFilter.fromObject(f, g)
        })
    };
    c.Image.filters.Mask.async = true
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Noise = d(a.BaseFilter, {
        type: "Noise",
        initialize: function(f) {
            f = f || {};
            this.noise = f.noise || 0
        },
        applyTo: function(k) {
            var j = k.getContext("2d"),
                n = j.getImageData(0, 0, k.width, k.height),
                m = n.data,
                g = this.noise,
                l;
            for (var h = 0, f = m.length; h < f; h += 4) {
                l = (0.5 - Math.random()) * g;
                m[h] += l;
                m[h + 1] += l;
                m[h + 2] += l
            }
            j.putImageData(n, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                noise: this.noise
            })
        }
    });
    c.Image.filters.Noise.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Pixelate = d(a.BaseFilter, {
        type: "Pixelate",
        initialize: function(f) {
            f = f || {};
            this.blocksize = f.blocksize || 4
        },
        applyTo: function(l) {
            var k = l.getContext("2d"),
                h = k.getImageData(0, 0, l.width, l.height),
                q = h.data,
                m = h.height,
                z = h.width,
                u, s, p, f, t, w, x;
            for (s = 0; s < m; s += this.blocksize) {
                for (p = 0; p < z; p += this.blocksize) {
                    u = (s * 4) * z + (p * 4);
                    f = q[u];
                    t = q[u + 1];
                    w = q[u + 2];
                    x = q[u + 3];
                    for (var o = s, y = s + this.blocksize; o < y; o++) {
                        for (var n = p, v = p + this.blocksize; n < v; n++) {
                            u = (o * 4) * z + (n * 4);
                            q[u] = f;
                            q[u + 1] = t;
                            q[u + 2] = w;
                            q[u + 3] = x
                        }
                    }
                }
            }
            k.putImageData(h, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                blocksize: this.blocksize
            })
        }
    });
    c.Image.filters.Pixelate.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.RemoveWhite = d(a.BaseFilter, {
        type: "RemoveWhite",
        initialize: function(f) {
            f = f || {};
            this.threshold = f.threshold || 30;
            this.distance = f.distance || 20
        },
        applyTo: function(l) {
            var k = l.getContext("2d"),
                h = k.getImageData(0, 0, l.width, l.height),
                o = h.data,
                p = this.threshold,
                j = this.distance,
                m = 255 - p,
                u = Math.abs,
                f, q, t;
            for (var n = 0, s = o.length; n < s; n += 4) {
                f = o[n];
                q = o[n + 1];
                t = o[n + 2];
                if (f > m && q > m && t > m && u(f - q) < j && u(f - t) < j && u(q - t) < j) {
                    o[n + 3] = 0
                }
            }
            k.putImageData(h, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                threshold: this.threshold,
                distance: this.distance
            })
        }
    });
    c.Image.filters.RemoveWhite.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        a = c.Image.filters,
        d = c.util.createClass;
    a.Sepia = d(a.BaseFilter, {
        type: "Sepia",
        applyTo: function(h) {
            var g = h.getContext("2d"),
                l = g.getImageData(0, 0, h.width, h.height),
                j = l.data,
                e = j.length,
                f, k;
            for (f = 0; f < e; f += 4) {
                k = 0.3 * j[f] + 0.59 * j[f + 1] + 0.11 * j[f + 2];
                j[f] = k + 100;
                j[f + 1] = k + 50;
                j[f + 2] = k + 255
            }
            g.putImageData(l, 0, 0)
        }
    });
    c.Image.filters.Sepia.fromObject = function(e, f) {
        e = e || {};
        e.type = "Sepia";
        return new c.Image.filters.BaseFilter.fromObject(e, f)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        a = c.Image.filters,
        d = c.util.createClass;
    a.Sepia2 = d(a.BaseFilter, {
        type: "Sepia2",
        applyTo: function(j) {
            var h = j.getContext("2d"),
                e = h.getImageData(0, 0, j.width, j.height),
                l = e.data,
                k = l.length,
                m, f, n, o;
            for (m = 0; m < k; m += 4) {
                f = l[m];
                n = l[m + 1];
                o = l[m + 2];
                l[m] = (f * 0.393 + n * 0.769 + o * 0.189) / 1.351;
                l[m + 1] = (f * 0.349 + n * 0.686 + o * 0.168) / 1.203;
                l[m + 2] = (f * 0.272 + n * 0.534 + o * 0.131) / 2.14
            }
            h.putImageData(e, 0, 0)
        }
    });
    c.Image.filters.Sepia2.fromObject = function(e, f) {
        e = e || {};
        e.type = "Sepia2";
        return new c.Image.filters.BaseFilter.fromObject(e, f)
    }
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Tint = d(a.BaseFilter, {
        type: "Tint",
        initialize: function(f) {
            f = f || {};
            this.color = f.color || "#000000";
            this.opacity = typeof f.opacity !== "undefined" ? f.opacity : new c.Color(this.color).getAlpha();
            this.skipWhite = f.skipWhite || false
        },
        applyTo: function(m) {
            var k = m.getContext("2d"),
                j = k.getImageData(0, 0, m.width, m.height),
                o = j.data,
                n = o.length,
                p, s, v, l, h, q, t, u, f;
            f = new c.Color(this.color).getSource();
            s = f[0] * this.opacity;
            v = f[1] * this.opacity;
            l = f[2] * this.opacity;
            u = 1 - this.opacity;
            for (p = 0; p < n; p += 4) {
                h = o[p];
                q = o[p + 1];
                t = o[p + 2];
                if (this.skipWhite && h === 255 && q === 255 && t === 255) {
                    continue
                }
                o[p] = s + h * u;
                o[p + 1] = v + q * u;
                o[p + 2] = l + t * u
            }
            k.putImageData(j, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                color: this.color,
                opacity: this.opacity,
                skipWhite: this.skipWhite
            })
        }
    });
    c.Image.filters.Tint.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Multiply = d(a.BaseFilter, {
        type: "Multiply",
        initialize: function(f) {
            f = f || {};
            this.color = f.color || "#000000"
        },
        applyTo: function(j) {
            var h = j.getContext("2d"),
                m = h.getImageData(0, 0, j.width, j.height),
                l = m.data,
                f = l.length,
                g, k;
            k = new c.Color(this.color).getSource();
            for (g = 0; g < f; g += 4) {
                l[g] *= k[0] / 255;
                l[g + 1] *= k[1] / 255;
                l[g + 2] *= k[2] / 255
            }
            h.putImageData(m, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                color: this.color
            })
        }
    });
    c.Image.filters.Multiply.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Blend = d(a.BaseFilter, {
        type: "Blend",
        initialize: function(e) {
            e = e || {};
            this.color = e.color || "#000";
            this.image = e.image || false;
            this.mode = e.mode || "multiply";
            this.alpha = e.alpha || 1
        },
        applyTo: function(l) {
            var h = l.getContext("2d"),
                x = h.getImageData(0, 0, l.width, l.height),
                A = x.data,
                e, m, n, o, w, z, y, j, k, q, t = false;
            if (this.image) {
                t = true;
                var p = c.util.createCanvasElement();
                p.width = this.image.width;
                p.height = this.image.height;
                var f = new c.StaticCanvas(p);
                f.add(this.image);
                var s = f.getContext("2d");
                q = s.getImageData(0, 0, f.width, f.height).data
            } else {
                q = new c.Color(this.color).getSource();
                e = q[0] * this.alpha;
                m = q[1] * this.alpha;
                n = q[2] * this.alpha
            }
            for (var u = 0, v = A.length; u < v; u += 4) {
                o = A[u];
                w = A[u + 1];
                z = A[u + 2];
                if (t) {
                    e = q[u] * this.alpha;
                    m = q[u + 1] * this.alpha;
                    n = q[u + 2] * this.alpha
                }
                switch (this.mode) {
                    case "multiply":
                        A[u] = o * e / 255;
                        A[u + 1] = w * m / 255;
                        A[u + 2] = z * n / 255;
                        break;
                    case "screen":
                        A[u] = 1 - (1 - o) * (1 - e);
                        A[u + 1] = 1 - (1 - w) * (1 - m);
                        A[u + 2] = 1 - (1 - z) * (1 - n);
                        break;
                    case "add":
                        A[u] = Math.min(255, o + e);
                        A[u + 1] = Math.min(255, w + m);
                        A[u + 2] = Math.min(255, z + n);
                        break;
                    case "diff":
                    case "difference":
                        A[u] = Math.abs(o - e);
                        A[u + 1] = Math.abs(w - m);
                        A[u + 2] = Math.abs(z - n);
                        break;
                    case "subtract":
                        y = o - e;
                        j = w - m;
                        k = z - n;
                        A[u] = (y < 0) ? 0 : y;
                        A[u + 1] = (j < 0) ? 0 : j;
                        A[u + 2] = (k < 0) ? 0 : k;
                        break;
                    case "darken":
                        A[u] = Math.min(o, e);
                        A[u + 1] = Math.min(w, m);
                        A[u + 2] = Math.min(z, n);
                        break;
                    case "lighten":
                        A[u] = Math.max(o, e);
                        A[u + 1] = Math.max(w, m);
                        A[u + 2] = Math.max(z, n);
                        break
                }
            }
            h.putImageData(x, 0, 0)
        },
        toObject: function() {
            return {
                color: this.color,
                image: this.image,
                mode: this.mode,
                alpha: this.alpha
            }
        }
    });
    c.Image.filters.Blend.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var d = b.fabric || (b.fabric = {}),
        f = Math.pow,
        e = Math.floor,
        i = Math.sqrt,
        l = Math.abs,
        h = Math.max,
        k = Math.round,
        g = Math.sin,
        j = Math.ceil,
        c = d.Image.filters,
        a = d.util.createClass;
    c.Resize = a(c.BaseFilter, {
        type: "Resize",
        resizeType: "hermite",
        scaleX: 0,
        scaleY: 0,
        lanczosLobes: 3,
        applyTo: function(q, p, o) {
            if (p === 1 && o === 1) {
                return
            }
            this.rcpScaleX = 1 / p;
            this.rcpScaleY = 1 / o;
            var n = q.width,
                s = q.height,
                m = k(n * p),
                r = k(s * o),
                t;
            if (this.resizeType === "sliceHack") {
                t = this.sliceByTwo(q, n, s, m, r)
            }
            if (this.resizeType === "hermite") {
                t = this.hermiteFastResize(q, n, s, m, r)
            }
            if (this.resizeType === "bilinear") {
                t = this.bilinearFiltering(q, n, s, m, r)
            }
            if (this.resizeType === "lanczos") {
                t = this.lanczosResize(q, n, s, m, r)
            }
            q.width = m;
            q.height = r;
            q.getContext("2d").putImageData(t, 0, 0)
        },
        sliceByTwo: function(p, w, q, t, n) {
            var o = p.getContext("2d"),
                m, s = 0.5,
                C = 0.5,
                A = 1,
                v = 1,
                r = false,
                B = false,
                z = w,
                u = q,
                x = d.util.createCanvasElement(),
                y = x.getContext("2d");
            t = e(t);
            n = e(n);
            x.width = h(t, w);
            x.height = h(n, q);
            if (t > w) {
                s = 2;
                A = -1
            }
            if (n > q) {
                C = 2;
                v = -1
            }
            m = o.getImageData(0, 0, w, q);
            p.width = h(t, w);
            p.height = h(n, q);
            o.putImageData(m, 0, 0);
            while (!r || !B) {
                w = z;
                q = u;
                if (t * A < e(z * s * A)) {
                    z = e(z * s)
                } else {
                    z = t;
                    r = true
                }
                if (n * v < e(u * C * v)) {
                    u = e(u * C)
                } else {
                    u = n;
                    B = true
                }
                m = o.getImageData(0, 0, w, q);
                y.putImageData(m, 0, 0);
                o.clearRect(0, 0, z, u);
                o.drawImage(x, 0, 0, w, q, 0, 0, z, u)
            }
            return o.getImageData(0, 0, t, n)
        },
        lanczosResize: function(u, G, t, r, x) {
            function z(I) {
                return function(J) {
                    if (J > I) {
                        return 0
                    }
                    J *= Math.PI;
                    if (l(J) < 1e-16) {
                        return 1
                    }
                    var K = J / I;
                    return g(J) * g(K) / J / K
                }
            }

            function A(U) {
                var T, M, N, S, Q, I, K, R, J, P, O;
                F.x = (U + 0.5) * o;
                C.x = e(F.x);
                for (T = 0; T < x; T++) {
                    F.y = (T + 0.5) * n;
                    C.y = e(F.y);
                    Q = 0;
                    I = 0;
                    K = 0;
                    R = 0;
                    J = 0;
                    for (M = C.x - s; M <= C.x + s; M++) {
                        if (M < 0 || M >= G) {
                            continue
                        }
                        P = e(1000 * l(M - F.x));
                        if (!m[P]) {
                            m[P] = {}
                        }
                        for (var L = C.y - q; L <= C.y + q; L++) {
                            if (L < 0 || L >= t) {
                                continue
                            }
                            O = e(1000 * l(L - F.y));
                            if (!m[P][O]) {
                                m[P][O] = v(i(f(P * B, 2) + f(O * y, 2)) / 1000)
                            }
                            N = m[P][O];
                            if (N > 0) {
                                S = (L * G + M) * 4;
                                Q += N;
                                I += N * E[S];
                                K += N * E[S + 1];
                                R += N * E[S + 2];
                                J += N * E[S + 3]
                            }
                        }
                    }
                    S = (T * r + U) * 4;
                    D[S] = I / Q;
                    D[S + 1] = K / Q;
                    D[S + 2] = R / Q;
                    D[S + 3] = J / Q
                }
                if (++U < r) {
                    return A(U)
                } else {
                    return H
                }
            }
            var p = u.getContext("2d"),
                w = p.getImageData(0, 0, G, t),
                H = p.getImageData(0, 0, r, x),
                E = w.data,
                D = H.data,
                v = z(this.lanczosLobes),
                o = this.rcpScaleX,
                n = this.rcpScaleY,
                B = 2 / this.rcpScaleX,
                y = 2 / this.rcpScaleY,
                s = j(o * this.lanczosLobes / 2),
                q = j(n * this.lanczosLobes / 2),
                m = {},
                F = {},
                C = {};
            return A(0)
        },
        bilinearFiltering: function(s, N, r, p, D) {
            var M, L, K, J, C, z, H, G, I, A, w, F, t = 0,
                v, o = this.rcpScaleX,
                m = this.rcpScaleY,
                n = s.getContext("2d"),
                u = 4 * (N - 1),
                O = n.getImageData(0, 0, N, r),
                E = O.data,
                q = n.getImageData(0, 0, p, D),
                B = q.data;
            for (H = 0; H < D; H++) {
                for (G = 0; G < p; G++) {
                    C = e(o * G);
                    z = e(m * H);
                    I = o * G - C;
                    A = m * H - z;
                    v = 4 * (z * N + C);
                    for (w = 0; w < 4; w++) {
                        M = E[v + w];
                        L = E[v + 4 + w];
                        K = E[v + u + w];
                        J = E[v + u + 4 + w];
                        F = M * (1 - I) * (1 - A) + L * I * (1 - A) + K * A * (1 - I) + J * I * A;
                        B[t++] = F
                    }
                }
            }
            return q
        },
        hermiteFastResize: function(r, P, q, p, I) {
            var o = this.rcpScaleX,
                D = this.rcpScaleY,
                K = j(o / 2),
                G = j(D / 2),
                n = r.getContext("2d"),
                S = n.getImageData(0, 0, P, q),
                R = S.data,
                Q = n.getImageData(0, 0, p, I),
                s = Q.data;
            for (var L = 0; L < I; L++) {
                for (var M = 0; M < p; M++) {
                    var N = (M + L * p) * 4,
                        H = 0,
                        O = 0,
                        x = 0,
                        m = 0,
                        u = 0,
                        z = 0,
                        A = 0,
                        v = (L + 0.5) * D;
                    for (var J = e(L * D); J < (L + 1) * D; J++) {
                        var C = l(v - (J + 0.5)) / G,
                            y = (M + 0.5) * o,
                            F = C * C;
                        for (var t = e(M * o); t < (M + 1) * o; t++) {
                            var E = l(y - (t + 0.5)) / K,
                                B = i(F + E * E);
                            if (B > 1 && B < -1) {
                                continue
                            }
                            H = 2 * B * B * B - 3 * B * B + 1;
                            if (H > 0) {
                                E = 4 * (t + J * P);
                                A += H * R[E + 3];
                                x += H;
                                if (R[E + 3] < 255) {
                                    H = H * R[E + 3] / 250
                                }
                                m += H * R[E];
                                u += H * R[E + 1];
                                z += H * R[E + 2];
                                O += H
                            }
                        }
                    }
                    s[N] = m / O;
                    s[N + 1] = u / O;
                    s[N + 2] = z / O;
                    s[N + 3] = A / x
                }
            }
            return Q
        },
        toObject: function() {
            return {
                type: this.type,
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                resizeType: this.resizeType,
                lanczosLobes: this.lanczosLobes
            }
        }
    });
    d.Image.filters.Resize.fromObject = d.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.ColorMatrix = d(a.BaseFilter, {
        type: "ColorMatrix",
        initialize: function(f) {
            f || (f = {});
            this.matrix = f.matrix || [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
        },
        applyTo: function(k) {
            var j = k.getContext("2d"),
                f = j.getImageData(0, 0, k.width, k.height),
                o = f.data,
                l = o.length,
                p, h, q, s, t, n = this.matrix;
            for (p = 0; p < l; p += 4) {
                h = o[p];
                q = o[p + 1];
                s = o[p + 2];
                t = o[p + 3];
                o[p] = h * n[0] + q * n[1] + s * n[2] + t * n[3] + n[4];
                o[p + 1] = h * n[5] + q * n[6] + s * n[7] + t * n[8] + n[9];
                o[p + 2] = h * n[10] + q * n[11] + s * n[12] + t * n[13] + n[14];
                o[p + 3] = h * n[15] + q * n[16] + s * n[17] + t * n[18] + n[19]
            }
            j.putImageData(f, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                type: this.type,
                matrix: this.matrix
            })
        }
    });
    c.Image.filters.ColorMatrix.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Contrast = d(a.BaseFilter, {
        type: "Contrast",
        initialize: function(f) {
            f = f || {};
            this.contrast = f.contrast || 0
        },
        applyTo: function(j) {
            var h = j.getContext("2d"),
                m = h.getImageData(0, 0, j.width, j.height),
                l = m.data,
                k = 259 * (this.contrast + 255) / (255 * (259 - this.contrast));
            for (var g = 0, f = l.length; g < f; g += 4) {
                l[g] = k * (l[g] - 128) + 128;
                l[g + 1] = k * (l[g + 1] - 128) + 128;
                l[g + 2] = k * (l[g + 2] - 128) + 128
            }
            h.putImageData(m, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                contrast: this.contrast
            })
        }
    });
    c.Image.filters.Contrast.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(b) {
    var c = b.fabric || (b.fabric = {}),
        e = c.util.object.extend,
        a = c.Image.filters,
        d = c.util.createClass;
    a.Saturate = d(a.BaseFilter, {
        type: "Saturate",
        initialize: function(f) {
            f = f || {};
            this.saturate = f.saturate || 0
        },
        applyTo: function(k) {
            var j = k.getContext("2d"),
                n = j.getImageData(0, 0, k.width, k.height),
                l = n.data,
                g, m = -this.saturate * 0.01;
            for (var h = 0, f = l.length; h < f; h += 4) {
                g = Math.max(l[h], l[h + 1], l[h + 2]);
                l[h] += g !== l[h] ? (g - l[h]) * m : 0;
                l[h + 1] += g !== l[h + 1] ? (g - l[h + 1]) * m : 0;
                l[h + 2] += g !== l[h + 2] ? (g - l[h + 2]) * m : 0
            }
            j.putImageData(n, 0, 0)
        },
        toObject: function() {
            return e(this.callSuper("toObject"), {
                saturate: this.saturate
            })
        }
    });
    c.Image.filters.Saturate.fromObject = c.Image.filters.BaseFilter.fromObject
})(typeof exports !== "undefined" ? exports : this);
(function(c) {
    var d = c.fabric || (c.fabric = {}),
        a = d.util.toFixed,
        e = 2;
    if (d.Text) {
        d.warn("fabric.Text is already defined");
        return
    }
    var f = d.Object.prototype.stateProperties.concat();
    f.push("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing");
    var b = d.Object.prototype.cacheProperties.concat();
    b.push("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing", "styles");
    d.Text = d.util.createClass(d.Object, {
        _dimensionAffectingProps: ["fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "text", "charSpacing", "textAlign"],
        _reNewline: /\r?\n/,
        _reSpacesAndTabs: /[ \t\r]+/g,
        type: "text",
        fontSize: 40,
        fontWeight: "normal",
        fontFamily: "Times New Roman",
        textDecoration: "",
        textAlign: "left",
        fontStyle: "",
        lineHeight: 1.16,
        textBackgroundColor: "",
        stateProperties: f,
        cacheProperties: b,
        stroke: null,
        shadow: null,
        _fontSizeFraction: 0.25,
        _fontSizeMult: 1.13,
        charSpacing: 0,
        initialize: function(h, g) {
            g = g || {};
            this.text = h;
            this.__skipDimension = true;
            this.callSuper("initialize", g);
            this.__skipDimension = false;
            this._initDimensions();
            this.setupState({
                propertySet: "_dimensionAffectingProps"
            })
        },
        _initDimensions: function(g) {
            if (this.__skipDimension) {
                return
            }
            if (!g) {
                g = d.util.createCanvasElement().getContext("2d");
                this._setTextStyles(g)
            }
            this._textLines = this._splitTextIntoLines();
            this._clearCache();
            this.width = this._getTextWidth(g) || this.cursorWidth || e;
            this.height = this._getTextHeight(g)
        },
        toString: function() {
            return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
        },
        _getCacheCanvasDimensions: function() {
            var h = this.callSuper("_getCacheCanvasDimensions");
            var g = Math.ceil(this.fontSize) * 2;
            h.width += g;
            h.height += g;
            return h
        },
        _render: function(g) {
            this._setTextStyles(g);
            if (this.group && this.group.type === "path-group") {
                g.translate(this.left, this.top)
            }
            this._renderTextLinesBackground(g);
            this._renderText(g);
            this._renderTextDecoration(g)
        },
        _renderText: function(g) {
            this._renderTextFill(g);
            this._renderTextStroke(g)
        },
        _setTextStyles: function(g) {
            g.textBaseline = "alphabetic";
            g.font = this._getFontDeclaration()
        },
        _getTextHeight: function() {
            return this._getHeightOfSingleLine() + (this._textLines.length - 1) * this._getHeightOfLine()
        },
        _getTextWidth: function(h) {
            var k = this._getLineWidth(h, 0);
            for (var j = 1, g = this._textLines.length; j < g; j++) {
                var l = this._getLineWidth(h, j);
                if (l > k) {
                    k = l
                }
            }
            return k
        },
        _renderChars: function(g, t, q, j, r) {
            var k = g.slice(0, -4),
                s, h;
            if (this[k].toLive) {
                var o = -this.width / 2 + this[k].offsetX || 0,
                    m = -this.height / 2 + this[k].offsetY || 0;
                t.save();
                t.translate(o, m);
                j -= o;
                r -= m
            }
            if (this.charSpacing !== 0) {
                var n = this._getWidthOfCharSpacing();
                q = q.split("");
                for (var l = 0, p = q.length; l < p; l++) {
                    s = q[l];
                    h = t.measureText(s).width + n;
                    t[g](s, j, r);
                    j += h > 0 ? h : 0
                }
            } else {
                t[g](q, j, r)
            }
            this[k].toLive && t.restore()
        },
        _renderTextLine: function(g, v, x, k, s, u) {
            s -= this.fontSize * this._fontSizeFraction;
            var o = this._getLineWidth(v, u);
            if (this.textAlign !== "justify" || this.width < o) {
                this._renderChars(g, v, x, k, s, u);
                return
            }
            var r = x.split(/\s+/),
                q = 0,
                w = this._getWidthOfWords(v, r.join(" "), u, 0),
                n = this.width - w,
                m = r.length - 1,
                t = m > 0 ? n / m : 0,
                j = 0,
                h;
            for (var l = 0, p = r.length; l < p; l++) {
                while (x[q] === " " && q < x.length) {
                    q++
                }
                h = r[l];
                this._renderChars(g, v, h, k + j, s, u, q);
                j += this._getWidthOfWords(v, h, u, q) + t;
                q += h.length
            }
        },
        _getWidthOfWords: function(i, k) {
            var j = i.measureText(k).width,
                h, g;
            if (this.charSpacing !== 0) {
                h = k.split("").length;
                g = h * this._getWidthOfCharSpacing();
                j += g
            }
            return j > 0 ? j : 0
        },
        _getLeftOffset: function() {
            return -this.width / 2
        },
        _getTopOffset: function() {
            return -this.height / 2
        },
        isEmptyStyles: function() {
            return true
        },
        _renderTextCommon: function(r, g) {
            var o = 0,
                k = this._getLeftOffset(),
                p = this._getTopOffset();
            for (var l = 0, n = this._textLines.length; l < n; l++) {
                var j = this._getHeightOfLine(r, l),
                    q = j / this.lineHeight,
                    m = this._getLineWidth(r, l),
                    h = this._getLineLeftOffset(m);
                this._renderTextLine(g, r, this._textLines[l], k + h, p + o + q, l);
                o += j
            }
        },
        _renderTextFill: function(g) {
            if (!this.fill && this.isEmptyStyles()) {
                return
            }
            this._renderTextCommon(g, "fillText")
        },
        _renderTextStroke: function(g) {
            if ((!this.stroke || this.strokeWidth === 0) && this.isEmptyStyles()) {
                return
            }
            if (this.shadow && !this.shadow.affectStroke) {
                this._removeShadow(g)
            }
            g.save();
            this._setLineDash(g, this.strokeDashArray);
            g.beginPath();
            this._renderTextCommon(g, "strokeText");
            g.closePath();
            g.restore()
        },
        _getHeightOfLine: function() {
            return this._getHeightOfSingleLine() * this.lineHeight
        },
        _getHeightOfSingleLine: function() {
            return this.fontSize * this._fontSizeMult
        },
        _renderTextLinesBackground: function(j) {
            if (!this.textBackgroundColor) {
                return
            }
            var m = 0,
                l, h, o, n = j.fillStyle;
            j.fillStyle = this.textBackgroundColor;
            for (var k = 0, g = this._textLines.length; k < g; k++) {
                l = this._getHeightOfLine(j, k);
                h = this._getLineWidth(j, k);
                if (h > 0) {
                    o = this._getLineLeftOffset(h);
                    j.fillRect(this._getLeftOffset() + o, this._getTopOffset() + m, h, l / this.lineHeight)
                }
                m += l
            }
            j.fillStyle = n;
            this._removeShadow(j)
        },
        _getLineLeftOffset: function(g) {
            if (this.textAlign === "center") {
                return (this.width - g) / 2
            }
            if (this.textAlign === "right") {
                return this.width - g
            }
            return 0
        },
        _clearCache: function() {
            this.__lineWidths = [];
            this.__lineHeights = []
        },
        _shouldClearDimensionCache: function() {
            var g = this._forceClearCache;
            g || (g = this.hasStateChanged("_dimensionAffectingProps"));
            if (g) {
                this.saveState({
                    propertySet: "_dimensionAffectingProps"
                });
                this.dirty = true
            }
            return g
        },
        _getLineWidth: function(h, k) {
            if (this.__lineWidths[k]) {
                return this.__lineWidths[k] === -1 ? this.width : this.__lineWidths[k]
            }
            var j, i, g = this._textLines[k];
            if (g === "") {
                j = 0
            } else {
                j = this._measureLine(h, k)
            }
            this.__lineWidths[k] = j;
            if (j && this.textAlign === "justify") {
                i = g.split(/\s+/);
                if (i.length > 1) {
                    this.__lineWidths[k] = -1
                }
            }
            return j
        },
        _getWidthOfCharSpacing: function() {
            if (this.charSpacing !== 0) {
                return this.fontSize * this.charSpacing / 1000
            }
            return 0
        },
        _measureLine: function(j, m) {
            var i = this._textLines[m],
                k = j.measureText(i).width,
                h = 0,
                g, l;
            if (this.charSpacing !== 0) {
                g = i.split("").length;
                h = (g - 1) * this._getWidthOfCharSpacing()
            }
            l = k + h;
            return l > 0 ? l : 0
        },
        _renderTextDecoration: function(h) {
            if (!this.textDecoration) {
                return
            }
            var j = this.height / 2,
                k = this,
                i = [];

            function g(m) {
                var o, u = 0,
                    r, n, t, q, p, l;
                for (o = 0, r = k._textLines.length; o < r; o++) {
                    q = k._getLineWidth(h, o);
                    p = k._getLineLeftOffset(q);
                    l = k._getHeightOfLine(h, o);
                    for (n = 0, t = m.length; n < t; n++) {
                        var s = {
                            left: k._getLeftOffset() + p,
                            top: u + (k._fontSizeMult - 1 + m[n]) * k.fontSize - j,
                            width: q,
                            height: k.fontSize / 15
                        };
                        if (k.fill) {
                            h.fillRect(s.left, s.top, s.width, s.height)
                        }
                        if (k.stroke) {
                            h.strokeRect(s.left, s.top, s.width, s.height)
                        }
                    }
                    u += l
                }
            }
            if (this.textDecoration.indexOf("underline") > -1) {
                i.push(0.85)
            }
            if (this.textDecoration.indexOf("line-through") > -1) {
                i.push(0.43)
            }
            if (this.textDecoration.indexOf("overline") > -1) {
                i.push(-0.12)
            }
            if (i.length > 0) {
                g(i)
            }
        },
        _getFontDeclaration: function() {
            return [(d.isLikelyNode ? this.fontWeight : this.fontStyle), (d.isLikelyNode ? this.fontStyle : this.fontWeight), this.fontSize + "px", (d.isLikelyNode ? ('"' + this.fontFamily + '"') : this.fontFamily)].join(" ")
        },
        render: function(g, h) {
            if (!this.visible) {
                return
            }
            if (this._shouldClearDimensionCache()) {
                this._setTextStyles(g);
                this._initDimensions(g)
            }
            this.callSuper("render", g, h)
        },
        _splitTextIntoLines: function() {
            return this.text.split(this._reNewline)
        },
        toObject: function(h) {
            var g = ["text", "fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "textDecoration", "textAlign", "textBackgroundColor", "charSpacing"].concat(h);
            return this.callSuper("toObject", g)
        },
        toSVG: function(g) {
            if (!this.ctx) {
                this.ctx = d.util.createCanvasElement().getContext("2d")
            }
            var h = this._createBaseSVGMarkup(),
                j = this._getSVGLeftTopOffsets(this.ctx),
                i = this._getSVGTextAndBg(j.textTop, j.textLeft);
            this._wrapSVGTextAndBg(h, i);
            return g ? g(h.join(""), this) : h.join("")
        },
        _getSVGLeftTopOffsets: function(i) {
            var j = this._getHeightOfLine(i, 0),
                h = -this.width / 2,
                g = 0;
            return {
                textLeft: h + (this.group && this.group.type === "path-group" ? this.left : 0),
                textTop: g + (this.group && this.group.type === "path-group" ? -this.top : 0),
                lineTop: j
            }
        },
        _wrapSVGTextAndBg: function(g, j) {
            var k = true,
                i = this.getSvgFilter(),
                h = i === "" ? "" : ' style="' + i + '"';
            g.push("\t<g ", this.getSvgId(), 'transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"', h, ">\n", j.textBgRects.join(""), "<text ", (this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : ""), (this.fontSize ? 'font-size="' + this.fontSize + '" ' : ""), (this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : ""), (this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : ""), (this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : ""), 'style="', this.getSvgStyles(k), '" >', j.textSpans.join(""), "</text>\n", "\t</g>\n")
        },
        _getSVGTextAndBg: function(j, k) {
            var n = [],
                m = [],
                h = 0;
            this._setSVGBg(m);
            for (var l = 0, g = this._textLines.length; l < g; l++) {
                if (this.textBackgroundColor) {
                    this._setSVGTextLineBg(m, l, k, j, h)
                }
                this._setSVGTextLineText(l, n, h, k, j, m);
                h += this._getHeightOfLine(this.ctx, l)
            }
            return {
                textSpans: n,
                textBgRects: m
            }
        },
        _setSVGTextLineText: function(l, n, h, j, g) {
            var m = this.fontSize * (this._fontSizeMult - this._fontSizeFraction) - g + h - this.height / 2;
            var k = d.Object.NUM_FRACTION_DIGITS;
            if (this.textAlign === "justify") {
                this._setSVGTextLineJustifed(l, n, m, j);
                return
            }
            n.push('<tspan x="', a(j + this._getLineLeftOffset(this._getLineWidth(this.ctx, l)), k), '" ', 'y="', a(m, k), '" ', ">", d.util.string.escapeXml(this._textLines[l]), "</tspan>")
        },
        _setSVGTextLineJustifed: function(m, h, j, k) {
            var s = d.util.createCanvasElement().getContext("2d"),
                u = d.Object.NUM_FRACTION_DIGITS;
            this._setTextStyles(s);
            var v = this._textLines[m],
                q = v.split(/\s+/),
                t = this._getWidthOfWords(s, q.join("")),
                o = this.width - t,
                n = q.length - 1,
                r = n > 0 ? o / n : 0,
                g, l = this._getFillAttributes(this.fill),
                p;
            k += this._getLineLeftOffset(this._getLineWidth(s, m));
            for (m = 0, p = q.length; m < p; m++) {
                g = q[m];
                h.push('<tspan x="', a(k, u), '" ', 'y="', a(j, u), '" ', l, ">", d.util.string.escapeXml(g), "</tspan>");
                k += this._getWidthOfWords(s, g) + r
            }
        },
        _setSVGTextLineBg: function(m, l, j, h, g) {
            var k = d.Object.NUM_FRACTION_DIGITS;
            m.push("\t\t<rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', a(j + this._getLineLeftOffset(this._getLineWidth(this.ctx, l)), k), '" y="', a(g - this.height / 2, k), '" width="', a(this._getLineWidth(this.ctx, l), k), '" height="', a(this._getHeightOfLine(this.ctx, l) / this.lineHeight, k), '"></rect>\n')
        },
        _setSVGBg: function(h) {
            var g = d.Object.NUM_FRACTION_DIGITS;
            if (this.backgroundColor) {
                h.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', a(-this.width / 2, g), '" y="', a(-this.height / 2, g), '" width="', a(this.width, g), '" height="', a(this.height, g), '"></rect>\n')
            }
        },
        _getFillAttributes: function(g) {
            var h = (g && typeof g === "string") ? new d.Color(g) : "";
            if (!h || !h.getSource() || h.getAlpha() === 1) {
                return 'fill="' + g + '"'
            }
            return 'opacity="' + h.getAlpha() + '" fill="' + h.setAlpha(1).toRgb() + '"'
        },
        _set: function(g, h) {
            this.callSuper("_set", g, h);
            if (this._dimensionAffectingProps.indexOf(g) > -1) {
                this._initDimensions();
                this.setCoords()
            }
        },
        complexity: function() {
            return 1
        }
    });
    d.Text.ATTRIBUTE_NAMES = d.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" "));
    d.Text.DEFAULT_SVG_FONT_SIZE = 16;
    d.Text.fromElement = function(g, p) {
        if (!g) {
            return null
        }
        var m = d.parseAttributes(g, d.Text.ATTRIBUTE_NAMES);
        p = d.util.object.extend((p ? d.util.object.clone(p) : {}), m);
        p.top = p.top || 0;
        p.left = p.left || 0;
        if ("dx" in m) {
            p.left += m.dx
        }
        if ("dy" in m) {
            p.top += m.dy
        }
        if (!("fontSize" in p)) {
            p.fontSize = d.Text.DEFAULT_SVG_FONT_SIZE
        }
        if (!p.originX) {
            p.originX = "left"
        }
        var i = "";
        if (!("textContent" in g)) {
            if ("firstChild" in g && g.firstChild !== null) {
                if ("data" in g.firstChild && g.firstChild.data !== null) {
                    i = g.firstChild.data
                }
            }
        } else {
            i = g.textContent
        }
        i = i.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " ");
        var o = new d.Text(i, p),
            l = o.getHeight() / o.height,
            h = (o.height + o.strokeWidth) * o.lineHeight - o.height,
            j = h * l,
            k = o.getHeight() + j,
            n = 0;
        if (o.originX === "left") {
            n = o.getWidth() / 2
        }
        if (o.originX === "right") {
            n = -o.getWidth() / 2
        }
        o.set({
            left: o.getLeft() + n,
            top: o.getTop() - k / 2 + o.fontSize * (0.18 + o._fontSizeFraction) / o.lineHeight
        });
        return o
    };
    d.Text.fromObject = function(h, i, g) {
        return d.Object._fromObject("Text", h, i, g, "text")
    };
    d.util.createAccessors(d.Text)
})(typeof exports !== "undefined" ? exports : this);
(function() {
    var a = fabric.util.object.clone;
    fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
        type: "i-text",
        selectionStart: 0,
        selectionEnd: 0,
        selectionColor: "rgba(17,119,255,0.3)",
        isEditing: false,
        editable: true,
        editingBorderColor: "rgba(102,153,255,0.25)",
        cursorWidth: 2,
        cursorColor: "#333",
        cursorDelay: 1000,
        cursorDuration: 600,
        styles: null,
        caching: true,
        _reSpace: /\s|\n/,
        _currentCursorOpacity: 0,
        _selectionDirection: null,
        _abortCursorAnimation: false,
        __widthOfSpace: [],
        initialize: function(c, b) {
            this.styles = b ? (b.styles || {}) : {};
            this.callSuper("initialize", c, b);
            this.initBehavior()
        },
        _clearCache: function() {
            this.callSuper("_clearCache");
            this.__widthOfSpace = []
        },
        isEmptyStyles: function() {
            if (!this.styles) {
                return true
            }
            var d = this.styles;
            for (var e in d) {
                for (var c in d[e]) {
                    for (var b in d[e][c]) {
                        return false
                    }
                }
            }
            return true
        },
        setSelectionStart: function(b) {
            b = Math.max(b, 0);
            this._updateAndFire("selectionStart", b)
        },
        setSelectionEnd: function(b) {
            b = Math.min(b, this.text.length);
            this._updateAndFire("selectionEnd", b)
        },
        _updateAndFire: function(c, b) {
            if (this[c] !== b) {
                this._fireSelectionChanged();
                this[c] = b
            }
            this._updateTextarea()
        },
        _fireSelectionChanged: function() {
            this.fire("selection:changed");
            this.canvas && this.canvas.fire("text:selection:changed", {
                target: this
            })
        },
        getSelectionStyles: function(g, e) {
            if (arguments.length === 2) {
                var d = [];
                for (var b = g; b < e; b++) {
                    d.push(this.getSelectionStyles(b))
                }
                return d
            }
            var f = this.get2DCursorLocation(g),
                c = this._getStyleDeclaration(f.lineIndex, f.charIndex);
            return c || {}
        },
        setSelectionStyles: function(c) {
            if (this.selectionStart === this.selectionEnd) {
                this._extendStyles(this.selectionStart, c)
            } else {
                for (var b = this.selectionStart; b < this.selectionEnd; b++) {
                    this._extendStyles(b, c)
                }
            }
            this._forceClearCache = true;
            return this
        },
        _extendStyles: function(b, c) {
            var d = this.get2DCursorLocation(b);
            if (!this._getLineStyle(d.lineIndex)) {
                this._setLineStyle(d.lineIndex, {})
            }
            if (!this._getStyleDeclaration(d.lineIndex, d.charIndex)) {
                this._setStyleDeclaration(d.lineIndex, d.charIndex, {})
            }
            fabric.util.object.extend(this._getStyleDeclaration(d.lineIndex, d.charIndex), c)
        },
        _initDimensions: function(b) {
            if (!b) {
                this.clearContextTop()
            }
            this.callSuper("_initDimensions", b)
        },
        render: function(b, c) {
            this.clearContextTop();
            this.callSuper("render", b, c);
            this.cursorOffsetCache = {};
            this.renderCursorOrSelection()
        },
        _render: function(b) {
            this.callSuper("_render", b);
            this.ctx = b
        },
        clearContextTop: function() {
            if (!this.active || !this.isEditing) {
                return
            }
            if (this.canvas && this.canvas.contextTop) {
                var b = this.canvas.contextTop;
                b.save();
                b.transform.apply(b, this.canvas.viewportTransform);
                this.transform(b);
                this.transformMatrix && b.transform.apply(b, this.transformMatrix);
                this._clearTextArea(b);
                b.restore()
            }
        },
        renderCursorOrSelection: function() {
            if (!this.active || !this.isEditing) {
                return
            }
            var d = this.text.split(""),
                c, b;
            if (this.canvas && this.canvas.contextTop) {
                b = this.canvas.contextTop;
                b.save();
                b.transform.apply(b, this.canvas.viewportTransform);
                this.transform(b);
                this.transformMatrix && b.transform.apply(b, this.transformMatrix);
                this._clearTextArea(b)
            } else {
                b = this.ctx;
                b.save()
            }
            if (this.selectionStart === this.selectionEnd) {
                c = this._getCursorBoundaries(d, "cursor");
                this.renderCursor(c, b)
            } else {
                c = this._getCursorBoundaries(d, "selection");
                this.renderSelection(d, c, b)
            }
            b.restore()
        },
        _clearTextArea: function(c) {
            var d = this.width + 4,
                b = this.height + 4;
            c.clearRect(-d / 2, -b / 2, d, b)
        },
        get2DCursorLocation: function(d) {
            if (typeof d === "undefined") {
                d = this.selectionStart
            }
            var b = this._textLines.length;
            for (var c = 0; c < b; c++) {
                if (d <= this._textLines[c].length) {
                    return {
                        lineIndex: c,
                        charIndex: d
                    }
                }
                d -= this._textLines[c].length + 1
            }
            return {
                lineIndex: c - 1,
                charIndex: this._textLines[c - 1].length < d ? this._textLines[c - 1].length : d
            }
        },
        getCurrentCharStyle: function(d, c) {
            var b = this._getStyleDeclaration(d, c === 0 ? 0 : c - 1);
            return {
                fontSize: b && b.fontSize || this.fontSize,
                fill: b && b.fill || this.fill,
                textBackgroundColor: b && b.textBackgroundColor || this.textBackgroundColor,
                textDecoration: b && b.textDecoration || this.textDecoration,
                fontFamily: b && b.fontFamily || this.fontFamily,
                fontWeight: b && b.fontWeight || this.fontWeight,
                fontStyle: b && b.fontStyle || this.fontStyle,
                stroke: b && b.stroke || this.stroke,
                strokeWidth: b && b.strokeWidth || this.strokeWidth
            }
        },
        getCurrentCharFontSize: function(d, c) {
            var b = this._getStyleDeclaration(d, c === 0 ? 0 : c - 1);
            return b && b.fontSize ? b.fontSize : this.fontSize
        },
        getCurrentCharColor: function(d, c) {
            var b = this._getStyleDeclaration(d, c === 0 ? 0 : c - 1);
            return b && b.fill ? b.fill : this.cursorColor
        },
        _getCursorBoundaries: function(d, b) {
            var f = Math.round(this._getLeftOffset()),
                e = this._getTopOffset(),
                c = this._getCursorBoundariesOffsets(d, b);
            return {
                left: f,
                top: e,
                leftOffset: c.left + c.lineLeft,
                topOffset: c.top
            }
        },
        _getCursorBoundariesOffsets: function(h, j) {
            if (this.cursorOffsetCache && "top" in this.cursorOffsetCache) {
                return this.cursorOffsetCache
            }
            var f = 0,
                k = 0,
                b = 0,
                g = 0,
                c = 0,
                d;
            for (var e = 0; e < this.selectionStart; e++) {
                if (h[e] === "\n") {
                    c = 0;
                    g += this._getHeightOfLine(this.ctx, k);
                    k++;
                    b = 0
                } else {
                    c += this._getWidthOfChar(this.ctx, h[e], k, b);
                    b++
                }
                f = this._getLineLeftOffset(this._getLineWidth(this.ctx, k))
            }
            if (j === "cursor") {
                g += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, k) / this.lineHeight - this.getCurrentCharFontSize(k, b) * (1 - this._fontSizeFraction)
            }
            if (this.charSpacing !== 0 && b === this._textLines[k].length) {
                c -= this._getWidthOfCharSpacing()
            }
            d = {
                top: g,
                left: c > 0 ? c : 0,
                lineLeft: f
            };
            this.cursorOffsetCache = d;
            return this.cursorOffsetCache
        },
        renderCursor: function(d, i) {
            var f = this.get2DCursorLocation(),
                h = f.lineIndex,
                b = f.charIndex,
                e = this.getCurrentCharFontSize(h, b),
                c = (h === 0 && b === 0) ? this._getLineLeftOffset(this._getLineWidth(i, h)) : d.leftOffset,
                g = this.scaleX * this.canvas.getZoom(),
                j = this.cursorWidth / g;
            i.fillStyle = this.getCurrentCharColor(h, b);
            i.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
            i.fillRect(d.left + c - j / 2, d.top + d.topOffset, j, e)
        },
        renderSelection: function(o, c, s) {
            s.fillStyle = this.selectionColor;
            var b = this.get2DCursorLocation(this.selectionStart),
                h = this.get2DCursorLocation(this.selectionEnd),
                q = b.lineIndex,
                e = h.lineIndex;
            for (var l = q; l <= e; l++) {
                var g = this._getLineLeftOffset(this._getLineWidth(s, l)) || 0,
                    p = this._getHeightOfLine(this.ctx, l),
                    d = 0,
                    m = 0,
                    t = this._textLines[l];
                if (l === q) {
                    for (var k = 0, n = t.length; k < n; k++) {
                        if (k >= b.charIndex && (l !== e || k < h.charIndex)) {
                            m += this._getWidthOfChar(s, t[k], l, k)
                        }
                        if (k < b.charIndex) {
                            g += this._getWidthOfChar(s, t[k], l, k)
                        }
                    }
                    if (k === t.length) {
                        m -= this._getWidthOfCharSpacing()
                    }
                } else {
                    if (l > q && l < e) {
                        m += this._getLineWidth(s, l) || 5
                    } else {
                        if (l === e) {
                            for (var r = 0, f = h.charIndex; r < f; r++) {
                                m += this._getWidthOfChar(s, t[r], l, r)
                            }
                            if (h.charIndex === t.length) {
                                m -= this._getWidthOfCharSpacing()
                            }
                        }
                    }
                }
                d = p;
                if (this.lineHeight < 1 || (l === e && this.lineHeight > 1)) {
                    p /= this.lineHeight
                }
                s.fillRect(c.left + g, c.top + c.topOffset, m > 0 ? m : 0, p);
                c.topOffset += d
            }
        },
        _renderChars: function(b, n, o, c, j, m, h) {
            if (this.isEmptyStyles()) {
                return this._renderCharsFast(b, n, o, c, j)
            }
            h = h || 0;
            var l = this._getHeightOfLine(n, m),
                k, g, e = "";
            n.save();
            j -= l / this.lineHeight * this._fontSizeFraction;
            for (var d = h, f = o.length + h; d <= f; d++) {
                k = k || this.getCurrentCharStyle(m, d);
                g = this.getCurrentCharStyle(m, d + 1);
                if (this._hasStyleChanged(k, g) || d === f) {
                    this._renderChar(b, n, m, d - 1, e, c, j, l);
                    e = "";
                    k = g
                }
                e += o[d - h]
            }
            n.restore()
        },
        _renderCharsFast: function(f, c, b, e, d) {
            if (f === "fillText" && this.fill) {
                this.callSuper("_renderChars", f, c, b, e, d)
            }
            if (f === "strokeText" && ((this.stroke && this.strokeWidth > 0) || this.skipFillStrokeCheck)) {
                this.callSuper("_renderChars", f, c, b, e, d)
            }
        },
        _renderChar: function(e, s, r, w, o, k, p, d) {
            var h, c, m, f, g = this._getStyleDeclaration(r, w),
                l, t, q, u, b;
            if (g) {
                c = this._getHeightOfChar(s, o, r, w);
                f = g.stroke;
                m = g.fill;
                t = g.textDecoration
            } else {
                c = this.fontSize
            }
            f = (f || this.stroke) && e === "strokeText";
            m = (m || this.fill) && e === "fillText";
            g && s.save();
            h = this._applyCharStylesGetWidth(s, o, r, w, g || null);
            t = t || this.textDecoration;
            if (g && g.textBackgroundColor) {
                this._removeShadow(s)
            }
            if (this.charSpacing !== 0) {
                u = this._getWidthOfCharSpacing();
                q = o.split("");
                h = 0;
                for (var v = 0, x = q.length, n; v < x; v++) {
                    n = q[v];
                    m && s.fillText(n, k + h, p);
                    f && s.strokeText(n, k + h, p);
                    b = s.measureText(n).width + u;
                    h += b > 0 ? b : 0
                }
            } else {
                m && s.fillText(o, k, p);
                f && s.strokeText(o, k, p)
            }
            if (t || t !== "") {
                l = this._fontSizeFraction * d / this.lineHeight;
                this._renderCharDecoration(s, t, k, p, l, h, c)
            }
            g && s.restore();
            s.translate(h, 0)
        },
        _hasStyleChanged: function(b, c) {
            return (b.fill !== c.fill || b.fontSize !== c.fontSize || b.textBackgroundColor !== c.textBackgroundColor || b.textDecoration !== c.textDecoration || b.fontFamily !== c.fontFamily || b.fontWeight !== c.fontWeight || b.fontStyle !== c.fontStyle || b.stroke !== c.stroke || b.strokeWidth !== c.strokeWidth)
        },
        _renderCharDecoration: function(m, n, d, k, e, j, b) {
            if (!n) {
                return
            }
            var h = b / 15,
                g = {
                    underline: k + b / 10,
                    "line-through": k - b * (this._fontSizeFraction + this._fontSizeMult - 1) + h,
                    overline: k - (this._fontSizeMult - this._fontSizeFraction) * b
                },
                c = ["underline", "line-through", "overline"],
                f, l;
            for (f = 0; f < c.length; f++) {
                l = c[f];
                if (n.indexOf(l) > -1) {
                    m.fillRect(d, g[l], j, h)
                }
            }
        },
        _renderTextLine: function(g, c, b, e, d, f) {
            if (!this.isEmptyStyles()) {
                d += this.fontSize * (this._fontSizeFraction + 0.03)
            }
            this.callSuper("_renderTextLine", g, c, b, e, d, f)
        },
        _renderTextDecoration: function(b) {
            if (this.isEmptyStyles()) {
                return this.callSuper("_renderTextDecoration", b)
            }
        },
        _renderTextLinesBackground: function(p) {
            this.callSuper("_renderTextLinesBackground", p);
            var d = 0,
                l, b, k, e = this._getLeftOffset(),
                q = this._getTopOffset(),
                g = "",
                f, h, u, v, c, o, n;
            p.save();
            for (var s = 0, t = this._textLines.length; s < t; s++) {
                l = this._getHeightOfLine(p, s);
                f = this._textLines[s];
                if (f === "" || !this.styles || !this._getLineStyle(s)) {
                    d += l;
                    continue
                }
                b = this._getLineWidth(p, s);
                k = this._getLineLeftOffset(b);
                v = c = o = n = 0;
                for (var r = 0, m = f.length; r < m; r++) {
                    u = this._getStyleDeclaration(s, r) || {};
                    if (g !== u.textBackgroundColor) {
                        if (n && o) {
                            p.fillStyle = g;
                            p.fillRect(v, c, o, n)
                        }
                        v = c = o = n = 0;
                        g = u.textBackgroundColor || ""
                    }
                    if (!u.textBackgroundColor) {
                        g = "";
                        continue
                    }
                    h = f[r];
                    if (g === u.textBackgroundColor) {
                        g = u.textBackgroundColor;
                        if (!v) {
                            v = e + k + this._getWidthOfCharsAt(p, s, r)
                        }
                        c = q + d;
                        o += this._getWidthOfChar(p, h, s, r);
                        n = l / this.lineHeight
                    }
                }
                if (n && o) {
                    p.fillStyle = g;
                    p.fillRect(v, c, o, n);
                    v = c = o = n = 0
                }
                d += l
            }
            p.restore()
        },
        _getCacheProp: function(b, c) {
            return b + c.fontSize + c.fontWeight + c.fontStyle
        },
        _getFontCache: function(b) {
            if (!fabric.charWidthsCache[b]) {
                fabric.charWidthsCache[b] = {}
            }
            return fabric.charWidthsCache[b]
        },
        _applyCharStylesGetWidth: function(l, i, k, b, h) {
            var f = h || this._getStyleDeclaration(k, b),
                d = a(f),
                c, g, e;
            this._applyFontStyles(d);
            e = this._getFontCache(d.fontFamily);
            g = this._getCacheProp(i, d);
            if (!f && e[g] && this.caching) {
                return e[g]
            }
            if (typeof d.shadow === "string") {
                d.shadow = new fabric.Shadow(d.shadow)
            }
            var j = d.fill || this.fill;
            l.fillStyle = j.toLive ? j.toLive(l, this) : j;
            if (d.stroke) {
                l.strokeStyle = (d.stroke && d.stroke.toLive) ? d.stroke.toLive(l, this) : d.stroke
            }
            l.lineWidth = d.strokeWidth || this.strokeWidth;
            l.font = this._getFontDeclaration.call(d);
            if (d.shadow) {
                d.scaleX = this.scaleX;
                d.scaleY = this.scaleY;
                d.canvas = this.canvas;
                d.getObjectScaling = this.getObjectScaling;
                this._setShadow.call(d, l)
            }
            if (!this.caching || !e[g]) {
                c = l.measureText(i).width;
                this.caching && (e[g] = c);
                return c
            }
            return e[g]
        },
        _applyFontStyles: function(b) {
            if (!b.fontFamily) {
                b.fontFamily = this.fontFamily
            }
            if (!b.fontSize) {
                b.fontSize = this.fontSize
            }
            if (!b.fontWeight) {
                b.fontWeight = this.fontWeight
            }
            if (!b.fontStyle) {
                b.fontStyle = this.fontStyle
            }
        },
        _getStyleDeclaration: function(d, c, b) {
            if (b) {
                return (this.styles[d] && this.styles[d][c]) ? a(this.styles[d][c]) : {}
            }
            return this.styles[d] && this.styles[d][c] ? this.styles[d][c] : null
        },
        _setStyleDeclaration: function(d, c, b) {
            this.styles[d][c] = b
        },
        _deleteStyleDeclaration: function(c, b) {
            delete this.styles[c][b]
        },
        _getLineStyle: function(b) {
            return this.styles[b]
        },
        _setLineStyle: function(c, b) {
            this.styles[c] = b
        },
        _deleteLineStyle: function(b) {
            delete this.styles[b]
        },
        _getWidthOfChar: function(b, c, f, e) {
            if (!this._isMeasuring && this.textAlign === "justify" && this._reSpacesAndTabs.test(c)) {
                return this._getWidthOfSpace(b, f)
            }
            b.save();
            var d = this._applyCharStylesGetWidth(b, c, f, e);
            if (this.charSpacing !== 0) {
                d += this._getWidthOfCharSpacing()
            }
            b.restore();
            return d > 0 ? d : 0
        },
        _getHeightOfChar: function(b, e, d) {
            var c = this._getStyleDeclaration(e, d);
            return c && c.fontSize ? c.fontSize : this.fontSize
        },
        _getWidthOfCharsAt: function(b, g, f) {
            var e = 0,
                d, c;
            for (d = 0; d < f; d++) {
                c = this._textLines[g][d];
                e += this._getWidthOfChar(b, c, g, d)
            }
            return e
        },
        _measureLine: function(b, d) {
            this._isMeasuring = true;
            var c = this._getWidthOfCharsAt(b, d, this._textLines[d].length);
            if (this.charSpacing !== 0) {
                c -= this._getWidthOfCharSpacing()
            }
            this._isMeasuring = false;
            return c > 0 ? c : 0
        },
        _getWidthOfSpace: function(c, h) {
            if (this.__widthOfSpace[h]) {
                return this.__widthOfSpace[h]
            }
            var b = this._textLines[h],
                g = this._getWidthOfWords(c, b, h, 0),
                f = this.width - g,
                d = b.length - b.replace(this._reSpacesAndTabs, "").length,
                e = Math.max(f / d, c.measureText(" ").width);
            this.__widthOfSpace[h] = e;
            return e
        },
        _getWidthOfWords: function(c, b, h, f) {
            var e = 0;
            for (var g = 0; g < b.length; g++) {
                var d = b[g];
                if (!d.match(/\s/)) {
                    e += this._getWidthOfChar(c, d, h, g + f)
                }
            }
            return e
        },
        _getHeightOfLine: function(d, h) {
            if (this.__lineHeights[h]) {
                return this.__lineHeights[h]
            }
            var c = this._textLines[h],
                f = this._getHeightOfChar(d, h, 0);
            for (var e = 1, b = c.length; e < b; e++) {
                var g = this._getHeightOfChar(d, h, e);
                if (g > f) {
                    f = g
                }
            }
            this.__lineHeights[h] = f * this.lineHeight * this._fontSizeMult;
            return this.__lineHeights[h]
        },
        _getTextHeight: function(d) {
            var f, c = 0;
            for (var e = 0, b = this._textLines.length; e < b; e++) {
                f = this._getHeightOfLine(d, e);
                c += (e === b - 1 ? f / this.lineHeight : f)
            }
            return c
        },
        toObject: function(b) {
            return fabric.util.object.extend(this.callSuper("toObject", b), {
                styles: a(this.styles, true)
            })
        }
    });
    fabric.IText.fromObject = function(c, d, b) {
        return fabric.Object._fromObject("IText", c, d, b, "text")
    }
})();
(function() {
    var a = fabric.util.object.clone;
    fabric.util.object.extend(fabric.IText.prototype, {
        initBehavior: function() {
            this.initAddedHandler();
            this.initRemovedHandler();
            this.initCursorSelectionHandlers();
            this.initDoubleClickSimulation();
            this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        },
        onDeselect: function() {
            this.isEditing && this.exitEditing();
            this.selected = false
        },
        initAddedHandler: function() {
            var b = this;
            this.on("added", function() {
                var c = b.canvas;
                if (c) {
                    if (!c._hasITextHandlers) {
                        c._hasITextHandlers = true;
                        b._initCanvasHandlers(c)
                    }
                    c._iTextInstances = c._iTextInstances || [];
                    c._iTextInstances.push(b)
                }
            })
        },
        initRemovedHandler: function() {
            var b = this;
            this.on("removed", function() {
                var c = b.canvas;
                if (c) {
                    c._iTextInstances = c._iTextInstances || [];
                    fabric.util.removeFromArray(c._iTextInstances, b);
                    if (c._iTextInstances.length === 0) {
                        c._hasITextHandlers = false;
                        b._removeCanvasHandlers(c)
                    }
                }
            })
        },
        _initCanvasHandlers: function(b) {
            b._mouseUpITextHandler = (function() {
                if (b._iTextInstances) {
                    b._iTextInstances.forEach(function(c) {
                        c.__isMousedown = false
                    })
                }
            }).bind(this);
            b.on("mouse:up", b._mouseUpITextHandler)
        },
        _removeCanvasHandlers: function(b) {
            b.off("mouse:up", b._mouseUpITextHandler)
        },
        _tick: function() {
            this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete")
        },
        _animateCursor: function(e, c, d, f) {
            var b;
            b = {
                isAborted: false,
                abort: function() {
                    this.isAborted = true
                },
            };
            e.animate("_currentCursorOpacity", c, {
                duration: d,
                onComplete: function() {
                    if (!b.isAborted) {
                        e[f]()
                    }
                },
                onChange: function() {
                    if (e.canvas && e.selectionStart === e.selectionEnd) {
                        e.renderCursorOrSelection()
                    }
                },
                abort: function() {
                    return b.isAborted
                }
            });
            return b
        },
        _onTickComplete: function() {
            var b = this;
            if (this._cursorTimeout1) {
                clearTimeout(this._cursorTimeout1)
            }
            this._cursorTimeout1 = setTimeout(function() {
                b._currentTickCompleteState = b._animateCursor(b, 0, this.cursorDuration / 2, "_tick")
            }, 100)
        },
        initDelayedCursor: function(b) {
            var d = this,
                c = b ? 0 : this.cursorDelay;
            this.abortCursorAnimation();
            this._currentCursorOpacity = 1;
            this._cursorTimeout2 = setTimeout(function() {
                d._tick()
            }, c)
        },
        abortCursorAnimation: function() {
            var b = this._currentTickState || this._currentTickCompleteState;
            this._currentTickState && this._currentTickState.abort();
            this._currentTickCompleteState && this._currentTickCompleteState.abort();
            clearTimeout(this._cursorTimeout1);
            clearTimeout(this._cursorTimeout2);
            this._currentCursorOpacity = 0;
            if (b) {
                this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx)
            }
        },
        selectAll: function() {
            this.selectionStart = 0;
            this.selectionEnd = this.text.length;
            this._fireSelectionChanged();
            this._updateTextarea()
        },
        getSelectedText: function() {
            return this.text.slice(this.selectionStart, this.selectionEnd)
        },
        findWordBoundaryLeft: function(c) {
            var d = 0,
                b = c - 1;
            if (this._reSpace.test(this.text.charAt(b))) {
                while (this._reSpace.test(this.text.charAt(b))) {
                    d++;
                    b--
                }
            }
            while (/\S/.test(this.text.charAt(b)) && b > -1) {
                d++;
                b--
            }
            return c - d
        },
        findWordBoundaryRight: function(c) {
            var d = 0,
                b = c;
            if (this._reSpace.test(this.text.charAt(b))) {
                while (this._reSpace.test(this.text.charAt(b))) {
                    d++;
                    b++
                }
            }
            while (/\S/.test(this.text.charAt(b)) && b < this.text.length) {
                d++;
                b++
            }
            return c + d
        },
        findLineBoundaryLeft: function(c) {
            var d = 0,
                b = c - 1;
            while (!/\n/.test(this.text.charAt(b)) && b > -1) {
                d++;
                b--
            }
            return c - d
        },
        findLineBoundaryRight: function(c) {
            var d = 0,
                b = c;
            while (!/\n/.test(this.text.charAt(b)) && b < this.text.length) {
                d++;
                b++
            }
            return c + d
        },
        getNumNewLinesInSelectedText: function() {
            var e = this.getSelectedText(),
                d = 0;
            for (var c = 0, b = e.length; c < b; c++) {
                if (e[c] === "\n") {
                    d++
                }
            }
            return d
        },
        searchWordBoundary: function(e, f) {
            var d = this._reSpace.test(this.text.charAt(e)) ? e - 1 : e,
                c = this.text.charAt(d),
                b = /[ \n\.,;!\?\-]/;
            while (!b.test(c) && d > 0 && d < this.text.length) {
                d += f;
                c = this.text.charAt(d)
            }
            if (b.test(c) && c !== "\n") {
                d += f === 1 ? 0 : 1
            }
            return d
        },
        selectWord: function(d) {
            d = d || this.selectionStart;
            var b = this.searchWordBoundary(d, -1),
                c = this.searchWordBoundary(d, 1);
            this.selectionStart = b;
            this.selectionEnd = c;
            this._fireSelectionChanged();
            this._updateTextarea();
            this.renderCursorOrSelection()
        },
        selectLine: function(d) {
            d = d || this.selectionStart;
            var b = this.findLineBoundaryLeft(d),
                c = this.findLineBoundaryRight(d);
            this.selectionStart = b;
            this.selectionEnd = c;
            this._fireSelectionChanged();
            this._updateTextarea()
        },
        enterEditing: function(b) {
            if (this.isEditing || !this.editable) {
                return
            }
            if (this.canvas) {
                this.exitEditingOnOthers(this.canvas)
            }
            this.isEditing = true;
            this.initHiddenTextarea(b);
            this.hiddenTextarea.focus();
            this._updateTextarea();
            this._saveEditingProps();
            this._setEditingProps();
            this._textBeforeEdit = this.text;
            this._tick();
            this.fire("editing:entered");
            this._fireSelectionChanged();
            if (!this.canvas) {
                return this
            }
            this.canvas.fire("text:editing:entered", {
                target: this
            });
            this.initMouseMoveHandler();
            this.canvas.renderAll();
            return this
        },
        exitEditingOnOthers: function(b) {
            if (b._iTextInstances) {
                b._iTextInstances.forEach(function(c) {
                    c.selected = false;
                    if (c.isEditing) {
                        c.exitEditing()
                    }
                })
            }
        },
        initMouseMoveHandler: function() {
            this.canvas.on("mouse:move", this.mouseMoveHandler)
        },
        mouseMoveHandler: function(c) {
            if (!this.__isMousedown || !this.isEditing) {
                return
            }
            var b = this.getSelectionStartFromPointer(c.e),
                e = this.selectionStart,
                d = this.selectionEnd;
            if ((b !== this.__selectionStartOnMouseDown || e === d) && (e === b || d === b)) {
                return
            }
            if (b > this.__selectionStartOnMouseDown) {
                this.selectionStart = this.__selectionStartOnMouseDown;
                this.selectionEnd = b
            } else {
                this.selectionStart = b;
                this.selectionEnd = this.__selectionStartOnMouseDown
            }
            if (this.selectionStart !== e || this.selectionEnd !== d) {
                this.restartCursorIfNeeded();
                this._fireSelectionChanged();
                this._updateTextarea();
                this.renderCursorOrSelection()
            }
        },
        _setEditingProps: function() {
            this.hoverCursor = "text";
            if (this.canvas) {
                this.canvas.defaultCursor = this.canvas.moveCursor = "text"
            }
            this.borderColor = this.editingBorderColor;
            this.hasControls = this.selectable = false;
            this.lockMovementX = this.lockMovementY = true
        },
        _updateTextarea: function() {
            if (!this.hiddenTextarea || this.inCompositionMode) {
                return
            }
            this.cursorOffsetCache = {};
            this.hiddenTextarea.value = this.text;
            this.hiddenTextarea.selectionStart = this.selectionStart;
            this.hiddenTextarea.selectionEnd = this.selectionEnd;
            if (this.selectionStart === this.selectionEnd) {
                var b = this._calcTextareaPosition();
                this.hiddenTextarea.style.left = b.left;
                this.hiddenTextarea.style.top = b.top;
                this.hiddenTextarea.style.fontSize = b.fontSize
            }
        },
        _calcTextareaPosition: function() {
            if (!this.canvas) {
                return {
                    x: 1,
                    y: 1
                }
            }
            var h = this.text.split(""),
                e = this._getCursorBoundaries(h, "cursor"),
                i = this.get2DCursorLocation(),
                n = i.lineIndex,
                b = i.charIndex,
                f = this.getCurrentCharFontSize(n, b),
                d = (n === 0 && b === 0) ? this._getLineLeftOffset(this._getLineWidth(this.ctx, n)) : e.leftOffset,
                g = this.calcTransformMatrix(),
                c = {
                    x: e.left + d,
                    y: e.top + e.topOffset + f
                },
                j = this.canvas.upperCanvasEl,
                l = j.width - f,
                k = j.height - f;
            c = fabric.util.transformPoint(c, g);
            c = fabric.util.transformPoint(c, this.canvas.viewportTransform);
            if (c.x < 0) {
                c.x = 0
            }
            if (c.x > l) {
                c.x = l
            }
            if (c.y < 0) {
                c.y = 0
            }
            if (c.y > k) {
                c.y = k
            }
            c.x += this.canvas._offset.left;
            c.y += this.canvas._offset.top;
            return {
                left: c.x + "px",
                top: c.y + "px",
                fontSize: f
            }
        },
        _saveEditingProps: function() {
            this._savedProps = {
                hasControls: this.hasControls,
                borderColor: this.borderColor,
                lockMovementX: this.lockMovementX,
                lockMovementY: this.lockMovementY,
                hoverCursor: this.hoverCursor,
                defaultCursor: this.canvas && this.canvas.defaultCursor,
                moveCursor: this.canvas && this.canvas.moveCursor
            }
        },
        _restoreEditingProps: function() {
            if (!this._savedProps) {
                return
            }
            this.hoverCursor = this._savedProps.overCursor;
            this.hasControls = this._savedProps.hasControls;
            this.borderColor = this._savedProps.borderColor;
            this.lockMovementX = this._savedProps.lockMovementX;
            this.lockMovementY = this._savedProps.lockMovementY;
            if (this.canvas) {
                this.canvas.defaultCursor = this._savedProps.defaultCursor;
                this.canvas.moveCursor = this._savedProps.moveCursor
            }
        },
        exitEditing: function() {
            var b = (this._textBeforeEdit !== this.text);
            this.selected = false;
            this.isEditing = false;
            this.selectable = true;
            this.selectionEnd = this.selectionStart;
            if (this.hiddenTextarea) {
                this.hiddenTextarea.blur && this.hiddenTextarea.blur();
                this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea);
                this.hiddenTextarea = null
            }
            this.abortCursorAnimation();
            this._restoreEditingProps();
            this._currentCursorOpacity = 0;
            this.fire("editing:exited");
            b && this.fire("modified");
            if (this.canvas) {
                this.canvas.off("mouse:move", this.mouseMoveHandler);
                this.canvas.fire("text:editing:exited", {
                    target: this
                });
                b && this.canvas.fire("object:modified", {
                    target: this
                })
            }
            return this
        },
        _removeExtraneousStyles: function() {
            for (var b in this.styles) {
                if (!this._textLines[b]) {
                    delete this.styles[b]
                }
            }
        },
        _removeCharsFromTo: function(c, b) {
            while (b !== c) {
                this._removeSingleCharAndStyle(c + 1);
                b--
            }
            this.selectionStart = c;
            this.selectionEnd = c
        },
        _removeSingleCharAndStyle: function(b) {
            var c = this.text[b - 1] === "\n",
                d = c ? b : b - 1;
            this.removeStyleObject(c, d);
            this.text = this.text.slice(0, b - 1) + this.text.slice(b);
            this._textLines = this._splitTextIntoLines()
        },
        insertChars: function(d, c) {
            var f;
            if (this.selectionEnd - this.selectionStart > 1) {
                this._removeCharsFromTo(this.selectionStart, this.selectionEnd)
            }
            if (!c && this.isEmptyStyles()) {
                this.insertChar(d, false);
                return
            }
            for (var e = 0, b = d.length; e < b; e++) {
                if (c) {
                    f = fabric.util.object.clone(fabric.copiedTextStyle[e], true)
                }
                this.insertChar(d[e], e < b - 1, f)
            }
        },
        insertChar: function(c, e, b) {
            var d = this.text[this.selectionStart] === "\n";
            this.text = this.text.slice(0, this.selectionStart) + c + this.text.slice(this.selectionEnd);
            this._textLines = this._splitTextIntoLines();
            this.insertStyleObjects(c, d, b);
            this.selectionStart += c.length;
            this.selectionEnd = this.selectionStart;
            if (e) {
                return
            }
            this._updateTextarea();
            this.setCoords();
            this._fireSelectionChanged();
            this.fire("changed");
            this.restartCursorIfNeeded();
            if (this.canvas) {
                this.canvas.fire("text:changed", {
                    target: this
                });
                this.canvas.renderAll()
            }
        },
        restartCursorIfNeeded: function() {
            if (!this._currentTickState || this._currentTickState.isAborted || !this._currentTickCompleteState || this._currentTickCompleteState.isAborted) {
                this.initDelayedCursor()
            }
        },
        insertNewlineStyleObject: function(g, f, d) {
            this.shiftLineStyles(g, +1);
            if (!this.styles[g + 1]) {
                this.styles[g + 1] = {}
            }
            var b = {},
                e = {};
            if (this.styles[g] && this.styles[g][f - 1]) {
                b = this.styles[g][f - 1]
            }
            if (d) {
                e[0] = a(b);
                this.styles[g + 1] = e
            } else {
                for (var c in this.styles[g]) {
                    if (parseInt(c, 10) >= f) {
                        e[parseInt(c, 10) - f] = this.styles[g][c];
                        delete this.styles[g][c]
                    }
                }
                this.styles[g + 1] = e
            }
            this._forceClearCache = true
        },
        insertCharStyleObject: function(h, g, e) {
            var c = this.styles[h],
                f = a(c);
            if (g === 0 && !e) {
                g = 1
            }
            for (var b in f) {
                var d = parseInt(b, 10);
                if (d >= g) {
                    c[d + 1] = f[d];
                    if (!f[d - 1]) {
                        delete c[d]
                    }
                }
            }
            this.styles[h][g] = e || a(c[g - 1]);
            this._forceClearCache = true
        },
        insertStyleObjects: function(b, e, c) {
            var d = this.get2DCursorLocation(),
                g = d.lineIndex,
                f = d.charIndex;
            if (!this._getLineStyle(g)) {
                this._setLineStyle(g, {})
            }
            if (b === "\n") {
                this.insertNewlineStyleObject(g, f, e)
            } else {
                this.insertCharStyleObject(g, f, c)
            }
        },
        shiftLineStyles: function(f, e) {
            var d = a(this.styles);
            for (var b in this.styles) {
                var c = parseInt(b, 10);
                if (c > f) {
                    this.styles[c + e] = d[c];
                    if (!d[c - e]) {
                        delete this.styles[c]
                    }
                }
            }
        },
        removeStyleObject: function(d, c) {
            var b = this.get2DCursorLocation(c),
                f = b.lineIndex,
                e = b.charIndex;
            this._removeStyleObject(d, b, f, e)
        },
        _getTextOnPreviousLine: function(b) {
            return this._textLines[b - 1]
        },
        _removeStyleObject: function(d, j, l, b) {
            if (d) {
                var g = this._getTextOnPreviousLine(j.lineIndex),
                    k = g ? g.length : 0;
                if (!this.styles[l - 1]) {
                    this.styles[l - 1] = {}
                }
                for (b in this.styles[l]) {
                    this.styles[l - 1][parseInt(b, 10) + k] = this.styles[l][b]
                }
                this.shiftLineStyles(j.lineIndex, -1)
            } else {
                var h = this.styles[l];
                if (h) {
                    delete h[b]
                }
                var c = a(h);
                for (var f in c) {
                    var e = parseInt(f, 10);
                    if (e >= b && e !== 0) {
                        h[e - 1] = c[e];
                        delete h[e]
                    }
                }
            }
        },
        insertNewline: function() {
            this.insertChars("\n")
        },
        setSelectionStartEndWithShift: function(d, c, b) {
            if (b <= d) {
                if (c === d) {
                    this._selectionDirection = "left"
                } else {
                    if (this._selectionDirection === "right") {
                        this._selectionDirection = "left";
                        this.selectionEnd = d
                    }
                }
                this.selectionStart = b
            } else {
                if (b > d && b < c) {
                    if (this._selectionDirection === "right") {
                        this.selectionEnd = b
                    } else {
                        this.selectionStart = b
                    }
                } else {
                    if (c === d) {
                        this._selectionDirection = "right"
                    } else {
                        if (this._selectionDirection === "left") {
                            this._selectionDirection = "right";
                            this.selectionStart = c
                        }
                    }
                    this.selectionEnd = b
                }
            }
        },
        setSelectionInBoundaries: function() {
            var b = this.text.length;
            if (this.selectionStart > b) {
                this.selectionStart = b
            } else {
                if (this.selectionStart < 0) {
                    this.selectionStart = 0
                }
            }
            if (this.selectionEnd > b) {
                this.selectionEnd = b
            } else {
                if (this.selectionEnd < 0) {
                    this.selectionEnd = 0
                }
            }
        }
    })
})();
fabric.util.object.extend(fabric.IText.prototype, {
    initDoubleClickSimulation: function() {
        this.__lastClickTime = +new Date();
        this.__lastLastClickTime = +new Date();
        this.__lastPointer = {};
        this.on("mousedown", this.onMouseDown.bind(this))
    },
    onMouseDown: function(a) {
        this.__newClickTime = +new Date();
        var b = this.canvas.getPointer(a.e);
        if (this.isTripleClick(b)) {
            this.fire("tripleclick", a);
            this._stopEvent(a.e)
        } else {
            if (this.isDoubleClick(b)) {
                this.fire("dblclick", a);
                this._stopEvent(a.e)
            }
        }
        this.__lastLastClickTime = this.__lastClickTime;
        this.__lastClickTime = this.__newClickTime;
        this.__lastPointer = b;
        this.__lastIsEditing = this.isEditing;
        this.__lastSelected = this.selected
    },
    isDoubleClick: function(a) {
        return this.__newClickTime - this.__lastClickTime < 500 && this.__lastPointer.x === a.x && this.__lastPointer.y === a.y && this.__lastIsEditing
    },
    isTripleClick: function(a) {
        return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === a.x && this.__lastPointer.y === a.y
    },
    _stopEvent: function(a) {
        a.preventDefault && a.preventDefault();
        a.stopPropagation && a.stopPropagation()
    },
    initCursorSelectionHandlers: function() {
        this.initMousedownHandler();
        this.initMouseupHandler();
        this.initClicks()
    },
    initClicks: function() {
        this.on("dblclick", function(a) {
            this.selectWord(this.getSelectionStartFromPointer(a.e))
        });
        this.on("tripleclick", function(a) {
            this.selectLine(this.getSelectionStartFromPointer(a.e))
        })
    },
    initMousedownHandler: function() {
        this.on("mousedown", function(a) {
            if (!this.editable) {
                return
            }
            var b = this.canvas.getPointer(a.e);
            this.__mousedownX = b.x;
            this.__mousedownY = b.y;
            this.__isMousedown = true;
            if (this.selected) {
                this.setCursorByClick(a.e)
            }
            if (this.isEditing) {
                this.__selectionStartOnMouseDown = this.selectionStart;
                if (this.selectionStart === this.selectionEnd) {
                    this.abortCursorAnimation()
                }
                this.renderCursorOrSelection()
            }
        })
    },
    _isObjectMoved: function(a) {
        var b = this.canvas.getPointer(a);
        return this.__mousedownX !== b.x || this.__mousedownY !== b.y
    },
    initMouseupHandler: function() {
        this.on("mouseup", function(a) {
            this.__isMousedown = false;
            if (!this.editable || this._isObjectMoved(a.e)) {
                return
            }
            if (this.__lastSelected && !this.__corner) {
                this.enterEditing(a.e);
                if (this.selectionStart === this.selectionEnd) {
                    this.initDelayedCursor(true)
                } else {
                    this.renderCursorOrSelection()
                }
            }
            this.selected = true
        })
    },
    setCursorByClick: function(c) {
        var a = this.getSelectionStartFromPointer(c),
            d = this.selectionStart,
            b = this.selectionEnd;
        if (c.shiftKey) {
            this.setSelectionStartEndWithShift(d, b, a)
        } else {
            this.selectionStart = a;
            this.selectionEnd = a
        }
        if (this.isEditing) {
            this._fireSelectionChanged();
            this._updateTextarea()
        }
    },
    getSelectionStartFromPointer: function(m) {
        var h = this.getLocalPointer(m),
            n = 0,
            b = 0,
            p = 0,
            a = 0,
            c, q;
        for (var g = 0, l = this._textLines.length; g < l; g++) {
            q = this._textLines[g];
            p += this._getHeightOfLine(this.ctx, g) * this.scaleY;
            var f = this._getLineWidth(this.ctx, g),
                k = this._getLineLeftOffset(f);
            b = k * this.scaleX;
            for (var d = 0, o = q.length; d < o; d++) {
                n = b;
                b += this._getWidthOfChar(this.ctx, q[d], g, this.flipX ? o - d : d) * this.scaleX;
                if (p <= h.y || b <= h.x) {
                    a++;
                    continue
                }
                return this._getNewSelectionStartFromOffset(h, n, b, a + g, o)
            }
            if (h.y < p) {
                return this._getNewSelectionStartFromOffset(h, n, b, a + g - 1, o)
            }
        }
        if (typeof c === "undefined") {
            return this.text.length
        }
    },
    _getNewSelectionStartFromOffset: function(d, g, a, f, i) {
        var e = d.x - g,
            h = a - d.x,
            c = h > e ? 0 : 1,
            b = f + c;
        if (this.flipX) {
            b = i - b
        }
        if (b > this.text.length) {
            b = this.text.length
        }
        return b
    }
});
fabric.util.object.extend(fabric.IText.prototype, {
    initHiddenTextarea: function() {
        this.hiddenTextarea = fabric.document.createElement("textarea");
        this.hiddenTextarea.setAttribute("autocapitalize", "off");
        var a = this._calcTextareaPosition();
        this.hiddenTextarea.style.cssText = "position: absolute; top: " + a.top + "; left: " + a.left + "; opacity: 0; width: 0px; height: 0px; z-index: -999;";
        fabric.document.body.appendChild(this.hiddenTextarea);
        fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "keyup", this.onKeyUp.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "cut", this.cut.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "compositionstart", this.onCompositionStart.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "compositionupdate", this.onCompositionUpdate.bind(this));
        fabric.util.addListener(this.hiddenTextarea, "compositionend", this.onCompositionEnd.bind(this));
        if (!this._clickHandlerInitialized && this.canvas) {
            fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this));
            this._clickHandlerInitialized = true
        }
    },
    _keysMap: {
        8: "removeChars",
        9: "exitEditing",
        27: "exitEditing",
        13: "insertNewline",
        33: "moveCursorUp",
        34: "moveCursorDown",
        35: "moveCursorRight",
        36: "moveCursorLeft",
        37: "moveCursorLeft",
        38: "moveCursorUp",
        39: "moveCursorRight",
        40: "moveCursorDown",
        46: "forwardDelete"
    },
    _ctrlKeysMapUp: {
        67: "copy",
        88: "cut"
    },
    _ctrlKeysMapDown: {
        65: "selectAll"
    },
    onClick: function() {
        this.hiddenTextarea && this.hiddenTextarea.focus()
    },
    onKeyDown: function(a) {
        if (!this.isEditing) {
            return
        }
        if (a.keyCode in this._keysMap) {
            this[this._keysMap[a.keyCode]](a)
        } else {
            if ((a.keyCode in this._ctrlKeysMapDown) && (a.ctrlKey || a.metaKey)) {
                this[this._ctrlKeysMapDown[a.keyCode]](a)
            } else {
                return
            }
        }
        a.stopImmediatePropagation();
        a.preventDefault();
        if (a.keyCode >= 33 && a.keyCode <= 40) {
            this.clearContextTop();
            this.renderCursorOrSelection()
        } else {
            this.canvas && this.canvas.renderAll()
        }
    },
    onKeyUp: function(a) {
        if (!this.isEditing || this._copyDone) {
            this._copyDone = false;
            return
        }
        if ((a.keyCode in this._ctrlKeysMapUp) && (a.ctrlKey || a.metaKey)) {
            this[this._ctrlKeysMapUp[a.keyCode]](a)
        } else {
            return
        }
        a.stopImmediatePropagation();
        a.preventDefault();
        this.canvas && this.canvas.renderAll()
    },
    onInput: function(f) {
        if (!this.isEditing || this.inCompositionMode) {
            return
        }
        var h = this.selectionStart || 0,
            g = this.selectionEnd || 0,
            c = this.text.length,
            a = this.hiddenTextarea.value.length,
            d, b, i;
        if (a > c) {
            i = this._selectionDirection === "left" ? g : h;
            d = a - c;
            b = this.hiddenTextarea.value.slice(i, i + d)
        } else {
            d = a - c + g - h;
            b = this.hiddenTextarea.value.slice(h, h + d)
        }
        this.insertChars(b);
        f.stopPropagation()
    },
    onCompositionStart: function() {
        this.inCompositionMode = true;
        this.prevCompositionLength = 0;
        this.compositionStart = this.selectionStart
    },
    onCompositionEnd: function() {
        this.inCompositionMode = false
    },
    onCompositionUpdate: function(b) {
        var a = b.data;
        this.selectionStart = this.compositionStart;
        this.selectionEnd = this.selectionEnd === this.selectionStart ? this.compositionStart + this.prevCompositionLength : this.selectionEnd;
        this.insertChars(a, false);
        this.prevCompositionLength = a.length
    },
    forwardDelete: function(a) {
        if (this.selectionStart === this.selectionEnd) {
            if (this.selectionStart === this.text.length) {
                return
            }
            this.moveCursorRight(a)
        }
        this.removeChars(a)
    },
    copy: function(a) {
        if (this.selectionStart === this.selectionEnd) {
            return
        }
        var c = this.getSelectedText(),
            b = this._getClipboardData(a);
        if (b) {
            b.setData("text", c)
        }
        fabric.copiedText = c;
        fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd);
        a.stopImmediatePropagation();
        a.preventDefault();
        this._copyDone = true
    },
    paste: function(c) {
        var b = null,
            d = this._getClipboardData(c),
            a = true;
        if (d) {
            b = d.getData("text").replace(/\r/g, "");
            if (!fabric.copiedTextStyle || fabric.copiedText !== b) {
                a = false
            }
        } else {
            b = fabric.copiedText
        }
        if (b) {
            this.insertChars(b, a)
        }
        c.stopImmediatePropagation();
        c.preventDefault()
    },
    cut: function(a) {
        if (this.selectionStart === this.selectionEnd) {
            return
        }
        this.copy(a);
        this.removeChars(a)
    },
    _getClipboardData: function(a) {
        return (a && a.clipboardData) || fabric.window.clipboardData
    },
    _getWidthBeforeCursor: function(g, f) {
        var h = this._textLines[g].slice(0, f),
            e = this._getLineWidth(this.ctx, g),
            d = this._getLineLeftOffset(e),
            b;
        for (var c = 0, a = h.length; c < a; c++) {
            b = h[c];
            d += this._getWidthOfChar(this.ctx, b, g, c)
        }
        return d
    },
    getDownCursorOffset: function(f, i) {
        var d = this._getSelectionForOffset(f, i),
            g = this.get2DCursorLocation(d),
            j = g.lineIndex;
        if (j === this._textLines.length - 1 || f.metaKey || f.keyCode === 34) {
            return this.text.length - d
        }
        var a = g.charIndex,
            c = this._getWidthBeforeCursor(j, a),
            b = this._getIndexOnLine(j + 1, c),
            h = this._textLines[j].slice(a);
        return h.length + b + 2
    },
    _getSelectionForOffset: function(b, a) {
        if (b.shiftKey && this.selectionStart !== this.selectionEnd && a) {
            return this.selectionEnd
        } else {
            return this.selectionStart
        }
    },
    getUpCursorOffset: function(g, i) {
        var f = this._getSelectionForOffset(g, i),
            h = this.get2DCursorLocation(f),
            j = h.lineIndex;
        if (j === 0 || g.metaKey || g.keyCode === 33) {
            return -f
        }
        var a = h.charIndex,
            c = this._getWidthBeforeCursor(j, a),
            b = this._getIndexOnLine(j - 1, c),
            d = this._textLines[j].slice(0, a);
        return -this._textLines[j - 1].length + b - d.length
    },
    _getIndexOnLine: function(q, b) {
        var g = this._getLineWidth(this.ctx, q),
            l = this._textLines[q],
            h = this._getLineLeftOffset(g),
            e = h,
            p = 0,
            k;
        for (var d = 0, o = l.length; d < o; d++) {
            var n = l[d],
                i = this._getWidthOfChar(this.ctx, n, q, d);
            e += i;
            if (e > b) {
                k = true;
                var a = e - i,
                    m = e,
                    f = Math.abs(a - b),
                    c = Math.abs(m - b);
                p = c < f ? d : (d - 1);
                break
            }
        }
        if (!k) {
            p = l.length - 1
        }
        return p
    },
    moveCursorDown: function(a) {
        if (this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length) {
            return
        }
        this._moveCursorUpOrDown("Down", a)
    },
    moveCursorUp: function(a) {
        if (this.selectionStart === 0 && this.selectionEnd === 0) {
            return
        }
        this._moveCursorUpOrDown("Up", a)
    },
    _moveCursorUpOrDown: function(c, b) {
        var a = "get" + c + "CursorOffset",
            d = this[a](b, this._selectionDirection === "right");
        if (b.shiftKey) {
            this.moveCursorWithShift(d)
        } else {
            this.moveCursorWithoutShift(d)
        }
        if (d !== 0) {
            this.setSelectionInBoundaries();
            this.abortCursorAnimation();
            this._currentCursorOpacity = 1;
            this.initDelayedCursor();
            this._fireSelectionChanged();
            this._updateTextarea()
        }
    },
    moveCursorWithShift: function(b) {
        var a = this._selectionDirection === "left" ? this.selectionStart + b : this.selectionEnd + b;
        this.setSelectionStartEndWithShift(this.selectionStart, this.selectionEnd, a);
        return b !== 0
    },
    moveCursorWithoutShift: function(a) {
        if (a < 0) {
            this.selectionStart += a;
            this.selectionEnd = this.selectionStart
        } else {
            this.selectionEnd += a;
            this.selectionStart = this.selectionEnd
        }
        return a !== 0
    },
    moveCursorLeft: function(a) {
        if (this.selectionStart === 0 && this.selectionEnd === 0) {
            return
        }
        this._moveCursorLeftOrRight("Left", a)
    },
    _move: function(c, d, b) {
        var a;
        if (c.altKey) {
            a = this["findWordBoundary" + b](this[d])
        } else {
            if (c.metaKey || c.keyCode === 35 || c.keyCode === 36) {
                a = this["findLineBoundary" + b](this[d])
            } else {
                this[d] += b === "Left" ? -1 : 1;
                return true
            }
        }
        if (typeof a !== undefined && this[d] !== a) {
            this[d] = a;
            return true
        }
    },
    _moveLeft: function(a, b) {
        return this._move(a, b, "Left")
    },
    _moveRight: function(a, b) {
        return this._move(a, b, "Right")
    },
    moveCursorLeftWithoutShift: function(a) {
        var b = true;
        this._selectionDirection = "left";
        if (this.selectionEnd === this.selectionStart && this.selectionStart !== 0) {
            b = this._moveLeft(a, "selectionStart")
        }
        this.selectionEnd = this.selectionStart;
        return b
    },
    moveCursorLeftWithShift: function(a) {
        if (this._selectionDirection === "right" && this.selectionStart !== this.selectionEnd) {
            return this._moveLeft(a, "selectionEnd")
        } else {
            if (this.selectionStart !== 0) {
                this._selectionDirection = "left";
                return this._moveLeft(a, "selectionStart")
            }
        }
    },
    moveCursorRight: function(a) {
        if (this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length) {
            return
        }
        this._moveCursorLeftOrRight("Right", a)
    },
    _moveCursorLeftOrRight: function(c, b) {
        var a = "moveCursor" + c + "With";
        this._currentCursorOpacity = 1;
        if (b.shiftKey) {
            a += "Shift"
        } else {
            a += "outShift"
        }
        if (this[a](b)) {
            this.abortCursorAnimation();
            this.initDelayedCursor();
            this._fireSelectionChanged();
            this._updateTextarea()
        }
    },
    moveCursorRightWithShift: function(a) {
        if (this._selectionDirection === "left" && this.selectionStart !== this.selectionEnd) {
            return this._moveRight(a, "selectionStart")
        } else {
            if (this.selectionEnd !== this.text.length) {
                this._selectionDirection = "right";
                return this._moveRight(a, "selectionEnd")
            }
        }
    },
    moveCursorRightWithoutShift: function(a) {
        var b = true;
        this._selectionDirection = "right";
        if (this.selectionStart === this.selectionEnd) {
            b = this._moveRight(a, "selectionStart");
            this.selectionEnd = this.selectionStart
        } else {
            this.selectionStart = this.selectionEnd
        }
        return b
    },
    removeChars: function(a) {
        if (this.selectionStart === this.selectionEnd) {
            this._removeCharsNearCursor(a)
        } else {
            this._removeCharsFromTo(this.selectionStart, this.selectionEnd)
        }
        this.set("dirty", true);
        this.setSelectionEnd(this.selectionStart);
        this._removeExtraneousStyles();
        this.canvas && this.canvas.renderAll();
        this.setCoords();
        this.fire("changed");
        this.canvas && this.canvas.fire("text:changed", {
            target: this
        })
    },
    _removeCharsNearCursor: function(c) {
        if (this.selectionStart === 0) {
            return
        }
        if (c.metaKey) {
            var a = this.findLineBoundaryLeft(this.selectionStart);
            this._removeCharsFromTo(a, this.selectionStart);
            this.setSelectionStart(a)
        } else {
            if (c.altKey) {
                var b = this.findWordBoundaryLeft(this.selectionStart);
                this._removeCharsFromTo(b, this.selectionStart);
                this.setSelectionStart(b)
            } else {
                this._removeSingleCharAndStyle(this.selectionStart);
                this.setSelectionStart(this.selectionStart - 1)
            }
        }
    }
});
(function() {
    var a = fabric.util.toFixed;
    fabric.util.object.extend(fabric.IText.prototype, {
        _setSVGTextLineText: function(g, f, c, d, b, e) {
            if (!this._getLineStyle(g)) {
                fabric.Text.prototype._setSVGTextLineText.call(this, g, f, c, d, b)
            } else {
                this._setSVGTextLineChars(g, f, c, d, e)
            }
        },
        _setSVGTextLineChars: function(p, b, o, d, f) {
            var l = this._textLines[p],
                m = 0,
                h = this._getLineLeftOffset(this._getLineWidth(this.ctx, p)) - this.width / 2,
                e = this._getSVGLineTopOffset(p),
                c = this._getHeightOfLine(this.ctx, p);
            for (var g = 0, j = l.length; g < j; g++) {
                var n = this._getStyleDeclaration(p, g) || {};
                b.push(this._createTextCharSpan(l[g], n, h, e.lineTop + e.offset, m));
                var k = this._getWidthOfChar(this.ctx, l[g], p, g);
                if (n.textBackgroundColor) {
                    f.push(this._createTextCharBg(n, h, e.lineTop, c, k, m))
                }
                m += k
            }
        },
        _getSVGLineTopOffset: function(e) {
            var d = 0,
                c = 0;
            for (var b = 0; b < e; b++) {
                d += this._getHeightOfLine(this.ctx, b)
            }
            c = this._getHeightOfLine(this.ctx, b);
            return {
                lineTop: d,
                offset: (this._fontSizeMult - this._fontSizeFraction) * c / (this.lineHeight * this._fontSizeMult)
            }
        },
        _createTextCharBg: function(c, h, g, e, b, f) {
            var d = fabric.Object.NUM_FRACTION_DIGITS;
            return ['\t\t<rect fill="', c.textBackgroundColor, '" x="', a(h + f, d), '" y="', a(g - this.height / 2, d), '" width="', a(b, d), '" height="', a(e / this.lineHeight, d), '"></rect>\n'].join("")
        },
        _createTextCharSpan: function(c, b, h, g, f) {
            var d = fabric.Object.NUM_FRACTION_DIGITS;
            var e = this.getSvgStyles.call(fabric.util.object.extend({
                visible: true,
                fill: this.fill,
                stroke: this.stroke,
                type: "text",
                getSvgFilter: fabric.Object.prototype.getSvgFilter
            }, b));
            return ['<tspan x="', a(h + f, d), '" y="', a(g - this.height / 2, d), '" ', (b.fontFamily ? 'font-family="' + b.fontFamily.replace(/"/g, "'") + '" ' : ""), (b.fontSize ? 'font-size="' + b.fontSize + '" ' : ""), (b.fontStyle ? 'font-style="' + b.fontStyle + '" ' : ""), (b.fontWeight ? 'font-weight="' + b.fontWeight + '" ' : ""), (b.textDecoration ? 'text-decoration="' + b.textDecoration + '" ' : ""), 'style="', e, '">', fabric.util.string.escapeXml(c), "</tspan>"].join("")
        }
    })
})();
(function(a) {
    var b = a.fabric || (a.fabric = {});
    b.Textbox = b.util.createClass(b.IText, b.Observable, {
        type: "textbox",
        minWidth: 20,
        dynamicMinWidth: 2,
        __cachedLines: null,
        lockScalingY: true,
        lockScalingFlip: true,
        noScaleCache: false,
        initialize: function(d, c) {
            this.callSuper("initialize", d, c);
            this.setControlsVisibility(b.Textbox.getTextboxControlVisibility());
            this.ctx = this.objectCaching ? this._cacheContext : b.util.createCanvasElement().getContext("2d");
            this._dimensionAffectingProps.push("width")
        },
        _initDimensions: function(c) {
            if (this.__skipDimension) {
                return
            }
            if (!c) {
                c = b.util.createCanvasElement().getContext("2d");
                this._setTextStyles(c);
                this.clearContextTop()
            }
            this.dynamicMinWidth = 0;
            this._textLines = this._splitTextIntoLines(c);
            if (this.dynamicMinWidth > this.width) {
                this._set("width", this.dynamicMinWidth)
            }
            this._clearCache();
            this.height = this._getTextHeight(c)
        },
        _generateStyleMap: function() {
            var g = 0,
                f = 0,
                c = 0,
                e = {};
            for (var d = 0; d < this._textLines.length; d++) {
                if (this.text[c] === "\n" && d > 0) {
                    f = 0;
                    c++;
                    g++
                } else {
                    if (this.text[c] === " " && d > 0) {
                        f++;
                        c++
                    }
                }
                e[d] = {
                    line: g,
                    offset: f
                };
                c += this._textLines[d].length;
                f += this._textLines[d].length
            }
            return e
        },
        _getStyleDeclaration: function(f, e, d) {
            if (this._styleMap) {
                var c = this._styleMap[f];
                if (!c) {
                    return d ? {} : null
                }
                f = c.line;
                e = c.offset + e
            }
            return this.callSuper("_getStyleDeclaration", f, e, d)
        },
        _setStyleDeclaration: function(f, e, c) {
            var d = this._styleMap[f];
            f = d.line;
            e = d.offset + e;
            this.styles[f][e] = c
        },
        _deleteStyleDeclaration: function(e, d) {
            var c = this._styleMap[e];
            e = c.line;
            d = c.offset + d;
            delete this.styles[e][d]
        },
        _getLineStyle: function(d) {
            var c = this._styleMap[d];
            return this.styles[c.line]
        },
        _setLineStyle: function(e, c) {
            var d = this._styleMap[e];
            this.styles[d.line] = c
        },
        _deleteLineStyle: function(d) {
            var c = this._styleMap[d];
            delete this.styles[c.line]
        },
        _wrapText: function(d, g) {
            var c = g.split(this._reNewline),
                e = [],
                f;
            for (f = 0; f < c.length; f++) {
                e = e.concat(this._wrapLine(d, c[f], f))
            }
            return e
        },
        _measureText: function(d, j, h, g) {
            var f = 0;
            g = g || 0;
            for (var e = 0, c = j.length; e < c; e++) {
                f += this._getWidthOfChar(d, j[e], h, e + g)
            }
            return f
        },
        _wrapLine: function(p, n, o) {
            var k = 0,
                r = [],
                s = "",
                m = n.split(" "),
                e = "",
                g = 0,
                l = " ",
                q = 0,
                d = 0,
                c = 0,
                f = true,
                j = this._getWidthOfCharSpacing();
            for (var h = 0; h < m.length; h++) {
                e = m[h];
                q = this._measureText(p, e, o, g);
                g += e.length;
                k += d + q - j;
                if (k >= this.width && !f) {
                    r.push(s);
                    s = "";
                    k = q;
                    f = true
                } else {
                    k += j
                }
                if (!f) {
                    s += l
                }
                s += e;
                d = this._measureText(p, l, o, g);
                g++;
                f = false;
                if (q > c) {
                    c = q
                }
            }
            h && r.push(s);
            if (c > this.dynamicMinWidth) {
                this.dynamicMinWidth = c - j
            }
            return r
        },
        _splitTextIntoLines: function(d) {
            d = d || this.ctx;
            var e = this.textAlign;
            this._styleMap = null;
            d.save();
            this._setTextStyles(d);
            this.textAlign = "left";
            var c = this._wrapText(d, this.text);
            this.textAlign = e;
            d.restore();
            this._textLines = c;
            this._styleMap = this._generateStyleMap();
            return c
        },
        setOnGroup: function(c, d) {
            if (c === "scaleX") {
                this.set("scaleX", Math.abs(1 / d));
                this.set("width", (this.get("width") * d) / (typeof this.__oldScaleX === "undefined" ? 1 : this.__oldScaleX));
                this.__oldScaleX = d
            }
        },
        get2DCursorLocation: function(g) {
            if (typeof g === "undefined") {
                g = this.selectionStart
            }
            var d = this._textLines.length,
                h = 0;
            for (var e = 0; e < d; e++) {
                var c = this._textLines[e],
                    f = c.length;
                if (g <= h + f) {
                    return {
                        lineIndex: e,
                        charIndex: g - h
                    }
                }
                h += f;
                if (this.text[h] === "\n" || this.text[h] === " ") {
                    h++
                }
            }
            return {
                lineIndex: d - 1,
                charIndex: this._textLines[d - 1].length
            }
        },
        _getCursorBoundariesOffsets: function(h, c) {
            var g = 0,
                j = 0,
                e = this.get2DCursorLocation(),
                d = this._textLines[e.lineIndex].split(""),
                k = this._getLineLeftOffset(this._getLineWidth(this.ctx, e.lineIndex));
            for (var f = 0; f < e.charIndex; f++) {
                j += this._getWidthOfChar(this.ctx, d[f], e.lineIndex, f)
            }
            for (f = 0; f < e.lineIndex; f++) {
                g += this._getHeightOfLine(this.ctx, f)
            }
            if (c === "cursor") {
                g += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, e.lineIndex) / this.lineHeight - this.getCurrentCharFontSize(e.lineIndex, e.charIndex) * (1 - this._fontSizeFraction)
            }
            return {
                top: g,
                left: j,
                lineLeft: k
            }
        },
        getMinWidth: function() {
            return Math.max(this.minWidth, this.dynamicMinWidth)
        },
        toObject: function(c) {
            return this.callSuper("toObject", ["minWidth"].concat(c))
        }
    });
    b.Textbox.fromObject = function(d, e, c) {
        return b.Object._fromObject("Textbox", d, e, c, "text")
    };
    b.Textbox.getTextboxControlVisibility = function() {
        return {
            tl: false,
            tr: false,
            br: false,
            bl: false,
            ml: true,
            mt: false,
            mr: true,
            mb: false,
            mtr: true
        }
    }
})(typeof exports !== "undefined" ? exports : this);
(function() {
    var a = fabric.Canvas.prototype._setObjectScale;
    fabric.Canvas.prototype._setObjectScale = function(i, d, g, e, f, c, h) {
        var k = d.target;
        if (k instanceof fabric.Textbox) {
            var j = k.width * ((i.x / d.scaleX) / (k.width + k.strokeWidth));
            if (j >= k.getMinWidth()) {
                k.set("width", j);
                return true
            }
        } else {
            return a.call(fabric.Canvas.prototype, i, d, g, e, f, c, h)
        }
    };
    fabric.Group.prototype._refreshControlsVisibility = function() {
        if (typeof fabric.Textbox === "undefined") {
            return
        }
        for (var c = this._objects.length; c--;) {
            if (this._objects[c] instanceof fabric.Textbox) {
                this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility());
                return
            }
        }
    };
    var b = fabric.util.object.clone;
    fabric.util.object.extend(fabric.Textbox.prototype, {
        _removeExtraneousStyles: function() {
            for (var c in this._styleMap) {
                if (!this._textLines[c]) {
                    delete this.styles[this._styleMap[c].line]
                }
            }
        },
        insertCharStyleObject: function(f, e, c) {
            var d = this._styleMap[f];
            f = d.line;
            e = d.offset + e;
            fabric.IText.prototype.insertCharStyleObject.apply(this, [f, e, c])
        },
        insertNewlineStyleObject: function(f, e, c) {
            var d = this._styleMap[f];
            f = d.line;
            e = d.offset + e;
            fabric.IText.prototype.insertNewlineStyleObject.apply(this, [f, e, c])
        },
        shiftLineStyles: function(h, g) {
            var f = b(this.styles),
                e = this._styleMap[h];
            h = e.line;
            for (var c in this.styles) {
                var d = parseInt(c, 10);
                if (d > h) {
                    this.styles[d + g] = f[d];
                    if (!f[d - g]) {
                        delete this.styles[d]
                    }
                }
            }
        },
        _getTextOnPreviousLine: function(c) {
            var d = this._textLines[c - 1];
            while (this._styleMap[c - 2] && this._styleMap[c - 2].line === this._styleMap[c - 1].line) {
                d = this._textLines[c - 2] + d;
                c--
            }
            return d
        },
        removeStyleObject: function(e, d) {
            var c = this.get2DCursorLocation(d),
                f = this._styleMap[c.lineIndex],
                h = f.line,
                g = f.offset + c.charIndex;
            this._removeStyleObject(e, c, h, g)
        }
    })
})();
(function() {
    var a = fabric.IText.prototype._getNewSelectionStartFromOffset;
    fabric.IText.prototype._getNewSelectionStartFromOffset = function(h, g, f, c, b) {
        c = a.call(this, h, g, f, c, b);
        var e = 0,
            j = 0;
        for (var d = 0; d < this._textLines.length; d++) {
            e += this._textLines[d].length;
            if (e + j >= c) {
                break
            }
            if (this.text[e + j] === "\n" || this.text[e + j] === " ") {
                j++
            }
        }
        return c - d + j
    }
})();