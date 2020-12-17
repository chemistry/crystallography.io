export enum ScheduleTopics {
    SCHEDULE_INDEX = 'SCHEDULE_INDEX'
}

export interface AppContext {
  log: (message: string) => void;
  sendToQueue: (topic: ScheduleTopics, data: object) => void;
  version: string;
}
