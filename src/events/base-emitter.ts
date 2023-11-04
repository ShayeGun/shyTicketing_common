import { connect, Channel, Connection, Options } from 'amqplib';
import { Keys, Exchanges, Queues, ExchangeTypes } from './base-utils';

interface IEmmit {
    key: Keys;
    queue: Queues;
    exchange: Exchanges;
    msg: any;
}

abstract class BaseEmitter<T extends IEmmit>{

    static connection: Connection;

    declare protected channel: Channel;
    protected abstract key: T["key"];



    static async connect(uri: string = "amqp://localhost"): Promise<void> {
        BaseEmitter.connection = await connect(uri);
    }
    static async close() {
        await BaseEmitter.connection.close();
    }

    constructor(private uri: string = "amqp://localhost") { }

    async checkConnection(): Promise<void> {
        if (!BaseEmitter.connection) await BaseEmitter.connect(this.uri);
        console.log("connection created !");

        if (!this.channel) await BaseEmitter.connection.createChannel();
        console.log("channel created !");

        return;
    }

    async connectChannel() {
        this.channel = await BaseEmitter.connection.createChannel();

        return this;
    }

    async createExchange(exchange: T["exchange"] = Exchanges.Default, type: ExchangeTypes = ExchangeTypes.FANOUT, opt?: Options.AssertExchange) {
        await this.checkConnection();
        await this.channel!.assertExchange(exchange, type, opt);
    }

    async closeChannel() {
        await this.channel.close();
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