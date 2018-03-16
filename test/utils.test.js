
const chai = require("chai");
chai.use(require('chai-as-promised'));
chai.use(require('chai-bignumber')());
chai.should();

const u = require("./_helpers/test_utils");


// Initialise:
let utils;
(async () => {
  utils = await artifacts.require("Utils").deployed();
})();

contract('Utils', function (accounts) {

  it("implements the natural logarithm", async function () {

    for (let i = 2; i < 100; i++) {
      const calculated = (await utils.logtwo.call(i));
      const expected = Math.ceil(Math.log2(i));
      // assert(calculated.equals(expected), `Expected ${expected} but got ${calculated}`);
      calculated
        .should.be.bignumber.equals(expected);
    }

  });
});