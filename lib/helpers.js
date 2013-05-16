/*
 * helpers.js: Helper functions for the pinpoint web service. 
 *
 * (C) 2011 Charlie Robbins
 * MIT LICENSE
 *
 */
 
/**
 * randomString returns a pseude-random ASCII string which contains at least the specified number of bits of entropy
 * the return value is a string of length ⌈bits/6⌉ of characters from the base64 alphabet
 * @param {int} bits: Number of bits to use for the randomString
 * 
 */
var randomString = exports.randomString = function (bits) {
  var chars, rand, i, ret;
  
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'; 
  ret = '';
  
  // in v8, Math.random() yields 32 pseudo-random bits (in spidermonkey it gives 53)
  while (bits > 0) {
    // 32-bit integer
    rand = Math.floor(Math.random() * 0x100000000); 
    // base 64 means 6 bits per character, so we use the top 30 bits from rand to give 30/6=5 characters.
    for (i = 26; i > 0 && bits > 0; i -= 6, bits -= 6) {
      ret += chars[0x3F & rand >>> i];
    }
  }
  
  return ret;
};