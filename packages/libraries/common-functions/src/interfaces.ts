// tslint:disable-next-line
export interface CodSyncScheduleInstanceStartPayload {
}

// tslint:disable-next-line
export interface CodSyncScheduleInstanceStopPayload {
}

export interface BucketEventData {
    "bucket": string; // "cod-data",
    "contentLanguage": string; // "en",
    "contentType": string; // "application/octet-stream",
    "crc32c": string; // "poqT+w==","etag":"CP7bzKbL7eYCEAE=",
    "generation": string; // "1578266076065278",
    "id": string; // "cod-data/hkl/1/10/09/1100908.hkl/1578266076065278",
    "kind": string; // "storage#object",
    "md5Hash": string; // "gu28LXOp1iCj7wHzckpHDQ==",
    "mediaLink": string; // "https://www.googleapis.com/download/storage/v1/b/cod-data/o/hkl%2F1%2F10%2F09%2F1100908.hkl?generation=1578266076065278&alt=media",
    "metadata": {
      "goog-reserved-file-mtime": string; // "1453990595"
    };
    "metageneration": string; // "1",
    "name": string; // "hkl/1/10/11908.hkl",
    "selfLink": string; // "https://www.googleapis.com/storage/v1/b/cod-data/o/hkl%2F1%2F10%2F09%2F1100908.hkl",
    "size": string; // "52568",
    "storageClass": string; // "STANDARD",
    "timeCreated": string; // "2020-01-05T23:14:36.065Z",
    "timeStorageClassUpdated": string; // "2020-01-05T23:14:36.065Z",
    "updated": string; // "2020-01-05T23:14:36.065Z"
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
