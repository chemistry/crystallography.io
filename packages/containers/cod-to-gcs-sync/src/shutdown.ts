import { AppContext } from "./app";

const TOPIC_NAME  = "cod-sync-schedule-instance-stop";

export async function sendShutDown({ pubsub, log }: AppContext) {
  const messageId = await pubsub
    .topic(TOPIC_NAME)
    .publish(Buffer.from("{}"));

  // tslint:disable-next-line
  log(`Message ${messageId} published.`);
}
