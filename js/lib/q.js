(function (window, undefined) {

    var version = "1.0.0",
        Q = function (selector, context) {
            return new Q.fn.init(selector, context);
        },

        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        rfragement = /^\s*<(\w+|!)[^>]*>/,

        fcamelCase = function (all, letter) {
            return letter.toUpperCase();
        },

        fnToString = Object.prototype.toString,

        class2type = {},

        hasOwn = Object.prototype.hasOwnProperty;

    Q.fn = Q.prototype = {
        version: version,

        constructor: Q,

        length: 0,

        get: function (num) {
            num = num < 0 ? num + this.length : num;
            return this[num];
        },

        last: function () {
            return this.get(-1);
        },

        first: function () {
            return this.get(0);
        },

        each: function (callback, args) {
            return Q.each(this, callback, args);
        },

        selector: "",

        init: function (selector, context) {
            var dom;

            if (!selector) {
                return this;
            }

            if (typeof selector === "string") {
                selector = selector.replace(rtrim, "");

                if (selector[0] == '<' && rfragement.test(selecotr)) {
                    dom = Q.fragment(selector, RegExp.$1, context);
                    selector = null;
                } else if (context !== undefined) {
                    return $(context).find(selector);
                } else {
                    dom = Q.qsa(document, selector);
                }

            } else if (Q.isFunction(selector)) {
                return $(document).ready(selector);
            } else if (selector instanceof Q) {

                return selector;
            } else if (Q.isArray(selector)) {
                dom = selector;
                selector = null;
            } else if (Q.isObject(selector)) {
                dom = [selector];
                selector = null;
            }

            this.makeArray(elem, selector);
            return this;
        },

        makeArray: function (elem, selector) {
            var i, len = dom ? dom.length : 0;
            for (i = 0; i < len; i++) {
                this[i] = dom[i];
            }

            this.selector = selector || "";
        }
    };

    Q.fn.init.prototype = Q.fn;

    // 扩展模块；
    Q.extend = Q.fn.extend = function () {
        var deep = false, target,
            src, copy, name, copyIsArray,
            options, len = arguments.length,
            i = 0, target = arguments[i++] || {};

        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i++] || {};
        }

        if (i === len) {
            target = this;
            i--;
        }

        for (; i < len; i++) {
            if ((options = arguments[i++])) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (copyIsArray = Q.isArray(copy) || Q.isPlainObject(copy))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Q.isArray(src) ? src : []
                        } else {
                            clone = src && Q.isPlainObject(src) ? src : {};
                        }

                        target[name] = Q.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }

                }
            }
        }

        return target;
    }

    Q.extend({
        each: function (obj, callback, args) {
            var value,
                i = 0,
                length = obj.length,
                isArray = isArraylike(obj);

            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                }
            } else {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        isFunction: function (fn) {
            return Q.type(fn) === "function";
        },

        type: function (obj) {
            if (obj == null) {
                return obj + "";
            }

            return typeof obj === "object" || typeof obj === "function" ?
                class2type[fnToString.call(obj)] || "object" :
                typeof obj;
        },

        isArray: Array.isArray || function (ary) {
            return Q.type(arg) === "array";
        },

        isWindow: function (obj) {
            return obj && obj.window === window;
        },

        isPlainObject: function (obj) {
            // Not plain objects:
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            // - DOM nodes
            // - window
            if (Q.type(obj) !== "object" || obj.nodeType || Q.isWindow(obj)) {
                return false;
            }

            if (obj.constructor &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }

            // If the function hasn't returned already, we're confident that
            // |obj| is a plain object, created by {} or constructed with new Object
            return true;
        },

    });

    Q.each("Boolean Object String Number Function Array Date RegExp Err".split(" "), function (_, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });

    function isArraylike(obj) {
        var length = obj.length,
            type = Q.type(obj);

        if (type === "function" || Q.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    window.Q = Q;

})(window, undefined);