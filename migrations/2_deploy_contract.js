const LitterCleanup = artifacts.require("LitterCleanup");

module.exports = function(deployer) {
  deployer.deploy(LitterCleanup);
};