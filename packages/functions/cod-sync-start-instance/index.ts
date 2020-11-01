// tslint:disable-next-line
const Compute = require("@google-cloud/compute");
import {
  CodSyncScheduleInstanceStartPayload,
  PubSubContext,
} from "@chemistry/common-functions";

const compute = new Compute();

const GCP_SA_KEY = process.env.GCP_SA_KEY || '';
const GCP_BOTO_KEY = process.env.GCP_BOTO_KEY || '';

const config: any = {
    "kind": "compute#instance",
    "name": "cod-sync",
    "zone": "projects/crystallography-api/zones/europe-west1-b",
    "machineType": "projects/crystallography-api/zones/europe-west1-b/machineTypes/e2-small",
    "metadata": {
        "kind": "compute#metadata",
        "items": [{
                "key": "gce-container-declaration",
                "value": "spec:\n  containers:\n    - name: cod-sync-1\n      image: gcr.io/crystallography-api/containers-cod-to-gcs-sync\n      volumeMounts:\n        - name: pd-0\n          mountPath: /home/cod\n          readOnly: false\n      securityContext:\n        privileged: true\n      env:\n        - name: GCP_SA_KEY\n          value: >-\n            " + GCP_SA_KEY + "\n        - name: GCP_BOTO_KEY\n          value: >-\n            " + GCP_BOTO_KEY + "\n      stdin: false\n      tty: false\n  restartPolicy: Never\n  volumes:\n    - name: pd-0\n      gcePersistentDisk:\n        pdName: cod-disk\n        fsType: ext4\n        readOnly: false\n        partition: 0\n\n# This container declaration format is not public API and may change without notice. Please\n# use gcloud command-line tool or Google Cloud Console to run Containers on Google Compute Engine."
            },
            {
            "key": "google-logging-enabled",
            "value": "true"
        }]
    },
    "disks": [{
        "kind": "compute#attachedDisk",
        "type": "PERSISTENT",
        "autoDelete": true,
        "boot": true,
        "mode": "READ_WRITE",
        "deviceName": "cod-sync-1",
        "initializeParams": {
            "sourceImage": "projects/cos-cloud/global/images/cos-stable-79-12607-80-0",
            "diskType": "projects/crystallography-api/zones/europe-west1-b/diskTypes/pd-standard",
            "diskSizeGb": "10",
            "labels": {}
        }
    }, {
        "kind": "compute#attachedDisk",
        "type": "PERSISTENT",
        "autoDelete": false,
        "boot": false,
        "deviceName": "cod-disk",
        "diskSizeGb": "160",
        "index": 1,
        "interface": "SCSI",
        "mode": "READ_WRITE",
        "source": "projects/crystallography-api/zones/europe-west1-b/disks/cod-disk"
      }
    ],
    "canIpForward": false,
    "networkInterfaces": [{
        "kind": "compute#networkInterface",
        "subnetwork": "projects/crystallography-api/regions/europe-west1/subnetworks/default",
        "accessConfigs": [{
            "kind": "compute#accessConfig",
            "name": "External NAT",
            "type": "ONE_TO_ONE_NAT",
            "networkTier": "PREMIUM"
        }],
        "aliasIpRanges": []
    }],
    "labels": {
        "codsync": "true"
    },
    "serviceAccounts": [{
        "email": "759047512065-compute@developer.gserviceaccount.com",
        "scopes": [
            "https://www.googleapis.com/auth/devstorage.read_only",
            "https://www.googleapis.com/auth/logging.write",
            "https://www.googleapis.com/auth/monitoring.write",
            "https://www.googleapis.com/auth/servicecontrol",
            "https://www.googleapis.com/auth/service.management.readonly",
            "https://www.googleapis.com/auth/trace.append"
        ]
    }]
};

/**
 * Will Start COD Synronization Instances
 */
export async function codSyncStartInstance(
    data: CodSyncScheduleInstanceStartPayload,
    context: PubSubContext,
) {
    const zone = compute.zone('europe-west1-b');
    // Start the VM create task
    const [vm, operation] = await zone.createVM('cod-sync', config);
    await operation.promise();

    return Promise.resolve(`Successfully started instance(s)`);
}
