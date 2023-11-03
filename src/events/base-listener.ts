import { connect, Channel, Connection, Options } from 'amqplib';
import { Keys, Exchanges, Queues, ExchangeTypes } from './base-utils';

interface IListen {
    key: Keys;
    queue: Queues;
    exchange: Exchanges;
}

abstract class BaseListener<T extends IListen>{

    declare protected connection: Connection;
    declare protected channel: Channel;
    protected abstract key: T["key"];

    async checkConnection() {
        if (!this.channel || !this.connection) {
            console.log("making connection ...");
            await this.connect();
        }

        return;
    }

    async connect(uri: string = "amqp://localhost") {
        this.connection = await connect(uri);
        this.channel = await this.connection.createChannel();

        return this;

    }

    async createExchange(exchange: T["exchange"] = Exchanges.Default, type: ExchangeTypes = ExchangeTypes.FANOUT, opt?: Options.AssertExchange) {
        await this.checkConnection();
        await this.channel!.assertExchange(exchange, type, opt);
    }

    async createQueue(queueName: T["queue"] = Queues.Default, opt?: Options.AssertQueue) {
        await this.checkConnection();
        this.channel!.prefetch(1);
        const queue = await this.channel!.assertQueue(queueName, opt);

        return queue;
    }

    async close() {
        const conn = this.connection;

        setTimeout(function () {
            conn.close();
            process.exit(0);
        }, 0);
    }

    abstract listen(): Promise<void>;
}

// (async () => {
//     try {
//         const listener = new Listener();
//         await listener.startup();
//         await listener.createExchange();
//         const q = await listener.createQueue(Queues.Ticket, { exclusive: true });

//         await listener.listen(Keys.Default, Exchanges.Default, q);

//     } catch (err) {
//         console.log(err);
//     }
// })()

export { BaseListener };