/* modulejs 1.5.0 - http://larsjung.de/modulejs/ */
(function (factory) {

this.modulejs = factory();

}(function () {
'use strict';

// # Util

// References.
var objectPrototype = Object.prototype;
var arrayForEach = Array.prototype.forEach;

// Returns a function that returns `true` if `arg` is of the correct `type`, otherwise `false`.
function createIsTypeFn(type) {

    return function (arg) {

        return objectPrototype.toString.call(arg) === '[object ' + type + ']';
    };
}

// ## isString
// Returns `true` if argument is a string, otherwise `false`.
var isString = createIsTypeFn('String');

// ## isFunction
// Returns `true` if argument is a function, otherwise `false`.
var isFunction = createIsTypeFn('Function');

// ## isArray
// Returns `true` if argument is an array, otherwise `false`.
var isArray = Array.isArray || createIsTypeFn('Array');

// ## isObject
// Returns `true` if argument is an object, otherwise `false`.
function isObject(arg) {

    return arg === new Object(arg);
}

// ## has
// Short cut for `hasOwnProperty`.
function has(arg, id) {

    return objectPrototype.hasOwnProperty.call(arg, id);
}

// ## each
// Iterates over all elements af an array or all own keys of an object.
function each(obj, iterator, context) {

    if (arrayForEach && obj.forEach === arrayForEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i += 1) {
            iterator.call(context, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (has(obj, key)) {
                iterator.call(context, obj[key], key, obj);
            }
        }
    }
}

// ## contains
// Returns `true` if array contains element, otherwise `false`.
function contains(array, element) {

    for (var i = 0, l = array.length; i < l; i += 1) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}

// ## uniq
// Returns an new array containing no duplicates. Preserves first occurence and order.
function uniq(array) {

    var elements = {};
    var result = [];

    each(array, function (el) {

        if (!has(elements, el)) {
            result.push(el);
            elements[el] = 1;
        }
    });

    return result;
}

// ## err
// Throws an error if `condition` is `true`.
function err(condition, code, message) {

    if (condition) {
        var e = new Error('[modulejs-' + code + '] ' + message);
        e.code = code;
        throw e;
    }
}



// # Private

// ## definitions
// Module definitions.
var definitions = {};

// ## instances
// Module instances.
var instances = {};

// ## resolve
// Resolves an `id` to an object, or if `onlyDepIds` is `true` only returns dependency-ids.
// `stack` is used internal to check for circular dependencies.
function resolve(id, onlyDepIds, stack) {

    // check arguments
    err(!isString(id), 31, 'id must be a string "' + id + '"');

    // if a module is required that was already created return that object
    if (!onlyDepIds && has(instances, id)) {
        return instances[id];
    }

    // check if `id` is defined
    var def = definitions[id];
    err(!def, 32, 'id not defined "' + id + '"');

    // copy resolve stack and add this `id`
    stack = (stack || []).slice(0);
    stack.push(id);

    // if onlyDepIds this will hold the dependency-ids, otherwise it will hold the dependency-objects
    var deps = [];

    each(def.deps, function (depId) {

        // check for circular dependencies
        err(contains(stack, depId), 33, 'circular dependencies: ' + stack + ' & ' + depId);

        if (onlyDepIds) {
            deps = deps.concat(resolve(depId, onlyDepIds, stack));
            deps.push(depId);
        } else {
            deps.push(resolve(depId, onlyDepIds, stack));
        }
    });

    // if `onlyDepIds` return only dependency-ids in right order
    if (onlyDepIds) {
        return uniq(deps);
    }

    // create, memorize and return object
    var obj = def.fn.apply(undefined, deps);
    instances[id] = obj;
    return obj;
}



// # Public

// ## define
// Defines a module for `id: String`, optional `deps: Array[String]`,
// `arg: Object/function`.
function define(id, deps, arg) {

    // sort arguments
    if (arg === undefined) {
        arg = deps;
        deps = [];
    }
    // check arguments
    err(!isString(id), 11, 'id must be a string "' + id + '"');
    err(definitions[id], 12, 'id already defined "' + id + '"');
    err(!isArray(deps), 13, 'dependencies for "' + id + '" must be an array "' + deps + '"');
    err(!isObject(arg) && !isFunction(arg), 14, 'arg for "' + id + '" must be object or function "' + arg + '"');

    // accept definition
    definitions[id] = {
        id: id,
        deps: deps,
        fn: isFunction(arg) ? arg : function () { return arg; }
    };
}

// ## require
// Returns an instance for `id`.
function require(id) {

    return resolve(id);
}

// ## state
// Returns an object that holds infos about the current definitions and dependencies.
function state() {

    var res = {};

    each(definitions, function (def, id) {

        res[id] = {

            // direct dependencies
            deps: def.deps.slice(0),

            // transitive dependencies
            reqs: resolve(id, true),

            // already initiated/required
            init: has(instances, id)
        };
    });

    each(definitions, function (def, id) {

        var inv = [];
        each(definitions, function (def2, id2) {

            if (contains(res[id2].reqs, id)) {
                inv.push(id2);
            }
        });

        // all inverse dependencies
        res[id].reqd = inv;
    });

    return res;
}

// ## log
// Returns a string that displays module dependencies.
function log(inv) {

    var out = '\n';

    each(state(), function (st, id) {

        var list = inv ? st.reqd : st.reqs;
        out += (st.init ? '* ' : '  ') + id + ' -> [ ' + list.join(', ') + ' ]\n';
    });

    return out;
}



// # Publish

return {
    define: define,
    require: require,
    state: state,
    log: log,
    _private: {
        isString: isString,
        isFunction: isFunction,
        isArray: isArray,
        isObject: isObject,
        has: has,
        each: each,
        contains: contains,
        uniq: uniq,
        err: err,
        definitions: definitions,
        instances: instances,
        resolve: resolve
    }
};

}));
