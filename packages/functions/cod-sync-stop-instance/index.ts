// tslint:disable-next-line
const Compute = require("@google-cloud/compute");
import {
  CodSyncScheduleInstanceStartPayload,
  PubSubContext,
} from "@chemistry/common-functions";

const compute = new Compute();
/**
 * Will Start COD Synronization Instances (labels.codsync eq true)
 */
export async function codSyncStopInstance(
    data: CodSyncScheduleInstanceStartPayload,
    context: PubSubContext,
) {
    const [vms] = await compute.getVMs({ filter: "labels.codsync eq true" });
    await Promise.all(
      vms.map(async (instance: any) => {
          const [operation] = await compute
              .zone(instance.zone.id)
              .vm(instance.name)
              .stop();
          return operation.promise();
        }),
      );
    return Promise.resolve(`Successfully started instance(s)`);
}
