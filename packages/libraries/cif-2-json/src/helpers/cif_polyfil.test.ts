describe('startsWith polyfill', () => {
  it('should provide startsWith functionality', () => {
    expect('hello'.startsWith('h')).toEqual(true);
    expect('hello'.startsWith('e')).toEqual(false);
    expect('hello'.startsWith('hel')).toEqual(true);
  });
});
