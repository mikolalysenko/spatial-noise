"use strict"

var hashInt       = require("hash-int")
  , float2Int     = require("float-bits").toInt
  , UINT_MAX      = 4294967295.0
  , HASH_CONSTANT = 0x7997F879
  , DOUBLE_VIEW   = new Float64Array(1)
  , INT_VIEW      = new Uint32Array(DOUBLE_VIEW.buffer)

function hashDouble(x, y) {
  DOUBLE_VIEW[0] = +x
  return hashInt(INT_VIEW[0] + hashInt(INT_VIEW[1]+y))
}

function noise1f(x) {
  return (+(hashInt(float2Int(x)+HASH_CONSTANT)>>>0)) / UINT_MAX
}

function noise2f(x, y) {
  return (+(hashInt(float2Int(y)+hashInt(float2Int(x)+HASH_CONSTANT))>>>0)) / UINT_MAX
}

function noise3f(x,y,z) {
  return (+(hashInt(float2Int(z)+hashInt(float2Int(y)+hashInt(float2Int(x)+HASH_CONSTANT)))>>>0)) / UINT_MAX
}

function noise4f(x,y,z,t) {
  return (+(hashInt(float2Int(t)+hashInt(float2Int(z)+hashInt(float2Int(y)+hashInt(float2Int(x)+HASH_CONSTANT)))>>>0))) / UINT_MAX
}

function noiseNf() {
  var n = arguments.length
    , r = HASH_CONSTANT
  for(var i=0; i<n; ++i) {
    r = hashInt(r + float2Int(arguments[i]))
  }
  return (+r) / UINT_MAX
}

function noise1d(x) {
  return +(hashDouble(x, HASH_CONSTANT)>>>0) / UINT_MAX
}

function noise2d(x, y) {
  return +(hashDouble(y, hashDouble(x, HASH_CONSTANT))>>>0) / UINT_MAX
}

function noise3d(x, y, z) {
  return +(hashDouble(z, hashDouble(y, hashDouble(x, HASH_CONSTANT)))>>>0) / UINT_MAX
}

function noise4d(x, y, z, t) {
  return +(hashDouble(t, hashDouble(z, hashDouble(y, hashDouble(x, HASH_CONSTANT))))>>>0) / UINT_MAX
}

function noiseNd() {
  var n = arguments.length
    , r = HASH_CONSTANT
  for(var i=0; i<n; ++i) {
    r = hashDouble(arguments[i], r)
  }
  return +(r>>>0) / UINT_MAX
}

module.exports         = noiseNd
module.exports.noise1d = noise1d
module.exports.noise2d = noise2d
module.exports.noise3d = noise3d
module.exports.noise4d = noise4d
module.exports.noiseNd = noiseNd
module.exports.noise1f = noise1f
module.exports.noise2f = noise2f
module.exports.noise3f = noise3f
module.exports.noise4f = noise4f
module.exports.noiseNf = noiseNf
