const MINE_RATE = 1000;
const INITITAL_DIFFICULTY =  3;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '------',
    hash: 'hash-one',
    difficulty : INITITAL_DIFFICULTY,
    nonce: 0,
    data: []
};

module.exports = { GENESIS_DATA, MINE_RATE };