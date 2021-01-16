
export const getChanel = async (QUEUE_NAME: string) => {
    const connection = await require('amqplib').connect('amqp://rabbitmq');
    const chanel = await connection.createChannel();
    await chanel.assertQueue(QUEUE_NAME);
    await chanel.prefetch(1);

    process.on('SIGTERM', () => {
        chanel.close();
    });

    return chanel;
}
