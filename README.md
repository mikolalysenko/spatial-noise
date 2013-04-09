spatial-noise
=============
Spatially determinisitc n-dimensional noise generators.  Useful for things like games, procedural generation and quick testing of numerical algorithms.

[<img src=https://raw.github.com/mikolalysenko/spatial-noise/master/images/noise2d.png>](http://mikolalysenko.github.io/spatial-noise/)

[Try it yourself in your browser.](http://mikolalysenko.github.io/spatial-noise/)

## Install

    npm install spatial-noise
    
## Example

```javascript
var sn = require("spatial-noise")

//Gnerate some 

```

## API

```javascript
var sn = require("spatial-noise")

//Generate noise values on a grid
for(var i=0; i<10; ++i) {
  for(var j=0; j<10; ++j) {
    console.log(i, j, "->", sn(i, j))
  }
}

//Optimized methods are available for up to 4 dimensions
var t = sn.noise4d(10.01, 0.5, 10.0, Date.now())

//You can also use floating point precision, which is slightly faster
var s = sn.noise2f(5, 6)
```

### Double Precision

* `sn.noise1d(x)`
* `sn.noise2d(x,y)`
* `sn.noise3d(x,y,z)`
* `sn.noise4d(x,y,z,t)`
* `sn.noiseNd( ... )`

Generates a spatially varying noise function in some fixed dimension taking doubles as arguments.

**Note** `require("spatial-noise")` is an alias for `sn.noiseNd( ... )` and takes a variable number of arguments.

### Float Precision

* `sn.noise1f(x)`
* `sn.noise2f(x,y)`
* `sn.noise3f(x,y,z)`
* `sn.noise4f(x,y,z,t)`
* `sn.noiseNf( ... )`

Same deal as above, except arguments are all 32 bit floats instead of 64 bit doubles.


# Credits
(c) 2013 Mikola Lysenko. MIT License
