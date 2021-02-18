
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

    if (Number.isNaN(_default) || typeof _default !== 'number') throw new Error('Default is not a number');
    if (!check(_default, min, max)) throw new Error(`Default value is out of range ${_default}`);
    // Don't clobber values that are both non falsy and non numerical, eg strings and objects
    if (v && typeof v !== 'number') throw new Error('Non numerical value has data, will not overwrite');

    // return default is not a number
    if (typeof v !== 'number') return _default;

    let forced = v;
    forced = Math.min(v, max); // force at most max
    forced = Math.max(forced, min); // force at least min

    return Number.isNaN(forced) ? _default : forced;
}


module.exports = {
    check,
    force,
}