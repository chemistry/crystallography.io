import amqplib from "amqplib";

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "rabbitmq";
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || "5672";

export const getChanel = async (QUEUE_NAME: string) => {
    const connection = await amqplib.connect(`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`);
    const chanel = await connection.createChannel();
    await chanel.assertQueue(QUEUE_NAME);
    await chanel.prefetch(1);

    process.on('SIGTERM', () => {
        chanel.close();
    });

    return chanel;
};
