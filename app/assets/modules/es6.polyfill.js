// The MIT License (MIT) Copyright (c) 2017 uupaa
// ECMA-262 Script version 6/7 polyfill, fallback and shims for WebApp/2 migration
// https://github.com/uupaa/ES.js

(function(global) {
"use strict";

var ES6 = {
    "Object": {
        "assign":           Object_assign,
        "is":               Object_is,
    },
    "Array": {
        "of":               Array_of,
        "from":             Array_from,
        "prototype": {
            "entries":      Array_entries,
            "keys":         Array_keys,
            "fill":         Array_fill,
            "find":         Array_find,
            "findIndex":    Array_findIndex,
            "values":       Array_values,
            "copyWithin":   Array_copyWithin,
        }
    },
    "String": {
      //"raw":              String_raw
        "fromCodePoint":    String_fromCodePoint,
        "prototype": {
            "repeat":       String_repeat,
            "codePointAt":  String_codePointAt,
            "has":          String_includes,
            "includes":     String_includes,
          //"normalize":    String_normalize,
            "startsWith":   String_startsWith,
            "endsWith":     String_endsWith,
        }
    },
    "Number": {
        "isNaN":            Number_isNaN,
        "isFinite":         Number_isFinite,
        "isInteger":        Number_isInteger,
        "isSafeInteger":    Number_isSafeInteger,
        "parseInt":         global.parseInt,
        "parseFloat":       global.parseFloat,
        "NaN":              global.NaN,
        "EPSILON":          2.2204460492503130808472633361816E-16,
        "MAX_VALUE":        1.7976931348623157E+308,
        "MIN_VALUE":        5E-324,
        "MAX_SAFE_INTEGER": 9007199254740991,
        "MIN_SAFE_INTEGER": -9007199254740991,
        "POSITIVE_INFINITY":Infinity,
        "NEGATIVE_INFINITY":-Infinity,
    },
    "Math": {
        "acosh":            function(x) { return                       Math.log(x + Math.sqrt(x * x - 1)); },
        "asinh":            function(x) { return x === -Infinity ? x : Math.log(x + Math.sqrt(x * x + 1)); },
        "atanh":            function(x) { return Math.log( (1 + x) / (1 - x) ) / 2; },
        "cbrt":             function(x) { var y = Math.pow( Math.abs(x), 1 / 3 ); return x < 0 ? -y : y; },
        "clz32":            Math_clz32,
        "cosh":             function(x) { var y = Math.exp(x); return (y + 1 / y) / 2; },
        "expm1":            function(x) { return Math.exp(x) - 1; },
        "fround":           Math_fround,
        "hypot":            Math_hypot,
        "imul":             Math_imul,
        "log10":            function(x) { return Math.log(x) / Math.LN10; },
        "log1p":            function(x) { return Math.log(1 + x); },
        "log2":             function(x) { return Math.log(x) / Math.LN2; },
        "sign":             function(x) { var y = Number(x); return (y === 0 || isNaN(y)) ? y : (y > 0 ? 1 : -1); },
        "sinh":             function(x) { var y = Math.exp(x); return (y - 1 / y) / 2; },
        "tanh":             Math_tanh,
        "trunc":            function(x) { return x < 0 ? Math.ceil(x) : Math.floor(x); },
        "LOG2E":            1.442,
        "LOG10E":           0.4342944819032518,
    },
    "Set":                  Set,
    "WeakSet":              WeakSet,
    "Map":                  Map,
    "WeakMap":              WeakMap,
};

var ES7 = {
    "Object": {
        "values":           Object_values,
        "entries":          Object_entries,
    },
    "Array": {
        "prototype": {
            "includes":     Array_includes,
        }
    }
};

if (Function.prototype.name === undefined) {
    Object.defineProperty(Function.prototype, "name", {
        "configurable": true,
        "enumerable": false,
        "get": function() {
            return this.toString().split(" ")[1].split(/[^\w$]/)[0];
        }
    });
}
if (/a/i["flags"] !== "i") {
    Object.defineProperty(RegExp.prototype, "flags", {
        "configurable": true,
        "enumerable": false,
        "get": function() {
            return this.toString().match(/[gimuy]*$/)[0];
        }
    });
}

function Set(iterable) {
    Set_constructor.call(this, iterable);
}
Set["prototype"] = (Object.create)(Set, {
    "constructor":  { "value": Set              },
    "size":         { "get":   Set_size         },
    "add":          { "value": Set_add          },
    "has":          { "value": Set_has          },
    "values":       { "value": Set_values       },
    "entries":      { "value": Set_entries      },
    "forEach":      { "value": Set_forEach      },
    "delete":       { "value": Set_delete       },
    "clear":        { "value": Set_clear        },
    "@@iterator":   { "value": Set_entries      },
});

function WeakSet(iterable) {
    WeakSet_constructor.call(this, iterable);
}
WeakSet["prototype"] = (Object.create)(WeakSet, {
    "constructor":  { "value": WeakSet          },
    "add":          { "value": WeakSet_add      },
    "has":          { "value": WeakSet_has      },
    "delete":       { "value": WeakSet_delete   },
});

function Map(iterable) {
    Map_constructor.call(this, iterable);
}
Map["prototype"] = (Object.create)(Map, {
    "constructor":  { "value": Map              },
    "size":         { "get":   Map_size         },
    "get":          { "value": Map_get          },
    "set":          { "value": Map_set          },
    "has":          { "value": Map_has          },
    "keys":         { "value": Map_keys         },
    "values":       { "value": Map_values       },
    "entries":      { "value": Map_entries      },
    "forEach":      { "value": Map_forEach      },
    "delete":       { "value": Map_delete       },
    "clear":        { "value": Map_clear        },
    "@@iterator":   { "value": Map_entries      },
});

function WeakMap(iterable) {
    WeakMap_constructor.call(this, iterable);
}
WeakMap["prototype"] = (Object.create)(WeakMap, {
    "constructor":  { "value": WeakMap          },
    "get":          { "value": WeakMap_get      },
    "set":          { "value": WeakMap_set      },
    "has":          { "value": WeakMap_has      },
    "delete":       { "value": WeakMap_delete   },
});

function Object_assign(target /*, sources ... */) {
    var args = arguments;

    for (var i = 1, iz = args.length; i < iz; ++i) {
        var source = args[i];

        if (source) {
            var keys = Object.keys(source);

            for (var k = 0, kz = keys.length; k < kz; ++k) {
                var key  = keys[k];
                var desc = Object.getOwnPropertyDescriptor(source, key);

                if (desc && desc["enumerable"]) {
                    target[key] = source[key];
                }
            }
        }
    }
    return target;
}

function Object_is(value1, value2) {
    if (typeof value1 !== typeof value2) {
        return false;
    }
    if (isNaN(value1)) {
        return isNaN(value2);
    }
    if (value1 === 0 && value2 === 0) {
        return (1 / value1) === (1 / value2);
    }
    return value1 === value2;
}

function Array_of(/* values ... */) {
    return Array.prototype.slice.call(arguments);
}

function Array_from(items, mapFn, thisArg) {
    if (!mapFn) {
        return [].slice.call(items);
    }
    var that = thisArg || null;
    var result = [];
    for (var i = 0, iz = items.length; i < iz; ++i) {
        result.push( mapFn.call(that, items[i], i, items) );
    }
    return result;
}

function ArrayIterator(data, nextFn) {
    this._data = data;
    this._cursor = -1;
    this["next"] = nextFn;
}
function ArrayIterator_keys() {
    var index = ++this._cursor;
    var done  = index >= this._data.length;

    return done ? { "value": undefined, "done": true  }
                : { "value": index,     "done": false };
}
function ArrayIterator_values() {
    var index = ++this._cursor;
    var done  = index >= this._data.length;

    return done ? { "value": undefined,         "done": true  }
                : { "value": this._data[index], "done": false };
}
function ArrayIterator_keyAndValues() {
    var index = ++this._cursor;
    var done  = index >= this._data.length;

    return done ? { "value": undefined,                    "done": true  }
                : { "value": [ index, this._data[index] ], "done": false };
}

function Array_entries() {
    return new ArrayIterator(this, ArrayIterator_keyAndValues);
}

function Array_keys() {
    return new ArrayIterator(this, ArrayIterator_keys);
}

function Array_fill(value, start, end) {
    start = start >> 0;
    end   = end === undefined ? this.length : end >> 0;

    var iz    = this.length;
    var i     = start < 0 ? Math.max(start + iz, 0) : Math.min(start, iz);
    var final = end   < 0 ? Math.max(end   + iz, 0) : Math.min(end,   iz);

    for (; i < final; ++i) {
        this[i] = value;
    }
    return this;
}

function Array_find(predicate, thisArg) {
    var result = this["findIndex"](predicate, thisArg);

    return result === -1 ? undefined : this[result];
}

function Array_findIndex(predicate, thisArg) {
    for (var i = 0, iz = this.length; i < iz; ++i) {
        var result = predicate.call(thisArg, this[i], i, this);

        if (result) {
            return i;
        }
    }
    return -1;
}

function Array_values() {
    return new ArrayIterator(this, ArrayIterator_values);
}

function Array_copyWithin(target, start, end) {
    target = target >> 0;
    start  = start  >> 0;
    end    = end === undefined ? this.length : end >> 0;

    var iz    = this.length;
    var to    = target < 0 ? Math.max(target + iz, 0) : Math.min(target, iz);
    var from  = start  < 0 ? Math.max(start  + iz, 0) : Math.min(start,  iz);
    var final = end    < 0 ? Math.max(end    + iz, 0) : Math.min(end,    iz);
    var count = Math.min(final - from, iz - to);

    if (from < to && to < (from + count)) {
        for (; count > 0; --from, --to, --count) {
            if (from in this) {
                this[to] = this[from];
            } else {
                delete this[to];
            }
        }
    } else {
        for (; count > 0; ++from, ++to, --count) {
            if (from in this) {
                this[to] = this[from];
            } else {
                delete this[to];
            }
        }
    }
    return this;
}

function String_fromCodePoint(/* codePoints ... */) {
    var args = arguments;
    var result = [];

    for (var i = 0, az = args.length; i < az; ++i) {
        var codePoint = args[i];

        if (codePoint < 0x10000) {
            result.push(codePoint);
        } else {
            var offset = codePoint - 0x10000;

            result.push(0xD800 + (offset >> 10),
                        0xDC00 + (offset & 0x3FF));
        }
    }
    return String.fromCharCode.apply(null, result);
}

function String_repeat(count) {
    count = count | 0;
    return (this.length && count > 0) ? new Array(count + 1).join(this) : "";
}

function String_codePointAt(pos) {
    pos = pos || 0;

    var iz = this.length;
    var first = this.charCodeAt(pos);

    if ( isNaN(first) ) {
        return undefined;
    }
    if (first < 0xD800 || first > 0xDBFF || pos + 1 >= iz) {
        return first;
    }
    var second = this.charCodeAt(pos + 1);
    if (second < 0xDC00 || second > 0xDFFF) {
        return first;
    }
    return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
}

function String_includes(searchString, position) {
    return this.indexOf(searchString, position) >= 0;
}

function String_startsWith(searchString, position) {
    position = position || 0;
    return this.lastIndexOf(searchString, position) === position;
}

function String_endsWith(searchString, endPosition) {
    var position = (endPosition || this.length) - searchString.length;
    var lastIndex = this.lastIndexOf(searchString);

    return lastIndex !== -1 && lastIndex === position;
}

function Number_isNaN(number) {
    return typeof number === "number" && number !== number;
}

function Number_isFinite(number) {
    return typeof number === "number" && isFinite(number);
}

function Number_isInteger(number) {
    return typeof number === "number" && isFinite(number) &&
           Math.floor(number) === number;
}

function Number_isSafeInteger(number) {
    return typeof number === "number" && isFinite(number) &&
           Math.floor(number) === number &&
           number <= Number["MAX_SAFE_INTEGER"] &&
           number >= Number["MIN_SAFE_INTEGER"];
}

function Math_clz32(x) {
    var u32 = Number(x) >>> 0;
    return u32 ? 32 - u32.toString(2).length : 32;
}

function Math_fround(x) {
  return new Float32Array([x])[0];
}

function Math_hypot(/* values ... */) {
    var args = arguments;
    var y    = 0;

    if (args.length === 0) { return 0; }

    for (var i = 0, iz = args.length; i < iz; ++i) {
        var value = args[i];

        if (value === Infinity || value === -Infinity) {
            return Infinity;
        }
        if ( isNaN(value) ) {
            return NaN;
        }
        y += value * value;
    }
    return Math.sqrt(y);
}

function Math_imul(a, b) {
    var a_high = (a >>> 16) & 0xffff;
    var a_low  =  a         & 0xffff;
    var b_high = (b >>> 16) & 0xffff;
    var b_low  =  b         & 0xffff;

    return ((a_low * b_low) + (((a_high * b_low + a_low * b_high) << 16) >>> 0) | 0);
}

function Math_tanh(x) {
    if (x === Infinity) {
        return 1;
    } else if (x === -Infinity) {
        return -1;
    }
    var y = Math.exp(2 * x);

    return (y - 1) / (y + 1);
}

function CollectionIterator(keys, values, nextFn) {
    var that = this;

    this._keys   = keys;
    this._values = values;
    this["next"] = nextFn;
    this._cursor = -1;

    if (global["Symbol"]) {
        this[global["Symbol"]["iterator"]] = function() {
            return that;
        };
    }
}
function CollectionIterator_keys() {
    var cursor = ++this._cursor;
    var done   = cursor >= this._keys.length;

    return done ? { "value": undefined,          "done": true  }
                : { "value": this._keys[cursor], "done": false };
}
function CollectionIterator_values() {
    var cursor = ++this._cursor;
    var done   = cursor >= this._keys.length;

    return done ? { "value": undefined,            "done": true  }
                : { "value": this._values[cursor], "done": false };
}
function CollectionIterator_keyAndValues() {
    var cursor = ++this._cursor;
    var done   = cursor >= this._keys.length;

    return done ? { "value": undefined,              "done": true  }
                : { "value": [this._keys[cursor],
                              this._values[cursor]], "done": false };
}

function Set_constructor(iterable) {
    this._value = [];

    var that = this;

    if (Array.isArray(iterable)) {
        iterable.forEach(function(value) {
            that["add"](value);
        });
    } else if (iterable && iterable["next"]) {
        var result = null;

        while ( (result = iterable["next"]()) ) {
            if (result["done"]) {
                break;
            }
            this["add"](result["value"]);
        }
    }
}

function Set_size() {
    return this._value.length;
}

function Set_add(value) {
    this._value.push(value);
    return this;
}

function Set_has(value) {
    return this._value.indexOf(value) >= 0;
}

function Set_values() {
    return new CollectionIterator(this._value, this._value, CollectionIterator_values);
}

function Set_entries() {
    return new CollectionIterator(this._value, this._value, CollectionIterator_keyAndValues);
}

function Set_forEach(callbackFn, thisArg) {
    thisArg = thisArg || null;
    for (var i = 0, iz = this.size; i < iz; ++i) {
        callbackFn.call(thisArg, this._value[i], this._value[i], this);
    }
}

function Set_delete(value) {
    var index = this._value.indexOf(value);

    if (index < 0) {
        return false;
    }
    this._value.splice(index, 1);
    return true;
}

function Set_clear() {
    this._value = [];
}

function WeakSet_constructor(iterable) {
    this._value = [];

    var that = this;

    if (Array.isArray(iterable)) {
        iterable.forEach(function(value) {
            that["add"](value);
        });
    } else if (iterable && iterable["next"]) {
        var result = null;

        while ( (result = iterable["next"]()) ) {
            if (result["done"]) {
                break;
            }
            this["add"](result["value"]);
        }
    }
}

function WeakSet_add(value) {
    this._value.push(value);
    return this;
}

function WeakSet_has(value) {
    return this._value.indexOf(value) >= 0;
}

function WeakSet_delete(value) {
    var index = this._value.indexOf(value);

    if (index < 0) {
        return false;
    }
    this._value.splice(index, 1);
    return true;
}

function Map_constructor(iterable) {
    this._index = [];
    this._value = [];

    var that = this;

    if (Array.isArray(iterable)) {
        iterable.forEach(function(value) {
            that["set"](value[0], value[1]);
        });
    } else if (iterable && iterable["next"]) {
        var result = null;

        while ( (result = iterable["next"]()) ) {
            if (result["done"]) {
                break;
            }
            this["set"](result["value"][0], result["value"][1]);
        }
    }
}

function Map_size() {
    return this._index.length;
}

function Map_get(key) {
    var index = this._index.indexOf(key);

    if (index < 0) {
        return undefined;
    }
    return this._value[index];
}

function Map_set(key, value) {
    var index = this._index.indexOf(key);

    if (index < 0) {
        this._index.push(key);
        this._value.push(value);
    } else {
        this._value[index] = value;
    }
}

function Map_has(key) {
    return this._index.indexOf(key) >= 0;
}

function Map_keys() {
    return new CollectionIterator(this._index, this._value, CollectionIterator_keys);
}

function Map_values() {
    return new CollectionIterator(this._index, this._value, CollectionIterator_values);
}

function Map_forEach(callbackFn, thisArg) {
    thisArg = thisArg || null;
    for (var i = 0, iz = this.size; i < iz; ++i) {
        callbackFn.call(thisArg, this._value[i], this._index[i], this);
    }
}

function Map_entries() {
    return new CollectionIterator(this._index, this._value, CollectionIterator_keyAndValues);
}

function Map_delete(key) {
    var index = this._index.indexOf(key);

    if (index < 0) {
        return false;
    }
    this._index.splice(index, 1);
    this._value.splice(index, 1);
    return true;
}

function Map_clear() {
    this._index = [];
    this._value = [];
}

function WeakMap_constructor(iterable) {
    this._index = [];
    this._value = [];

    var that = this;

    if (Array.isArray(iterable)) {
        iterable.forEach(function(value) {
            that["set"](value[0], value[1]);
        });
    } else if (iterable && iterable["next"]) {
        var result = null;

        while ( (result = iterable["next"]()) ) {
            if (result["done"]) {
                break;
            }
            this["set"](result["value"][0], result["value"][1]);
        }
    }
}

function WeakMap_get(key, defaultValue) {
    var index = this._index.indexOf(key);

    if (index < 0) {
        return defaultValue;
    }
    return this._value[index];
}

function WeakMap_set(key, value) {
    var index = this._index.indexOf(key);

    if (index < 0) {
        this._index.push(key);
        this._value.push(value);
    } else {
        this._value[index] = value;
    }
}

function WeakMap_has(key) {
    return this._index.indexOf(key) >= 0;
}

function WeakMap_delete(key) {
    var index = this._index.indexOf(key);

    if (index < 0) {
        return false;
    }
    this._index.splice(index, 1);
    this._value.splice(index, 1);
    return true;
}

//{@es7
function Object_values(source) {
    var keys = Object.keys(source);
    var i = 0, iz = keys.length;
    var result = new Array(iz);

    for (; i < iz; ++i) {
        result[i] = source[keys[i]];
    }
    return result;
}

function Object_entries(source) {
    var keys = Object.keys(source);
    var i = 0, iz = keys.length;
    var result = new Array(iz);

    for (; i < iz; ++i) {
        result[i] = [ keys[i], source[keys[i]] ];
    }
    return result;
}

function Array_includes(searchElement, position) {
    position = position || 0;
    var iz = this.length;

    if (iz === 0) {
        return false;
    }

    var i = 0;

    if (position >= 0) {
        i = position;
    } else {
        i = position + iz;
        if (i < 0) {
            i = 0;
        }
    }

    if (searchElement === searchElement) {
        for (; i < iz; ++i) {
            if (this[i] === searchElement) {
                return true;
            }
        }
    } else if (isNaN(searchElement)) {
        for (; i < iz; ++i) {
            if (isNaN(this[i])) {
                return true;
            }
        }
    } else {
        throw TypeError("Unsupported type");
    }
    return false;
}
//}@es7


function publish(publishTarget, constructors, override) {
    override = override || false;

    for (var klass in constructors) {
        if ( !(klass in publishTarget) ) {
            publishTarget[klass] = constructors[klass];
        }
        _extend(publishTarget[klass], constructors[klass]);
    }

    function _extend(extendTarget, object) {
        for (var key in object) {
            if (key === "prototype") {
                if (!(key in extendTarget)) {
                    extendTarget[key] = {};
                }
                for (var prop in object[key]) {
                    _defineProperty(extendTarget[key], prop, object[key][prop]);
                }
            } else {
                _defineProperty(extendTarget, key, object[key]);
            }
        }
    }

    function _defineProperty(obj, key, value) {
        if ( override || !(key in obj) ) {
            Object.defineProperty(obj, key, {
                "configurable": true,
                "enumerable": false,
                "writable": true,
                "value": value
            });
        }
    }
}

publish(global, ES6);
publish(global, ES7);

})((typeof self !== "undefined") ? self : global);

