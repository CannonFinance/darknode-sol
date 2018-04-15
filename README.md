# Ethereum Republic

[![Build Status](https://travis-ci.org/republicprotocol/republic-sol.svg?branch=master)](https://travis-ci.org/republicprotocol/republic-sol)
[![Coverage Status](https://coveralls.io/repos/github/republicprotocol/republic-sol/badge.svg?branch=master)](https://coveralls.io/github/republicprotocol/republic-sol?branch=master)

The Ethereum Republic library is the official reference implementation of the Republic Protocol on Ethereum, written in Solidity. The Republic Protocol does not explicitly require an Ethereum implementation, and future implementations may be developed on other blockchains. For now, Ethereum is used because it is the biggest and most reputable smart contract platform available.

## Smart contracts

The Ethereum Republic repository is made up of several different smart contracts that work together to implement the required on-chain functionality. These smart contracts are used by off-chain miners and traders to provide secure decentralized order matching computations.

1. The RepublicToken ERC20 contract implements the Republc Token (REN), used to provide economic incentives.
2. The MinerRegistry contract implements miner registrations and epochs.
3. The TraderRegistry contract implements trader registrations.
4. The OrderBook contract implements the opening, closing, and expiration of orders.

None of the contracts expose orders, including the OrderBook, which only holds order IDs. Orders are never passed to the Republic network under any circumstances, and order fragments are never passed to the blockchain.

## Tests

Install all NPM modules and Truffle as a global command.

```
npm install --global truffle
npm install
```

Run the `ganache` script. This script needs to continue running in the background; either run it in a separate terminal, or append the `&` symbol.

```sh
./ganache
```

Run the Truffle test suite.

```sh
truffle test
```
