class Zpromise {
  constructor(executor) {
    if (!this.isFunction(executor)) {
      throw new Error('promise needs an executor');
    }
    executor(this.resolve, this.rejecte);
  }

  resolve = () => {};

  rejecte = () => {};

  isFunction = fn => typeof fn === 'function';
}

module.exports = Zpromise;

export default Zpromise;
