
const checkBounds = (min, max) => {
    if (typeof min !== 'number' || min === NaN) throw new Error('Minimum value of bound is not a number, useage here is meaningless');
    if (typeof max !== 'number' || max === NaN) throw new Error('Maximum value of bound is not a number, useage here is meaningless');
    if (max < min) return [max, min];
    return [min, max];
}

const check = (v, min, max = min) => {
    [min, max] = checkBounds(min, max);

    return v >= min && v <= max;
}

const force = (v, min, max = min, _default = min) => {
    [min, max] = checkBounds(min, max);

    if (!check(_default, min, max)) throw new Error('Default value is out of range');
    if (typeof v !== 'number' || v === NaN) return v || _default;
    let forced = v;
    forced = Math.min(v, max); // force at most max
    forced = Math.max(forced, min); // force at least min
    return forced;
}


module.exports = {
    check,
    force,
}