const { expect } = require('chai');
const bounds = require('../');

describe('Input validation tests', function() {
    it('should fail when default is out of range', () => {
        expect(() => bounds.force(0, 1, 2, 3)).to.throw();
        expect(() => bounds.force(0, 1, 2, -1)).to.throw();
    });

    it('should fail when no bounds are set', () => {
        expect(() => bounds.force(0)).to.throw();
    });

    it('should NOT fail when no default is set', () => {
        expect(() => bounds.force(2, 1, 3)).to.not.throw();
    });

    it('should fail when default is not a numerical type or when Number.isNaN(value) would be true', () => {
        expect(() => bounds(1, 1, 1, {})).to.throw();
        expect(() => bounds(1, 1, 1, [])).to.throw();
        expect(() => bounds(1, 1, 1, 'test')).to.throw();
        expect(() => bounds(1, 1, 1, () => {})).to.throw();
        expect(() => bounds(1, 1, 1, true)).to.throw();
        expect(() => bounds(1, 1, 1, Number.NaN)).to.throw();
        expect(() => bounds(1, 1, 1, NaN)).to.throw(); // the world is collapsing if this is ever a different result
    });

    it('should fail when default is any falsy type other than 0 and undefined', () => {
        expect(() => bounds(1, 1, 1, '')).to.throw();
        expect(() => bounds(1, 1, 1, false)).to.throw();
        expect(() => bounds(1, 1, 1, null)).to.throw();
    });

    it('should fail when default value is Number.NaN', () => {
        expect(() => bounds(1, 1, 1, Number.NaN)).to.throw();
    });

    it('should NOT fail when max is not provided', () => {
        expect(() => bounds.force(2, 1)).to.not.throw();
    });

    it('should NOT fail when bounds are reversed', () => {
        expect(() => bounds.force(0, 2, 1, 1)).to.not.throw();
    });

    it('should NOT fail when bounds are the same number', () => {
        expect(() => bounds.force(4, 8, 8)).to.not.throw().and.to.equal(8);
        expect(() => bounds.force(4, 8, 8, 8)).to.not.throw().and.to.equal(8);
        expect(() => bounds.force(8, 8, 8, 8)).to.not.throw().and.to.equal(8);
        expect(() => bounds.force(0, 0, 0, 0)).to.not.throw().and.to.equal(0);
        expect(() => bounds.force(0, 0, 0)).to.not.throw().and.to.equal(0);
        expect(() => bounds.force(0, 0)).to.not.throw().and.to.equal(0);
        expect(() => bounds.force(-1, -1, -1, -1)).to.not.throw().and.to.equal(-1);
    });

    it('should NOT fail when input value is a falsy value', () => {
        expect(() => bounds.force(NaN, 1, 2, 1)).to.not.throw().to.equal(1);
        expect(() => bounds.force(undefined, 1, 2, 1)).to.not.throw().to.equal(1);
        expect(() => bounds.force(null, 1, 2, 1)).to.not.throw().to.equal(1);
        expect(() => bounds.force('', 1, 2, 1)).to.not.throw().to.equal(1);
        expect(() => bounds.force(false, 1, 2, 1)).to.not.throw().to.equal(1);
    });

    it('should fail when input is not a number and not a falsy value', () => {
        expect(() => bounds.force("these aren't the values you're loooking for", 1, 2, 1)).to.throw();
        expect(() => bounds.force({}, 1, 2, 1)).to.throw();
        expect(() => bounds.force([], 1, 2, 1)).to.throw();
    });

    it('should treat 0 as a regular input', () => {
        expect(bounds.force(0, -1, 2, 1)).to.equal(0);
    });

    it('should allow use of infinity constants in bounds definitions', () => {
        expect(bounds.force(0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, 1)).to.equal(0);
        expect(bounds.force(undefined, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)).to.equal(Number.NEGATIVE_INFINITY);
        expect(bounds.force(1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)).to.equal(1);
        expect(bounds.force(1, Number.POSITIVE_INFINITY)).to.equal(Number.POSITIVE_INFINITY);
        expect(bounds.force(1, Number.NEGATIVE_INFINITY)).to.equal(Number.NEGATIVE_INFINITY);
        expect(bounds.force(0, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 1)).to.equal(0);
        expect(bounds.force(0, Number.NEGATIVE_INFINITY, -2, -3)).to.equal(-2);
        expect(bounds.force(0, Number.NEGATIVE_INFINITY, -2, -2)).to.equal(-2);
        expect(() => bounds.force(0, Number.NEGATIVE_INFINITY, -2, -1)).to.throw();
    });

    it('should allow use of infinity constants as default value', () => {
        expect(bounds.force(undefined, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).to.equal(Number.POSITIVE_INFINITY);
        expect(bounds.force(-1, 0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).to.equal(0);
    });

    it('should allow value to be an infinity contant', () => {
        expect(bounds.force(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, 4, 1)).to.equal(Number.NEGATIVE_INFINITY);
    });
});

describe('Core functionality tests', () => {
    it('should enforce min value', () => {
        expect(bounds.force(0, 1, 2)).to.equal(1);
    });

    it('should enforce max value', () => {
        expect(bounds.force(3, 1, 2)).to.equal(2);
    });

    it('should set default when value is invalid', () => {
        expect(bounds.force(undefined, 1, 8, 3)).to.equal(3);
    });

    if ('should silently interpret reversed ranges as normal ranges', () => {
        expect(bounds.force(4, 8, 1, 3)).to.equal(4);
    });

    it('should default to min value when no other default provided', () => {
        expect(bounds.force(0, 1)).to.equal(1);
    });
    
    it('should resolve to default when value is NaN', () => {
        expect(bounds.force(NaN, 1, 2)).to.equal(1);
    });
    
    it('should interpret range as inclusive', () => {
        expect(bounds.force(0, 0, 10, 1)).to.equal(0);
        expect(bounds.force(10, 0, 10, 1)).to.equal(10);
    });

    it('should work with negative and real numbers', () => {
        expect(bounds.force(0, -0.1, 0.1, 0)).to.equal(0);
        expect(bounds.force(0.2, -0.1, 0.1)).to.equal(0.1);
        expect(bounds.force(0.01, -0.1, 0.1, 0.012)).to.equal(0.01);
        expect(bounds.force(-0.11, -0.1, 0.1, 0.012)).to.equal(-0.1);
        expect(bounds.force(undefined, -0.1, 0.1, 0.012)).to.equal(0.012);
        expect(bounds.force(0.1, 0, 10, 1)).to.equal(0.1);
        expect(bounds.force(-1, 0, 10, 1)).to.equal(0);
    });
});