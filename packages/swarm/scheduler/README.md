# @chemistry/scheduler

Scheduler - schedule regular work, by sending messages to event queue

## Commands

Build Container
```bash
cd ../../../ && docker build -t gcr.io/crystallography-api/containers-scheduler -f packages/swarm/scheduler/Dockerfile .
```

Execute container
```bash
docker run --rm -e MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD -e MONGO_INITDB_HOST=$MONGO_INITDB_HOST --name scheduler gcr.io/crystallography-api/containers-scheduler
```

Build and Run container (from root directory)
```bash
docker build -t gcr.io/crystallography-api/containers-scheduler -f packages/swarm/scheduler/Dockerfile . && docker run --rm -e MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD -e MONGO_INITDB_HOST=$MONGO_INITDB_HOST  --name scheduler gcr.io/crystallography-api/containers-scheduler```

Push container
```bash
# gcloud auth configure-docker
docker push gcr.io/crystallography-api/containers-cod-to-gcs-sync
```

## Commands:
  * Build project: `npm run build`
