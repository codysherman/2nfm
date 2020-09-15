export function getAspectRatio(w, h) {
  function gcd(a, b) {
    return b == 0 ? a : gcd(b, a % b);
  }
  var r = gcd(w, h);
  return w / r / (h / r);
}