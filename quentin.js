"use strict";
(function () {
    function toArray(value) {
        return Array.prototype.slice.call(value);
    }
    function quickClone(value) {
        return JSON.parse(JSON.stringify(value));
    }
    function addClass(collection, name) {
        for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
            var node = collection_1[_i];
            if (toArray(node.classList).indexOf(name) === -1) {
                node.className = toArray(node.classList).concat(name).join(" ");
            }
        }
        return wrapMethods(collection);
    }
    function removeClass(collection, name) {
        for (var _i = 0, collection_2 = collection; _i < collection_2.length; _i++) {
            var node = collection_2[_i];
            var classes = toArray(node.classList);
            var index = classes.indexOf(name);
            if (index !== -1) {
                classes.splice(index, 1);
                node.className = classes.join(" ");
            }
        }
        return wrapMethods(collection);
    }
    function hasClass(collection, name) {
        for (var _i = 0, collection_3 = collection; _i < collection_3.length; _i++) {
            var node = collection_3[_i];
            if (toArray(node.classList).indexOf(name) !== -1) {
                return true;
            }
        }
        return false;
    }
    function toggleClass(collection, name) {
        if (hasClass(collection, name)) {
            return removeClass(collection, name);
        }
        return addClass(collection, name);
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
        if (!collection.length)
            return wrapMethods([]);
        return wrapMethods(collection.slice(0, 1));
    }
    function last(collection) {
        if (!collection.length)
            return wrapMethods([]);
        return wrapMethods(collection.slice(-1));
    }
    function eq(collection, index) {
        if (index < 0 || index >= collection.length) {
            return wrapMethods([]);
        }
        return wrapMethods([collection[index]]);
    }
    function data(collection, key) {
        var results = [];
        var full = key === undefined;
        for (var _i = 0, collection_5 = collection; _i < collection_5.length; _i++) {
            var node = collection_5[_i];
            if (full) {
                if (Object.keys(node.dataset).length > 0) {
                    results.push(quickClone(node.dataset));
                }
            }
            else if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
                results.push(node.dataset[key]);
            }
        }
        return results.length > 1 ? results : results[0];
    }
    function dataAll(collection, key) {
        var full = key === undefined;
        var results = [];
        for (var _i = 0, collection_6 = collection; _i < collection_6.length; _i++) {
            var node = collection_6[_i];
            if (full) {
                if (Object.keys(node.dataset).length > 0) {
                    results.push(quickClone(node.dataset));
                }
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
        if (!collection.length || !collection[0].parentNode) {
            return wrapMethods([]);
        }
        return wrapMethods(toArray(collection[0].parentNode.children));
    }
    function parent(collection) {
        if (!collection.length || !collection[0].parentNode) {
            return wrapMethods([]);
        }
        return wrapMethods(toArray([collection[0].parentNode]));
    }
    function children(collection) {
        if (!collection.length) {
            return wrapMethods([]);
        }
        return wrapMethods(toArray(collection[0].children));
    }
    function wrapMethods(collection) {
        var typedCollection = collection;
        typedCollection.addClass = addClass.bind(null, collection);
        typedCollection.removeClass = removeClass.bind(null, collection);
        typedCollection.hasClass = hasClass.bind(null, collection);
        typedCollection.find = find.bind(null, collection);
        typedCollection.first = first.bind(null, collection);
        typedCollection.last = last.bind(null, collection);
        typedCollection.eq = eq.bind(null, collection);
        typedCollection.data = data.bind(null, collection);
        typedCollection.dataAll = dataAll.bind(null, collection);
        typedCollection.dataOne = dataOne.bind(null, collection);
        typedCollection.siblings = siblings.bind(null, collection);
        typedCollection.parent = parent.bind(null, collection);
        typedCollection.children = children.bind(null, collection);
        typedCollection.toggleClass = toggleClass.bind(null, collection);
        return typedCollection;
    }
    function q(selector) {
        return wrapMethods(toArray(document.querySelectorAll(selector)));
    }
    window.q = q;
})();
