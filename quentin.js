"use strict";
(function () {
    function toArray(value) {
        return Array.prototype.slice.call(value);
    }
    function quickClone(value) {
        return JSON.parse(JSON.stringify(value));
    }
    function addClass(collection, name) {
        collection.forEach(function (node) {
            if (toArray(node.classList).indexOf(name) === -1) {
                node.className = toArray(node.classList).concat(name).join(" ");
            }
        });
        return wrapMethods(collection);
    }
    function removeClass(collection, name) {
        collection.forEach(function (node) {
            var classes = toArray(node.classList);
            var index = classes.indexOf(name);
            if (index !== -1) {
                classes.splice(index, 1);
                node.className = classes.join(" ");
            }
        });
        return wrapMethods(collection);
    }
    function hasClass(collection, name) {
        var exists = false;
        for (var i = 0; i < collection.length; i += 1) {
            if (toArray(collection[i].classList).indexOf(name) !== -1) {
                exists = true;
                break;
            }
        }
        return exists;
    }
    function toggleClass(collection, name) {
        if (hasClass(collection, name)) {
            return removeClass(collection, name);
        }
        return addClass(collection, name);
    }
    function find(collection, selector) {
        var results = [];
        collection.forEach(function (node) {
            results = results.concat(toArray(node.querySelectorAll(selector)));
        });
        return wrapMethods(results);
    }
    function first(collection) {
        return wrapMethods(collection.slice(0, 1));
    }
    function last(collection) {
        return wrapMethods(collection.slice(-1));
    }
    function eq(collection, index) {
        return wrapMethods([collection[index]]);
    }
    function data(collection, key) {
        var results = [];
        var full = key === undefined;
        collection.forEach(function (node) {
            if (full) {
                if (Object.keys(node.dataset).length > 0) {
                    results.push(quickClone(node.dataset));
                }
            }
            else if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
                results.push(node.dataset[key]);
            }
        });
        return results.length > 1 ? results : results[0];
    }
    function siblings(collection) {
        return wrapMethods(toArray(collection[0].parentNode.children));
    }
    function parent(collection) {
        return wrapMethods(toArray([collection[0].parentNode]));
    }
    function children(collection) {
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
