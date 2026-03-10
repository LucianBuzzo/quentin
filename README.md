# quentin

A tiny DOM helper for selecting elements and manipulating CSS classes.

- Size: ~2.38KB minified (`quentin.min.js`)
- Demo: https://lucianbuzzo.github.io/quentin/

`q()` returns a wrapped array-like collection of DOM nodes with chainable methods.

## Install / use in browser

```html
<script src="quentin.js"></script>
```

```js
q('li.active').removeClass('active').addClass('done');
```

## Development

```bash
npm install
npm run lint
npm test
```

## API

### `q(selector)`
Selects elements with `document.querySelectorAll(selector)` and wraps them.

### `addClass(name)`
Adds a class to each element in the collection.

### `removeClass(name)`
Removes a class from each element in the collection.

### `toggleClass(name)`
If any selected element has the class, remove from all. Otherwise add to all.

### `hasClass(name)`
Returns `true` if at least one selected element has the class.

### `find(selector)`
Find descendants from each selected element.

### `first()`
Returns a wrapped collection containing only the first element.

### `last()`
Returns a wrapped collection containing only the last element.

### `eq(index)`
Returns a wrapped collection containing only the element at `index`.

### `data(key?)`
Reads dataset values.

- `data('foo')` -> single value or array of values
- `data()` -> single dataset object or array of dataset objects

### `siblings()`
Returns all children of the first selected element’s parent (includes itself).

### `parent()`
Returns the parent of the first selected element.

### `children()`
Returns children of the first selected element.

## Releases

Versioning/release PRs are managed with Release Please.

## Commit style

We use Conventional Commits:

- https://www.conventionalcommits.org/en/v1.0.0/
