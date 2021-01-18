# force-bounds

A simple package for limiting numerical values to within a defined range and defaulting to a known value when undefined.


## Examples
### Forcing values
```javascript
const bounds = require('force-bounds');

const speed = 10; // untrusted input

let safeSpeed = bounds.force(speed, 0, 60, 0);
// safeSpeed === 10

safeSpeed = bounds.force(120, 0, 60, 55);
// safeSpeed === 55
```

### Checking values
```javascript
const bounds = require('force-bounds');

const speed = 120; // untrusted input

const isSafeSpeed = bounds.check(speed, 0, 60, 0);
// isSafeSpeed === false
```


