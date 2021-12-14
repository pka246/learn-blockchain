const {
    createClient
} = require('redis');

const CHANNELS = {
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({
        blockchain
    }) {
        this.blockchain = blockchain;
        this.publisher = createClient();
        this.subscriber = createClient();
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    async subscribeToChannels() {

        await this.publisher.connect();
        await this.subscriber.connect();

        Object.values(CHANNELS).forEach(channel => {

            this.subscriber.pSubscribe(
                channel,
                (message) => this.handleMessage(channel, message)
            );

        });
    }

    publish({
        channel,
        message
    }) {
        this.subscriber.unsubscribe(channel).then(() => {
            this.publisher.publish(channel, message, () => {

                this.subscriber.pSubscribe(
                    channel,
                    (message) => this.handleMessage(channel, message)
                );

            });
        });

    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;

// const testPubSub = new PubSub();

// testPubSub.connect().then(
//     () => setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo'), 1000)
// );