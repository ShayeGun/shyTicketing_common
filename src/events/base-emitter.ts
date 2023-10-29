import { connect, Channel, Connection, Options } from 'amqplib';
import { Keys, Exchanges, Queues, ExchangeTypes } from './base-utils';

interface IEmmit {
    key: Keys;
    queue: Queues;
    exchange: Exchanges;
    msg: any;
}

abstract class BaseEmitter<T extends IEmmit>{

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
    }

    async createExchange(exchange: T["exchange"] = Exchanges.Default, type: ExchangeTypes = ExchangeTypes.FANOUT, opt?: Options.AssertExchange) {
        await this.checkConnection();
        await this.channel!.assertExchange(exchange, type, opt);
    }

    async close() {
        const conn = this.connection;

        setTimeout(function () {
            conn.close();
            process.exit(0);
        }, 500);
    }

    abstract publish(): Promise<void>;
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