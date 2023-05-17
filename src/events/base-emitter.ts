import { connect, Channel, Connection } from 'amqplib';
import { Keys, Exchanges, Queues } from './base-utils';

interface IEmmit {
    key: Keys;
    queue: Queues;
    exchange: Exchanges;
    msg: any;
}

abstract class BaseEmitter<T extends IEmmit>{

    declare private connection: Connection;
    declare private channel: Channel;

    async checkConnection() {
        if (!this.channel || !this.connection) {
            console.log("making connection ...");
            await this.connect()
        }

        return
    }

    async connect(uri: string = "amqp://localhost") {
        this.connection = await connect(uri);
        this.channel = await this.connection.createChannel();
    }

    async createExchange(exchange: T["exchange"] = Exchanges.Default, type: string = "fanout", opt?: {}) {
        await this.checkConnection();
        await this.channel!.assertExchange(exchange, type, opt);
    }

    async publish(msg: T["msg"] = 'hello world!', key: T["key"] = Keys.Default, exchange: T['exchange'] = Exchanges.Default) {
        this.channel.publish(exchange, key, Buffer.from(JSON.stringify(msg)));
        console.log(` [x] Sent ${key}: '${msg}'`);
    }

    async close() {
        const conn = this.connection;

        setTimeout(function () {
            conn.close();
            process.exit(0);
        }, 500);
    }
}

// (async () => {
//     try {
//         const server = new Emitter();
//         await server.startup();
//         await server.createExchange();
//         server.publish('i am a banana');

//         server.close();
//     } catch (err) {
//         console.log(err);
//     }
// })()

export { BaseEmitter };