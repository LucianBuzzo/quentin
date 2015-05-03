;(function() {
  function toArray(value) {
    return Array.prototype.slice.call(value);
  }
  Function.prototype.curry = function() {
    if (arguments.length<1) { return this; }
    var _method = this, args = toArray(arguments);
    return function() {
      return _method.apply(this, args.concat(toArray(arguments)));
    };
  };
  function quickClone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function addClass(collection, name) {
    console.log(collection);
    collection.forEach(function(node) {
      if ( toArray(node.classList).indexOf(name) === -1 ) {
        node.className = toArray(node.classList).concat(name).join(' ');
      }
    });
    return collection;
  }
  function removeClass(collection, name) {
    collection.forEach(function(node) {
      var classes = toArray(node.classList);
      var index = classes.indexOf(name);
      if ( index !== -1 ) {
        classes.splice(index, 1);
        node.className = classes.join(' ');
      }
    });
    return collection;
  }
  function hasClass(collection, name) {
    var exists = false, i = 0, l = collection.length;
    for ( i; i < l; i++ ) {
      if (toArray(collection[i].classList).indexOf(name) !== -1) {
        exists = true;
        break;
      }
    }
    return exists;
  }
  function toggleClass(collection, name) {
    if ( hasClass(collection, name) ) {
      removeClass(collection, name);
    } else {
      addClass(collection, name);
    }
    return collection;
  }

  function find(collection, selector) {
    var results = [];
    collection.forEach(function(node) {
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
    var results = [], full = (key === undefined);
    collection.forEach(function(node) {
      if ( full ) {
        if ( !!Object.keys(node.dataset).length ) {
          results.push(quickClone(node.dataset));
        }
      } else {
        if ( node.dataset[key] ) results.push(node.dataset[key]);
      }
    });
    console.log(results);
    return (results.length > 1 ? results : results[0]);
  }

  function siblings(collection){
    return wrapMethods(toArray(collection[0].parentNode.children));
  }
  function parent(collection) {
    return wrapMethods(toArray([collection[0].parentNode]));
  }
  function children(collection) {
    return wrapMethods(toArray(collection[0].children));
  }
  var methods = [
    addClass, removeClass, hasClass, find, first, last, eq, data, siblings,
    parent, children, toggleClass
  ];

  function wrapMethods(collection) {
    console.log(collection);
    methods.forEach(function(method) {
      collection[method.name] = method.curry(collection);
    });
    collection.find = find.curry(collection);
    return collection;
  }
  function q(selector) {
    return wrapMethods(toArray(document.querySelectorAll(selector)));
  }

  window.q = q;
}());
