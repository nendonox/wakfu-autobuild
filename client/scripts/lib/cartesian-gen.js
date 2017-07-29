'use strict';

/**
 * make cartesian product from arrays
 * reference: https://stackoverflow.com/a/39112625
 */

function* cartesian() {
  let arrays = arguments;
  if (arrays.length === 1) { arrays = arrays[0]; }
  function* doCartesian(i, prod) {
    if (i === arrays.length) {
      yield prod;
    } else {
      for (let j = 0; j < arrays[i].length; j++) {
        yield* doCartesian(i + 1, prod.concat([arrays[i][j]]));
      }
    }
  }
  yield* doCartesian(0, []);
}
