/* tslint:disable:no-empty-interface */
export enum CTopicName {
  CodSyncScheduleInstanceStart = "cod-sync-schedule-instance-start",
  CodSyncScheduleInstanceStop = "cod-sync-schedule-instance-stop",
}

export interface CodSyncScheduleInstanceStartPayload {
}

export interface CodSyncScheduleInstanceStopPayload {
}

export interface PubSubContext {
  eventId: string;
  resource: {
    service: string; // "pubsub.googleapis.com",
    name: string; // "projects/crystallography-api/topics/cod-sync-schedule-instance-start"
  };
  eventType: string; // "google.pubsub.topic.publish"
  timestamp: string; // "2019-12-30T18:44:37.186Z"
}

export type TopicPayload = CodSyncScheduleInstanceStartPayload
  | CodSyncScheduleInstanceStopPayload;
