# quentin
A micro library for finding DOM elements and manipulating their CSS classes.
Minified it's 2.38 KB and it could probably be smaller.

You can see a demo here https://lucianbuzzo.github.io/quentin/.

## Usage

Add the script to the bottom of your body tag

```
<script src="quentin.js"></script>
```

The function `q()` is now available and will accept a css selector as an argument.
For example `q('li.active')`.  
`q()` will return the dom elements that match the selector, wrapped in the quentin interface.

## Documentation

### addClass
### removeClass
### hasClass
### find
### first
### last
### eq
### data
### siblings
### parent
### children
### toggleClass
