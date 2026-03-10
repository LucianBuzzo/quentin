# quentin
A tiny DOM helper for selecting elements and working with CSS classes + simple traversal.

- Size: ~2.38KB minified (`quentin.min.js`)
- Demo: https://lucianbuzzo.github.io/quentin/

`q()` returns a wrapped array-like collection of DOM nodes with chainable helper methods.

## Quick start

Include the script at the end of `body`:

```html
<script src="quentin.js"></script>
```

Then query elements:

```js
q('li.active')
  .removeClass('active')
  .addClass('done');
```

## API

### `q(selector)`
Selects elements with `document.querySelectorAll(selector)` and wraps them.

Returns: wrapped collection.

---

### `addClass(name)`
Adds `name` to each element in the collection (if not already present).

Returns: same wrapped collection.

### `removeClass(name)`
Removes `name` from each element in the collection.

Returns: same wrapped collection.

### `toggleClass(name)`
If any element in the collection has `name`, removes it from all matched elements.
Otherwise, adds it to all matched elements.

Returns: same wrapped collection.

### `hasClass(name)`
Checks whether **at least one** element in the collection has `name`.

Returns: `boolean`.

---

### `find(selector)`
Finds descendants matching `selector` within each matched element.

Returns: new wrapped collection.

### `first()`
Returns a wrapped collection containing the first matched element.

### `last()`
Returns a wrapped collection containing the last matched element.

### `eq(index)`
Returns a wrapped collection containing the element at `index`.

---

### `data(key?)`
Reads `dataset` values.

- `data('foo')`: returns dataset value(s) for key `foo`
- `data()`: returns full dataset object(s)

Return shape:

- One match -> returns single value/object
- Multiple matches -> returns array of values/objects
- No match for key -> `undefined`

Notes:

- Empty-string dataset values are preserved (e.g. `data('label') === ''`)
- Returned full dataset objects are cloned, so mutating them won’t mutate the DOM dataset directly

---

### `siblings()`
Returns all children of the first element’s parent (includes the element itself).

Returns: wrapped collection.

### `parent()`
Returns the parent of the first matched element.

Returns: wrapped collection.

### `children()`
Returns children of the first matched element.

Returns: wrapped collection.

## Behavior notes

- Most traversal methods (`siblings`, `parent`, `children`) operate from the **first** matched element.
- Methods are designed for browser use and depend on `querySelectorAll`, `classList`, and `dataset`.
- Collections are arrays with methods attached (not custom class instances).

## Development

Run tests:

```bash
node --test
```

Minified build is committed as `quentin.min.js`.
