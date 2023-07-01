const { foo } = require('./foo');

describe('foo', () => {
  it('should works', () => {
    expect(foo()).toEqual('bar');
  });
});
