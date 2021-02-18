# force-bounds

A simple package for limiting numerical values to within a defined range and defaulting to a known value when undefined.

## Useage
### Force a value to be within set bounds, or a default if undefined
```javascript
const bounds = require('force-bounds');

const safe = bounds.force(value, min, max, default)

// returns value if it within [min, max]. If value is outside of that range, the closest bound is returned (like saturation).
// If value was undefined, or any other 'falsy' value (including NaN, but excluding 0), then the default value is returned.
// If value is defined, but value | typeof value === 'number' is false, then an error is thrown to prevent overwriting non-numerical defined values.
// If no value is provided for default, max is assumed to be the default, if no value is provided for max, max === min is assumed.
// If min > max, they are internally swapped so that min < max.
// If min, max, or default are defined and are non numerical values or x | x === Number.NaN is true for any of them, then the function will throw an error.
// If default is outside of the range [max, min], an error is thrown.
// If none of min, max, default are provided, an error is thrown, since that use case is meaningless and likely a mistake.
```
###  Check if a value is within bounds
```javascript
const bounds = require('force-bounds');

const safe = bounds.check(value, min, max)

// performs the same checks as bounds.force, but returns true if value would be returned, and throws an error or returns false otherwise.
```

## Examples
### Forcing values
```javascript
const bounds = require('force-bounds');

const speed = 10; // untrusted input

let safeSpeed = bounds.force(speed, 0, 60, 0);
// safeSpeed === 10

safeSpeed = bounds.force(120, 0, 60, 55);
// safeSpeed === 60

safeSpeed = bounds.force(undefined, 0, 60, 55);
// safeSpeed === 55

safeSpeed = bounds.force(false, 0, 60, 55);
// safeSpeed === 55

safeSpeed = bounds.force(Number.NaN, 0, 60, 55);
// safeSpeed === 55

safeSpeed = bounds.force('', 0, 60, 55);
// safeSpeed === 55

safeSpeed = bounds.force('120', 0, 60, 55);
// Error thrown, does not clobber existing data

```

### Checking values
```javascript
const bounds = require('force-bounds');

const speed = 120; // untrusted input

const isSafeSpeed = bounds.check(speed, 0, 60, 0);
// isSafeSpeed === false
```


