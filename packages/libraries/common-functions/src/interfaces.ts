/* tslint:disable:no-empty-interface */
export enum CTopicName {
  CodSyncScheduleInstanceStart = "cod-sync-schedule-instance-start",
  CodSyncScheduleInstanceStop = "cod-sync-schedule-instance-stop",
}

export interface CodSyncScheduleInstanceStartPayload {
}

export interface CodSyncScheduleInstanceStopPayload {
}

export interface PubSubEvent {
}

export interface PubSubContext {
}

export type CTopicPayload = CodSyncScheduleInstanceStartPayload
  | CodSyncScheduleInstanceStopPayload;
