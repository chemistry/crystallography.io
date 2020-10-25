// tslint:disable-next-line
const Compute = require("@google-cloud/compute");
import {
  CodSyncScheduleInstanceStartPayload,
  PubSubContext,
} from "@chemistry/common-functions";

const compute = new Compute();

/**
 * Will Delete Cod Synronization Instances
 */
export async function codSyncStopInstance(
    data: CodSyncScheduleInstanceStartPayload,
    context: PubSubContext,
) {
    const zone = compute.zone('europe-west1-b');
    const vm = zone.vm('cod-sync');
    const [operation] = await vm.delete();
    await operation.promise();

    return Promise.resolve(`Successfully removed instance(s)`);
}
