var prng = require("../prng.js")

var canvas = document.createElement("canvas")
canvas.width = 512
canvas.height = 512
document.body.appendChild(canvas)

var context = canvas.getContext("2d")
var pixels = context.getImageData(0, 0, canvas.width, canvas.height)

require("raf")(canvas).on("data", function(dt) {
  var ptr = 0
    , t = Date.now()
  for(var i=0; i<canvas.width; ++i) {
    for(var j=0; j<canvas.height; ++j) {
      var v = Math.floor(prng(t, i - 256, j - 256) * 255)
      pixels.data[ptr++] = v
      pixels.data[ptr++] = v
      pixels.data[ptr++] = v
      pixels.data[ptr++] = 255
    }
  }
  context.putImageData(pixels, 0, 0)
})
