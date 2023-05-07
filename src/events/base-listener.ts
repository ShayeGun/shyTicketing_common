import { connect, Channel, Connection, Replies } from 'amqplib';
import { Keys, Exchanges, Queues } from './base-utils';

interface IListen {
    key: Keys;
    queue: Queues;
    exchange: Exchanges;
}

abstract class BaseListener<T extends IListen>{

    declare private connection: Connection;
    declare private channel: Channel;
    // declare private key: T["key"];

    async startup(uri: string = "amqp://localhost") {
        this.connection = await connect(uri);
        this.channel = await this.connection.createChannel();

        return this

    }

    async createExchange(exchange: T["exchange"] = Exchanges.Default, type: string = "fanout", opt?: {}) {
        await this.channel!.assertExchange(exchange, type, opt);
    }

    async createQueue(queueName: T["queue"] = Queues.Default, opt?: {}) {
        const queue = await this.channel!.assertQueue(queueName, opt);
        this.channel!.prefetch(1);

        return queue
    }

    async listen(key: T["key"] = Keys.Default, exchange: T['exchange'] = Exchanges.Default, queue: Replies.AssertQueue) {
        await this.channel!.bindQueue(queue.queue, exchange, key);

        this.channel!.consume(queue.queue, async (msg) => {
            console.log(` [x] ${msg!.fields.routingKey}:'${msg!.content.toString()}'`);

            this.channel!.ack(msg!);
        }, {
            noAck: false
        });
    }
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