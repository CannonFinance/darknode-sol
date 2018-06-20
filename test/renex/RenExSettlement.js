const RenExTokens = artifacts.require("RenExTokens");
const RenExBalances = artifacts.require("RenExBalances");
const RenExSettlement = artifacts.require("RenExSettlement");
const RewardVault = artifacts.require("RewardVault");
const Orderbook = artifacts.require("Orderbook");
const RepublicToken = artifacts.require("RepublicToken");
const DarknodeRegistry = artifacts.require("DarknodeRegistry");
const BitcoinMock = artifacts.require("BitcoinMock");
const DGXMock = artifacts.require("DGXMock");

// Two big number libraries are used - BigNumber decimal support
// while BN has better bitwise operations
const BigNumber = require("bignumber.js");
const BN = require('bn.js');

const chai = require("chai");
chai.use(require("chai-as-promised"));
chai.should();

contract("RenExSettlement", function (accounts) {

    const buyer = accounts[0];
    const seller = accounts[1];
    const darknode = accounts[2];
    const broker = accounts[3];
    let tokenAddresses, orderbook, renExSettlement, renExBalances, renExTokens;
    let buyID_1, sellID_1;
    let buyID_2, sellID_2;

    before(async function () {
        [tokenAddresses, orderbook, renExSettlement, renExBalances, renExTokens] = await setup(darknode, broker);

        buyID_1 = "0x309a5df8e76da11abee911c97709a9b891dce6d2694d3161b59f36fe8529cbc0";
        await orderbook.openBuyOrder("0x32d455737ebe67b1ac9da90cd1095efa9761273e609462f04fca158a179498744ec86813f55462e600ecdb267f1f7ce0b1d31e12bc5bae1038f1f83b8196e8ff01", buyID_1, { from: broker });
        sellID_1 = "0x552f5b31734e6acf2f7808cd8b1be9bb61d33c216a106e1e91bb5fdb220108e0";
        await orderbook.openSellOrder("0x08d0731acb2d9e0bc6cd426c44d4b04775b2f467bfa9efcda1a508acb67308b41579bbbd4cf79aa15f02f52a58d11a429a9726d6c4a2fafc601a32f7f541268300", sellID_1, { from: broker });
        await orderbook.confirmOrder(buyID_1, [sellID_1], { from: darknode });

        buyID_2 = "0x9f04727e60fb1cf26bbb5e899df82ba24f191fb2b5ae4e864bb54aa1efa9e667";
        await orderbook.openBuyOrder("0xd2f07c5ed1dac9500066844fe89b9a57882004f72be216624090ce5570eb8cdf6f261d8ce518e6625872739074ae722d701e09be0fca565f1c9f7d079283e9b601", buyID_2, { from: broker });
        sellID_2 = "0x74bc6713b59b03a9037f267cbecfa202729c249eba6cf0767870d6c6c33e0148";
        await orderbook.openSellOrder("0xd9b460b2553f5f9404578167f817ad0edfa0efbe5a7a46ebdeeecef77a246153616483186300ecdf61bcccde90f0626ac3e18a868cac38435849ee5c24661fc800", sellID_2, { from: broker });
        await orderbook.confirmOrder(buyID_2, [sellID_2], { from: darknode });

        buyID_3 = "0xfdfe3a9515260199d49d82619f02f144be694e0daf04b1372525f4d623a4f7dd";
        await orderbook.openBuyOrder("0x8c3600cecec60ad3d6fef0eaccdff07afc23ae1403852124a774142bb8d61df80489708bd0988a3c7d0b0ddc4c7b2b0ded7afc0f0baca83bfe41b86531f048f801", buyID_3, { from: broker });

        await renExSettlement.submitOrder(
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x000000000000000000000000000000000000000000000000000000005b2a43a2",
            "0x0000000000000000000000000000000000000000000000000000000100010001",
            "0x00000000000000000000000000000000000000000000000000000000000000e6",
            "0x0000000000000000000000000000000000000000000000000000000000000023",
            "0x0000000000000000000000000000000000000000000000000000000000000005",
            "0x000000000000000000000000000000000000000000000000000000000000000f",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x8d981922c65b85a257f457ba3c29831aa4c3b1bd45dc3b280590fd5c89c69dc2",
        );

        await renExSettlement.submitOrder(
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000000000000000000000000000000000005b2ae1b5",
            "0x0000000000000000000000000000000000000000000000000000000100010001",
            "0x00000000000000000000000000000000000000000000000000000000000000eb",
            "0x0000000000000000000000000000000000000000000000000000000000000023",
            "0x000000000000000000000000000000000000000000000000000000000000000a",
            "0x000000000000000000000000000000000000000000000000000000000000000b",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x242efbba437ce0c8b22392130c3f688ca01492792a3a04899d66dce0ffa31b72",
        );

        await renExSettlement.submitOrder(
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x000000000000000000000000000000000000000000000000000000005b298e47",
            "0x0000000000000000000000000000000000000000000000000000000100000100",
            "0x0000000000000000000000000000000000000000000000000000000000000640",
            "0x0000000000000000000000000000000000000000000000000000000000000024",
            "0x0000000000000000000000000000000000000000000000000000000000000007",
            "0x000000000000000000000000000000000000000000000000000000000000000d",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0xccd3dd4361d50a9df13af30388e2574b5e9e875c638bdfd15efb47395686ac3d",
        );

        await renExSettlement.submitOrder(
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000000000000000000000000000000000005b2a2706",
            "0x0000000000000000000000000000000000000000000000000000000100000100",
            "0x0000000000000000000000000000000000000000000000000000000000000653",
            "0x0000000000000000000000000000000000000000000000000000000000000024",
            "0x0000000000000000000000000000000000000000000000000000000000000019",
            "0x000000000000000000000000000000000000000000000000000000000000000b",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x799f3c0f186049d0e59e51bd145d23b30a6a7657ef591ce345ab6f89ef9cbad7",
        )

    });

    it("submitOrder", async () => {
        // Can't submit order twice:
        await renExSettlement.submitOrder(
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000000000000000000000000000000000005b2ae1b5",
            "0x0000000000000000000000000000000000000000000000000000000100010001",
            "0x00000000000000000000000000000000000000000000000000000000000000eb",
            "0x0000000000000000000000000000000000000000000000000000000000000023",
            "0x000000000000000000000000000000000000000000000000000000000000000a",
            "0x000000000000000000000000000000000000000000000000000000000000000b",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x242efbba437ce0c8b22392130c3f688ca01492792a3a04899d66dce0ffa31b72",
        ).should.be.rejected;

        // Can't submit order that's not in orderbook (different timestamp):
        await renExSettlement.submitOrder(
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000000000000000000000000000000000005b2ae1b6",
            "0x0000000000000000000000000000000000000000000000000000000100010001",
            "0x00000000000000000000000000000000000000000000000000000000000000eb",
            "0x0000000000000000000000000000000000000000000000000000000000000023",
            "0x000000000000000000000000000000000000000000000000000000000000000a",
            "0x000000000000000000000000000000000000000000000000000000000000000b",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x242efbba437ce0c8b22392130c3f688ca01492792a3a04899d66dce0ffa31b72",
        ).should.be.rejected;

        // Can't submit order that's not confirmed
        await renExSettlement.submitOrder(
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000000000000000000000000000000000005b29a423",
            "0x0000000000000000000000000000000000000000000000000000000100010000",
            "0x0000000000000000000000000000000000000000000000000000000000000140",
            "0x0000000000000000000000000000000000000000000000000000000000000022",
            "0x0000000000000000000000000000000000000000000000000000000000000005",
            "0x000000000000000000000000000000000000000000000000000000000000000c",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0a9e48cc69067083dabadb12d0ffeda12e1e9a014f9b3ad0277157f5d0b9d7e2",
        ).should.be.rejected;
    });

    it("verifyMatch", async () => {
        // Can verify valid match
        await renExSettlement.verifyMatch(
            buyID_2,
            sellID_2,
        );

        // Invalid buy ID
        await renExSettlement.verifyMatch(
            buyID_1.replace("a", "b"),
            sellID_1,
        ).should.be.rejected;

        // Invalid sell ID
        await renExSettlement.verifyMatch(
            buyID_1,
            sellID_1.replace("a", "b"),
        ).should.be.rejected;

        // Two buys
        await renExSettlement.verifyMatch(
            buyID_1,
            buyID_1,
        ).should.be.rejected;

        // Two sells
        await renExSettlement.verifyMatch(
            sellID_1,
            sellID_1,
        ).should.be.rejected;

        // Orders that aren't matched to one another
        await renExSettlement.verifyMatch(
            buyID_2,
            sellID_1,
        ).should.be.rejected;

        // Buy token that is not registered
        await renExSettlement.verifyMatch(
            buyID_1,
            sellID_1,
        ).should.be.rejected;

        await renExTokens.deregisterToken(ETH);
        await renExSettlement.verifyMatch(
            buyID_2,
            sellID_2,
        ).should.be.rejected;
        await renExTokens.registerToken(ETH, tokenAddresses[ETH].address, 18);
    });
});












const BTC = 0x0;
const ETH = 0x1;
const DGX = 0x100;
const REN = 0x10000;
const OrderParity = {
    BUY: 0,
    SELL: 1,
};
let prefix = web3.toHex("Republic Protocol: open: ");
const symbols = {
    [BTC]: "BTC",
    [ETH]: "ETH",
    [DGX]: "DGX",
    [REN]: "REN",
}

const market = (low, high) => {
    return new BN(low).mul(new BN(2).pow(new BN(32))).add(new BN(high));
}





function parseOutput(scraped) {
    return {
        // orderID: '0x' + getLine(scraped, 0).toArrayLike(Buffer, "be", 32).toString('hex'),
        parity: getLine(scraped, 1).toNumber(),
        expiry: getLine(scraped, 2).toNumber(),
        tokens: getLine(scraped, 3),
        priceC: getLine(scraped, 4).toNumber(),
        priceQ: getLine(scraped, 5).toNumber(),
        volumeC: getLine(scraped, 6).toNumber(),
        volumeQ: getLine(scraped, 7).toNumber(),
        minimumVolumeC: getLine(scraped, 8).toNumber(),
        minimumVolumeQ: getLine(scraped, 9).toNumber(),
        nonceHash: '0x' + getLine(scraped, 10).toArrayLike(Buffer, "be", 32).toString('hex'),
    }
}
function getLine(scraped, lineno) {
    const re = new RegExp("\\n\\[" + lineno + "\\]:\\s*([0-9a-f]*)");
    return new BN(scraped.match(re)[1], 16);
}




async function submitMatch(buy, sell, buyer, seller, darknode, renExSettlement, renExBalances, tokenAddresses, orderbook) {

    (sell.parity === undefined || sell.parity !== buy.parity).should.be.true;
    if (buy.parity === 1) {
        sell, buy = buy, sell;
    }

    for (const order of [buy, sell]) {
        if (order.price !== undefined) {
            price = priceToTuple(order.price);
            order.priceC = price.c, order.priceQ = price.q;
        } else {
            order.price = tupleToPrice({ c: order.priceC, q: order.priceQ });
        }
        if (order.volume !== undefined) {
            volume = volumeToTuple(order.volume);
            order.volumeC = volume.c, order.volumeQ = volume.q;
        } else {
            order.volume = tupleToVolume({ c: order.volumeC, q: order.volumeQ }).toNumber();
        }

        if (order.minimumVolumeC === undefined || order.minimumVolumeQ === undefined) {
            if (order.minimumVolume !== undefined) {
                minimumVolume = volumeToTuple(order.minimumVolume);
                order.minimumVolumeC = minimumVolume.c, order.minimumVolumeQ = minimumVolume.q;
            } else {
                minimumVolume = volumeToTuple(order.volume);
                order.minimumVolumeC = minimumVolume.c, order.minimumVolumeQ = minimumVolume.q;
            }
        }

        if (order.nonceHash === undefined) {
            if (order.nonce === undefined) {
                order.nonce = randomNonce();
            }
            order.nonceHash = web3.sha3(order.nonce, { encoding: 'hex' });
        }
    }

    new BN(buy.tokens).eq(new BN(sell.tokens)).should.be.true;
    const tokens = new BN(buy.tokens);

    const lowToken = new BN(tokens.toArrayLike(Buffer, "be", 8).slice(0, 4)).toNumber();
    const highToken = new BN(tokens.toArrayLike(Buffer, "be", 8).slice(4, 8)).toNumber();

    const lowTokenInstance = tokenAddresses[lowToken];
    const highTokenInstance = tokenAddresses[highToken];

    buy.expiry = buy.expiry || 1641026487;
    buy.type = 1;
    buy.parity = OrderParity.BUY;
    buy.tokens = `0x${tokens.toString('hex')}`;
    if (buy.orderID !== undefined) {
        buy.orderID.should.equal(getOrderID(buy));
    } else {
        buy.orderID = getOrderID(buy);
    }
    let buyHash = await web3.sha3(prefix + buy.orderID.slice(2), { encoding: 'hex' });
    buy.signature = await web3.eth.sign(buyer, buyHash);


    sell.type = 1; // type
    sell.parity = OrderParity.SELL; // parity
    sell.expiry = sell.expiry || 1641026487; // FIXME: expiry
    sell.tokens = `0x${tokens.toString('hex')}`; // tokens
    if (sell.orderID !== undefined) {
        sell.orderID.should.equal(getOrderID(sell));
    } else {
        sell.orderID = getOrderID(sell);
    }
    let sellHash = await web3.sha3(prefix + sell.orderID.slice(2), { encoding: 'hex' });
    const sellSignature = await web3.eth.sign(seller, sellHash);

    const highDecimals = (await highTokenInstance.decimals()).toNumber();
    const lowDecimals = (await lowTokenInstance.decimals()).toNumber();

    // Approve and deposit
    const highDeposit = sell.volume * (10 ** highDecimals);
    const lowDeposit = buy.volume * (10 ** lowDecimals);

    if (lowToken !== ETH) {
        await lowTokenInstance.transfer(buyer, lowDeposit);
        await lowTokenInstance.approve(renExBalances.address, lowDeposit, { from: buyer });
        await renExBalances.deposit(lowTokenInstance.address, lowDeposit, { from: buyer });
    } else {
        await renExBalances.deposit(lowTokenInstance.address, lowDeposit, { from: buyer, value: lowDeposit });
    }

    if (highToken !== ETH) {
        await highTokenInstance.transfer(seller, highDeposit);
        await highTokenInstance.approve(renExBalances.address, highDeposit, { from: seller });
        await renExBalances.deposit(highTokenInstance.address, highDeposit, { from: seller });
    } else {
        await renExBalances.deposit(highTokenInstance.address, highDeposit, { from: seller, value: highDeposit });
    }


    await orderbook.openBuyOrder(buy.signature, buy.orderID, { from: buyer });

    await orderbook.openSellOrder(sellSignature, sell.orderID, { from: seller });

    (await orderbook.orderTrader(buy.orderID)).should.equal(buyer);
    (await orderbook.orderTrader(sell.orderID)).should.equal(seller);

    await orderbook.confirmOrder(buy.orderID, [sell.orderID], { from: darknode });

    await renExSettlement.submitOrder(buy.type, buy.parity, buy.expiry, buy.tokens, buy.priceC, buy.priceQ, buy.volumeC, buy.volumeQ, buy.minimumVolumeC, buy.minimumVolumeQ, buy.nonceHash);
    await renExSettlement.submitOrder(sell.type, sell.parity, sell.expiry, sell.tokens, sell.priceC, sell.priceQ, sell.volumeC, sell.volumeQ, sell.minimumVolumeC, sell.minimumVolumeQ, sell.nonceHash);

    const buyerLowBefore = await renExBalances.traderBalances(buyer, lowTokenInstance.address);
    const buyerHighBefore = await renExBalances.traderBalances(buyer, highTokenInstance.address);
    const sellerLowBefore = await renExBalances.traderBalances(seller, lowTokenInstance.address);
    const sellerHighBefore = await renExBalances.traderBalances(seller, highTokenInstance.address);

    await renExSettlement.submitMatch(buy.orderID, sell.orderID);

    // const matchID = web3.sha3(buy.orderID + sell.orderID.slice(2), { encoding: 'hex' });
    const match = await renExSettlement.getSettlementDetails(buy.orderID, sell.orderID);
    const priceMatched = match[0];
    const lowMatched = new BigNumber(match[1]);
    const highMatched = new BigNumber(match[2]);
    const lowFee = new BigNumber(match[3]);
    const highFee = new BigNumber(match[4]);

    const buyerLowAfter = await renExBalances.traderBalances(buyer, lowTokenInstance.address);
    const buyerHighAfter = await renExBalances.traderBalances(buyer, highTokenInstance.address);
    const sellerLowAfter = await renExBalances.traderBalances(seller, lowTokenInstance.address);
    const sellerHighAfter = await renExBalances.traderBalances(seller, highTokenInstance.address);

    const lowSum = lowMatched.plus(lowFee);
    const highSum = highMatched.plus(highFee);

    buyerLowBefore.sub(lowSum).toFixed().should.equal(buyerLowAfter.toFixed());
    buyerHighBefore.add(highMatched).toFixed().should.equal(buyerHighAfter.toFixed());
    sellerLowBefore.add(lowMatched).toFixed().should.equal(sellerLowAfter.toFixed());
    sellerHighBefore.sub(highSum).toFixed().should.equal(sellerHighAfter.toFixed());

    const expectedLowFees = lowSum
        .multipliedBy(2)
        .dividedBy(1000)
        .integerValue(BigNumber.ROUND_CEIL);
    const expectedHighFees = highSum
        .multipliedBy(2)
        .dividedBy(1000)
        .integerValue(BigNumber.ROUND_CEIL);

    lowFee.toFixed().should.equal(expectedLowFees.toFixed());
    highFee.toFixed().should.equal(expectedHighFees.toFixed());

    return [
        priceMatched.toNumber() / 10 ** lowDecimals,
        lowSum.toNumber() / 10 ** lowDecimals,
        highSum.toNumber() / 10 ** highDecimals,
    ];
}

async function setup(darknode, broker) {
    const tokenAddresses = {
        [BTC]: await BitcoinMock.new(),
        [ETH]: { address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", decimals: () => new BigNumber(18), approve: () => null },
        [DGX]: await DGXMock.new(),
        [REN]: await RepublicToken.new(),
    };

    const dnr = await DarknodeRegistry.new(
        tokenAddresses[REN].address,
        0,
        1,
        0
    );
    const orderbook = await Orderbook.new(0, tokenAddresses[REN].address, dnr.address);
    const rewardVault = await RewardVault.new(dnr.address);
    const renExBalances = await RenExBalances.new(rewardVault.address);
    const renExTokens = await RenExTokens.new();
    const renExSettlement = await RenExSettlement.new(orderbook.address, renExTokens.address, renExBalances.address);
    await renExBalances.setRenExSettlementContract(renExSettlement.address);

    await renExTokens.registerToken(ETH, tokenAddresses[ETH].address, 18);
    await renExTokens.registerToken(BTC, tokenAddresses[BTC].address, (await tokenAddresses[BTC].decimals()).toNumber());
    await renExTokens.registerToken(DGX, tokenAddresses[DGX].address, (await tokenAddresses[DGX].decimals()).toNumber());
    await renExTokens.registerToken(REN, tokenAddresses[REN].address, (await tokenAddresses[REN].decimals()).toNumber());

    // Register darknode
    await dnr.register(darknode, "", 0, { from: darknode });
    await dnr.epoch();

    await tokenAddresses[REN].approve(orderbook.address, 100 * 1e18, { from: broker });

    return [tokenAddresses, orderbook, renExSettlement, renExBalances, renExTokens];
}


const PRIME = new BN('17012364981921935471');
function randomNonce() {
    let nonce = PRIME;
    while (nonce.gte(PRIME)) {
        nonce = new BN(Math.floor(Math.random() * 10000000));
    }
    return nonce.toString('hex');
}



function getOrderID(order) {
    const bytes = Buffer.concat([
        new BN(order.type).toArrayLike(Buffer, "be", 1),
        new BN(order.parity).toArrayLike(Buffer, "be", 1),
        new BN(1).toArrayLike(Buffer, "be", 4), // RENEX
        new BN(order.expiry).toArrayLike(Buffer, "be", 8),
        new BN(order.tokens.slice(2), 'hex').toArrayLike(Buffer, "be", 8),
        new BN(order.priceC).toArrayLike(Buffer, "be", 8),
        new BN(order.priceQ).toArrayLike(Buffer, "be", 8),
        new BN(order.volumeC).toArrayLike(Buffer, "be", 8),
        new BN(order.volumeQ).toArrayLike(Buffer, "be", 8),
        new BN(order.minimumVolumeC).toArrayLike(Buffer, "be", 8),
        new BN(order.minimumVolumeQ).toArrayLike(Buffer, "be", 8),
        new Buffer(order.nonceHash.slice(2), 'hex'),
    ]);
    return web3.sha3('0x' + bytes.toString('hex'), { encoding: 'hex' });
}






/**
 * Calculate price tuple from a decimal string
 * 
 * https://github.com/republicprotocol/republic-go/blob/smpc/docs/orders-and-order-fragments.md
 * 
 */
function priceToTuple(priceI) {
    const price = new BigNumber(priceI);
    const shift = 10 ** 12;
    const exponentOffset = 26;
    const step = 0.005;
    const tuple = floatToTuple(shift, exponentOffset, step, price, 1999);
    console.assert(0 <= tuple.c && tuple.c <= 1999, `Expected c (${tuple.c}) to be in [1,1999] in priceToTuple(${price})`);
    console.assert(0 <= tuple.q && tuple.q <= 52, `Expected c (${tuple.c}) to be in [0,52] in priceToTuple(${price})`);
    return tuple;
}

const getPriceStep = (price) => {
    return getStep(price, 0.005);
}

const tupleToPrice = (t) => {
    const e = new BigNumber(10).pow(t.q - 26 - 12 - 3);
    return new BigNumber(t.c).times(5).times(e);
}

const normalizePrice = (p) => {
    return tupleToPrice(priceToTuple(p));
}


function volumeToTuple(volumeI) {
    const volume = new BigNumber(volumeI);
    const shift = 10 ** 12;
    const exponentOffset = 0;
    const step = 0.2;
    const tuple = floatToTuple(shift, exponentOffset, step, volume, 49);
    console.assert(0 <= tuple.c && tuple.c <= 49, `Expected c (${tuple.c}) to be in [1,49] in volumeToTuple(${volume})`);
    console.assert(0 <= tuple.q && tuple.q <= 52, `Expected c (${tuple.c}) to be in [0,52] in volumeToTuple(${volume})`);
    return tuple;
}


const getVolumeStep = (volume) => {
    return getStep(volume, 0.2);
}

const tupleToVolume = (t) => {
    const e = new BigNumber(10).pow(t.q - 12);
    return new BigNumber(t.c).times(0.2).times(e);
}

const normalizeVolume = (v) => {
    return tupleToVolume(volumeToTuple(v));
}


function floatToTuple(shift, exponentOffset, step, value, max) {
    const shifted = value.times(shift);

    const digits = -Math.floor(Math.log10(step)) + 1;
    const stepInt = step * 10 ** (digits - 1);

    // CALCULATE tuple
    let [c, exp] = significantDigits(shifted.toNumber(), digits, false);
    c = (c - (c % stepInt)) / step;

    // Simplify again if possible - e.g. [1910,32] becomes [191,33]
    let expAdd;
    [c, expAdd] = significantDigits(c, digits, false);
    exp += expAdd;

    // TODO: Fixme
    while (c > max) {
        c /= 10;
        exp++;
    }

    const q = exponentOffset + exp;

    return { c, q };
}


function significantDigits(n, digits, simplify = false) {
    if (n === 0) {
        return [0, 0];
    }
    let exp = Math.floor(Math.log10(n)) - (digits - 1);
    let c = Math.floor((n) / (10 ** exp));

    if (simplify) {
        while (c % 10 === 0 && c !== 0) {
            c = c / 10;
            exp++;
        }
    }

    return [c, exp];
}

