"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function () {
    var toArray = function (value) {
        return Array.prototype.slice.call(value);
    };
    var cloneDataset = function (dataset) { return (__assign({}, dataset)); };
    function addClass(collection, name) {
        for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
            var node = collection_1[_i];
            node.classList.add(name);
        }
        return wrapMethods(collection);
    }
    function removeClass(collection, name) {
        for (var _i = 0, collection_2 = collection; _i < collection_2.length; _i++) {
            var node = collection_2[_i];
            node.classList.remove(name);
        }
        return wrapMethods(collection);
    }
    function hasClass(collection, name) {
        for (var _i = 0, collection_3 = collection; _i < collection_3.length; _i++) {
            var node = collection_3[_i];
            if (node.classList.contains(name))
                return true;
        }
        return false;
    }
    function toggleClass(collection, name) {
        return hasClass(collection, name)
            ? removeClass(collection, name)
            : addClass(collection, name);
    }
    function find(collection, selector) {
        var results = [];
        for (var _i = 0, collection_4 = collection; _i < collection_4.length; _i++) {
            var node = collection_4[_i];
            results = results.concat(toArray(node.querySelectorAll(selector)));
        }
        return wrapMethods(results);
    }
    function first(collection) {
        return wrapMethods(collection.length ? collection.slice(0, 1) : []);
    }
    function last(collection) {
        return wrapMethods(collection.length ? collection.slice(-1) : []);
    }
    function eq(collection, index) {
        return wrapMethods(index >= 0 && index < collection.length ? [collection[index]] : []);
    }
    function data(collection, key) {
        var results = dataAll(collection, key);
        return results.length > 1 ? results : results[0];
    }
    function dataAll(collection, key) {
        var full = key === undefined;
        var results = [];
        for (var _i = 0, collection_5 = collection; _i < collection_5.length; _i++) {
            var node = collection_5[_i];
            if (full) {
                if (Object.keys(node.dataset).length)
                    results.push(cloneDataset(node.dataset));
            }
            else if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
                results.push(node.dataset[key]);
            }
        }
        return results;
    }
    function dataOne(collection, key) {
        return dataAll(collection, key)[0];
    }
    function siblings(collection) {
        if (!collection.length || !collection[0].parentNode)
            return wrapMethods([]);
        return wrapMethods(toArray(collection[0].parentNode.children));
    }
    function parent(collection) {
        if (!collection.length || !collection[0].parentNode)
            return wrapMethods([]);
        return wrapMethods([collection[0].parentNode]);
    }
    function children(collection) {
        if (!collection.length)
            return wrapMethods([]);
        return wrapMethods(toArray(collection[0].children));
    }
    function wrapMethods(collection) {
        var c = collection;
        c.addClass = addClass.bind(null, collection);
        c.removeClass = removeClass.bind(null, collection);
        c.hasClass = hasClass.bind(null, collection);
        c.find = find.bind(null, collection);
        c.first = first.bind(null, collection);
        c.last = last.bind(null, collection);
        c.eq = eq.bind(null, collection);
        c.data = data.bind(null, collection);
        c.dataAll = dataAll.bind(null, collection);
        c.dataOne = dataOne.bind(null, collection);
        c.siblings = siblings.bind(null, collection);
        c.parent = parent.bind(null, collection);
        c.children = children.bind(null, collection);
        c.toggleClass = toggleClass.bind(null, collection);
        return c;
    }
    function q(selector) {
        return wrapMethods(toArray(document.querySelectorAll(selector)));
    }
    window.q = q;
})();
