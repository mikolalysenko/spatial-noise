var sn = require("../prng.js")

require("tape")("prng test", function(t) {

  t.equals(typeof sn(0), "number")
  t.equals(sn(0), sn.noise1d(0))
  t.equals(sn(0,1), sn.noise2d(0,1))
  t.equals(sn(0,1,2), sn.noise3d(0,1,2))
  t.equals(sn(0,1,2,3), sn.noise4d(0,1,2,3))
  t.equals(sn(0,1,2,3,4), sn.noiseNd(0,1,2,3,4))

  t.equals(typeof sn.noiseNf(0), "number")
  t.equals(sn.noiseNf(0), sn.noise1f(0))
  t.equals(sn.noiseNf(0,1), sn.noise2f(0,1))
  t.equals(sn.noiseNf(0,1,2), sn.noise3f(0,1,2))
  t.equals(sn.noiseNf(0,1,2,3), sn.noise4f(0,1,2,3))

  t.end()
})