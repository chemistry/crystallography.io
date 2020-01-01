// Imports the Google Cloud client library
import { PubSub } from "@google-cloud/pubsub";

// Creates a client
const pubsub = new PubSub();

// tslint:disable-next-line
console.time("Syncronization Application");

const TOPIC_NAME  = "cod-sync-schedule-instance-stop";
((async () => {

  const messageId = await pubsub
    .topic(TOPIC_NAME)
    .publish(Buffer.from("{}"));

  // tslint:disable-next-line
  console.log(`Message ${messageId} published.`);
})()).then(() => {
  // tslint:disable-next-line
  console.timeEnd("Syncronization Application");
});
