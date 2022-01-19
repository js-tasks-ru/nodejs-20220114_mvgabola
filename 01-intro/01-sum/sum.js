function sum(a, b) {
  if (isNumber(a) && isNumber(b)) {
    return a + b;
  }
  throw new TypeError('один или оба аргумента не являются числом');
}

function isNumber(number) {
  return Number.isFinite(number);
}

module.exports = sum;
